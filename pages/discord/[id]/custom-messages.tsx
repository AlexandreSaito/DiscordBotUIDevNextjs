import React from "react";
import Layout from "./layout";
import { NextPageWithLayout } from "./../../_app";
import { DiscordContext } from "/context/discord";
import { changeState } from "/js/objectHandler";
import { FetchDiscord } from "/js/connection";
import CustomMessageItem from "/components/discord/CustomMessageItem";

function MessageItem(props: any) {
  let elClass = `list-group-item list-group-item-action ${
    props.item.value == props.selected ? "active" : ""
  }`;
  const onClick = (e: any) => {
    props.onSelectMessage(props.item.value);
  };
  return (
    <button type="button" className={elClass} onClick={onClick}>
      {props.item.name}
    </button>
  );
}

function getListFromGroup(
  messageGroup: any,
  currentSelected: string,
  onSelectMessage: Function
) {
  let messageListElement: any = [];
  let messageGroupTitles = Object.getOwnPropertyNames(messageGroup);
  messageGroupTitles.sort().forEach((x, index) => {
    let m = messageGroup[x];
    messageListElement.push(
      <div key={`main_${index}`}>
        {x}
        <div className="list-group">
          {m.map((y: any, i: number) => {
            return (
              <MessageItem
                key={i}
                selected={currentSelected}
                onSelectMessage={onSelectMessage}
                item={y}
              ></MessageItem>
            );
          })}
        </div>
      </div>
    );
  });
  return messageListElement;
}

const Page: NextPageWithLayout = (a) => {
  const { ctx, changeCtx } = React.useContext(DiscordContext);
  const [state, setState] = React.useState({ loaded: false, selected: "" });

  const loadMessages = () => {
    FetchDiscord("/discord/get-custom-messages", null, (r: any) => {
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

  let messageGroup: any = {};
  Object.getOwnPropertyNames(ctx.customMessages)
    .sort()
    .forEach((x) => {
      let title = "no-group";
      let remain = x;
      if (x.startsWith("cmd")) {
        if (x.includes("permission")) {
          title = "permission";
        } else {
          title = `Command ${x.replace("cmd-", "")}`;
          let index = title.indexOf("-");
          remain = title.substring(index + 1, title.length);
          title = title.substring(0, index);
        }
      }
      if (!messageGroup[title]) messageGroup[title] = [];
      messageGroup[title].push({ name: remain, value: x });
    });

  const onSelectMessage = (message: string) => {
    changeState(setState, state, { selected: message });
  };
  let messageListElement = getListFromGroup(
    messageGroup,
    state.selected,
    onSelectMessage
  );

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
          className="list-group scrollable"
          style={{ "--scrollable-height": "600px" }}
        >
          {messageListElement}
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
