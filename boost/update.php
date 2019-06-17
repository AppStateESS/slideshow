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
      case $this->compare('1.2.1'):
        $this->update('1.2.1');
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

  private function v1_2_1()
  {
      $db = \phpws2\Database::getDB();

      // TODO: Pull Show$content and save it here. or drop the table lol.

      $slide = new \slideshow\Resource\SlideResource;
      $slide->createTable($db);

      $changes[] = 'Slide data is pulled out and saved seperately';
      $this->addContent('1.2.1', $changes);
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
