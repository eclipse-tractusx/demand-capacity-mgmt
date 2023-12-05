import React, {useContext, useEffect, useState} from "react";
import Modal from "react-bootstrap/Modal";
import {Button} from "react-bootstrap";
import ConfigureAlertModal from "./ConfigureAlertModal";
import ConfiguredAlertsTable from "./ConfiguredAlertsTable";
import {DemandProp, UnitMeasureId} from "../../interfaces/demand_interfaces";
import {EventType} from "../../interfaces/event_interfaces";
import {EventsContext} from "../../contexts/EventsContextProvider";


type RulesModalProps = {
    showRulesModal: boolean,
    hideRulesModal: () => void,
};

const RulesModal: React.FC<RulesModalProps> = ({showRulesModal,hideRulesModal}) => {
    return <Modal
        show={showRulesModal}
        onHide={hideRulesModal}
        size='lg'
        backdrop="static"
        keyboard={false}>
        <Modal.Header closeButton>
            <Modal.Title>Configured Alerts Wizard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <ConfigureAlertModal/>
            <ConfiguredAlertsTable/>
        </Modal.Body>
    </Modal>
}


export default RulesModal;