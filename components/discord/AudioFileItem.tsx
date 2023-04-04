import React from "react";
import { changeState } from "js/objectHandler";
import { FetchDiscord } from "js/connection";
import { showToast } from "components/Toast";

function AudioFileItem(props: any) {
  const audioFile = props.audioFile;

  const [state, setState] = React.useState({});

  const customVolumeRef = React.createRef<HTMLInputElement>();
  const useCustomVolumeRef = React.createRef<HTMLInputElement>();

  React.useEffect(() => {
    if (!customVolumeRef.current || !useCustomVolumeRef.current) return;
    if (state.lastId != audioFile.id) {
      changeState(setState, state, {
        lastId: audioFile.id,
        customVolume: audioFile.customVolume,
        useCustomVolume: !audioFile.useDefaultVolume,
      });
    }
    //customVolumeRef.current.value = audioFile.customVolume;
    //useCustomVolumeRef.current.checked = !audioFile.useDefaultVolume;
    customVolumeRef.current.disabled = !state.useCustomVolume;
    console.log(state);
  });

  const onChangeUseCustomVolume = () => {
    if (!useCustomVolumeRef.current) return;
    //customVolumeRef.current.disabled = !useCustomVolumeRef.current.checked;
    changeState(setState, state, {
      useCustomVolume: useCustomVolumeRef.current.checked,
    });
  };

  const onChangeCustomVolume = () => {
    if (!useCustomVolumeRef.current) return;
    changeState(setState, state, {
      customVolume: customVolumeRef.current.value,
    });
  };

  const onSave = () => {
    FetchDiscord(
      "/discord/audio-edit",
      {
        body: {
          id: audioFile.id,
          customVolume: state.customVolume,
          useDefaultVolume: !state.useCustomVolume,
        },
      },
      (r) => {
        console.log(r);
        showToast({ alert: r.alert, title: "EDIT AUDIO", message: r.message });
        if (r.alert == "success") {
          props.getAudioList();
        }
      }
    );
  };

  if (!audioFile) return <> </>;

  return (
    <div className="card">
      <h4 className="card-header">
        {audioFile.id.toString().padStart(2, "0")} - {audioFile.title}
      </h4>
      <div className="card-body">
        <div className="row">
          <div className="col-4">
            <div className="form-check form-switch">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="checkbox"
                  ref={useCustomVolumeRef}
                  onChange={onChangeUseCustomVolume}
                  checked={state.useCustomVolume}
                />
                Use Custom Volume
              </label>
            </div>
          </div>
          <div className="col-4 mb-2">
            <label className="form-label">
              Custom Volume ({state.customVolume})
            </label>
            <input
              type="range"
              className="form-range"
              min="1"
              max="100"
              ref={customVolumeRef}
              onChange={onChangeCustomVolume}
              value={state.customVolume}
            />
          </div>
        </div>
      </div>
      <div className="card-footer">
        <button className="btn btn-success float-end" onClick={onSave}>
          Save
        </button>
      </div>
    </div>
  );
}

export default AudioFileItem;
