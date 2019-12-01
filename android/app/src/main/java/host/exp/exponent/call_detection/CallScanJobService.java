package host.exp.exponent.call_detection;

import android.app.job.JobParameters;
import android.app.job.JobService;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.telephony.PhoneNumberUtils;
import android.util.Log;
import android.widget.Toast;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import host.exp.exponent.IncomingCallBLPopupService;
import host.exp.exponent.MainActivity;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.HttpUrl;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class CallScanJobService extends JobService {
    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public boolean onStartJob(JobParameters jobParameters) {
        String phoneNumber = jobParameters.getExtras().getString("telNumber");
        Map paramData = new HashMap();
        paramData.put("telNumber", phoneNumber);
        Callback httpCallBack = new Callback() {
            //비동기 처리를 위해 Callback 구현
            @Override
            public void onFailure(Call call, IOException e) {
                Handler mHandler = new Handler(Looper.getMainLooper());
                mHandler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        Toast.makeText(getApplicationContext(), "[장비 콜]수신전화번호 Error: "+e.toString(), Toast.LENGTH_LONG).show();
                    };
                }, 0);
                Log.d("JB Server Error: ",  e.toString());
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                String result   = response.body().string();
                if (result != null && !result.isEmpty() && Boolean.parseBoolean(result)) {
                    String blResult = PhoneNumberUtils.formatNumber(phoneNumber);

                    Intent appStartIntent = new Intent(getApplicationContext(), MainActivity.class);
                    startActivity(appStartIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));

                    Intent serviceIntent = new Intent(getApplicationContext(), IncomingCallBLPopupService.class);
                    serviceIntent.putExtra(IncomingCallBLPopupService.INCOMINGCALL_NUMBER_EXTRA, blResult);
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        startForegroundService(serviceIntent);
                    } else {
                        startService(serviceIntent);
                    }
                }
            }
        };

        String[] pathParamArr = {"api", "v1", "client", "evaluation", "exist", "telnumber"};
        getHttpAsync("http", "jangbeecall.ap-northeast-2.elasticbeanstalk.com", pathParamArr, paramData, httpCallBack);

        return false;
    }

    @Override
    public boolean onStopJob(JobParameters jobParameters) {
        return false;
    }

    void getHttpAsync(String scheme, String host, String[] pathSegment, Map<String, String> parameterData, Callback callback) {
        try {
            OkHttpClient client = new OkHttpClient.Builder()
                    .connectTimeout(30, TimeUnit.SECONDS)
                    .readTimeout(30, TimeUnit.SECONDS)
                    .retryOnConnectionFailure(true)
                    .build();
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

            //동기 처리시 execute 함수 사용
            client.newCall(request).enqueue(callback);
        } catch (Exception e){
            System.err.println(e.toString());
        }
    }
}
