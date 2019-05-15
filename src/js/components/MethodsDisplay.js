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



class MethodsDisplay extends React.Component{
  constructor(){
    super();
    this.state={
      isLoading:false,
      apiDesc:{},
      selection:[],
      selectedMethods:[],
      open:false,
      form:{
        path:"",
        type: "get",
        summary: "",
        description: "",
        operationId: ""
      },
      selectedResponses:{}
    };
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

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
      return {selectedMethods:tmp};
    })

  };


  componentDidMount(){
    this.setState({isLoading:true});
    fetch("http://localhost:1880/apidescription")
    .then(data=>data.json())
    .then(data=>this.setState({apiDesc: new ApiSpec(data)}))
    // .then(data=>console.log(this.state.apiDesc))
    .then(data=>this.setState({isLoading:false}))
  }

  updateGlobalSelection=(id,sel)=>{
    this.setState(prevState=>{
      prevState.selection[id]=sel;
      return {selection:prevState.selection}
    })
  }

  handleMethodSelection=(methodSelected)=>{
    this.setState(prevState=>{
      let tmp=prevState.selectedMethods;
      tmp.push(methodSelected);
      return {selectedMethods:tmp};
    })
    console.log(this.state.selectedMethods);
  }

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

  handleDelete=(m)=>{
    this.setState(prevState=>{
      let tmp=prevState.selectedMethods.splice(m,1);
      return {selectedMethods:prevState.selectedMethods};
    })

  }

  createNewMethod=()=>{
    //apply rules
    // console.log(this.state.selection);
    // let method = new Method();
    // method.responseSchema={};
    let tmp=[];
    for(var i in this.state.selection){
      for(var j in this.state.selection[i]){
        if(this.state.selection[i][j].selected){
          let obj=this.state.selection[i][j];
          delete obj.selected;
          tmp.push(obj);
        }
      }
    }
    this.setState({selectedResponses:{...tmp}});
    this.handleOpen();
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
            spacing={8}
          >
            <Grid item xs={6}>
              <form>
                {elems}
                <br/>
                <Button variant="contained" color="primary" onClick={this.createNewMethod}>Create New Method</Button>
              </form>
            </Grid>
            <Grid item xs={6}>
              <SelectedMethodsDisplay methods={this.state.selectedMethods} handleDelete={this.handleDelete}/>
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
                  label="path"
                  value={this.state.form.path}
                  onChange={this.handleChange("path")}
                  margin="normal"
                />
                <br/>
                <TextField
                  disabled
                  fullWidth
                  label="type"
                  value={this.state.form.type}
                  onChange={this.handleChange("type")}
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
        </React.Fragment>
      );
    }
  }

  }

  export default MethodsDisplay
