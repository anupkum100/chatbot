import React from 'react';
import './App.css';

interface Message {
    sender: string,
    value: string
}

interface AppState {
    messages: Array<Message>
    currentMessage: string
    isUserLoggedIn: boolean
    userName: string
}

const URL = "http://localhost:8080";

export default class App extends React.Component<{}, AppState> {

    private inputRef: any;
    private botTimer: any

    constructor(props: any) {
        super(props);
        this.inputRef = React.createRef();
        this.state = {
            messages: [],
            currentMessage: '',
            isUserLoggedIn: sessionStorage.getItem('userName') === null ? false : true,
            userName: sessionStorage.getItem('userName') || '',
        }
    }

    componentWillMount() {
        this.getMessages();
        window.scrollTo(0,document.body.scrollHeight);
    }

    public componentDidMount() {
        setInterval(() => {
            this.getMessages();
        }, 2000);
    }

    public getMessages = () => {
        fetch(URL + "/messages")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        messages: result,
                    });
                }
            )
    }

    removeCurrentMessage = () => {
        this.setState({
            currentMessage: ''
        })
    }

    sendMessageViaAPI = (e: any) => {
        e.preventDefault();
        this.removeCurrentMessage();
        const requestOptions = {
            body: JSON.stringify({
                id: this.state.messages.length + 1,
                sender: this.state.userName,
                value: this.inputRef.current.value,
            }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST'
        };

        // Make the API call to update the db.json file 
        fetch(URL + '/messages/', requestOptions)
            .then(response => response.json())
            .then(_ => this.getMessages());
    }

    createMessages = () => {
        return this.state.messages.map((message: Message, index: number) =>
            <p key={index} className={message.sender !== this.state.userName ? 'message-list text-left' : 'message-list'}>
                <span className="message">{message.value}</span>
                <small className="senderName">{message.sender}</small>
            </p>
        )
    }

    showTyping = () => {
        let isShowTyping = (this.state.currentMessage.length > 0)
        return isShowTyping ? <p className="typing-text">Typing...</p> : null
    }

    handleCurrentMessageChange = (e: any) => {
        clearTimeout(this.botTimer);
        this.setState({
            currentMessage: e.target.value
        })
    }

    handerUserNameChange = (e: any) => {
        this.setState({
            userName: e.target.value
        })
    }

    loginUser = (e: any) => {
        e.preventDefault();
        sessionStorage.setItem('userName', this.state.userName)
        this.setState({
            isUserLoggedIn: true
        })
    }

    render() {
        return (
            <div className="App">
                <header>
                    {this.state.isUserLoggedIn ? <span>{this.state.userName}</span> : null}
                </header>
                {this.state.isUserLoggedIn ?
                    <div className="message-container">
                        {this.createMessages()}
                        {this.showTyping()}
                    </div>
                    :
                    <div className="login-container">
                        <form>
                            <input value={this.state.userName} onChange={this.handerUserNameChange} type="text" placeholder="Enter your name" />
                            <button type="submit" disabled={this.state.userName.length === 0} onClick={this.loginUser}>Login</button>
                        </form>
                    </div>}

                <form className="App-footer">
                    <input placeholder="Enter message" onChange={this.handleCurrentMessageChange} type="text" ref={this.inputRef} value={this.state.currentMessage} />
                    <button hidden={this.state.currentMessage === ''} type="submit" onClick={this.sendMessageViaAPI}>Send</button>
                </form>
            </div>
        );
    }
}

