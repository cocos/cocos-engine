exports.template = /* html */`
<div class="reflection-probe-footer">
    <ui-button class="bake blue" >Bake</ui-button>
</div>
`;

exports.style = /* css */`
.reflection-probe-footer {
    display: flex;
    flex-wrap: wrap;
    margin-top: 6px;
}

ui-button[hidden] {
    display: none;
}

.bake {
    flex: 1;
}

`;

exports.$ = {
    bake: '.bake'
};

exports.update = async function(dump) {
    if (dump) {
        this.dump = dump;
        /** @type {HTMLElement} */
        const button = this.$.bake;
        const cubeTypes = (this.dump.value.probeType.values ?? [this.dump.value.probeType.value]);
        const cubeEnumIndex = this.dump.value.probeType.enumList.findIndex(item => item.name === 'CUBE');
        button.hidden = cubeTypes.some(item => item !== cubeEnumIndex);
    }

};

exports.ready = function() {
    this.$.bake.addEventListener('confirm', () => {
        const uuids = this.dump.value.uuid.values ?? [this.dump.value.uuid.value];
        Editor.Message.send('scene', 'reflection-probe-bake-cube-map', uuids);
    })
};

exports.close = function() {

};
