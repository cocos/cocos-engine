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
        displayOrder: 4,
        update(element, dump) {
            setHidden(isMultipleInvalid(dump.transition) || dump.transition.value !== 1, element);
        },
    },
    pressedColor: {
        displayOrder: 5,
        update(element, dump) {
            this.elements.normalColor.update.call(this, element, dump);
        },
    },
    hoverColor: {
        displayOrder: 6,
        update(element, dump) {
            this.elements.normalColor.update.call(this, element, dump);
        },
    },
    disabledColor: {
        displayOrder: 7,
        update(element, dump) {
            this.elements.normalColor.update.call(this, element, dump);
        },
    },
    normalSprite: {
        displayOrder: 4,
        update(element, dump) {
            setHidden(isMultipleInvalid(dump.transition) || dump.transition.value !== 2, element);
        },
    },
    pressedSprite: {
        displayOrder: 5,
        update(element, dump) {
            this.elements.normalSprite.update.call(this, element, dump);
        },
    },
    hoverSprite: {
        displayOrder: 6,
        update(element, dump) {
            this.elements.normalSprite.update.call(this, element, dump);
        },
    },
    disabledSprite: {
        displayOrder: 7,
        update(element, dump) {
            this.elements.normalSprite.update.call(this, element, dump);
        },
    },
    zoomScale: {
        displayOrder: 4,
        update(element, dump) {
            setHidden(isMultipleInvalid(dump.transition) || dump.transition.value !== 3, element);
        },
    },
    duration: {
        displayOrder: 5,
        update(element, dump) {
            this.elements.zoomScale.update.call(this, element, dump);
        },
    },
    clickEvents: {
        displayOrder: 10,
    },
};

exports.ready = function() {
    this.elements = exports.elements;
};
