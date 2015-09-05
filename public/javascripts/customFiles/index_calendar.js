/******socket.io init*******/
var socket = io.connect();

//TO DO - rename all socket.io messages
//for example, from "calID" to "instructorID"
//current code works fine but the message names are misleading

var app = angular.module('FullCalendarApp', []);

app.factory('sharedDataFactory', function () {
	//share checkbox inputs between 2 controllrs
    var checkboxInputs = [];
    //Observer pattern - array to save observer callback functions
    var observerCallbacks = [];
    return {
    	registerObserverCallback: function(callback){
    		observerCallbacks.push(callback);
    	},
        getCheckboxInputs: function() {
            return checkboxInputs;
        },
        setCheckboxInputs: function(x) {
            checkboxInputs = x;
            angular.forEach(observerCallbacks, function(callback){
		      callback();
		    });
        }
    };
});

/*controller for the checkboxes - left side of the page*/
app.controller('checkboxCtrl', function($scope, $http, sharedDataFactory){
	//fetch calendarNames to display on left panel as checkboxes
	$scope.instructorNames = [];
	//current values of checkboxes
	$scope.checkboxValues = [];

	//change valus in checkboxValues[] when a checkbox is clicked(tick/untick)
	$scope.toggle = function(instructorObject){
		var inst = $scope.checkboxValues.indexOf(instructorObject);
		//if calendarName already exists
		if(inst>-1){
			$scope.checkboxValues.splice(inst,1);
		}
		//push if does not exist
		else{
			$scope.checkboxValues.push(instructorObject);
		}

		//change checkboxValues in the sharedDataFactory so that all observers can update
		sharedDataFactory.setCheckboxInputs($scope.checkboxValues);
	};

	//GET all instructorNames to display as checkboxes on left vertical panel
	$http.get('/api/instructors/all/instructorNames')
	.success(function(data, status, headers, config){
		$scope.instructorNames = data;
		$scope.checkboxValues.push(data[0]);
		sharedDataFactory.setCheckboxInputs($scope.checkboxValues);
	})
	.error(function(data, status, headers, config){
		console.log('error getting data!\n'+data);
	});
});


