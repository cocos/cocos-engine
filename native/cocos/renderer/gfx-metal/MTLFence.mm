#include "MTLStd.h"

#include "MTLDevice.h"
#include "MTLFence.h"

NS_CC_BEGIN

CCMTLFence::CCMTLFence(GFXDevice *device) : GFXFence(device) {}

CCMTLFence::~CCMTLFence() {
    destroy();
}

bool CCMTLFence::initialize(const GFXFenceInfo &info) {
    // TODO

    _status = GFXStatus::SUCCESS;

    return true;
}

void CCMTLFence::destroy() {
    // TODO
    _status = GFXStatus::UNREADY;
}

void CCMTLFence::wait() {
    // TODO
}

void CCMTLFence::reset() {
    // TODO
}

NS_CC_END
