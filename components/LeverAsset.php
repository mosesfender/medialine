<?php

namespace ml\components;

use yii\web\AssetBundle;

class LeverAsset extends AssetBundle {

    public $sourcePath     = "@ml/views/default/assets/dist";
    public $css            = [
        "tree.css"
    ];
    public $js             = [
        "lever.js"
    ];
    public $depends        = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
        'ml\views\layouts\assets\LayoutAsset'
    ];
    public $publishOptions = [
        "forceCopy" => YII_ENV != "prod"
    ];

}
