const LEFT = 1 << 2;
const RIGHT = 1 << 3;
export enum Orientation {
    PORTRAIT = 1,
    PORTRAIT_UPSIDE_DOWN = 1 << 1,
    LANDSCAPE_LEFT = LEFT,
    LANDSCAPE_RIGHT = RIGHT,
    LANDSCAPE = LEFT | RIGHT,
}
