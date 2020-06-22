<?php

namespace ml\views\layouts\assets;

use yii\web\AssetBundle;

class CatalogAsset extends AssetBundle {

    public $sourcePath     = __DIR__ . "/dist";
    public $css            = [
        'css/Catalog.css'
    ];
    public $js             = [
        'js/Catalog.js'
    ];
    public $depends        = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
        'ml\views\layouts\assets\LayoutAsset',
    ];
    public $publishOptions = [
        "forceCopy" => YII_ENV != "prod"
    ];

}
