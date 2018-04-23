var app = angular.module('youhubApp', []);
app.controller('youhubCtrl', function($scope, $http) {
	var messageToggle = false;
    $http.get("/getVideos")
    .then(function(response) {
        $scope.videos = response.data;
        $scope.keypressVideo = function (e,id) {
        	// body...
        	if(e.keyCode == 13){
				sendMessageBodyVideo(id);
			}
        }
        $scope.sendMessageVideo = function (id) {
        	// body...
        	sendMessageBodyVideo(id);
        }
        $scope.showMessage = function (id) {
        	// body...
        	showMessage(id);
        }
    });
});

app.filter('trusted', ['$sce', function ($sce) {
    return function(id) {
        return $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + id);
    };
}]);