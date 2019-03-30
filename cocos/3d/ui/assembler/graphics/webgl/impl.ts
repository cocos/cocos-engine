
// import { ccclass } from '../../../../../core/data/class-decorator';
import { Color, Vec2 } from '../../../../../core/value-types';
import { IARenderData } from '../../../../../renderer/ui/renderData';
import RecyclePool from '../../../../memop/recycle-pool';
import { arc, ellipse, roundRect, tesselateBezier } from '../helper';
import { LineCap, LineJoin, PointFlags} from '../types';
// const renderer = require('../../../index');
// const renderEngine = renderer.renderEngine;
// const IARenderData = renderEngine.IARenderData;
// const InputAssembler = renderEngine.InputAssembler;

export class Point extends Vec2 {
    public dx = 0;
    public dy = 0;
    public dmx = 0;
    public dmy = 0;
    public flags = 0;
    public len = 0;
    constructor (x: number, y: number) {
        super(x, y);
        this.reset();
    }

    public reset () {
        this.dx = 0;
        this.dy = 0;
        this.dmx = 0;
        this.dmy = 0;
        this.flags = 0;
        this.len = 0;
    }
}

export class Path {
    public closed = false;
    public nbevel = 0;
    public complex = true;
    public points: Point[] = [];
    constructor () {
        this.reset();
    }

    public reset () {
        this.closed = false;
        this.nbevel = 0;
        this.complex = true;

        if (this.points) {
            this.points.length = 0;
        }
        else {
            this.points = [];
        }
    }
}

export class Impl {

    public dataOffset = 0;
    public updatePathOffset = false;

    public pathLength = 0;
    public pathOffset = 0;

    public paths: Path[] = [];
    // inner properties
    public tessTol = 0.25;
    public distTol = 0.01;
    public fillColor = Color.WHITE;
    public lineCap = LineCap.BUTT;
    public strokeColor = Color.BLACK;
    public lineJoin = LineJoin.MITER;
    public lineWidth = 0;

    public pointsOffset = 0;

    private _commandx = 0;
    private _commandy = 0;
    private _points: Point[] = [];

    private _renderDatasPool: RecyclePool<IARenderData> = new RecyclePool(() =>  {
        return new IARenderData();
    }, 16);
    private _renderDatas: IARenderData[] = [];

    private _curPath: Path | null = null;

    public moveTo (x: number, y: number) {
        if (this.updatePathOffset) {
            this.pathOffset = this.pathLength;
            this.updatePathOffset = false;
        }

        this._addPath();
        this.addPoint(x, y, PointFlags.PT_CORNER);

        this._commandx = x;
        this._commandy = y;
    }

    public lineTo (x: number, y: number) {
        this.addPoint(x, y, PointFlags.PT_CORNER);

        this._commandx = x;
        this._commandy = y;
    }

    public bezierCurveTo (c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number) {
        const path = this._curPath!;
        const last = path.points[path.points.length - 1];
        if (!last) {
            return;
        }

        if (last.x === c1x && last.y === c1y && c2x === x && c2y === y) {
            this.lineTo(x, y);
            return;
        }

        tesselateBezier(this, last.x, last.y, c1x, c1y, c2x, c2y, x, y, 0, PointFlags.PT_CORNER);

        this._commandx = x;
        this._commandy = y;
    }

    public quadraticCurveTo (cx: number, cy: number, x: number, y: number) {
        const x0 = this._commandx;
        const y0 = this._commandy;
        this.bezierCurveTo(x0 + 2.0 / 3.0 * (cx - x0), y0 + 2.0 / 3.0 * (cy - y0), x + 2.0 / 3.0 * (cx - x), y + 2.0 / 3.0 * (cy - y), x, y);
    }

    public arc (cx: number, cy: number, r: number, startAngle: number, endAngle: number, counterclockwise: boolean) {
        arc(this, cx, cy, r, startAngle, endAngle, counterclockwise);
    }

    public ellipse (cx: number, cy: number, rx: number, ry: number) {
        ellipse(this, cx, cy, rx, ry);
        this._curPath!.complex = false;
    }

    public circle (cx: number, cy: number, r: number) {
        ellipse(this, cx, cy, r, r);
        this._curPath!.complex = false;
    }

    public rect (x: number, y: number, w: number, h: number) {
        this.moveTo(x, y);
        this.lineTo(x + w, y);
        this.lineTo(x + w, y + h);
        this.lineTo(x, y + h);

        this.close();
        this._curPath!.complex = false;
    }

    public roundRect (x: number, y: number, w: number, h: number, r: number) {
        roundRect(this, x, y, w, h, r);
        this._curPath!.complex = false;
    }

    public clear (clean: boolean = false) {
        this.pathLength = 0;
        this.pathOffset = 0;
        this.pointsOffset = 0;

        this.dataOffset = 0;

        this._curPath = null;

        this.paths.length = 0;
        this._points.length = 0;

        this._renderDatasPool.reset();
        const datas = this._renderDatas;
        for (let i = 0, l = datas.length; i < l; i++) {
            const data = datas[i];
            if (!data) {
                continue;
            }

            data.reset();
        }
    }

    public close () {
        this._curPath!.closed = true;
    }

    public requestRenderData () {
        const renderData = this._renderDatasPool.add();
        this._renderDatas.push(renderData);

        return renderData;
    }

    public getRenderDatas () {
        if (this._renderDatas.length === 0) {
            this.requestRenderData();
        }

        return this._renderDatas;
    }

    public addPoint (x: number, y: number, flags: PointFlags) {
        const path = this._curPath;
        if (!path) {
            return;
        }

        const points = this._points;
        const pathPoints = path.points;

        const offset = this.pointsOffset++;
        let pt: Point = points[offset];

        if (!pt) {
            pt = new Point(x, y);
            points.push(pt);
        } else {
            pt.x = x;
            pt.y = y;
        }

        pt.flags = flags;
        pathPoints.push(pt);
    }

    private _addPath () {
        const offset = this.pathLength;
        let path = this.paths[offset];

        if (!path) {
            path = new Path();

            this.paths.push(path);
        } else {
            path.reset();
        }

        this.pathLength++;
        this._curPath = path;

        return path;
    }
}
