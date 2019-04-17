export interface ISharedLabelData {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D | null;
}

export class CanvasPool {
    public pool: ISharedLabelData[] = [];
    public get () {
        let data = this.pool.pop();

        if (!data) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            data = {
                canvas,
                context,
            };
        }

        return data;
    }

    public put (canvas: ISharedLabelData) {
        if (this.pool.length >= 32) {
            return;
        }
        this.pool.push(canvas);
    }
}

// export function packToDynamicAtlas(comp, frame) {
//     // TODO: Material API design and export from editor could affect the material activation process
//     // need to update the logic here
//     if (frame && !CC_TEST) {
//         if (!frame._original && dynamicAtlasManager) {
//             let packedFrame = dynamicAtlasManager.insertSpriteFrame(frame);
//             if (packedFrame) {
//                 frame._setDynamicAtlasFrame(packedFrame);
//             }
//         }
//         if (comp.sharedMaterials[0].getProperty('texture') !== frame._texture) {
//             comp._activateMaterial();
//         }
//     }
// }
