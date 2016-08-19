function waitFor(ms) {

    var deferred = $.Deferred();

    setTimeout(function(){
        deferred.resolve(new Date());
    }, ms)

    return deferred.promise();

}

waitFor(2000).done(function(date) {
    console.log("Example finished" + date.getTime());
})