import { EDITOR } from 'internal:constants';

import { Vec4 } from '../../../core';
import { ClearFlagBit, Format } from '../../../gfx';
import { Camera } from '../../../render-scene/scene';
import { Pipeline } from '../../custom';
import { getCameraUniqueID } from '../../custom/define';
import { passContext } from '../utils/pass-context';
import { getSetting, SettingPass } from './setting-pass';

import { BlitScreen } from '../components/blit-screen';

const outputNames = ['BlitScreenColor0', 'BlitScreenColor1'];

export class BlitScreenPass extends SettingPass {
    get setting () { return getSetting(BlitScreen); }

    name = 'BlitScreenPass'
    effectName = 'pipeline/post-process/blit-screen';

    outputName = outputNames[0]

    slotName (camera: Camera, index = 0) {
        return this.outputName;
    }

    checkEnable (camera: Camera) {
        const enable = super.checkEnable(camera);
        const setting = this.setting;
        return enable && (setting.activeMaterials.length > 0);
    }

    public render (camera: Camera, ppl: Pipeline): void {
        const cameraID = getCameraUniqueID(camera);
        const area = this.getRenderArea(camera);
        const width = area.width;
        const height = area.height;

        passContext.clearFlag = ClearFlagBit.COLOR;
        Vec4.set(passContext.clearColor, 0, 0, 0, 1);

        let input0 = this.lastPass!.slotName(camera, 0);

        let slotIdx = 0;
        const materials = this.setting.activeMaterials;
        for (let i = 0; i < materials.length; i++) {
            const material = materials[i];
            passContext.material = material;

            const slotName = outputNames[slotIdx];
            slotIdx = (++slotIdx) % 2;

            passContext.addRasterPass(width, height, 'post-process', `${this.name}${cameraID}`)
                .setViewport(area.x, area.y, width, height)
                .setPassInput(input0, 'inputTexture')
                .addRasterView(slotName, Format.RGBA8)
                .blitScreen(0)
                .version();

            input0 = slotName;
        }

        this.outputName = input0;
    }
}
