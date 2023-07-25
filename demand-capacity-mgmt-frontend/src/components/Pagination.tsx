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
