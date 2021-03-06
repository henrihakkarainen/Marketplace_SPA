import React from 'react';
import { connect } from 'react-redux'
import { fetchItems, deleteItem, updateItem, addItem } from '../actions/items'
import { fetchUsers } from '../actions/userList';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import CreateIcon from '@material-ui/icons/Create';

const mapStateToProps = (state) => {
  return {
    items: state.items,
    user: state.loggedInUser,
    users: state.users
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchItems: (url, payload) => dispatch(fetchItems(url, payload)),
    deleteItem: (payload) => dispatch(deleteItem(payload)),
    updateItem: (payload) => dispatch(updateItem(payload)),
    addItem: (payload) => dispatch(addItem(payload)),
    fetchUsers: (url, payload) => dispatch(fetchUsers(url, payload))
  }
}

class ItemList extends React.Component {
  constructor(props) {
    super(props)
    this.props.fetchItems('/api/items/', this.props.user.user.token)
    this.state = {
      open: false,
      name: "",
      price: "",
      id: "",
      desc: "",
      createItem: false,
      createName: '',
      createPrice: '',
      createDesc: '',
      createOwner: '',
      onsale: null,
      alert: false,
      success: false
    }
  }

  handleClick = (item) => {
    this.setState({
      name: item.name,
      price: item.price,
      id: item._id,
      desc: item.description,
      onsale: item.onsale,
      open: true
    })
  }

  openCreate = () => {
    this.props.fetchUsers('/api/users/', this.props.user.user)
    this.setState({ createItem: true })
  }

