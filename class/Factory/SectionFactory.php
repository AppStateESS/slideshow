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

namespace slideshow\Factory;

use slideshow\Resource\SectionResource as Resource;
use phpws2\Database;
use phpws2\Template;
use Canopy\Request;

class SectionFactory extends Base
{

    protected function build()
    {
        return new Resource;
    }

    public function post(Request $request)
    {
        $showFactory = new ShowFactory;
        $showId = $request->pullPostInteger('showId');
        $section = $this->build();
        $section->showId = $showId;
        $section->title = $request->pullPostString('title');
        $section->sorting = (int) $this->getCurrentSort($showId) + 1;
        return $section;

        return true;
    }

    public function getCurrentSort($showId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('ssSection');
        $tbl->addFieldConditional('showId', $showId);
        $sorting = $tbl->addField('sorting');
        $tbl->addOrderBy('sorting', 'desc');
        $db->setLimit(1);
        return $db->selectColumn();
    }

    public function listing($showId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('ssSection');
        $tbl->addFieldConditional('showId', $showId);
        $tbl->addOrderBy('sorting');
        return $db->select();
    }

    public function view($sectionId)
    {
        $showFactory = new ShowFactory;
        $section = $this->load($sectionId);
        $show = $showFactory->load($section->showId);

        $vars['showTitle'] = $show->title;
        $vars['sectionTitle'] = $section->title;

        $slideFactory = new SlideFactory;
        $slides = $slideFactory->listing($sectionId);
        if (empty($slides)) {
            $slides = array();
        }
        $vars['slides'] = $slides;
        $template = new Template($vars);
        $template->setModuleTemplate('slideshow', 'Section/view.html');
        return $template->get();
    }

    public function watch($sectionId)
    {
        \Layout::addStyle('slideshow', 'reveal.css');
        \Layout::addStyle('slideshow', 'white.css');
        NavBar::halt();

        $slide['content'] = <<<EOF
        <div class="header">
            <h2>Page 1</h2>
        </div>
EOF;
        $slide['backgroundImage'] = null;

        $slides[] = $slide;
        $slide['content'] = <<<EOF
        <div class="header">
            <h2>Page 2</h2>
        </div>
EOF;
        $slide['backgroundImage'] = null;

        $slides[] = $slide;
        $vars['slides'] = $slides;

        $vars['decisions'][] = <<<EOF
            <div class="next"><a href="./slideshow/Section/7#/1" class="">Continue <i class="fa fa-arrow-right"></i></a></div>
EOF;

        $template = new Template($vars);
        $template->setModuleTemplate('slideshow', 'Section/watch.html');
        return $template->get();
    }

    public function createImageDirectory($section)
    {
        $path = $section->getImagePath();
        if (!is_dir($path)) {
            mkdir($path);
        }
    }

}
