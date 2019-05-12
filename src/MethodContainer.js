import React from 'react';
import MethodResponseGrid from './MethodResponseGrid'

class MethodContainer extends React.Component{
  constructor(props){
    super(props);
    this.state={
      isHidden:true,
      selectionG:[]
    }
  }

  updateGlobalSelection(){

  }

  handleClick=()=>{
    this.setState(prevState => {return {isHidden:!prevState.isHidden}});
    //console.log(this.state.isHidden);
  }
  render(){
    return(
      <React.Fragment>
        <div onClick={this.handleClick}>
          Path: {this.props.path}
          Method: {Object.keys(this.props.method)}

        </div>
        <MethodResponseGrid method={this.props.method} hidden={this.state.isHidden}/>

      </React.Fragment>
    );
  }

}
//{!this.state.isHidden ? <MethodResponseGrid method={this.props.method}/> : null}

export default MethodContainer
