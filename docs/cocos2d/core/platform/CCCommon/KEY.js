-----
cc.eventManager.addListener({
    event: cc.EventListener.KEYBOARD,
    onKeyPressed:  function(keyCode, event){
        if (cc.KEY["a"] == keyCode) {
            cc.log("A is pressed");
        }
    }
}, this);
