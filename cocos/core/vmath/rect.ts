
export interface IRect2D {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

export interface INormalizedRect2D {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function normalizeRect2D (rect: IRect2D, fullWidth: number, fullHeight: number): INormalizedRect2D {
    rect.x = rect.x || 0;
    rect.y = rect.y || 0;
    rect.width = rect.width || fullWidth;
    rect.height = rect.height || fullHeight;
    return rect as INormalizedRect2D;
}
