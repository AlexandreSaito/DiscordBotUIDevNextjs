import { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

class Header extends Component {
  constructor(props: any) {
    super(props);
  }

  toggleSidebar() {
    var sidemenu = document.getElementById("main-sidemenu");
    console.log(sidemenu);
    if(sidemenu != null)
      sidemenu.classList.toggle("show");
  }

  render() {
    return (
      <header>
        <nav className="navbar navbar-dark bg-dark fixed-top">
          <div className="container-fluid">
            <div className="navbar">
              <div className="navbar-nav">
                <a
                  className="nav-link"
                  onClick={(e) => {
                    this.toggleSidebar(e);
                  }}
                >
                  <FontAwesomeIcon icon={faBars} />
                </a>
              </div>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

export default Header;
