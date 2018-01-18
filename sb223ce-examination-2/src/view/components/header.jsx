import React from 'react'

export class Header extends React.Component {
  getSnippets () {
    document.querySelector('#searched-username').value = ''
    document.querySelector('#searched-tag').value = ''
    this.props.getSnippets()
  }

  searchSnippets () {
    let username = document.querySelector('#searched-username').value.trim()
    let tag = document.querySelector('#searched-tag').value.trim()
    this.props.getSnippets(username, tag)
  }

  render () {
    return (
      <div className='ui labeled menu'>
        <a className='item' onClick={this.getSnippets.bind(this)}>
          <h3><i className='link code icon' />Sticky Snippets</h3>
        </a>
        <span className='item'>
          <div className='ui left icon input'>
            <i className='user icon' />
            <input id='searched-username' type='text' placeholder='Enter a username...' />
          </div>
        </span>
        <span className='item'>
          <div className='ui left icon input'>
            <i className='tags icon' />
            <input id='searched-tag' type='text' placeholder='Enter a tag...' />
          </div>
        </span>
        <span className='item'>
          <div className='ui positive button' onClick={this.searchSnippets.bind(this)}>Search</div>
        </span>
        {this.props.isNewSnippet ? null
          : <span className='right menu'>
            <div className='item'>
              {this.props.username
                ? <div className='ui button' onClick={this.props.logout}>Log out</div>
                : <div className='ui button' onClick={() => this.props.handleLoginSignupView('Log in')}>Log in</div>
              }
            </div>
            <div className='item'>
              {this.props.username
                ? <div className='ui primary button' onClick={this.props.handleIsNewSnippet} >+ Snippet</div>
                : <div className='ui primary button' onClick={() => this.props.handleLoginSignupView('Sign up')}>
                  Sign up
                </div>
              }
            </div>
          </span>
        }
      </div>
    )
  }
}
