function createHintSection(hintNumber) {
    const container = document.createElement('div');
    container.setAttribute('data-hint-textbox', `hint-${hintNumber}`);
    container.style.marginTop = '10px';

    const header = document.createElement('div');
    header.className = 'text-body group flex cursor-pointer items-center gap-2 transition-colors px-2';
    
    const toggleIcon = document.createElement('span');
    toggleIcon.textContent = '💡';
    toggleIcon.className = 'w-5 h-5 p-[2px] flex items-center justify-center text-label-2 dark:text-dark-label-2 group-hover:text-label-1 dark:group-hover:text-dark-label-1';
    
    const label = document.createElement('span');
    label.textContent = `My Hint ${hintNumber}`;
    label.className = 'text-sd-foreground font-medium flex-grow';

    const arrow = document.createElement('div');
    arrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="origin-center transition-transform transform rotate-0" style="transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1); transform-origin: center;"><path fill-rule="evenodd" d="M16.293 9.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L12 13.586l4.293-4.293z" clip-rule="evenodd"></path></svg>`;
    arrow.className = 'text-gray-4 dark:text-dark-gray-4 group-hover:text-gray-5 dark:group-hover:text-dark-gray-5';

    header.appendChild(toggleIcon);
    header.appendChild(label);
    header.appendChild(arrow);
    container.appendChild(header);

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'overflow-hidden transition-all';
    contentWrapper.style.height = '0px';
    contentWrapper.style.transitionDuration = '0.25s';
    contentWrapper.style.opacity = '0';
    
    const innerContainer = document.createElement('div');
    innerContainer.style.padding = '8px 16px';

    contentWrapper.appendChild(innerContainer);
    container.appendChild(contentWrapper);

    let expanded = false;
    header.onclick = () => {
        expanded = !expanded;
        const arrowSvg = arrow.querySelector('svg');
        
        if (expanded) {
            contentWrapper.style.height = contentWrapper.scrollHeight + 'px';
            contentWrapper.style.opacity = '1';
            arrowSvg.style.transform = 'rotate(180deg)';
        } else {
            contentWrapper.style.height = '0px';
            contentWrapper.style.opacity = '0';
            arrowSvg.style.transform = 'rotate(0deg)';
        }
    };

    return { container, contentWrapper, innerContainer, arrow };
}

function createTextBox(hintNumber, innerContainer, contentWrapper, existingText = '') {
    innerContainer.innerHTML = '';

    const originalText = existingText;


    const textareaContainer = document.createElement('div');
    textareaContainer.className = 'flex w-full flex-col mt-3 rounded-[13px] bg-layer-2 dark:bg-dark-layer-2 shadow-level1 dark:shadow-dark-level1';
    
    const textarea = document.createElement('textarea');
    textarea.setAttribute('rows', '1');
    textarea.setAttribute('placeholder', 'Type your hint here...');
    textarea.setAttribute('data-gramm', 'false');
    textarea.setAttribute('data-gramm_editor', 'false');
    textarea.setAttribute('data-enable-grammarly', 'false');
    textarea.className = 'w-full resize-none bg-transparent py-4 px-6 text-md outline-0 dark:bg-transparent min-h-[80px] placeholder:text-label-4 dark:placeholder:text-dark-label-4 inherit';
    textarea.style.height = '80px';
    textarea.style.overflow = 'hidden';
    textarea.style.overflowWrap = 'break-word';
    
    if (existingText) {
        textarea.value = existingText;
    }
    
    function updateContainerHeight() {
        contentWrapper.style.height = 'auto';
        const newHeight = contentWrapper.scrollHeight + 'px';
        contentWrapper.style.height = newHeight;
    }
    
    function autoExpand() {
        textarea.style.height = 'auto';
        textarea.style.height = Math.max(80, textarea.scrollHeight) + 'px';
        
        setTimeout(() => {
            updateContainerHeight();
        }, 0);
    }
    
    textarea.addEventListener('input', autoExpand);
    
    const rightSection = document.createElement('div');
    rightSection.className = 'relative box-content flex h-8 items-end py-4 px-6 ml-auto gap-3';
    
    
    const saveStatus = document.createElement('div');
    saveStatus.style.fontSize = '12px';
    saveStatus.style.color = '#666';
    saveStatus.style.alignSelf = 'center';
    saveStatus.textContent = '';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'font-medium items-center whitespace-nowrap focus:outline-none inline-flex transition-colors cursor-pointer py-[5px] px-3 rounded-lg bg-gray-3 dark:bg-dark-gray-3 hover:bg-gray-4 dark:hover:bg-dark-gray-4 text-label-2 dark:text-dark-label-2';
    
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.disabled = true;
    saveBtn.className = 'font-medium items-center whitespace-nowrap focus:outline-none opacity-50 inline-flex transition-colors cursor-pointer py-[5px] px-3 rounded-lg bg-green-s dark:bg-dark-green-s hover:bg-green-3 dark:hover:bg-dark-green-3 text-white dark:text-dark-white';

    function updateSaveButtonState() {
        const hasContent = textarea.value.trim().length > 0;
        saveBtn.disabled = !hasContent;
        
        if (hasContent) {
            saveBtn.className = 'font-medium items-center whitespace-nowrap focus:outline-none inline-flex transition-colors cursor-pointer py-[5px] px-3 rounded-lg bg-green-s dark:bg-dark-green-s hover:bg-green-3 dark:hover:bg-dark-green-3 text-white dark:text-dark-white';
        } else {
            saveBtn.className = 'font-medium items-center whitespace-nowrap focus:outline-none opacity-50 inline-flex transition-colors cursor-pointer py-[5px] px-3 rounded-lg bg-green-s dark:bg-dark-green-s hover:bg-green-3 dark:hover:bg-dark-green-3 text-white dark:text-dark-white';
        }
    }

    textarea.addEventListener('input', () => {
        autoExpand();
        updateSaveButtonState();
    });
    textarea.addEventListener('keyup', updateSaveButtonState);
    textarea.addEventListener('paste', () => setTimeout(updateSaveButtonState, 0));
    
    rightSection.appendChild(saveStatus);

    if (originalText) {
        rightSection.appendChild(cancelBtn);
    }
    rightSection.appendChild(saveBtn);

    
    textareaContainer.appendChild(textarea);
    textareaContainer.appendChild(rightSection);
    innerContainer.appendChild(textareaContainer);

    cancelBtn.onclick = () => {
        if (originalText) {
            createSavedContent(hintNumber, innerContainer, contentWrapper, originalText);
        } else {
            textarea.value = '';
            updateSaveButtonState();
        }
    };

    saveBtn.onclick = async () => {
        const text = textarea.value.trim();
        if (text) {
            const success = await saveHint(text, hintNumber, saveStatus);
            if (success) {
                createSavedContent(hintNumber, innerContainer, contentWrapper, text);
            }
        }
    };

    setTimeout(() => {
        textarea.focus();
        autoExpand();
        updateSaveButtonState();
        updateContainerHeight();
    }, 0);

    return textarea;
}

function createSavedContent(hintNumber, innerContainer, contentWrapper, text) {
    innerContainer.innerHTML = '';
    
    const savedDiv = document.createElement('div');
    savedDiv.className = 'overflow-hidden transition-all';
    savedDiv.style.height = 'auto';
    savedDiv.style.transitionDuration = '0.25s';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'text-body text-sd-foreground mt-2 pl-4 elfjS';
    textDiv.textContent = text;
    
    savedDiv.appendChild(textDiv);
    
    const editSection = document.createElement('div');
    editSection.className = 'flex items-center gap-4 py-4 pl-4';

    const editButton = document.createElement('div');
    editButton.className = 'flex items-center group cursor-pointer gap-2 transition-colors';
    
    const editIcon = document.createElement('div');
    editIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path fill-rule="evenodd" d="M11 20a1 1 0 011-1h8a1 1 0 110 2h-8a1 1 0 01-1-1zM17.018 5c-.26 0-.51.104-.695.288L4.837 16.773l-.463 1.853 1.853-.463L17.712 6.677A.981.981 0 0017.018 5zm-2.11-1.126a2.983 2.983 0 014.219 4.217L7.444 19.773a1 1 0 01-.464.263l-3.738.934a1 1 0 01-1.213-1.212l.934-3.739a1 1 0 01.263-.464L14.91 3.874z" clip-rule="evenodd"></path></svg>`;
    editIcon.className = 'w-4.5 h-4.5 text-gray-6 dark:text-dark-gray-6 group-hover:text-gray-7 dark:group-hover:text-dark-gray-7';
    editIcon.style.marginLeft = 'auto';

    const editText = document.createElement('div');
    editText.className = 'text-xs text-label-3 dark:text-dark-label-3 group-hover:text-label-2 dark:group-hover:text-dark-label-2';
    editText.textContent = 'Edit';
    
    editButton.appendChild(editIcon);
    editButton.appendChild(editText);
    editSection.appendChild(editButton);

    const deleteButton = document.createElement('div');
    deleteButton.className = 'flex items-center group cursor-pointer gap-2 transition-colors';
    
    const deleteIcon = document.createElement('div');
    deleteIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="group-hover:text-gray-7 dark:group-hover:text-dark-gray-7 h-4.5 w-4.5"><path fill-rule="evenodd" d="M20 5h-4V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v1H4a1 1 0 000 2h1v12a3 3 0 003 3h8a3 3 0 003-3V7h1a1 1 0 100-2zm-6-1v1h-4V4h4zm-5 6a1 1 0 012 0v7a1 1 0 11-2 0v-7zm4 0a1 1 0 112 0v7a1 1 0 11-2 0v-7zM7 7h10v12a1 1 0 01-1 1H8a1 1 0 01-1-1V7z" clip-rule="evenodd"></path></svg>`;
    deleteIcon.className = 'w-4.5 h-4.5 text-gray-6 dark:text-dark-gray-6 group-hover:text-gray-7 dark:group-hover:text-dark-gray-7';
    deleteIcon.style.marginLeft = 'auto';

    const deleteText = document.createElement('div');
    deleteText.className = 'text-xs text-label-3 dark:text-dark-label-3 group-hover:text-label-2 dark:group-hover:text-dark-label-2';
    deleteText.textContent = 'Delete';

    deleteButton.appendChild(deleteIcon);
    deleteButton.appendChild(deleteText);
    editSection.appendChild(deleteButton);
    
    savedDiv.appendChild(textDiv);
    savedDiv.appendChild(editSection);
    
    innerContainer.appendChild(savedDiv);
    
    editButton.onclick = () => {
        createTextBox(hintNumber, innerContainer, contentWrapper, text);
    };

    deleteButton.onclick = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this hint?");
        if (confirmDelete) {
            const success = await deleteHint(hintNumber);
            if (success) {
                createTextBox(hintNumber, innerContainer, contentWrapper);
            }
        }
    };
    
    setTimeout(() => {
        contentWrapper.style.height = 'auto';
        const newHeight = contentWrapper.scrollHeight + 'px';
        contentWrapper.style.height = newHeight;
    }, 0);
}

