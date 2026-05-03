package credledger.controllers;

import credledger.http.Router;
import credledger.services.CredentialService;
import credledger.util.HttpUtil;
import credledger.util.JsonUtil;

public final class RegistryController {
    private final Router router;
    private final CredentialService credentialService;

    public RegistryController(Router router, CredentialService credentialService) {
        this.router = router;
        this.credentialService = credentialService;
    }

    public void register() {
        router.get("/api/regulators", exchange ->
            Router.json(exchange, 200, JsonUtil.ok("regulators", CredentialService.addressListJson(credentialService.allRegulators()))));
        router.get("/api/institutions", exchange ->
            Router.json(exchange, 200, JsonUtil.ok("institutions", CredentialService.addressListJson(credentialService.allInstitutions()))));
        router.get("/api/regulator", exchange ->
            Router.json(exchange, 200, JsonUtil.ok("regulator", CredentialService.mapToJson(credentialService.regulatorProfile(HttpUtil.requiredQuery(exchange, "wallet"))))));
        router.get("/api/institution", exchange ->
            Router.json(exchange, 200, JsonUtil.ok("institution", CredentialService.mapToJson(credentialService.institutionProfile(HttpUtil.requiredQuery(exchange, "wallet"))))));
        router.get("/api/student/activity", exchange ->
            Router.json(exchange, 200, JsonUtil.ok("events", CredentialService.eventsJson(credentialService.studentActivity(HttpUtil.requiredQuery(exchange, "wallet"))))));
    }
}