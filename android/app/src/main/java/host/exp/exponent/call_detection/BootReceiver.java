package host.exp.exponent.call_detection;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.provider.Settings;
import android.telephony.PhoneNumberUtils;
import android.telephony.TelephonyManager;
import android.util.Log;
import android.widget.Toast;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import host.exp.exponent.PhoneStateService;
import host.exp.exponent.utils.ReactAsyncStorageUtils;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

public class BootReceiver extends BroadcastReceiver{
    private static String mLastState;

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d("BootTest : ", "\nOnBootReceiver - Received a broadcast!");
        Toast.makeText(context, "OnBootReceiver Received a broadcast!!", Toast.LENGTH_LONG).show();

        boolean isScanBlackList = ReactAsyncStorageUtils.retrieveBoolean(context, ReactAsyncStorageUtils.ISSCANBALCKLIST_SPKEY);
        if(!isScanBlackList) {return;}

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(new Intent(context, PhoneStateService.class));
        } else {
            context.startService(new Intent(context, PhoneStateService.class));
        }
    }
}
