import React, { useEffect} from 'react';
import QuoteList from './components/QuoteList'; // Corrected import path

const App = () => {
  useEffect(() => {
    document.title = "Quotes App"
  }, []);
  
  return (
    <div>
    
      <QuoteList />
    </div>
  );
};

export default App;