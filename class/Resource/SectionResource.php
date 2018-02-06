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

class SectionResource extends BaseResource
{

    /**
     * Show with which this section is associated
     * @var \phpws2\Variable\IntegerVar
     */
    protected $showId;

    /**
     * Title of section
     * @var \phpws2\Variable\StringVar
     */
    protected $title;

    /**
     * Display order of slide
     * @var \phpws2\Variable\SmallInteger 
     */
    protected $sorting;
    protected $table = 'ss_section';

    public function __construct()
    {
        parent::__construct();
        $this->showId = new \phpws2\Variable\IntegerVar(null, 'showId');
        $this->sorting = new \phpws2\Variable\SmallInteger(1, 'sorting');
        $this->title = new \phpws2\Variable\StringVar(null, 'title');
        $this->title->setLimit('255');
    }

    public function getImagePath()
    {
        return PHPWS_HOME_DIR . 'images/slideshow/' . $this->id;
    }

}
