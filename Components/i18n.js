/**
 * @name I18n_国际化
 * @author TASA-Ed 工作室
 * @version 1.2.0
 * @desc 用法见压缩包中的 README.md
 * （如果你是从正确渠道获得的，则应包含有这个文件）
**/
const PLUGIN_CONFIG_PATH = $GlobalJS.toPath(Qt.resolvedUrl("PluginConfig.json"));
if($Frame.sl_fileExists(PLUGIN_CONFIG_PATH)) game.gf['i18nPluginConfig']=JSON.parse($Frame.sl_fileRead(PLUGIN_CONFIG_PATH));

// 定义常量，如果配置项缺失时回退到默认
const CONFIG_FOLDER = game.gf['i18nPluginConfig']['languageConfigFolder'] ?? "Config";
const CONFIG_FILE = game.gf['i18nPluginConfig']['languageConfigFile'] ?? "i18n.cfg";
const LANGUAGES_FOLDER = game.gf['i18nPluginConfig']['languagesFolder'] ?? "languages";
game.gf['i18nVersion'] = "1.2.0"
const LOG_HEAD = `[I18n_${game.gf['i18nVersion']}]`;

/**
 * @name 初始化
 * @author TASA-Ed 工作室
 * @param defaultLanguage {string="zh"} 默认语言（可选，默认为 zh）
 * @returns boolean
 * @desc 此函数在游戏生命周期内应当只执行一次
 */
function init(defaultLanguage="zh") {
    console.debug(LOG_HEAD,`系统语言: ${Qt.uiLanguage}`);
    console.debug(LOG_HEAD,`指定的默认语言：${defaultLanguage}`);
    // 定义配置文件名称
    game.gf['i18nConfigPath'] =
        $GlobalJS.toPath(Qt.resolvedUrl(CONFIG_FOLDER + GameMakerGlobal.separator + CONFIG_FILE));
    // 判断配置文件是否存在
    if($Frame.sl_fileExists(game.gf['i18nConfigPath'])){
        // 读取配置语言中的语言名称
        const languageName = $Frame.sl_fileRead(game.gf['i18nConfigPath']);
        game.gf['i18nStatus'] = loadLanguage(languageName,defaultLanguage);
        return game.gf['i18nStatus'];
    }
    else{
        // 写入系统语言
        const status = writeConfig(Qt.uiLanguage);
        if (status){
            game.gf['i18nStatus'] = loadLanguage(Qt.uiLanguage,defaultLanguage);
            return game.gf['i18nStatus'];
        } else {
            // 写入失败
            console.warn(LOG_HEAD,`未能写入 "${game.gf['i18nConfigPath']}" ，语言配置将无法保存`);
            game.gf['i18nStatus'] = loadLanguage(Qt.uiLanguage,defaultLanguage);
            return game.gf['i18nStatus'];
        }
    }
}

function loadLanguage(name,defaultLanguage) {
    try{
        // 定义语言文件路径
        game.gf['i18nFilePath'] =
            $GlobalJS.toPath(Qt.resolvedUrl(LANGUAGES_FOLDER + GameMakerGlobal.separator + name + '.json'));
        // 判断是否存在
        if ($Frame.sl_fileExists(game.gf['i18nFilePath'])) {
            // 读取语言信息
            game.gf['i18n'] = JSON.parse($Frame.sl_fileRead(game.gf['i18nFilePath']));
            console.debug(LOG_HEAD,`语言 "${name}" 已加载。`);
            console.debug(LOG_HEAD,`语言文件路径: "${game.gf['i18nFilePath']}"`);
            game.gf['i18nLanguage'] = name;
            return true;
        } else {
            // 回退到默认语言
            game.gf['i18nFilePath'] =
                $GlobalJS.toPath(Qt.resolvedUrl(LANGUAGES_FOLDER + GameMakerGlobal.separator + defaultLanguage + '.json'));
            console.warn(LOG_HEAD,`"${name}" 语言缺失，回退到 "${defaultLanguage}"。`);
            // 默认语言可能不存在
            if (!$Frame.sl_fileExists(game.gf['i18nFilePath'])){
                console.error(LOG_HEAD,`默认语言 "${defaultLanguage}" 不存在。无法加载任何语言。`);
                return false;
            }
            // 写入默认语言
            const status = writeConfig(defaultLanguage);
            if (!status) console.warn(LOG_HEAD,`未能写入 "${game.gf['i18nConfigPath']}" ，语言配置将无法保存`);
            // 读取语言信息
            game.gf['i18n'] = JSON.parse($Frame.sl_fileRead(game.gf['i18nFilePath']));
            console.debug(LOG_HEAD,`语言 "${defaultLanguage}" 已加载。`);
            console.debug(LOG_HEAD,`语言文件路径: "${game.gf['i18nFilePath']}"`);
            game.gf['i18nLanguage'] = defaultLanguage;
            return true;
        }
    } catch (error){
        if (error.message.includes("JSON.parse:")) {
            console.error(LOG_HEAD,"加载语言文件时出错:","JSON 格式无效",error.message);
        }
        else {
            console.error(LOG_HEAD,"加载语言文件时出错:",error.message);
        }
        return false;
    }
}

