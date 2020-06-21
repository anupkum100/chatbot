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
        <img height="25px" src="data:image/png;base64,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"/>
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

