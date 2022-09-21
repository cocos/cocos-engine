
#include "BoundingBoxData.h"
#include "DisplayData.h"

DRAGONBONES_NAMESPACE_BEGIN

void BoundingBoxData::_onClear() {
    color = 0x000000;
    width = 0.0f;
    height = 0.0f;
}

int RectangleBoundingBoxData::_computeOutCode(float x, float y, float xMin, float yMin, float xMax, float yMax) {
    int code = OutCode::InSide; // initialised as being inside of [[clip window]]

    if (x < xMin) // to the left of clip window
    {
        code |= OutCode::Left;
    } else if (x > xMax) // to the right of clip window
    {
        code |= OutCode::Right;
    }

    if (y < yMin) // below the clip window
    {
        code |= OutCode::Top;
    } else if (y > yMax) // above the clip window
    {
        code |= OutCode::Bottom;
    }

    return code;
}

int RectangleBoundingBoxData::rectangleIntersectsSegment(
    float xA, float yA, float xB, float yB,
    float xMin, float yMin, float xMax, float yMax,
    Point* intersectionPointA,
    Point* intersectionPointB,
    Point* normalRadians) {
    const auto inSideA = xA > xMin && xA < xMax && yA > yMin && yA < yMax;
    const auto inSideB = xB > xMin && xB < xMax && yB > yMin && yB < yMax;

    if (inSideA && inSideB) {
        return -1;
    }

    auto intersectionCount = 0;
    auto outcode0 = RectangleBoundingBoxData::_computeOutCode(xA, yA, xMin, yMin, xMax, yMax);
    auto outcode1 = RectangleBoundingBoxData::_computeOutCode(xB, yB, xMin, yMin, xMax, yMax);

    while (true) {
        if ((outcode0 | outcode1) == 0) // Bitwise OR is 0. Trivially accept and get out of loop
        {
            intersectionCount = 2;
            break;
        } else if ((outcode0 & outcode1) != 0) // Bitwise AND is not 0. Trivially reject and get out of loop
        {
            break;
        }

        // failed both tests, so calculate the line segment to clip
        // from an outside point to an intersection with clip edge
        auto x = 0.0f;
        auto y = 0.0f;
        auto normalRadian = 0.0f;

        // At least one endpoint is outside the clip rectangle; pick it.
        const auto outcodeOut = outcode0 != 0 ? outcode0 : outcode1;

        // Now find the intersection point;
        if ((outcodeOut & OutCode::Top) != 0) // point is above the clip rectangle
        {
            x = xA + (xB - xA) * (yMin - yA) / (yB - yA);
            y = yMin;

            if (normalRadians != nullptr) {
                normalRadian = -Transform::PI * 0.5f;
            }
        } else if ((outcodeOut & OutCode::Bottom) != 0) // point is below the clip rectangle
        {
            x = xA + (xB - xA) * (yMax - yA) / (yB - yA);
            y = yMax;

            if (normalRadians != nullptr) {
                normalRadian = Transform::PI * 0.5;
            }
        } else if ((outcodeOut & OutCode::Right) != 0) // point is to the right of clip rectangle
        {
            y = yA + (yB - yA) * (xMax - xA) / (xB - xA);
            x = xMax;

            if (normalRadians != nullptr) {
                normalRadian = 0;
            }
        } else if ((outcodeOut & OutCode::Left) != 0) // point is to the left of clip rectangle
        {
            y = yA + (yB - yA) * (xMin - xA) / (xB - xA);
            x = xMin;

            if (normalRadians != nullptr) {
                normalRadian = Transform::PI;
            }
        }

        // Now we move outside point to intersection point to clip
        // and get ready for next pass.
        if (outcodeOut == outcode0) {
            xA = x;
            yA = y;
            outcode0 = RectangleBoundingBoxData::_computeOutCode(xA, yA, xMin, yMin, xMax, yMax);

            if (normalRadians != nullptr) {
                normalRadians->x = normalRadian;
            }
        } else {
            xB = x;
            yB = y;
            outcode1 = RectangleBoundingBoxData::_computeOutCode(xB, yB, xMin, yMin, xMax, yMax);

            if (normalRadians != nullptr) {
                normalRadians->y = normalRadian;
            }
        }
    }

    if (intersectionCount) {
        if (inSideA) {
            intersectionCount = 2; // 10

            if (intersectionPointA != nullptr) {
                intersectionPointA->x = xB;
                intersectionPointA->y = yB;
            }

            if (intersectionPointB != nullptr) {
                intersectionPointB->x = xB;
                intersectionPointB->y = xB;
            }

            if (normalRadians != nullptr) {
                normalRadians->x = normalRadians->y + Transform::PI;
            }
        } else if (inSideB) {
            intersectionCount = 1; // 01

            if (intersectionPointA != nullptr) {
                intersectionPointA->x = xA;
                intersectionPointA->y = yA;
            }

            if (intersectionPointB != nullptr) {
                intersectionPointB->x = xA;
                intersectionPointB->y = yA;
            }

            if (normalRadians != nullptr) {
                normalRadians->y = normalRadians->x + Transform::PI;
            }
        } else {
            intersectionCount = 3; // 11
            if (intersectionPointA != nullptr) {
                intersectionPointA->x = xA;
                intersectionPointA->y = yA;
            }

            if (intersectionPointB != nullptr) {
                intersectionPointB->x = xB;
                intersectionPointB->y = yB;
            }
        }
    }

    return intersectionCount;
}

