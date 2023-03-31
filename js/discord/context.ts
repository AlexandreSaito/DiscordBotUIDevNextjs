import DiscordTypes from "./types";
import DiscordAudioTypes from "./audio";

interface IAudioCtx {
  list?: Array<DiscordAudioTypes.IAudio>;
}
interface IChannelCtx {
  text: IChannelTextCtx;
  voice: IChannelAudioCtx;
}
interface IChannelTextCtx {
  currentMusic?: string;
  currentText?: string;
  list?: Array<DiscordTypes.ITextChannel>;
}
interface IChannelAudioCtx {
  connected?: string;
  list?: Array<DiscordTypes.IAudioChannel>;
  channels: IChannelCtx;
}

interface ICommandCtx {
  commands?: Array<DiscordTypes.ICommand>;
  default?: any;
  rules?: Array<DiscordTypes.ICommandRules>;
}

interface IGuildCtx {
  current?: DiscordTypes.IGuild;
  list?: DiscordTypes.IGuild;
}

interface IContext {
  audio: IAudioCtx;
  botName: string;
  channels: IChannelCtx;
  command: ICommandCtx;
  customMessages: any;
  guild: IGuildCtx;
  initialLoad: number;
  lastConnectionTime: string;
  lastLoadedTime: number;
  listPlaylist: DiscordTypes.IPlaylistSimple;
  on: boolean;
  play: IPlayCtx;
  playState: EnumPlayState;
  ttsLanguage: string;
  ttsLanguages: any;
  volume: IVolumeCtx;
}

export interface IDiscordContext {
  ctx: IContext;
  changeCtx: Function;
}
