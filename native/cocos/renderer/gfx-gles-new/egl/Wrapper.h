//
// Created by yjrj on 2023/2/8.
//

#pragma once

namespace cc::gfx::egl {

class Wrapper {
public:
    Wrapper() = default;
    ~Wrapper();

    bool init();

private:
    bool loadLib();
};

} // namespace cc::gfx::egl
