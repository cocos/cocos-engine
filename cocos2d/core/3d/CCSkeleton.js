
let Skeleton = cc.Class({
    name: 'cc.Skeleton',
    extends: cc.Asset,

    ctor () {
        this.jointIndices = [];
        this.bindposes = [];
    },

    properties: {
        _modelSetter: {
            set: function (model) {
                if (CC_EDITOR && Editor.isBuilder) {
                    // just building
                    return;
                }
                this._initWithModel(model);
            }
        },
    },

    _initWithModel (model) {
        if (!model) return;
        this._model = model;
        this._model.initSkeleton(this);
    },

    _serialize: CC_EDITOR && function (exporting) {
        let modelUuid = this._modelUuid;
        if (exporting) {
            modelUuid = Editor.Utils.UuidUtils.compressUuid(modelUuid, true);
        }
        return {
            modelUuid: modelUuid,
            skinID: this._skinID,
        };
    },

    _deserialize (data, handle) {
        this._modelUuid = data.modelUuid;
        this._skinID = data.skinID;

        if (this._modelUuid) {
            handle.result.push(this, '_modelSetter', this._modelUuid);
        }
    }
});

cc.Skeleton = module.exports = Skeleton;