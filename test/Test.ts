import assert from "assert";
import { 
  TestHelpers,
  AccessControlledOCR2Aggregator_AnswerUpdated
} from "generated";
const { MockDb, AccessControlledOCR2Aggregator } = TestHelpers;

describe("AccessControlledOCR2Aggregator contract AnswerUpdated event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for AccessControlledOCR2Aggregator contract AnswerUpdated event
  const event = AccessControlledOCR2Aggregator.AnswerUpdated.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("AccessControlledOCR2Aggregator_AnswerUpdated is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await AccessControlledOCR2Aggregator.AnswerUpdated.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualAccessControlledOCR2AggregatorAnswerUpdated = mockDbUpdated.entities.AccessControlledOCR2Aggregator_AnswerUpdated.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedAccessControlledOCR2AggregatorAnswerUpdated: AccessControlledOCR2Aggregator_AnswerUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      current: event.params.current,
      roundId: event.params.roundId,
      updatedAt: event.params.updatedAt,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualAccessControlledOCR2AggregatorAnswerUpdated, expectedAccessControlledOCR2AggregatorAnswerUpdated, "Actual AccessControlledOCR2AggregatorAnswerUpdated should be the same as the expectedAccessControlledOCR2AggregatorAnswerUpdated");
  });
});
