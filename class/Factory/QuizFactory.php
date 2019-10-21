<?php
/*
* The MIT License
*
* Copyright 2019 
* Tyler Craig <craigta1@appstate.edu>.
* Connor Plunkett <plunkettc@appstate.edu>
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

use slideshow\Resource\QuizResource;
use phpws2\Database;
use Canopy\Request;

class QuizFactory extends Base
{
    protected function build()
    {
        return new QuizResource;
    }

    public function get(Request $request)
    {
        $vars = $request->getRequestVars();
        $quizId = $vars['Quiz'];

        $sql = 'SELECT * FROM ss_quiz WHERE id=:quizId;';
        $db = Database::getDB();
        $pdo = $db->getPDO();
        $q = $pdo->prepare($sql);
        $q->execute(array('quizId'=>$quizId));
        $quiz = $q->fetchAll();
        return $quiz;
    }

    public function put(Request $request) 
    {
        $vars = $request->getVars();

        $resource;
        try {
            $resource = $this->load($request->pullPutvar('quizId'));
        }
        catch (\Exception $e) {
            var_dump("Resource doesn't exist", $e);
            $resource = $this->build();
        }
        $resource->question = $request->pullPutVar('question');
        $resource->answers = $request->pullPutVar('answers');
        $resource->correct = $request->pullPutVar('correct');
        $resource->type = $request->pullPutvar('type');
        $this->saveResource($resource);
        return $request;
        
    }

    public function post(Request $request)
    {
        $resource = $this->build();

        $this->saveResource($resource);
        return $resource->id;
    }

    public function delete(Request $request)
    {
        $vars = $request->getVars();
        $quizId = $vars['Quiz'];
        var_dump($vars);
        $resource = $this->load($quizId);
        return $this->deleteResource($resource) != 0;
    }
}