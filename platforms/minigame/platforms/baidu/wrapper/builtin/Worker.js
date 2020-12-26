/* eslint-disable */
export default class Worker {

    constructor(file) {
        this.onmessage = null

        // 目前 微信小游戏中 Worker 最大并发数量限制为 1 个，
        // 所以创建新Worker前, 需要结束现有的 Worker.terminate
        if (Worker.previousWorker) {
            Worker.previousWorker.terminate()
        }
        Worker.previousWorker = this

        this._file = file

        this._worker = swan.createWorker(file)

        this._worker.onMessage((res) => {
            if (this.onmessage) {
                this.onmessage({
                    target: this,
                    data: res,
                })
            }
        })
    }

    postMessage(message, transferList) {
        this._worker.postMessage(message, transferList)
    }

    terminate() {
        this._worker.terminate()
        Worker.previousWorker = null
    }
}

Worker.previousWorker = null

// export default function(file) {
//     const worker = swan.createWorker(file)

//     return worker
// }
