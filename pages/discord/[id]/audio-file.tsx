import React from "react";
import { NextPageWithLayout } from "pages/_app";
import Layout from "./layout";
import { DiscordContext } from "context/discord";
import { FetchDiscord } from "js/connection";
import { changeState } from "js/objectHandler";
import { FormModal, IOuterModal } from "components/Modal";
import AudioFileItem from "components/discord/AudioFileItem";
import { showToast } from "components/Toast";

const Page: NextPageWithLayout = (a: any) => {
  const { ctx, changeCtx } = React.useContext(DiscordContext);
  const [state, setState] = React.useState({ loaded: false, selected: 0 });

  const fileRef = React.createRef<HTMLInputElement>();
  const audioTitleRef = React.createRef<HTMLInputElement>();

  const getAudioList = () => {
      FetchDiscord("/discord/audio-list", null, (r: any) => {
        console.log(r);
        changeCtx({ audio: { list: r } });
        changeState(setState, state, { loaded: true });
      });
  };

  React.useEffect(() => {
    if (!state.loaded) {
      getAudioList();
    }
  });

  const changeSelected = (val: number) => {
    changeState(setState, state, { selected: val });
  };

  const onAddAudio = (e: any) => {
    if (mdlOuter.getModal) mdlOuter.getModal().show();
    audioTitleRef.current.value = "";
    fileRef.current.value = "";
  };
  const validadeAddAudio = () => {
    if (
      !fileRef.current ||
      !fileRef.current.files ||
      fileRef.current.files.length == 0
    ) {
      return false;
    }
    if (!audioTitleRef.current) {
      return false;
    }
    audioTitleRef.current.classList.remove("is-invalid");
    
    let audio = ctx.audio.list.find(x => x.title.trim() == audioTitleRef.current.value.trim());
    if(audioTitleRef.current.value == "" || audio != null || audio != undefined){
      audioTitleRef.current.classList.add("is-invalid");
      return false;
    }
    
    return true;
  };
  const onSaveAddAudio = () => {
    if (!fileRef.current || !fileRef.current.files) return;
    var data = new FormData();
    for (const file of fileRef.current.files) {
      data.append("audioFile", file, file.name);
    }
    data.append("title", audioTitleRef.current.value);
    data.append("user", JSON.stringify(ctx.logedAs));
    for (const value of data.values()) {
      console.log(value);
    }
    FetchDiscord(
      "/discord/audio-add",
      { isFormData: true, body: data },
      (r: any) => {
        showToast({ title: "ADD AUDIO", message: r.message, alert: r.alert});
        if(r.alert == "success"){
          if (mdlOuter.getModal) mdlOuter.getModal().hide();
          getAudioList();
        }
      }
    );
  };

  const mdlOuter = {} as IOuterModal;
  const mdlAddAudio = FormModal(
    <div className="row">
      <div className="col-12">
        <div className="form-floating mb-3">
          <input
            className="form-control"
            placeholder="   "
            maxLength={25}
            ref={audioTitleRef}
          />
          <div className="invalid-feedback">Title is required and has to be unique</div>
          <label>Audio Title</label>
        </div>
      </div>
      <div className="col-12">
        <div className="mb-3">
          <label className="form-label">Default file input example</label>
          <input className="form-control" type="file" ref={fileRef} />
        </div>
      </div>
    </div>,
    "Create Playlist",
    { formValidation: validadeAddAudio, onSave: onSaveAddAudio },
    mdlOuter
  );

  let listaAudioElement: Array<any> = [];
  if (ctx.audio && ctx.audio.list) {
    listaAudioElement = ctx.audio.list.map((x, i) => {
      let elClass = `list-group-item list-group-item-action ${
        x.id == state.selected ? "active" : ""
      }`;
      const onClick = (e: any) => {
        changeSelected(x.id);
      };
      return (
        <button type="button" key={i} className={elClass} onClick={onClick}>
          {x.id.toString().padStart(2, '0')} - {x.title}
        </button>
      );
    });
  }

  let currentAudio = null;
  if (ctx.audio && ctx.audio.list) {
    currentAudio = (<AudioFileItem audioFile={ctx.audio.list.find((x) => x.id == state.selected)} getAudioList={getAudioList} ></AudioFileItem>);
  }

  return (
    <>
      <div className="row">
        <div className="col-12 mb-2">
          <button className="btn btn-primary" onClick={onAddAudio}>
            Add Audio
          </button>
        </div>
        <div className="col-4">
          <div className="list-group scrollable">{listaAudioElement}</div>
        </div>
        <div className="col-8">{currentAudio}</div>
        {mdlAddAudio}
      </div>
    </>
  );
};

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
