import React, { Component } from 'react';
import './App.css';

const ENTER = 13;

class App extends Component {
  state = {
    search: "",
    notes: [],
  };

  handleChangeSearch = ({ target }) => {
    this.setState({ search: target.value });
  };

  handleKeyDown = evt => {
    switch (evt.keyCode) {
      case ENTER:
        this.setState({
          notes: this.state.notes.concat({ title: this.state.search }),
          search: "",
        });
        break;

      default:
        break;
    }
  };

  render() {
    const { search, notes } = this.state;

    return (
      <div>
        <input
          value={search}
          type="text"
          onChange={this.handleChangeSearch}
          onKeyDown={this.handleKeyDown}
        />
        <div>
          {notes.map((note, index) => (
            <div key={index}>
              {note.title}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
