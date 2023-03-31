import React from "react";
import { DiscordContext } from "context/discord";
import { FetchDiscord } from "js/connection";
import { showToast } from "components/Toast";
import { IGuild, ITextChannel } from "js/discord/types";

function getDdlGuild(
  current: null | undefined | IGuild,
  list: null | undefined | Array<IGuild>,
  ref: any
) {
  let guildList = [];

  if (list) {
    for (let i = 0; i < list.length; i++) {
      guildList.push(
        <option key={i} value={list[i].id}>
          {list[i].name}
        </option>
      );
    }
  } else if (current) {
    guildList.push(
      <option key="1" value={current.id}>
        {current.name}
      </option>
    );
  }

  let value = current == null ? "" : current.id;
  return (
    <select
      className="form-control ms-2"
      ref={ref}
      style={{ width: "150px", display: "inline-block" }}
      value={value}
      disabled
    >
      {guildList}
    </select>
  );
}

function getOptionsTextChannel(list: null | undefined | Array<ITextChannel>) {
  var options = [];
  options.push(
    <option key="-1" value="">
      None
    </option>
  );
  if (list == undefined) return options;
  for (let i = 0; i < list.length; i++)
    options.push(
      <option key={i} value={list[i].id}>
        {list[i].name}
      </option>
    );
  return options;
}

function BotState() {
  const { ctx, changeCtx } = React.useContext(DiscordContext);

  const ddlGuildRef = React.createRef();
  const ddlMusicChannelRef = React.createRef<HTMLSelectElement>();
  const ddlTextChannelRef = React.createRef<HTMLSelectElement>();

  var ddlMusicChannelValue;
  var ddlTextChannelValue;
  if (ctx.channels && ctx.channels.text) {
    ddlMusicChannelValue = ctx.channels.text.currentMusic;
    ddlTextChannelValue = ctx.channels.text.currentText;
  }

  const ddlGuild = getDdlGuild(ctx.guild.current, ctx.guild.list, ddlGuildRef);
  const optionsTextChannel = getOptionsTextChannel(ctx.channels.text.list);

  const showBotState = (e: any) => {
    e.preventDefault();
    console.log("BOT STATE ", ctx);
  };

  const onChangeDdlMusicChannel = (e: any) => {
    if (!ddlMusicChannelRef.current) return;
    let channel = ddlMusicChannelRef.current.value;
    ddlMusicChannelRef.current.disabled = true;
    FetchDiscord(
      "/discord/set-text-channel",
      { body: { type: "MUSIC_CHANNEL", channelId: channel } },
      (r: any) => {
        if (!ddlMusicChannelRef.current) return;
        ddlMusicChannelRef.current.disabled = false;
        if (r.alert == "success") {
          showToast({
            message: "Channel was changed with success",
            title: "CHANGE MUSIC CHANNEL",
            alert: "success",
          });
          changeCtx({ channels: { text: { currentMusic: channel } } });
          return;
        }
        showToast({
          message: "Channel has failed to change",
          title: "CHANGE MUSIC CHANNEL",
          alert: "danger",
        });
      }
    );
  };
  const onChangeDdlTextChannel = (e: any) => {
    if (!ddlTextChannelRef.current) return;
    let channel = ddlTextChannelRef.current.value;
    ddlTextChannelRef.current.disabled = true;
    FetchDiscord(
      "/discord/set-text-channel",
      { body: { type: "TEXT_CHANNEL", channelId: channel } },
      (r: any) => {
        if (!ddlTextChannelRef.current) return;
        ddlTextChannelRef.current.disabled = false;
        if (r.alert == "success") {
          showToast({
            message: "Channel was changed with success",
            title: "CHANGE TEXT CHANNEL",
            alert: "success",
          });
          changeCtx({ channels: { text: { currentText: channel } } });
          return;
        }
        showToast({
          message: "Channel has failed to change",
          title: "CHANGE TEXT CHANNEL",
          alert: "danger",
        });
      }
    );
  };

  return (
    <div className="card border-info">
      <div className="card-body">
        <div className="row">
          <div className="col-12 mb-3">
            BOT is <b>{ctx.on ? "ON" : "OFF"}</b> at
            <div style={{ width: "325px", display: "inline-block" }}>
              <div className="input-group input-group-sm">
                {ddlGuild}
                <div className="input-group-append">
                  <button onClick={showBotState} className="btn btn-info">
                    Show State
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="input-group mb-3">
              <label className="input-group-text">Music Channel</label>
              <select
                className="form-select"
                ref={ddlMusicChannelRef}
                onChange={onChangeDdlMusicChannel}
                value={ddlMusicChannelValue}
              >
                {optionsTextChannel}
              </select>
            </div>
            <div className="input-group mb-3">
              <label className="input-group-text">Text Channel</label>
              <select
                className="form-select"
                ref={ddlTextChannelRef}
                onChange={onChangeDdlTextChannel}
                value={ddlTextChannelValue}
              >
                {optionsTextChannel}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="card-footer text-muted">
        <small>
          Last connected time: <i>{ctx.lastConnectionTime}</i>
        </small>
      </div>
    </div>
  );
}

export default BotState;
