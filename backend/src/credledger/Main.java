package credledger;

import credledger.config.AppConfig;
import credledger.controllers.*;
import credledger.http.Router;
import credledger.services.*;
import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.time.Instant;

public final class Main {
    private Main() {}

    public static void main(String[] args) throws Exception {
        AppConfig config = AppConfig.fromEnvironment();
        IpfsService ipfsService = new PinataIpfsService(config);
        EthereumService ethereumService = new EthereumJsonRpcService(config);
        CredentialService credentialService = new CredentialService(ethereumService, ipfsService);

        Router router = new Router(config);
        router.get("/api/health", exchange -> Router.json(exchange, 200,
            "{\"ok\":true,\"service\":\"CredLedger Java Backend\",\"time\":\"" + Instant.now() + "\"}"));
        router.get("/api/config", exchange -> Router.json(exchange, 200,
            "{\"ok\":true,\"contractAddress\":" + credledger.util.JsonUtil.quote(config.contractAddress())
            + ",\"network\":\"Sepolia\",\"chainId\":\"0xaa36a7\""
            + ",\"ipfsGateway\":" + credledger.util.JsonUtil.quote(config.ipfsGateway()) + "}"));
        new IpfsController(router, ipfsService).register();
        new CredentialController(router, credentialService).register();
        new VerificationController(router, credentialService).register();
        new InstitutionController(router, credentialService).register();
        new RegistryController(router, credentialService).register();
        new RoleController(router, ethereumService, credentialService).register();

        HttpServer server = HttpServer.create(new InetSocketAddress(config.port()), 0);
        server.createContext("/", router);
        server.setExecutor(null);
        server.start();
        System.out.println("CredLedger backend listening on http://localhost:" + config.port());
    }
}
