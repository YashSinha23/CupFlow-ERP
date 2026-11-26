import Modal from "./Modal";

export default function DetailPanel({ onClose, children }) {
    return <Modal onClose={onClose} wide>{children}</Modal>;
}