void RectangleBoundingBoxData::_onClear() {
    BoundingBoxData::_onClear();

    type = BoundingBoxType::Rectangle;
}

bool RectangleBoundingBoxData::containsPoint(float pX, float pY) {
    const auto widthH = width * 0.5f;
    if (pX >= -widthH && pX <= widthH) {
        const auto heightH = height * 0.5f;
        if (pY >= -heightH && pY <= heightH) {
            return true;
        }
    }

    return false;
}

int RectangleBoundingBoxData::intersectsSegment(
    float xA, float yA, float xB, float yB,
    Point* intersectionPointA,
    Point* intersectionPointB,
    Point* normalRadians) {
    const auto widthH = width * 0.5f;
    const auto heightH = height * 0.5f;
    const auto intersectionCount = RectangleBoundingBoxData::rectangleIntersectsSegment(
        xA, yA, xB, yB,
        -widthH, -heightH, widthH, heightH,
        intersectionPointA, intersectionPointB, normalRadians);

    return intersectionCount;
}

int EllipseBoundingBoxData::ellipseIntersectsSegment(
    float xA, float yA, float xB, float yB,
    float xC, float yC, float widthH, float heightH,
    Point* intersectionPointA,
    Point* intersectionPointB,
    Point* normalRadians) {
    const auto d = widthH / heightH;
    const auto dd = d * d;

    yA *= d;
    yB *= d;

    const auto dX = xB - xA;
    const auto dY = yB - yA;
    const auto lAB = sqrt(dX * dX + dY * dY);
    const auto xD = dX / lAB;
    const auto yD = dY / lAB;
    const auto a = (xC - xA) * xD + (yC - yA) * yD;
    const auto aa = a * a;
    const auto ee = xA * xA + yA * yA;
    const auto rr = widthH * widthH;
    const auto dR = rr - ee + aa;
    auto intersectionCount = 0;

    if (dR >= 0.0f) {
        const auto dT = sqrt(dR);
        const auto sA = a - dT;
        const auto sB = a + dT;
        const auto inSideA = sA < 0.0f ? -1 : (sA <= lAB ? 0 : 1);
        const auto inSideB = sB < 0.0f ? -1 : (sB <= lAB ? 0 : 1);
        const auto sideAB = inSideA * inSideB;

        if (sideAB < 0) {
            return -1;
        } else if (sideAB == 0) {
            if (inSideA == -1) {
                intersectionCount = 2; // 10
                xB = xA + sB * xD;
                yB = (yA + sB * yD) / d;

                if (intersectionPointA != nullptr) {
                    intersectionPointA->x = xB;
                    intersectionPointA->y = yB;
                }

                if (intersectionPointB != nullptr) {
                    intersectionPointB->x = xB;
                    intersectionPointB->y = yB;
                }

                if (normalRadians != nullptr) {
                    normalRadians->x = atan2(yB / rr * dd, xB / rr);
                    normalRadians->y = normalRadians->x + Transform::PI;
                }
            } else if (inSideB == 1) {
                intersectionCount = 1; // 01
                xA = xA + sA * xD;
                yA = (yA + sA * yD) / d;

                if (intersectionPointA != nullptr) {
                    intersectionPointA->x = xA;
                    intersectionPointA->y = yA;
                }

                if (intersectionPointB != nullptr) {
                    intersectionPointB->x = xA;
                    intersectionPointB->y = yA;
                }

                if (normalRadians != nullptr) {
                    normalRadians->x = atan2(yA / rr * dd, xA / rr);
                    normalRadians->y = normalRadians->x + Transform::PI;
                }
            } else {
                intersectionCount = 3; // 11

                if (intersectionPointA != nullptr) {
                    intersectionPointA->x = xA + sA * xD;
                    intersectionPointA->y = (yA + sA * yD) / d;

                    if (normalRadians != nullptr) {
                        normalRadians->x = atan2(intersectionPointA->y / rr * dd, intersectionPointA->x / rr);
                    }
                }

                if (intersectionPointB != nullptr) {
                    intersectionPointB->x = xA + sB * xD;
                    intersectionPointB->y = (yA + sB * yD) / d;

                    if (normalRadians != nullptr) {
                        normalRadians->y = atan2(intersectionPointB->y / rr * dd, intersectionPointB->x / rr);
                    }
                }
            }
        }
    }

    return intersectionCount;
}

