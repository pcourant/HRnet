/* eslint-disable no-console */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { PropsWithChildren, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import styles from './Modal.module.css';
import transitions from './Transitions.module.css';

interface ModalProps extends PropsWithChildren {
  title?: ReactNode;
  show?: boolean;
  onClose?: () => void;
}

const defaultProps: ModalProps = {
  title: '',
  show: false,
  onClose: () => {},
};

function Modal({ show, onClose, title, children }: ModalProps) {
  const nodeRef = useRef(null);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      console.log('User pressed: ', event.key);

      if (event.key === 'Escape') {
        event.preventDefault();

        if (onClose) onClose();
      }
    };

    window.addEventListener('keydown', keyDownHandler);

    // 👇️ clean up event listener
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, [onClose, show]);

  // if (!show) {
  //   return null;
  // }

  const root = document.getElementById('root');

  if (!root) {
    throw new Error('Document has no root id element');
    return null;
  }

  return createPortal(
    <CSSTransition
      in={show}
      nodeRef={nodeRef}
      timeout={5000}
      unmountOnExit
      classNames={transitions}
    >
      <div className={styles.modal} onClick={onClose}>
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.modalHeader}>
            <h4 className={styles.modalTitle}>{title}</h4>
          </div>
          <div className={styles.modalBody}>{children}</div>
          <div className={styles.modalFooter}>
            <button type="button" className="button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </CSSTransition>,
    root
  );
}

Modal.defaultProps = defaultProps;

export default Modal;
