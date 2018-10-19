<?php

class VkGroupsController extends \Phalcon\Mvc\Controller
{

    public function indexAction()
    {
        
    }

    public function packagesAction()
    {
        
    }

    public function allAction()
    {
        $response = new \Phalcon\Http\Response();

        $vkGroups = VkGroups::find();
        $response->setContent(json_encode($vkGroups));

        return $response;
    }

    public function createAction()
    {
        $response = new \Phalcon\Http\Response();
        $rawBody = $this->request->getJsonRawBody(true);

        if ($this->request->isPost()) {
            $vkGroup = new VkGroups();

            $vkGroup->vk_group_id = $rawBody['vk_group_id'];
            $vkGroup->name = $rawBody['name'];
            $vkGroup->screen_name = $rawBody['screen_name'];
            $vkGroup->avatar = $rawBody['avatar'];

            try{
                $vkGroup->save();
                $response->setContent(json_encode($vkGroup));
            } catch (Exception $ex){
                $response->setStatusCode(409, 'Unique violation');
                $response->setContent($ex->getMessage());
            }
            
        } else {
            $response->setStatusCode(405);
        }

        return $response;
    }

    public function insertAction()
    {
        $response = new \Phalcon\Http\Response();
        $rawBody = $this->request->getJsonRawBody(true);

        foreach ($rawBody as $key => $row) {
            $vkGroup = new VkGroups();

            $vkGroup->vk_group_id = $row['vkGroupId'];
            $vkGroup->name = $row['name'];
            $vkGroup->screen_name = $row['screenName'];
            $vkGroup->avatar = $row['avatar'];

            $vkGroup->save();
        }

        $response->setContent(json_encode($rawBody));
        return $response;
    }

    public function updateAction($id)
    {
        $response = new \Phalcon\Http\Response();
        $rawBody = $this->request->getJsonRawBody(true);
        $vkGroup = VkGroups::findFirst($id);

        if(isset($rawBody['price'])) $vkGroup->price = $rawBody['price'];
        if(isset($rawBody['likes'])) $vkGroup->likes = $rawBody['likes'];
        if(isset($rawBody['views'])) $vkGroup->views = $rawBody['views'];
        if(isset($rawBody['reposts'])) $vkGroup->reposts = $rawBody['reposts'];
        if(isset($rawBody['members'])) $vkGroup->members = $rawBody['members'];

        try{
            $vkGroup->update();
            $response->setContent(json_encode($vkGroup));
        } catch (Exception $ex){
            $response->setStatusCode(500, 'Server error');
            $response->setContent($ex->getMessage());
        }

        return $response;
    }

    public function removeAction($id)
    {
        $response = new \Phalcon\Http\Response();
        $vkGroup = VkGroups::findFirst($id);

        try{
            $vkGroup->delete();
            $response->setStatusCode(200);
        } catch (Exception $ex){
            $response->setStatusCode(500, 'Server error');
            $response->setContent($ex->getMessage());
        }

        return $response;
    }

}

