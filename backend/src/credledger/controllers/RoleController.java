package credledger.controllers;

import credledger.http.Router;
import credledger.services.CredentialService;
import credledger.services.EthereumService;
import credledger.util.HttpUtil;
import credledger.util.JsonUtil;
import java.util.Map;

public final class RoleController {
    private final Router router;
    private final EthereumService ethereumService;
    private final CredentialService credentialService;

    public RoleController(Router router, EthereumService ethereumService, CredentialService credentialService) {
        this.router = router;
        this.ethereumService = ethereumService;
        this.credentialService = credentialService;
    }

    public void register() {
        router.get("/api/role", exchange -> {
            String wallet = HttpUtil.requiredQuery(exchange, "wallet");
            boolean isGovernment = false;
            boolean isRegulator = false;
            boolean isInstitution = false;
            String profileJson = "null";

            try {
                Map<String, Object> reg = ethereumService.getRegulatorProfile(wallet);
                Boolean active = (Boolean) reg.get("active");
                if (Boolean.TRUE.equals(active)) {
                    isRegulator = true;
                    String name = (String) reg.get("name");
                    isGovernment = "Government Root".equals(name);
                    profileJson = CredentialService.mapToJson(reg);
                }
            } catch (Exception ignored) {}

            if (!isRegulator) {
                try {
                    Map<String, Object> inst = ethereumService.getInstitutionProfile(wallet);
                    Boolean authorized = (Boolean) inst.get("authorized");
                    Boolean suspended  = (Boolean) inst.get("suspended");
                    if (Boolean.TRUE.equals(authorized) && !Boolean.TRUE.equals(suspended)) {
                        isInstitution = true;
                        profileJson = CredentialService.mapToJson(inst);
                    }
                } catch (Exception ignored) {}
            }

            String body = "{\"ok\":true"
                + ",\"isGovernment\":" + isGovernment
                + ",\"isRegulator\":" + isRegulator
                + ",\"isInstitution\":" + isInstitution
                + ",\"isStudent\":" + (!isRegulator && !isInstitution)
                + ",\"profile\":" + profileJson
                + "}";
            Router.json(exchange, 200, body);
        });

        router.get("/api/stats", exchange -> {
            int regulatorCount = 0;
            int institutionCount = 0;
            int totalCredentials = 0;
            try { regulatorCount = ethereumService.getAllRegulators().size(); } catch (Exception ignored) {}
            try { institutionCount = ethereumService.getAllInstitutions().size(); } catch (Exception ignored) {}
            try { totalCredentials = ethereumService.getTotalCredentialCount(); } catch (Exception ignored) {}
            Router.json(exchange, 200,
                "{\"ok\":true,\"regulatorCount\":" + regulatorCount
                + ",\"institutionCount\":" + institutionCount
                + ",\"totalCredentials\":" + totalCredentials + "}");
        });
    }
}
