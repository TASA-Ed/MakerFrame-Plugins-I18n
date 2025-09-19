import QtQuick 2.14
import QtQuick.Window 2.14
import QtQuick.Controls 2.14
import QtQuick.Dialogs 1.3 as Dialog1
import QtQuick.Layouts 1.14


//import cn.Leamus.MakerFrame 1.0


import _Global 1.0
//import _Global.Button 1.0


//import 'qrc:/QML'


//import './Core'

////import GameComponents 1.0
//import 'Core/GameComponents'


//import 'File.js' as File



Item {
    id: root


    signal sg_close();



    //width: 600
    //height: 800
    anchors.fill: parent

    focus: true
    clip: true

    //color: Global.style.backgroundColor



    Mask {
        anchors.fill: parent
        //opacity: 0
        color: Global.style.backgroundColor
        //radius: 9
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

                    //textArea.color: 'white'
                    //textArea.placeholderTextColor: '#7F7F7F7F'

                    //textArea.enabled: false
                    //textArea.readOnly: true
                    //textArea.wrapMode: Text.Wrap
                    //textArea.textFormat: TextArea.PlainText

                    //textArea.selectByKeyboard: true
                    //textArea.selectByMouse: true

                    textArea.background: Rectangle {
                        //implicitWidth: 200
                        //implicitHeight: 40
                        color: Global.style.backgroundColor
                        border.color: parent.parent.textArea.activeFocus ? Global.style.accent : Global.style.hintTextColor
                        border.width: parent.parent.textArea.activeFocus ? 2 : 1
                    }

                    textArea.text: $CommonLibJS.convertToHTML(
`<b>I18n 国际化</b>

作者: TASA-Ed 工作室

<b>用法</b>

在起始脚本 <code>$start</code> 函数中添加:

<code>I18n.init("zh"); // "zh" 为指定默认语言，是可选的参数，默认为 "zh"
if (!game.gf['i18nPluginArguments']['Status']) console.error("[I18n]","语言加载失败");</code>

随后可使用:

<code>I18n.info(0); // 读取语言名称
I18n.info(1); // 读取语言作者
I18n.c("翻译键名称"); // 读取通用翻译键
I18n.f("文件名称","翻译键名称"); // 读取文件翻译键</code>

这些函数均返回 <code>String</code> （文本）格式。

<b>更改语言</b>

可使用 <code>I18n.changeLanguage</code> 更改语言，并且下一次启动时也同样生效：

<code>I18n.changeLanguage("更改的语言名称"); // 此语言的语言文件必须存在</code>

更改成功则返回 <code>true</code> 否则返回 <code>false</code> 。

<b>占位符</b>

在翻译文件中可添加 <code>%s</code> 作占位符，并向 <code>I18n</code> 函数传参即可将占位符替换为参数，例：

<code>// 翻译键：第 %s 天，第 %s 天接着降临
yield game.msg(I18n.c("v", 1, 2)); // 输出：第 1 天，第 2 天接着降临</code>

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

- <code>name</code> 为语言的名称。*
- <code>author</code> 为语言的作者。*
- <code>c</code> 为通用类翻译键。*
  - <code>helloWorld</code> 为一个翻译键。
  - ...
- <code>f</code> 为文件类翻译键。*
  - <code>main</code> 为 <code>main</code> 文件。需要注意的是翻译键与文件并不一定要一一对应，您也可以不这么做，尽管说这样可能会对后期的维护带来很多麻烦。
    - <code>title</code> 为一个翻译键。
    - ...
  - ...

* 为必需

所有翻译文件都需要遵守 JSON 的语法，否则无法正确读取。

<b>此插件定义的全局变量</b>

- <code>game.gf['i18n']</code> : 语言文件的 JSON <code>Object</code> 。
- <code>game.gf['i18nPluginArguments']</code> : 此插件的参数 JSON <code>Object</code> 。
  - <code>game.gf['i18nPluginArguments']['Version']</code> : 此插件的版本 <code>String</code> 。
  - <code>game.gf['i18nPluginArguments']['ConfigPath']</code> : 语言配置文件目录 <code>String</code>。
  - <code>game.gf['i18nPluginArguments']['FilePath']</code> : 语言文件目录 <code>String</code>。
  - <code>game.gf['i18nPluginArguments']['Language']</code> : 语言名称 <code>String</code>。
  - <code>game.gf['i18nPluginArguments']['Status']</code> : 语言是否成功读取，<code>true</code> 为成功，<code>false</code> 为失败 <code>boolean</code>。
  - <code>game.gf['i18nPluginArguments']['DefaultLanguageName']</code> : 默认语言名称 <code>String</code>。
- <code>game.gf['i18nPluginConfig']</code> : 此插件配置文件的 JSON <code>Object</code> 。

<b>此插件的可配置项</b>

此插件支持配置自定义路径/文件名，配置文件 <code>项目根目录/Plugins/TASA-Ed/I18n/Components/PluginConfig.json</code> 已经包含在插件中，只需按需修改即可，所有路径均为相对路径，当前目录为 <code>i18n.js</code> 所在的目录 <code>项目根目录/Plugins/TASA-Ed/I18n/Components</code>。

默认配置文件示例：

<code>{
    "languageConfigFolder":"Config",
    "languageConfigFile":"i18n.cfg",
    "languagesFolder":"languages"
}</code>

- <code>languageConfigFolder</code> : 语言配置文件的路径。
- <code>languageConfigFile</code> : 语言配置文件的名称。
- <code>languagesFolder</code> : 语言文件的路径。`, )
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
            //anchors.fill: parent
            //width: parent.width
            //height: parent.height


            //strBasePath: GameMakerGlobal.config.strProjectRootPath + GameMakerGlobal.separator + GameMakerGlobal.config.strCurrentProjectName
            //strTitle: $Frame.sl_fileName(_private.strFilePath)
            /*fnAfterCompile: function(code) {return code;}*/

            //visualScriptEditor.strSearchPath: $Frame.sl_path(_private.strFilePath)
            //visualScriptEditor.nLoadType: 0

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
    "languageConfigFolder":"Config",
    "languageConfigFile":"i18n.cfg",
    "languagesFolder":"languages"
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



    //Keys.forwardTo: []
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
