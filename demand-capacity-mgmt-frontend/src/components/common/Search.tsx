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
import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

type DemandsSearchProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const DemandsSearch: React.FC<DemandsSearchProps> = ({ searchQuery, setSearchQuery }) => {
  return (

      <Form className="d-flex">
    <Form.Control
      type="search"
      placeholder="Search"
      className="me-1"
      aria-label="Search"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    <Button variant="outline-primary">Search</Button>
  </Form>
    
  );
};

export default DemandsSearch;
