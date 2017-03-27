var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
	console.info('Master Process Started - PID: ' + process.pid);
	// Fork workers.
	for (var i = 0; i < (numCPUs > 2 ? numCPUs : 2); i++) {
		var worker = cluster.fork();
		console.info('Worker Started - PID: ' + worker.process.pid);
	}
	cluster.on('exit', function(worker, code, signal) {
		// Restart the worker
		var worker = cluster.fork();

		// Note the process IDs
		var newPID = worker.process.pid;
		var oldPID = deadWorker.process.pid;

		// Log the event
		console.warn('worker ' + oldPID + ' died.');
		console.warn('worker ' + newPID + ' born.');
	});
} else {
	require('./index');
}
