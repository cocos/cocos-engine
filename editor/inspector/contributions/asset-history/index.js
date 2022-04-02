'use strict';

const HistoryManagerBase = require('./history-manager-base');
const SnapshotCommand = require('./snapshot-command');

class AssetHistoryManager extends HistoryManagerBase {
    lastRecord = {
        uuidListStr: '',
        metaListStr:'',
        renderDataStr: '',
    };

    constructor() {
        super();
    }

    async snapshot(panel) {
        const record = await panel.record();

        if (this.lastRecord.uuidListStr === record.uuidListStr) {
            // 数据没变化
            const metaChanged = this.lastRecord.metaListStr === record.metaListStr;
            const renderChanged = this.lastRecord.renderDataStr === record.renderDataStr;
            if (metaChanged && renderChanged) {
                return;
            }

            const undoData = Object.assign({}, this.lastRecord);

            Object.assign(this.lastRecord, record);

            const redoData = Object.assign({}, this.lastRecord);

            const command = new AssetHistoryCommand(undoData, redoData);
            this.push(command);
        } else {
            this.panel = panel;

            Object.assign(this.lastRecord, record);

            this.rebase();
        }
    }

    async undo() {
        await super.undo();
    }

    async redo() {
        await super.redo();
    }
}

const assetHistoryManager = new AssetHistoryManager();
class AssetHistoryCommand extends SnapshotCommand {
    async execute(record) {
        if (assetHistoryManager && assetHistoryManager.panel) {
            const success = assetHistoryManager.panel.restore(record);

            if (success) {
                assetHistoryManager.lastRecord = record;
            }
        }
    }
}

module.exports = assetHistoryManager;
