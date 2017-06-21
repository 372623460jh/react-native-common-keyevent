## react-native-common-keyevent

该组件用于`React-Native`中获取`Android`原生层面的键盘响应事件。

- 目前开发者本人的主要使用场景是Android-TV端获取遥控器的按键事件。

- GitHub地址:[https://github.com/372623460jh/react-native-common-keyevent](https://github.com/372623460jh/react-native-common-keyevent).

### 安装

#### 使用npm

	$ npm install react-native-common-keyevent --save



### Android端环境配置


1. `android/setting.gradle`文件增加以下代码

	    ...
	    include ':react-native-common-keyevent'
	    project(':react-native-common-keyevent').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-common-keyevent/android')


2. `android/app/build.gradle`文件增加以下代码

	    ...
	    dependencies {
	        ...
	        compile project(':react-native-common-keyevent')
	    }


3. android代码中修改（Application方式或Activity方式二选一）

	- Application方式注册模块



			import import com.jianghe.keyevent.KeyEventPackage;  //--> 导入模块包
			
			public class MainApplication extends Application implements ReactApplication {
				......
				@Override
				protected List<ReactPackage> getPackages() {
					return Arrays.<ReactPackage>asList(
						new MainReactPackage(),
						new KeyEventPackage() //-->增加组件的ReactPackage文件
					);
				}		
				......	
			}	

	- Activity方式注册模块



			import com.jianghe.keyevent.*;	//--> 导入模块包

			public class MyActivity extends Activity implements DefaultHardwareBackBtnHandler {
			
			    private ReactRootView mReactRootView;
			    private ReactInstanceManager mReactInstanceManager;
			
			    @Override
			    protected void onCreate(Bundle savedInstanceState) {
			        super.onCreate(savedInstanceState);
			        mReactRootView = new ReactRootView(this);
			        mReactInstanceManager = ReactInstanceManager.builder()
			                .setApplication(getApplication())
			                .setBundleAssetName("index.android.bundle")
			                .setJSMainModuleName("index.android")
			                .addPackage(new MainReactPackage())
			                .addPackage(new KeyEventPackage()) //-->增加组件的ReactPackage文件
			                .setUseDeveloperSupport(true)
			                .setInitialLifecycleState(LifecycleState.RESUMED)
			                .build();
			        mReactRootView.startReactApplication(mReactInstanceManager, "HelloWorld", null);
			        setContentView(mReactRootView);
			    }
			
			}


4. Activity中增加按键监听并传递给RN的方法

		import android.view.KeyEvent; // -->引入Android键盘事件包
		import com.jianghe.keyevent.KeyEventModule; // -->引入该组件模块包

	    @Override
	    public boolean onKeyDown(int keyCode, KeyEvent event) {
			//利用RN的DeviceEventEmitter对象将按键消息发送给js
	        KeyEventModule.getkeyEventModule().onKeyDownEvent(keyCode);
	        super.onKeyDown(keyCode, event);
	        return true;
	    }
	
	    @Override
	    public boolean onKeyUp(int keyCode, KeyEvent event) {
			//利用RN的DeviceEventEmitter对象将按键消息发送给js
	        KeyEventModule.getkeyEventModule().onKeyUpEvent(keyCode);
	        super.onKeyUp(keyCode, event);
	        return true;
	    }


### React-Native中使用

在任何你想要使用按键监听的地方引入该组件模块
	
	import KeyEvent from 'react-native-common-keyevent';

1. 在组件中申明3个事件响应方法

		keydown: function (keycode) {
	        console.log("按下" + keycode);
	    },
	    keyup: function (keycode) {
	        console.log("抬起" + keycode);
	    },
	    keypress: function (keycode) {
	        console.log("点击" + keycode);
	    },

1. 在componentDidMount生命周期方法中初始化KeyEvent对象

        this.ke = KeyEvent.initKeyEvent({
            state: true,//当前对象初始化时是否处于激活状态
            onKeyDown: this.keydown,//键盘按下的回调方法
            onKeyUp: this.keyup,//键盘抬起的回调方法
            onKeyPress: this.keypress,//键盘单击的回调方法
        })


## 注意

RN中的多个页面都会被渲染到一个Activity中，这样存在的问题就是RN中多个页面响应的其实都是1个Activity的键盘事件。
那么会出现以下问题：
	
1.现在有2个页面A.js , B.js  现在A中的回车事件是 `Alert.alert('A');` B中的上事件是 `Alert.alert('B');`

当前的焦点页在A上，回车打出的是A；现在通过`react-navigation`跳转到B页面，这时回车依然会弹出A，这不是我们预期的结果。所以在`KeyEvent`对象初始化的时候传入了一个`state`属性，这个属性就是用来控制当前`KeyEvent`对象是否生效的。
上面情况的解决方案：
	
A现在通过`react-navigation`跳转到B页面是使用`this.ke.updateState(false)`来将A页面的激活状态调整为`false`这样Android原生的按键事件就会分配到激活的组件对象上