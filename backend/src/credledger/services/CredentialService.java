package credledger.services;

import credledger.models.AuditEvent;
import credledger.models.Credential;
import credledger.models.VerificationResult;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public final class CredentialService {
    private final EthereumService ethereumService;
    private final IpfsService ipfsService;

    public CredentialService(EthereumService ethereumService, IpfsService ipfsService) {
        this.ethereumService = ethereumService;
        this.ipfsService = ipfsService;
    }

    public Credential getCredential(long id) throws IOException, InterruptedException {
        validateId(id);
        return ethereumService.getCredential(id);
    }

    public List<Long> credentialsByStudent(String wallet) throws IOException, InterruptedException {
        validateAddress(wallet);
        return ethereumService.getCredentialsByHolder(wallet);
    }

    public List<Long> credentialsByInstitution(String wallet) throws IOException, InterruptedException {
        validateAddress(wallet);
        return ethereumService.getCredentialsByInstitution(wallet);
    }

    public VerificationResult verify(long id) throws IOException, InterruptedException {
        Credential credential = getCredential(id);
        String metadata = "";
        try {
            metadata = credential.cid().isBlank() ? "" : ipfsService.fetchJson(credential.cid());
        } catch (Exception ignored) {
            metadata = "null";
        }
        return new VerificationResult(credential, metadata);
    }

    public List<AuditEvent> audit(long id) throws IOException, InterruptedException {
        validateId(id);
        return ethereumService.getAuditEvents(id);
    }

    public List<AuditEvent> institutionActivity(String wallet) throws IOException, InterruptedException {
        validateAddress(wallet);
        return ethereumService.getInstitutionActivity(wallet);
    }

    public List<AuditEvent> studentActivity(String wallet) throws IOException, InterruptedException {
        validateAddress(wallet);
        return ethereumService.getStudentActivity(wallet);
    }

    public List<String> allRegulators() throws IOException, InterruptedException {
        return ethereumService.getAllRegulators();
    }

    public List<String> allInstitutions() throws IOException, InterruptedException {
        return ethereumService.getAllInstitutions();
    }

    public Map<String, Object> regulatorProfile(String wallet) throws IOException, InterruptedException {
        validateAddress(wallet);
        return ethereumService.getRegulatorProfile(wallet);
    }

    public Map<String, Object> institutionProfile(String wallet) throws IOException, InterruptedException {
        validateAddress(wallet);
        return ethereumService.getInstitutionProfile(wallet);
    }

    public static String idListJson(List<Long> ids) {
        return ids.stream().map(String::valueOf).collect(Collectors.joining(",", "[", "]"));
    }

    public static String eventsJson(List<AuditEvent> events) {
        return events.stream().map(AuditEvent::toJson).collect(Collectors.joining(",", "[", "]"));
    }

    public static String addressListJson(List<String> addrs) {
        return addrs.stream().map(credledger.util.JsonUtil::quote).collect(Collectors.joining(",", "[", "]"));
    }

    public static String mapToJson(Map<String, Object> map) {
        return map.entrySet().stream().map(e -> credledger.util.JsonUtil.quote(e.getKey()) + ":" + valueToJson(e.getValue())).collect(Collectors.joining(",", "{", "}"));
    }

    private static String valueToJson(Object v) {
        if (v == null) return "null";
        if (v instanceof Boolean || v instanceof Number) return v.toString();
        return credledger.util.JsonUtil.quote(v.toString());
    }

    private static void validateId(long id) {
        if (id <= 0) throw new IllegalArgumentException("Credential ID must be positive");
    }

    private static void validateAddress(String wallet) {
        if (wallet == null || !wallet.matches("^0x[a-fA-F0-9]{40}$")) throw new IllegalArgumentException("Invalid Ethereum address");
    }
}
