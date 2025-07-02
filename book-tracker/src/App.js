// import logo from './logo.svg';
import './App.css';
import React from 'react';
import BookTable from './BookTable';

class App extends React.Component {
  render() {
    return (
      <div className="BookTracker">
        <header className="App-header">
          
          {/* <p>
            {this.state.apiResponse}
          </p> */}
          <BookTable />
        </header>
      </div>
    );
  }
}

export default App;
