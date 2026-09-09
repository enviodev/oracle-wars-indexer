import { describe, it } from "vitest";
import { createTestIndexer } from "envio";

describe("TransparentUpgradeableProxy FastValueUpdate", () => {
  it("creates ValueUpdate entity for selected feed", async (t) => {
    const indexer = createTestIndexer();

    const result = await indexer.process({
      chains: {
        6343: {
          simulate: [
            {
              contract: "TransparentUpgradeableProxy",
              event: "FastValueUpdate",
              params: {
                // BTC/USD selected feed
                dataFeedId:
                  "0x4254430000000000000000000000000000000000000000000000000000000000",
                value: 5000000000000n,
                blockTimestamp: 1700000000n,
              },
            },
          ],
        },
      },
    });

    t.expect(result.changes).toBeDefined();
  });
});
