const { template, $, update } = require('./base');

exports.template = template;
exports.$ = $;
exports.update = update;

exports.style = `
    .use_baked_animation_tips {
        color: #707070;
    }
    .use_baked_animation_tips_hidden {
        display: none;
    }
`;

function updateTipsState(parent, hidden) {
    let tips = parent.getElementsByClassName('use_baked_animation_tips')[0];
    if (!tips) {
        tips = document.createElement('ui-label');
        tips.value = `i18n:ENGINE.components.animation.use_baked_animation_tips`;
        tips.classList.add('use_baked_animation_tips', 'use_baked_animation_tips_hidden');
        parent.appendChild(tips);
    }
    if (hidden) {
        tips.classList.add('use_baked_animation_tips_hidden');
    } else {
        tips.classList.remove('use_baked_animation_tips_hidden');
    }
    return tips;
}

exports.elements = {
    useBakedAnimation: {
        update(element, dump) {
            updateTipsState(element, !dump.useBakedAnimation.value);
        }
    }
};

exports.ready = function() {
    this.elements = exports.elements;
};

exports.close = function() {}
