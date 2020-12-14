/* eslint-disable */
let isDevtool = false;
if (swan.getSystemInfoSync) {
    const { platform } = swan.getSystemInfoSync();
    isDevtool = platform === 'devtools';
}
else {
    let descriptor = Object.getOwnPropertyDescriptor(global, 'window')
    // 开发者工具无法重定义 window
    isDevtool = !(!descriptor || descriptor.configurable === true);
}


export default function () {
    return isDevtool;
}