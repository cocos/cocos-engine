const { $, update, close } = require('./base');

exports.style = /* css */`
    .block-input-events {
        border: 1px solid var(--color-default-border-weaker);
        border-radius: 4px;
        margin: 8px;
        padding: 8px;
    }
`;

exports.template =/* html */ `
<div class="block-input-events">
    <ui-label value="i18n:ENGINE.components.blockInputEventsTip"></ui-label>
</div>`;
exports.$ = $;
exports.update = update;
exports.close = close;
