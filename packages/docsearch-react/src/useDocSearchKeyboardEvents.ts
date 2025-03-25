import React from 'react';

export interface UseDocSearchKeyboardEventsProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onInput?: (event: KeyboardEvent) => void;
  searchButtonRef?: React.RefObject<HTMLButtonElement>;
}

function isEditingContent(event: KeyboardEvent): boolean {
  const element = event.target as HTMLElement;
  const tagName = element.tagName;

  return (
    element.isContentEditable ||
    tagName === 'INPUT' ||
    tagName === 'SELECT' ||
    tagName === 'TEXTAREA'
  );
}

// Function to close all existing modals
function closeAllExistingModals() {
  // Remove active class from body
  document.body.classList.remove('DocSearch--active');

  // Remove all existing modals
  const existingModals = document.querySelectorAll('.DocSearch-Container');
  existingModals.forEach((modal) => modal.remove());
}

export function useDocSearchKeyboardEvents({
  isOpen,
  onOpen,
  onClose,
  onInput,
  searchButtonRef,
}: UseDocSearchKeyboardEventsProps) {
  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      function open() {
        // First close all existing modals
        closeAllExistingModals();
        // Then open the new modal
        onOpen();
      }

      // Handle closing
      if (
        isOpen &&
        (event.keyCode === 27 ||
          (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)))
      ) {
        event.preventDefault();
        closeAllExistingModals();
        onClose();
        return;
      }

      // Handle opening
      if (!isOpen) {
        if (
          event.key.toLowerCase() === 'k' &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault();
          open();
        }
        else if (!isEditingContent(event) && event.key === '/') {
          event.preventDefault();
          // open();
        }
      }

      // Handle input when search button is focused
      if (
        searchButtonRef &&
        searchButtonRef.current === document.activeElement &&
        onInput
      ) {
        if (/[a-zA-Z0-9]/.test(String.fromCharCode(event.keyCode))) {
          onInput(event);
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onOpen, onClose, onInput, searchButtonRef]);
}
