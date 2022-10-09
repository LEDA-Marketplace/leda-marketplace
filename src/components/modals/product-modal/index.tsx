import Modal from 'react-bootstrap/Modal';
import Product from '@components/product';
import { ItemRequest } from '@types';

type Props = {
  show: boolean;
  handleModal: () => void;
  data: ItemRequest;
};

const ProductModal = ({ show, handleModal, data }: Props) => (
  <Modal className="rn-popup-modal upload-modal-wrapper" show={show} onHide={handleModal} centered>
    {show && (
      <button type="button" className="btn-close" aria-label="Close" onClick={handleModal}>
        <i className="feather-x" />
      </button>
    )}
    <Modal.Body>
      <Product
        overlay
        disableShareDropdown
        title={data.name}
        latestBid="6/30"
        likeCount={300}
        image={{ src: URL.createObjectURL(data.blob) }}
        authors={[
          {
            name: 'Mark Jordan',
            slug: '/author',
            image: {
              src: '/images/client/client-2.png',
            },
          },
          {
            name: 'Farik Shaikh',
            slug: '/author',
            image: {
              src: '/images/client/client-3.png',
            },
          },
          {
            name: 'John Doe',
            slug: '/author',
            image: {
              src: '/images/client/client-5.png',
            },
          },
        ]}
        bitCount={15}
      />
    </Modal.Body>
  </Modal>
);

export default ProductModal;
