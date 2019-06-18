<?php
/**
 * MIT License
 * Copyright (c) 2018 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Tyler Craig <craigta1@appstae.edu>
 * @license https://opensource.org/licenses/MIT
 */

 namespace slideshow\View;

 class SlideView extends BaseView
 {

     public function edit()
     {
         return $this->scriptView('edit');
     }

     public function present()
     {
         return $this->scriptView('present');
     }
     
 }
