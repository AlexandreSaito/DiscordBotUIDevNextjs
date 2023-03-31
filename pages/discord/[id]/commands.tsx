import React from "react";
import Layout from "./layout";
import { NextPageWithLayout } from "./../../_app";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { DiscordContext } from "context/discord";
import { changeState } from "js/objectHandler";
import { FetchDiscord } from "js/connection";
import CommandItem from "components/discord/CommandItem";

const Page: NextPageWithLayout = (a: any) => {
  const { ctx, changeCtx } = React.useContext(DiscordContext);
  const [state, setState] = React.useState({ loaded: false, current: null });

  React.useEffect(() => {
    if (!ctx.command || !state.loaded) {
      FetchDiscord("/discord/get-commands", null, (r: any) => {
        changeCtx({ command: r });
        changeState(setState, state, { loaded: true, current: "" });
      });
      return;
    }
  });

  if (!ctx.command) return <></>;

  let command = null;
  if (state.current && state.current != "" && ctx.command.commands) {
    let cmd = ctx.command.commands.find((x) => x.name == state.current);
    let rule = ctx.command.rules
      ? ctx.command.rules.find((x) => x.name == state.current)
      : null;
    command = <CommandItem cmd={cmd} cmdRule={rule}></CommandItem>;
  }

  let commands: Array<any> = [];
  if (ctx.command.commands) {
    ctx.command.commands
      .sort((x, y) => x.name.localeCompare(y.name))
      .forEach((x, i) => {
        let onClick = (e: any) => {
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
  }

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
