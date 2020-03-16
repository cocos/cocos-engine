#include "CoreStd.h"
#include "GFXRenderPass.h"

NS_CC_BEGIN

GFXRenderPass::GFXRenderPass(GFXDevice* device)
: GFXObject(GFXObjectType::RENDER_PASS)
, _device(device) {
}

GFXRenderPass::~GFXRenderPass() {
}

NS_CC_END
