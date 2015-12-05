// 保存编辑器下用到的 prefab 相关信息
var PrefabInfo = cc.Class({
    name: 'cc.PrefabInfo',
    properties: {
        //// the serialized version
        //VER: {
        //    default: 1
        //},

        // the most top node of this prefab in the scene
        root: {
            default: null,
        },

        // 所属的 prefab 资源对象 (cc._Prefab)
        // （这个属性在场景中是会保存的，但是不会保存在 prefab 里面，因为创建 prefab 时还不知道自己的 uuid 是多少。）
        asset: {
            default: null,
        },

        // 用来标识别该节点在 prefab 资源中的位置，因此这个 ID 只需要保证在 Assets 里不重复就行
        fileId: {
            default: ''
        },
    }
});

cc._PrefabInfo = module.exports = PrefabInfo;
