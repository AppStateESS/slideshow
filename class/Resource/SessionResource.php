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
 * @author Tyler Craig <craigta1 at appstate dot edu>
 *
 * @license http://opensource.org/licenses/lgpl-3.0.html
 */

namespace slideshow\Resource;

class SessionResource extends BaseAbstract
{

    /**
     * User id
     * @var phpws2\Variable\IntegerVar
     */
    protected $userId;

    /**
     * username
     * @var phpws2\Variable\StringVar
     */
    protected $username;

    /**
     * SlideShow id
     * @var phpws2\Variable\IntegerVar
     */
    protected $showId;

    /**
     * Users highest slide completed
     * @var phpws2\Variable\SmallInteger
     */
    protected $highestSlide;

    /**
     * True if user has completed the slideshow
     * @var phpws2\Variable\BooleanVar
     */
    protected $completed;
    protected $ip;
    protected $table = 'ss_session';

    public function __construct()
    {
        parent::__construct();
        $this->userId = new \phpws2\Variable\IntegerVar(\Current_User::getId(), 'userId');
        $this->username = new \phpws2\Variable\StringVar(\Current_User::getUsername(), 'username');
        $this->showId = new \phpws2\Variable\IntegerVar(0, 'showId');
        $this->highestSlide = new \phpws2\Variable\SmallInteger(0, 'highestSlide');
        $this->completed = new \phpws2\Variable\BooleanVar(false, 'completed');
        $this->ip = new \phpws2\Variable\Ip(null, 'ip');
        $this->ip->allowNull(true);
    }

}
