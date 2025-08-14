import assert from "assert";
import { TestHelpers, ChainlinkProxy_AnswerUpdated } from "generated";
const { MockDb, ChainlinkProxy } = TestHelpers;

describe("ChainlinkProxy contract AnswerUpdated event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for ChainlinkProxy contract AnswerUpdated event
  const event = ChainlinkProxy.AnswerUpdated.createMockEvent({
    /* It mocks event fields with default values. You can overwrite them if you need */
  });

  it("ChainlinkProxy_AnswerUpdated is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await ChainlinkProxy.AnswerUpdated.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualChainlinkProxyAnswerUpdated =
      mockDbUpdated.entities.ChainlinkProxy_AnswerUpdated.get(
        `${event.chainId}_${event.block.number}_${event.logIndex}`
      );

    // Creating the expected entity
    const expectedChainlinkProxyAnswerUpdated: ChainlinkProxy_AnswerUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      current: event.params.current,
      roundId: event.params.roundId,
      updatedAt: event.params.updatedAt,
      nativeTokenUsed:
        event.transaction.gasUsed * event.transaction.effectiveGasPrice,
      feedAddress: event.srcAddress,
      chainId: event.chainId,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualChainlinkProxyAnswerUpdated,
      expectedChainlinkProxyAnswerUpdated,
      "Actual ChainlinkProxy_AnswerUpdated should be the same as the expectedChainlinkProxy_AnswerUpdated"
    );
  });
});
