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

namespace slideshow\Controller\Show;

use Canopy\Request;

class User extends Base
{

    /**
     * @var \slideshow\Factory\ShowFactory
     */
    protected $factory;

    /**
     * @var slideshow\View\ShowView
     */
    protected $view;

    /**
     * Handles the request to render the list page.
     */
    protected function listHtmlCommand(Request $request)
    {
        return $this->view->show();
    }

    protected function listJsonCommand(Request $request)
    {
        return array('listing' => $this->factory->listing(false));
    }

    /**
     * The user list will not return inactive shows.
     * @param Request $request
     * @return type
     */
    protected function presentJsonCommand(Request $request)
    {
        return $this->factory->getShowDetails($request, false);
    }

}
