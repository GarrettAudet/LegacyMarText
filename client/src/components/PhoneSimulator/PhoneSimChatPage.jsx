import React from "react";

class PhoneSimChatPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      messageList: [
        {from: "bot", text: "Hey there, welcome to MarText. You can set your location, create a post or search for posts."}
      ],
      draft: ""
    };
  }

  sendMessage = async () => {
    const from = this.props.uid;
    const text = this.state.draft.trim();
    if (!text) {
      return
    }
    this.setState(oldState => ({
      draft: "",
      loading: true,
      messageList: [
        {from, text},
        ...oldState.messageList
      ]
    }));
    try {
      const response = await fetch("/client/messages/send", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({text, from})
      });
      if (!response.ok) {
        throw new Error(`Failed to send message ${response.status}`);
      }
      const {messages: replies, debug} = await response.json();
      console.log("Response debug", replies, debug);
      this.setState(oldState => ({
        loading: false,
        messageList: [
          ...replies.map(reply => ({text: reply, from: "bot"})).reverse(),
          ...oldState.messageList
        ]
      }))
    } catch (error) {
      console.error("Failed to send message", error);
      this.setState({error})
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    this.sendMessage();
  };

  submitOnEnter = event => {
    if (event.key.toLowerCase() === "enter") {
      if (event.ctrlKey) {
        this.setState(oldState => ({draft: oldState.draft + "\n"}));
      } else {
        event.preventDefault();
        this.sendMessage();
      }
    }
  };

  render() {
    return (
      <main className="phone-simulator">
        <div className="center-col">
          <img src="./MarTextLogoSmall.png" alt="MarText"/>
        </div>
        <ul className="message-list">
          {this.state.messageList.map((message, index) =>
            <li className={`message-item message-item--${message.from === "bot" ? "bot" : "user"}`}
                key={index}>
              <span className="message-item__content">{message.text}</span>
            </li>
          )}
        </ul>
        <form className="draft-form" onSubmit={this.handleSubmit}>
            <textarea
              className="draft-textarea"
              value={this.state.draft}
              onChange={event => this.setState({draft: event.target.value})}
              onKeyDown={this.submitOnEnter}
            />
          <button className="send-message-button" type="submit" disabled={this.state.loading}>
            Send
          </button>
        </form>
      </main>
    );
  }
}

export default PhoneSimChatPage;