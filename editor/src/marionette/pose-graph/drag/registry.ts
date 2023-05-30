import { PoseGraphNode } from "../../../../../cocos/animation/marionette/pose-graph/foundation/pose-graph-node";
import { assertIsTrue, Asset, Constructor } from "../../../../../exports/base";

/**
 * In pose graph, describes the drag handling info for an asset type.
 */
export type PoseGraphAssetDragHandlersInfo = {
    /**
     * All handlers handling dragging on this asset type. The key is handler id.
     */
    handlers: Record<string, {
        /**
         * The handler's display name.
         */
        displayName: string;
    }>
};

/**
 * Query all asset drag handlers.
 */
export function* getPoseGraphAssetDragHandlersMap(): Generator<[Constructor<Asset>, PoseGraphAssetDragHandlersInfo]> {
    for (const [assetType, register] of assetDragHandlerRegistry.entries()) {
        const info: PoseGraphAssetDragHandlersInfo = { handlers: {} };
        for (const [handlerId, handler] of Object.entries(register.handlers)) {
            info.handlers[handlerId] = {
                displayName: handler.displayName,
            };
        }
        yield [assetType, info];
    }
}

export function createPoseNodeOnAssetDrag(asset: Asset, handlerId: string): PoseGraphNode | undefined {
    const assetType = asset.constructor as new () => Asset;

    const assetDragRegister = assetDragHandlerRegistry.get(assetType);
    if (!assetDragRegister) {
        console.warn(`There has any no handlers for asset type ${assetType}`);
        return;
    }

    const handler = assetDragRegister.handlers[handlerId];
    if (!handler) {
        console.warn(`Asset type ${assetType} has no handler ${handlerId}, existing handlers are ${Object.keys(assetDragRegister.handlers).join(',')}`);
        return;
    }

    return handler.handle(asset);
}

const assetDragHandlerRegistry: Map<new () => Asset, AssetDragHandlerRegister<Asset>> = new Map();

export interface AssetDragHandler<TAssetType extends Asset> {
    displayName: string;

    handle(asset: TAssetType): PoseGraphNode | undefined;
}

interface AssetDragHandlerRegister<TAssetType extends Asset> {
    handlers: Record<string, AssetDragHandler<TAssetType>>;
}

let handlerIdGenerator = 1;

export function registerCreatePoseNodeOnAssetDragHandler<TAssetType extends Asset>(
    assetType: new () => TAssetType,
    handler: AssetDragHandler<TAssetType>,
) {
    let assetDragHandlerRegister = assetDragHandlerRegistry.get(assetType);
    if (!assetDragHandlerRegister) {
        assetDragHandlerRegister = {
            handlers: {},
        };
        assetDragHandlerRegistry.set(assetType, assetDragHandlerRegister);
    }

    const handlerId = handlerIdGenerator++;
    assertIsTrue(!(handlerId in assetDragHandlerRegister.handlers));

    assetDragHandlerRegister.handlers[handlerId] = handler;
}
