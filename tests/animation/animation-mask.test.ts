import { AnimationMask } from '../../cocos/animation/marionette/animation-mask';
import 'jest-extended';

test('AnimationMask', () => {
    const mask = new AnimationMask();
    expect(Array.from(mask.joints)).toStrictEqual([]);

    const getSortedJointMaskInfos = () => Array.from(mask.joints)
        .sort(({ path: a }, { path: b }) => a.localeCompare(b))
        .map((j) => [j.path, j.enabled]);

    mask.addJoint('a', true);
    mask.addJoint('a/b', true);
    mask.addJoint('a/c', false);
    mask.addJoint('b', true);
    expect(getSortedJointMaskInfos()).toStrictEqual([
        ['a', true],
        ['a/b', true],
        ['a/c', false],
        ['b', true],
    ]);

    // Remove a leaf
    mask.removeJoint('a/b');
    expect(getSortedJointMaskInfos()).toStrictEqual([
        ['a', true],
        ['a/c', false],
        ['b', true],
    ]);

    // Remove a non-leaf, the remove is not recursive
    mask.removeJoint('a');
    expect(getSortedJointMaskInfos()).toStrictEqual([
        ['a/c', false],
        ['b', true],
    ]);

    // Sets all joints, this operation will clear all old joint mask infos.
    mask.joints = (function*(): Generator<AnimationMask.JointMaskInfo> {
        yield { path: 'c', enabled: true };
        yield { path: 'd', enabled: true };
        yield { path: 'd/a', enabled: false };
    })();
    expect(getSortedJointMaskInfos()).toStrictEqual([
        ['c', true],
        ['d', true],
        ['d/a', false],
    ]);

    // Clear.
    mask.clear();
    expect(Array.from(mask.joints)).toHaveLength(0);

    // Re-add joint through `addJoint` replace the former with new value
    mask.addJoint('a', true);
    mask.addJoint('a', false);
    expect(getSortedJointMaskInfos()).toStrictEqual([
        ['a', false],
    ]);
});