
module.exports = (api) => {
    api.cache(true);
    return {
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
