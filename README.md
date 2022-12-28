# Communicate across browser tabs using JavaScript

Scenarios where you need this:
- Synchronize the application state across Browser Tabs.
- Changing theme (e.g., Dark or Light theme) of the application propagates across the already opened Browser Tabs.
- Retrieve the latest token for authentication and share it across Browser Tabs.

3 ways to communicate across browser tabs in realtime:
1. LocalStorage
2. BroadcastChannel
3. SharedWorker

---
## Local storage

We can use LocalStorage for this because it's shared across browser contexts for the same origin and because we can listen for changes. To start with Let's add our LocalStorage event listener and a handler method that will be called when LocalStorage changes.

In order to get notified when a tab sends a message to other tabs, you simply need to bind on 'storage' event.
```
window.addEventListener('storage', messageReceive);
```

Set the message in local storage and clear it right away. This is a safe way how to communicate with other tabs while not leaving any traces.
```
const messageBroadcast => (message) {
	localStorage.setItem('message',JSON.stringify(message));
	localStorage.removeItem('message');
}
```

Receive the message.
```
 const messageReceive = (event) => {
 	/* Ignore other keys */
	if (event.key !== 'message') return;

	const message = JSON.parse(event.newValue);
	/* Ignore empty msg or msg reset */
	if (!message) return;

	/* Here you act on messages */
	console.log(message.data);
}
```

### Minuses:
- For a large chunk of data, this approach has adverse effects since LocalStorage is synchronous. And hence can block the main UI thread.
* The listener will not be called on the tab where the change has occurred (localStorage.setItem()).

---
