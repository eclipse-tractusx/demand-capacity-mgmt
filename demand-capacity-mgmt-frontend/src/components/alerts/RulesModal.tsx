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
        </Modal.Header>
        <Modal.Body>

            <div className="row">
                <div className="col-sm-6">
                    <div style={{ display: 'flex' }}>
                        <FcAlarmClock size={35} />
                        <h3 className="icon-text-padding">Configured Alert Rules</h3>
                    </div>
                </div>
                <div className="col-sm-6">
                    <ConfigureAlertModal />
                </div>
            </div>
            <br />
            <ConfiguredAlertsTable />
        </Modal.Body>
    </Modal>
}


export default RulesModal;