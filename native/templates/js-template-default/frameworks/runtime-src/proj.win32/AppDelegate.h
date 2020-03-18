#pragma once

#include "Game.h"
#include "View-win32.h"
#include <string>
#include <memory>

class AppDelegage {
public:
    AppDelegage(const std::string &name, int width, int height);

    void start();

private:
    std::shared_ptr<Game> _game;
    std::shared_ptr<View> _view;
    
    bool _quit = false;
};