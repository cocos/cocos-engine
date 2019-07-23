// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
import { Terrain, TerrainInfo, TerrainLayer } from './terrain'
import { Scene } from '../../scene-graph/scene';
import { Node } from '../../scene-graph/node';
import { Texture2D } from '../../assets';
import { TerrainEditor } from './terrain-editor';
import { eTerrainEditorMode} from './terrain-editor-mode'
import { TerrainEditor_Manage } from './terrain-editor-manage'
import { TerrainEditor_Sculpt } from './terrain-editor-sculpt'
import { TerrainEditor_Paint } from './terrain-editor-paint'

export class TerrainSample
{
    terrain: Terrain|null = null;
    editor: TerrainEditor|null = null;
    camera: Node|null = null;

    onInit(scene: Scene) {
        console.log("TerrainSample::onInit");

        let info = new TerrainInfo;
        info.tileSize = 1;
        info.blockCount[0] = 1;
        info.blockCount[1] = 1;

        let _node = new Node('Terrain');
        _node.setParent(scene);

        this.terrain = _node.addComponent(Terrain);
        if (this.terrain != null) {
            // build terrain
            this.terrain.build(info);

            cc.loader.loadRes("decal_1/decal_1", Texture2D, (err, asset) => {
                let layer = new TerrainLayer;
                layer.detailMap = asset;
                layer.tileSize = 8.0;

                if (this.terrain != null) {
                    this.terrain.addLayer(layer);
                }
            });

            cc.loader.loadRes("decal_2/decal_2", Texture2D, (err, asset) => {
                let layer = new TerrainLayer;
                layer.detailMap = asset;
                layer.tileSize = 8.0;

                if (this.terrain != null) {
                    this.terrain.addLayer(layer);
                }
            });

            this.editor = new TerrainEditor;
            this.editor.setEditTerrain(this.terrain as Terrain);

            let sculptMode = this.editor.getMode(eTerrainEditorMode.SCULPT) as TerrainEditor_Sculpt;
            let paintMode = this.editor.getMode(eTerrainEditorMode.PAINT) as TerrainEditor_Paint;

            paintMode.setCurrentLayer(0);
        }
        
        this.camera = scene.getChildByName("Camera");
        if (this.camera == null) {
            console.log('Camera is null');
        }
    }

    onUpdate(dtime: number) {
        if (this.editor != null) {
            this.editor.update(dtime);
        }
    }

    onKeyDown(id: number) {
        if (this.terrain == null || this.editor == null) {
            return;
        }

        let mode = this.editor.getCurrentModeType();
        if (id == cc.macro.KEY.tab) {
            // change editor mode
            if (mode == eTerrainEditorMode.MANAGE) {
                this.editor.setMode(eTerrainEditorMode.SCULPT);
            }
            else if (mode == eTerrainEditorMode.SCULPT) {
                this.editor.setMode(eTerrainEditorMode.PAINT);
            }
            else if (mode == eTerrainEditorMode.PAINT) {
                this.editor.setMode(eTerrainEditorMode.MANAGE);
            }
        }
        else if (mode == eTerrainEditorMode.MANAGE) {
            if (id == cc.macro.KEY[1]) {
                this.onRebuildHeight();
            }
            else if (id== cc.macro.KEY[2]) {
                this.onRebuildBlock();
            }
        }
        else if (mode == eTerrainEditorMode.SCULPT) {
        }
        else if (mode == eTerrainEditorMode.PAINT) {
            // change current layer
            if (id == cc.macro.KEY[1]) {
                this.editor.setCurrentLayer(0);
            }
            else if (id== cc.macro.KEY[2]) {
                this.editor.setCurrentLayer(1);
            }
        }
    }

    onMouseDown(id: number, x: number, y: number) {
        this.editor!.onMouseDown(id, x, y);
    }

    onMouseUp(id: number, x: number, y: number) {
        this.editor!.onMouseUp(id, x, y);
    }

    onMouseMove(x: number, y: number) {
        if (this.editor == null || this.camera == null) {
            return;
        }

        this.editor.onMouseMove(this.camera, x, y);
    }

    onRebuildHeight() {
        if (this.terrain == null || this.editor == null) {
            return;
        }

        let info = new TerrainInfo;
        info.tileSize = this.terrain.info.tileSize * 2;
        info.blockCount[0] = this.terrain.info.blockCount[0];
        info.blockCount[1] = this.terrain.info.blockCount[1];
        info.weightMapSize = this.terrain.info.weightMapSize;
        info.lightMapSize = this.terrain.info.lightMapSize;
        this.terrain!.rebuild(info);

        if (this.camera != null) {
            let pos = this.camera.getPosition();
            pos.x = info.size[0] / 2;

            this.camera.setPosition(pos);
        }
    }

    onRebuildBlock() {
        if (this.terrain == null || this.editor == null) {
            return;
        }

        let info = new TerrainInfo;
        info.tileSize = this.terrain.info.tileSize;
        info.blockCount[0] = this.terrain.info.blockCount[0] + 1;
        info.blockCount[1] = this.terrain.info.blockCount[1] + 1;
        info.weightMapSize = this.terrain.info.weightMapSize;
        info.lightMapSize = this.terrain.info.lightMapSize;
        this.terrain.rebuild(info);

        if (this.camera != null) {
            let pos = this.camera.getPosition();
            pos.x = info.size[0] / 2;

            this.camera.setPosition(pos);
        }
    }

    onRebuildWeight() {
        if (this.terrain == null || this.editor == null) {
            return;
        }

        let info = new TerrainInfo;
        info.tileSize = this.terrain.info.tileSize;
        info.blockCount[0] = this.terrain.info.blockCount[0];
        info.blockCount[1] = this.terrain.info.blockCount[1];
        info.weightMapSize = 256;
        info.lightMapSize = this.terrain.info.lightMapSize;
        this.terrain.rebuild(info);
    }
}
