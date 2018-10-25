/*
 *
 *	SMH MediaPlatform Plugin
 *	
 *	VideoChat
 *
 *	12-30-2015
 */
//VideoChat constructor
function VideoChat() {}
//VideoChat prototype/class
VideoChat.prototype = {
    constructor: VideoChat,
    //Insert legacy VideoChat iframe
    embedChat:function(SMadmin,SMlocation){
        // For version detection, set to min. required Flash Player version, or 0 (or 0.0.0), for no version detection. 
        var swfVersionStr = "11.1.0";
        // To use express install, set to playerProductInstall.swf, otherwise the empty string. 
        var xiSwfUrlStr = "playerProductInstall.swf";
        var flashvars = {};
        flashvars.isAdmin = SMadmin; //admin embed = "true" : client embed = "false" (admin embed is default if this isn't used)
        flashvars.partnerID = sessInfo.pid+"-live"; //chat account
        flashvars.numUsers = "3";  //number of simultanious users allowed to connect (app defaults to 3 users if this isn't used)
        var params = {};
        params.quality = "high";
        params.bgcolor = "#ffffff";
        params.allowscriptaccess = "always";
        params.allowfullscreen = "true";
        params.wmode = "transparent";
        var attributes = {};
        attributes.id = "SMH_VChat";
        attributes.name = "SMH_VChat";
        attributes.align = "middle";
        swfobject.embedSWF(
            "/flash/smh_vchat/vchat_client.swf", SMlocation, 
            "1131", "770", 
            swfVersionStr, xiSwfUrlStr, 
            flashvars, params, attributes);
        // JavaScript enabled so display the flashContent div in case it is not replaced with a swf object.
        swfobject.createCSS("#"+SMlocation, "display:block;");
    },
    //Launch button modal
    showButtonModal:function(chatType){
        var header, embedCode, content, footer;
        
        if(chatType == 'admin'){
            smhMain.resetModal();
            $('.smh-dialog').css('width','565px');
            $('.smh-dialog').css('height','430px');
            $('#smh-modal').modal({
                backdrop: 'static'
            });             
        
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Embedding: Admin Video Chat Widget</h4>';
            $('#smh-modal .modal-header').html(header);
            
            embedCode = "<div id='embedview' style='text-align:center;'><div style='margin-bottom: 20px;'>Embed Code:</div><textarea id='previewcode' class='form-control' style='width: 350px; height: 150px; resize: none; margin-left: auto; margin-right: auto;' cols='30' rows='2'><object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' width='1131' height='770' id='SMH_VChat_Admin'><param name='movie' value='http://cdn.streamingmediahosting.com/assets/flash/smh.vchat.client/client.swf' /><param name='quality' value='high' /><param name='bgcolor' value='#ffffff' /><param name='allowScriptAccess' value='always' /><param name='allowFullScreen' value='true' /><param name='flashvars' value='isAdmin=true&partnerID="+sessInfo.pid+"-live&numUsers=3' /><!--[if !IE]>--><object type='application/x-shockwave-flash' data='http://cdn.streamingmediahosting.com/assets/flash/smh.vchat.client/client.swf' width='1131' height='770'><param name='quality' value='high' /><param name='bgcolor' value='#ffffff' /><param name='allowScriptAccess' value='always' /><param name='allowFullScreen' value='true' /><param name='flashvars' value='isAdmin=true&partnerID="+sessInfo.pid+"-live&numUsers=3' /><!--<![endif]--><!--[if gte IE 6]>--><p>Either scripts and active content are not permitted to run or Adobe Flash Player version 11.1.0 or greater is not installed.</p><!--<![endif]--><a href='http://www.adobe.com/go/getflashplayer'><img src='http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash Player' /></a><!--[if !IE]>--></object><!--<![endif]--></object></textarea><br /><button style='margin: 10px 0 10px 0;' id='select-bttn' class='btn btn-default'>Select Code</button></div>";
            $('#smh-modal .modal-body').html(embedCode); 
            
            footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
            $('#smh-modal .modal-footer').html(footer);
        
        }else if (chatType == 'client'){	           
            smhMain.resetModal();
            $('.smh-dialog').css('width','565px');
            $('.smh-dialog').css('height','430px');
            $('#smh-modal').modal({
                backdrop: 'static'
            });  
 
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Embedding: Client Video Chat Widget</h4>';
            $('#smh-modal .modal-header').html(header);
            
            embedCode = "<div id='embedview' style='text-align:center;'><div style='margin-bottom: 20px;'>Embed Code:</div><textarea id='previewcode' class='form-control' style='width: 350px; height: 150px; resize: none; margin-left: auto; margin-right: auto;' cols='30' rows='2'><object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' width='1131' height='770' id='SMH_VChat_Client'><param name='movie' value='http://cdn.streamingmediahosting.com/assets/flash/smh.vchat.client/client.swf' /><param name='quality' value='high' /><param name='bgcolor' value='#ffffff' /><param name='allowScriptAccess' value='always' /><param name='allowFullScreen' value='true' /><param name='flashvars' value='isAdmin=false&partnerID="+sessInfo.pid+"-live&numUsers=3' /><!--[if !IE]>--><object type='application/x-shockwave-flash' data='http://cdn.streamingmediahosting.com/assets/flash/smh.vchat.client/client.swf' width='1131' height='770'><param name='quality' value='high' /><param name='bgcolor' value='#ffffff' /><param name='allowScriptAccess' value='always' /><param name='allowFullScreen' value='true' /><param name='flashvars' value='isAdmin=false&partnerID="+sessInfo.pid+"-live&numUsers=3' /><!--<![endif]--><!--[if gte IE 6]>--><p>Either scripts and active content are not permitted to run or Adobe Flash Player version 11.1.0 or greater is not installed.</p><!--<![endif]--><a href='http://www.adobe.com/go/getflashplayer'><img src='http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash Player' /></a><!--[if !IE]>--></object><!--<![endif]--></object></textarea><br /><button style='margin: 10px 0 10px 0;' id='select-bttn' class='btn btn-default'>Select Code</button></div>";
            $('#smh-modal .modal-body').html(embedCode); 
            
            footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
            $('#smh-modal .modal-footer').html(footer);
        } else {           
            smhMain.resetModal();
            $('.smh-dialog').css('width','565px');
            $('.smh-dialog').css('height','430px');
            $('#smh-modal').modal({
                backdrop: 'static'
            });
        
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Embedding: Viewer Video Chat Widget</h4>';
            $('#smh-modal .modal-header').html(header);
            
            embedCode = "<div id='embedview' style='text-align:center;'><div style='margin-bottom: 20px;'>Embed Code:</div><textarea id='previewcode' class='form-control' style='width: 350px; height: 150px; resize: none; margin-left: auto; margin-right: auto;' cols='30' rows='2'><object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' width='1131' height='770' id='SMH_VChat_Viewer'><param name='movie' value='http://cdn.streamingmediahosting.com/assets/flash/smh.vchat.client/viewer.swf' /><param name='quality' value='high' /><param name='bgcolor' value='#ffffff' /><param name='allowScriptAccess' value='always' /><param name='allowFullScreen' value='true' /><param name='flashvars' value='partnerID="+sessInfo.pid+"-live' /><!--[if !IE]>--><object type='application/x-shockwave-flash' data='http://cdn.streamingmediahosting.com/assets/flash/smh.vchat.client/viewer.swf' width='1131' height='770'><param name='quality' value='high' /><param name='bgcolor' value='#ffffff' /><param name='allowScriptAccess' value='always' /><param name='allowFullScreen' value='true' /><param name='flashvars' value='partnerID="+sessInfo.pid+"-live' /><!--<![endif]--><!--[if gte IE 6]>--><p>Either scripts and active content are not permitted to run or Adobe Flash Player version 11.1.0 or greater is not installed.</p><!--<![endif]--><a href='http://www.adobe.com/go/getflashplayer'><img src='http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash Player' /></a><!--[if !IE]>--></object><!--<![endif]--></object></textarea><br /><button style='margin: 10px 0 10px 0;' id='select-bttn' class='btn btn-default'>Select Code</button></div>";
            $('#smh-modal .modal-body').html(embedCode);
            
            footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
            $('#smh-modal .modal-footer').html(footer);
        }
    },
    //Register all user actions
    registerActions:function(){
        $('#smh-modal').on('click', '#select-bttn', function(event) {
            $('#previewcode').select();       
        });
        
        $('#vchat_controls').on('click', '#vchat_admin', function(event) {
            smhVideoChat.showButtonModal('admin');
        });
        
        $('#vchat_controls').on('click', '#vchat_client', function(event) {
            smhVideoChat.showButtonModal('client');
        });
        
        $('#vchat_controls').on('click', '#vchat_viewer', function(event) {
            smhVideoChat.showButtonModal();
        });
    }
}

// VideoChat on ready
$(document).ready(function(){
    smhVideoChat = new VideoChat();
    smhVideoChat.embedChat(true,'defaultEmbed');
    smhVideoChat.registerActions();
});
