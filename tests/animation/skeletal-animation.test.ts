
import { SkeletalAnimationState } from '../../cocos/3d/skeletal-animation/skeletal-animation-state';
import { SkeletalAnimation } from '../../cocos/3d/skeletal-animation/skeletal-animation';
import { CCObject } from '../../cocos/core';
import { AnimationClip } from '../../cocos/animation/animation-clip';
import { VectorTrack } from '../../cocos/animation/animation';
import { JointAnimationInfo } from '../../cocos/3d/skeletal-animation/skeletal-animation-utils';
import { SkinnedMeshRenderer } from '../../cocos/3d/skinned-mesh-renderer';
import { Node, Scene } from '../../cocos/scene-graph';
import { director, game } from '../../cocos/game';
import { SkinningModel } from '../../cocos/3d/models/skinning-model';
import { Mesh, Skeleton } from '../../cocos/3d';
import { BakedSkinningModel } from '../../cocos/3d/models/baked-skinning-model';

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
        const childSkinSetUseBakedAnimationMock = mockSkinSetUseBakedAnimation(childSkin);
        childSkin.skinningRoot = n_0_0;
        n_0_0.addChild(childNode);
        expect(animationAddUserMock).toBeCalledTimes(1);
        expect(animationAddUserMock.mock.calls[0][0]).toBe(childSkin);
        animationAddUserMock.mockClear();
        
        // Assigning to the skinning root cause `setUseBakedAnimation` to be called.
        expect(childSkinSetUseBakedAnimationMock).toBeCalledTimes(1);
        expect(childSkinSetUseBakedAnimationMock.mock.calls[0][0]).toBe(true);
        childSkinSetUseBakedAnimationMock.mockClear();

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

        // Change to the animation's bake option. Skins are notified.
        animation_0_0.useBakedAnimation = false;
        expect(childSkinSetUseBakedAnimationMock).toBeCalledTimes(1);
        expect(childSkinSetUseBakedAnimationMock.mock.calls[0][0]).toBe(false);
        childSkinSetUseBakedAnimationMock.mockClear();
        expect(anotherChildSkinSetUseBakedAnimationMock).toBeCalledTimes(1);
        expect(anotherChildSkinSetUseBakedAnimationMock.mock.calls[0][0]).toBe(false);
        anotherChildSkinSetUseBakedAnimationMock.mockClear();

        // Change to the animation's bake option. Skins are notified.(Test again)
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

    test('Change to setUseBakedAnimation', () => {
        const node = new Node();
        const skeletalAnimation = node.addComponent(SkeletalAnimation) as SkeletalAnimation;
        skeletalAnimation.clips = [new AnimationClip('Anim')];
        let state = skeletalAnimation.getState('Anim');

        skeletalAnimation.useBakedAnimation = true;
        expect(skeletalAnimation.getState('Anim') === state);

        skeletalAnimation.useBakedAnimation = false;
        expect(skeletalAnimation.getState('Anim') !== state);
        state = skeletalAnimation.getState('Anim');

        skeletalAnimation.useBakedAnimation = true;
        expect(skeletalAnimation.getState('Anim') !== state);
        state = skeletalAnimation.getState('Anim');
    });
});

describe('Skeletal animation component', () => {
    test('Bugfix cocos/cocos-engine#11507 - Activation/Inactivation should resume/pause animation', () => {
        const clip = new AnimationClip('meow');
        clip.duration = 1.0;
        const node = new Node();
        const skeletalAnimation = node.addComponent(SkeletalAnimation) as SkeletalAnimation;
        skeletalAnimation.clips = [clip];
        const scene = new Scene('');
        scene.addChild(node);
        director.runSceneImmediate(scene);

        const state = skeletalAnimation.getState('meow');

        skeletalAnimation.play('meow');
        expect(state.isPlaying && !state.isPaused).toBe(true);
        skeletalAnimation.enabled = false;
        expect(state.isPlaying && state.isPaused).toBe(true);
        skeletalAnimation.enabled = true;
        expect(state.isPlaying && !state.isPaused).toBe(true);
    });

    test('Bugfix - Inactivated skeletal animation components shall not affect skinned mesh renderers', () => {
        const node = new Node();
        const skeletalAnimation = node.addComponent(SkeletalAnimation) as SkeletalAnimation;
        skeletalAnimation.enabled = false;
        const skinnedMeshRenderer = node.addComponent(SkinnedMeshRenderer) as SkinnedMeshRenderer;
        skinnedMeshRenderer.skinningRoot = node;

        const scene = new Scene('');
        scene.addChild(node);

        director.runSceneImmediate(scene);
        // The skinned mesh renderer shall not being in baked mode.
        expect(skinnedMeshRenderer.model).not.toBeInstanceOf(BakedSkinningModel);

        // While skeletal animation is activated, the skinned mesh renderer should be turned into baked mode.
        skeletalAnimation.enabled = true;
        director.tick(0.2);
        expect(skinnedMeshRenderer.model).toBeInstanceOf(BakedSkinningModel);
    });
  
    describe(`useBakedAnimation`, () => {
        test.each([
            [true],
            [false],
        ] as [use: boolean][])(`useBakedAnimation: %s`, (
            use,
        ) => {
            const clip = new AnimationClip('meow');
            clip.duration = 1.0;

            const node = new Node();

            const skinnedMeshRenderer = node.addComponent(SkinnedMeshRenderer) as SkinnedMeshRenderer;
            skinnedMeshRenderer.mesh = new Mesh();
            skinnedMeshRenderer.skeleton = new Skeleton();
            skinnedMeshRenderer.skinningRoot = node;

            const skeletalAnimation = node.addComponent(SkeletalAnimation) as SkeletalAnimation;
            skeletalAnimation.clips = [clip];

            skeletalAnimation.useBakedAnimation = use;
            expect(skeletalAnimation.useBakedAnimation).toBe(use);

            const scene = new Scene('Scene');
            scene.addChild(node);

            director.runSceneImmediate(scene);

            if (use) {
                expect(skinnedMeshRenderer.model).toBeInstanceOf(BakedSkinningModel);
            } else {
                expect(skinnedMeshRenderer.model).toBeInstanceOf(SkinningModel);
            }
        });
    });
});