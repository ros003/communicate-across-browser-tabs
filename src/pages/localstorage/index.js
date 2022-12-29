import '../../scss/style.scss';
import { changePageTitle, messageDisplay } from '../../js/helper.js';

changePageTitle('Local storage');

const messageBroadcast = (message) => {
	localStorage.setItem('message', JSON.stringify(message));
	localStorage.removeItem('message');
}

const messageReceive = (event) => {
	console.log('event: ', event);
	if (event.key !== 'message') return;
	const message = JSON.parse(event.newValue);
	if (!message) return;

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
