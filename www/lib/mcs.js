"use strict";

(function() {
  var g = typeof window != 'undefined' ? window : global;

  g.mcs = g.mcs || {};
  g.mcs._Logger = g.mcs._Logger || {};
}());


/**
 * Only errors will be logged.
 * @memberof mcs
 * @constant
 * @name logLevelError
 * @type {Number}
 */
mcs.logLevelError = 1;

/**
 * Only important events will be logged. This is the default setting.
 * @memberof mcs
 * @constant
 * @name logLevelInfo
 * @type {Number}
 */
mcs.logLevelInfo = 2;

/**
 * Enables verbose logging.
 * @memberof mcs
 * @constant
 * @name logLevelVerbose
 * @type {Number}
 */
mcs.logLevelVerbose = 3;


mcs._Logger.logLevel = mcs.logLevelInfo;

mcs._Logger.Exception = function(message){
  this.message = message;
  this.name = "Exception";
    console.log(this.name + " : " + this.message);
};

mcs._Logger.debug = function (tag, message) {
    console.log(tag + ' ' + message);
};

mcs._Logger.log = function(level, message) {
  if(mcs._Logger.logLevel >= level) {
    console.log(message);
  }
};

"use strict";
/** @ignore */

(function() {

  var g = typeof window != 'undefined' ? window : global;

  g.mcs = g.mcs || {};
  g.mcs._Utils = g.mcs._Utils || {};
}());


var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

mcs._Utils.uuid = function () {

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0,
      v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
};

mcs._Utils.validateConfiguration = function(input){
  var prop = input;
  if (/\s/.test(prop) && prop != undefined) {
    prop = removeSpace(input);
  }
  return prop;
};

var removeSpace = function(input) {
  return input.replace(/ /g, '');
};


mcs._Utils.encodeBase64 = function(input) {

  var output = "";
  var chr1, chr2, chr3 = "";
  var enc1, enc2, enc3, enc4 = "";

  var i = 0;
  do {
    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);

    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }

    output = output +
    keyStr.charAt(enc1) +
    keyStr.charAt(enc2) +
    keyStr.charAt(enc3) +
    keyStr.charAt(enc4);
    chr1 = chr2 = chr3 = "";
    enc1 = enc2 = enc3 = enc4 = "";
  } while (i < input.length);

  return output;
};

mcs._Utils.decodeBase64 = function(input) {

  var output = "";
  var chr1, chr2, chr3 = "";
  var enc1, enc2, enc3, enc4 = "";
  var i = 0;

  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  var base64test = /[^A-Za-z0-9\+\/\=]/g;
  if (base64test.exec(input)) {
    return null;
  }

  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

  do {
    enc1 = keyStr.indexOf(input.charAt(i++));
    enc2 = keyStr.indexOf(input.charAt(i++));
    enc3 = keyStr.indexOf(input.charAt(i++));
    enc4 = keyStr.indexOf(input.charAt(i++));

    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;

    output = output + String.fromCharCode(chr1);

    if (enc3 != 64) {
      output = output + String.fromCharCode(chr2);
    }

    if (enc4 != 64) {
      output = output + String.fromCharCode(chr3);
    }

    chr1 = chr2 = chr3 = "";
    enc1 = enc2 = enc3 = enc4 = "";
  } while (i < input.length);
  return output;
};

mcs._Utils.hasValue = function(obj, key, value) {

  return obj.hasOwnProperty(key) && obj[key] === value;
};

"use strict";

/** @ignore */


var _deviceId = mcs._Utils.uuid();

/**
 * Base class for platform specific capabilities. Users may derive to provide implementations specific to their platform.
 * @constructor
 * @abstract
 */
var Platform = function() {


  /**
   * Performs an HTTP request.
   * @param request {Object} The format of the request parameter is identical to the settings parameter in
   * [JQuery's ajax]{@link http://api.jquery.com/jQuery.ajax/} method, however, only the method, url, headers ,data, success
   * and error properties are used.
   * @abstract
   */
  this.invokeService = function(request) {
    throw mcs._Logger.Exception("invokeService() not implemented in Platform!");
  };

  /**
   * Returns a device ID used by [Diagnostics]{@link Diagnostics}.
   * @returns {String} The device ID.
   */
  this.getDeviceId = function() {
    return _deviceId;
  };

  /**
   * Class that provides the current GPS location of the device.
   * @typedef {Object} Platform~GPSLocation
   * @property {String} latitude - The device's current latitude.
   * @property {String} longitude - The device's current longitude.
   */

  /**
   * Returns an object that has the current GPS location of the device or null.
   * @returns {Platform~GPSLocation} The GPS location is available.
   */
  this.getGPSLocation = function() {
    return {
      "latitude": null,
      "longitude": null
    };
  };

  /**
   * Class that provides information about the device.
   * @typedef {Object} Platform~DeviceInformation
   * @property {String} model - The device's model.
   * @property {String} manufacturer - The device's manufacturer.
   * @property {String} osName - The operating system.
   * @property {String} osVersion - The operating system's version.
   * @property {String} osBuild - The operating system's build number.
   * @property {String} carrier - The device's wireless carrier.
   */

  /**
   * Returns an object with device information used by [Analytics]{@link Analytics}
   * @returns {Platform~DeviceInformation} The device specific information.
   */
  this.getDeviceInformation = function() {
    return {
      "model": "<unknown>",
      "manufacturer": "<unknown>",
      "osName": "<unknown>",
      "osVersion": "<unknown>",
      "osBuild": "<unknown>",
      "carrier": "<unknown>"
    };
  };

  this._deviceState = mcs.DeviceState.unrestricted;
  this._deviceStateChangedCallbacks = [];

  /**
   * Sets the current state of the device. Platform implementations should call this function
   * when the state changes. The state is inspected before background operations
   * like synchronization are performed.
   * @param state {mcs.DeviceState} The new state of the device.
   */
  this.setDeviceState = function(state) {
    if(this._deviceState != state) {

      mcs._Logger.log(mcs.logLevelInfo, "Device state changing from " + this._deviceState + " to " + state);

      this._deviceState = state;

      for(var i=0; i<this._deviceStateChangedCallbacks.length; i++) {
        this._deviceStateChangedCallbacks[i](this._deviceState);
      }
    }
  };

  /**
   * Implementors can override this function to cache user credentials for offline login. The default implementation
   * is a no-op.
   * @param username {String} The user name.
   * @param password {String} The password.
   */
  this.cacheCredentials = function(username, password) {
  };

  /**
   * Implementors can override this function to allow offline login. [cacheCredentials()]{Platform#cacheCredentials}
   * should also be overridden to cache the credentials. The default implementation returns false.
   *
   * @param username {String} The user name.
   * @param password {String} The password.
   * @returns {Boolean} True if the username and password are valid, false otherwise.
   */
  this.validateCachedCredentials = function(username, password) {
    return false;
  }
};

(function() {
  var g = typeof window != 'undefined' ? window : global;

  g.mcs = g.mcs || {};
  g.mcs.Platform = Platform;

  var mcs = g.mcs;

  /**
   * Enum values for [Platform.setDeviceState()]{@link Platform#setDeviceState}.
   * @memberof mcs
   * @enum
   */
  mcs.DeviceState = {
    /**
     * Indicates that the device is offline.
     * @type {Number}
     */
    offline: 0,

  /**
   * Indicates that the device is online and network and battery state allow for unrestricted
   * background processing.
   * @type {Number}
   */
  unrestricted: 1,

  /**
   * Indicates that the device is online and network and battery state allow for only restricted
   * important background processing.
   * @type {Number}
   */
  restricted: 2,

  /**
   * Indicates that the network and battery state do not allow for any background processing ex.
   * the device may be on a roaming data network or the battery charge level may be low.
   * @type {Number}
   */
  critical: 3
  };
}());

"use strict";


/**
 * Platform class for browser applications. Derives from [Platform]{@link Platform}.
 * @constructor
 */

var BrowserPlatform = function() {

  this.isBrowser = true;

  this.isCordova = false;

  this.invokeService = function (request) {
    var xhr = new XMLHttpRequest();
    xhr.open(request.method, request.url);

    for(var key in request.headers){
      if(request.headers.hasOwnProperty(key)) {
        xhr.setRequestHeader(key, request.headers[key]);
      }
    }
    xhr.withCredentials = true;
    xhr.responseType = request.responseType || 'json';
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status <= 299) {
          if (request.success != null) {
            var jsonResponse = xhr.response;
            if(typeof xhr.response == "string"){
              jsonResponse = xhr.response == "" ? {} : JSON.parse(xhr.response);
            }
            request.success(xhr, jsonResponse);
          }
        }
        else{
          if(request.error != null){
            request.error(xhr.status, xhr.response)
          }
        }
      }
    };
    xhr.send(request.body);
  }
};

(function() {

  BrowserPlatform.prototype = new mcs.Platform();

  var g = typeof window != 'undefined' ? window : global;
  g.mcs = g.mcs|| {};
  g.mcs.BrowserPlatform = BrowserPlatform;
}());

"use strict";

/**
 * Class that holds an analytics event.
 * @constructor
 */
function AnalyticsEvent(name) {

  // type and sessionID will be added dynamically if required, so that if they are not required they won't get serialized
  // on the wire in JSON.

  /**
   * The name of the event.
   * @type(String)
   */
  this.name = name;

  /**
   * The timestamp of the event, the system will populate with the current time by default.
   * @type(String)
   */
  this.timestamp = new Date().toISOString();

  /**
   * The ID of the current session.
   * @type {String}
   */
  this.sessionID = null;
  delete this.sessionID; // Just so that we can document!

  /**
   * Custom caller specifiable properties as key/value strings.
   * @type {Object}
   */
  this.properties = {};
}

(function() {
  var g = typeof window != 'undefined' ? window : global;

  g.mcs= g.mcs|| {};
  g.mcs.AnalyticsEvent = AnalyticsEvent;
}());

"use strict";

/**
 * Class that provides analytics capabilities. Callers should use
 * MobileBackend's [Analytics()]{@link MobileBackend#Analytics} property.
 * @constructor
 */
