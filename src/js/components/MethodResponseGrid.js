import React from 'react';
import MaterialTable from 'material-table';
import {ThemeProvider} from '@material-ui/styles';
import theme from '../themes/theme';
import { createMuiTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


class MethodResponseGrid extends React.Component {
  constructor(props){
    super(props);
    this.state={
      rows:[],
      selection: []
    };
  };

  //removes duplicated selections (bug in material-table)
  unique(array) {
    let arr = [];
    for(let i = 0; i < array.length; i++) {
      if(!arr.some(x=>x.id===array[i].id)) {
        arr.push(array[i]);
      }
    }
    return arr;
  }

  //recursive method to handle nested objects
  addProperties(properties,rows,path,parentId,par,operationId){
    let j=parentId;
    for(let i in properties){
      j++;
      rows.push({id:j, name: i,path:path+"."+i, type: properties[i].type, parameters:par, partof:operationId,parentId:parentId});
      if(Object.prototype.hasOwnProperty.call(properties[i], 'properties')){
        j=this.addProperties(properties[i].properties,rows,path+"."+i,j,par,operationId);
      }
      else if(properties[i].type==="array")
      {
        j=this.addProperties(properties[i].items.properties,rows,path+"."+i,j,par,operationId);
      }
    }
    return j;
  }

  //prepares top level responses for the MaterialTable calls addProperties for nested objects
  componentDidMount(){
    var method=this.props.method;
    var par=[];
    for (var p in method.parameters){
      par.push(method.parameters[p]);
    };
    var rows=[];
    var schema=method.responseSchema;
    if(Object.prototype.hasOwnProperty.call(schema, 'oneOf')){
      let j=1;
      rows.push({id:j, name: "oneOf", path: "oneOf", type: "oneOf", parameters:par, partof:method.operationId});
      j++
      for(let i in schema.oneOf){
        rows.push({id:j, name: "schema: "+i, path: "oneOf.schema"+i, type: "oneOf", parameters:par, partof:method.operationId,parentId:1});
        if(schema.type === "object"){
          j=this.addProperties(schema.oneOf[i].properties,rows,"oneOf.schema"+i+".",j,par,method.operationId);
        }
        else{
          j=this.addProperties(schema.oneOf[i].items.properties,rows,"oneOf.schema"+i+".Array",j,par,method.operationId);
        }
        j++;
      }

    }else if(schema.type === "object"){
      let j=1;
      for(let i in schema.properties){
        rows.push({id:j, name: i, path: i, type: schema.properties[i].type, parameters:par, partof:method.operationId});
        if(Object.prototype.hasOwnProperty.call(schema.properties[i], 'properties')){
          j=this.addProperties(schema.properties[i].properties,rows,i,j,par,method.operationId);
        }
        j++;
      }
    }else{
      rows.push({id:1, name: "", path:"Array", type: schema.type, parameters:par, partof:method.operationId});
      this.addProperties(schema.items.properties,rows,"Array",1,par,method.operationId);
    }
    this.setState({rows:rows});
  }

  render() {
    if(!this.props.hidden){
      return (
        <ThemeProvider theme={createMuiTheme(theme)}>
          <MaterialTable
            title={
              <div>
                <Typography variant="h6" color="textSecondary" >
                  Method: {this.props.method.type}  Path: {this.props.method.path}
                </Typography>
              </div>
              }
            data={this.state.rows}
            columns={[
              { title: 'Name', field: 'name' },
              { title: 'Type', field: 'type' },
              {
                title: 'Parameters',
                field: 'parameters',
                render: rowData=>rowData.parameters.map(x=>x.name).join(" ")
              }
            ]}
            parentChildData={(row, rows) => rows.find(a => a.id === row.parentId)}
            options={{
              selection: true,
              selectionProps: rowData => ({
                disabled: rowData.type === 'oneOf',
                color: 'secondary'
              }),
              showSelectAllCheckbox:false,
              grouping:false,
              sorting:false,
              search: false,
              paging: false
            }}
            onSelectionChange={(rows) => this.props.updateState(this.unique(rows))}

          />
        </ThemeProvider>
      )
    }else{
      return null;
    }
  }
}

export default MethodResponseGrid
