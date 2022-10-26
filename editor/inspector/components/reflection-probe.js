const { template, $, update } = require('./base');
const MARGIN = '4PX';

exports.template = template;
exports.$ = $;
exports.update = update;

exports.ready = function() {
    const $prop = document.createElement('ui-prop');
    this.$.componentContainer.before($prop);

    const $label = document.createElement('ui-label');
    $label.setAttribute('slot', 'label');
    $label.value = 'Generate';
    $prop.appendChild($label);

    const $button = document.createElement('ui-button');
    $button.setAttribute('slot', 'content');
    $button.setAttribute('class', 'blue');
    $button.innerText = 'Generate';
    $prop.appendChild($button);

    $button.addEventListener('confirm', async () => {
        // Call the bakeCubemap function in the Reflection Probe component
    });
};