function Analytics(backend) {

  /**
   * The [MobileBackend]{@link MobileBackend} object that this Analytics instance belongs to.
   * @type {MobileBackend}
   * @readonly
   */
  this.backend = backend;

  /**
   * The current session's ID if a session exists.
   * @type {String}
   */
  this.sessionID = null;

  this._events = [];

  /**
   * Returns session Id for current session.
   */
  this.getSessionId = function(){
    return this.sessionID;
  };

  /**
   * Starts a new session. If one is in progress, then a new session will not be created.
   */
  this.startSession = function () {
    if (this.sessionID == null) {
      this.sessionID = mcs._Utils.uuid();
      this.logNamedEvent("sessionStart").type = "system";
    }
  };

  /**
   * Ends a session if one exists.
   */
  this.endSession = function (successCallback, errorCallback) {
    if (this.sessionID != null) {
      this.logNamedEvent("sessionEnd").type = "system";
      mcs._Logger.log("Deactivate a default session");
      this.flush(successCallback,errorCallback);
      this.sessionID = null;
    }
  };

  /**
   * Creates a new analytics event with the given name.
   * @param name {String} The name of the event.
   * @returns {AnalyticsEvent} The [AnalyticsEvent]{@link AnalyticsEvent} instance that was logged.
   */
  this.logNamedEvent = function (name) {
    var event = new mcs.AnalyticsEvent(name);
    this.logEvent(event);
    return event;
  };

  /**
   * Writes out an analytics event. It will implicitly call startSession(),
   * which will adds a new event to the list of events for the Mobile Cloud Service to consume
   * @param event {AnalyticsEvent} The event to log.
   * @example event: "GettingStartedJSEvent"
   * @returns {AnalyticsEvent} The [AnalyticsEvent]{@link AnalyticsEvent} instance that was logged.
   */
  this.logEvent = function (event) {
    if (this._events.length == 0) {
      this._events[0] = this._createContextEvent();
    }

    this.startSession();
    this._events[this._events.length] = event;
    event.sessionID = this.sessionID;

    return event;
  };

  /**
   * Callback invoked after successfully flushing analytics events.
   * @callback Analytics~flushSuccessCallback
   */

  /**
   * Callback invoked on error.
   * @callback Analytics~errorCallback
   * @param statusCode {Number} Any HTTP status code returned from the server, if available.
   * @param message {String} The HTTP payload from the server, if available, or an error message.
   */

  /**
   * Uploads all events to the service if the device is online or caches them locally until the device goes online at
   * which point they will be uploaded. If a session is in progress it will end.
   * @param successCallback {Analytics~flushSuccessCallback} Callback invoked on success.
   * @param errorCallback {Analytics~errorCallback} Callback invoked on error.
   */
  this.flush = function (successCallback, errorCallback) {
    for (var i = 0; i < this._events.length; i++) {
      if (this._events[i].name == "context") {

        var gpsLocation = mcs.MobileBackendManager.platform.getGPSLocation();
        if (gpsLocation != null && gpsLocation.latitude != null) {
          this._events[i].properties.latitude = gpsLocation.latitude;
        }

        if (gpsLocation != null && gpsLocation.longitude != null) {
          this._events[i].properties.longitude = gpsLocation.longitude;
        }
      }
    }

    var eventsString = JSON.stringify(this._events);

    var analytics = this;
    var headers = analytics.backend.getHttpHeaders();
    headers["Content-Type"] = "application/json";
    headers["Content-Length"] = eventsString.length;

    mcs.MobileBackendManager.platform.invokeService({
      method: 'POST',
      url: analytics.backend.getPlatformUrl("analytics/events"),
      headers: headers,
      body: eventsString,
      success: function () {
        mcs._Logger.log("Analytics events flushed.");
        analytics._events = [];
        if (successCallback != null) {
          successCallback();
        }
      },
      error: function (statusCode, data) {
        mcs._Logger.log("Failed to flush analytics events.");
        if (errorCallback != null) {
          errorCallback(statusCode, data);
        }
      }
    });
  };

  this._createContextEvent = function () {
    var contextEvent = new mcs.AnalyticsEvent("context");
    contextEvent.type = "system";
    contextEvent.properties.timezone = "" + new Date().getTimezoneOffset() * 60;

    var deviceInformation = mcs.MobileBackendManager.platform.getDeviceInformation();
    contextEvent.properties.model = deviceInformation.model;
    contextEvent.properties.manufacturer = deviceInformation.manufacturer;
    contextEvent.properties.osName = deviceInformation.osName;
    contextEvent.properties.osVersion = deviceInformation.osVersion;
    contextEvent.properties.osBuild = deviceInformation.osBuild;
    contextEvent.properties.carrier = deviceInformation.carrier;

    return contextEvent;
  };
}

(function() {
  var g = typeof window != 'undefined' ? window : global;

  g.mcs= g.mcs || {};
  g.mcs._Analytics = Analytics;
}());

"use strict";

/**
 * Class used to authorize a mobile user against the Mobile Cloud Service. Callers should use
 * MobileBackend's [Authorization()]{@link MobileBackend#Authorization} property.
 * @constructor
 */
function Authorization(config, backend, type) {

  /**
   * The Authentication Type when we begin to add different types of login schemas like Facebook, Google, etc..
   * @type {String}
   */
  this.AuthenticationType = type;

  /**
   * The [MobileBackend]{@link MobileBackend} object that this Synchronization instance belongs to.
   * @type {MobileBackend}
   * @readonly
   */
  this.backend = backend;

  /**
   * The config object gathered from the configuration file.
   * @type {Object}
   */
  this.config = config;

  /**
   * The access token returned by the service after a successful call to authenticate() or authenticateAnonymous().
   * @type {String}
   */
  this.token = null;

  /**
   * Returns the username of the current authorized user if any, null otherwise.
   * @type {String}
   */
  this.authorizedUserName = null;


  var auth = this;

  /**
   * Callback invoked after successfully authenticating.
   * @callback Authorization~authenticateSuccessCallback
   * @param statusCode {Number} Any HTTP status code returned from the server, if available.
   * @param message {String} The HTTP payload from the server, if available, or an error message.
   */

  /**
   * Callback invoked on error while authenticating.
   * @callback Authorization~authenticateErrorCallback
   * @param statusCode {Number} Any HTTP status code returned from the server, if available.
   * @param message {String} The HTTP payload from the server, if available, or an error message.
   */

  /**
   * Authenticates an anonymous user against the service. The user remains logged in until logout() is called.
   * @param successCallback {Authorization~authenticateSuccessCallback} Optional callback invoked on success.
   * @param errorCallback {Authorization~authenticateErrorCallback} Optional callback invoked on failure.
   */
  this.authenticateAnonymous = function(successCallback, errorCallback) {
  };

  /**
   * Authenticates a user with the given credentials against the service. The user remains logged in until logout() is called.
   * @param username {String} The username of the credentials.
   * @param password {String} The password of the credentials.
   * @param successCallback {Authorization~authenticateSuccessCallback} Optional callback invoked on success.
   * @param errorCallback {Authorization~errorCallback} Optional callback invoked on failure.
   */
  this.authenticate = function(username, password, successCallback, errorCallback) {
  };

  /**
   * Returns true if a user has been authorized, false otherwise. A user can be authorized by calling authenticate() or authenticateAnonymous().
   * @returns {Boolean}
   */
  this.isAuthorized = function() {
    return this.token != null;
  };

  /**
   * Returns true if the access token returned by the service is still valid.
   * @returns {Boolean}
   */
  this.isTokenValid = function() {
    return this.token != null;
  };

  /**
   * Refreshes the authentication token if it has expired. The authentication scheme should support refresh.
   * @param successCallback {Authorization~authenticateSuccessCallback} Optional callback invoked on success.
   * @param errorCallback {Authorization~errorCallback} Optional callback invoked on failure.
   */
  this.refreshToken = function(successCallback, errorCallback) {
  };

  /**
   * Logs out the current user and clears credentials and tokens.
   */
  this.logout = function() {
    this.token = null;
    this.authorizedUserName = null;
  };

  /**
   * Callback invoked after downloading or updating a user resource.
   * @callback Authorization~userSuccessCallback
   * @param statusCode {Number} Any HTTP status code returned from the server, if available.
   * @param user {User} The user resource returned by the service.
   */

  /**
   * Returns the user resource associated with the logged in user.
   * @param successCallback {Authorization~userSuccessCallback} Optional callback invoked on success.
   * @param errorCallback {Authorization~errorCallback} Optional callback invoked on failure.
   * @returns {Object} returns the user with all the properties associated with that user.
   * @example <caption>Example usage of mcs.MobileBackend.Authorization.getCurrentUser()</caption>
   * mcs.MobileBackend.Authorization.getCurrentUser(
   * function(statusCode, data){
   * },
   * function(statusCode, data){
   * });
   * // returns statusCode, and the user object on successCallback function from the data parameter.
   {
     "id": "c9a5fdc5-737d-4e93-b292-d258ba334149",
     "username": "DwainDRob",
     "email": "js_sdk@mcs.com",
     "firstName": "Mobile",
     "lastName": "User",
     "properties": {}
   }
   */
  this.getCurrentUser = function(successCallback, errorCallback) {

    mcs.MobileBackendManager.platform.invokeService({
      method: 'GET',
      url: auth.backend.getPlatformUrl("users/~"),
      headers: auth.backend.getHttpHeaders(),

      success: function(response, data) {
        if(successCallback != null) {
          var user = new mcs.User(data);
          if(user.links != null) {
            delete user.links;
          }
          successCallback(response.status,user);
        }
      },
      error: function(statusCode, data) {
        if(errorCallback != null) {
          errorCallback(statusCode, data);
        }
      }
    });
  };

  ///**
  // * Updates the user resource for the currently logged in user.
  // * @param user {Authorization~User} The user resource to update
  // * @param successCallback {Authorization~userSuccessCallback} Optional callback invoked on success.
  // * @param errorCallback {Authorization~errorCallback} Optional callback invoked on failure.
  // */
  //this.updateCurrentUser = function(user, successCallback, errorCallback) {
  //  if(!this.token) {
  //    if(failureCallback != null) {
  //      failureCallback("No logged in user!");
  //      return;
  //    }
  //  }
  //
  //  var auth = this;
  //  var userString = JSON.stringify(user);
  //  var headers = auth.backend.getHttpHeaders();
  //  headers["Accept"] = "application/json";
  //  headers["Accept-Encoding"] = "gzip";
  //  headers["Content-Type"] = "application/json";
  //  headers["Content-Length"] = userString.length;
  //
  //  mcs.MobileBackendManager.platform.invokeService({
  //    method: 'PUT',
  //    url: auth.backend.getPlatformUrl("users/~"),
  //    headers: headers,
  //    body: userString,
  //    success: function(response, data) {
  //      if(successCallback != null) {
  //        successCallback(response.status, data);
  //      }
  //    },
  //    error: function(statusCode, data) {
  //      if(errorCallback != null) {
  //        errorCallback(statusCode, data);
  //      }
  //    }
  //  });
  //};

  this._getHttpHeaders = function(headers) {
  };
}

(function() {

  var g = typeof window != 'undefined' ? window : global;

  g.mcs = g.mcs || {};
  g.mcs.Authorization = Authorization;

  /**
   * Basic Auth Authentication Type
   * @type {string}
   */
  g.mcs.AuthenticationTypeBasic = "basicAuth";

  /**
   * OAuth Authentication Type
   * @type {string}
   */
  g.mcs.AuthenticationTypeOAuth = "oAuth";

  /**
   * Single Sign On Authentication Type
   * @type {string}
   */
  g.mcs.AuthenticationTypeSSO = "ssoAuth";

  /**
   * Facebook OAuth Authentication Type
   * @type {string}
   */
  g.mcs.AuthenticationTypeFacebook = "facebookAuth";
}());

"use strict";

/**
 * Class used to authorize a mobile user against the Mobile Cloud Service. Callers should use
 * MobileBackend's [BasicAuthorization()]{@link MobileBackend#Authorization} property.
 * @constructor
 */
