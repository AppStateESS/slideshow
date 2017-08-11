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
    static $allowedTags = array(
        'strong', 's', 'b', 'a', 'i', 'u', 'ul', 'ol', 'li', 'table', 'tr',
        'td', 'tbody', 'dd', 'dt', 'dl', 'p', 'br', 'div', 'span', 'blockquote',
        'th', 'tt', 'img', 'pre', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'fieldset', 'legend', 'code', 'em', 'iframe', 'embed', 'audio', 'video',
        'source', 'object', 'sup', 'sub', 'param', 'strike', 'del', 'abbr',
        'small');

    /**
     * Option listed on the button
     * @var \phpws2\Variable\StringVar
     */
    protected $title;

    /**
     * Message shown when decision made
     * @var \phpws2\Variable\StringVar
     */
    protected $message;

    /**
     * User can continue after picking this decision
     * @var \phpws2\Variable\BooleanVar
     */
    protected $next;

    /**
     * Slide this decision is associated with
     * @var \phpws2\Variable\IntegerVar
     */
    protected $slideId;

    /**
     * Locks after use, can't be chosen again
     * @var \phpws2\Variable\BooleanVar
     */
    protected $lockout;

    /**
     * Display order of slide
     * @var \phpws2\Variable\SmallInteger 
     */
    protected $sorting;
    protected $table = 'ssDecision';

    public function __construct()
    {
        parent::__construct();
        $this->title = new \phpws2\Variable\StringVar(null, 'title');
        $this->title->setLimit(50);
        $this->message = new \phpws2\Variable\StringVar(null, 'message');
        $this->message->allowEmpty();
        $this->message->addAllowedTags(self::$allowedTags);
        $this->next = new \phpws2\Variable\BooleanVar(true, 'next');
        $this->lockout = new \phpws2\Variable\BooleanVar(false, 'lockout');
        $this->slideId = new \phpws2\Variable\IntegerVar(null, 'slideId');
        $this->sorting = new \phpws2\Variable\SmallInteger(0, 'sorting');
    }

}
