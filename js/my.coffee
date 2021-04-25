mainCtrl=($scope,$http,$filter)->
    $scope.input = "HTML input element control with angular data-binding. Input control follows HTML5 input types and polyfills the HTML5 validation behavior for older browsers."
    $scope.fanyi = ->
        $scope.google = $scope.baidu = $scope.youdao = "loading..."
        $scope.fanyi_baidu $scope.input,(result)->$scope.baidu = result
        $scope.fanyi_youdao $scope.input,(result)->$scope.youdao = result
        $scope.fanyi_google $scope.input,(result)->$scope.google = result

    $scope.fanyi_baidu=(input,f)->
        $.post "http://fanyi.baidu.com/v2transapi",
            from:"en",to:"zh",query:input,transtype:"realtime",
            (result)->$scope.$apply ->
                output=""; output+=i.dst for i in result.trans_result.data; f output

    $scope.fanyi_youdao=(input,f)->
        $.post "http://fanyi.youdao.com/translate?smartresult=dict&smartresult=rule&smartresult=ugc&sessionFrom=null",
        "type":"AUTO",i:unescape(encodeURIComponent(input)),"doctype":"json",
        "xmlVersion":"1.6","keyfrom" : "fanyi.web", "ue" : "UTF-8", "typoResult" : "true",
        (result)->$scope.$apply ->
                output=""; output+=j.tgt for j in i for i in result.translateResult; f output
                
    $scope.fanyi_google=(input,f)->
        $.get "http://translate.google.com.tw/translate_a/t?client=t&sl=en&tl=zh-CN&hl=zh-CN&sc=2&ie=UTF-8&oe=UTF-8&oc=1&prev=btn&ssel=0&tsel=0&q=" + encodeURIComponent(input), 
        (result)->$scope.$apply ->
            c=eval result
            output=""; output+=i[0] for i in c[0]; f output

    mouse_down_x=0
    mouse_down_y=0

    $scope.on_mouse_down=(event)->mouse_down_x=event.clientX;mouse_down_y=event.clientY
    $scope.fanyi_s=(sText)->
        $scope.google_s = $scope.baidu_s = $scope.youdao_s = "loading..."
        $scope.fanyi_baidu sText,(result)->$scope.baidu_s=result
        $scope.fanyi_youdao sText,(result)->$scope.youdao_s=result
        $scope.fanyi_google sText,(result)->$scope.google_s=result

    $scope.on_mouse_up=(event)->
        if Math.abs(event.clientX - mouse_down_x) > 2 or Math.abs(event.clientY - mouse_down_y) > 2 
            if document.selection == undefined then sText = document.getSelection().toString() else sText= document.selection.createRange().text
            if sText is "" then return 
            if sText.length > 5000 then sText = sText.substr 0, 5000
            $scope.fanyi_s(sText)

    $scope.on_mouse_dbclick=(event)->
            if document.selection == undefined then sText = document.getSelection().toString() else sText= document.selection.createRange().text
            if sText is "" then return 
            if sText.length > 5000 then sText = sText.substr 0, 5000
            $scope.fanyi_s(sText)            


    document.addEventListener "mouseup",$scope.on_mouse_up,true
    document.addEventListener "mousedown",$scope.on_mouse_down,true
    document.addEventListener "dblclick",$scope.on_mouse_dbclick,true

