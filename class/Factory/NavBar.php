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
    public static $title = 'Administrate';
    public static $has_run = false;

    public static function view(\Canopy\Request $request)
    {
        if (self::$has_run) {
            return;
        }
        self::$has_run = true;
        $auth = \Current_User::getAuthorization();

        $vars['logged'] = \Current_User::isLogged();
        $vars['admin'] = \Current_User::allow('slideshow');

        $vars['items'] = null;
        $vars['options'] = null;
        if (!empty(self::$items)) {
            $vars['items'] = self::$items;
        }

        if (!empty(self::$options)) {
            $vars['options'] = implode('</li><li>', self::$options);
        }

        $vars['is_deity'] = \Current_User::isDeity();
        $vars['logout_uri'] = $auth->logout_link;
        $vars['username'] = \Current_User::getDisplayName();
        $vars['home'] = \Canopy\Server::getSiteUrl();
        $vars['title'] = self::$title;
        $vars['current_area'] = self::getNavTitle($request);
        $template = new \phpws2\Template($vars);
        $template->setModuleTemplate('slideshow', 'navbar.html');
        $content = $template->get();

        \Layout::plug($content, 'NAV_LINKS');
    }

    private static function userLogin()
    {
        if (!\Current_User::isLogged()) {
            $auth = \Current_User::getAuthorization();
            if (!empty($auth->login_link)) {
                $url = $auth->login_link;
            } else {
                $url = 'index.php?module=users&action=user&command=login_page';
            }
            NavBar::addItem("<a href='$url'>Sign in</a>");
        }
    }

    private static function getNavTitle(\Canopy\Request $request)
    {
        return self::$title;
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

    public static function setTitle($title)
    {
        self::$title = $title;
    }

}
