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

namespace slideshow\Controller\Decision;

use Canopy\Request;
use slideshow\Factory\NavBar;

class Admin extends Base
{

    /**
     * @var \slideshow\Factory\DecisionFactory
     */
    protected $factory;

    protected function createPostCommand(Request $request)
    {
        $slideId = $request->pullPostInteger('slideId');
        $decision = $this->factory->build();
        $decision->title = '';
        $decision->slideId = $slideId;
        $decision->sorting = $this->factory->getCurrentSort($slideId) + 1;
        $this->factory->save($decision);
        return $decision->getStringVars(true);
    }

    protected function jsonPatchCommand(Request $request)
    {
        $this->factory->patch($this->id, $request->pullPatchString('varname'),
                $request->pullPatchVar('value'));
        $json['success'] = true;
        return $json;
    }
    
    protected function deleteCommand(Request $request)
    {
        $this->factory->delete($this->id);
        $json['success'] = true;
        return $json;
    }
    
    protected function updatePutCommand(Request $request)
    {
        $this->factory->put($this->id, $request);
    }

}
