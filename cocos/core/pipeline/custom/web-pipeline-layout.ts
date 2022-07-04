/* eslint-disable max-len */
import { DEBUG } from 'internal:constants';
import { ShaderStageFlagBit, Type, UniformBlock } from '../../gfx';
import { buildLayoutGraphDataImpl } from './effect';
import { Descriptor, DescriptorBlock, DescriptorBlockIndex, DescriptorDB, DescriptorTypeOrder, LayoutGraph, LayoutGraphData, LayoutGraphValue, RenderPhase } from './layout-graph';
import { Pipeline } from './pipeline';
import { ParameterType, UpdateFrequency } from './types';
import { WebDescriptorHierarchy } from './web-descriptor-hierarchy';

export function buildForwardLayout (ppl: Pipeline) {
    const lg = new WebDescriptorHierarchy();
    const builder = ppl.layoutGraphBuilder;
    builder.clear();

    const defaultID = lg.addGlobal('default', true, true, true, true, true, true, true);
    lg.mergeDescriptors(defaultID);

    buildLayoutGraphDataImpl(lg.layoutGraph, builder);

    if (DEBUG) {
        console.log(builder.print());
    }
}

export function buildDeferredLayout (ppl: Pipeline) {

}
