<?php
namespace slideshow\Factory;

require_once PHPWS_SOURCE_DIR . 'mod/slideshow/config/react.php';


/**
 * @license http://opensource.org/licenses/lgpl-3.0.html
 * @author Matthew McNaney <mcnaney at gmail dot com>
 */
class React
{

    public static function view($view_name)
    {
        static $vendor_included = false;
        if (!$vendor_included) {
            $script[] = self::getScript('vendor');
            $vendor_included = true;
        }
        $script[] = self::getScript($view_name);
        $react = implode("\n", $script);
        $content = <<<EOF
<div id="$view_name"></div>
$react
EOF;
        return $content;
    }

    public static function getScript($filename)
    {
        $root_directory = PHPWS_SOURCE_HTTP . 'mod/slideshow/javascript/';
        if (SYSTEMS_REACT_DEV) {
            $path = "dev/$filename.js";
        } else {
            $path = "build/$filename.js";
        }
        $script = "<script type='text/javascript' src='{$root_directory}$path'></script>";
        return $script;
    }

}
