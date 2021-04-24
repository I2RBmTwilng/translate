function mainCtrl($scope, $http, $filter) {

	$scope.toDay = new Date();
	$scope.login = new Object();
	$scope.lookupModal = new Object;
	$('#sandbox-container div').datepicker({
		todayBtn : "linked",
		language : "zh-CN",
		todayHighlight : true
	}).on('changeDate', function(ev) {
		console.log("choose", ev);
		if ( typeof (ev.date) == "undefined"){
			return;
		}
		$scope.$apply(function() {
			$scope.toDay = Date.parse(ev.date);
			$scope.loadState();
		});
	});

	$http({
		method : 'GET',
		url : 'api/isLogin.php'
	}).success(function(data, status, headers, config) {
		$scope.login = data;
		//		debugger;

		if (!($scope.login.isLogin == true)) {
			$scope.login.isLogin = false;
		}
	}).error(function(data, status, headers, config) {
		console.log("获取数据失败,请刷新页面");
	});

	$http({
		method : 'GET',
		url : 'api/jiaoxuelou.php'
	}).success(function(data, status, headers, config) {
		$scope.jiaoxuelou = data;
		$scope.louNow = $scope.jiaoxuelou[0];
		$scope.loadState();
	}).error(function(data, status, headers, config) {
		$scope.jiaoxuelou = ["获取数据失败,请刷新页面"];
	});

	$http({
		method : 'GET',
		url : 'api/jiaoshi.php'
	}).success(function(data, status, headers, config) {
		$scope.jiaoshi = data;
	}).error(function(data, status, headers, config) {
		$scope.jiaoshi = ["获取数据失败,请刷新页面"];
	});

	$scope.createStateArray = function() {
		//		$scope.State
		var s = new Array();
		for (var i = 0; i < $scope.jiaoshi.length; i++) {
			s[$scope.jiaoshi[i].jiaoshi_id] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		}
		//		debugger;
		for ( i = 0; i < $scope.State.length; i++) {
			var t = $scope.State[i];
			s[t.jiaoshi_id][parseInt(t.occupy) - 1] = t.tips;
		}
		return s;
	};

	$scope.loadState = function() {
		//					debugger;
		$http({
			method : 'GET',
			url : 'api/getState.php?' + $scope.louNow.id + "-" + $filter('date')($scope.toDay, 'yyyy-MM-dd')
		}).success(function(data, status, headers, config) {
			$scope.State = data;
			$scope.StateArray = $scope.createStateArray();
			//						debugger;
		}).error(function(data, status, headers, config) {
			console.log("loadState error");
		});
	};

	$scope.setlouNow = function(lou) {
		$scope.louNow = lou;
		$scope.louFilter = "";
		$scope.loadState();
	};

	$scope.find = function(actual, expected) {
		if ( typeof ($scope.louFilter) == "undefined")
			return true;
		return actual.jiaoshi_name.indexOf($scope.louFilter) != -1;
	};

	$scope.find = function(actual, expected) {
		if ( typeof ($scope.louFilter) == "undefined")
			return true;
		return actual.jiaoshi_name.indexOf($scope.louFilter) != -1;
	};

	$scope.showTd = function(js, i) {
		try {
			var val = $scope.StateArray[js.jiaoshi_id][i];
			if ( typeof (val) == "string") {
				console.log(val);
				return val;
			}

		} catch(e) {
		}
	};
	testFun($scope, $http, $filter);

	//////////////////////////////////

	$scope.clickTd = function(tr, td) {
		console.log("click", tr, td);
		var re = function() {
			for (var i in $scope.State) {
				var t = $scope.State[i];
				if (t.jiaoshi_id == tr && t.occupy == td) {
					return t;
				}
			}
			return null;
		}();
		if (re) {
			//		查看
			$scope.modalLookupTitle = "查看信息";
			$scope.lookupModal = re;
			$scope.lookupModal.jiaoshi_name = $scope.jiaoshi[$scope.lookupModal.jiaoshi_id].jiaoshi_name;
//			debugger;
			$("#lookup-modal").modal("show");
		} else {
			//			新增
			//			debugger;
			if ($scope.login.isLogin == false) {
				$scope.loginPost();
				return;

			}
			$scope.modalLookupTitle = "新增信息";
			$scope.lookupModal = {};
			$scope.lookupModal.occupy = td;
			$scope.lookupModal.username = $scope.login.username;
			$scope.lookupModal.usernick = $scope.login.nickname;
			//			debugger;
			for (var i in $scope.jiaoshi) {
				if ($scope.jiaoshi[i].jiaoshi_id == tr.valueOf()) {
					t = i;
					break;
				}
			}
			$scope.lookupModal.jiaoshi_name = $scope.jiaoshi[t].jiaoshi_name;
			$scope.lookupModal.jiaoshi_id = tr;

			$("#lookup-modal").modal("show");
		}

	};

	$scope.loginPost = function() {
		//					debugger;
		$("#modal-login").modal("show");
		if ($scope.username.length == 0 || $scope.password.length == 0) {
			$scope.loginMsg = "";
			return;
		}
		$scope.loginMsg = "正在登录";
		$scope.login = new Object();
		$scope.login.isLogin = false;
		$scope.login.username = "";
		$scope.login.usernick = "";
		$http({
			method : "post",
			data : {
				username : $scope.username,
				password : $scope.password
			},
			url : "api/login.php",

		}).success(function(data, status, headers, config) {
			console.log(data);
			debugger;
			$scope.loginMsg = data.msg;
			if (data.state == "success") {
				$scope.login.isLogin = true;
				$scope.login.username = data.username;
				$scope.login.nickname = data.nickname;
				$("#modal-login").modal("hide");
				//				$scope.username="";
				$scope.password = "";
				$scope.loginMsg = "";
			}
		}).error(function(data, status) {
			console.log("lgoin post error");
		});
	};

	$scope.modalLoginKey = function(event) {
		if (event.keyCode == "13") {
			$scope.loginPost();
		}
	};

	$scope.logout = function() {
		$scope.login.isLogin = false;
		document.cookie = "";
	}

	$scope.save = function(todo) {
		var data = new Object();
		data.jiaoshi_id = $scope.lookupModal.jiaoshi_id;
		data.occupy = $scope.lookupModal.occupy;
		data.the_usage = $scope.lookupModal.the_usage
		data.tips = $scope.lookupModal.tips
		data.date = $filter('date')($scope.toDay, 'yyyy-MM-dd');
		data.todo = todo;
//		debugger;
		//	Object {occupy: 2, username: "1205010207", usernick: "王克纯", jiaoshi_name: "一教105"}
		$http({
			method : "post",
			data : data,
			url : "api/add.php",

		}).success(function(data, status, headers, config) {
			console.log(data);
			$scope.loadState();
			$scope.lookupModal.msg=data.msg;
		}).error(function(data, status) {
			console.log("post error");
		});
	};

}

