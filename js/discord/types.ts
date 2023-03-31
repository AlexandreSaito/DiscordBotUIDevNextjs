interface DefaultDiscordObject {
  id: string;
  name: string;
}

export interface IGuild extends DefaultDiscordObject {}

interface IChannel extends DefaultDiscordObject {}

export interface ITextChannel extends IChannel {}

export interface IAudioChannel extends IChannel {}

export interface IDiscordUser {
  discordId: string;
  discordUserName: string;
  web: boolean;
}
