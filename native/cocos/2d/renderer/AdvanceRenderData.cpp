#include "AdvanceRenderData.h"

cc::AdvanceRenderData::AdvanceRenderData() : AdvanceRenderData(0, 0, 0, 0, 0, 0, 0, 0, 0) {
}

cc::AdvanceRenderData::AdvanceRenderData(const float_t x, const float_t y, const float_t z, const float_t u, const float_t v, const uint8_t colorR, const uint8_t colorG, const uint8_t colorB, const uint8_t colorA) {
    if (this->_render2dLayout != nullptr) {
        this->_render2dLayout->position.x = x;
        this->_render2dLayout->position.y = y;
        this->_render2dLayout->position.z = z;
        this->_render2dLayout->uv.x = u;
        this->_render2dLayout->uv.y = v;
        this->_render2dLayout->color.x = colorR;
        this->_render2dLayout->color.y = colorG;
        this->_render2dLayout->color.z = colorB;
        this->_render2dLayout->color.w = colorA;
    }
}

cc::AdvanceRenderData::~AdvanceRenderData() {
}

void cc::AdvanceRenderData::setX(float_t x) {
    if (this->_render2dLayout != nullptr) {
        this->_render2dLayout->position.x = x;
    }
}

void cc::AdvanceRenderData::setY(float_t y) {
    if (this->_render2dLayout != nullptr) {
        this->_render2dLayout->position.y = y;
    }
}

void cc::AdvanceRenderData::setZ(float_t z) {
    if (this->_render2dLayout != nullptr) {
        this->_render2dLayout->position.z = z;
    }
}

void cc::AdvanceRenderData::setU(float_t u) {
    if (this->_render2dLayout != nullptr) {
        this->_render2dLayout->uv.x = u;
    }
}

void cc::AdvanceRenderData::setV(float_t v) {
    if (this->_render2dLayout != nullptr) {
        this->_render2dLayout->uv.y = v;
    }
}

void cc::AdvanceRenderData::setColorR(int8_t colorR) {
    if (this->_render2dLayout != nullptr) {
        this->_render2dLayout->color.x = colorR;
    }
}

void cc::AdvanceRenderData::setColorG(int8_t colorG) {
    if (this->_render2dLayout != nullptr) {
        this->_render2dLayout->color.y = colorG;
    }
}

void cc::AdvanceRenderData::setColorB(int8_t colorB) {
    if (this->_render2dLayout != nullptr) {
        this->_render2dLayout->color.z = colorB;
    }
}

void cc::AdvanceRenderData::setColorA(int8_t colorA) {
    if (this->_render2dLayout != nullptr) {
        this->_render2dLayout->color.w = colorA;
    }
}

void cc::AdvanceRenderData::ParseRender2dData(uint8_t* arr) {
    this->_render2dLayout = reinterpret_cast<Render2dLayout*>(arr);
}
