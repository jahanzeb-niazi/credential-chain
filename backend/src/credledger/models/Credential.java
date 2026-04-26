package credledger.models;

import credledger.util.JsonUtil;

public final class Credential {
    private final long id;
    private final String student;
    private final String institution;
    private final String cid;
    private final String status;
    private final long issuedAt;
    private final long updatedAt;
    private final long revokedAt;
    private final String revokeReason;

    public Credential(long id, String student, String institution, String cid, String status, long issuedAt, long updatedAt, long revokedAt, String revokeReason) {
        this.id = id;
        this.student = student;
        this.institution = institution;
        this.cid = cid;
        this.status = status;
        this.issuedAt = issuedAt;
        this.updatedAt = updatedAt;
        this.revokedAt = revokedAt;
        this.revokeReason = revokeReason;
    }

    public long id() { return id; }
    public String student() { return student; }
    public String institution() { return institution; }
    public String cid() { return cid; }
    public String status() { return status; }
    public long issuedAt() { return issuedAt; }
    public long updatedAt() { return updatedAt; }
    public long revokedAt() { return revokedAt; }
    public String revokeReason() { return revokeReason; }

    public String toJson() {
        return "{"
            + "\"id\":" + id + ","
            + "\"student\":" + JsonUtil.quote(student) + ","
            + "\"institution\":" + JsonUtil.quote(institution) + ","
            + "\"cid\":" + JsonUtil.quote(cid) + ","
            + "\"status\":" + JsonUtil.quote(status) + ","
            + "\"issuedAt\":" + issuedAt + ","
            + "\"updatedAt\":" + updatedAt + ","
            + "\"revokedAt\":" + revokedAt + ","
            + "\"revokeReason\":" + JsonUtil.quote(revokeReason)
            + "}";
    }
}
