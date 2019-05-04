import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ViewChooser extends Component
{
  static propTypes = {
    title: PropTypes.string.isRequired,
    optionArray: PropTypes.arrayOf(PropTypes.string).isRequired,
    initialChoice: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      choice: props.initialChoice,
    };
  }

  render()
  {
    const { history, title, optionArray } = this.props;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">{title}</h1>
        </header>
        <div>
          {optionArray[this.state.choice]}
        </div>
        <hr />
        <div>
          <button
            onClick={() => {
              this.setState({choice: Math.floor(Math.random() * optionArray.length)})
            }}
          >
            Choose Again
          </button>
          <button
            onClick={() => {
              // this.setState({ mode: 'edit' }, (val) => {
                const searchParams = new URLSearchParams(window.location.search);
                searchParams.set('mode', 'edit');
                history.push(window.location.pathname + `?${searchParams.toString()}`)
              // })
            }}
          >
            Edit Chooser
          </button>
        </div>
        <hr />
        <a href={window.location.href}>Permalink</a>
      </div>
    );
  }
}

export default ViewChooser;
