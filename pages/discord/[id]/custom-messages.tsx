import React from "react";
import Layout from "./layout";
import { NextPageWithLayout } from "./../../_app";
import { DiscordContext } from "/context/discord";
import { changeState } from "/js/objectHandler";
import { FetchDiscord } from "/js/connection";
import CustomMessageItem from "/components/discord/CustomMessageItem";

const Page: NextPageWithLayout = (a) => {
  const { ctx, changeCtx } = React.useContext(DiscordContext);
  const [state, setState] = React.useState({ loaded: false });
  console.log("context", ctx);

  const loadMessages = () => {
    FetchDiscord("/discord/get-custom-messages", null, (r) => {
      changeCtx({ customMessages: r });
      changeState(setState, state, { loaded: true });
    });
  };

  React.useEffect(() => {
    if (!ctx.customMessages || !state.loaded) {
      loadMessages();
    }
  });

  if (!ctx.customMessages) return <></>;

  let messagesList = Object.getOwnPropertyNames(ctx.customMessages)
    .sort()
    .map((x, i) => {
      let elClass = `list-group-item list-group-item-action ${
        x == state.selected ? "active" : ""
      }`;
      const onClick = (e) => {
        changeState(setState, state, { selected: x });
      };
      return (
        <button type="button" key={i} className={elClass} onClick={onClick}>
          {x}
        </button>
      );
    });

  let message = (
    <CustomMessageItem
      title={state.selected}
      message={ctx.customMessages[state.selected]}
      loadMessages={loadMessages}
    ></CustomMessageItem>
  );

  return (
    <div className="row">
      <div className="col-4">
        <div
          className="list-group"
          style={{ overflowY: "scroll", maxHeight: "600px" }}
        >
          {messagesList}
        </div>
      </div>
      <div className="col-8">{message}</div>
    </div>
  );
};

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
