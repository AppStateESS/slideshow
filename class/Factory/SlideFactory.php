<?php

/*
* The MIT License
*
* Copyright 2019 Tyler Craig <craigta1@appstate.edu>.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/

namespace slideshow\Factory;

use slideshow\Resource\SlideResource;
use phpws2\Database;
use Canopy\Request;

define('SLIDESHOW_MEDIA_DIRECTORY', 'images/slideshow/');

class SlideFactory extends Base
{

    protected function build()
    {
        return new SlideResource;
    }

    public function get(Request $request)
    {
        $vars = $request->getRequestVars();
        $showId = $vars['id'];

        $slides = $this->getSlides($showId);

        return array(
            'slides' => $slides
        );
    }

    public function post(Request $request)
    {
        $resource = $this->build();

        $resource->showId = $request->pullPostVarIfSet('id');

        $this->saveResource($resource);
        return $resource;
    }

    /**
    * Updates the content of the slide or makes a new one
    * @return SlideResource
    */
    public function put(Request $request)
    {
        // Array to return of all the slideIds
        $ids = array();
        
        // pull showId from $request
        $vars = $request->getRequestVars();
        $showId = intval($vars['Slide']);

        $slides = $request->pullPutVar('slides');

        $slideIndex = 0;
        foreach ($slides as $slide) {
            $resource;
            if (empty($slide['slideId'])) {
                $resource = $this->build();
            }
            else {
                $resource = $this->load(intval($slide['slideId']));
            }

            $resource->showId = $showId;
            $resource->slideIndex = $slideIndex;
            $resource->content = "";
            $isQuiz = $slide['isQuiz'] == 'true' ? true : false;
            $resource->isQuiz = $isQuiz;
            if ($isQuiz) {
                if (!empty($slide['quizContent'])) {
                    $resource->content = $slide['quizContent'];
                }
            }
            else {
                if (!empty($slide['saveContent'])) {
                    $resource->content = $slide['saveContent'];
                }
            }
            $resource->backgroundColor = $slide['backgroundColor'];
            $resource->media = "";
            if (!empty($slide['media'])) {    
                $resource->media = json_encode($slide['media']);
            }
            $this->saveResource($resource);
            array_push($ids, $resource->id);
            $slideIndex++;
        }
        return $ids;
    }

    public function postImage(Request $request)
    {
        $resourceId = intval($request->pullPostVar('slideId'));

        try {
            $resource = $this->load($resourceId);
        }
        catch (\Exception $e) {
            // Resource doesn't exist
            $resource = $this->build();
            $this->saveResource($resource);
            $resourceId = $resource->id;
        }
        

        $path = $this->upload($_FILES['media'], $resourceId);
        if ($path != null) {
            $media = array('imgUrl' => $path, 'align' => 'right');
            $resource->media = json_encode($media);
        }
        $this->saveResource($resource);
        return $path;
    }

    /**
    * This function handles the deletion of slides
    * @return boolean true if slide was deleted
    */
    public function deleteSlide(Request $request)
    {
        $resourceId = $request->pullDeleteVar('slideId');
        $resource = $this->load($resourceId);

        // If there is media associated with an image then we remove it
        if (strlen($resource->media) > 0) {
            try {
                $this->deleteImage($request);
            }
            catch (\Exception $e) {
                echo("A fatal error has occured: " . $e);
            }
        }

        return ($this->deleteResource($resource) != 0);
    }

    /**
     * Removes all slides associated with a specfic slideId that is within the request
     * @param \Canopy\Request request data
     * @return boolean true if deletion was successful
     */
    public function deleteAll(Request $request)
    {
        // Remove all slides comes from Showlist
        $vars = $request->getRequestVars();
        $showId = intval($vars['Slide']);

        if (!$this->deleteAllImages($request)) echo("an error has occured\n");

        $sql = 'DELETE from ss_slide WHERE showId=:showId;';
        $db = Database::getDB();
        $pdo = $db->getPDO();
        $q = $pdo->prepare($sql);
        return $q->execute(array('showId'=>$showId));
    }

    /**
     * Deletes an image given a deletion request with slideId
     * @return boolean true if deletion was successful
     */
    public function deleteImage(Request $request)
    {
        $resourceId = $request->pullDeleteVar('slideId');
        $resource = $this->load($resourceId);
        $media = json_decode($resource->media);
        if ($this->removeUpload($resourceId, $media->imgUrl)) {
            $resource->media = "";
            $this->saveResource($resource);
            return true;
        }
        return false;
    }

    /**
     * Deletes all images within a specific slideshow given a deletion request with slideId
     * @return boolean true if deletion was successful
     */
    public function deleteAllImages(Request $request) {
        
        $vars = $request->getRequestVars();
        $showId = intval($vars['Slide']);

        $sql = 'SELECT id, media from ss_slide WHERE showId=:showId;';
        $db = Database::getDB();
        $pdo = $db->getPDO();
        $q = $pdo->prepare($sql);
        $q->execute(array('showId'=>$showId));
        if (!$q) return false;
        $paths = $q->fetchAll();
        $flag = false;
        foreach ($paths as $path) {
            $media = json_decode($path['media']);
            $flag = $this->removeUpload($path['id'], $media->imgUrl);
            if (!$flag) return false; // An error occured
        }
        return true;
    }

    /**
    * Returns the slide of the show corresponding to the showId
    * @var integer showId
    * @return array of slides
    */
    private function getSlides($showId)
    {
        $sql = 'SELECT * FROM ss_slide WHERE showId=:showId ORDER BY ss_slide.slideIndex;';
        $db = Database::getDB();
        $pdo = $db->getPDO();
        $q = $pdo->prepare($sql);
        $q->execute(array('showId'=>$showId));
        $slides = $q->fetchAll();
        return $slides;
    }

    private function upload(array $file, $slideId)
    {
        $target = SLIDESHOW_MEDIA_DIRECTORY . $slideId . '/';
        $dir = PHPWS_HOME_DIR . $target;
        $dest = $dir . basename($file['name']);

        if (is_dir($dir))
        {
            // This means there is alredy an image stored at this location so we need to remove it
            // I do this by removing the entire directory
            system('rm -rf ' . escapeshellarg($dir), $ret);
            if ($ret != 0) throw new Exception('Directory Removal Error: ' . $ret);
        }
        mkdir($dir, 0755, true);

        if (move_uploaded_file($file['tmp_name'], $dest)) {
            return './' . $target .  basename($file['name']);
        }
        else {
            echo("not uploaded and error occured");
            var_dump($file);
            var_dump($target);
        }
        return null;
    }

    private function removeUpload($slideId, $path) {
        if (empty($path)) {
            return false;
        }
        try {
            unlink($path);
            $dir = SLIDESHOW_MEDIA_DIRECTORY . $slideId . '/';
            rmdir($dir);
            return true;
        }
        catch (\Exception $e) {
            echo("A fatal error has occured: " . $e);
            // uncomment to show stacktrace as an array
            // var_dump($e);
        }
        return false;
    }

}
