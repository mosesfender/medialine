<?php

namespace ml\controllers;

class DefaultController extends \yii\web\Controller {

    public function actionIndex() {
        return $this->render("index");
    }

    public function actionCatalog() {
        return $this->render("catalog");
    }

}
