<?php
/*
 * The MIT License
 *
 * Copyright 2018 
 * Tyler Craig <craigta1@appstate.edu>.
 * Connor plunkett<plunkettc@appstate.edu>
 * Zack Noble <nobleza@appstate.edu>
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

namespace slideshow\Resource;

class QuizResource extends BaseAbstract 
{
    /**
     * question of quiz
     * @var \phpws2\Variable\StringVar
     */
    protected $question; 

    /**
     * answers for quiz
     * @var \phpws2\Variable\ArrayVar
     */
    protected $answers;

    /**
     *  Correct answers for quiz
     * @var \phpws2\Variable\ArrayVar
     */
    protected $correct;

    /**
     * Type of quiz
     * @var \phpws2\Variable\StringVar
     */
    protected $type;

    /**
     * Answer feedback
     * @var \phpws2\Variable\ArrayVar
     */
    protected $feedback;
    
    protected $table = 'ss_quiz';

    public function __construct() 
    {
        parent::__construct();
        $this->question = new \phpws2\Variable\StringVar(null, 'question');
        $this->answers = new \phpws2\Variable\ArrayVar(null, 'answers');
        $this->correct = new \phpws2\Variable\ArrayVar(null, 'correct');
        $this->type = new \phpws2\Variable\StringVar(null, 'type');
        $this->feedback = new \phpws2\Variable\ArrayVar(null, 'feedback');
    }


}