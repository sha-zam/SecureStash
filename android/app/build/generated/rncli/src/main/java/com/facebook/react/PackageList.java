
package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;

import com.securestash.BuildConfig;
import com.securestash.R;

// @react-native-community/datetimepicker
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;
// @react-native-community/masked-view
import org.reactnative.maskedview.RNCMaskedViewPackage;
// @react-native-community/picker
import com.reactnativecommunity.picker.RNCPickerPackage;
// react-native-date-picker
import com.henninghall.date_picker.DatePickerPackage;
// react-native-email-link
import com.facebook.react.modules.email.EmailPackage;
// react-native-fs
import com.rnfs.RNFSPackage;
// react-native-gesture-handler
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
// react-native-keychain
import com.oblador.keychain.KeychainPackage;
// react-native-mail
import com.chirag.RNMail.RNMail;
// react-native-reanimated
import com.swmansion.reanimated.ReanimatedPackage;
// react-native-rsa-native
import com.RNRSA.RNRSAPackage;
// react-native-safe-area-context
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
// react-native-screens
import com.swmansion.rnscreens.RNScreensPackage;
// react-native-smtp-mailer
import com.reactlibrary.RNSmtpMailerPackage;
// react-native-vector-icons
import com.oblador.vectoricons.VectorIconsPackage;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  private MainPackageConfig mConfig;

  public PackageList(ReactNativeHost reactNativeHost) {
    this(reactNativeHost, null);
  }

  public PackageList(Application application) {
    this(application, null);
  }

  public PackageList(ReactNativeHost reactNativeHost, MainPackageConfig config) {
    this.reactNativeHost = reactNativeHost;
    mConfig = config;
  }

  public PackageList(Application application, MainPackageConfig config) {
    this.reactNativeHost = null;
    this.application = application;
    mConfig = config;
  }

  private ReactNativeHost getReactNativeHost() {
    return this.reactNativeHost;
  }

  private Resources getResources() {
    return this.getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return this.getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.<ReactPackage>asList(
      new MainReactPackage(mConfig),
      new RNDateTimePickerPackage(),
      new RNCMaskedViewPackage(),
      new RNCPickerPackage(),
      new DatePickerPackage(),
      new EmailPackage(),
      new RNFSPackage(),
      new RNGestureHandlerPackage(),
      new KeychainPackage(),
      new RNMail(),
      new ReanimatedPackage(),
      new RNRSAPackage(),
      new SafeAreaContextPackage(),
      new RNScreensPackage(),
      new RNSmtpMailerPackage(),
      new VectorIconsPackage()
    ));
  }
}