void EllipseBoundingBoxData::_onClear()

{
    BoundingBoxData::_onClear();

    type = BoundingBoxType::Ellipse;
}

bool EllipseBoundingBoxData::containsPoint(float pX, float pY) {
    const auto widthH = width * 0.5f;
    if (pX >= -widthH && pX <= widthH) {
        const auto heightH = height * 0.5f;
        if (pY >= -heightH && pY <= heightH) {
            pY *= widthH / heightH;
            return sqrt(pX * pX + pY * pY) <= widthH;
        }
    }

    return false;
}

int EllipseBoundingBoxData::intersectsSegment(
    float xA, float yA, float xB, float yB,
    Point* intersectionPointA,
    Point* intersectionPointB,
    Point* normalRadians) {
    const auto intersectionCount = EllipseBoundingBoxData::ellipseIntersectsSegment(
        xA, yA, xB, yB,
        0.0f, 0.0f, width * 0.5f, height * 0.5f,
        intersectionPointA, intersectionPointB, normalRadians);

    return intersectionCount;
}

int PolygonBoundingBoxData::polygonIntersectsSegment(
    float xA, float yA, float xB, float yB,
    const std::vector<float>& vertices,
    Point* intersectionPointA,
    Point* intersectionPointB,
    Point* normalRadians) {
    if (xA == xB) {
        xA = xB + 0.000001f;
    }

    if (yA == yB) {
        yA = yB + 0.000001f;
    }

    const auto count = vertices.size();
    const auto dXAB = xA - xB;
    const auto dYAB = yA - yB;
    const auto llAB = xA * yB - yA * xB;
    auto intersectionCount = 0;
    auto xC = vertices[count - 2];
    auto yC = vertices[count - 1];
    auto dMin = 0.0f;
    auto dMax = 0.0f;
    auto xMin = 0.0f;
    auto yMin = 0.0f;
    auto xMax = 0.0f;
    auto yMax = 0.0f;

    for (std::size_t i = 0; i < count; i += 2) {
        const auto xD = vertices[i];
        const auto yD = vertices[i + 1];

        if (xC == xD) {
            xC = xD + 0.000001f;
        }

        if (yC == yD) {
            yC = yD + 0.000001f;
        }

        const auto dXCD = xC - xD;
        const auto dYCD = yC - yD;
        const auto llCD = xC * yD - yC * xD;
        const auto ll = dXAB * dYCD - dYAB * dXCD;
        const auto x = (llAB * dXCD - dXAB * llCD) / ll;

        if (((x >= xC && x <= xD) || (x >= xD && x <= xC)) && (dXAB == 0.0f || (x >= xA && x <= xB) || (x >= xB && x <= xA))) {
            const auto y = (llAB * dYCD - dYAB * llCD) / ll;
            if (((y >= yC && y <= yD) || (y >= yD && y <= yC)) && (dYAB == 0.0f || (y >= yA && y <= yB) || (y >= yB && y <= yA))) {
                if (intersectionPointB != nullptr) {
                    float d = x - xA;
                    if (d < 0.0f) {
                        d = -d;
                    }

                    if (intersectionCount == 0) {
                        dMin = d;
                        dMax = d;
                        xMin = x;
                        yMin = y;
                        xMax = x;
                        yMax = y;

                        if (normalRadians != nullptr) {
                            normalRadians->x = atan2(yD - yC, xD - xC) - Transform::PI * 0.5f;
                            normalRadians->y = normalRadians->x;
                        }
                    } else {
                        if (d < dMin) {
                            dMin = d;
                            xMin = x;
                            yMin = y;

                            if (normalRadians != nullptr) {
                                normalRadians->x = atan2(yD - yC, xD - xC) - Transform::PI * 0.5f;
                            }
                        }

                        if (d > dMax) {
                            dMax = d;
                            xMax = x;
                            yMax = y;

                            if (normalRadians != nullptr) {
                                normalRadians->y = atan2(yD - yC, xD - xC) - Transform::PI * 0.5f;
                            }
                        }
                    }

                    intersectionCount++;
                } else {
                    xMin = x;
                    yMin = y;
                    xMax = x;
                    yMax = y;
                    intersectionCount++;

                    if (normalRadians != nullptr) {
                        normalRadians->x = atan2(yD - yC, xD - xC) - Transform::PI * 0.5f;
                        normalRadians->y = normalRadians->x;
                    }
                    break;
                }
            }
        }

        xC = xD;
        yC = yD;
    }

    if (intersectionCount == 1) {
        if (intersectionPointA != nullptr) {
            intersectionPointA->x = xMin;
            intersectionPointA->y = yMin;
        }

        if (intersectionPointB != nullptr) {
            intersectionPointB->x = xMin;
            intersectionPointB->y = yMin;
        }

        if (normalRadians != nullptr) {
            normalRadians->y = normalRadians->x + Transform::PI;
        }
    } else if (intersectionCount > 1) {
        intersectionCount++;

        if (intersectionPointA != nullptr) {
            intersectionPointA->x = xMin;
            intersectionPointA->y = yMin;
        }

        if (intersectionPointB != nullptr) {
            intersectionPointB->x = xMax;
            intersectionPointB->y = yMax;
        }
    }

    return intersectionCount;
}

