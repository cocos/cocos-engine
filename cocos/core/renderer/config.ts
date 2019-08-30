// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

let _stageOffset = 0;
const _name2stageID = {};

export default {
    addStage (name) {
        // already added
        if (_name2stageID[name] !== undefined) {
            return;
        }

        const stageID = 1 << _stageOffset;
        _name2stageID[name] = stageID;

        _stageOffset += 1;
    },

    stageID (name) {
        const id = _name2stageID[name];
        if (id === undefined) {
            return -1;
        }
        return id;
    },

    stageIDs (nameList) {
        let key = 0;
        for (const name of nameList) {
            const id = _name2stageID[name];
            if (id !== undefined) {
                key |= id;
            }
        }
        return key;
    },
};