function BasicAuthorization(config, backend, appKey) {

  Authorization.call(this, config, backend, mcs.AuthorizationTypeBasic);

  var _backendId = mcs._Utils.validateConfiguration(config.backendId);
  var _anonymousToken = mcs._Utils.validateConfiguration(config.anonymousToken);
  var _appKey = mcs._Utils.validateConfiguration(appKey);

  var AuthorizationHeader = "Authorization";
  var BackendIdHeader = "Oracle-Mobile-Backend-Id";
  var ApplicationKeyHeader = "Oracle-Mobile-Application-Key";

  var anonymousAccessToken = null;
  var AccessToken = null;
  var isAuthorized = false;
  var isAnonymous = false;

  var basicAuth = this;

  /**
   * Returns anonymous token for the current backend.
   */
  this.getAnonymousToken = function(){
    return _anonymousToken;
  };

  /**
   * Returns application key for the current backend.
   */
  this.getApplicationKey = function(){
    return _appKey;
  };

  /**
   * Returns the backendId for the current backend.
   */
  this.getBackendId = function(){
    return _backendId;
  };

  /**
   * Returns the current access token from user credentials.
   * @return current access token from user credentials.
   */
  this.getAccessToken = function () {
    return AccessToken;
  };

  /**
   * Sets the accessToken for using the current access token from user credentials.
   * @param accesstoken
   */
  this.setAccessToken = function (accesstoken) {
    AccessToken = accesstoken;
  };

  /**
   * Returns the current anonymous access token.
   * @return current anonymous access token.
   */
  this.getAnonymousAccessToken = function () {
    return anonymousAccessToken;
  };

  /**
   * Sets the current anonymous access token.
   * @param accesstoken
   */
  this.setAnonymousAccessToken = function (accesstoken) {
    anonymousAccessToken = accesstoken;
  };

  /**
   * Returns the current isAuthorized variable value.
   * @return current isAuthorized variable value.
   */
  this.getIsAuthorized = function () {
    return isAuthorized;
  };

  /**
   * Sets the current isAuthorized variable value.
   * @param authorized
   */
  this.setIsAuthorized = function (authorized) {
    isAuthorized = authorized;
  };

  /**
   * Returns the current isAnonymous variable value.
   * @return current isAnonymous variable value.
   */
  this.getIsAnonymous = function () {
    return isAnonymous;
  };

  /**
   * Sets the current isAnonymous variable value.
   * @param anonymous
   */
  this.setIsAnonymous = function (anonymous) {
    isAnonymous = anonymous;
  };

  /**
   * The [MobileBackend]{@link MobileBackend} object that this Authorization instance belongs to.
   * @type {MobileBackend}
   * @readonly
   */
  this.backend = backend;

  /**
   * Callback invoked after successfully authenticating.
   * @callback Authorization~authenticateSuccessCallback
   * @param statusCode {Number} Any HTTP status code returned from the server, if available.
   * @param message {String} The HTTP payload from the server, if available, or an error message.
   */

  /**
   * Callback invoked on error while authenticating.
   * @callback Authorization~authenticateErrorCallback
   * @param statusCode {Number} Any HTTP status code returned from the server, if available.
   * @param message {String} The HTTP payload from the server, if available, or an error message.
   */

  /**
   * Authenticates a user with the given credentials against the service. The user remains logged in until logout() is called.
   * @param username {String} The username of the credentials.
   * @param password {String} The password of the credentials.
   * @param successCallback {Authorization~authenticateSuccessCallback} Optional callback invoked on success.
   * @param errorCallback {Authorization~authenticateErrorCallback} Optional callback invoked on failure.
   */
  this.authenticate = function (username, password, successCallback, errorCallback) {

    basicAuth.logout();

    if (!username || !password) {
      mcs._Logger.log(mcs.logLevelError, "Wrong username or password parameter");
      if (errorCallback) {
        errorCallback(400, 'Bad Request');
      }
      return;
    }

    var currentToken = "Basic " + mcs._Utils.encodeBase64(username + ":" + password);

    mcs.MobileBackendManager.platform.invokeService({
      url: basicAuth.backend.getPlatformUrl("users/login"),
      method: 'GET',
      headers: {
        "Authorization": currentToken,
        "Oracle-Mobile-Backend-Id": basicAuth.getBackendId(),
        "Oracle-Mobile-Application-Key": basicAuth.getApplicationKey()
      },
      success: function (response, data) {
        mcs._Logger.log(mcs.logLevelInfo, "User " + username + " logged in");
        basicAuth.setIsAuthorized(true);
        basicAuth.setIsAnonymous(false);
        basicAuth.setAccessToken(currentToken);
        basicAuth.authorizedUserName = username;

        if (successCallback != null) {
          successCallback(response.status, data);
        }
      },

      error: function(statusCode, data) {
        mcs._Logger.log(mcs.logLevelError,  "Login failed with error: " + statusCode);

        clearState();

        if(errorCallback != null) {
          errorCallback(statusCode, data);
        }
      }
    });
  };

  /**
   * Authenticates an anonymous user against the service. The user remains logged in until logout() is called.
   * @param successCallback {Authorization~authenticateSuccessCallback} Optional callback invoked on success.
   * @param errorCallback {Authorization~authenticateErrorCallback} Optional callback invoked on failure.
   */
  this.authenticateAnonymous = function (successCallback, errorCallback) {

    basicAuth.logout();

    var currentToken = "Basic " + basicAuth.getAnonymousToken();

console.log('anon call to ', basicAuth.backend.getPlatformUrl("users/login"));
console.log('auth:', basicAuth.getAnonymousToken());
console.log('backend:', basicAuth.getBackendId());
console.log('key:', basicAuth.getApplicationKey());

 basicAuth.setIsAuthorized(true);
        basicAuth.setIsAnonymous(true);
        basicAuth.setAnonymousAccessToken(currentToken);
                  successCallback(200, '');


   /* mcs.MobileBackendManager.platform.invokeService({
      url: basicAuth.backend.getPlatformUrl("users/login"),
      method: 'GET',
      headers: {
        "Authorization": currentToken,
        "Oracle-Mobile-Backend-Id": basicAuth.getBackendId(),
        "Oracle-Mobile-Application-Key": basicAuth.getApplicationKey()
      },
      success: function (response, data) {
        console.log('user logged in anon');
        mcs._Logger.log(mcs.logLevelInfo, "User logged in anonymously " + response.status);
        basicAuth.setIsAuthorized(true);
        basicAuth.setIsAnonymous(true);
        basicAuth.setAnonymousAccessToken(currentToken);

        if (successCallback != null) {
          successCallback(response.status, data);
        }
      },

      error: function(statusCode, data) {
        console.log('failed', statusCode);
        mcs._Logger.log(mcs.logLevelError,  "Login failed with error: " + statusCode);

        clearState();

        if(errorCallback != null) {
          errorCallback(statusCode, data);
        }
      }
    });*/
  };


  /**
   * Checks to see if the authorization token is null,undefined,NaN,empty string (""),0,false.
   * @returns {Boolean}
   */
  this.isTokenValid = function () {

    if (basicAuth.getAccessToken() !== null && typeof basicAuth.getAccessToken() == 'string') {
      mcs._Logger.log(mcs.logLevelInfo, "Authorization token is not null or empty");
      return true;
    }
    else if (basicAuth.getAccessToken() == null && typeof basicAuth.getAccessToken() !== 'string') {
      mcs._Logger.log(mcs.logLevelInfo, "Authorization token is null and/or empty");
      return false;
    }
  };

  /**
   * For BasicAuth, there is no need to call this function, because the token never expires.
   * This function only exists here because it inherits from the Authorization object, which is also used for other types of authentication in which the token can expire.
   * @param successCallback {Authorization~authenticateSuccessCallback} Optional callback invoked on success.
   * @param errorCallback {Authorization~authenticateErrorCallback} Optional callback invoked on failure.
   */
  this.refreshToken = function(successCallback, errorCallback) {

    var boolean = basicAuth.isTokenValid();

    if (basicAuth.getIsAuthorized() == false && boolean !== true) {
      if (errorCallback !== null) {
        errorCallback(401, "Please use the authenticate with username/password combination or authenticateAnonymous function before using refreshToken.")
      }
    }
    else if (basicAuth.getIsAuthorized() == true && boolean == true) {
      if (successCallback !== null) {
        mcs._Logger.log(mcs.logLevelError, "Authenticated token is valid, you do not need to refresh.");
        successCallback(200, basicAuth.getAccessToken());
      }
    }
  };

  /**
   * Logs out the current user and clears credentials and tokens.
   */
  this.logout = function() {
    basicAuth.authorizedUserName = null;
    basicAuth.setAccessToken(null);
    basicAuth.setAnonymousAccessToken(null);
    basicAuth.setIsAuthorized(false);
    basicAuth.setIsAnonymous(false);
  };

  this._getHttpHeaders = function(headers) {
    if (basicAuth.getAccessToken() !== null && typeof basicAuth.getAccessToken() == "string") {
      headers[AuthorizationHeader] = basicAuth.getAccessToken();
    }
    headers[BackendIdHeader] = basicAuth.getBackendId();
    headers[ApplicationKeyHeader]= basicAuth.getApplicationKey();
  };

  this._getAnonymousHttpHeaders = function (headers) {
    if (basicAuth.getAnonymousAccessToken() !== null && typeof basicAuth.getAnonymousAccessToken() == "string") {
      headers[AuthorizationHeader] = basicAuth.getAnonymousAccessToken();
    }
    headers[BackendIdHeader] = basicAuth.getBackendId();
    headers[ApplicationKeyHeader] = basicAuth.getApplicationKey();
  };

  function clearState(){
    basicAuth.setAccessToken(null);
    basicAuth.setAnonymousAccessToken(null);
    basicAuth.setIsAuthorized(false);
    basicAuth.setIsAnonymous(false);
    basicAuth.authorizedUserName = null;
  }
}

(function() {

  BasicAuthorization.prototype = new mcs.Authorization();

  var g = typeof window != 'undefined' ? window : global;

  g.mcs = g.mcs || {};
  g.mcs._BasicAuthorization = BasicAuthorization;
}());

'use strict';

/**
 * Class used to authorize a mobile user against the Mobile Cloud Service. Callers should use
 * MobileBackend's [OAuthAuthorization()]{@link MobileBackend#OAuthAuthorization} property.
 * @constructor
 */