void PolygonBoundingBoxData::_onClear() {
    BoundingBoxData::_onClear();

    if (weight != nullptr) {
        weight->returnToPool();
    }

    type = BoundingBoxType::Polygon;
    x = 0.0f;
    y = 0.0f;
    vertices.clear();
    weight = nullptr;
}

bool PolygonBoundingBoxData::containsPoint(float pX, float pY) {
    auto isInSide = false;
    if (pX >= x && pX <= width && pY >= y && pY <= height) {
        for (std::size_t i = 0, l = vertices.size(), iP = l - 2; i < l; i += 2) {
            const auto yA = vertices[iP + 1];
            const auto yB = vertices[i + 1];
            if ((yB < pY && yA >= pY) || (yA < pY && yB >= pY)) {
                const auto xA = vertices[iP];
                const auto xB = vertices[i];
                if ((pY - yB) * (xA - xB) / (yA - yB) + xB < pX) {
                    isInSide = !isInSide;
                }
            }

            iP = i;
        }
    }

    return isInSide;
}

int PolygonBoundingBoxData::intersectsSegment(
    float xA, float yA, float xB, float yB,
    Point* intersectionPointA,
    Point* intersectionPointB,
    Point* normalRadians) {
    auto intersectionCount = 0;
    if (RectangleBoundingBoxData::rectangleIntersectsSegment(xA, yA, xB, yB, x, y, x + width, y + height, nullptr, nullptr, nullptr) != 0) {
        intersectionCount = PolygonBoundingBoxData::polygonIntersectsSegment(
            xA, yA, xB, yB,
            vertices,
            intersectionPointA, intersectionPointB, normalRadians);
    }

    return intersectionCount;
}

DRAGONBONES_NAMESPACE_END
