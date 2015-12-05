----------
Subclasses can override this method to make event propagable
```js
for (var target = this._parent; target; target = target._parent) {
    if (target._capturingListeners && target._capturingListeners.has(type)) {
        array.push(target);
    }
}
