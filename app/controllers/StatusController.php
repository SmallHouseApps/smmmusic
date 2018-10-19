<?php

class StatusController extends \Phalcon\Mvc\Controller
{

    public function indexAction()
    {

    }

    public function allAction()
    {
        $response = new \Phalcon\Http\Response();

        $status = Status::find();
        $response->setStatusCode(200);
        $response->setContent(json_encode($status));

        return $response;
    }

}

