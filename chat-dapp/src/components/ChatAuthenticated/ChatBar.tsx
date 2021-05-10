import React from "react";
import {useWallet} from "../../contexts/wallet";
import {ChatAuthenticated} from "./index";

export const ChatBar = (props: { left?: JSX.Element; right?: JSX.Element }) => {
  const { connected } = useWallet();
  const ChatBar = (
    <div className="Chat-Bar-center">
      {connected ? (<ChatAuthenticated />) : undefined}
    </div>
  );

  return ChatBar;
};
