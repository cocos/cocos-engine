import { Transform } from "../../../../cocos/animation/core/transform";
import { Node, Quat, Vec3 } from "../../../../exports/base";
import { PoseRecord } from "./pose-record";

/**
 * Generates the following hierarchy:
```
Origin
├── Root 1
│   ├── Leaf 1.1
│   └── Middle 1.2
│       ├── Middle 1.2.1
│       │   └── Leaf 1.2.1.1
│       └── Leaf 1.2.2
├── Root 2
│   └── Leaf 2.1
├── (Non-animated)Root 3
│   ├── Leaf 3.3
│   └── (Non-animated)Middle 3.4
│       └── Left 3.4.1
└── Root 4
    └── (Non-animated)Middle 4.1
        └── Leaf 4.1.1
```
 */
export function generateHierarchyFixture(
    leafNodeIds = [
        '1.1',
        '1.2.1.1',
        '1.2.2',
        '2.1',
    ],
) {
    const nonAnimatingNodeIds = [
        '3',
        '3.4',
        '4.1',
    ];

    class ObservedNode {
        private static _observeIdGenerator = 0;

        get node() {
            return this._node;
        }

        constructor(name: string, observedParent: ObservedNode | undefined) {
            const observeId = ++ObservedNode._observeIdGenerator;

            const node = new Node(name);
            node.setPosition(new Vec3(observeId, observeId, observeId));
            node.setScale(new Vec3(observeId, observeId, observeId));
            node.setRotation(Quat.fromEuler(new Quat(), observeId, observeId, observeId));
            if (observedParent) {
                node.parent = observedParent._node;
            }

            this._initialLocalTransform = new Transform();
            this._initialLocalTransform.position = Vec3.clone(node.position);
            this._initialLocalTransform.rotation = Quat.clone(node.rotation);
            this._initialLocalTransform.scale = Vec3.clone(node.scale);

            this._initialComponentTransform = new Transform();
            this._initialComponentTransform.position = Vec3.clone(node.worldPosition);
            this._initialComponentTransform.rotation = Quat.clone(node.worldRotation);
            this._initialComponentTransform.scale = Vec3.clone(node.worldScale);

            this._node = node;
        }

        get initialLocalTransform() {
            return this._initialLocalTransform;
        }

        get initialComponentTransform() {
            return this._initialComponentTransform;
        }

        private _node: Node;
        private _initialLocalTransform = new Transform();
        private _initialComponentTransform = new Transform();
    }
    
    const idToNodeMap = new Map<string, ObservedNode>();

    for (const leafNodeId of leafNodeIds) {
        let parent: ObservedNode | undefined;
        const parts = leafNodeId.split('.');
        for (let iPart = 0; iPart < parts.length; ++iPart) {
            const id = parts.slice(0, iPart + 1).join('.');
            let node = idToNodeMap.get(id);
            if (!node) {
                let prefix = iPart === parts.length - 1
                    ? 'Leaf'
                    : iPart === 0
                        ? 'Root'
                        : 'Middle';

                if (nonAnimatingNodeIds.includes(id)) {
                    prefix = `(Uninvolved)${prefix}`;
                }
                node = new ObservedNode(`${prefix} ${id}`, parent);
                idToNodeMap.set(id, node);
            }
            parent = node;
        }
    }

    const origin = new Node();

    for (const node of idToNodeMap.values()) {
        if (!node.node.parent) {
            node.node.parent = origin;
        }
    }

    // Give origin some transform.
    {
        origin.setPosition(1, 2, 3);
        origin.setRotation(Quat.fromEuler(new Quat(), 4, 5, 6));
        origin.setScale(new Vec3(7, 7, 7));
    }

    // Give the origin a parent.
    {
        const originParent = new Node();
        originParent.addChild(origin);
        originParent.setPosition(8, 9, 10);
        origin.setRotation(Quat.fromEuler(new Quat(), 11, 12, 13));
        origin.setScale(new Vec3(1.4, 1.4, 1.4));
    }

    const getObservedNodeByName = (name: string) => {
        const node = [...idToNodeMap.values()].find((node) => node.node.name === name);
        return node;
    };

    return {
        origin,

        getNodeNameById(id: string) {
            return idToNodeMap.get(id)?.node.name;
        },

        getComponentToWorldTransform() {
            const result = new Transform();
            result.position = origin.worldPosition;
            result.rotation = origin.worldRotation;
            result.scale = origin.worldScale;
            return result;
        },

        getWorldToComponentTransform() {
            const result = this.getComponentToWorldTransform();
            Transform.invert(result, result);
            return result;
        },

        getParentNodeName(from: string) {
            const fromNode = [...idToNodeMap.values()].find((node) => node.node.name === from);
            expect(fromNode).not.toBeUndefined();
            const parentNode = fromNode!.node.parent;
            expect(parentNode).not.toBeNull();
            if (parentNode === origin) {
                return '';
            } else {
                expect([...idToNodeMap.values()].find((node) => node.node === parentNode)).not.toBeUndefined();
                return parentNode!.name;
            }
        },

        computeComponentSpaceTransform(pose: PoseRecord, nodeName: string) {
            const result = new Transform();
            if (nodeName === '') {
                return result;
            }

            const fromNode = [...idToNodeMap.values()].find((node) => node.node.name === nodeName);
            expect(fromNode).not.toBeUndefined();
            for (let node: Node | null = fromNode!.node; node; node = node.parent) {
                if (node === origin) {
                    return result;
                }
                let nodeTransform: Transform;
                if (node.name in pose.transforms) {
                    nodeTransform = pose.transforms[node.name];
                } else {
                    const observed = getObservedNodeByName(node.name);
                    expect(observed).not.toBeFalsy();
                    nodeTransform = observed!.initialLocalTransform;
                }
                Transform.multiply(result, nodeTransform, result);
            }
            throw new Error(`Unexpected`);
        },

        /**
         * Gets the local space initial pose record of all animated nodes.
         */
        getInitialLocalSpacePoseRecord() {
            const record: PoseRecord = { transforms: {} };
            for (const [nodeId, node] of idToNodeMap) {
                if (!nonAnimatingNodeIds.includes(nodeId)) {
                    record.transforms[node.node.name] = node.initialLocalTransform;
                }
            }
            return record;
        },

        /**
         * Gets the component space initial pose record of all animated nodes.
         */
        getInitialComponentSpacePoseRecord() {
            const record: PoseRecord = { transforms: {} };
            for (const [nodeId, node] of idToNodeMap) {
                if (!nonAnimatingNodeIds.includes(nodeId)) {
                    record.transforms[node.node.name] = node.initialComponentTransform;
                }
            }
            return record;
        },

        /**
         * Generates a (pseudo) random pose and return it in both local space and component space. 
         */
        generateRandomPose() {
            const involvedNodes = new Set(
                [...idToNodeMap]
                    .map(([id, node]) => nonAnimatingNodeIds.includes(id) ? undefined : node.node)
                    .filter((node): node is Node => !!node),
            );

            const generatedLocalSpaceTransforms: Record<string, Transform> = {};
            const generatedComponentSpaceTransforms: Record<string, Transform> = {};

            let counter = 0;
            function g(node: Node, generatedComponent: Transform) {
                for (const child of node.children) {
                    let childLocalTransform: Transform;
                    if (!involvedNodes.has(child)) {
                        const observed = [...idToNodeMap].find(([id, node]) => node.node === child);
                        expect(observed).not.toBeUndefined();
                        childLocalTransform = Transform.copy(new Transform(), observed![1].initialLocalTransform);
                    } else {
                        const id = ++counter;
                        childLocalTransform = new Transform();
                        childLocalTransform.position = new Vec3(id * 0.1, id * 0.2, id * 0.3);
                        childLocalTransform.rotation = Quat.fromEuler(new Quat(), id * 0.4, id * 0.5, id * 0.6);
                        childLocalTransform.scale = new Vec3(id * 0.7, id * 0.7, id * 0.7);
                    }

                    const childComponentTransform = Transform.multiply(new Transform(), generatedComponent, childLocalTransform);

                    if (involvedNodes.has(child)) {
                        generatedLocalSpaceTransforms[child.name] = childLocalTransform;
                        generatedComponentSpaceTransforms[child.name] = childComponentTransform;
                    }

                    g(child, childComponentTransform);
                }
            }
            
            g(origin, new Transform());

            return {
                localSpace: { transforms: generatedLocalSpaceTransforms },
                componentSpace: { transforms: generatedComponentSpaceTransforms },
            };
        },
    };
}