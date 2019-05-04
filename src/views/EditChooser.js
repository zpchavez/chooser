import React, { Component } from 'react';
import PropTypes from 'prop-types';

class EditChooser extends Component
{
  static propTypes = {
    title: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    updateTitle: PropTypes.func.isRequired,
    updateChooser: PropTypes.func.isRequired,
  }

  renderSubChooser = (chooser, index) => {
    const { updateChooser } = this.props;

    return (
      <div key={`chooser-${index}`}>
        <div>
          <textarea
            onChange={updateChooser.bind(this, index, 'options')}
            value={chooser.options.join('\n')}
            style={{
              width: '50%',
              height: 250,
            }}
          />
        </div>
      </div>
    );
  }

  render() {
    const { title, choosers, updateTitle, onSubmit } = this.props;

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
          {choosers.map(this.renderSubChooser)}
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
