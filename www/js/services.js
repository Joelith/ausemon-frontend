angular.module('app.services', [])
.factory('mcsService', function($q){
  var mcs_config = {
    "logLevel": mcs.logLevelVerbose,
    "mobileBackends": {
      "Ausemon": {
        "default": true,
        "baseUrl": "https://apacdemo2-apacmobile2.mobileenv.us2.oraclecloud.com",
        "applicationKey": "94b6a782-9723-4126-88d9-b13331168a00",
        "authorization": {
          "basicAuth": {
            "backendId": "3aeb7fa9-baea-4c35-89fd-2a8679da4b0f",
            "anonymousToken": "QVBBQ01PQklMRTJfQVBBQ0RFTU8yX01PQklMRV9BTk9OWU1PVVNfQVBQSUQ6ZXpoYS43anIwV2Nsc3Q="
          }
        }
      }
    }
  };
  console.log(mcs_config);
  // initialize MCS mobile backend
  mcs.MobileBackendManager.setConfig(mcs_config);
  var mbe = mcs.MobileBackendManager.getMobileBackend('Ausemon');
  mbe.setAuthenticationType("basicAuth");

  var authenticate = function(username,password) {
     var deferred = $q.defer();
      mbe.Authorization.authenticate(username, password 
      , function(statusCode,data) {deferred.resolve(statusCode,data)}
      , function(statusCode,data) {deferred.reject(statusCode,data)});         
      return deferred.promise;
   };     
   
   var authenticateAnonymous = function() {
    console.log('deffered?');
     var deferred = $q.defer();
      mbe.Authorization.authenticateAnonymous(
        function(statusCode,data) {deferred.resolve(statusCode,data)}
      , function(statusCode,data) {deferred.reject(statusCode,data)});         
      return deferred.promise;
   };     
   
   var logout = function() {
      var deferred = $q.defer();
      mbe.Authorization.logout(
        function(statusCode,data) {deferred.resolve(statusCode,data)}
      , function(statusCode,data) {deferred.reject(statusCode,data)});         
      return deferred.promise;
   };

  var invokeCustomAPI = function(uri,method,payload) {
    console.log('INVOKE');
    var deferred = $q.defer();
    mbe.CustomCode.invokeCustomCodeJSONRequest(uri , method , payload
      , function(statusCode,data) {deferred.resolve(data)}
      , function(statusCode,data) {deferred.reject(statusCode,data)});         
    return deferred.promise;
  };

   return {
     authenticate:authenticate,
     authenticateAnonymous:authenticateAnonymous,
     logout:logout,
     invokeCustomAPI:invokeCustomAPI
  }
});
