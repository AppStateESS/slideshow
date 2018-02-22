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
use slideshow\Factory\NavBar;

class Admin extends Base
{

    /**
     * @var slideshow\Factory\ShowFactory
     */
    protected $factory;

    public function postCommand(Request $request)
    {
        $show = $this->factory->post($request);
        return array('show'=>$show->getStringVars());
    }

    protected function listHtmlCommand(Request $request)
    {
        $this->createShowButton();
        return $this->factory->scriptView('ShowList');
    }
    
    protected function listJsonCommand(Request $request)
    {
        return array('listing'=>$this->factory->listing(true));
    }

    protected function viewHtmlCommand(Request $request)
    {
        return 'viewHtmlCommand empty';
    }
    
    protected function deleteCommand(Request $request)
    {
        $this->factory->delete($this->id);
    }
    
    protected function putCommand(Request $request)
    {
        $this->factory->put($this->id, $request);
        return true;
    }

    private function createShowButton()
    {
        $nav = new NavBar();
        $create = <<<EOF
<button class="btn btn-success navbar-btn" id="createShow"><i class="fa fa-plus"></i> Create new show</button>
EOF;
        $nav->addItem($create);
    }

}
