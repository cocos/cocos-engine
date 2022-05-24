#include "AdvanceRenderData.h"

cc::AdvanceRenderData::AdvanceRenderData() : AdvanceRenderData(0, 0, 0, 0, 0, 0, 0, 0, 0) {
}

cc::AdvanceRenderData::AdvanceRenderData(const float_t x, const float_t y, const float_t z, const float_t u, const float_t v, const uint8_t colorR, const uint8_t colorG, const uint8_t colorB, const uint8_t colorA) {
    this->_x = x;
    this->_y = y;
    this->_z = z;
    this->_u = u;
    this->_v = v;
    this->_colorR = colorR;
    this->_colorG = colorG;
    this->_colorB = colorB;
    this->_colorA = colorA;
}

cc::AdvanceRenderData::~AdvanceRenderData() {
}

void cc::AdvanceRenderData::setX(float_t x) {
    this->_x = x;
}

void cc::AdvanceRenderData::setY(float_t y) {
    this->_y = y;
}

void cc::AdvanceRenderData::setZ(float_t z) {
    this->_z = z;
}

void cc::AdvanceRenderData::setU(float_t u) {
    this->_u = u;
}

void cc::AdvanceRenderData::setV(float_t v) {
    this->_v = v;
}

void cc::AdvanceRenderData::setColorR(int8_t colorR) {
    this->_colorR = colorR;
}

void cc::AdvanceRenderData::setColorG(int8_t colorG) {
    this->_colorG = colorG;
}

void cc::AdvanceRenderData::setColorB(int8_t colorB) {
    this->_colorB = colorB;
}

void cc::AdvanceRenderData::setColorA(int8_t colorA) {
    this->_colorA = colorA;
}

void cc::AdvanceRenderData::ParseRender2dData(uint8_t* arr) {
    this->_render2dLayout = reinterpret_cast<Render2dLayout*>(arr);
}
