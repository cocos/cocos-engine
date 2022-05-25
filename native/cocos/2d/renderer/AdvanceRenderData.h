#pragma once
#include <cocos/base/TypeDef.h>
#include <math/Vec2.h>
#include <math/Vec3.h>
#include <math/Color.h>

namespace cc {
struct Render2dLayout {
    cc::Vec3 position;
    cc::Vec2 uv;
    cc::Color color;
};

class AdvanceRenderData {
public:
    AdvanceRenderData();
    explicit AdvanceRenderData(
        const float_t x,
        const float_t y,
        const float_t z,
        const float_t u,
        const float_t v,
        const uint8_t colorR,
        const uint8_t colorG,
        const uint8_t colorB,
        const uint8_t colorA);
    ~AdvanceRenderData();

    inline float_t getX() const { return this->_x; }
    inline float_t getY() const { return this->_y; }
    inline float_t getZ() const { return this->_z; }
    inline float_t getU() const { return this->_u; }
    inline float_t getV() const { return this->_v; }
    inline int8_t getColorR() const { return this->_colorR; }
    inline int8_t getColorG() const { return this->_colorG; }
    inline int8_t getColorB() const { return this->_colorB; }
    inline int8_t getColorA() const { return this->_colorA; }

    void setX(float_t x);
    void setY(float_t y);
    void setZ(float_t z);
    void setU(float_t u);
    void setV(float_t v);
    void setColorR(int8_t colorR);
    void setColorG(int8_t colorG);
    void setColorB(int8_t colorB);
    void setColorA(int8_t colorA);

    void ParseRender2dData(uint8_t* arr);

private:
    float_t _x;
    float_t _y;
    float_t _z;
    float_t _u;
    float_t _v;

    int8_t _colorR;
    int8_t _colorG;
    int8_t _colorB;
    int8_t _colorA;

    // use this
    Render2dLayout* _render2dLayout{nullptr};
};
}
