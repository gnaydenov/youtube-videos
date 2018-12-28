import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import SettingsIcon from '@material-ui/icons/Settings';
import Drawer from '@material-ui/core/Drawer';
import PropTypes from 'prop-types';
import { matchPath } from 'react-router-dom';

import './Header.scss';
import Logo from '../../../public/logo.svg';
import SlideFilters from '../slide-filters/SlideFilters';

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
        drawerIsOpened: false,
        title: '',
        showSettingWheel:true
      };

      setTimeout(() => {
      this.setState({title : this.props.setTitle()});
    }, 100);
  }

    componentWillMount() {
      this.renderSettingsWheel();
    }


    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.renderSettingsWheel();
        }
    }

    renderSettingsWheel = () => {
           const showSettingWheel = !matchPath(
              this.props.location.pathname,
              '/youtube/:id'
          );
      this.setState({showSettingWheel : showSettingWheel});

  }

  toggleDrawer = () => {
    this.setState({
      drawerIsOpened: !this.state.drawerIsOpened
    });
  };


    render() {
    return (
      <div id="page-header">
        <nav>
          <div className="logo-bg">
            <Logo className="logo"/>
          </div>
          <div className="opened-module-title">
            {this.state.title}
          </div>
          {this.state.showSettingWheel &&
          <Button className="menu-toggle" onClick={this.toggleDrawer}>
              <SettingsIcon aria-label="Settings"/>
          </Button>
          }
        </nav>
        <Drawer
          anchor="right"
          open={this.state.drawerIsOpened}
          onClose={this.toggleDrawer}>
            <SlideFilters toggleDrawer={this.toggleDrawer} config={this.props.config} onChanges={this.props.onChanges}/>
        </Drawer>
      </div>
    );
  }
}

Header.propTypes = {
  setTitle: PropTypes.func,
  config: PropTypes.object,
  onChanges: PropTypes.func,
  location:PropTypes.object
};

export default Header;
