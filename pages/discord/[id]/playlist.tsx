import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "pages/_app";
import Layout from "./layout";
import { DiscordContext } from "context/discord";
import { changeState } from "js/objectHandler";
import { FetchDiscord } from "js/connection";
import PlaylistItem from "components/discord/PlaylistItem";
import { FormModal, IOuterModal } from "components/Modal";
import { showToast } from "components/Toast";
import { PlaylistForm } from "components/discord/PlaylistForm";
import { IPlaylistSimple } from "js/discord/audio";

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

function makeListPlaylist(
  list: null | undefined | Array<IPlaylistSimple>,
  onSelectPlaylist: (id: number) => void,
  selected: number
) {
  let el = [];

  if (!list) return null;
  for (let i = 0; i < list.length; i++) {
    let item = list[i];
    let elClass = `list-group-item list-group-item-action ${
      item.id == selected ? "active" : ""
    }`;
    let onClick = (e: any) => {
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

const Page: NextPageWithLayout = () => {
  const { ctx, changeCtx } = React.useContext(DiscordContext);
  const [playlistState, setPlaylistState] = React.useState(playlistFormDefault);

  const [state, setState] = React.useState({
    firstLoad: true,
    selected: 0,
    listPlaylist: ctx.listPlaylist,
  });

  const txtPlaylistNameRef = React.createRef<HTMLInputElement>();

  const getListPlaylist = (removeCurrent?: boolean) => {
    if (removeCurrent) changeState(setState, state, { selected: 0 });
    FetchDiscord("/discord/playlist-list", null, (r: any) => {
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

  const onSelectPlaylist = (id: number) => {
    changeState(setState, state, { selected: id });
  };

  const onCreatePlaylistClick = () => {
    if (!txtPlaylistNameRef.current || !modalOuter.getModal) return;
    changeState(
      setPlaylistState,
      playlistState,
      Object.assign({}, playlistFormDefault)
    );
    txtPlaylistNameRef.current.classList.remove("is-invalid");
    modalOuter.getModal().show();
  };

  const validatePlaylist = () => {
    if (!txtPlaylistNameRef.current) return false;
    txtPlaylistNameRef.current.classList.remove("is-invalid");
    if (!playlistState.name || playlistState.name.length == 0) {
      txtPlaylistNameRef.current.classList.add("is-invalid");
      return false;
    }
    return true;
  };

  const onSavePlaylist = () => {
    if (!modalOuter.getModal) return;
    modalOuter.getModal().hide();
    FetchDiscord(
      "/discord/add-playlist",
      {
        body: {
          playlistName: playlistState.name,
          permissions: playlistState.globalPermissions,
          playLoop: playlistState.inLoop,
          playMode: playlistState.defaultReproduction,
          user: ctx.logedAs,
        },
      },
      (r: any) => {
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
    onChangeAdd: (ref: any) => {
      changeState(setPlaylistState, playlistState, {
        globalPermissions: { canAdd: ref.current.checked },
      });
    },
    onChangeRemoveMusic: (ref: any) => {
      changeState(setPlaylistState, playlistState, {
        globalPermissions: { canRemoveMusic: ref.current.checked },
      });
    },
    onChangeDelete: (ref: any) => {
      changeState(setPlaylistState, playlistState, {
        globalPermissions: { canDelete: ref.current.checked },
      });
    },
    onChangeLoop: (ref: any) => {
      changeState(setPlaylistState, playlistState, {
        inLoop: ref.current.checked,
      });
    },
    onChangeRep: (ref: any) => {
      changeState(setPlaylistState, playlistState, {
        defaultReproduction: ref.current.value,
      });
    },
    onChangeName: (ref: any) => {
      changeState(setPlaylistState, playlistState, {
        name: ref.current.value,
      });
    },
  };

  const playlistElement =
    state.selected && state.selected > 0 && state.listPlaylist ? (
      <PlaylistItem
        reloadList={getListPlaylist}
        playlist={state.listPlaylist.find((x) => x.id == state.selected)}
      ></PlaylistItem>
    ) : null;

  const modalOuter = {} as IOuterModal;
  const modalCreatePlaylist = FormModal(
    <>
      <div className="form-floating mb-3">
        <input
          className="form-control"
          placeholder="   "
          maxLength={25}
          ref={txtPlaylistNameRef}
          onChange={(e: any) => {
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
