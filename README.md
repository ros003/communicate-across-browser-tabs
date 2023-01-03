# Communicate across browser tabs using JavaScript

This repository contains an example project which shows how to communicate across browser tabs in real-time.

### Installation and Usage
To run this project, clone a repository using the command line:

```
git clone https://github.com/ros003/communicate-across-browser-tabs.git
```

Install the dependency:
```
npm install
```

Run the dev server:
```
npm run start
```

---

Users can open the same application in multiple tabs at the same time. It may be necessary to sync data locally between these tabs in some cases. Here describes a pure front-end solution for cross-tab communication.

Cases where you need this:
- Synchronize the application state across Browser Tabs.
- Changing the theme (e.g., Dark or Light theme) of the application propagates across the already opened Browser Tabs.
- Retrieve the latest token for authentication and share it across Browser Tabs.

Three ways to communicate across browser tabs in realtime:
1. [LocalStorage](#local-storage)
2. [Broadcast Channel API](#broadcast-channel-api)
3. [SharedWorker](#sharedworker)

---
## Local Storage

We can use [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) for this because it's shared across browser contexts for the same origin and because we can listen for changes. To start with Let's add our LocalStorage event listener and a handler method that will be called when LocalStorage changes.

### Creating a storage listener
In order to get notified when a tab sends a message to other tabs, you simply need to bind on the `storage` event.
```
window.addEventListener('storage', messageReceive);
```

### Listening for Messages
The other Tabs which listen to the event will receive it, as shown below.

```
const messageReceive = (event) => {
	/* Ignore other keys */
	if (event.key !== 'message') return;

	const message = JSON.parse(event.newValue);
	/* Ignore empty message or message reset */
	if (!message) return;

	/* Here you act on messages */
}
```

### Posting Messages
Set the message in local storage and clear it right away. This is a safe way how to communicate with other tabs while not leaving any traces.
```
const messagePost = (message) => {
	localStorage.setItem('message', JSON.stringify(message));
	localStorage.removeItem('message');
}
```

### Minuses:
- For a large chunk of data, this approach has adverse effects since LocalStorage is synchronous. And hence can block the main UI thread.
- The listener will not be called on the tab where the change has occurred (`localStorage.setItem()`).

---

# Broadcast channel API
Using the [Broadcast Channel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API), we can communicate between browsing contexts of the same origin (windows, tabs, frames, and iframes).

### Creating a new channel
To begin we'll need to create a new BroadcastChannel instance that we can work with.
```
const channel = new BroadcastChannel('messageChannel');
```

### Listening for Messages
Other Tabs can listen to the channel as follows.
```
channel.addEventListener ('message', (event) => {
	const message = event.data;

	/* Ignore empty message or message reset */
	if (!message) return;

	/* Here you act on messages */
});
```

### Posting Messages
For posting messages we need to call the method `postMessage` on our broadcast channel.
```
const message = 'Your message';
channel.postMessage(message);
```

### Disconnecting a channel
To leave a channel, call the `close()` method on the object.
```
channel.close();
```

### Minuses:
- The main downside of using a BroadcastChannel is its browser compatibility. It doesn't support Internet Explorer, which isn't a big deal anymore, but it also doesn't support Safari and that very well could be a deal-breaker.

---

## SharedWorker

A [Shared Worker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker) behaves in a similar way as regular Web Workers except that different browsing contexts from the same origin will have shared access to the worker. In other words, if you have five tabs running the same Shared Worker script, the browser will only run one instance of that script in the background, and the five tabs will have shared access to the context and state of that single running Shared Worker.

### Creating a Shared Web Worker
To create a shared web worker, you pass a JavaScript file name to a new instance of the SharedWorker object.

```
/* script.js */

const worker = new SharedWorker(new URL('shared-worker.js', import.meta.url));
```

### Communicating with a Shared Worker
Any of your page scripts can communicate with the shared web worker. Sending data to and receiving data from our worker works the same as it does inside our worker. We’ll listen for messages using `onmessage` and we'll send data using `postMessage`.

### Listening for Messages
```
/* script.js */

worker.port.onmessage = (event) => {
	const message = event.data;

	/* Ignore empty message or message reset */
	if (!message) return;

	/* Here you act on messages */
};
```

### Posting Messages
```
/* script.js */

const message = 'Your message';
worker.port.postMessage(message);
```

### Sending & receiving data inside a Shared Worker
Inside our worker script, we'll need a method called `onconnect` which, when called, is passed an event. Our `onconnect` function will be called anytime a new browser instance connects to our worker. Inside our event resides a ports array containing an array of the ports that trigger the `onconnect` call. We'll want to grab the first port from this array. This [port](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker/port) is what we'll use to listen to and post messages to the port's connected browser instance.

```
/* shared-worker.js */

onconnect = (connectEvent) => {
	const [port] = connectEvent.ports;
};
```

If the purpose of your worker isn't to just consume data, you'll likely want to store/manipulate the data and then post it back out for consumption by your application. To do this, we can call `postMessage` off our port.

```
/* shared-worker.js */

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
```





