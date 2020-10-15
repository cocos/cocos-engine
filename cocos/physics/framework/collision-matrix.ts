
export class CollisionMatrix {

    updateArray: number[] = [];

    constructor () {
        for (let i = 0; i < 32; i++) {
            const key = 1 << i;
            this[`_${key}`] = 0xffffffff;
            Object.defineProperty(this, key, {
                'get': function () { return this[`_${key}`] },
                'set': function (v: number) {
                    const self = this as CollisionMatrix;
                    if (self[`_${key}`] != v) {
                        self[`_${key}`] = v;
                        if (self.updateArray.indexOf(key) < 0) {
                            self.updateArray.push(key);
                        }
                    }
                }
            })
        }
    }
}
