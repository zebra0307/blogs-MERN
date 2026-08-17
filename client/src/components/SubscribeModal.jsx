import { Modal } from 'flowbite-react';
import NewsletterSubscribe from './NewsletterSubscribe';

export default function SubscribeModal({ show, onClose }) {
  return (
    <Modal show={show} onClose={onClose} size='md' popup>
      <Modal.Header />
      <Modal.Body>
        <NewsletterSubscribe />
      </Modal.Body>
    </Modal>
  );
}
