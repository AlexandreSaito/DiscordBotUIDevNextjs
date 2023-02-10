import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "/pages/_app";
import Layout from "./layout";
import { DiscordContext } from "/context/discord";
import { changeState } from "/js/objectHandler";
import { FetchDiscord } from "/js/connection";

function makeTTSLanguageOptions(languages) {
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

const Page: NextPageWithLayout = (a) => {
  const { ctx, changeCtx } = React.useContext(DiscordContext);
  const [state, setState] = React.useState({
    tts: ctx.volume.tts,
    music: ctx.volume.music,
    ttsLanguage: ctx.ttsLanguage,
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
      FetchDiscord("/discord/list-tts-language", null, (r) => {
        changeCtx({ ttsLanguages: r });
      });
    }
  });

  const ttsLanguageRef = React.createRef();
  const ttsRef = React.createRef();
  const musicRef = React.createRef();

  const onChangeMusicVolume = (e) => {
    changeState(setState, state, { music: musicRef.current.value });
  };
  const onChangeTTSVolume = (e) => {
    changeState(setState, state, { tts: ttsRef.current.value });
  };
  const onChangeTTSLanguage = (e) => {
    changeState(setState, state, { ttsLanguage: ttsLanguageRef.current.value });
  };

  const onSave = (e) => {
    e.preventDefault();
    FetchDiscord(
      "/discord/update-music-config",
      {
        body: {
          ttsVolume: state.tts,
          musicVolume: state.music,
          ttsLanguage: state.ttsLanguage,
        },
      },
      (r) => {
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
      <div className="col-4 mb-2">
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
      <div className="col-4 mb-2">
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
      <div className="col-4 mb-2">
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
