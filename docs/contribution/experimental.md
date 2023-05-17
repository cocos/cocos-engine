
# Experimental API specification

This section describes what actions you should take to release and recall an experimental Cocos Creator engine API.

## Release an experimental API

While developing engine features, you may release an API as experimental,
if you, for example, expect users' feedback before the feature can be formally landed.

To release an experimental API:

- You're **REQUIRED** to postfix the API's name with a `_experimental`.

  > The requirement is reasonable since:

  >   - In this way, the experimental API does not occupy a "formal" name of
        stable API. Make it easy if the stable API differs a lot.

  >   - Users clearly know the API is experimental, without inspect any warning or document.

- An **optional** message(in warn level) can be attached at runtime when this API is used. The message shall be shown at most once.

## Revise the experimental API

During evolution of the API, you may revise the experimental API at your discretion. **No backward compatibility is required**. However you should document the change in release note, optionally in document.

## Recall an experimental API

When the API settles(no matter if there's a corresponding stable substitution), you're **REQUIRED** to turn the experimental as **deprecated** before you can entirely remove the API from engine.

In the following, "life time" [`a`, `b`] means the experimental API is released at version `a` and settled at version `b`.

- If the API's life time spans only patch versions, you're permitted to remove it in **next minor** version.

  > For example, if the API live in [`3.7.0`, `3.7.4`], you can remove it in `3.8.0`.

- If the API's life time spans only minor versions [`X.Y.*`, `X.Z.*`], you're permitted to remove it only after `Z-Y` minor versions, or in next major version.

  > For example, if the API live in [`3.7.1`,`3.9.0`], you can remove it in `3.11.0`, or `4.0.0`

- If the API's life time spans major versions. You can remove it in next major version.

  > For example, if the API live in [`3.0.0`, `5.6.7`], you can remove it only in `6.0.0`.

