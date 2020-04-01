import React from 'react'
import { connect } from 'react-redux'
import { fetchData } from '../actions/userData'
import { fetchItems } from '../actions/items'
import UserInfoDialog from './UserInfoDialog'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import CreditCardIcon from '@material-ui/icons/CreditCard'
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const mapStateToProps = (state) => {
  return {
    user: state.loggedInUser,
    userData: state.userInfo,
    items: state.items
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (url, token) => dispatch(fetchData(url, token)),
    fetchItems: (url, token) => dispatch(fetchItems(url, token))
  }
}

class Info extends React.Component {
  constructor(props) {
    super(props)
    this.props.fetchData(`/api/users/${this.props.user.user.id}`, this.props.user.user.token)
    this.checkOnsaleItems()
    this.state = {
      editUserDialog: false,
      addCardDialog: false,
      editCardDialog: false,
      deleteCardDialog: false,
      deleteUserDialog: false,
      success: false,
      alert: false,
      addCardAlert: false
    }
  }

  checkOnsaleItems = async () => {
    await this.props.fetchItems(`/api/items/users/${this.props.user.user.id}`, this.props.user.user.token)
    const saleItems = this.props.items.items.filter(item => item.onsale)
    if (saleItems.length !== 0 && !this.props.userData.data.creditcard) {
      this.setState({ addCardAlert: true })
    }
  }

  handleClose = (event) => {
    const newState = {
      editUserDialog: false,
      addCardDialog: false,
      editCardDialog: false,
      deleteCardDialog: false,
      deleteUserDialog: false,
      dialogAlert: false,
      dialogAlertMsg: ''
    }
    if (event === 'edituser') {
      newState.success = true
      newState.successMsg = 'User information updated!'
    } else if (event === 'addcard') {
      newState.success = true
      newState.addCardAlert = false
      newState.successMsg = 'Credit card created!'
    } else if (event === 'updatecard') {
      newState.success = true
      newState.successMsg = 'Card balance updated!'
    } else if (event === 'deletecard') {
      newState.success = true
      newState.successMsg = 'Credit card deleted!'
      this.checkOnsaleItems()
    } else if(event === 'error') {
      newState.alert = true
      newState.alertMsg = 'Error occurred!'
    }
    this.setState(newState)
  }

  popupClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ success: false, alert: false })
  }

  render() {
    if (this.props.userData.isFetching === true) {
      return (
        <div>
          <Typography
            variant="h4"
            component="h4"
            align="center"
            gutterBottom
            style={{ marginTop: 20 }}
          >
            ACCOUNT INFORMATION
          </Typography>
          <p>Loading</p>
        </div>
      )
    }
    return (
      <div>
        <Typography
          variant="h4"
          component="h4"
          align="center"
          style={{ marginTop: 20 }}
        >
          ACCOUNT INFORMATION
        </Typography>
        <Card style={{ margin: 40 }} variant="outlined">
          <CardActionArea onClick={() => {
              this.setState({ editUserDialog: true })
            }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                <AccountCircleIcon style={{marginRight: 10}} />
                {this.props.userData.data.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Email address: {this.props.userData.data.email}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Role: {this.props.userData.data.role}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary" onClick={() => {
              this.setState({ editUserDialog: true })
            }}>
              Edit information
            </Button>
            {this.props.userData.data.creditcard ? '' :
            <Button size="small" color="primary" onClick={() => {
              this.setState({ addCardDialog: true })
            }}>
              Add credit card
            </Button>}
            {this.props.user.user.role !== 'admin' ?
            <Button size="small" startIcon={<DeleteForeverIcon />} color="secondary" style={{ marginLeft: 'auto' }} onClick={() => {
              this.setState({ deleteUserDialog: true })
            }}>
              Unregister
            </Button>
            : '' }
          </CardActions>
        </Card>
        {this.state.addCardAlert ?
        <Alert severity="error" variant="filled" style={{ maxWidth: 500, margin: 'auto' }}>
          <AlertTitle>Add credit card</AlertTitle>
          You have items that are on sale but they can't be bought by other users
          because you haven't added payment information to your account - please
          add a credit card now!
        </Alert>
        : ''}
        {this.props.userData.data.creditcard ?
        <Card style={{ margin: 40 }} variant="outlined">
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                <CreditCardIcon style={{marginRight: 10}} />
                Credit card
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Card number: {this.props.userData.data.creditcard.number}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Balance: {this.props.userData.data.creditcard.balance} €
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary" onClick={() => {
              this.setState({ editCardDialog: true })
            }}>
              Add credits
            </Button>
            <Button size="small" color="secondary" style={{ marginLeft: 'auto' }} startIcon={<DeleteIcon />} onClick={() => {
              this.setState({ deleteCardDialog: true })
            }}>
              Delete
            </Button>
          </CardActions>
        </Card>
        : ''}
        <UserInfoDialog
          editUserDialog={this.state.editUserDialog}
          editCardDialog={this.state.editCardDialog}
          addCardDialog={this.state.addCardDialog}
          deleteCardDialog={this.state.deleteCardDialog}
          deleteUserDialog={this.state.deleteUserDialog}
          handleClose={this.handleClose}
        />
        <Snackbar open={this.state.success} autoHideDuration={3000} onClose={this.popupClose}>
          <Alert onClose={this.popupClose} severity="success" variant="filled">
            {this.state.successMsg}
          </Alert>
        </Snackbar>
        <Snackbar open={this.state.alert} autoHideDuration={3000} onClose={this.popupClose}>
          <Alert onClose={this.popupClose} severity="error" variant="filled">
            {this.state.alertMsg}
          </Alert>
        </Snackbar>
      </div>
    )
  }
}

const UserInfo = connect(mapStateToProps, mapDispatchToProps)(Info)
export default UserInfo