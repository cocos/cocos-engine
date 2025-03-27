# Spine WASM Compilation Guide

---

## 1. Environment Requirements

- **EMSdk 3.1.41**:  
  Download and configure environment variables according to the official EMSdk repository documentation.
- **CMake**:  
  Ensure CMake is added to the system `PATH`.
- **Ninja**:  
  Ensure Ninja is added to the system `PATH`.

---

## 2. Modify CMakeLists.txt

- **Set Spine Version**:  
  Modify the `SPINE_VERSION` configuration based on the required Spine version.
- **Debug/Release Mode**:  
  Adjust `CMAKE_BUILD_TYPE` (e.g., `Debug` or `Release`).
- **WASM/ASM.js Compilation**:  
  Set `BUILD_WASM=1` for WASM, or `BUILD_WASM=0` for ASM.js.

**Command Example**:

```bash
emcmake cmake .. -G "Ninja" -DCMAKE_BUILD_TYPE=Release -DBUILD_WASM=1
```

---

## 3. Create Build Directory

- Create a temporary directory (e.g., `temp`) in the current folder:

```bash
mkdir temp && cd temp
```

---

## 4. Compilation Steps

1. **Activate EMSdk Environment**:
   - Windows:

     ```bash
     emsdk_env.bat
     ```

   - Linux/macOS:

     ```bash
     source ./emsdk_env.sh
     ```

2. **Generate Build Files**:

```bash
emcmake cmake ..
```

3. **Build with Ninja**:

```bash
ninja
```

---

## 5. Post-Compilation

- **Generated Files**:
  - `spine.wasm`
  - `spine.js`

- **File Renaming & Placement**:
  - Rename `spine.js` to `spine.wasm.js`.
  - Copy both files to `native/external/emscripten/spine`.

---

## Key Notes

1. **Version Compatibility**:  
   Ensure EMSdk, CMake, and Spine versions are compatible.
2. **Path Validity**:  
   Verify that all paths (e.g., `emsdk_env`, output directory) are correct.
