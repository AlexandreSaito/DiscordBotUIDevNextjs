import { IDiscordUser } from "./types";

export enum EnumPlayState {
  Idle = "idle",
  Paused = "paused",
  Searching = "searching",
  Playing = "playing",
  Downloading = "downloading",
  Buffering = "buffering",
}

interface BasicAudioInfo {
  id: number;
  title: string;
  addedBy: IDiscordUser;
  addedDate: string;
  duration: number;
  fileName: string;
  isTTS: boolean;
  audioInfo: IAudio;
  isPlaying: boolean;
  wasPaused: boolean;
  fromPlaylist: boolean;
}

export interface IAudioInfo {}

export interface IAudio extends BasicAudioInfo {
  customVolume: number;
  useDefaultVolume: boolean;
}

export interface IMusic extends BasicAudioInfo {
  index: number;
  youtubeUrl: string;
}

export interface IPlaylistSimple {
  id: number;
  name: string;
}

export interface IPlaylist extends IPlaylistSimple {}
