<?php

/**
 * @author Matthew McNaney <mcnaneym at appstate dot edu>
 * @author Tyler Craig <craigta1 at appstate dot edu>
 */

use phpws2\Database;
require_once PHPWS_SOURCE_DIR . 'mod/slideshow/boost/Tables.php';

function slideshow_install(&$content)
{
    $db = \phpws2\Database::getDB();
    $db->begin();

    $show;
    $session;
    try {
        $tables = new slideshow\Tables;

        $show = $tables->createShow();
        $session = $tables->createSession();

    } catch (\Exception $e) {
        \phpws2\Error::log($e);
        $db->rollback();

        $show->drop(true);
        $session->drop(true);

        throw $e;
    }
    $db->commit();

    $content[] = 'Tables created';
    return true;
}
