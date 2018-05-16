<?php

/**
 * @author Matthew McNaney <mcnaneym at appstate dot edu>
 */
function slideshow_install(&$content)
{
    $db = \phpws2\Database::getDB();
    $db->begin();

    try {
        /* TODO: Add install commands for our tables using Canopy functions. */


        $show = new \slideshow\Resource\ShowResource;
        $show->createTable($db);

        $slide = new \slideshow\Resource\SlideResource;
        $slide->createTable($db);

    } catch (\Exception $e) {
        \phpws2\Error::log($e);
        $backout = array_reverse($tables);
        foreach ($backout as $tbl) {
            $tbl->drop();
        }
        $db->rollback();
        throw $e;
    }
    $db->commit();

    $content[] = 'Tables created';
    return true;
}
