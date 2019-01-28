<?php

require_once 'config.php';

$client = new SoapClient(EMS_ENDPOINT);

$response = $client->GetAllBookings(array('UserName' => USER, "Password" => PASS, "StartDate" => date("Y-m-d", strtotime("Monday")), "EndDate" => date("Y-m-d", strtotime("Monday")), "BuildingID" => -1, "ViewComboRoomComponents" => false));

if (isset($_REQUEST["rooms"])) {
    $rooms = explode(",", $_REQUEST["rooms"]);
}

$xml                       = simplexml_load_string($response->GetAllBookingsResult);
$event_details             = array();
$event_details['current']  = array();
$event_details['upcoming'] = array();
foreach ($xml->Data as $this_event) {
    $details = (array) $this_event;
    if (isset($rooms) && !in_array($details['RoomID'], $rooms)) {
        continue;
    }
    if ($details['StatusID'] == 2) {
        continue;
    }
    if (strtotime($details['TimeEventEnd']) < time()) {
        continue;
    }
    if (strtotime($details['TimeEventStart']) > strtotime("+15 minutes")) {
        $status = 'upcoming';
    } else {
        $status = 'current';
    }

    $key = strtotime($details['TimeEventStart']);
    while (isset($event_details[$status][$key])) {
        $key++;
    }
    $event_details[$status][$key]['start_time'] = date("g:i a", strtotime($details['TimeEventStart']));
    $event_details[$status][$key]['end_time']   = date("g:i a", strtotime($details['TimeEventEnd']));
    $event_details[$status][$key]['room']       = $details['Room'];
    $event_details[$status][$key]['title']      = $details['EventName'];
}

ksort($event_details['current']);
$event_details['current'] = array_values($event_details['current']);
ksort($event_details['upcoming']);
$event_details['upcoming'] = array_values($event_details['upcoming']);
echo json_encode($event_details);
