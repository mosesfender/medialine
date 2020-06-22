<?php

namespace ml\versions\v2\controllers;

use ml\common\models\Chapters;

class ChapterController extends \ml\common\controllers\ChapterController {

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
            $ret = Chapters::find()
                    ->where(["lft" => 1])
                    ->all();
        } else {
            $qq  = Chapters::findOne($id);
            $ret = $qq->children(1)->all();
        }

        return $ret;
    }

}
