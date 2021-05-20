const { template, $, update } = require('./base');

exports.template = template;
exports.$ = $;
exports.update = update;

const { setHidden, isMultipleInvalid } = require('../utils/prop');

exports.ready = function() {
    this.elements = {
        type: {
            displayOrder: 0,
        },
        affectedByScale: {
            displayOrder: 1,
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.type) || dump.type.value === 0, element);
            },
        },
        resizeMode: {
            displayOrder: 2,
        },
        cellSize: {
            displayOrder: 3,
            update(element, dump) {
                setHidden(
                    isMultipleInvalid(dump.type) ||
                        (dump.type.value !== 3 && dump.resizeMode.value !== 2),
                    element,
                );
            },
        },
        startAxis: {
            displayOrder: 4,
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.type) || dump.type.value !== 3, element);
            },
        },
        paddingLeft: {
            displayOrder: 4,
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.type) || dump.type.value === 0 || dump.type.value === 2, element);
            },
        },
        paddingRight: {
            displayOrder: 5,
            update(element, dump) {
                this.elements.paddingLeft.update.call(this, element, dump);
            },
        },
        paddingTop: {
            displayOrder: 4,
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.type) || dump.type.value === 0 || dump.type.value === 1, element);
            },
        },
        paddingBottom: {
            displayOrder: 5,
            update(element, dump) {
                this.elements.paddingTop.update.call(this, element, dump);
            },
        },
        spacingX: {
            displayOrder: 6,
            update(element, dump) {
                this.elements.paddingLeft.update.call(this, element, dump);
            },
        },
        spacingY: {
            displayOrder: 7,
            update(element, dump) {
                this.elements.paddingTop.update.call(this, element, dump);
            },
        },
        horizontalDirection: {
            displayOrder: 8,
            update(element, dump) {
                this.elements.paddingLeft.update.call(this, element, dump);
            },
        },
        verticalDirection: {
            displayOrder: 9,
            update(element, dump) {
                this.elements.paddingTop.update.call(this, element, dump);
            },
        },
        alignHorizontal: {
            displayOrder: 10,
            update(element, dump) {
                this.elements.paddingLeft.update.call(this, element, dump);
            },
        },
        alignVertical: {
            displayOrder: 11,
            update(element, dump) {
                this.elements.paddingTop.update.call(this, element, dump);
            },
        },
        constraint: {
            displayOrder: 12,
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.type) || dump.type.value !== 3, element);
            },
        },
        constraintNum: {
            displayOrder: 13,
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.type) || dump.type.value !== 3 || dump.constraint.value === 0, element);
            },
        },
    };
};
