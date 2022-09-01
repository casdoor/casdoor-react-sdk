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

export interface SilentSigninProps {
  sdk: Sdk; // Casdoor Sdk
  isLoggedIn: () => boolean; // determine if user is logged in
  handleReceivedSilentSigninSuccessEvent?: (message: Message) => void; // the callback method when the event of silent sign in success is received
  handleReceivedSilentSigninFailureEvent?: (message: Message) => void; // the callback method when the event of silent sign in failure is received
}

export class SilentSignin extends React.Component<SilentSigninProps, any> {
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

        if (message.tag !== "Casdoor" || message.type !== "SilentSignin") {
          return;
        }

        if (message.data === "success") {
          if (handleReceivedSilentSigninSuccessEvent) {
            handleReceivedSilentSigninSuccessEvent(message);
          }
        } else {
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

export function isSilentSigninRequired(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.get("silentSignin") === "1";
}
