import { createContext, useContext } from "react";
import { DailyModalContent } from "../daily_modal_helper";

const ModalStateContext = createContext<{
    dayModalContent: DailyModalContent | null;
    showDayModal: boolean;
    setShowDayModal: (show: boolean) => void;
    showWelcomeModal: boolean;
    setShowWelcomeModal: (show: boolean) => void;
}>({
    dayModalContent: null,
    showDayModal: false,
    setShowDayModal: () => { },
    showWelcomeModal: false,
    setShowWelcomeModal: () => { }
});

export default ModalStateContext;

export const useModalState = () => useContext(ModalStateContext);

