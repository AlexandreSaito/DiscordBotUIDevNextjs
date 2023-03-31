import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "/pages/_app";
import Layout from "./layout";
import { DiscordContext } from "/context/discord";
import { changeState } from "/js/objectHandler";
import { FetchDiscord } from "/js/connection";
import PlaylistItem from "/components/discord/PlaylistItem";
import { FormModal } from "/components/Modal";
import { showToast } from "/components/Toast";
import { PlaylistForm } from "/components/discord/PlaylistForm";

const playlistFormDefault = {
  globalPermissions: {
    canAdd: false,
    canRemoveMusic: false,
    canEdit: false,
    canDelete: false,
  },
  inLoop: false,
  defaultReproduction: "added",
  name: "",
};

function makeListPlaylist(list, onSelectPlaylist, selected) {
  let el = [];

  if (!list) return null;
  for (let i = 0; i < list.length; i++) {
    let item = list[i];
    let elClass = `list-group-item list-group-item-action ${
      item.id == selected ? "active" : ""
    }`;
    let onClick = (e) => {
      e.preventDefault();
      onSelectPlaylist(item.id);
    };
    el.push(
      <button type="button" key={item.id} className={elClass} onClick={onClick}>
        {item.name}
      </button>
    );
  }

  return el;
}

const Page: NextPageWithLayout = (a) => {
  const { ctx, changeCtx } = React.useContext(DiscordContext);
  const [playlistState, setPlaylistState] = React.useState(playlistFormDefault);

  const [state, setState] = React.useState({
    firstLoad: true,
    selected: 0,
    listPlaylist: ctx.listPlaylist,
  });

  const txtPlaylistNameRef = React.createRef();

  const getListPlaylist = (removeCurrent) => {
    if (removeCurrent) changeState(setState, state, { selected: 0 });
    FetchDiscord("/discord/playlist-list", null, (r) => {
      changeCtx({ listPlaylist: r.data });
      changeState(setState, state, {
        listPlaylist: r.data,
        firstLoad: false,
      });
    });
  };

  React.useEffect(() => {
    if (state.firstLoad) {
      getListPlaylist();
    }
  });

  const onSelectPlaylist = (id) => {
    changeState(setState, state, { selected: id });
  };

  const onCreatePlaylistClick = () => {
    changeState(
      setPlaylistState,
      playlistState,
      Object.assign({}, playlistFormDefault)
    );
    txtPlaylistNameRef.current.classList.remove("is-invalid");
    modalOuter.getModal().show();
  };

  const validatePlaylist = () => {
    txtPlaylistNameRef.current.classList.remove("is-invalid");
    if (!playlistState.name || playlistState.name.length == 0) {
      txtPlaylistNameRef.current.classList.add("is-invalid");
      return false;
    }
    return true;
  };

  const onSavePlaylist = () => {
    modalOuter.getModal().hide();
    FetchDiscord(
      "/discord/add-playlist",
      {
        body: {
          playlistName: playlistState.name,
          permissions: playlistState.globalPermissions,
          playLoop: playlistState.inLoop,
          playMode: playlistState.defaultReproduction,
        },
      },
      (r) => {
        showToast({
          message: r.message,
          title: "PLAYLIST CREATE",
          alert: r.alert,
        });
        if (r.alert == "success") getListPlaylist();
      }
    );
  };

  const globalEvents = {
    onChangeAdd: (ref) => {
      changeState(setPlaylistState, playlistState, {
        globalPermissions: { canAdd: ref.current.checked },
      });
    },
    onChangeRemoveMusic: (ref) => {
      changeState(setPlaylistState, playlistState, {
        globalPermissions: { canRemoveMusic: ref.current.checked },
      });
    },
    onChangeDelete: (ref) => {
      changeState(setPlaylistState, playlistState, {
        globalPermissions: { canDelete: ref.current.checked },
      });
    },
    onChangeLoop: (ref) => {
      changeState(setPlaylistState, playlistState, {
        inLoop: ref.current.checked,
      });
    },
    onChangeRep: (ref) => {
      changeState(setPlaylistState, playlistState, {
        defaultReproduction: ref.current.value,
      });
    },
    onChangeName: (ref) => {
      changeState(setPlaylistState, playlistState, {
        name: ref.current.value,
      });
    },
  };

  const playlistElement =
    state.selected && state.selected > 0 ? (
      <PlaylistItem
        reloadList={getListPlaylist}
        playlist={state.listPlaylist.find((x) => x.id == state.selected)}
      ></PlaylistItem>
    ) : null;

  const modalOuter = {};
  const modalCreatePlaylist = FormModal(
    <>
      <div className="form-floating mb-3">
        <input
          className="form-control"
          placeholder="   "
          maxLength="25"
          ref={txtPlaylistNameRef}
          onChange={(e) => {
            globalEvents.onChangeName(txtPlaylistNameRef);
          }}
          value={playlistState.name}
        />
        <div className="invalid-feedback">Name is required</div>
        <label>Playlist Name</label>
      </div>
      {PlaylistForm(playlistState, globalEvents)}
    </>,
    "Create Playlist",
    { formValidation: validatePlaylist, onSave: onSavePlaylist },
    modalOuter
  );

  return (
    <div className="row">
      <div className="col-12 mb-2">
        <button className="btn btn-primary" onClick={onCreatePlaylistClick}>
          Create Playlist
        </button>
      </div>
      <div className="col-4">
        <div className="list-group">
          {makeListPlaylist(
            state.listPlaylist,
            onSelectPlaylist,
            state.selected
          )}
        </div>
      </div>
      <div className="col-8">{playlistElement}</div>
      {modalCreatePlaylist}
    </div>
  );
};

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
