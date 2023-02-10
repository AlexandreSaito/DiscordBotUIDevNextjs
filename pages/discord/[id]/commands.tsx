import React from "react";
import Layout from "./layout";
import { NextPageWithLayout } from "./../../_app";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { DiscordContext } from "/context/discord";
import { changeState } from "/js/objectHandler";
import { FetchDiscord } from "/js/connection";
import CommandItem from "/components/discord/CommandItem";

const Page: NextPageWithLayout = (a) => {
  const { ctx, changeCtx } = React.useContext(DiscordContext);
  const [state, setState] = React.useState({ loadeed: false });

  React.useEffect(() => {
    if (!ctx.command || !state.loaded) {
      FetchDiscord("/discord/get-commands", null, (r) => {
        changeCtx({ command: r });
        changeState(setState, state, { loaded: true });
      });
      return;
    }
  });

  if (!ctx.command) return <></>;

  let command = null;
  if (state.current) {
    let cmd = ctx.command.commands.find((x) => x.name == state.current);
    let rule = ctx.command.rules.find((x) => x.name == state.current);
    command = <CommandItem cmd={cmd} cmdRule={rule}></CommandItem>;
  }

  let commands = [];
  ctx.command.commands
    .sort((x) => x.name)
    .forEach((x, i) => {
      let onClick = (e) => {
        changeState(setState, state, { current: x.name });
      };
      let className = `list-group-item ${
        state.current == x.name ? "active" : ""
      }`;
      commands.push(
        <div key={i} className={className} onClick={onClick}>
          {x.name}
        </div>
      );
    });

  return (
    <div className="row">
      <div className="col-4">
        <div className="list-group scrollable">{commands}</div>
      </div>
      <div className="col-8">{command}</div>
    </div>
  );
};

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
