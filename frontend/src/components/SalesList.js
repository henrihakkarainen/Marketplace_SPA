import React from 'react';
import { connect } from 'react-redux';
import { fetchItems, deleteItem } from '../actions/items';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CancelIcon from '@material-ui/icons/Cancel';

const mapStateToProps = (state) => {
  return {
    items: state.items,
    user: state.loggedInUser,
    userData: state.userInfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchItems: (url, payload) => dispatch(fetchItems(url, payload)),
    deleteItem: (payload) => dispatch(deleteItem(payload))
  }
}

class ConnectedList extends React.Component {
  constructor(props) {
    super(props);
    this.props.fetchItems('/api/items/onsale', '')
    this.state = {
      id: '',
      name: '',
      price: '',
      owner: '',
      sortOrder: 'nameAsc',
      open: false,
      confirmation: false,
      success: false,
      alert: false
    }
  }

  handleClick = (item) => {
    this.setState({
      id: item.id,
      name: item.name,
      price: item.price,
      owner: item.owner,
      open: true
    })
  }

  handleClose = () => {
    this.setState({
      open: false
    })
  }

  buy = () => {
    if (this.state.owner._id === this.props.user.user.id) {
      this.setState({
        open: false,
        confirmation: false,
        succeess: false,
        alert: true,
        alertMsg: 'You can\'t buy items that you are selling!'
      })
    } else if (!this.props.userData.data.creditcard) {
      this.setState({
        open: false,
        confirmation: false,
        success: false,
        alert: true,
        alertMsg: 'You don\'t have a credit card to buy - go to account information to add one'
      })
    } else if (this.props.userData.data.creditcard.balance < this.state.price) {
        this.setState({
          open: false,
          confirmation: false,
          succeess: false,
          alert: true,
          alertMsg: 'You don\'t have enough credits to buy this item - go to account information to increase your balance'
        })
    } else if (!this.state.owner.creditcard) {
      this.setState({
        open: false,
        confirmation: false,
        success: false,
        alert: true,
        alertMsg: 'Unfortunately buying from this seller is not possible at the moment :('
      })
    } else {
      const sellerCCid = this.state.owner.creditcard
      const buyerCCid = this.props.userData.data.creditcard._id
      const itemId = this.state.id
      this.handlePayment(sellerCCid, buyerCCid, itemId)
      const toDelete = { _id: itemId }
      this.props.deleteItem(toDelete)
      this.setState({
        open: false,
        alert: false,
        confirmation: false,
        success: true,
        successMsg: 'Purchase successful, item was added to your own items!'
      })
    }
  }

