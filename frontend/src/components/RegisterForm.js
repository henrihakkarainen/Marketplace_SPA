import React from 'react';
import Button from '@material-ui/core/Button'
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import HowToRegIcon from '@material-ui/icons/HowToReg';
import CancelIcon from '@material-ui/icons/Cancel';

class RegisterForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: this.props.open,
      alert: false,
      username: '',
      email: '',
      password: '',
      passwordconf: '',
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleRegister = () => {
    if (!this.state.username) {
      this.setState({ alert: true, alertMsg: 'Username is required!' })
    } else if (!this.state.email) {
      this.setState({ alert: true, alertMsg: 'Email is required!' })
    } else if (!this.state.password || this.state.password !== this.state.passwordconf) {
      this.setState({ alert: true, alertMsg: 'Passwords must match and can\'t be empty!' })
    } else {
      const register = {
        name: this.state.username,
        email: this.state.email,
        password: this.state.password
      }
      fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(register)
      })
      .then(res => {
        if (!res.ok) throw Error(res.statusText)
        return res
      })
      .then(() => {
        this.setState({ open: false })
        this.props.register()      
      })
      .catch(() => {
        this.setState({ alert: true, alertMsg: 'Registration failed, change username or check email address!' })
      })
      
    }
  }

  render() {
    return (
      <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Register</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To buy items on this website, please register now by giving the
            required information here.
            </DialogContentText>
          <TextField
            required
            autoFocus
            label="Username"
            style={{ margin: 8 }}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="Username"
            name="username"
            onChange={this.handleChange}
            variant="outlined"
            value={this.state.username}
          />
          <TextField
            required
            label="Email"
            style={{ margin: 8 }}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="user@email.com"
            name="email"
            onChange={this.handleChange}
            variant="outlined"
            value={this.state.email}
          />
          <TextField
            required
            label="Password"
            style={{ margin: 8 }}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="Password can't be empty"
            type="password"
            name="password"
            onChange={this.handleChange}
            variant="outlined"
            value={this.state.password}
          />
          <TextField
            required
            label="Password confirmation"
            style={{ margin: 8 }}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="Password can't be empty"
            type="password"
            name="passwordconf"
            onChange={this.handleChange}
            variant="outlined"
            value={this.state.passwordconf}
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
          <Button onClick={this.props.close}  startIcon={<CancelIcon />} color="default">
            Cancel
            </Button>
          <Button onClick={this.handleRegister}  startIcon={<HowToRegIcon />} color="primary">
            Register
            </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default RegisterForm;