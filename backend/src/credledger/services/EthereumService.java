package credledger.services;

import credledger.models.AuditEvent;
import credledger.models.Credential;
import java.io.IOException;
import java.util.List;

public interface EthereumService {
    Credential getCredential(long credentialId) throws IOException, InterruptedException;
    List<Long> getCredentialsByHolder(String wallet) throws IOException, InterruptedException;
    List<Long> getCredentialsByInstitution(String wallet) throws IOException, InterruptedException;
    List<AuditEvent> getAuditEvents(long credentialId) throws IOException, InterruptedException;
    List<AuditEvent> getInstitutionActivity(String wallet) throws IOException, InterruptedException;
}
