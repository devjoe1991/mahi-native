export type ModalType = 'NONE' | 'DAILY_CHECK_IN' | 'REST_DAYS_SETUP';

export type DailyCheckInModalProps = {
  onPostNow?: () => void;
  onSetRestDays?: () => void;
  onDismiss?: () => void;
};

export type RestDaysSetupModalProps = {
  onSave?: (restDays: string[]) => void;
  onCancel?: () => void;
};

export type ModalPropsMap = {
  NONE: {};
  DAILY_CHECK_IN: DailyCheckInModalProps;
  REST_DAYS_SETUP: RestDaysSetupModalProps;
};

export type OpenModal = <T extends ModalType>(type: T, props?: ModalPropsMap[T]) => void;

