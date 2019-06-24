const tabIndexUtil = {
    _tabIndexList: [],

    add (editBoxImpl) {
        let list = this._tabIndexList;
        let index = list.indexOf(editBoxImpl);
        if (index === -1){
            list.push(editBoxImpl);
        }
    },

    remove (editBoxImpl) {
        let list = this._tabIndexList;
        let index = list.indexOf(editBoxImpl);
        if (index !== -1) {
            list.splice(index, 1);
        }
    },

    resort () {
        this._tabIndexList.sort(function(a, b) {
            return a._delegate._tabIndex - b._delegate._tabIndex;
        });
    },

    next (editBoxImpl) {
        let list = this._tabIndexList;
        let index = list.indexOf(editBoxImpl);
        editBoxImpl.setFocus(false);
        if (index !== -1) {
            let nextImpl = list[index+1];
            if (nextImpl && nextImpl._delegate._tabIndex >= 0) {
                nextImpl.setFocus(true);
            }
        }
    },
}

module.exports = tabIndexUtil;