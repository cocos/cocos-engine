// postinstall 相当：把 @cocos/engine-pal 的产物【复制】到 engineRoot/pal。
//
// 为什么必须挂到 engineRoot/pal（而非直接用 node_modules）：见 docs/pal-platforms-privatization.md §8.2——
//   引擎 cocos/* 通过相对路径深度 import pal（如 ../../pal/audio/type，23 处），由 rollup 基于
//   importer 文件位置解析成 <engineRoot>/pal/...，不经任何 alias；第二条链路(quick-compiler)与
//   tsc 类型检查同样依赖 pal 物理位于 engineRoot/pal。
//
// 为什么用【复制】而非软链(junction/symlink)：实测软链不可行（2026-07-03）。
//   rollup 的 nodeResolve(jail=realPath(engineRoot)) 与 tsc 都会对软链做 realpath，pal 文件的
//   真实路径落回 node_modules/@cocos/engine-pal/dist，导致 tsconfig 的 `@cocos/engine/*` paths
//   别名对其失效(tsc 不对 node_modules 内文件应用 paths) → 产物残留未解析的 `@cocos/engine/*`
//   import(运行时会坏)。tsconfig 单加 preserveSymlinks 也无效(nodeResolve 已先 realpath)。
//   要用软链得改 ccbuild 传 rollup preserveSymlinks，代价与副作用不划算。故用复制：pal 真实
//   物理位于 engineRoot/pal，paths 别名才生效。
const fs = require('fs');
const path = require('path');

const engineRoot = path.join(__dirname, '..');
const src = path.join(engineRoot, 'node_modules', '@cocos', 'engine-pal', 'dist');
const dst = path.join(engineRoot, 'pal');

if (!fs.existsSync(src)) {
    console.error(`[spread-pal] 找不到 pal 产物: ${src}\n请先安装 @cocos/engine-pal。`);
    process.exit(1);
}

// 安全清除已有 pal：软链只删链接本身(不碰目标)，真实目录才递归删。
function removeExisting(p) {
    let st;
    try { st = fs.lstatSync(p); } catch (e) { return; } // 不存在
    if (st.isSymbolicLink()) fs.unlinkSync(p);           // 兼容历史软链
    else fs.rmSync(p, { recursive: true, force: true });
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

removeExisting(dst);
copyDir(src, dst);
console.log(`[spread-pal] 已复制 ${count} 个文件: ${src} -> ${dst}`);
