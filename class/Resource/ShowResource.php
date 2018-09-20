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
    * Unique id that is associated with the show
    * @var \phpws2\Variable\IntegerVar
    */
    protected $showId;

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
     * Data for each silde
     * @var \phpws2\Variable\ArrayVar
     */
    protected $content;

    protected $table = 'ss_show';

    public function __construct()
    {
        parent::__construct();
        $this->showId = new \phpws2\Variable\IntegerVar(1, 'showId');
        $this->title = new \phpws2\Variable\StringVar(null, 'title');
        $this->title->setLimit('255');
        $this->active = new \phpws2\Variable\BooleanVar(0, 'active');
        $this->content = new \phpws2\Variable\ArrayVar(null, 'content');
    }

    public function getImagePath()
    {
        return './images/slideshow/' . $this->id . '/';
    }

}
