import {
  ChainlinkProxy,
  ChainlinkProxy_AnswerUpdated,
  RedstoneProxy,
  RedstoneProxy_ValueUpdate,
  Chronicle_ETH_USD_3,
  Chronicle_ETH_USD_3_Poked,
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

Chronicle_ETH_USD_3.Poked.handler(async ({ event, context }) => {
  const nativeTokenUsed =
    event.transaction.gasUsed * event.transaction.effectiveGasPrice;

  const scaledVal = event.params.val / 10000000000n; // 18 -> 8 decimals

  const entity: Chronicle_ETH_USD_3_Poked = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    caller: event.params.caller,
    val: scaledVal,
    age: Number(event.params.age),
    updatedAt: event.params.age,
    nativeTokenUsed: nativeTokenUsed,
  };

  context.Chronicle_ETH_USD_3_Poked.set(entity);
});

Chronicle_ETH_USD_3.OpPoked.handler(async ({ event, context }) => {
  const nativeTokenUsed =
    event.transaction.gasUsed * event.transaction.effectiveGasPrice;

  const [val, age] = event.params.pokeData;
  const scaledVal = val / 10000000000n; // 18 -> 8 decimals

  const entity: Chronicle_ETH_USD_3_Poked = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    caller: event.params.caller,
    val: scaledVal,
    age: Number(age),
    updatedAt: age,
    nativeTokenUsed,
  };

  context.Chronicle_ETH_USD_3_Poked.set(entity);
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
