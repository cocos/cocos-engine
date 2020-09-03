import { Color, Vec3 } from '../../math';

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
    set enabled (val) {
        if (this._enabled === val) {
            return;
        }
        this._enabled = val;
        this.activate();
    }
    get enabled () {
        return this._enabled;
    }
    /**
     * @en Sky color
     * @zh 天空颜色
     */
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
    get groundAlbedo (): Color {
        return this._groundAlbedo;
    }

    set groundAlbedo (color: Color) {
        this._groundAlbedo = color;
        Vec3.toArray(this._albedoArray, this._groundAlbedo);
    }

    protected _enabled = true;
    protected _skyColor = new Color(51, 128, 204, 1.0);

    protected _skyIllum: number = Ambient.SKY_ILLUM;

    protected _groundAlbedo = new Color(51, 51, 51, 255);
    protected _albedoArray = Float32Array.from([0.2, 0.2, 0.2, 1.0]);
    protected _colorArray = Float32Array.from([0.2, 0.5, 0.8, 1.0]);

    public activate () {
        Color.toArray(this._colorArray, this._skyColor);
        Vec3.toArray(this._albedoArray, this._groundAlbedo);
    }
}
