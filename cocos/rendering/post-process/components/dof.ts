import { ccclass, disallowMultiple, executeInEditMode, help, menu, range, rangeMin, serializable, slide, tooltip, type } from '../../../core/data/decorators';
import { PostProcessSetting } from './post-process-setting';
import { CCFloat } from '../../../core';

@ccclass('cc.DOF')
@help('cc.DOF')
@menu('PostProcess/DOF')
@disallowMultiple
@executeInEditMode
export class DOF extends PostProcessSetting {
    @serializable
    protected _focusDistance = 0.0;
    @serializable
    protected _focusRange = 0.0;
    @serializable
    protected _bokehRadius = 1.0;

    @rangeMin(0)
    @type(CCFloat)
    set focusDistance (value: number) {
        this._focusDistance = value;
    }
    get focusDistance (): number {
        return this._focusDistance;
    }

    @rangeMin(0)
    @type(CCFloat)
    set focusRange (value: number) {
        this._focusRange = value;
    }
    get focusRange (): number {
        return this._focusRange;
    }

    @slide
    @range([1, 10, 0.01])
    @rangeMin(1.0)
    @type(CCFloat)
    set bokehRadius (value: number) {
        this._bokehRadius = value;
    }
    get bokehRadius (): number {
        return this._bokehRadius;
    }
}
