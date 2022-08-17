#include "WGPUUtils.h"
#include "WGPUDescriptorSet.h"
#include "WGPUDescriptorSetLayout.h"
#include "WGPUDevice.h"
#include "WGPUObject.h"
#include "WGPUPipelineLayout.h"

namespace cc::gfx {

void createPipelineLayoutFallback(const ccstd::vector<DescriptorSet*>& descriptorSets, PipelineLayout* pipelineLayout) {
    ccstd::hash_t hash = descriptorSets.size() * 2 + 1;
    ccstd::hash_combine(hash, descriptorSets.size());
    std::string label = "";
    ccstd::vector<WGPUBindGroupLayout> descriptorSetLayouts;
    for (size_t i = 0; i < descriptorSets.size(); ++i) {
        auto* descriptorSet = static_cast<CCWGPUDescriptorSet*>(descriptorSets[i]);
        if (descriptorSet && descriptorSet->getHash() != 0) {
            auto* descriptorSetLayout = static_cast<CCWGPUDescriptorSetLayout*>(descriptorSet->getLayout());
            auto* wgpuBindGroupLayout = static_cast<WGPUBindGroupLayout>(CCWGPUDescriptorSetLayout::getBindGroupLayoutByHash(descriptorSet->getHash()));
            descriptorSetLayouts.push_back(wgpuBindGroupLayout);
            ccstd::hash_combine(hash, i);
            ccstd::hash_combine(hash, descriptorSet->getHash());
            label += std::to_string(descriptorSet->getHash()) + "-" + descriptorSet->label + "-" + std::to_string(descriptorSetLayout->getHash()) + " ";
        } else {
            descriptorSetLayouts.push_back(static_cast<WGPUBindGroupLayout>(CCWGPUDescriptorSetLayout::defaultBindGroupLayout()));
            ccstd::hash_combine(hash, i);
            ccstd::hash_combine(hash, 0);
        }
    }

    auto* ccPipelineLayout = static_cast<CCWGPUPipelineLayout*>(pipelineLayout);
    WGPUPipelineLayoutDescriptor descriptor = {
        .nextInChain = nullptr,
        .label = label.c_str(),
        .bindGroupLayoutCount = descriptorSetLayouts.size(),
        .bindGroupLayouts = descriptorSetLayouts.data(),
    };

    auto iter = ccPipelineLayout->layoutMap.find(hash);
    if (iter == ccPipelineLayout->layoutMap.end()) {
        ccPipelineLayout->layoutMap[hash] = wgpuDeviceCreatePipelineLayout(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &descriptor);
        ccPipelineLayout->gpuPipelineLayoutObject()->wgpuPipelineLayout = static_cast<WGPUPipelineLayout>(ccPipelineLayout->layoutMap[hash]);
        printf("create new ppl\n");
    } else {
        ccPipelineLayout->gpuPipelineLayoutObject()->wgpuPipelineLayout = static_cast<WGPUPipelineLayout>(iter->second);
    }
    ccPipelineLayout->_hash = hash;
}
} // namespace cc::gfx
