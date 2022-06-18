import { legacyCC } from '../../global-exports';
import { EffectAsset } from '../../assets';
import { WebDescriptorHierarchy } from './web-descriptor-hierarchy';
// eslint-disable-next-line max-len
import { Descriptor, DescriptorBlock, DescriptorBlockFlattened, DescriptorBlockIndex, DescriptorDB, DescriptorTypeOrder, LayoutGraph, LayoutGraphValue, RenderPhase } from './layout-graph';
import { LayoutGraphBuilder, Pipeline } from './pipeline';
import { ShaderStageFlagBit, Type, UniformBlock } from '../../gfx';
import { ParameterType, UpdateFrequency } from './types';

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

function buildLayoutGraphDataImpl (graph: LayoutGraph, lgData: LayoutGraphBuilder) {
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

    buildLayoutGraphDataImpl(lg.layoutGraph, lgData);

    EffectAsset.setLayoutValid();
    console.log('rebuildLayoutGraph end');
}

enum DeferredStage {
    GEOMETRY,
    LIGHTING,
}

// eslint-disable-next-line max-len
function getLayoutBlock (freq: UpdateFrequency, paraType: ParameterType, descType: DescriptorTypeOrder, vis: ShaderStageFlagBit, descriptorDB: DescriptorDB): DescriptorBlock {
    const blockIndex: DescriptorBlockIndex = new DescriptorBlockIndex(freq, paraType, descType, vis);
    const key = JSON.stringify(blockIndex);
    if (descriptorDB.blocks.get(key) === undefined) {
        const uniformBlock: DescriptorBlock = new DescriptorBlock();
        descriptorDB.blocks.set(key, uniformBlock);

        // uniformBlock['blockIndex'] = blockIndex;
    }
    return descriptorDB.blocks.get(key) as DescriptorBlock;
}

export function buildDeferredPipelineLayoutGraph (): LayoutGraph {
    const lg = new LayoutGraph();

    const geometryPassID = lg.addVertex(LayoutGraphValue.RenderStage,
        DeferredStage.GEOMETRY, 'Geometry', new DescriptorDB());

    const lightingPassID = lg.addVertex(LayoutGraphValue.RenderStage,
        DeferredStage.LIGHTING, 'Lighting', new DescriptorDB());

    const geometryQueueID = lg.addVertex(LayoutGraphValue.RenderPhase,
        new RenderPhase(), 'Dispatch', new DescriptorDB(), geometryPassID);

    const lightingQueueID = lg.addVertex(LayoutGraphValue.RenderPhase,
        new RenderPhase(), 'Dispatch', new DescriptorDB(), lightingPassID);

    const lightingDescriptors = lg.getDescriptors(lightingQueueID);

    const perInstance = getLayoutBlock(UpdateFrequency.PER_PASS, ParameterType.TABLE,
        DescriptorTypeOrder.SAMPLER_TEXTURE, ShaderStageFlagBit.FRAGMENT, lightingDescriptors);

    perInstance.capacity = 4;
    perInstance.count = 4;
    perInstance.descriptors.set('gbuffer_albedoMap', new Descriptor(Type.FLOAT4));
    perInstance.descriptors.set('gbuffer_normalMap', new Descriptor(Type.FLOAT4));
    perInstance.descriptors.set('gbuffer_emissiveMap', new Descriptor(Type.FLOAT4));
    perInstance.descriptors.set('depth_stencil', new Descriptor(Type.FLOAT4));

    return lg;
}

export function buildLayoutGraphData (lg: LayoutGraph) {
    const root = legacyCC.director.root;
    const ppl: Pipeline = root.customPipeline;
    const lgData = ppl.layoutGraphBuilder;
    lgData.clear();
    buildLayoutGraphDataImpl(lg, lgData);
}
