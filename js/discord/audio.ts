import { IDiscordUser } from "./types";

interface BasicAudioInfo {
  id: number;
  title: string;
  addedBy: IDiscordUser;
  addedDate: string;
  duration: number;
  fileName: string;
}

export interface IAudio extends BasicAudioInfo {
  customVolume: number;
  useDefaultVolume: boolean;
}

export interface IMusic extends BasicAudioInfo {
  index: number;
  youtubeUrl: string;
}
