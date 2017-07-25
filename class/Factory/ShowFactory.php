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

use slideshow\Resource\ShowResource as Resource;
use phpws2\Database;
use Canopy\Request;

class ShowFactory extends Base
{

    protected function build()
    {
        return new Resource;
    }

    public function post(Request $request)
    {
        $resource = $this->build();
        $resource->title = $request->pullPostString('title');
        $this->saveResource($resource);
        return true;
    }

    public function listing()
    {
        $db = Database::getDB();
        $db->addTable('ssShow');
        $tpl['rows'] = $db->select();
        $template = new \phpws2\Template($tpl);
        $template->setModuleTemplate('slideshow', 'Show/list.html');
        return $template->get();
    }

    public function view($id)
    {
        /* @var $resource \slideshow\Resource\ShowResource */
        $resource = $this->load($id);
        $sectionFactory = new SectionFactory();

        $vars = $resource->getStringVars();
        $sections = $sectionFactory->listing($resource->id);
        foreach ($sections as $sec) {
            $slideFactory = new SlideFactory();
            $slides = $slideFactory->listing($sec['id']);
        }
        $vars['sections'] = $sections;
        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('slideshow', 'Show/view.html');
        return $template->get();
    }

}
