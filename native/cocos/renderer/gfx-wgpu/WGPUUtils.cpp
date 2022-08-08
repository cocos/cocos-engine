#include "WGPUUtils.h"
#include "WGPUDescriptorSet.h"
#include "WGPUDescriptorSetLayout.h"
#include "WGPUDevice.h"
#include "WGPUObject.h"
#include "WGPUPipelineLayout.h"

namespace cc::gfx {

void createPipelineLayoutFallback(const ccstd::vector<DescriptorSet*>& descriptorSets, PipelineLayout* pipelineLayout) {
    std::string lable = "";
    ccstd::hash_t hash = descriptorSets.size() * 2 + 1;
    ccstd::hash_combine(hash, descriptorSets.size());
    ccstd::vector<WGPUBindGroupLayout> descriptorSetLayouts;
    for (size_t i = 0; i < descriptorSets.size(); ++i) {
        auto* descriptorSet = static_cast<CCWGPUDescriptorSet*>(descriptorSets[i]);
        if (descriptorSet) {
            auto* descriptorSetLayout = static_cast<CCWGPUDescriptorSetLayout*>(descriptorSet->getLayout());
            descriptorSetLayouts.push_back(descriptorSetLayout->gpuLayoutEntryObject()->bindGroupLayout);
            lable += " " + static_cast<CCWGPUDescriptorSet*>(descriptorSet)->_label;
            ccstd::hash_combine(hash, i);
            ccstd::hash_combine(hash, descriptorSetLayout->getHash());
            printf("%d, %s, %zu\n", i, descriptorSetLayout->_label.c_str(), descriptorSetLayout->getHash());
        } else {
            descriptorSetLayouts.push_back(static_cast<WGPUBindGroupLayout>(CCWGPUDescriptorSetLayout::defaultBindGroupLayout()));
            ccstd::hash_combine(hash, i);
            ccstd::hash_combine(hash, 9527);
        }
    }

    auto* ccPipelineLayout = static_cast<CCWGPUPipelineLayout*>(pipelineLayout);
    lable += " " + std::to_string(hash);
    WGPUPipelineLayoutDescriptor descriptor = {
        .nextInChain = nullptr,
        .label = lable.c_str(),
        .bindGroupLayoutCount = descriptorSetLayouts.size(),
        .bindGroupLayouts = descriptorSetLayouts.data(),
    };

    auto iter = ccPipelineLayout->layoutMap.find(hash);
    if (iter == ccPipelineLayout->layoutMap.end()) {
        ccPipelineLayout->layoutMap[hash] = wgpuDeviceCreatePipelineLayout(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &descriptor);
        ccPipelineLayout->gpuPipelineLayoutObject()->wgpuPipelineLayout = static_cast<WGPUPipelineLayout>(ccPipelineLayout->layoutMap[hash]);
        printf("Unexpected behavior: createPipelineLayoutFallback %s %zu\n", lable.c_str(), hash);
    } else {
        ccPipelineLayout->gpuPipelineLayoutObject()->wgpuPipelineLayout = static_cast<WGPUPipelineLayout>(iter->second);
        printf("%s %zu\n", lable.c_str(), hash);
    }
    ccPipelineLayout->_hash = hash;
}
} // namespace cc::gfx
