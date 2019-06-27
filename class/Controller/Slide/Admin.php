<?php

/*
* The MIT License
*
* Copyright 2018 Tyler Craig <craigta1@appstate.edu>.
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

namespace slideshow\Controller\Slide;

use Canopy\Request;
use slideshow\Factory\Slide;

class Admin extends Base
{


 /**
 * Returns the slides of a specific slideshow
 * @var Canopy\Request
 * @return array of slides
 */
 protected function editJsonCommand(Request $request)
 {
     // TODO: look at editJsonCommand in Show
     return $this->factory->get($request);
 }

 /**
 *  Edits the values for slides -> happens on a save
 */
 protected function putCommand(Request $request)
 {
     return $this->factory->put($request);
 }

 /**
 * Deletes a table from ss_slide -> happens on a delete
 */
 protected function jsonPatchCommand(Request $request)
 {
     return $this->factory->patch($request);
 }

 protected function deleteCommand(Request $request)
 {
     return $this->factory->delete($request);
 }

}
