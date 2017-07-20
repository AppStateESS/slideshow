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

namespace slideshow\Factory;

use slideshow\Resource\SectionResource as Resource;
use phpws2\Database;
use Canopy\Request;

class SectionFactory extends Base
{

    protected function build()
    {
        return new Resource;
    }
    
    public function post(Request $request) {
        $showFactory = new ShowFactory;
        $showId = $request->pullPostInteger('showId');
        $showFactory->load($showId);
        $resource = $this->build();
        $resource->showId = $showId;
        $resource->title = $request->pullPostString('title');
        $resource->sorting = (int)$this->getCurrentSort($showId) + 1;
        $this->saveResource($resource);
        return true;
    }
    
    public function getCurrentSort($showId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('ssSection');
        $tbl->addFieldConditional('showId', $showId);
        $sorting = $tbl->addField('sorting');
        $tbl->addOrderBy('sorting', 'desc');
        $db->setLimit(1);
        return $db->selectColumn();
    }
    
    public function listing($showId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('ssSection');
        $tbl->addFieldConditional('showId', $showId);
        $tbl->addOrderBy('sorting');
        return $db->select();
    }

}
