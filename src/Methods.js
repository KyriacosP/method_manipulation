import React from 'react';
import MethodContainer from './MethodContainer'

class Methods extends React.Component{
  constructor(){
    super();
    this.state={
      isLoading:false,
      apiDesc:{},
      paths:[]
    };
    this.manageData=this.manageData.bind(this);
  }

  componentDidMount(){
    this.setState({isLoading:true});
    fetch("http://localhost:1880/apidescription")
    .then(data=>data.json())
    .then(data=>this.setState({apiDesc: data}))
    .then(data=>this.manageData())
    .then(data=>this.setState({isLoading:false}))
  }

  manageData(onSuccess,onFail){
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
      //console.log(this.state.paths);
      const elems=[];
      for (const [path, method] of this.state.paths){
        elems.push(<MethodContainer key={path} path={path} method={method}/>);
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

  export default Methods
