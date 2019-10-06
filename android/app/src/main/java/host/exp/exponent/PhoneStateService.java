package host.exp.exponent;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.support.v4.app.NotificationCompat;
import android.telephony.PhoneNumberUtils;
import android.telephony.TelephonyManager;
import android.util.Log;
import android.view.Display;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;
import android.view.View;
import android.widget.Toast;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import butterknife.ButterKnife;
import butterknife.BindView;
import butterknife.OnClick;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

import okhttp3.HttpUrl;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.ResponseBody;

public class PhoneStateService extends Service {
    NotificationManager blNotifyManager;
    NotificationCompat.Builder blBuilder;
    NotificationChannel notificationChannel;
    String NOTIFIVATION_CHANNEL_ID = "17";

    BroadcastReceiver blBroadcastReceiver = new BroadcastReceiver() {
        String preState;
        @Override
        public void onReceive(Context context, Intent intent) {
            Log.d("RECEIVER : ", "IS UP Phone State...");

            try
            {
                // Check Duplicate Receive
                String state = intent.getStringExtra(TelephonyManager.EXTRA_STATE);
                if (state.equals(preState)) {
                    return;
                } else {
                    preState = state;
                }

                Toast.makeText(context, "[장비 콜]RECEIVER Phone State: ", Toast.LENGTH_LONG).show();

                if(TelephonyManager.EXTRA_STATE_RINGING.equals(state)){
                    String incomingNumber = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER);
                    Toast.makeText(context, "[장비 콜]수신전화번호: "+incomingNumber, Toast.LENGTH_LONG).show();

                    Callback httpCallBack = new Callback() {
                        //비동기 처리를 위해 Callback 구현
                        @Override
                        public void onFailure(Call call, IOException e) {
                            Handler mHandler = new Handler(Looper.getMainLooper());
                            mHandler.postDelayed(new Runnable() {
                                @Override
                                public void run() {
                                    Toast.makeText(context, "[장비 콜]수신전화번호 Error: "+e.toString(), Toast.LENGTH_LONG).show();
                                };
                            }, 0);
                            Log.d("JB Server Error: ",  e.toString());
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
                                    startForegroundService(serviceIntent);
                                } else {
                                    startService(serviceIntent);
                                }
                            }
                        }
                    };

                    Map paramData = new HashMap();
                    if(incomingNumber == null || incomingNumber.trim().isEmpty()) {paramData.put("telNumber", "0101112222");} else {paramData.put("telNumber", incomingNumber);}

                    String[] pathParamArr = {"api", "v1", "client", "evaluation", "exist", "telnumber"};
                    getHttpAsync("http", "jangbeecall.ap-northeast-2.elasticbeanstalk.com", pathParamArr, paramData, httpCallBack);
                }
            }catch (Exception e) {
                e.printStackTrace();
                Log.e("Receiver : ",  "Exception  is : ", e);
            }
        }

        void getHttpAsync(String scheme, String host, String[] pathSegment, Map<String, String> parameterData, Callback callback) {
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
    };

    public PhoneStateService() {}

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d("PhoneStateService :", "\nOnCreate...");

        IntentFilter callFilter = new IntentFilter();
        callFilter.addAction("android.intent.action.PHONE_STATE");
        this.registerReceiver(blBroadcastReceiver, callFilter);

        Log.d("PhoneStateService : ", "\nblBroadcastReceiver Create....");

        blNotifyManager = (NotificationManager) getApplicationContext().getSystemService(NOTIFICATION_SERVICE);
        blBuilder = new NotificationCompat.Builder(this, null);
        blBuilder.setContentTitle("[장비 콜]피해사례 확인중")
                .setContentText("수신전화번호를 확인하여 피해사례 건이 있는지 알려 드립니다")
                .setTicker("Checking New Numbers")
                .setSmallIcon(R.drawable.ic_launcher)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setDefaults(Notification.DEFAULT_ALL)
                .setVisibility(Notification.VISIBILITY_PUBLIC)
                .setOngoing(true)
                .setAutoCancel(false);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            notificationChannel = new NotificationChannel(NOTIFIVATION_CHANNEL_ID, "Black List Notifications", NotificationManager.IMPORTANCE_HIGH);

            // Configure the notification channel.
            notificationChannel.setDescription("Channel description");
            notificationChannel.enableLights(true);
            notificationChannel.setLightColor(Color.RED);
            notificationChannel.setVibrationPattern(new long[]{0, 1000, 500, 1000});
            notificationChannel.enableVibration(true);
            notificationChannel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
            blNotifyManager.createNotificationChannel(notificationChannel);

            blBuilder.setChannelId(NOTIFIVATION_CHANNEL_ID);
            startForeground(17, blBuilder.build());
        } else {
            blBuilder.setChannelId(NOTIFIVATION_CHANNEL_ID);
            //startForeground(17, blBuilder.build());
            blNotifyManager.notify(17, blBuilder.build());
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int staertId) {
        Log.d("PhoneStateService : ", "\nblBroadcastReceiver Listening....");

        // return super.onStartCommnad(intent, flags, startId);

        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        blNotifyManager.cancel(17);
        if (blBroadcastReceiver != null) {
            this.unregisterReceiver(blBroadcastReceiver);
        }
        Log.d("PhoneStateService : ", "\nDestoryed....");
        Log.d("PhoneStateService : ", "\nWill be created again....");
    }

    @Override
    public IBinder onBind(Intent intent) {
        // TODO: Return the communication channel to the service.
        throw new UnsupportedOperationException("Not yet implemented");
    }
}
