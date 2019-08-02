// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
import { Texture2D } from '../../assets';
import { Node } from '../../scene-graph/node';
import { Scene } from '../../scene-graph/scene';
import { Terrain, TerrainInfo, TerrainLayer } from './terrain';
import { TerrainEditor } from './terrain-editor';
import { TerrainEditorManage } from './terrain-editor-manage';
import { eTerrainEditorMode} from './terrain-editor-mode';
import { TerrainEditorPaint } from './terrain-editor-paint';
import { TerrainEditorSculpt } from './terrain-editor-sculpt';

export class TerrainSample {
    public terrain: Terrain|null = null;
    public editor: TerrainEditor|null = null;
    public camera: Node|null = null;

    public onInit (scene: Scene) {
        console.log('TerrainSample::onInit1');

        const info = new TerrainInfo();
        info.tileSize = 1;
        info.blockCount[0] = 1;
        info.blockCount[1] = 1;

        const _node = new Node('Terrain');
        _node.setParent(scene);

        this.terrain = _node.addComponent(Terrain);
        if (this.terrain != null) {
            // build terrain
            this.terrain.build(info);

            this.editor = new TerrainEditor();
            this.editor.setEditTerrain(this.terrain as Terrain);

            // load layer
            cc.loader.loadRes('decal_1/texture', Texture2D, (err, asset) => {
                const layer = new TerrainLayer();
                layer.detailMap = asset;
                layer.tileSize = 8.0;

                if (this.terrain != null) {
                    this.terrain.addLayer(layer);
                }
            });

            cc.loader.loadRes('decal_2/texture', Texture2D, (err, asset) => {
                const layer = new TerrainLayer();
                layer.detailMap = asset;
                layer.tileSize = 8.0;

                if (this.terrain != null) {
                    this.terrain.addLayer(layer);
                }
            });

            const paintMode = this.editor.getMode(eTerrainEditorMode.PAINT) as TerrainEditorPaint;

            paintMode.setCurrentLayer(0);
        }

        this.camera = scene.getChildByName('Camera');
        if (this.camera == null) {
            console.log('Camera is null');
        }
    }

    public onUpdate (dtime: number) {
        if (this.editor != null) {
            this.editor.update(dtime);
        }
    }

    public onKeyDown (id: number) {
        if (this.terrain == null || this.editor == null) {
            return;
        }

        const mode = this.editor.getCurrentModeType();
        if (id === cc.macro.KEY.tab) {
            // change editor mode
            if (mode === eTerrainEditorMode.MANAGE) {
                this.editor.setMode(eTerrainEditorMode.SCULPT);
            }
            else if (mode === eTerrainEditorMode.SCULPT) {
                this.editor.setMode(eTerrainEditorMode.PAINT);
            }
            else if (mode === eTerrainEditorMode.PAINT) {
                this.editor.setMode(eTerrainEditorMode.SCULPT);
            }
        }
        else if (mode === eTerrainEditorMode.MANAGE) {
            if (id === cc.macro.KEY[1]) {
                this.onRebuildHeight();
            }
            else if (id === cc.macro.KEY[2]) {
                this.onRebuildBlock();
            }
        }
        else if (mode === eTerrainEditorMode.SCULPT) {
        }
        else if (mode === eTerrainEditorMode.PAINT) {
            // change current layer
            if (id === cc.macro.KEY[1]) {
                this.editor.setCurrentLayer(0);
            }
            else if (id === cc.macro.KEY[2]) {
                this.editor.setCurrentLayer(1);
            }
        }
    }

    public onMouseDown (id: number, x: number, y: number) {
        this.editor!.onMouseDown(id, x, y);
    }

    public onMouseUp (id: number, x: number, y: number) {
        this.editor!.onMouseUp(id, x, y);
    }

    public onMouseMove (x: number, y: number) {
        if (this.editor == null || this.camera == null) {
            return;
        }

        this.editor.onMouseMove(this.camera, x, y);
    }

    public onRebuildHeight () {
        if (this.terrain == null || this.editor == null) {
            return;
        }

        const info = new TerrainInfo();
        info.tileSize = this.terrain.info.tileSize * 2;
        info.blockCount[0] = this.terrain.info.blockCount[0];
        info.blockCount[1] = this.terrain.info.blockCount[1];
        info.weightMapSize = this.terrain.info.weightMapSize;
        info.lightMapSize = this.terrain.info.lightMapSize;
        this.terrain!.rebuild(info);

        if (this.camera != null) {
            const pos = this.camera.getPosition();
            pos.x = info.size.width / 2;

            this.camera.setPosition(pos);
        }
    }

    public onRebuildBlock () {
        if (this.terrain == null || this.editor == null) {
            return;
        }

        const info = new TerrainInfo();
        info.tileSize = this.terrain.info.tileSize;
        info.blockCount[0] = this.terrain.info.blockCount[0] + 1;
        info.blockCount[1] = this.terrain.info.blockCount[1] + 1;
        info.weightMapSize = this.terrain.info.weightMapSize;
        info.lightMapSize = this.terrain.info.lightMapSize;
        this.terrain.rebuild(info);

        if (this.camera != null) {
            const pos = this.camera.getPosition();
            pos.x = info.size.width / 2;

            this.camera.setPosition(pos);
        }
    }

    public onRebuildWeight () {
        if (this.terrain == null || this.editor == null) {
            return;
        }

        const info = new TerrainInfo();
        info.tileSize = this.terrain.info.tileSize;
        info.blockCount[0] = this.terrain.info.blockCount[0];
        info.blockCount[1] = this.terrain.info.blockCount[1];
        info.weightMapSize = 256;
        info.lightMapSize = this.terrain.info.lightMapSize;
        this.terrain.rebuild(info);
    }
}
