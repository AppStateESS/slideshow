<?php

/*
 * The MIT License
 *
 * Copyright 2018 Matthew McNaney <mcnaneym@appstate.edu>.
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

namespace slideshow\Controller\Show;

use Canopy\Request;
use slideshow\Factory\ShowFactory;
use slideshow\View\ShowView;

class Admin extends Base
{

    /**
     * @var slideshow\Factory\ShowFactory
     */
    protected $factory;

    /**
    * @var slideshow\View\ShowView
    */
    protected $view;

    /**
    * Handles the request to render the list page.
    */
    protected function listHtmlCommand(Request $request)
    {
        return $this->view->show();
    }

    /**
    * Handles the request to render the edit page.
    */
    protected function editHtmlCommand(Request $request)
    {
      return $this->view->edit();
    }

    protected function createHtmlCommand(Request $request)
    {
      $show = $this->factory->create();
      \Canopy\Server::forward('./Slideshow/Show/Edit/' . $show->id . '/?new=1');
    }

    protected function postCommand(Request $request)
    {
        $show = $this->factory->post($request);
        return array('show'=>$show->getStringVars());
    }

    protected function patchCommand(Request $request)
    {
      $show = $this->factory->patch($request);
      return array('show'=>$show->getStringVars());
    }

    protected function listJsonCommand(Request $request)
    {
        return array('listing'=>$this->factory->listing(true));
    }

    protected function editJsonCommand(Request $request)
    {
      return array('slides'=>$this->factory->getSlides($this->id));
    }

    protected function viewHtmlCommand(Request $request)
    {
        return 'viewHtmlCommand empty';
    }

    protected function deleteCommand(Request $request)
    {
        $this->factory->delete($this->id);
    }

    protected function putCommand(Request $request)
    {
        $this->factory->put($this->id, $request);
        return true;
    }

    protected function getCommand(Request $request)
    {
        $shows = $this->factory->getShows();
        return json_encode($shows);
    }

    protected function getJsonView($data, \Canopy\Request $request)
    {
      $vars = $request->getRequestVars();
      $command = '';
      if (!empty($data['command'])) {
        $command = $data['command'];
      }
      if ($command == 'getDetails' && \Current_User::allow('slideshow', 'edit')) {
        $result = ShowFactory::getDetails($vars['show_id']);
      }

      return new \phpws2\View\JsonView($result);
    }

}
