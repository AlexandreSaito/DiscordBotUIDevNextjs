import React from "react";
import Header from "./../components/Header";
import Sidebar from "./../components/Sidebar";
import Head from "next/head";
import Script from "next/script";
import { ConfirmationModal, DisplayModal } from "components/Modal";
import { setHandler } from "components/Toast";
import { LoginContext, LoginEnum } from "context/login";
import { changeState } from "js/objectHandler";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toastState, setToastState] = React.useState({ toast: [] } as {
    toast: Array<any>;
  });
  const [loginState, setLoginState] = React.useState({});
  const toastHandler = {
    setToast: (toast: any) => {
      setToastState({
        toast: toastState.toast
          ? toastState.toast.concat([toast])
          : ([toast] as Array<any>),
      });
    },
    removeToast: (key: any) => {
      setToastState({
        toast: toastState.toast
          ? toastState.toast.filter((x) => x.key != key)
          : [],
      });
    },
  };

  setHandler(toastHandler);

  const getLoginFrom = (loginType: LoginEnum) => {
    return loginState[LoginEnum.Discord];
  };

  const setLogin = (loginType: LoginEnum, name: string, data: any) => {
    let login = {};
    login[loginType] = { name: name, data: data };
    changeState(setLoginState, loginState, login);
  };

  return (
    <section className="content">
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
        key="test"
      />
      <Head>
        <title>Test</title>
      </Head>
      <Header></Header>
      <Sidebar></Sidebar>
      <main className="">
        <LoginContext.Provider
          value={{ getLoginFrom: getLoginFrom, setLogin: setLogin }}
        >
          {children}
        </LoginContext.Provider>
      </main>
      {ConfirmationModal()}
      {DisplayModal()}
      <div
        className="toast-container position-fixed p-3"
        style={{ top: 0, right: 0, zIndex: 5000 }}
      >
        {toastState.toast}
      </div>
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" />
    </section>
  );
}
