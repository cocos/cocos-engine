import { legacyCC } from '../../global-exports';
import { EffectAsset } from '../../assets';
import { WebDescriptorHierarchy } from './web-descriptor-hierarchy';

export function rebuildLayoutGraph (): void {
    const root = legacyCC.director.root;
    if (!root.usesCustomPipeline) {
        return;
    }
    if (EffectAsset.isLayoutValid()) {
        return;
    }
    const ppl = root.customPipeline;
    const effects = EffectAsset.getAll();
    const lg = new WebDescriptorHierarchy();
    const lgData = ppl.layoutGraphBuilder;

    EffectAsset.setLayoutValid();
}
