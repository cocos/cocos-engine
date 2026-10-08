// postinstall 相当：把 @cocos/engine-platforms 的预打包 adapter 【复制】到 engineRoot/bin/adapter。
//
// 与 spread-pal.cjs 的区别：
//   - pal 发布的是逐文件源码，必须铺到 engineRoot/pal 供 ccbuild 每次构建时编译；
//   - platforms 发布的是【已打包产物】bin/adapter，游戏构建期只拷贝它（native/harmonyos
//     从 bin/adapter/native；编辑器/预览经 compiler 从 bin/adapter/nodejs 生成 bin/.editor）。
//     故这里只需把包里的 bin/adapter 复制到 engineRoot/bin/adapter，不再本地跑 build-adapter。
//
// 容错：本包尚未正式发布 npm 时，一次干净的 `npm i` 拉不到它。此时【打印警告并 exit 0】，
//   保留 engineRoot 已存在的 bin/adapter，避免阻断 postinstall。发布并加入 dependencies 后必然能找到。
const fs = require('fs');
const path = require('path');

const engineRoot = path.join(__dirname, '..');
const src = path.join(engineRoot, 'node_modules', '@cocos', 'engine-platforms', 'bin', 'adapter');
const dst = path.join(engineRoot, 'bin', 'adapter');

if (!fs.existsSync(src)) {
    console.warn(`[spread-adapter] 未找到 @cocos/engine-platforms 的预打包 adapter: ${src}`);
    console.warn('[spread-adapter] 跳过（保留已有 bin/adapter）。该包正式发布并加入 engine dependencies 后此步会自动生效。');
    process.exit(0);
}

let count = 0;
function copyDir(s, d) {
    fs.mkdirSync(d, { recursive: true });
    for (const name of fs.readdirSync(s)) {
        const sp = path.join(s, name);
        const dp = path.join(d, name);
        if (fs.statSync(sp).isDirectory()) copyDir(sp, dp);
        else { fs.copyFileSync(sp, dp); count++; }
    }
}

// 只清除 bin/adapter（不动 bin 下其它产物，如 .editor / .cache 等）
fs.rmSync(dst, { recursive: true, force: true });
copyDir(src, dst);
console.log(`[spread-adapter] 已复制 ${count} 个文件: ${src} -> ${dst}`);
