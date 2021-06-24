<?php

/**
 * MIT License
 * Copyright (c) 2018 Electronic Student Services @ Appalachian State University
 *
 * See LICENSE file in root directory for copyright and distribution permissions.
 *
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @author Tyler Craig <craigta1@appstae.edu>
 * @license https://opensource.org/licenses/MIT
 */

namespace slideshow\View;

use slideshow\Factory\NavBar;

class ShowView extends BaseView
{

    public function show()
    {
        return $this->scriptView('view');
    }

    public function adminShow()
    {
        return $this->scriptView('shows');
    }

}
