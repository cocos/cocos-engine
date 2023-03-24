import { serializable, tooltip } from '../../core/data/decorators';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { ParticleDataSet } from '../particle-data-set';
import { ParticleModule } from '../particle-module';

export class SpriteRendererModule extends ParticleModule {
    @tooltip('i18n:particleSystemRenderer.velocityScale')
    public get velocityScale () {
        return this._velocityScale;
    }

    public set velocityScale (val) {
        this._velocityScale = val;
    }

    @tooltip('i18n:particleSystemRenderer.lengthScale')
    public get lengthScale () {
        return this._lengthScale;
    }

    public set lengthScale (val) {
        this._lengthScale = val;
    }

    @serializable
    private _velocityScale = 1;

    @serializable
    private _lengthScale = 1;

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        throw new Error('Method not implemented.');
    }
}
