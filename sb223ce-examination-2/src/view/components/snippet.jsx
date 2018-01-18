import React from 'react'
import MonacoEditor from 'react-monaco-editor'
import { BASE_URL } from '../app.jsx'

export class Snippet extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      snippet: props.snippet,
      isEditing: false
    }
  }

  addTag (event) {
    if (event.target.value.trim() !== '' && event.key === 'Enter') {
      let snippet = this.state.snippet
      snippet.tags.push(event.target.value)
      event.target.value = ''
      this.update(snippet)
    }
  }

  update (snippet) {
    window.fetch(BASE_URL + '/snippets', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ snippet })
    })
      .then(res => { return res.json() })
      .then(body => this.setState({ snippet: body.snippet, isEditing: false }))
      .catch(err => console.log(err))
  }

  delete () {
    window.fetch(BASE_URL + '/snippets/' + this.state.snippet._id, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(res => res.ok ? this.props.deleteSnippet(this.state.snippet._id) : console.log('cannot delete'))
      .catch(err => console.log(err))
  }

  handleContent (content) {
    let snippet = this.state.snippet
    snippet.content = this.state.isEditing ? content : this.state.snippet.content
    this.setState({ snippet: snippet })
  }

  handleIsEditing () {
    this.setState({ isEditing: !this.state.isEditing })
  }

  render () {
    return (
      <div className='ui card'>
        <div className='content'>
          <span><strong>{'Username - ' + this.state.snippet.username}</strong></span>
          {this.state.snippet.username === this.props.username
            ? <span>
              <i className='right floated circular trash outline icon link' onClick={this.delete.bind(this)} />
              {this.state.isEditing
                ? <i className='right floated circular save icon link' onClick={() => this.update(this.state.snippet)} />
                : <i className='right floated circular edit icon link' onClick={() => this.handleIsEditing()} />
              }
            </span>
            : null}
        </div>
        <div className='content'>
          <MonacoEditor height='400' width='650' value={this.state.snippet.content}
            onChange={this.handleContent.bind(this)} />
        </div>
        <div className='content'>
          {this.state.snippet.tags.map((tag, index) =>
            <strong key={index}><i className='circular tags icon' />{tag} </strong>
          )}
        </div>
        {this.props.username === this.state.snippet.username
          ? <div className='extra content'>
            <div className='ui large transparent left icon input'>
              <i className='tags icon' />
              <input type='text' onKeyUp={this.addTag.bind(this)} placeholder='Add tag' />
            </div>
          </div>
          : null}
      </div>
    )
  }
}
