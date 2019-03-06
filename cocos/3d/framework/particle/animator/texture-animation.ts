import { repeat, lerp, pseudoRandom } from "../../../../core/vmath";
import { Enum } from "../../../../core/value-types";
import CurveRange from "./curve-range";
import { CCClass } from "../../../../core/data";
import { property, ccclass } from "../../../../core/data/class-decorator";
import { ParticleSystemComponent } from "../particle-system-component";
import Particle from "../particle";

// tslint:disable: max-line-length
const TEXTURE_ANIMATION_RAND_OFFSET = 90794;

const Mode = Enum({
    Grid: 0,
    Sprites: 1,
});

const Animation = Enum({
    WholeSheet: 0,
    SingleRow: 1,
});

@ccclass('cc.TextureAnimationModule')
export default class TextureAnimationModule {

    @property
    private _enable = false;

    @property
    get enable () {
        return this._enable;
    }

    set enable (val) {
        this._enable = val;
        this.ps!.renderer!._updateMaterialParams();
    }

    @property({
        type: Mode,
    })
    private _mode = Mode.Grid;

    @property({
        type: Mode,
    })
    get mode () {
        return this._mode;
    }

    set mode (val) {
        if (val === Mode.Sprites) {
            console.error("particle texture animation's sprites is not supported!");
            return;
        }
    }

    @property
    public numTilesX = 0;

    @property
    public numTilesY = 0;

    @property({
        type: Animation,
    })
    public animation = Animation.WholeSheet;

    @property({
        type: CurveRange,
    })
    public frameOverTime = new CurveRange();

    @property({
        type: CurveRange,
    })
    public startFrame = new CurveRange();

    @property
    public cycleCount = 0;

    @property
    private _flipU = 0;

    get flipU () {
        return this._flipU;
    }

    set flipU (val) {
        console.error("particle texture animation's flipU is not supported!");
    }

    @property
    private _flipV = 0;

    get flipV () {
        return this._flipV;
    }

    set flipV (val) {
        console.error("particle texture animation's flipV is not supported!");
    }

    @property
    private _uvChannelMask = -1;

    get uvChannelMask () {
        return this._uvChannelMask;
    }

    set uvChannelMask (val) {
        console.error("particle texture animation's uvChannelMask is not supported!");
    }

    @property
    public randomRow = false;

    @property
    public rowIndex = 0;

    private ps: ParticleSystemComponent | null = null;

    public onInit (ps: ParticleSystemComponent) {
        this.ps = ps;
    }

    public animate (p: Particle) {
        const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        const startFrame = this.startFrame.evaluate(normalizedTime, pseudoRandom(p.randomSeed + TEXTURE_ANIMATION_RAND_OFFSET))! / (this.numTilesX * this.numTilesY);
        if (this.animation === Animation.WholeSheet) {
            p.frameIndex = repeat(this.cycleCount * (this.frameOverTime.evaluate(normalizedTime, pseudoRandom(p.randomSeed + TEXTURE_ANIMATION_RAND_OFFSET))! + startFrame), 1);
        }
        else if (this.animation === Animation.SingleRow) {
            const rowLength = 1 / this.numTilesY;
            if (this.randomRow) {
                const f = repeat(this.cycleCount * (this.frameOverTime.evaluate(normalizedTime, pseudoRandom(p.randomSeed + TEXTURE_ANIMATION_RAND_OFFSET))! + startFrame), 1);
                const startRow = Math.floor(Math.random() * this.numTilesY);
                const from = startRow * rowLength;
                const to = from + rowLength;
                p.frameIndex = lerp(from, to, f);
            }
            else {
                const from = this.rowIndex * rowLength;
                const to = from + rowLength;
                p.frameIndex = lerp(from, to, repeat(this.cycleCount * (this.frameOverTime.evaluate(normalizedTime, pseudoRandom(p.randomSeed + TEXTURE_ANIMATION_RAND_OFFSET))! + startFrame), 1));
            }
        }
    }
}

// CCClass.fastDefine('cc.TextureAnimationModule', TextureAnimationModule, {
//     _enable: false,
//     _mode: Mode.Grid,
//     numTilesX: 0,
//     numTilesY: 0,
//     animation: Animation.WholeSheet,
//     frameOverTime: new CurveRange(),
//     startFrame: new CurveRange(),
//     cycleCount: 0,
//     _flipU: 0,
//     _flipV: 0,
//     _uvChannelMask: -1,
//     randomRow: false,
//     rowIndex: 0
// });
