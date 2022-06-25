declare module 'pal/pacer' {

    export class Pacer {
        get targetFrameRate (): number;
        set targetFrameRate (val: number);
        onTick (cb: () => void): void;
        start (): void;
        stop (): void;
    }
}
