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

    public function post(Request $request)
    {
        $show = $this->build();
        // Pulls the title from the Post request if it's changed then it will be saved.
        $show->title = $request->pullPostString('title');
        $show->active = 0;
        //$show->content = [];
        $this->saveResource($show);
        //$this->createImageDirectory($show);
        return $show;
    }

    public function put(Request $request)
    {
      // Pull the id from the request:
      $vars = $request->getRequestVars();
      $id = intval($vars['Show']);
      // Load the resource corresponding to the id from the db:
      $resource = $this->load($id);

      // Update/PUT the values that are changed:
      // pullPutVarIfSet will return false if not set
      $title = $request->pullPutVarIfSet('title');
      $active = $request->pullPutVarIfSet('active');
      $content = $request->pullPutVarIfSet('content');
      // if any of the vars are set to false we don't need to update them.
      if (gettype($title) == "string") {
        $resource->title = $title;
      }
      $resource->active = $active;
      if (gettype($content) != "boolean") {
        $resource->content = json_encode($content);
      }
      // Save the updated resource to the Database
      $this->saveResource($resource);
      return $resource;
    }
    /**
    *
    * Creates a new slideshow upon the patch request.
    * @var $showId id of the show to be saved.
    */
    public function patch($showId, Request $request)
    {
      $resource = $this->load($showId);
      $resource->title = $request->pullPatchVarIfSet('title');
      $resource->active = $request->pullPatchVarIfSet('active');
      $resource->content = $request->pullPatchVarIfSet('content');
      $this->saveResource($resource);
      return $resource;
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

    /**
     *
     * Returns the data for the slideshow contained from the $content var.
     * @var $showId the id for the slideshow
     */
    public function getSlides($showId)
    {
      if ($showId == null || $showId == -1) {
        throw new \Exception("ShowId is not valid: $showId", 1);
      }
      $sql = "SELECT content FROM ss_show WHERE id=:showId;";
      $db = Database::getDB();
      $pdo = $db->getPDO();
      $q = $pdo->prepare($sql);
      $q->execute(array('showId'=>$showId));
      $data = $q->fetchColumn(0);
      return json_decode($data);
    }

    public function getShowName($showId)
    {
      if ($showId == null || $showId == -1) {
        throw new \Exception("ShowId is not valid: $showId", 1);
      }
      $sql = "SELECT title FROM ss_show WHERE id=:showId;";
      $db = Database::getDB();
      $pdo = $db->getPDO();
      $q = $pdo->prepare($sql);
      $q->execute(array('showId'=>$showId));
      $title = $q->fetchColumn(0);
      return $title;
    }

    public function listing($showAll = false)
    {
        $db = \phpws2\Database::getDB();
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
