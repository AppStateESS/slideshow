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

use slideshow\Resource\DecisionResource as Resource;
use phpws2\Database;
use phpws2\Template;
use Canopy\Request;

class DecisionFactory extends Base
{

    public function build()
    {
        return new Resource;
    }
    
    /**
     * 
     * @param integer $id
     * @return Resource
     */
    public function load($id)
    {
        return parent::load($id);
    }

    public function listing($slideId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('ss_decision');
        $tbl->addFieldConditional('slideId', $slideId);
        $tbl->addOrderBy('sorting');
        return $db->select();
    }

    public function continueLink($sectionId, $slideSorting)
    {
        $next = $slideSorting + 1;
        return <<<EOF
<a class="navigate-right" href="./slideshow/Section/watch/$sectionId/#/$next"></a>
EOF;
    }

    public function previousLink($sectionId, $slideSorting)
    {
        if ($slideSorting == 0) {
            return null;
        }
        $prev = $slideSorting - 1;
        return <<<EOF
<a class="navigate-left" href="./slideshow/Section/watch/$sectionId/#/$prev"></a>
EOF;
    }

    public function save(Resource $decision)
    {
        self::saveResource($decision);
        return $decision->id;
    }

    public function patch($id, $param, $value)
    {
        static $allowed_params = array('title', 'message', 'lockout', 'next');

        if (!in_array($param, $allowed_params)) {
            throw new \Exception('Parameter may not be patched');
        }
        $decision = $this->load($id);
        $decision->$param = $value;
        $this->save($decision);
        return true;
    }

    public function getCurrentSort($slideId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('ss_decision');
        $tbl->addFieldConditional('slideId', $slideId);
        $sorting = $tbl->addField('sorting');
        $tbl->addOrderBy('sorting', 'desc');
        $db->setLimit(1);
        return (int) $db->selectColumn();
    }

    public function delete($decisionId)
    {
        $decision = $this->load($decisionId);
        self::deleteResource($decision);
        $sortable = new \phpws2\Sortable('ss_decision', 'sorting');
        $sortable->setAnchor('slideId', $decision->slideId);
        $sortable->reorder();
    }
    
    public function put($decisionId, Request $request)
    {
        $decision = $this->load($decisionId);
        $decision->loadPutByType($request);
        self::saveResource($decision);
    }
    
    public function link($decision) {
        var_dump($decision);
        return <<<EOF
<li class="decision">{$decision['title']}</li>
EOF;
    }

}
