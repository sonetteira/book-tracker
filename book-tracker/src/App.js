// import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/nav';
import BookList from './pages/booklist';
import BookDetails from './pages/bookdetails';
import AddBook from './pages/addbook';
import EditBook from './pages/editBook';
import Report from './pages/report';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  render() {
    return (
      <>
      <header className='bg-secondary bg-gradient p-3 mb-3'>
        {/* <h1><a className="link-unstyled" href="/">Book Tracker</a></h1> */}
        <Navigation />
      </header>
      <div className="container">
        <Router>
          <Routes>
            <Route path="/:view?/:year?" element={<BookList />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/addBook" element={<AddBook />} />
            <Route path="/editBook/:id" element={<EditBook />} />
            <Route path="/report/yearly" element={<Report />} />
          </Routes>
        </Router>
      </div>
      </>
    );
  }
}

export default App;
