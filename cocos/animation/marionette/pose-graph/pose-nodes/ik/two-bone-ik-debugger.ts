import { MeshRenderer } from '../../../../../3d';
import { createMesh } from '../../../../../3d/misc';
import { Material } from '../../../../../asset/assets';
import { Color, Vec3 } from '../../../../../core';
import { legacyCC } from '../../../../../core/global-exports';
import { PrimitiveMode } from '../../../../../gfx';
import { Node } from '../../../../../scene-graph';

export class TwoBoneIKDebugger {
    constructor () {
        const node = new Node();
        legacyCC.director.getScene().addChild(node);

        const meshRenderer = node.addComponent(MeshRenderer);
        meshRenderer.material = ((): Material => {
            const material = new Material();
            material.reset({
                effectName: 'builtin-unlit',
                states: {
                    primitive: PrimitiveMode.LINE_LIST,
                },
                defines: {
                    USE_VERTEX_COLOR: true,
                },
            });
            return material;
        })();

        this._node = node;
        this._meshRenderer = meshRenderer;
    }

    public draw (a: Readonly<Vec3>, b: Readonly<Vec3>, c: Readonly<Vec3>): void {
        const color1 = Color.RED;
        const color2 = Color.BLUE;
        const positions: number[] = [
            a.x, a.y, a.z,
            b.x, b.y, b.z,
            b.x, b.y, b.z,
            c.x, c.y, c.z,
        ];
        const colors: number[] = [
            color1.x, color1.y, color1.z, color1.w,
            color1.x, color1.y, color1.z, color1.w,
            color2.x, color2.y, color2.z, color2.w,
            color2.x, color2.y, color2.z, color2.w,
        ];
        const mesh = createMesh({
            positions,
            colors,
            primitiveMode: PrimitiveMode.LINE_LIST,
        });
        this._meshRenderer.mesh = mesh;
    }

    private _node: Node;
    private _meshRenderer: MeshRenderer;
}

// eslint-disable-next-line @typescript-eslint/ban-types
const debuggerMap = new WeakMap<object, TwoBoneIKDebugger>();

export function debugTwoBoneIKDraw (
    key: unknown,
    a: Readonly<Vec3>, b: Readonly<Vec3>, c: Readonly<Vec3>,
): void {
    if (typeof key !== 'object' || !key) {
        return;
    }
    let ikDebugger = debuggerMap.get(key);
    if (!ikDebugger) {
        ikDebugger = new TwoBoneIKDebugger();
        debuggerMap.set(key, ikDebugger);
    }
    ikDebugger.draw(a, b, c);
}
