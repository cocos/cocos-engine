import { ccclass, property } from '../../../platform/CCClassDecorator';
import Enum from '../../../platform/CCEnum';
import { lerp, pseudoRandom, repeat } from '../../../vmath';
import CurveRange from './curve-range';

// tslint:disable: max-line-length
const TEXTURE_ANIMATION_RAND_OFFSET = 90794;

/**
 * 粒子贴图动画类型
 * @enum textureAnimationModule.Mode
 */
const Mode = Enum({
    /**
     * 网格类型
     */
    Grid: 0,

    /**
     * 精灵类型（暂未支持）
     */
    //Sprites: 1,
});

/**
 * 贴图动画的播放方式
 * @enum textureAnimationModule.Animation
 */
const Animation = Enum({
    /**
     * 播放贴图中的所有帧
     */
    WholeSheet: 0,

    /**
     * 播放贴图中的其中一行动画
     */
    SingleRow: 1,
});

@ccclass('cc.TextureAnimationModule')
export default class TextureAnimationModule {

    @property
    _enable = false;

    /**
     * @zh 是否启用。
     */
    @property
    get enable () {
        return this._enable;
    }

    set enable (val) {
        this._enable = val;
        this.ps._assembler._updateMaterialParams();
    }

    _mode = Mode.Grid;

    /**
     * @zh 设定粒子贴图动画的类型（暂只支持 Grid 模式）[[Mode]]。
     */
    @property({
        type: Mode,
    })
    get mode () {
        return this._mode;
    }

    set mode (val) {
        if (val !== Mode.Grid) {
            console.error('particle texture animation\'s sprites is not supported!');
            return;
        }
    }

    /**
     * @zh X 方向动画帧数。
     */
    @property
    numTilesX = 0;

    /**
     * @zh Y 方向动画帧数。
     */
    @property
    numTilesY = 0;

    /**
     * @zh 动画播放方式 [[Animation]]。
     */
    @property({
        type: Animation,
    })
    animation = Animation.WholeSheet;

    /**
     * @zh 随机从动画贴图中选择一行以生成动画。<br>
     * 此选项仅在动画播放方式为 SingleRow 时生效。
     */
    @property
    randomRow = false;

    /**
     * @zh 从动画贴图中选择特定行以生成动画。<br>
     * 此选项仅在动画播放方式为 SingleRow 时且禁用 randomRow 时可用。
     */
    @property
    rowIndex = 0;

    /**
     * @zh 一个周期内动画播放的帧与时间变化曲线。
     */
    @property({
        type: CurveRange,
    })
    frameOverTime = new CurveRange();

    /**
     * @zh 从第几帧开始播放，时间为整个粒子系统的生命周期。
     */
    @property({
        type: CurveRange,
    })
    startFrame = new CurveRange();

    /**
     * @zh 一个生命周期内播放循环的次数。
     */
    @property
    cycleCount = 0;

    _flipU = 0;

    @property
    get flipU () {
        return this._flipU;
    }

    set flipU (val) {
        console.error('particle texture animation\'s flipU is not supported!');
    }

    _flipV = 0;

    @property
    get flipV () {
        return this._flipV;
    }

    set flipV (val) {
        console.error('particle texture animation\'s flipV is not supported!');
    }

    _uvChannelMask = -1;

    @property
    get uvChannelMask () {
        return this._uvChannelMask;
    }

    set uvChannelMask (val) {
        console.error('particle texture animation\'s uvChannelMask is not supported!');
    }

    ps = null;

    onInit (ps) {
        this.ps = ps;
    }

    init (p) {
        p.startRow = Math.floor(Math.random() * this.numTilesY);
    }

    animate (p) {
        const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        const startFrame = this.startFrame.evaluate(normalizedTime, pseudoRandom(p.randomSeed + TEXTURE_ANIMATION_RAND_OFFSET)) / (this.numTilesX * this.numTilesY);
        if (this.animation === Animation.WholeSheet) {
            p.frameIndex = repeat(this.cycleCount * (this.frameOverTime.evaluate(normalizedTime, pseudoRandom(p.randomSeed + TEXTURE_ANIMATION_RAND_OFFSET)) + startFrame), 1);
        } else if (this.animation === Animation.SingleRow) {
            const rowLength = 1 / this.numTilesY;
            if (this.randomRow) {
                const f = repeat(this.cycleCount * (this.frameOverTime.evaluate(normalizedTime, pseudoRandom(p.randomSeed + TEXTURE_ANIMATION_RAND_OFFSET)) + startFrame), 1);
                const from = p.startRow * rowLength;
                const to = from + rowLength;
                p.frameIndex = lerp(from, to, f);
            } else {
                const from = this.rowIndex * rowLength;
                const to = from + rowLength;
                p.frameIndex = lerp(from, to, repeat(this.cycleCount * (this.frameOverTime.evaluate(normalizedTime, pseudoRandom(p.randomSeed + TEXTURE_ANIMATION_RAND_OFFSET)) + startFrame), 1));
            }
        }
    }
}
