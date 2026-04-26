package credledger.models;

import credledger.util.JsonUtil;

public final class VerificationResult {
    private final Credential credential;
    private final String metadataJson;

    public VerificationResult(Credential credential, String metadataJson) {
        this.credential = credential;
        this.metadataJson = metadataJson;
    }

    public String toJson() {
        String valid = "Active".equals(credential.status()) ? "true" : "false";
        return "{\"valid\":" + valid
            + ",\"credential\":" + credential.toJson()
            + ",\"metadata\":" + (metadataJson == null || metadataJson.isBlank() ? "null" : metadataJson)
            + ",\"message\":" + JsonUtil.quote("Active".equals(credential.status()) ? "Credential is valid" : "Credential is revoked")
            + "}";
    }
}
