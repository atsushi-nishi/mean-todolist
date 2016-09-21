// public/core.js
var myModule = angular.module('myModule', []);

myModule.controller('mainCtrl', [
  '$scope',
  '$http',
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
  function($scope, $http){

    console.log("==== signupCtrl called -====");

    $scope.signupData = {firstName: "sampleFName",
                          lastName: "sampleLName",
                          email: "user@example.com",
                          password: "samplePassword",
    };

    $scope.signupMessage = {email: "----"};

    $scope.checkEmailRegistered = function() {
        console.log("[func]signup.checkEmailRegistered");
        email = $scope.signupData.email;
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

    $scope.register = function() {

/*
        var data = {firstName: $scope.signupData.firstName,
                    lastName: $scope.signupData.lastName,
                    email: $scope.signupData.email,
                    password: $scope.signupData.password,
        }
*/
        data = $scope.signupData;

        console.log("[func]signup.register");
        console.log("$scope.signupData");
        console.dir($scope.signupData);
        console.log("data");
        console.dir(data);
        $http.post('/api/users', data)
            .success(function(data) {
                console.dir(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };


}]);

    


myModule.controller('todoCtrl', [
  '$scope',
  '$http',
  function($scope, $http){

    // when landing on the page, get all todos and show them
    $http.get('/api/todos')
        .success(function(data) {
            $scope.todos = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

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
    };

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
