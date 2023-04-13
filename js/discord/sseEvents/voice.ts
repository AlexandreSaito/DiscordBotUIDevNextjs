export function onVoiceConnect(changeState: Function, data: any) {
  let current = {
    channels: {
      voice: {
        connected: {
          id: data.id,
          name: data.name,
        },
      },
    },
  };
  changeState(current);
}

export function onMusicChange(changeState: Function, data: any){
    let current = {
    play: {
      current: data.lastResource,
    },
  };
  changeState(current);
}