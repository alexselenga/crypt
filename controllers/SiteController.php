<?php

namespace app\controllers;

use app\models\Queries;
use http\Env\Request;
use Yii;
use yii\web\Controller;
use yii\web\Response;

class SiteController extends Controller
{
    /**
     * {@inheritdoc}
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
        ];
    }

    public function beforeAction($action) {
        $this->enableCsrfValidation = false;
        return parent::beforeAction($action);
    }

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionIndex()
    {
        return $this->render('index');
    }

    protected function checkQuery($query, $signValue) {
        $text = json_encode($query);
        $_signValue = 0;

        for ($i = 0; $i < strlen($text); $i ++) {
            $char = $text[$i];
            $c1 = ord($char);
            $_signValue += $c1;
        }

        return $_signValue == $signValue;
    }

    public function actionReceiver() {
        $data = Yii::$app->request->post();
        $queries = $data['queries'];
        $signValue = $data['signValue'];

        if (!$this->checkQuery($queries, $signValue)) return;

        foreach ($queries as $query) {
            $sum = $query['sum'] * (1 + $query['commission'] / 100);

            $model = new Queries;
            $model->user_id = $query['order_number'];
            $model->sum = round($sum * 100) / 100;
            $model->save();
        }
    }
}
