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

use slideshow\Resource\SlideResource as Resource;
use phpws2\Database;
use Canopy\Request;

class SlideFactory extends Base
{

    private $saveDirectory = './images/slideshow/';

    protected function build()
    {
        return new Resource;
    }

    /**
     * 
     * @param integer $id
     * @return \slideshow\Resource\SlideResource
     */
    public function load($id)
    {
        return parent::load($id);
    }

    public function listing($showId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('ss_slide');
        $tbl->addFieldConditional('showId', $showId);
        $tbl->addOrderBy('sorting');
        return $db->select();
    }

    public function listingWithDecisions($sectionId)
    {
        $slides = $this->listing($sectionId);
        if (empty($slides)) {
            return null;
        }
        $dFactory = new DecisionFactory;
        foreach ($slides as &$slide) {
            $slide['decisions'] = $dFactory->listing($slide['id']);
            /*
              $decisions = $dFactory->listing($slide['id']);
              if (empty($decisions)) {
              $slide['decisions'] = null;
              } else {
              $slide['decisions'] = $decisions;
              }
             * 
             */
        }
        return $slides;
    }

    public function handlePicturePost($slideId)
    {
        if (!isset($_FILES) || empty($_FILES)) {
            return array('error' => 'No files uploaded');
        }
        $picture = $_FILES['picture'];
        $slide = $this->load($slideId);
        try {
            $size = getimagesize($picture['tmp_name']);
            $result['width'] = $size[0];
            $result['height'] = $size[1];
            $result['path'] = $this->moveImage($picture, $slide);
            $result['success'] = true;
        } catch (properties\Exception\FileSaveFailure $e) {
            $result['success'] = false;
            $result['error'] = $e->getMessage();
        } catch (properties\Exception\WrongImageType $e) {
            $result['success'] = false;
            $result['error'] = $e->getMessage();
        } catch (\Exception $e) {
            $result['success'] = false;
            $result['error'] = $e->getMessage();
        }
        return $result;
    }

    public function moveImage($pic, Resource $slide)
    {
        if ($pic['error'] !== 0) {
            throw new \Exception('Upload error');
        }

        if (!in_array($pic['type'],
                        array('image/jpeg', 'image/gif', 'image/png'))) {
            throw new \properties\Exception\WrongImageType;
        }
        $dest = $slide->getImagePath();
        if (!is_dir($dest)) {
            if (!mkdir($dest, 0755)) {
                throw new \Exception('Could not create directory');
            }
        }

        $file_name = rand() . time() . '.' . \phpws\PHPWS_File::getFileExtension($pic['name']);
        $path = $dest . $file_name;
        if (!move_uploaded_file($pic['tmp_name'], $path)) {
            throw new properties\Exception\FileSaveFailure($path);
        }
        return $path;
    }

    public function getCurrentSort($showId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('ss_slide');
        $tbl->addFieldConditional('showId', $showId);
        $sorting = $tbl->addField('sorting');
        $tbl->addOrderBy('sorting', 'desc');
        $db->setLimit(1);
        return $db->selectColumn();
    }

    /**
     * Creates an EMPTY slide. Information is added in the PUT.
     * @param \slideshow\Factory\Request $request
     */
    public function post(Request $request)
    {
        $slide = $this->build();
        $slide->showId = $request->pullPostInteger('showId');
        $slide->content = '<p>Content...</p>';
        $currentSort = $this->getCurrentSort($slide->showId);
        if ($currentSort === false) {
            $nextSort = 0;
        } else {
            $nextSort = $currentSort + 1;
        }
        $slide->sorting = $nextSort;
        $this->createImageDirectory($slide);
        return $slide;
    }

    public function save(Resource $slide)
    {
        self::saveResource($slide);
        return $slide->id;
    }

    public function delete($slideId)
    {
        $slide = $this->load($slideId);
        self::deleteResource($slide);
        $sortable = new \phpws2\Sortable('ss_slide', 'sorting');
        $sortable->startAtZero();
        $sortable->setAnchor('sectionId', $slide->sectionId);
        $sortable->reorder();

        $this->deleteImageDirectory($slide);
    }

    public function deleteImageDirectory($slide)
    {
        $path = $slide->getImagePath();
        \phpws\PHPWS_File::rmdir($path);
    }

    /**
     * 
     * @param slideshow\Resource\SlideResource $slide
     */
    public function createImageDirectory($slide)
    {
        $path = $slide->getImagePath();
        if (!is_dir($path)) {
            mkdir($path);
        }
    }

    public function clearBackgroundImage($slideId)
    {
        /* @var $slide \slideshow\Resource\SlideResource */
        $slide = $this->load($slideId);
        if (is_file($slide->backgroundImage)) {
            unlink($slide->backgroundImage);
        }
        $slide->backgroundImage = null;
        $this->save($slide);
    }

    public function patch($id, $param, $value)
    {
        static $allowed_params = array('delay', 'sorting', 'title', 'content', 'backgroundImage');

        if (!in_array($param, $allowed_params)) {
            throw new \Exception('Parameter may not be patched');
        }
        $slide = $this->load($id);
        $slide->$param = $value;
        $this->save($slide);
        return true;
    }

    public function getDecisions(Resource $slide)
    {
        $dFactory = new DecisionFactory;
        return $dFactory->listing($slide->id);
    }

    public function sort($slide, $new_position)
    {
        $sortable = new \phpws2\Sortable('ss_slide', 'sorting');
        $sortable->startAtZero();
        $sortable->setAnchor('sectionId', $slide->sectionId);
        $sortable->moveTo($slide->getId(), $new_position);
    }

}
