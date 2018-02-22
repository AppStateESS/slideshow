<?php

namespace slideshow\Factory;

use slideshow\Exception\ResourceNotFound;
use phpws2\Settings;
use phpws2\Database;
use Canopy\Request;

/**
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 */
abstract class Base extends \phpws2\ResourceFactory
{

    abstract protected function build();

    public function load($id)
    {
        if (empty($id)) {
            throw new \slideshow\Exception\ResourceNotFound;
        }
        $resource = $this->build();
        $resource->setId($id);
        if (!parent::loadByID($resource)) {
            throw new ResourceNotFound($id);
        }
        return $resource;
    }

    protected function walkingCase($name)
    {
        if (stripos($name, '_')) {
            return preg_replace_callback('/^(\w)(\w*)_(\w)(\w*)/',
                    function($letter) {
                $str = strtoupper($letter[1]) . $letter[2] . strtoupper($letter[3]) . $letter[4];
                return $str;
            }, $name);
        } else {
            return ucfirst($name);
        }
    }

    private function getScript($filename)
    {
        $root_directory = PHPWS_SOURCE_HTTP . 'mod/slideshow/javascript/';
        if (SLIDESHOW_REACT_DEV) {
            $path = "dev/$filename.js";
        } else {
            $path = "build/$filename.js";
        }
        $script = "<script type='text/javascript' src='{$root_directory}$path'></script>";
        return $script;
    }

    public function scriptView($view_name, $add_anchor = true, $vars = null)
    {
        static $vendor_included = false;
        if (!$vendor_included) {
            $script[] = $this->getScript('vendor');
            $vendor_included = true;
        }
        if (!empty($vars)) {
            $script[] = $this->addScriptVars($vars);
        }
        $script[] = $this->getScript($view_name);
        $react = implode("\n", $script);
        if ($add_anchor) {
            $content = <<<EOF
<div id="$view_name"></div>
$react
EOF;
            return $content;
        } else {
            return $react;
        }
    }

    private function addScriptVars($vars)
    {
        if (empty($vars)) {
            return null;
        }
        foreach ($vars as $key => $value) {
            $varList[] = "const $key = '$value';";
        }
        return '<script type="text/javascript">' . implode('', $varList) . '</script>';
    }

    protected function getRootDirectory()
    {
        return PHPWS_SOURCE_DIR . 'mod/slideshow/';
    }

    protected function getRootUrl()
    {
        return PHPWS_SOURCE_HTTP . 'mod/slideshow/';
    }

    private function getAssetPath($scriptName)
    {
        $rootDirectory = $this->getRootDirectory();
        if (!is_file($rootDirectory . 'assets.json')) {
            exit('Missing assets.json file. Run npm run prod in stories directory.');
        }
        $jsonRaw = file_get_contents($rootDirectory . 'assets.json');
        $json = json_decode($jsonRaw, true);
        if (!isset($json[$scriptName]['js'])) {
            throw new \Exception('Script file not found among assets.');
        }
        return $json[$scriptName]['js'];
    }

}
