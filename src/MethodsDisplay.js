import React from 'react';
import MethodContainer from './MethodContainer'
import ApiSpec from './ApiSpec'

class MethodsDisplay extends React.Component{
  constructor(){
    super();
    this.state={
      isLoading:false,
      apiDesc:{},
      paths:[]
    };


  }

  componentDidMount(){
    this.setState({isLoading:true});
    fetch("http://localhost:1880/apidescription")
    .then(data=>data.json())
    .then(data=>this.setState({apiDesc: new ApiSpec(data)}))
    .then(data=>console.log(this.state.apiDesc))
    // .then(data=>this.manageData())
    .then(data=>this.setState({isLoading:false}))
  }

  // componentDidMount(){
  //   this.setState({isLoading:true});
  //   fetch("http://localhost:1880/apidescription")
  //   .then(data=>data.json())
  //   .then(data=>this.setState({apiDesc: data}))
  //   .then(data=>this.manageData())
  //   .then(data=>this.setState({isLoading:false}))
  // }

  manageData=(onSuccess,onFail)=>{
    // return new Promise((resolve, reject) => {
    //   setTimeout(function() {
    //     resolve(alert("hi"));
    //   }, 2000);
    // })
    return new Promise((resolve, reject) => {
      let p = Object.entries(this.state.apiDesc.paths);
      this.setState({paths:p});
      resolve(true);
    })
  }


  render(){
    if(this.state.isLoading){
      return(
        <div>Loading...</div>
      );
    } else{
      const elems=[];
      for (var m in this.state.apiDesc.methods){
        elems.push(<MethodContainer key={m} method={this.state.apiDesc.methods[m]}/>);
      }
      return(
        <form>
          {elems}
          <button>Submit!</button>
        </form>
      );
    }
  }

  }

  export default MethodsDisplay
