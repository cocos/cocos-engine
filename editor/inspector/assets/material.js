'use strict';

// TODO 切换 pass 等的时候，保留之前修改的数据

const { materialTechniquePolyfill } = require('../utils/material');

exports.style = `
ui-button.location { flex: none; margin-left: 6px; }
`;

exports.template = `
<header>
    <ui-prop>
        <ui-label slot="label">Effect</ui-label>
        <ui-select class="effect" slot="content"></ui-select>
        <ui-button class="location" slot="content">
            <ui-icon value="location"></ui-icon>
        </ui-button>
    </ui-prop>
    <ui-prop>
        <ui-label slot="label">Technique</ui-label>
        <ui-select class="technique" slot="content"></ui-select>
    </ui-prop>
</header>
<section>
    <ui-prop class="useInstancing" type="dump"></ui-prop>
    <ui-prop class="useBatching" type="dump"></ui-prop>
</section>
<section class="material-dump"></section>
`;

exports.$ = {
    section: 'section',
    asyncLoadAssets: '.asyncLoadAssets',
    pass: '.pass',

    effect: '.effect',
    technique: '.technique',

    materialDump: '.material-dump',
    useInstancing: '.useInstancing',
    useBatching: '.useBatching',
};

exports.methods = {
    /**
     * 自定义保存
     */
    async apply() {
        await Editor.Message.request('scene', 'apply-material', this.asset.uuid, this.material);
    },

    /**
     * 更新最终显示在界面上的 pass 数据
     */
    updatePasses() {
        // 自动渲染内容
        // passes 里的数据不全是需要渲染的 value
        // 所以在这里整理一次，但这不合理
        // 合理的方式应该在查询 material 的时候，返回的数据就应该是一个正常的 dump 数据
        if (!this.material.data[this.material.technique]) {
            this.material.technique = 0;
        }
        const technique = materialTechniquePolyfill(this.material.data[this.material.technique]);
        this.technique = technique;
    
        if (technique.useInstancing) {
            this.$.useInstancing.render(technique.useInstancing);
            this.$.useInstancing.removeAttribute('hidden');
        } else {
            this.$.useInstancing.setAttribute('hidden', '');
        }
    
        if (technique.useBatching) {
            this.$.useBatching.render(technique.useBatching);
            this.$.useBatching.removeAttribute('hidden');
        } else {
            this.$.useBatching.setAttribute('hidden', '');
        }
    
        if (technique.passes) {
            const $propList = Array.from(this.$.materialDump.querySelectorAll('ui-prop.pass') || []);
            let i = 0;
            for (i; i < technique.passes.length; i++) {
                // 如果 propertyIndex 不等于当前的 pass index，则不渲染
                if (technique.passes[i].propertyIndex !== undefined && technique.passes[i].propertyIndex.value !== i) {
                    continue;
                }
                if (!$propList[i]) {
                    $propList[i] = document.createElement('ui-prop');
                    $propList[i].classList.add('pass');
                    $propList[i].setAttribute('type', 'dump');
                    $propList[i].setAttribute('fold', 'false');
                    this.$.materialDump.appendChild($propList[i]);
                }
                $propList[i].render(technique.passes[i]);
            }
            for (i; i < $propList.length; i++) {
                const $prop = $propList[i];
                $prop.parentElement.removeChild($prop);
            }
        }
    },

    /**
     * 更新 technique 内的 options 数据
     */
    updateTechniqueOptions() {
        let techniqueOption = '';
        this.material.data.forEach((technique, index) => {
            techniqueOption += `<option value="${index}">${index} - ${technique.name}</option>`;
        });
        this.$.technique.innerHTML = techniqueOption;
    },
};

/**
 * 自动渲染组件的方法
 * @param assetList 
 * @param metaList 
 */
exports.update = async function(assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.asset = assetList[0];
    this.meta = metaList[0];

    this.material = await Editor.Message.request('scene', 'query-material', this.asset.uuid);

    // effect 选择框
    this.$.effect.value = this.material.effect;
    // technique 选择框
    this.$.technique.value = this.material.technique;

    this.updateTechniqueOptions();
    this.updatePasses();
};

/**
 * 初始化界面的方法
 */
exports.ready = async function() {
    // material 内容修改的时候触发的事件
    this.$.materialDump.addEventListener('change-dump', (event) => {
        Editor.Message.request('scene', 'preview-material', this.asset.uuid, this.material);
        this.dispatch('change');
    });

    // 使用的 effect 修改的时候，触发的事件
    this.$.effect.addEventListener('change', async (event) => {
        this.material.effect = event.target.value;
        this.material.data = await Editor.Message.request('scene', 'query-effect', this.material.effect);

        this.updateTechniqueOptions();
        this.updatePasses();
        this.dispatch('change');
    });

    // 使用的 technique 更改的时候触发的事件
    this.$.technique.addEventListener('change', async (event) => {
        this.material.technique = event.target.value;

        this.updatePasses();
        this.dispatch('change');
    });

    // useInstancing 这个特殊属性修改的时候触发的事件
    this.$.useInstancing.addEventListener('change-dump', (event) => {
        const technique = this.technique;
        // 替换 passes 中的数据
        technique.passes.forEach((pass) => {
            if (pass.childMap.USE_INSTANCING) {
                pass.childMap.USE_INSTANCING.value = event.target.value;
            }
        });
        this.dispatch('change');
    });

    // useBatching 这个特殊属性修改的时候触发的事件
    this.$.useBatching.addEventListener('change-dump', (event) => {
        const technique = this.technique;
        // 替换 passes 中的数据
        technique.passes.forEach((pass) => {
            if (pass.childMap.USE_BATCHING) {
                pass.childMap.USE_BATCHING.value = event.target.value;
            }
        });
        this.dispatch('change');
    });

    // 初始化页面的时候，查询所有的 effect 列表，之后就不需要再更新了
    const effectMap = await Editor.Message.request('scene', 'query-all-effects');
    this._effects = Object.keys(effectMap).filter((name) => {
        const effect = effectMap[name];
        return !effect.hideInEditor;
    }).map((name) => {
        const effect = effectMap[name];
        return {
            name,
            uuid: effect.uuid,
        };
    });
    let effectOption = '';
    for (let effect of this._effects) {
        effectOption += `<option>${effect.name}</option>`;
    }
    this.$.effect.innerHTML = effectOption;
}
