import React, {Component, Fragment} from 'react';
import {loadMessages, saveMessage} from "../../store/actions/chat";
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
    if (!this.props.user) {
      this.props.history.push('/login');
    } else {
      this.websocket = new WebSocket('ws://localhost:8000/chat?token=' + this.props.user.token);

      this.websocket.onmessage = (message) => {
        const decodedMessage = JSON.parse(message.data);
        switch (decodedMessage.type) {
          case 'ALL_MESSAGES':
            this.props.onLoadMessages(decodedMessage.messages);
            break;
          case 'NEW_MESSAGE':
            this.props.onSaveMessage(decodedMessage.message);
            break;
          default:
            return this.state;
        }
      }
    }
  };

  componentDidUpdate() {
    if (!this.props.user) {
      this.websocket.send(JSON.stringify({type: 'CLOSE_CONNECTION'}));
      this.props.history.push('/login');
    }
  }

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
        <div style={{width: '20%', display: 'block', marginRight: '0', float: 'right'}}>
          <h3>Users</h3>
          {this.state.messages.map(message => {
            return (
              <p key={message.user._id}><b>{message.user}</b></p>
            )
          })}
        </div>
        <div style={{float: 'left', width: '70%'}}>
          <h3>Messages</h3>

        <div style={{border: '1px solid grey', overflow: 'scroll', height: '400px'}}>
          <form>

            {this.props.messages.map(message => {
            console.log(message.user);
              return (
                <p style={{marginLeft: '15px'}} key={message._id}>{message.user + ': ' + message.text}</p>
              )
            })}
          </form>
        </div>
          <form>
            <input style={{margin: '15px 0 0 0'}}
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
    onLoadMessages: (id) => dispatch(loadMessages(id)),
    onSaveMessage: (message, token) => dispatch(saveMessage(message, token))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
