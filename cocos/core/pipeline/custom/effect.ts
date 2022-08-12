import { legacyCC } from '../../global-exports';
import { EffectAsset } from '../../assets';
import { CollectVisitor, WebDescriptorHierarchy } from './web-descriptor-hierarchy';
// eslint-disable-next-line max-len
import { Descriptor, DescriptorBlock, DescriptorBlockFlattened, DescriptorBlockIndex, DescriptorDB, DescriptorTypeOrder, LayoutGraph, LayoutGraphData, LayoutGraphValue, RenderPhase } from './layout-graph';
import { LayoutGraphBuilder, Pipeline } from './pipeline';
import { DescriptorType, ShaderStageFlagBit, Type, UniformBlock } from '../../gfx';
import { ParameterType, UpdateFrequency } from './types';
import { depthFirstSearch, GraphColor, MutableVertexPropertyMap } from './graph';

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

export function buildLayoutGraphDataImpl (graph: LayoutGraph, lgData: LayoutGraphBuilder) {
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
            const flattened = new DescriptorBlockFlattened();
            descriptorBlock2Flattened(block, flattened);
            if (block.capacity > 0) {
                lgData.addDescriptorBlock(vid, index, flattened);
            }
            for (let i = 0; i < flattened.uniformBlockNames.length; ++i) {
                lgData.addUniformBlock(vid, index, flattened.uniformBlockNames[i], flattened.uniformBlocks[i]);
            }
        });
    }
}

function rebuildLayoutGraph (): void {
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
    const lg: WebDescriptorHierarchy = new WebDescriptorHierarchy();
    const lgData = ppl.layoutGraphBuilder;
    lgData.clear();

    const defaultStage: number = lg.addGlobal('default', true, true, true, true, true, true, true, true);

    for (const n in effects) {
        const e: EffectAsset = effects[n];
        lg.addEffect(e, defaultStage);
    }

    lg.mergeDescriptors(defaultStage);

    buildLayoutGraphDataImpl(lg.layoutGraph, lgData);

    EffectAsset.setLayoutValid();
    console.log('rebuildLayoutGraph end');
}

function buildForwardLayoutFromGlobal (ppl: Pipeline, lg: WebDescriptorHierarchy) {
    const src = ppl.globalDSManager.descriptorSetLayout;
    const passDB: DescriptorDB = new DescriptorDB();
    let count = 0;
    for (const b of src.bindings) {
        switch (b.descriptorType) {
        case DescriptorType.UNIFORM_BUFFER: {
            const block = lg.getLayoutBlock(UpdateFrequency.PER_PASS,
                ParameterType.TABLE,
                DescriptorTypeOrder.UNIFORM_BUFFER,
                b.stageFlags, passDB);
            block.descriptors.set(`Descriptor${count}`, new Descriptor(Type.UNKNOWN));
            ++block.count;
            ++block.capacity;
            break;
        }
        case DescriptorType.DYNAMIC_UNIFORM_BUFFER: {
            const block = lg.getLayoutBlock(UpdateFrequency.PER_PASS,
                ParameterType.TABLE,
                DescriptorTypeOrder.DYNAMIC_UNIFORM_BUFFER,
                b.stageFlags, passDB);
            block.descriptors.set(`Descriptor${count}`, new Descriptor(Type.UNKNOWN));
            ++block.count;
            ++block.capacity;
            break;
        }
        case DescriptorType.STORAGE_BUFFER: {
            const block = lg.getLayoutBlock(UpdateFrequency.PER_PASS,
                ParameterType.TABLE,
                DescriptorTypeOrder.STORAGE_BUFFER,
                b.stageFlags, passDB);
            block.descriptors.set(`Descriptor${count}`, new Descriptor(Type.UNKNOWN));
            ++block.count;
            ++block.capacity;
            break;
        }
        case DescriptorType.DYNAMIC_STORAGE_BUFFER: {
            const block = lg.getLayoutBlock(UpdateFrequency.PER_PASS,
                ParameterType.TABLE,
                DescriptorTypeOrder.DYNAMIC_STORAGE_BUFFER,
                b.stageFlags, passDB);
            block.descriptors.set(`Descriptor${count}`, new Descriptor(Type.UNKNOWN));
            ++block.count;
            ++block.capacity;
            break;
        }
        case DescriptorType.SAMPLER_TEXTURE: {
            const block = lg.getLayoutBlock(UpdateFrequency.PER_PASS,
                ParameterType.TABLE,
                DescriptorTypeOrder.SAMPLER_TEXTURE,
                b.stageFlags, passDB);
            block.descriptors.set(`Descriptor${count}`, new Descriptor(Type.UNKNOWN));
            ++block.count;
            ++block.capacity;
            break;
        }
        case DescriptorType.SAMPLER: {
            const block = lg.getLayoutBlock(UpdateFrequency.PER_PASS,
                ParameterType.TABLE,
                DescriptorTypeOrder.SAMPLER,
                b.stageFlags, passDB);
            block.descriptors.set(`Descriptor${count}`, new Descriptor(Type.UNKNOWN));
            ++block.count;
            ++block.capacity;
            break;
        }
        case DescriptorType.TEXTURE: {
            const block = lg.getLayoutBlock(UpdateFrequency.PER_PASS,
                ParameterType.TABLE,
                DescriptorTypeOrder.TEXTURE,
                b.stageFlags, passDB);
            block.descriptors.set(`Descriptor${count}`, new Descriptor(Type.UNKNOWN));
            ++block.count;
            ++block.capacity;
            break;
        }
        case DescriptorType.STORAGE_IMAGE: {
            const block = lg.getLayoutBlock(UpdateFrequency.PER_PASS,
                ParameterType.TABLE,
                DescriptorTypeOrder.STORAGE_IMAGE,
                b.stageFlags, passDB);
            block.descriptors.set(`Descriptor${count}`, new Descriptor(Type.UNKNOWN));
            ++block.count;
            ++block.capacity;
            break;
        }
        case DescriptorType.INPUT_ATTACHMENT: {
            const block = lg.getLayoutBlock(UpdateFrequency.PER_PASS,
                ParameterType.TABLE,
                DescriptorTypeOrder.INPUT_ATTACHMENT,
                b.stageFlags, passDB);
            block.descriptors.set(`Descriptor${count}`, new Descriptor(Type.UNKNOWN));
            ++block.count;
            ++block.capacity;
            break;
        }
        case DescriptorType.UNKNOWN:
        default:
            break;
        }
        ++count;
    }
    const defaultID = lg._layoutGraph.addVertex<LayoutGraphValue.RenderStage>(
        LayoutGraphValue.RenderStage,
        LayoutGraphValue.RenderStage,
        'default', passDB,
    );

    lg.mergeDescriptors(defaultID);
}

