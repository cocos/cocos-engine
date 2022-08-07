#include "WGPUUtils.h"
#include "WGPUDescriptorSet.h"
#include "WGPUDescriptorSetLayout.h"
#include "WGPUDevice.h"
#include "WGPUObject.h"
#include "WGPUPipelineLayout.h"

namespace cc::gfx {

void createPipelineLayoutFallback(const ccstd::vector<DescriptorSet*>& descriptorSets, PipelineLayout* pipelineLayout) {
    std::string lable = "";
    ccstd::vector<WGPUBindGroupLayout> descriptorSetLayouts;
    for (auto descriptorSet : descriptorSets) {
        if (descriptorSet) {
            auto* descriptorSetLayout = static_cast<CCWGPUDescriptorSetLayout*>(descriptorSet->getLayout());
            descriptorSetLayouts.push_back(descriptorSetLayout->gpuLayoutEntryObject()->bindGroupLayout);
            lable += " " + static_cast<CCWGPUDescriptorSet*>(descriptorSet)->_label;
        } else {
            descriptorSetLayouts.push_back(static_cast<WGPUBindGroupLayout>(CCWGPUDescriptorSetLayout::defaultBindGroupLayout()));
        }
    }

    auto* ccPipelineLayout = static_cast<CCWGPUPipelineLayout*>(pipelineLayout);
    WGPUPipelineLayoutDescriptor descriptor = {
        .nextInChain = nullptr,
        .label = lable.c_str(),
        .bindGroupLayoutCount = descriptorSetLayouts.size(),
        .bindGroupLayouts = descriptorSetLayouts.data(),
    };
    if (ccPipelineLayout->gpuPipelineLayoutObject()->wgpuPipelineLayout) {
        wgpuPipelineLayoutRelease(ccPipelineLayout->gpuPipelineLayoutObject()->wgpuPipelineLayout);
    }
    ccPipelineLayout->gpuPipelineLayoutObject()->wgpuPipelineLayout = wgpuDeviceCreatePipelineLayout(
        CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice,
        &descriptor);
    printf("Unexpected behavior: createPipelineLayoutFallback\n");
}
} // namespace cc::gfx
