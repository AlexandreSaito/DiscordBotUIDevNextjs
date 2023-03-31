import React from "react";
import { changeState } from "js/objectHandler";
import { FetchDiscord } from "js/connection";
import { PlaylistForm } from "components/discord/PlaylistForm";
import MusicItem from "components/discord/MusicItem";
import { confirmModal, FormModal, IOuterModal } from "components/Modal";
import { showToast } from "components/Toast";

function PlaylistItem(props: any) {
  const [state, setState] = React.useState(props.playlist);

  React.useEffect(() => {
    if (
      props.playlist &&
      props.playlist.id > 0 &&
      (!state || !state.loaded || state.id != props.playlist.id)
    ) {
      FetchDiscord(
        "/discord/get-playlist",
        { body: { playlistId: props.playlist.id } },
        (r: any) => {
          console.log(r);
          r.name = props.playlist.name;
          r.loaded = true;
          changeState(setState, state, r);
        }
      );
    }
  });

  if (!props.playlist || props.playlist.id == 0 || !state) return <></>;

  var txtYTUrlRef = React.createRef<HTMLInputElement>();

  const reloadMusics = () => {
    changeState(setState, state, { loaded: false });
  };

  const onDeleteClick = (e: any) => {
    confirmModal(
      "Delete Playlist",
      `Are you sure to delete <b>${state.name}</b> that has <b>${state.musics.length}</b> musics?`,
      onConfirmDelete
    );
  };
  const onConfirmDelete = () => {
    FetchDiscord(
      "/discord/delete-playlist",
      { body: { playlistId: state.id } },
      (r: any) => {
        if (r.alert == "success") {
          showToast({
            message: "Deleted with success",
            title: "PLAYLIST DELETE",
            alert: "success",
          });
          props.reloadList(true);
          return;
        }
        showToast({
          message: "Failed to delete",
          title: "PLAYLIST DELETE",
          alert: "danger",
        });
      }
    );
  };
  const onEditPlaylist = (e: any) => {
    confirmModal(
      "Edit Playlist",
      `Are you sure to edit <b>${state.name}</b>`,
      onConfirmEditPlaylist
    );
  };
  const onConfirmEditPlaylist = () => {
    FetchDiscord(
      "/discord/edit-playlist",
      {
        body: {
          playlistId: state.id,
          permissions: state.globalPermissions,
          playLoop: state.inLoop,
          playMode: state.defaultReproduction,
        },
      },
      (r: any) => {
        showToast({
          message: r.message,
          title: "PLAYLIST EDIT",
          alert: r.alert,
        });
        if (r.alert == "success") {
          return;
        }
      }
    );
  };

  const onAddMusic = (e: any) => {
    if (!txtYTUrlRef.current || !modalAddMusicOuter.getModal) return;
    txtYTUrlRef.current.classList.remove("is-invalid");
    txtYTUrlRef.current.value = "";
    modalAddMusicOuter.getModal().show();
  };
  const validateAddMusic = () => {
    if (!txtYTUrlRef.current) return false;
    if (txtYTUrlRef.current.value.length == 0) {
      txtYTUrlRef.current.classList.add("is-invalid");
      return false;
    }
    return true;
  };
  const onAddMusicSave = () => {
    if (!txtYTUrlRef.current) return;
    //https://www.youtube.com/watch?v=7Gg9iQHfV5A
    FetchDiscord(
      "/discord/playlist-add-music",
      { body: { playlistId: state.id, url: txtYTUrlRef.current.value } },
      (r: any) => {
        showToast({
          message: r.message,
          title: "PLAYLIST ADD MUSIC",
          alert: r.alert,
        });
        if (modalAddMusicOuter.getModal) modalAddMusicOuter.getModal().hide();
        if (r.alert == "success") {
          changeState(setState, state, { loaded: false });
          return;
        }
      }
    );
  };

  const globalEvents = {
    onChangeAdd: (ref: any) => {
      if (!ref.current) return;
      changeState(setState, state, {
        globalPermissions: { canAdd: ref.current.checked },
      });
    },
    onChangeRemoveMusic: (ref: any) => {
      if (!ref.current) return;
      changeState(setState, state, {
        globalPermissions: { canRemoveMusic: ref.current.checked },
      });
    },
    onChangeDelete: (ref: any) => {
      if (!ref.current) return;
      changeState(setState, state, {
        globalPermissions: { canDelete: ref.current.checked },
      });
    },
    onChangeLoop: (ref: any) => {
      if (!ref.current) return;
      changeState(setState, state, {
        inLoop: ref.current.checked,
      });
    },
    onChangeRep: (ref: any) => {
      if (!ref.current) return;
      changeState(setState, state, {
        defaultReproduction: ref.current.value,
      });
    },
  };

  var playlistGlobalForm = state.globalPermissions
    ? PlaylistForm(state, globalEvents)
    : null;

  var musicList = [];
  if (state.musics) {
    for (let i = 0; i < state.musics.length; i++)
      musicList.push(
        <MusicItem
          key={state.musics[i].id}
          music={state.musics[i]}
          playlistId={state.id}
          reloadMusic={reloadMusics}
        ></MusicItem>
      );
  }

  var modalAddMusicOuter = {} as IOuterModal;
  var modalAddMusic = FormModal(
    <div className="form-floating">
      <input className="form-control" placeholder=" " ref={txtYTUrlRef} />
      <div className="invalid-feedback">Informe um LINK do YouTube</div>
      <label>YouTube URL</label>
    </div>,
    "Add Music",
    { formValidation: validateAddMusic, onSave: onAddMusicSave },
    modalAddMusicOuter
  );

  return (
    <div className="card">
      <h4 className="card-header">
        {state.id.toString().padStart(2, "0")} - {state.name}
        <small className="float-end">{state.addedDate}</small>
      </h4>
      <div className="card-body">
        {playlistGlobalForm}
        <div className="mb-2">
          <div className="btn-group float-end">
            <button className="btn btn-danger me-1" onClick={onDeleteClick}>
              Delete Playlist
            </button>
            <button className="btn btn-success me-1" onClick={onEditPlaylist}>
              Edit Playlist
            </button>
          </div>
          <div className="btn-group">
            <button className="btn btn-primary me-1" onClick={onAddMusic}>
              Add Music
            </button>
            <button className="btn btn-secondary me-1">Order Musics</button>
          </div>
        </div>
        {musicList}
      </div>
      {modalAddMusic}
    </div>
  );
}

export default PlaylistItem;
