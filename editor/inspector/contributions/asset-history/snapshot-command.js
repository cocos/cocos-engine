class SnapshotCommand {
    undoData;
    redoData;

    constructor(undoData, redoData) {
        this.undoData = undoData;
        this.redoData = redoData;
    }

    async undo() {
        await this.excute(this.undoData);
    }
    async redo() {
        await this.excute(this.redoData);
    }

    async excute(data) {}
}

module.exports = SnapshotCommand;
