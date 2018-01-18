import React from 'react'
import { BASE_URL } from '../app.jsx'

export class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      message: ''
    }
  }

  postUserData () {
    let username = document.querySelector('#username').value.trim()
    let password = document.querySelector('#password').value.trim()
    if (username.length > 0 && password.length > 0) {
      window.fetch(BASE_URL + (this.props.loginSignupView === 'Log in' ? '/login' : '/signup'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
      })
        .then(res => { return res.json() })
        .then(body => body.error ? this.setState({ message: body.error })
          : (this.props.loginSignupView === 'Log in' ? this.props.login(username)
            : this.props.handleLoginSignupView('')))
        .catch(err => console.log(err))
    } else {
      this.setState({ message: 'please provide all the details' })
    }
  }

  render () {
    return (
      <div className='ui active mini modal'>
        <div className='header'>{this.props.loginSignupView}</div>
        <div className='content'>
          <div className='ui fluid input'>
            <input id='username' type='text' placeholder='Username' />
          </div>
          <br />
          <div className='ui fluid input'>
            <input id='password' type='password' placeholder='Password' />
          </div>
          <br />
          <p className='error'>{this.state.message}</p>
        </div>
        <div className='actions'>
          <div className='ui button' onClick={this.postUserData.bind(this)}>{this.props.loginSignupView}</div>
          <div className='ui button' onClick={() => this.props.handleLoginSignupView('')}>Cancel</div>
        </div>
      </div>
    )
  }
}
