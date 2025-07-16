package com.cocos.lib.websocket;

import android.util.Base64;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.GeneralSecurityException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.util.Arrays;
import javax.net.ssl.TrustManager;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.X509TrustManager;

class CocosWebSocketUtils {
  static X509TrustManager GetTrustManager(KeyStore keyStore)
      throws GeneralSecurityException {
    String algorithm = TrustManagerFactory.getDefaultAlgorithm();
    TrustManagerFactory trustManagerFactory =
        TrustManagerFactory.getInstance(algorithm);
    trustManagerFactory.init(keyStore);
    TrustManager[] trustManagers = trustManagerFactory.getTrustManagers();
    if (trustManagers.length != 1 ||
        !(trustManagers[0] instanceof X509TrustManager)) {
      String prefixErrorMessage = "Unexpected default trust managers:";
      throw new IllegalStateException(prefixErrorMessage +
                                      Arrays.toString(trustManagers));
    }
    return (X509TrustManager)trustManagers[0];
  }

  static KeyStore GetCERKeyStore(InputStream inputStream)
      throws CertificateException, KeyStoreException, IOException,
             NoSuchAlgorithmException {
    CertificateFactory factory = CertificateFactory.getInstance("X.509");
    Certificate certificate = factory.generateCertificate(inputStream);
    KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
    keyStore.load(null);
    keyStore.setCertificateEntry("0", certificate);
    return keyStore;
  }

  static KeyStore GetPEMKeyStore(InputStream inputStream) throws Exception {
    KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
    keyStore.load(null);
    int index = 0;

    BufferedReader bufferedReader =
        new BufferedReader(new InputStreamReader(inputStream));
    String carBegin;
    while ((carBegin = bufferedReader.readLine()) != null) {
      if (carBegin.contains("BEGIN CERTIFICATE")) {
        StringBuilder stringBuilder = new StringBuilder();
        while ((carBegin = bufferedReader.readLine()) != null) {
          if (carBegin.contains("END CERTIFICATE")) {
            String hexString = stringBuilder.toString();
            byte[] bytes = Base64.decode(hexString, Base64.DEFAULT);
            Certificate certificate = _GenerateCertificateFromDER(bytes);
            keyStore.setCertificateEntry(Integer.toString(index++),
                                         certificate);
            break;
          } else {
            stringBuilder.append(carBegin);
          }
        }
      }
    }
    bufferedReader.close();
    if (index == 0) {
      throw new IllegalArgumentException("No CERTIFICATE found");
    }
    return keyStore;
  }

  private static Certificate _GenerateCertificateFromDER(byte[] certBytes)
      throws CertificateException {
    CertificateFactory factory = CertificateFactory.getInstance("X.509");
    return factory.generateCertificate(new ByteArrayInputStream(certBytes));
  }
}
