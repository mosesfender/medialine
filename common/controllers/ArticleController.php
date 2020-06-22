<?php

namespace ml\common\controllers;

use yii\helpers\ArrayHelper as ah;
use ml\common\models\Articles;
use ml\common\models\Relations;
use ml\common\models\Chapters;

class ArticleController extends BaseController {

    public $modelClass = 'ml\common\models\Articles';

    protected function verbs() {
        return [
            'copy-to-chapter' => ['PATCH'],
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
        return $ret;
    }

    /**
     * Создание статьи
     * 
     * @return Articles
     * @throws \Exception
     * @post /v1/article/create?expand=relations,chapters
     */
    public function actionCreate() {
        /* @var $model \ml\common\models\Articles */
        $model = new $this->modelClass();
        $post  = $this->letPost();

        if (!empty($post)) {

            if (!isset($post["chapter"]) || empty($post["chapter"])) {
                throw new \Exception("Статью невозможно разместить вне раздела");
            }

            $chapter = Chapters::findOne($post["chapter"]);
            if (!$chapter) {
                throw new \Exception("Не найден раздел");
            }

            $model->attributes = $post;

            $tr = \yii::$app->db->beginTransaction();
            try {

                $model->save();

                $relation = new Relations([
                    "chapter" => $chapter->id,
                    "article" => $model->id,
                    "_flags"  => $model->_flags
                ]);
                $relation->save();

                $tr->commit();

                return $model;
            } catch (\Exception $ex) {
                $tr->rollBack();
                throw $ex;
            }
        }
    }

    public function actionUpdate() {
        $post = $this->letPost();
        if (!empty($post)) {
            /* @var $model \ml\common\models\Articles */
            $model             = $this->modelClass::findOne($post["id"]);
            $model->attributes = $post;
            $model->save();
            return $model;
        }
    }

    /**
     * Копирует статью в раздел
     * 
     * PATCH DATA:
     * @param int $article
     * @param int $chapter
     * 
     * @return Articles
     * @throws \Exception
     * @patch /v1/article/copy-to-chapter?expand=relations,chapters
     */
    public function actionCopyToChapter() {
        $post = $this->letPost();

        $article = Articles::findOne(ah::getValue($post, "article", null));
        $chapter = Chapters::findOne(ah::getValue($post, "chapter", null));

        if ($article && $chapter) {
            try {
                $rel = new Relations([
                    "chapter" => $chapter->id,
                    "article" => $article->id,
                    "_flags"  => $article->_flags,
                ]);
                if ($rel->save()) {
                    return $article;
                } else {
                    throw new \Exception(sprintf("Не удалось скопировать статью «%s» в раздел «%s». "
                                    . "Вероятно, статья уже есть в этом разделе.",
                                                 $article->title,
                                                 $chapter->title));
                }
            } catch (\Exception $ex) {
                throw $ex;
            }
        } else {
            throw new \Exception("Не установлена статья или раздел");
        }
    }

    /**
     * Перемещает статью из раздела в раздел
     * 
     * PATCH DATA:
     * @param int $article
     * @param int $fromChapter
     * @param int $toChapter
     * 
     * @return Articles
     * @throws \Exception
     * @patch /v1/article/move-to-chapter?expand=relations,chapters
     */
    public function actionMoveToChapter() {
        $post = $this->letPost();

        $article     = Articles::findOne(ah::getValue($post, "article", null));
        $fromChapter = Chapters::findOne(ah::getValue($post, "fromChapter", null));
        $toChapter   = Chapters::findOne(ah::getValue($post, "toChapter", null));

        if ($article && $fromChapter && $toChapter) {
            /* @var $model \ml\common\models\Articles */
            try {
                $rel = Relations::find()
                        ->where(["AND",
                            ["article" => $article->id],
                            ["chapter" => $fromChapter->id],
                        ])
                        ->one();
                if ($rel) {
                    $rel->chapter = $toChapter->id;
                    if ($rel->save()) {
                        return $article;
                    } else {
                        throw new \Exception(sprintf("Не удалось переместить статью «%s» в раздел «%s». "
                                        . "Вероятно, статья уже есть в этом разделе.",
                                                     $article->title,
                                                     $toChapter->title));
                    }
                }
            } catch (\Exception $ex) {
                throw $ex;
            }
        } else {
            throw new \Exception("Не установлена статья или раздел");
        }
    }

    public function actionArticleForm($article = null, $chapter = null) {
        $this->layout                = "@ml/views/layouts/clean";
        \yii::$app->response->format = \yii\web\Response::FORMAT_RAW;

        if (!$chapter && !$article) {
            throw new \Exception("Не указан ни раздел, ни статья");
        }

        if ($article) {
            $model = Articles::findOne($article);
        } else {
            $model = new Articles();
        }

        return $this->renderForModalIframe(($model->isNewRecord ? "Создание статьи"
                            : "Редактирование статьи"), "form",
                                           compact("model", "chapter"));
    }

}
