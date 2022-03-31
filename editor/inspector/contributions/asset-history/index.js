'use strict';

const HistoryManagerBase = require('./history-manager-base');
const SnapshotCommand = require('./snapshot-command');

class AssetHistoryManager extends HistoryManagerBase {
    // 缓存的节点 dump 数据
    cacheDump = {};

    // 当前场景
    scene = {
        uuid: '',
        animationMode: false,
    };

    // 记录变动的 node.uuid
    records = [];

    constructor() {
        super();
    }

    getUndoData(uuids = this.records) {
        const result = {};
        uuids.forEach((uuid) => {
            result[uuid] = this.cacheDump[uuid];
        });
        return result;
    }

    getRedoData(uuids = this.records) {
        // 更新缓存，输出新数据
        this.updateCache(uuids);
        return this.getUndoData(uuids);
    }

    updateCache(uuids = []) {
        uuids.forEach((uuid) => {
            try {
                const node = nodeManager.query(uuid);
                if (!node || node.objFlags & cc.Object.Flags.HideInHierarchy) {
                    return;
                }
                this.cacheDump[uuid] = nodeManager.queryDumpAtAll(uuid);
            } catch (error) {
                console.error(error);
            }
        });
    }

    /**
     * 取消记录
     */
    abort() {
        this.records.length = 0;
    }

    record(node) {
        if (!this.records.includes(node.uuid)) {
            this.records.push(node.uuid);
        }
    }

    snapshot(command) {
        try {
            if (!command) {
                const undoData = this.getUndoData(); // 旧数据
                const redoData = this.getRedoData(); // 新数据

                // 过滤脏数据，虽然收到了 node-changed 的 ipc，但节点实际并没有变化
                if (JSON.stringify(undoData) === JSON.stringify(redoData)) {
                    this.records.length = 0;
                    return false;
                }

                command = new AssetHistoryCommand(undoData, redoData);
                this.records.length = 0;
            }

            if (!command) {
                return false;
            }

            this.push(command);
        } catch (error) {
            console.error(error);
        }

        return true;
    }

    async undo() {
        if (this.records.length) {
            this.snapshot();
        }

        await super.undo();
        this.abort();
    }

    async redo() {
        if (this.records.length) {
            this.snapshot();
        }

        await super.redo();
        this.abort();
    }

    reset(uuids, scene) {
        // 就是当前的场景，不必重置
        // 此为容错，因为软刷新会多次触发 scene open 事件
        if (this.scene.uuid === scene.uuid) {
            return;
        }

        this.scene.uuid = scene.uuid;

        this.cacheDump = Object.create(null);

        uuids.forEach((uuid) => {
            const node = nodeManager.query(uuid);

            if (!node || node.objFlags & cc.Object.Flags.HideInHierarchy) {
                return;
            }

            this.cacheDump[uuid] = nodeManager.queryDumpAtAll(uuid);
        });

        this.rebase();
    }
}

const assetHistoryManager = new AssetHistoryManager();

class AssetHistoryCommand extends SnapshotCommand {
    async excute(data) {
        // 数据 data 是 {} , key 为 uuid ，有多个，value 为改 uuid 节点的引擎属性值
        const uuids = Object.keys(data);

        // 先区分下要发什么样的变动事件
        const nodesEvent = {};

        const currentData = assetHistoryManager.getUndoData(uuids);
        for (const uuid of uuids) {
            const current = currentData[uuid];
            const future = data[uuid];

            if (!future) {
                // 先取消节点可能存在的选中状态
                selection.unselect(uuid);

                nodesEvent[uuid] = 'remove';
                continue;
            }

            if (current && current.isScene) {
                nodesEvent[uuid] = 'change';
                continue;
            }

            let type = 'change';
            const currentParent = current.parent.value.uuid;
            const futureParent = future.parent.value.uuid;

            if (currentParent === '' && futureParent !== '') {
                type = 'add';
            }
            if (currentParent !== '' && futureParent === '') {
                type = 'remove';
            }

            nodesEvent[uuid] = type;
        }

        for (const uuid of uuids) {
            const node = nodeManager.query(uuid);
            if (node && nodesEvent[uuid] === 'change') {
                // remove 和 adde 节点，由父级节点的 children 变动实现，所以这边可以不操作
                try {
                    await dumpUtils.restoreNode(node, data[uuid]); // 还原变动的节点
                } catch (error) {
                    console.error(error);
                }
            }
        }

        // 广播事件
        for (const uuid of uuids) {
            const node = nodeManager.query(uuid);
            const event = nodesEvent[uuid];

            if (node) {
                nodeManager.emit(event, node, { source: EventSourceType.UNDO });
            }
        }

        assetHistoryManager.updateCache(uuids);
    }
}

module.exports = assetHistoryManager;

