import { legacyCC } from '../../global-exports';
import { EffectAsset } from '../../assets';
import { WebDescriptorHierarchy } from './web-descriptor-hierarchy';
// eslint-disable-next-line max-len
import { Descriptor, DescriptorBlock, DescriptorBlockFlattened, DescriptorBlockIndex, DescriptorDB, LayoutGraph, LayoutGraphValue } from './layout-graph';
import { Pipeline } from './pipeline';
import { UniformBlock } from '../../gfx';

function descriptorBlock2Flattened (block: DescriptorBlock, flattened: DescriptorBlockFlattened): void {
    block.descriptors.forEach((value, key) => {
        const name: string = key;
        const d: Descriptor = value;
        flattened.descriptorNames.push(name);
        flattened.descriptors.push(d);
    });
    block.uniformBlocks.forEach((value, key) => {
        const name: string = key;
        const u: UniformBlock = value;
        flattened.uniformBlockNames.push(name);
        flattened.uniformBlocks.push(u);
    });
    flattened.count = block.count;
    flattened.capacity = block.capacity;
}

export function rebuildLayoutGraph (): void {
    const root = legacyCC.director.root;
    if (!root.usesCustomPipeline) {
        return;
    }
    if (EffectAsset.isLayoutValid()) {
        return;
    }
    console.log('rebuildLayoutGraph begin');
    const ppl: Pipeline = root.customPipeline;
    const effects = EffectAsset.getAll();
    const lg = new WebDescriptorHierarchy();
    const lgData = ppl.layoutGraphBuilder;
    lgData.clear();

    const defaultStage: number = lg.addGlobal('default', true, true, true, true, true, true, true);

    for (const n in effects) {
        const e: EffectAsset = effects[n];
        lg.addEffect(e, defaultStage);
    }

    const graph: LayoutGraph = lg.layoutGraph;

    for (const v of graph.vertices()) {
        const db: DescriptorDB = graph.getDescriptors(v);
        let vid = 0;
        if (graph.id(v) === LayoutGraphValue.RenderStage) {
            vid = lgData.addRenderStage(graph.getName(v));
        }
        if (graph.id(v) === LayoutGraphValue.RenderPhase) {
            vid = lgData.addRenderPhase(graph.getName(v), graph.getParent(v));
            const phase = graph.getRenderPhase(vid);
            for (const shaderName of phase.shaders) {
                lgData.addShader(shaderName, vid);
            }
        }

        db.blocks.forEach((value, key) => {
            const index: DescriptorBlockIndex = JSON.parse(key) as DescriptorBlockIndex;
            const block: DescriptorBlock = value;
            if (block.capacity > 0) {
                const flattened = new DescriptorBlockFlattened();
                descriptorBlock2Flattened(block, flattened);
                lgData.addDescriptorBlock(vid, index, flattened);
            }
        });
    }

    lgData.compile();
    console.log(lgData.print());

    EffectAsset.setLayoutValid();
    console.log('rebuildLayoutGraph end');
}
