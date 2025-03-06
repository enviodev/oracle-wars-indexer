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
    // Calculate native token cost (gasUsed × effectiveGasPrice)
    const nativeTokenUsed =
      event.transaction.gasUsed * event.transaction.effectiveGasPrice;

    const entity: AccessControlledOCR2Aggregator_AnswerUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      current: event.params.current,
      roundId: event.params.roundId,
      updatedAt: event.params.updatedAt,
      nativeTokenUsed: nativeTokenUsed,
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
    // Calculate native token cost (gasUsed × effectiveGasPrice)
    const nativeTokenUsed =
      event.transaction.gasUsed * event.transaction.effectiveGasPrice;

    const entity: TransparentUpgradeableProxy_ValueUpdate = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      value: event.params.value,
      dataFeedId: event.params.dataFeedId,
      updatedAt: event.params.updatedAt,
      nativeTokenUsed: nativeTokenUsed,
    };

    context.TransparentUpgradeableProxy_ValueUpdate.set(entity);
  }
});
