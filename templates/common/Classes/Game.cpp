/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You
 shall not use Cocos Creator software for developing other software or tools
 that's used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to
 you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
#include "Game.h"

#ifndef GAME_NAME
#define GAME_NAME "CocosGame";
#endif

#ifndef SCRIPT_XXTEAKEY
#define SCRIPT_XXTEAKEY "";
#endif

Game::Game() = default;

int Game::init() {
  _windowInfo.title = GAME_NAME;
  // configurate window size
  // _windowInfo.height = 600;
  // _windowInfo.width  = 800;

#if CC_DEBUG
  _debuggerInfo.enabled = true;
#else
  _debuggerInfo.enabled = false;
#endif
  _debuggerInfo.port = 6086;
  _debuggerInfo.address = "0.0.0.0";
  _debuggerInfo.pauseOnStart = false;

  _xxteaKey = SCRIPT_XXTEAKEY;

  BaseGame::init();
  return 0;
}

void Game::onPause() { BaseGame::onPause(); }

void Game::onResume() { BaseGame::onResume(); }

void Game::onClose() { BaseGame::onClose(); }

CC_REGISTER_APPLICATION(Game);
