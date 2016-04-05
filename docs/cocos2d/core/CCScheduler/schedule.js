//register a schedule to scheduler
cc.director.getScheduler().schedule(callback, this, interval, !this._isRunning);
