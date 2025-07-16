package com.cocos.lib.websocket;

import java.io.IOException;
import java.net.InetAddress;
import java.net.Socket;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;

/**
 * An SSL socket factory that forwards all calls to a delegate. Override {@link
 * #configureSocket} to customize a created socket before it is returned.
 */
class CocosDelegatingSSLSocketFactory extends SSLSocketFactory {
  protected final SSLSocketFactory delegate;

  CocosDelegatingSSLSocketFactory(SSLSocketFactory delegate) {
    this.delegate = delegate;
  }

  @Override
  public String[] getDefaultCipherSuites() {
    return delegate.getDefaultCipherSuites();
  }

  @Override
  public String[] getSupportedCipherSuites() {
    return delegate.getSupportedCipherSuites();
  }

  @Override
  public Socket createSocket(Socket socket, String host, int port,
                             boolean autoClose) throws IOException {
    return configureSocket(
        (SSLSocket)delegate.createSocket(socket, host, port, autoClose));
  }

  @Override
  public Socket createSocket(String host, int port) throws IOException {
    return configureSocket((SSLSocket)delegate.createSocket(host, port));
  }

  @Override
  public Socket createSocket(String host, int port, InetAddress localHost,
                             int localPort) throws IOException {
    return configureSocket(
        (SSLSocket)delegate.createSocket(host, port, localHost, localPort));
  }

  @Override
  public Socket createSocket(InetAddress host, int port) throws IOException {
    return configureSocket((SSLSocket)delegate.createSocket(host, port));
  }

  @Override
  public Socket createSocket(InetAddress address, int port,
                             InetAddress localAddress, int localPort)
      throws IOException {
    return configureSocket((SSLSocket)delegate.createSocket(
        address, port, localAddress, localPort));
  }

  protected SSLSocket configureSocket(SSLSocket socket) throws IOException {
    return socket;
  }
}