function OAuthAuthorization(config, backend, appKey) {

  Authorization.call(this, config, backend, mcs.AuthenticationTypeOAuth);

  var _clientId = mcs._Utils.validateConfiguration(config.clientId);
  var _clientSecret = mcs._Utils.validateConfiguration(config.clientSecret);
  var _appKey = mcs._Utils.validateConfiguration(appKey);

  if(config.hasOwnProperty("userIdentityDomainName")){
    var _tenantName = mcs._Utils.validateConfiguration(config.userIdentityDomainName);
  }

  var AuthorizationHeader = "Authorization";
  var UserIdentityDomainNameHeader = "X-USER-IDENTITY-DOMAIN-NAME";
  var ApplicationKeyHeader = "Oracle-Mobile-Application-Key";

  var anonymousAccessToken = null;
  var AccessToken = null;
  var ExpiredTime = null;
  var isAuthorized = false;
  var isAnonymous = false;

  var oAuth = this;


  /**
   * The [MobileBackend]{@link MobileBackend} object that this Authorization instance belongs to.
   * @type {MobileBackend}
   * @readonly
   */
  this.backend = backend;

  /**
   * Returns client Id for the current backend.
   */
  this.getClientId = function(){
    return _clientId;
  };

  /**
   * Returns application key for the current backend.
   */
  this.getApplicationKey = function(){
    return _appKey;
  };

  /**
   * Returns tenantName for the current backend.
   */
  this.getTenantName = function(){
    return _tenantName;
  };

  /**
   * Returns the client Secret for the current backend.
   */
  this.getClientSecret= function(){
    return _clientSecret;
  };

  /**
   * Returns the current access token from user credentials.
   * @return current access token from user credentials.
   */
  this.getAccessToken = function () {
    return AccessToken;
  };

  /**
   * Sets the accessToken for using the current access token from user credentials.
   * @param accesstoken
   */
  this.setAccessToken = function (accesstoken) {
    AccessToken = accesstoken;
  };

  /**
   * Returns the current anonymous access token.
   * @return current anonymous access token.
   */
  this.getAnonymousAccessToken = function () {
    return anonymousAccessToken;
  };

  /**
   * Sets the current anonymous access token.
   * @param accesstoken
   */
  this.setAnonymousAccessToken = function (accesstoken) {
    anonymousAccessToken = accesstoken;
  };

  /**
   * Returns the current isAuthorized variable value.
   * @return current isAuthorized variable value.
   */
  this.getIsAuthorized = function () {
    return isAuthorized;
  };

  /**
   * Sets the current isAuthorized variable value.
   * @param authorized
   */
  this.setIsAuthorized = function (authorized) {
    isAuthorized = authorized;
  };

  /**
   * Returns the current isAnonymous variable value.
   * @return current isAnonymous variable value.
   */
  this.getIsAnonymous = function () {
    return isAnonymous;
  };

  /**
   * Sets the current isAnonymous variable value.
   * @param anonymous
   */
  this.setIsAnonymous = function (anonymous) {
    isAnonymous = anonymous;
  };


  /**
   * Callback invoked after successfully authenticating.
   * @callback Authorization~authenticateSuccessCallback
   * @param statusCode {Number} Any HTTP status code returned from the server, if available.
   * @param message {String} The HTTP payload from the server, if available, or an error message.
   */

  /**
   * Callback invoked on error while authenticating.
   * @callback Authorization~authenticateErrorCallback
   * @param statusCode {Number} Any HTTP status code returned from the server, if available.
   * @param message {String} The HTTP payload from the server, if available, or an error message.
   */

  /**
   * Authenticates a user with the given credentials against the service. The user remains logged in until logout() is called.
   * @param username {String} The username of the credentials.
   * @param password {String} The password of the credentials.
   * @param successCallback {Authorization~authenticateSuccessCallback} Optional callback invoked on success.
   * @param errorCallback {Authorization~authenticateErrorCallback} Optional callback invoked on failure.
   */

  this.authenticate = function (username, password, successCallback, errorCallback) {

    oAuth.logout();

    if(!username || !password){
      mcs._Logger.log(mcs.logLevelError, "Wrong username or password parameter");
      if(errorCallback){
        errorCallback(400, 'Bad Request');
      }
      return;
    }

    var currentToken = "Basic " + mcs._Utils.encodeBase64(oAuth.getClientId() + ":" + oAuth.getClientSecret());
    var requestBody = urlEncodeComponent(username, password);

    var headers = {};

    headers['Content-type'] = 'application/x-www-form-urlencoded; charset=utf-8';
    headers[AuthorizationHeader] = currentToken;
    headers[ApplicationKeyHeader] = oAuth.getApplicationKey();

    if(typeof oAuth.getTenantName() !== 'undefined'){
      headers[UserIdentityDomainNameHeader] = oAuth.getTenantName();
    }

    mcs.MobileBackendManager.platform.invokeService({
      url: oAuth.backend.getOAuthTokenUrl(),
      method: 'POST',
      headers: headers,
      body: requestBody,

      success: function (response, data) {
        mcs._Logger.log(mcs.logLevelInfo, "OAuth Token received and time before it expires in seconds");
        oAuth.setIsAnonymous(true);
        oAuth.setIsAuthorized(false);
        oAuth.authorizedUserName = username;
        oAuth.setAccessToken(data.access_token);
        ExpiredTime = Date.now() + data.expires_in * 1000;

        if (successCallback != null) {
          successCallback(response.status, data);
        }
      },
      error: function (statusCode, data) {
        mcs._Logger.log(mcs.logLevelError, "Login failed with error: " + statusCode);

        clearState();

        if (errorCallback != null) {
          errorCallback(statusCode, data);
        }
      }
    });
  };

  /**
   * Authenticates an anonymous user against the service. The user remains logged in until logout() is called.
   * @param successCallback {Authorization~authenticateSuccessCallback} Optional callback invoked on success.
   * @param errorCallback {Authorization~authenticateErrorCallback} Optional callback invoked on failure.
   */
  this.authenticateAnonymous = function (successCallback, errorCallback) {

    oAuth.logout();

    var currentToken = "Basic " + mcs._Utils.encodeBase64(oAuth.getClientId() + ":" + oAuth.getClientSecret());

    var headers = {};

    headers['Content-type'] = 'application/x-www-form-urlencoded; charset=utf-8';
    headers[AuthorizationHeader] = currentToken;
    headers[ApplicationKeyHeader] = oAuth.getApplicationKey();

    if (typeof oAuth.getTenantName() !== 'undefined') {
      headers[UserIdentityDomainNameHeader] = oAuth.getTenantName();
    }

    mcs.MobileBackendManager.platform.invokeService({
      url: oAuth.backend.getOAuthTokenUrl(),
      method: 'POST',
      headers: headers,
      body: 'grant_type=client_credentials',

      success: function (response, data) {
        mcs._Logger.log(mcs.logLevelInfo, "OAuth Token received and time before it expires in seconds");
        oAuth.setIsAnonymous(true);
        oAuth.setIsAuthorized(true);
        oAuth.setAnonymousAccessToken(data.access_token);
        ExpiredTime = Date.now() + data.expires_in * 1000;

        if (successCallback != null) {
          successCallback(response.status, data);
        }
      },
      error: function (statusCode, data) {
        mcs._Logger.log(mcs.logLevelError, "Login failed with error: " + statusCode);

        clearState();

        if (errorCallback != null) {
          errorCallback(statusCode, data);
        }
      }
    });
  };

  /**
   * Checks to see if the OAuth token is null,undefined,NaN,empty string (""),0,false and also checks the timestamp
   * of when the token was first retrieved to see if it was still valid.
   * @returns {Boolean}
   */
  this.isTokenValid = function () {

    if (oAuth.getAccessToken() !== null || oAuth.getAnonymousAccessToken() !== null) {
      mcs._Logger.log(mcs.logLevelVerbose, "OAuth Token is not null or empty");
      }
      var currentTime = Date.now();
      if (currentTime >= ExpiredTime) {
        mcs._Logger.log(mcs.logLevelInfo, "Token has expired");
          return false;
        }
      else {
        mcs._Logger.log(mcs.logLevelVerbose, "Token is still valid");
          return true;
      }
  };

  /**
   * Logs out the current user and clears credentials and tokens.
   */
  this.logout = function() {
    oAuth.authorizedUserName = null;
    oAuth.setIsAnonymous(false);
    oAuth.setIsAuthorized(false);
    oAuth.setAccessToken(null);
    oAuth.setAnonymousAccessToken(null);
    ExpiredTime = Date.now() * 1000;
  };

  /**
   * For OAuth, the SDK can not refresh because it does not persist client credentials.
   * the SDK can not persist credentials from the users, so it can not successfully do a refresh.
   * This function only exists here because it inherits from the Authorization object, which is also used for other types of authentication in which the token can expire.
   * @param successCallback {Authorization~authenticateSuccessCallback} Optional callback invoked on success.
   * @param errorCallback {Authorization~authenticateErrorCallback} Optional callback invoked on failure.
   */
  this.refreshToken = function(successCallback,errorCallback) {

    var boolean = oAuth.isTokenValid();

    if (boolean !== false) {
      if (oAuth.getAccessToken() == null && oAuth.getIsAnonymous() !== false) {
        if (successCallback != null) {
          mcs._Logger.log(mcs.logLevelError, "Anonymous token is valid, you do not need to refresh.");
          successCallback(200, oAuth.getAnonymousAccessToken());
        }
      }
      if (oAuth.getAnonymousAccessToken() == null && oAuth.getIsAnonymous() !== true) {
        if (successCallback != null) {
          mcs._Logger.log(mcs.logLevelError, "Authenticated token is valid, you do not need to refresh.");
          successCallback(200, oAuth.getAccessToken());
        }
      }
    }
    else{
      mcs._Logger.log(mcs.logLevelError, "Token has expired or user has not been authenticate with the service.");
      if(errorCallback != null){
        errorCallback(401, "Please use the authenticate with username/password combination or authenticateAnonymous function before using refreshToken.")
      }
    }
  };

  var clearState = function(){
    oAuth.authorizedUserName = null;
    oAuth.setIsAnonymous(false);
    oAuth.setIsAuthorized(false);
    oAuth.setAccessToken(null);
    oAuth.setAnonymousAccessToken(null);
    ExpiredTime = Date.now() * 1000;
  };

  var urlEncodeComponent = function(user,pass){

      var username;
      var password;

      if(user.indexOf("@") > -1){
        username = encodeURIComponent(user).replace(/%20/g,'+');
      }
      else{
        username = encodeURIComponent(user).replace(/%5B/g, '[').replace(/%5D/g, ']');
      }

      if(pass.indexOf("&") > -1){
        password = encodeURIComponent(pass).replace(/%20/g,'+');
      }
      else{
        password = encodeURIComponent(pass).replace(/%5B/g, '[').replace(/%5D/g, ']');
      }

      return "grant_type=password&username=" + username +"&password=" + password;
    };

  this._getHttpHeaders = function (headers) {
    if (oAuth.getAccessToken() !== null && typeof oAuth.getAccessToken() == "string") {
      headers[AuthorizationHeader] = "Bearer " + oAuth.getAccessToken();
    }
      headers[ApplicationKeyHeader]= oAuth.getApplicationKey();
  };


  this._getAnonymousHttpHeaders = function (headers) {
    if (oAuth.getAnonymousAccessToken() !== null && typeof oAuth.getAnonymousAccessToken() == "string") {
      headers[AuthorizationHeader] = "Bearer " + oAuth.getAnonymousAccessToken();
    }
    headers[ApplicationKeyHeader] = oAuth.getApplicationKey();
  };


}


(function() {

  OAuthAuthorization.prototype = new mcs.Authorization();

  var g = typeof window != 'undefined' ? window : global;
  g.mcs = g.mcs || {};
  g.mcs._OAuthAuthorization = OAuthAuthorization;
}());

/** @ignore */

"use strict";

/**
 * Class that provides calling User specific capabilities. Callers should use
 * MobileBackend's [User()]{@link MobileBackend#User} property.
 * @constructor
 */

