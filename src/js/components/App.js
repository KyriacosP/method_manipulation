import React from 'react';
import Header from './Header'
import MethodsDisplay from './MethodsDisplay'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../themes/theme'

class App extends React.Component {

  constructor(){
    super();
    this.state={};
  }

  render(){
    return(
      <MuiThemeProvider theme={createMuiTheme(theme)}>
        <Header/>
        <br/>
        <MethodsDisplay/>
      </MuiThemeProvider>
    )
  }
}

export default App;
