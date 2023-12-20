import React from "react";
import Modal from "react-bootstrap/Modal";
import { FcAlarmClock } from "react-icons/fc";
import ConfigureAlertModal from "./ConfigureAlertModal";
import ConfiguredAlertsTable from "./ConfiguredAlertsTable";


type RulesModalProps = {
    showRulesModal: boolean,
    hideRulesModal: () => void,
};

const RulesModal: React.FC<RulesModalProps> = ({ showRulesModal, hideRulesModal }) => {
    return <Modal
        show={showRulesModal}
        onHide={hideRulesModal}
        size='lg'
        backdrop="static"
        keyboard={false}>
        <Modal.Header closeButton>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <FcAlarmClock size={35} /><h4 className='icon-text-padding'> Configured Alert Rules</h4>
            </div>
        </Modal.Header>
        <Modal.Body>
            <ConfigureAlertModal />
            <br />
            <ConfiguredAlertsTable />
        </Modal.Body>
    </Modal>
}


export default RulesModal;