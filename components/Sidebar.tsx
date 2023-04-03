import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faXmark,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

type Index = {
  i: number;
};

function faIconOnList(icon: IconDefinition) {
  return (
    <span className="fa-li">
      <FontAwesomeIcon icon={icon} listItem />
    </span>
  );
}

function menuItem(index: Index, title: string, ref: any) {
  index.i++;
  return (
    <li key={index.i} id="menu-item-{index}">
      {faIconOnList(faEnvelope)}
      <Link href={ref}>{title}</Link>
    </li>
  );
}

class Sidebar extends React.Component {
  menuItens: Array<any>;

  constructor(props: any) {
    super(props);
    console.log("sidebar props", props);
    this.menuItens = [];
    var index = { i: 0 };
    this.menuItens.push(menuItem(index, "Home", "/"));
    this.menuItens.push(menuItem(index, "POST", "/post"));
    this.menuItens.push(menuItem(index, "To Do", "/todo"));
    this.menuItens.push(menuItem(index, "Discord", "/discord/logIn"));
    this.menuItens.push(menuItem(index, "Discord", "/discord/1"));
  }

  toggleSidebar() {
    var sidemenu = document.getElementById("main-sidemenu");
    if (sidemenu != null) sidemenu.classList.toggle("show");
  }

  render() {
    return (
      <aside id="main-sidemenu">
        <div className="side-menu">
          <div className="side-menu-header">
            <div>Some user info?</div>
            <a
              className="close"
              onClick={() => {
                this.toggleSidebar();
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </a>
          </div>
          <div className="side-menu-content">
            <ul
              className="fa-ul"
              style={{ "--fa-li-width": "0.9em" } as React.CSSProperties}
            >
              {this.menuItens}
            </ul>
          </div>
        </div>
      </aside>
    );
  }
}

export default Sidebar;
