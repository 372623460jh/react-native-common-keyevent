package com.jianghe.keyevent;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 *  KeyEventPackage实现ReactPackage用于引用是添加到eactInstanceManager中addPackage方法中
 *  @author jiangHe
 *  @date 2017-6-19
 *  @version 1.0.0
 */
public class KeyEventPackage implements ReactPackage {

    public KeyEventPackage() { }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Arrays.<NativeModule>asList(
                KeyEventModule.initKeyEventModule(reactContext)
        );
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}