import { VectorTrack } from "../../../../cocos/animation/animation";
import { AnimationClip } from "../../../../cocos/animation/animation-clip";
import { AnimationMask } from "../../../../cocos/animation/marionette/animation-mask";
import { approx, lerp } from "../../../../cocos/core";
import { Node } from "../../../../cocos/scene-graph";

export enum NodeName {
    _1 = '1',
    _1_1 = '1_1',
    _1_1_1 = '1_1_1',
    _1_2 = '1_2',
}

export function generateTestData(layerCount: number) {
    const rootNode = generateSceneHierarchy();

    const nodes = [...(function* visitDFS(node: Node): Generator<Node> {
        yield node;
        for (const child of node.children) {
            yield* visitDFS(child);
        }
    })(rootNode)];

    // Generate node default values in [0.1, 0.5).
    const defaultValues = generateDefaultValues(nodes.length, 0.1, 0.5);
    nodes.forEach((node, nodeIndex) => {
        node.setPosition(defaultValues[nodeIndex], 0.0, 0.0);
    });

    // Generate node animation values in [0.5, 0.5 + 0.4 * layerCount).
    const animationValueMin = 0.5;
    const animationValueMax = animationValueMin + 0.4 * layerCount;
    const layersData = Array.from({ length: layerCount }, (_, layerIndex) => {
        const layerAnimationValueExtent = (animationValueMax - animationValueMin) / layerCount;
        return generateTestDataForNodes(
            rootNode,
            nodes,
            animationValueMin + layerAnimationValueExtent * layerIndex,
            animationValueMin + layerAnimationValueExtent * (layerIndex + 1),
        );
    });

    const animationValues = nodes.map((_, nodeIndex) =>
        layersData.map(({ animationValues }) => animationValues[nodeIndex]) as ReadonlyArray<number>);

    return {
        /** Generated root node. */
        rootNode,

        /** Generated fixtures for each node. */
        layerFixtures: layersData.map(({ clip }) => ({
            /** Sample this animation clip at any time gives each node's corresponding animation value. */
            clip,
        })),
        
        /** Generated fixtures for each node. */
        nodeFixtures: nodes.map((node, nodeIndex) => {
            return {
                /** The node's name. */
                name: node.name,
                /** The node's default value. */
                get defaultValue() {
                    return defaultValues[nodeIndex];
                },
                /** The node's current value. */
                get actualValue() {
                    return node.position.x;
                },
                /** The node's animation value at each layer. */
                get animationValues() {
                    return animationValues[nodeIndex];
                },
            };
        }),

        /** Get all nodes' actual value. */
        getActualNodeValues() {
            return nodes.reduce((result, node) => {
                result[node.name] = node.position.x;
                return result;
            }, {} as Record<string, number>);
        },
    } as const;
}

export type MaskItem = [nodeName: string,  enabled: boolean];

export function createMask(items: readonly Readonly<MaskItem>[]) {
    const mask = new AnimationMask();
    for (const [nodeName, enabled] of items) {
        const nodePath = nameToPath(nodeName);
        mask.addJoint(nodePath, enabled);
    }
    return mask;

    function nameToPath(name: string) {
        const i = name.lastIndexOf('_');
        if (i < 0) {
            return '';
        } else {
            const prefix = nameToPath(name.slice(0, i));
            return prefix ? `${prefix}/${name}` : name;
        }
    }
}

function generateSceneHierarchy() {
    /**
     * Scene hierarchy:
     * ```
     * (1)
     *   (1-1)
     *     (1-1-1)
     *   (1-2)
     * ```
     */
    const _note = undefined;
                
    const rootNode = new Node(NodeName._1);
    {
        const node_1_1 = new Node(NodeName._1_1);
        node_1_1.parent = rootNode;
        {
            const node_1_1_1 = new Node(NodeName._1_1_1);
            node_1_1_1.parent = node_1_1;
        }
        const node_1_2 = new Node(NodeName._1_2);
        node_1_2.parent = rootNode;
    }

    return rootNode;
}

function generateDefaultValues(count: number, min: number, max: number) {
    return Array.from({ length: count }, (_, i) => {
        const t = i / count;
        return lerp(min, max, t);
    });
}

function generateTestDataForNodes(root: Node, nodes: Node[], min: number, max: number) {
    const clip = new AnimationClip();
    clip.duration = 1.0;
    const animationValues = nodes.map((node, nodeIndex) => {
        const t = nodeIndex / nodes.length; // [0, 1)
        const track = new VectorTrack();
        track.path.toHierarchy(getPathExcludeFrom(root, node)).toProperty('position');
        track.componentsCount = 3;

        const animationValue = lerp(min, max, t);
        track.channels()[0].curve.addKeyFrame(0.0, animationValue);
        clip.addTrack(track);

        return animationValue;
    });
    return {
        clip,
        animationValues,
    };
}

function getPathExcludeFrom(from: Node, to: Node) {
    const path: string[] = [];
    let node: Node | null = to
    for (; node && node !== from; node = node.parent) {
        path.unshift(node.name);
    }
    if (node !== from) {
        throw new Error(`Unclosed path.`);
    }
    return path.join('/');
}