function writeConfig(data) {
    // 写入配置信息
    try{
        $Frame.sl_fileWrite(data,game.gf['i18nConfigPath']);
        return true;
    } catch (error){
        console.error(LOG_HEAD,"写入配置文件时出错:",error.message);
        return false;
    }
}

/**
 * @name 更改语言
 * @param languageName {string}
 * @author TASA-Ed 工作室
 * @returns {boolean}
 * @desc 请在更改语言后要求用户重启应用，因为 game.gf['i18n'] 应保持不变，且大部分文本都不支持热重载
 */
function changeLanguage(languageName) {
    // 定义该语言的语言文件
    const path =
        $GlobalJS.toPath(Qt.resolvedUrl(LANGUAGES_FOLDER + GameMakerGlobal.separator + languageName + '.json'));
    if ($Frame.sl_fileExists(path)) {
        const status = writeConfig(languageName);
        if (!status){
            console.warn(LOG_HEAD,`未能写入 "${game.gf['i18nConfigPath']}" ，语言配置将无法保存`);
            return false;
        }
        game.gf['i18nLanguage'] = languageName;
        return true;
    } else {
        console.warn(LOG_HEAD,`"${languageName}" 语言缺失，无法保存。`);
        return false;
    }
}

/**
 * @name 语言信息
 * @param name {int}
 * 0:语言名称; 1:语言作者;
 * @author TASA-Ed 工作室
 * @returns {string}
 */
function info(name) {
    if (!game.gf['i18nStatus']) return `[${name}]`;
    let data;
    switch(name){
        case 0:
            data=game.gf['i18n']["name"];
            break;
        case 1:
            data=game.gf['i18n']["author"];
            break;
        default:
            data=`[${name}]`;
            console.warn(LOG_HEAD,`"${name}" 不是一个正确的语言信息。`);
    }
    return data;
}

/**
 * @name common_通用类
 * @param name {string} 翻译键名称
 * @param args {string} 占位符（可选）
 * @returns {string}
 */
function c(name,...args) {
    if (!game.gf['i18nStatus'] ||
        !game.gf['i18n']["c"][name] ||
        typeof game.gf['i18n']["c"][name] !== 'string')
    {
        console.warn(LOG_HEAD,`"c.${name}" 不是一个翻译键。`);
        return `[c.${name}]`;
    }
    return game.gf['i18n']["c"][name].replace(/%s/g, () => args.length ? args.shift() : '%s');
}

/**
 * @name file_文件类
 * @param ui {string} 文件名称
 * @param name {string} 翻译键名称
 * @param args {string} 占位符（可选）
 * @returns {string}
 */
function f(ui,name,...args) {
    if (!game.gf['i18nStatus'] ||
        !game.gf['i18n']["f"][ui][name] ||
        typeof game.gf['i18n']["f"][ui][name] !== 'string')
    {
        console.warn(LOG_HEAD,`"f.${ui}.${name}" 不是一个翻译键。`);
        return `[f.${ui}.${name}]`;
    }
    return game.gf['i18n']["f"][ui][name].replace(/%s/g, () => args.length ? args.shift() : '%s');
}
