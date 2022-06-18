import { RenderData } from './render-data';
import { RenderDrawInfo } from './render-draw-info';

export class RenderEntity {
    private _renderDataArr:RenderData[] = [];
    private _renderDrawInfoArr:RenderDrawInfo[] = [];


    


    constructor () {

    }

    public addRenderData (renderData:RenderData) {
        this._renderDataArr.push(renderData);
    }

    public destroy () {
        this._renderDataArr = [];
        this._renderDrawInfoArr = [];
    }
}
