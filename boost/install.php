<?php

/**
 * @author Matthew McNaney <mcnaneym at appstate dot edu>
 */
function slideshow_install(&$content)
{
    $db = \phpws2\Database::getDB();
    $db->begin();

    try {
        $show = new \slideshow\Resource\ShowResource;
        $tables[] = $show->createTable($db);

        $slide = new \slideshow\Resource\SlideResource;
        $tables[] = $slide->createTable($db);

        $phtml = new \slideshow\Resource\PanelHtmlResource;
        $tables[] = $phtml->createTable($db);

        $pimg = new \slideshow\Resource\PanelImageResource;
        $tables[] = $pimg->createTable($db);

        $pqanda = new \slideshow\Resource\PanelQuestionResource();
        $tables[] = $pqanda->createTable($db);
        
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
