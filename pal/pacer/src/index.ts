export declare class Pacer {
    get targetFrameRate (): number;
    set targetFrameRate (val: number);
    onTick: (() => void) | null;
    start (): void;
    stop (): void;
}
