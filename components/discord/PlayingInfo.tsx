import Image from "next/image";

export default function PlayingInfo(props: any) {
  const info = props.info;
  const origin = props.origin;

  let minutes = Math.floor(info.duration / 60)
    .toString()
    .padStart(2, "0");
  let seconds = (info.duration % 60).toString().padStart(2, "0");
  let duration = `${minutes}:${seconds}`;

  let videoName = info.title;
  let playlistInfoEl = null;

  let thumbnailUrl = info.thumbnail ? info.thumbnail.url : "";

  if (origin && origin.fromPlaylist) {
    videoName = `${info.id.toString().padStart(2, "0")} - ${videoName}`;
    thumbnailUrl = info.thumbnailUrl;
    playlistInfoEl = (
      <p className="card-text">
        Playlist Name: <b>{origin.playlistName}</b>
      </p>
    );
  }

  if (origin && origin.fromAudioFile) {
    videoName = `${info.id.toString().padStart(3, "0")} - ${videoName}`;
    thumbnailUrl = "";
    playlistInfoEl = null;
  }

  return (
    <div className="row">
      <div className="col-8">
        <h5 className="card-title">{videoName}</h5>
        <h6 className="card-subtitle mb-0 text-muted">
          <a target="_blank" href={info.url} rel="noreferrer">
            {info.url}
          </a>
        </h6>
        <p className="card-text">Duration: {duration}</p>
        {playlistInfoEl}
      </div>
      <div className="col-4">
        <img
          src={thumbnailUrl}
          alt="Music thumbnail"
          className="float-end"
          width={info.thumbnail ? info.thumbnail.width : 180}
          height={info.thumbnail ? info.thumbnail.height : 80}
        />
      </div>
    </div>
  );
}
