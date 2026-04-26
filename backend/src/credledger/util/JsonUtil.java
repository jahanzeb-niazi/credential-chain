package credledger.util;

public final class JsonUtil {
    private JsonUtil() {}

    public static String quote(String value) {
        if (value == null) return "null";
        StringBuilder out = new StringBuilder("\"");
        for (char c : value.toCharArray()) {
            switch (c) {
                case '\\' -> out.append("\\\\");
                case '"' -> out.append("\\\"");
                case '\n' -> out.append("\\n");
                case '\r' -> out.append("\\r");
                case '\t' -> out.append("\\t");
                default -> out.append(c < 32 ? String.format("\\u%04x", (int)c) : c);
            }
        }
        return out.append('"').toString();
    }

    public static String error(String message) {
        return "{\"ok\":false,\"error\":" + quote(message) + "}";
    }

    public static String ok(String key, String rawJsonValue) {
        return "{\"ok\":true,\"" + key + "\":" + rawJsonValue + "}";
    }
}
