/**
 * @name I18n_国际化
 * @author TASA-Ed 工作室
 * @version 1.3.0
 * @desc 用法见压缩包中的 README.md
 * （如果你是从正确渠道获得的，则应包含有这个文件）
**/
game.gf['i18nPluginArguments'] = {
    "Version":"1.3.0"
};

// 插件配置项
const PLUGIN_CONFIG_PATH = $GlobalJS.toPath(Qt.resolvedUrl("PluginConfig.json"));
if($Frame.sl_fileExists(PLUGIN_CONFIG_PATH)) game.gf['i18nPluginConfig']=JSON.parse($Frame.sl_fileRead(PLUGIN_CONFIG_PATH));

// 定义常量，如果配置项缺失时回退到默认
const CONFIG_FOLDER = game.gf['i18nPluginConfig']['languageConfigFolder'] ?? "Config";
const CONFIG_FILE = game.gf['i18nPluginConfig']['languageConfigFile'] ?? "i18n.cfg";
const LANGUAGES_FOLDER = game.gf['i18nPluginConfig']['languagesFolder'] ?? "languages";
const CONFIG_DEBUG_LOG_TYPE = game.gf['i18nPluginConfig']['debugLogType'] ?? 0;
const LOG_HEAD = `[I18n_${game.gf['i18nPluginArguments']['Version']}]`;

// 统一处理日志
const logs = {
    "debug": (...args) => {
        switch (CONFIG_DEBUG_LOG_TYPE){
            case 1:
                console.info(LOG_HEAD,...args);
                break;
            case 2:
                break;
            default:
                console.debug(LOG_HEAD,...args);
        }
    },
    "warn": (...args) => {
        console.warn(LOG_HEAD,...args);
    },
    "error": (...args) => {
        console.error(LOG_HEAD,...args);
    }
}

// 定义语言文件类/键名称，如果配置项缺失时回退到默认
let KEY_COMMON = game.gf['i18nPluginConfig']['keyCommon'] ?? "c";
let KEY_FILE = game.gf['i18nPluginConfig']['keyFile'] ?? "f";
let KEY_NAME = game.gf['i18nPluginConfig']['keyName'] ?? "name";
let KEY_AUTHOR = game.gf['i18nPluginConfig']['keyAuthor'] ?? "author";

if (KEY_COMMON===KEY_FILE ||
    KEY_COMMON===KEY_NAME ||
    KEY_COMMON===KEY_AUTHOR ||
    KEY_FILE===KEY_NAME ||
    KEY_FILE===KEY_AUTHOR ||
    KEY_NAME===KEY_AUTHOR) {
    // 如果存在任意一对相等的则回退到默认
    logs.warn("语言文件类/键名称配置项错误，回退到默认");
    KEY_COMMON = "c";
    KEY_FILE = "f";
    KEY_NAME = "name";
    KEY_AUTHOR = "author";
}

/**
 * @name 初始化
 * @author TASA-Ed 工作室
 * @param defaultLanguage {string="zh"} 默认语言（可选，默认为 zh）
 * @returns boolean
 * @desc 此函数在游戏生命周期内应当只执行一次
 */
function init(defaultLanguage="zh") {
    logs.debug(`系统语言: ${Qt.uiLanguage}`);
    logs.debug(`指定的默认语言：${defaultLanguage}`);
    // 定义默认语言
    game.gf['i18nPluginArguments']['DefaultLanguageName'] = defaultLanguage;
    // 定义配置文件名称
    game.gf['i18nPluginArguments']['ConfigPath'] = getPath(CONFIG_FOLDER,CONFIG_FILE);
    // 判断配置文件是否存在
    if($Frame.sl_fileExists(game.gf['i18nPluginArguments']['ConfigPath'])){
        // 读取配置语言中的语言名称
        const languageName = $Frame.sl_fileRead(game.gf['i18nPluginArguments']['ConfigPath']);
        game.gf['i18nPluginArguments']['Status'] = loadLanguage(languageName,defaultLanguage);
        return game.gf['i18nPluginArguments']['Status'];
    }
    else{
        // 写入系统语言
        const status = writeConfig(Qt.uiLanguage);
        if (status){
            game.gf['i18nPluginArguments']['Status'] = loadLanguage(Qt.uiLanguage,defaultLanguage);
            return game.gf['i18nPluginArguments']['Status'];
        } else {
            // 写入失败
            logs.warn(`未能写入 "${game.gf['i18nPluginArguments']['ConfigPath']}" ，语言配置将无法保存`);
            game.gf['i18nPluginArguments']['Status'] = loadLanguage(Qt.uiLanguage,defaultLanguage);
            return game.gf['i18nPluginArguments']['Status'];
        }
    }
}

