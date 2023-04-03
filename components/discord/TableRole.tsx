import React from "react";
import { FetchDiscord } from "js/connection";

export default function TableRole(props: any) {
  const [state, setState] = React.useState({ list: null });

  React.useEffect(() => {
    if (!state.list) {
      FetchDiscord(
        "/discord/get-role-list",
        { body: { guildId: props.guildId } },
        (r) => {
          setState({ list: r });
        }
      );
    }
  }, [state]);

  const list = !state.list
    ? null
    : state.list.map((x, i) => {
        return (
          <tr key={i} style={{ color: x.hexColor }}>
            <th scope="row" style={{ width: "80px" }}>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => {
                  props.onSelectRole(x);
                }}
              >
                Select
              </button>
            </th>
            <td>{x.name}</td>
          </tr>
        );
      });

  return (
    <table className="table table-striped table-hover table-sm">
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">Name</th>
        </tr>
      </thead>
      <tbody>{list}</tbody>
    </table>
  );
}
