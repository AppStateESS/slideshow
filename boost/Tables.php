<?php
/**
 * MIT License
 * Copyright (c) 2019 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @author Tyler Craig <craigta1@appstate.edu>
 * @license https://opensource.org/licenses/MIT
 */
namespace slideshow;

use phpws2\Database;

class Tables
{

    protected $db;

    public function __construct()
    {
        $this->db = Database::getDB();
    }

    public function createShow()
    {
        $show = new \slideshow\Resource\ShowResource;
        return $show->createTable($this->db);
    }

    public function createSession()
    {
        $session = new \slideshow\Resource\SessionResource;
        return $session->createTable($this->db);
    }

    public function createSlide()
    {
        $slide = new \slideshow\Resource\SlideResource;
        return $slide->createTable($this->db);
    }

    public function createQuiz()
    {
        $quiz = new \slideshow\Resource\QuizResource;
        return $quiz->createTable($this->db);
    }
}
