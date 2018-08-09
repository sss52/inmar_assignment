var myApp = angular.module('myApp', ['ngRoute'])

//ng-route config
.config(function ($routeProvider, $locationProvider){
  $routeProvider
    .when('/home', {
      templateUrl: 'default.html',
	  controller: 'homeCtrl'
    })
	.when('/group', {
      templateUrl: 'default.html',
	  controller: 'groupCtrl'
    })
    .when('/contact-info/:contact_index', {
      templateUrl: 'contact_info.html',
      controller: 'contactInfoCtrl'
    })
    .when('/add', {
      templateUrl: 'contact_form.html',
      controller: 'addContactCtrl'
    })
    .when('/edit/:contact_index', {
      templateUrl: 'contact_form.html',
      controller: 'editContactCtrl'
    })
	.when('/group-info/:group_index', {
      templateUrl: 'group_info.html',
      controller: 'groupInfoCtrl'
    })
    .when('/add-group', {
      templateUrl: 'group_form.html',
      controller: 'addGroupCtrl'
    })
    .when('/edit-group/:group_index', {
      templateUrl: 'group_form.html',
      controller: 'editGroupCtrl'
    })
    .otherwise({redirectTo: '/home'});
})

// controllers
.controller('navCtrl', function ($scope, $rootScope) {
  $scope.nav = {
    navItems: ['home', 'add', 'group', 'add-group', 'logout'],
    selectedIndex: 0,
    navClick: function ($index) {
      $scope.nav.selectedIndex = $index;
    }
  };
  
  $scope.goTo = function(navLink)
  {
    if(navLink == 'logout')
    $rootScope.loginPage = true;
  }
})

.controller('loginCtrl', function($scope, LoginService, $rootScope) {
  $scope.title = "Login";
  $scope.formSubmit = function() {
      if(LoginService.login($scope.username, $scope.password)) {
        $scope.error = '';
        $scope.username = '';
        $scope.password = '';
        $rootScope.loginPage = false;
      } else {
        $scope.error = "Incorrect username/password !";
      }   
    };
})

.controller('homeCtrl', function ($scope, ContactService, $rootScope){
	$rootScope.contact_show = true;
	$rootScope.group_show = false;
  $rootScope.loginPage = true;
	console.log($rootScope.contact_show);
  $scope.contacts = ContactService.getContacts();

  $scope.removeContact = function (item) {
    var index = $scope.contacts.indexOf(item);
    $scope.contacts.splice(index, 1);
    $scope.removed = 'Contact successfully removed.';
  };

})

.controller('groupCtrl', function ($scope, ContactService, $rootScope){
	$rootScope.group_show = true;
	$rootScope.contact_show = false;
	console.log($rootScope.contact_show);
  $scope.groups = ContactService.getGroups();
console.log( $scope.groups);
  $scope.removeGroup = function (item) {
    var index = $scope.groups.indexOf(item);
    $scope.groups.splice(index, 1);
    $scope.removed = 'Group successfully removed.';
  };

})

.controller('contactInfoCtrl', function ($scope, $routeParams, $rootScope){
  var index = $routeParams.contact_index;
  $scope.currentContact = $scope.contacts[index];
})

.controller('groupInfoCtrl', function ($scope, $routeParams, $rootScope){
  var index = $routeParams.group_index;
  $scope.currentGroup = $scope.groups[index];
})

.controller('addContactCtrl', function ($scope, $location, $rootScope) {
  //needed to show the correct button on the contact form
  $rootScope.contact_show = true;
	$rootScope.group_show = false;
  $scope.path = $location.path();

  $scope.addContact = function () {
    var contact = $scope.currentContact;
    contact.id = $scope.contacts.length;
    $scope.contacts.push(contact);
  };
})

.controller('editGroupCtrl', function ($scope, $routeParams, $rootScope){
	$rootScope.contact_show = false;
	$rootScope.group_show = true;
  $scope.index = $routeParams.group_index;
  $scope.currentGroup = $scope.groups[$scope.index];
})

.controller('addGroupCtrl', function ($scope, $location, $rootScope) {
	$rootScope.contact_show = false;
	$rootScope.group_show = true;
  //needed to show the correct button on the contact form
  $scope.path = $location.path();

  $scope.addGroup = function () {
    var group = $scope.currentGroup;
    group.id = $scope.groups.length;
    $scope.groups.push(group);
  };

})

.controller('editContactCtrl', function ($scope, $routeParams, $rootScope){
	$rootScope.contact_show = true;
	$rootScope.group_show = false;
  $scope.index = $routeParams.contact_index;
  $scope.currentContact = $scope.contacts[$scope.index];
})

// directives
.directive('contact', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'contact.html'
  }
})

.directive('group', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'group.html'
  }
})

// services
.factory('LoginService', function() {
    var admin = 'admin@inmar.com';
    var pass = 'pass';
    var isAuthenticated = false;
    
    return {
      login : function(username, password) {
        isAuthenticated = username === admin && password === pass;
        return isAuthenticated;
      },
      isAuthenticated : function() {
        return isAuthenticated;
      }
    };
    
})

.factory('ContactService', [function () {
  var factory = {};

  factory.getContacts = function () {
    return contactList;
  }
  factory.getGroups = function () {
    return groupList;
  }
  
  // contact list, usually would be a separate database
  var contactList = [
    {id: 0, name: 'John Sawn', email: 'John@inmar.com', phone: '123-456-7890', url: 'www.google.com', notes: 'Handles the Project', group_id: 0},
    {id: 1, name: 'Tim Grey', email: 'Tim@inmar.com', phone: '123-456-7890', url: 'www.google.com', notes: 'Create flow for the Project.', group_id: 1},
    {id: 2, name: 'Sam R', email: 'sam@inmar.com', phone: '123-456-7890', url: 'www.google.com', notes: 'QA.', group_id: 0},
    {id: 3, name: 'Adam jim', email: 'adam@inmar.com', phone: '123-456-7890', url: 'www.google.com', notes: 'R & D department need to handle things.', group_id: 0},
    {id: 4, name: 'Trish S', email: 'trish@inmar.com', phone: '123-456-7890', url: 'www.google.com', notes: 'R & D department need to handle things.', group_id: 1},
  ];
  
    var groupList = [
    {id: 0, name: 'Development',  notes: 'Development group.', group_id: 0},
    {id: 1, name: 'Manager', notes: 'Manager group.', group_id: 1},
   {id: 11, name: 'Hr', notes: 'Hr group', group_id: 0},
  ];
  return factory;
}]);

