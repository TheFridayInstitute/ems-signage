var current_events = "";
var current_event_index = 0;
var upcoming_events;
var upcoming_event_index = 0;
var clock = 0;
var interval_msec = 1000;
// ready
$(function() {
	// set timer
	clock = setTimeout("UpdateClock()", interval_msec);
});
// UpdateClock
function UpdateClock() {
	var dNow = new Date();
	var month = new Array();
	month[0] = "January";
	month[1] = "February";
	month[2] = "March";
	month[3] = "April";
	month[4] = "May";
	month[5] = "June";
	month[6] = "July";
	month[7] = "August";
	month[8] = "September";
	month[9] = "October";
	month[10] = "November";
	month[11] = "December";
	var hour = dNow.getHours();
	var ampm = "AM";
	if (hour >= 12) {
		if (hour != 12) hour = hour - 12;
		var ampm = "PM";
	}
	if (dNow.getMinutes() < 10) {
		minutes = "0" + dNow.getMinutes();
	} else minutes = dNow.getMinutes();
	var utcdate = (month[dNow.getMonth()]) + ' ' + dNow.getDate() + "<br/>" + hour + ":" + minutes + " " + ampm;
	$('#clock').html(utcdate)
}

function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
		vars[key] = value;
	});
	return vars;
}

function getNewEvents() {
	$.post("ems.php", {
		rooms: getUrlVars()['rooms']
	}, function(data) {
		var result = JSON.parse(data);
		current_events = result['current'];
		upcoming_events = result['upcoming'];
	});
}
getNewEvents();

function switcher() {
	$("#current-event").find('.event-time').text(current_events[current_event_index]['start_time'] + " - " + current_events[current_event_index]['end_time']);
	$("#current-event").find('.event-title').text(current_events[current_event_index]['title']);
	$("#current-event").find('.event-location').text(current_events[current_event_index]['room']);
	if (current_event_index + 1 >= current_events.length) current_event_index = 0;
	else current_event_index++;
	$("#upcoming-event").find('.event-time').text(upcoming_events[upcoming_event_index]['start_time'] + " - " + upcoming_events[upcoming_event_index]['end_time']);
	$("#upcoming-event").find('.event-title').text(upcoming_events[upcoming_event_index]['title']);
	$("#upcoming-event").find('.event-location').text(upcoming_events[upcoming_event_index]['room']);
	if (upcoming_event_index + 1 >= upcoming_events.length) upcoming_event_index = 0;
	else upcoming_event_index++;
}
window.setInterval(function() {
	switcher();
}, 5000);
window.setInterval(function() {
	getNewEvents();
}, 300000);