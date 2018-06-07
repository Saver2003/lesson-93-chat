import React, {Component, Fragment} from 'react';
import {fetchMessages, loadMessages, saveMessage} from "../../store/actions/chat";
import {saveState} from "../../store/localStorage";
import {connect} from "react-redux";

class Chat extends Component {

  state = {
    messages: [],
    messageText: ''
  };

  messageTextChangeHandler = event => {
    this.setState({messageText: event.target.value})
  };

  componentDidMount() {
    this.websocket = new WebSocket('ws://localhost:8000/chat?token=' + this.props.user.token);
    this.props.onLoadMessages(this.props.match.params.id);
    if (!this.props.user) {
      this.props.history.push('/login');
    }
    this.websocket.onmessage = (message) => {
      const decodedMessage = JSON.parse(message.data);
      switch (decodedMessage.type) {
        case 'ALL_MESSAGES':
          console.log(decodedMessage);
          break;
        case 'NEW_MESSAGE':
          console.log(decodedMessage);
          this.props.onSaveMessage(decodedMessage.message);
      }
    }
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

          <div>
            <form>
              <input
                type="text"
                required
                placeholder="Enter message"
                value={this.state.messageText}
                onChange={this.messageTextChangeHandler}
              />
              <button
                onClick={this.sendMessage}
              >
                Send
              </button>
              {this.props.messages.map(message => (

                  <p key={message._id}>{message.user + ': ' + message.text}</p>

              ))}
            </form>
          </div>

      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    messages: state.chat.messages,
    user: state.users.user
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onLoadMessages: (id) => dispatch(fetchMessages(id)),
    onSaveMessage: (message, token) => dispatch(saveMessage(message, token))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
