const { $, update, close } = require('./base');

exports.style = /* css */`
    .block-input-events-tip {
        background-color: rgb(51, 51, 51);
        border: 1px solid rgb(102, 102, 102);
        border-radius: 3px;
        margin: 10px;
        padding: 10px;
    }
`;

exports.template =/* html */ `
<div class="block-input-events-tip">
    <ui-label value="i18n:ENGINE.components.blockInputEventsTip"></ui-label>
</div>`;
exports.$ = $;
exports.update = update;
exports.close = close;
