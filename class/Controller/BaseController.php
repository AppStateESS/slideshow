<?php

/*
 * See docs/AUTHORS and docs/COPYRIGHT for relevant info.
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * @author Matthew McNaney <mcnaney at gmail dot com>
 *
 * @license http://opensource.org/licenses/lgpl-3.0.html
 */

namespace slideshow\Controller;

class BaseController extends \phpws2\Http\Controller
{
    protected $role;
    protected $controller;

    public function __construct($module, $request)
    {
        parent::__construct($module);
        $this->loadRole();
        $this->loadController($request, $this->role);
    }

    public function htmlResponse($content)
    {
        $view = new \phpws2\View\HtmlView($content);
        $response = new \Canopy\Response($view);
        return $response;
    }

    public function jsonResponse($json)
    {
        $view = new \phpws2\View\JsonView($json);
        $response = new \Canopy\Response($view);
        return $response;
    }
    

    private function loadController(\Canopy\Request $request)
    {
        $major_controller = filter_var($request->shiftCommand(),
                FILTER_SANITIZE_STRING);

        if (empty($major_controller)) {
            \Canopy\Server::forward('./slideshow/Show');
        }

        if (empty($major_controller)) {
            throw new \slideshow\Exception\BadCommand;
        }

        $role_name = substr(strrchr(get_class($this->role), '\\'), 1);
        $controller_name = '\\slideshow\\Controller\\' . $major_controller . '\\' . $role_name;
        if (!class_exists($controller_name)) {
            throw new \slideshow\Exception\BadCommand;
        }
        $this->controller = new $controller_name($this->role);
    }

    protected function loadRole()
    {
        // Only students will be able to log in. Admins
        // will meet first conditional.
        $user_id = \Current_User::getId();
        if (\Current_User::allow('slideshow')) {
            $this->role = new \slideshow\Role\Admin($user_id);
        } elseif ($user_id) {
            $this->role = new \slideshow\Role\Logged($user_id);
        } else {
            $this->role = new \slideshow\Role\User;
        }
    }

    public function execute(\Canopy\Request $request)
    {
        try {
            return parent::execute($request);
        } catch (\Exception $e) {
            // Friendly error catch here if needed.
            throw $e;
        }
    }

    public function post(\Canopy\Request $request)
    {
        return $this->controller->post($request);
    }

    public function patch(\Canopy\Request $request)
    {
        return $this->controller->patch($request);
    }

    public function delete(\Canopy\Request $request)
    {
        return $this->controller->delete($request);
    }

    public function put(\Canopy\Request $request)
    {
        return $this->controller->put($request);
    }

    public function get(\Canopy\Request $request)
    {
        if ($request->isAjax()) {
            $result = $this->controller->getJson($request);
        } else {
            \Layout::addStyle('slideshow');
            $result = $this->controller->getHtml($request);
        }
        return $result;
    }

    public function friendlyError(\Canopy\Request $request, $message = null)
    {
        $fe = new FriendlyError($this->getModule());
        if ($message) {
            $fe->setMessage($message);
        }
        return $fe->execute($request);
    }

}
