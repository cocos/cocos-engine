import { EDITOR } from 'internal:constants';
import { editable, Quat, serializable, Vec3 } from '../../../../core';
import { ccclass } from '../../../../core/data/class-decorator';
import { VariableType, VarInstance } from '../../variable';
import { CLASS_NAME_PREFIX_ANIM } from '../../../define';
import { SingleOutputPVNode, PureValueNodeLinkContext } from '../pure-value-node';
import {
    PoseGraphCreateNodeEntry, PoseGraphCreateNodeFactory, poseGraphCreateNodeFactory, poseGraphNodeAppearance, poseGraphNodeHide,
} from '../decorator/node';
import { PoseGraphType } from '../foundation/type-system';

interface CreateNodeArg {
    name: string;
    type: Exclude<PoseGraphType, PoseGraphType.POSE>;
}

const createNodeFactory: PoseGraphCreateNodeFactory<CreateNodeArg> = {
    // eslint-disable-next-line arrow-body-style
    listEntries: (context) => {
        // eslint-disable-next-line arrow-body-style
        const entries: PoseGraphCreateNodeEntry<CreateNodeArg>[] = [];
        for (const [variableName, { type }] of context.animationGraph.variables) {
            if (type === VariableType.TRIGGER) {
                continue;
            }
            let poseGraphType: CreateNodeArg['type'] | undefined;
            switch (type) {
            default:
                break;
            case VariableType.FLOAT:
                poseGraphType = PoseGraphType.FLOAT;
                break;
            case VariableType.INTEGER:
                poseGraphType = PoseGraphType.INTEGER;
                break;
            case VariableType.BOOLEAN:
                poseGraphType = PoseGraphType.BOOLEAN;
                break;
            case VariableType.VEC3_experimental:
                poseGraphType = PoseGraphType.VEC3;
                break;
            case VariableType.QUAT_experimental:
                poseGraphType = PoseGraphType.QUAT;
                break;
            }
            if (typeof poseGraphType === 'undefined') {
                continue;
            }
            entries.push({
                arg: { name: variableName, type: poseGraphType  },
                menu: variableName,
            });
        }
        return entries;
    },

    create: (arg) => {
        let node: PVNodeGetVariableFloat | PVNodeGetVariableInteger | PVNodeGetVariableBoolean | PVNodeGetVariableVec3 | PVNodeGetVariableQuat;
        switch (arg.type) {
        default:
            throw new Error(`Bad create node arg: ${PoseGraphType[arg.type]}`);
        case PoseGraphType.FLOAT:
            node = new PVNodeGetVariableFloat();
            break;
        case PoseGraphType.INTEGER:
            node = new PVNodeGetVariableInteger();
            break;
        case PoseGraphType.BOOLEAN:
            node = new PVNodeGetVariableBoolean();
            break;
        case PoseGraphType.VEC3:
            node = new PVNodeGetVariableVec3();
            break;
        case PoseGraphType.QUAT:
            node = new PVNodeGetVariableQuat();
            break;
        }
        node.variableName = arg.name;
        return node;
    },
};

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PVNodeGetVariableBase`)
@poseGraphCreateNodeFactory(createNodeFactory)
export abstract class PVNodeGetVariableBase<T> extends SingleOutputPVNode<T> {
    @editable
    @serializable
    public variableName = '';

    link (context: PureValueNodeLinkContext): void {
        this._varInstance = context.getVar(this.variableName);
    }

    protected _varInstance: VarInstance | undefined = undefined;
}

if (EDITOR) {
    PVNodeGetVariableBase.prototype.getTitle = function getTitle (this: PVNodeGetVariableBase<any>): [string, { variableName: string; }] | undefined {
        if (!this.variableName) {
            return undefined;
        }
        return [`ENGINE.classes.${CLASS_NAME_PREFIX_ANIM}PVNodeGetVariableBase.title`, { variableName: this.variableName }];
    };
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PVNodeGetVariableFloat`)
@poseGraphNodeHide()
@poseGraphNodeAppearance({
    inline: true,
    themeColor: '#8471CF',
})
export class PVNodeGetVariableFloat extends PVNodeGetVariableBase<number> {
    constructor () {
        super(PoseGraphType.FLOAT);
    }

    public selfEvaluateDefaultOutput (): number {
        return this._varInstance?.value as number; // TODO
    }
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PVNodeGetVariableInteger`)
@poseGraphNodeHide()
@poseGraphNodeAppearance({
    inline: true,
    themeColor: '#2A90DC',
})
export class PVNodeGetVariableInteger extends PVNodeGetVariableBase<number> {
    constructor () {
        super(PoseGraphType.INTEGER);
    }

    public selfEvaluateDefaultOutput (): number {
        return this._varInstance?.value as number; // TODO
    }
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PVNodeGetVariableBoolean`)
@poseGraphNodeHide()
@poseGraphNodeAppearance({
    inline: true,
    themeColor: '#D07979',
})
export class PVNodeGetVariableBoolean extends PVNodeGetVariableBase<boolean> {
    constructor () {
        super(PoseGraphType.BOOLEAN);
    }

    public selfEvaluateDefaultOutput (): boolean {
        return this._varInstance?.value as boolean; // TODO
    }
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PVNodeGetVariableVec3`)
@poseGraphNodeHide()
@poseGraphNodeAppearance({
    inline: true,
    themeColor: '#D97721',
})
export class PVNodeGetVariableVec3 extends PVNodeGetVariableBase<Readonly<Vec3>> {
    constructor () {
        super(PoseGraphType.VEC3);
    }

    public selfEvaluateDefaultOutput (): Readonly<Vec3> {
        return this._varInstance?.value as unknown as Readonly<Vec3>; // TODO
    }
}

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PVNodeGetVariableQuat`)
@poseGraphNodeHide()
@poseGraphNodeAppearance({
    inline: true,
    themeColor: '#B169C4',
})
export class PVNodeGetVariableQuat extends PVNodeGetVariableBase<Quat> {
    constructor () {
        super(PoseGraphType.QUAT);
    }

    public selfEvaluateDefaultOutput (): Readonly<Quat> {
        return this._varInstance?.value as unknown as Quat; // TODO
    }
}
