// public/core.js
//var myModule = angular.module('myModule', ['ui.bootstrap.datetimepicker']);
//var myModule = angular.module('myModule', ['datatables']);
var myModule = angular.module('myModule', []);

myModule.controller('mainCtrl', [
  '$scope',
  '$http',
  '$window',
  function($scope, $http){
    $scope.test = 'Hello world!';
    console.log($scope.test);

    // when landing on the page, get all todos and show them
    $http.get('/api/users')
        .success(function(data) {
            $scope.users = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.formData = {};

}]);

myModule.controller('signupCtrl', [
  '$scope',
  '$http',
  '$window',
  function($scope, $http, $window){

    console.log("==== signupCtrl called -====");

    $scope.signupData = {};

    $scope.passwordIncorrect = 0;
    $scope.passwordCorrect = 0;
    $scope.passwordIncorrectMessage = '';
    $scope.userUserAgent = 'ua not found';
    $scope.userDevice = 'device not found';
    $scope.userMobile = '';

    var patternRecords = [ "patternA", "patternB" ];

    $scope.signupPagePattern = patternRecords[ Math.floor( Math.random() * patternRecords.length ) ] ;
    console.log("[inspect]signupPagePattern");
    console.log($scope.signupPagePattern);


    $scope.signupMessage = {email: "----"};

    $scope.checkEmailRegistered = function() {
        console.log("[func]signup.checkEmailRegistered");
        var email = $scope.signupData.email;
        $http.get('/api/users/email/' + email)
            .success(function(data) {
                console.dir("data");
                console.dir(data);
                console.dir("email");
                console.dir(email);
                if (data && data.email === email) {
                  $scope.signupMessage.email = "This email address is already registerd!";
                } else {
                  $scope.signupMessage.email = "Welcome!!";
                }
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
    
    $scope.checkPasswordCorrect = function() {
        console.log("[func]signup.checkPasswordCorrect");
        var password = $scope.signupData.password;

        re = /[0-9]/;
        if(!re.test(password)) {
          $scope.passwordIncorrectMessage = "Error: password must contain at least one number (0-9)!";
          console.log("[info]signup.checkPasswordCorrect 1");
          $scope.passwordIncorrect = 1;
          return false;
        }
        re = /[a-z]/;
        if(!re.test(password)) {
          $scope.passwordIncorrectMessage = "Error: password must contain at least one lowercase letter (a-z)!";
          console.log("[info]signup.checkPasswordCorrect 2");
          $scope.passwordIncorrect = 1;
          return false;
        }
        re = /[A-Z]/;
        if(!re.test(password)) {
          $scope.passwordIncorrectMessage = "Error: password must contain at least one uppercase letter (A-Z)!";
          console.log("[info]signup.checkPasswordCorrect 3");
          $scope.passwordIncorrect = 1;
          return false;
        }
        if (password.length < 8) {
          $scope.passwordIncorrectMessage = "Error: password must contain at least 8 character";
          console.log("[info]signup.checkPasswordCorrect 0");
          $scope.passwordIncorrect = 1;
          return;
        }
        $scope.passwordIncorrectMessage = "";
        $scope.passwordCorrect = 1;
        console.log("[info]signup.checkPasswordCorrect 4");
        return true;
    };

    $scope.displayPasswordMessage = function() {
        console.log("[func]signup.displayPasswordMessage");
        $scope.passwordErrorMessage = $scope.passwordIncorrectMessage;
    }
 
    $scope.register = function() {

        data = $scope.signupData;

        console.log("[func]signup.register");
        console.log("$scope.signupData");
        console.dir(data);
        //data.userUserAgent = $scope.userUserAgent.toJson;
        data.userUserAgent = 'user agent is converted to device';
        data.userDevice= $scope.userDevice + $scope.userMobile;
        //data.signupPagePattern = 'default page';
        data.signupPagePattern = $scope.signupPagePattern;
        console.dir($scope.signupData);
        console.log("data");

        $http.post('/api/users', data)
            .success(function(data) {
                console.log("[success]signup.register success");
                console.dir(data);
                console.log("$scope.userDevice + $scope.userMobile", $scope.userDevice + $scope.userMobile);
              
                mixpanel.track(
                    "[submit]]signup",
                    {"device": userDeviceMobile,
                      "signupPagePattern" : $scope.signupPagePattern,
                    }
                );
                $window.location.href = "/";

            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };




    $scope.getUserAgent = function () {
        //console.log(navigator.userAgent);
        //console.log(window.navigator.userAgent);
        var _ua = (function(u){
          var mobile = {
                    0: (u.indexOf("windows") != -1 && u.indexOf("phone") != -1)
                    || u.indexOf("iphone") != -1
                    || u.indexOf("ipod") != -1
                    || (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
                    || (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1)
                    || u.indexOf("blackberry") != -1,
                    iPhone: (u.indexOf("iphone") != -1),
                    Android: (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
          };
          var tablet = (u.indexOf("windows") != -1 && u.indexOf("touch") != -1)
                    || u.indexOf("ipad") != -1
                    || (u.indexOf("android") != -1 && u.indexOf("mobile") == -1)
                    || (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1)
                    || u.indexOf("kindle") != -1
                    || u.indexOf("silk") != -1
                    || u.indexOf("playbook") != -1;
          var pc = !mobile[0] && !tablet;
          return {
            Mobile: mobile,
            Tablet: tablet,
            PC: pc
          };
        })(window.navigator.userAgent.toLowerCase());

        $scope.userUserAgent = _ua;

        // デバイス検出
        var searchDevice = function(ua){
          if(ua.Mobile[0]){
            return Object.keys(ua)[0]
          }else if(ua.Tablet){
            return Object.keys(ua)[1];
          }else{
            return Object.keys(ua)[2];
          }
        };
        //var device = document.getElementById('device');
        //device.innerHTML = searchDevice;
        $scope.userDevice = searchDevice(_ua);

        // モバイル検出
        if(_ua.Mobile[0]){
          var searchMobile = function(ua){
            var st = '(';
            var ed = ')';
            for(var j = 1; j < Object.keys(ua.Mobile).length; j++){
              var key = Object.keys(ua.Mobile)[j];
              if(ua.Mobile[key]){
                return st + Object.keys(ua.Mobile)[j] + ed;
              }
            }
            return st + Object.keys(ua.Mobile).slice(1, (Object.keys(ua.Mobile).length)-1) + '以外' + ed;
          };
          //var mobile = document.getElementById('mobile');
          //mobile.innerHTML = searchMobile;
          $scope.userMobile = searchMobile(_ua);


        }
    };


    $scope.fillinSampleData = function () {
        console.log("[func]signup.fillinSampleData");
        $scope.signupData.firstName = "SampleFirstName";
        $scope.signupData.lastName = "sampleLastName";
        $scope.signupData.email= "user@example.com";
        $scope.signupData.password = "Abcdef0123"; 

        $scope.checkPasswordCorrect();
        $scope.displayPasswordMessage();

    }

    $scope.getUserAgent();
    var userDeviceMobile  = $scope.userDevice + $scope.userMobile;

    mixpanel.track(
        "[page]signup",
        {"device": userDeviceMobile,
          "signupPagePattern" : $scope.signupPagePattern,
        }
    );










}]);

    


myModule.controller('todoCtrl', [
  '$scope',
  '$http',
  function($scope, $http){

    $scope.todos = {};
    $scope.displayStatus = 0; //all

    $sortColumn = 'createDate';
    $sortRule = -1; //desc


/*
    angular.element(document).ready(function () {
        document.getElementById('example').DataTable();
    });
*/
    $scope.show = function(sort) {
        $http.get('/api/todos')
            .success(function(data) {

                newData = [];
                console.log("display1");
                if ($scope.displayStatus == 99) {  
                    console.log("display2");
                    //$scope.todos = data;
                    newData = data;
                } else {
                    console.log("display3");
                    data.forEach( function(_todo, i) {
                        if (_todo.status != $scope.displayStatus) {
                            data.splice(i, 1);
                        } else {
                          newData.push(_todo);
                        }
                        //$scope.todos = newData;
                    });
                    console.log("display4");
                }
                $scope.todos = newData;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.refresh = function() {
      $scope.toods = {};
      $scope.show();
    };

    $scope.refresh();

    $scope.formData = {};

    $scope.createTodo = function() {
        $http.post('/api/todos', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.updateDone = function($todo) {
      
        console.log("updateDone");
        console.log($todo);
        var _todo = {_id: $todo._id, status: 1};
        console.log("updateDone2");
        console.log(_todo);
        _todo.status = 1;
        console.log(_todo);
        $http.put('/api/todos/' + $todo._id, {data: _todo})
            .success(function(data) {
                console.log('--- put callback---');
                console.dir(data);
                $todo.status = 1;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.updateUndone = function($todo) {
      
        console.log("updateUndone");
        console.log($todo);
        var _todo = {_id: $todo._id, status: 0};

        $http.put('/api/todos/' + $todo._id, {data: _todo})
            .success(function(data) {
                console.log('--- put callback---');
                console.dir(data);
                $todo.status = 0;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.deleteTodo = function($todo) {
      
        console.log("-------------delete------------");
        console.dir($todo)

        $http.delete('/api/todos/' + $todo._id)
            .success(function(data) {
                console.log('--- delete callback---');
                console.dir(data);
                delete $todo;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

        $scope.refresh();
    };

    $scope.$watch('displayStatus', function(newValue, oldValue, scope) {
        console.log("displayStatus is changed!");
        $scope.refresh();
    });

    $scope.$watch('sortColumn', function(newValue, oldValue, scope) {
        console.log("sortColumn is changed!");
        $scope.refresh();
    });





}]);


function mainController($scope, $http) {
    $scope.formData = {};
    console.log('mainController');

    // when landing on the page, get all todos and show them
    $http.get('/api/users')
        .success(function(data) {
            $scope.users = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

}
