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

namespace slideshow\Controller\Section;

use Canopy\Request;
use slideshow\Factory\NavBar;

class Admin extends Base
{

    /**
     * @var \slideshow\Factory\SectionFactory
     */
    protected $factory;

    public function createPostCommand(Request $request)
    {
        return $this->factory->post($request);
    }

    protected function viewHtmlCommand(Request $request)
    {
        $sectionId = <<<EOF
<script>const sectionId = {$this->id}</script>
EOF;
        $slideForm = $this->factory->reactView('slideform');
        $this->addSlideOption($this->id);
        return parent::viewHtmlCommand($request) . $sectionId . $slideForm;
    }

    protected function addSlideOption($id)
    {
        $item = '<a id="add-slide" class="pointer"><i class="fa fa-plus"></i> Add a new slide</a>';
        NavBar::addItem($item);
    }

}
