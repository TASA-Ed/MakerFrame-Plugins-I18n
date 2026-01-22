//.pragma library

// 导入 I18n.js
.import 'i18n.js' as I18n;

// 是否游戏启动时自动加载（为false不自动加载，其他值都是自动加载，不自动加载的组件，调用 game.plugin 后才会加载，且没有加载的组件不会运行 $timerTriggered 函数
// 系统中还用它来识别是否已加载；
var $autoLoad = true;
// 描述
const $description = 'I18n_国际化';

// 载入 函数（游戏第一次运行时会执行，所以在这里创建组件）
function $load(path) {
    console.debug('[Plugin] Load I18n 插件', I18n.VERSION, path);
    if (!$Frame.sl_globalObject().Logger) {
        console.error('[Plugin] [I18n 插件] 前置 {0A-Utils} 未加载。');
        return -1;
    }

    $Frame.sl_globalObject().I18n = I18n;
    I18n.init( );
    if (!game.gf['i18nPluginArguments']['Status']) console.error("[I18n]","语言加载失败");

    return null;
}

//卸载 函数（退出游戏时会执行，用来删除组件）
function $unload() {
    console.debug('[Plugins] Unload I18n 插件');

    delete game.gf['i18nPluginArguments'];
    delete $Frame.sl_globalObject().I18n;

    return null;
}
