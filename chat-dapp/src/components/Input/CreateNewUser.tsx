import React from "react";
import {Input} from "antd";
import ChatClient from "../../idl/ChatClient";

export class CreateNewUser extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    const cc = new ChatClient();
    this.state = {
      value: '',
      wallet: props.wallet,
      conn: props.connection,
      cc
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleChange(event: any) {
    this.setState({value: event.target.value});
  }

  async handleKeyDown(e: any) {

    const {value, wallet, conn, cc} = this.state;
    if (e.key === 'Enter') {
      if (value === '' || value === undefined) {
        alert('Please input user name');
      } else {

        console.log('Wallet address: ', wallet.publicKey.toBase58());

        await cc.createNewUser(value,conn, wallet);
        this.setState({value: ''});
        e.persist();
      }
    }
  }

  render() {
    return (
      <Input
        {...this.props}
        value={this.state.value}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
      />
    );
  }
}
