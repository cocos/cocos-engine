# Spine WASM Compilation Guide / Spine WASM 编译指南

---

## 1. Environment Requirements / 环境要求

- **EMSdk 3.1.41**:  
  Download and configure environment variables according to the official EMSdk repository documentation.  
  需下载 EMSdk，并根据官方仓库文档配置环境变量。
- **CMake**:  
  Ensure CMake is added to the system `PATH`.  
  需将 CMake 添加到系统 `PATH` 环境变量。
- **Ninja**:  
  Ensure Ninja is added to the system `PATH`.  
  需将 Ninja 添加到系统 `PATH` 环境变量。

---

## 2. Modify CMakeLists.txt / 修改 CMakeLists.txt

- **Set Spine Version**:  
  Modify the `SPINE_VERSION` configuration based on the required Spine version.  
  根据需要的 Spine 版本修改 `SPINE_VERSION` 配置。
- **Debug/Release Mode**:  
  Adjust `CMAKE_BUILD_TYPE` (e.g., `Debug` or `Release`).  
  根据调试需求修改 `CMAKE_BUILD_TYPE`。
- **WASM/ASM.js Compilation**:  
  Set `BUILD_WASM=1` for WASM, or `BUILD_WASM=0` for ASM.js.  
  设置 `BUILD_WASM=1` 编译 WASM，或 `BUILD_WASM=0` 编译 ASM.js。

**Command Example**:  

```bash
emcmake cmake .. -G "Ninja" -DCMAKE_BUILD_TYPE=Release -DBUILD_WASM=1
```

---

## 3. Create Build Directory / 创建构建目录

- Create a temporary directory (e.g., `temp`) in the current folder.  
  在当前目录下创建临时目录（如 `temp`）：

```bash
mkdir temp && cd temp
```

---

## 4. Compilation Steps / 编译步骤

1. **Activate EMSdk Environment**:  
   激活 EMSdk 环境：
   - Windows:  

     ```bash
     emsdk_env.bat
     ```

   - Linux/macOS:  

     ```bash
     source ./emsdk_env.sh
     ```

2. **Generate Build Files**:  
   生成构建文件：

```bash
emcmake cmake ..
```

3. **Build with Ninja**:  
   使用 Ninja 编译：

```bash
ninja
```

---

## 5. Post-Compilation / 编译后处理

- **Generated Files**:  
  - `spine.wasm`  
  - `spine.js`  
  编译完成后，会在 `temp` 目录下生成 `spine.wasm` 和 `spine.js` 文件。

- **File Renaming & Placement**:  
  重命名并移动文件：
  - Rename `spine.js` to `spine.wasm.js`.  
    将 `spine.js` 重命名为 `spine.wasm.js`。
  - Copy both files to `native/external/emscripten/spine`.  
    将文件复制到 `native/external/emscripten/spine` 目录下。

---

## Key Notes / 注意事项

1. **Version Compatibility**:  
   Ensure EMSdk, CMake, and Spine versions are compatible.  
   确保 EMSdk、CMake 和 Spine 版本兼容。
2. **Path Validity**:  
   Verify that all paths (e.g., `emsdk_env`, output directory) are correct.  
   检查所有路径（如 `emsdk_env`、输出目录）是否有效。
3. **File Conflicts**:  
   Avoid overwriting existing files when renaming or copying.  
   重命名或复制时避免覆盖已有文件。
