<?php

/**
 * @author Matthew McNaney <mcnaneym at appstate dot edu>
 */
function slideshow_install(&$content)
{
    $db = \phpws2\Database::getDB();
    $db->begin();

    try {
        $ssUserToSection = $db->buildTable('ss_usertosection');
        $ssUserToSection->addDataType('userId', 'int')->setIsNull(true);
        $ssUserToSection->addDataType('showId', 'int')->setIsNull(true);
        $ssUserToSection->addDataType('sectionId', 'int')->setIsNull(true);
        $ssUserToSection->addDataType('currentSlide', 'int')->setIsNull(true)->setDefault(1);
        $ssUserToSection->addDataType('complete', 'int')->setIsNull(true)->setDefault(0);
        $ssUserToSection->create();
        
        $decision = new \slideshow\Resource\DecisionResource;
        $decision->createTable($db);

        $section = new \slideshow\Resource\SectionResource;
        $section->createTable($db);

        $show = new \slideshow\Resource\ShowResource;
        $show->createTable($db);

        $slide = new \slideshow\Resource\SlideResource;
        $slide->createTable($db);
        
    } catch (\Exception $e) {
        \phpws2\Error::log($e);
        $db->rollback();
        throw $e;
    }
    $db->commit();

    $content[] = 'Tables created';
    return true;
}
