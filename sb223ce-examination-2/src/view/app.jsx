import React from 'react'
import { render } from 'react-dom'
import { Header } from './components/header.jsx'
import { Login } from './components/login.jsx'
import { Snippet } from './components/snippet.jsx'
import MonacoEditor from 'react-monaco-editor'

export let BASE_URL = 'https://localhost:3000/api'

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      username: '',
      loginSignupView: '',
      snippets: [],
      isNewSnippet: false,
      message: ''
    }
    this.code = ''
  }

  componentWillMount () {
    this.getSnippets()
  }

  getSnippets (username = '', tag = '') {
    this.setState({ snippets: [] })
    let params = ''
    if (username && tag) params = '?username=' + username + '&tag=' + tag
    else params = username ? '?username=' + username : (tag ? '?tag=' + tag : '')

    window.fetch(BASE_URL + '/snippets' + params)
      .then(res => { return res.json() })
      .then(body => this.setState({ snippets: body.snippets || [], message: body.error || '' }))
      .catch(err => console.log(err))
  }

  handleLoginSignupView (name) {
    this.setState({ loginSignupView: name })
  }

  handleIsNewSnippet () {
    this.setState({ isNewSnippet: !this.state.isNewSnippet })
  }

  login (username) {
    this.setState({ loginSignupView: '', username: username })
    if (this.state.message) this.getSnippets()
  }

  logout () {
    window.fetch(BASE_URL + '/logout', { credentials: 'include' })
      .then(res => { return res.json() })
      .then(body => {
        if (body.message) {
          this.setState({ loginOrSignupView: '', username: '' })
          if (this.state.message) this.getSnippets()
        } else {
          this.setState({ message: body.error })
        }
      })
      .catch(err => console.log(err))
  }

  deleteSnippet (id) {
    let arr = this.state.snippets
    this.setState({ snippets: [] })
    arr.forEach((el, index) => el._id === id ? arr.splice(index, 1) : '')
    this.setState({ snippets: arr })
  }

  addSnippet () {
    if (this.state.message) this.getSnippets()
    window.fetch(BASE_URL + '/snippets', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: this.code })
    })
      .then(res => { return res.json() })
      .then(body => {
        if (body.error) { this.setState({ message: body.error }) } else {
          let arr = this.state.snippets
          arr.splice(0, 0, body.snippet)
          this.code = ''
          this.setState({ isNewSnippet: false, snippets: arr })
        }
      })
      .catch(err => console.log(err))
  }

  snippet () {
    return (
      <div className='ui active small modal'>
        <div className='header'>New Snippet</div>
        <div className='content'>
          <MonacoEditor height='300' width='680' value={this.code} onChange={(code) => { this.code = code }} />
        </div>
        <div className='content error'>{this.state.message}</div>
        <div className='actions'>
          <div className='ui button' onClick={this.addSnippet.bind(this)}>Save</div>
          <div className='ui button' onClick={this.handleIsNewSnippet.bind(this)}>Cancel</div>
        </div>
      </div>
    )
  }

  render () {
    return (
      <div>
        <Header username={this.state.username} handleLoginSignupView={this.handleLoginSignupView.bind(this)}
          logout={this.logout.bind(this)} handleIsNewSnippet={this.handleIsNewSnippet.bind(this)}
          isNewSnippet={this.state.isNewSnippet} getSnippets={this.getSnippets.bind(this)} />
        {this.state.message && !this.state.isNewSnippet && !this.state.loginSignupView
          ? <div className='not-found error'><h2>{this.state.message}</h2></div>
          : <div>
            {this.state.loginSignupView
              ? <Login loginSignupView={this.state.loginSignupView} login={this.login.bind(this)}
                handleLoginSignupView={this.handleLoginSignupView.bind(this)} />
              : null
            }
            {this.state.isNewSnippet
              ? this.snippet()
              : this.state.snippets.map((snippet, index) =>
                <Snippet key={index} username={this.state.username} snippet={snippet}
                  deleteSnippet={this.deleteSnippet.bind(this)} />
              )}
          </div>
        }
      </div>
    )
  }
}

render(<App />, document.querySelector('#root'))
