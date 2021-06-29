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

namespace slideshow\Resource;

class ShowResource extends BaseAbstract
{

    /**
     * Title of show
     * @var \phpws2\Variable\StringVar
     */
    protected $title;

    /**
     *
     * @var \phpws2\Variable\Boolean
     */
    protected $active;

    /**
     *
     * @var \phpws2\Variable\SmallInteger
     */
    protected $slideTimer;

    /**
     * Preview image location
     * @var \phpws2\Variable\StringVar
     */
    protected $preview;

    /**
     * Should preview display the first slide image (thumb)
     * @var \phpws2\Variable\BooleanVar
     */
    protected $useThumb;

    /**
     * CSS Animation classname that renders an animation for all slides within the given show
     * @var \phpws2\Variable\StringVar
     */
    protected $animation;

    protected $table = 'ss_show';

    public function __construct()
    {
        parent::__construct();
        $this->title = new \phpws2\Variable\StringVar(null, 'title');
        $this->title->setLimit('255');
        $this->active = new \phpws2\Variable\BooleanVar(0, 'active');
        $this->slideTimer = new \phpws2\Variable\SmallInteger(2, 'slideTimer');
        $this->preview = new \phpws2\Variable\StringVar(null, 'preview');
        $this->useThumb = new \phpws2\Variable\BooleanVar(false, 'useThumb');
        $this->animation = new \phpws2\Variable\StringVar('None', 'animation');
    }

    public function getImagePath()
    {
        return './images/slideshow/' . $this->id . '/';
    }

}
