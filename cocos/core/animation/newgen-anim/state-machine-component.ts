import { ccclass } from 'cc.decorator';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import type { NewGenAnim } from './newgenanim-component';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}StateMachineComponent`)
export class StateMachineComponent {
    public onEnter (_newGenAnim: NewGenAnim): void { }

    public onExit (_newGenAnim: NewGenAnim): void { }
}
