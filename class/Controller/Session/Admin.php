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

namespace slideshow\Controller\Session;

use Canopy\Request;
use slideshow\Factory\SessionFactory;
use slideshow\View\SessionView;

class Admin extends Base
{
    /**
     * @var slideshow\Factory\SessionFactory
     */
    protected $factory;

    /**
     * @var slideshow\View\SessionView
     */
    protected $view;

    /*
    * This does nothing because if we are an admin we are demoing the show
    */
    protected function putCommand($request)
    {
        return true;
    }

    /*
    * This does nothing because if we are an admin we are demoing the show
    */
    protected function viewJsonCommand($request)
    {
        return true;
    }

    protected function tableHtmlCommand($request)
    {
        return $this->view->sessionTable();
    }

    protected function allJsonCommand($request)
    {
        $sessionData = $this->factory->getAll($request);
        return $sessionData;
    }

}
