import React from "react";
import { NextPageWithLayout } from "/pages/_app";
import Layout from "./layout";
import { DiscordContext } from "/context/discord";
import { FetchDiscord } from "/js/connection";
import { changeState } from "/js/objectHandler";
import { FormModal } from "/components/Modal";

const Page: NextPageWithLayout = (a: any) => {
  const { ctx, changeCtx } = React.useContext(DiscordContext);
  const [state, setState] = React.useState({ loaded: false });

  const fileRef = React.createRef();
  const audioTitleRef = React.createRef();

  React.useEffect(() => {
    if (!state.loaded) {
      FetchDiscord("/discord/audio-list", null, (r) => {
        console.log(r);
        changeCtx({ audio: { list: r } });
        changeState(setState, state, { loaded: true });
      });
    }
  });

  const onAddAudio = (e) => {
    mdlOuter.getModal().show();
  };
  const validadeAddAudio = () => {};
  const onSaveAddAudio = (e) => {
    var data = new FormData();
    for (const file of fileRef.current.files) {
      data.append("audioFile", file, file.name);
    }
    data.append("title", "teste");
    for (const value of data.values()) {
      console.log(value);
    }
    FetchDiscord(
      "/discord/audio-add",
      { isFormData: true, body: data },
      (r) => {}
    );
  };

  const mdlOuter = {};

  const mdlAddAudio = FormModal(
    <div className="row">
      <div className="col-6">
        <div className="form-floating mb-3">
          <input
            className="form-control"
            placeholder="   "
            maxLength="25"
            ref={audioTitleRef}
          />
          <div className="invalid-feedback">Title is required</div>
          <label>Audio Title</label>
        </div>
      </div>
      <div className="col-6">
        <div class="mb-3">
          <label class="form-label">Default file input example</label>
          <input class="form-control" type="file" ref={fileRef} />
        </div>
      </div>
    </div>,
    "Create Playlist",
    { formValidation: validadeAddAudio, onSave: onSaveAddAudio },
    mdlOuter
  );

  return (
    <>
      <div className="row">
        <div className="col-12">
          <button className="btn btn-primary" onClick={onAddAudio}>
            Add Audio
          </button>
        </div>
        <div className="col-4">List</div>
        <div className="col-8">Selected</div>
        {mdlAddAudio}
      </div>
    </>
  );
};

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
