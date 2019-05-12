class Method {
  constructor(path,desc){
    this.path=path;
    this.type=Object.keys(desc)[0];
    this.summary=desc[this.type].summary;
    this.description=desc[this.type].description;
    this.operationId=desc[this.type].operationId;
    this.parameters=desc[this.type].parameters;
    this.responseSchema=desc[this.type].responses['200'].content['application/json'].schema;
    //console.log(this.summary);
  }
}

export default Method
