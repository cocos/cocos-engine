import { Camera, CameraUsage } from '../../../render-scene/scene';
import { buildReflectionProbePasss } from '../../custom/define';
import { Pipeline } from '../../custom/pipeline';
import { passContext } from '../utils/pass-context';
import { BasePass } from './base-pass';

export class ReflectionProbePass extends BasePass {
    name = 'ReflectionProbePass';
    outputNames = ['ReflectionProbeColor']

    public render (camera: Camera, ppl: Pipeline) {
        const isGameView = camera.cameraUsage === CameraUsage.GAME
        || camera.cameraUsage === CameraUsage.GAME_VIEW;
        buildReflectionProbePasss(camera, ppl, isGameView);
    }
}
