export class InvalidTransitionError extends Error {
    constructor (type: 'to-entry' | 'to-any' | 'from-exit') {
        super(`${type} transition is invalid`);
        this.name = 'TransitionRejectError';
    }
}

export class VariableNotDefinedError extends Error {
    constructor (name: string) {
        super(`Graph variable ${name} is not defined`);
    }
}

export class VariableTypeMismatchedError extends Error {
    constructor (name: string, expected: string, received?: string) {
        super(`Expect graph variable ${name} to have type '${expected}' instead of received '${received ?? typeof received}'`);
    }
}
