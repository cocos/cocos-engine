#include "CoreStd.h"
#include "GFXWindow.h"

NS_CC_BEGIN

GFXWindow::GFXWindow(GFXDevice *device)
: GFXObject(GFXObjectType::WINDOW), _device(device) {
}

GFXWindow::~GFXWindow() {
}

NS_CC_END
