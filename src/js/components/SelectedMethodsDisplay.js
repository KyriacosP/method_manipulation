import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Delete from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import postResponse from '../../resources/abstract_blueprint_osr_testing.json';


const stylePaper = {
  marginBottom: "1em"
};

class SelectedMethodsDisplay extends React.Component{

  constructor(){
    super();
    this.state={
      methods:[]
    };
  }

  handleDelete=(id)=>{
    console.log(id);
    this.props.handleDelete(id);
  }

  componentDidMount(){
    this.setState({methods:this.props.methods});
  }

  handleSubmit=()=>{
    let selOperationIds=[];
    for (var i in this.state.methods){
      selOperationIds.push(this.state.methods[i].operationId);
    };
    postResponse.INTERNAL_STRUCTURE.Overview.tags = postResponse.INTERNAL_STRUCTURE.Overview.tags.filter((value, index, arr)=>{
      return !selOperationIds.includes(value.method_id);
    });
    postResponse.INTERNAL_STRUCTURE.Testing_Output_Data = postResponse.INTERNAL_STRUCTURE.Testing_Output_Data.filter((value, index, arr)=>{
      return !selOperationIds.includes(value.method_id);
    });
    postResponse.DATA_MANAGEMENT = postResponse.DATA_MANAGEMENT.filter((value, index, arr)=>{
      return !selOperationIds.includes(value.method_id);
    });
    for(var p in postResponse.EXPOSED_API.paths){
      if(selOperationIds.includes(postResponse.EXPOSED_API.paths[p].get.operationId)){
        delete postResponse.EXPOSED_API.paths[p];
      }
    }
    console.log(postResponse);
  }

  render(){
    const elems=[];
    for (var m in this.props.methods){
      elems.push(
        <Paper key={m} style={stylePaper}  >
              <Typography style={{display:"inline-block",width:"90%"}} variant="h6" color="textSecondary">
                Name: {this.props.methods[m].operationId}
              </Typography>
              <IconButton style={{display:"inline-block",width:"10%"}} onClick={this.handleDelete.bind(this, m)}>
                <Delete fontSize="small" />
              </IconButton>
        </Paper>);
    }
    if(elems.length !== 0) {
      return (
        <React.Fragment>
          {elems}
          <Button variant="contained" color="primary" >Create New API</Button>
          <Button variant="contained" color="secondary" onClick={this.handleSubmit} >Submit</Button>
        </React.Fragment>
      )
    } else {
      return (
        <Typography variant="h6" color="textSecondary">
          Waiting...
        </Typography>
      )
    }
  }
}

export default SelectedMethodsDisplay
