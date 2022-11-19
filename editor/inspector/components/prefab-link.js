const { template, $, update } = require('./base');

exports.template = template;
exports.$ = $;
exports.update = update;

exports.ready = function() {
    const tooltip = document.createElement('ui-tooltip');
    tooltip.setAttribute('arrow', 'top left+10px');
    this.$.componentContainer.before(tooltip);

    const label = document.createElement('ui-label');
    label.setAttribute('style', 'display: inline-block; padding: 10px;');
    label.setAttribute('value', 'i18n:ENGINE.components.prefab_link.brief_help');
    tooltip.appendChild(label);
};
