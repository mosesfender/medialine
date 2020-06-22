<?php

namespace ml\views\layouts\assets;

use yii\web\AssetBundle;

class LayoutAsset extends AssetBundle {

    public $sourcePath     = __DIR__ . "/dist";
    public $css            = [
        'css/base.css',
        'css/window.css',
        'css/ContextMenu.css',
    ];
    public $js             = [
        'js/common.js',
        'js/mfBaseElement.js',
        'js/mfBaseDragDrop.js',
        'js/vwin.js',
        'js/ContextMenu.js',
    ];
    public $depends        = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];
    public $publishOptions = [
        "forceCopy" => YII_ENV != "prod"
    ];

}
