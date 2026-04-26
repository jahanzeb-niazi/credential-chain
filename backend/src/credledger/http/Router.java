package credledger.http;

import credledger.config.AppConfig;
import credledger.util.JsonUtil;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public final class Router implements HttpHandler {
    private final AppConfig config;
    private final Map<String, RouteHandler> getRoutes = new HashMap<>();
    private final Map<String, RouteHandler> postRoutes = new HashMap<>();

    public Router(AppConfig config) {
        this.config = config;
    }

    public void get(String path, RouteHandler handler) { getRoutes.put(path, handler); }
    public void post(String path, RouteHandler handler) { postRoutes.put(path, handler); }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        addCors(exchange);
        if ("OPTIONS".equals(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }
        try {
            String path = exchange.getRequestURI().getPath();
            RouteHandler handler = switch (exchange.getRequestMethod()) {
                case "GET" -> getRoutes.get(path);
                case "POST" -> postRoutes.get(path);
                default -> null;
            };
            if (handler == null) {
                json(exchange, 404, JsonUtil.error("Route not found"));
                return;
            }
            handler.handle(exchange);
        } catch (IllegalArgumentException ex) {
            json(exchange, 400, JsonUtil.error(ex.getMessage()));
        } catch (IllegalStateException ex) {
            json(exchange, 503, JsonUtil.error(ex.getMessage()));
        } catch (Exception ex) {
            ex.printStackTrace();
            json(exchange, 500, JsonUtil.error("Internal backend error"));
        }
    }

    private void addCors(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", config.corsOrigin());
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type,Authorization");
    }

    public static void json(HttpExchange exchange, int status, String body) throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}
