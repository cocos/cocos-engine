//register a schedule to scheduler
var scheduler = cc.director.getScheduler();
scheduler.scheduleCallbackForTarget(this, function, interval, repeat, delay, !this._isRunning);
