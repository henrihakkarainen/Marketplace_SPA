import React from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import IconButton from '@material-ui/core/IconButton'
import Collapse from '@material-ui/core/Collapse'
import CloseIcon from '@material-ui/icons/Close'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import CancelIcon from '@material-ui/icons/Cancel';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const mapStateToProps = (state) => {
  return {
    user: state.loggedInUser
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      alert: false,
      open: this.props.open,
      username: '',
      pw: '',
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleLogin = async () => {
    const login = {
      name: this.state.username,
      password: this.state.pw
    }
    await this.props.login('/api/login', login)
    if (this.props.user.loggedIn) {
      this.props.checkLogin()
    } else {
      this.setState({ alert: true, alertMsg: 'Invalid credentials!' })
    }
  }

  render() {
    return (
      <Dialog open={this.state.open} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Login</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please input your username and password to login.
            </DialogContentText>
          <TextField
            label="Username"
            autoFocus
            style={{ margin: 8 }}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            name="username"
            onChange={this.handleChange}
            variant="outlined"
            value={this.state.username}
          />
          <TextField
            label="Password"
            style={{ margin: 8 }}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            type="password"
            name="pw"
            onChange={this.handleChange}
            variant="outlined"
            value={this.state.pw}
          />
        </DialogContent>
        <Collapse in={this.state.alert}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  this.setState({ alert: false });
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <AlertTitle>Error</AlertTitle>
            {this.state.alertMsg}
          </Alert>
        </Collapse>
        <DialogActions>
          <Button onClick={this.props.close} startIcon={<CancelIcon />}  color="default">
            Cancel
            </Button>
          <Button onClick={this.handleLogin}startIcon={<ExitToAppIcon />}  color="primary">
            Login
            </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const LoginForm = connect(mapStateToProps)(Login)
export default LoginForm;