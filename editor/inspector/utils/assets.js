exports.updateElementReadonly = function(element, readonly) {
    if (readonly === undefined) {
        readonly = this.asset.readonly;
    }

    if (readonly) {
        element.setAttribute('disabled', true);
    } else {
        element.removeAttribute('disabled');
    }
};