  handlePayment = (sellerCCid, buyerCCid, itemId) => {
    const payment = {}
    payment.sellerCCid = sellerCCid;
    payment.buyerCCid = buyerCCid;
    payment.itemId = itemId;

    fetch(`/api/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.user.user.token
      },
      body: JSON.stringify(payment)
    })
    .then(res => {
      if (!res.ok) throw Error(res.statusText)
      return res.json()
    })
    .catch(() => this.setState({alert: true, alertMsg: 'Something went wrong with the purchase, please contact admin!'}))
  }

  changeSort = (e) => {
    this.setState({ sortOrder: e.target.value })
  }

  sort = () => {
    if (this.state.sortOrder === 'nameAsc') {
      return this.props.items.items.sort((a, b) => (a.name > b.name) ? 1 : -1)
    } else if (this.state.sortOrder === 'nameDesc') {
      return this.props.items.items.sort((a, b) => (a.name < b.name) ? 1 : -1)
    } else if (this.state.sortOrder === 'priceAsc') {
      return this.props.items.items.sort((a, b) => (a.price > b.price) ? 1 : -1)
    } else {
      return this.props.items.items.sort((a, b) => (a.price < b.price) ? 1 : -1)
    }
  }

  alertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ alert: false })
  }

  successClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ success: false })
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
            ITEMS CURRENTLY ON SALE
          </Typography>
          <p>Loading</p>
        </div>
      )
    } else if (this.props.items.items.length === 0) {
      return (
        <div>
          <Typography
            variant="h4"
            component="h4"
            align="center"
            style={{ marginTop: 20, marginBottom: 20 }}
          >
            ITEMS CURRENTLY ON SALE
          </Typography>
          <Card style={{ margin: 'auto', marginTop: 70, maxHeight: 200, maxWidth: 500 }} variant="outlined">
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                There are currently no items on sale.<br /><br />
                Please check back in later for more shopping!
                {this.props.user.loggedIn
                ?
                <span>
                  <br /><br />
                  You can view your own items on "Sell items" page and add
                  new items for sale!
                </span>
                :
                <span>
                  <br /><br />
                  You can log in to your account to view your own items and put
                  something for sale. If you don't have an account yet, please
                  register now.
                </span>
                }
            </Typography>
            </CardContent>
          </Card>
        </div>
      )
    }
    const sortedList = this.sort()
    return (
      <div>
        <Typography
          variant="h4"
          component="h4"
          align="center"
          style={{ marginTop: 20, marginBottom: 20 }}
        >
          ITEMS CURRENTLY ON SALE
        </Typography>
        <List style={{ maxWidth: 600, margin: 'auto' }}>
        <FormControl variant="outlined" style={{ marginBottom: 5 }} size="small">
          <InputLabel>Sort by</InputLabel>
          <Select
            native
            value={this.state.sortOrder}
            onChange={this.changeSort}
            label="Sort by"
          >
            <option value="nameAsc">Name: Ascending</option>
            <option value="nameDesc">Name: Descending</option>
            <option value="priceAsc">Price: Ascending</option>
            <option value="priceDesc">Price: Descending</option>
          </Select>
        </FormControl>
          {sortedList.map(item => (
            <ListItem
              style={{ backgroundColor: 'white', opacity: 0.9 }}
              button divider={true} key={item._id} onClick={this.handleClick.bind(this, item)}>
              <ListItemText
                primary={item.name}
                secondary={
                  <span>
                    <span>Price: {item.price} €</span>
                    <br />
                    <span>Description: {item.description ? item.description : '–'}</span>
                    <br />
                    <span>Seller: {item.owner.name}</span>
                  </span>
                }
              />
            </ListItem>
          ))}
        </List>
        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>Item preview </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.props.user.loggedIn ?  'Buy the following item' : 'You must log in to buy this item.'}
            </DialogContentText>
            <p>Name: {this.state.name}</p>
            <p>Price: {this.state.price} €</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} startIcon={<CancelIcon />}  color="default">
              Cancel
          </Button>
            <Button startIcon={<ShoppingCartIcon />} color="primary" onClick={() => {
              this.setState({ confirmation: true })
            }} disabled={!this.props.user.loggedIn}>
              Buy
          </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={this.state.confirmation} onClose={() => {
          this.setState({ confirmation: false })
        }}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You are about to buy the following item:
            </DialogContentText>
            <p>Name: {this.state.name}</p>
            <p>Price: {this.state.price} €</p>
          </DialogContent>
          <DialogActions>
            <Button startIcon={<CancelIcon />} autoFocus onClick={() => {
              this.setState({ confirmation: false })
            }} color="default">
              Cancel
            </Button>
            <Button onClick={this.buy}  startIcon={<ShoppingCartIcon />} color="primary">
              Buy
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar open={this.state.success} autoHideDuration={3000} onClose={this.successClose}>
          <Alert onClose={this.successClose} severity="success" variant="filled">
            {this.state.successMsg}
          </Alert>
        </Snackbar>
        <Snackbar open={this.state.alert} autoHideDuration={5000} onClose={this.alertClose}>
          <Alert onClose={this.alertClose} severity="error" variant="filled">
            {this.state.alertMsg}
          </Alert>
        </Snackbar>
      </div>
    );
  }
}

const SalesList = connect(mapStateToProps, mapDispatchToProps)(ConnectedList)
export default SalesList;
