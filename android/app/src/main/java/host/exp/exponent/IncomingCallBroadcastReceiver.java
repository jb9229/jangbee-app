package host.exp.exponent;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.telephony.PhoneNumberUtils;
import android.telephony.TelephonyManager;
import android.view.Display;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import host.exp.exponent.utils.ReactAsyncStorageUtils;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.HttpUrl;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;

import static android.content.Intent.FLAG_ACTIVITY_NEW_TASK;

public class IncomingCallBroadcastReceiver extends BroadcastReceiver {
    private static String mLastState;

    WindowManager windowManager;
    WindowManager.LayoutParams wmParams;
    View rootView;
    TextView incoCallNumberTextView;
    ImageButton closeButton;
    Button btnShowBalcklist;
    String bllistResult;

    @Override
    public void onReceive(final Context context, Intent intent) {

        boolean isScanBlackList = ReactAsyncStorageUtils.retrieveBoolean(context, ReactAsyncStorageUtils.ISSCANBALCKLIST_SPKEY);

        if(!isScanBlackList) {return;}

        String state = intent.getStringExtra(TelephonyManager.EXTRA_STATE);
        /** * http://mmarvick.github.io/blog/blog/lollipop-multiple-broadcastreceiver-call-state/ * 2번 호출되는 문제 해결 */
        if (state.equals(mLastState)) {
            return;
        } else {
            mLastState = state;
        }

        if (TelephonyManager.EXTRA_STATE_RINGING.equals(state)) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(context)) {
                Toast.makeText(context, "[장비 콜]수신전화 피해사례 조회를 위해 추가 권한이 필요합니다. 앱에서(내정보 -> 알람 설정 -> 수신전화 피해사례조회) 설정을 다시해 주세요!", Toast.LENGTH_LONG).show();

                return;
            }

            String incomingNumber = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER);
//                String incomingNumber = "01028729229";
            // Search Blacklist
            Map paramData = new HashMap();
            paramData.put("telNumber", incomingNumber);

            Callback httpCallBack = new Callback() {
                //비동기 처리를 위해 Callback 구현
                @Override
                public void onFailure(Call call, IOException e) {
                    System.out.println("error + Connect Server Error is " + e.toString());
                }

                @Override
                public void onResponse(Call call, Response response) throws IOException {
                    String blResult = "피해사례가 조회되지 않습니다.";
                    String result   = response.body().string();
                    if (result != null && !result.isEmpty() ) { //&& Boolean.parseBoolean(result)
                        if (Boolean.parseBoolean(result)) {
                            blResult = PhoneNumberUtils.formatNumber(incomingNumber);
                        }

                        Intent serviceIntent = new Intent(context, IncomingCallBLPopupService.class);
                        serviceIntent.putExtra(IncomingCallBLPopupService.INCOMINGCALL_NUMBER_EXTRA, blResult);
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                            context.startForegroundService(serviceIntent);
                        } else {
                            context.startService(serviceIntent);
                        }
                    }

//                    Intent serviceIntent = new Intent(context, IncomingCallBLPopupService.class);
//                    serviceIntent.putExtra(IncomingCallBLPopupService.INCOMINGCALL_NUMBER_EXTRA, bllistResult);

//                    Intent activityIntent = new Intent(context, IncommingCallScanActivity.class);
//                    activityIntent.putExtra(IncommingCallScanActivity.INCOMINGCALL_NUMBER_EXTRA, bllistResult);
//
//                    context.startActivity(activityIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));

//                    if (Build.VERSION.SDK_INT >= 26) {
//                        context.startForegroundService(serviceIntent);
//                    } else {
//                        context.startService(serviceIntent);
//                    }



                }
            };

            String[] pathParamArr = {"api", "v1", "client", "evaluation", "exist", "telnumber"};
            getHttpAsync("http", "jangbeecall.ap-northeast-2.elasticbeanstalk.com", pathParamArr, paramData, httpCallBack);
        }
    }

    public void getHttpAsync(String scheme, String host, String[] pathSegment, Map<String, String> parameterData, Callback callback) {
        try {
            OkHttpClient client = new OkHttpClient();
            HttpUrl.Builder builder = new HttpUrl.Builder();
            builder.scheme(scheme);
            builder.host(host);

            for (String param : pathSegment) {
                builder.addPathSegment(param);
            }

//            parameterData.forEach((k, v) -> builder.addQueryParameter(k, v)); // from API24
            for (String key : parameterData.keySet()) {
                builder.addQueryParameter(key, parameterData.get(key));
            }

            Request request = new Request.Builder()
                    .url(builder.build())
                    .build(); //GET Request

            //동기 처리시 execute함수 사용
            client.newCall(request).enqueue(callback);
        } catch (Exception e){
            System.err.println(e.toString());
        }
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
}