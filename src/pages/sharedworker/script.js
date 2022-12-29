import { changePageTitle, messageDisplay } from '../../js/helper';

changePageTitle('Shared Worker');

const worker = new SharedWorker(new URL('shared-worker.js', import.meta.url),{ type: 'module', name: 'Across tabs' });

worker.port.onmessage = (event) => {
	const message = event.data;
	if (!message) return;

	messageDisplay(message);
};

const handleSendMessage = (event) => {
	event.preventDefault();
	const message = event.target.message.value;
	if (!message) return;

	messageDisplay(message);
	worker.port.postMessage(message);

	event.target.reset();
}

document.forms.messageForm.addEventListener('submit', handleSendMessage);
