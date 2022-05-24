import { AnimationState } from '../../cocos/core/animation/animation-state';
import { AnimationClip } from '../../cocos/core/animation/animation-clip';
import { AnimationMask } from '../../cocos/core/animation/marionette/animation-mask';
import { Node } from '../../cocos/core/scene-graph/node';
import { HierarchyPath } from '../../cocos/core/animation/target-path';

describe('Skeleton Mask', () => {
    test('Apply mask', () => {
        const mask = createMaskFromJson({
            name: 'root',
            enabled: true,
            children: [
                {
                    name: 'spine',
                    enabled: true,
                    children: [
                        {
                            name: 'LeftShoulder',
                            enabled: true,
                            children: [
                                { name: 'LeftHand', enabled: true },
                            ],
                        },
                        { name: 'RightShoulder', enabled: true },
                    ],
                },
                {
                    name: 'LeftLeg',
                    enabled: false,
                    children: [
                        {
                            name: 'LeftKnee',
                            enabled: false,
                        },
                    ],
                },
                {
                    name: 'RightLeg',
                    enabled: false,
                },
            ],
        });

        const clip = new AnimationClip();
        clip.curves = [
            {
                // Filter out the root
                modifiers: [
                    new HierarchyPath('LeftLeg'),
                ],
                data: {
                    keys: 0,
                    values: [],
                },
            },
            {
                // Filter out the subpath
                modifiers: [
                    new HierarchyPath('LeftLeg/LeftKnee'),
                ],
                data: {
                    keys: 0,
                    values: [],
                },
            },
            {
                // Disabled
                modifiers: [
                    new HierarchyPath('spine/LeftShoulder/LeftHand'),
                ],
                data: {
                    keys: 0,
                    values: [],
                },
            },
            {
                // Incomplete path
                modifiers: [
                    new HierarchyPath('LeftShoulder/LeftHand'),
                ],
                data: {
                    keys: 0,
                    values: [],
                },
            },
        ];

        const state = new AnimationState(clip);
        state.initialize(new Node(), undefined, mask);
    });
});

interface MaskJson {
    name: string,
    enabled: boolean;
    children?: MaskJson[];
}

function createMaskFromJson (maskJson: MaskJson) {
    const jointMaskInfos: AnimationMask.JointMaskInfo[] = [];
    visit(maskJson, '');
    const mask = new AnimationMask();
    for (const info of jointMaskInfos) {
        mask.addJoint(info.path, info.enabled);
    }
    return mask;

    function visit (maskJson: MaskJson, parentPath: string) {
        const path = parentPath ? `${parentPath}/${maskJson.name}` : maskJson.name;
        jointMaskInfos.push({ path, enabled: maskJson.enabled });
        if (maskJson.children) {
            for (const child of maskJson.children) {
                visit(child, path);
            }
        }
    }
}