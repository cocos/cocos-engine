mergeInto(LibraryManager.library, {
    spineListenerCallBackFromJS: function () {
        var wasmUtil = Module['SpineWasmUtil'];
        var listenerID = wasmUtil.getCurrentListenerID();
        var trackEntry = wasmUtil.getCurrentTrackEntry();
        var event = wasmUtil.getCurrentEvent();
        globalThis.TrackEntryListeners.emitListener(listenerID, trackEntry, event);
    },

    spineTrackListenerCallback: function() {
        var wasmUtil = Module['SpineWasmUtil'];
        var listenerID = wasmUtil.getCurrentListenerID();
        var eventType = wasmUtil.getCurrentEventType();
        var trackEntry = wasmUtil.getCurrentTrackEntry();
        var event = wasmUtil.getCurrentEvent();
        globalThis.TrackEntryListeners.emitTrackEntryListener(listenerID, trackEntry, event, eventType.value);
    }
});
