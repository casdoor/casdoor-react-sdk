import * as React from "react";
import Sdk from "casdoor-js-sdk";
import type { Message } from "./message";

export interface SilentSigninProps {
  sdk: Sdk; // Casdoor Sdk
  isLoggedIn: () => boolean; // determine if user is logged in
  handleReceivedSilentSigninSuccessEvent?: (message: Message) => void; // the callback method when the event of silent sign in success is received
  handleReceivedSilentSigninFailureEvent?: (message: Message) => void; // the callback method when the event of silent sign in failure is received
}

class SilentSignin extends React.Component<SilentSigninProps, any> {
  componentDidMount() {
    this.listenForSilentSigninEvents();
  }

  listenForSilentSigninEvents = () => {
    const {
      handleReceivedSilentSigninSuccessEvent,
      handleReceivedSilentSigninFailureEvent,
    } = this.props;

    window.addEventListener(
      "message",
      (event: MessageEvent<Readonly<Message>>) => {
        const message = event.data;

        if (message.tag !== "Casdoor") {
          return;
        }

        if (message.type === "SilentSignin" && message.data === "success") {
          if (handleReceivedSilentSigninSuccessEvent) {
            handleReceivedSilentSigninSuccessEvent(message);
          }
        } else if (
          message.type === "SilentSignin" &&
          message.data === "user-not-logged-in"
        ) {
          if (handleReceivedSilentSigninFailureEvent) {
            handleReceivedSilentSigninFailureEvent(message);
          }
        }
      }
    );
  };

  render() {
    const { isLoggedIn, sdk } = this.props;

    if (window !== window.parent) {
      return null;
    }

    if (isLoggedIn()) {
      return null;
    }

    return (
      <iframe
        id="iframeTask"
        src={`${sdk.getSigninUrl()}&silentSignin=1`}
        style={{ display: "none" }}
        frameBorder="no"
      />
    );
  }
}

export default SilentSignin;
