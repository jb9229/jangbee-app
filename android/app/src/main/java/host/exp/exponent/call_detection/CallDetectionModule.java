package host.exp.exponent.call_detection;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.IllegalViewOperationException;

import javax.annotation.Nonnull;

import host.exp.exponent.IncomingCallBroadcastReceiver;
import host.exp.exponent.IncomingCallScanService;
import host.exp.exponent.utils.ReactAsyncStorageUtils;
import host.exp.exponent.utils.ServiceUtils;

public class CallDetectionModule extends ReactContextBaseJavaModule {
    // Variables
    static int PHONE_STATE_REQCODE = 3;
    static int REQ_CODE_OVERLAY_PERMISSION = 2;

    ReactApplicationContext reactContext;
    IncomingCallBroadcastReceiver callScanRecevier;
    public CallDetectionModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return "CallDetection";
    }

    @ReactMethod
    public void isRunningService( Callback successCallback, Callback errorCallback) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(reactContext)) {
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + reactContext.getPackageName()));
                reactContext.startActivityForResult(intent, REQ_CODE_OVERLAY_PERMISSION, new Bundle());
            }

            if(checkPhonestatePermission()) {
                // Check BlackList Scan Setting Value
                boolean isScanBlackList = ReactAsyncStorageUtils.retrieveBoolean(reactContext, ReactAsyncStorageUtils.ISSCANBALCKLIST_SPKEY);
                Toast.makeText(getReactApplicationContext(), "Call Detection Flag:"+isScanBlackList, Toast.LENGTH_LONG).show();

//                boolean isRunningService = ServiceUtils.isLaunchingService(reactContext, IncomingCallScanService.class);
                successCallback.invoke(isScanBlackList);
            } else {
                errorCallback.invoke("권한 설정을 완료해 주세요");
            }
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void start(Callback successCallback, Callback errorCallback) {
        Toast.makeText(getReactApplicationContext(), "Start Call Detection", Toast.LENGTH_LONG).show();

        try{
            if(checkPhonestatePermission()) {
//                Intent serviceIntent = new Intent(reactContext, IncomingCallScanService.class);
//                if (Build.VERSION.SDK_INT >= 26) {
//                    reactContext.startForegroundService(serviceIntent);
//                } else {
//                    reactContext.startService(serviceIntent);
//                }

                ReactAsyncStorageUtils.storeBoolean(reactContext, ReactAsyncStorageUtils.ISSCANBALCKLIST_SPKEY, true);

//                boolean isRunningService = ServiceUtils.isLaunchingService(reactContext, IncomingCallScanService.class);

                boolean isScanBlackList = ReactAsyncStorageUtils.retrieveBoolean(reactContext, ReactAsyncStorageUtils.ISSCANBALCKLIST_SPKEY);
                successCallback.invoke(isScanBlackList);
            } else {
                successCallback.invoke(false);
            }
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void finish(Callback successCallback, Callback errorCallback) {
        Toast.makeText(getReactApplicationContext(), "Finish Call Detection", Toast.LENGTH_LONG).show();

        try{
//            Intent serviceIntent = new Intent(reactContext, IncomingCallScanService.class);
//
//            reactContext.stopService(serviceIntent);


            ReactAsyncStorageUtils.storeBoolean(reactContext, ReactAsyncStorageUtils.ISSCANBALCKLIST_SPKEY, false);

//            boolean isRunningService = ServiceUtils.isLaunchingService(reactContext, IncomingCallScanService.class);

            boolean isScanBlackList = ReactAsyncStorageUtils.retrieveBoolean(reactContext, ReactAsyncStorageUtils.ISSCANBALCKLIST_SPKEY);
            successCallback.invoke(isScanBlackList);
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    boolean checkPhonestatePermission() {
        boolean checkResult = true;

        Activity currentActivity = getCurrentActivity();
        if ( ContextCompat.checkSelfPermission(currentActivity, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED || ContextCompat.checkSelfPermission(currentActivity, Manifest.permission.READ_CALL_LOG) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(currentActivity, new String[]{Manifest.permission.READ_PHONE_STATE, Manifest.permission.READ_CALL_LOG}, PHONE_STATE_REQCODE);
            checkResult = false;
        }

        return checkResult;
    }

    /**
     * 위험한 권한(READ_PHONE_STATE) 요청 결과 호출함수
     *
     * @param requestCode
     * @param permissions
     * @param grantResults
     */
    protected void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        switch (requestCode) {
            case 3: {  // PHONE_STATE_REQCODE = 3 요청시 임의 상수값
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    // permission granted!
                    // you may now do the action that requires this permission

                } else {
                    // permission denied
                    // TODO send message to js
                }
                return;
            }

        }
    }
}
