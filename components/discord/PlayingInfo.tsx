import Image from "next/image";

export default function PlayingInfo(props: any) {
  const info = props.info;
  return (
    <div className="row">
      <div className="col-8">
        <h5 className="card-title">{info.title}</h5>
        <h6 className="card-subtitle mb-0 text-muted">
          <a target="_blank" href={info.url} rel="noreferrer">
            {info.url}
          </a>
        </h6>
        <p className="card-text">
          Duration:{" "}
          {Math.floor(info.duration / 60)
            .toString()
            .padStart(2, "0")}
          :{(info.duration % 60).toString().padStart(2, "0")}
        </p>
      </div>
      <div className="col-4">
        <img
          src={info.thumbnail ? info.thumbnail.url : ""}
          alt="Music thumbnail"
          className="float-end"
          width={info.thumbnail ? info.thumbnail.width : 0}
          height={info.thumbnail ? info.thumbnail.height : 0}
        />
      </div>
    </div>
  );
}
