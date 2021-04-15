// 这是组件编辑的基类
const { updatePropByDump } = require('../utils/prop');

exports.template = `
<div class="component-container">
</div>
`;

exports.$ = {
    componentContainer: '.component-container',
};

exports.update = function (dump) {
    updatePropByDump(this, dump);
};
