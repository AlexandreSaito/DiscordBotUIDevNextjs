export default function onInit(changeState: Function, data: any) {
  let current = {
    lastLoadedTime: Date.now(),
    ttsLanguage: data.ttsLanguage,
    volume: data.volume,
    channels: {
      voice: {
        connected: data.voiceChannel.current,
        list: data.voiceChannel.list,
      },
      text: {
        list: data.textChannels.list,
        currentMusic: data.textChannels.music,
        currentText: data.textChannels.text,
      },
    },
    playState: data.audioState,
    play: {
      current: data.lastResource,
    },
    audioTimeout: data.audioTimeout,
    audioQueue: data.audioQueue,
  };
  changeState(current);
}
