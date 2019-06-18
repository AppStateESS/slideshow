<?php

/*
* The MIT License
*
* Copyright 2018 Tyler Craig <craigta1@appstate.edu>.
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
            // Backgorund color and other data here
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

        $slideIndex = $request->pullPutVarIfSet('index');

        $resourceId = $this->getResourceId($showId, $slideIndex);

        $resource = null;
        if (!empty($resourceId)) {
            $resource = $this->load($resourceId);
        }
        else {
            $resource = $this->build();
        }

        $resource->showId = $showId;
        $resource->content = $request->pullPutVarIfSet('content');
        $resource->slideIndex = $slideIndex;
        $resource->isQuiz = $request->pullPutVarIfSet('isQuiz');
        //$resource->backgorundColor = $request->pullPutVarIfSet('color');

        $this->saveResource($resource);
        return $resource;
    }

    /**
    * The patch request is reserved for the deletion of slides
    * @return boolean true if slide was deleted
    */
    public function patch(Request $request)
    {
        // pull showId from $request
        $vars = $request->getRequestVars();
        $showId = intval($vars['Slide']);

        $slideIndex = $request->pullPatchVarIfSet('index');

        // Build SlideResource from id and index
        $resourceId = $this->getResourceId($showId, $slideIndex);
        $resource = $this->load($resourceId);

        return ($this->deleteResource($resource) != 0);
    }

    public function delete(Request $request)
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

    private function getResourceId($showId, $slideIndex)
    {
        $db = Database::getDB();
        $sql = 'SELECT id FROM ss_slide WHERE showId=:showId AND slideIndex=:slideIndex;';
        $pdo = $db->getPDO();
        $q = $pdo->prepare($sql);
        $q->execute(array('showId'=>$showId, 'slideIndex'=>$slideIndex));
        return $q->fetchColumn();
    }

}
