<?php

class SessionController extends \Phalcon\Mvc\Controller
{

    private function _registerSession($user)
    {
        $this->session->set('auth', array(
            'id' => $user->id,
            'name' => $user->name,
            'role' => $user->role->value,
            'rights' => $user->role->rights->regions
        ));
    }

    public function startAction()
    {
        $response = new \Phalcon\Http\Response();
        $rawBody = $this->request->getJsonRawBody(true);
        
        if ($this->request->isPost()) {
            $email = $this->request->getPost('email');
            $password = $this->request->getPost('password');
            $user = Users::findFirst("email='$email'");
            
            if ($user != false) {
                if($this->security->checkHash($password, $user->password)){
                    $this->_registerSession($user);
                    $response->setContent(json_encode($this->session->get('auth')));
                } else {
                    $response->setStatusCode(401); 
                }
            } else {
                $response->setStatusCode(404);
            }
        } else {
            $response->setStatusCode(405);
        }

        return $response;
    }

    public function getAction()
    {
        $response = new \Phalcon\Http\Response();
        if(!is_null($this->session->get('auth'))){
            $response->setContent(json_encode($this->session->get('auth')));
        } else {
            $role = Roles::findFirst("value='client'");
            $response->setContent(json_encode([
                'role' => $role->value,
                'rights' => $role->rights->regions
            ]));
        }
        return $response;
    }

    public function endAction()
    {
        $response = new \Phalcon\Http\Response();
        $this->session->destroy();
        $response->redirect('/');
        return $response;
    }

}

