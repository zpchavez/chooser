import React, { Component } from 'react';
import PropTypes from 'prop-types';
import range from 'lodash/range';

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
          <h3>Subchooser {index + 1}</h3>
          <label htmlFor={`chooser-options-${index}`}>
            Options
          </label>
          <div>
            <textarea
              id={`chooser-options-${index}`}
              onChange={updateChooser.bind(this, index, 'options')}
              value={chooser.options.join('\n')}
              style={{
                width: '50%',
                height: 250,
                marginBottom: 20,
              }}
            />
          </div>
          <div>
            <label htmlFor={`chooser-count-${index}`}>
              Count (# of items to choose)
            </label>
            <div>
              <select onChange={updateChooser.bind(this, index, 'count')} value={chooser.count}>
                {range(1, chooser.options.length + 1).map(count => <option key={count} value={count}>{count}</option>)}
              </select>
            </div>
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
        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="chooser-title-field">
              Title
            </label>
            <div>
              <input
                id="chooser-title-field"
                type="text"
                value={title}
                placeholder="Title of Chooser"
                onChange={updateTitle}
                style={{
                  marginBottom: 20,
                  width: '50%',
                }}
              />
            </div>
          </div>
          <p className="App-intro">
            Put each option on a line by itself
          </p>
          {choosers.map(this.renderSubChooser)}
          <div>
            <button
              style={{
                marginTop: 20,
              }}
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
