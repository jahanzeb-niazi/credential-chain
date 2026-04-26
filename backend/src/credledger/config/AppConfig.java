package credledger.config;

public record AppConfig(
    int port,
    String pinataJwt,
    String ethRpcUrl,
    String contractAddress,
    String ipfsGateway,
    String corsOrigin
) {
    public static AppConfig fromEnvironment() {
        return new AppConfig(
            readInt("PORT", 9090),
            read("PINATA_JWT", ""),
            read("ETH_RPC_URL", ""),
            read("CONTRACT_ADDRESS", ""),
            read("IPFS_GATEWAY", "https://gateway.pinata.cloud/ipfs/"),
            read("CORS_ORIGIN", "*")
        );
    }

    private static String read(String key, String fallback) {
        String value = System.getenv(key);
        return value == null || value.isBlank() ? fallback : value.trim();
    }

    private static int readInt(String key, int fallback) {
        try {
            return Integer.parseInt(read(key, String.valueOf(fallback)));
        } catch (NumberFormatException ex) {
            return fallback;
        }
    }
}
