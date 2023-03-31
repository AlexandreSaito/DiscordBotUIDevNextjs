import React from "react";

function optionsDdlReproductionType() {
  let lst = [];
  lst.push(
    <option key="1" value="added">
      Added Time
    </option>
  );
  lst.push(
    <option key="2" value="random">
      Random
    </option>
  );
  lst.push(
    <option key="3" value="order">
      Order
    </option>
  );
  return lst;
}

export function PlaylistForm(state: any, events: any) {
  let permissions = state.globalPermissions;

  let canAddRef = React.createRef<HTMLInputElement>();
  let canRemoveRef = React.createRef<HTMLInputElement>();
  let canDeleteRef = React.createRef<HTMLInputElement>();
  let inLoopRef = React.createRef<HTMLInputElement>();
  let RepRef = React.createRef<HTMLSelectElement>();

  return (
    <div className="row">
      <div className="col-12">
        <div className="form-floating mb-3">
          <div className="form-control" style={{ height: "auto" }}>
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="checkbox"
                  ref={canAddRef}
                  onChange={(e) => {
                    events.onChangeAdd(canAddRef);
                  }}
                  checked={permissions.canAdd}
                />
                Add Music
              </label>
            </div>
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="checkbox"
                  ref={canRemoveRef}
                  onChange={(e) => {
                    events.onChangeRemoveMusic(canRemoveRef);
                  }}
                  checked={permissions.canRemoveMusic}
                />
                Remove Music
              </label>
            </div>
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="checkbox"
                  ref={canDeleteRef}
                  onChange={(e) => {
                    events.onChangeDelete(canDeleteRef);
                  }}
                  checked={permissions.canDelete}
                />
                Delete Playlist
              </label>
            </div>
          </div>
          <label>Everyone Can: </label>
        </div>
      </div>
      <div className="col-8">
        <div className="form-floating mb-3">
          <select
            className="form-select"
            ref={RepRef}
            onChange={(e) => {
              events.onChangeRep(RepRef);
            }}
            value={state.defaultReproduction}
          >
            {optionsDdlReproductionType()}
          </select>
          <label>Default Play Mode</label>
        </div>
      </div>
      <div className="col-4">
        <div className="form-check form-check-inline">
          <label className="form-check-label">
            <input
              className="form-check-input"
              type="checkbox"
              ref={inLoopRef}
              onChange={(e) => {
                events.onChangeLoop(inLoopRef);
              }}
              checked={state.inLoop}
            />
            Play in loop
          </label>
        </div>
      </div>
    </div>
  );
}
