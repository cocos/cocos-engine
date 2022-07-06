/* eslint-disable max-len */
import { DEBUG } from 'internal:constants';
import { ShaderStageFlagBit, Type, UniformBlock, DescriptorType } from '../../gfx';
import { buildLayoutGraphDataImpl } from './effect';
import { Descriptor, DescriptorBlock, DescriptorBlockIndex, DescriptorDB, DescriptorTypeOrder, LayoutGraph, LayoutGraphData, LayoutGraphValue, RenderPhase } from './layout-graph';
import { Pipeline } from './pipeline';
import { ParameterType, UpdateFrequency } from './types';
import { WebDescriptorHierarchy } from './web-descriptor-hierarchy';

export function buildForwardLayoutFromGlobal (ppl: Pipeline, lg: WebDescriptorHierarchy) {
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
        const defaultID = lg.addGlobal('default', true, true, true, true, true, true, true);
        lg.mergeDescriptors(defaultID);
    }

    const builder = ppl.layoutGraphBuilder;
    builder.clear();
    buildLayoutGraphDataImpl(lg.layoutGraph, builder);

    if (DEBUG) {
        console.log(builder.print());
    }
}

enum DeferredStage {
    GEOMETRY,
    LIGHTING,
}

export function buildDeferredLayout (ppl: Pipeline) {
    const lg = new WebDescriptorHierarchy();
    const geometryPassID = lg.addRenderStage('Geometry', DeferredStage.GEOMETRY);
    const lightingPassID = lg.addRenderStage('Lighting', DeferredStage.LIGHTING);

    const geometryQueueID = lg.addRenderStage('Queue', geometryPassID);
    const lightingQueueID = lg.addRenderStage('Queue', lightingPassID);

    const lightingDescriptors = lg.layoutGraph.getDescriptors(lightingPassID);

    const lightingPassBlock = lg.getLayoutBlock(UpdateFrequency.PER_PASS,
        ParameterType.TABLE,
        DescriptorTypeOrder.SAMPLER_TEXTURE,
        ShaderStageFlagBit.FRAGMENT,
        lightingDescriptors);

    lg.setDescriptor(lightingPassBlock, 'gbuffer_albedoMap', Type.FLOAT4);
    lg.setDescriptor(lightingPassBlock, 'gbuffer_normalMap', Type.FLOAT4);
    lg.setDescriptor(lightingPassBlock, 'gbuffer_emissiveMap', Type.FLOAT4);
    lg.setDescriptor(lightingPassBlock, 'depth_stencil', Type.FLOAT4);

    lg.merge(lightingDescriptors);

    lg.mergeDescriptors(lightingPassID);

    const builder = ppl.layoutGraphBuilder;
    builder.clear();
    buildLayoutGraphDataImpl(lg.layoutGraph, builder);

    if (DEBUG) {
        console.log(builder.print());
    }
}
