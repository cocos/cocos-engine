class HistoryManagerBase {
    // 步骤控制
    undoArray = [];
    redoArray = [];

    constructor() {}

    push(command) {
        this.undoArray.unshift(command);
        this.redoArray.length = 0;

        // 步骤数最大 100
        if (this.undoArray.length > 100) {
            this.undoArray.length = 100;
        }
    }
    async undo() {
        const command = this.undoArray.shift();

        if (command) {
            await command.undo();
            this.redoArray.unshift(command);
        }
    }
    async redo() {
        const command = this.redoArray.shift();

        if (command) {
            await command.redo();
            this.undoArray.unshift(command);
        }
    }
    rebase() {
        this.undoArray.length = 0;
        this.redoArray.length = 0;
    }
    reset() {}
    snapshot() {}
}

module.exports = HistoryManagerBase;
