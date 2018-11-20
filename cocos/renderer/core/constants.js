let RenderQueue = {
    OPAQUE: 0,
    TRANSPARENT: 3000,
    OVERLAY: 5000
};

let PassStage = {
    DEFAULT: 0,
    FORWARD: 1,
    SHADOWCAST: 2
};

export { RenderQueue, PassStage };
