import React from "react";
import {useWallet} from "../../contexts/wallet";
import {Col, Input, Row} from "antd";
import {CreateNewUser} from "../Input/CreateNewUser";
import {useConnection} from "../../contexts/connection";
import {CreateNewChatRoom} from "../Input/CreateNewChatRoom";

export const ChatAuthenticated = (props: {}) => {
  const {wallet} = useWallet();
  const connection = useConnection();

  if (!wallet?.publicKey) {
    return null;
  }

  return (
    <Row gutter={[16, 16]} align="middle">
      <Col span={24}><h1>Welcome to GoRiant Chat Decentralize Application</h1></Col>
      <Col span={24}><h2>Please create new User</h2></Col>

      <Col span={6}>
        <h2>Create new user:</h2>
      </Col>
      <Col span={18}>
        <CreateNewUser wallet={wallet} connection={connection}/>
      </Col>
      <Col span={6}>
        <h2>Create new chat room:</h2>
      </Col>
      <Col span={18}>
          <CreateNewChatRoom wallet={wallet} connection={connection}/>
      </Col>
      <Col span={6}>
        <h2>Send chat message:</h2>
      </Col>
      <Col span={18}>
        <Input/>
      </Col>
    </Row>
  );
};
