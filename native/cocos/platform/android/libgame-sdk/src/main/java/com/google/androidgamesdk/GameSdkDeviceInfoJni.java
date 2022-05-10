package com.google.androidgamesdk;

/** JNI api for getting device information */
public class GameSdkDeviceInfoJni {
  private static Throwable initializationExceptionOrError;

  static {
    try {
      System.loadLibrary("game_sdk_device_info_jni");
    } catch(Exception exception) {
      // Catch SecurityException, NullPointerException (or any potential unchecked exception)
      // as we don't want to crash the app if the library failed to load.
      initializationExceptionOrError = exception;
    } catch(Error error) {
      // Catch UnsatisfiedLinkError (or any potential unchecked error)
      // as we don't want to crash the app if the library failed to load.
      initializationExceptionOrError = error;
    }
  }

  /**
   * Returns a byte array, which is a serialized proto containing device information, or
   * null if the native library "game_sdk_device_info_jni" could not be loaded.
   *
   * @return Optional with the serialized byte array, representing game sdk device info with errors,
   * or null.
   */
  public static byte[] tryGetProtoSerialized() {
    if (initializationExceptionOrError != null) {
      return null;
    }

    return getProtoSerialized();
  }


  /**
   * Returns the exception or error that was caught when trying to load the library, if any.
   * Otherwise, returns null.
   *
   * @return The caught Throwable or null.
   */
  public static Throwable getInitializationExceptionOrError() {
    return initializationExceptionOrError;
  }

  /**
   * Returns a byte array, which is a serialized proto.
   *
   * @return serialized byte array, representing game sdk device info with errors.
   */
  private static native byte[] getProtoSerialized();

  private GameSdkDeviceInfoJni() {}
}
