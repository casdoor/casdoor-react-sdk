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
import { SilentSignin } from "../SilentSignin";
import Sdk from "casdoor-js-sdk";

it("<SilentSignin/> should render <iframe/>", () => {
  const fakeSdk = new Sdk({
    serverUrl: "http://localhost",
    clientId: "",
    appName: "",
    organizationName: "",
  });

  // ensure that <iframe/> can be rendered
  const fakeIsLoggedIn = jest.fn(() => false);

  const tree = renderer
    .create(<SilentSignin sdk={fakeSdk} isLoggedIn={fakeIsLoggedIn} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it("<SilentSignin/> should render null", () => {
  const fakeSdk = new Sdk({
    serverUrl: "http://localhost",
    clientId: "",
    appName: "",
    organizationName: "",
  });

  // ensure that <iframe/> can be rendered
  const fakeIsLoggedIn = jest.fn(() => true);

  const tree = renderer
    .create(<SilentSignin sdk={fakeSdk} isLoggedIn={fakeIsLoggedIn} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
