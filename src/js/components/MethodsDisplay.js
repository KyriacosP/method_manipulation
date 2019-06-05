import React from 'react';
import MethodContainer from './MethodContainer'
import ApiSpec from '../dataclasses/ApiSpec'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid';
import SelectedMethodsDisplay from './SelectedMethodsDisplay';
import Method from '../dataclasses/Method'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import $RefParser from 'json-schema-ref-parser';
import postResponse from '../../resources';

//MethodsDisplay is a high level component that renders the MethodContainers and SelectedMethodsDisplay
//also handle the logic behind selecting responses and creating new methods

class MethodsDisplay extends React.Component{
  constructor(){
    super();
    this.state={
      isLoading:true,
      apiDesc:{},
      selection:[],
      selectedMethods:[],
      open:false,
      openErr:false,
      error:"",
      form:{
        summary: "",
        description: "",
        operationId: ""
      },
      selectedResponses:{}
    };
  }

  //Dialog Open
  handleOpen = () => {
    this.setState({ open: true });
  };

  //Dialog Close
  //also handles the new method creation and states updates
  handleClose = () => {
    this.setState({ open: false });
    let desc={};
    desc.get={};
    desc.get.summary=this.state.form.summary;
    desc.get.description=this.state.form.description;
    desc.get.operationId=this.state.form.operationId;
    desc.get.responses={};
    desc.get.responses['200']={};
    desc.get.responses['200'].content={};
    desc.get.responses['200'].content['application/json']={};
    desc.get.responses['200'].content['application/json'].schema=this.state.selectedResponses;
    this.setState(prevState=>{
      let tmp=prevState.selectedMethods;
      tmp.push(new Method(prevState.form.path,desc));
      return {
        selectedMethods:tmp,
        form:{
          summary:"",
          description:"",
          operationId:""
        }
      };
    })
  };


  //Retrieves the api specification and removes all the references using $RefParser
  componentDidMount(){
    $RefParser.dereference(postResponse.EXPOSED_API)
    .then(schema=>{console.log(schema);this.setState({apiDesc: new ApiSpec(schema)})})
    .then(_=>this.setState({isLoading:false}))
    .catch(err=>console.log(err));
  }

  //handles state.selection updates from the MethodResponseGrid component
  updateGlobalSelection=(id,sel)=>{
    this.setState(prevState=>{
      prevState.selection[id]=sel;
      return {selection:prevState.selection}
    })
  }

  //handles whole method selections from the MethodContainer component
  handleMethodSelection=(methodSelected)=>{
    this.setState(prevState=>{
      let tmp=prevState.selectedMethods;
      tmp.push(methodSelected);
      return {selectedMethods:tmp};
    });
  }

  //handles controlled form data in Dialog component
  handleChange = name=>({target:{value}}) => {
    this.setState(prevState=>{
      return {
        form: {
          ...prevState.form,
          [name]: value
        }
      }
    });
  };

  //handles method delete from the SelectedMethodsDisplay component
  handleDelete=(m)=>{
    this.setState(prevState=>{
      prevState.selectedMethods.splice(m,1);
      return {selectedMethods:prevState.selectedMethods};
    })

  }

  applyRules=(array)=>{
    //first rule: in a oneOf type methods only selections from the same schema are allowed
    let fra=array.map(x=>x.path).filter(x=>x.includes('oneOf'));
    fra=fra.map(x=>x.split(".")[1]);
    for(let i in fra)
    {
      if(fra[0]!==fra[i])
      {
        return {pass:false,error:"Select properties only from a single Schema in methods of type oneOf"};
      }
    }

    //second rule: no selections with the same path from different methods are allowed (implementation constrain)
    let sra=array.map(x=>x.path);
    const dupes = sra.reduce((acc, v, i, arr) => arr.indexOf(v) !== i && acc.indexOf(v) === -1 ? acc.concat(v) : acc, [])
    if(dupes.length!==0){
      return {pass:false,error:"Properties with the same path have been selected: "+dupes.join(", ")};
    }

    //return pass true if both test have passed
    return {pass:true,error:""};
  }

  //its called when the Create new Method button is pressed
  //prepares the selection array (removes duplicates and fixes parent children duplicates due to material-table bug)
  //checks the selection against a set of rules
  createNewMethod=()=>{
    //apply rules
    let sel=this.state.selection;
    let tmp=[];
    for(var i in sel){
      for(var j in sel[i]){
        tmp.push(sel[i][j]);
        tmp[tmp.length-1].tableData.checked=false;
      }
    }
    tmp=tmp.filter(x=>!tmp.map(x=>x.id).includes(x.parentId));
    // console.log(tmp);
    let {pass,error}=this.applyRules(tmp);
    if(pass){
      this.setState({
        selectedResponses:{...tmp},
        selection:[]
      });
      this.handleOpen();
    }
    else {
      this.setState({
        selectedResponses:{},
        selection:[],
        openErr:true,
        error:error
      });
    }
  }

  handleCloseErr=()=>{
    this.setState({
      openErr:false,
      error:""
    });
  }

  //clears state after a new CAF is created it's called from the SelectedMethodsDisplay component
  clearSel=()=>{
    this.setState({selectedMethods:[]});
  }


  render(){
    if(this.state.isLoading){
      return(
        <div>Loading...</div>
      );
    } else{
      const elems=[];
      for (var m in this.state.apiDesc.methods){
        elems.push(<MethodContainer key={m} id={m} handleMethodSelection={this.handleMethodSelection} updateGlobalSelection={this.updateGlobalSelection} method={this.state.apiDesc.methods[m]}/>);
      };
      return(
        <React.Fragment>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
            spacing={2}
            wrap="nowrap"
          >
            <Grid item xs={6} zeroMinWidth>
              {elems}
              <br/>
              <Button variant="contained" color="primary" onClick={this.createNewMethod}>Create New Method</Button>
            </Grid>
            <Grid item xs={6}>
              <SelectedMethodsDisplay methods={this.state.selectedMethods} handleDelete={this.handleDelete} clearSel={this.clearSel}/>
            </Grid>
          </Grid>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            fullWidth
          >
            <DialogTitle id="form-dialog-title">Method Data</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please fill in all the information!
              </DialogContentText>
              <form>
                <TextField
                  required
                  label="operationId"
                  value={this.state.form.operationId}
                  onChange={this.handleChange("operationId")}
                  fullWidth
                  margin="normal"
                />
                <br/>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows="4"
                  label="summary"
                  value={this.state.form.summary}
                  onChange={this.handleChange("summary")}
                  margin="normal"
                />
                <br/>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows="4"
                  label="description"
                  value={this.state.form.description}
                  onChange={this.handleChange("description")}
                  margin="normal"
                />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} variant="contained" color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={this.state.openErr}
            onClose={this.handleCloseErr}
          >
            <DialogTitle>ERROR!</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {this.state.error}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCloseErr} variant="contained" color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      );
    }
  }

}

export default MethodsDisplay
