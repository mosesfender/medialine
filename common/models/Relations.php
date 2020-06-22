<?php

namespace ml\common\models;

use Yii;

/**
 * This is the model class for table "relations".
 *
 * @property int $chapter
 * @property int $article
 * @property int|null $sort
 * @property int|null $_flags
 *
 * @property Articles $article0
 * @property Chapters $chapter0
 */
class Relations extends \yii\db\ActiveRecord {

    /**
     * {@inheritdoc}
     */
    public static function tableName() {
        return 'relations';
    }

    /**
     * {@inheritdoc}
     */
    public function rules() {
        return [
            [['chapter', 'article'], 'required'],
            [['chapter', 'article', 'sort', '_flags'], 'integer'],
            [['chapter', 'article'], 'unique', 'targetAttribute' => ['chapter', 'article']],
            [['article'], 'exist', 'skipOnError'     => true, 'targetClass'     => Articles::className(),
                'targetAttribute' => ['article' => 'id']],
            [['chapter'], 'exist', 'skipOnError'     => true, 'targetClass'     => Chapters::className(),
                'targetAttribute' => ['chapter' => 'id']],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels() {
        return [
            'chapter' => 'Chapter',
            'article' => 'Article',
            'sort'    => 'Sort',
            '_flags'  => 'Flags',
        ];
    }

    /**
     * Gets query for [[Article0]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getArticle0() {
        return $this->hasOne(Articles::className(), ['id' => 'article']);
    }

    /**
     * Gets query for [[Chapter0]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getChapter0() {
        return $this->hasOne(Chapters::className(), ['id' => 'chapter']);
    }

    public function behaviors() {
        return [
            \ml\common\behaviors\FlagsBehavior::class,
        ];
    }

}
