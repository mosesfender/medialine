<?php

namespace ml\versions\v2\controllers;

use ml\common\models\Chapters;
use ml\common\models\Articles;
use ml\common\models\Relations;

class ArticleController extends \ml\common\controllers\ChapterController {

    public function actions() {
        $ret = parent::actions();
        unset($ret["view"]);
        unset($ret["index"]);
        unset($ret["create"]);
        unset($ret["update"]);
        unset($ret["delete"]);
        return $ret;
    }

    public function actionView($id = null) {
        $ret = [];
        $id  = (int) $id;
        if (!$id) {
            $chapters = Chapters::find()
                    ->select("id")
                    ->where(["lft" => 1])
                    ->column();
        } else {
            $chapters   = Chapters::findOne($id)
                    ->children()
                    ->select("id")
                    ->column();
            $chapters[] = $id;
        }

        $ret = Articles::find()
                ->joinWith("relations")
                ->where(["relations.chapter" => $chapters])
                ->all();

        return $ret;
    }

}
