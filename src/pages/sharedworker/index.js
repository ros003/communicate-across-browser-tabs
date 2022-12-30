import '../../scss/style.scss';
import { changePageTitle, messageDisplay } from "../../js/helper.js";

changePageTitle('Shared Worker');

const worker = new SharedWorker(new URL('shared-worker.js', import.meta.url),{ type: 'module', name: 'Across tabs' });

worker.port.onmessage = (event) => {
	const message = event.data;
	/* Ignore empty message or message reset */
	if (!message) return;

	/* Here you act on messages */
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
