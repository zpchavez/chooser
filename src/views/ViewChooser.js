import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ViewChooser extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    choosers: PropTypes.array.isRequired,
    choices: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
  };

  isValid = () => {
    return this.props.choosers.reduce((acc, chooser) => {
      return chooser.option;
    });
  };

  renderChoice = (chooser, index) => {
    const { choices } = this.props;
    return (
      <div key={`choices-${index}`} style={{ margin: 20 }}>
        {choices[index].map((choice, index2) => (
          <div key={`choice-${index}-${index2}`}>{choice}</div>
        ))}
      </div>
    );
  };

  renderChoices() {
    const { choosers } = this.props;
    return <div style={{ display: 'flex', justifyContent: 'center' }}>{choosers.map(this.renderChoice)}</div>;
  }

  render() {
    const { history, title, choose } = this.props;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">{title}</h1>
        </header>
        {this.renderChoices()}
        <br />
        <div>
          <button onClick={choose} style={{ marginRight: 10 }}>
            Choose Again
          </button>
          <button
            onClick={() => {
              const searchParams = new URLSearchParams(window.location.search);
              searchParams.set('mode', 'edit');
              history.push(window.location.pathname + `?${searchParams.toString()}`);
            }}
          >
            Edit Chooser
          </button>
        </div>
        <br />
        <a href={window.location.href}>Permalink</a>
      </div>
    );
  }
}

export default ViewChooser;