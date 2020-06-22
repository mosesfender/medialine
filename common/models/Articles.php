<?php

namespace ml\common\models;

use Yii;
use ml\common\behaviors\FlagsBehavior;

/**
 * This is the model class for table "articles".
 *
 * @property int $id
 * @property string|null $title
 * @property string|null $content
 * @property int|null $_flags
 *
 * @property Relations[] $relations
 * @property Chapters[] $chapters
 */
class Articles extends \yii\db\ActiveRecord {

    /**
     * {@inheritdoc}
     */
    public static function tableName() {
        return 'articles';
    }

    /**
     * {@inheritdoc}
     */
    public function rules() {
        return [
            [['title', 'content'], 'string'],
            [['_flags'], 'integer'],
            ['_flags', 'default', 'value' => FlagsBehavior::STATUS_ENABLED],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels() {
        return [
            'id'      => 'ID',
            'title'   => 'Заголовок',
            'content' => 'Содержание',
            '_flags'  => 'Flags',
        ];
    }

    public function extraFields() {
        return ['relations', 'chapters'];
    }

    /**
     * Gets query for [[Relations]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getRelations() {
        return $this->hasMany(Relations::className(), ['article' => 'id']);
    }

    /**
     * Gets query for [[Chapters]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getChapters() {
        return $this->hasMany(Chapters::className(), ['id' => 'chapter'])
                        ->viaTable('relations', ['article' => 'id']);
    }

    public function behaviors() {
        return [
            \ml\common\behaviors\FlagsBehavior::class,
        ];
    }

}
