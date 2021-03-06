<?php
/**
 * See docs/AUTHORS and docs/COPYRIGHT for relevant info.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 *
 * @version $Id$
 * @author Matthew McNaney <mcnaneym@appstate.edu>
 * @package
 * @license http://opensource.org/licenses/gpl-3.0.html
 */

function slideshow_uninstall(&$content)
{
    $db = \phpws2\Database::getDB();
    $db->begin();
    try {
      $db->buildTable('ss_show')->drop();
      $db->buildTable('ss_session')->drop();
      $db->buildTable('ss_slide')->drop();
      $db->buildTable('ss_quiz')->drop();

    }
    catch (Exception $e) {
      \phpws2\Error::log($e);
      throw $e;
    }
    $db->commit();

    $content[] = "Tables dropped";
    return true;

}
