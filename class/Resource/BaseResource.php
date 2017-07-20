<?php

/**
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 */

namespace slideshow\Resource;

use \phpws2\Database;

class BaseResource extends \phpws2\Resource
{

    public function __set($name, $value)
    {
        if ((!$this->$name->allowNull() ||
                (method_exists($this->$name, 'allowEmpty') && !$this->$name->allowEmpty())) &&
                ( (is_string($value) && $value === '') || is_null($value))) {
            throw new \properties\Exception\MissingInput("$name may not be empty");
        }

        $this->$name->set($value);
    }

    public function __get($name)
    {
        $method_name = self::walkingCase($name, 'get');
        if (method_exists($this, $method_name)) {
            return $this->$method_name();
        } else {
            return $this->$name->get();
        }
    }

}
