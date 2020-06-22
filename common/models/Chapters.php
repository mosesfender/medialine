<?php

namespace ml\common\models;

use Yii;
use creocoder\nestedsets\NestedSetsBehavior;
use yii\behaviors\TimestampBehavior;
use ml\common\behaviors\FlagsBehavior;

/**
 * This is the model class for table "chapters".
 *
 * @property int $id
 * @property string|null $title
 * @property int $tree
 * @property int $lft
 * @property int $rgt
 * @property int $depth
 * @property int $position
 * @property int $created_at
 * @property int $updated_at
 * @property int|null $_flags
 *
 * @property Relations[] $relations
 * @property Articles[] $articles
 * 
 * @property bool $deleted
 */
class Chapters extends \yii\db\ActiveRecord {

    /**
     * {@inheritdoc}
     */
    public static function tableName() {
        return 'chapters';
    }

    /**
     * {@inheritdoc}
     */
    public function rules() {
        return [
            [['title'], 'string'],
            [['tree', 'lft', 'rgt', 'depth', 'created_at', 'updated_at'], 'required'],
            [['tree', 'lft', 'rgt', 'depth', 'position', 'created_at', 'updated_at',
            '_flags'], 'integer'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels() {
        return [
            'id'    => 'ID',
            'title' => 'Заголовок',
        ];
    }

    /**
     * Gets query for [[Relations]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getRelations() {
        return $this->hasMany(Relations::class, ['chapter' => 'id']);
    }

    /**
     * Gets query for [[Articles]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getArticles() {
        return $this->hasMany(Articles::class, ['id' => 'article'])->viaTable('relations',
                                                                              [
                            'chapter' => 'id']);
    }

    public function behaviors() {
        return [
            FlagsBehavior::class,
            TimeStampBehavior::class,
            'tree' => [
                'class'         => NestedSetsBehavior::class,
                'treeAttribute' => 'tree',
            ],
        ];
    }

    public function getDeleted() {
        return $this->_flags & FlagsBehavior::STATUS_DELETED;
    }

    public function setDeleted($val) {
        if ($val) {
            $this->_flags = $this->_flags | FlagsBehavior::STATUS_DELETED;
        } else {
            $this->_flags = $this->_flags & ~ FlagsBehavior::STATUS_DELETED;
        }
    }

}
