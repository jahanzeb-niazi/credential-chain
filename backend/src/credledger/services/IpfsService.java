package credledger.services;

import java.io.IOException;

public interface IpfsService {
    String uploadJson(String json) throws IOException, InterruptedException;
    String fetchJson(String cid) throws IOException, InterruptedException;
    String gatewayUrl(String cid);
}