  handleClose = () => {
    this.setState({
      open: false,
      createItem: false,
      alert: false
    })
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  changeOwner = (e) => {
    this.setState({ createOwner: e.target.value })
  }

  handleCreate = () => {
    if (!this.state.createName) {
      this.setState({ alert: true, alertMsg: 'Item name is required!' })
    } else if (!this.state.createPrice) {
      this.setState({ alert: true, alertMsg: 'Item price is required!' })
    } else if (!this.state.createOwner) {
      this.setState({ alert: true, alertMsg: 'Item owner is required!' })
    } else {
      const newItem = {
        name: this.state.createName,
        price: this.state.createPrice,
        description: this.state.createDesc,
        owner: this.state.createOwner
      }
      fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.props.user.user.token
        },
        body: JSON.stringify(newItem)
      })
        .then(res => {
          if (!res.ok) throw Error(res.statusText)
          return res.json()
        })
        .then((data) => {
          console.log(data)
          this.props.addItem(data)
          this.setState({
            createItem: false,
            createName: '',
            createPrice: '',
            createDesc: '',
            createOwner: '',
            alert: false,
            success: true,
            successMsg: 'Item created!'
          })
        })
        .catch(() => {
          this.setState({ alert: true, alertMsg: 'Item creation failed, check name and price!' })
        })
    }
  }

  handleDelete = () => {
    fetch(`/api/items/${this.state.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + this.props.user.user.token
      }
    })
      .then(res => res.json())
      .then(data => {
        this.props.deleteItem(data.deleted)
        this.setState({ open: false, success: true, successMsg: 'Item deleted!' })
      })
  }

  handleUpdate = () => {
    const update = {
      name: this.state.name,
      price: this.state.price,
      description: this.state.desc
    }
    fetch(`/api/items/${this.state.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.user.user.token
      },
      body: JSON.stringify(update)
    })
      .then(res => {
        if (!res.ok) throw Error(res.statusText)
        return res.json()
      })
      .then((data) => {
        this.props.updateItem(data)
        this.setState({
          open: false,
          alert: false,
          success: true,
          successMsg: 'Item updated!'
        })
      })
      .catch(() => this.setState({ alert: true, alertMsg: 'Update failed - check information!' }))
  }

  changeSaleStatus = (item) => {
    const update = { onsale: !item.onsale }
    fetch(`/api/items/${item._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.user.user.token
      },
      body: JSON.stringify(update)
    })
      .then(res => {
        if (!res.ok) throw Error(res.statusText)
        return res.json()
      })
      .then((data) => {
        this.props.updateItem(data)
        this.setState({
          open: false,
          alert: false,
          success: true,
          successMsg: 'Item status successfully updated!'
        })
      })
  }

  render() {
    if (this.props.items.isFetching === true) {
      return (
        <div>
          <Typography
            variant="h4"
            component="h4"
            align="center"
            style={{ marginTop: 20, marginBottom: 20 }}
          >
            ALL ITEMS
          </Typography>
          <p>Loading</p>
        </div>
      )
    } else if (this.props.items.items.length === 0 && !this.state.createItem) {
      return (
        <div>
          <Typography
            variant="h4"
            component="h4"
            align="center"
            style={{ marginTop: 20, marginBottom: 20 }}
          >
            ALL ITEMS
          </Typography>
          <Card style={{ margin: 'auto', marginTop: 70, maxWidth: 400 }} variant="outlined">
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                No items on database.
            </Typography>
            </CardContent>
            <CardActions>
              <Button
              size="small"
              color="primary"
              onClick={this.openCreate}
              >
                Create item
              </Button>
            </CardActions>
          </Card>
        </div>
      )
    }

    return (
      <div>
        <Typography
          variant="h4"
          component="h4"
          align="center"
          style={{ marginTop: 20, marginBottom: 20 }}
        >
          ALL ITEMS
        </Typography>
        <List style={{ maxWidth: 600, margin: 'auto' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={this.openCreate}
            style={{ marginBottom: 5 }}
          >
            Create item
          </Button>
          {this.props.items.items.map(item => (
            <ListItem
              style={{ backgroundColor: 'white', opacity: 0.9 }}
              button onClick={this.handleClick.bind(this, item)} divider={true} key={item._id} >
              <ListItemText
                primary={item.name}
                secondary={
                  <span>
                    <span>Price: {item.price} €</span>
                    <br />
                    <span>On sale? {item.onsale ? 'yes' : 'no'}</span>
                    <br />
                    <span>Description: {item.description ? item.description : '–'}</span>
                    <br />
                    <span>Owner: {item.owner.name}</span>
                  </span>
                }
                style={{
                  flex: 0.75
                }}
              />
              <ListItemSecondaryAction>
                <Button color="primary" onClick={this.changeSaleStatus.bind(this, item)}>
                  {item.onsale ? 'Remove from sale' : 'Put to sale'}
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>Update or delete item</DialogTitle>
          <DialogContent>
            <DialogContentText>You can change the name, price, description or delete the item.</DialogContentText>
            <TextField
              required
              margin="normal"
              label="name"
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.name}
              placeholder="Item name"
              name="name"
              type="text"
              onChange={this.handleChange}
              variant="outlined"
              fullWidth
            />
            <TextField
              required
              margin="normal"
              label="price"
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.price}
              placeholder="0.00 €"
              type="number"
              name="price"
              onChange={this.handleChange}
              variant="outlined"
              fullWidth
            />
            <TextField
              margin="normal"
              label="Description"
              multiline={true}
              rows={3}
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.desc}
              placeholder="Description (optional)"
              name="desc"
              type="text"
              onChange={this.handleChange}
              variant="outlined"
              fullWidth
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
            <Button onClick={this.handleClose} startIcon={<CancelIcon />} color="default">
              Cancel
            </Button>
            <Button onClick={this.handleDelete} startIcon={<DeleteIcon />} color="secondary">
              Delete
            </Button>
            <Button onClick={this.handleUpdate} startIcon={<SaveIcon />} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={this.state.createItem} onClose={this.handleClose}>
          <DialogTitle>Create a new item</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Give the required information to add a new item for a specific user
              on the marketplace.
            </DialogContentText>
            <TextField
              required
              autoFocus
              label="Name"
              style={{ margin: 8 }}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Item name"
              name="createName"
              onChange={this.handleChange}
              variant="outlined"
              value={this.state.createName}
            />
            <TextField
              required
              label="Price"
              style={{ margin: 8 }}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="0.00 €"
              type="number"
              name="createPrice"
              onChange={this.handleChange}
              variant="outlined"
              value={this.state.createPrice}
            />
            <TextField
              label="Description"
              style={{ margin: 8 }}
              multiline={true}
              rows={3}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Description about the item (optional)"
              type="text"
              name="createDesc"
              onChange={this.handleChange}
              variant="outlined"
              value={this.state.createDesc}
            />
            <FormControl
              variant="outlined"
              style={{ margin: 8 }}
              required
              fullWidth
            >
              <Select
                displayEmpty
                value={this.state.createOwner}
                onChange={this.changeOwner}
              >
                <MenuItem value="" disabled>Select owner from the list (required)</MenuItem>
                {this.props.users.users.map((user => (
                  <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
                )))}
              </Select>
            </FormControl>
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
            <Button onClick={this.handleClose} startIcon={<CancelIcon />} color="default">
              Cancel
          </Button>
            <Button onClick={this.handleCreate} startIcon={<CreateIcon />} color="primary">
              Create
          </Button>
          </DialogActions>
        </Dialog>


        <Snackbar open={this.state.success} autoHideDuration={3000} onClose={this.successClose}>
          <Alert onClose={this.successClose} severity="success" variant="filled">
            {this.state.successMsg}
          </Alert>
        </Snackbar>
      </div>
    )
  }
}

const completeList = connect(mapStateToProps, mapDispatchToProps)(ItemList)
export default completeList;