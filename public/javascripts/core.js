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

/*
    $scope.createUser = function() {
        $http.post('/api/users', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
*/

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

/*
    // when submitting the add form, send the text to the node API
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

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('/api/todos/' + id)
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
*/

}
