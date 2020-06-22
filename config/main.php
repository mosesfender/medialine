<?php

return [
    'aliases'             => [
        '@bower' => '@vendor/bower-asset',
        '@npm'   => '@vendor/npm-asset',
    ],
    'vendorPath'          => '@vendor',
    'id'                  => 'ml_test',
    'name'                => 'Test for Media Line',
    'homeUrl'             => '/',
    'defaultRoute'        => 'default',
    'basePath'            => dirname(__DIR__),
    'bootstrap'           => ['log'],
    'controllerNamespace' => 'ml\\controllers',
    'components'          => [
        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName'  => false,
            'normalizer'      => [
                'class'                  => '\yii\web\UrlNormalizer',
                'collapseSlashes'        => true,
                'normalizeTrailingSlash' => true,
            ],
            'rules'           => [
                ['class' => 'yii\rest\UrlRule', 'controller' => ['default']],
                ['class'      => 'yii\rest\UrlRule', 'controller' => ['v1/tree',
                        'v1/chapter',
                        'v1/article']],
                ['class'      => 'yii\rest\UrlRule', 'controller' => ['v2/chapter',
                        'v2/article']],
                '<module:[\w-]+>/<controller:[\w-]+>/<action:[\w-]+>/<id:\d+>' => '<module>/<controller>/<action>',
            ],
        ],
        'request'    => [
            'baseUrl'             => '',
            'cookieValidationKey' => '_uRtdnT7R510_',
            'parsers'             => [
                'application/json' => 'yii\web\JsonParser',
            ]
        ],
        'cache'      => [
            'class' => 'yii\caching\FileCache',
        ],
        'log'        => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets'    => [
                [
                    'class'  => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
    /**
     * Настройка компонента db в main-local.php
      'db' => [
      'class'               => 'yii\db\Connection',
      'dsn'                 => 'mysql:host=localhost;dbname=ml',
      'username'            => 'root',
      'password'            => '',
      'charset'             => 'utf8',
      'enableSchemaCache'   => true,
      'schemaCacheDuration' => 3600,
      ],
     */
    ],
    'modules'             => [
        'v1' => [
            'class' => ml\versions\v1\Module::class
        ],
        'v2' => [
            'class' => ml\versions\v2\Module::class
        ]
    ],
];

