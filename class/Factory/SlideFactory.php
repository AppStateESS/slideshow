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
        /*$vars = $request->getRequestVars();
        $showId = intval($vars['Show']);
        */

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
        // pull showId from $request
        $vars = $request->getRequestVars();
        $showId = intval($vars['Slide']);

        $slides = $request->pullPutVar('slides');

        $slideIndex = 0;
        foreach ($slides as $slide) {
            $slideId = $this->getSlideId($showId, $slideIndex);
            $resource;
            if (empty($slideId)) {
                $resource = $this->build();
            }
            else {
                $resource = $this->load($slideId);
            }

            $resource->showId = $showId;
            $resource->slideIndex = $slideIndex;
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
            if (!empty($slide['media'])) {    
                $resource->media = $slide['media'];
            }
            $this->saveResource($resource);
            $slideIndex++;
        }
        return true;
    }

    public function postImage(Request $request)
    {
        $vars = $request->getRequestVars();
        $showId = $vars['id'];
        $slideIndex = $vars['index'];
        //var_dump($vars);
        // Begining to think that I don't need these bc I will validate on the js end
        //$mediaHeight = $request->pullPostVar('height');
        //$mediaWidth = $request->pullPostVar('width');

        //$mediaTitle = $request->pullPostVar('title');

        $resourceId = $this->getSlideId($showId, $slideIndex);

        $resource = $this->load($resourceId);

        $path = $this->upload($_FILES['media'], $resourceId);
        if ($path != null) {
            $resource->media = $path;
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
        // pull showId from $request
        $vars = $request->getRequestVars();
        $showId = intval($vars['Slide']);

        $slideIndex = $request->pullDeleteVar('index');
        //var_dump($slideIndex);
        // Build SlideResource from id and index
        $resourceId = $this->getSlideId($showId, $slideIndex);
        $resource = $this->load($resourceId);

        return ($this->deleteResource($resource) != 0);
    }

    public function deleteAll(Request $request)
    {
        // Remove all slides comes from Showlist
        $vars = $request->getRequestVars();
        $showId = intval($vars['Slide']);

        $sql = 'DELETE from ss_slide WHERE showId=:showId;';
        $db = Database::getDB();
        $pdo = $db->getPDO();
        $q = $pdo->prepare($sql);
        return $q->execute(array('showId'=>$showId));
    }

    public function deleteImage(Request $request)
    {
        // TODO
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

    private function getSlideId($showId, $slideIndex)
    {
        $db = Database::getDB();
        $sql = 'SELECT id FROM ss_slide WHERE showId=:showId AND slideIndex=:slideIndex;';
        $pdo = $db->getPDO();
        $q = $pdo->prepare($sql);
        $q->execute(array('showId'=>$showId, 'slideIndex'=>$slideIndex));
        return $q->fetchColumn();
    }

    private function upload(array $file, $slideId)
    {
        $target = SLIDESHOW_MEDIA_DIRECTORY . '/' . $slideId . '/';
        $dir = PHPWS_HOME_DIR . $target;
        $dest = $dir . basename($file['name']);

        if (!is_dir($dir))
        {
            mkdir($dir, 0755, true);
        }
        if (move_uploaded_file($file['tmp_name'], $dest)) {
            //echo("Upload success");
            //var_dump("I think I did this");
            return './' . $target .  basename($file['name']);
        }
        else {
            echo("not uploaded and error occured");
            var_dump($file);
            var_dump($target);
        }
        return null;
    }

}
