import React from 'react';
import Header from './Header'
import Methods from './Methods'

class App extends React.Component {

  constructor(){
    super();
    this.state={};
  }

  render(){
    return(
      <React.Fragment>
        <Header/>
        <Methods/>
      </React.Fragment>
    )
  }
}

export default App;
