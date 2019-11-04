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

    protected function post(Request $request, $showId)
    {
        $resource = $this->build();

        $resource->highestSlide = 0;
        $resource->completed = false;
        $resource->showId = $showId;

        $this->saveResource($resource, 'ss_session');

        return $resource;
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
        //var_dump($result);
        if (empty($result)) {
            $this->post($request, $showId);
            $this->get($request);
        }
        return array('highestSlide' => $result[1], 'completed' => $result[2]);
    }

    public function put(Request $request)
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
            return $this->post($request, $showId);
        }

        // Builds resource based on the corresponding slideshow id and user id
        $resource = $this->load($result['id']);


        $highestSlide = $request->pullPutVarIfSet('highestSlide');
        $completed = $request->pullPutVarIfSet('completed') === 'true' ? true : false;

        $resource->highestSlide = $highestSlide;
        if (!$resource->completed && $completed) {
            $resource->completed = $completed;
        }
        $this->saveResource($resource);
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
