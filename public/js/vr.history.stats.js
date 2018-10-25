/*
 *
 *	SMH MediaPlatform Plugin
 *	
 *	Stats
 *
 *	7-3-2014
 */
//Stats constructor
function Stats() {}
//Stats prototype/class
Stats.prototype = {
    constructor: Stats,
    //Insert legacy stats iframe
    insertLegacyStats:function(){
        $('#stats').html('<iframe width="100%" height="880px" frameBorder="0" src="https://stats.vr.streamingmediahosting.com/?dp+templates.platform_user.index+p+'+sessInfo.pid+'"></iframe>');
    }
}

// Stats on ready
$(document).ready(function(){
    smhStats = new Stats();
    smhStats.insertLegacyStats();
});