export function buildForwardLayout (ppl: Pipeline) {
    const lg = new WebDescriptorHierarchy();
    const bFromGlobalDescriptorSet = false;

    if (bFromGlobalDescriptorSet) {
        buildForwardLayoutFromGlobal(ppl, lg);
    } else {
        const defaultID = lg.addGlobal('default', true, true, true, true, true, true, true, true);
        lg.mergeDescriptors(defaultID);
    }

    const builder = ppl.layoutGraphBuilder;
    builder.clear();
    buildLayoutGraphDataImpl(lg.layoutGraph, builder);
}

enum DeferredStage {
    GEOMETRY,
    LIGHTING,
    POST
}

export class VectorGraphColorMap implements MutableVertexPropertyMap<GraphColor> {
    constructor (sz: number) {
        this.colors = new Array<GraphColor>(sz);
    }
    get (u: number): GraphColor {
        return this.colors[u];
    }
    put (u: number, value: GraphColor): void {
        this.colors[u] = value;
    }
    readonly colors: Array<GraphColor>;
}

export function buildDeferredLayout (ppl: Pipeline) {
    const lg = new WebDescriptorHierarchy();
    const defaultID = lg.addGlobal('default', true, true, true, true, true, true, true, true);
    lg.mergeDescriptors(defaultID);
    const geometryPassID = lg.addRenderStage('Geometry', DeferredStage.GEOMETRY);
    const lightingPassID = lg.addRenderStage('Lighting', DeferredStage.LIGHTING);
    const postPassID = lg.addRenderStage('Postprocess', DeferredStage.POST);

    const geometryQueueID = lg.addRenderPhase('Queue', geometryPassID);
    const lightingQueueID = lg.addRenderPhase('Queue', lightingPassID);
    const postQueueID = lg.addRenderPhase('Queue', postPassID);

    const lightingDescriptors = lg.layoutGraph.getDescriptors(lightingQueueID);

    const lightingPassBlock = lg.getLayoutBlock(UpdateFrequency.PER_PASS,
        ParameterType.TABLE,
        DescriptorTypeOrder.SAMPLER_TEXTURE,
        ShaderStageFlagBit.FRAGMENT,
        lightingDescriptors);

    lg.setDescriptor(lightingPassBlock, 'gbuffer_albedoMap', Type.FLOAT4);
    lg.setDescriptor(lightingPassBlock, 'gbuffer_normalMap', Type.FLOAT4);
    lg.setDescriptor(lightingPassBlock, 'gbuffer_emissiveMap', Type.FLOAT4);
    lg.setDescriptor(lightingPassBlock, 'depth_stencil', Type.FLOAT4);

    const visitor = new CollectVisitor();
    const colorMap = new VectorGraphColorMap(lg.layoutGraph.numVertices());
    depthFirstSearch(lg.layoutGraph, visitor, colorMap);

    lg.mergeDescriptors(lightingPassID);
    // Postprocess
    const postDescriptors = lg.layoutGraph.getDescriptors(postPassID);

    const postPassBlock = lg.getLayoutBlock(UpdateFrequency.PER_PASS,
        ParameterType.TABLE,
        DescriptorTypeOrder.SAMPLER_TEXTURE,
        ShaderStageFlagBit.FRAGMENT,
        postDescriptors);

    lg.setDescriptor(postPassBlock, 'outputResultMap', Type.FLOAT4);
    lg.merge(postDescriptors);

    lg.mergeDescriptors(postPassID);
    if (visitor.error) {
        console.log(visitor.error);
    }

    const builder = ppl.layoutGraphBuilder;
    builder.clear();
    buildLayoutGraphDataImpl(lg.layoutGraph, builder);
}
