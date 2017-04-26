app.directive("reloadClick",function($parse){
      return{
          link : function(scope,element,attr)
          {
              element.on('click',function(){
                  $parse(attr.reloadClick)(scope);
                  scope.$apply();
              })
          }
      }
})