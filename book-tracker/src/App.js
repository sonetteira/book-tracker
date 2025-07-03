// import logo from './logo.svg';
import './App.css';
import React from 'react';
import BookTable from './BookTable';

class App extends React.Component {
  render() {
    return (
      <div className="BookTracker">
        <header>
          <h1>Book Tracker</h1>
        </header>
        <BookTable />
      </div>
    );
  }
}

export default App;
