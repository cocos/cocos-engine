let TrackEntryListeners = function () {
    this.start = null;
    this.end = null;
    this.complete = null;
    this.event = null;
    this.interrupt = null;
    this.dispose = null;
};

TrackEntryListeners.getListeners = function(entry){
    if (!entry.listener) {
        entry.listener = new TrackEntryListeners();
    }
    return entry.listener;
};

module.exports = TrackEntryListeners;