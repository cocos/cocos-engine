//register this object to scheduler
var scheduler = cc.director.getScheduler();
scheduler.scheduleUpdateForTarget(this, priority, !this._isRunning );
