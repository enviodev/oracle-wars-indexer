/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  AccessControlledOCR2Aggregator,
  AccessControlledOCR2Aggregator_AnswerUpdated,
  TransparentUpgradeableProxy,
  TransparentUpgradeableProxy_ValueUpdate,
} from "generated";

AccessControlledOCR2Aggregator.AnswerUpdated.handler(
  async ({ event, context }) => {
    const entity: AccessControlledOCR2Aggregator_AnswerUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      current: event.params.current,
      roundId: event.params.roundId,
      updatedAt: event.params.updatedAt,
    };

    context.AccessControlledOCR2Aggregator_AnswerUpdated.set(entity);
  }
);

TransparentUpgradeableProxy.ValueUpdate.handler(async ({ event, context }) => {
  // Only process events with the specified dataFeedId
  if (
    event.params.dataFeedId ===
    "0x4554480000000000000000000000000000000000000000000000000000000000"
  ) {
    const entity: TransparentUpgradeableProxy_ValueUpdate = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      value: event.params.value,
      dataFeedId: event.params.dataFeedId,
      updatedAt: event.params.updatedAt,
    };

    context.TransparentUpgradeableProxy_ValueUpdate.set(entity);
  }
});
