<?php

namespace ml\common\controllers;

class BaseController extends \yii\rest\ActiveController {

    /**
     * Возвращает POST данные запроса
     * @return array
     */
    protected function letPost() {
        return \yii::$app->request->post();
    }

    public function beforeAction($action) {
        $this->detachBehavior("authenticator");
        $this->detachBehavior("rateLimiter");
        return parent::beforeAction($action);
    }

    public function renderForModalIframe($caption = null, $view, $params = [],
                                         $node = null) {
        $this->getView()->registerJsVar("vwCaption", $caption);
        return $this->render($view, $params);
    }

}
