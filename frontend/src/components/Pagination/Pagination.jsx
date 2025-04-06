import React from 'react';
import './Pagination.css'; // You'll need to create this CSS file

export default function  Pagination ({ currentPage, totalPages, onPageChange }) {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(
      <button 
        key={1} 
        className={`page-number ${currentPage === 1 ? 'active' : ''}`}
        onClick={() => onPageChange(1)}
      >
        1
      </button>
    );
    
    // Show pages 2 and 3 if they exist
    for (let i = 2; i <= Math.min(3, totalPages); i++) {
      pageNumbers.push(
        <button 
          key={i} 
          className={`page-number ${currentPage === i ? 'active' : ''}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }
    
    // Show dots if there are more pages
    if (totalPages > 3) {
      pageNumbers.push(<span key="dots" className="dots">•••</span>);
    }
    
    // Show last page if it's not already shown
    if (totalPages > 3) {
      pageNumbers.push(
        <button 
          key={totalPages} 
          className={`page-number ${currentPage === totalPages ? 'active' : ''}`}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }
    
    return pageNumbers;
  };
  
  return (
    <div className="pagination-container">
      <div className="pagination-controls">
        {renderPageNumbers()}
      </div>
      <div className="pagination-info">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

