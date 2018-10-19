<?php

class UsersController extends \Phalcon\Mvc\Controller
{
    public function indexAction()
    {
        
    }

    public function allAction()
    {
        $response = new \Phalcon\Http\Response();

        $users = Users::find();
        $users_arr = $users->toArray();
        
        foreach($users as $key => $user){
            $users_arr[$key]['role_name'] = $user->role->name;
        }
        
        $response->setContent(json_encode($users_arr));

        return $response;
    }

    public function createAction()
    {
        $response = new \Phalcon\Http\Response();
        $rawBody = $this->request->getJsonRawBody(true);

        if ($this->request->isPost()) {
            $user = new Users();

            $user->name = $rawBody['name'];
            $user->email = $rawBody['email'];
            if(isset($rawBody['role_id'])) $user->role_id = $rawBody['role_id'];
            if(isset($rawBody['password'])) {
                $user->password = $this->security->hash($rawBody['password']);
            } else {
                $user->password = $this->security->hash($rawBody['password']);
            }
            $user->created_at = date('Y-m-d H:i:s');
            $user->updated_at = date('Y-m-d H:i:s');

            try{
                $user->save();
                $response->setContent(json_encode($user));
            } catch (Exception $ex){
                $response->setStatusCode(409, 'Unique violation');
                $response->setContent($ex->getMessage());
                return $response;
            }
            
        } else {
            $response->setStatusCode(405);
        }

        return $response;
    }

    public function getAction($id)
    {
        $response = new \Phalcon\Http\Response();

        $user = Users::findFirst($id);
        $user_arr = $user->toArray();
        $user_arr['role'] = $user->role;
        $user_arr['rights'] = $user->role->rights;

        $response->setContent(json_encode($user_arr));
        return $response;
    }

}

