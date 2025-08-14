/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  ChainlinkProxy,
  ChainlinkProxy_AnswerUpdated,
  RedstoneProxy,
  RedstoneProxy_ValueUpdate,
} from "generated";

ChainlinkProxy.AnswerUpdated.handler(async ({ event, context }) => {
  // Calculate native token cost (gasUsed × effectiveGasPrice)
  const nativeTokenUsed =
    event.transaction.gasUsed * event.transaction.effectiveGasPrice;

  const entity: ChainlinkProxy_AnswerUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    current: event.params.current,
    roundId: event.params.roundId,
    updatedAt: event.params.updatedAt,
    nativeTokenUsed: nativeTokenUsed,
    feedAddress: event.srcAddress,
    chainId: event.chainId,
  };

  context.ChainlinkProxy_AnswerUpdated.set(entity);
});

RedstoneProxy.ValueUpdate.handler(async ({ event, context }) => {
  // Only process events with the specified dataFeedId
  if (
    event.params.dataFeedId ===
    "0x4554480000000000000000000000000000000000000000000000000000000000"
  ) {
    // Calculate native token cost (gasUsed × effectiveGasPrice)
    const nativeTokenUsed =
      event.transaction.gasUsed * event.transaction.effectiveGasPrice;

    const entity: RedstoneProxy_ValueUpdate = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      value: event.params.value,
      dataFeedId: event.params.dataFeedId,
      updatedAt: event.params.updatedAt,
      nativeTokenUsed: nativeTokenUsed,
    };

    context.RedstoneProxy_ValueUpdate.set(entity);
  }
});
