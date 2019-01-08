import { repeat, lerp, pseudoRandom } from "../../../../core/vmath";
import { Enum } from "../../../../core/value-types";
import CurveRange from "./curve-range";
import { CCClass } from "../../../../core/data";
import { property, ccclass } from "../../../../core/data/class-decorator";

const TEXTURE_ANIMATION_RAND_OFFSET = 90794;

const Mode = Enum({
    Grid: 0,
    Sprites: 1
});

const Animation = Enum({
    WholeSheet: 0,
    SingleRow: 1
});

@ccclass('cc.TextureAnimationModule')
export default class TextureAnimationModule {

    @property
    _enable = false;

    get enable() {
        return this._enable;
    }

    set enable(val) {
        this._enable = val;
        this.ps.renderer._updateMaterialParams();
    }

    @property
    _mode = Mode.Grid

    get mode() {
        return this._mode;
    }

    set mode(val) {
        if (val === Mode.Sprites) {
            console.error("particle texture animation's sprites is not supported!");
            return;
        }
    }

    @property
    numTilesX = 0;

    @property
    numTilesY = 0;

    @property
    animation = Animation.WholeSheet;

    @property({
        type: CurveRange
    })
    frameOverTime = new CurveRange();

    @property({
        type: CurveRange
    })
    startFrame = new CurveRange();

    @property
    cycleCount = 0;

    @property
    _flipU = 0;

    get flipU() {
        return this._flipU;
    }

    set flipU(val) {
        console.error("particle texture animation's flipU is not supported!");
    }

    @property
    _flipV = 0;

    get flipV() {
        return this._flipV;
    }

    set flipV(val) {
        console.error("particle texture animation's flipV is not supported!");
    }

    @property
    _uvChannelMask = -1

    get uvChannelMask() {
        return this._uvChannelMask;
    }

    set uvChannelMask(val) {
        console.error("particle texture animation's uvChannelMask is not supported!");
    }

    @property
    randomRow = false;

    @property
    rowIndex = 0;

    onInit(ps) {
        this.ps = ps;
    }

    animate(p) {
        let normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        let startFrame = this.startFrame.evaluate(normalizedTime, pseudoRandom(p.randomSeed + TEXTURE_ANIMATION_RAND_OFFSET)) / (this.numTilesX * this.numTilesY);
        if (this.animation == Animation.WholeSheet) {
            p.frameIndex = repeat(this.cycleCount * (this.frameOverTime.evaluate(normalizedTime, pseudoRandom(p.randomSeed + TEXTURE_ANIMATION_RAND_OFFSET)) + startFrame), 1);
        }
        else if (this.animation == Animation.SingleRow) {
            let rowLength = 1 / this.numTilesY;
            if (this._randomRow) {
                let f = repeat(this.cycleCount * (this.frameOverTime.evaluate(normalizedTime, pseudoRandom(p.randomSeed + TEXTURE_ANIMATION_RAND_OFFSET)) + startFrame), 1);
                let startRow = Math.floor(Math.random() * this.numTilesY);
                let from = startRow * rowLength;
                let to = from + rowLength;
                p.frameIndex = lerp(from, to, f);
            }
            else {
                let from = this.rowIndex * rowLength;
                let to = from + rowLength;
                p.frameIndex = lerp(from, to, repeat(this.cycleCount * (this.frameOverTime.evaluate(normalizedTime, pseudoRandom(p.randomSeed + TEXTURE_ANIMATION_RAND_OFFSET)) + startFrame), 1));
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
