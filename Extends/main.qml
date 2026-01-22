import QtQuick 2.14
import QtQuick.Window 2.14
import QtQuick.Controls 2.14
import QtQuick.Dialogs 1.3 as Dialog1
import QtQuick.Layouts 1.14

import _Global 1.0

Item {
    id: root

    signal sg_close();

    anchors.fill: parent

    focus: true
    clip: true

    Mask {
        anchors.fill: parent
        color: Global.style.backgroundColor
    }


    StackView {
        id: stackView
        anchors.fill: parent

        initialItem: compMainView
    }

    Component {
        id: compMainView

        Item {
            ColumnLayout {
                anchors.centerIn: parent
                width: parent.width * 0.9
                height: parent.height * 0.9

                Notepad {
                    id: textHelp

                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    Layout.maximumHeight: parent.height

                    nMaximumBlockCount: 0

                    textArea.placeholderText: ''

                    textArea.background: Rectangle {
                        color: Global.style.backgroundColor
                        border.color: parent.parent.textArea.activeFocus ? Global.style.accent : Global.style.hintTextColor
                        border.width: parent.parent.textArea.activeFocus ? 2 : 1
                    }

                    textArea.text: $CommonLibJS.convertToHTML(
`<b>I18n 国际化</b>

作者: TASA-Ed 工作室

<b>用法</b>

目前已在插件加载时自动初始化。

可使用:

<code>I18n.tr("name"); // 读取语言名称，返回 String
I18n.tr("author"); // 读取语言作者，返回 String
I18n.tr("c.翻译键名称"); // 读取通用翻译键，返回 String
I18n.tr("f.文件名称.翻译键名称"); // 读取文件翻译键，返回 String</code>

这些函数均返回 <code>String</code> （文本）格式。

<b>更改语言</b>

可使用 <code>I18n.changeLanguage</code> 更改语言，并且下一次启动时也同样生效：

<code>I18n.changeLanguage(languageName = "更改的语言名称"); // 此语言的语言文件必须存在，返回 boolean</code>

更改成功则返回 <code>true</code> 否则返回 <code>false</code> 。

请在更改成功后要求用户重启应用，因为 <code>game.gf['i18n']</code> 应保持不变，且大部分文本都不支持热重载。

<b>语言列表</b>

可使用 <code>I18n.getLanguagesList</code> 读取语言列表：

<code>I18n.getLanguagesList(format = 0); // format 为 0 或其他时返回 Object，为 1 时返回 String 以 \n 分割。</code>

<b>占位符</b>

在翻译文件中可添加 <code>%s</code> 作占位符，并向 <code>I18n</code> 函数传参即可将占位符替换为参数，存在多个占位符时为左到右依次替换，例：

<code>// 翻译键：第 %s 天，第 %s 天接着降临
yield game.msg(I18n.tr("c.v", 1, 2)); // 输出：第 1 天，第 2 天接着降临</code>

<b>翻译文件</b>

翻译文件名称以 <a href="https://quickref.cn/docs/iso-639-1.html">ISO 639-1</a> 标准为准，例如中文为 <code>zh</code> 英文为 <code>en</code> 。

翻译文件需要添加到项目根目录的 <code>Plugins/TASA-Ed/I18n/Components/languages</code> 文件夹（此项可配置）中，格式为 <code>json</code> ，例如 <code>Plugins/TASA-Ed/I18n/Components/languages/zh.json</code> ，文件内容：

<code>{
  "name": "简体中文",
  "author": "TASA-Ed 工作室",
  "c": {
    "helloWorld": "你好，世界！111",
    "v": "第 %s 天，第 %s 天接着降临"
  },
  "f": {
    "main": {
      "title": "你好，世界",
      "text": "鹰歌"
    },
    "update": {
      "title": "更新",
      "text": "编辑器"
    }
  }
}</code>

- <code>name</code> （此项可配置）为语言的名称。
- <code>author</code> （此项可配置）为语言的作者。
- <code>c</code> （此项可配置）为通用类翻译键。*
  - <code>helloWorld</code> 为一个翻译键。
  - ...
- <code>f</code> （此项可配置）为文件类翻译键。*
  - <code>main</code> 为 <code>main</code> 文件。需要注意的是翻译键与文件并不一定要一一对应，您也可以不这么做，尽管说这样可能会对后期的维护带来很多麻烦。
    - <code>title</code> 为一个翻译键。
    - ...
  - ...

* 为必需包含。

所有翻译文件都需要遵守 JSON 的语法，否则无法正确读取。

<b>此插件定义的全局变量</b>

- <code>game.gf['i18n']</code> : 语言文件的 JSON <code>Object</code> 。
- <code>game.gf['i18nPluginArguments']</code> : 此插件的参数 JSON <code>Object</code> 。
  - <code>game.gf['i18nPluginArguments']['FilePath']</code> : 语言文件路径 <code>String</code>。
  - <code>game.gf['i18nPluginArguments']['Language']</code> : 语言名称 <code>String</code>。
  - <code>game.gf['i18nPluginArguments']['Status']</code> : 语言是否成功读取，<code>true</code> 为成功，<code>false</code> 为失败 <code>boolean</code>。
- <code>I18n.CONFIG_PATH</code> : 语言配置文件路径 <code>String</code>。
- <code>I18n.VERSION</code> : 此插件的版本 <code>String</code> 。
- <code>I18n.DEFAULT_LANGUAGE</code> : 默认语言名称 <code>String</code>。
- <code>I18n.I18N_PLUGIN_CONFIG</code> : 此插件配置文件的 JSON <code>Object</code> 。
- <code>I18n.PLUGIN_CONFIG_PATH</code> : 此插件配置文件的路径 <code>String</code> 。

<b>此插件的可配置项</b>

此插件支持配置自定义路径，文件名，日志输出类型和语言文件类/键名称，配置文件 <code>项目根目录/Plugins/TASA-Ed/I18n/Components/PluginConfig.json</code> 已经包含在插件中，只需按需修改即可。

路径配置均为相对路径，当前目录为 <code>i18n.js</code> 所在的目录 <code>项目根目录/Plugins/TASA-Ed/I18n/Components</code>。

支持配置 <code>debug</code> 日志的输出类型，<code>0</code> 或其他为默认，<code>1</code> 为日志以 <code>info</code> 形式输出，<code>2</code> 为日志静默。

支持配置语言文件类/键名称，例如 <code>keyCommon</code> 可以更改通用类的名称，将其配置为 <code>common</code> 时，语言文件和调用 <code>I18n.tr</code> 时的通用类名称都要改为 <code>common</code> ，任意一对名称都不可重复，否则会全部回退。

默认配置文件示例：

<code>{
  "languageConfigFolder": "Config",
  "languageConfigFile": "i18n.cfg",
  "languagesFolder": "languages",
  "debugLogType": 0,
  "keyCommon": "c",
  "keyFile": "f",
  "keyName": "name",
  "keyAuthor": "author",
  "defaultLanguage": "zh"
}</code>

- <code>languageConfigFolder</code> : 语言配置文件的路径。默认 <code>Config</code>。
- <code>languageConfigFile</code> : 语言配置文件的名称。默认 <code>i18n.cfg</code>。
- <code>languagesFolder</code> : 语言文件的路径。默认 <code>languages</code>。
- <code>debugLogType</code> : <code>debug</code> 日志输出类型。默认 <code>0</code>。
- <code>keyCommon</code> : 通用类的名称。默认 <code>c</code>。
- <code>keyFile</code> : 文件类的名称。默认 <code>f</code>。
- <code>keyName</code> : 语言名称键的名称。默认 <code>name</code>。
- <code>keyAuthor</code> : 语言作者键的名称。默认 <code>author</code>。
- <code>defaultLanguage</code> : 默认语言。默认 <code>zh</code>。`, )
                }

                RowLayout {
                    Layout.alignment: Qt.AlignCenter

                    Button {
                        Layout.alignment: Qt.AlignCenter

                        text: '关　闭'
                        onClicked: {
                            sg_close();
                        }
                    }

                    Button {
                        Layout.alignment: Qt.AlignCenter

                        text: '配　置'
                        onClicked: {
                            stackView.push(compConfigEditor);
                        }
                    }
                }
            }
        }
    }


    Component {
        id: compConfigEditor

        ScriptEditor {
            id: scriptEditor

            visible: false

            onSg_close: function(saved) {
                stackView.pop();

                scriptEditor.visible = false;
                root.forceActiveFocus();
            }

            Component.onCompleted: {
                const defaultPath = $GlobalJS.toPath(Qt.resolvedUrl("../Components/PluginConfig.json"));
                let defaultCode;
                if($Frame.sl_fileExists(defaultPath)) {
                    defaultCode = $Frame.sl_fileRead(defaultPath);
                } else {
                    defaultCode = `{
  "languageConfigFolder": "Config",
  "languageConfigFile": "i18n.cfg",
  "languagesFolder": "languages",
  "debugLogType": 0,
  "keyCommon": "c",
  "keyFile": "f",
  "keyName": "name",
  "keyAuthor": "author",
  "defaultLanguage": "zh"
}`;
                }


                scriptEditor.init({
                    BasePath: GlobalJS.toPath(Qt.resolvedUrl('..')),
                    RelativePath: 'Components/PluginConfig.json',
                    ChoiceButton: 0b11,
                    PathText: 0b11,
                    RunButton: 0b11,
                    Default: defaultCode
                });
            }
        }
    }



    QObject {
        id: _private

    }



    Keys.onEscapePressed: function(event) {
        console.debug("[Plugins]Keys.onEscapePressed");
        event.accepted = true;

        sg_close();
    }
    Keys.onBackPressed: function(event) {
        console.debug("[Plugins]Keys.onBackPressed");
        event.accepted = true;

        sg_close();
    }
    Keys.onPressed: function(event) {
        console.debug('[Plugins]Keys.onPressed:', event, event.key, event.text, event.isAutoRepeat);
        event.accepted = true;
    }
    Keys.onReleased: function(event) {
        console.debug('[Plugins]Keys.onReleased:', event.key, event.isAutoRepeat);
        event.accepted = true;
    }


    Component.onCompleted: {
        console.debug('[Plugins]Component.onCompleted:I18n');
    }
    Component.onDestruction: {
        console.debug("[Plugins]Component.onDestruction:I18n");
    }
}
