import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ModalType, ModalPropsMap, OpenModal } from './types';
import { DailyCheckInModal } from './views/DailyCheckInModal';
import { RestDaysSetupModal } from './views/RestDaysSetupModal';

type GlobalModalContextType = {
  openModal: OpenModal;
  closeModal: () => void;
  isOpen: boolean;
  type: ModalType;
};

const GlobalModalContext = createContext<GlobalModalContextType | undefined>(undefined);

export const useGlobalModal = () => {
  const ctx = useContext(GlobalModalContext);
  if (!ctx) throw new Error('useGlobalModal must be used within GlobalModalProvider');
  return ctx;
};

type Props = {
  children: React.ReactNode;
};

export const GlobalModalProvider: React.FC<Props> = ({ children }) => {
  const [modalType, setModalType] = useState<ModalType>('NONE');
  const [modalProps, setModalProps] = useState<ModalPropsMap[ModalType]>({} as any);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback<OpenModal>((type, props) => {
    setModalType(type);
    setModalProps((props as any) ?? ({} as any));
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Reset after animation
    setTimeout(() => {
      setModalType('NONE');
      setModalProps({} as any);
    }, 300);
  }, []);

  const content = useMemo(() => {
    if (modalType === 'DAILY_CHECK_IN') {
      return (
        <DailyCheckInModal
          {...(modalProps as ModalPropsMap['DAILY_CHECK_IN'])}
          onDismiss={closeModal}
        />
      );
    }
    if (modalType === 'REST_DAYS_SETUP') {
      return (
        <RestDaysSetupModal
          {...(modalProps as ModalPropsMap['REST_DAYS_SETUP'])}
          onCancel={closeModal}
        />
      );
    }
    return null;
  }, [modalType, modalProps, closeModal]);

  return (
    <GlobalModalContext.Provider value={{ openModal, closeModal, isOpen, type: modalType }}>
      {children}
      {isOpen && content}
    </GlobalModalContext.Provider>
  );
};

