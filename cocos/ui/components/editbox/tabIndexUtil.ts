import { EditBoxImpl } from './edit-box-impl';

export class tabIndexUtil {
    public static _tabIndexList: EditBoxImpl[] = [];

    public static add (editBoxImpl: EditBoxImpl) {
        const list = this._tabIndexList;
        const index = list.indexOf(editBoxImpl);
        if (index === -1){
            list.push(editBoxImpl);
        }
    }

    public static remove (editBoxImpl: EditBoxImpl) {
        const list = this._tabIndexList;
        const index = list.indexOf(editBoxImpl);
        if (index !== -1) {
            list.splice(index, 1);
        }
    }

    public static resort () {
        this._tabIndexList.sort((a: EditBoxImpl, b: EditBoxImpl) => {
            return a._delegate!.tabIndex - b._delegate!.tabIndex;
        });
    }

    public static next (editBoxImpl: EditBoxImpl) {
        const list = this._tabIndexList;
        const index = list.indexOf(editBoxImpl);
        editBoxImpl.setFocus(false);
        if (index !== -1) {
            const nextImpl = list[index + 1];
            if (nextImpl && nextImpl._delegate!.tabIndex >= 0) {
                nextImpl.setFocus(true);
            }
        }
    }
}
