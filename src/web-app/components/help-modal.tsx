import { useTranslation } from 'react-i18next';
import { RxCross2 } from 'react-icons/rx';
import Modal from 'react-modal';

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const HelpModal = ({ isOpen, setIsOpen }: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      className="fixed bottom-[20px] left-[30px] right-[20px] top-[20px] overflow-y-auto rounded-[8px] bg-[#333] p-[16px] text-[#fff]"
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      overlayClassName="fixed inset-0 bg-[rgba(0,0,0,0.5)]"
    >
      <div>
        <button
          className="absolute right-[16px] top-[16px] cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          <RxCross2 />
        </button>
      </div>
      <h1>{t('help.how')}</h1>
      <p>{t('help.howText1')}</p>
    </Modal>
  );
};

export default HelpModal;
