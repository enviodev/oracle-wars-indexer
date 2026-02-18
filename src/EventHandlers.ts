/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  TransparentUpgradeableProxy,
  TransparentUpgradeableProxy_ValueUpdate,
} from "generated";

const VALUE_UPDATE_DELETE_OFFSET = 5000n;

TransparentUpgradeableProxy.FastValueUpdate.handler(
  async ({ event, context }) => {
    const selectedFeeds = [
      // MegaETH Testnet Feeds
      "0x4254430000000000000000000000000000000000000000000000000000000000", // BTC/USD
      "0x4554480000000000000000000000000000000000000000000000000000000000", // ETH/USD
      "0x424e420000000000000000000000000000000000000000000000000000000000", // BNB/USD
      "0x5553445400000000000000000000000000000000000000000000000000000000", // USDT/USD
      "0x5553444300000000000000000000000000000000000000000000000000000000", // USDC/USD
      "0x534f4c0000000000000000000000000000000000000000000000000000000000", // SOL/USD

      // MegaETH Mainnet Feeds
    ];

    // Filter for selected data feeds only
    if (!selectedFeeds.includes(event.params.dataFeedId)) {
      return;
    }

    const trackIndex = await context.TrackIndex.getOrCreate({
      id: `${event.params.dataFeedId}-${event.chainId}`,
      valueUpdateIndex: 0n,
      valueUpdateDeleteIndex: 0n,
      chainId: event.chainId,
    });

    // increment global index
    const currentIndex = trackIndex.valueUpdateIndex;
    // Calculate native token cost (gasUsed × effectiveGasPrice)
    const nativeTokenUsed =
      event.transaction.gasUsed * event.transaction.effectiveGasPrice;

    const entity: TransparentUpgradeableProxy_ValueUpdate = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      value: event.params.value,
      dataFeedId: event.params.dataFeedId,
      updatedAt: event.params.blockTimestamp,
      nativeTokenUsed: nativeTokenUsed,
      deleteIndex: currentIndex,
      chainId: event.chainId,
    };

    context.TransparentUpgradeableProxy_ValueUpdate.set(entity);

    // If entity count exceeds OFFSET, delete the oldest one
    if (currentIndex >= VALUE_UPDATE_DELETE_OFFSET) {
      const deleteIndex = currentIndex - VALUE_UPDATE_DELETE_OFFSET;
      const toDelete =
        await context.TransparentUpgradeableProxy_ValueUpdate.getWhere.deleteIndex.eq(
          deleteIndex,
        );
      if (toDelete.length > 0) {
        for (const entity of toDelete) {
          // delete data feed specific entries only
          if (entity.dataFeedId === event.params.dataFeedId && entity.chainId === event.chainId) {
            context.TransparentUpgradeableProxy_ValueUpdate.deleteUnsafe(
              entity.id,
            );
          }
        }
      }
      context.TrackIndex.set({
        ...trackIndex,
        valueUpdateDeleteIndex: trackIndex.valueUpdateDeleteIndex + 1n,
      });
    }

    const newTrackIndex = await context.TrackIndex.getOrCreate({
      id: `${event.params.dataFeedId}-${event.chainId}`,
      valueUpdateIndex: 0n,
      valueUpdateDeleteIndex: 0n,
      chainId: event.chainId,
    });

    // persist index increment
    context.TrackIndex.set({
      ...newTrackIndex,
      valueUpdateIndex: currentIndex + 1n,
    });
  },
);

// AccessControlledOCR2Aggregator.AnswerUpdated.handler(
//   async ({ event, context }) => {
//     const trackIndex = await context.TrackIndex.getOrCreate({
//       id: "singleton",
//       answerUpdatedIndex: 0n,
//       valueUpdateIndex: 0n,
//       answerUpdatedDeleteIndex: 0n,
//       valueUpdateDeleteIndex: 0n,
//     });

//     // increment global index
//     const currentIndex = trackIndex.answerUpdatedIndex;

//     // Calculate native token cost (gasUsed × effectiveGasPrice)
//     const nativeTokenUsed =
//       event.transaction.gasUsed * event.transaction.effectiveGasPrice;

//     const entity: AccessControlledOCR2Aggregator_AnswerUpdated = {
//       id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
//       current: event.params.current,
//       roundId: event.params.roundId,
//       updatedAt: event.params.updatedAt,
//       nativeTokenUsed: nativeTokenUsed,
//       feedAddress: event.srcAddress,
//       chainId: event.chainId,
//       deleteIndex: currentIndex,
//     };

//     context.AccessControlledOCR2Aggregator_AnswerUpdated.set(entity);

//     // If entity count exceeds OFFSET, delete the oldest one
//     if (currentIndex >= ANSWER_UPDATED_DELETE_OFFSET) {
//       const deleteIndex = currentIndex - ANSWER_UPDATED_DELETE_OFFSET;

//       const toDelete =
//         await context.AccessControlledOCR2Aggregator_AnswerUpdated.getWhere.deleteIndex.eq(
//           deleteIndex,
//         );

//       if (toDelete.length > 0) {
//         context.AccessControlledOCR2Aggregator_AnswerUpdated.deleteUnsafe(
//           toDelete[0].id,
//         );
//       }
//     }

//     // persist index increment
//     context.TrackIndex.set({
//       ...trackIndex,
//       answerUpdatedIndex: currentIndex + 1n,
//     });
//   },
// );
