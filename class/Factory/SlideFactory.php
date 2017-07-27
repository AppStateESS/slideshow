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

    public function listing($sectionId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('ssSlide');
        $tbl->addFieldConditional('sectionId', $sectionId);
        $db->select();
    }

    public function handlePicturePost($sectionId)
    {
        if (!isset($_FILES) || empty($_FILES)) {
            return array('error' => 'No files uploaded');
        }
        $picture = $_FILES['picture'];

        try {
            $size = getimagesize($picture['tmp_name']);
            $result['width'] = $size[0];
            $result['height'] = $size[1];
            $result['path'] = $this->moveImage($picture, $sectionId);
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

    public function moveImage($pic, $sectionId)
    {
        if ($pic['error'] !== 0) {
            throw new \Exception('Upload error');
        }

        if (!in_array($pic['type'],
                        array('image/jpeg', 'image/gif', 'image/png'))) {
            throw new \properties\Exception\WrongImageType;
        }
        $dest = $this->saveDirectory . $sectionId . '/';
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

    /**
     * Creates an EMPTY slide. Information is added in the PUT.
     * @param \slideshow\Factory\Request $request
     */
    public function post(Request $request)
    {
        $slide = $this->build();
        $slide->sectionId = $request->pullPostInteger('sectionId');
        $slide->title = ' ';
        $slide->content = ' ';
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
        $this->deleteImageDirectory($slide);
    }

    public function deleteImageDirectory($slide)
    {
        $path = $slide->getImagePath();
        \phpws\PHPWS_File::rmdir($path);
    }

    public function createImageDirectory($slide)
    {
        $path = $slide->getImagePath();
        if (!is_dir($path)) {
            mkdir($path);
        }
    }
}
