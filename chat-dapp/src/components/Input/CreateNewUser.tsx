import React from "react";
import {Input} from "antd";
import ChatClient from "../../idl/ChatClient";

export class CreateNewUser extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    const chatClient = new ChatClient();
    this.state = {
      userName: '',
      wallet: props.wallet,
      connection: props.connection,
      chatClient
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleChange(event: any) {
    this.setState({userName: event.target.value});
  }

  async handleKeyDown(e: any) {

    const {userName, wallet, connection, chatClient} = this.state;
    if (e.key === 'Enter') {
      if (userName === '' || userName === undefined) {
        alert('Please input user name');
      } else {
        await chatClient.createNewUser(userName,connection, wallet);
        this.setState({userName: ''});
        e.persist();
      }
    }
  }

  render() {
    return (
      <Input
        {...this.props}
        value={this.state.userName}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
      />
    );
  }
}
