import React from 'react';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';

class Logo extends React.Component {

  render() {
    return (
      <Card >
        <CardMedia
          component="img"
          image={process.env.PUBLIC_URL + 'tori.png'}
          title="Best marketplace in town"
          height="130"
        />
      </Card>
    )
  }

}

export default Logo;