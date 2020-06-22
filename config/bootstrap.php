<?php

\yii::setAlias('@ml', dirname(__DIR__));
\yii::setAlias('@vendor', realpath("../../../vendor"));

/**
 * @param mixed $arr
 * @param boolean $dump
 * @param boolean $die
 */
function prer($arr, $dump = false, $die = false) {
    $trace = debug_backtrace();
    $cnt   = count($trace);
    try {
        $_ = $cnt > 1 ? "{$trace[1]["class"]}::{$trace[1]["function"]}" : "";
        echo "<em style=\"color: #008de5;\">[{$trace[0]["line"]}] {$_}</em>";
    } catch (Exception $ex) {
        
    }
    echo "<pre>";
    $dump ? var_dump($arr) : print_r($arr);
    echo "</pre>";
    $die ? die(sprintf("Stoped on %s", date("d:m:Y H:i:s"))) : null;
}