function User(user) {


  var _id = user.id;
  var userName = user.username;
  var firstName = user.firstName;
  var lastName = user.lastName;
  var email = user.email;

  var _properties = {};

  for (var key in user) {
    if (["id", "username", "firstName", "lastName", "email"].indexOf(key) < 0) {
      _properties[key] = user[key];
    }
    if(_properties.links != null) {
      delete _properties.links;
    }
  }

  /**
   * Returns the current user's name.
   *
   * @return Current user's name
   */
  this.getId = function(){
    return _id;
  };


  /**
   * Returns the current user's name.
   *
   * @return Current user's name
   */
  this.getUsername = function(){
    return userName;
  };
  /**
   * Sets username for current user.
   *
   * @param username Properties associated with current user
   */
  this.setUsername = function(username){
    userName = username;
  };

  /**
   * Returns the properties of current user.
   *
   * @return properties {} of current user
   */
  this.getProperties  = function(){
      return _properties;
  };
  /**
   * Sets properties for current user.
   *
   * @param key {String} the key in the properties object
   * @param value {String} the value of the key in the properties object
   *
   */
  this.setProperties = function(key,value){
    var obj = this.getProperties(); //outside (non-recursive) call, use "data" as our base object
    var ka = key.split(/\./); //split the key by the dots
    if (ka.length < 2) {
      obj[ka[0]] = value; //only one part (no dots) in key, just set value
    } else {
      if (!obj[ka[0]]) obj[ka[0]] = {}; //create our "new" base obj if it doesn't exist
      obj = obj[ka.shift()]; //remove the new "base" obj from string array, and hold actual object for recursive call
      this.setProperties(ka.join("."),value); //join the remaining parts back up with dots, and recursively set data on our new "base" obj
    }
  };

  /**
   * Returns first name for current user.
   */
  this.getFirstName = function(){
    return firstName;
  };

  /**
   * Sets first name for current user.
   *
   * @param firstname Properties associated with current user
   */
  this.setFirstName = function(firstname){
    firstName = firstname;
  };

  /**
   * Returns last name for current user.
   */
  this.getLastName = function(){
    return lastName;
  };

  /**
   * Sets last name for current user.
   *
   * @param lastname Properties associated with current user
   */
  this.setLastName = function(lastname){
    lastName = lastname;
  };

  /**
   * Returns email address for current user.
   */
  this.getEmail = function(){
    return email;
  };

  /**
   * Sets the email address property of current user.
   *
   * @return email properties of current user
   */
  this.setEmail = function(Email){
    email = Email;
  };

  // TODO: More protected way to edit password of User Object
  /**
   * Sets password for current user.
   *
   * @param password Properties associated with current user
   */
  //this.setPassword = function(password){
  //  this.password = password;
  //};

  /**
   * Returns the password property for current user.
   */
  //this.getPassword = function(){
  //  return this.password;
  //};

}

(function() {
  var g = typeof window != 'undefined' ? window : global;

  g.mcs = g.mcs || {};
  g.mcs.User = User;
}());

"use strict";

/**
 * Class that provides diagnostics capabilities. Callers should use
 * MobileBackend's [Diagnostics()]{@link MobileBackend#Diagnostics} property.
 * @constructor
 */
function Diagnostics(backend) {

  /**
   * The [MobileBackend]{@link MobileBackend} object that this Diagnostics instance belongs to.
   * @type {MobileBackend}
   * @readonly
   */
  this.backend = backend;

  this._sessionId = mcs._Utils.uuid();

  this._getHttpHeaders = function(headers) {
    headers["Oracle-Mobile-DIAGNOSTIC-SESSION-ID"] = this.getSessionId();
    headers["Oracle-Mobile-DEVICE-ID"] = mcs.MobileBackendManager.platform.getDeviceId();
    headers["Oracle-Mobile-CLIENT-REQUEST-TIME"] = new Date().toISOString();
  };

  /**
   * Returns the session id, or process id of that Diagnostic event.
   * @return process id for the Diagnostic session.
   */
  this.getSessionId = function(){
    return this._sessionId;
  }
}

(function() {
  var g = typeof window != 'undefined' ? window : global;

  g.mcs = g.mcs || {};
  g.mcs._Diagnostics = Diagnostics;
}());

"use strict";

/**
 * Class that provides calling custom code capabilities. Callers should use
 * MobileBackend's [CustomCode()]{@link MobileBackend#CustomCode} property.
 * @constructor
 */

function CustomCode(backend){

  /**
   * The [MobileBackend]{@link MobileBackend} object that this Custom Code instance belongs to.
   * @type {MobileBackend}
   * @readonly
   */
  this.backend = backend;

  var customCode = this;

  function checkParameters(params,comparison){
    return isJSON(params) && params && params != undefined && typeof params == comparison ;
  }

  function isJSON (params) {
    if (typeof params != 'string')
      params = JSON.stringify(params);

    try {
      JSON.parse(params);
      return true;
    } catch (e) {
      return false;
    }
  }

  // /**
  //  * Callback invoked after downloading application configuration.
  //  * @callback CustomCode~successCallback
  //  * @param success {String} The HTTP payload from the server, if available, or a success message.
  //  * @example : "SUCCESS"
  //  */
  //
  // /**
  //  * Callback invoked on error while downloading application configuration.
  //  * @callback CustomCode~errorCallback
  //  * @param error {Object} The HTTP payload from the server, if available, or an error message.
  //  * @example : "FAILURE"
  //  *
  //  */
  //
  // /**
  //  * Allows the user to call custom Code defined on the UI and assigned to the backend defined by the user.
  //  * @param path {String} The path of the endpoint following the platform prefix ie {BaseUrl}/mobile/platform/{path to custom code endpoint}.
  //  * @param data {Object} Data that is pasted into the call on the server if methods are POST and PUT. Only accepts an JSON object and/or JavaScript array.
  //  * @param successCallback {CustomCode~successCallback} Optional callback invoked on success returns the status code, and the data from the request.
  //  * @param errorCallback {CustomCode~errorCallback} Optional callback invoked on failure and returns the status code, and the data from the request.
  //  * @example path: "TasksAPI/tasks/100"
  //  * @example data: {
  //       "name": "Complete reports",
  //       "completed": false,
  //       "priority": "high",
  //       "dueDate": "2015-03-15T17:00:00Z"
  //     }
  //  * These methods must be defined in the API created on the UI by the user for this methods to function. This API only allows "POST" as HTTP function.
  //  * If you wish to use any of the other HTTP function, you must use mcs.MobileBackend.invokeCustomCodeJSONRequest();
  //  * @example <caption>Example usage of mcs.MobileBackend.invokeCustomCodeStoreData()</caption>
  //  * mcs.MobileBackend.CustomCode.invokeCustomCodeStoreData("TaskApi1/tasks/100" ,  {
  //       "name": "Complete reports",
  //       "completed": false,
  //       "priority": "high",
  //       "dueDate": "2015-03-15T17:00:00Z"
  //     },
  //  * function(success){
  //  * },
  //  * function(failure){
  //  * });
  //  * // returns a STRING of "SUCCESS" on successCallback function from the data parameter.
  //  *
  //  */
  // this.invokeCustomCodeStoreData = function(path,data,successCallback,errorCallback){
  //
  //   var headers = customCode.backend.getHttpHeaders();
  //   headers["Content-Type"] = 'application/json';
  //
  //   var customData = JSON.stringify(data);
  //   headers["Content-Length"] = customData.length;
  //
  //   mcs.MobileBackendManager.platform.invokeService({
  //     method: "POST",
  //     url: customCode.backend.getCustomCodeUrl(path),
  //     headers: headers,
  //     body: customData,
  //
  //     success: function () {
  //       if (successCallback != null) {
  //         successCallback("SUCCESS");
  //       }
  //     },
  //     error: function () {
  //       if (errorCallback != null) {
  //         errorCallback("FAILURE");
  //       }
  //     }
  //   });
  // };


  /**
   * Allows the user to call custom Code defined on the UI and assigned to the backend defined by the user.
   * @param path {String} The path of the endpoint following the platform prefix ie {BaseUrl}/mobile/platform/{path to custom code endpoint}.
   * @param method {String} HTTP method that is invoked.
   * @param data {Object} Data that is pasted into the call on the server if methods are POST and PUT. Only accepts an JSON object and/or JavaScript array.
   * @param successCallback {CustomCode~successCallback} Optional callback invoked on success returns the status code, and the data from the request.
   * @param errorCallback {CustomCode~errorCallback} Optional callback invoked on failure and returns the status code, and the data from the request.
   * @example path: "TasksAPI/tasks/100"
   * @example method: "GET,POST,PUT,DELETE,etc"
   * @example data:  {
        "name": "Complete reports",
        "completed": false,
        "priority": "high",
        "dueDate": "2015-03-15T17:00:00Z"
      }
   * These methods must be defined in the API created on the UI by the user for this methods to function.
   * @example <caption>Example usage of mcs.MobileBackend.invokeCustomCodeJSONRequest()</caption>
   * mcs.MobileBackend.CustomCode.invokeCustomCodeJSONRequest("TaskApi1/tasks/100" , "GET" , null,
   * function(statusCode, data){
   * },
   * function(statusCode, data){
   * });
   * // returns object on successCallback function from the data parameter.
   * {
   * "name": "Complete reports",
   * "completed": false,
   * "priority": "high",
   * "dueDate": "2015-03-15T17:00:00Z"
   * }
   */
  this.invokeCustomCodeJSONRequest = function(path,method,data,successCallback,errorCallback){

    var headers = customCode.backend.getHttpHeaders();
    headers["Content-Type"] = 'application/json';

    var customData = JSON.stringify(data);
    headers["Content-Length"] = customData.length;

console.log('call', customCode.backend.getCustomCodeUrl(path));
console.log(headers.length);
for (var key in headers) {
  console.log('headers', key, headers[key]);
};
console.log(customData);
console.log('method', method);
    mcs.MobileBackendManager.platform.invokeService({
      method: method,
      url: customCode.backend.getCustomCodeUrl(path),
      headers: headers,
      body: customData,

      success: function (response,data) {
        if (successCallback != null) {
          successCallback(response.status,data);
        }
      },
      error: function(statusCode, data) {
        console.log('statusCode', statusCode);
        console.log(data);
        if(errorCallback != null) {
          errorCallback(statusCode, data);
        }
      }
    });
  }
}


(function() {
  var g = typeof window != 'undefined' ? window : global;

  g.mcs = g.mcs || {};
  g.mcs.CustomCode = CustomCode;
}());

"use strict";

/**
 * Represents a Mobile Backend in the Mobile Cloud Service and provides access to all capabilities of the backend.
 * Callers should use MobileBackendManager's [getMobileBackend()]{@link MobileBackendManager#getMobileBackend} method.
 * @constructor
 */
