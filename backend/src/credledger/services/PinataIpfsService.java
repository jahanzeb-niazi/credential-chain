package credledger.services;

import credledger.config.AppConfig;
import credledger.util.JsonUtil;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

public final class PinataIpfsService implements IpfsService {
    private final AppConfig config;
    private final HttpClient client;

    public PinataIpfsService(AppConfig config) {
        this.config = config;
        this.client = HttpClient.newHttpClient();
    }

    @Override
    public String uploadJson(String json) throws IOException, InterruptedException {
        if (config.pinataJwt().isBlank()) throw new IllegalStateException("PINATA_JWT is not configured");
        validateJsonObject(json);
        String body = "{\"pinataContent\":" + json + ",\"pinataMetadata\":{\"name\":\"credledger-credential.json\"}}";
        HttpRequest request = HttpRequest.newBuilder(URI.create("https://api.pinata.cloud/pinning/pinJSONToIPFS"))
            .header("Authorization", "Bearer " + config.pinataJwt())
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(body, StandardCharsets.UTF_8))
            .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IOException("Pinata upload failed [" + response.statusCode() + "]: " + response.body());
        }
        return extractString(response.body(), "IpfsHash");
    }

    @Override
    public String fetchJson(String cid) throws IOException, InterruptedException {
        validateCid(cid);
        HttpRequest request = HttpRequest.newBuilder(URI.create(gatewayUrl(cid))).GET().build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IOException("IPFS fetch failed [" + response.statusCode() + "]");
        }
        return response.body();
    }

    @Override
    public String gatewayUrl(String cid) {
        validateCid(cid);
        String base = config.ipfsGateway().endsWith("/") ? config.ipfsGateway() : config.ipfsGateway() + "/";
        return base + cid;
    }

    private static void validateJsonObject(String json) {
        if (json == null || json.length() > 64_000 || !json.trim().startsWith("{") || !json.trim().endsWith("}")) {
            throw new IllegalArgumentException("Expected a JSON object under 64KB");
        }
    }

    private static void validateCid(String cid) {
        if (cid == null || !cid.matches("^[a-zA-Z0-9]{20,120}$")) throw new IllegalArgumentException("Invalid CID");
    }

    private static String extractString(String json, String key) {
        String marker = JsonUtil.quote(key) + ":";
        int start = json.indexOf(marker);
        if (start < 0) throw new IllegalStateException("Missing " + key + " in Pinata response");
        start = json.indexOf('"', start + marker.length()) + 1;
        int end = json.indexOf('"', start);
        return json.substring(start, end);
    }
}
