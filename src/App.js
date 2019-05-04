import React, { Component } from 'react';
import './App.css';
import createHistory from 'history/createBrowserHistory'
import ViewChooser from './views/ViewChooser';
import EditChooser from './views/EditChooser';

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
    const title = searchParams.get('title') ? atob(searchParams.get('title')) : '';

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
      history.push(window.location.pathname + `?mode=choose&title=${btoa(this.state.title)}&options=${compressed}`);
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

  render() {
    if (this.state.loading) {
      return null;
    }

    if (this.state.mode === 'choose') {
      return <ViewChooser
        title={this.state.title}
        optionArray={this.state.optionArray}
        initialChoice={this.state.choice}
        history={history}
      />
    }

    return <EditChooser
      title={this.state.title}
      optionString={this.state.optionString}
      onSubmit={this.onSubmit}
      updateTitle={this.updateTitle}
      updateOptions={this.updateOptions}
    />
  }
}

export default App;
