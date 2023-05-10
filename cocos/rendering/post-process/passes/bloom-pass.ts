import { Vec4 } from '../../../core';
import { ClearFlagBit, Format } from '../../../gfx';
import { Camera } from '../../../render-scene/scene';
import { Pipeline } from '../../custom';
import { getCameraUniqueID } from '../../custom/define';
import { passContext } from '../utils/pass-context';

import { getSetting, SettingPass } from './setting-pass';
import { Bloom } from '../components';

const MAX_BLOOM_FILTER_PASS_NUM = 6;
const BLOOM_DOWNSAMPLEPASS_INDEX = 1;
const BLOOM_UPSAMPLEPASS_INDEX = BLOOM_DOWNSAMPLEPASS_INDEX + MAX_BLOOM_FILTER_PASS_NUM;
const BLOOM_COMBINEPASS_INDEX = BLOOM_UPSAMPLEPASS_INDEX + MAX_BLOOM_FILTER_PASS_NUM;
export class BloomPass extends SettingPass {
    get setting () { return getSetting(Bloom); }

    name = 'BloomPass'
    effectName = 'pipeline/post-process/bloom';
    outputNames = ['BloomColor']

    checkEnable (camera: Camera) {
        const enable = super.checkEnable(camera);
        const setting = this.setting;
        return enable && !!setting && setting.enabledInHierarchy;
    }

    public render (camera: Camera, ppl: Pipeline): void {
        const cameraID = getCameraUniqueID(camera);
        const cameraName = `Camera${cameraID}`;
        const area = this.getRenderArea(camera);
        const inputWidth = area.width;
        const inputHeight = area.height;

        const shadingScale = this.finalShadingScale();
        const width = Math.floor(inputWidth / shadingScale);
        const height = Math.floor(inputHeight / shadingScale);
        let outWidth = width;
        let outHeight = height;

        passContext.clearFlag = ClearFlagBit.COLOR;
        Vec4.set(passContext.clearColor, 0, 0, 0, 1);

        passContext.material = this.material;

        const setting = this.setting;

        const input = this.lastPass!.slotName(camera, 0);
        const output = 'BLOOM_PREFILTER_COLOR';
        // prefilter pass
        outWidth >>= 1;
        outHeight >>= 1;
        passContext.material.setProperty('texSize', new Vec4(0, 0, setting.threshold, 0), 0);
        passContext.addRasterPass(outWidth, outHeight, 'bloom-prefilter', `bloom-prefilter${cameraID}`)
            .setViewport(area.x, area.y, outWidth, outHeight)
            .setPassInput(input, 'outputResultMap')
            .addRasterView(output, Format.RGBA8)
            .blitScreen(0)
            .version();

        // down sampler pass
        for (let i = 0; i < setting.iterations; ++i) {
            const texSize = new Vec4(outWidth, outHeight, 0, 0);
            outWidth >>= 1;
            outHeight >>= 1;
            const bloomPassDownSampleRTName = `dsBloomPassDownSampleColor${cameraName}${i}`;
            const downSamplerInput = i === 0 ? output : `dsBloomPassDownSampleColor${cameraName}${i - 1}`;
            passContext.material.setProperty('texSize', texSize, BLOOM_DOWNSAMPLEPASS_INDEX + i);
            passContext.addRasterPass(outWidth, outHeight, `bloom-upsample${i}`, `bloom-upsample${i}${cameraID}`)
                .setViewport(area.x, area.y, outWidth, outHeight)
                .setPassInput(downSamplerInput, 'bloomTexture')
                .addRasterView(bloomPassDownSampleRTName, Format.RGBA8)
                .blitScreen(BLOOM_DOWNSAMPLEPASS_INDEX + i)
                .version();
        }

        // up sampler pass
        for (let i = 0; i < setting.iterations; ++i) {
            const texSize = new Vec4(outWidth, outHeight, 0, 0);
            outWidth <<= 1;
            outHeight <<= 1;
            const bloomPassUpSampleRTName = `dsBloomPassUpSampleColor${cameraName}${setting.iterations - 1 - i}`;
            const upSamplerInput = i === 0 ? `dsBloomPassDownSampleColor${cameraName}${setting.iterations - 1}`
                : `dsBloomPassUpSampleColor${cameraName}${setting.iterations - i}`;
            passContext.material.setProperty('texSize', texSize, BLOOM_UPSAMPLEPASS_INDEX + i);
            passContext.addRasterPass(outWidth, outHeight, `bloom-downsample${i}`, `bloom-downsample${i}${cameraID}`)
                .setViewport(area.x, area.y, outWidth, outHeight)
                .setPassInput(upSamplerInput, 'bloomTexture')
                .addRasterView(bloomPassUpSampleRTName, Format.RGBA8)
                .blitScreen(BLOOM_UPSAMPLEPASS_INDEX + i)
                .version();
        }

        // combine Pass
        outWidth = width;
        outHeight = height;
        passContext.material.setProperty('texSize', new Vec4(0, 0, 0, setting.intensity), BLOOM_COMBINEPASS_INDEX);
        passContext.addRasterPass(outWidth, outHeight, `bloom-combine`, `bloom-combine${cameraID}`)
            .setViewport(area.x, area.y, outWidth, outHeight)
            .setPassInput(input, 'outputResultMap')
            .setPassInput(`dsBloomPassUpSampleColor${cameraName}${0}`, 'bloomTexture')
            .addRasterView(this.slotName(camera, 0), Format.RGBA8)
            .blitScreen(BLOOM_COMBINEPASS_INDEX)
            .version();
    }
}