/**
 * @returns {boolean}
 * */
function loadLanguage(name,defaultLanguage) {
    try{
        // 定义语言文件路径
        game.gf['i18nPluginArguments']['FilePath'] = getPath(LANGUAGES_FOLDER,name + '.json');
        // 判断是否存在
        if ($Frame.sl_fileExists(game.gf['i18nPluginArguments']['FilePath'])) {
            // 读取语言信息
            game.gf['i18n'] = languageFileParseJSON(game.gf['i18nPluginArguments']['FilePath']);
            if(!game.gf['i18n']) return false ;
            logs.debug(`语言 "${name}" 已加载。`);
            logs.debug(`语言文件路径: "${game.gf['i18nPluginArguments']['FilePath']}"`);
            game.gf['i18nPluginArguments']['Language'] = name;
            return true;
        } else {
            // 回退到默认语言
            game.gf['i18nPluginArguments']['FilePath'] = getPath(LANGUAGES_FOLDER,defaultLanguage + '.json');
            logs.warn(`"${name}" 语言缺失，回退到 "${defaultLanguage}"。`);
            // 默认语言可能不存在
            if (!$Frame.sl_fileExists(game.gf['i18nPluginArguments']['FilePath'])){
                logs.error(`默认语言 "${defaultLanguage}" 不存在。无法加载任何语言。`);
                return false;
            }
            // 写入默认语言
            const status = writeConfig(defaultLanguage);
            if (!status) logs.warn(`未能写入 "${game.gf['i18nPluginArguments']['ConfigPath']}" ，语言配置将无法保存`);
            // 读取语言信息
            game.gf['i18n'] = languageFileParseJSON(game.gf['i18nPluginArguments']['FilePath']);
            if(!game.gf['i18n']) return false ;
            logs.debug(`语言 "${defaultLanguage}" 已加载。`);
            logs.debug(`语言文件路径: "${game.gf['i18nPluginArguments']['FilePath']}"`);
            game.gf['i18nPluginArguments']['Language'] = defaultLanguage;
            return true;
        }
    } catch (error){
        logs.error("加载语言文件时出错:", error.message);
        return false;
    }
}

/**
 * @returns {boolean}
 * */
function writeConfig(data) {
    // 写入配置信息
    try{
        $Frame.sl_fileWrite(data,game.gf['i18nPluginArguments']['ConfigPath']);
        return true;
    } catch (error){
        logs.error("writeConfig:","写入配置文件时出错:",error.message);
        return false;
    }
}

/**
 * @returns {string}
 * */
function getPath(folder, file) {
    // 拼接路径
    return $GlobalJS.toPath(Qt.resolvedUrl(folder+GameMakerGlobal.separator+file));
}

/**
 * @returns {Object,boolean}
 * */
