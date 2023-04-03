import React from "react";
import { FetchDiscord } from "js/connection";

export default function TableUser(props: any) {
  const [state, setState] = React.useState({ list: null });

  React.useEffect(() => {
    if (!state.list) {
      FetchDiscord(
        "/discord/get-user-list",
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
          <tr key={i}>
            <th scope="row" style={{ width: "80px" }}>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => {
                  props.onSelectUser(x);
                }}
              >
                Select
              </button>
            </th>
            <td>
              {x.name} {x.tag}
            </td>
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
