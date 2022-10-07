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

exports.updateElementInvalid = function(element, prop) {
    const invalid = this.metaList.some((meta) => {
        return meta.userData[prop] !== this.meta.userData[prop];
    });

    element.invalid = invalid;
};
