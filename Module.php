<?php

/**
 * @author Matthew McNaney <mcnaneym at appstate dot edu>
 */

namespace slideshow;

use slideshow\Factory\NavBar;
use slideshow\Factory\Home;
use Canopy\Request;
use Canopy\Response;
use Canopy\Server;

require_once PHPWS_SOURCE_DIR . 'src/Module.php';

class Module extends \Canopy\Module implements \Canopy\SettingDefaults
{

    public function __construct()
    {
        parent::__construct();
        $this->loadDefines();
        $this->setTitle('slideshow');
        $this->setProperName('Slideshow');
        spl_autoload_register('\slideshow\Module::autoloader', true, true);
    }

    public function getSettingDefaults()
    {
        $settings = array();
        return $settings;
    }

    public function getController(Request $request)
    {
        try {
            if (!\Current_User::isLogged()) {
              \Current_User::requireLogin();
            }
            $controller = new Controller\BaseController($this, $request);
            return $controller;
        } catch (\Exception $e) {
            if (SS_FRIENDLY_ERROR) {
                \phpws2\Error::log($e);
                echo \Layout::wrap('<div class="jumbotron"><h1>Uh oh...</h1><p>An error occurred with Slideshow.</p></div>', 'Slideshow Error', true);
                exit();
            } else {
                throw $e;
            }
        }
    }

    private function friendlyController()
    {
        $error_controller = new Controller\FriendlyError($this);
        return $error_controller;
    }

    public function afterRun(Request $request, Response $response)
    {
        if (!\PHPWS_Core::atHome()) {
            \Layout::addStyle('slideshow');
            $this->showNavBar($request);
        }
    }

    private function loadDefines()
    {
        $dist = PHPWS_SOURCE_DIR . 'mod/slideshow/config/defines.dist.php';
        $custom = PHPWS_SOURCE_DIR . 'mod/slideshow/config/defines.php';
        if (is_file($custom)) {
            require_once $custom;
        } else {
            require_once $dist;
        }
    }

    public function runTime(Request $request)
    {
        if (\PHPWS_Core::atHome()) {
            if (\Current_User::isLogged()) {
                Server::forward('./slideshow/Show/');
            }
            $content = Home::view();
            \Layout::add($content);
        } 
        else if ($request->getModule() !== 'slideshow') {
            // PHPCORE::atHome
            $this->showNavBar($request);
        }
    }

    private function showNavBar(Request $request)
    {
        if ($request->isGet() && !$request->isAjax()) {
            NavBar::view($request);
        }
    }


    public static function autoloader($class_name)
    {
        static $not_found = array();

        if (strpos($class_name, 'slideshow') !== 0) {
            return;
        }

        if (isset($not_found[$class_name])) {
            return;
        }
        $class_array = explode('\\', $class_name);
        array_shift($class_array);
        $class_dir = implode('/', $class_array);

        $class_path = PHPWS_SOURCE_DIR . 'mod/slideshow/class/' . $class_dir . '.php';
        if (is_file($class_path)) {
            require_once $class_path;
            return true;
        } else {
            $not_found[] = $class_name;
            return false;
        }
    }

}
