<?php

use Phalcon\Mvc\View;
use Phalcon\Mvc\View\Engine\Php as PhpEngine;
use Phalcon\Mvc\Url as UrlResolver;
use Phalcon\Mvc\View\Engine\Volt as VoltEngine;
use Phalcon\Mvc\Model\Metadata\Memory as MetaDataAdapter;
use Phalcon\Session\Adapter\Files as SessionAdapter;
use Phalcon\Flash\Direct as Flash;
use Phalcon\Events\Event;

$acl = new Phalcon\Acl\Adapter\Memory();
$acl->setDefaultAction(Phalcon\Acl::DENY);
/**
 * Shared configuration service
 */
$di->setShared('config', function () {
    return include APP_PATH . "/config/config.php";
});

/**
 * The URL component is used to generate all kind of urls in the application
 */
$di->setShared('url', function () {
    $config = $this->getConfig();

    $url = new UrlResolver();
    $url->setBaseUri($config->application->baseUri);

    return $url;
});

/**
 * Setting up the view component
 */
$di->setShared('view', function () {
    $config = $this->getConfig();

    $view = new View();
    $view->setDI($this);
    $view->setViewsDir($config->application->viewsDir);

    $view->registerEngines([
        '.volt' => function ($view) {
            $config = $this->getConfig();

            $volt = new VoltEngine($view, $this);

            $volt->setOptions([
                'compiledPath' => $config->application->cacheDir,
                'compiledSeparator' => '_'
            ]);

            return $volt;
        },
        '.phtml' => PhpEngine::class

    ]);

    return $view;
});

/**
 * Database connection is created based in the parameters defined in the configuration file
 */
$di->setShared('db', function () {
    $config = $this->getConfig();

    $dialect = 'Phalcon\Db\Dialect\\' . $config->database->adapter;
    $class = 'Phalcon\Db\Adapter\Pdo\\' . $config->database->adapter;
    $params = [
        'host'     => $config->database->host,
        'username' => $config->database->username,
        'password' => $config->database->password,
        'dbname'   => $config->database->dbname,
        'dialectClass' => new $dialect(),
    ];

    if ($config->database->adapter == 'Postgresql') {
        unset($params['charset']);
    }

    $connection = new $class($params);

    return $connection;
});


/**
 * If the configuration specify the use of metadata adapter use it or use memory otherwise
 */
$di->setShared('modelsMetadata', function () {
    return new MetaDataAdapter();
});

/**
 * Register the session flash service with the Twitter Bootstrap classes
 */
$di->set('flash', function () {
    return new Flash([
        'error'   => 'alert alert-danger',
        'success' => 'alert alert-success',
        'notice'  => 'alert alert-info',
        'warning' => 'alert alert-warning'
    ]);
});

/**
 * Start the session the first time some component request the session service
 */
$di->setShared('session', function () {
    $session = new SessionAdapter();
    $session->start();

    return $session;
});

$di->set(
    'Security',
    function () {
        $component = new Component();

        return $component;
    }
);

$di->set('dispatcher', function() use ($di, $acl) {
    //Obtain the standard eventsManager from the DI// получить стандартный eventsManagerиз DI
    $eventsManager = $di->getShared('eventsManager');
    $session = $di->getShared('session');
    $flash = $di->getShared('flash');

    $security = new Security($di);
    $roles = $security->getRoles();
    
    foreach($roles as $role){
        $regions = json_decode($role->rights->regions);
        $acl->addRole(new Phalcon\Acl\Role($role->value));
        foreach($regions as $region => $actions){
            $acl->addResource(new Phalcon\Acl\Resource($region), $actions);
            foreach($actions as $action){
                $acl->allow($role->value, $region, $action);
                $allowed = $acl->isAllowed($session->get('auth')['role'], $region, $action);
            }
        }
    }

    // Attach a listener for type 'dispatch'
    $eventsManager->attach(
        'dispatch:beforeExecuteRoute',
        function (Event $event, $dispatcher) use ($session, $acl, $flash) {
            $controller = $dispatcher->getControllerName();
            $action = $dispatcher->getActionName();
            if($controller != "") $controller = modifyControllerName($controller);
            if(!$session->get('auth')) $role = 'client';
            else $role = $session->get('auth')['role'];

            $allowed = $acl->isAllowed($role, $controller, $action);
            if (!$allowed) {
                $response = new \Phalcon\Http\Response();
                $response->setStatusCode(403, 'Not Found');
                $response->setContent("Don't have permission");
                $response->send();
                $response->redirect();

                die();
            }
        }
    );

    $dispatcher = new Phalcon\Mvc\Dispatcher();
    $dispatcher->setEventsManager($eventsManager);

    return $dispatcher;
});


class Security extends Phalcon\Mvc\User\Plugin
{
    public function getRoles()
    {
        return Roles::find();
    }
}

function modifyControllerName($name)
{
    $controllerName = '';

    if(count(explode('-', $name)) > 1){
        foreach(explode('-', $name) as $namePart){
            $controllerName .= strtoupper($namePart{0}) . substr($namePart, 1);
        };
    } else {
        $controllerName = strtoupper($name{0}) . substr($name, 1);
    }

    return $controllerName;
}