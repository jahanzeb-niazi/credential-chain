package credledger.controllers;

import credledger.http.Router;
import credledger.services.IpfsService;
import credledger.util.HttpUtil;
import credledger.util.JsonUtil;

public final class IpfsController {
    private final Router router;
    private final IpfsService ipfsService;

    public IpfsController(Router router, IpfsService ipfsService) {
        this.router = router;
        this.ipfsService = ipfsService;
    }

    public void register() {
        router.post("/api/ipfs/upload", exchange -> {
            String json = HttpUtil.readBody(exchange);
            String cid = ipfsService.uploadJson(json);
            Router.json(exchange, 200, "{\"ok\":true,\"cid\":" + JsonUtil.quote(cid) + ",\"url\":" + JsonUtil.quote(ipfsService.gatewayUrl(cid)) + "}");
        });
        router.get("/api/ipfs", exchange -> {
            String cid = HttpUtil.requiredQuery(exchange, "cid");
            String json = ipfsService.fetchJson(cid);
            Router.json(exchange, 200, "{\"ok\":true,\"cid\":" + JsonUtil.quote(cid) + ",\"metadata\":" + json + "}");
        });
    }
}
