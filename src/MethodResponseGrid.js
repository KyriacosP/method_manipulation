import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


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
      par.push(method.parameters[p].name);
    }
    par=par.join(" ");
    var rows=[];
    var schema=method.responseSchema;
    if(schema.type === "object"){
      var temp1 = Object.entries(schema.properties);
      for(var i in temp1){
        rows.push({selected:false,name: temp1[i][0], type: temp1[i][1].type, parameters:par});
      }
    }else{
      var temp2 = Object.entries(schema.items.properties);
      for(var j in temp2){
        rows.push({selected:false,name: temp2[j][0], type: temp2[j][1].type, parameters:par});
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
    this.setState({selection: selectedFeeds});
    // this.setState({selection: selectedFeeds}, () => {
    //   console.log(this.state.selection);
    // });
  }

  render() {
    if(!this.props.hidden){
    return (
      <MuiThemeProvider>
      <Table multiSelectable={true} onRowSelection={this.onRowSelection}>
      <TableHeader displaySelectAll={false}>
      <TableRow>
      <TableHeaderColumn>Name</TableHeaderColumn>
      <TableHeaderColumn>Type</TableHeaderColumn>
      <TableHeaderColumn>Parameters</TableHeaderColumn>
      </TableRow>
      </TableHeader>
      <TableBody deselectOnClickaway={false}>
      {this.state.selection.map(row => (
        <TableRow key={row.name} selected={row.selected}>
        <TableRowColumn>{row.name}</TableRowColumn>
        <TableRowColumn>{row.type}</TableRowColumn>
        <TableRowColumn>{row.parameters}</TableRowColumn>
        </TableRow>
      ))}
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
