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
      open: false,
      msg: ""
    };
  }

  handleDelete=(id)=>{
    this.props.handleDelete(id);
  }

  handleSubmit=()=>{
    let selOperationIds=[];
    let tmp = JSON.parse(JSON.stringify(postResponse));
    for (var i in this.props.methods){
      selOperationIds.push(this.props.methods[i].operationId);
    };
    tmp.INTERNAL_STRUCTURE.Overview.tags = tmp.INTERNAL_STRUCTURE.Overview.tags.filter((value, index, arr)=>{
      return selOperationIds.includes(value.method_id);
    });
    tmp.INTERNAL_STRUCTURE.Testing_Output_Data = tmp.INTERNAL_STRUCTURE.Testing_Output_Data.filter((value, index, arr)=>{
      return selOperationIds.includes(value.method_id);
    });
    tmp.DATA_MANAGEMENT = tmp.DATA_MANAGEMENT.filter((value, index, arr)=>{
      return selOperationIds.includes(value.method_id);
    });
    for(var p in tmp.EXPOSED_API.paths){
      if(!selOperationIds.includes(tmp.EXPOSED_API.paths[p].get.operationId)){
        delete tmp.EXPOSED_API.paths[p];
      }
    };
    fetch('http://localhost:5000/forward', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tmp)
    })
      .then(res=>{
        if(!res.ok){
          throw Error(res);
        }
        return res;
      })
      .then(data=>data.json())
      .then(data=>this.setState({open:true,msg:data.msg}))
      .then(data=>this.props.clearSel())
      .catch(error =>{console.log(error);this.setState({open:true,msg:"error"});});
  }

  handleClose = () => {
   this.setState({ open: false });
  };

  createCAF=() => {
    fetch('http://localhost:5000/generate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({methods:this.props.methods, exposedAPI: postResponse.EXPOSED_API})
    })
      .then(res=>{
          if(!res.ok){
            throw Error(res);
          }
          return res;
        })
      .then(data=>data.json())
      .then(data=>this.setState({open:true,msg:data.msg}))
      .then(data=>this.props.clearSel())
      .catch(error =>{console.log(error);this.setState({open:true,msg:"error"});});
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
          <Button variant="contained" color="primary" onClick={this.createCAF}>Create New CAF (VDC)</Button>
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
