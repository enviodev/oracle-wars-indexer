import { describe, it, expect } from "vitest";
import { createTestIndexer } from "envio";


describe("ChainlinkProxy AnswerUpdated", () => {
  it("stores a ChainlinkProxy_AnswerUpdated entity with gas cost", async () => {
    const indexer = createTestIndexer();

    const chainId = 1;
    const blockNumber = 23100000;
    const feedAddress = "0x7d4E742018fb52E48b08BE73d041C18B21de6Fb5"; // ETH/USD feed from config.yaml
    const params = { current: 300000000000n, roundId: 42n, updatedAt: 1700000000n };
    const gasUsed = 100000n;
    const effectiveGasPrice = 20000000000n;

    await indexer.process({
      chains: {
        [chainId]: {
          simulate: [
            {
              contract: "ChainlinkProxy",
              event: "AnswerUpdated",
              params,
              srcAddress: feedAddress,
              block: { number: blockNumber, timestamp: 1700000000 },
              transaction: { gasUsed, effectiveGasPrice },
              logIndex: 0,
            },
          ],
        },
      },
    });

    const id = `${chainId}_${blockNumber}_0`;
    const actual = await indexer.ChainlinkProxy_AnswerUpdated.getOrThrow(id);

    expect(actual).toMatchObject({
      id,
      current: params.current,
      roundId: params.roundId,
      updatedAt: params.updatedAt,
      nativeTokenUsed: gasUsed * effectiveGasPrice,
      feedAddress,
    });
  });
});
