/*
 *  *******************************************************************************
 *  Copyright (c) 2023 BMW AG
 *  Copyright (c) 2023 Contributors to the Eclipse Foundation
 *
 *    See the NOTICE file(s) distributed with this work for additional
 *    information regarding copyright ownership.
 *
 *    This program and the accompanying materials are made available under the
 *    terms of the Apache License, Version 2.0 which is available at
 *    https://www.apache.org/licenses/LICENSE-2.0.
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *    License for the specific language governing permissions and limitations
 *    under the License.
 *
 *    SPDX-License-Identifier: Apache-2.0
 *    ********************************************************************************
 */

import React, {useContext, useEffect, useState} from 'react';
import {Form, Button, Row, Col, Table} from 'react-bootstrap';
import {useUser} from "../../contexts/UserContext";
import { ThresholdsContext } from "../../contexts/ThresholdsContextProvider";
import {ThresholdProp} from "../../interfaces/Threshold_interfaces";


function ThresholdPage() {
    const { thresholds } = useContext(ThresholdsContext)!;
    const [editableThresholds, setEditableThresholds] = useState<ThresholdProp[]>([]);

    useEffect(() => {
        setEditableThresholds(thresholds);
    }, [thresholds]);

    const handleCheckboxChange = (index: number) => {
        const updatedThresholds = editableThresholds.map((threshold, idx) => {
            if (idx === index) {
                return { ...threshold, enabled: !threshold.enabled };
            }
            return threshold;
        });
        setEditableThresholds(updatedThresholds);
    };

    const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Save thresholds', editableThresholds);
        // Add logic to save the updated thresholds
    };

    const chunkThresholds = (thresholds: ThresholdProp[], size: number): ThresholdProp[][] => {
        return thresholds.reduce((acc: ThresholdProp[][], val: ThresholdProp, i: number) => {
            let idx = Math.floor(i / size);
            let page = acc[idx] || (acc[idx] = []);
            page.push(val);
            return acc;
        }, []);
    }

    const chunkedThresholds = chunkThresholds(editableThresholds, 4);

    return (
        <div>
            <h3>Threshold Config Settings</h3>
            <Form onSubmit={handleSave}>
                <Table striped bordered hover>
                    <tbody>
                    {chunkedThresholds.map((chunk: ThresholdProp[], chunkIndex: number) => (
                        <tr key={chunkIndex}>
                            {chunk.map((threshold: ThresholdProp, idx: number) => (
                                <td key={idx}>
                                    <Form.Check
                                        type="checkbox"
                                        id={`threshold-${threshold.percentage}`}
                                        label={`${threshold.percentage} %`}
                                        checked={threshold.enabled}
                                        onChange={() => handleCheckboxChange(chunkIndex * 4 + idx)}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <Button variant="primary" type="submit" className="mt-3">
                    Save
                </Button>
            </Form>
        </div>
    );
}

export default ThresholdPage;