function MobileBackend(name, config) {


  var platformPath = 'mobile/platform';
  var customCodePath = 'mobile/custom';

  var AuthenticationType = null;

  var backend = this;


  /**
   * The name of the MobileBackend as read from the configuration.
   * @type {String}
   */
  this.name = name;

  this._config = config;



  /**
   * Returns anonymous token for the current backend.
   */
  this.getAuthenticationTypeVariable = function(){
    return AuthenticationType;
  };

  /**
   * Sets Authentication variable for MobileBackend.
   * @param type
   */
  this.setAuthenticationTypeVariable = function(type){
    AuthenticationType = type;
  };


  /**
   * Constructs a full url including the prefix for platform API REST endpoints given a path.
   * @param path {String} The path of the endpoint following the platform prefix ie {BaseUrl}/mobile/platform.
   * @returns {String} The full url.
   */
  this.getPlatformUrl = function (path) {

    var url = this._config.baseUrl;

    // dev instance hack, replace port ends with 1 with 7777
    if(backend.getAuthenticationTypeVariable() == "ssoAuth" && strEndsWith(this._config.baseUrl,"1")){
      url = url.substring(0, url.length - 4) + "7777";
    }

    url = mcs._Utils.validateConfiguration(url) + "/" + platformPath;
    if (!strEndsWith(url, "/")) {
      url += "/";
    }
    return url + path;
  };

  /**
   * Constructs a full url including the prefix for custom code API REST endpoints given a path.
   * @param path {String} The path of the endpoint following the custom code prefix ie {BaseUrl}/mobile/custom.
   * @returns {String} The full url.
   */
  this.getCustomCodeUrl = function (path) {
    var url = mcs._Utils.validateConfiguration(this._config.baseUrl) + "/" + customCodePath;
    if (!strEndsWith(path,"/")) {
      url += "/";
    }

    return url + path;
  };

  /**
   * Constructs a full url including the prefix for oAuth token API REST endpoints given a path.
   * @returns {String} The full url for oAuth token endpoint.
   */
  this.getOAuthTokenUrl = function () {
    var tokenUri = mcs._Utils.validateConfiguration(this._config.authorization.oAuth.tokenEndpoint);
    if(!strEndsWith(tokenUri,"/")) {
      tokenUri += "/"
    }
    return tokenUri;
  };


  /**
   * Constructs a full url including the prefix for ssoAuth token API REST endpoints given a path.
   * @returns {String} The full url for oAuth token endpoint.
   */
  this.getSSOAuthTokenUrl = function () {
    var tokenUri = mcs._Utils.validateConfiguration(this._config.authorization.ssoAuth.tokenEndpoint);
    if(!strEndsWith(tokenUri,"/")) {
      tokenUri += "/"
    }
    return tokenUri;
  };

  /**
   * Populates auth and diagnostics HTTP headers for making REST calls to a mobile backend.
   * @param headers {Object} An optional object which to populate with the headers.
   * @returns {Object} The headers parameter that is passed in and if not provided, a new object with the populated
   * headers as properties of that object.
   */
  this.getHttpHeaders = function (headers) {
    if (headers == null) {
      headers = {};
    }

    this.Diagnostics._getHttpHeaders(headers);

    if (this.Authorization.getIsAuthorized() !== false && this.Authorization.getIsAnonymous() !== false) {
      this.Authorization._getAnonymousHttpHeaders(headers);
    }
    else {
      this.Authorization._getHttpHeaders(headers);
    }

    return headers;
  };

  /**
   * Returns the Authorization object that provides authorization capabilities and access to user properties.
   * @param {string} type.
   * For using Basic Authentication you would use "basicAuth" to use Basic Authentication security schema.
   * For using OAuth Authentication you would use "oAuth" to use OAuth Authentication security schema.
   * If you put any other type other than those two it will throw an Exception stating that the type of Authentication that you provided
   * we do not support at this time.
   * @type {Authorization}
   * @example <caption>Example usage of mcs.MobileBackend.setAuthenticationType()</caption>
   * @example mcs.MobileBackend.setAuthenicationType("basicAuth");
   * //Basic Authorization schema
   * @example mcs.MobileBackend.setAuthenicationType("oAuth");
   * //OAuth Authorization schema
   * @example mcs.MobileBackend.setAuthenicationType("facebookAuth");
   * //Facebook Authorization schema
   * @example mcs.MobileBackend.setAuthenicationType("ssoAuth");
   * //Single Sign On Authorization schema
   */
  this.setAuthenticationType = function(type) {

    var authType = mcs._Utils.validateConfiguration(type);

    this.Authorization = null;

    if (!this._config.authorization.hasOwnProperty(authType)) {
      throw mcs._Logger.Exception("No Authentication Type called " + type +
        " is defined in MobileBackendManager.config " + "\n" +
        "check MobileBackendManager.config in authorization object for the following objects:" + "\n" +
        mcs.AuthenticationTypeBasic + "\n" +
        mcs.AuthenticationTypeOAuth + "\n"+
        mcs.AuthenticationTypeFacebook + "\n"+
        mcs.AuthenticationTypeSSO);
    }

    if (this.Authorization !== null && this.Authorization.getIsAuthorized() !== false) {
      this.Authorization.logout();
    }

    if (authType == mcs.AuthenticationTypeBasic) {
      this.Authorization = new mcs._BasicAuthorization(this._config.authorization.basicAuth, this, this._config.applicationKey);
      mcs._Logger.log(mcs.logLevelInfo,  "Your Authentication type: " + authType);
      backend.setAuthenticationTypeVariable(authType);
    }
    else if (authType == mcs.AuthenticationTypeOAuth) {
      this.Authorization = new mcs._OAuthAuthorization(this._config.authorization.oAuth, this,this._config.applicationKey);
      mcs._Logger.log(mcs.logLevelInfo,  "Your Authentication type: " + authType);
      backend.setAuthenticationTypeVariable(authType);
    }
    else if(authType == mcs.AuthenticationTypeFacebook){
      this.Authorization = new mcs._FacebookAuthorization(this._config.authorization.facebookAuth,this,this._config.applicationKey);
      mcs._Logger.log(mcs.logLevelInfo,  "Your Authentication type: " + authType);
      backend.setAuthenticationTypeVariable(authType);
    }
    else if(authType == mcs.AuthenticationTypeSSO){
      this.Authorization = new mcs._SSOAuthorization(this._config.authorization.ssoAuth,this,this._config.applicationKey);
      mcs._Logger.log(mcs.logLevelInfo, "Your Authentication type: " + authType);
      backend.setAuthenticationTypeVariable(authType);
    }
    return this.Authorization;
  };


  /**
   * Returns the Authorization object that enables end-end authorization capabilities.
   * @return {Authorization} Object
   */
  this.getAuthenticationType = function(){
    return this.Authorization;
  };

  /**
   * Checks to see if the string ends with a suffix.
   * @return {boolean}
   */
  function strEndsWith(str, suffix) {
    return str.match(suffix+"$")==suffix;
  }

  /**
   * Returns the Diagnostics object that enables end-end debugging across application and cloud.
   * @type {Diagnostics}
   */
  this.Diagnostics = new mcs._Diagnostics(this);

  /**
   * Returns the Custom Code object that enables called into Custom Code and performing operations
   * on created APIs.
   * @type {CustomCode}
   */
  this.CustomCode = new mcs.CustomCode(this);

  /**
   * Returns the Analytics object that enables capturing mobile analytics events.
   * @type {Analytics}
   */
  this.Analytics = new mcs._Analytics(this);

  /**
   * Returns the Storage object that provides cloud based storage capabilities.
   * @type {Storage}
   */
  this.Storage = new mcs._Storage(this);

  ///**
  // * Returns the Synchronization object that provides caching and synchronization capabilities.
  // * @type {Synchronization}
  // */
  //this.Synchronization = new mcs._Synchronization(this);

  /**
   * Returns the Notifications object that provides notification capabilities.
   * @type {Notifications}
   */
  if(mcs._Notifications){
    this.Notifications = new mcs._Notifications(this);
  }

  /**
   * Returns an instance of the application configuration object.
   * Callers can download the configuration form the service by invoking loadAppConfig().
   * @type {Object}
   */
  this.AppConfig = {};

  /**
   * Callback invoked after downloading application configuration.
   * @callback MobileBackend~appConfigSuccessCallback
   * @param statusCode {Number} Any HTTP status code returned from the server, if available.
   * @param appConfig {Object} The downloaded application configuration object.
   */

  /**
   * Callback invoked on error while downloading application configuration.
   * @callback MobileBackend~errorCallback
   * @param statusCode {Number} Any HTTP status code returned from the server, if available.
   * @param message {String} The HTTP payload from the server, if available, or an error message.
   */

  /**
   * Downloads the configuration from the service. The AppConfig property will contain the downloaded configuration.
   * @param successCallback {MobileBackend~appConfigSuccessCallback} Optional callback invoked on success.
   * @param errorCallback {MobileBackend~errorCallback} Optional callback invoked on failure.
   */
  this.loadAppConfig = function(successCallback, errorCallback) {

    if (!backend.Authorization.isAuthorized) {
      backend.Authorization.authenticateAnonymous(function () {
          backend._loadAppConfig(successCallback, errorCallback);
        },
        errorCallback
      );
    } else {
      backend._loadAppConfig(successCallback, errorCallback);
    }
  };

  this._loadAppConfig = function(successCallback, errorCallback) {

    var headers = backend.getHttpHeaders();
    headers["Content-Type"] = "application/json";

    mcs.MobileBackendManager.platform.invokeService({
      method: 'GET',
      url: backend.getPlatformUrl("appconfig/client"),
      headers: headers,
      success: function(response, data) {
        mcs._Logger.log(mcs.logLevelInfo,  "New WebStarterApp config downloaded with status code: " + response.status);

        backend.AppConfig = data;

        if(successCallback != null) {
          successCallback(response.status,backend.AppConfig);
        }
      },
      error: function(statusCode, data) {
        mcs._Logger.log(mcs.logLevelError,  "App config download failed! with status code: " + statusCode);

        if(errorCallback != null) {
          errorCallback(statusCode,data);
        }
      }
    });

  };
}

(function() {
  var g = typeof window != 'undefined' ? window : global;

  g.mcs = g.mcs || {};
  g.mcs._MobileBackend = MobileBackend;
}());

"use strict";

(function() {
  var g = typeof window != 'undefined' ? window : global;

  /**
   * The mcs namespace that holds all the SDK objects and classes.
   * @namespace mcs
   */
  g.mcs = g.mcs || {};
}());

/**
 * The entry-point into the Mobile Cloud Service SDK. The MobileBackendManager has a singleton from which MobileBackend
 * objects can be accessed, which in turn provide access to Analytics, Storage, Auth and other capabilities. The
 * singleton can be accessed as mcs.MobileBackendManager.
 * @class
 */
mcs.MobileBackendManager = mcs.MobileBackendManager || {};

/**
 * The platform implementation to use in the application. Callers can derive from [Platform]{@link Platform} to provide
 * specific implementation for device state and capabilities.
 * @type {Platform}
 */
mcs.MobileBackendManager.platform = new mcs.BrowserPlatform();

mcs.MobileBackendManager._config = {"mobileBackends":{}};
mcs.MobileBackendManager._mobileBackends = {};


mcs.MobileBackendManager.setConfig = function(config) {

  if(config.logLevel != null) {
    mcs._Logger.logLevel = config.logLevel;
  }

  this._config = config;
  this._mobileBackends = {};
};

/**
 * Sets Platform for Cordova applications ONLY.
 * Sets the configuration for the application. The configuration should be set once before any MobileBackend is accessed.
 * @param config
 * Returns a MobileBackend object with the specified name.
 * @param name {String} The name of the MobileBackend.
 * @returns {MobileBackend} A MobileBackend object.
 */
