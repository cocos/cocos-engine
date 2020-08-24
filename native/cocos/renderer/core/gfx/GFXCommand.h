#pragma once

namespace cc {
namespace gfx {

enum class GFXCmdType : uint8_t {
    BEGIN_RENDER_PASS,
    END_RENDER_PASS,
    BIND_STATES,
    DRAW,
    UPDATE_BUFFER,
    COPY_BUFFER_TO_TEXTURE,
    COUNT,
};

class GFXCmd : public Object {
public:
    GFXCmdType type;
    uint refCount = 0;

    GFXCmd(GFXCmdType _type) : type(_type) {}
    virtual ~GFXCmd() {}

    virtual void clear() = 0;
};

} // namespace gfx
} // namespace cc
