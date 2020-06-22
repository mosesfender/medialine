<?php
/* @var $model \ml\common\models\Chapters */

use ml\common\models\Chapters;
use yii\bootstrap\ActiveForm;
use yii\bootstrap\Html;
?>

<div class="chapter-form">

    <?php
    $form = ActiveForm::begin([
                "id" => "chapter_form",
    ]);
    ?>

    <?php echo Html::hiddenInput("parent_id", $parent_id); ?>
    <?php
    echo $form->field($model, "id")
            ->hiddenInput()
            ->label(false);
    ?>
    <?php echo $form->field($model, "title"); ?>

<?php $form->end(); ?>
</div>