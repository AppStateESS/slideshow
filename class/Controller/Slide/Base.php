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
 * @author Tyler Craig <craigta1 at appstate dot edu>
 *
 * @license http://opensource.org/licenses/lgpl-3.0.html
 */

namespace slideshow\Controller\Slide;

use Canopy\Request;
use slideshow\Factory\SlideFactory as Factory;
use slideshow\View\SlideView as View;
use slideshow\Controller\RoleController;

class Base extends RoleController
{

    /**
     * @var \slideshow\Factory\SlideFactory
     */
    protected $factory;

    /**
     * @var \slideshow\View\SlideView
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

    /**
     * Renders the view for present
     */
    protected function presentHtmlCommand(Request $request)
    {
        return $this->view->present();
    }

    protected function presentJsonCommand(Request $request)
    {
        return $this->factory->get($request);
    }

    protected function editHtmlCommand(Request $request)
    {
        \Current_User::requireLogin();
    }

}
