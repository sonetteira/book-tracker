// import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookList from './pages/booklist';
import BookDetails from './pages/bookdetails';

class App extends React.Component {
  render() {
    return (
      <div className="BookTracker">
        <header>
          <h1>Book Tracker</h1>
        </header>
        <Router>
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/book/:id" element={<BookDetails />} />
          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;
