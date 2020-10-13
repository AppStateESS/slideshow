<?php

use phpws2\Database;

function slideshow_update(&$content, $current_version)
{
    $update = new slideshowUpdate($content, $current_version);
    $content = $update->run();
    return true;
}

class slideshowUpdate
{
    private $content;
    private $cversion;

    public function __construct($content, $cversion)
    {
        $this->content = $content;
        $this->cversion = $cversion;
    }

    public function run()
    {
        // To add an update, add a case, and don't include a break;
        switch (1) {
            case $this->compare('1.1.0'):
                $this->update('1.1.0');
            case $this->compare('1.2.0'):
                $this->update('1.2.0');
            case $this->compare('1.3.0'):
                $this->update('1.3.0');
            case $this->compare('1.3.1'):
                $this->update('1.3.1');
            case $this->compare('1.3.2'):
                $this->update('1.3.2');
            case $this->compare('1.3.3'):
                $this->update('1.3.3');
            case $this->compare('1.3.4'):
                $this->update('1.3.4');
            case $this->compare('1.4.1');
                $this->update('1.4.1');
        }
    }

    private function compare($version)
    {
        return version_compare($this->cversion, $version, '<');
    }

    private function update($version)
    {
        $method = 'v' . str_replace('.', '_', $version);
        $this->$method();
    }

    private function v1_1_0()
    {
        $db = \phpws2\Database::getDB();
        $t = $db->addTable('ss_show');
        $dt = new \phpws2\Database\Datatype\Varchar($t, 'content');
        $dt->setDefault(null);
        $dt->add();

        $changes[] = 'content now saves to the database';
        $changes[] = 'content can now be loaded from the database';
        $this->addContent('1.1.0', $changes);
    }

    private function v1_2_0()
    {
        $db = \phpws2\Database::getDB();

        $session = new \slideshow\Resource\SessionResource;
        $session->createTable($db);

        $changes[] = 'can now keep track of user progress through the quizzes they take';
        $this->addContent('1.2.0', $changes);
    }

    private function v1_3_0()
    {
        $db = \phpws2\Database::getDB();

        // A fresh install is needed, so a drop will be completed lol
        $db->buildTable('ss_show')->drop();

        $show = new \slideshow\Resource\ShowResource;
        $show->createTable($db);

        $slide = new \slideshow\Resource\SlideResource;
        $slide->createTable($db);

        $changes[] = 'Slide data is pulled out and saved seperately';
        $this->addContent('1.3.0', $changes);
    }

    private function v1_3_1()
    {
        $db = \phpws2\Database::getDB();

        $tbl = $db->addTable('ss_show');
        $dt = new \phpws2\Variable\SmallInteger($tbl, 'slideTimer');
        $dt->setDefault(2);
        $dt->add();


        $tbl = $db->addTable('ss_slide');
        $sql = "ALTER TABLE ss_slide ADD backgroundColor varchar(7) DEFAULT '#E5E7E9';";
        $pdo = $db->getPDO();
        $q = $pdo->prepare($sql);
        $q->execute();

    }

    private function v1_3_2()
    {
        $db = \phpws2\Database::getDB();

        $t = $db->addTable('ss_slide');
        $dt = new \phpws2\Database\Datatype\Varchar($t, 'media');
        $dt->setDefault(null);
        $dt->add();

        $changes[] = 'can now add media to slides';
        $this->addContent('1.3.2', $changes);
    }

    private function v1_3_3()
    {
        $db = \phpws2\Database::getDB();

        $t = $db->addTable('ss_slide');
        $dt = new \phpws2\Database\Datatype\Varchar($t, 'thumb');
        $dt->setDefault(null);
        $dt->add();

        $changes[] = 'thumbnail support';
        $this->addContent('1.3.3', $changes);
    }

    private function v1_3_4()
    {
        $db = \phpws2\Database::getDB();

        $t = $db->addTable('ss_show');
        $dt = new \phpws2\Database\Datatype\Varchar($t, 'preview');
        $dt->setDefault(null);
        $dt->add();

        $dt = new \phpws2\Database\Datatype\Boolean($t, 'useThumb');
        $dt->setDefault(false);
        $dt->add();

        $changes[] = 'show preview image';
        $this->addContent('1.3.4', $changes);
    }

    private function v1_4_1()
    {
        
        $db = \phpws2\Database::getDB();
        
        $quiz = new \slideshow\Resource\QuizResource;
        $quiz->createTable($db); 

        $changes[] = 'add quiz table';
        $this->addContent('1.4.1', $changes);
    }

    private function v1_4_2()
    {
        $db = \phpws2\Database::getDB();
        $tbl = $db->addTable('ss_slide');

        $sql = "ALTER TABLE ss_slide CHANGE COLUMN backgroundColor background varchar(255) DEFAULT '#E5E7E9';";
        $pdo = $db->getPDO();
        $q = $pdo->prepare($sql);
        $q->execute();

        $changes[] = 'Background Image Support';
        $this->addContent('1.4.2', $changes);
    }

    private function addContent($version, array $changes)
    {
        $changes_string = implode("\n+ ", $changes);
        $this->content[] = <<<EOF
        <pre>
        Version $version
        ------------------------------------------------------
        + $changes_string
        </pre>
EOF;

    }
}
