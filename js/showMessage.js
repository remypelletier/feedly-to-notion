
const showMessage = (parentWrapper, message, type) => {
    
    // Clean previous message
    parentWrapper.innerHTML = '';

    const messageClass = getMessageClass(type);
    const p = createMessageElement(message, messageClass);
    const close = createMessageCloseIconElement();

    p.append(close);
    parentWrapper.appendChild(p);
}

const getMessageClass = (type) => {
    let messageClass = '';
    switch (type) {
        case 'error':
            messageClass = 'message__warning';
        break;
        case 'success':
            messageClass = 'message__success';
        break;
        default:
            messageClass = 'message__info';
    }
    return messageClass;
}

const createMessageElement = (message, messageClass) => {
    const p = document.createElement('p');
    p.classList.add('message');
    p.classList.add(messageClass);
    p.innerHTML = message;
    return p;
}

const createMessageCloseIconElement = () => {
    const close = document.createElement('span');
    close.classList.add('message__close');
    close.addEventListener('click', (event) => {
        event.target.parentElement.remove();
    });
    return close;
}
