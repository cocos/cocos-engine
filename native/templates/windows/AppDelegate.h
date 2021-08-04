#pragma once

#include <memory>
#include <string>
#include "Game.h"

namespace cc {
class View;
};

class AppDelegate {
public:
    AppDelegate(const std::string &name, int width, int height);

    void start();

private:
    std::shared_ptr<cc::View> _view;
    std::shared_ptr<Game>     _game;

    bool _quit{false};
};
