/****************************************************************************
 Copyright (c) 2025 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once

#include "base/RefCounted.h"

namespace cc {
class AuthenticationResult : public RefCounted {
public:
    bool isAuthenticated() const {
        return _isAuthenticated;
    }
private:
    friend class PlayTask;
    bool _isAuthenticated {false};
};

class RecallAccess : public RefCounted {
public:
    int hashCode() const {
        return _hashCode;
    }

    const std::string& getSessionId() const {
        return _sessionId;
    }

    bool equals(const RecallAccess& other) {
        if(&other == this) {
            return true;
        }
        return _sessionId == other._sessionId;
    }
private:
    friend class PlayTask;
    int _hashCode{0};
    std::string _sessionId;
};

class Achievement {
public:

    int getCurrentSteps() const {
        return _currentSteps;
    }
    int getState() const {
        return _state;
    }
    int getTotalSteps() const {
        return _totalSteps;
    }
    int getType() const {
        return _type;
    }
    long getLastUpdatedTimestamp() const {
        return _lastUpdatedTimestamp;
    }
    long getXpValue() const {
        return _xpValue;
    }
    const std::string& getAchievementId() const {
        return _achievementId;
    }
    const std::string& getDescription() const {
        return _description;
    }
    const std::string& getFormattedCurrentSteps() const {
        return _formattedCurrentSteps;
    }
    const std::string& getFormattedTotalSteps() const {
        return _formattedTotalSteps;
    }
    const std::string& getName() const {
        return _name;
    }
    const std::string& getRevealedImageUrl() const {
        return _revealedImageUrl;
    }
    const std::string& getUnlockedImageUrl() const {
        return _unlockedImageUrl;
    }
private:
    friend class PlayTask;
    static const char TYPE_INCREMENTAL{1};
    int _currentSteps{0};
    int _state{0};
    int _totalSteps{0};
    int _type{0};
    long _lastUpdatedTimestamp{0};
    long _xpValue{0};
    std::string _achievementId;
    std::string _description;
    std::string _formattedCurrentSteps;
    std::string _formattedTotalSteps;
    std::string _name;
    std::string _revealedImageUrl;
    std::string _unlockedImageUrl;
};

class AchievementBuffer {
public:
    ~AchievementBuffer() {
        release();
    }

    Achievement* createAchievement() {
        auto* achievement = new Achievement(); 
        _achievements.emplace_back(achievement);
        return achievement;
    }

    size_t getCount() const {
        return _achievements.size();
    }

    const Achievement* get(int i) const {
        if(i >= 0 && i < _achievements.size()) {
            return _achievements[i];
        }
        return nullptr;
    }

    void close() {
        release();
    }

    bool isClosed() const {
        return _isClosed;
    }

    void release() {
        for(auto* achievement : _achievements) {
            delete achievement;
        }
        _achievements.clear();
        _isClosed = true;
    }
private:
    friend class PlayTask;
    bool _isClosed{false};
    std::vector<Achievement*> _achievements;
};

class AnnotatedData : public RefCounted {
public:
    bool isStale() const  {
        return _isStale;
    }
    const AchievementBuffer* get() const {
        return &_achievementBuffer;
    }
private:
    friend class PlayTask;
    bool _isStale{false};
    AchievementBuffer _achievementBuffer;
};

}
