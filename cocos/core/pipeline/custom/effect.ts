import { legacyCC } from '../../global-exports';
import { EffectAsset } from '../../assets';
import { WebDescriptorHierarchy } from './web-descriptor-hierarchy';
import { DescriptorBlock, DescriptorBlockIndex, DescriptorDB, LayoutGraph, LayoutGraphValue } from './layout-graph';
import { Pipeline } from './pipeline';

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
            lgData.addDescriptorBlock(vid, index, block);
        });
    }

    lgData.compile();
    console.log(lgData.print());

    EffectAsset.setLayoutValid();
    console.log('rebuildLayoutGraph end');
}
