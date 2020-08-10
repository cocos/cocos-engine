import { property, ccclass } from '../../data/class-decorator';
import { Color, Vec3 } from '../../math';

@ccclass('cc.Ambient')
export class Ambient {
    public static SUN_ILLUM = 65000.0;
    public static SKY_ILLUM = 20000.0;

    get colorArray () {
        return this._colorArray;
    }

    get albedoArray () {
        return this._albedoArray;
    }

    /**
     * @en Enable ambient
     * @zh 是否开启环境光
     */
    @property
    set enabled (val) {
        this._enabled = val;
    }
    get enabled () {
        return this._enabled;
    }
    /**
     * @en Sky color
     * @zh 天空颜色
     */
    @property({ type: Color })
    get skyColor (): Color {
        return this._skyColor;
    }

    set skyColor (color: Color) {
        this._skyColor = color;
        Color.toArray(this._colorArray, this._skyColor);
    }

    /**
     * @en Sky illuminance
     * @zh 天空亮度
     */
    @property
    get skyIllum (): number {
        return this._skyIllum;
    }

    set skyIllum (illum: number) {
        this._skyIllum = illum;
    }

    /**
     * @en Ground color
     * @zh 地面颜色
     */
    @property({ type: Color })
    get groundAlbedo (): Color {
        return this._groundAlbedo;
    }

    set groundAlbedo (color: Color) {
        this._groundAlbedo = color;
        Vec3.toArray(this._albedoArray, this._groundAlbedo);
    }

    protected _enabled = true;
    @property
    protected _skyColor = new Color(51, 128, 204, 1.0);
    @property
    protected _skyIllum: number = Ambient.SKY_ILLUM;
    @property
    protected _groundAlbedo = new Color(51, 51, 51, 255);

    protected _albedoArray = Float32Array.from([0.2, 0.2, 0.2, 1.0]);
    protected _colorArray = Float32Array.from([0.2, 0.5, 0.8, 1.0]);

    constructor () {
        Color.toArray(this._colorArray, this._skyColor);
    }

    public update () {}
}
