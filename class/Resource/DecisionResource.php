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

class DecisionResource extends BaseResource
{

    /**
     * Option listed on the button
     * @var \phpws2\Variable\StringVar
     */
    protected $label;

    /**
     * Message shown when decision made
     * @var \phpws2\Variable\StringVar
     */
    protected $message;

    /**
     * User can continue after picking this decision
     * @var \phpws2\Variable\BooleanVar
     */
    protected $continue;

    /**
     * Slide this decision is associated with
     * @var \phpws2\Variable\IntegerVar
     */
    protected $slideId;

    public function __construct()
    {
        parent::__construct();
        $this->label = new \phpws2\Variable\StringVar(null, 'label');
        $this->label->setLimit(50);
        $this->message = new \phpws2\Variable\StringVar(null, 'message');
        $this->continue = new \phpws2\Variable\BooleanVar(false, 'continue');
        $this->slideId = new \phpws2\Variable\IntegerVar(null, 'slideId');
    }

}
