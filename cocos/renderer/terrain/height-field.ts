import { clamp } from '../../core/math';

export class HeightField {
    public data: Uint16Array = new Uint16Array();
    public w: number = 0;
    public h: number = 0;

    constructor (w: number, h: number) {
        this.w = w;
        this.h = h;
        this.data = new Uint16Array(w * h);

        for (let i = 0; i < w * h; ++i) {
            this.data[i] = 0;
        }
    }

    public set (i: number, j: number, value: number) {
        this.data[j * this.w + i] = value;
    }

    public get (i: number, j: number) {
        return this.data[j * this.w + i];
    }

    public getClamp (i: number, j: number) {
        i = clamp(i, 0, this.w - 1);
        j = clamp(j, 0, this.h  - 1);

        return this.get(i, j);
    }

    public getAt (x: number, y: number) {
        const fx = x / this.w;
        const fy = y / this.h;

        let ix0 = Math.floor(fx);
        let iz0 = Math.floor(fy);
        let ix1 = ix0 + 1;
        let iz1 = iz0 + 1;
        const dx = fx - ix0;
        const dz = fy - iz0;

        ix0 = clamp(ix0, 0, this.w - 1);
        iz0 = clamp(iz0, 0, this.h - 1);
        ix1 = clamp(ix1, 0, this.w - 1);
        iz1 = clamp(iz1, 0, this.h - 1);

        let a = this.get(ix0, iz0);
        const b = this.get(ix1, iz0);
        const c = this.get(ix0, iz1);
        let d = this.get(ix1, iz1);
        const m = (b + c) * 0.5;

        if (dx + dz <= 1.0) {
            d = m + (m - a);
        }
        else {
            a = m + (m - d);
        }

        const h1 = a * (1.0 - dx) + b * dx;
        const h2 = c * (1.0 - dx) + d * dx;

        const h = h1 * (1.0 - dz) + h2 * dz;

        return h;
    }
}
