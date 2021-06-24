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
 * @author Tyler Craig <craigta1 at appstate dot edu>
 *
 * @license http://opensource.org/licenses/lgpl-3.0.html
 */

namespace slideshow\Factory;

use slideshow\Resource\SessionResource as Resource;
use phpws2\Database;
use Canopy\Request;

class SessionFactory extends Base
{

    protected function build()
    {
        return new Resource;
    }

    public function get(Request $request)
    {
        $vars = $request->getRequestVars();
        $showId = intval($vars['Session']);
        $userId = \Current_User::getId();

        $sql = "SELECT id, highestSlide, completed FROM ss_session WHERE userId=:userId AND showId=:showId;";
        $db = Database::getDB();
        $pdo = $db->getPDO();
        $q = $pdo->prepare($sql);
        $q->execute(array(':userId' => $userId, ':showId' => $showId));
        $result = $q->fetch();

        if (empty($result)) {
            $this->post($request, $showId);
            $this->get($request);
        }
        return array('highestSlide' => $result[1], 'completed' => $result[2]);
    }

    protected function getSessionByUserId(int $showId, int $userId)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('ss_session');
        $tbl->addFieldConditional('userId', $userId);
        $tbl->addFieldConditional('showId', $showId);
        return $db->selectOneRow();
    }

    protected function getSessionByIp(int $showId, string $ip)
    {
        $db = Database::getDB();
        $tbl = $db->addTable('ss_session');
        $tbl->addFieldConditional('showId', $showId);
        $tbl->addFieldConditional('ip', $ip);
        return $db->selectOneRow();
    }

    public function put(Request $request)
    {
        $showId = $request->pullGetInteger('Session');
        $highestSlide = (int) $request->pullPutInteger('highestSlide', true);
        $completed = (bool) $request->pullPutInteger('completed', true);

        $userId = \Current_User::getId();
        $ip = \Canopy\Server::getUserIp();
        $resource = $this->build();

        if ($userId > 0) {
            $result = $this->getSessionByUserId($showId, $userId);
        } else {
            $result = $this->getSessionByIp($showId, $ip);
        }

        if (empty($result)) {
            $resource->showId = $showId;
            $resource->userId = $userId;
            $resource->ip = $userId == 0 ? $ip : null;
            $resource->username = $userId > 0 ? \Current_User::getUsername() : 'anonymous';
        } else {
            $resource->setVars($result);
        }
        if ($highestSlide > $resource->highestSlide) {
            $resource->highestSlide = $highestSlide;
        }
        if (!$resource->completed && $completed) {
            $resource->completed = $completed;
        }

        if ($resource->userId > 0 || strlen($resource->ip) > 0) {
            $this->saveResource($resource);
        } else {
            throw new \Exception('Cannot save session to database without identifier');
        }
        return $resource;
    }

    public function getAll(Request $request)
    {
        $vars = $request->getRequestVars();
        $showId = intval($vars['id']);

        $sql = "SELECT username, highestSlide, completed FROM ss_session WHERE showId=:showId;";
        $db = Database::getDB();
        $pdo = $db->getPDO();
        $q = $pdo->prepare($sql);
        $q->execute(array(':showId' => $showId));
        $result = $q->fetchAll();

        return $result;
    }

}
