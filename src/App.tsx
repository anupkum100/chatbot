import React from 'react';
import './App.css';

interface Message {
  sender: string,
  value: string
}

interface AppState {
  messages: Array<Message>
  currentMessage: string
  showChatBotReply: boolean
  botThinking: boolean
}

const waitingTimeForBotToReply = 2000;
const botThinkingTime = 2000;

export default class App extends React.Component<{}, AppState> {

  private inputRef: any;
  private botTimer: any

  constructor(props: any) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      messages: [{
        sender: 'Chatbot',
        value: 'Please Enter your Name'
      }],
      currentMessage: '',
      showChatBotReply: false,
      botThinking: false
    }
  }

  sendMessage = (e: any) => {
    e.preventDefault();
    let exisstingMessageList = this.state.messages;
    exisstingMessageList.push({
      sender: this.state.messages[1] ? this.state.messages[1].value : this.inputRef.current.value,
      value: this.inputRef.current.value
    })

    this.setState({
      messages: exisstingMessageList,
      currentMessage: '',
      showChatBotReply: true
    }, () => {
      this.botTimer = setTimeout(() => {
        this.createMessagesForBot()
      }, waitingTimeForBotToReply)
    })
  }

  createMessages = () => {
    return this.state.messages.map((message: Message, index: number) =>
      <p key={index} className={message.sender === 'Chatbot' ? 'message-list text-left' : 'message-list'}>
        <span className="message">{message.value}</span>
      </p>
    )
  }

  createMessagesForBot = () => {
    this.setState({
      botThinking: true
    })

    setTimeout(() => {
      if (this.state.showChatBotReply) {
        let exisstingMessageList = this.state.messages;

        exisstingMessageList.push({
          sender: "Chatbot",
          value: this.createChatBotReply()
        })

        this.setState({
          messages: exisstingMessageList,
          currentMessage: '',
          showChatBotReply: false,
          botThinking: false
        })
      }
    }, botThinkingTime)
  }

  createChatBotReply = () => {
    if (this.state.messages.length <= 2) {
      return "Thankyou for your message " + this.state.messages[1].sender + " How can I help you?"
    } else {
      return "We will get back to you on " + this.state.messages[this.state.messages.length - 1].value + " soon."
    }
  }

  showTyping = () => {
    let isShowTyping = (this.state.currentMessage.length > 0 || this.state.botThinking)
    return isShowTyping ? <p className={this.state.botThinking ? "typing-text text-left" : "typing-text"}>Typing...</p> : null
  }

  handleCurrentMessageChange = (e: any) => {
    clearTimeout(this.botTimer);
    this.setState({
      currentMessage: e.target.value
    })
  }

  render() {
    let placeHolderText = this.state.messages.length === 1 ? "Your Name" : "Your Message"
    return (
      <div className="App">
        <div className="message-container">
          {this.createMessages()}
          {this.showTyping()}
        </div>
        <form className="App-footer">
          <input placeholder={placeHolderText} onChange={this.handleCurrentMessageChange} type="text" ref={this.inputRef} value={this.state.currentMessage} />
          <button hidden={this.state.currentMessage === ''} type="submit" onClick={this.sendMessage}>Send</button>
        </form>
      </div>
    );
  }

}

