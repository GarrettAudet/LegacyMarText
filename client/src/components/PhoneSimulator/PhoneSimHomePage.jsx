import React from "react";
import PhoneSimChatPage from "./PhoneSimChatPage"

const generateUid = () => {
  return `${Math.round(Math.random() * 100) + Date.now()}`;
};

class PhoneSimHomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: "",
    };
  }

  setUid = () => {
    this.setState({uid: generateUid()})
  };

  render() {
    if (this.state.uid) {
      return <PhoneSimChatPage uid={this.state.uid}/>
    }
    return (
      <React.Fragment>
        <h1 className='phone-simulator-home'>
          <img src="./MarTextLogoSmall.png" alt="MarText"/>
        </h1>
        <p className="martext-description">
          Welcome to MarText Simulator.
          This website will let you use the features of MarText without a mobile phone.
          If you are a hackathon judge and would like to see MarText work via SMS send "Hello" to&nbsp;
          <a href="tel:16134824161">+1 (613) 482-4161</a>.
          If you are not a judge, please only use the simulator, as MarText has limited API calls for handling text messages.
        </p>
        <div className="center-col">
          <button type="button"
                  className="send-message-button go-button"
                  onClick={this.setUid}>
            Go to the Simulator
          </button>
        </div>
      </React.Fragment>);
  }
}

export default PhoneSimHomePage;