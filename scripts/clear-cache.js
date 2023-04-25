'use strict';

const fs = require('fs');
const path = require('path');

function deleteFolderRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    if(fs.lstatSync(dirPath).isDirectory()) {
        fs.readdirSync(dirPath).forEach(function(file) {
            const curPath = path.join(dirPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
              deleteFolderRecursive(curPath);
            } else {
              fs.unlinkSync(curPath);
            }
          });
          fs.rmdirSync(dirPath);
          console.log("正删除 "+ dirPath);
    } else {
        fs.unlinkSync(dirPath);
        console.log("正删除 "+ dirPath);
    }
  } else {
    console.log("不存在 " + dirPath);
  }
};

let deleteDirPaths = [
    path.join(__dirname, "../.DS_Store"),
    path.join(__dirname, "../@types/consts.d.ts"),
    path.join(__dirname, "../DebugInfos.json"),
    path.join(__dirname, "../bin/"),
    path.join(__dirname, "../platforms/runtime/local-commit.json"),
    path.join(__dirname, "../scripts/native-pack-tool/dist/"),
    path.join(__dirname, "../scripts/typedoc-plugin/lib/"),
    path.join(__dirname, "../native/simulator/"),
    path.join(__dirname, "../native/tools/.DS_Store"),
    path.join(__dirname, "../native/build/"),
    path.join(__dirname, "../native/compile_commands.json"),
    path.join(__dirname, "../native/.cache/"),
];

deleteDirPaths.forEach((dirPath)=>{
    deleteFolderRecursive(dirPath);
})

