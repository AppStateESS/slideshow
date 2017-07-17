<?php

/**
 * @author Matthew McNaney <mcnaneym at appstate dot edu>
 */

namespace slideshow;

use slideshow\Factory\NavBar;

require_once PHPWS_SOURCE_DIR . 'src/Module.php';

class Module extends \Canopy\Module implements \Canopy\SettingDefaults
{

    public function __construct()
    {
        parent::__construct();
        $this->setTitle('slideshow');
        $this->setProperName('SlideShow');
        spl_autoload_register('\slideshow\Module::autoloader', true, true);
    }

    public function getSettingDefaults()
    {
        $settings = array();
        return $settings;
    }

    public function getController(\Canopy\Request $request)
    {
        try {
            $controller = new Controller\BaseController($this, $request);
            return $controller;
        } catch (\Exception $e) {
            // friendly message here?
            throw $e;
        }
    }

    private function friendlyController()
    {
        $error_controller = new Controller\FriendlyError($this);
        return $error_controller;
    }

    public function afterRun(\Canopy\Request $request,
            \Canopy\Response $response)
    {
        if ($request->isGet() && !$request->isAjax() && \Current_User::allow('slideshow')) {
            \slideshow\Factory\NavBar::view($request);
        }
    }

    public function runTime(\Canopy\Request $request)
    {
        $cssDir = './mod/slideshow/css/';
        \Layout::addJSHeader("<link rel='stylesheet' href='{$cssDir}component.css'>");
        if ($request->isGet() && !$request->isAjax() && \Current_User::allow('slideshow')) {
            if (!preg_match('/^slideshow/', \Canopy\Server::getCurrentUrl())) {
                \slideshow\Factory\NavBar::view($request);
            }
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
