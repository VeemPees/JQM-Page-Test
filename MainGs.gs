function fetchServices()
{
  try {
    var dataSet = {};
    var data = [];
    
    for (var r = 0, l = 5; r < l; r++) {
      
      var service  = {};
      
      service.id = r;
      service.name = "Service " + r;
      
      data.push(service);
      
    }
  
    dataSet.Services = data;
    
    return dataSet;
  } catch(e) {
    logException(e);
  }
}

