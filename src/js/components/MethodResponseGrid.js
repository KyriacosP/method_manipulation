import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const styleGrid = {
  marginTop: "-1em",
  marginBottom: "1em",
  backgroundColor: "primary"
};

class MethodResponseGrid extends React.Component{
  constructor(props){
    super(props);
    this.state={
      rows:[],
      selection: []
    };

  }

  componentDidMount(){
    var method=this.props.method;
    var par=[];
    for (var p in method.parameters){
      par.push(method.parameters[p]);
    }
    //par=par.join(" ");
    var rows=[];
    var schema=method.responseSchema;
    if(schema.type === "object"){
      var temp1 = Object.entries(schema.properties);
      for(var i in temp1){
        rows.push({selected:false,name: temp1[i][0], type: temp1[i][1].type, parameters:par, partof:method.operationId});
        // if(Object.prototype.hasOwnProperty.call(temp1[i][1], 'properties')){
        //   console.log(temp1[i][1].properties);
        //   var pro = Object.entries(temp1[i][1].properties);
        //   for(let j in pro){
        //     rows.push({selected:false,name: pro[j][0], type: pro[j][1].type, parameters:par, partof:method.operationId,member:temp1[i][0]});
        //   }
        // }
      }

    }else{
      var temp2 = Object.entries(schema.items.properties);
      for(var j in temp2){
        rows.push({selected:false,name: temp2[j][0], type: temp2[j][1].type, parameters:par, partof:method.operationId});
      }
    }

    this.setState({selection:rows})

  }

  onRowSelection=(rows)=>{
    const selectedFeeds = [];
    this.state.selection.forEach((feed, i) => {
      feed.selected = rows.indexOf(i) > -1;
      selectedFeeds.push(feed);
    });
    //this.setState({selection: selectedFeeds});
    this.setState({selection: selectedFeeds}, () => {
      this.props.updateState(selectedFeeds);
      // console.log(this.state.selection);
    });
  }

  // {this.state.selection.map(row => (
  //   <TableRow key={row.name} selected={row.selected}>
  //     <TableRowColumn style={{width: '50%',margin: 0}}>{row.name}</TableRowColumn>
  //     <TableRowColumn style={{width: '20%',margin: 0}}>{row.type}</TableRowColumn>
  //     <TableRowColumn style={{width: '30%',margin: 0}}>{row.parameters}</TableRowColumn>
  //   </TableRow>
  // ))}


  // createRows=(rows)=>{
  //   let tmp=rows.map(row => (
  //     <TableRow key={row.name} selected={row.selected}>
  //       <TableRowColumn style={{width: '50%',margin: 0}}>{row.name}{Object.prototype.hasOwnProperty.call(row, 'member') ? (" ("+row.member+")"):null}</TableRowColumn>
  //       <TableRowColumn style={{width: '20%',margin: 0}}>{row.type}</TableRowColumn>
  //       <TableRowColumn style={{width: '30%',margin: 0}}>{row.parameters}</TableRowColumn>
  //     </TableRow>
  //   ))
  //
  //   return tmp;
  //
  // }

  createRows=(rows)=>{
    let tmp=rows.map(row => (
      <TableRow key={row.name} selected={row.selected}>
        <TableRowColumn style={{width: '50%',margin: 0}}>{row.name}</TableRowColumn>
        <TableRowColumn style={{width: '20%',margin: 0}}>{row.type}</TableRowColumn>
        <TableRowColumn style={{width: '30%',margin: 0}}>{row.parameters.map(x=>x.name).join(" ")}</TableRowColumn>
      </TableRow>
    ))

    return tmp;

  }

  render() {
    if(!this.props.hidden){
      return (
        <MuiThemeProvider >
          <Table style={styleGrid} multiSelectable={true} onRowSelection={this.onRowSelection}>
            <TableHeader displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn style={{width: '50%',margin: 0}}>Name</TableHeaderColumn>
                <TableHeaderColumn style={{width: '20%',margin: 0}}>Type</TableHeaderColumn>
                <TableHeaderColumn style={{width: '30%',margin: 0}}>Parameters</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody deselectOnClickaway={false}>
              {this.createRows(this.state.selection)}
            </TableBody>
          </Table>
        </MuiThemeProvider>
      );
    }else{
      return null;
    }
  }
}
export default MethodResponseGrid
