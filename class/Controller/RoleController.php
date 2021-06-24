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

use slideshow\Exception\BadCommand;
//use slideshow\Factory\NavBar;
use phpws2\Database;
use Canopy\Request;

abstract class RoleController
{

    protected $factory;
    protected $view;
    protected $role;
    protected $id;

    abstract protected function loadFactory();

    abstract protected function loadView();

    public function __construct($role)
    {
        $this->loadFactory();
        $this->loadView();
        $this->role = $role;
    }

    /**
     * Returns the current get command
     * Defaults to a "view" command if an id is set and
     * "list" if otherwise.
     * @param Request $request
     * @return string
     */
    protected function pullGetCommand(Request $request)
    {
        $command = $request->shiftCommand();
        if (is_numeric($command)) {
            $this->id = $command;

            $subcommand = $request->shiftCommand();
            if (empty($subcommand)) {
                $command = 'view';
            } else {
                return $subcommand;
            }
        } else if (empty($command)) {
            $command = 'list';
        }
        return $command;
    }

    public function post(Request $request)
    {
        $command = $request->shiftCommand();

        if (empty($command)) {
            $method_name = 'postCommand';
        } else {
            $method_name = $command . 'PostCommand';
        }
        if (!method_exists($this, $method_name)) {
            throw new BadCommand($this->role->getName() . ':' . $method_name);
        }

        $content = $this->$method_name($request);

        if ($request->isAjax()) {
            return $this->jsonResponse($content);
        } else {
            return $this->htmlResponse($content);
        }
    }

    /**
     * Loads the EXPECTED id from the url into the object.
     * If the id is not there, the command fails
     */
    protected function loadRequestId(Request $request)
    {
        $id = $request->shiftCommand();
        if (!is_numeric($id)) {
            $vars = $request->getRequestVars();
            if (empty($vars['id'])) {
                throw new \slideshow\Exception\MissingRequestId($id);
            } else {
                $this->id = intval($vars['id']);
            }
        } else {
            $this->id = $id;
        }
    }

    public function put(Request $request)
    {
        $this->loadRequestId($request);

        $command = $request->shiftCommand();
        if (empty($command)) {
            $method_name = 'putCommand';
        } else {
            $method_name = $command . 'PutCommand';
        }

        if (!method_exists($this, $method_name)) {
            throw new BadCommand($this->role->getName() . ':' . $method_name);
        }

        $content = $this->$method_name($request);

        if ($request->isAjax()) {
            return $this->jsonResponse($content);
        } else {
            return $this->htmlResponse($content);
        }
    }

    public function getHtml(Request $request)
    {
        $command = $this->pullGetCommand($request);

        $method_name = $command . 'HtmlCommand';
        if (!method_exists($this, $method_name)) {
            if ($this->id && method_exists($this, 'viewHtmlCommand')) {
                $method_name = 'viewHtmlCommand';
            } else {
                throw new BadCommand($this->role->getName() . ':' . $method_name);
            }
        }

        $content = $this->$method_name($request);

        return $this->htmlResponse($content);
    }

    public function getJson(Request $request)
    {
        $command = $this->pullGetCommand($request);

        if (empty($command)) {
            throw new BadCommand;
        }

        $method_name = $command . 'JsonCommand';

        if (!method_exists($this, $method_name)) {
            throw new BadCommand($this->role->getName() . ':' . $method_name);
        }

        $json = $this->$method_name($request);
        return $this->jsonResponse($json);
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

    public function patch(Request $request)
    {
        $this->loadRequestId($request);

        $patch_command = $request->shiftCommand();
        if (empty($patch_command)) {
            $patch_command = $request->isAjax() ? 'jsonPatchCommand' : 'htmlPatchCommand';
        } else {
            $patch_command .= 'PatchCommand';
        }

        if (!method_exists($this, $patch_command)) {
            throw new BadCommand($patch_command);
        }

        $json = $this->$patch_command($request);
        return $this->jsonResponse($json);
    }

    public function delete(Request $request)
    {
        $this->loadRequestId($request);

        if (!method_exists($this, 'deleteCommand')) {
            throw new BadCommand($this->role->getName() . ':' . 'deleteCommand');
        }

        $content = $this->deleteCommand($request);

        return $this->jsonResponse($content);
    }

    public function getResponse($content, Request $request)
    {
        return $request->isAjax() ? $this->jsonResponse($content) : $this->htmlResponse($content);
    }

}
