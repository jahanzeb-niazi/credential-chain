package credledger.models;

import credledger.util.JsonUtil;

public final class AuditEvent {
    private final String type;
    private final String transactionHash;
    private final long blockNumber;
    private final String data;
    private final String firstTopic;
    private final String secondTopic;

    public AuditEvent(String type, String transactionHash, long blockNumber, String data) {
        this(type, transactionHash, blockNumber, data, "", "");
    }

    public AuditEvent(String type, String transactionHash, long blockNumber, String data, String firstTopic, String secondTopic) {
        this.type = type;
        this.transactionHash = transactionHash;
        this.blockNumber = blockNumber;
        this.data = data;
        this.firstTopic = firstTopic == null ? "" : firstTopic;
        this.secondTopic = secondTopic == null ? "" : secondTopic;
    }

    public String type() { return type; }
    public String firstTopic() { return firstTopic; }
    public String secondTopic() { return secondTopic; }

    public String toJson() {
        return "{"
            + "\"type\":" + JsonUtil.quote(type) + ","
            + "\"transactionHash\":" + JsonUtil.quote(transactionHash) + ","
            + "\"blockNumber\":" + blockNumber + ","
            + "\"data\":" + JsonUtil.quote(data) + ","
            + "\"firstTopic\":" + JsonUtil.quote(firstTopic) + ","
            + "\"secondTopic\":" + JsonUtil.quote(secondTopic)
            + "}";
    }
}
