import React, {Component, Fragment} from 'react';

class Chat extends Component {

  state = {
    username: '',
    usernameSet: false,
    messages: [],
    messageText: ''
  };

  usernameChangeHandler = event => {
    this.setState({username: event.target.value})
  };

  messageTextChangeHandler = event => {
    this.setState({messageText: event.target.value})
  };

  componentDidMount() {
    this.websocket = new WebSocket('ws://localhost:8000/chat');

    this.websocket.onmessage = (message) => {
      const decodedMessage = JSON.parse(message.data);

      switch (decodedMessage.type) {
        case 'NEW_MESSAGE':
          this.setState(prevState => {
            return {messages: [...prevState.messages, decodedMessage]}
          })
      }
    }
  };

  setUsername = event => {
    event.preventDefault();
    this.websocket.send(JSON.stringify({
      type: 'SET_USERNAME',
      username: this.state.username
    }));

    this.setState({usernameSet: true})
  };

  sendMessage = event => {
    event.preventDefault();
    this.websocket.send(JSON.stringify({
      type: 'CREATE_MESSAGE',
      text: this.state.messageText
    }));
    this.setState({messageText: ''});
  };

  render() {
    return (
      <Fragment>
        {this.state.usernameSet ?
          <div>
            {this.state.messages.map(message => (
              <p><b>{message.username}:</b>{message.text}</p>
            ))}
            <form onSubmit={this.sendMessage}>
              <input
                type="text"
                required
                placeholder="Enter message"
                value={this.state.messageText}
                onChange={this.messageTextChangeHandler}
              />
              <button type="submit">Send</button>
            </form>
          </div>
          :
          <form onSubmit={this.setUsername}>
            <input type="text" required placeholder="Enter username" value={this.state.username}
                   onChange={this.usernameChangeHandler}/>
            <button type="submit">Enter chat</button>
          </form>
        }
      </Fragment>
    );
  }
}

export default Chat;
