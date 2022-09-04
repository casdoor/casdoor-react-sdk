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
import * as renderer from "react-test-renderer";
import { AuthCallback } from "../AuthCallback";
import Sdk from "casdoor-js-sdk";
import "isomorphic-fetch";

const fakeSigninFn = () => {
  const body = new Blob([JSON.stringify({ status: "ok" })], {
    type: "application/json",
  });
  return Promise.resolve(new Response(body));
};

const spyWithFakeSigninFn = jest
  .spyOn(Sdk.prototype, "signin")
  .mockImplementation(fakeSigninFn);

it("<AuthCallback/> should render null", () => {
  const fakeSdk = new Sdk({
    serverUrl: "",
    clientId: "",
    appName: "",
    organizationName: "",
  });

  // ensure that the `signin` function is replaced
  fakeSdk.signin("");
  expect(spyWithFakeSigninFn).toHaveBeenCalled();

  const fakeSaveTokenFromResponseFn = jest.fn(() => {});
  const fakeIsGetTokenSuccessfulFn = jest.fn(() => true);
  const fakeServerUrl = "";

  const tree = renderer
    .create(
      <AuthCallback
        sdk={fakeSdk}
        saveTokenFromResponse={fakeSaveTokenFromResponseFn}
        isGetTokenSuccessful={fakeIsGetTokenSuccessfulFn}
        serverUrl={fakeServerUrl}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
