import React from 'react';
import MethodResponseGrid from './MethodResponseGrid'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Send from '@material-ui/icons/Send'
import IconButton from '@material-ui/core/IconButton';


const stylePaper = {
  marginBottom: "1em"
};

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

  handleMethodSelection=(event)=>{
    this.props.handleMethodSelection(this.props.method)
  }

  render(){
    return(
      <React.Fragment>
        <Paper style={stylePaper}  >
          <Typography style={{display:"inline-block",width:"90%"}} variant="h6" color="textSecondary" onClick={this.handleClick} >
            Name: {this.props.method.operationId}
          </Typography>
          <IconButton style={{display:"inline-block",width:"10%"}} onClick={this.handleMethodSelection} >
            <Send fontSize="small" />
          </IconButton>
        </Paper>
        <MethodResponseGrid method={this.props.method} updateState={this.updateState} hidden={this.state.isHidden}/>

      </React.Fragment>
    );
  }

}

export default MethodContainer
