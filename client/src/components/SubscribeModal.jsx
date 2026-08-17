import { Modal, ModalHeader, ModalBody } from 'flowbite-react';
import NewsletterSubscribe from './NewsletterSubscribe';

export default function SubscribeModal({ show, onClose }) {
  return (
    <Modal show={show} onClose={onClose} size='md' popup>
      <ModalHeader />
      <ModalBody>
        <NewsletterSubscribe />
      </ModalBody>
    </Modal>
  );
}
