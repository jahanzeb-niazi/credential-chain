package credledger.models;

import credledger.util.JsonUtil;

public final class AuditEvent {
    private final String type;
    private final String transactionHash;
    private final long blockNumber;
    private final String data;

    public AuditEvent(String type, String transactionHash, long blockNumber, String data) {
        this.type = type;
        this.transactionHash = transactionHash;
        this.blockNumber = blockNumber;
        this.data = data;
    }

    public String type() { return type; }

    public String toJson() {
        return "{"
            + "\"type\":" + JsonUtil.quote(type) + ","
            + "\"transactionHash\":" + JsonUtil.quote(transactionHash) + ","
            + "\"blockNumber\":" + blockNumber + ","
            + "\"data\":" + JsonUtil.quote(data)
            + "}";
    }
}
