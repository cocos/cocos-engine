
import { SkeletalAnimationState } from '../../cocos/3d/skeletal-animation/skeletal-animation-state';
import { SkeletalAnimation } from '../../cocos/3d/skeletal-animation/skeletal-animation';
import { CCObject, director, game, Node, Scene } from '../../cocos/core';
import { AnimationClip } from '../../cocos/core/animation/animation-clip';
import { VectorTrack } from '../../cocos/core/animation/animation';
import { JointAnimationInfo } from '../../cocos/3d/skeletal-animation/skeletal-animation-utils';
import { SkinnedMeshRenderer } from '../../cocos/3d/skinned-mesh-renderer';

describe('Skeletal animation state', () => {
    function createSimpleClip(name: string, duration: number, from: number, to: number, path = '') {
        const animationClip = new AnimationClip();
        animationClip.name = name;
        animationClip.duration = duration;
        const vectorTrack = new VectorTrack();
        if (path) {
            vectorTrack.path.toHierarchy(path);
        }
        vectorTrack.path.toProperty('position');
        vectorTrack.componentsCount = 3;
        vectorTrack.channels()[0].curve.assignSorted([
            [0.0, from],
            [duration, to],
        ]);
        animationClip.addTrack(vectorTrack);
        return animationClip;
    }

    test('Baked - Sample()', () => {
        const switchClipMock = JointAnimationInfo.prototype.switchClip = jest.fn(JointAnimationInfo.prototype.switchClip);

        const clips = [
            createSimpleClip('Clip1', 2.0, 1.2, 1.8, 'Observed'),
            createSimpleClip('Clip2', 5.0, -0.7, 0.98, 'Observed'),
        ];

        const rootNode = new Node();

        const observedNode = new Node('Observed');
        rootNode.addChild(observedNode);

        const skeletonAnimation = rootNode.addComponent(SkeletalAnimation) as SkeletalAnimation;
        skeletonAnimation.useBakedAnimation = true;
        skeletonAnimation.clips = clips;

        const socketNode = skeletonAnimation.createSocket('Observed');

        const state1 = skeletonAnimation.getState('Clip1') as SkeletalAnimationState;
        expect(state1).toBeInstanceOf(SkeletalAnimationState);
        const state2 = skeletonAnimation.getState('Clip2') as SkeletalAnimationState;
        expect(state2).toBeInstanceOf(SkeletalAnimationState);

        expect(switchClipMock).toBeCalledTimes(0);
        
        state1.sample();
        expect(switchClipMock).toBeCalledTimes(1);
        expect(socketNode.position.x).toBe(1.2);
        game.step();

        state1.setTime(0.3);
        state1.sample();
        expect(switchClipMock).toBeCalledTimes(1);
        switchClipMock.mockClear();
        game.step();

        state2.setTime(0.9);
        state2.sample();
        expect(switchClipMock).toBeCalledTimes(1);
        state1.sample();
        expect(switchClipMock).toBeCalledTimes(2);
        game.step();
    });

    test('Communication with SkinnedMeshRenderer', () => {
        const scene = new Scene('Scene');
        director.runSceneImmediate(scene);

        const parentNode = new Node('0');
        scene.addChild(parentNode);

        const n_0_0 = new Node('0-0');
        parentNode.addChild(n_0_0);

        const siblingNode = new Node('0-1');
        parentNode.addChild(siblingNode);

        const anotherChildNode = new Node('0-0-1');
        n_0_0.addChild(anotherChildNode);

        const animation_0_0 = n_0_0.addComponent(SkeletalAnimation) as SkeletalAnimation;
        const animationAddUserMock = animation_0_0.notifySkinnedMeshAdded =
            jest.fn(SkeletalAnimation.prototype.notifySkinnedMeshAdded);
        const animationRemoveUserMock = animation_0_0.notifySkinnedMeshRemoved =
            jest.fn(SkeletalAnimation.prototype.notifySkinnedMeshRemoved);

        const mockSkinSetUseBakedAnimation = (skinnedMeshRenderer: SkinnedMeshRenderer) => {
            return skinnedMeshRenderer.setUseBakedAnimation =
                jest.fn(SkinnedMeshRenderer.prototype.setUseBakedAnimation);
        };

        const childNode = new Node('Child');
        const childSkin = childNode.addComponent(SkinnedMeshRenderer) as SkinnedMeshRenderer;
        childSkin.skinningRoot = n_0_0;
        n_0_0.addChild(childNode);
        const childSkinSetUseBakedAnimationMock = mockSkinSetUseBakedAnimation(childSkin);
        expect(animationAddUserMock).toBeCalledTimes(1);
        expect(animationAddUserMock.mock.calls[0][0]).toBe(childSkin);
        animationAddUserMock.mockClear();

        // Another child's skin
        const anotherChildSkin = anotherChildNode.addComponent(SkinnedMeshRenderer) as SkinnedMeshRenderer;
        anotherChildSkin.skinningRoot = n_0_0;
        const anotherChildSkinSetUseBakedAnimationMock = mockSkinSetUseBakedAnimation(anotherChildSkin);
        expect(animationAddUserMock).toBeCalledTimes(1);
        expect(animationAddUserMock.mock.calls[0][0]).toBe(anotherChildSkin);
        animationAddUserMock.mockClear();

        // Sibling's skin
        const siblingSkin = siblingNode.addComponent(SkinnedMeshRenderer) as SkinnedMeshRenderer;
        const siblingSkinSetUseBakedAnimationMock = mockSkinSetUseBakedAnimation(siblingSkin);
        siblingSkin.skinningRoot = n_0_0;
        expect(animationAddUserMock).toBeCalledTimes(0);

        // Parent's skin
        const parentSkin = siblingNode.addComponent(SkinnedMeshRenderer) as SkinnedMeshRenderer;
        const parentSkinSetUseBakedAnimationMock = mockSkinSetUseBakedAnimation(parentSkin);
        parentSkin.skinningRoot = n_0_0;
        expect(animationAddUserMock).toBeCalledTimes(0);

        // Assigning to the skinning root cause `setUseBakedAnimation` to be called.
        childSkin.skinningRoot = n_0_0;
        expect(childSkinSetUseBakedAnimationMock).toBeCalledTimes(1);
        expect(childSkinSetUseBakedAnimationMock.mock.calls[0][0]).toBe(true);
        childSkinSetUseBakedAnimationMock.mockClear();

        // Change to the animation's bake option. Skins are notified.
        animation_0_0.useBakedAnimation = true;
        expect(childSkinSetUseBakedAnimationMock).toBeCalledTimes(1);
        expect(childSkinSetUseBakedAnimationMock.mock.calls[0][0]).toBe(true);
        childSkinSetUseBakedAnimationMock.mockClear();
        expect(anotherChildSkinSetUseBakedAnimationMock).toBeCalledTimes(1);
        expect(anotherChildSkinSetUseBakedAnimationMock.mock.calls[0][0]).toBe(true);
        anotherChildSkinSetUseBakedAnimationMock.mockClear();

        expect(siblingSkinSetUseBakedAnimationMock).toBeCalledTimes(0);
        expect(parentSkinSetUseBakedAnimationMock).toBeCalledTimes(0);

        anotherChildSkin.destroy();
        CCObject._deferredDestroy();
        expect(animationRemoveUserMock).toBeCalledTimes(1);
        expect(animationRemoveUserMock.mock.calls[0][0]).toBe(anotherChildSkin);
        animationRemoveUserMock.mockClear();
        expect(anotherChildSkinSetUseBakedAnimationMock).toBeCalledTimes(1);
        expect(anotherChildSkinSetUseBakedAnimationMock.mock.calls[0][0]).toBe(false);
        anotherChildSkinSetUseBakedAnimationMock.mockClear();

        // Once the animation is destroyed, the skinned are reset to non-bake mode.
        animation_0_0.destroy();
        CCObject._deferredDestroy();
        expect(childSkinSetUseBakedAnimationMock).toBeCalledTimes(1);
        expect(childSkinSetUseBakedAnimationMock.mock.calls[0][0]).toBe(false);
        childSkinSetUseBakedAnimationMock.mockClear();

        {
            const animation_0_0_new = n_0_0.addComponent(SkeletalAnimation) as SkeletalAnimation;
            expect(childSkinSetUseBakedAnimationMock).toBeCalledTimes(1);
            expect(childSkinSetUseBakedAnimationMock.mock.calls[0][0]).toBe(true);
            childSkinSetUseBakedAnimationMock.mockClear();
        };

        scene.destroy();
    });
});