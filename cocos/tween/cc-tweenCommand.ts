import { CCTweenUnion } from './cc-tweenUnion';
import { getWrap, IWrapped, setWrap } from './util';

export class CCTweenCommand {
    public readonly quene: CCTweenUnion[] = [];

    public get length () {
        return this.quene.length;
    }

    public get firstUnion () {
        return this.quene[0];
    }

    public get lastUnion () {
        return this.quene[this.quene.length - 1];
    }

    public updateChain () {

        const len = this.length;
        let i0 = 0;
        let i1 = 1;
        while (i0 < len) {
            const union = this.quene[i0];

            if (i1 < len) {

                if (union.length > 0) {
                    const next = this.quene[i1];

                    if (union.repeatTimes === 0) {

                        if (next.length > 0) {
                            const lastAction = union.lastAction;
                            lastAction.tween.chain(next.lastAction.tween);
                        }

                    } else {
                        this.wrapAndEvent(union);
                    }

                } // else do noting for now
            } else {

                // lastest
                if (union.length > 0 && union.repeatTimes !== 0) {
                    // wrap
                    const lastAction = union.lastAction;
                    setWrap<CCTweenUnion>(lastAction.tween, union);
                    // event
                    (lastAction.tween as any).cc_onCompleteCallback(this._onComplete.bind(this));
                }

            }

            ++i0;
            ++i1;
        }

    }

    public start () {
        this.updateChain();

        if (this.length > 0) {
            this.firstUnion.start();
        }
    }

    public stop () {
        for (let i = 0; i < this.length; i++) {
            const union = this.quene[i];
            if (union.stop()) {
                break;
            }
        }
    }

    public union (union: CCTweenUnion) {
        this.quene.push(union);
    }

    public isExistUnion (union: CCTweenUnion) {
        return this.quene.indexOf(union) !== -1;
    }

    public wrapAndEvent (union: CCTweenUnion) {
        // wrap
        const lastAction = union.lastAction;
        setWrap<CCTweenUnion>(lastAction.tween, union);

        // event
        (lastAction.tween as any).cc_onCompleteCallback(this._onComplete.bind(this));
    }

    private _onComplete (tween: IWrapped<TWEEN.Tween>) {
        const union = getWrap<CCTweenUnion>(tween);

        // first, the union is need repeat?
        if (union.repeatTimes > 0 && union.lastCount > 0) {
            union.runTimes++;

            const index = this.quene.indexOf(union);
            if (index >= 0) {
                for (let i = 0; i < index; i++) {
                    this.quene[i].runTimes = 0;
                }
                this.firstUnion.start();
            }

        } else if (union.repeatTimes === -1) {

            const index = this.quene.indexOf(union);
            if (index >= 0) {
                for (let i = 0; i < index; i++) {
                    this.quene[i].runTimes = 0;
                }
                this.firstUnion.start();
            }

        } else {
            if (union.onCompeleteCallback) {
                union.onCompeleteCallback((tween as unknown as any)._object);
            }

            const index = this.quene.indexOf(union);
            if (index !== this.length - 1) {
                const next = this.quene[index + 1];
                next.start();
            }
        }
    }
}

cc.CCTweenCommand = CCTweenCommand;
