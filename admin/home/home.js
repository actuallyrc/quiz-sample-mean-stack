angular.module('home', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate']);

angular.module('home').config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'home/partial/login/login.html',
        controller: 'LoginCtrl',
        resolve: {
            checkSession: ['$state', 'sessionService', function ($state, sessionService) {
                sessionService.getSessionUser().then(function (data) {
                    if (data._id) {
                        $state.go('common.dashboard');
                    }
                });
                    }]
        }
    });
    $stateProvider.state('common', {
        url: '/admin',
        abstract: true,
        templateUrl: 'home/partial/common/common.html',
        controller: 'CommonCtrl',
        resolve: {
            checkSession: ['$state', 'sessionService', function ($state, sessionService) {
                sessionService.getSessionUser().then(function (data) {
                    if (!data._id) {
                        $state.go('login');
                    }
                });
                    }]
        }
    });
    //    $stateProvider.state('common.home', {
    //        url: '/admin',
    //        templateUrl: 'home/partial/sidebar/sidebar.html',
    //        controller: 'SidebarCtrl',
    //    });
    $stateProvider.state('common.dashboard', {
        url: '/dashboard',
        templateUrl: 'home/partial/dashboard/dashboard.html',
        controller: 'DashboardCtrl'
    });
    $stateProvider.state('common.sets', {
        url: '/sets',
        templateUrl: 'home/partial/sets/sets.html',
        controller: 'SetsCtrl',
        resolve: {
            sets: ['checkSession', 'setsService', function (checkSession, setsService) {
                return setsService.getSetsList();
        }]
        }
    });
    $stateProvider.state('common.set', {
        url: '/edit-set/:setId',
        controller: 'SetdetailsCtrl',
        templateUrl: 'home/partial/setDetails/setDetails.html',
        resolve: {
            set: ['setsService', '$stateParams', function (setsService, $stateParams) {
                return setsService.getSetDetails($stateParams.setId);
                    }]
        }
    });

    $stateProvider.state('common.users', {
        url: '/users',
        templateUrl: 'home/partial/users/users.html',
        controller: 'UsersCtrl',
        resolve: {
            sets: ['checkSession', 'sessionService', function (checkSession, sessionService) {
                return sessionService.getUserList();
        }]
        }
    });

    $stateProvider.state('common.userdetails', {
        url: '/user-performance/:userId',
        controller: 'UserdetailsCtrl',
        templateUrl: 'home/partial/userDetails/userDetails.html',
        resolve: {
            set: ['sessionService', '$stateParams', function (sessionService, $stateParams) {
                return sessionService.getUserPerformance($stateParams.userId);
                    }]
        }
    });

    $stateProvider.state('common.summary', {
        url: '/user-performance/:userId/summary',
        controller: 'SummaryCtrl',
        templateUrl: 'home/partial/summary/summary.html',
        resolve: {
            //            set: ['sessionService', '$stateParams', function (sessionService, $stateParams) {
            //                return sessionService.getUserPerformance($stateParams.userId);
            //                    }]
        }
    });
    /* Add New States Above */
});
