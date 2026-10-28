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
const crypto = require('crypto');

const engineRoot = path.join(__dirname, '..');
const packageRoot = path.join(engineRoot, 'node_modules', '@cocos', 'engine-platforms');
const src = path.join(packageRoot, 'bin', 'adapter');
const dst = path.join(engineRoot, 'bin', 'adapter');
const patchAssetsPattern = /^@cocos\+engine-platforms\+.*\.patch-assets\.json$/;

if (!fs.existsSync(src)) {
    console.warn(`[spread-adapter] 未找到 @cocos/engine-platforms 的预打包 adapter: ${src}`);
    console.warn('[spread-adapter] 跳过（保留已有 bin/adapter）。该包正式发布并加入 engine dependencies 后此步会自动生效。');
    process.exit(0);
}

function sha256(content) {
    return crypto.createHash('sha256').update(content).digest('hex').toUpperCase();
}

function safeAssetPath(root, relativePath) {
    if (typeof relativePath !== 'string' || !relativePath || relativePath.includes('\\')) {
        throw new Error(`[spread-adapter] 非法二进制资源路径: ${String(relativePath)}`);
    }
    const normalized = path.posix.normalize(relativePath);
    if (normalized !== relativePath || normalized === '..' || normalized.startsWith('../') || path.posix.isAbsolute(normalized)) {
        throw new Error(`[spread-adapter] 二进制资源路径越界: ${relativePath}`);
    }
    const resolvedRoot = path.resolve(root);
    const destination = path.resolve(resolvedRoot, ...normalized.split('/'));
    if (destination !== resolvedRoot && !destination.startsWith(`${resolvedRoot}${path.sep}`)) {
        throw new Error(`[spread-adapter] 二进制资源路径越界: ${relativePath}`);
    }
    return destination;
}

function restorePatchAssets() {
    const patchesDir = path.join(engineRoot, 'patches');
    if (!fs.existsSync(patchesDir)) return 0;
    const manifests = fs.readdirSync(patchesDir).filter((name) => patchAssetsPattern.test(name));
    if (manifests.length === 0) return 0;
    if (manifests.length !== 1) {
        throw new Error(`[spread-adapter] 只能存在一个 Platforms 二进制资源清单，实际为 ${manifests.length} 个。`);
    }

    const manifestFile = path.join(patchesDir, manifests[0]);
    const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    const installed = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
    if (manifest.format !== 1 || manifest.package !== '@cocos/engine-platforms'
        || manifest.baseline !== installed.version || manifest.payload !== 'bin/adapter'
        || !Array.isArray(manifest.files) || !Array.isArray(manifest.deletions)) {
        throw new Error(`[spread-adapter] 无效或版本不匹配的二进制资源清单: ${manifestFile}`);
    }

    for (const relativePath of manifest.deletions) {
        fs.rmSync(safeAssetPath(src, relativePath), { force: true });
    }
    for (const entry of manifest.files) {
        if (typeof entry.base64 !== 'string' || Buffer.from(entry.base64, 'base64').toString('base64') !== entry.base64) {
            throw new Error(`[spread-adapter] 非法 base64 二进制资源: ${entry.path}`);
        }
        const content = Buffer.from(entry.base64, 'base64');
        if (content.length !== entry.bytes || sha256(content) !== entry.sha256) {
            throw new Error(`[spread-adapter] 二进制资源校验失败: ${entry.path}`);
        }
        const destination = safeAssetPath(src, entry.path);
        fs.mkdirSync(path.dirname(destination), { recursive: true });
        fs.writeFileSync(destination, content);
        if (fs.statSync(destination).size !== entry.bytes || sha256(fs.readFileSync(destination)) !== entry.sha256) {
            throw new Error(`[spread-adapter] 二进制资源写入校验失败: ${entry.path}`);
        }
    }
    console.log(`[spread-adapter] 已从 ${manifests[0]} 恢复 ${manifest.files.length} 个、删除 ${manifest.deletions.length} 个二进制资源。`);
    return manifest.files.length + manifest.deletions.length;
}

restorePatchAssets();

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
