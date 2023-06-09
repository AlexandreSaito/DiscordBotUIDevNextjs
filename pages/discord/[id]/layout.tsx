import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { DiscordContext } from "context/discord";
import VoiceState from "components/discord/VoiceState";
import BotState from "components/discord/BotState";
import { copyChangeObject } from "js/objectHandler";
import { FetchDiscord, setBotUrl, registerSSE } from "js/connection";
import { IContext } from "js/discord/context";
import { EnumPlayState } from "js/discord/audio";
import { getUrls } from "js/discord/url";
import { LoginContext, LoginEnum } from "context/login";
import { onMessageReceive } from "js/discord/sseEvents/onMessageReceive";

const defaultBotState: IContext = {
  initLoad: false,
  logedAs: { discordId: "", discordUserName: "", web: true },
  lastLoadedTime: 0,
  on: false,
  botName: "",
  lastConnectionTime: null,
  guild: {
    current: { id: "", name: "" },
    list: [],
  },
  channels: {
    voice: {
      connected: { id: "", name: "" },
      list: [],
    },
    text: {
      currentMusic: "",
      currentText: "",
      list: [],
    },
  },
  play: {
    current: null,
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
    audio: 1,
  },
  ttsLanguage: "pt-br",
  audio: {},
  command: {},
  customMessages: null,
  playState: EnumPlayState.Idle,
  ttsLanguages: undefined,
  audioTimeout: 0,
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
  const router = useRouter();
  const { id } = router.query;
  console.log("DISCORD LAYOUT", id);
  
  const discordId = !id || Array.isArray(id) ? 0 : parseInt(id);
  const url = getUrls()[discordId - 1];
  //console.log(discordId - 1, getUrls()[discordId - 1]);
  setBotUrl(url);
  const { getLoginFrom } = React.useContext(LoginContext);
  const login = getLoginFrom(LoginEnum.Discord);
  
  const [state, setState] = React.useState(defaultBotState);

  const changeState = React.useCallback(
    (newState: any) => {
      let object = copyChangeObject(state, newState);
      if (object == false) return;
      console.log("BOT STATE CHANGING");
      setState(object);
    },
    [state]
  );

  const loadInit = React.useCallback(() => {
    FetchDiscord("/discord/init", null, (r: any) => {
      let data = {
        botName: r.botName,
        logedAs: { discordId: login.data.discordId, discordUserName: login.data.discordName },
        lastConnectionTime: r.lastConnectionTime,
        on: r.on,
        initLoad: Date.now(),
        guild: {
          list: r.guilds,
          current: {id: login.data.discordGuild, name: login.data.discordGuildName},
        },
      };
      changeState(data);
    });
  }, [changeState, login]);

  // load bot state
  React.useEffect(() => {
    if(discordId == 0 || !login || !login.data.permissions.includes(discordId)) return;
  
    if (!state.initLoad) {
      loadInit();
      return;
    }
    
    if (!state.guild.current || state.guild.current.id == "") return;
    registerSSE(url + '/discord/teste-sse', { 
      method: "POST", 
      header: { Accept: "text/event-stream", "Referrer Policy": 'no-referrer' }, 
      body: { discordID: login.data.discordId, discordGuild: state.guild.current.id },
      onOpen: (res: any) => { console.log("New connection"); if(!res.ok) console.log("res", res); }, 
      onClose: () => { console.log("Connection closed by the server"); }, 
      onMessage: (event: any) => { onMessageReceive(changeState, event); }, 
      onError: (err: any) => { console.log("There was an error from server", err); }
    });
    
     return()=> {
    };
  }, [state, loadInit, discordId, login, url,]);
  if (!id) return <h3>Loading</h3>;

  if(!login || !login.data.permissions.includes(discordId)) {
    router.push("/discord/logIn");
    return <></>;
  };
    
  return (
    <section>
      <h1>Discord - <em>{login.data.discordName}</em></h1>
      <DiscordContext.Provider value={{ ctx: state, changeCtx: changeState }}>
        <section>
 
          <BotState></BotState>
          <VoiceState></VoiceState>         <div className="card">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs">
                {discordOptionLink("Commands", `/discord/${discordId}/commands`)}
                {discordOptionLink(
                  "Custom Messages",
                  `/discord/${discordId}/custom-messages`
                )}
                {discordOptionLink("Music Conf", `/discord/${discordId}/music-config`)}
                {discordOptionLink("Playlists", `/discord/${discordId}/playlist`)}
                {discordOptionLink("Audio Files", `/discord/${discordId}/audio-file`)}
              </ul>
            </div>
            <div className="card-body">{children}</div>
          </div>
        </section>
      </DiscordContext.Provider>
    </section>
  );
}
