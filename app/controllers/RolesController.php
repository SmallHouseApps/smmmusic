<?php

class RolesController extends \Phalcon\Mvc\Controller
{

    public function indexAction()
    {

    }


    public function allAction()
    {
        $response = new \Phalcon\Http\Response();

        $roles = Roles::find();
        $response->setStatusCode(200);
        $response->setContent(json_encode($roles));

        return $response;
    }

}

