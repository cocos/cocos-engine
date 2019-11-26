/**
 * @hidden
 */

import { ActionInstant} from './actions/action-instant';

export class SetAction extends ActionInstant {

    private _props: any;

    constructor (props?: any) {
        super();
        this._props = {};
        props !== undefined && this.init(props);
    }

    init (props) {
        for (let name in props) {
            this._props[name] = props[name];
        }
        return true;
    }

    update () {
        let props = this._props;
        let target = this.target;
        for (let name in props) {
            target![name] = props[name];
        }
    }

    clone () {
        var action = new SetAction();
        action.init(this._props);
        return action;
    }
}