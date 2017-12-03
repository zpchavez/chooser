import React, { Component } from 'react';
import './App.css';
import createHistory from 'history/createBrowserHistory'

const history = createHistory()
const codec = window.JsonUrl('lzstring');

class App extends Component {
  state = {
    loading: false,
    title: '',
    optionString: '',
    optionArray: [],
    mode: 'edit',
  }

  componentWillMount() {
    this.updateStateFromQueryString(window.location);

    history.listen(location => {
      this.updateStateFromQueryString(window.location);
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.title !== prevState.title) {
      document.title = this.state.title;
    }
  }

  updateStateFromQueryString(location) {
    const searchParams = new URLSearchParams(window.location.search);
    const mode = searchParams.get('mode') || 'edit';
    const options = searchParams.get('options');
    const title = searchParams.get('title') || '';

    if (options) {
      this.setState({loading: true});

      codec.decompress(options).then(optionArray => {
        this.setState({
          loading: false,
          title,
          mode,
          optionString: optionArray.join('\n'),
          optionArray: optionArray,
          choice: Math.floor(Math.random() * optionArray.length)
        });
      });
    } else {
      this.setState({
        mode,
        title,
      });
    }
  }

  setOptionsInQueryString = () => {
    if (!this.state.optionString) {
      return window.location.href;
    }

    const optionArray = this.state.optionString.split('\n').filter(val => !!val);
    codec.compress(optionArray).then(compressed => {
      history.push(window.location.pathname + `?mode=choose&title=${this.state.title}&options=${compressed}`);
      this.setState({
        optionArray,
      });
    })
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.setOptionsInQueryString();
  }

  updateOptions = (event) => {
    this.setState({ optionString: event.target.value });
  }

  updateTitle = (event) => {
    this.setState({ title: event.target.value });
  }

  renderChoose() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">{this.state.title}</h1>
        </header>
        <div>
          {this.state.optionArray[this.state.choice]}
        </div>
        <hr />
        <div>
          <button
            onClick={() => {
              this.setState({choice: Math.floor(Math.random() * this.state.optionArray.length)})
            }}
          >
            Choose Again
          </button>
          <button
            onClick={() => {
              this.setState({ mode: 'edit' }, (val) => {
                const searchParams = new URLSearchParams(window.location.search);
                searchParams.set('mode', 'edit');
                history.push(window.location.pathname + `?${searchParams.toString()}`)
              })
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

  render() {
    if (this.state.loading) {
      return null;
    }

    if (this.state.mode === 'choose') {
      return this.renderChoose();
    }

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Chooser</h1>
        </header>
        <p className="App-intro">
          Enter a list of options to choose from, with each option
          on a new line.
        </p>
        <form onSubmit={this.onSubmit}>
          <div>
            <input
              type="text"
              value={this.state.title}
              placeholder="Title of Chooser"
              onChange={this.updateTitle}
              style={{
                margin: 20,
                width: '50%',
              }}
            />
          </div>
          <div>
            <textarea
              onChange={this.updateOptions}
              value={this.state.optionString}
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
    );
  }
}

export default App;
