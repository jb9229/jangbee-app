package host.exp.exponent;

import android.app.Notification;
import android.app.Service;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.IBinder;
import android.support.annotation.Nullable;

import host.exp.exponent.utils.ReactAsyncStorageUtils;

/**
 * 폰상태 체크 백그라운드 서비스 클래스
 * @Author jbJeong
 * 2019-07-30
 */
public class IncomingCallScanService extends Service {
    // Variable
    IncomingCallBroadcastReceiver callScanRecevier;
    BootReceiver bootRecevier;


    @Override
        public void onCreate() {
        // Jangbee Call, Phone State Service is Started Basically

        callScanRecevier = new IncomingCallBroadcastReceiver();
//        if (Build.VERSION.SDK_INT >= 26) {
//            bootRecevier = new BootReceiver();
//        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        IntentFilter filter = new IntentFilter();
        filter.addAction("android.intent.action.PHONE_STATE");

        startForeground(9, new Notification());
        registerReceiver(callScanRecevier, filter);
//        if (Build.VERSION.SDK_INT >= 26) {
//              IntentFilter bootFilter = new IntentFilter();
//              bootFilter.addAction("android.intent.action.BOOT_COMPLETED");
//            registerReceiver(bootRecevier, bootFilter);
//        }

        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onDestroy() {
        unregisterReceiver(callScanRecevier);
        callScanRecevier = null;
//        if (Build.VERSION.SDK_INT >= 26) {
//            unregisterReceiver(bootRecevier);
//            bootRecevier = null;
//        }
        super.onDestroy();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        //Bound Service
        return null;
    }
}