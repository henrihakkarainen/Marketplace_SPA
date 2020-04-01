import React from 'react';
import { connect } from 'react-redux'
import { setView } from '../actions/viewFilter'
import {
  VIEW_MAIN_PAGE,
  VIEW_ITEMS_ALL,
  VIEW_ITEMS_OWN,
  VIEW_ITEMS_OFFERS,
  VIEW_USERS,
  VIEW_USER_INFO
} from '../constants/action-types'
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import ShoppingBasket from '@material-ui/icons/ShoppingBasket';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import CreateIcon from '@material-ui/icons/Create';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AssessmentIcon from '@material-ui/icons/Assessment';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import Logo from "./Logo.js";
import Toolbar from '@material-ui/core/Toolbar';
import Grid from "@material-ui/core/Grid";

const mapDispatchToProps = (dispatch) => {
  return {
    setView: (filter) => dispatch(setView(filter))
  }
}

class ConnectNav extends React.Component {

  logout = () => {
    this.props.logoutClick()
    this.props.setView(VIEW_MAIN_PAGE)
    this.props.logout()
  }

  render() {
    if (this.props.role && this.props.role === 'normal') {
      return (
        <AppBar position="static" title="My App">
          <Toolbar>
            <Logo />
            <Grid container justify={"center"}>
              <Tabs value={false} centered>
                <Tab label="Main" icon={<ShoppingBasket />} onClick={() => this.props.setView(VIEW_MAIN_PAGE)} />
                <Tab label="Sell items" icon={<LoyaltyIcon />} onClick={() => this.props.setView(VIEW_ITEMS_OWN)} />
                <Tab label="Account information" icon={<PersonPinIcon />} onClick={() => this.props.setView(VIEW_USER_INFO)} />
                <Tab label="Logout" icon={<ExitToAppIcon />} onClick={this.logout} />
              </Tabs>
            </Grid>
          </Toolbar>
        </AppBar >
      )
    } else if (this.props.role && this.props.role === 'shopkeeper') {
      return (
        <AppBar position="static" title="My App">
          <Toolbar>
            <Logo />
            <Grid container justify={"center"}>
              <Tabs value={false} centered>
                <Tab label="Main" icon={<ShoppingBasket />} onClick={() => this.props.setView(VIEW_MAIN_PAGE)} />
                <Tab label="Sell items" icon={<LoyaltyIcon />} onClick={() => this.props.setView(VIEW_ITEMS_OWN)} />
                <Tab label="On sale" icon={<AssessmentIcon />} onClick={() => this.props.setView(VIEW_ITEMS_OFFERS)} />
                <Tab label="Account information" icon={<PersonPinIcon />} onClick={() => this.props.setView(VIEW_USER_INFO)} />
                <Tab label="Logout" icon={<ExitToAppIcon />} onClick={this.logout} />
              </Tabs>
            </Grid>
          </Toolbar>
        </AppBar >
      )
    } else if (this.props.role && this.props.role === 'admin') {
      return (
        <AppBar position="static" title="My App">
          <Toolbar>
            <Logo />
            <Grid container justify={"center"}>
              <Tabs value={false} centered>
                <Tab label="Main" icon={<ShoppingBasket />} onClick={() => this.props.setView(VIEW_MAIN_PAGE)} />
                <Tab label="All items" icon={<FormatListBulletedIcon />} onClick={() => this.props.setView(VIEW_ITEMS_ALL)} />
                <Tab label="Users" icon={<SupervisorAccountIcon />} onClick={() => this.props.setView(VIEW_USERS)} />
                <Tab label="Account information" icon={<PersonPinIcon />} onClick={() => this.props.setView(VIEW_USER_INFO)} />
                <Tab label="Logout" icon={<ExitToAppIcon />} onClick={this.logout} />
              </Tabs>
            </Grid>
          </Toolbar>
        </AppBar >
      )
    } else {
      return (
        <AppBar position="static" title="My App">
          <Toolbar>
            <Logo />
            <Grid container justify={"center"}>
              <Tabs value={false} centered>
                <Tab label="Main" icon={<ShoppingBasket />} onClick={() => this.props.setView(VIEW_MAIN_PAGE)} />
                <Tab label="Register" icon={<CreateIcon />} onClick={this.props.registerClick} />
                <Tab label="Login" icon={<VpnKeyIcon />} onClick={this.props.loginClick} />
              </Tabs>
            </Grid>
          </Toolbar>
        </AppBar>
      )
    }
  }
}

const Nav = connect(null, mapDispatchToProps)(ConnectNav)
export default Nav