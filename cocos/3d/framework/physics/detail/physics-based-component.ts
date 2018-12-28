
import Component from '../../../../components/CCComponent';
import { ccclass } from '../../../../core/data/class-decorator';
import { PhysicsBody } from '../body';

@ccclass('cc.PhysicsBasedComponent')
export class PhysicsBasedComponent extends Component {
    private _sharedBody: SharedRigidBody | null = null;

    constructor() {
        super();
    }

    protected get _body() {
        return this._sharedBody ? this._sharedBody.body : null;
    }

    public onLoad() {
        this._sharedBody = this._getSharedBody();
        this._sharedBody.body.bind(this.node);
    }

    public onEnable() {
        if (this._sharedBody!.enable()) {
            cc.director._physicsSystem.world.addBody(this._body);
        }
    }

    public onDisable() {
        if (this._sharedBody!.disable()) {
            cc.director._physicsSystem.world.removeBody(this._body);
        }
    }

    private _getSharedBody() {
        let component = this.getComponent(PhysicsBasedComponent) as (PhysicsBasedComponent | null);
        if (!component) {
            component = this;
        }
        if (!component._sharedBody) {
            component._sharedBody = new SharedRigidBody();
        }
        return component._sharedBody!;
    }
}

class SharedRigidBody {
    public body: PhysicsBody;

    private _enableCount = 0;

    constructor() {
        this.body = new PhysicsBody();
    }

    public enable() {
        ++this._enableCount;
        return this._enableCount === 1;
    }

    public disable() {
        --this._enableCount;
        return this._enableCount === 0;
    }
}
