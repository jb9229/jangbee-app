package host.exp.exponent;

import android.app.Activity;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.Display;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.TextView;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class IncommingCallScanActivity extends Activity {
    // Variables
    public static final String INCOMINGCALL_NUMBER_EXTRA = "INCOMING_CALL_NUMBER";

    WindowManager windowManager;
    WindowManager.LayoutParams wmParams;
    View rootView;
    @BindView(R.id.inco_scan_callnumber)
    TextView incoCallNumberTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        Display display = windowManager.getDefaultDisplay();
        int width = (int) (display.getWidth() * 0.9);

        int layoutType;
        if (Build.VERSION.SDK_INT >= 26) {
            layoutType = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
        } else {
            layoutType = WindowManager.LayoutParams.TYPE_SYSTEM_ERROR;
        }

        //Display 사이즈의 90%
        wmParams = new WindowManager.LayoutParams(
                width,
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
        setDraggable();
    }

    @Override
    public void onStart() {
        super.onStart();

        Intent intent = getIntent();
        String incomingCallNumber  = intent.getStringExtra(INCOMINGCALL_NUMBER_EXTRA);

        windowManager.addView(rootView, wmParams);

        incoCallNumberTextView.setText(incomingCallNumber);
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
        finish();
    }
}
