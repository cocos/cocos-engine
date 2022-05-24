import { DEBUG } from 'internal:constants';
import { assertIsTrue } from '../../data/utils/asserts';

export const ownerSymbol = Symbol('[[Owner]]');

export interface OwnedBy<T> {
    [ownerSymbol]: T | undefined;
}

export function assertsOwnedBy<T> (mastered: OwnedBy<T>, owner: T) {
    assertIsTrue(mastered[ownerSymbol] === owner);
}

export function own<T> (mastered: OwnedBy<T>, owner: T) {
    if (DEBUG) {
        mastered[ownerSymbol] = owner;
    }
}

export function markAsDangling<T> (mastered: OwnedBy<T>) {
    if (DEBUG) {
        mastered[ownerSymbol] = undefined;
    }
}
