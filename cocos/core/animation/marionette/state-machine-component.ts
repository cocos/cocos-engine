import { ccclass } from 'cc.decorator';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import type { AnimationController } from './animation-controller';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}StateMachineComponent`)
export class StateMachineComponent {
    public onEnter (_newGenAnim: AnimationController): void { }

    public onExit (_newGenAnim: AnimationController): void { }
}
