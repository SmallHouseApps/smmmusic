<?php

use Phalcon\Mvc\Controller;

class ControllerBase extends Controller
{
    public function beforeExecuteRoute($dispatcher)
    {
        var_dump('gsagsa');
    }

    public function initialize(){
        
    }
}
