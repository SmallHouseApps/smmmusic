<?php

class OrdersController extends \Phalcon\Mvc\Controller
{

    public function indexAction()
    {

    }

    public function allAction()
    {
        $response = new \Phalcon\Http\Response();

        $orders = Orders::find();
        $orders_arr = $orders->toArray();
        
        foreach($orders as $key => $order){
            $orders_arr[$key]['user'] = $order->user;
            $orders_arr[$key]['groups'] = $order->groups;
            $orders_arr[$key]['packages'] = $order->packages;
            $orders_arr[$key]['status'] = $order->status;
        }
        
        $response->setContent(json_encode($orders_arr));

        return $response;
    }

    public function getAction()
    {
        $response = new \Phalcon\Http\Response();

        if($this->session->get('auth')['name']){
            $orders = Orders::find("user_id=".$this->session->get('auth')['id']);
            $orders_arr = $orders->toArray();
            
            foreach($orders as $key => $order){
                $orders_arr[$key]['user'] = $order->user;
                $orders_arr[$key]['groups'] = $order->groups;
                $orders_arr[$key]['packages'] = $order->packages;
                $orders_arr[$key]['status'] = $order->status;
            }
            
            $response->setContent(json_encode($orders_arr));
        } else {
            $response->setStatusCode(403, 'Unauthorized');
        }

        return $response;
    }

    public function createAction()
    {
        $response = new \Phalcon\Http\Response();
        $rawBody = $this->request->getJsonRawBody(true);

        if ($this->request->isPost()) {
            if($rawBody['user']['email'] != ""){
                $user = new Users();

                $user->name = $rawBody['user']['name'];
                $user->email = $rawBody['user']['email'];
                $user->password = $rawBody['user']['password'];
                $user->created_at = date('Y-m-d H:i:s');
                $user->updated_at = date('Y-m-d');

                try{
                    $user->save();
                } catch (Exception $ex){
                    $response->setStatusCode(409, 'Unique violation');
                    $response->setContent($ex->getMessage());
                    return $response;
                }
            }

            $order = new Orders();

            $order->user_id = isset($user) ? $user->id : $rawBody['user_id'];
            $order->phone = $rawBody['phone'];
            $order->price = 0;
            $order->date = date('Y-m-d');

            try{
                $order->save();
                $response->setContent(json_encode($order));
            } catch (Exception $ex){
                $response->setStatusCode(409, 'Unique violation');
                $response->setContent($ex->getMessage());
                return $response;
            }

            foreach($rawBody['groups'] as $groupId){
                $temp = new OrdersGroups();
                $temp->orders_id = $order->id;
                $temp->group_id = $groupId;
                $temp->save();
            }

            foreach($rawBody['packages'] as $packageId){
                $temp = new OrdersPackages();
                $temp->orders_id = $order->id;
                $temp->packages_id = $packageId;
                $temp->save();
            }
            
        } else {
            $response->setStatusCode(405);
        }

        return $response;
    }

    public function updateAction($id)
    {
        $response = new \Phalcon\Http\Response();
        $rawBody = $this->request->getJsonRawBody(true);
        $order = Orders::findFirst($id);
        
        if(isset($rawBody['phone'])) $order->phone = $rawBody['phone'];
        if(isset($rawBody['status_id'])) $order->status_id = $rawBody['status_id'];
        
        foreach($order->groupsEdge as $groupEdge){
            $groupEdge->delete();
        }

        foreach($order->packagesEdge as $packageEdge){
            $packageEdge->delete();
        }

        foreach($rawBody['groups'] as $groupId){
            $temp = new OrdersGroups();
            $temp->orders_id = $order->id;
            $temp->group_id = $groupId;
            $temp->save();
        }

        foreach($rawBody['packages'] as $packageId){
            $temp = new OrdersPackages();
            $temp->orders_id = $order->id;
            $temp->packages_id = $packageId;
            $temp->save();
        }
        
        $order->save();
        $response->setContent(json_encode($order));

        return $response;
    }

}

