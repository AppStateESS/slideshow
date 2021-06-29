<?php
/**
 * MIT License
 * Copyright (c) 2018 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Zack Noble <nobleza@appstae.edu>
 * @license https://opensource.org/licenses/MIT
 */

 namespace slideshow\View;

 class SessionView extends BaseView
 {

     public function sessionTable()
     {
         return $this->scriptView('session');
     }

 }
