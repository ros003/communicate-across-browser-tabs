const connections = [];

onconnect = (connectEvent) => {
	const [port] = connectEvent.ports;
	connections.push(port);

	port.onmessage = ({ data }) => {
		connections.forEach(connection => {
			if (connection !== port) {
				connection.postMessage(data);
			}
		});
	};
};
