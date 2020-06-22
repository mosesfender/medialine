<?php
/* @var $model \ml\common\models\Articles */
/* @var $chapter int */

use ml\common\models\Chapters;
use yii\bootstrap\ActiveForm;
use yii\helpers\Html;
?>

<div class="article-form">

    <?php
    $form = ActiveForm::begin([
                "id" => "article_form",
    ]);
    ?>
    <?php echo Html::hiddenInput("chapter", $chapter); ?>
    <?php echo $form->field($model, "id")->hiddenInput()->label(false); ?>
    <?php echo $form->field($model, "title"); ?>
    <?php echo $form->field($model, "content")->textarea(["style" => "resize:vertical"]); ?>

    <?php $form->end(); ?>
</div>