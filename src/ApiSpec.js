import Method from './Method'

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
