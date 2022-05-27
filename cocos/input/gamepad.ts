export namespace Input {
    export class Gamepad {
        private constructor () {}
        static current: Gamepad;
        static all: Gamepad[];
        public test!: number;
    }
}