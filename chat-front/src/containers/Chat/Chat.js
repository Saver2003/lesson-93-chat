import React, {Component, Fragment} from 'react';
import {loadMessages, saveMessage, loadAllUsers, deleteMessage} from "../../store/actions/chat";
import {connect} from "react-redux";
import scrollToComponent from 'react-scroll-to-component';

class Chat extends Component {

  state = {
    messages: [],
    messageText: '',
    users: []
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
          case 'DELETE_SUCCESS':
            this.props.deleteMessage(decodedMessage.message);
            break;
          case 'UPDATE_USERS':
            this.props.loadAllUsers(decodedMessage.users);
            break;
          default:
            return this.state;
        }
      };
    }

    scrollToComponent(this)
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

  deleteMessage(event, id) {
    event.preventDefault();
    console.log('asdas')
    this.websocket.send(JSON.stringify({
      type: 'DELETE_MESSAGE',
      id: id
    }))
  }

  render() {

    return (
      <Fragment>
        <div style={{width: '20%', display: 'block', marginRight: '0', float: 'right'}}>
          <h3>Users</h3>

          {this.props.oneUser.map(user => {
            return (
              <p key={user.username}><b>{user.username}</b></p>
            )
          })}
        </div>
        <div style={{float: 'left', width: '70%'}}>
          <h3>Messages</h3>
          <div style={{border: '1px solid grey', overflow: 'auto', height: '400px', background: '#161615'}}>
            <form>

              {this.props.messages.map(message => {
                return (
                  <div key={message._id}>
                  <p style={{marginLeft: '15px', color: '#fff772', display: 'inline'}} key={message._id}>
                    <b style={{color: '#70e26b'}}>
                      {message.user}
                    </b>
                    {'' + ': ' + message.text}
                  </p>
                    {this.props.user.role === 'admin' ?
                      <button
                        onClick={(event) => this.deleteMessage(event, message._id)}
                        style={{marginLeft: '20px', background: '#161615', color: '#b52c05', border: 'none'}}>
                        Delete message
                      </button> : null
                    }
                  </div>
                )
              })}
            </form>
          </div>
          <form>
            <input style={{margin: '15px 0 0 0', width: '400px'}}
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
    user: state.users.user,
    oneUser: state.chat.users
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onLoadMessages: (id) => dispatch(loadMessages(id)),
    onSaveMessage: (message, token) => dispatch(saveMessage(message, token)),
    loadAllUsers: (users) => dispatch(loadAllUsers(users)),
    deleteMessage: (id) => dispatch(deleteMessage(id))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
