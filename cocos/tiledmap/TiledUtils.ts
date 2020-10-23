import { Rect, SpriteFrame, Texture2D } from "../core";
import { GID, TiledGrid, TiledTextureGrids, TMXTilesetInfo } from "./TiledTypes";

export function fillTextureGrids(tileset: TMXTilesetInfo, texGrids: TiledTextureGrids, spFrame?: SpriteFrame) {

    let spf: SpriteFrame = spFrame ? spFrame : tileset.sourceImage!;
    let tex: Texture2D = spf.texture as Texture2D;

    let collection = tileset.collection;

    if (!tileset.imageSize.width || !tileset.imageSize.height) {
        let sourceImage = tileset.sourceImage!;
        tileset.imageSize.width = sourceImage.width;
        tileset.imageSize.height = sourceImage.height;
    }

    let imageWidth = tileset.imageSize.width;
    let imageHeight = tileset.imageSize.height;

    let tw = tileset._tileSize.width,
        th = tileset._tileSize.height;
    let texWidth = spf.width,
        texHeight = spf.height;
    let spacing = tileset.spacing,
        margin = tileset.margin;

    let count = 1;
    if (!collection) {
        let cols = Math.floor((imageWidth - margin * 2 + spacing) / (tw + spacing));
        let rows = Math.floor((imageHeight - margin * 2 + spacing) / (th + spacing));
        count = Math.max(1, rows * cols);
    }

    let gid_ = tileset.firstGid;
    let grid: TiledGrid | null = null;
    let override = texGrids.get(gid_) ? true : false;

    // Tiledmap may not be partitioned into blocks, resulting in a count value of 0

    let maxGid = (tileset.firstGid as unknown as number) + count;
    let gid = gid_ as unknown as number;
    for (; gid < maxGid; ++gid) {
        // Avoid overlapping
        if (override && !texGrids.get(gid as unknown as GID)) {
            override = false;
        }
        if (!override && texGrids.get(gid as unknown as GID)) {
            break;
        }

        grid = {
            tileset: tileset,
            x: 0, y: 0, width: tw, height: th,
            t: 0, l: 0, r: 0, b: 0,
            cx: 0, cy: 0,
            offsetX: 0,
            offsetY: 0,
            rotated: false,
            gid: gid_,
            spriteFrame: spf,
            texture: tex,
        };

        tileset.rectForGID(gid_, grid);

        if (!spFrame || count > 1) {
            grid.l = grid.x / texWidth;
            grid.t = grid.y / texHeight;
            grid.r = (grid.x + grid.width) / texWidth;
            grid.b = (grid.y + grid.height) / texHeight;
            grid._rect = new Rect(grid.x, grid.y, grid.width, grid.height);
        } else if (spFrame.rotated) {
            grid._rotated = true;
            grid._name = spFrame.name;
            grid._rect = spFrame.getRect();
            grid.l = spFrame.uv[0];
            grid.t = spFrame.uv[1];
            grid.r = spFrame.uv[4];
            grid.b = spFrame.uv[3];
        } else {
            grid._name = spFrame.name;
            grid._rect = spFrame.getRect();
            grid.l = spFrame.uv[0];
            grid.t = spFrame.uv[5];
            grid.r = spFrame.uv[2];
            grid.b = spFrame.uv[1];
        }
        grid.cx = (grid.l + grid.r) / 2;
        grid.cy = (grid.t + grid.b) / 2;

        texGrids[gid] = grid;
    }
}


export function loadAllTextures(textures:SpriteFrame[], loadedCallback:any) {
    let totalNum = textures.length;
    if (totalNum === 0) {
        loadedCallback();
        return;
    }

    let curNum = 0;
    let itemCallback = function () {
        curNum++;
        if (curNum >= totalNum) {
            loadedCallback();
        }
    };

    for (let i = 0; i < totalNum; i++) {
        let tex = textures[i];
        if (!tex.loaded) {
            tex.once('load', function () {
                itemCallback();
            });
        } else {
            itemCallback();
        }
    }
}