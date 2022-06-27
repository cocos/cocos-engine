declare module 'pal/pacer' {

    export class Pacer {
        get targetFrameRate (): number;
        set targetFrameRate (val: number);
        onTick: (() => void) | null;
        start (): void;
        stop (): void;
    }
}
