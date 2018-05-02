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

namespace slideshow\Controller\Slide;

use Canopy\Request;

class Admin extends Base
{

    protected function editHtmlCommand(Request $request)
    {
        $navbar = new \slideshow\Factory\NavBar;
        $navbar->addItem('<a href="./slideshow/Slide/list/' . $this->id . '"><i class="fa fa-film"></i> Slide list</a>');
        return $this->factory->scriptView('SlideEdit', true,
                        array('slideId' => $this->id));
    }

    protected function listHtmlCommand(Request $request)
    {
        $showId = (int) $request->shiftCommand();
        if ($showId == 0) {
            throw new \Exception('Missing show id');
        }

        return $this->factory->scriptView('SlideList', true,
                        array('showId' => $showId));
    }

    protected function listJsonCommand(Request $request)
    {
        $showId = (int) $request->shiftCommand();
        if ($showId == 0) {
            throw new \Exception('Missing show id');
        }
        $showFactory = new \slideshow\Factory\ShowFactory();
        $show = $showFactory->load($showId);
        return array('listing' => $this->factory->listing($showId), 'show' => $show->getStringVars());
    }

    /**
     * Creates a new slide. Note, this slide is created without any data and
     * passed up to the form. This allows an id to be created. If the form is 
     * abandoned, the slide should be deleted.
     * @param Request $request
     * @returns array Array with slide id
     */
    protected function postCommand(Request $request)
    {
        $slide = $this->factory->post($request);
        $slideId = $this->factory->save($slide);
        return array('slideId' => $slideId);
    }

    protected function picturePostCommand(Request $request)
    {
        //return $this->factory->handlePicturePost($request->pullPostInteger('slideId'));
    }

    protected function clearPicturePatchCommand(Request $request)
    {
        //return $this->factory->clearBackgroundImage($this->id);
    }

    protected function deleteCommand(Request $request)
    {
        $this->factory->delete($this->id);
    }

    protected function jsonPatchCommand(Request $request)
    {
        /*
          $this->factory->patch($this->id, $request->pullPatchString('varname'),
          $request->pullPatchVar('value'));
          $json['success'] = true;
          return $json;
         * 
         */
    }

    protected function movePatchCommand(Request $request)
    {
        /*
          $slide = $this->factory->load($this->id);
          $this->factory->sort($slide, $request->pullPatchInteger('newPosition'));
         * 
         */
    }

    protected function viewJsonCommand(Request $request)
    {
        /*
          $slide = $this->factory->load($this->id);
          $view =  $slide->getStringVars();
          $view['decisions'] = $this->factory->getDecisions($slide);
          $view['content'] = '<div class="slide-content">' . $view['content'] . '</div>';
          return $view;
         * 
         */
    }

}
