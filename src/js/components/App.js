import React from 'react';
import Header from './Header'
import MethodsDisplay from './MethodsDisplay'
import { createMuiTheme } from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/styles';
import theme from '../themes/theme';


class App extends React.Component {

  constructor(){
    super();
    this.state={};
  }

  //app entry point
  render(){
    return(
      <ThemeProvider theme={createMuiTheme(theme)}>
        <Header/>
        <br/>
        <MethodsDisplay/>
      </ThemeProvider>
    )
  }
}

export default App;
