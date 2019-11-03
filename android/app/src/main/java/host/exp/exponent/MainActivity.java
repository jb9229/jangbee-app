package host.exp.exponent;

import android.os.Bundle;

import com.facebook.react.ReactPackage;

import org.unimodules.core.interfaces.Package;

import java.util.List;

import host.exp.exponent.experience.DetachActivity;
import host.exp.exponent.generated.DetachBuildConstants;

public class MainActivity extends DetachActivity {
    Bundle mInitialProps = null;
  @Override
  public String publishedUrl() {
    return "exp://exp.host/@jb9229/jangbeecall_native";
  }

  @Override
  public String developmentUrl() {
    return DetachBuildConstants.DEVELOPMENT_URL;
  }

  @Override
  public List<ReactPackage> reactPackages() {
    return ((MainApplication) getApplication()).getPackages();
  }

  @Override
  public List<Package> expoPackages() {
    return ((MainApplication) getApplication()).getExpoPackages();
  }

  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

  @Override
  public Bundle initialProps(Bundle expBundle) {
    // Add extra initialProps here
    Bundle extraBundle = getIntent().getExtras();
    if(extraBundle != null && extraBundle.containsKey("BLACKLIST_LAUNCH")) {
      expBundle.putString("BLACKLIST_LAUNCH", extraBundle.getString("BLACKLIST_LAUNCH"));
    }
    return expBundle;
  }
}
