var app = angular.module('youhubStreamPanel', []);
app.controller('youhubCtrl', function($scope,$http) {
  console.log(userID);
  $http({
    method: 'POST',
    url: 'https://calm-mountain-66170.herokuapp.com/getImages',
    type: 'POST',
    data: $.param({userID:userID}),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  })
  .then(function(response) {
    // body...
    $scope.images = response.data;
    $scope.face = face;
    $scope.background = background;
    $scope.getPicture = getPicture;
    $scope.moveOnCanvas = moveOnCanvas;
    $scope.downOnCanvas = downOnCanvas;
    $scope.upOnCanvas = upOnCanvas;
    $scope.cleanPan = cleanPan;
    $scope.startSpeech = startSpeech;
    $scope.sendSpeech = sendSpeech;
    canvasInit();
  });
});