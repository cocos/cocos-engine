import { ccclass, property } from '../../../platform/CCClassDecorator';
import Enum from '../../../platform/CCEnum';
import { lerp, pseudoRandom, repeat } from '../../../value-types';
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

/**
 * !#en The texture animation module of 3d particle.
 * !#zh 3D 粒子的贴图动画模块
 * @class TextureAnimationModule
 */
@ccclass('cc.TextureAnimationModule')
export default class TextureAnimationModule {

    @property
    _enable = false;

    /**
     * !#en The enable of TextureAnimationModule.
     * !#zh 是否启用
     * @property {Boolean} enable
     */
    @property
    get enable () {
        return this._enable;
    }

    set enable (val) {
        this._enable = val;
        this.ps._assembler._updateMaterialParams();
    }

    @property
    _mode = Mode.Grid;

    /**
     * !#en Set the type of particle map animation (only supports Grid mode for the time being)
     * !#zh 设定粒子贴图动画的类型（暂只支持 Grid 模式。
     * @property {Mode} mode
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
    @property
    _numTilesX = 0;
    /**
     * !#en Animation frames in X direction.
     * !#zh X 方向动画帧数。
     * @property {Number} numTilesX
     */
    @property
    get numTilesX () {
        return this._numTilesX;
    };

    set numTilesX (val) {
        if (this._numTilesX === val) return;
        this._numTilesX = val;
        if (this.ps && this.ps._assembler) this.ps._assembler._updateMaterialParams();
    }


    @property
    _numTilesY = 0;
    /**
     * !#en Animation frames in Y direction.
     * !#zh Y 方向动画帧数。
     * @property {Number} numTilesY
     */
    @property
    get numTilesY () {
        return this._numTilesY;
    }

    set numTilesY (val) {
        if (this._numTilesY === val) return;
        this._numTilesY = val;
        if (this.ps && this.ps._assembler) this.ps._assembler._updateMaterialParams();
    }

    /**
     * !#en The way of the animation plays.
     * !#zh 动画播放方式。
     * @property {Animation} animation
     */
    @property({
        type: Animation,
    })
    animation = Animation.WholeSheet;

    /**
     * !#en Randomly select a line from the animated map to generate the animation. <br>
     * This option only takes effect when the animation playback mode is SingleRow.
     * !#zh 随机从动画贴图中选择一行以生成动画。<br>
     * 此选项仅在动画播放方式为 SingleRow 时生效。
     * @property {Boolean} randomRow
     */
    @property
    randomRow = false;

    /**
     * !#en Select specific lines from the animation map to generate the animation. <br>
     * This option is only available when the animation playback mode is SingleRow and randomRow is disabled.
     * !#zh 从动画贴图中选择特定行以生成动画。<br>
     * 此选项仅在动画播放方式为 SingleRow 时且禁用 randomRow 时可用。
     * @property {Number} rowIndex
     */
    @property
    rowIndex = 0;

    /**
     * !#en Frame and time curve of animation playback in one cycle.
     * !#zh 一个周期内动画播放的帧与时间变化曲线。
     * @property {CurveRange} frameOverTime
     */
    @property({
        type: CurveRange,
    })
    frameOverTime = new CurveRange();

    /**
     * !#en Play from which frames, the time is the life cycle of the entire particle system.
     * !#zh 从第几帧开始播放，时间为整个粒子系统的生命周期。
     * @property {CurveRange} startFrame
     */
    @property({
        type: CurveRange,
    })
    startFrame = new CurveRange();

    /**
     * !#en Number of playback loops in a life cycle.
     * !#zh 一个生命周期内播放循环的次数。
     * @property {Number} cycleCount
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
