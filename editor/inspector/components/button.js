const { template, $, update } = require('./base');

exports.template = template;
exports.$ = $;
exports.update = update;

const { setHidden, isMultipleInvalid } = require('../utils/prop');

// export is to allow cc.toggle to reuse this piece of code
exports.elements = {
    target: {
        displayOrder: 0,
    },
    interactable: {
        displayOrder: 1,
    },
    transition: {
        displayOrder: 3,
    },
    normalColor: {
        update(element, dump) {
            setHidden(isMultipleInvalid(dump.transition) || dump.transition.value !== 1, element);
        },
    },
    pressedColor: {
        update(element, dump) {
            this.elements.normalColor.update.call(this, element, dump);
        },
    },
    hoverColor: {
        update(element, dump) {
            this.elements.normalColor.update.call(this, element, dump);
        },
    },
    disabledColor: {
        update(element, dump) {
            this.elements.normalColor.update.call(this, element, dump);
        },
    },
    normalSprite: {
        update(element, dump) {
            setHidden(isMultipleInvalid(dump.transition) || dump.transition.value !== 2, element);
        },
    },
    pressedSprite: {
        update(element, dump) {
            this.elements.normalSprite.update.call(this, element, dump);
        },
    },
    hoverSprite: {
        update(element, dump) {
            this.elements.normalSprite.update.call(this, element, dump);
        },
    },
    disabledSprite: {
        update(element, dump) {
            this.elements.normalSprite.update.call(this, element, dump);
        },
    },
    zoomScale: {
        update(element, dump) {
            setHidden(isMultipleInvalid(dump.transition) || dump.transition.value !== 3, element);
        },
    },
    duration: {
        update(element, dump) {
            this.elements.zoomScale.update.call(this, element, dump);
        },
    },
};

exports.ready = function() {
    this.elements = exports.elements;
};
