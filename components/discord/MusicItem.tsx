import { confirmModal } from "components/Modal";
import { FetchDiscord } from "js/connection";
import { showToast } from "components/Toast";
import { IMusic } from "js/discord/audio";

export default function MusicItem(props: any) {
  let music: IMusic = props.music;

  let addedDate = "";
  if (music.addedDate) {
    let dateTime = music.addedDate.split("T");
    addedDate = dateTime[0].split("-").reverse().join("/");
  }
  let duration = "";
  if (music.duration) {
    duration = `${Math.floor(music.duration / 60)
      .toString()
      .padStart(2, "0")}:${(music.duration % 60).toString().padStart(2, "0")}`;
  }

  const onRemoveClick = (e: any) => {
    confirmModal(
      "Remove Music",
      `Are you sure to remove ${music.title} from playlist?`,
      onRemove
    );
  };

  const onRemove = () => {
    FetchDiscord(
      "/discord/playlist-remove-music",
      { body: { playlistId: props.playlistId, musicId: music.id } },
      (r: any) => {
        showToast({
          title: "REMOVE MUSIC",
          message: r.message,
          alert: r.alert,
        });
        if (r.alert == "success") {
          props.reloadMusic();
        }
      }
    );
  };

  return (
    <div className="list-group-item list-group-item-action">
      <div className="d-flex w-100 justify-content-between">
        <h5 className="mb-1">
          {music.id.toString().padStart(2, "0")} - {music.title}
        </h5>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={onRemoveClick}
        >
          Remove
        </button>
      </div>
      <div className="mb-0 d-flex justify-content-between">
        <div
          className="input-group input-group-sm me-2"
          style={{ width: "120px", display: "inline-flex" }}
        >
          <span className="input-group-text" id="basic-addon1">
            Ordering
          </span>
          <input
            type="number"
            className="form-control"
            value={music.index}
            readOnly
          />
        </div>
        <span className="me-2">
          Added In: <b>{addedDate}</b>
        </span>
        <span className="flex-fill">
          Added By: <b>{music.addedBy ? music.addedBy.discordUserName : ""}</b>
        </span>
      </div>
      <small>
        Duration: <b>{duration}</b>
      </small>
      <br />
      <small>
        URL:{" "}
        <a target="_blank" href={music.youtubeUrl} rel="noreferrer">
          {music.youtubeUrl}
        </a>
      </small>
    </div>
  );
}
