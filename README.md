# casdoor-react-sdk

[![NPM version](https://img.shields.io/npm/v/casdoor-react-sdk)](https://npmjs.com/package/casdoor-react-sdk)
[![NPM download](https://img.shields.io/npm/dm/casdoor-react-sdk)](https://npmjs.com/package/casdoor-react-sdk)
[![Github Actions](https://github.com/casdoor/casdoor-react-sdk/actions/workflows/release.yaml/badge.svg)](https://github.com/casdoor/casdoor-react-sdk/actions/workflows/release.yaml)
[![Coverage Status](https://codecov.io/gh/casdoor/casdoor-react-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/casdoor/casdoor-react-sdk)
[![Release](https://img.shields.io/github/v/release/casdoor/casdoor-react-sdk)](https://github.com/casdoor/casdoor-react-sdk/releases/latest)
[![Discord](https://img.shields.io/discord/1022748306096537660?logo=discord&label=discord&color=5865F2)](https://discord.gg/5rPsrAzK7S)


It can help you quickly build a silent sign-in application based on Casdoor.

We have an implemented example: [casdoor-spring-security-react-example](https://github.com/casdoor/casdoor-spring-security-react-example).

To use this sdk just follow the steps below.

### Installation

```shell
#NPM
npm i casdoor-react-sdk

#YARN
yarn add casdoor-react-sdk
```

### Use in React

Let's take a look at the following example of a silent sign-in.

First, you need to initialize the Casdoor SDK.

```ts
import Sdk from "casdoor-js-sdk";

export const ServerUrl = "http://localhost:7023";

const sdkConfig = {
  serverUrl: "http://localhost:8000",
  clientId: "d79fd3c4e09a309fb3f5123",
  appName: "application_hnpzib",
  organizationName: "organization_4emn5k",
  redirectPath: "/callback",
  signinPath: "/api/signin",
};

export const CasdoorSDK = new Sdk(sdkConfig);
```

Then, intercept the `/callback` path in your application, the `AuthCallback` component will help you automatically handle the logic of interacting with the server, you just need to make sure that your server `ServerUrl` implements the `${ServerUrl}/api/signin` api, and takes two parameters `code` and `state`, and returns `token`.

> Note: Here you need to implement the `saveTokenFromResponse` and `isGetTokenSuccessful` functions.
>
> - `isGetTokenSuccessful`：you need to judge from the response data whether the request is processed successfully by the server.
> - `saveTokenFromResponse`：when your `${ServerUrl}/api/signin` api successfully returns the token, you need to save the token.

```tsx
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { AuthCallback } from "casdoor-react-sdk";
import * as Setting from "./Setting";
import HomePage from "./HomePage";

function App() {
  const authCallback = (
    <AuthCallback
      sdk={Setting.CasdoorSDK}
      serverUrl={Setting.ServerUrl}
      saveTokenFromResponse={(res) => {
        // @ts-ignore
        // save token
        localStorage.setItem("token", res.data.accessToken);
      }}
      isGetTokenSuccessful={(res) => {
        // @ts-ignore
        // according to the data returned by the server,
        // determine whether the `token` is successfully obtained through `code` and `state`.
        return res.success === true;
      }}
    />
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/callback" element={authCallback} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

In your `HomePage` to determine whether you need to log in silently, if you need to log in silently, return the `SilentSignin` component, it will help you initiate a login request, and after the login is successful, it will call the `handleReceivedSilentSigninSuccessEvent` function, and when the login fails, it will also Call the `handleReceivedSilentSigninFailureEvent` function.

```tsx
import * as Setting from "./Setting";
import { SilentSignin, isSilentSigninRequired } from "casdoor-react-sdk";

function HomePage() {
  const isLoggedIn = () => {
    return localStorage.getItem("token") !== null;
  };

  if (isSilentSigninRequired()) {
    // if the `silentSignin` parameter exists, perform silent login processing
    return (
      <SilentSignin
        sdk={Setting.CasdoorSDK}
        isLoggedIn={isLoggedIn}
        handleReceivedSilentSigninSuccessEvent={() => {
          // jump to the home page here and clear silentSignin parameter
          window.location.href = "/";
        }}
        handleReceivedSilentSigninFailureEvent={() => {
          // prompt the user to log in failed here
          alert("login failed");
        }}
      />
    );
  }

  const renderContent = () => {
    if (isLoggedIn()) {
      return <div>Hello!</div>;
    } else {
      return <div>you are not logged in</div>;
    }
  };

  return renderContent();
}

export default HomePage;
```
