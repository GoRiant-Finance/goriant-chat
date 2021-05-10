import React from "react";
import {Input} from "antd";
import ChatClient from "../../idl/ChatClient";

export class CreateNewChatRoom extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    const chatClient = new ChatClient();
    this.state = {
      roomName: '',
      wallet: props.wallet,
      connection: props.connection,
      chatClient
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleChange(event: any) {
    this.setState({roomName: event.target.value});
  }

  async handleKeyDown(e: any) {

    const {roomName, wallet, connection, chatClient} = this.state;
    if (e.key === 'Enter') {
      if (roomName === '' || roomName === undefined) {
        alert('Please input room name');
      } else {
        await chatClient.createNewChatRoom(roomName,connection, wallet);
        this.setState({roomName: ''});
        e.persist();
      }
    }
  }

  render() {
    return (
      <Input
        {...this.props}
        value={this.state.roomName}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
      />
    );
  }
}
