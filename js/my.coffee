window.mainCtrl=($scope,$http,$filter)->
    fn=new Object #内部函数
    v=new Object #内部变量
    $scope.input = "HTML input element control with angular data-binding. Input control follows HTML5 input types and polyfills the HTML5 validation behavior for older browsers."
    $scope.fanyi = ->
        fn.google = $scope.baidu = $scope.youdao = "loading..."
        fn.fanyi_baidu $scope.input,(result)->$scope.baidu = result
        fn.fanyi_youdao $scope.input,(result)->$scope.youdao = result
        fn.fanyi_google $scope.input,(result)->$scope.google = result

    $scope.fanyi_s=(sText)->
        fn.google_s = $scope.baidu_s = $scope.youdao_s = "loading..."
        fn.fanyi_baidu sText,(result)->$scope.baidu_s=result
        fn.fanyi_youdao sText,(result)->$scope.youdao_s=result
        fn.fanyi_google sText,(result)->$scope.google_s=result

    fn.fanyi_baidu=(input,f)->
        $.post "http://fanyi.baidu.com/v2transapi",
            from:"en",to:"zh",query:input,transtype:"realtime",
            (result)->$scope.$apply ->
                f (i.dst for i in result.trans_result.data).join("")

    fn.fanyi_youdao=(input,f)->
        $.post "http://fanyi.youdao.com/translate?smartresult=dict&smartresult=rule&smartresult=ugc&sessionFrom=null",
        "type":"AUTO",i:unescape(encodeURIComponent(input)),"doctype":"json",
        "xmlVersion":"1.6","keyfrom" : "fanyi.web", "ue" : "UTF-8", "typoResult" : "true",
        (result)->$scope.$apply ->
                f (j.tgt for j in i for i in result.translateResult).join("")
                
    fn.fanyi_google=(input,f)->
        urls="http://translate.google.com/translate_a/t?client=t&sl=en&tl=zh-CN&hl=zh-CN&sc=2&ie=UTF-8&oe=UTF-8&oc=1&prev=btn&ssel=0&tsel=0&q=" + encodeURIComponent(input)
        $http(method:'GET',url:urls,transformResponse:[(r)->eval(r)]).success (result)-> f (i[0] for i in result[0]).join("")
        #使用JSON.parse会报错,只能覆盖transformResponse换成eval

    fn.on_mouse_down=(event)->v.mouse_down_x=event.clientX;v.mouse_down_y=event.clientY

    fn.on_mouse_up=(event)->
        if Math.abs(event.clientX - v.mouse_down_x) > 2 or Math.abs(event.clientY - v.mouse_down_y) > 2 
            fn.on_mouse_dbclick event

    fn.on_mouse_dbclick=(event)->
            if document.selection == undefined then sText = document.getSelection().toString() else sText= document.selection.createRange().text
            if sText is "" then return 
            if sText.length > 5000 then sText = sText.substr 0, 5000
            $scope.fanyi_s sText        


    $("#input").mouseup fn.on_mouse_up
    $("#input").mousedown fn.on_mouse_down
    $("#input").dblclick fn.on_mouse_dbclick

