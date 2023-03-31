import React from "react";
import { DiscordContext } from "context/discord";
import { FetchDiscord } from "js/connection";
import { FormModal, IOuterModal } from "components/Modal";
import PlayingInfo from "components/discord/PlayingInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faStop,
  faPause,
  faForward,
} from "@fortawesome/free-solid-svg-icons";
import { IAudioChannel } from "js/discord/types";

function getOptionsVoiceChannel(list?: Array<IAudioChannel>) {
  var options = [];
  options.push(
    <option key={-1} value="">
      Disconnected
    </option>
  );
  if (list == undefined) return options;
  for (let i = 0; i < list.length; i++) {
    options.push(
      <option key={i} value={list[i].id}>
        {list[i].name}
      </option>
    );
  }
  return options;
}

function VoiceState(props: any) {
  const { ctx, changeCtx } = React.useContext(DiscordContext);

  const ddlVoiceChannelRef = React.createRef<HTMLSelectElement>();
  var txtYTUrlRef = React.createRef<HTMLInputElement>();

  var ddlVoiceChannelValue = ctx.channels.voice.connected
    ? ctx.channels.voice.connected.id
    : "";
  var musicTitle = "";
  var musicUrl = "";

  const optionsVoiceChannel = getOptionsVoiceChannel(ctx.channels.voice.list);

  const onChangeVoiceChannel = (e: any) => {
    if (!ddlVoiceChannelRef.current || !ctx.guild.current) return;
    let channel = ddlVoiceChannelRef.current.value;
    ddlVoiceChannelRef.current.disabled = true;
    FetchDiscord(
      "/discord/enter-voice-channel",
      { body: { guildId: ctx.guild.current.id, channelId: channel } },
      (r: any) => {
        if (ddlVoiceChannelRef.current)
          ddlVoiceChannelRef.current.disabled = false;
        if (r.alert == "success") {
          props.reloadConfig();
        }
      }
    );
  };
  const onAddMusic = (e: any) => {
    if (!txtYTUrlRef.current) return;
    txtYTUrlRef.current.classList.remove("is-invalid");
    txtYTUrlRef.current.value = "";
    if (modalAddMusicOuter.getModal) modalAddMusicOuter.getModal().show();
  };
  const validateAddMusic = () => {
    if (!txtYTUrlRef.current) return false;
    if (txtYTUrlRef.current.value.length == 0) {
      txtYTUrlRef.current.classList.add("is-invalid");
      return false;
    }
    return true;
  };
  const onAddMusicSave = () => {
    if (!txtYTUrlRef.current) return;
    //https://www.youtube.com/watch?v=7Gg9iQHfV5A
    FetchDiscord(
      "/discord/play-music",
      { body: { url: txtYTUrlRef.current.value } },
      (r: any) => {
        if (modalAddMusicOuter.getModal) modalAddMusicOuter.getModal().hide();
      }
    );
  };
  const onPlayMusic = (e: any) => {
    FetchDiscord("/discord/music-resume", null, (r: any) => {
      console.log(r);
      changeCtx({ music: { playing: true } });
    });
  };
  const onPauseMusic = (e: any) => {
    FetchDiscord("/discord/music-pause", null, (r: any) => {
      console.log(r);
      changeCtx({ music: { playing: false } });
    });
  };
  const onSkipMusic = (e: any) => {
    FetchDiscord("/discord/music-skip", null, (r: any) => {
      console.log(r);
      changeCtx({ music: { playing: false } });
    });
  };
  const onStopMusic = (e: any) => {
    FetchDiscord("/discord/music-stop", null, (r: any) => {
      console.log(r);
      changeCtx({ music: { playing: false } });
    });
  };

  var modalAddMusicOuter = {} as IOuterModal;
  var modalAddMusic = FormModal(
    <div className="form-floating">
      <input className="form-control" placeholder=" " ref={txtYTUrlRef} />
      <div className="invalid-feedback">Informe um LINK do YouTube</div>
      <label>YouTube URL</label>
    </div>,
    "Add Music",
    { formValidation: validateAddMusic, onSave: onAddMusicSave },
    modalAddMusicOuter
  );

  let playAux = "";
  if (ctx.play && ctx.play.current && ctx.play.current.isTTS) playAux = "TTS";

  let playingInfo = null;
  let isPlaying = false;
  let isPaused = false;
  if (
    ctx.play &&
    ctx.play.current &&
    ctx.play.current.audioInfo &&
    (ctx.play.current.isPlaying || ctx.play.current.wasPaused)
  ) {
    playingInfo = <PlayingInfo info={ctx.play.current.audioInfo}></PlayingInfo>;
    isPlaying = ctx.play.current.isPlaying;
    isPaused = ctx.play.current.wasPaused;
  }

  return (
    <div className="card">
      <div className="card-header">
        Play Status - {ctx.playState} {playAux}
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-12">
            <div className="input-group mb-3">
              <span className="input-group-text">Connected at</span>
              <select
                className="form-select"
                ref={ddlVoiceChannelRef}
                onChange={onChangeVoiceChannel}
                value={ddlVoiceChannelValue}
              >
                {optionsVoiceChannel}
              </select>
            </div>
          </div>
          <div className="ccol-12">{playingInfo}</div>
        </div>
      </div>
      <div className="card-footer">
        <div
          className="btn-toolbar justify-content-between"
          role="toolbar"
          aria-label="Toolbar with button to interact with music"
        >
          <div
            className="btn-group me-2"
            role="group"
            aria-label="Play/Pause/Stop"
          >
            <button
              type="button"
              className={`btn btn-${isPlaying ? "outline-" : ""}secondary`}
              onClick={onPlayMusic}
              disabled={isPlaying}
            >
              <FontAwesomeIcon icon={faPlay} />
            </button>
            <button
              type="button"
              className={`btn btn-${isPaused ? "outline-" : ""}secondary`}
              onClick={onPauseMusic}
              disabled={isPaused}
            >
              <FontAwesomeIcon icon={faPause} />
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onSkipMusic}
            >
              <FontAwesomeIcon icon={faForward} />
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onStopMusic}
            >
              <FontAwesomeIcon icon={faStop} />
            </button>
          </div>

          <div
            className="btn-group me-2"
            role="group"
            aria-label="Add Music/Playlist"
          >
            <button
              type="button"
              className="btn btn-primary"
              onClick={onAddMusic}
            >
              Add Music To Queue
            </button>
          </div>
        </div>
      </div>
      {modalAddMusic}
    </div>
  );
}

export default VoiceState;
