/**
 * @name I18n_国际化
 * @author TASA-Ed 工作室
 * @version 1.5.0
 * @desc 用法见压缩包中的 README.md
 * （如果你是从正确渠道获得的，则应包含有这个文件）
**/
game.gf['i18nPluginArguments'] = {
    "Version":"1.5.0"
};
const VERSION = "1.5.0";

// 插件配置项
const I18N_PLUGIN_CONFIG_PATH = $GlobalJS.toPath(Qt.resolvedUrl("PluginConfig.json"));
const I18N_PLUGIN_CONFIG = ($Frame.sl_fileExists(I18N_PLUGIN_CONFIG_PATH)) ? JSON.parse($Frame.sl_fileRead(I18N_PLUGIN_CONFIG_PATH)) : {};

// 定义常量，如果配置项缺失时回退到默认
const __CONFIG_FOLDER = I18N_PLUGIN_CONFIG['languageConfigFolder'] ?? "Config";
const __CONFIG_FILE = I18N_PLUGIN_CONFIG['languageConfigFile'] ?? "i18n.cfg";
const __LANGUAGES_FOLDER = I18N_PLUGIN_CONFIG['languagesFolder'] ?? "languages";
const __CONFIG_MIN_LEVEL_TYPE = I18N_PLUGIN_CONFIG['minLevel'] ?? 0;
const __LOG_HEAD = `I18n_${VERSION}`;
const DEFAULT_LANGUAGE = I18N_PLUGIN_CONFIG['defaultLanguage'] ?? "zh";
const CONFIG_PATH = __getPath(__CONFIG_FOLDER, __CONFIG_FILE);
// const __KEY_LOCALIZE = "Localize";

const logs = Logger.createLogger(__LOG_HEAD, __CONFIG_MIN_LEVEL_TYPE)

// 定义语言文件类/键名称，如果配置项缺失时回退到默认
let KEY_COMMON = I18N_PLUGIN_CONFIG['keyCommon'] ?? "c";
let KEY_FILE = I18N_PLUGIN_CONFIG['keyFile'] ?? "f";
let KEY_NAME = I18N_PLUGIN_CONFIG['keyName'] ?? "name";
let KEY_AUTHOR = I18N_PLUGIN_CONFIG['keyAuthor'] ?? "author";

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
 * @returns boolean
 * @desc 此函数在游戏生命周期内应当只执行一次
 */
function init( ) {
    logs.debug("系统语言: ", Qt.uiLanguage);
    logs.debug(`指定的默认语言：${DEFAULT_LANGUAGE}`);
    // 定义默认语言
    game.gf['i18nPluginArguments']['DefaultLanguageName'] = DEFAULT_LANGUAGE;
    // 判断配置文件是否存在
    if($Frame.sl_fileExists(CONFIG_PATH)){
        // 读取配置语言中的语言名称
        const languageName = $Frame.sl_fileRead(CONFIG_PATH);
        game.gf['i18nPluginArguments']['Status'] = __loadLanguage(languageName,DEFAULT_LANGUAGE);
        return game.gf['i18nPluginArguments']['Status'];
    }
    else{
        // 写入系统语言
        const status = __writeConfig(Qt.uiLanguage);
        if (status){
            game.gf['i18nPluginArguments']['Status'] = __loadLanguage(Qt.uiLanguage,DEFAULT_LANGUAGE);
            return game.gf['i18nPluginArguments']['Status'];
        } else {
            // 写入失败
            logs.warn(`未能写入 "${CONFIG_PATH}" ，语言配置将无法保存`);
            game.gf['i18nPluginArguments']['Status'] = __loadLanguage(Qt.uiLanguage,DEFAULT_LANGUAGE);
            return game.gf['i18nPluginArguments']['Status'];
        }
    }
}

/**
 * @returns {boolean}
 * */
