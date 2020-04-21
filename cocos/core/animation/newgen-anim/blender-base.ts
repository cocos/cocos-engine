import { instantiateSymbol } from './instantiate-symbol';

export interface IBlenderTemplate {
    [instantiateSymbol] (): IBlender;
}

export interface IBlender {
    weights: readonly number[];
}
