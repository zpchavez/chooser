import React, { Component } from 'react';
import './App.css';
import createHistory from 'history/createBrowserHistory'
import ViewChooser from './views/ViewChooser';
import EditChooser from './views/EditChooser';
import without from 'lodash/without';

const history = createHistory()
const codec = window.JsonUrl('lzstring');

class App extends Component {
  state = {
    loading: false,
    title: '',
    choosers: [
      {
        options: [],
        count: 1,
      }
    ],
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

  choose(choosers) {
    return choosers.map(chooser => {
      const count = chooser.count || 1;
      const choices = [];
      let options = chooser.options;
      for (let i = 0; i < count; i+= 1) {
        if (options.length) {
          const choice = Math.floor(Math.random() * options.length);
          choices.push(options[choice]);
          options = without(options, options[choice]);
        }
      }
      return choices;
    })
  }

  updateStateFromQueryString(location) {
    const searchParams = new URLSearchParams(window.location.search);
    const mode = searchParams.get('mode') || 'edit';
    const options = searchParams.get('options');
    const title = searchParams.get('title') ? atob(searchParams.get('title')) : '';

    if (options) {
      this.setState({loading: true});

      codec.decompress(options).then(choosers => {
        // For backwards compatibility
        if (typeof choosers[0] === 'string') {
          choosers = [
            {
              options: choosers,
            }
          ]
        }
        this.setState({
          loading: false,
          title,
          mode,
          choosers: choosers,
          choices: this.choose(choosers),
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
    const choosers = this.state.choosers.map(chooser => {
      chooser.options = chooser.options.filter(v => !!v);
      return chooser;
    });
    codec.compress(choosers).then(compressed => {
      history.push(window.location.pathname + `?mode=choose&title=${btoa(this.state.title)}&options=${compressed}`);
      this.setState({
        choosers,
      });
    })
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.setOptionsInQueryString();
  }

  updateChooser = (index, field, event) => {
    const value = event.target.value;
    this.setState(prevState => {
      const choosers = prevState.choosers.slice();
      const chooser = prevState.choosers[index];
      if (field === 'options') {
        chooser.options = value.split('\n');
        chooser.count = Math.min(chooser.count, chooser.options.filter(v => !!v).length);
      } else {
        chooser[field] = value;
      }
      choosers[index] = chooser;
      return { choosers };
    });
  }

  updateTitle = (event) => {
    this.setState({ title: event.target.value });
  }

  addSubchooser = () => {
    this.setState(prevState => {
      const choosers = prevState.choosers.slice();
      choosers.push({
        options: [],
        count: 1,
      });
      return { choosers };
    })
  }

  removeSubchooser = (index) => {
    this.setState(prevState => {
      const choosers = prevState.choosers.filter((chooser, chooserIndex) => chooserIndex !== index)
      return { choosers };
    })
  }

  render() {
    if (this.state.loading) {
      return null;
    }

    if (this.state.mode === 'choose') {
      return <ViewChooser
        title={this.state.title}
        choosers={this.state.choosers}
        choices={this.state.choices}
        choose={() => this.setState({ choices: this.choose(this.state.choosers)})}
        history={history}
      />
    }

    return <EditChooser
      title={this.state.title}
      choosers={this.state.choosers}
      onSubmit={this.onSubmit}
      updateTitle={this.updateTitle}
      updateChooser={this.updateChooser}
      addSubchooser={this.addSubchooser}
      removeSubchooser={this.removeSubchooser}
    />
  }
}

export default App;
