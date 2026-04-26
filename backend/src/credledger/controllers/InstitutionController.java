package credledger.controllers;

import credledger.http.Router;
import credledger.services.CredentialService;
import credledger.util.HttpUtil;
import credledger.util.JsonUtil;

public final class InstitutionController {
    private final Router router;
    private final CredentialService credentialService;

    public InstitutionController(Router router, CredentialService credentialService) {
        this.router = router;
        this.credentialService = credentialService;
    }

    public void register() {
        router.get("/api/institution/activity", exchange -> {
            String wallet = HttpUtil.requiredQuery(exchange, "wallet");
            Router.json(exchange, 200, JsonUtil.ok("events", CredentialService.eventsJson(credentialService.institutionActivity(wallet))));
        });
    }
}
