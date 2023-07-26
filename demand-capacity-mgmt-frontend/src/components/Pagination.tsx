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
import React, { useEffect, useState } from 'react';
import Pagination from 'react-bootstrap/Pagination';

interface PaginationProps {
  pages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentItems: any[]; // Update with the correct type for currentItems
  items: any[]; // Update with the correct type for items
}

const CustomPagination: React.FC<PaginationProps> = ({
  pages,
  setCurrentPage,
  currentItems,
  items,
}) => {
  const numOfPages: number[] = [];

  for (let i = 1; i <= pages; i++) {
    numOfPages.push(i);
  }

  const [currentButton, setCurrentButton] = useState(1);

  useEffect(() => {
    setCurrentPage(currentButton);
  }, [currentButton, setCurrentPage]);

  const handlePrevious = () => {
    setCurrentButton((prev) => (prev === 1 ? prev : prev - 1));
  };

  const handleNext = () => {
    setCurrentButton((next) => (next === numOfPages.length ? next : next + 1));
  };

  return (<>
          <div className="col-sm">
             <Pagination>
        <Pagination.Prev disabled={currentButton === 1} onClick={handlePrevious} />
        {numOfPages.map((page, index) => (
          <Pagination.Item
            key={index}
            active={currentButton === page}
            onClick={() => setCurrentButton(page)}
          >
            {page}
          </Pagination.Item>
        ))}
        <Pagination.Next
          disabled={currentButton === numOfPages.length}
          onClick={handleNext}
        />
      </Pagination>
          </div>
          <div className="col-sm">
            <div className="hint-text text-center">
              Showing <b>{currentItems.length}</b> out of <b>{items.length}</b> entries
            </div>
          </div>
          </>
     

  );
};

export default CustomPagination;
