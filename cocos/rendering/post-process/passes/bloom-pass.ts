import { Vec4 } from '../../../core';
import { Format } from '../../../gfx';
import { Camera } from '../../../render-scene/scene';
import { Pipeline } from '../../custom/pipeline';
import { getCameraUniqueID } from '../../custom/define';
import { passContext } from '../utils/pass-context';

import { getSetting, SettingPass } from './setting-pass';
import { Bloom } from '../components';
import { disablePostProcessForDebugView } from './base-pass';

const MAX_BLOOM_FILTER_PASS_NUM = 6;
const BLOOM_DOWNSAMPLEPASS_INDEX = 1;
const BLOOM_UPSAMPLEPASS_INDEX = BLOOM_DOWNSAMPLEPASS_INDEX + MAX_BLOOM_FILTER_PASS_NUM;
const BLOOM_COMBINEPASS_INDEX = BLOOM_UPSAMPLEPASS_INDEX + MAX_BLOOM_FILTER_PASS_NUM;
export class BloomPass extends SettingPass {
    get setting (): Bloom { return getSetting(Bloom); }

    checkEnable (camera: Camera): boolean {
        let enable = super.checkEnable(camera);
        if (disablePostProcessForDebugView()) {
            enable = false;
        }
        return enable;
    }

    name = 'BloomPass';
    effectName = 'pipeline/post-process/bloom';
    outputNames = ['BloomColor'];
    private _hdrInputName: string = '';

    set hdrInputName (name: string) {
        this._hdrInputName = name;
    }

    public render (camera: Camera, ppl: Pipeline): void {
        const cameraID = getCameraUniqueID(camera);
        const cameraName = `Camera${cameraID}`;

        const passViewport = passContext.passViewport;

        passContext.clearBlack();

        passContext.material = this.material;

        const setting = this.setting;

        const input = this.lastPass!.slotName(camera, 0);
        const output = `BLOOM_PREFILTER_COLOR${cameraID}`;
        // prefilter pass
        let shadingScale = 1 / 2;
        const enableAlphaMask = setting.enableAlphaMask as unknown as number;
        const useHDRIntensity = setting.useHdrIlluminance as unknown as number;
        passContext.material.setProperty('texSize', new Vec4(useHDRIntensity, 0, setting.threshold, enableAlphaMask), 0);
        passContext
            .updatePassViewPort(shadingScale)
            .addRenderPass('bloom-prefilter', `bloom-prefilter${cameraID}`)
            .setPassInput(input, 'outputResultMap')
            .setPassInput(this._hdrInputName, 'hdrInputMap')
            .addRasterView(output, Format.RGBA8)
            .blitScreen(0)
            .version();

        // down sampler pass
        for (let i = 0; i < setting.iterations; ++i) {
            const texSize = new Vec4(passViewport.width, passViewport.height, 0, 0);
            const bloomPassDownSampleRTName = `dsBloomPassDownSampleColor${cameraName}${i}`;
            const downSamplerInput = i === 0 ? output : `dsBloomPassDownSampleColor${cameraName}${i - 1}`;
            passContext.material.setProperty('texSize', texSize, BLOOM_DOWNSAMPLEPASS_INDEX + i);
            shadingScale /= 2;
            passContext
                .updatePassViewPort(shadingScale)
                .addRenderPass(`bloom-upsample${i}`, `bloom-upsample${i}${cameraID}`)
                .setPassInput(downSamplerInput, 'bloomTexture')
                .addRasterView(bloomPassDownSampleRTName, Format.RGBA8)
                .blitScreen(BLOOM_DOWNSAMPLEPASS_INDEX + i)
                .version();
        }

        // up sampler pass
        for (let i = 0; i < setting.iterations; ++i) {
            const texSize = new Vec4(passViewport.width, passViewport.height, 0, 0);
            const bloomPassUpSampleRTName = `dsBloomPassUpSampleColor${cameraName}${setting.iterations - 1 - i}`;
            const upSamplerInput = i === 0 ? `dsBloomPassDownSampleColor${cameraName}${setting.iterations - 1}`
                : `dsBloomPassUpSampleColor${cameraName}${setting.iterations - i}`;
            passContext.material.setProperty('texSize', texSize, BLOOM_UPSAMPLEPASS_INDEX + i);
            shadingScale *= 2;
            passContext
                .updatePassViewPort(shadingScale)
                .addRenderPass(`bloom-downsample${i}`, `bloom-downsample${i}${cameraID}`)
                .setPassInput(upSamplerInput, 'bloomTexture')
                .addRasterView(bloomPassUpSampleRTName, Format.RGBA8)
                .blitScreen(BLOOM_UPSAMPLEPASS_INDEX + i)
                .version();
        }

        // combine Pass
        passContext.material.setProperty('texSize', new Vec4(0, 0, 0, setting.intensity), BLOOM_COMBINEPASS_INDEX);
        passContext
            .updatePassViewPort()
            .addRenderPass(`bloom-combine`, `bloom-combine${cameraID}`)
            .setPassInput(input, 'outputResultMap')
            .setPassInput(`dsBloomPassUpSampleColor${cameraName}${0}`, 'bloomTexture')
            .addRasterView(this.slotName(camera, 0), Format.RGBA8)
            .blitScreen(BLOOM_COMBINEPASS_INDEX)
            .version();
    }
}
