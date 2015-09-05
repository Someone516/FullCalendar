var socket = io.connect();

socket.on('server_event', function(data){
	console.log(JSON.stringify(data));
});