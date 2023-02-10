import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { DiscordContext } from "/context/discord";
import VoiceState from "/components/discord/VoiceState";
import BotState from "/components/discord/BotState";
import { copyChangeObject } from "/js/objectHandler";
import { FetchDiscord } from "/js/connection";

const EmojiPicker = React.lazy(
  () =>
    import(
      /*webpackPrefetch: true,
    webpackChunkName: "emoji-picker"*/
      "./playlist"
    )
);

const defaultBotState = {
  lastLoadedTime: null,
  on: false,
  botName: "",
  lastConnectionTime: null,
  guild: {
    current: { id: "" },
    list: [],
  },
  channels: {
    voice: {
      connected: "",
      list: [],
    },
    text: {
      currentMusic: "",
      currentText: "",
      list: [],
    },
  },
  play: {
    current: {
      title: "",
      url: "",
      fromPlaylist: false,
    },
    queue: [],
    currentPlaylist: {
      name: "",
      id: 0,
      musics: [],
    },
  },
  volume: {
    music: 1,
    tts: 1,
  },
  ttsLanguage: "pt-br",
};

function discordOptionLink(title: string, link: string) {
  const active =
    typeof window !== "undefined" && window.location.pathname.startsWith(link)
      ? "active"
      : "";
  const className = `nav-link ${active}`;
  return (
    <li className="nav-item">
      <Link className={className} href={link} scroll={false}>
        {title}
      </Link>
    </li>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const reloadBotStateDelay = 10000;
  const router = useRouter();
  const { id } = router.query;
  console.log("DISCORD LAYOUT", id);
  const [state, setState] = React.useState(defaultBotState);

  const loadInit = () => {
    FetchDiscord("/discord/init", null, (r) => {
      let data = {
        botName: r.botName,
        lastConnectionTime: r.lastConnectionTime,
        on: r.on,
        initLoad: Date.now(),
        guild: {
          list: r.guilds,
          current: r.guilds[0],
        },
      };
      changeState(data);
    });
  };

  const loadBotConfig = () => {
    if (state.guild.current.id == "") return;
    /*
      GET
      Channels list; -OK
      Current Voice Channel; -OK
      Defaults Channels; -OK
      Volumes; -OK
      Current TTS Language; -OK
      Current Music;
     */
    FetchDiscord(
      "/discord/get-bot-config",
      { body: JSON.stringify({ guildId: state.guild.current.id }) },
      (r) => {
        let data = {
          lastLoadedTime: Date.now(),
          ttsLanguage: r.ttsLanguage,
          volume: r.volume,
          channels: {
            voice: {
              connected: r.voiceChannel.current,
              list: r.voiceChannel.list,
            },
            text: {
              list: r.textChannels.list,
              currentMusic: r.textChannels.music,
              currentText: r.textChannels.text,
            },
          },
          playState: r.audioState,
          play: {
            current: r.lastResource,
          },
        };
        changeState(data);
      }
    );
  };

  // load bot state
  React.useEffect(() => {
    if (!state.initLoad) {
      loadInit();
      return;
    }
    let lastLoadedTiming = Date.now() - state.lastLoadedTime;
    if (
      state.lastLoadedTime != null &&
      lastLoadedTiming <= reloadBotStateDelay
    ) {
      var timeout = setTimeout(() => {
        loadBotConfig();
      }, reloadBotStateDelay);
      return () => {
        clearTimeout(timeout);
      };
    }
    loadBotConfig();
  }, [state]);

  if (!id) return <h3>Loading</h3>;

  function changeState(newState) {
    let object = copyChangeObject(state, newState);
    if (object == false) return;
    console.log("BOT STATE CHANGING");
    setState(object);
  }

  return (
    <section>
      <h1>Discord - {state.botName}</h1>
      <DiscordContext.Provider value={{ ctx: state, changeCtx: changeState }}>
        <section>
          <BotState></BotState>
          <VoiceState reloadConfig={loadBotConfig}></VoiceState>
          <div className="card">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs">
                {discordOptionLink("Commands", `/discord/${id}/commands`)}
                {discordOptionLink(
                  "Custom Messages",
                  `/discord/${id}/custom-messages`
                )}
                {discordOptionLink("Music Conf", `/discord/${id}/music-config`)}
                {discordOptionLink("Playlists", `/discord/${id}/playlist`)}
              </ul>
            </div>
            <div className="card-body">{children}</div>
          </div>
        </section>
      </DiscordContext.Provider>
    </section>
  );
}
