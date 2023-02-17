import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Trans } from 'react-i18next';

class Sidebar extends Component {

  state = {};

  toggleMenuState(menuState) {
    if (this.state[menuState]) {
      this.setState({ [menuState]: false });
    } else if (Object.keys(this.state).length === 0) {
      this.setState({ [menuState]: true });
    } else {
      Object.keys(this.state).forEach(i => {
        this.setState({ [i]: false });
      });
      this.setState({ [menuState]: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    document.querySelector('#sidebar').classList.remove('active');
    Object.keys(this.state).forEach(i => {
      this.setState({ [i]: false });
    });

    const dropdownPaths = [
      { path: '/apps', state: 'appsMenuOpen' },
      { path: '/basic-ui', state: 'basicUiMenuOpen' },
      { path: '/advanced-ui', state: 'advancedUiMenuOpen' },
      { path: '/form-elements', state: 'formElementsMenuOpen' },
      { path: '/tables', state: 'tablesMenuOpen' },
      { path: '/maps', state: 'mapsMenuOpen' },
      { path: '/icons', state: 'iconsMenuOpen' },
      { path: '/charts', state: 'chartsMenuOpen' },
      { path: '/user-pages', state: 'userPagesMenuOpen' },
      { path: '/error-pages', state: 'errorPagesMenuOpen' },
      { path: '/general-pages', state: 'generalPagesMenuOpen' },
      { path: '/ecommerce', state: 'ecommercePagesMenuOpen' },
    ];

    dropdownPaths.forEach((obj => {
      if (this.isPathActive(obj.path)) {
        this.setState({ [obj.state]: true })
      }
    }));

  }

  render() {
    return (
      <React.Fragment>
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
          <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
            <Link className="navbar-brand brand-logo" to="/members"><img src={require('../../assets/images/small-navbar.png')} alt="logo" /></Link>
            <Link className="navbar-brand brand-logo-mini" to="/members"><img src={require('../../assets/images/small.png')} alt="logo" /></Link>
          </div>
          
          <ul className="nav">
            {/* <li className={this.isPathActive('/home') ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to="/home">
                <img src={require('../../assets/images/icon/home-black.svg')} className="menu-icon icon-black" alt="home-black-icon" />
                <img src={require('../../assets/images/icon/home-white.svg')} className="menu-icon icon-white" alt="home-white-icon" />
                <span className="menu-title"><Trans>Home</Trans></span>
              </Link>
            </li> */}
            <li className={this.isPathActive('/members') ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to="/members">
                <img src={require('../../assets/images/icon/user-black.svg')} className="menu-icon icon-black" alt="user-black-icon" />
                <img src={require('../../assets/images/icon/user-white.svg')} className="menu-icon icon-white" alt="user-white-icon" />
                <span className="menu-title"><Trans>Members</Trans></span>
              </Link>
            </li>
            <li className={this.isPathActive('/benefits') ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to="/benefits">
                <img src={require('../../assets/images/icon/benifit-black.svg')} className="menu-icon icon-black" alt="benifit-black-icon" />
                <img src={require('../../assets/images/icon/benifit-white.svg')} className="menu-icon icon-white" alt="benifit-white-icon" />
                <span className="menu-title"><Trans>Benefit</Trans></span>
              </Link>
            </li>
            <li className={this.isPathActive('/post') ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to="/post">
                <img src={require('../../assets/images/icon/post-black.svg')} className="menu-icon icon-black" alt="post-black-icon" />
                <img src={require('../../assets/images/icon/post-white.svg')} className="menu-icon icon-white" alt="post-white-icon" />
                <span className="menu-title"><Trans>Post</Trans></span>
              </Link>
            </li>
            <li className={this.isPathActive('/events') ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to="/events">
                <img src={require('../../assets/images/icon/calnder-black.svg')} className="menu-icon icon-black" alt="calnder-black-icon" />
                <img src={require('../../assets/images/icon/calnder-white.svg')} className="menu-icon icon-white" alt="calnder-white-icon" />
                <span className="menu-title"><Trans>Upcoming Events</Trans></span>
              </Link>
            </li>
            <li className={this.isPathActive('/qa') ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to="/qa">
                <img src={require('../../assets/images/icon/qa-black.svg')} className="menu-icon icon-black" alt="qa-black-icon" />
                <img src={require('../../assets/images/icon/qa-white.svg')} className="menu-icon icon-white" alt="qa-white-icon" />
                <span className="menu-title"><Trans>Q&A</Trans></span>
              </Link>
            </li>
            <div className="dropdown-divider"></div>
            <li className={this.isPathActive('/settings') ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to="/settings">
                <img src={require('../../assets/images/icon/setting-black.svg')} className="menu-icon icon-black" alt="setting-black-icon" />
                <img src={require('../../assets/images/icon/setting-black.svg')} className="menu-icon icon-white" alt="setting-white-icon" />
                <span className="menu-title"><Trans>Settings</Trans></span>
              </Link>
            </li>
          </ul>
        </nav>
      </React.Fragment>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }

  componentDidMount() {
    this.onRouteChanged();
    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector('body');
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {

      el.addEventListener('mouseover', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }

}

export default withRouter(Sidebar);