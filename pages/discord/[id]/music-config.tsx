import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "pages/_app";
import Layout from "./layout";
import { DiscordContext } from "context/discord";
import { changeState } from "js/objectHandler";
import { FetchDiscord } from "js/connection";

function makeTTSLanguageOptions(languages: null | undefined | any) {
  let el = [];
  if (!languages) return null;
  let names = Object.getOwnPropertyNames(languages);
  for (let i = 0; i < names.length; i++) {
    let name = names[i];
    el.push(
      <option key={i} value={name}>
        {languages[name]}
      </option>
    );
  }

  return el;
}

const Page: NextPageWithLayout = () => {
  const { ctx, changeCtx } = React.useContext(DiscordContext);
  const [state, setState] = React.useState({
    tts: ctx.volume.tts,
    music: ctx.volume.music,
    audio: ctx.volume.audio,
    ttsLanguage: ctx.ttsLanguage,
    reload: false,
  });

  React.useEffect(() => {
    if (!ctx.lastLoadedTime) changeState(setState, state, { reload: true });
    if (ctx.lastLoadedTime && state.reload)
      changeState(setState, state, {
        reload: false,
        tts: ctx.volume.tts,
        music: ctx.volume.music,
        ttsLanguage: ctx.ttsLanguage,
      });
    if (!ctx.ttsLanguages) {
      FetchDiscord("/discord/list-tts-language", null, (r: any) => {
        changeCtx({ ttsLanguages: r });
      });
    }
  }, [ctx, changeCtx, state]);

  const ttsLanguageRef = React.createRef<HTMLSelectElement>();
  const ttsRef = React.createRef<HTMLInputElement>();
  const musicRef = React.createRef<HTMLInputElement>();
  const audioRef = React.createRef<HTMLInputElement>();

  const onChangeAudioVolume = (e: any) => {
    if (!audioRef.current) return;
    changeState(setState, state, { audio: audioRef.current.value });
  };
  const onChangeMusicVolume = (e: any) => {
    if (!musicRef.current) return;
    changeState(setState, state, { music: musicRef.current.value });
  };
  const onChangeTTSVolume = (e: any) => {
    if (!ttsRef.current) return;
    changeState(setState, state, { tts: ttsRef.current.value });
  };
  const onChangeTTSLanguage = (e: any) => {
    if (!ttsLanguageRef.current) return;
    changeState(setState, state, { ttsLanguage: ttsLanguageRef.current.value });
  };

  const onSave = (e: any) => {
    e.preventDefault();
    FetchDiscord(
      "/discord/update-music-config",
      {
        body: {
          ttsVolume: state.tts,
          musicVolume: state.music,
          audioVolume: state.audio,
          ttsLanguage: state.ttsLanguage,
        },
      },
      (r: any) => {
        console.log(r);
        if (r.alert == "success") {
          changeCtx({
            ttsLanguage: state.ttsLanguage,
            volume: { tts: state.tts, music: state.music },
          });
        }
      }
    );
  };

  return (
    <div className="row">
      <div className="col-3 mb-2">
        <label className="form-label">Music Volume ({state.music}) </label>
        <input
          type="range"
          className="form-range"
          min="1"
          max="100"
          ref={musicRef}
          onChange={onChangeMusicVolume}
          value={state.music}
        />
      </div>
      <div className="col-3 mb-2">
        <label className="form-label">
          Custom Audio Volume ({state.audio}){" "}
        </label>
        <input
          type="range"
          className="form-range"
          min="1"
          max="100"
          ref={audioRef}
          onChange={onChangeAudioVolume}
          value={state.audio}
        />
      </div>
      <div className="col-3 mb-2">
        <label className="form-label">TTS Volume ({state.tts}) </label>
        <input
          type="range"
          className="form-range"
          min="1"
          max="100"
          ref={ttsRef}
          onChange={onChangeTTSVolume}
          value={state.tts}
        />
      </div>
      <div className="col-3 mb-2">
        <div className="form-floating">
          <select
            className="form-select"
            ref={ttsLanguageRef}
            onChange={onChangeTTSLanguage}
            value={state.ttsLanguage}
          >
            {makeTTSLanguageOptions(ctx.ttsLanguages)}
          </select>
          <label>TTS Language</label>
        </div>
      </div>
      <div className="col-12">
        <button className="btn btn-success float-end" onClick={onSave}>
          Save
        </button>
      </div>
    </div>
  );
};

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
