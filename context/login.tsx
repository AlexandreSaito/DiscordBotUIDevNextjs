import React from "react";

export enum LoginEnum {
  Discord = "discord",
}

export interface LoginContext {
  setLogin: Function;
  getLoginFrom: Function;
}

export const LoginContext = React.createContext({} as LoginContext);
