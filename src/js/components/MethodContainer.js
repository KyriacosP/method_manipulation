import React from 'react';
import MethodResponseGrid from './MethodResponseGrid'
import Paper from '@material-ui/core/Paper';

class MethodContainer extends React.Component{
  constructor(props){
    super(props);
    this.state={
      isHidden:true,
    }
  }

  updateState=(sel)=>{
    this.props.updateGlobalSelection(this.props.id,sel);
  }


  handleClick=()=>{
    this.setState(prevState => {return {isHidden:!prevState.isHidden}});
  }
  render(){
    return(
      <React.Fragment>
        <Paper onClick={this.handleClick}>
          Path: {this.props.method.path}
          Method: {this.props.method.type}

        </Paper>
        <MethodResponseGrid method={this.props.method} updateState={this.updateState} hidden={this.state.isHidden}/>

      </React.Fragment>
    );
  }

}
//{!this.state.isHidden ? <MethodResponseGrid method={this.props.method}/> : null}

export default MethodContainer
