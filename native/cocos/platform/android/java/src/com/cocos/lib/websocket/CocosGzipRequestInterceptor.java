package com.cocos.lib.websocket;

import org.cocos2dx.okhttp3.Interceptor;
import org.cocos2dx.okhttp3.MediaType;
import org.cocos2dx.okhttp3.Request;
import org.cocos2dx.okhttp3.RequestBody;
import org.cocos2dx.okhttp3.Response;
import org.cocos2dx.okio.BufferedSink;
import org.cocos2dx.okio.GzipSink;
import org.cocos2dx.okio.Okio;
import java.io.IOException;

public class CocosGzipRequestInterceptor implements Interceptor {
  @Override
  public Response intercept(Chain chain) throws IOException {
    Request originalRequest = chain.request();
    if (originalRequest.body() == null ||
        originalRequest.header("Content-Encoding") != null) {
      return chain.proceed(originalRequest);
    }

    Request compressedRequest =
        originalRequest.newBuilder()
            .header("Content-Encoding", "gzip")
            .method(originalRequest.method(), gzip(originalRequest.body()))
            .build();
    return chain.proceed(compressedRequest);
  }

  private RequestBody gzip(final RequestBody body) {
    return new RequestBody() {
      @Override
      public MediaType contentType() {
        return body.contentType();
      }

      @Override
      public long contentLength() {
        return -1; // 无法提前知道压缩后的数据大小
      }

      @Override
      public void writeTo(BufferedSink sink) throws IOException {
        BufferedSink gzipSink = Okio.buffer(new GzipSink(sink));
        body.writeTo(gzipSink);
        gzipSink.close();
      }
    };
  }
}
