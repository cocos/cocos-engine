
module.exports = (api) => {
    api.cache(true);
    return {
        presets: [
            [require('@babel/preset-env'), {
                targets: { node: 'current', },
                loose: true,
            }],
            [require('@cocos/babel-preset-cc'), {
                allowDeclareFields: true,
            }],
        ],
    };
};
