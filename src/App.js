import React from 'react';
import Header from './Header'
import MethodsDisplay from './MethodsDisplay'

class App extends React.Component {

  constructor(){
    super();
    this.state={};
  }

  render(){
    return(
      <React.Fragment>
        <Header/>
        <MethodsDisplay/>
      </React.Fragment>
    )
  }
}

export default App;
