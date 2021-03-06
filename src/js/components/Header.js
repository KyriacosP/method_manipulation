import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

//Header Component
class Header extends React.Component{
  render(){
    return(
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" color="textPrimary">
            <b>Method Composition</b>
          </Typography>
        </Toolbar>
      </AppBar>
    )
  }
}

export default Header
