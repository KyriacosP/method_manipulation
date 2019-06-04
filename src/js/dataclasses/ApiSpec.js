import Method from './Method'

//used as a helper class to parse  and handle the openapi spec
class ApiSpec {
  constructor(spec){
    this.openapi=spec.openapi;
    this.info=spec.info;
    this.servers=spec.servers;
    this.methods=[];
    for(var p in spec.paths){
      this.methods.push(new Method(p,spec.paths[p]))
    }
  }
}

export default ApiSpec
