import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

class Header extends React.Component{
  render(){
    return(
      <AppBar position="static">
            <Toolbar>
                Method Composition
            </Toolbar>
      </AppBar>
    )
  }
}

export default Header
