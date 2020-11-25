let SafeArea = cc.SafeArea;
if (SafeArea) {
    let _onEnable = SafeArea.prototype.onEnable;
    let _onDisable = SafeArea.prototype.onDisable;
    Object.assign(SafeArea.prototype, {
        onEnable(){
            _onEnable.call(this);
            this._adaptSafeAreaChangeWithThis = this.adaptSafeAreaChange.bind(this);
            this._updateAreaWithThis = this.adaptSafeAreaChange.bind(this);
            window.addEventListener('orientationchange', this._adaptSafeAreaChangeWithThis);
            window.addEventListener('safearea-change', this._updateAreaWithThis);
        },

        onDisable(){
            _onDisable.call(this);
            window.removeEventListener('orientationchange', this._adaptSafeAreaChangeWithThis);
            window.removeEventListener('safearea-change', this._updateAreaWithThis);
        },

        adaptSafeAreaChange(){
            if (CC_JSB && (cc.sys.os === cc.sys.OS_IOS || cc.sys.os === cc.sys.OS_ANDROID)) {
                setTimeout(() => {
                    this.updateArea();
                }, 200);
            }
        }
    });
}

