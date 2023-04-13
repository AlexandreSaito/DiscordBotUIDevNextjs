import onInit from "./init";
import { onVoiceConnect, onMusicChange } from "./voice";

export function onMessageReceive(changeState: Function, res: any) {
  console.log(res);
  switch (res.event) {
    case "init":
      onInit(changeState, res.data);
      break;
    case "voice-connect":
      onVoiceConnect(changeState, res.data);
      break;
    case "playing-music":
      onMusicChange(changeState, res.data);
      break;
  }
}
