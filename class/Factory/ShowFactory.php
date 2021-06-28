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

use slideshow\Resource\ShowResource;
use SlideShow\Factory\SlideFactory;
use phpws2\Database;
use Canopy\Request;

define('SLIDESHOW_MEDIA_DIRECTORY', 'images/slideshow/');

class ShowFactory extends Base
{

    protected function build()
    {
        return new ShowResource;
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
        return $show->id;
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
        $active = $resource->active;
        try {
            $active = $request->pullPutVar('active');
        } catch (\phpws2\Exception\ValueNotSet $e) {
            // putvar was not set for active
        }

        $slideTimer = intval($request->pullPutVarIfSet('slideTimer'));
        // if any of the vars are set to false we don't need to update them.
        if (gettype($title) == "string") {
            $resource->title = $title;
        }

        $resource->active = $active;
        $resource->slideTimer = $slideTimer;
        // Save the updated resource to the Database
        $this->saveResource($resource);
        return $resource;
    }

    /**
     *
     * Creates a new slideshow upon the patch request.
     * @var $showId id of the show to be saved.
     */
    public function patch(Request $request)
    {
        // Pull the id from the request:
        $vars = $request->getRequestVars();
        $showId = intval($vars['Show']);
        $resource = $this->load($showId);

        $title = $request->pullPatchVarIfSet('title');
        if ($title) {
            $resource->title = $title;
        }

        $animation = $request->pullPatchVarIfSet('animation');
        if ($animation) {
            $resource->animation = $animation;
        }

        $active;
        try {
            $active = $request->pullPatchVar('active');
        } catch (\phpws2\Exception\ValueNotSet $e) {
            $active = $resource->active;
        }
        $resource->active = $active;

        $this->saveResource($resource);
        return $resource;
    }

    /**
     * Selects the details about a show from the db
     *
     * @param $show_id
     */
    public static function getDetails($show_id)
    {
        if (empty($show_id)) {
            throw new \Exception("Invalid show id");
        }

        $db = \phpws2\Database::getDB();
        $tbl = $db->addTable('ss_show');
        $tbl->addFieldConditional('id', $show_id);
        $show = $db->selectOneRow();

        return $show;
    }

    public function getShows()
    {
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

    public function getShowDetails($request, $includeInactive = false)
    {
        // Pull the id from the request:
        $vars = $request->getRequestVars();
        $showId = intval($vars['id']);
        if ($showId === null || $showId == -1) {
            throw new \Exception("ShowId is not valid: $showId", 1);
        }
        $db = Database::getDB();
        $tbl = $db->addTable('ss_show');
        $tbl->addFieldConditional('id', $showId);
        if (!$includeInactive) {
            $tbl->addFieldConditional('active', 1);
        }
        return $db->select();
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

    public function delete($showId)
    {
        $returnFlag = true;
        $resource = $this->load($showId);
        if ($resource->preview != null) {
            // this will be set to false if something went wrong
            $returnFlag = $this->deletePreviewImage($showId);
        }
        self::deleteResource($resource);
        return $returnFlag;
    }

    public function postPreviewImage(Request $request)
    {
        $vars = $request->getRequestVars();
        $showId = $vars['id'];
        if (!empty($showId)) {
            $resource = $this->load($showId);
        } else {
            throw new \Exception("Error loading slideId");
        }

        $path = $this->uploadPreview($_FILES['media'], $showId);
        $resource->preview = $path;
        $resource->useThumb = false;
        $this->saveResource($resource);
        return $path;
    }

    public function deletePreviewImage($resourceId)
    {
        $resource = $this->load($resourceId);
        $resource->preview = "";
        $resource->useThumb = false;
        $this->saveResource($resource);

        return $this->deletePreview($resourceId);
    }

    public function setUseThumb($value, $resourceId)
    {
        $value = ($value === 'true' && gettype($value) !== 'boolean') ? true : false;
        $resource = $this->load($resourceId);
        $resource->useThumb = $value;

        $path = '';

        $this->deletePreviewImage($resourceId);

        if ($value) {
            $path = $this->getFirstPreview($resourceId);
        }

        $this->saveResource($resource);
        return $path;
    }

    public function getFirstPreview($resourceId)
    {

        $sql = 'SELECT thumb FROM ss_slide WHERE showId=:resourceId;';
        $db = Database::getDB();
        $pdo = $db->getPDO();
        $query = $pdo->prepare($sql);
        $query->bindParam(':resourceId', $resourceId, \PDO::PARAM_INT);
        $query->execute();
        $result = $query->fetch();
        $path = $result['thumb'];

        return json_decode($path);
    }

    private function uploadPreview(array $file, $resourceId)
    {

        // Check to see if there is a show directory
        $master_dir = PHPWS_HOME_DIR . SLIDESHOW_MEDIA_DIRECTORY . 'show/';
        $resource_dir = $master_dir . $resourceId . '/';
        //isdir($master_dir)
        // Check to see if there is a directory for the resource
        if (is_dir($resource_dir)) {
            // If directory exists then we dump it
            system('rm -rf ' . escapeshellarg($resource_dir), $ret);
            if ($ret != 0)
                throw new Exception('Directory Removal Error: ' . $ret);
        }
        mkdir($resource_dir, 0755, true);

        // upload the image
        $dest = $resource_dir . basename($file['name']);
        if (move_uploaded_file($file['tmp_name'], $dest)) {
            return './' . SLIDESHOW_MEDIA_DIRECTORY . 'show/' . $resourceId . '/' . basename($file['name']);
        } else {
            var_dump($file);
            var_dump($dest);
            return "not uploaded and error occured";
        }
    }

    private function deletePreview($resourceId)
    {
        $dir = PHPWS_HOME_DIR . SLIDESHOW_MEDIA_DIRECTORY . 'show/' . $resourceId . '/';
        system('rm -rf ' . escapeshellarg($dir), $ret);
        if ($ret != 0)
            throw new Exception('Directory Removal Error: ' . $ret);
        else
            return true;
    }

}
