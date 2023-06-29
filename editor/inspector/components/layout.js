const { template, $, update, close } = require('./base');

exports.template = template;
exports.$ = $;
exports.update = update;
exports.close = close;

const { setHidden, isMultipleInvalid } = require('../utils/prop');

exports.ready = function() {
    this.elements = {
        affectedByScale: {
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.type) || dump.type.value === 0, element);
            },
        },
        cellSize: {
            update(element, dump) {
                setHidden(
                    isMultipleInvalid(dump.type) ||
                        (dump.type.value !== 3 && dump.resizeMode.value !== 2),
                    element,
                );
            },
        },
        startAxis: {
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.type) || dump.type.value !== 3, element);
            },
        },
        paddingLeft: {
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.type) || dump.type.value === 0 || dump.type.value === 2, element);
            },
        },
        paddingRight: {
            update(element, dump) {
                this.elements.paddingLeft.update.call(this, element, dump);
            },
        },
        paddingTop: {
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.type) || dump.type.value === 0 || dump.type.value === 1, element);
            },
        },
        paddingBottom: {
            update(element, dump) {
                this.elements.paddingTop.update.call(this, element, dump);
            },
        },
        spacingX: {
            update(element, dump) {
                this.elements.paddingLeft.update.call(this, element, dump);
            },
        },
        spacingY: {
            update(element, dump) {
                this.elements.paddingTop.update.call(this, element, dump);
            },
        },
        horizontalDirection: {
            update(element, dump) {
                this.elements.paddingLeft.update.call(this, element, dump);
            },
        },
        verticalDirection: {
            update(element, dump) {
                this.elements.paddingTop.update.call(this, element, dump);
            },
        },
        alignHorizontal: {
            update(element, dump) {
                this.elements.paddingLeft.update.call(this, element, dump);
            },
        },
        alignVertical: {
            update(element, dump) {
                this.elements.paddingTop.update.call(this, element, dump);
            },
        },
        constraint: {
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.type) || dump.type.value !== 3, element);
            },
        },
        constraintNum: {
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.type) || dump.type.value !== 3 || dump.constraint.value === 0, element);
            },
        },
    };
};
