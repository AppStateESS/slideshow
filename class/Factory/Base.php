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

}
