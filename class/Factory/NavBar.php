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

namespace slideshow\Factory;

class NavBar
{

    public static $items;
    public static $options;
    public static $has_run = false;

    public static function view(\Canopy\Request $request)
    {
        if (self::$has_run) {
            return;
        }
        self::$has_run = true;
        $auth = \Current_User::getAuthorization();
        $authKey= \Current_User::getAuthKey();

        $vars['logged'] = \Current_User::isLogged();
        $vars['admin'] = \Current_User::allow('slideshow');
        $vars['is_deity'] = \Current_User::isDeity();

        $vars['items'] = null;
        $vars['options'] = null;
        if (!empty(self::$items)) {
            $vars['items'] = self::$items;
        }

        if (!empty(self::$options)) {
            $vars['options'] = implode('</li><li>', self::$options);
        }

        $vars['logout_uri'] = $auth->logout_link;
        $vars['boost_uri'] = "index.php?module=boost&action=admin&tab=other_mods&authkey=" . $authKey;
        $vars['username'] = \Current_User::getDisplayName();
        $vars['home'] = \Canopy\Server::getSiteUrl();
        
        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('slideshow', 'navbar.html');
        $content = $template->get();

        \Layout::plug($content, 'NAV_LINKS');
    }


    public static function addItem($item)
    {
        self::$items[] = $item;
    }

    public static function addOption($option, $unshift = false)
    {
        if ($unshift && !empty(self::$options)) {
            array_unshift(self::$options, $option);
        } else {
            self::$options[] = $option;
        }
    }

}
