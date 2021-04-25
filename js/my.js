// Generated by CoffeeScript 1.7.1
window.mainCtrl = function($scope, $http, $filter) {
  var fn, v;
  fn = new Object;
  v = new Object;
  $scope.input = "HTML input element control with angular data-binding. Input control follows HTML5 input types and polyfills the HTML5 validation behavior for older browsers.";
  $scope.fanyi = function() {
    fn.google = $scope.baidu = $scope.youdao = "loading...";
    fn.fanyi_baidu($scope.input, function(result) {
      return $scope.baidu = result;
    });
    fn.fanyi_youdao($scope.input, function(result) {
      return $scope.youdao = result;
    });
    return fn.fanyi_google($scope.input, function(result) {
      return $scope.google = result;
    });
  };
  $scope.fanyi_s = function(sText) {
    fn.google_s = $scope.baidu_s = $scope.youdao_s = "loading...";
    fn.fanyi_baidu(sText, function(result) {
      return $scope.baidu_s = result;
    });
    fn.fanyi_youdao(sText, function(result) {
      return $scope.youdao_s = result;
    });
    return fn.fanyi_google(sText, function(result) {
      return $scope.google_s = result;
    });
  };
  fn.fanyi_baidu = function(input, f) {
    return $.post("http://fanyi.baidu.com/v2transapi", {
      from: "en",
      to: "zh",
      query: input,
      transtype: "realtime"
    }, function(result) {
      return $scope.$apply(function() {
        var i, output, _i, _len, _ref;
        output = "";
        _ref = result.trans_result.data;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          output += i.dst;
        }
        return f(output);
      });
    });
  };
  fn.fanyi_youdao = function(input, f) {
    return $.post("http://fanyi.youdao.com/translate?smartresult=dict&smartresult=rule&smartresult=ugc&sessionFrom=null", {
      "type": "AUTO",
      i: unescape(encodeURIComponent(input)),
      "doctype": "json",
      "xmlVersion": "1.6",
      "keyfrom": "fanyi.web",
      "ue": "UTF-8",
      "typoResult": "true"
    }, function(result) {
      return $scope.$apply(function() {
        var i, j, output, _i, _j, _len, _len1, _ref;
        output = "";
        _ref = result.translateResult;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          for (_j = 0, _len1 = i.length; _j < _len1; _j++) {
            j = i[_j];
            output += j.tgt;
          }
        }
        return f(output);
      });
    });
  };
  fn.fanyi_google = function(input, f) {
    return $.get("http://translate.google.com.tw/translate_a/t?client=t&sl=en&tl=zh-CN&hl=zh-CN&sc=2&ie=UTF-8&oe=UTF-8&oc=1&prev=btn&ssel=0&tsel=0&q=" + encodeURIComponent(input), function(result) {
      return $scope.$apply(function() {
        var c, i, output, _i, _len, _ref;
        c = eval(result);
        output = "";
        _ref = c[0];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          output += i[0];
        }
        return f(output);
      });
    });
  };
  fn.on_mouse_down = function(event) {
    v.mouse_down_x = event.clientX;
    return v.mouse_down_y = event.clientY;
  };
  fn.on_mouse_up = function(event) {
    if (Math.abs(event.clientX - v.mouse_down_x) > 2 || Math.abs(event.clientY - v.mouse_down_y) > 2) {
      return fn.on_mouse_dbclick(event);
    }
  };
  fn.on_mouse_dbclick = function(event) {
    var sText;
    if (document.selection === void 0) {
      sText = document.getSelection().toString();
    } else {
      sText = document.selection.createRange().text;
    }
    if (sText === "") {
      return;
    }
    if (sText.length > 5000) {
      sText = sText.substr(0, 5000);
    }
    return $scope.fanyi_s(sText);
  };
  $("#input").mouseup(fn.on_mouse_up);
  $("#input").mousedown(fn.on_mouse_down);
  return $("#input").dblclick(fn.on_mouse_dbclick);
};
