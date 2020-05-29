import { Eventify } from '../../cocos/core';

test('Eventify', () => {
    class Base {
        public _nickName: string;

        constructor(nickName: string) {
            this._nickName = nickName;
        }

        public getNickName() {
            return this._nickName;
        }
    }

    const hookOnOff = jest.fn(() => {});

    class Derived extends Eventify(Base) {
        public off(type: string, callback?: Function, target?: object) {
            super.off(type, callback, target);
            hookOnOff();
        }
    }

    const nickName = 'Jack';
    const derived = new Derived(nickName);
    expect(derived.getNickName()).toEqual(nickName);

    const eventName = 'test';
    const eventCallback = jest.fn(() => {});

    derived.off(eventName, eventCallback);
    expect(hookOnOff).toBeCalledTimes(1);

    derived.once(eventName, eventCallback);
    derived.emit(eventName);
    expect(hookOnOff).toBeCalledTimes(2);
});