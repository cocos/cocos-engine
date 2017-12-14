const Enums = require('../platform/CCEnum');
const gfx = require('./render-engine').gfx;

// Stage types
var Stage = cc.Enum({
    // Stencil disabled
    DISABLED: 0,
    // Entering a new level, should handle new stencil
    ENTER_LEVEL: 1,
    // In stencil
    ENABLED: 2,
    // Exiting a level, should restore old stencil or disable
    EXIT_LEVEL: 3,
});

function StencilManager () {
    // todo: 8 is least Stencil depth supported by webGL device, it could be adjusted to vendor implementation value
    this._maxLevel = 8;
    // Current mask
    this._maskStack = [];
    // Current stage of process, DISABLED, ENTER_LEVEL, ENABLED, EXIT_LEVEL
    this.stage = Stage.DISABLED;
}

StencilManager.prototype = {
    constructor: StencilManager,

    handleEffect (effect) {
        let technique = effect.getTechnique('transparent');
        if (this.stage === Stage.DISABLED) {
            this.stage = Stage.DISABLED;
            for (let i = 0; i < technique._passes.length; ++i) {
                let pass = technique._passes[i];
                pass._stencilTest = false;
            }
            return;
        }

        let mask, func, ref, stencilMask, writeMask, failOp,
        zFailOp = gfx.STENCIL_OP_KEEP,
        zPassOp = gfx.STENCIL_OP_KEEP;
        
        if (this.stage === Stage.ENABLED) {
            func = gfx.DS_FUNC_EQUAL;
            mask = this._maskStack[this._maskStack.length - 1];
            if (mask.inverted) {
                ref = this.getInvertedRef();
                stencilMask = this.getStencilRef();
            }
            else {
                ref = this.getStencilRef();
                stencilMask = ref;
            }
            failOp = gfx.STENCIL_OP_KEEP;
            writeMask = 0;
        }
        else {
            func = gfx.DS_FUNC_NEVER;
            failOp = gfx.STENCIL_OP_REPLACE;

            if (this.stage === Stage.ENTER_LEVEL) {
                this.stage = Stage.ENABLED;
                // Fill stencil mask
                ref = this.getStencilRef();
                stencilMask = this.getWriteMask();
                writeMask = stencilMask;
            }
            else if (this.stage === Stage.EXIT_LEVEL) {
                // Pop mask after getting the correct stencil mask
                if (this._maskStack.length === 0) {
                    this.stage = Stage.DISABLED;
                }
                else {
                    this.stage = Stage.ENABLED;
                }
                // Clear stencil mask
                ref = 0;
                stencilMask = this.getExitWriteMask();
                writeMask = stencilMask;
            }
        }
        
        for (let i = 0; i < technique._passes.length; ++i) {
            let pass = technique._passes[i];
            pass.setStencilFront(func, ref, stencilMask, failOp, zFailOp, zPassOp, writeMask);
            pass.setStencilBack(func, ref, stencilMask, failOp, zFailOp, zPassOp, writeMask);
        }
    },

    pushMask (mask) {
        if (this._maskStack.length + 1 > this._maxLevel) {
            console.error(`Stencil manager does not support level bigger than ${this._maxLevel} in this device.`);
        }
        this._maskStack.push(mask);
        this.stage = Stage.ENTER_LEVEL;
    },

    popMask () {
        if (this._maskStack.length === 0) {
            console.error(`Stencil manager is already empty, cannot pop any mask`);
        }
        this._maskStack.pop();
        this.stage = Stage.EXIT_LEVEL;
    },
  
    getWriteMask () {
        return 0x01 << (this._maskStack.length - 1);
    },

    getExitWriteMask () {
        return 0x01 << this._maskStack.length;
    },
  
    getStencilRef () {
        let result = 0;
        for (let i = 0; i < this._maskStack.length; ++i) {
            result += (0x01 << i);
        }
        return result;
    },

    getInvertedRef () {
        let result = 0;
        for (let i = 0; i < this._maskStack.length - 1; ++i) {
            result += (0x01 << i);
        }
        return result;
    }
};

StencilManager.sharedManager = new StencilManager();
StencilManager.Stage = Stage;

module.exports = StencilManager;