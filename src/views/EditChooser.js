import React, { Component } from 'react';
import PropTypes from 'prop-types';

class EditChooser extends Component
{
  static propTypes = {
    title: PropTypes.string.isRequired,
    optionString: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    updateTitle: PropTypes.func.isRequired,
    updateOptions: PropTypes.func.isRequired,
  }

  render() {
    const { title, optionString, updateTitle, updateOptions, onSubmit } = this.props;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Chooser</h1>
        </header>
        <p className="App-intro">
          Enter a list of options to choose from, with each option
          on a new line.
        </p>
        <form onSubmit={onSubmit}>
          <div>
            <input
              type="text"
              value={title}
              placeholder="Title of Chooser"
              onChange={updateTitle}
              style={{
                margin: 20,
                width: '50%',
              }}
            />
          </div>
          <div>
            <textarea
              onChange={updateOptions}
              value={optionString}
              style={{
                width: '50%',
                height: 250,
              }}
            />
          </div>
          <div>
            <button
              type="Submit"
            >
              Generate Chooser
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default EditChooser;
