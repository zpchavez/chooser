import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ViewChooser extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    choose: PropTypes.func.isRequired,
    choosers: PropTypes.array.isRequired,
    choices: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
  };

  state = {
    locked: []
  };

  toggleLock(index) {
    this.setState(prevState => {
      const locked = prevState.locked.slice();
      locked[index] = !locked[index];
      return { locked };
    });
  }

  isValid = () => {
    return this.props.choosers.reduce((acc, chooser) => {
      return chooser.option;
    });
  };

  renderChoice = (index, maxCount) => {
    const { choices } = this.props;
    const buttonStyles = this.state.locked[index] ? { backgroundColor: 'blue', color: 'white', outline: 0 } : {};

    const padding = [];
    if (maxCount > choices[index].length) {
      for (let i = 0; i < maxCount - choices[index].length; i += 1) {
        padding.push(<div key={`padding-${i}`}>&nbsp;</div>)
      }
    }

    return (
      <div key={`choices-${index}`} style={{ margin: 20 }}>
        {choices[index].map((choice, index2) => (
          <div key={`choice-${index}-${index2}`}>{choice}</div>
        ))}
        <br />
        {padding}
        {choices.length > 1 ? <button style={{marginBottom: 20, ...buttonStyles}} onClick={this.toggleLock.bind(this, index)}>Lock</button> : null}
      </div>
    );
  };

  renderChoices() {
    const { choosers } = this.props;

    const maxCount = choosers.reduce((acc, chooser) => Math.max(parseInt(chooser.count, 10), acc), 0);

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {choosers.map((chooser, index) => this.renderChoice(index, maxCount))}
      </div>
    );
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
          <button onClick={choose.bind(this, this.state.locked)} style={{ marginRight: 10 }}>
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
