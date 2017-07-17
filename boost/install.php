<?php

/**
 * @author Matthew McNaney <mcnaneym at appstate dot edu>
 */
function slideshow_install(&$content)
{
    $db = \phpws2\Database::getDB();
    $db->begin();

    try {
        $ssUserToSection = $db->buildTable('ssUserToSection');
        $ssUserToSection->addDataType('userId', 'int')->setIsNull(true);
        $ssUserToSection->addDataType('showId', 'int')->setIsNull(true);
        $ssUserToSection->addDataType('sectionId', 'int')->setIsNull(true);
        $ssUserToSection->addDataType('currentSlide', 'int')->setIsNull(true)->setDefault(1);
        $ssUserToSection->addDataType('complete', 'int')->setIsNull(true)->setDefault(0);
        $ssUserToSection->create();
        
    } catch (\Exception $e) {
        \phpws2\Error::log($e);
        $db->rollback();
        throw $e;
    }
    $db->commit();

    $content[] = 'Tables created';
    return true;
}
