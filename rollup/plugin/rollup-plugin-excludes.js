//
// 根据需要剔除模块的入口函数的相对路径
// 对模块的模块进行 url 匹配如果有则返回空对象，从而进行剔除模块
//
exports.excludes = function (options = {}) {
    let exclude_modules = options.modules || [];
    return {
        name: 'excludes',
        load (url) {
            for (let i = 0; i < exclude_modules.length; ++i) {
                let module = exclude_modules[i];
                if (url.indexOf(module) > -1) {
                    return 'export default {}';
                }
            }
            return null;
        },
    };
};