function languageFileParseJSON(path){
    try {
        const content = JSON.parse($Frame.sl_fileRead(path));
        if (!content[KEY_FILE] ||
            !content[KEY_COMMON])
        {
            throw new Error("ClassError");
        }
        return content;
    } catch (error) {
        if (error instanceof SyntaxError) {
            logs.error("加载语言 JSON 时出错: JSON 格式无效", error.message);
        }else if (error.message==="ClassError") {
            logs.error("加载语言 JSON 时出错: 文件无效", `缺少 ${KEY_COMMON} 或 ${KEY_FILE} 类`);
        } else {
            logs.error("加载语言 JSON 时出错:", error.message);
        }
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
    const path = getPath(LANGUAGES_FOLDER,languageName + '.json');
    if ($Frame.sl_fileExists(path)) {
        const status = writeConfig(languageName);
        if (!status){
            logs.warn("changeLanguage:",`未能写入 "${game.gf['i18nPluginArguments']['ConfigPath']}" ，语言配置将无法保存`);
            return false;
        }
        game.gf['i18nPluginArguments']['Language'] = languageName;
        return true;
    } else {
        logs.warn("changeLanguage:",`"${languageName}" 语言缺失，无法保存。`);
        return false;
    }
}

/**
 * @name 语言信息
 * @param keyName {string}
 * @param args {string} 占位符（可选）
 * @author TASA-Ed 工作室
 * @returns {string,boolean}
 */
function tr(keyName,...args) {
    // 类型判断
    if (typeof keyName !== "string"){
        logs.warn("tr:",`keyName 必须传入一个 string`);
        return false;
    }
    if (!game.gf['i18nPluginArguments']['Status']){
        logs.warn("tr:",`不可在初始化失败时使用`);
        return `[${keyName}]`;
    }
    const keys = keyName.split('.');
    let data = `[${keyName}]`;
    switch(keys[0]){
        case KEY_FILE:
            if (!game.gf['i18n'][KEY_FILE][keys[1]] ||
                !game.gf['i18n'][KEY_FILE][keys[1]][keys[2]] ||
                typeof game.gf['i18n'][KEY_FILE][keys[1]][keys[2]] !== 'string')
            {
                logs.warn("tr:",`"${keyName}" 不是一个文件翻译键。`);
                break;
            }
            data=game.gf['i18n'][KEY_FILE][keys[1]][keys[2]].replace(/%s/g, () => args.length ? args.shift() : '%s');
            break;
        case KEY_COMMON:
            if (!game.gf['i18n'][KEY_COMMON][keys[1]] ||
                typeof game.gf['i18n'][KEY_COMMON][keys[1]] !== 'string')
            {
                logs.warn("tr:",`"${keyName}" 不是一个通用翻译键。`);
                break;
            }
            data=game.gf['i18n'][KEY_COMMON][keys[1]].replace(/%s/g, () => args.length ? args.shift() : '%s');
            break;
        case KEY_NAME:
            if (!game.gf['i18n'][KEY_NAME] ||
                typeof game.gf['i18n'][KEY_NAME] !== 'string')
            {
                logs.warn("tr:",`"${KEY_NAME}" 名称信息不存在或不正确。`);
                break;
            }
            data=game.gf['i18n'][KEY_NAME];
            break;
        case KEY_AUTHOR:
            if (!game.gf['i18n'][KEY_AUTHOR] ||
                typeof game.gf['i18n'][KEY_AUTHOR] !== 'string')
            {
                logs.warn("tr:",`"${KEY_AUTHOR}" 作者信息不存在或不正确。`);
                break;
            }
            data=game.gf['i18n'][KEY_AUTHOR];
            break;
        default:
            logs.warn("tr:",`"${keys[0]}" 类/键 不存在。`);
    }
    return data;
}

/**
 * @name 语言信息
 * @param name {int}
 * 0:语言名称; 1:语言作者;
 * @author TASA-Ed 工作室
 * @deprecated 自版本 1.3.0 起弃用，使用 `I18n.tr([KEY_NAME || KEY_AUTHOR], ...args)` 替代。
 * @returns {string}
 */
function info(name) {
    switch(name){
        case 0:
            return tr(KEY_NAME);
        case 1:
            return tr(KEY_AUTHOR);
        default:
            return undefined;
    }

}

/**
 * @name common_通用类
 * @param name {string} 翻译键名称
 * @param args {string} 占位符（可选）
 * @author TASA-Ed 工作室
 * @deprecated 自版本 1.3.0 起弃用，使用 `I18n.tr([KEY_COMMON, name], ...args)` 替代。
 * @returns {string}
 */
function c(name,...args) {
    return tr(`${KEY_COMMON}.${name}`, ...args);
}

/**
 * @name file_文件类
 * @param ui {string} 文件名称
 * @param name {string} 翻译键名称
 * @param args {string} 占位符（可选）
 * @author TASA-Ed 工作室
 * @deprecated 自版本 1.3.0 起弃用，使用 `I18n.tr([KEY_FILE, ui, name], ...args)` 替代。
 * @returns {string}
 */
function f(ui,name,...args) {
    return tr(`${KEY_FILE}.${ui}.${name}`, ...args);
}
