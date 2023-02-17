import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './App.scss';
import AppRoutes from './AppRoutes';
import Navbar from './shared/Navbar';
import Sidebar from './shared/Sidebar';
import Footer from './shared/Footer';
import { withTranslation } from "react-i18next";
// import 'sweetalert2/src/sweetalert2.scss'


class App extends Component {
  state = {}
  componentDidMount() {
    this.onRouteChanged();
  }
  render () {
    let navbarComponent = !this.state.isFullPageLayout ? <Navbar state={this.state}/> : '';
    let sidebarComponent = !this.state.isFullPageLayout ? <Sidebar/> : '';
    let footerComponent = !this.state.isFullPageLayout ? <Footer/> : '';
    return (
      <div className="container-scroller">
        <div className="container-fluid page-body-wrapper">
          { sidebarComponent }
          <div className="main-panel">
            { navbarComponent }
            <div className="content-wrapper">
              <AppRoutes/>
            </div>
            { footerComponent }
          </div>
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    const body = document.querySelector('body');
    window.scrollTo(0, 0);
    const fullPageLayoutRoutes = ['/login'];
    const sidebarIconPageLayoutRoutes = ['/events'];
    for ( let i = 0; i < fullPageLayoutRoutes.length; i++ ) {
      if (this.props.location.pathname === fullPageLayoutRoutes[i]) {
        this.setState({
          isFullPageLayout: true
        })
        document.querySelector('.page-body-wrapper').classList.add('full-page-wrapper');
        break;
      } else {
        this.setState({
          isFullPageLayout: false
        })
        document.querySelector('.page-body-wrapper').classList.remove('full-page-wrapper');
      }
    }
    for ( let i = 0; i < sidebarIconPageLayoutRoutes.length; i++ ) {
      if (this.props.location.pathname === sidebarIconPageLayoutRoutes[i]) {
        this.setState({
          isSidebarIconPageLayout: true
        })
        document.querySelector('.page-body-wrapper').classList.add('sidebar-icon-only');
        break;
      } else {
        this.setState({
          isSidebarIconPageLayout: false
        })
        document.querySelector('.page-body-wrapper').classList.remove('sidebar-icon-only');
      }
    }
  }

}

export default withTranslation() (withRouter(App));
