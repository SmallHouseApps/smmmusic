<?php

class PackagesController extends \Phalcon\Mvc\Controller
{

    public function indexAction()
    {
        
    }

    public function allAction()
    {
        $response = new \Phalcon\Http\Response();

        $packages = Packages::find();
        $packages_arr = $packages->toArray();
        
        foreach($packages as $key => $package){
            $packages_arr[$key]['groups'] = $package->groups;
        }
        
        $response->setContent(json_encode($packages_arr));

        return $response;
    }

    public function createAction()
    {
        $response = new \Phalcon\Http\Response();
        $rawBody = $this->request->getJsonRawBody(true);

        if ($this->request->isPost()) {
            $packages = new Packages();
            $packages->name = $rawBody['name'];
            $packages->price = $rawBody['price'];
            $packages->save();

            foreach($rawBody['groups'] as $groupId){
                $temp = new GroupsPackages();
                $temp->groups_id = $groupId;
                $temp->packages_id = $packages->id;
                $temp->save();
            }

            try{
                $packages->save();
                $response->setContent(json_encode($rawBody));
            } catch (Exception $ex){
                $response->setStatusCode(409, 'Unique violation');
                $response->setContent($ex->getMessage());
            }
            
        } else {
            $response->setStatusCode(405);
        }

        return $response;
    }
}

