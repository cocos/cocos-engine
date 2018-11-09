import effectJsons from './effects';

let effects = {};
for (let i = 0; i < effectJsons.length; ++i) {
    let effect = effectJsons[i];
    effect._uuid = `builtin-effect-${effect.name}`;
    effects[effect._uuid] = effect;
}

module.exports = effects;
