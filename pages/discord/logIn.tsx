import React from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "pages/_app";
import { FetchResponse } from "js/connection";
import { LoginContext, LoginEnum } from "context/login";

const Home: NextPageWithLayout = (props: any) => {
  const [state, setState] = React.useState({ data: null });

  const userTagRef = React.createRef();
  const userTagFeedbackRef = React.createRef();
  const btnSendRef = React.createRef();

  const { getLoginFrom, setLogin } = React.useContext(LoginContext);

  const onSend = (e: any) => {
    btnSendRef.current.disabled = true;
    userTagRef.current.readOnly = true;
    userTagRef.current.classList.remove("is-invalid");
    if (userTagFeedbackRef.current.value == "") {
      userTagRef.current.classList.add("is-invalid");
      userTagFeedbackRef.current.innerHTML = "User TAG não pode ser vazio!";
      return;
    }
    FetchResponse(
      "/api/discord/get-bot-list",
      { body: { userTag: userTagRef.current.value } },
      (r: any) => {
        console.log(r);
        if (r.alert == "danger") {
          btnSendRef.current.disabled = false;
          userTagRef.current.readOnly = false;
          userTagFeedbackRef.current.innerHTML = r.message;
          userTagRef.current.classList.add("is-invalid");
          return;
        }

        setState({ data: r.data });
      }
    );
  };
  const router = useRouter();

  const onSelectBot = (id: number, discordId: string) => {
    setLogin(LoginEnum.Discord, userTagRef.current.value, {
      permissions: state.data.map((x) => x.id),
      discordId: discordId,
      discordName: userTagRef.current.value.split("#")[0],
    });
    router.push(`/discord/${id}`);
  };

  let discordOptions = [];
  if (state.data) {
    discordOptions = state.data.map((x) => {
      return (
        <button
          key={x.id}
          className="list-group-item list-group-item-action"
          onClick={() => {
            onSelectBot(x.id, x.res.id);
          }}
        >
          {x.id} - {x.res.botName}
        </button>
      );
    });
  }

  return (
    <div className="card">
      <h4 className="card-header">Log-in</h4>
      <div className="card-body">
        <div className="input-group has-validation mb-3">
          <span className="input-group-text">User TAG</span>
          <input
            type="text"
            className="form-control"
            placeholder="User#0000"
            ref={userTagRef}
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onSend}
            ref={btnSendRef}
          >
            Send
          </button>
          <div className="invalid-feedback" ref={userTagFeedbackRef}></div>
        </div>
        <div className="list-group">{discordOptions}</div>
      </div>
    </div>
  );
};

export default Home;
