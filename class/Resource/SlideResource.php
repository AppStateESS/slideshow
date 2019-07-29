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
 * @author Tyler Craig <craigta1 at appstate dot edu>
 *
 * @license http://opensource.org/licenses/lgpl-3.0.html
 */

namespace slideshow\Resource;

class SlideResource extends BaseAbstract
{

    protected $table = 'ss_slide';

    /**
    * SlideShow id
    * @var phpws2\Variable\IntegerVar
    */
    protected $showId;

    /**
    * Slide index
    * Note: think of this as a sequential id for the slides:
    * If a slide at index 2 gets deleted, then slide at index 3 will not get decremented
    * @var phpws2\Variable\SmallInteger
    */
    protected $slideIndex;

    /**
    * Slide Content
    * @var phpws2\Variable\StringVar
    */
    protected $content;

    /**
    * Slide is a quiz
    * @var phpws2\Variable\BooleanVar
    */
    protected $isQuiz;

    /**
    * Slide backgroundColor
    * @var phpws2\Variable\StringVar
    */
    protected $backgroundColor;

    /**
    * Media Resource Location
    * @var phpws2\Variable\StringVar
    */
    protected $media;

    /**
    * Thumbnail for the slide (img preview of the slideshow content)
    * @var phpws2\Variable\StringVar
    */
    protected $thumb;

    public function __construct()
    {
        parent::__construct();
        $this->showId = new \phpws2\Variable\IntegerVar(0, 'showId');
        $this->slideIndex = new \phpws2\Variable\SmallInteger(0, 'slideIndex');
        $this->content = new \phpws2\Variable\StringVar(null, 'content');
        $this->isQuiz = new \phpws2\Variable\BooleanVar(0, 'isQuiz');
        $this->backgroundColor = new \phpws2\Variable\StringVar('#E5E7E9', 'backgroundColor');
        $this->media = new \phpws2\Variable\StringVar(null, 'media');
        $this->thumb = new \phpws2\Variable\StringVar(null, 'thumb');
    }

}
