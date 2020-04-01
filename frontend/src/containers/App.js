import React from 'react';
import './App.css';
import Container from '@material-ui/core/Container'
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { connect } from 'react-redux';
import { postLogout, postLogin } from '../actions/login';
import { fetchData } from '../actions/userData';
import {
  VIEW_MAIN_PAGE,
  VIEW_ITEMS_ALL,
  VIEW_ITEMS_OWN,
  VIEW_ITEMS_OFFERS,
  VIEW_USERS,
  VIEW_USER_INFO,
  VIEW_UNREGISTER_PAGE
} from '../constants/action-types';
import Nav from '../components/Nav';
import ItemList from '../components/ItemList';
import SalesList from '../components/SalesList';
import OwnItems from '../components/OwnItems';
import OfferList from '../components/OfferList'
import UserInfo from '../components/UserInfo';
import UserList from '../components/UserList';
import Unregister from '../components/Unregister';
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';

const mapStateToProps = (state) => {
  return {
    user: state.loggedInUser,
    view: state.viewFilter
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    postLogout: () => dispatch(postLogout()),
    postLogin: (url, payload) => dispatch(postLogin(url, payload)),
    fetchData: (url, token) => dispatch(fetchData(url, token))
  }
}

class Page extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      alert: false,
      alertMsg: '',
      registerDialog: false,
      loginDialog: false,
    }
  }

  openRegisterForm = () => {
    this.setState({ registerDialog: true })
  }

  closeRegisterForm = () => {
    this.setState({ registerDialog: false })
  }

  registerOk = () => {
    this.setState({
      alert: true,
      alertMsg: 'Registration succesful, you can now log in with your credentials.',
      registerDialog: false })
  }

  loginOk = () => {
    this.props.fetchData(`/api/users/${this.props.user.user.id}`, this.props.user.user.token)
    .then(() => this.setState({
      alert: true,
      alertMsg: 'Login succesful!',
      loginDialog: false
    }))
  }

  logoutOk = () => {
    this.setState({
      alert: true,
      alertMsg: 'Logout succesful!'
    })
  }

  unregisterOk = () => {
    this.setState({
      alert: true,
      alertMsg: 'Unregister successful - account deleted!'
    })
  }

  openLoginForm = () => {
    this.setState({ loginDialog: true })
  }

  closeLoginForm = () => {
    this.setState({ loginDialog: false })
  }

  successClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ alert: false })
  }

  // Define which component to render on the App
  view = () => {
    switch (this.props.view) {
      case VIEW_MAIN_PAGE:
        return <SalesList />
      case VIEW_USER_INFO:
        return <UserInfo/>
      case VIEW_ITEMS_ALL:
        return <ItemList />
      case VIEW_ITEMS_OFFERS:
        return <OfferList />
      case VIEW_ITEMS_OWN:
        return <OwnItems />
      case VIEW_USERS:
        return <UserList />
      case VIEW_UNREGISTER_PAGE:
        return <Unregister />
      default:
        return <SalesList />
    }
  }

  render() {
    return (
      <Container maxWidth="lg">
        <Nav
          registerClick={this.openRegisterForm}
          loginClick={this.openLoginForm}
          logoutClick={this.props.postLogout}
          logout={this.logoutOk}
          role={this.props.user.user.role}
        />
        {this.view()}

        {this.state.registerDialog ?
          <RegisterForm
            open={this.state.registerDialog}
            close={this.closeRegisterForm}
            register={this.registerOk}
          /> : ''}
        {this.state.loginDialog ?
          <LoginForm
            open={this.state.loginDialog}
            close={this.closeLoginForm}
            login={this.props.postLogin}
            checkLogin={this.loginOk}
          /> : ''}
        <Snackbar open={this.state.alert} autoHideDuration={3000} onClose={this.successClose}>
          <Alert onClose={this.successClose} severity="success" variant="filled">
            {this.state.alertMsg}
          </Alert>
        </Snackbar>
      </Container>
    );
  }
}

const App = connect(mapStateToProps, mapDispatchToProps)(Page)
export default App;
