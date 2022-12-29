const connections = [];

onconnect = (connectEvent) => {
	const port = connectEvent.ports[0];
	connections.push(port);

	port.onmessage = ({ data }) => {
		connections.forEach(connection => {
			if (connection !== port) {
				connection.postMessage(data);
			}
		});
	};
};