mcs.MobileBackendManager.returnMobileBackend = function(name,config){

  if(mcs.MobileBackendManager.platform.isCordova == false) {
    mcs.MobileBackendManager.platform = new mcs.CordovaPlatform();
  }
  else{
    mcs.MobileBackendManager.platform = new mcs.BrowserPlatform();
  }
  mcs._Logger.log(mcs.logLevelInfo, "The Cordova platform is set!");


    mcs.MobileBackendManager.setConfig(config);
    mcs._Logger.log(mcs.logLevelInfo, "The config has been set and now it has the backend defined in the config " +
      "as the point of entry for the " +
      "rest of the functions you need to call.");

  return mcs.MobileBackendManager.getMobileBackend(name);

};


mcs.MobileBackendManager.getMobileBackend = function(name) {

  if (this._mobileBackends[name] != null) {
    return this._mobileBackends[name];
  }

  for (var backendName in this._config.mobileBackends) {
    if (backendName == mcs._Utils.validateConfiguration(name)) {
      var backend = new mcs._MobileBackend(name, this._config.mobileBackends[name]);
      this._mobileBackends[name] = backend;
      return backend;
    }
  }

  mcs._Logger.log(mcs.logLevelError,  "No mobile backend called " + name + " is defined in MobileBackendManager.config");
  return null;
};

"use strict";

/**
 * Class that represents a storage object resource that can be used to store data.
 * @constructor
 */
function StorageObject(storageCollection, json) {

   var _storageCollection = storageCollection;
   var _payload = null;

  if (json != null) {
    /**
     * A service generated ID for the StorageObject. The ID is unique in the StorageCollection.
     * @type {String}
     */
    this.id = json.id;

    /**
     * A user provided name for the StorageObject. A StorageCollection may have multiple StorageObjects with the same name.
     * @type {String}
     */
    this.name = json.name;

    /**
     * The length of data content in bytes stored in the StorageObject.
     * @type {Number}
     */
    this.contentLength = json.contentLength;

    /**
     * The media-type associated with the StorageObject.
     * @type {String}
     */
    this.contentType = json.contentType;

    this._eTag = json.eTag;

    /**
     * The name of the user who created the StorageObject.
     * @type {String}
     */
    this.createdBy = json.createdBy;

    /**
     * Server generated timestamp when the StorageObject was created.
     * @type {String}
     */
    this.createdOn = json.createdOn;

    /**
     * The name of the user who last updated the StorageObject.
     * @type {String}
     */
    this.modifiedBy = json.modifiedBy;

    /**
     * Server generated timestamp when the StorageObject was last updated.
     * @type {String}
     */
    this.modifiedOn = json.modifiedOn;
  }

  /**
   * Returns the current Storage Object Payload.
   *
   * @return Current Storage object payload.
   */
  this.getPayload = function(){
    return _payload;
  };


  /**
   * Sets the payload for Storage Object.
   *
   * @param payload The payload to be associated with Storage Object.
   */
  this.setPayload =function(payload){
    _payload = payload;
  };

  /**
   * Returns the current Storage Collection.
   *
   * @return Current Storage Collection.
   */
  this.getstorageCollection = function(){
    return _storageCollection;
  };

  /**
   * Returns the current Storage Object.
   *
   * @return Current Storage Object.
   */
  this.getStorage = function(){
    return this.getstorageCollection()._storage
  };

  /**
   * Loads a StorageObject's contents from an object.
   * @param payload {Object} The object to load from.
   * @example payload: "Hello my name is Mia and this is a sample payload".
   * @param contentType {String} The media-type to associate with the content.
   * @example contentType: "application/json,text/plain".
   */
  this.loadPayload = function(payload, contentType) {

    _payload = payload;
    this.contentType = contentType;

    if(this.contentType == 'text/plain'){
      if(typeof _payload == "string") {
        _payload = payload;
      }
    }
    else if(this.contentType == 'application/json'){
      if(typeof _payload == "string"){
        _payload = payload;
      }
      else if(typeof _payload == "object"){
        _payload = JSON.stringify(payload);
      }
    }
    this.contentLength = _payload.length;
  };
  /**
   * Sets a StorageObject's display name from an object.
   * @param name {Object} The object's name to be associated with the object.
   * @example name: "JSFile中国人.txt"
   * @returns The object's name in UTC-8 ASCII format.
   */
  this.setDisplayName = function(name){
    this.name = name;
  };

  /**
   * Returns a StorageObject's display name from an object.
   *
   * @returns String object's name decoded if encoded into the MobileBackend.
   */
  this.getDisplayName = function(){
    return this.name;
  };


  /**
   * Callback invoked after successfully downloading data from the StorageObject.
   * @callback StorageObject~readPayloadSuccessCallback
   * @param statusCode {Number} Any HTTP status code returned from the server, if available.
   * @param mobileObject {Object} The downloaded data.
   */

  /**
   * Callback invoked on error.
   * @callback StorageObject~errorCallback
   * @param statusCode {Number} Any HTTP status code returned from the server, if available.
   * @param message {String} The HTTP payload from the server, if available, or an error message.
   */

  /**
   * Returns the contents of the StorageObject. May result in a download from the service if the contents were not
   * previously downloaded.
   * @param successCallback {StorageObject~readPayloadSuccessCallback} Callback invoked on success.
   * @param errorCallback {StorageObject~errorCallback} Callback invoked on error.
   * @param objectType responseType for the XMLHttpRequest Object.
   */
  this.readPayload = function(successCallback, errorCallback,objectType) {
    if(this.getPayload() == null) {

      var storageObject = this;

      var headers = storageObject.getstorageCollection().getStorage().backend.getHttpHeaders();
      headers["Accept-Encoding"] = "gzip";

      var url = "storage/collections/" + storageObject.getstorageCollection().id + "/objects/" + this.id;

      if(storageObject.getstorageCollection().userId != null && storageObject.getstorageCollection()._userIsolated){
        url += "?user=" + storageObject.getstorageCollection().userId;
      }

      mcs.MobileBackendManager.platform.invokeService({
        method: 'GET',
        url: storageObject.getstorageCollection().getStorage().backend.getPlatformUrl(url),
        headers: headers,
        responseType: objectType || "blob",

        success: function (response,data) {
          invokeServiceSuccess(response,data,storageObject,successCallback)
        },
        error: function(statusCode, data) {
          invokeServiceError(statusCode,data,errorCallback)
        }
      });
    }
  };

  function invokeServiceSuccess (response, data,storageObject, successCallback) {
    if(successCallback != null){
      storageObject.setPayload(data);
      storageObject.name = decodeURI(response.getResponseHeader("Oracle-Mobile-Name"));
      storageObject._eTag = response.getResponseHeader("ETag");
      storageObject.contentLength = data.size;
      storageObject.contentType = response.getResponseHeader("Content-Type");
      storageObject.createdBy = response.getResponseHeader("Oracle-Mobile-Created-By");
      storageObject.createdOn = response.getResponseHeader("Oracle-Mobile-Created-On");
      storageObject.modifiedBy = response.getResponseHeader("Oracle-Mobile-Modified-By");
      storageObject.modifiedOn = response.getResponseHeader("Oracle-Mobile-Modified-On");
      successCallback(storageObject);
    }
  }

  function invokeServiceError(statusCode,data,errorCallback){
    if(errorCallback != null) {
      errorCallback(statusCode, data);
    }
  }
}

(function() {
  var g = typeof window != 'undefined' ? window : global;

  g.mcs = g.mcs || {};
  g.mcs.StorageObject = StorageObject;
}());

"use strict";

/**
 * Class that holds the StorageCollection resource. StorageCollections contain Storage Objects
 * which can be used to persist data in Mobile Cloud Service.
 * @constructor
 */
