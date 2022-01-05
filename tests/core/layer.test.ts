import { Layers } from '../../cocos/core/scene-graph';

test('Layer', () => {
    expect(Layers.Enum.ALL).toBe(0x7fffffff);
    expect(Layers.Enum.UI_2D).toBe(1 << 25);
    expect(Layers.Enum.GIZMOS | Layers.Enum.DEFAULT).toBe(1 << 30 | 1 << 21);
    expect(Layers.BitMask.IGNORE_RAYCAST).toBe(1 << 20);
    expect(Layers.BitMask.UI_3D).toBe(1 << 23);
    expect(Layers.BitMask.PROFILER | Layers.BitMask.EDITOR).toBe(1 << 22 | 1 << 28);
    expect(Layers.Enum.SCENE_GIZMO).toBe(Layers.BitMask.SCENE_GIZMO);
    expect(Layers.Enum.GIZMOS).toBe(Layers.BitMask.GIZMOS);
});

test('make mask', () => {
    const layerMask = Layers.makeMaskInclude([ Layers.Enum.UI_2D, Layers.Enum.EDITOR, Layers.Enum.SCENE_GIZMO ]);
    expect(layerMask).toBe(Layers.Enum.UI_2D | Layers.Enum.EDITOR | Layers.Enum.SCENE_GIZMO);

    const customLayerMask = Layers.makeMaskInclude([ 0x652df2a0, 0x56ba324c, 0x2346be52 ]);
    expect(customLayerMask).toBe(0x77fffefe);

    const layerMask2 = Layers.makeMaskExclude([ Layers.Enum.UI_3D, Layers.Enum.PROFILER ]);
    expect(layerMask2).toBe(Layers.Enum.ALL ^ (Layers.Enum.UI_3D | Layers.Enum.PROFILER));

    const layerMask3 = Layers.makeMaskExclude([ 0x0300f105, 0x2000a420, 0x000a4001, 0x5001c234 ]);
    expect(layerMask3).toBe(0x0CF408CA);
});

test('layer operate', () => {
    expect(Layers.nameToLayer('DEFAULT')).toBe(30);
    expect(Layers.layerToName(25)).toBe('UI_2D');

    Layers.addLayer('test', 10);
    expect(Layers.Enum['test']).toBe(1 << 10);
    expect(Layers.BitMask['test']).toBe(1 << 10);
    expect(Layers.nameToLayer('test')).toBe(10);
    expect(Layers.layerToName(10)).toBe('test');
    expect(Layers.makeMaskInclude([1 << Layers.nameToLayer('test')])).toBe(Layers.Enum['test']);
    Layers.deleteLayer(10);
    expect(Layers.Enum['test']).toBeFalsy();

    Layers.addLayer('test1', 1);
    let err = null;
    try {
        Layers.addLayer('2', 2);
    } catch (error) {
        err = error;
    }
    expect(Layers.Enum['2']).toBe('test1');
    expect(err).toBeTruthy();
    Layers.deleteLayer(1);

});