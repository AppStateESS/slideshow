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

namespace slideshow\Factory;

class Home
{
    public static function view()
    {
        $vars['logged'] = \Current_User::isLogged();
        $vars['admin'] = \Current_User::allow('slideshow');
        $vars['login_url'] = "index.php?module=users&action=user&command=login_page";
        $vars['home_img'] =  PHPWS_SOURCE_DIR . 'mod/slideshow/img/showimg.png';

        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('slideshow', 'index.html');
        $content = $template->get();
        return $content;
    }
}
