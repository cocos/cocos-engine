
module.exports = (api) => {
    api.cache(true);
    return {
        plugins: [
            [require('babel-plugin-const-enum'), {
                transform: 'constObject'
            }],
        ],
        presets: [
            [require('@babel/preset-env'), {
                targets: { node: 'current', }
            }],
            [require('@cocos/babel-preset-cc'), {
                allowDeclareFields: true,
            }],
        ],
    };
};
