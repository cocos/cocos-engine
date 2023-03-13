/****************************************************************************
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2013-2016 Chukong Technologies Inc.
Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

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

#include "math/Geometry.h"

#include <algorithm>
#include <cmath>
#include "base/Macros.h"

// implementation of Vec2
namespace cc {

// implementation of Size

Size::Size() = default;

Size::Size(float w, float h) : width(w),
                               height(h) {
}

Size::Size(const Size &other) = default;

Size::Size(const Vec2 &point) : width(point.x),
                                height(point.y) {
}

Size &Size::operator=(const Size &other) {
    setSize(other.width, other.height);
    return *this;
}

Size &Size::operator=(const Vec2 &point) {
    setSize(point.x, point.y);
    return *this;
}

Size Size::operator+(const Size &right) const {
    return Size(this->width + right.width, this->height + right.height);
}

Size Size::operator-(const Size &right) const {
    return Size(this->width - right.width, this->height - right.height);
}

Size Size::operator*(float a) const {
    return Size(this->width * a, this->height * a);
}

Size Size::operator/(float a) const {
    CC_ASSERT_NE(a, 0);
    float inv = 1.0F / a;
    return Size(this->width * inv, this->height * inv);
}

void Size::setSize(float w, float h) {
    this->width = w;
    this->height = h;
}

bool Size::equals(const Size &target) const {
    return (std::abs(this->width - target.width) < FLT_EPSILON) && (std::abs(this->height - target.height) < FLT_EPSILON);
}

const Size Size::ZERO = Size(0, 0);

// implementation of Rect

Rect::Rect() {
    setRect(0.0F, 0.0F, 0.0F, 0.0F);
}

Rect::Rect(float x, float y, float width, float height) {
    setRect(x, y, width, height);
}
Rect::Rect(const Vec2 &pos, const Size &dimension) {
    setRect(pos.x, pos.y, dimension.width, dimension.height);
}

Rect::Rect(const Rect &other) {
    setRect(other.x, other.y, other.width, other.height);
}

Rect &Rect::operator=(const Rect &other) {
    setRect(other.x, other.y, other.width, other.height);
    return *this;
}

void Rect::setRect(float x, float y, float width, float height) {
    // CGRect can support width<0 or height<0
    // CC_ASSERT(width >= 0.0f && height >= 0.0f);

    this->x = x;
    this->y = y;
    this->width = width;
    this->height = height;
}

bool Rect::equals(const Rect &rect) const {
    return (std::abs(this->x - rect.x) < FLT_EPSILON) && (std::abs(this->y - rect.y) < FLT_EPSILON) && (std::abs(this->width - rect.width) < FLT_EPSILON) && (std::abs(this->height - rect.height) < FLT_EPSILON);
}

float Rect::getMaxX() const {
    return this->x + this->width;
}

float Rect::getMidX() const {
    return this->x + this->width / 2.0F;
}

float Rect::getMinX() const {
    return this->x;
}

float Rect::getMaxY() const {
    return this->y + this->height;
}

float Rect::getMidY() const {
    return this->y + this->height / 2.0F;
}

float Rect::getMinY() const {
    return this->y;
}

bool Rect::containsPoint(const Vec2 &point) const {
    bool bRet = false;

    if (point.x >= getMinX() && point.x <= getMaxX() && point.y >= getMinY() && point.y <= getMaxY()) {
        bRet = true;
    }

    return bRet;
}

bool Rect::intersectsRect(const Rect &rect) const {
    return !(getMaxX() < rect.getMinX() ||
             rect.getMaxX() < getMinX() ||
             getMaxY() < rect.getMinY() ||
             rect.getMaxY() < getMinY());
}

bool Rect::intersectsCircle(const Vec2 &center, float radius) const {
    Vec2 rectangleCenter((this->x + this->width / 2),
                         (this->y + this->height / 2));

    float w = this->width / 2;
    float h = this->height / 2;

    float dx = std::abs(center.x - rectangleCenter.x);
    float dy = std::abs(center.y - rectangleCenter.y);

    if (dx > (radius + w) || dy > (radius + h)) {
        return false;
    }

    Vec2 circleDistance(std::abs(center.x - this->x - w),
                        std::abs(center.y - this->y - h));

    if (circleDistance.x <= (w)) {
        return true;
    }

    if (circleDistance.y <= (h)) {
        return true;
    }

    float cornerDistanceSq = powf(circleDistance.x - w, 2) + powf(circleDistance.y - h, 2);

    return (cornerDistanceSq <= (powf(radius, 2)));
}

void Rect::merge(const Rect &rect) {
    float minX = std::min(getMinX(), rect.getMinX());
    float minY = std::min(getMinY(), rect.getMinY());
    float maxX = std::max(getMaxX(), rect.getMaxX());
    float maxY = std::max(getMaxY(), rect.getMaxY());
    setRect(minX, minY, maxX - minX, maxY - minY);
}

Rect Rect::unionWithRect(const Rect &rect) const {
    float thisLeftX = this->x;
    float thisRightX = this->x + this->width;
    float thisTopY = this->y + this->height;
    float thisBottomY = this->y;

    if (thisRightX < thisLeftX) {
        std::swap(thisRightX, thisLeftX); // This rect has negative width
    }

    if (thisTopY < thisBottomY) {
        std::swap(thisTopY, thisBottomY); // This rect has negative height
    }

    float otherLeftX = rect.x;
    float otherRightX = rect.x + rect.width;
    float otherTopY = rect.y + rect.height;
    float otherBottomY = rect.y;

    if (otherRightX < otherLeftX) {
        std::swap(otherRightX, otherLeftX); // Other rect has negative width
    }

    if (otherTopY < otherBottomY) {
        std::swap(otherTopY, otherBottomY); // Other rect has negative height
    }

    float combinedLeftX = std::min(thisLeftX, otherLeftX);
    float combinedRightX = std::max(thisRightX, otherRightX);
    float combinedTopY = std::max(thisTopY, otherTopY);
    float combinedBottomY = std::min(thisBottomY, otherBottomY);

    return Rect(combinedLeftX, combinedBottomY, combinedRightX - combinedLeftX, combinedTopY - combinedBottomY);
}

const Rect Rect::ZERO = Rect(0, 0, 0, 0);

} // namespace cc
