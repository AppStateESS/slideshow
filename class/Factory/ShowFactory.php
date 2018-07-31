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
 * @author Tyler Craig <craigta1 at appstate dot edu>
 *
 * @license http://opensource.org/licenses/lgpl-3.0.html
 */

namespace slideshow\Factory;

use slideshow\Resource\ShowResource as Resource;
use phpws2\Database;
use Canopy\Request;

class ShowFactory extends Base
{

    protected function build()
    {
        return new Resource;
    }

    /**
    * Selects the details about a show from the db
    *
    * @param $show_id
    */
    public static function getDetails($show_id) {
      if (empty($show_id)) {
        throw new \Exception("Invalid show id");
      }

      $db = \phpws2\Database::getDB();
      $tbl = $db->addTable('ss_show');
      $tbl->addFieldConditional('id', $show_id);
      $show = $db->selectOneRow();

      return $show;
    }

    public function getShows() {
      $db = \phpws2\Database::getDB();
      $tbl = $db->addTable('ss_show');
      $shows = $db->fetchAll();

      return $shows;
    }

    /**
     *
     * @param slideshow\Resource\ShowResource $show
     */
    public function createImageDirectory($show)
    {
        $path = $show->getImagePath();
        if (!is_dir($path)) {
            mkdir($path);
        }
    }

    public function post(Request $request)
    {
        $show = $this->build();
        $show->title = $request->pullPostString('title');
        $show->active = 0;
        $this->saveResource($show);
        //$this->createImageDirectory($show);
        return $show;
    }

    public function put($showId, Request $request)
    {
        $resource = $this->load($showId);
        $resource->title = $request->pullPutString('title');
        $resource->active = $request->pullPutString('active');
        $this->saveResource($resource);
        return $resource;
    }

    public function listing($showAll = false)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('ss_show');
        $tbl->addOrderBy('title');
        if (!$showAll) {
            $tbl->addFieldConditional('active', 1);
        }
        return $db->select();
    }

    public function view($id)
    {
        $template = new \phpws2\Template();
        $template->setModuleTemplate('slideshow', 'Show/view.html');
        return $template->get();
    }

    public function deleteSlides($showId)
    {
        $db = Database::getDB();
    }

    public function delete($showId)
    {
        $this->deleteSlides($showId);
        self::deleteResource($this->load($showId));
        return true;
    }

}
