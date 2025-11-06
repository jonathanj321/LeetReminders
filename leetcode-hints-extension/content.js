if (!window.__hintBoxInjected) {
    window.__hintBoxInjected = true;
    initializeHintTextbox();
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
        
        loadHint(i).then(savedText => {
            if (savedText) {
                createSavedContent(i, innerContainer, contentWrapper, savedText);
            } else {
                const textarea = createTextBox(i, innerContainer, contentWrapper);
                textarea.dispatchEvent(new Event('input'));
            }
        });
    }

    return hintsList;
}

function addHintTextbox() {
    const targetContainer = document.querySelector('div.mt-6.flex.flex-col.gap-3');
    
    if (!targetContainer || targetContainer.querySelector('[data-hint-textbox]')) {
        return;
    }

    const mainHeaderContainer = document.createElement('div');
    const mainHeader = document.createElement('div');
    mainHeader.className = 'text-body group flex cursor-pointer items-center gap-2 transition-colors';

    const toggleIcon = document.createElement('span');
    toggleIcon.textContent = '💡';
    toggleIcon.className = 'w-5 h-5 p-[2px] flex items-center justify-center text-label-2 dark:text-dark-label-2 group-hover:text-label-1 dark:group-hover:text-dark-label-1';

    const mainLabel = document.createElement('span');
    mainLabel.textContent = 'Personal Reminders';
    mainLabel.className = 'text-sd-foreground';

    const arrow = document.createElement('div');
    arrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="origin-center transition-transform" style="transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1); transform-origin: center;"><path fill-rule="evenodd" d="M16.293 9.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L12 13.586l4.293-4.293z" clip-rule="evenodd"></path></svg>`;
    arrow.style.marginLeft = 'auto';
    arrow.className = 'text-gray-4 dark:text-dark-gray-4 group-hover:text-gray-5 dark:group-hover:text-dark-gray-5';

    mainHeader.appendChild(toggleIcon);
    mainHeader.appendChild(mainLabel);
    mainHeader.appendChild(arrow);
    mainHeaderContainer.appendChild(mainHeader);

    const hintsList = createHintsList();
    mainHeaderContainer.appendChild(hintsList);

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

    console.log('hint dropdowns added');
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHintTextbox);
} else {
    initializeHintTextbox();
}
