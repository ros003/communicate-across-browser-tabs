import '../../scss/style.scss';
import { changePageTitle, messageDisplay } from '../../js/helper.js';

changePageTitle('Broadcast Channel');

const channel = new BroadcastChannel('messageChannel');

channel.addEventListener ('message', (event) => {
	console.log(event);
	const message = event.data;
	if (!message) return;

	messageDisplay(message);
});

const handleSendMessage = (event) => {
	event.preventDefault();
	const message = event.target.message.value;
	if (!message) return;

	messageDisplay(message);
	channel.postMessage(message);

	event.target.reset();
}

document.forms.messageForm.addEventListener('submit', handleSendMessage);
