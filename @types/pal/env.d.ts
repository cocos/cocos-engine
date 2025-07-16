declare module 'pal/env' {
    export function findCanvas (): { frame: HTMLDivElement, container: HTMLDivElement, canvas: HTMLCanvasElement };
    export function loadJsFile (path: string): Promise<void>;
}
