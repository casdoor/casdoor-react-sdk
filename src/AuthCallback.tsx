import * as React from "react";
import Sdk from "casdoor-js-sdk";
import type { Message } from "./message";
import { ReactNode } from "react";

export interface AuthCallbackProps {
  sdk: Sdk; // Casdoor Sdk
  serverUrl: string; // your application server URL, e.g., "http://localhost:7000"
  handleLoginSuccessEvent?: (res: Response) => void; // callback method after calling the `signin` method of Casdoor Sdk successfully
  handleLoginFailureEvent?: (res: Response) => void; // Callback method after calling the `signin` method of Casdoor Sdk fails
  elementForLoginSuccessful: ReactNode; // This element is used to display after the callback is successful
  elementForLoginFailure: ReactNode; // This element is used to display after failure
}

export interface AuthCallbackState {
  message: null | string;
}

class AuthCallback extends React.Component<
  AuthCallbackProps,
  AuthCallbackState
> {
  componentWillMount() {
    this.signin();
  }

  signin = () => {
    const { sdk, serverUrl, handleLoginSuccessEvent, handleLoginFailureEvent } =
      this.props;
    sdk.signin(serverUrl).then((res) => {
      // @ts-ignore
      if (res.status === "ok") {
        if (window !== window.parent) {
          this.sendSuccessfulLoginMessage();
        }
        if (handleLoginSuccessEvent) {
          handleLoginSuccessEvent(res);
        }
      } else {
        // @ts-ignore
        this.setState({ message: res.msg });
        if (handleLoginFailureEvent) {
          handleLoginFailureEvent(res);
        }
      }
    });
  };

  sendSuccessfulLoginMessage = () => {
    const message: Message = {
      tag: "Casdoor",
      type: "SilentSignin",
      data: "success",
    };
    window.postMessage(message, "*");
  };

  renderContent = () => {
    const { elementForLoginSuccessful, elementForLoginFailure } = this.props;
    if (this.state.message !== null) {
      return elementForLoginSuccessful;
    } else {
      return elementForLoginFailure;
    }
  };

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

export default AuthCallback;
