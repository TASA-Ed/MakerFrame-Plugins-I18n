const $name = '【游戏】I18n国际化插件',
$type = 2,
$path = ['TASA-Ed', 'I18n'],
$file = 'tasaed_I18n国际化插件.zip',
$date = '2025/9/13',
$update = '2025/9/20',
$version = '1.3.0',
$size = '24KB',
$author = 'TASA-Ed工作室',
$description = '国际化插件'
;


function* $install() {
    console.debug('安装成功');

    return true;
}

function* $uninstall() {
    console.debug('卸载成功');

    return null;
}
