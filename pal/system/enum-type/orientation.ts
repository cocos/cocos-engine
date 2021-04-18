export enum Orientation {
    PORTRAIT = 1,
    PORTRAIT_UPSIDE_DOWN = 1<<1,
    LANDSCAPE_LEFT = 1<<2,
    LANDSCAPE_RIGHT = 1<<3,
    LANDSCAPE = 1<<2 | 1<<3,
}
