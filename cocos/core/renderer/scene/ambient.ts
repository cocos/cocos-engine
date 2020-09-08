import { Color, Vec3 } from '../../math';
import { AmbientPool, NULL_HANDLE, AmbientView, AmbientHandle } from '../core/memory-pools';
import { legacyCC } from '../../global-exports';

export class Ambient {
    public static SUN_ILLUM = 65000.0;
    public static SKY_ILLUM = 20000.0;

    get colorArray (): Float32Array {
        return this._colorArray;
    }

    get albedoArray (): Float32Array {
        return this._albedoArray;
    }

    /**
     * @en Enable ambient
     * @zh 是否开启环境光
     */
    set enabled (val: boolean) {
        AmbientPool.set(this._handle, AmbientView.ENABLE, val ? 1 : 0);
        this.activate();
    }
    get enabled (): boolean {
        return AmbientPool.get(this._handle, AmbientView.ENABLE) as unknown as boolean;
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
        AmbientPool.setVec4(this._handle, AmbientView.SKY_COLOR, this._skyColor);
    }

    /**
     * @en Sky illuminance
     * @zh 天空亮度
     */
    get skyIllum (): number {
        return AmbientPool.get(this._handle, AmbientView.ILLUM);
    }

    set skyIllum (illum: number) {
        AmbientPool.set(this._handle, AmbientView.ILLUM, illum);
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
        AmbientPool.setVec4(this._handle, AmbientView.GROUND_ALBEDO, this._groundAlbedo);
    }
    protected _skyColor = new Color(51, 128, 204, 1.0);
    protected _groundAlbedo = new Color(51, 51, 51, 255);
    protected _albedoArray = Float32Array.from([0.2, 0.2, 0.2, 1.0]);
    protected _colorArray = Float32Array.from([0.2, 0.5, 0.8, 1.0]);
    protected _handle: AmbientHandle = NULL_HANDLE;

    constructor () {
        this._handle = AmbientPool.alloc();
    }
    public activate () {
        Color.toArray(this._colorArray, this._skyColor);
        Vec3.toArray(this._albedoArray, this._groundAlbedo);
        AmbientPool.setVec4(this._handle, AmbientView.SKY_COLOR, this._skyColor);
        AmbientPool.setVec4(this._handle, AmbientView.GROUND_ALBEDO, this._groundAlbedo);
    }

    public destroy () {
        if (this._handle) {
            AmbientPool.free(this._handle);
            this._handle = NULL_HANDLE;
        }
    }
}

legacyCC.Ambient = Ambient;


