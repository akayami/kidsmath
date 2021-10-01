const cluster = require('cluster');
const numCPUs = require('os').cpus().length;


const defaults = {
	PORT: 3000
};
const args = require('args');

args
	.option('PORT', 'The port on which the app will be running')
	.option(['l','logs'], 'Specify where access logs should be sent to')
;
const flags = {...defaults, ...process.env, ...args.parse(process.argv)}

if (cluster.isMaster) {
	console.info('Master Process Started - PID: ' + process.pid);
	// Fork workers.
	for (let i = 0; i < (numCPUs > 2 ? numCPUs : 2); i++) {
		const worker = cluster.fork();
		console.info('Worker Started - PID: ' + worker.process.pid);
	}
	cluster.on('exit', function(code, signal) {
		// Restart the worker
		const worker = cluster.fork();

		// Note the process IDs
		const newPID = worker.process.pid;
		const oldPID = deadWorker.process.pid;

		// Log the event
		console.warn('worker ' + oldPID + ' died.');
		console.warn('worker ' + newPID + ' born.');
	});
} else {
	require('./index')(flags);
}
