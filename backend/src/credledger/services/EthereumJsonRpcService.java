package credledger.services;

import credledger.config.AppConfig;
import credledger.models.AuditEvent;
import credledger.models.Credential;
import credledger.util.JsonUtil;
import java.io.IOException;
import java.math.BigInteger;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public final class EthereumJsonRpcService implements EthereumService {
    private static final String GET_CREDENTIAL = "8dd18d2d";
    private static final String BY_HOLDER = "c8fba298";
    private static final String BY_INSTITUTION = "e8a8e713";
    private static final String GET_ALL_REGULATORS = "395680d8";
    private static final String GET_ALL_INSTITUTIONS = "4104180e";
    private static final String GET_REGULATOR = "a9870964";
    private static final String GET_INSTITUTION = "71199236";

    // Event topic0 hashes
    private static final String TOPIC_ISSUED   = "0x3d1a51092757ebe14b766ed85ed83ef6b8eaee13cc78343bb239f21dc0d0feed";
    private static final String TOPIC_UPDATED  = "0xf1c6c731fd6f7e4d30b2b0c89e5dde9ef5937ed3b49916b17fdac538e1a4210d";
    private static final String TOPIC_REVOKED  = "0x39f3e5f98a264f2bb0648267899a35737685f4427730cb692d72df545b2bae78";

    private final AppConfig config;
    private final HttpClient client;

    public EthereumJsonRpcService(AppConfig config) {
        this.config = config;
        this.client = HttpClient.newHttpClient();
    }

    @Override public Credential getCredential(long id) throws IOException, InterruptedException {
        return decodeCredential(call(GET_CREDENTIAL + encodeUint(id)));
    }

    @Override public List<Long> getCredentialsByHolder(String wallet) throws IOException, InterruptedException {
        return decodeUintArray(call(BY_HOLDER + encodeAddress(wallet)));
    }

    @Override public List<Long> getCredentialsByInstitution(String wallet) throws IOException, InterruptedException {
        return decodeUintArray(call(BY_INSTITUTION + encodeAddress(wallet)));
    }

    @Override public List<String> getAllRegulators() throws IOException, InterruptedException {
        return decodeAddressArray(call(GET_ALL_REGULATORS));
    }

    @Override public List<String> getAllInstitutions() throws IOException, InterruptedException {
        return decodeAddressArray(call(GET_ALL_INSTITUTIONS));
    }

    @Override public Map<String, Object> getRegulatorProfile(String wallet) throws IOException, InterruptedException {
        String hex = call(GET_REGULATOR + encodeAddress(wallet));
        // Regulator struct: string name, string jurisdiction, bool active, uint256 addedAt
        // ABI returns: head[0]=offset(name), head[1]=offset(jurisdiction), head[2]=bool, head[3]=uint
        long nameOff = wordLong(hex, 0);
        long jurOff = wordLong(hex, 1);
        boolean active = wordLong(hex, 2) != 0;
        long addedAt = wordLong(hex, 3);
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("address", wallet);
        m.put("name", dynamicString(hex, nameOff));
        m.put("jurisdiction", dynamicString(hex, jurOff));
        m.put("active", active);
        m.put("addedAt", addedAt);
        return m;
    }

    @Override public Map<String, Object> getInstitutionProfile(String wallet) throws IOException, InterruptedException {
        String hex = call(GET_INSTITUTION + encodeAddress(wallet));
        // Institution: string name, string accreditationId, bool authorized, bool suspended, address regulator, uint256 authorizedAt
        long nameOff = wordLong(hex, 0);
        long accOff  = wordLong(hex, 1);
        boolean authorized = wordLong(hex, 2) != 0;
        boolean suspended  = wordLong(hex, 3) != 0;
        String regulator = wordAddress(hex, 4);
        long authorizedAt = wordLong(hex, 5);
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("address", wallet);
        m.put("name", dynamicString(hex, nameOff));
        m.put("accreditationId", dynamicString(hex, accOff));
        m.put("authorized", authorized);
        m.put("suspended", suspended);
        m.put("regulator", regulator);
        m.put("authorizedAt", authorizedAt);
        return m;
    }

    @Override public List<AuditEvent> getAuditEvents(long credentialId) throws IOException, InterruptedException {
        // First indexed topic is credentialId for Issued/Updated/Revoked
        return logsForTopic(1, padTopicUint(credentialId));
    }

    @Override public List<AuditEvent> getInstitutionActivity(String wallet) throws IOException, InterruptedException {
        // CredentialIssued(uint256 indexed id, address indexed student, address indexed institution, ...)
        //   institution = topic[3]
        // CredentialUpdated(uint256 indexed id, address indexed institution, ...)
        //   institution = topic[2]
        // CredentialRevoked(uint256 indexed id, address indexed institution, ...)
        //   institution = topic[2]
        List<AuditEvent> issued  = logsForTopicAndType(3, padTopicAddress(wallet), TOPIC_ISSUED);
        List<AuditEvent> updated = logsForTopicAndType(2, padTopicAddress(wallet), TOPIC_UPDATED);
        List<AuditEvent> revoked = logsForTopicAndType(2, padTopicAddress(wallet), TOPIC_REVOKED);
        List<AuditEvent> all = new ArrayList<>();
        all.addAll(issued);
        all.addAll(updated);
        all.addAll(revoked);
        return all;
    }

    @Override public int getTotalCredentialCount() throws IOException, InterruptedException {
        // nextCredentialId starts at 1, so total issued = nextCredentialId - 1
        // We don't have a direct getter, so derive from institution list issuance events
        // Return a count from all CredentialIssued events globally
        try {
            String payload = "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"eth_getLogs\",\"params\":[{"
                + "\"fromBlock\":\"0x0\",\"toBlock\":\"latest\","
                + "\"address\":" + JsonUtil.quote(config.contractAddress()) + ","
                + "\"topics\":[" + JsonUtil.quote(TOPIC_ISSUED) + "]}]}";
            return parseLogs(rpc(payload)).size();
        } catch (Exception e) {
            return 0;
        }
    }

    @Override public List<AuditEvent> getStudentActivity(String wallet) throws IOException, InterruptedException {
        // For CredentialIssued: student is topic[2]? No — order: (id indexed, student indexed, institution indexed)
        // So student is topic[2], BUT for Updated/Revoked there's no student topic. We get issued logs by student.
        List<AuditEvent> issued = logsForTopicAndType(2, padTopicAddress(wallet), TOPIC_ISSUED);
        // Then for each credential id derive updates/revokes
        List<AuditEvent> all = new ArrayList<>(issued);
        for (AuditEvent ev : issued) {
            long credId = parseHexLong(ev.firstTopic());
            if (credId > 0) {
                List<AuditEvent> rest = logsForTopic(1, padTopicUint(credId));
                for (AuditEvent r : rest) {
                    if (!"CredentialIssued".equals(r.type())) all.add(r);
                }
            }
        }
        return all;
    }

    private String call(String data) throws IOException, InterruptedException {
        ensureConfigured();
        String payload = "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"eth_call\",\"params\":[{\"to\":"
            + JsonUtil.quote(config.contractAddress()) + ",\"data\":\"0x" + data + "\"},\"latest\"]}";
        String result = extractField(rpc(payload), "result");
        if (result == null || result.isBlank() || result.equals("0x")) return "";
        return result.startsWith("0x") ? result.substring(2) : result;
    }

    private List<AuditEvent> logsForTopic(int topicIndex, String topicValue) throws IOException, InterruptedException {
        return logsForTopicAndType(topicIndex, topicValue, null);
    }

    private List<AuditEvent> logsForTopicAndType(int topicIndex, String topicValue, String topic0Filter) throws IOException, InterruptedException {
        ensureConfigured();
        StringBuilder topics = new StringBuilder("[");
        if (topic0Filter != null) topics.append(JsonUtil.quote(topic0Filter)); else topics.append("null");
        for (int i = 1; i <= topicIndex; i++) {
            topics.append(",");
            topics.append(i == topicIndex ? JsonUtil.quote(topicValue) : "null");
        }
        topics.append("]");
        String payload = "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"eth_getLogs\",\"params\":[{\"fromBlock\":\"0x0\",\"toBlock\":\"latest\",\"address\":"
            + JsonUtil.quote(config.contractAddress()) + ",\"topics\":" + topics + "}]}";
        return parseLogs(rpc(payload));
    }

    private String rpc(String payload) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder(URI.create(config.ethRpcUrl()))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(payload, StandardCharsets.UTF_8))
            .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) throw new IOException("Ethereum RPC failed [" + response.statusCode() + "]: " + response.body());
        if (response.body().contains("\"error\"")) throw new IOException("Ethereum RPC error: " + response.body());
        return response.body();
    }

    private void ensureConfigured() {
        if (config.ethRpcUrl().isBlank()) throw new IllegalStateException("ETH_RPC_URL is not configured");
        if (!isAddress(config.contractAddress())) throw new IllegalStateException("CONTRACT_ADDRESS is not configured");
    }

    private static Credential decodeCredential(String hex) {
        if (hex.length() < 9 * 64) throw new IllegalArgumentException("Credential not found");
        long id = wordLong(hex, 0);
        String student = wordAddress(hex, 1);
        String institution = wordAddress(hex, 2);
        long cidOffset = wordLong(hex, 3);
        long statusIndex = wordLong(hex, 4);
        long issuedAt = wordLong(hex, 5);
        long updatedAt = wordLong(hex, 6);
        long revokedAt = wordLong(hex, 7);
        long reasonOffset = wordLong(hex, 8);
        String cid = dynamicString(hex, cidOffset);
        String reason = dynamicString(hex, reasonOffset);
        return new Credential(id, student, institution, cid, statusIndex == 0 ? "Active" : "Revoked", issuedAt, updatedAt, revokedAt, reason);
    }

    private static List<Long> decodeUintArray(String hex) {
        List<Long> out = new ArrayList<>();
        if (hex.length() < 128) return out;
        int base = (int) wordLong(hex, 0) * 2;
        int count = (int) wordLongAt(hex, base);
        for (int i = 0; i < count; i++) out.add(wordLongAt(hex, base + 64 + (i * 64)));
        return out;
    }

    private static List<String> decodeAddressArray(String hex) {
        List<String> out = new ArrayList<>();
        if (hex.length() < 128) return out;
        int base = (int) wordLong(hex, 0) * 2;
        int count = (int) wordLongAt(hex, base);
        for (int i = 0; i < count; i++) {
            int start = base + 64 + (i * 64);
            out.add("0x" + hex.substring(start + 24, start + 64));
        }
        return out;
    }

    private List<AuditEvent> parseLogs(String response) {
        List<AuditEvent> events = new ArrayList<>();
        // Crude split on log objects (each starts with {"address":)
        int idx = response.indexOf("\"result\":[");
        if (idx < 0) return events;
        String arr = response.substring(idx + 10);
        int depth = 0; int start = -1;
        for (int i = 0; i < arr.length(); i++) {
            char c = arr.charAt(i);
            if (c == '{') { if (depth == 0) start = i; depth++; }
            else if (c == '}') { depth--; if (depth == 0 && start >= 0) { events.add(parseLog(arr.substring(start, i + 1))); start = -1; } }
            else if (c == ']' && depth == 0) break;
        }
        return events;
    }

    private AuditEvent parseLog(String chunk) {
        String tx = extractField(chunk, "transactionHash");
        long block = parseHexLong(extractField(chunk, "blockNumber"));
        String data = extractField(chunk, "data");
        List<String> topics = extractTopics(chunk);
        String topic0 = topics.isEmpty() ? "" : topics.get(0);
        String type = mapEventType(topic0);
        String firstTopic = topics.size() > 1 ? topics.get(1) : "";
        String secondTopic = topics.size() > 2 ? topics.get(2) : "";
        return new AuditEvent(type, tx, block, data, firstTopic, secondTopic);
    }

    private static String mapEventType(String topic0) {
        if (TOPIC_ISSUED.equalsIgnoreCase(topic0)) return "CredentialIssued";
        if (TOPIC_UPDATED.equalsIgnoreCase(topic0)) return "CredentialUpdated";
        if (TOPIC_REVOKED.equalsIgnoreCase(topic0)) return "CredentialRevoked";
        return "Event";
    }

    private static List<String> extractTopics(String chunk) {
        List<String> out = new ArrayList<>();
        int i = chunk.indexOf("\"topics\":[");
        if (i < 0) return out;
        int j = chunk.indexOf("]", i);
        if (j < 0) return out;
        String inner = chunk.substring(i + 10, j);
        for (String s : inner.split(",")) {
            String v = s.trim().replace("\"", "");
            if (!v.isEmpty()) out.add(v);
        }
        return out;
    }

    private static String extractField(String json, String key) {
        String marker = "\"" + key + "\":\"";
        int start = json.indexOf(marker);
        if (start < 0) return "";
        start += marker.length();
        int end = json.indexOf('"', start);
        return json.substring(start, end);
    }

    private static String encodeUint(long value) { return leftPad(Long.toHexString(value), 64); }
    private static String encodeAddress(String address) { requireAddress(address); return leftPad(address.substring(2).toLowerCase(), 64); }
    private static String padTopicUint(long value) { return "0x" + encodeUint(value); }
    private static String padTopicAddress(String address) { requireAddress(address); return "0x" + leftPad(address.substring(2).toLowerCase(), 64); }
    private static String leftPad(String value, int width) { return "0".repeat(Math.max(0, width - value.length())) + value; }

    private static long wordLong(String hex, int word) { return wordLongAt(hex, word * 64); }
    private static long wordLongAt(String hex, int start) {
        if (start + 64 > hex.length()) return 0;
        return new BigInteger(hex.substring(start, start + 64), 16).longValue();
    }
    private static String wordAddress(String hex, int word) {
        return "0x" + hex.substring(word * 64 + 24, word * 64 + 64);
    }
    private static String dynamicString(String hex, long byteOffset) {
        int start = (int) byteOffset * 2;
        if (start + 64 > hex.length()) return "";
        int len = (int) wordLongAt(hex, start);
        if (len == 0) return "";
        int dataStart = start + 64;
        int dataEnd = Math.min(dataStart + len * 2, hex.length());
        String segment = hex.substring(dataStart, dataEnd);
        if (segment.isBlank()) return "";
        byte[] bytes = new BigInteger("00" + segment, 16).toByteArray();
        if (bytes.length > len) {
            byte[] trimmed = new byte[len];
            System.arraycopy(bytes, bytes.length - len, trimmed, 0, len);
            bytes = trimmed;
        } else if (bytes.length < len) {
            byte[] padded = new byte[len];
            System.arraycopy(bytes, 0, padded, len - bytes.length, bytes.length);
            bytes = padded;
        }
        return new String(bytes, StandardCharsets.UTF_8);
    }
    private static boolean isAddress(String value) { return value != null && value.matches("^0x[a-fA-F0-9]{40}$"); }
    private static void requireAddress(String value) { if (!isAddress(value)) throw new IllegalArgumentException("Invalid Ethereum address"); }
    private static long parseHexLong(String hex) { if (hex == null || hex.isBlank()) return 0; String h = hex.startsWith("0x") ? hex.substring(2) : hex; if (h.isBlank()) return 0; return new BigInteger(h, 16).longValueExact(); }
}