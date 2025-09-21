// content.js

// Single initialization check
if (!window.__hintBoxInjected) {
    window.__hintBoxInjected = true;
    initializeHintTextbox();
}

function createHintSection(hintNumber) {
    const container = document.createElement('div');
    container.setAttribute('data-hint-textbox', `hint-${hintNumber}`);
    container.style.marginTop = '10px';

    // Header with dropdown style
    const header = document.createElement('div');
    header.className = 'text-body group flex cursor-pointer items-center gap-2 transition-colors px-2';
    
    const toggleIcon = document.createElement('span');
    toggleIcon.textContent = '💡';
    toggleIcon.className = 'w-5 h-5 p-[2px] flex items-center justify-center text-label-2 dark:text-dark-label-2 group-hover:text-label-1 dark:group-hover:text-dark-label-1';
    
    const label = document.createElement('span');
    label.textContent = `Hint ${hintNumber}`;
    label.className = 'text-sd-foreground font-medium flex-grow';

    // Arrow SVG
    const arrow = document.createElement('div');
    arrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="origin-center transition-transform transform rotate-0" style="transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1); transform-origin: center;"><path fill-rule="evenodd" d="M16.293 9.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L12 13.586l4.293-4.293z" clip-rule="evenodd"></path></svg>`;
    arrow.className = 'text-gray-4 dark:text-dark-gray-4 group-hover:text-gray-5 dark:group-hover:text-dark-gray-5';

    header.appendChild(toggleIcon);
    header.appendChild(label);
    header.appendChild(arrow);
    container.appendChild(header);

    // Content wrapper
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'overflow-hidden transition-all';
    contentWrapper.style.height = '0px';
    contentWrapper.style.transitionDuration = '0.25s';
    contentWrapper.style.opacity = '0';
    
    const innerContainer = document.createElement('div');
    innerContainer.style.padding = '8px 16px';

    contentWrapper.appendChild(innerContainer);
    container.appendChild(contentWrapper);

    // Toggle functionality
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

function createEditableContent(hintNumber, innerContainer, contentWrapper, existingText = '') {
    // Clear existing content
    innerContainer.innerHTML = '';

    // Textarea container with website styling
    const textareaContainer = document.createElement('div');
    textareaContainer.className = 'flex w-full flex-col mt-3 rounded-[13px] bg-layer-2 dark:bg-dark-layer-2 shadow-level1 dark:shadow-dark-level1';
    
    // Textarea
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
    
    // Set existing text if provided
    if (existingText) {
        textarea.value = existingText;
    }
    
    // Function to update the container height
    function updateContainerHeight() {
        contentWrapper.style.height = 'auto';
        const newHeight = contentWrapper.scrollHeight + 'px';
        contentWrapper.style.height = newHeight;
    }
    
    // Auto-expand function
    function autoExpand() {
        textarea.style.height = 'auto';
        textarea.style.height = Math.max(80, textarea.scrollHeight) + 'px';
        
        // Update container height after textarea resize
        setTimeout(() => {
            updateContainerHeight();
        }, 0);
    }
    
    textarea.addEventListener('input', autoExpand);
    
    // Bottom toolbar
    const bottomToolbar = document.createElement('div');
    bottomToolbar.className = 'relative box-content flex h-8 items-end py-4 px-6';
    
    const leftSection = document.createElement('div');
    leftSection.className = 'flex flex-1 flex-col';
    
    const toolbarButtons = document.createElement('div');
    toolbarButtons.className = 'inherit flex h-8 items-end gap-2';
    
    const codeBtn = document.createElement('div');
    codeBtn.className = 'flex cursor-pointer items-center rounded-[5px] p-1 text-base text-gray-7 dark:text-dark-gray-7 hover:bg-fill-4 dark:hover:bg-dark-fill-4';
    codeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path fill-rule="evenodd" d="M13.27 5.02c.456.1.764.562.727 1.06l-.015.116-2.181 12c-.099.541-.578.893-1.07.784-.457-.1-.765-.562-.728-1.06l.015-.116 2.181-12c.099-.541.578-.893 1.07-.784zm4.65.37l.07.096 3.857 6c.178.277.2.614.067.906l-.067.123-3.857 6c-.304.473-.962.627-1.47.342-.47-.264-.646-.812-.425-1.268l.058-.104L19.678 12l-3.525-5.485c-.283-.44-.161-1.001.264-1.307l.103-.065a1.123 1.123 0 011.4.246zm-11.84 0c.3-.365.83-.49 1.28-.305l.12.058.103.065a.96.96 0 01.326 1.194l-.062.113L4.322 12l3.525 5.485.058.104c.221.456.046 1.005-.425 1.268a1.123 1.123 0 01-1.4-.246l-.07-.097-3.857-6-.067-.122a.939.939 0 010-.784l.067-.123 3.857-6 .07-.096z" clip-rule="evenodd"></path></svg>';
    
    const linkBtn = document.createElement('div');
    linkBtn.className = 'flex cursor-pointer items-center rounded-[5px] p-1 text-base text-gray-7 dark:text-dark-gray-7 hover:bg-fill-4 dark:hover:bg-dark-fill-4';
    linkBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path fill-rule="evenodd" d="M13 7a1 1 0 011-1h2a6 6 0 010 12h-2a1 1 0 110-2h2a4 4 0 000-8h-2a1 1 0 01-1-1zm-3 10a1 1 0 01-1 1H8A6 6 0 018 6h1a1 1 0 010 2H8a4 4 0 100 8h1a1 1 0 011 1zm-1-6h6a1 1 0 110 2H9a1 1 0 110-2z" clip-rule="evenodd"></path></svg>';
    
    toolbarButtons.appendChild(codeBtn);
    toolbarButtons.appendChild(linkBtn);
    
    leftSection.appendChild(toolbarButtons);
    
    // Right section with Save button
    const rightSection = document.createElement('div');
    rightSection.className = 'flex items-center gap-4';
    
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.disabled = true;
    saveBtn.className = 'font-medium items-center whitespace-nowrap focus:outline-none opacity-50 inline-flex transition-colors cursor-pointer py-[5px] px-3 rounded-lg bg-green-s dark:bg-dark-green-s hover:bg-green-3 dark:hover:bg-dark-green-3 text-white dark:text-dark-white';
    
    // Status display
    const saveStatus = document.createElement('div');
    saveStatus.style.fontSize = '12px';
    saveStatus.style.color = '#666';
    saveStatus.style.alignSelf = 'center';
    saveStatus.textContent = '';

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
    rightSection.appendChild(saveBtn);
    
    bottomToolbar.appendChild(leftSection);
    bottomToolbar.appendChild(rightSection);
    
    textareaContainer.appendChild(textarea);
    textareaContainer.appendChild(bottomToolbar);
    innerContainer.appendChild(textareaContainer);

    // Save functionality
    saveBtn.onclick = () => {
        const text = textarea.value.trim();
        if (text) {
            saveHint(text, hintNumber, saveStatus);
            createSavedContent(hintNumber, innerContainer, contentWrapper, text);
        }
    };

    // Initial setup
    setTimeout(() => {
        autoExpand();
        updateSaveButtonState();
        updateContainerHeight();
    }, 0);

    return textarea;
}

function getProblemIdFromUrl() {
    const url = window.location.href;
    const match = url.match(/\/problems\/([^/]+)/);
    return match ? btoa(match[1]).slice(0, 50) : 'unknown';
}

function createSavedContent(hintNumber, innerContainer, contentWrapper, text) {
    // Clear existing content
    innerContainer.innerHTML = '';
    
    // Create the saved text display with the exact format you specified
    const savedDiv = document.createElement('div');
    savedDiv.className = 'overflow-hidden transition-all';
    savedDiv.style.height = 'auto';
    savedDiv.style.transitionDuration = '0.25s';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'text-body text-sd-foreground mt-2 pl-4 elfjS';
    textDiv.textContent = text;
    
    savedDiv.appendChild(textDiv);
    
    // Create edit button section with the format you specified
    const editSection = document.createElement('div');
    editSection.className = 'flex items-center gap-4 py-4 pl-4';

    
    const editButton = document.createElement('div');
    editButton.className = 'flex items-center group cursor-pointer gap-2 transition-colors';
    
    // Pencil icon SVG
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
        createEditableContent(hintNumber, innerContainer, contentWrapper, text);
    };

    deleteButton.onclick = () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this hint?");
        if (confirmDelete) {
            deleteHint(hintNumber);
            createEditableContent(hintNumber, innerContainer, contentWrapper);
        }
    };
    
    // Update container height after content is added
    setTimeout(() => {
        contentWrapper.style.height = 'auto';
        const newHeight = contentWrapper.scrollHeight + 'px';
        contentWrapper.style.height = newHeight;
    }, 0);
}

function createHintsList() {
    const hintsList = document.createElement('div');
    hintsList.style.display = 'none';
    hintsList.style.marginTop = '16px';

    for (let i = 1; i <= 3; i++) {
        const hr = document.createElement('hr');
        hr.className = 'border-divider-3 dark:border-dark-divider-3 my-2';
        hintsList.appendChild(hr);

        const { container, contentWrapper, innerContainer } = createHintSection(i);
        hintsList.appendChild(container);
        
        // Load saved hint and determine display mode
        const savedText = loadHint(i);
        if (savedText) {
            createSavedContent(i, innerContainer, contentWrapper, savedText);
        } else {
            const textarea = createEditableContent(i, innerContainer, contentWrapper);
            textarea.dispatchEvent(new Event('input'));
        }
    }

    return hintsList;
}

function saveHint(text, hintNumber, statusElement) {
    const currentUrl = window.location.href;
    const hintKey = `hint_${hintNumber}_${btoa(currentUrl).slice(0, 50)}`;
    
    try {
        localStorage.setItem(hintKey, text);
        statusElement.textContent = '✅ Saved!';
        statusElement.style.color = '#28a745';
        
        setTimeout(() => {
            statusElement.textContent = '';
        }, 2000);
    } catch (error) {
        statusElement.textContent = '❌ Save failed';
        statusElement.style.color = '#dc3545';
        console.error('Could not save hint:', error);
    }
}

function deleteHint(hintNumber) {
    const hintKey = `hint_${hintNumber}_${getProblemIdFromUrl()}`;
    try {
        localStorage.removeItem(hintKey);
    } catch (error) {
        console.error('Could not delete hint:', error);
    }
}


function loadHint(hintNumber) {
    const currentUrl = window.location.href;
    const hintKey = `hint_${hintNumber}_${btoa(currentUrl).slice(0, 50)}`;
    
    try {
        return localStorage.getItem(hintKey);
    } catch (error) {
        console.log('Could not load saved hint:', error);
        return null;
    }
}

function addHintTextbox() {
    const targetContainer = document.querySelector('div.mt-6.flex.flex-col.gap-3');
    
    if (!targetContainer || targetContainer.querySelector('[data-hint-textbox]')) {
        return;
    }

    // Main header and container for the whole hints section
    const mainHeaderContainer = document.createElement('div');
    const mainHeader = document.createElement('div');
    mainHeader.className = 'text-body group flex cursor-pointer items-center gap-2 transition-colors';

    const toggleIcon = document.createElement('span');
    toggleIcon.textContent = '💡';
    toggleIcon.className = 'w-5 h-5 p-[2px] flex items-center justify-center text-label-2 dark:text-dark-label-2 group-hover:text-label-1 dark:group-hover:text-dark-label-1';

    const mainLabel = document.createElement('span');
    mainLabel.textContent = 'Personal Hints';
    mainLabel.className = 'text-sd-foreground';

    const arrow = document.createElement('div');
    arrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="origin-center transition-transform" style="transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1); transform-origin: center;"><path fill-rule="evenodd" d="M16.293 9.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L12 13.586l4.293-4.293z" clip-rule="evenodd"></path></svg>`;
    arrow.style.marginLeft = 'auto';
    arrow.className = 'text-gray-4 dark:text-dark-gray-4 group-hover:text-gray-5 dark:group-hover:text-dark-gray-5';

    mainHeader.appendChild(toggleIcon);
    mainHeader.appendChild(mainLabel);
    mainHeader.appendChild(arrow);
    mainHeaderContainer.appendChild(mainHeader);

    // Hints container that will be toggled
    const hintsList = createHintsList();
    mainHeaderContainer.appendChild(hintsList);

    // Toggle logic for the main header
    let hintsExpanded = false;
    mainHeader.onclick = () => {
        hintsExpanded = !hintsExpanded;
        const arrowSvg = arrow.querySelector('svg');
        if (hintsExpanded) {
            hintsList.style.display = 'block';
            arrowSvg.style.transform = 'rotate(180deg)';
        } else {
            hintsList.style.display = 'none';
            arrowSvg.style.transform = 'rotate(0deg)';
        }
    };
    
    // Line before the entire hint section
    const newDivider = document.createElement('hr');
    newDivider.className = 'border-divider-3 dark:border-dark-divider-3';

    const referenceDivider = targetContainer.querySelector('hr:nth-child(17)');

    if (referenceDivider) {
        targetContainer.insertBefore(newDivider, referenceDivider);
        targetContainer.insertBefore(mainHeaderContainer, newDivider.nextSibling);
    } else {
        targetContainer.appendChild(newDivider);
        targetContainer.appendChild(mainHeaderContainer);
    }

    console.log('✅ Hint dropdowns added');
}

function initializeHintTextbox() {
    addHintTextbox();
    
    let currentUrl = window.location.href;
    const observer = new MutationObserver(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            setTimeout(addHintTextbox, 1000);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHintTextbox);
} else {
    initializeHintTextbox();
}