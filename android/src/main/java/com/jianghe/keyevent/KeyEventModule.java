package com.jianghe.keyevent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

/**
 *  KeyEventModule继承ReactContextBaseJavaModule用于实现原生模块方法
 *  @author jiangHe
 *  @date 2017-6-19
 *  @version 1.0.0
 */
public class KeyEventModule extends ReactContextBaseJavaModule {

    //react的上下文对象
    private ReactContext reactContext;

    //react的事件传递类DeviceEventEmitter对象
    //通过DeviceEventEmitter.emit方法可向RN发送消息
    private DeviceEventManagerModule.RCTDeviceEventEmitter deviceEventEmitter = null;

    //该类的实例化对象
    private static KeyEventModule keyEventModule = null;

    //构造方法初始化ReactContext对象
    protected KeyEventModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    //返回模块名
    @Override
    public String getName() {
        return "KeyEventModule";
    }

    //静态方法实例化本类返回实例化对象
    public static KeyEventModule initKeyEventModule(ReactApplicationContext reactContext) {
        keyEventModule = new KeyEventModule(reactContext);
        return keyEventModule;
    }

    //获取实例化对象的静态方法
    public static KeyEventModule getkeyEventModule() {
        return keyEventModule;
    }

    //提供给Activity 键盘按下调用的方法
    public void onKeyDownEvent(int keyCode) {
        if (deviceEventEmitter == null) {
            //通过反射实例化DeviceEventEmitter
            deviceEventEmitter = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
        }
        //发送消息给RN
        deviceEventEmitter.emit("KeyDown", keyCode);
    };

    //提供给Activity 键盘抬起调用的方法
    public void onKeyUpEvent(int keyCode) {
        if (deviceEventEmitter == null) {
            //通过反射实例化DeviceEventEmitter
            deviceEventEmitter = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
        }
        //发送消息给RN
        deviceEventEmitter.emit("KeyUp", keyCode);
    };

}
