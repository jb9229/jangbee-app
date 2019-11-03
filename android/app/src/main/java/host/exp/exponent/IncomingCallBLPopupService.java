package host.exp.exponent;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.Message;
import android.support.v7.app.AppCompatActivity;
import android.telephony.PhoneNumberUtils;
import android.util.Log;
import android.view.Display;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.TextView;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import host.exp.exponent.call_detection.CallDetectionModule;
import host.exp.exponent.utils.AppStatusHelper;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.HttpUrl;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import android.widget.Button;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public class IncomingCallBLPopupService extends Service {
    // Variables
    public static final String INCOMINGCALL_NUMBER_EXTRA = "INCOMING_CALL_NUMBER";

    Context context;
    WindowManager windowManager;
    WindowManager.LayoutParams wmParams;
    View rootView;
    @BindView(R.id.inco_scan_callnumber)
    TextView incoCallNumberTextView;
    String incomingCallNumber;

    @Override
    public IBinder onBind(Intent intent) {
        // Not used
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        context = (Context)this;
        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);

        int layoutType;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            layoutType = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
        } else {
            layoutType = WindowManager.LayoutParams.TYPE_SYSTEM_ERROR;
        }

        wmParams = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                layoutType,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                        | WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
                        | WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
                        | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON,
                PixelFormat.TRANSLUCENT);

        LayoutInflater layoutInflater = (LayoutInflater) getSystemService(LAYOUT_INFLATER_SERVICE);
        rootView = layoutInflater.inflate(R.layout.incomingcall_scan_popup, null);
        ButterKnife.bind(this, rootView);

        Button btnShowBalcklist = rootView.findViewById(R.id.btn_show_blacklist);
        btnShowBalcklist.setOnClickListener(new View.OnClickListener()   {
            public void onClick(View v)  {
                try {
                    if (rootView != null && windowManager != null) windowManager.removeView(rootView);

                    Intent appStartIntent = new Intent(getApplicationContext(), MainActivity.class);
                    appStartIntent.putExtra("BLACKLIST_LAUNCH", incomingCallNumber);
                    startActivity(appStartIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
                    if (AppStatusHelper.isAppRunning(getApplicationContext(), "com.kan.jangbeecall")) {
                        // App is running
                        Toast.makeText(context, "App is running", Toast.LENGTH_LONG).show();
                        try {
                            WritableNativeMap map = new WritableNativeMap();
                            map.putString("telNumber", incomingCallNumber);
                            CallDetectionModule.sendEvent("blackListAppLauchEvent", map);

                        } catch (Exception e){
                            System.out.println("Caught Exception: " + e.getMessage());
                        }
                    } else {
                        // App is not running
                        Toast.makeText(context, "App is not running", Toast.LENGTH_LONG).show();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
        setDraggable();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        windowManager.addView(rootView, wmParams);
        setExtra(intent);

        String phoneNumber = PhoneNumberUtils.formatNumber(incomingCallNumber);
        String blNotice = "["+phoneNumber+"] 번호가\n장비 콜 피해사례에 있습니다,\n주의 및 참고해 주세요.";
        incoCallNumberTextView.setText(blNotice);

        return Service.START_NOT_STICKY;
    }

    private void setExtra(Intent intent) {
        if (intent == null) {
            removePopup();
            return;
        }

        incomingCallNumber = intent.getStringExtra(INCOMINGCALL_NUMBER_EXTRA);
    }

    private void setDraggable() {
        rootView.setOnTouchListener(new View.OnTouchListener() {
            private int initialX;
            private int initialY;
            private float initialTouchX;
            private float initialTouchY;

            @Override public boolean onTouch(View v, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        initialX = wmParams.x;
                        initialY = wmParams.y;
                        initialTouchX = event.getRawX();
                        initialTouchY = event.getRawY();
                        return true;
                    case MotionEvent.ACTION_UP:
                        return true;
                    case MotionEvent.ACTION_MOVE:
                        wmParams.x = initialX + (int) (event.getRawX() - initialTouchX);
                        wmParams.y = initialY + (int) (event.getRawY() - initialTouchY);

                        if (rootView != null) windowManager.updateViewLayout(rootView, wmParams);
                        return true;
                }
                return false;
            }
        });
    }


    @OnClick(R.id.btn_close)
    public void removePopup() {
        if (rootView != null && windowManager != null) windowManager.removeView(rootView);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            stopForeground(true);
        } else {
            stopSelf();
        }
    }
}
