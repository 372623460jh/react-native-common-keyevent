import {DeviceEventEmitter} from 'react-native';

/**
 * 键盘事件类
 *
 * 该类封装了键盘的3个主要是键
 * onkeyDown 键按下
 * onKeyUp 键抬起
 * onKeyPress 键单击
 * 每个KeyController组件中都有一个唯一的KeyEvent对象
 * updateState方法：用于更新当前组件是否处于激活状态
 * 处于激活状态的组件下的键盘事件才生效
 *
 * @param obj 构造方法入参初始化值
 * {
 *      state:boolean,//当前对象初始化时是否处于激活状态
 *      onKeyDown:[Object function],//键盘按下的回调方法
 *      onKeyUp:[Object function],//键盘抬起的回调方法
 *      onKeyPress:[Object function],//键盘单击的回调方法
 * }
 */
function KeyEvent(obj) {

    //该事件对象的唯一标识
    this._KeyBaseId = this._getId();
    //该实例化对象keydown事件
    this.onKeyDown = DeviceEventEmitter.addListener(this._KeyBaseId + 'KeyDown', obj.onKeyDown);
    //该实例化对象onKeyUp事件
    this.onKeyUp = DeviceEventEmitter.addListener(this._KeyBaseId + 'KeyUp', obj.onKeyUp);
    //该实例化对象onKeyPress事件
    this.onKeyPress = DeviceEventEmitter.addListener(this._KeyBaseId + 'KeyPress', obj.onKeyPress);
    //当前该组件的激活状态
    this.updateState(obj.state || false);
}
KeyEvent.prototype = {
    construct: KeyEvent,
    //获取不重复随机数ID的方法
    _getId: function () {
        return "jh" + Date.now().toString(36) + Math.random().toString(36).substr(3);
    },
    //修改当前激活状态的方法
    updateState: function (isActive) {
        this.state = isActive;
        //修改静态属性改变处于激活状态的KeyController组件ID
        this.state ? KeyEvent.nowActiveClass = this._KeyBaseId : KeyEvent.nowActiveClass = "";
    }
};

/**
 * 工厂模式实例化对象的构建方法
 */
KeyEvent.initKeyEvent = function (obj) {
    return new KeyEvent(obj);
};

/**
 * 当前处于激活状态的KeyController组件ID，""为没有当前没有处于激活状态的组件
 * 该静态属性用于标注当前处于激活状态的实例化组件的唯一ID
 * 组件只有在激活状态下才能响应键盘事件，当有键盘事件发生时将通过这一属性对键盘事件进行分发，
 * 分发到处于激活状态的实例组件对象上。
 * @type {string}
 */
KeyEvent.nowActiveClass = "";

/**
 * 按键栈用于记录按键被按下的时间，来触发press事件
 * @type {{}}
 */
KeyEvent.keyCodeStack = {};

/**
 * 用于移除对Android按键的监听
 */
KeyEvent.removeListenAndroid = function () {
    KeyEvent.keyDownEventAndroid ? KeyEvent.keyDownEventAndroid.remove() : null;
    KeyEvent.keyUpEventAndroid ? KeyEvent.keyUpEventAndroid.remove() : null;
};

//Android原生keyDown的消息监听。Android原生通过DeviceEventEmitter来传递消息
KeyEvent.keyDownEventAndroid = DeviceEventEmitter.addListener('KeyDown', function (keyCode) {
    if (KeyEvent.nowActiveClass) {
        //记录键按下时间
        KeyEvent.keyCodeStack[keyCode + ""] = new Date().getTime();
        //分发消息给具体的实例化对象
        DeviceEventEmitter.emit(KeyEvent.nowActiveClass + 'KeyDown', keyCode);
    }
});

//Android原生keyUp的消息监听。Android原生通过DeviceEventEmitter来传递消息
KeyEvent.keyUpEventAndroid = DeviceEventEmitter.addListener('KeyUp', function (keyCode) {
    if (KeyEvent.nowActiveClass) {
        //分发消息给具体的实例化对象
        DeviceEventEmitter.emit(KeyEvent.nowActiveClass + 'KeyUp', keyCode);
        //当按键按下抬起间隔<2000ms >30ms时触发press事件
        if (KeyEvent.keyCodeStack[keyCode + ""]) {
            let dTime = new Date().getTime() - KeyEvent.keyCodeStack[keyCode + ""];
            if (dTime > 30 && dTime < 2000) {
                //触发Press事件
                KeyEvent.keyPressEventAndroid(keyCode);
            }
        }
        //重置按键按下时间
        KeyEvent.keyCodeStack[keyCode + ""] = 0;
    }
});

//通过原生Android，Dowm，Up事件加工的keyPress的事件。
KeyEvent.keyPressEventAndroid = function (keyCode) {
    if (KeyEvent.nowActiveClass) {
        //分发消息给具体的实例化对象
        DeviceEventEmitter.emit(KeyEvent.nowActiveClass + 'KeyPress', keyCode);
    }
};

export default KeyEvent;