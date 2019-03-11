
import Ammo from 'ammo.js';
import { Color, Vec3 } from '../../../core/value-types';
import { vec3 } from '../../../core/vmath';
import { GFXComparisonFunc, GFXPrimitiveMode } from '../../../gfx/define';
import { Node } from '../../../scene-graph';
import { Material } from '../../assets/material';
import { Mesh } from '../../assets/mesh';
import { ModelComponent } from '../../framework';
import { createMesh } from '../../misc/utils';
import { IGeometry } from '../../primitive/define';

interface IDebugVertex {
    position: Vec3;
    color: Vec3;
}

export class Debugger implements Ammo.btIDebugDraw {
    private _node: Node | null = null;
    private _debugMode = defaultDebugDrawMode;
    private _iVertex = 0;
    private _positions: number[] = [];
    private _maxPos: Vec3 = new Vec3();
    private _minPos: Vec3 = new Vec3();
    private _colors: number[] = [];
    private _modelComponent: ModelComponent | null = null;
    private _mesh: Mesh | null = null;
    private _ammoDebugDrawer: Ammo.DebugDrawer;
    private _tmpExtents: Vec3 = new Vec3();
    private _tmpVertex: IDebugVertex = {
        position: new Vec3(),
        color: new Vec3(),
    };

    constructor () {
        this.clear();

        this._ammoDebugDrawer = new Ammo.DebugDrawer();
        this._ammoDebugDrawer.drawLine = this.drawLine.bind(this);
        this._ammoDebugDrawer.drawContactPoint = this.drawContactPoint.bind(this);
        this._ammoDebugDrawer.reportErrorWarning = this.reportErrorWarning.bind(this);
        this._ammoDebugDrawer.draw3dText = this.draw3dText.bind(this);
        this._ammoDebugDrawer.setDebugMode = this.setDebugMode.bind(this);
        this._ammoDebugDrawer.getDebugMode = this.getDebugMode.bind(this);
    }

    public get avaiable () {
        return this._node !== null;
    }

    public get ammoDrawDebugger () {
        return this._ammoDebugDrawer;
    }

    public bind (node: Node) {
        this._node = node;
        this._modelComponent = node.addComponent(ModelComponent);
        if (this._modelComponent) {
            const material = new Material();
            material.initialize({
                effectName: 'builtin-unlit',
                defines: {
                    USE_COLOR: true,
                },
            });
            material.setProperty('color', new Color(0, 255, 0, 255));
            material.overridePipelineStates({
                primitive: cc.GFXPrimitiveMode.LINE_LIST,
                // depthStencilState: {
                //     depthFunc: GFXComparisonFunc.LESS_EQUAL,
                // },
            });
            this._modelComponent.sharedMaterials = [ material ];
        }
    }

    public clear () {
        this._iVertex = 0;
        this._positions.length = 0;
        this._colors.length = 0;
        vec3.set(this._maxPos, -Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
        vec3.set(this._minPos, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        if (this._mesh) {
            this._mesh.destroy();
            this._mesh = null;
        }
        if (this._modelComponent) {
            this._modelComponent.mesh = null;
        }
    }

    public present () {
        if (!this._modelComponent) {
            return;
        }
        this._modelComponent.mesh = null;

        if (this._iVertex === 0) {
            return;
        }
        const extents = this._tmpExtents;
        vec3.subtract(extents, this._maxPos, this._minPos);
        const boundingRadius = Math.max(extents.x, Math.max(extents.y, extents.z)) / 2;
        const geometry: IGeometry = {
            positions: this._positions,
            colors: this._colors,
            minPos: this._minPos,
            maxPos: this._maxPos,
            boundingRadius,
            primitiveMode: GFXPrimitiveMode.LINE_LIST,
        };
        this._mesh = createMesh(geometry);
        this._modelComponent.mesh = this._mesh;
    }

    public drawLine (pfrom: Ammo.Pointer, pto: Ammo.Pointer, pcolor: Ammo.Pointer) {
        const from = Ammo.wrapPointer<Ammo.btVector3>(pfrom, Ammo.btVector3);
        const to = Ammo.wrapPointer<Ammo.btVector3>(pto, Ammo.btVector3);
        const color = Ammo.wrapPointer<Ammo.btVector3>(pcolor, Ammo.btVector3);
        vec3.set(this._tmpVertex.color, color.x(), color.y(), color.z());
        vec3.set(this._tmpVertex.position, from.x(), from.y(), from.z());
        this._addVertex(this._tmpVertex);
        vec3.set(this._tmpVertex.position, to.x(), to.y(), to.z());
        this._addVertex(this._tmpVertex);
    }

    public drawContactPoint (pointOnB: Ammo.Pointer, normalOnB: Ammo.Pointer, distance: number, liftTime: number, color: Ammo.Pointer) {

    }

    public reportErrorWarning (warningString: string): void {
        console.warn(`[Bullet warning]::${warningString}`);
    }

    public draw3dText (location: Ammo.Pointer, textString: string): void {

    }

    public setDebugMode (debugMode: number): void {
        this._debugMode = debugMode;
    }

    public getDebugMode (): number {
        return this._debugMode;
    }

    private _addVertex (vertex: IDebugVertex) {
        ++this._iVertex;
        const { position, color } = vertex;
        vec3.max(this._maxPos, this._maxPos, position);
        vec3.min(this._minPos, this._minPos, position);
        this._positions.push(position.x, position.y, position.z);
        this._colors.push(color.x, color.y, color.z, 1.0);
    }
}

export enum DebugDrawModes {
    DBG_NoDebug = 0,
    DBG_DrawWireframe = 1,
    DBG_DrawAabb = 2,
    DBG_DrawFeaturesText = 4,
    DBG_DrawContactPoints = 8,
    DBG_NoDeactivation = 16,
    DBG_NoHelpText = 32,
    DBG_DrawText = 64,
    DBG_ProfileTimings = 128,
    DBG_EnableSatComparison = 256,
    DBG_DisableBulletLCP = 512,
    DBG_EnableCCD = 1024,
    DBG_DrawConstraints = (1 << 11),
    DBG_DrawConstraintLimits = (1 << 12),
    DBG_FastWireframe = (1 << 13),
    DBG_DrawNormals = (1 << 14),
    DBG_DrawFrames = (1 << 15),
    DBG_MAX_DEBUG_DRAW_MODE,
}

// const defaultDebugDrawMode = DebugDrawModes.DBG_NoDebug;
const defaultDebugDrawMode = DebugDrawModes.DBG_DrawWireframe | DebugDrawModes.DBG_DrawAabb;
