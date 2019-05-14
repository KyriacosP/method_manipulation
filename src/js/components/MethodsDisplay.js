import React from 'react';
import MethodContainer from './MethodContainer'
import ApiSpec from '../dataclasses/ApiSpec'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';


class MethodsDisplay extends React.Component{
  constructor(){
    super();
    this.state={
      isLoading:false,
      apiDesc:{},
      selection:[]
    };


  }

  componentDidMount(){
    this.setState({isLoading:true});
    fetch("http://localhost:1880/apidescription")
    .then(data=>data.json())
    .then(data=>this.setState({apiDesc: new ApiSpec(data)}))
    .then(data=>console.log(this.state.apiDesc))
    .then(data=>this.setState({isLoading:false}))
  }

  updateGlobalSelection=(id,sel)=>{
    this.setState(prevState=>{
      prevState.selection[id]=sel;
      return {selection:prevState.selection}
    })
    console.log(this.state.selection);
  }


  render(){
    if(this.state.isLoading){
      return(
        <div>Loading...</div>
      );
    } else{
      const elems=[];
      for (var m in this.state.apiDesc.methods){
        elems.push(<MethodContainer key={m} id={m} updateGlobalSelection={this.updateGlobalSelection} method={this.state.apiDesc.methods[m]}/>);
      }
      return(
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={8}
        >
          <Grid item xs={6}>
            <form>
              {elems}
              <Button variant="contained" color="primary">Submit!</Button>
            </form>
          </Grid>
          <Grid item xs={6}>
            <Paper elevation={2}>Hello</Paper>
          </Grid>
        </Grid>
      );
    }
  }

  }

  export default MethodsDisplay
