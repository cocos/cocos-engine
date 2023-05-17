import { LODGroup, LOD } from '../../../cocos/3d/lod';
import { Node, NodeActivator } from "../../../cocos/scene-graph"
import { MeshRenderer } from '../../../cocos/3d/framework/mesh-renderer';
import { Vec3, cclegacy  } from '../../../cocos/core';
const fs = require('fs-extra');

describe('LOD', () => {

    test('set lod screenUsagePercentage', () => {
        const lod = createLOD();
        lod.screenUsagePercentage = 0.02;
        expect(lod.screenUsagePercentage).toBe(0.02);
    });

    test('lod renderers', () => {
        const lod = createLOD();
        let renderers = createMeshRenderers();
        lod.renderers = renderers;
        expect(lod.renderers).toEqual(renderers);
        expect(lod.rendererCount).toBe(renderers.length);
    });

    test('lod renderers operate', () => {
        const lod = createLOD();
        lod.renderers = createMeshRenderers();
        const renderer = new MeshRenderer();
        renderer.name = "inserted";
        lod.insertRenderer(2, renderer);
        expect(lod.getRenderer(2)).toEqual(renderer);

        const renderer2 = new MeshRenderer();
        renderer2.name = "updated";
        lod.setRenderer(2, renderer2);
        expect(lod.getRenderer(2)).toBe(renderer2);

        lod.deleteRenderer(2);
        expect(lod.getRenderer(2)?.name).toContain("test");
    });

    function createLOD() {
        const lod = new LOD();
        return lod;
    }

    function createMeshRenderers() {
        const renderers : MeshRenderer[]= [];
        for (let i = 0; i < 5; i++) {
            renderers[i] = new MeshRenderer();
            renderers[i].name = "test_" + i;
        }
        return renderers;
    }
});

describe('LodGroup', () => {

    test('LodGroup LODs attribute', () => {
        const lodGroup = createLODGroup();
        let LODs = createLODs();
        lodGroup.LODs = LODs;
        expect(lodGroup.LODs).toEqual(LODs);
        expect(lodGroup.LODs.length).toEqual(lodGroup.lodCount);
    });

    test('LodGroup objectSize', () => {
        const lodGroup = createLODGroup();
        lodGroup.objectSize = 2;
        expect(lodGroup.objectSize).toBe(2);
    });

    test('LodGroup resetObjectSize', () => {
        const lodGroup = createLODGroup();
        lodGroup.objectSize = 2;
        lodGroup.resetObjectSize();
        expect(lodGroup.objectSize).toBe(1);
    });

    test('LodGroup forceLOD', () => {
        const lodGroup = createLODGroup();
        lodGroup.LODs = createLODs();
        lodGroup.forceLOD(1);
        expect(lodGroup.lodGroup.getLockedLODLevels()[0]).toBe(1);

        lodGroup.forceLOD(-1);
        expect(lodGroup.lodGroup.getLockedLODLevels().length).toBe(0);
    });

    test('LodGroup localBoundaryCenter', () => {
        const lodGroup = createLODGroup();
        const tmp = new Vec3(1, 0, 1);
        lodGroup.localBoundaryCenter = tmp;
        expect(lodGroup.localBoundaryCenter !== tmp).toBeTruthy();
    });

    test('LodGroup recalculateBounds', async () => {
        const node = new Node();
        node.addComponent(LODGroup);
        const lodGroup: LODGroup|null = node.getComponent(LODGroup);
        if (lodGroup !== null) {
            const lod = new LOD();
            lodGroup.insertLOD(0, 0.1, lod);
            const json = await fs.readFile("editor/assets/default_prefab/3d/Capsule.prefab", "utf-8");
            let prefab = cclegacy.deserialize(json);
            const node = cclegacy.instantiate(prefab);
            const renderer = node.getComponent(MeshRenderer);

            const meshJson = [{
                "__type__": "cc.Mesh",
                "_name": "",
                "_objFlags": 0,
                "_native": ".bin",
                "_struct": {
                  "primitives": [
                    {
                      "primitiveMode": 7,
                      "vertexBundelIndices": [
                        0
                      ],
                      "indexView": {
                        "offset": 73976,
                        "length": 24576,
                        "count": 6144,
                        "stride": 4
                      }
                    }
                  ],
                  "vertexBundles": [
                    {
                      "view": {
                        "offset": 0,
                        "length": 73976,
                        "count": 1321,
                        "stride": 56
                      },
                      "attributes": [
                        {
                          "name": "a_position",
                          "format": 32,
                          "isNormalized": false
                        },
                        {
                          "name": "a_normal",
                          "format": 32,
                          "isNormalized": false
                        },
                        {
                          "name": "a_texCoord",
                          "format": 21,
                          "isNormalized": false
                        },
                        {
                          "name": "a_tangent",
                          "format": 44,
                          "isNormalized": false
                        },
                        {
                          "name": "a_texCoord1",
                          "format": 21,
                          "isNormalized": false
                        }
                      ]
                    }
                  ],
                  "minPosition": {
                    "__type__": "cc.Vec3",
                    "x": -0.5,
                    "y": -1,
                    "z": -0.5
                  },
                  "maxPosition": {
                    "__type__": "cc.Vec3",
                    "x": 0.5,
                    "y": 1,
                    "z": 0.5
                  }
                },
                "_hash": 2864929873,
                "_allowDataAccess": true
              }];
              let mesh = cclegacy.deserialize(meshJson);
              const data = new ArrayBuffer(20000);
              mesh.reset({data: data, struct: mesh.struct});
              renderer.mesh = mesh;
            
              const activator = new NodeActivator();
              activator.activateNode(node, true);

              lod.insertRenderer(0, renderer);
              lodGroup.recalculateBounds();
              
              expect(lodGroup.objectSize > 0).toBeTruthy();
        }
        
    });
    

    test('LodGroup operate', () => {
        const lodGroup = createLODGroup();
        lodGroup.LODs = createLODs();

        lodGroup.insertLOD(2, 0.001);
        expect(lodGroup.getLOD(2)?.screenUsagePercentage).toBe(0.001);

        const lod = new LOD();
        lod.screenUsagePercentage = 0.065;
        lodGroup.setLOD(2, lod);
        expect(lodGroup.getLOD(2)).toEqual(lod);

        lodGroup.eraseLOD(2);
        expect(lodGroup.getLOD(2)?.screenUsagePercentage).toBeGreaterThan(1);
    });


    function createLODGroup() {
        const lodGroup = new LODGroup();
        return lodGroup;
    }

    function createLODs() {
        const LODs : LOD[]= [];
        for (let i = 0; i < 5; i++) {
            LODs[i] = new LOD();
            LODs[i].screenUsagePercentage = i;
        }
        return LODs;
    }
});