/*controller for the FullCalendar*/
app.controller('fullCalCtrl', function($scope, $http, sharedDataFactory){

	//below variables are used whenever the FullCalendar is renderred
	$scope.viewMode = 'month';
	$scope.currentDate = new Date();
	$scope.dataEventSources = [];
	$scope.currentLangCode = 'en';
	$scope.checkboxData = [];
	
	//below variables are used while creating a new event
	$scope.newEventDialog_Title = '';
	//$scope.newEventDialog_SelectedCalendar = '';
	$scope.newEventDialog_SelectedInstructor = '';
	$scope.newEventDialog_start = '';
	$scope.newEventDialog_end = '';


	/********function to modify event when an event has been resized (stretched/shrink)**********/
	/********used on resizing only; NOT on drag-drop****************/
	$scope.onEventResize = function(event,delta,revertFunc){
		//build the url
		var url = '/api/instructors/events/'+event.source.instructorId+'/'+event._id;

		//now PUT to server
		$http.put(url, {'delta': delta.asMilliseconds()})
		.success(function(data, status, headers, config) {
			//fetch events again and re-render calendar
			//$scope.getEvents();
			socket.emit('event_modified', {
				calId: event.source.instructorId,
				eventId: event._id
			});
	  	})
	  	.error(function(data, status, headers, config) {
	  		console.log('error PUTting an event! (resize)');
	  		console.log(data);
	  	});

	}	


	/*********function to delete the event when an event has been clicked*********/
	$scope.clickEvent_delete = function(calEvent, jsEvent, view){
		//set values of the required variables
		var deleteEvent_eventId = calEvent._id;
		var deleteEvent_instructorId = calEvent.source.instructorId;

		if(confirm('delete event: '+calEvent.title+'?')){
			//build the url
			var url = '/api/instructors/events/'+deleteEvent_instructorId+'/'+deleteEvent_eventId;

			//now delete the event
			$http.delete(url)
			.success(function(data, status, headers, config) {
				//fetch events again and re-render calendar
				$scope.getEvents();
				socket.emit('event_deleted', {
					calId: deleteEvent_instructorId,
					eventId: deleteEvent_eventId
				});
		  	})
		  	.error(function(data, status, headers, config) {
		  		console.log('error deleting an event!');
		  		console.log(data);
		  	});
		}
		else{
			console.log('cancelled delete');
		}
	}


	/********function to change times of an event after if has been dragged*********/
	/********used on drag-drop only; NOT on resizing****************/
	$scope.editEventTime = function(event, delta, revertFunc) {

		//do something only if confirmed by user (confirm==true)
        if (confirm("Are you sure about this change?")) {
            //build the modified event
	        var modifiedEvent = {
	        	start: event.start.toDate().toISOString(),
	        	allDay: event.allDay
	        };

	        if(!event.end){
	        	modifiedEvent.end = new Date(event.start.toDate().getTime() + 7200000).toISOString();
	        }
	        else{
	        	modifiedEvent.end = event.end;
	        }

	        //now build the PUT url
	        var url = '/api/instructors/events/'+event._id;

	        //now PUT to server
			$http.put(url, modifiedEvent)
			.success(function(data, status, headers, config) {			
				//fetch events again and re-render calendar
				//$scope.getEvents();
				socket.emit('event_modified', {
					calId: event.source.instructorId,
					eventId: event._id
				});
		  	})
		  	.error(function(data, status, headers, config) {
		  		console.log('error PUTting an event! (drag-drop)');
		  		console.log(data);
		  	});
        }
        else{
        	//revertFunc() has not been declared in this file
        	//maybe it gets passed as in implicit argument
        	revertFunc();
        }
    }


	/******function only to open bootstrap modal******/
	$scope.openModal = function(start, end){
		$scope.newEventDialog_start = start;
		$scope.newEventDialog_end = end;

		//use this syntax to avoid namespace conflicts
	    jQuery(function($){
	    	$('#myModal').modal('show');
		});
	}

	//called after "done" button is clicked in the modal dialog
	//post newly created event to the server from this function
	$scope.done_postEvent = function(){

		//POST event only if all the necessary data is available
		//necessary data = start, end, title, instructorId
		if($scope.newEventDialog_start && $scope.newEventDialog_end
			&& $scope.newEventDialog_Title && $scope.newEventDialog_SelectedInstructor){

			//first convert "start" and "end" to ISOStrings as required by server api
			var msec = $scope.newEventDialog_start.toDate().getTime();
			$scope.newEventDialog_start = new Date(msec+39600000).toISOString();  //add 11 hours
			msec = $scope.newEventDialog_end.toDate().getTime();
			$scope.newEventDialog_end = new Date(msec-39600000).toISOString();   //subtract 11 hours

			//now build the queryString
			var url = '/api/instructors/events/'+String($scope.newEventDialog_SelectedInstructor);

			//now post data to server
			$http.post(url,
			{
				title: $scope.newEventDialog_Title,
				start: $scope.newEventDialog_start,
				end: $scope.newEventDialog_end
			})
			.success(function(data, status, headers, config) {

				socket.emit('event_added', {
					calId: $scope.newEventDialog_SelectedInstructor,
					eventId: null
				});


				//clear all new event related data
				$scope.newEventDialog_end = '';
				$scope.newEventDialog_start = '';
				$scope.newEventDialog_Title = '';
				$scope.newEventDialog_SelectedInstructor = '';

				//fetch events again and re-render calendar
				$scope.getEvents();
		  	})
		  	.error(function(data, status, headers, config) {
		  		console.log('error creating new event!');
		  		console.log(data);
		  	});
		}
		else{
			console.log('POST event data insufficient!');
		}
	}


	/***********GET events based on checkbox values**************/
	$scope.getEvents = function(){
		//get the user's checkbox inputs(on left vertical panel of this page)
		var inputs = sharedDataFactory.getCheckboxInputs();
		$scope.checkboxData = inputs;
		//build queryString for the api
		var queryString = '/';
		for(var i=0;i<inputs.length;i++){
			queryString+=inputs[i]._id+',';
		}
		queryString = queryString.substring(0, queryString.length - 1);

		//get data from the api using queryString
		$http.get('/api/instructors'+queryString)
		.success(function(data, status, headers, config) {
			var colorsArray = ['lightblue', 'lightgreen', 'pink', 'grey', 'silver', 'yellow', 'orange', 'lightred', 'violet', 'golden'];
	        $scope.dataEventSources = [];

	        //loop over data only if it is an array so that renderCalender does not crash
	        if(Array.isArray(data)){
	        	for(var i=0;i<data.length;i++){
		        	var x = {
		        		instructorId: data[i]._id,
		        		events: data[i].events,
		        		borderColor: colorsArray[i],
		        		backgroundColor: colorsArray[i],
		        		textColor: 'black'
		        	}
		        	$scope.dataEventSources.push(x);
		        }	
	        }
	        //consider data as a single variable instead of an array
	        else{
	        	var x = {
	        			instructorId: data._id,
		        		events: data.events,
		        		borderColor: colorsArray[i],
		        		backgroundColor: colorsArray[i],
		        		textColor: 'black'
		        	}
		        	$scope.dataEventSources.push(x);
	        }

	        //destroy and re-render calendar
	        jQuery(function($){
		    	$('#calendar').fullCalendar('destroy');
			});
	        $scope.renderCalendar();
		})
		.error(function(data, status, headers, config) {
			console.log('error fetching calendars!');
			console.log(data);
		});
	}

	//register getEvents as observer of the sharedDataFactory model
	sharedDataFactory.registerObserverCallback($scope.getEvents);

	/*render FullCalendar*/
	$scope.renderCalendar = function() {
		jQuery(function($){
			$('#calendar').fullCalendar({
				defaultView: $scope.viewMode,
				header: {
					left: 'prev,next today',
					center: 'title',
					right: 'month,agendaWeek,agendaDay'
				},
				selectable: true,
				selectHelper: true,
				select: $scope.openModal,
				eventClick: $scope.clickEvent_delete,
				lang: $scope.currentLangCode,
				buttonIcons: false, // show the prev/next text
				weekNumbers: true,
				editable: true,
				eventDrop: $scope.editEventTime,
				eventResize: $scope.onEventResize,
				eventLimit: true, // allow "more" link when too many events
				eventSources: $scope.dataEventSources,
				//viewRender changes the view mode (month/week/day) when user
				//clicks on the month/week/day buttons
				viewRender: function(view,element){
					$scope.viewMode = view.name;
					var b = $('#calendar').fullCalendar('getDate');
					//console.log(b);
					$scope.currentDate = b;
				}
			});	

			$('#calendar').fullCalendar('gotoDate', $scope.currentDate);
		});
	}

	//$scope.getEvents();

	//syntax to avoid namespace conflicts
	jQuery(function($){
		// build the language selector's options
		$.each($.fullCalendar.langs, function(langCode) {
			$('#lang-selector').append(
				$('<option/>')
					.attr('value', langCode)
					.prop('selected', langCode == $scope.currentLangCode)
					.text(langCode)
			);
		});


		// rerender the calendar when the selected option changes
		$('#lang-selector').on('change', function() {
			if (this.value) {
				$scope.currentLangCode = this.value;
				$('#calendar').fullCalendar('destroy');
				$scope.renderCalendar();
			}
		});
	});


	/******all socket.io codes*******/

	//generic callback for most socket.on('xx') type events
	$scope.genericSocketHandler = function(data){
		var xx = $scope.checkboxData;
		for(var i=0;i<xx.length;i++){
			if(xx[i]._id == data.calId)
				$scope.getEvents();
		}
	}
	

	socket.on('event_deleted', $scope.genericSocketHandler);

	socket.on('event_added', $scope.genericSocketHandler);

	socket.on('event_modified', $scope.genericSocketHandler);
});