<?php

namespace ml\common\behaviors;

class FlagsBehavior extends \yii\base\Behavior {

    /**
     * Состояние записи
     */
    const STATUS_ENABLED  = 0x1;
    const STATUS_DISABLED = 0x2;
    const STATUS_DELETED  = 0x4;

}
