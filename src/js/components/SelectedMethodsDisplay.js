import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Delete from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

const stylePaper = {
  marginBottom: "1em"
};

class SelectedMethodsDisplay extends React.Component{

  constructor(){
    super();
    this.state={

    }
  }

  handleDelete=(id)=>{
    console.log(id);
    this.props.handleDelete(id);
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
          <Button variant="contained" color="secondary" >Submit</Button>
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
