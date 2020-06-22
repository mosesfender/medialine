<?php

namespace ml\common\controllers;

use yii\helpers\ArrayHelper as ah;
use ml\common\models\Chapters;
use creocoder\nestedsets\NestedSetsBehavior;

class ChapterController extends BaseController {

    public $modelClass = 'ml\common\models\Chapters';

    protected function verbs() {
        return [
            'move-to-chapter' => ['PATCH'],
            'leaves'          => ['GET'],
            'chapter-form'    => ['GET'],
            'index'           => ['GET', 'HEAD'],
            'view'            => ['GET', 'HEAD'],
            'create'          => ['POST'],
            'update'          => ['PUT', 'PATCH'],
            'delete'          => ['DELETE'],
        ];
    }

    public function actions() {
        $ret = parent::actions();
        unset($ret["create"]);
        unset($ret["update"]);
        unset($ret["delete"]);
        return $ret;
    }

    public function actionCreate() {
        $model = new $this->modelClass();
        $post  = $this->letPost();
        if (!empty($post)) {

            $model->title = ah::getValue($post, "title", "");

            if (!isset($post["parent_id"]) || empty($post["parent_id"])) {
                $model->makeRoot(false);
            } else {
                $parent = $this->modelClass::findOne($post["parent_id"]);
                $model->appendTo($parent, false);
            }
        }
        return $model;
    }

    public function actionUpdate() {
        $post  = $this->letPost();
        $model = Chapters::findOne($post["id"]);
        if ($model) {
            $model->attributes = $post;
            $model->updated_at = time();
            $model->save();
        }
        return $model;
    }

    public function actionDelete() {
        $post  = $this->letPost();
        $model = Chapters::findOne($post["id"]);
        if ($model) {
            $model->updated_at = time();
            $model->save();
        }
        return $model;
    }

    public function actionLeaves($id = null) {
        $ret = ["chapters" => [], "articles" => []];
        $id  = (int) $id;
        if (!$id) {
            $ret["chapters"] = Chapters::find()
                    ->where(["lft" => 1])
                    ->all();
        } else {
            $chapter         = Chapters::findOne($id);
            $ret["chapters"] = $chapter->children(1)->all();
            $ret["articles"] = $chapter->articles;
        }

        return $ret;
    }

    /**
     * Перемещает раздел в раздел
     * 
     * PATCH DATA:
     * @param int $chapter
     * @param int $toChapter
     * 
     * @return Chapters
     * @throws \Exception
     * @patch /v1/chapter/move-to-chapter
     */
    public function actionMoveToChapter() {
        $post = $this->letPost();

        $chapter   = Chapters::findOne(ah::getValue($post, "chapter", null));
        $toChapter = Chapters::findOne(ah::getValue($post, "toChapter", null));

        if ($chapter && !$toChapter) {
            $chapter->makeRoot(false);
            return $chapter;
        }

        if ($chapter && $toChapter) {
            try {
                if ($toChapter) {
                    $chapter->appendTo($toChapter);
                } else {
                    
                }
                return $chapter;
            } catch (\Exception $ex) {
                throw $ex;
            }
        } else {
            throw new \Exception("Не установлен перемещаемый или принимающий раздел");
        }
    }

    public function actionChapterForm($chapter = null, $parent_id = null) {
        $this->layout                = "@ml/views/layouts/clean";
        \yii::$app->response->format = \yii\web\Response::FORMAT_RAW;

        if ($chapter) {
            $model = Chapters::findOne($chapter);
        } else {
            $model = new Chapters();
        }

        return $this->renderForModalIframe(($model->isNewRecord ? "Создание раздела"
                            : "Редактирование раздела"), "form",
                                           compact("model", "parent_id"));
    }

}
