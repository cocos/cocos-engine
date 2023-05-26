import { VFXDataSet } from '../../exports/vfx';
import { VFXParameterNameSpace } from './define';

export const CUSTOM_USER_PARAMETER_ID = 40000;
export class UserDataSet extends VFXDataSet {
    constructor () {
        super(VFXParameterNameSpace.USER, false);
    }
}
