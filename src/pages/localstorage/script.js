import { changePageTitle } from '../../js/helper';

changePageTitle('Local storage');

const messageBroadcast = (message) => {
	localStorage.setItem('message', JSON.stringify(message));
	localStorage.removeItem('message');
}

const messageReceive = (event) => {
	if (event.key !== 'message') return;

	const message = JSON.parse(event.newValue);

	if (!message) return;

	if (message.type === 'receive') {
		console.log(message.text);
	}
}

window.addEventListener('storage', messageReceive);

const sendButton = document.getElementById('sendMessage');

sendButton.addEventListener('click', () => {
	messageBroadcast({ type: 'receive', text: 'Test message' });
});
