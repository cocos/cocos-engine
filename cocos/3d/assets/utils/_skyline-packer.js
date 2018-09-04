
class _SkylineNode {
  constructor(x, y, width) {
    this._x = x;
    this._y = y;
    this._width = width;
  }
}

class _Rect {
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
  }
  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
}

function _rectFits(skylinePacker, skylineNodeIdx, width, height, y) {
  let x = skylinePacker._skyline[skylineNodeIdx]._x;
  if (x + width > skylinePacker._binWidth) {
    return false;
  }
  let widthLeft = width;
  let i = skylineNodeIdx;
  y.value = skylinePacker._skyline[skylineNodeIdx]._y;
  while (widthLeft > 0) {
    y.value = Math.max(y.value, skylinePacker._skyline[i]._y);
    if (y.value + height > skylinePacker._binHeight) {
      return false;
    }
    widthLeft -= skylinePacker._skyline[i]._width;
    ++i;

    console.assert(i < skylinePacker._skyline.length || widthLeft <= 0);
  }

  return true;
}

function _findPosBottomLeft(skylinePacker, width, height, scores, bestIdx) {
  let newRect = new _Rect();
  scores.score1 = Number.MAX_VALUE;
  scores.score2 = Number.MAX_VALUE;
  bestIdx.value = -1;

  for (let i = 0; i < skylinePacker._skyline.length; ++i) {
    let y = {
      value: 0
    };
    if (_rectFits(skylinePacker, i, width, height, y)) {
      if (y.value + height < scores.score1 || (y.value + height === scores.score1 && skylinePacker._skyline[i]._width < scores.score2)) {
        scores.score1 = y.value + height;
        bestIdx.value = i;
        scores.score2 = skylinePacker._skyline[i]._width;
        newRect._x = skylinePacker._skyline[i]._x;
        newRect._y = y.value;
        newRect._width = width;
        newRect._height = height;

        return newRect;
      }
    }

    if (skylinePacker._allowRotate && _rectFits(skylinePacker, i, height, width, y)) {
      if (y.value + width < scores.score1 || (y.value + width === scores.score1 && skylinePacker._skyline[i]._width < scores.score2)) {
        scores.score1 = y.value + width;
        bestIdx.value = i;
        scores.score2 = skylinePacker._skyline[i]._width;
        newRect._x = skylinePacker._skyline[i]._x;
        newRect._y = y.value;
        newRect._width = height;
        newRect._height = width;

        return newRect;
      }
    }
  }

  if (newRect._width === 0 && newRect._height ===0) {
    let occupancy = this._usedSurfaceArea / (this._binWidth * this._binHeight);
    console.error(`Pack font failed! Occupancy is ${occupancy}`);
  }

  return newRect;
}

function _addSkylineLevel(skylinePacker, skylineNodeIdx, bestRect) {
  let newNode = new _SkylineNode(bestRect._x, bestRect._y + bestRect._height, bestRect._width);
  skylinePacker._skyline.splice(skylineNodeIdx, 0, newNode);

  console.assert(newNode._x + newNode._width <= skylinePacker._binWidth);
  console.assert(newNode._y <= skylinePacker._binHeight);

  let skyline = skylinePacker._skyline;
  for (let i = skylineNodeIdx + 1; i < skyline.length; ++i) {
    console.assert(skyline[i-1]._x <= skyline[i]._x);

    if (skyline[i]._x < skyline[i-1]._x + skyline[i-1]._width) {
      let shrink = skyline[i-1]._x + skyline[i-1]._width - skyline[i]._x;

      skyline[i]._x += shrink;
      skyline[i]._width -= shrink;

      if (skyline[i]._width <= 0) {
        skyline.splice(i, 1);
        --i;
      } else {
        break;
      }
    } else {
      break;
    }
  }

  // merge skylines
  for (let i = 0; i < skyline.length - 1; ++i) {
    if (skyline[i]._y === skyline[i+1]._y) {
      skyline[i]._width += skyline[i+1]._width;
      skyline.splice(i + 1, 1);
      --i;
    }
  }
}

// TODO: useWasteMap? other heuristic algorithms. now bottomleft only.
export default class SkylinePacker {
  constructor(width, height, padding, allowRotate) {
    this._skyline = [];
    this._skyline.push(new _SkylineNode(0, 0, width));
    this._binWidth = width;
    this._binHeight = height;
    this._padding = padding;
    this._allowRotate = allowRotate;
    this._usedSurfaceArea = 0;
  }

  insertRect(width, height) {
    let bestScores = {
      score1: Number.MAX_VALUE, // best height
      score2: Number.MAX_VALUE, // best width
    };
    let bestIdx = {
      value: -1,
    };
    let newRect = _findPosBottomLeft(this, width + this._padding, height + this._padding, bestScores, bestIdx);

    if (bestIdx.value !== -1) {
      _addSkylineLevel(this, bestIdx, newRect);
      this._usedSurfaceArea += (width + this._padding) * (height + this._padding);
    }

    return newRect;
  }

  insertRects(rects) {
    let unhandledRects = rects.slice();
    let tmpScores = {
      score1: Number.MAX_VALUE, // best height
      score2: Number.MAX_VALUE, // best width
    };
    let tmpIdx = {
      value: -1,
    };

    while (unhandledRects.length > 0) {
      let bestRect = new _Rect();
      let bestScore1 = Number.MAX_VALUE;
      let bestScore2 = Number.MAX_VALUE;
      let bestSkylineIdx = -1;
      let bestRectIdx = -1;
      for (let i = 0; i < unhandledRects.length; ++i) {
        let newRect = _findPosBottomLeft(this, unhandledRects[i].width + this._padding, unhandledRects[i].height + this._padding, tmpScores, tmpIdx);
        if (newRect._height !== 0) {
          if (tmpScores.score1 < bestScore1 || (tmpScores.score1 === bestScore1 && tmpScores.score2 < bestScore2)) {
            bestRect = newRect;
            bestScore1 = tmpScores.score1;
            bestScore2 = tmpScores.score2;
            bestSkylineIdx = tmpIdx.value;
            bestRectIdx = i;
          }
        }
      }

      if (bestRectIdx == -1) {
        return false;
      }

      _addSkylineLevel(this, bestSkylineIdx, bestRect);
      this._usedSurfaceArea += (unhandledRects[bestRectIdx].width + this._padding) * (unhandledRects[bestRectIdx].height + this._padding);
      let bestNode = unhandledRects.splice(bestRectIdx, 1)[0];
      bestNode.x = Math.floor(bestRect._x);
      bestNode.y = Math.floor(bestRect._y);
      bestNode.rotated = (bestNode.width + this._padding !== bestRect._width);
    }

    return true;
  }

  clear() {
    this._skyline = [];
    this._skyline.push(new _SkylineNode(0, 0, this._binWidth));
    this._usedSurfaceArea = 0;
  }
}