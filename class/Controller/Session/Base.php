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

namespace slideshow\Controller\Session;

use Canopy\Request;
use slideshow\Factory\SessionFactory as Factory;
use slideshow\View\SessionView as View;
use slideshow\Controller\RoleController;

class Base extends RoleController
{

    /**
     * @var slideshow\Factory\SessionFactory
     */
    protected $factory;

    /**
     * @var slideshow\View\SessionView
     */
    protected $view;

    protected function loadFactory()
    {
        $this->factory = new Factory;
    }

    protected function loadView()
    {
        $this->view = new View;
    }

}