function StorageCollection(data, userId, storage) {

  var _storage = storage;
  var _userId = mcs._Utils.validateConfiguration(userId);
  var _data = data;

  var storageCollection = this;

  /**
   * Returns storage object for current Storage Collection.
   *
   * @return Storage Object for current Storage Collection.
   */
  this.getStorage = function(){
    return _storage;
  };

  /**
   * Returns user id for current Storage Collection.
   *
   * @return user id for current Storage Collection.
   */
  this.getUserId = function(){
    return _userId ;
  };

  /**
   * Returns data for current Storage Collection.
   *
   * @return Storage Object data for current Storage Collection.
   */
  this.getData = function(){
    return _data;
  };

  /**
   * The ID of the StorageCollection.
   * @type {String}
   */
  this.id = this.getData().id;

  /**
   * The description of the StorageCollection.
   * @type {String}
   */
  this.description = this.getData().description;

  this._userIsolated = this.getData().userIsolated;

  /**
   * Callback invoked after successfully fetching a StorageCollection.
   * @callback StorageCollection~getObjectsSuccessCallback
   * @param objects {Array} An array of StorageObjects downloaded from the service.
   */

  /**
   * Callback invoked on error.
   * @callback StorageCollection~errorCallback
   * @param statusCode {Number} Any HTTP status code returned from the server, if available.
   * @param message {String} The HTTP payload from the server, if available, or an error message.
   */

  /**
   * Returns a list of Storage Objects from the collection starting from the offset and up to the limit. The service may return fewer objects.
   * @param offset {Number} The offset at which to start. Must be greater than 0.
   * @example offset: "3"
   * @param limit {Number} The max number of Storage Objects to return. Must be non-negative.
   * @example limit: "2"
   * @param successCallback {StorageCollection~getObjectsSuccessCallback} Callback invoked on success.
   * @param errorCallback {StorageCollection~errorCallback} Callback invoked on error.
   */
  this.getObjects = function(offset, limit, successCallback, errorCallback) {

    var headers = storageCollection.getStorage().backend.getHttpHeaders();
    headers["Accept"] = "application/json";
    headers["Accept-Encoding"] = "gzip";

    var url = "storage/collections/" + storageCollection.id + "/objects";

    if(offset != null) {
      url += url.indexOf("?") == -1 ? "?" : "&";
      url += "offset=" + offset;
    }

    if(limit != null) {
      url += url.indexOf("?") == -1 ? "?" : "&";
      url += "limit=" + limit;
    }
    if(storageCollection.getUserId() != null && storageCollection._userIsolated){
      url += url.indexOf("?") == -1 ? "?" : "&";
      url += "user=" + storageCollection.getUserId();
    }

    mcs.MobileBackendManager.platform.invokeService({
      method: 'GET',
      url: storageCollection.getStorage().backend.getPlatformUrl(url),
      headers: headers,

      success: function(response, data) {
        if(successCallback != null) {

          var objects = [];
          var objectsJson = data;
          for(var i=0; i<objectsJson.items.length; i++) {
            objects[objects.length] = new mcs.StorageObject(storageCollection, objectsJson.items[i]);
          }
          successCallback(objects);
        }
      },
      error: function(statusCode, data) {
        if(errorCallback != null) {
          errorCallback(statusCode, data);
        }
      }
    });
  };

  /**
   * Callback invoked after successfully fetching a StorageObject.
   * @callback StorageCollection~storageObjectSuccessCallback
   * @param object {StorageObject} The StorageObject downloaded from the service.
   */

  /**
   * Returns a StorageObject given its ID. The contents of the object will be downloaded lazily.
   * @example mcs.MobileBackend.Storage.StorageCollection.getObject(id,successCallback,errorCallback,objectType);
   * @param id {String} The ID of the Storage Object to return.
   * @example id: "00e39862-9652-458b-9a82-d1a66cf1a0c7"
   * @param successCallback {StorageCollection~storageObjectSuccessCallback} Callback invoked on success.
   * @param errorCallback {StorageCollection~errorCallback} Callback invoked on error.
   * @param objectType {object} responseType for the XMLHttpRequest Object. Default response type if not defined is json.
   * @example <caption>Example usage of mcs.MobileBackend.Storage.StorageCollection.getObject("00e39862-9652-458b-9a82-d1a66cf1a0c7",successCallback,errorCallback,"blob")</caption>
   *
   * @example mcs.MobileBackend.Storage.StorageCollection.getObject("00e39862-9652-458b-9a82-d1a66cf1a0c7",successCallback,errorCallback,"blob");
   * mcs.MobileBackend.Storage.StorageCollection.getObject("00e39862-9652-458b-9a82-d1a66cf1a0c7",
   * function(statusCode, data){
   * },
   * function(statusCode, data){
   * },
   * 'blob'
   * );
   * // returns object as a blob on successCallback function from the data parameter.
   *
   * @example mcs.MobileBackend.Storage.StorageCollection.getObject("00e39862-9652-458b-9a82-d1a66cf1a0c7",successCallback,errorCallback,"arraybuffer");
   * mcs.MobileBackend.Storage.StorageCollection.getObject("00e39862-9652-458b-9a82-d1a66cf1a0c7",
   * function(statusCode, data){
   * },
   * function(statusCode, data){
   * },
   * 'arraybuffer'
   * );
   * // returns object as a arraybuffer on successCallback function from the data parameter.
   *
   * @example mcs.MobileBackend.Storage.StorageCollection.getObject("00e39862-9652-458b-9a82-d1a66cf1a0c7",successCallback,errorCallback,"document");
   * mcs.MobileBackend.Storage.StorageCollection.getObject("00e39862-9652-458b-9a82-d1a66cf1a0c7",
   * function(statusCode, data){
   * },
   * function(statusCode, data){
   * },
   * 'document'
   * );
   * // returns object as a document on successCallback function from the data parameter.
   *
   * @example mcs.MobileBackend.Storage.StorageCollection.getObject("00e39862-9652-458b-9a82-d1a66cf1a0c7",successCallback,errorCallback,"text");
   * mcs.MobileBackend.Storage.StorageCollection.getObject("00e39862-9652-458b-9a82-d1a66cf1a0c7",
   * function(statusCode, data){
   * },
   * function(statusCode, data){
   * },
   * 'text'
   * );
   * // returns object as text on successCallback function from the data parameter.
   */

  this.getObject = function(id, successCallback, errorCallback,objectType) {
    var storageObject = new mcs.StorageObject(this);
    storageObject.id = id;

    storageObject.readPayload(function(statusCode) {
      if(successCallback != null) {
        successCallback(storageObject);
      }
    }, function(statusCode, data) {
      if(errorCallback != null) {
        errorCallback(statusCode, data);
      }
    },objectType);
  };

  /**
   * Creates a new StorageObject in the collection.
   * @param storageObject {StorageObject} The StorageObject to create.
   * @example storageObject:
   * {
   * "id": " 213ddbac-ccb2-4a53-ad48-b4588244tc4c", // A service generated ID for the StorageObject. The ID is unique in the StorageCollection.
   * "name" : "JSText.txt", // A user provided name for the StorageObject. A StorageCollection may have multiple StorageObjects with the same name.
   * "contentLength": 798", // The length of data content in bytes stored in the StorageObject.
   * "contentType" : "text/plain ", // The media-type associated with the StorageObject.
   * "createdBy" : "DwainDRob", // The name of the user who created the StorageObject
   * "createdOn": "Sat, 17 Oct 2015 10:33:12", // Server generated timestamp when the StorageObject was created.
   * "modifiedBy": "DwainDRob", // The name of the user who last updated the StorageObject.
   * "modifiedOn": "Sat, 17 Oct 2015 10:33:12" //  Server generated timestamp when the StorageObject was last updated.
   * }
   * @param successCallback {StorageCollection~storageObjectSuccessCallback} Callback invoked on success.
   * @param errorCallback {StorageCollection~errorCallback} Callback invoked on error.
   */
  this.postObject = function(storageObject, successCallback, errorCallback) {
    this._postOrPutStorageObject(storageObject, true, successCallback, errorCallback);
  };

  /**
   * Updates an existing StorageObject in the collection.
   * @param storageObject {StorageObject} The StorageObject to update.
   * @param successCallback {StorageCollection~storageObjectSuccessCallback} Callback invoked on success.
   * @param errorCallback {StorageCollection~errorCallback} Callback invoked on error.
   */
  this.putObject = function(storageObject, successCallback, errorCallback) {
    this._postOrPutStorageObject(storageObject, false, successCallback, errorCallback);
  };

  this._postOrPutStorageObject = function(storageObject, isPost, successCallback, errorCallback) {

    var headers = storageCollection.getStorage().backend.getHttpHeaders();
    headers["Oracle-Mobile-Name"] = encodeURI(storageObject.getDisplayName());
    headers["Accept-Encoding"] = "gzip";
    headers["Content-Type"] = storageObject.contentType;
    headers["Content-Length"] = storageObject.contentLength;


    var url = "storage/collections/" + storageCollection.id + "/objects";
    if(!isPost) {
      url += "/" + storageObject.id;

      if(storageObject._eTag != null) {
        headers["If-Match"] = storageObject._eTag;
      }
    }

    if(storageCollection._userIsolated && storageCollection.getUserId() != null) {
      url += "?user=" + storageCollection.getUserId();
    }

    mcs.MobileBackendManager.platform.invokeService({
      method: isPost? 'POST' : 'PUT',
      url: storageCollection.getStorage().backend.getPlatformUrl(url),
      headers: headers,
      body: storageObject.getPayload(),
      success: function(response, data) {
        if(successCallback != null) {
          var object = new mcs.StorageObject(storageCollection,data);
          successCallback(response.status,object);
        }
      },
      error: function(statusCode, data) {
        if(errorCallback != null) {
          errorCallback(statusCode, data);
        }
      }
    });
  };

  /**
   * Callback invoked after a successful operation.
   * @callback StorageCollection~storageCollectionSuccessCallback
   */

  /**
   * Checks the service if a StorageObject with the given ID exists in the collection.
   * @param id {String} The ID of the StorageObject to check.
   * @example id: "00e394532-9652-458b-9a82-d1a47cf1a0c7"
   * @param successCallback {StorageCollection~storageCollectionSuccessCallback} Callback invoked on success.
   * @param errorCallback {StorageCollection~errorCallback} Callback invoked on error.
   */
  this.contains = function(id, successCallback, errorCallback) {
    var headers = storageCollection.getStorage().backend.getHttpHeaders();

    var url = "storage/collections/" + storageCollection.id + "/objects/" + id;
    if(storageCollection._userIsolated && storageCollection.getUserId() != null) {
      url += "?user=" + storageCollection.getUserId();
    }

    mcs.MobileBackendManager.platform.invokeService({
      method: "HEAD",
      url: storageCollection.getStorage().backend.getPlatformUrl(url),
      headers: headers,
      success: function(response, data) {
        if(successCallback != null) {
          successCallback(response.status, data);
        }
      },
      error: function(statusCode, data) {
        if(errorCallback != null) {
          errorCallback(statusCode, data);
        }
      }
    });
  };

  /**
   * Deletes a StorageObject from a collection.
   * @param id {String} The ID of the StorageObject to delete.
   * @example id: "00e394532-9652-458b-9a82-d1a47cf1a0c7"
   * @param successCallback {StorageCollection~storageCollectionSuccessCallback} Callback invoked on success.
   * @param errorCallback {StorageCollection~errorCallback} Callback invoked on error.
   */
  this.deleteObject = function(id, successCallback, errorCallback) {

    var headers = storageCollection.getStorage().backend.getHttpHeaders();
    headers["If-Match"] = "*";

    var url = "storage/collections/" + storageCollection.id + "/objects/" + id;
    if(storageCollection._userIsolated && storageCollection.getUserId() != null) {
      url += "?user=" + storageCollection.getUserId();
    }

    mcs.MobileBackendManager.platform.invokeService({
      method: "DELETE",
      url: storageCollection.getStorage().backend.getPlatformUrl(url),
      headers: headers,
      success: function(response, data) {
        if(successCallback != null) {
          successCallback(response.status, data);
        }
      },
      error: function(statusCode, data) {
        if(errorCallback != null) {
          errorCallback(statusCode, data);
        }
      }
    });
  };
}

(function() {
  var g = typeof window != 'undefined' ? window : global;

  g.mcs = g.mcs || {};
  g.mcs._StorageCollection = StorageCollection;
}());

"use strict";

/**
 * Class that provides cloud based storage capabilities. Callers should use
 * MobileBackend's [Storage()]{@link MobileBackend#Storage} property.
 * @constructor
 */
function Storage(backend) {

  /**
   * The [MobileBackend]{@link MobileBackend} object that this Storage instance belongs to.
   * @type {MobileBackend}
   * @readonly
   */
  this.backend = backend;

  var storage = this;

  /**
   * Callback invoked after successfully fetching a StorageCollection.
   * @callback Storage~getCollectionSuccessCallback
   * @param storageCollection {StorageCollection} The downloaded StorageCollection instance.
   */

  /**
   * Callback invoked on error.
   * @callback Storage~errorCallback
   * @param statusCode {Number} Any HTTP status code returned from the server, if available.
   * @param message {String} The HTTP payload from the server, if available, or an error message.
   */

  /**
   * Returns a StorageCollection with the given name from the service associated with the user. Subsequent accesses to StorageObjects in the
   * StorageCollection will only return StorageObjects owned by the user.
   * @param name {String} The name of the StorageCollection.
   * @example name: "JSCollection"
   * @param userId {String} Optional, the ID of the user retrieved from the UI.
   * @example userId: "e8671189-585d-478e-b437-005b7632b8803"
   * @param successCallback {Storage~getCollectionSuccessCallback} Callback invoked on success.
   * @param errorCallback {Storage~errorCallback} Callback invoked on error.
   */
  this.getCollection = function(name, userId, successCallback, errorCallback) {

    var headers = storage.backend.getHttpHeaders();
    headers["Accept"] = "application/json";
    headers["Accept-Encoding"] = "gzip";

    mcs.MobileBackendManager.platform.invokeService({
      method: 'GET',
      url: storage.backend.getPlatformUrl("storage/collections/" + mcs._Utils.validateConfiguration(name)),
      headers: headers,

      success: function(response, data) {
        if(successCallback != null) {
          successCallback(new mcs._StorageCollection(data, mcs._Utils.validateConfiguration(userId), storage));
        }
      },
      error: function(statusCode, data) {
        if(errorCallback != null) {
          errorCallback(statusCode, data);
        }
      }
    });
  };
}

(function() {
  var g = typeof window != 'undefined' ? window : global;

  g.mcs = g.mcs || {};
  g.mcs._Storage = Storage;
}());
