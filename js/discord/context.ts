import { IGuild, ITextChannel, IAudioChannel } from "./types";
import { ICommandRule, ICommand } from "./command";
import {
  IMusic,
  IAudio,
  IPlaylistSimple,
  IPlaylist,
  EnumPlayState,
} from "./audio";

interface IAudioCtx {
  list?: Array<IAudio>;
}
interface IChannelCtx {
  text: IChannelTextCtx;
  voice: IChannelAudioCtx;
}
interface IChannelTextCtx {
  currentMusic?: string;
  currentText?: string;
  list?: Array<ITextChannel>;
}
interface IChannelAudioCtx {
  connected?: IAudioChannel;
  list?: Array<IAudioChannel>;
}

interface ICommandCtx {
  commands?: Array<ICommand>;
  default?: any;
  rules?: Array<ICommandRule>;
}

interface IGuildCtx {
  current: null | undefined | IGuild;
  list?: Array<IGuild>;
}

interface IPlayCtx {
  current: null | undefined | IMusic | IAudio;
  queue: null | undefined | Array<any>;
  currentPlaylist: any;
}

interface IVolumeCtx {
  tts: number;
  music: number;
  audio: number;
}

export interface IContext {
  initLoad: boolean;
  audio: IAudioCtx;
  botName: string;
  channels: IChannelCtx;
  command: ICommandCtx;
  customMessages: any;
  guild: IGuildCtx;
  initialLoad?: number;
  lastConnectionTime: null | undefined | string;
  lastLoadedTime: number;
  listPlaylist?: Array<IPlaylistSimple>;
  on: boolean;
  play: IPlayCtx;
  playState: EnumPlayState;
  ttsLanguage: string;
  ttsLanguages?: any;
  volume: IVolumeCtx;
}

export interface IDiscordContext {
  ctx: IContext;
  changeCtx: Function;
}
