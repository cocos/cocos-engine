class SnapshotCommand {
    undoData;
    redoData;

    constructor(undoData, redoData) {
        this.undoData = undoData;
        this.redoData = redoData;
    }

    async undo() {
        await this.execute(this.undoData);
    }
    async redo() {
        await this.execute(this.redoData);
    }

    async execute() {}
}

module.exports = SnapshotCommand;
