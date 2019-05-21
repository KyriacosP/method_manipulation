import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Delete from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import postResponse from '../../resources';


const stylePaper = {
  marginBottom: "1em"
};

class SelectedMethodsDisplay extends React.Component{

  constructor(){
    super();
    this.state={
      methods:[],
      open: false,
      msg: ""
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
      return selOperationIds.includes(value.method_id);
    });
    postResponse.INTERNAL_STRUCTURE.Testing_Output_Data = postResponse.INTERNAL_STRUCTURE.Testing_Output_Data.filter((value, index, arr)=>{
      return selOperationIds.includes(value.method_id);
    });
    postResponse.DATA_MANAGEMENT = postResponse.DATA_MANAGEMENT.filter((value, index, arr)=>{
      return selOperationIds.includes(value.method_id);
    });
    for(var p in postResponse.EXPOSED_API.paths){
      if(!selOperationIds.includes(postResponse.EXPOSED_API.paths[p].get.operationId)){
        delete postResponse.EXPOSED_API.paths[p];
      }
    };
    fetch('http://localhost:1880/forward', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postResponse)
    })
      .then(data=>data.json())
      .then(data=>this.setState({open:true,msg:data.msg}))
      .then(data=>this.props.clearSel());
  }

  handleClose = () => {
   this.setState({ open: false });
  };

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
    var res;
    if(elems.length !== 0) {
      res= (
        <React.Fragment>
          {elems}
          <Button variant="contained" color="primary" >Create New CAF (VDC)</Button>
          <Button variant="contained" color="secondary" onClick={this.handleSubmit} >Forward</Button>
        </React.Fragment>
      )
    } else {
      res= (
        <Typography variant="h6" color="textSecondary">
          Waiting...
        </Typography>
      )
    }
    return (
      <React.Fragment>
        {res}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
        >
          <DialogTitle>{this.state.msg}</DialogTitle>
          <DialogActions>
            <Button onClick={this.handleClose} variant="contained" color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default SelectedMethodsDisplay