function __loadLanguage(name,defaultLanguage) {
    try{
        // 定义语言文件路径
        game.gf['i18nPluginArguments']['FilePath'] = __getPath(__LANGUAGES_FOLDER,name + '.json');
        // 判断是否存在
        if ($Frame.sl_fileExists(game.gf['i18nPluginArguments']['FilePath'])) {
            // 读取语言信息
            game.gf['i18n'] = __languageFileParseJSON(game.gf['i18nPluginArguments']['FilePath']);
            if(!game.gf['i18n']) return false ;
            logs.debug(`语言 "${name}" 已加载。`);
            logs.debug(`语言文件路径: "${game.gf['i18nPluginArguments']['FilePath']}"`);
            game.gf['i18nPluginArguments']['Language'] = name;
            return true;
        } else {
            // 回退到默认语言
            game.gf['i18nPluginArguments']['FilePath'] = __getPath(__LANGUAGES_FOLDER,defaultLanguage + '.json');
            logs.warn(`"${name}" 语言缺失，回退到 "${defaultLanguage}"。`);
            // 默认语言可能不存在
            if (!$Frame.sl_fileExists(game.gf['i18nPluginArguments']['FilePath'])){
                logs.error(`默认语言 "${defaultLanguage}" 不存在。无法加载任何语言。`);
                return false;
            }
            // 写入默认语言
            const status = __writeConfig(defaultLanguage);
            if (!status) logs.warn(`未能写入 "${CONFIG_PATH}" ，语言配置将无法保存`);
            // 读取语言信息
            game.gf['i18n'] = __languageFileParseJSON(game.gf['i18nPluginArguments']['FilePath']);
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
function __writeConfig(data) {
    // 写入配置信息
    try{
        $Frame.sl_fileWrite(data,CONFIG_PATH);
        return true;
    } catch (error){
        logs.error("writeConfig:","写入配置文件时出错:",error.message);
        return false;
    }
}

/**
 * @returns {string}
 * */
function __getPath(folder, file) {
    // 拼接路径
    return $GlobalJS.toPath(Qt.resolvedUrl(folder+GameMakerGlobal.separator+file));
}

/**
 * @returns {Object,boolean}
 * */
function __languageFileParseJSON(path){
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
    const path = __getPath(__LANGUAGES_FOLDER,languageName + '.json');
    if ($Frame.sl_fileExists(path)) {
        const status = __writeConfig(languageName);
        if (!status){
            logs.warn("changeLanguage:",`未能写入 "${CONFIG_PATH}" ，语言配置将无法保存`);
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
        logs.warn("tr:", "keyName 必须传入一个 string");
        return false;
    }
    if (!game.gf['i18nPluginArguments']['Status']){
        logs.warn("tr:", "不可在初始化失败时使用");
        return `[${keyName}]`;
    }
    const keys = keyName.split('.');
    // 默认返回
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
            data=game.gf['i18n'][KEY_FILE][keys[1]][keys[2]];
            break;
        case KEY_COMMON:
            if (!game.gf['i18n'][KEY_COMMON][keys[1]] ||
                typeof game.gf['i18n'][KEY_COMMON][keys[1]] !== 'string')
            {
                logs.warn("tr:",`"${keyName}" 不是一个通用翻译键。`);
                break;
            }
            data=game.gf['i18n'][KEY_COMMON][keys[1]];
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
    // 替换占位符
    let idx = 0;
    return data.replace(/%s/g, () => (idx < args.length ? args[idx++] : "%s"));
}

/**
 * @name 语言列表
 * @param format {number} = 0 输出格式（可选，默认为 0）
 * 0 或 其他：Object；1：String 以 \n 分割。；
 * @author TASA-Ed 工作室
 * @returns {Object,String}
 */
function getLanguagesList(format = 0){
    // 获取文件列表 或 为空
    const list = $Frame.sl_dirList(__getPath(__LANGUAGES_FOLDER,"")) || [];
    // 只保留json文件
    const jsons = list
        .filter(name => typeof name === "string" && name.endsWith(".json"))
        .map(name => name.replace(/\.json$/,""));
    // 按照格式返回
    return format === 1 ? jsons.join("\n") : jsons;
}
