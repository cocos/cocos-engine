# PAL module text-encoding

The text encoding PAL module encapsules the capability of encoding or decoding text from specified encoding.
Currently, the only supported encoding is UTF-8.

The encoding capability is classified as PAL out of consideration of performance:
pure JavaScript implementation is consider slow.

> This [repo](https://github.com/anonyco/FastestSmallestTextEncoderDecoder) gave a benchmark.

## Implementation Status

| Implementation | Covered Platforms                             |
|----------------|-----------------------------------------------|
| WHATWG         | Standard Web platforms, Native platforms      |
| WeChat         | WeChat Game                                   |
| TikTok         | TikTok Game                                   |
| Not Available  | Runtime-based, QuickApp-based, TaoBao, Alipay |

### WhatWG Implementation

On standard Web platforms, we use the WHATWG specification `TextEncoder` and `TextDecoder`.
Native platforms just polyfilled the WHATWG specification and we can directly use it.

### WeChat Implementation

WeChat platforms provides the capability in their style.
See https://developers.weixin.qq.com/minigame/dev/api/util/wx.encode.html .

### TikTok Implementation

TitTok platform provides the capability as well.
The document can be found at https://developer.open-douyin.com/docs/resource/zh-CN/mini-game/develop/api/drawing/inflate/tt-create-buffer/ .
It should be noticed that the API is not available in their devtool, as of devtool version V4.1.0.
So we have to also contain a fallback implementation(implemented in pure JavaScript) in runtime.