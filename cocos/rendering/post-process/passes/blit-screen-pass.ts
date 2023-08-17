import { Format } from '../../../gfx';
import { Camera } from '../../../render-scene/scene';
import { Pipeline } from '../../custom/pipeline';
import { getCameraUniqueID } from '../../custom/define';
import { passContext } from '../utils/pass-context';
import { getSetting, SettingPass } from './setting-pass';

import { BlitScreen } from '../components/blit-screen';

const outputNames = ['BlitScreenColor0', 'BlitScreenColor1'];

export class BlitScreenPass extends SettingPass {
    get setting (): BlitScreen { return getSetting(BlitScreen); }

    name = 'BlitScreenPass';
    effectName = 'pipeline/post-process/blit-screen';

    outputName = outputNames[0];

    slotName (camera: Camera, index = 0): string {
        return this.outputName;
    }

    checkEnable (camera: Camera): boolean {
        const enable = super.checkEnable(camera);
        const setting = this.setting;
        return enable && (setting.activeMaterials.length > 0);
    }

    public render (camera: Camera, ppl: Pipeline): void {
        const cameraID = getCameraUniqueID(camera);

        passContext.clearBlack();

        let input0 = this.lastPass!.slotName(camera, 0);

        let slotIdx = 0;
        const materials = this.setting.activeMaterials;
        for (let i = 0; i < materials.length; i++) {
            const material = materials[i];
            passContext.material = material;

            const slotName = `${outputNames[slotIdx]}${cameraID}`;
            slotIdx = (++slotIdx) % 2;

            passContext
                .updatePassViewPort()
                .addRenderPass('post-process', `${this.name}${cameraID}${slotIdx}`)
                .setPassInput(input0, 'inputTexture')
                .addRasterView(slotName, Format.RGBA8)
                .blitScreen(0)
                .version();

            input0 = slotName;
        }

        this.outputName = input0;
    }
}
