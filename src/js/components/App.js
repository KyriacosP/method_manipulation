import React from 'react';
import Header from './Header'
import MethodsDisplay from './MethodsDisplay'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';


class App extends React.Component {

  constructor(){
    super();
    this.state={};
  }

  render(){
    const theme = createMuiTheme({
      palette: {
        primary: {main:'#808999'},
        secondary: {main:'#336b87'}
      }
    });
    return(
      <MuiThemeProvider theme={theme}>
        <Header/>
        <MethodsDisplay/>
      </MuiThemeProvider>
    )
  }
}

export default App;
