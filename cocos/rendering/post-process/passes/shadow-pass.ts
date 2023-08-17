import { Camera } from '../../../render-scene/scene';
import { buildShadowPasses, getCameraUniqueID } from '../../custom/define';
import { Pipeline } from '../../custom/pipeline';
import { passContext } from '../utils/pass-context';
import { BasePass } from './base-pass';

export class ShadowPass extends BasePass {
    name = 'ShadowPass';

    mainLightShadows: string[] = [];
    spotLightShadows: string[] = [];

    public render (camera: Camera, ppl: Pipeline): void {
        passContext.shadowPass = this;

        const cameraID = getCameraUniqueID(camera);
        const cameraName = `Camera${cameraID}`;
        const shadowInfo = buildShadowPasses(cameraName, camera, ppl);

        this.mainLightShadows = shadowInfo.mainLightShadowNames;
        this.spotLightShadows = shadowInfo.spotLightShadowNames;
    }
}
