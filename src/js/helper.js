const messagesList = document.getElementById('messagesList');
const messagesPlaceholder = document.getElementById('messagesPlaceholder');

export const changePageTitle = (title) => {
	document.title = title;
}

export const createMessageElement = (message) => {
	const element = document.createElement('li');

	element.textContent = message;
	element.className = 'list-group-item';

	return element;
}

export const hidePlaceholder = () => {
	messagesPlaceholder.classList.add('hidden');
}

export const messageDisplay = (message) => {
	hidePlaceholder();

	messagesList.appendChild(createMessageElement(message));
}
