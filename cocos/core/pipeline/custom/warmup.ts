import { EffectAsset } from '../../assets';
import { DescriptorBlock, DescriptorBlockIndex, LayoutGraphValue } from './layout-graph';
import { Pipeline } from './pipeline';
import { WebDescriptorHierarchy } from './web-descriptor-hierarchy';

export function warmup (pipeline: Pipeline) {
    const descH = new WebDescriptorHierarchy();
    descH.addEffect(new EffectAsset());

    const lg = descH.layoutGraph;
    const lgData = pipeline.createLayoutGraph('test');
    for (const v of descH.layoutGraph.vertices()) {
        const name = lg.getName(v);
        if (lg.holds(LayoutGraphValue.RenderStage, v)) {
            lgData.addRenderStage(name);
        } else if (lg.holds(LayoutGraphValue.RenderPhase, v)) {
            const u = lg.getParent(v);
            lgData.addRenderPhase(name, u);
        }
    }
    for (const v of lg.vertices()) {
        const db = lg.getDescriptors(v);
        for (const e of db.blocks) {
            const key: string = e[0];
            const block: DescriptorBlock = e[1];
            const index: DescriptorBlockIndex = JSON.parse(key);
            lgData.addDescriptorBlock(v, index, block);
        }
    }
}
