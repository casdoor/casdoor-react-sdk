// Copyright 2022 The Casdoor Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as React from "react";
import Sdk from "casdoor-js-sdk";
import type { Message } from "./message";

export interface AuthCallbackProps {
  sdk: Sdk; // Casdoor Sdk
  serverUrl: string; // your application server URL, e.g., "http://localhost:7000"
  saveTokenFromResponse?: (res: Response) => void; // callback method after calling the `signin` method of Casdoor Sdk successfully
  isGetTokenSuccessful: (res: Response) => boolean; // determine whether the token is obtained successfully
}

export interface AuthCallbackState {
  message: null | string;
}

export class AuthCallback extends React.Component<
  AuthCallbackProps,
  AuthCallbackState
> {
  UNSAFE_componentWillMount() {
    this.signin();
  }

  signin = () => {
    const { sdk, serverUrl, isGetTokenSuccessful, saveTokenFromResponse } =
      this.props;
    sdk.signin(serverUrl).then((res) => {
      if (isGetTokenSuccessful(res)) {
        if (window !== window.parent) {
          this.sendSuccessfulLoginMessage();
        }
        if (saveTokenFromResponse) {
          saveTokenFromResponse(res);
        }
      } else {
        if (window !== window.parent) {
          this.sendLoginFailureMessage();
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
    window.parent.postMessage(message, "*");
  };

  sendLoginFailureMessage = () => {
    const message: Message = {
      tag: "Casdoor",
      type: "SilentSignin",
      data: "login-failure",
    };
    window.parent.postMessage(message, "*");
  };

  render() {
    return <></>;
  }
}
