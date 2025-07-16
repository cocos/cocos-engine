import type { AnimationGraph } from '../../../animation-graph';
import { PoseGraphNode } from '../pose-graph-node';

export {};

export interface PoseGraphCreateNodeContext {
    animationGraph: AnimationGraph;

    layerIndex: number;
}

export interface PoseGraphCreateNodeEntry<TArg> {
    arg: TArg;

    menu: string;
}

export interface PoseGraphCreateNodeFactory<TArg> {
    listEntries(context: PoseGraphCreateNodeContext): Iterable<PoseGraphCreateNodeEntry<TArg>>;

    create: (arg: TArg) => PoseGraphNode;
}

export interface PoseGraphNodeEditorMetadata {
    /**
     * @zh
     * 为 `true` 时表示此类型的结点对象不应该被编辑器创建和编辑。
     * @en
     * If `true`, nodes of this type should not be created and edited by editor.
     */
    hide?: boolean;

    /**
     * @zh
     * 此类型的结点的分类。
     * @en
     * The category of this type of nodes.
     */
    category?: string;

    /**
     * @zh
     * 创建此类型结点应使用的选项和方法。
     * @en
     * The options and factory should be taken to create this type of nodes.
     */
    factory?: PoseGraphCreateNodeFactory<unknown>;

    /**
     * @zh
     * 此类型结点的外观配置。
     * @en
     * The appearance configs of this type of nodes.
     */
    appearance?: PoseGraphNodeAppearanceOptions;
}

/**
 * @zh 描述某类型结点的编辑器外观选项。
 * @en Describes the editor appearance of a type of nodes.
 */
export interface PoseGraphNodeAppearanceOptions {
    /**
     * @zh
     * 主题颜色。目前应为以 “#” 开头的十六进制字符串颜色表示，例如 `"#FF00FF"`。
     * @en
     * Theme color. Currently should be a color hex string starting with "#", for example: `"#FF00FF"`.
     */
    themeColor?: `#${string}`;

    /**
     * @zh
     * 为 `true` 时表示展示该类型结点时尽可能地使用“内联”样式。
     * @en
     * If `true`, indicates editor should show this type of nodes in "inline" style if possible.
     */
    inline?: boolean;
}

const nodeEditorMetadataMap = new WeakMap<Constructor<PoseGraphNode>, PoseGraphNodeEditorMetadata>();

export function getPoseGraphNodeEditorMetadata (
    classConstructor: Constructor<PoseGraphNode>,
): Readonly<PoseGraphNodeEditorMetadata> | undefined {
    return nodeEditorMetadataMap.get(classConstructor);
}

export function getOrCreateNodeEditorMetadata (constructor: Constructor<PoseGraphNode>): PoseGraphNodeEditorMetadata {
    const existing = nodeEditorMetadataMap.get(constructor);
    if (existing) {
        return existing;
    } else {
        const metadata: PoseGraphNodeEditorMetadata = {};
        nodeEditorMetadataMap.set(constructor, metadata);
        return metadata;
    }
}
