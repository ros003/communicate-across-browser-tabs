# Communicate across browser tabs using JavaScript

Users can open the same application in multiple tabs at the same time. It may be necessary to sync data locally between these tabs in some cases.

Cases where you need this:
- Synchronize the application state across Browser Tabs.
- Changing theme (e.g., Dark or Light theme) of the application propagates across the already opened Browser Tabs.
- Retrieve the latest token for authentication and share it across Browser Tabs.

Three ways to communicate across browser tabs in realtime:
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

### Listening for Messages
The other Tabs which listen to the event will receive it, as shown below.

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

### Posting Messages
Set the message in local storage and clear it right away. This is a safe way how to communicate with other tabs while not leaving any traces.
```
const messageBroadcast => (message) {
	localStorage.setItem('message',JSON.stringify(message));
	localStorage.removeItem('message');
}
```

### Minuses:
- For a large chunk of data, this approach has adverse effects since LocalStorage is synchronous. And hence can block the main UI thread.
* The listener will not be called on the tab where the change has occurred (localStorage.setItem()).

---

# Broadcast Channel API
Using the Broadcast Channel API, we can communicate between browsing contexts of the same origin (windows, tabs, frames, and iframes).

To begin we'll need to create a new BroadcastChannel instance that we can work with.
```
const channel = new BroadcastChannel('messageChannel');
```

### Listening for Messages
Other Tabs can listen to channel as follows.
```
channel.addEventListener ('message', (event) => {
	console.log(event.data);
});
```

### Posting Messages
For posting messages we need to call the method `postMessage` on our broadcast channel.
```
channel.postMessage("Your message.");
```

### Disconnecting a channel
To leave a channel, call the `close` method on the object.
```
channel.close();
```

### Minuses:
- The main downside of using a BroadcastChannel is its browser compatibility. It doesn't support Internet Explorer, which isn't a big deal anymore, but it also doesn't support Safari and that very well could be a deal-breaker.

---

