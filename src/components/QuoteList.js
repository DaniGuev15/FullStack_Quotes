import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QuoteList.css'; // Import your CSS file for styling

const QuoteList = () => {
  const [keyword, setKeyword] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [newQuote, setNewQuote] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchQuotes();
  }, [currentPage]); // Update quotes when page changes

  const fetchQuotes = async () => {
    try {
      let url = `http://localhost:5000/api/quotes?page=${currentPage}&limit=9`;
      if (keyword) {
        url += `&keyword=${keyword}`;
      }
      const response = await axios.get(url);
      setQuotes(response.data.docs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    fetchQuotes();
  };

  const handleShowAll = () => {
    if (keyword !== '') {
      setKeyword('');
    }
    setCurrentPage(1);
    fetchQuotes();
  };  

  const handleAddQuote = async () => {
    try {
      await axios.post('http://localhost:5000/api/quotes', { text: newQuote, rating: newRating });
      setNewQuote('');
      setNewRating(0);
      fetchQuotes();
    } catch (error) {
      console.error('Error adding quote:', error);
    }
  };

  const handleRatingChange = async (quoteId, rating) => {
    try {
      await axios.put(`http://localhost:5000/api/quotes/${quoteId}`, { rating });
      fetchQuotes();
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const handleDeleteQuote = async (quoteId) => {
    try {
      await axios.delete(`http://localhost:5000/api/quotes/${quoteId}`);
      setQuotes(quotes.filter(quote => quote._id !== quoteId)); // Remove deleted quote from state
    } catch (error) {
      console.error('Error deleting quote:', error);
    }
  };

  return (
    <div className="quote-list-container">
      <h1 className="title">Quotes App</h1>
      <div className="add-quote">
        <input
          type="text"
          value={newQuote}
          onChange={(e) => setNewQuote(e.target.value)}
          placeholder="Enter new quote"
        />
        <input
          type="number"
          value={newRating}
          min="1"
          max="5"
          onChange={(e) => setNewRating(parseInt(e.target.value))}
          placeholder="Enter rating (1-5)"
        />
        <button className='btnAdd' onClick={handleAddQuote}>Add Quote</button>
      </div>
      <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <button className='btnSearch' onClick={handleSearch}>Search</button>
      <button className='btnShowAll' onClick={handleShowAll}>Show All</button>
      <div className="quote-list">
        {quotes.map((quote) => (
          <div className="quote-item" key={quote._id}>
            <div className="quote-text">{quote.text}</div>
            <div className="rating">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(quote._id, rating)}
                  className={rating <= quote.rating ? 'active' : ''}
                >
                  &#9733;
                </button>
              ))}
            </div>
            <div className="total-points">Total Points: {quote.rating * 10}</div>
            <button className='btnDelete' onClick={() => handleDeleteQuote(quote._id)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button className='btnPrevious' disabled={currentPage === 1} onClick={handlePrevPage}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button className='btnNext' disabled={currentPage === totalPages} onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
};

export default QuoteList;