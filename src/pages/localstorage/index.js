import '../../scss/style.scss';
import { changePageTitle, messageDisplay } from '../../js/helper.js';

changePageTitle('Local storage');

const messageBroadcast = (message) => {
	localStorage.setItem('message', JSON.stringify(message));
	localStorage.removeItem('message');
}

const messageReceive = (event) => {
	/* Ignore other keys */
	if (event.key !== 'message') return;

	const message = JSON.parse(event.newValue);
	/* Ignore empty message or message reset */
	if (!message) return;

	/* Here you act on messages */
	messageDisplay(message);
}

const handleSendMessage = (event) => {
	event.preventDefault();
	const message = event.target.message.value;
	if (!message) return;

	messageDisplay(message);
	messageBroadcast(message);

	event.target.reset();
}

window.addEventListener('storage', messageReceive);
document.forms.messageForm.addEventListener('submit', handleSendMessage);
