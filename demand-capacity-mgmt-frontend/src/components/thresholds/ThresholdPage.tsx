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

import React, {useContext} from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import {useUser} from "../../contexts/UserContext";
import { ThresholdsContext } from "../../contexts/ThresholdsContextProvider";


function ThresholdPage() {
    const {thresholds, fetchThresholds } = useContext(ThresholdsContext)!;
    const { user } = useUser();


    const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Save thresholds');
    };

    return (
        <div>
            <h3>Threshold Config Settings</h3>
            <Form onSubmit={handleSave}>
                <Row xs={1} md={2} lg={4}>
                    {thresholds.map((threshold, index) => (
                        <Col key={index} className="mb-3">
                            <Form.Check
                                type="checkbox"
                                id={`threshold-${threshold}`}
                                label={`Threshold ${threshold}`}
                            />
                        </Col>
                    ))}
                </Row>
                <Button variant="primary" type="submit">
                    Save
                </Button>
            </Form>
        </div>
    );
};

export default ThresholdPage;