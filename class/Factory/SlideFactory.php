<?php

/*
* The MIT License
*
* Copyright 2020 Tyler Craig <craigta1@appstate.edu>.
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
            $resource = null;
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
                $resource->quizId = $slide['quizId'];
            }
            else {
                if (!empty($slide['saveContent'])) {
                    $resource->content = $slide['saveContent'];
                }
            }
            $resource->background = $slide['background'];
            $resource->media = "";
            if (!empty($slide['media'])) {    
                $resource->media = json_encode($slide['media']);
            }
            $resource->thumb = "";
            if (!empty($slide['thumb'])) {
                $resource->thumb = json_encode($slide['thumb']);
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
        
        $target = $resourceId . '/media/';

        $path = $this->upload($_FILES['media'], $target);
        if ($path != null) {
            $media = array('imgUrl' => $path, 'align' => 'right');
            $resource->media = json_encode($media);
        }
        $this->saveResource($resource);
        return $path;
    }

    public function postThumb(Request $request)
    {
        $resourceId = intval($request->pullPostVar('slideId'));
        try {
            $resource = $this->load($resourceId);
        }
        catch (\Exception $e) {
            // Resource doesn't exist
            //$resource = $this->build();
            //$this->saveResource($resource);
            //$resourceId = $resource->id;
            return;
        }

        $file_string_data = file_get_contents("data://".$request->pullPostVar('thumb'));
        $target = $resourceId . "/thumb/";
        
        $path = $this->upload($file_string_data, $target);
        if ($path != null) {
            $resource->thumb = json_encode($path);
        }
        $this->saveResource($resource);
        return $path;
    }

    public function postBackground(Request $request)
    {
        $resourceId = intval($request->pullPostVar('slideId'));
        
        try {
            $resource = $this->load($resourceId);
        }
        catch (\Exception $e) {
            //$resource = $this->build();
            //$this->saveResource($resource);
            //$resourceId = $resource->id;
            return;
        }

        $resourcePath = $resourceId . "/background/";

        $path = $this->upload($_FILES['backgroundMedia'], $resourcePath);
        if ($path != null) {
            $resource->background = json_encode($path);
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
        
        $this->deleteSlideDir($resourceId);

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
        $res = $q->fetchAll();
        $flag = false;
        foreach ($res as $r) {
            $media = json_decode($r['media']);
            if ($media != null && !empty($media->imgUrl)) {
                $flag = $this->removeUpload($r['id'], $media->imgUrl);
                if (!$flag)  echo("an error has occured");// An error occured
            }
            $this->deleteSlideDir($r['id']);
        }
        return true;
    }

    private function deleteSlideDir($resourceId)
    {
        $dir = SLIDESHOW_MEDIA_DIRECTORY . $resourceId;
        if (is_dir($dir)) {
            // If directory exists then we dump it
            system('rm -rf ' . escapeshellarg($dir), $ret);
            if ($ret != 0) throw new Exception('Directory Removal Error: ' . $ret);
        }
        else {
            echo("directory already removed");
        }
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

    private function Oldupload($file, $path, $slideId)
    {
        # TODO: handle upload of background
        # My idea is that I leave the upload process to the path 
        # and depending on the path, I will upload respectivly
        $target = SLIDESHOW_MEDIA_DIRECTORY . $path;
        $dir = PHPWS_HOME_DIR . $target;

        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        if (gettype($file) === 'array') {
            $dest = $dir . basename($file['name']);
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
        else if (gettype($file) === 'string') { // file is a thumbnail or a background img
            $dir .= 'thumb/';
            if (is_dir($dir)) {
                // If directory exists then we dump it
                system('rm -rf ' . escapeshellarg($dir), $ret);
                if ($ret != 0) throw new Exception('Directory Removal Error: ' . $ret);
            }
            mkdir($dir, 0755, true);
            // image will be named based on timestamp
            $time = time();
            $filename = $time . '.png';
            $dest = $dir . $filename;
            $status = file_put_contents($dest, $file);
            if (!$status) {
                // error has occured
                return null;
            }
            return './' . $target . 'thumb/' . $filename;
        }
        return null;
    }

    /**
     * Uploads a file to a given path
     * @var mixed - of type array or file string data
     * @var string -  if path doesn't exist it will recursivly created also it will get dumped if it does exist.
     * @return string - filepath of new file
     */
    private function upload($file, $path) {
        $slideshow_path = SLIDESHOW_MEDIA_DIRECTORY . $path;
        $canopy_path = PHPWS_HOME_DIR . $slideshow_path;

        if (!is_dir($canopy_path)) {
            mkdir($canopy_path, 0755, true);
        } else {
            system('rm -rf ' . escapeshellarg($canopy_path), $ret);
            if ($ret != 0) throw new Exception('Directory Removal Error: ' . $ret);
            mkdir($canopy_path, 0755, true);
        }

        if (gettype($file) === 'array') {
            $dest = $canopy_path . basename($file['name']);
            if (move_uploaded_file($file['tmp_name'], $dest)) {
                return './' . $slideshow_path .  basename($file['name']);
            } // If returns false then error occurred.
            echo("not uploaded and error occured");
            //var_dump($file);
            var_dump($target);
            return null;
        }
        else if (gettype($file) === 'string') {
            // We will name the file based on timestamp 
            $time = time();
            $filename = $time . '.png';
            $dest = $canopy_path . $filename;
            //var_dump($dest);
            $status = file_put_contents($dest, $file);
            if (!$status) {
                // error has occured
                throw new Exception('Slideshow: File failed to upload');
                return null;
            }
            return './' . $slideshow_path . $filename;
        }
    }

    private function removeUpload($slideId, $path) {
        if (empty($path)) {
            return false;
        }
        try {
            unlink($path);
            $dir = SLIDESHOW_MEDIA_DIRECTORY . $slideId . '/';
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
