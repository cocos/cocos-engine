// tslint:disable:interface-over-type-literal

export type PropertyBlendState<T = any> = {
    weight: number;
    value?: T;
};

type PropertyStates = { [propertyName: string]: PropertyBlendState };

export class AnimationBlendState {
    private _table = new Map<any, PropertyStates>();

    public getPropertyState (target: any, propertyName: string) {
        let propertyStates = this._table.get(target);
        if (!propertyStates) {
            propertyStates = {};
            this._table.set(target, propertyStates);
        }
        let propertyState = propertyStates[propertyName];
        if (!propertyState) {
            propertyState = { weight: 0, value: undefined };
            propertyStates[propertyName] =  propertyState;
        }
        return propertyState;
    }

    public apply () {
        this._table.forEach((propertyStates, target) => {
            for (const propertyName of Object.keys(propertyStates)) {
                target[propertyName] = propertyStates[propertyName].value;
            }
        });
    }

    public clear () {
        this._table.forEach((propertyStates) => {
            for (const propertyName of Object.keys(propertyStates)) {
                propertyStates[propertyName].weight = 0;
            }
        });
    }
}
