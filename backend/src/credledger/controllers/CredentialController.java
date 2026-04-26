package credledger.controllers;

import credledger.http.Router;
import credledger.services.CredentialService;
import credledger.util.HttpUtil;
import credledger.util.JsonUtil;

public final class CredentialController {
    private final Router router;
    private final CredentialService credentialService;

    public CredentialController(Router router, CredentialService credentialService) {
        this.router = router;
        this.credentialService = credentialService;
    }

    public void register() {
        router.get("/api/credential", exchange -> {
            long id = Long.parseLong(HttpUtil.requiredQuery(exchange, "id"));
            Router.json(exchange, 200, JsonUtil.ok("credential", credentialService.getCredential(id).toJson()));
        });
        router.get("/api/credential/student", exchange -> {
            String wallet = HttpUtil.requiredQuery(exchange, "wallet");
            Router.json(exchange, 200, JsonUtil.ok("credentialIds", CredentialService.idListJson(credentialService.credentialsByStudent(wallet))));
        });
        router.get("/api/credential/institution", exchange -> {
            String wallet = HttpUtil.requiredQuery(exchange, "wallet");
            Router.json(exchange, 200, JsonUtil.ok("credentialIds", CredentialService.idListJson(credentialService.credentialsByInstitution(wallet))));
        });
    }
}
