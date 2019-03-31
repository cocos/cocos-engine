const { DynamicAnimCurve, quickFindIndex } = require('../../../animation/animation-curves');

let JointMatrixCurve = cc.Class({
    name: 'cc.JointMatrixCurve',
    extends: DynamicAnimCurve,

    _findFrameIndex: quickFindIndex,
    sample (time, ratio) {
        let ratios = this.ratios;
        let index = this._findFrameIndex(ratios, ratio);
        if (index < -1) {
            index = ~index - 1;
        }

        let pairs = this.pairs;
        for (let i = 0; i < pairs.length; i++) {
            let pair = pairs[i];
            pair.target._jointMatrix = pair.values[index];
        }
    }
});

module.exports = JointMatrixCurve;
