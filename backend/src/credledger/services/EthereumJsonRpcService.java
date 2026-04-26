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
import java.util.List;

public final class EthereumJsonRpcService implements EthereumService {
    private static final String GET_CREDENTIAL = "8dd18d2d";
    private static final String BY_HOLDER = "c8fba298";
    private static final String BY_INSTITUTION = "e8a8e713";
    private static final String ISSUED_TOPIC = "0x";
    private final AppConfig config;
    private final HttpClient client;

    public EthereumJsonRpcService(AppConfig config) {
        this.config = config;
        this.client = HttpClient.newHttpClient();
    }

    @Override
    public Credential getCredential(long credentialId) throws IOException, InterruptedException {
        String data = call(GET_CREDENTIAL + encodeUint(credentialId));
        return decodeCredential(data);
    }

    @Override
    public List<Long> getCredentialsByHolder(String wallet) throws IOException, InterruptedException {
        return decodeUintArray(call(BY_HOLDER + encodeAddress(wallet)));
    }

    @Override
    public List<Long> getCredentialsByInstitution(String wallet) throws IOException, InterruptedException {
        return decodeUintArray(call(BY_INSTITUTION + encodeAddress(wallet)));
    }

    @Override
    public List<AuditEvent> getAuditEvents(long credentialId) throws IOException, InterruptedException {
        return logsForTopic(encodeTopicUint(credentialId));
    }

    @Override
    public List<AuditEvent> getInstitutionActivity(String wallet) throws IOException, InterruptedException {
        return logsForTopic(encodeTopicAddress(wallet));
    }

    private String call(String data) throws IOException, InterruptedException {
        ensureConfigured();
        String payload = "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"eth_call\",\"params\":[{\"to\":"
            + JsonUtil.quote(config.contractAddress()) + ",\"data\":\"0x" + data + "\"},\"latest\"]}";
        String response = rpc(payload);
        String result = extractResult(response);
        if (result.equals("0x")) throw new IllegalArgumentException("Credential or contract data not found");
        return result.substring(2);
    }

    private List<AuditEvent> logsForTopic(String topic) throws IOException, InterruptedException {
        ensureConfigured();
        String payload = "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"eth_getLogs\",\"params\":[{\"fromBlock\":\"0x0\",\"toBlock\":\"latest\",\"address\":"
            + JsonUtil.quote(config.contractAddress()) + ",\"topics\":[null," + JsonUtil.quote(topic) + "]}]}";
        String response = rpc(payload);
        return parseLogs(response);
    }

    private String rpc(String payload) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder(URI.create(config.ethRpcUrl()))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(payload, StandardCharsets.UTF_8))
            .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IOException("Ethereum RPC failed [" + response.statusCode() + "]: " + response.body());
        }
        if (response.body().contains("\"error\"")) throw new IOException("Ethereum RPC error: " + response.body());
        return response.body();
    }

    private void ensureConfigured() {
        if (config.ethRpcUrl().isBlank()) throw new IllegalStateException("ETH_RPC_URL is not configured");
        if (!isAddress(config.contractAddress())) throw new IllegalStateException("CONTRACT_ADDRESS is not configured");
    }

    private static Credential decodeCredential(String hex) {
        if (hex.length() < 9 * 64) throw new IllegalArgumentException("Invalid credential response");
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
        List<Long> ids = new ArrayList<>();
        if (hex.length() < 128) return ids;
        int base = (int) wordLong(hex, 0) * 2;
        int count = (int) wordLongAt(hex, base);
        for (int i = 0; i < count; i++) ids.add(wordLongAt(hex, base + 64 + (i * 64)));
        return ids;
    }

    private static List<AuditEvent> parseLogs(String response) {
        List<AuditEvent> events = new ArrayList<>();
        String[] chunks = response.split("\\{\");
        for (String chunk : chunks) {
            if (!chunk.contains("transactionHash")) continue;
            String tx = extractField(chunk, "transactionHash");
            String block = extractField(chunk, "blockNumber");
            String data = extractField(chunk, "data");
            events.add(new AuditEvent("CONTRACT_EVENT", tx, parseHexLong(block), data));
        }
        return events;
    }

    private static String extractResult(String json) {
        return extractField(json, "result");
    }

    private static String extractField(String json, String key) {
        String marker = "\"" + key + "\":\"";
        int start = json.indexOf(marker);
        if (start < 0) return "";
        start += marker.length();
        int end = json.indexOf('"', start);
        return json.substring(start, end);
    }

    private static String encodeUint(long value) {
        return leftPad(Long.toHexString(value), 64);
    }

    private static String encodeAddress(String address) {
        requireAddress(address);
        return leftPad(address.substring(2).toLowerCase(), 64);
    }

    private static String encodeTopicUint(long value) {
        return "0x" + encodeUint(value);
    }

    private static String encodeTopicAddress(String address) {
        requireAddress(address);
        return "0x" + leftPad(address.substring(2).toLowerCase(), 64);
    }

    private static String leftPad(String value, int width) {
        return "0".repeat(Math.max(0, width - value.length())) + value;
    }

    private static long wordLong(String hex, int word) { return wordLongAt(hex, word * 64); }

    private static long wordLongAt(String hex, int start) {
        if (start + 64 > hex.length()) return 0;
        return new BigInteger(hex.substring(start, start + 64), 16).longValue();
    }

    private static String wordAddress(String hex, int word) {
        String w = hex.substring(word * 64, word * 64 + 64);
        return "0x" + w.substring(24);
    }

    private static String dynamicString(String hex, long byteOffset) {
        int start = (int) byteOffset * 2;
        if (start + 64 > hex.length()) return "";
        int len = (int) wordLongAt(hex, start);
        int dataStart = start + 64;
        int dataEnd = Math.min(dataStart + len * 2, hex.length());
        byte[] bytes = new BigInteger(hex.substring(dataStart, dataEnd).isBlank() ? "0" : hex.substring(dataStart, dataEnd), 16).toByteArray();
        if (bytes.length > len) {
            byte[] trimmed = new byte[len];
            System.arraycopy(bytes, bytes.length - len, trimmed, 0, len);
            bytes = trimmed;
        }
        return new String(bytes, StandardCharsets.UTF_8);
    }

    private static boolean isAddress(String value) { return value != null && value.matches("^0x[a-fA-F0-9]{40}$"); }
    private static void requireAddress(String value) { if (!isAddress(value)) throw new IllegalArgumentException("Invalid Ethereum address"); }
    private static long parseHexLong(String hex) { return hex == null || hex.isBlank() ? 0 : Long.parseLong(hex.replace("0x", ""), 16); }
}
