//.pragma library

//导入配置文件
.import 'i18n.js' as I18n

//导入qml组件空间（组件为：QtQml.Xxx，比如QtQml.Component）
    .import QtQml 2.14 as QtQml



/*
  组件父对象：
    game.$sys.screen(rootGameScene)：屏幕，创建的组件位置和大小固定（包含所有系统组件，包括战斗场景、摇杆、消息框、对话框等）
    game.$sys.viewport(itemViewPort)：视窗，创建的组件位置和大小固定
    game.$sys.scene(gameScene)：场景，组件位置和大小固定，但会被scale影响
    game.$sys.map(itemContainer)：地图，创建的组件会改变大小和随地图移动
    game.$sys.ground(itemRoleContainer)：地图地板，创建的组件会改变大小和随地图移动
*/



//自定义 全局定义变量和函数
//  所有可以写脚本的地方都可以访问到，访问格式：
//  yield game.plugin('作者名', '模块名') 或 game.$resources.plugins['作者名']['模块名']

//是否游戏启动时自动加载（为false不自动加载，其他值都是自动加载，不自动加载的组件，调用 game.plugin 后才会加载，且没有加载的组件不会运行 $timerTriggered 函数
//系统中还用它来识别是否已加载；
var $autoLoad = true;
//描述
const $description = 'I18n_国际化';


//let arrObjs = [];
//let obj = null; //保存插件的组件对象


/*/可以做一些函数给外部调用
function func1(color) {
    obj.color = color;  //修改Comp.qml组件的 color 颜色
    //也可以：  obj.changeColor(color);
}
*/



//载入 函数（游戏第一次运行时会执行，所以在这里创建组件）
function $load(path) {
    //console.debug('[Plugins]load：', game.$resources.plugins['作者名']['模块名'].$description, this, this === game.$resources.plugins['作者名']['模块名']);
    console.debug('[Plugin]Component(I18n)插件', path/*, Config.配置*/, );


    /*/载入组件
    const comp = Qt.createComponent("Comp.qml");

    //组件状态改变
    function statusChanged() {
        if (comp.status === QtQml.Component.Ready) {
            //创建组件对象
            obj = comp.createObject(game.$sys.viewport, {});
            //arrObjs.push(obj);
        }
        else if (comp.status === QtQml.Component.Error) {
            throw new Error(comp.errorString());
        }
    }

    if(comp.status === QtQml.Component.Loading)
        comp.statusChanged.connect(statusChanged);
    else
        statusChanged();
    */


    $Frame.sl_globalObject().I18n = I18n;


    return null;
}

/*/初始化 函数（游戏运行 或 读取存档 会运行，用来初始化）
function $init() {
    console.debug('[Plugins]init');

    //if(obj)
    //    obj.visible = true;

    //for(let to of arrObjs)
    //    to.visible = true;

    return null;
}
*/

/*/释放 函数（读取存档 或 退出游戏时会执行，用来清理工作）
function $release() {
    console.debug('[Plugins]release');

    //if(obj)
    //    obj.visible = false;

    //for(let to of arrObjs)
    //    to.visible = false;

    return null;
}
*/

//卸载 函数（退出游戏时会执行，用来删除组件）
function $unload() {
    console.debug('[Plugins]unload');

    //删除组件
    //if(obj)
    //    obj.destroy();
    //obj = null;

    //for(let to of arrObjs)
    //    to.destroy();

    //arrObjs = [];

    delete $Frame.sl_globalObject().I18n;

    return null;
}

/*/定时器刷新 函数（刷新组件状态）
function $timerTriggered(interval) {
    if(game.gd['$sys_money'])
        obj.text = game.gd['$sys_money'] + Config.moneyName;
    else
        obj.text = '你没钱';

    return null;
}
*/
