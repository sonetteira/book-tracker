// import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './components/nav';
import BookList from './pages/booklist';
import BookDetails from './pages/bookdetails';
import AddBook from './pages/addbook';
import EditBook from './pages/editBook';

class App extends React.Component {
  render() {
    return (
      <div className="container">
        <header>
          {/* <h1><a className="link-unstyled" href="/">Book Tracker</a></h1> */}
          <Nav />
        </header>
        <Router>
          <Routes>
            <Route path="/:toRead?" element={<BookList />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/addBook" element={<AddBook />} />
            <Route path="/editBook/:id" element={<EditBook />} />
          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;
