package credledger.controllers;

import credledger.http.Router;
import credledger.services.CredentialService;
import credledger.util.HttpUtil;
import credledger.util.JsonUtil;

public final class VerificationController {
    private final Router router;
    private final CredentialService credentialService;

    public VerificationController(Router router, CredentialService credentialService) {
        this.router = router;
        this.credentialService = credentialService;
    }

    public void register() {
        router.get("/api/verify", exchange -> {
            long id = Long.parseLong(HttpUtil.requiredQuery(exchange, "id"));
            Router.json(exchange, 200, JsonUtil.ok("result", credentialService.verify(id).toJson()));
        });
        router.get("/api/audit", exchange -> {
            long id = Long.parseLong(HttpUtil.requiredQuery(exchange, "id"));
            Router.json(exchange, 200, JsonUtil.ok("events", CredentialService.eventsJson(credentialService.audit(id))));
        });
    }
}
