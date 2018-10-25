/*
 *
 *	Streaming Media Hosting
 *	
 *	Players
 *
 *	9-15-2015
 */
//Main constructor
function Players() {}

//Global variables
var validator;
var edit = false;
var total_entries;
var bulkdelete = new Array();
var flashvars = {};
var shortlink;
var auto_preview = false;
var origMedia = true;
var stretMedia = false;
var playOnload = false;
var playerMute = false;
var capVideo = false;
var capVideo_textglow = false;
var capVideo_backlayer = false;
var capVideo_textcolor = '#FFFFFF';
var capVideo_glowcolor = '#000000';
var capVideo_glowblur = '4';
var capVideo_backcolor = '#000000';
var capVideo_fontsize = '12';
var capVideo_fontfamily = 'Arial';
var capVideo_prompt = 'Captions';
var capVideo_tooltip = '';
var style_fontfamily = 'Arial';
var style_icons_color = "#DDDDDD";
var style_mouse_color = "#FFFFFF";
var style_onvideo_button_color = "#333333";
var style_onvideo_mouse_color = "#999999";
var style_onvideo_icons_color = "#FFFFFF";
var skin = '/content/uiconf/kaltura/kmc/appstudio/kdp3/falcon/skin/v3.7/skin.swf';
var skin_theme = 'b';
var uiconf_id;
var player_name = '';
var player_id = '';
var player_entryid;
var width;
var height;
var playlist_thumbnail = true;
var playlist_name = true;
var playlist_description = true;
var playlist_plays = false;
var playlist_rank = false;
var playlist_votes = false;
var playlist_duration = true;
var playlist_tags = false;
var playlist_admintags = false;
var playlist_createddate = false;
var playlist_createdby = false;
var playlist_previous = true;
var playlist_previous_tooltip = "Previous";
var playlist_next = true;
var playlist_next_tooltip = "Next";
var playlist_autocontinue = false;
var playlist_loop = false;
var playlist_visible = true;
var playlist_imageduration = 2;
var playlist_rowHeight = 30;
var playlist_items = 0;

var vast, bumper, vast_bumper, vast_presequence, vast_postsequence, bumper_presequence, bumper_postsequence, vast_preroll, vast_postroll, vast_overlay;
var fullscreen, fullscreen_video, ovplay, playpause, vol, unmute, unmute_video, share, share_video, download, download_video, thumbnail, thumbnail_video;
var customButton1, customButton1_video, customButton2, customButton2_video, customButton3, customButton3_video, customButton4, customButton4_video, customButton5, customButton5_video;
//Login prototype/class
Players.prototype = {
    constructor: Players,
    //Build tickets table
    getPlayers:function(){
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#players-table').empty();
        $('#players-table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="players-data"></table>');
        playersTable = $('#players-data').DataTable({
            "dom": 'R<"H"lfr>t<"F"ip<"processing-loading">>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": true,
            "serverSide": true,
            "autoWidth": false,
            "pagingType": "bootstrap",
            "pageLength": 10,
            "searching": true,
            "info": true,            
            "lengthChange": false,
            "responsive": true,
            "columnDefs": [
            {
                responsivePriority: 1, 
                targets: 2
            },
            {
                responsivePriority: 2, 
                targets: 3
            },
            {
                responsivePriority: 3, 
                targets: -1
            }
            ],
            "ajax": {
                "url": "/api/v1/getPlayers",
                "type": "GET",
                "data": function ( d ) {                    
                    return $.extend( {}, d, {
                        "_token": $('meta[name="csrf-token"]').attr('content'),
                        "pid": sessInfo.pid,
                        "ks": sessInfo.ks,
                        "tz": tz,
                        "m": ($.inArray("STUDIO_UPDATE_UICONF", sessPerm) != -1)? true : false,
                        "d": ($.inArray("STUDIO_DELETE_UICONF", sessPerm) != -1)? true : false
                    } );
                },
                "dataSrc": function ( json ) {
                    total_entries = json['recordsTotal'];
                    return json.data 
                }
            },
            "language": {
                "zeroRecords": "No Players Found"
            },
            "columns": [
            {
                "title": "<span style='float: left;'><input type='checkbox' class='players-bulk' id='players-bulkAll' style='width:16px; margin-right: 7px;' name='players_bulkAll' /></span>",
                "width": "10px"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>ID</div></span>"
            }, 
            {
                "title": "<span style='float: left;'><div class='data-break'>Name</div></span>"
            },   
            {
                "title": "<span style='float: left;'><div class='data-break'>Created On</div></span>"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>Size</div></span>"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>Type</div></span>"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>Actions</div></span>",
                "width": "170px"
            },
            ],           
            "preDrawCallback": function() {
                smhMain.showProcessing();
            },           
            "drawCallback": function( oSettings ) {
                smhMain.hideProcessing();
                smhMain.fcmcAddRows(this, 7, 10);     
            }                                
        });
        $('#users-buttons .dd-delete-btn').removeClass('btn-default');
        $('#users-buttons .dd-delete-btn').addClass('btn-disabled');
        $('#users-buttons .dd-delete-btn').attr('disabled','');
        $('#players-table').on('change',".players-bulk",function(){
            var anyBoxesChecked = false;
            $('#players-table input[type="checkbox"]').each(function() {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                }
            });
            
            if (anyBoxesChecked == true && ($.inArray("STUDIO_DELETE_UICONF", sessPerm) != -1)){
                $('#users-buttons .dd-delete-btn').removeClass('btn-disabled');
                $('#users-buttons .dd-delete-btn').addClass('btn-default');
                $('#users-buttons .dd-delete-btn').removeAttr('disabled');
            } else {
                $('#users-buttons .dd-delete-btn').removeClass('btn-default');
                $('#users-buttons .dd-delete-btn').addClass('btn-disabled');
                $('#users-buttons .dd-delete-btn').attr('disabled','');
            }
        });
        $('#players-bulkAll').click(function(){
            if(this.checked){
                $('.players-bulk').each(function(){
                    this.checked = true; 
                });
            } else {
                $('.players-bulk').each(function(){
                    this.checked = false; 
                });
            }
        });
    },
    //Delete Player modal
    deletePlayer:function(id,name){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','435px');
        $('#smh-modal .modal-body').css('padding','0');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Delete</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='text-align: center; margin: 27px 27px 0; height: 75px; width: 378px;'>Are you sure you want to delete the following player?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>("+name+")</div>";          
 
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="delete-player" onclick="smhPlayers.removePlayer(\''+id+'\')">Delete</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Remove Player
    removePlayer:function(id){
        var cb = function (success, results){
            if(!success)
                alert(results);

            if(results == null){
                $('#smh-modal').modal('hide');
                smhPlayers.getPlayers();
            } else if(results.code && results.message){
                alert(results.message);
                return;
            }                
        };
        
        $('#delete-player').attr('disabled','');
        $('#smh-modal #loading img').css('display','inline-block');
        client.uiConf.deleteAction(cb, id); 
    },
    //Bulk delete modal
    bulkDeleteModal:function(){
        bulkdelete = new Array();
        var rowcollection =  playersTable.$(".players-bulk:checked", {
            "page": "all"
        });
        rowcollection.each(function(index,elem){
            var checkbox_value = $(elem).val();
            bulkdelete.push(checkbox_value);            
        });
        
        if(bulkdelete.length == 0){
            smhPlayers.noEntrySelected();
        } else {
            smhMain.resetModal();
            var header, content, footer;
            $('.smh-dialog').css('width','440px');
            $('#smh-modal .modal-body').css('padding','0');
            $('#smh-modal').modal({
                backdrop: 'static'
            }); 
        
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Bulk Delete</h4>';
            $('#smh-modal .modal-header').html(header);

            content = '<div style="padding-top: 25px; padding-bottom: 25px; text-align: center;">Are you sure you want to delete the selected players?</div>';
 
            $('#smh-modal .modal-body').html(content);
        
            footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="delete-players" onclick="smhPlayers.bulkDelete()">Delete</button>';
            $('#smh-modal .modal-footer').html(footer);          
        }
    },
    //Do bulk delete
    bulkDelete:function(){
        var cb = function (success, results){
            if(!success)
                alert(results);

            if(results.code && results.message){
                alert(results.message);
                return;
            }          
            $('#smh-modal').modal('hide');
            smhPlayers.getPlayers();
        };
        
        $('#delete-players').attr('disabled','');
        $('#smh-modal #loading img').css('display','inline-block');  
        client.startMultiRequest();
        $.each(bulkdelete, function(key, value) {
            client.uiConf.deleteAction(cb, value);
        });
        client.doMultiRequest(cb);         
    },
    //No Entry selected
    noEntrySelected:function(){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','286px');
        $('#smh-modal .modal-body').css('padding','0');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">No Player Selected</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div style="padding-top: 15px; padding-bottom: 15px; text-align: center;">You must select a player</div>';
 
        $('#smh-modal .modal-body').html(content);
        
        footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Creates a duplicate of a player
    duplicatePlayer:function(id){
        var cb = function (success, results){
            if(!success)
                alert(results);

            if(results.code && results.message){
                alert(results.message);
                return;
            }            
            smhPlayers.getPlayers();                           
        };

        client.uiConf.cloneAction(cb, id);
    },
    //Renders Player
    renderPlayer:function(){
        var player_prev_gen = smhPlayers.generateEmbed(player_entryid,flashvars['width'],flashvars['height'],'https','legacy',false,'Player Preview',true);
        var player_prev = player_prev_gen.getCode();
        smhPlayers.generateIframe(player_prev);
    },
    //Generates QR code
    getShortLink:function(uiconf,embed,delivery){  
        var cb = function (success, results){
            if(!success)
                alert(results);

            if(results.code && results.message){
                alert(results.message);
                return;
            }
            $('#qrcode').empty();
            shortlink = 'http://mediaplatform.streamingmediahosting.com/tiny/'+results['id'];
            var qrcode = new QRCode(document.getElementById("qrcode"), {
                width : 80,
                height : 80
            });
            qrcode.clear();
            qrcode.makeCode(shortlink);
            $('#shortlink').html('<a target="_blank" href="'+shortlink+'">'+shortlink+'</a>');
        };
        var url = '';        
        if(delivery == 'http'){
            url = "http://mediaplatform.streamingmediahosting.com/index.php/extwidget/preview/partner_id/"+sessInfo.pid+"/uiconf_id/"+uiconf+"/embed/"+embed+"?&flashvars[ks]="+sessInfo.ks;
        } else {
            url = "http://mediaplatform.streamingmediahosting.com/index.php/extwidget/preview/partner_id/"+sessInfo.pid+"/uiconf_id/"+uiconf+"/embed/"+embed+"?&flashvars[streamerType]=rtmp&flashvars[mediaProtocol]=rtmp&flashvars[ks]="+sessInfo.ks;
        }
        
        $('#shortlink').html('Generating...');
        $('#qrcode').html('Generating...');
        var shortLink = new KalturaShortLink();
        shortLink.systemName = "KMC-PREVIEW";
        shortLink.fullUrl = url;
        client.shortLink.add(cb, shortLink);        
    },
    //Parses an xml file
    parseXML:function(xml){
        var dom = null;
        if (window.DOMParser) {
            try { 
                dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
            } 
            catch (e) {
                dom = null;
            }
        }
        else if (window.ActiveXObject) {
            try {
                dom = new ActiveXObject('Microsoft.XMLDOM');
                dom.async = false;
                if (!dom.loadXML(xml)) // parse error ..

                    window.alert(dom.parseError.reason + dom.parseError.srcText);
            } 
            catch (e) {
                dom = null;
            }
        }
        else
            alert("cannot parse xml string!");
        return dom;
    },
    //Gets available playlists
    getAvailablePlaylist:function(parr){
        var MULTI = new Array();
        var addOn = "";
    
        var defaults = {
            animatePadding: 60,
            ApiUrl:	"/api_v3/index.php?",
            sessSrv: 	"multirequest",
            sessAct:	"null",
            format:	"1"
        };    
             
        var options = $.extend(defaults, options);
         
        var o =options;
    
        var x = 1;
        $.each(parr, function(key, value) {
            addOn += '&'+x+':service=playlist&'+x+':action=get&'+x+':id='+value;  
            x++;
        });    
    
        var sessData = 'ks='+sessInfo.ks+'&ignoreNull=1'+addOn;
    
        var reqObj = {
            service: o.sessSrv, 
            action: o.sessAct, 
            format: o.format
        
        };
        var reqUrl = o.ApiUrl + $.param(reqObj);	
        var i=0;
        $.ajax({
            cache: 		false,
            async:              false,
            url:		reqUrl,
            type:		'POST',
            data:		sessData,
            dataType:		'json',
            success:function(data) {
                $.each(data, function(key, value) {
                    if(value['code']){
                    } else {
                        var theDate = new Date(value['createdAt'] * 1000);                 
                        var newDatetime = theDate.toString("MM/dd/yyyy hh:mm tt");                   
                                  
                        var playlistType;
                        if(value['playlistType'] == 10){
                            playlistType = 'Rule Based';
                        }
                        else if (value['playlistType'] == 3){
                            playlistType = 'Manual'; 
                        }   
                        
                        var entry_container = '<div class="entry-wrapper ui-draggable ui-draggable-dragging hover" data-entryid="' + value['id'] + '" data-name="' + value['name'] + '">'+
                        '<div class="entry-details">'+
                        '<div class="entry-name">'+
                        '<div>' + value['name'] + '</div>'+
                        '</div>'+
                        '<div class="entry-subdetails">'+
                        '<span style="width: 85px; display: inline-block;">Playlist ID:</span><span>' + value['id'] +'</span>'+
                        '</div>'+
                        '<div class="entry-subdetails">'+
                        '<span style="width: 85px; display: inline-block;">Created on:</span><span>' + newDatetime + '</span>'+
                        '</div>'+
                        '<div class="entry-subdetails">'+
                        '<span style="width: 85px; display: inline-block;">Type:</span><span>' + playlistType + '</span>'+
                        '</div>'+
                        '</div>'+
                        '<div class="tools" onclick="smhPlayers.removeDND(this);">'+
                        '<i class="fa fa-trash-o"></i>'+
                        '</div>'+
                        '<div class="clear"></div>'+
                        '</div>';
                               
                        MULTI[i] = new Array(entry_container,value['id']);       
                        i++;                   
                    }             

                });		
            }
        }); 
        return MULTI;
    },
    //Generate Player Embed Code
    generatePlayerEmbed:function(uiconf_id,width,height,protocol,streamerType,embed,seo,name,preview,playlist){
        var entries = playlist.split(':');
        var sType = '';
        if(streamerType == 'http'){
            sType = '&';
        } else {
            sType = 'rtmp';
        }
        
        var flashvars = {};
        flashvars.streamerType = sType;
        flashvars['playlistAPI.includeInLayout'] = true;
        
        var i = 0;
        $.each(entries, function(key, value) {
            flashvars['playlistAPI.kpl'+i+'Id'] = value;
            i++;
        });            
        
        if(height > width){
            flashvars['playlistAPI.containerPosition'] = "bottom";
        }
        
        if(preview){
            flashvars.ks = sessInfo.ks;
        }
        
        var cacheSt = smhPlayers.getCacheSt();
        var gen = new kEmbedCodeGenerator({
            host: "mediaplatform.streamingmediahosting.com",
            securedHost: "mediaplatform.streamingmediahosting.com",
            embedType: embed,
            partnerId: sessInfo.pid,
            widgetId: "_"+sessInfo.pid,
            uiConfId: uiconf_id,
            playerId: "smh_player",
            width: width,
            height: height,
            cacheSt: cacheSt,
            includeKalturaLinks: false,
            includeSeoMetadata: seo,
            protocol: protocol,
            flashVars: flashvars,
            entryMeta : {
                name: name,
                thumbnailUrl: "",
                width: width,
                height: height
            }
        }); 
        return gen;
    },
    //Preview and embed playlists
    previewPlayer:function(uiconf_id,name){
        var cb = function (success, results){
            if(!success)
                alert(results);

            if(results.code && results.message){
                alert(results.message);
                return;
            }
            
            var PLAYLIST_ENTRIES=new Array();
            var TEMP_MULTI=new Array();
            var multi;
            var playlist = '';
            var xml1 = results['confFileFeatures'];
            var xml_dom = smhPlayers.parseXML(xml1);
            var player_uiconf_id = $(xml_dom).find("snapshot").attr('fullPlayerId');
            var width, height;
            
            $(xml_dom).find('playerProperties').each(function(){
                width = $(this).find("width").text();
                height = $(this).find("height").text();
            });
            
            $(xml_dom).find('uiVars').each(function(){
                if(player_uiconf_id == '6709441'){
                    $(this).find("var").each(function(){
                        if($(this).attr('key').search('EntryId') != '-1'){
                            TEMP_MULTI.push($(this).attr('value')); 
                        }
                    });
                    multi = smhPlayers.getAvailablePlaylist(TEMP_MULTI);                    
    
                    $.each(multi, function(key, value) {
                        PLAYLIST_ENTRIES.push(value[1]);        
                    });                       
                }
            });
            
            playlist = PLAYLIST_ENTRIES.join(":");
            
            smhMain.resetModal();
            var header, content, gen, embedCode, player_prev_gen, player_prev;
            var protocol = 'http';
            var seo = false;
            $('#smh-modal3 .modal-body').css('padding','0');
            $('#smh-modal3').modal({
                backdrop: 'static'
            });
            $('#smh-modal3').addClass('previewModal');
        
            var header_text = 'Preview';
            if($.inArray("PLAYLIST_EMBED_CODE", sessPerm) != -1){
                header_text = 'Preview & Embed';
            }
        
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">'+header_text+': '+name.replace(/%20/g," ")+'</h4>';
            $('#smh-modal3 .modal-header').html(header);
        
            var embed_perm = '';
            var embed_type = '';
            var secure_seo = '';
            if($.inArray("PLAYLIST_EMBED_CODE", sessPerm) != -1){
                embed_perm = '<hr>'+
                '<div style="margin-top: 10px; font-weight: bold;"><div style="color: #444; font-size: 12px; padding-top: 15px; float: left;">Embed Code:</div><div style="float: right; margin-right: 13px;"><button id="select-bttn" class="btn btn-default" style="margin: 10px 0 10px 0;">Select Code</button></div></div>'+
                '<textarea class="form-control" id="embed_code" rows="5" cols="30"></textarea>';
                embed_type = '<hr>'+
                '<div style="margin-top: 10px; font-weight: bold;"><span style="color: #444; font-size: 12px; margin-right: 37px;">Embed Type:</span><span><select class="form-control embedType" style="width: 213px;"><option value="dynamic">Dynamic Embed</option><option value="iframe">Iframe Embed</option><option value="legacy">Legacy Embed</option></select></span></div>'+
                '<div style="margin-top: 5px;"><span id="embedType-text" style="font-size: 12px; color: #999;">Dynamic embed is the preferred method to dynamically embed the player into web sites and web applications.</span></div>';
                secure_seo = '<hr>'+        
            '<div style="margin-top: 10px; font-weight: bold;"><span><input type="checkbox" id="secure" name="secure"></span>&nbsp;<span style="color: #444; font-size: 12px; font-weight: bold; margin-left: 5px; position: relative; top: -2px;">Support for HTTPS embed code</span></div>'+
            '<div style="margin-top: 10px; font-weight: bold;"><span><input type="checkbox" id="seo" name="seo"></span>&nbsp;<span style="color: #444; font-size: 12px; font-weight: bold; margin-left: 5px; position: relative; top: -2px;">Include Search Engine Optimization data</span></div>';    
            }
        
            content = '<div class="content">'+
            '<div class="options">'+
            '<div style="margin-top: 10px; font-weight: bold;"><span style="color: #444; font-size: 12px;margin-right: 30px;">Delivery Type:</span><span><select class="form-control delivery" style="width: 213px;"><option value="rtmp">RTMP Streaming</option><option value="http">HTTP Progressive Download</option></select></span></div>'+
            '<div style="margin-top: 5px;"><span style="font-size: 12px; color: #999;">Adaptive Streaming automatically adjusts to the viewer\'s bandwidth,while Progressive Download allows buffering of the content.</span></div>'+
            embed_type+
            secure_seo+
            '<hr>'+    
            '<div style="margin-top: 10px; font-weight: bold;"><span style="color: #444; font-size: 12px; margin-right: 52px;">Preview:</span></div>'+
            '<div style="margin-top: 5px;"><span style="font-size: 12px; color: #999;">Scan the QR code to preview in your mobile device</span></div>'+
            '<div id="qrcode" style="margin-top: 5px; font-size: 12px; width: 80px; height: 80px;"></div>'+
            '<hr>'+ 
            '<div style="margin-top: 5px;"><span style="font-size: 12px; color: #999;">View a standalone page with this player</span></div>'+
            '<div id="shortlink" style="margin-top: 5px; font-size: 12px; word-wrap: break-word;"></div>'+
            embed_perm+
            '</div>'+
            '<div class="player_preview">Preview Player<hr>'+
            '<div id="previewIframe" style="margin-top: 5px;"></div>'+
            '</div>'+
            '</div>';    
            $('#smh-modal3 .modal-body').html(content);
        
            $('.options').mCustomScrollbar({
                theme:"inset-dark",
                scrollButtons:{
                    enable: true
                }
            });
                
            var embed = $('select.embedType option:selected').val();
            var delivery = $('select.delivery option:selected').val();
        
            smhPlayers.getShortLink(uiconf_id,embed,delivery);
            if($.inArray("PLAYLIST_EMBED_CODE", sessPerm) != -1){
                gen = smhPlayers.generatePlayerEmbed(uiconf_id,width,height,protocol,delivery,embed,seo,name,false,playlist);
                embedCode = gen.getCode();
                $('#embed_code').text(embedCode);  
            }        
        
            player_prev_gen = smhPlayers.generatePlayerEmbed(uiconf_id,width,height,'https',delivery,'legacy',seo,name,true,playlist);
            player_prev = player_prev_gen.getCode();
            smhPlayers.generateIframe(player_prev);
        
            $('select.delivery').on('change', function(event) {
                delivery = $('select.delivery option:selected').val();
                player_prev_gen = smhPlayers.generatePlayerEmbed(uiconf_id,width,height,'https',delivery,'legacy',seo,name,true,playlist);                         
                smhPlayers.getShortLink(uiconf_id,embed,delivery);
                if($.inArray("PLAYLIST_EMBED_CODE", sessPerm) != -1){
                    gen = smhPlayers.generatePlayerEmbed(uiconf_id,width,height,protocol,delivery,embed,seo,name,false,playlist);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);              
                }
                player_prev = player_prev_gen.getCode();            
                smhPlayers.generateIframe(player_prev);
            });
        
            if($.inArray("PLAYLIST_EMBED_CODE", sessPerm) != -1){
                $('select.embedType').on('change', function(event) {
                    embed = $('select.embedType option:selected').val();
                    if(embed == 'dynamic'){
                        $('#embedType-text').html('Dynamic embed is the preferred method to dynamically embed the player into web sites and web applications.');
                    } else if(embed == 'iframe'){
                        $('#embedType-text').html('Iframe embed is good for sites that do not allow 3rd party JavaScript to be embeded on their pages.');
                    } else if(embed == 'legacy'){
                        $('#embedType-text').html('This basic player embed method works by including the JavaScript library followed by the Flash object tag embed.');
                    }
                    player_prev_gen = smhPlayers.generatePlayerEmbed(uiconf_id,width,height,'https',delivery,'legacy',seo,name,true,playlist);                                   
                    smhPlayers.getShortLink(uiconf_id,embed,delivery);
            
                    gen = smhPlayers.generatePlayerEmbed(uiconf_id,width,height,protocol,delivery,embed,seo,name,false,playlist);            
                    embedCode = gen.getCode();            
                    $('#embed_code').text(embedCode);                        
                    player_prev = player_prev_gen.getCode();
                    smhPlayers.generateIframe(player_prev);            
                });
                $('.previewModal .options').on('change', '#secure', function(event){
                    if($("#secure").is(':checked')){
                        protocol = 'https';
                        gen = smhPlayers.generatePlayerEmbed(uiconf_id,width,height,protocol,delivery,embed,seo,name,false,playlist);
                        embedCode = gen.getCode();
                        $('#embed_code').text(embedCode);
                    } else {
                        protocol = 'http';
                        gen = smhPlayers.generatePlayerEmbed(uiconf_id,width,height,protocol,delivery,embed,seo,name,false,playlist);
                        embedCode = gen.getCode();
                        $('#embed_code').text(embedCode);
                    }
                });  
                $('.previewModal .options').on('change', '#seo', function(event){
                    if($("#seo").is(':checked')){
                        seo = true;
                        gen = smhPlayers.generatePlayerEmbed(uiconf_id,width,height,protocol,delivery,embed,seo,name,false,playlist);
                        embedCode = gen.getCode();
                        $('#embed_code').text(embedCode);
                    } else {
                        seo = false;
                        gen = smhPlayers.generatePlayerEmbed(uiconf_id,width,height,protocol,delivery,embed,seo,name,false,playlist);
                        embedCode = gen.getCode();
                        $('#embed_code').text(embedCode);
                    }
                });  
            }
                
            $('#smh-modal3').on('click', '#select-bttn', function(event){
                $('#smh-modal3 #embed_code').select();     
            });
        };
        
        client.uiConf.get(cb, uiconf_id);
    },
    //Generate Playlist Embed Code
    generatePlaylistEmbed:function(uiconf_id,entryId,width,height,protocol,streamerType,embed,seo,name,preview){
        var sType = '';
        if(streamerType == 'http'){
            sType = '&';
        } else {
            sType = 'rtmp';
        }
        
        var flashvars = {};
        flashvars.streamerType = sType;
        flashvars['playlistAPI.includeInLayout'] = true;
        flashvars['playlistAPI.kpl0Id'] = entryId;
        
        if(height > width){
            flashvars['playlistAPI.containerPosition'] = "bottom";
        }
        
        if(preview){
            flashvars.ks = sessInfo.ks;
        }
        
        var cacheSt = smhPlayers.getCacheSt();
        var gen = new kEmbedCodeGenerator({
            host: "mediaplatform.streamingmediahosting.com",
            securedHost: "mediaplatform.streamingmediahosting.com",
            embedType: embed,
            partnerId: sessInfo.pid,
            widgetId: "_"+sessInfo.pid,
            uiConfId: uiconf_id,
            playerId: "smh_player",
            width: width,
            height: height,
            cacheSt: cacheSt,
            includeKalturaLinks: false,
            includeSeoMetadata: seo,
            protocol: protocol,
            flashVars: flashvars,
            attributes: {
                'wmode': 'opaque'
            },
            entryMeta : {
                name: name,
                thumbnailUrl: protocol+"://imgs.mediaportal.streamingmediahosting.com/p/"+sessInfo.pid+"/sp/"+sessInfo.pid+"00/thumbnail/entry_id/"+entryId+"/width/120/height/90/bgcolor/000000/type/2",
                width: width,
                height: height
            }
        }); 
        return gen;
    },
    //Generate Cache
    getCacheSt:function(){
        var d = new Date();
        return Math.floor(d.getTime() / 1000) + (15 * 60); // start caching in 15 minutes
    },
    //Generate iframe code
    generateIframe:function(embedCode){
        $('#previewIframe').empty();
        var style = '<style>html, body {margin: 0; padding: 0; width: 100%; height: 100%; } #framePlayerContainer {margin: 0 auto; padding-top: 20px; text-align: center; } object, div { margin: 0 auto; }</style>';
        var iframe = document.createElement('iframe');
        // Reset iframe style
        iframe.frameborder = "0";
        iframe.frameBorder = "0";
        iframe.marginheight="0";
        iframe.marginwidth="0";
        iframe.frameborder="0";
        iframe.setAttribute('allowFullScreen', '');
        iframe.setAttribute('webkitallowfullscreen', '');
        iframe.setAttribute('mozallowfullscreen', '');
        $('#previewIframe').append(iframe);
        var newDoc = iframe.contentDocument;
        newDoc.open();
        newDoc.write('<!doctype html><html><head>' + style + '</head><body><div id="framePlayerContainer">' + embedCode + '</div></body></html>');
        newDoc.close();
    },
    //Generate embed code
    generateEmbed:function(entryId,width,height,protocol,embed,seo,name){ 
        var cacheSt = smhPlayers.getCacheSt();
        if (uiconf_id == '6709439' || uiconf_id == '6709440'){
            flashvars['playlistAPI.kpl0Url'] = '%2Findex.php%2Fpartnerservices2%2Fexecuteplaylist%3Fplaylist_id%3D0_4kegnhto%26partner_id%3D10364%26subp_id%3D1036400%26format%3D8%26ks%3D%7Bks%7D';        
        } else if (uiconf_id == '6709441'){
            flashvars['playlistAPI.kpl0Name'] = 'playlist1';
            flashvars['playlistAPI.kpl0Url'] = '%2Findex.php%2Fpartnerservices2%2Fexecuteplaylist%3Fplaylist_id%3D0_4kegnhto%26partner_id%3D10364%26subp_id%3D1036400%26format%3D8%26ks%3D%7Bks%7D';
            flashvars['playlistAPI.kpl1Name'] = 'playlist2';
            flashvars['playlistAPI.kpl1Url'] = '%2Findex.php%2Fpartnerservices2%2Fexecuteplaylist%3Fplaylist_id%3D0_swntsdn9%26partner_id%3D10364%26subp_id%3D1036400%26format%3D8%26ks%3D%7Bks%7D';
            flashvars['tabBar.color1'] = style_onvideo_icons_color.replace("#","0x");
        }

        if (uiconf_id == '6709439' || uiconf_id == '6709440' || uiconf_id == '6709441'){
            flashvars['playlistAPI.includeInLayout'] = true;
            flashvars['playlistAPI.autoInsert'] = true;
            flashvars['playlistHolder.visible'] =  playlist_visible;
            flashvars['playlistHolder.includeInLayout'] =  playlist_visible;
            flashvars['irImageIrScreen.visible'] =  playlist_thumbnail;
            flashvars['irImageIrScreen.includeInLayout'] =  playlist_thumbnail;
            flashvars['irLinkIrScreen.visible'] =  playlist_name;
            flashvars['irLinkIrScreen.includeInLayout'] =  playlist_name;
            flashvars['irLinkIrScreen.font'] =  style_fontfamily;
            flashvars['irLinkIrScreen.dynamicColor'] =  true;
            flashvars['irLinkIrScreen.color1'] =  style_onvideo_icons_color.replace("#","0x");
            flashvars['irDescriptionIrScreen.visible'] =  playlist_description;
            flashvars['irDescriptionIrScreen.includeInLayout'] =  playlist_description;
            flashvars['irDescriptionIrScreen.font'] =  style_fontfamily;
            flashvars['irDescriptionIrScreen.dynamicColor'] =  true;
            flashvars['irDescriptionIrScreen.color1'] =  style_onvideo_icons_color.replace("#","0x");
            flashvars['irDurationIrScreen.visible'] =  playlist_duration;
            flashvars['irDurationIrScreen.includeInLayout'] =  playlist_duration;
            flashvars['irDurationIrScreen.font'] =  style_fontfamily;
            flashvars['irDurationIrScreen.dynamicColor'] =  true;
            flashvars['irDurationIrScreen.color1'] =  style_onvideo_icons_color.replace("#","0x");
            flashvars['irPlaysIrScreen.visible'] =  playlist_plays;
            flashvars['irPlaysIrScreen.includeInLayout'] =  playlist_plays;
            flashvars['irPlaysIrScreen.font'] =  style_fontfamily;
            flashvars['irPlaysIrScreen.dynamicColor'] =  true;
            flashvars['irPlaysIrScreen.color1'] =  style_onvideo_icons_color.replace("#","0x");
            flashvars['irRankIrScreen.visible'] =  playlist_rank;
            flashvars['irRankIrScreen.includeInLayout'] =  playlist_rank;
            flashvars['irRankIrScreen.font'] =  style_fontfamily;
            flashvars['irRankIrScreen.dynamicColor'] =  true;
            flashvars['irRankIrScreen.color1'] =  style_onvideo_icons_color.replace("#","0x");
            flashvars['irVotesIrScreen.visible'] =  playlist_votes;
            flashvars['irVotesIrScreen.includeInLayout'] =  playlist_votes;
            flashvars['irVotesIrScreen.font'] =  style_fontfamily;
            flashvars['irVotesIrScreen.dynamicColor'] =  true;
            flashvars['irVotesIrScreen.color1'] =  style_onvideo_icons_color.replace("#","0x");
            flashvars['irTagsIrScreen.visible'] =  playlist_tags;
            flashvars['irTagsIrScreen.includeInLayout'] =  playlist_tags;
            flashvars['irTagsIrScreen.font'] =  style_fontfamily;
            flashvars['irTagsIrScreen.dynamicColor'] =  true;
            flashvars['irTagsIrScreen.color1'] =  style_onvideo_icons_color.replace("#","0x");
            flashvars['irAdminTagsIrScreen.visible'] =  playlist_admintags;
            flashvars['irAdminTagsIrScreen.includeInLayout'] =  playlist_admintags;
            flashvars['irAdminTagsIrScreen.font'] =  style_fontfamily;
            flashvars['irAdminTagsIrScreen.dynamicColor'] =  true;
            flashvars['irAdminTagsIrScreen.color1'] =  style_onvideo_icons_color.replace("#","0x");
            flashvars['irCreatedAtIrScreen.visible'] =  playlist_createddate;
            flashvars['irCreatedAtIrScreen.includeInLayout'] =  playlist_createddate;
            flashvars['irCreatedAtIrScreen.font'] =  style_fontfamily;
            flashvars['irCreatedAtIrScreen.dynamicColor'] =  true;
            flashvars['irCreatedAtIrScreen.color1'] =  style_onvideo_icons_color.replace("#","0x");
            flashvars['list.rowHeight'] =  playlist_rowHeight;
            flashvars['irCreatedByIrScreen.visible'] =  playlist_createdby;
            flashvars['irCreatedByIrScreen.includeInLayout'] =  playlist_createdby;
            flashvars['irCreatedByIrScreen.font'] =  style_fontfamily;
            flashvars['irCreatedByIrScreen.dynamicColor'] =  true;
            flashvars['irCreatedByIrScreen.color1'] =  style_onvideo_icons_color.replace("#","0x");
            flashvars['previousBtnControllerScreen.visible'] =  playlist_previous;
            flashvars['previousBtnControllerScreen.includeInLayout'] =  playlist_previous;
            flashvars['previousBtnControllerScreen.color1'] =  style_icons_color.replace("#","0x");
            flashvars['previousBtnControllerScreen.color2'] =  style_mouse_color.replace("#","0x");
            flashvars['previousBtnControllerScreen.tooltip'] =  playlist_previous_tooltip;
            flashvars['nextBtnControllerScreen.visible'] =  playlist_next;
            flashvars['nextBtnControllerScreen.includeInLayout'] =  playlist_next;
            flashvars['nextBtnControllerScreen.color1'] =  style_icons_color.replace("#","0x");
            flashvars['nextBtnControllerScreen.color2'] =  style_mouse_color.replace("#","0x");
            flashvars['nextBtnControllerScreen.tooltip'] =  playlist_next_tooltip;
        
            if(height > width){
                flashvars['playlistAPI.containerPosition'] = "bottom";
            } 
            
            var gen = new kEmbedCodeGenerator({
                host: "mediaplatform.streamingmediahosting.com",
                securedHost: "mediaplatform.streamingmediahosting.com",
                embedType: embed,
                partnerId: 10364,
                widgetId: "_10364",
                uiConfId: uiconf_id,
                playerId: "smh_player",
                width: width,
                height: height,
                cacheSt: cacheSt,
                includeKalturaLinks: false,
                includeSeoMetadata: seo,
                protocol: protocol,
                flashVars: flashvars,
                entryMeta : {
                    name: name,
                    thumbnailUrl: "http://imgs.mediaportal.streamingmediahosting.com/p/10364/sp/1036400/thumbnail/entry_id/"+entryId+"/width/120/height/90/bgcolor/000000/type/2",
                    width: width,
                    height: height
                }
            }); 
        } else {
            var gen = new kEmbedCodeGenerator({
                host: "mediaplatform.streamingmediahosting.com",
                securedHost: "mediaplatform.streamingmediahosting.com",
                embedType: embed,
                partnerId: 10364,
                widgetId: "_10364",
                uiConfId: uiconf_id,
                entryId: entryId,
                playerId: "smh_player",
                width: width,
                height: height,
                cacheSt: cacheSt,
                includeKalturaLinks: false,
                includeSeoMetadata: seo,
                protocol: protocol,
                flashVars: flashvars,
                entryMeta : {
                    name: name,
                    thumbnailUrl: "http://imgs.mediaportal.streamingmediahosting.com/p/10364/sp/1036400/thumbnail/entry_id/"+entryId+"/width/120/height/90/bgcolor/000000/type/2",
                    width: width,
                    height: height
                }
            }); 
        }

        return gen;
    },
    //Refresh Player
    refreshPlayer:function(){
        var width = $('#dim_width').val();
        var height = $('#dim_height').val();
        flashvars['width'] = width;
        flashvars['height'] = height; 
        $('#previewTarget').css('width',width);
        $('#previewTarget').css('height',height);
        smhPlayers.renderPlayer();
    },
    //Set Auto Preview
    setAutoPreview:function(){        
        if ($('#auto_preview').is(':checked')) {
            auto_preview = true; 
        } else {
            auto_preview = false; 
        }
    },
    //Configures player for editing
    editPlayer:function(id){
        var cb = function (success, results){
            if(!success)
                alert(results);

            if(results.code && results.message){
                alert(results.message);
                return;
            }

            smhPlayers.defaultPlayerSettings();
            edit = true;
            PLAYLIST_ENTRIES=new Array();
            var TEMP_MULTI=new Array();
            var multi;
    
            player_name = results['name'];
            player_id = id;
            
            var xml1 = results['confFileFeatures'];
            var xml_dom = smhPlayers.parseXML(xml1);
            
            uiconf_id = $(xml_dom).find("snapshot").attr('fullPlayerId');
    
            $(xml_dom).find('featuresData').each(function(){
                var title = $(this).find("feature[k_fullName='TopTitleScreen']").attr('k_value') == "true" ? true : false;
                flashvars['TopTitleScreen.visible'] = title;
                flashvars['TopTitleScreen.includeInLayout'] = title;
                
                var watermark = $(this).find("feature[k_fullName='watermark']").attr('k_value') == "true" ? true : false;
                flashvars['watermark.visible'] = watermark;
                if(watermark){
                    var watermark_url = $(this).find("feature[k_fullName='watermark.watermarkPath']").attr('k_value');
                    flashvars['watermark.watermarkPath'] = watermark_url;
                }
                
                var leftplay = $(this).find("feature[k_fullName='timerControllerScreen1']").attr('k_value') == "true" ? true : false;
                flashvars['timerControllerScreen1.visible'] = leftplay;
                flashvars['timerControllerScreen1.includeInLayout'] = leftplay;
        
                var rightplay = $(this).find("feature[k_fullName='timerControllerScreen2']").attr('k_value') == "true" ? true : false;
                flashvars['timerControllerScreen2.visible'] = rightplay;
                flashvars['timerControllerScreen2.includeInLayout'] = rightplay;
        
                var flavor = $(this).find("feature[k_fullName='flavorComboControllerScreen']").attr('k_value') == "true" ? true : false;
                flashvars['flavorComboControllerScreen.visible'] = flavor;
                flashvars['flavorComboControllerScreen.includeInLayout'] = flavor;
        
                fullscreen = $(this).find("feature[k_fullName='fullScreenBtn']").attr('k_value') == "true" ? true : false;
                if(fullscreen){
                    fullscreen_video = $(this).find("feature[k_fullName='fullScreenBtn.showOnVideoControllers']").attr('k_value') == "true" ? true : false;
                    var fullscreen_controls = $(this).find("feature[k_fullName='fullScreenBtn.ControllerScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['fullScreenBtnControllerScreen.visible'] = fullscreen_controls;
                    flashvars['fullScreenBtnControllerScreen.includeInLayout'] = fullscreen_controls;
                    var fullscreen_before = $(this).find("feature[k_fullName='fullScreenBtn.showOnVideoControllers.StartScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['fullScreenBtnStartScreen.visible'] = fullscreen_before;
                    flashvars['fullScreenBtnStartScreen.includeInLayout'] = fullscreen_before;
                    var fullscreen_during = $(this).find("feature[k_fullName='fullScreenBtn.showOnVideoControllers.PlayScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['fullScreenBtnPlayScreen.visible'] = fullscreen_during;
                    flashvars['fullScreenBtnPlayScreen.includeInLayout'] = fullscreen_during;
                    var fullscreen_paused = $(this).find("feature[k_fullName='fullScreenBtn.showOnVideoControllers.PauseScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['fullScreenBtnPauseScreen.visible'] = fullscreen_paused;
                    flashvars['fullScreenBtnPauseScreen.includeInLayout'] = fullscreen_paused;
                    var fullscreen_end = $(this).find("feature[k_fullName='fullScreenBtn.showOnVideoControllers.EndScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['fullScreenBtnEndScreen.visible'] = fullscreen_end;
                    flashvars['fullScreenBtnEndScreen.includeInLayout'] = fullscreen_end;                 
                } else {
                    flashvars['fullScreenBtnControllerScreen.visible'] = false;
                    flashvars['fullScreenBtnControllerScreen.includeInLayout'] = false;
                    flashvars['fullScreenBtnStartScreen.visible'] = false;
                    flashvars['fullScreenBtnStartScreen.includeInLayout'] = false;
                    flashvars['fullScreenBtnPlayScreen.visible'] = false;
                    flashvars['fullScreenBtnPlayScreen.includeInLayout'] = false;
                    flashvars['fullScreenBtnPauseScreen.visible'] = false;
                    flashvars['fullScreenBtnPauseScreen.includeInLayout'] = false;
                    flashvars['fullScreenBtnEndScreen.visible'] = false;
                    flashvars['fullScreenBtnEndScreen.includeInLayout'] = false;
                }
                
                ovplay = $(this).find("feature[k_fullName='onVideoPlayBtn']").attr('k_value') == "true" ? true : false;
                if(ovplay){
                    var ovplay_video = $(this).find("feature[k_fullName='onVideoPlayBtn.showOnVideoControllers']").attr('k_value') == "true" ? true : false;
                    flashvars['playBtnControllerScreen.visible'] = ovplay_video;
                    flashvars['playBtnControllerScreen.includeInLayout'] = ovplay_video;
                    var ovplay_before = $(this).find("feature[k_fullName='onVideoPlayBtn.showOnVideoControllers.StartScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['onVideoPlayBtnStartScreen.visible'] = ovplay_before;
                    flashvars['onVideoPlayBtnStartScreen.includeInLayout'] = ovplay_before;
                    var ovplay_paused = $(this).find("feature[k_fullName='onVideoPlayBtn.showOnVideoControllers.PauseScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['onVideoPlayBtnPauseScreen.visible'] = ovplay_paused;
                    flashvars['onVideoPlayBtnPauseScreen.includeInLayout'] = ovplay_paused;                  
                } else {
                    flashvars['playBtnControllerScreen.visible'] = false;
                    flashvars['playBtnControllerScreen.includeInLayout'] = false;
                    flashvars['onVideoPlayBtnStartScreen.visible'] = false;
                    flashvars['onVideoPlayBtnStartScreen.includeInLayout'] = false;
                    flashvars['onVideoPlayBtnPauseScreen.visible'] = false;
                    flashvars['onVideoPlayBtnPauseScreen.includeInLayout'] = false;
                }
        
                playpause = $(this).find("feature[k_fullName='playBtn']").attr('k_value') == "true" ? true : false;
                
                vol = $(this).find("feature[k_fullName='volumeBar']").attr('k_value') == "true" ? true : false;
                var vol_override_level = $(this).find("feature[k_fullName='volumeBar.volumeOverride']").attr('k_value') == "true" ? true : false;
                flashvars['volumeBar.forceInitialValue'] = vol_override_level;
                
                var scrub = $(this).find("feature[k_fullName='scrubberContainer']").attr('k_value') == "true" ? true : false;
                flashvars['scrubberContainer.visible'] = scrub;
                flashvars['scrubberContainer.includeInLayout'] = scrub;
                
                var stars = $(this).find("feature[k_fullName='stars']").attr('k_value') == "true" ? true : false;  
                var stars_edit = $(this).find("feature[k_fullName='stars.editable']").attr('k_value') == "true" ? true : false; 
                flashvars['stars.visible'] = stars;
                flashvars['stars.includeInLayout'] = stars;
                flashvars['stars.editable'] = stars_edit;
        
                var replay = $(this).find("feature[k_fullName='replayBtn']").attr('k_value') == "true" ? true : false;
                flashvars['replayBtnEndScreen.visible'] = replay;
                flashvars['replayBtnEndScreen.includeInLayout'] = replay;
        
                unmute = $(this).find("feature[k_fullName='unmuteBtn']").attr('k_value') == "true" ? true : false;
                if(unmute){
                    unmute_video = $(this).find("feature[k_fullName='unmuteBtn.showOnVideoControllers']").attr('k_value') == "true" ? true : false;    
                    var unmute_before = $(this).find("feature[k_fullName='unmuteBtn.showOnVideoControllers.StartScreen']").attr('k_value') == "true" ? true : false; 
                    flashvars['unmuteBtnStartScreen.visible'] = unmute_before;
                    flashvars['unmuteBtnStartScreen.includeInLayout'] = unmute_before;
        
                    var unmute_during = $(this).find("feature[k_fullName='unmuteBtn.showOnVideoControllers.PlayScreen']").attr('k_value') == "true" ? true : false; 
                    flashvars['unmuteBtnPlayScreen.visible'] = unmute_during;
                    flashvars['unmuteBtnPlayScreen.includeInLayout'] = unmute_during;
        
                    var unmute_paused = $(this).find("feature[k_fullName='unmuteBtn.showOnVideoControllers.PauseScreen']").attr('k_value') == "true" ? true : false; 
                    flashvars['unmuteBtnPauseScreen.visible'] = unmute_paused;
                    flashvars['unmuteBtnPauseScreen.includeInLayout'] = unmute_paused;
        
                    var unmute_end = $(this).find("feature[k_fullName='unmuteBtn.showOnVideoControllers.EndScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['unmuteBtnEndScreen.visible'] = unmute_end;
                    flashvars['unmuteBtnEndScreen.includeInLayout'] = unmute_end;             
                } else { 
                    flashvars['unmuteBtnStartScreen.visible'] = false;
                    flashvars['unmuteBtnStartScreen.includeInLayout'] = false;
                    flashvars['unmuteBtnPlayScreen.visible'] = false;
                    flashvars['unmuteBtnPlayScreen.includeInLayout'] = false;
                    flashvars['unmuteBtnPauseScreen.visible'] = false;
                    flashvars['unmuteBtnPauseScreen.includeInLayout'] = false;
                    flashvars['unmuteBtnEndScreen.visible'] = false;
                    flashvars['unmuteBtnEndScreen.includeInLayout'] = false;
                }
        
                share = $(this).find("feature[k_fullName='shareBtn']").attr('k_value') == "true" ? true : false;
                if(share){
                    share_video = $(this).find("feature[k_fullName='shareBtn.showOnVideoControllers']").attr('k_value') == "true" ? true : false;
                    var share_controls = $(this).find("feature[k_fullName='shareBtn.ControllerScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['shareBtnControllerScreen.visible'] = share_controls;
                    flashvars['shareBtnControllerScreen.includeInLayout'] = share_controls;
        
                    var share_before = $(this).find("feature[k_fullName='shareBtn.showOnVideoControllers.StartScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['shareBtnStartScreen.visible'] = share_before;
                    flashvars['shareBtnStartScreen.includeInLayout'] = share_before;
        
                    var share_during = $(this).find("feature[k_fullName='shareBtn.showOnVideoControllers.PlayScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['shareBtnPlayScreen.visible'] = share_during;
                    flashvars['shareBtnPlayScreen.includeInLayout'] = share_during;
        
                    var share_paused = $(this).find("feature[k_fullName='shareBtn.showOnVideoControllers.PauseScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['shareBtnPauseScreen.visible'] = share_paused;
                    flashvars['shareBtnPauseScreen.includeInLayout'] = share_paused;        
                
                    var share_end = $(this).find("feature[k_fullName='shareBtn.showOnVideoControllers.EndScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['shareBtnEndScreen.visible'] = share_end;
                    flashvars['shareBtnEndScreen.includeInLayout'] = share_end;                  
                } else {
                    flashvars['shareBtnControllerScreen.visible'] = false;
                    flashvars['shareBtnControllerScreen.includeInLayout'] = false;
                    flashvars['shareBtnStartScreen.visible'] = false;
                    flashvars['shareBtnStartScreen.includeInLayout'] = false;
                    flashvars['shareBtnPlayScreen.visible'] = false;
                    flashvars['shareBtnPlayScreen.includeInLayout'] = false;
                    flashvars['shareBtnPauseScreen.visible'] = false;
                    flashvars['shareBtnPauseScreen.includeInLayout'] = false;        
                    flashvars['shareBtnEndScreen.visible'] = false;
                    flashvars['shareBtnEndScreen.includeInLayout'] = false;
                }
        
                download = $(this).find("feature[k_fullName='downloadBtn']").attr('k_value') == "true" ? true : false;
                if(download){
                    download_video = $(this).find("feature[k_fullName='downloadBtn.showOnVideoControllers']").attr('k_value') == "true" ? true : false; 
                    var download_controls = $(this).find("feature[k_fullName='downloadBtn.ControllerScreen']").attr('k_value') == "true" ? true : false; 
                    flashvars['downloadBtnControllerScreen.visible'] = download_controls;
                    flashvars['downloadBtnControllerScreen.includeInLayout'] = download_controls;
        
                    var download_before = $(this).find("feature[k_fullName='downloadBtn.showOnVideoControllers.StartScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['downloadBtnStartScreen.visible'] = download_before;
                    flashvars['downloadBtnStartScreen.includeInLayout'] = download_before;
        
                    var download_during = $(this).find("feature[k_fullName='downloadBtn.showOnVideoControllers.PlayScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['downloadBtnPlayScreen.visible'] = download_during;
                    flashvars['downloadBtnPlayScreen.includeInLayout'] = download_during;
        
                    var download_paused = $(this).find("feature[k_fullName='downloadBtn.showOnVideoControllers.PauseScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['downloadBtnPauseScreen.visible'] = download_paused;
                    flashvars['downloadBtnPauseScreen.includeInLayout'] = download_paused;
        
                    var download_end = $(this).find("feature[k_fullName='downloadBtn.showOnVideoControllers.EndScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['downloadBtnEndScreen.visible'] = download_end;
                    flashvars['downloadBtnEndScreen.includeInLayout'] = download_end;               
                } else { 
                    flashvars['downloadBtnControllerScreen.visible'] = false;
                    flashvars['downloadBtnControllerScreen.includeInLayout'] = false;
                    flashvars['downloadBtnStartScreen.visible'] = false;
                    flashvars['downloadBtnStartScreen.includeInLayout'] = false;
                    flashvars['downloadBtnPlayScreen.visible'] = false;
                    flashvars['downloadBtnPlayScreen.includeInLayout'] = false;
                    flashvars['downloadBtnPauseScreen.visible'] = false;
                    flashvars['downloadBtnPauseScreen.includeInLayout'] = false;
                    flashvars['downloadBtnEndScreen.visible'] = false;
                    flashvars['downloadBtnEndScreen.includeInLayout'] = false;
                }            
        
                thumbnail = $(this).find("feature[k_fullName='captureThumbBtn']").attr('k_value') == "true" ? true : false;
                if(thumbnail){
                    thumbnail_video = $(this).find("feature[k_fullName='captureThumbBtn.showOnVideoControllers']").attr('k_value') == "true" ? true : false; 
                    var thumbnail_controls = $(this).find("feature[k_fullName='captureThumbBtn.ControllerScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['captureThumbBtnControllerScreen.visible'] = thumbnail_controls;
                    flashvars['captureThumbBtnControllerScreen.includeInLayout'] = thumbnail_controls;
        
                    var thumbnail_before = $(this).find("feature[k_fullName='captureThumbBtn.showOnVideoControllers.StartScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['captureThumbBtnStartScreen.visible'] = thumbnail_before;
                    flashvars['captureThumbBtnStartScreen.includeInLayout'] = thumbnail_before;
        
                    var thumbnail_during = $(this).find("feature[k_fullName='captureThumbBtn.showOnVideoControllers.PlayScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['downloadBtnPlayScreen.visible'] = thumbnail_during;
                    flashvars['downloadBtnPlayScreen.includeInLayout'] = thumbnail_during;
        
                    var thumbnail_paused = $(this).find("feature[k_fullName='captureThumbBtn.showOnVideoControllers.PauseScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['downloadBtnPauseScreen.visible'] = thumbnail_paused;
                    flashvars['downloadBtnPauseScreen.includeInLayout'] = thumbnail_paused;
        
                    var thumbnail_end = $(this).find("feature[k_fullName='captureThumbBtn.showOnVideoControllers.EndScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['downloadBtnEndScreen.visible'] = thumbnail_end;
                    flashvars['downloadBtnEndScreen.includeInLayout'] = thumbnail_end;                  
                } else {
                    flashvars['captureThumbBtnControllerScreen.visible'] = false;
                    flashvars['captureThumbBtnControllerScreen.includeInLayout'] = false;
                    flashvars['captureThumbBtnStartScreen.visible'] = false;
                    flashvars['captureThumbBtnStartScreen.includeInLayout'] = false;
                    flashvars['downloadBtnPlayScreen.visible'] = false;
                    flashvars['downloadBtnPlayScreen.includeInLayout'] = false;
                    flashvars['downloadBtnPauseScreen.visible'] = false;
                    flashvars['downloadBtnPauseScreen.includeInLayout'] = false;
                    flashvars['downloadBtnEndScreen.visible'] = false;
                    flashvars['downloadBtnEndScreen.includeInLayout'] = false;
                }
    
                customButton1 = $(this).find("feature[k_fullName='custom1Btn']").attr('k_value') == "true" ? true : false;
                if(customButton1){
                    customButton1_video = $(this).find("feature[k_fullName='custom1Btn.showOnVideoControllers']").attr('k_value') == "true" ? true : false;
                    var customButton1_controls = $(this).find("feature[k_fullName='custom1Btn.ControllerScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['custom1BtnControllerScreen.visible'] = customButton1_controls;
                    flashvars['custom1BtnControllerScreen.includeInLayout'] = customButton1_controls;
        
                    var customButton1_before = $(this).find("feature[k_fullName='custom1Btn.showOnVideoControllers.StartScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['custom1BtnStartScreen.visible'] = customButton1_before;
                    flashvars['custom1BtnStartScreen.includeInLayout'] = customButton1_before;
                
                    var customButton1_during = $(this).find("feature[k_fullName='custom1Btn.showOnVideoControllers.PlayScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['custom1BtnPlayScreen.visible'] = customButton1_during;
                    flashvars['custom1BtnPlayScreen.includeInLayout'] = customButton1_during;
        
                    var customButton1_paused = $(this).find("feature[k_fullName='custom1Btn.showOnVideoControllers.PauseScreen']").attr('k_value') == "true" ? true : false;    
                    flashvars['custom1BtnPauseScreen.visible'] = customButton1_paused;
                    flashvars['custom1BtnPauseScreen.includeInLayout'] = customButton1_paused;
        
                    var customButton1_end = $(this).find("feature[k_fullName='custom1Btn.showOnVideoControllers.EndScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['custom1BtnEndScreen.visible'] = customButton1_end;
                    flashvars['custom1BtnEndScreen.includeInLayout'] = customButton1_end;              
                } else {
                    flashvars['custom1BtnControllerScreen.visible'] = false;
                    flashvars['custom1BtnControllerScreen.includeInLayout'] = false;
                    flashvars['custom1BtnStartScreen.visible'] = false;
                    flashvars['custom1BtnStartScreen.includeInLayout'] = false;
                    flashvars['custom1BtnPlayScreen.visible'] = false;
                    flashvars['custom1BtnPlayScreen.includeInLayout'] = false;   
                    flashvars['custom1BtnPauseScreen.visible'] = false;
                    flashvars['custom1BtnPauseScreen.includeInLayout'] = false;
                    flashvars['custom1BtnEndScreen.visible'] = false;
                    flashvars['custom1BtnEndScreen.includeInLayout'] = false;
                }
                
                customButton2 = $(this).find("feature[k_fullName='custom2Btn']").attr('k_value') == "true" ? true : false;
                if(customButton2){
                    customButton2_video = $(this).find("feature[k_fullName='custom2Btn.showOnVideoControllers']").attr('k_value') == "true" ? true : false;
                    var customButton2_controls = $(this).find("feature[k_fullName='custom2Btn.ControllerScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['custom2BtnControllerScreen.visible'] = customButton2_controls;
                    flashvars['custom2BtnControllerScreen.includeInLayout'] = customButton2_controls;
        
                    var customButton2_before = $(this).find("feature[k_fullName='custom2Btn.showOnVideoControllers.StartScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['custom2BtnStartScreen.visible'] = customButton2_before;
                    flashvars['custom2BtnStartScreen.includeInLayout'] = customButton2_before;
                
                    var customButton2_during = $(this).find("feature[k_fullName='custom2Btn.showOnVideoControllers.PlayScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['custom2BtnPlayScreen.visible'] = customButton2_during;
                    flashvars['custom2BtnPlayScreen.includeInLayout'] = customButton2_during;
        
                    var customButton2_paused = $(this).find("feature[k_fullName='custom2Btn.showOnVideoControllers.PauseScreen']").attr('k_value') == "true" ? true : false;    
                    flashvars['custom2BtnPauseScreen.visible'] = customButton2_paused;
                    flashvars['custom2BtnPauseScreen.includeInLayout'] = customButton2_paused;
        
                    var customButton2_end = $(this).find("feature[k_fullName='custom2Btn.showOnVideoControllers.EndScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['custom2BtnEndScreen.visible'] = customButton2_end;
                    flashvars['custom2BtnEndScreen.includeInLayout'] = customButton2_end;              
                } else {
                    flashvars['custom2BtnControllerScreen.visible'] = false;
                    flashvars['custom2BtnControllerScreen.includeInLayout'] = false;
                    flashvars['custom2BtnStartScreen.visible'] = false;
                    flashvars['custom2BtnStartScreen.includeInLayout'] = false;
                    flashvars['custom2BtnPlayScreen.visible'] = false;
                    flashvars['custom2BtnPlayScreen.includeInLayout'] = false;   
                    flashvars['custom2BtnPauseScreen.visible'] = false;
                    flashvars['custom2BtnPauseScreen.includeInLayout'] = false;
                    flashvars['custom2BtnEndScreen.visible'] = false;
                    flashvars['custom2BtnEndScreen.includeInLayout'] = false;
                }
                
                customButton3 = $(this).find("feature[k_fullName='custom3Btn']").attr('k_value') == "true" ? true : false;
                if(customButton3){
                    customButton3_video = $(this).find("feature[k_fullName='custom3Btn.showOnVideoControllers']").attr('k_value') == "true" ? true : false;
                    var customButton3_controls = $(this).find("feature[k_fullName='custom3Btn.ControllerScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['custom3BtnControllerScreen.visible'] = customButton3_controls;
                    flashvars['custom3BtnControllerScreen.includeInLayout'] = customButton3_controls;
        
                    var customButton3_before = $(this).find("feature[k_fullName='custom3Btn.showOnVideoControllers.StartScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['custom3BtnStartScreen.visible'] = customButton3_before;
                    flashvars['custom3BtnStartScreen.includeInLayout'] = customButton3_before;
                
                    var customButton3_during = $(this).find("feature[k_fullName='custom3Btn.showOnVideoControllers.PlayScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['custom3BtnPlayScreen.visible'] = customButton3_during;
                    flashvars['custom3BtnPlayScreen.includeInLayout'] = customButton3_during;
        
                    var customButton3_paused = $(this).find("feature[k_fullName='custom3Btn.showOnVideoControllers.PauseScreen']").attr('k_value') == "true" ? true : false;    
                    flashvars['custom3BtnPauseScreen.visible'] = customButton3_paused;
                    flashvars['custom3BtnPauseScreen.includeInLayout'] = customButton3_paused;
        
                    var customButton3_end = $(this).find("feature[k_fullName='custom3Btn.showOnVideoControllers.EndScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['custom3BtnEndScreen.visible'] = customButton3_end;
                    flashvars['custom3BtnEndScreen.includeInLayout'] = customButton3_end;              
                } else {
                    flashvars['custom3BtnControllerScreen.visible'] = false;
                    flashvars['custom3BtnControllerScreen.includeInLayout'] = false;
                    flashvars['custom3BtnStartScreen.visible'] = false;
                    flashvars['custom3BtnStartScreen.includeInLayout'] = false;
                    flashvars['custom3BtnPlayScreen.visible'] = false;
                    flashvars['custom3BtnPlayScreen.includeInLayout'] = false;   
                    flashvars['custom3BtnPauseScreen.visible'] = false;
                    flashvars['custom3BtnPauseScreen.includeInLayout'] = false;
                    flashvars['custom3BtnEndScreen.visible'] = false;
                    flashvars['custom3BtnEndScreen.includeInLayout'] = false;
                }
                
                customButton4 = $(this).find("feature[k_fullName='custom4Btn']").attr('k_value') == "true" ? true : false;
                if(customButton4){
                    customButton4_video = $(this).find("feature[k_fullName='custom4Btn.showOnVideoControllers']").attr('k_value') == "true" ? true : false;
                    var customButton4_controls = $(this).find("feature[k_fullName='custom4Btn.ControllerScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['custom4BtnControllerScreen.visible'] = customButton4_controls;
                    flashvars['custom4BtnControllerScreen.includeInLayout'] = customButton4_controls;
        
                    var customButton4_before = $(this).find("feature[k_fullName='custom4Btn.showOnVideoControllers.StartScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['custom4BtnStartScreen.visible'] = customButton4_before;
                    flashvars['custom4BtnStartScreen.includeInLayout'] = customButton4_before;
                
                    var customButton4_during = $(this).find("feature[k_fullName='custom4Btn.showOnVideoControllers.PlayScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['custom4BtnPlayScreen.visible'] = customButton4_during;
                    flashvars['custom4BtnPlayScreen.includeInLayout'] = customButton4_during;
        
                    var customButton4_paused = $(this).find("feature[k_fullName='custom4Btn.showOnVideoControllers.PauseScreen']").attr('k_value') == "true" ? true : false;    
                    flashvars['custom4BtnPauseScreen.visible'] = customButton4_paused;
                    flashvars['custom4BtnPauseScreen.includeInLayout'] = customButton4_paused;
        
                    var customButton4_end = $(this).find("feature[k_fullName='custom4Btn.showOnVideoControllers.EndScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['custom4BtnEndScreen.visible'] = customButton4_end;
                    flashvars['custom4BtnEndScreen.includeInLayout'] = customButton4_end;              
                } else {
                    flashvars['custom4BtnControllerScreen.visible'] = false;
                    flashvars['custom4BtnControllerScreen.includeInLayout'] = false;
                    flashvars['custom4BtnStartScreen.visible'] = false;
                    flashvars['custom4BtnStartScreen.includeInLayout'] = false;
                    flashvars['custom4BtnPlayScreen.visible'] = false;
                    flashvars['custom4BtnPlayScreen.includeInLayout'] = false;   
                    flashvars['custom4BtnPauseScreen.visible'] = false;
                    flashvars['custom4BtnPauseScreen.includeInLayout'] = false;
                    flashvars['custom4BtnEndScreen.visible'] = false;
                    flashvars['custom4BtnEndScreen.includeInLayout'] = false;
                }
                
                customButton5 = $(this).find("feature[k_fullName='custom5Btn']").attr('k_value') == "true" ? true : false;
                if(customButton5){
                    customButton5_video = $(this).find("feature[k_fullName='custom5Btn.showOnVideoControllers']").attr('k_value') == "true" ? true : false;
                    var customButton5_controls = $(this).find("feature[k_fullName='custom5Btn.ControllerScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['custom5BtnControllerScreen.visible'] = customButton5_controls;
                    flashvars['custom5BtnControllerScreen.includeInLayout'] = customButton5_controls;
        
                    var customButton5_before = $(this).find("feature[k_fullName='custom5Btn.showOnVideoControllers.StartScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['custom5BtnStartScreen.visible'] = customButton5_before;
                    flashvars['custom5BtnStartScreen.includeInLayout'] = customButton5_before;
                
                    var customButton5_during = $(this).find("feature[k_fullName='custom5Btn.showOnVideoControllers.PlayScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['custom5BtnPlayScreen.visible'] = customButton5_during;
                    flashvars['custom5BtnPlayScreen.includeInLayout'] = customButton5_during;
        
                    var customButton5_paused = $(this).find("feature[k_fullName='custom5Btn.showOnVideoControllers.PauseScreen']").attr('k_value') == "true" ? true : false;    
                    flashvars['custom5BtnPauseScreen.visible'] = customButton5_paused;
                    flashvars['custom5BtnPauseScreen.includeInLayout'] = customButton5_paused;
        
                    var customButton5_end = $(this).find("feature[k_fullName='custom5Btn.showOnVideoControllers.EndScreen']").attr('k_value') == "true" ? true : false;
                    flashvars['custom5BtnEndScreen.visible'] = customButton5_end;
                    flashvars['custom5BtnEndScreen.includeInLayout'] = customButton5_end;              
                } else {
                    flashvars['custom5BtnControllerScreen.visible'] = false;
                    flashvars['custom5BtnControllerScreen.includeInLayout'] = false;
                    flashvars['custom5BtnStartScreen.visible'] = false;
                    flashvars['custom5BtnStartScreen.includeInLayout'] = false;
                    flashvars['custom5BtnPlayScreen.visible'] = false;
                    flashvars['custom5BtnPlayScreen.includeInLayout'] = false;   
                    flashvars['custom5BtnPauseScreen.visible'] = false;
                    flashvars['custom5BtnPauseScreen.includeInLayout'] = false;
                    flashvars['custom5BtnEndScreen.visible'] = false;
                    flashvars['custom5BtnEndScreen.includeInLayout'] = false;
                }
                
                capVideo = $(this).find("feature[k_fullName='ccOverComboBoxWrapper']").attr('k_value') == "true" ? true : false;
                capVideo_textglow = $(this).find("feature[k_fullName='ccOverComboBoxWrapper.ccOverGlowRB']").attr('k_value') == "true" ? true : false;
                capVideo_backlayer = $(this).find("feature[k_fullName='ccOverComboBoxWrapper.ccOverBgRB']").attr('k_value') == "true" ? true : false;
                
                var watermark_landing = $(this).find("feature[k_fullName='watermark.watermarkClickPath']").attr('k_value');
                flashvars['watermark.watermarkClickPath'] = watermark_landing;
                
                var watermark_loc = $(this).find("feature[k_fullName='watermark.watermarkPosition']").attr('k_value');
                flashvars['watermark.watermarkPosition'] = watermark_loc;
                
                var watermark_padding = $(this).find("feature[k_fullName='watermark.padding']").attr('k_value');
                flashvars['watermark.padding'] = watermark_padding;
                
                var left_play = $(this).find("feature[k_fullName='timerControllerScreen1.timerType']").attr('k_value');
                flashvars['timerControllerScreen1.timerType'] = left_play;
                
                var right_play = $(this).find("feature[k_fullName='timerControllerScreen2.timerType']").attr('k_value');
                flashvars['timerControllerScreen2.timerType'] = right_play;
                
                var flavor_on = $(this).find("feature[k_fullName='flavorComboControllerScreen.hdOn']").attr('k_value');
                flashvars['flavorComboControllerScreen.hdOn'] = flavor_on;
                
                var flavor_off = $(this).find("feature[k_fullName='flavorComboControllerScreen.hdOff']").attr('k_value');
                flashvars['flavorComboControllerScreen.hdOff'] = flavor_off;
                
                var flavor_tooltip = $(this).find("feature[k_fullName='flavorComboControllerScreen.autoMessage']").attr('k_value');
                flashvars['flavorComboControllerScreen.autoMessage'] = flavor_tooltip;
                 
                var fullscreen_label = $(this).find("feature[k_fullName='fullScreenBtn.Label']").attr('k_value');
                flashvars['fullScreenBtnStartScreen.label'] = fullscreen_label;
                flashvars['fullScreenBtnPlayScreen.label'] = fullscreen_label;
                flashvars['fullScreenBtnPauseScreen.label'] = fullscreen_label;
                flashvars['fullScreenBtnEndScreen.label'] = fullscreen_label;
                
                var fullscreen_tooltip_play = $(this).find("feature[k_fullName='fullScreenBtn.tooltipGo']").attr('k_value');
                flashvars['fullScreenBtnControllerScreen.upTooltip'] = fullscreen_tooltip_play;
                
                var fullscreen_tooltip_pause = $(this).find("feature[k_fullName='fullScreenBtn.tooltipExit']").attr('k_value');
                flashvars['fullScreenBtnControllerScreen.selectedTooltip'] = fullscreen_tooltip_pause;
                
                var ovplay_label = $(this).find("feature[k_fullName='onVideoPlayBtn.Label']").attr('k_value');
                flashvars['onVideoPlayBtnStartScreen.label'] = ovplay_label;
                flashvars['onVideoPlayBtnPauseScreen.label'] = ovplay_label;
                
                var ovplay_tooltip = $(this).find("feature[k_fullName='onVideoPlayBtn.Tooltip']").attr('k_value');
                flashvars['onVideoPlayBtnStartScreen.tooltip'] = ovplay_tooltip;
                flashvars['onVideoPlayBtnPauseScreen.tooltip'] = ovplay_tooltip;
                
                var playpause_tooltip_play = $(this).find("feature[k_fullName='playBtn.tooltipPlay']").attr('k_value');
                flashvars['playBtnControllerScreen.upTooltip'] = playpause_tooltip_play;

                var playpause_tooltip_pause = $(this).find("feature[k_fullName='playBtn.tooltipPause']").attr('k_value');
                flashvars['playBtnControllerScreen.selectedTooltip'] = playpause_tooltip_pause;                
                
                var vol_tooltip = $(this).find("feature[k_fullName='volumeBar.Tooltip']").attr('k_value');
                flashvars['volumeBar.tooltip'] = vol_tooltip;
                
                var vol_level = $(this).find("feature[k_fullName='volumeBar.initialVolumeLevel']").attr('k_value');
                flashvars['volumeBar.initialValue'] = vol_level;                
                
                var replay_label = $(this).find("feature[k_fullName='replayBtn.Label']").attr('k_value');
                flashvars['replayBtnEndScreen.label'] = replay_label;
                
                var replay_tooltip = $(this).find("feature[k_fullName='replayBtn.Tooltip']").attr('k_value');
                flashvars['replayBtnEndScreen.tooltip'] = replay_tooltip;                
                
                var unmute_label = $(this).find("feature[k_fullName='unmuteBtn.Label']").attr('k_value');
                flashvars['unmuteBtnStartScreen.label'] = unmute_label;
                flashvars['unmuteBtnPlayScreen.label'] = unmute_label;
                flashvars['unmuteBtnPauseScreen.label'] = unmute_label;
                flashvars['unmuteBtnEndScreen.label'] = unmute_label;
                
                var unmute_tooltip = $(this).find("feature[k_fullName='unmuteBtn.Tooltip']").attr('k_value');
                flashvars['unmuteBtnStartScreen.tooltip'] = unmute_tooltip;
                flashvars['unmuteBtnPlayScreen.tooltip'] = unmute_tooltip;
                flashvars['unmuteBtnPauseScreen.tooltip'] = unmute_tooltip;
                flashvars['unmuteBtnEndScreen.tooltip'] = unmute_tooltip;                
                
                var share_label = $(this).find("feature[k_fullName='shareBtn.Label']").attr('k_value');
                flashvars['shareBtnStartScreen.label'] = share_label;
                flashvars['shareBtnPlayScreen.label'] = share_label;
                flashvars['shareBtnPauseScreen.label'] = share_label;
                flashvars['shareBtnEndScreen.label'] = share_label;

                var share_tooltip = $(this).find("feature[k_fullName='shareBtn.Tooltip']").attr('k_value');
                flashvars['shareBtnControllerScreen.tooltip'] = share_tooltip;
                flashvars['shareBtnStartScreen.tooltip'] = share_tooltip;
                flashvars['shareBtnPlayScreen.tooltip'] = share_tooltip;
                flashvars['shareBtnPauseScreen.tooltip'] = share_tooltip;
                flashvars['shareBtnEndScreen.tooltip'] = share_tooltip;                
                
                var download_tooltip = $(this).find("feature[k_fullName='downloadBtn.Tooltip']").attr('k_value');
                flashvars['downloadBtnStartScreen.tooltip'] = download_tooltip;
                flashvars['downloadBtnPlayScreen.tooltip'] = download_tooltip;
                flashvars['downloadBtnPauseScreen.tooltip'] = download_tooltip;
                flashvars['downloadBtnEndScreen.tooltip'] = download_tooltip;
                
                var download_label = $(this).find("feature[k_fullName='downloadBtn.Label']").attr('k_value');
                flashvars['downloadBtnStartScreen.label'] = download_label;
                flashvars['downloadBtnPlayScreen.label'] = download_label;
                flashvars['downloadBtnPauseScreen.label'] = download_label;
                flashvars['downloadBtnEndScreen.label'] = download_label;
                
                var download_flavor = $(this).find("feature[k_fullName='downloadBtn.flavor']").attr('k_value');
                flashvars['download.flavorId'] = download_flavor;                
                
                var thumbnail_label = $(this).find("feature[k_fullName='captureThumbBtn.Label']").attr('k_value');
                flashvars['captureThumbBtnStartScreen.label'] = thumbnail_label;
                flashvars['captureThumbBtnPlayScreen.label'] = thumbnail_label;
                flashvars['captureThumbBtnPauseScreen.label'] = thumbnail_label;
                flashvars['captureThumbBtnEndScreen.label'] = thumbnail_label;
                
                var thumbnail_tooltip = $(this).find("feature[k_fullName='captureThumbBtn.Tooltip']").attr('k_value');
                flashvars['captureThumbBtnStartScreen.tooltip'] = thumbnail_tooltip;
                flashvars['captureThumbBtnPlayScreen.tooltip'] = thumbnail_tooltip;
                flashvars['captureThumbBtnPauseScreen.tooltip'] = thumbnail_tooltip;
                flashvars['captureThumbBtnEndScreen.tooltip'] = thumbnail_tooltip;                
                
                var customButton1_label = $(this).find("feature[k_fullName='custom1Btn.Label']").attr('k_value');
                flashvars['custom1BtnStartScreen.label'] = customButton1_label;
                flashvars['custom1BtnPlayScreen.label'] = customButton1_label;
                flashvars['custom1BtnPauseScreen.label'] = customButton1_label;
                flashvars['custom1BtnEndScreen.label'] = customButton1_label;
                
                var customButton1_tooltip = $(this).find("feature[k_fullName='custom1Btn.Tooltip']").attr('k_value');
                flashvars['custom1BtnStartScreen.tooltip'] = customButton1_tooltip;
                flashvars['custom1BtnPlayScreen.tooltip'] = customButton1_tooltip;
                flashvars['custom1BtnPauseScreen.tooltip'] = customButton1_tooltip;
                flashvars['custom1BtnEndScreen.tooltip'] = customButton1_tooltip;                
                
                var customButton2_label = $(this).find("feature[k_fullName='custom2Btn.Label']").attr('k_value');
                flashvars['custom2BtnStartScreen.label'] = customButton2_label;
                flashvars['custom2BtnPlayScreen.label'] = customButton2_label;
                flashvars['custom2BtnPauseScreen.label'] = customButton2_label;
                flashvars['custom2BtnEndScreen.label'] = customButton2_label;
                
                var customButton2_tooltip = $(this).find("feature[k_fullName='custom2Btn.Tooltip']").attr('k_value');
                flashvars['custom2BtnStartScreen.tooltip'] = customButton2_tooltip;
                flashvars['custom2BtnPlayScreen.tooltip'] = customButton2_tooltip;
                flashvars['custom2BtnPauseScreen.tooltip'] = customButton2_tooltip;
                flashvars['custom2BtnEndScreen.tooltip'] = customButton2_tooltip; 
                
                var customButton3_label = $(this).find("feature[k_fullName='custom3Btn.Label']").attr('k_value');
                flashvars['custom3BtnStartScreen.label'] = customButton3_label;
                flashvars['custom3BtnPlayScreen.label'] = customButton3_label;
                flashvars['custom3BtnPauseScreen.label'] = customButton3_label;
                flashvars['custom3BtnEndScreen.label'] = customButton3_label;
                
                var customButton3_tooltip = $(this).find("feature[k_fullName='custom3Btn.Tooltip']").attr('k_value');
                flashvars['custom3BtnStartScreen.tooltip'] = customButton3_tooltip;
                flashvars['custom3BtnPlayScreen.tooltip'] = customButton3_tooltip;
                flashvars['custom3BtnPauseScreen.tooltip'] = customButton3_tooltip;
                flashvars['custom3BtnEndScreen.tooltip'] = customButton3_tooltip;
                
                var customButton4_label = $(this).find("feature[k_fullName='custom4Btn.Label']").attr('k_value');
                flashvars['custom4BtnStartScreen.label'] = customButton4_label;
                flashvars['custom4BtnPlayScreen.label'] = customButton4_label;
                flashvars['custom4BtnPauseScreen.label'] = customButton4_label;
                flashvars['custom4BtnEndScreen.label'] = customButton4_label;
                
                var customButton4_tooltip = $(this).find("feature[k_fullName='custom4Btn.Tooltip']").attr('k_value');
                flashvars['custom4BtnStartScreen.tooltip'] = customButton4_tooltip;
                flashvars['custom4BtnPlayScreen.tooltip'] = customButton4_tooltip;
                flashvars['custom4BtnPauseScreen.tooltip'] = customButton4_tooltip;
                flashvars['custom4BtnEndScreen.tooltip'] = customButton4_tooltip;
                
                var customButton5_label = $(this).find("feature[k_fullName='custom5Btn.Label']").attr('k_value');
                flashvars['custom5BtnStartScreen.label'] = customButton5_label;
                flashvars['custom5BtnPlayScreen.label'] = customButton5_label;
                flashvars['custom5BtnPauseScreen.label'] = customButton5_label;
                flashvars['custom5BtnEndScreen.label'] = customButton5_label;
                
                var customButton5_tooltip = $(this).find("feature[k_fullName='custom5Btn.Tooltip']").attr('k_value');  
                flashvars['custom5BtnStartScreen.tooltip'] = customButton5_tooltip;
                flashvars['custom5BtnPlayScreen.tooltip'] = customButton5_tooltip;
                flashvars['custom5BtnPauseScreen.tooltip'] = customButton5_tooltip;
                flashvars['custom5BtnEndScreen.tooltip'] = customButton5_tooltip;  
                
                capVideo_textcolor = $(this).find("feature[k_fullName='ccOverComboBoxWrapper.fontColor']").attr('k_value').replace("0x","#") == "0" ? '#000000' : $(this).find("feature[k_fullName='ccOverComboBoxWrapper.fontColor']").attr('k_value').replace("0x","#");
                capVideo_glowcolor = $(this).find("feature[k_fullName='ccOverComboBoxWrapper.ccOverGlowColor']").attr('k_value').replace("0x","#") == "0" ? '#000000' : $(this).find("feature[k_fullName='ccOverComboBoxWrapper.ccOverGlowColor']").attr('k_value').replace("0x","#");
                capVideo_glowblur = $(this).find("feature[k_fullName='ccOverComboBoxWrapper.ccOverGlowBlur']").attr('k_value'); 
                capVideo_backcolor = $(this).find("feature[k_fullName='ccOverComboBoxWrapper.bgColor']").attr('k_value').replace("0x","#");
                capVideo_fontsize = $(this).find("feature[k_fullName='ccOverComboBoxWrapper.fontsize']").attr('k_value');
                capVideo_fontfamily = $(this).find("feature[k_fullName='ccOverComboBoxWrapper.fontFamily']").attr('k_value');
                capVideo_prompt = $(this).find("feature[k_fullName='ccOverComboBoxWrapper.ccOverPrompt']").attr('k_value');
                capVideo_tooltip = $(this).find("feature[k_fullName='ccOverComboBoxWrapper.ccOverTooltip']").attr('k_value');
            });
            
            style_fontfamily = $(xml_dom).find("font").text();
            style_icons_color = smhPlayers.d2h($(xml_dom).find("color1").text());
            style_mouse_color = smhPlayers.d2h($(xml_dom).find("color2").text());
            style_onvideo_button_color = smhPlayers.d2h($(xml_dom).find("color3").text());
            style_onvideo_mouse_color = smhPlayers.d2h($(xml_dom).find("color4").text());
            style_onvideo_icons_color = smhPlayers.d2h($(xml_dom).find("color5").text());
            
            flashvars['timerControllerScreen1.color1'] = style_icons_color.replace("#","0x");
            flashvars['timerControllerScreen2.color1'] = style_icons_color.replace("#","0x");
            flashvars['volumeBar.color1'] = style_icons_color.replace("#","0x");
            flashvars['volumeBar.color2'] = style_mouse_color.replace("#","0x");
            flashvars['movieName.color1'] = style_icons_color.replace("#","0x");
            flashvars['noticeMessage.color1'] = style_onvideo_icons_color.replace("#","0x"); 
            flashvars['noticeMessage.color2'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['skipBtn.color1'] = style_icons_color.replace("#","0x");
            flashvars['skipBtn.color2'] = style_mouse_color.replace("#","0x");
            flashvars['flavorComboControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['fullScreenBtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['fullScreenBtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
            flashvars['playBtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['playBtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
            flashvars['downloadBtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['downloadBtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
            flashvars['shareBtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['shareBtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
            flashvars['captureThumbBtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['captureThumbBtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
            flashvars['flagBtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['flagBtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
            flashvars['uploadBtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['uploadBtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
            flashvars['custom1BtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['custom1BtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
            flashvars['custom2BtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['custom2BtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
            flashvars['custom3BtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['custom3BtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
            flashvars['custom4BtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['custom4BtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
            flashvars['custom5BtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['custom5BtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
            flashvars['custom1BtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom1BtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom1BtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom2BtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom2BtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom2BtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom3BtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom3BtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom3BtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom4BtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom4BtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom4BtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom5BtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom5BtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom5BtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['shareBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['shareBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['shareBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['downloadBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['downloadBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['downloadBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['fullScreenBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['fullScreenBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['fullScreenBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['onVideoPlayBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['onVideoPlayBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['onVideoPlayBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['editBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['editBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['editBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['captureThumbBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['captureThumbBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['captureThumbBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['flagBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['flagBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['flagBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['uploadBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['uploadBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['uploadBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['unmuteBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['unmuteBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['unmuteBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom1BtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom1BtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom1BtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom2BtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom2BtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom2BtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom3BtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom3BtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom3BtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom4BtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom4BtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom4BtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom5BtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom5BtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom5BtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['shareBtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['shareBtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['shareBtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['downloadBtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['downloadBtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['downloadBtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['fullScreenBtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['fullScreenBtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['fullScreenBtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['editBtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['editBtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['editBtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['captureThumbBtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['captureThumbBtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['captureThumbBtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['flagBtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['flagBtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['flagBtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['uploadBtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['uploadBtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['uploadBtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['unmuteBtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['unmuteBtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['unmuteBtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom1BtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom1BtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom1BtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom2BtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom2BtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom2BtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom3BtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom3BtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom3BtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom4BtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom4BtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom4BtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom5BtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom5BtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom5BtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['shareBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['shareBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['shareBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['downloadBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['downloadBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['downloadBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['fullScreenBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['fullScreenBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['fullScreenBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['onVideoPlayBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['onVideoPlayBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['onVideoPlayBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['editBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['editBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['editBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['captureThumbBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['captureThumbBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['captureThumbBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['flagBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['flagBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['flagBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['uploadBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['uploadBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['uploadBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['unmuteBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['unmuteBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['unmuteBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom1BtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom1BtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom1BtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom2BtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom2BtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom2BtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom3BtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom3BtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom3BtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom4BtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom4BtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom4BtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom5BtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom5BtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom5BtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['shareBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['shareBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['shareBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['downloadBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['downloadBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['downloadBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['fullScreenBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['fullScreenBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['fullScreenBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['editBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['editBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['editBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['captureThumbBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['captureThumbBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['captureThumbBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['flagBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['flagBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['flagBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['uploadBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['uploadBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['uploadBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['unmuteBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['unmuteBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['unmuteBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['replayBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['replayBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['replayBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['movieName.font'] = style_fontfamily;
            flashvars['noticeMessage.font'] = style_fontfamily;
            flashvars['skipBtn.font'] = style_fontfamily;
            flashvars['captureThumbBtnControllerScreen.font'] = style_fontfamily;
            flashvars['custom1BtnStartScreen.font'] = style_fontfamily;
            flashvars['custom2BtnStartScreen.font'] = style_fontfamily;
            flashvars['custom3BtnStartScreen.font'] = style_fontfamily;
            flashvars['custom4BtnStartScreen.font'] = style_fontfamily;
            flashvars['custom5BtnStartScreen.font'] = style_fontfamily;
            flashvars['shareBtnStartScreen.font'] = style_fontfamily;
            flashvars['downloadBtnStartScreen.font'] = style_fontfamily;
            flashvars['fullScreenBtnStartScreen.font'] = style_fontfamily;
            flashvars['onVideoPlayBtnStartScreen.font'] = style_fontfamily;
            flashvars['editBtnStartScreen.font'] = style_fontfamily;
            flashvars['captureThumbBtnStartScreen.font'] = style_fontfamily;
            flashvars['flagBtnStartScreen.font'] = style_fontfamily;
            flashvars['uploadBtnStartScreen.font'] = style_fontfamily;
            flashvars['unmuteBtnStartScreen.font'] = style_fontfamily;
            flashvars['custom1BtnPlayScreen.font'] = style_fontfamily;
            flashvars['custom2BtnPlayScreen.font'] = style_fontfamily;
            flashvars['custom3BtnPlayScreen.font'] = style_fontfamily;
            flashvars['custom4BtnPlayScreen.font'] = style_fontfamily;
            flashvars['custom5BtnPlayScreen.font'] = style_fontfamily;
            flashvars['shareBtnPlayScreen.font'] = style_fontfamily;
            flashvars['downloadBtnPlayScreen.font'] = style_fontfamily;
            flashvars['fullScreenBtnPlayScreen.font'] = style_fontfamily;
            flashvars['editBtnPlayScreen.font'] = style_fontfamily;
            flashvars['captureThumbBtnPlayScreen.font'] = style_fontfamily;
            flashvars['flagBtnPlayScreen.font'] = style_fontfamily;
            flashvars['uploadBtnPlayScreen.font'] = style_fontfamily;
            flashvars['unmuteBtnPlayScreen.font'] = style_fontfamily;
            flashvars['custom1BtnPauseScreen.font'] = style_fontfamily;
            flashvars['custom2BtnPauseScreen.font'] = style_fontfamily;
            flashvars['custom3BtnPauseScreen.font'] = style_fontfamily;
            flashvars['custom4BtnPauseScreen.font'] = style_fontfamily;
            flashvars['custom5BtnPauseScreen.font'] = style_fontfamily;
            flashvars['shareBtnPauseScreen.font'] = style_fontfamily;
            flashvars['downloadBtnPauseScreen.font'] = style_fontfamily;
            flashvars['fullScreenBtnPauseScreen.font'] = style_fontfamily;
            flashvars['onVideoPlayBtnPauseScreen.font'] = style_fontfamily;
            flashvars['editBtnPauseScreen.font'] = style_fontfamily;
            flashvars['captureThumbBtnPauseScreen.font'] = style_fontfamily;
            flashvars['flagBtnPauseScreen.font'] = style_fontfamily;
            flashvars['uploadBtnPauseScreen.font'] = style_fontfamily;
            flashvars['unmuteBtnPauseScreen.font'] = style_fontfamily;
            flashvars['custom1BtnEndScreen.font'] = style_fontfamily;
            flashvars['custom2BtnEndScreen.font'] = style_fontfamily;
            flashvars['custom3BtnEndScreen.font'] = style_fontfamily;
            flashvars['custom4BtnEndScreen.font'] = style_fontfamily;
            flashvars['custom5BtnEndScreen.font'] = style_fontfamily;
            flashvars['shareBtnEndScreen.font'] = style_fontfamily;
            flashvars['downloadBtnEndScreen.font'] = style_fontfamily;
            flashvars['fullScreenBtnEndScreen.font'] = style_fontfamily;
            flashvars['editBtnEndScreen.font'] = style_fontfamily;
            flashvars['captureThumbBtnEndScreen.font'] = style_fontfamily;
            flashvars['flagBtnEndScreen.font'] = style_fontfamily;
            flashvars['uploadBtnEndScreen.font'] = style_fontfamily;
            flashvars['unmuteBtnEndScreen.font'] = style_fontfamily;
            flashvars['replayBtnEndScreen.font'] = style_fontfamily;
            
            $(xml_dom).find('playerProperties').each(function(){
                width = $(this).find("width").text();
                height = $(this).find("height").text();
                
                if($(this).find("theme").text() == 'light'){
                    skin_theme = 'w';  
                    skin = '/content/uiconf/kaltura/kmc/appstudio/kdp3/falcon/skin/v3.7/skin_light.swf';
                } else {
                    skin_theme = 'b';
                    skin = '/content/uiconf/kaltura/kmc/appstudio/kdp3/falcon/skin/v3.7/skin.swf';
                }
                
            });
            flashvars['width'] = width;
            flashvars['height'] = height;
            flashvars['full.skinPath'] = skin;
                
            var ads = $(xml_dom).find('advertising').attr('enabled') == "true" ? true : false;
            
            $(xml_dom).find('advertising').each(function(){
                vast = $(this).find("source[id='vastAdServer']").attr('selected') == "true" ? true : false;
                bumper = $(this).find("source[id='bumperOnly']").attr('selected') == "true" ? true : false;
                vast_presequence = $(this).find("source[id='vastAdServer']").attr('preSequence');
                vast_postsequence = $(this).find("source[id='vastAdServer']").attr('postSequence');
                bumper_presequence = $(this).find("source[id='bumperOnly']").attr('preSequence');
                bumper_postsequence = $(this).find("source[id='bumperOnly']").attr('postSequence');
            });
            
            $(xml_dom).find('timeline').each(function(){
                vast_preroll = $(this).find("preroll").attr('enabled') == "true" ? true : false;
                var pre_display = $(this).find("preroll").attr('nads');
                var pre_beforeevery = $(this).find("preroll").attr('frequency');
                var pre_videostart = $(this).find("preroll").attr('start');
                var pre_vast_url = $(this).find("preroll").attr('url');
                vast_bumper = $(this).find("bumper").attr('enabled') == "true" ? true : false;
                var bumper_entryid = $(this).find("bumper").attr('entryid');
                var bumper_clickurl = $(this).find("bumper").attr('clickurl');        
                vast_postroll = $(this).find("postroll").attr('enabled') == "true" ? true : false;
                var post_vast_url = $(this).find("postroll").attr('url');
                var post_display = $(this).find("postroll").attr('nads');
                var post_beforeevery = $(this).find("postroll").attr('frequency');
                var post_videostart = $(this).find("postroll").attr('start');
                vast_overlay = $(this).find("overlay").attr('enabled') == "true" ? true : false;
                var overlayurl = $(this).find("overlay").attr('url');
                var nads = $(this).find("overlay").attr('nads');
                var frequency = $(this).find("overlay").attr('frequency');
                var start = $(this).find("overlay").attr('start');
                
                if(vast){
                    if(vast_preroll){
                        flashvars['vast.numPreroll'] = pre_display; 
                        flashvars['vast.prerollInterval'] = pre_beforeevery; 
                        flashvars['vast.prerollStartWith'] = pre_videostart; 
                        flashvars['vast.prerollUrl'] = pre_vast_url;
                        if(vast_presequence != '' & vast_presequence != null){
                            flashvars['vast.preSequence'] = vast_presequence                       
                        } else { 
                            flashvars['vast.preSequence'] = 1;
                        }
                    } else {
                        flashvars['vast.preSequence'] = 0;
                    }
                    if(vast_postroll){
                        flashvars['vast.numPostroll'] = post_display; 
                        flashvars['vast.postrollInterval'] = post_beforeevery;
                        flashvars['vast.postrollStartWith'] = post_videostart; 
                        flashvars['vast.postrollUrl'] = post_vast_url; 
                        if(vast_postsequence != '' & vast_postsequence != null){
                            flashvars['vast.postSequence'] = vast_postsequence;
                        } else {
                            flashvars['vast.postSequence'] = 1;
                        }   
                    } else {
                        flashvars['vast.postSequence'] = 0;
                    }
                    if(vast_overlay){
                        flashvars['overlay.visible'] = vast_overlay; 
                        flashvars['overlay.includeInLayout'] = vast_overlay;
                        flashvars['overlay.displayDuration'] = nads;
                        flashvars['vast.overlayStartAt'] = start; 
                        flashvars['vast.overlayInterval'] = frequency; 
                        flashvars['vast.overlayUrl'] = overlayurl; 
                    }   
                                                      
                } else {
                    flashvars['vast.preSequence'] = 0;
                    flashvars['vast.postSequence'] = 0;
                }       

                if(bumper || vast_bumper){
                    flashvars['bumper.bumperEntryID'] = bumper_entryid;
                    flashvars['bumper.clickurl'] = bumper_clickurl;
                    if(vast){
                        if(vast_preroll){
                            if(bumper_presequence != '' & bumper_presequence != null){
                                flashvars['bumper.preSequence'] = bumper_presequence;
                            } else {
                                flashvars['bumper.preSequence'] = 2;
                            }
                        } else {
                            flashvars['bumper.preSequence'] = 1;
                        }
                        if(vast_postroll){
                            if(bumper_postsequence != '' & bumper_postsequence != null){
                                flashvars['bumper.postSequence'] = bumper_postsequence;
                            } else {
                                flashvars['bumper.postSequence'] = 2;
                            }
                        } else {
                            flashvars['bumper.postSequence'] = 1;
                        }
                    } else {
                        if(bumper_presequence != '' & bumper_presequence != null){
                            flashvars['bumper.preSequence'] = bumper_presequence;
                        } else {
                            flashvars['bumper.preSequence'] = 1;
                        }
                        if(bumper_postsequence != '' & bumper_postsequence != null){
                            flashvars['bumper.postSequence'] = bumper_postsequence;
                        } else {
                            flashvars['bumper.postSequence'] = 0;
                        }
                    }
                } else {
                    flashvars['bumper.preSequence'] = 0;
                    flashvars['bumper.postSequence'] = 0;
                }
            });
            
            if(vast){
                var vast_timeout = $(xml_dom).find('playerConfig').attr('timeout');
                var vast_cuepoints = $(xml_dom).find('playerConfig').attr('trackCuePoints') == "true" ? true : false;  
                flashvars['vast.trackCuePoints'] = vast_cuepoints; 
                flashvars['vast.timeout'] = vast_timeout;               
            }
            
            $(xml_dom).find('playerConfig').each(function(){
                if(vast){
                    var vast_noticetext = $(this).find("notice").attr('enabled') == "true" ? true : false;
                    var vast_notice_text = $(this).find("notice").text();
                    if(vast_noticetext){
                        flashvars['noticeMessage.visible'] = '{sequenceProxy.isAdLoaded}';
                        flashvars['noticeMessage.includeInLayout'] = '{sequenceProxy.isAdLoaded}';
                    }
                    flashvars['noticeMessage.text'] = vast_notice_text;
                    
                    var vast_allowskip = $(this).find("skip").attr('enabled') == "true" ? true : false;
                    var vast_skip_text = $(this).find("skip").attr('label');  
                    if(vast_allowskip){
                        flashvars['skipBtn.visible'] = '{sequenceProxy.isAdLoaded}';
                        flashvars['skipBtn.includeInLayout'] = '{sequenceProxy.isAdLoaded}';
                    }
                    flashvars['skipBtn.label'] = vast_skip_text;
                }
            });
            
            $(xml_dom).find('uiVars').each(function(){
                var origMedia = $(this).find("var[key='video.keepAspectRatio']").attr('value') == "true" ? true : false;
                flashvars['video.stretchThumbnail'] = origMedia;
                
                playlist_autocontinue =  $(this).find("var[key='playlistAPI.autoContinue']").attr('value') == "true" ? true : false;
                playlist_loop = $(this).find("var[key='playlistAPI.loop']").attr('value') == "true" ? true : false;
                
                if($(this).find("var[key='playlistHolder.visible']").attr('value')){
                    playlist_visible = $(this).find("var[key='playlistHolder.visible']").attr('value') == "true" ? true : false;  
                } else {
                    playlist_visible = true; 
                }
                
                playOnload = $(this).find("var[key='autoPlay']").attr('value') == "true" ? true : false;
                playerMute = $(this).find("var[key='autoMute']").attr('value') == "true" ? true : false;
                if($(this).find("var[key='list.rowHeight']").attr('value')){
                    playlist_rowHeight = $(this).find("var[key='list.rowHeight']").attr('value');      
                } else {
                    playlist_rowHeight = 70;
                }

            
                var user_icon = $(this).find("var[key='mylogo.plugin']").attr('value') == "true" ? true : false;
            
                if(user_icon){
                    var user_icon_url = $(this).find("var[key='mylogo.watermarkPath']").attr('value');
                    var user_icon_clickurl = $(this).find("var[key='mylogo.watermarkClickPath']").attr('value');
                    var user_icon_width = $(this).find("var[key='mylogo.width']").attr('value');
                    var user_icon_height = $(this).find("var[key='mylogo.height']").attr('value'); 
                    flashvars['mylogo.plugin'] = user_icon;
                    flashvars['mylogo.width'] = user_icon_width;
                    flashvars['mylogo.height'] = user_icon_height;
                    flashvars['mylogo.watermarkPath'] = user_icon_url;
                    flashvars['mylogo.watermarkClickPath'] = user_icon_clickurl;
                }
                
                if(uiconf_id == '6709441'){
                    $(this).find("var").each(function(){
                        if($(this).attr('key').search('EntryId') != '-1'){
                            TEMP_MULTI.push($(this).attr('value')); 
                        }
                    });
                    multi = smhPlayers.getAvailablePlaylist(TEMP_MULTI);
    
                    $.each(multi, function(key, value) {
                        PLAYLIST_ENTRIES.push(value[0]);        
                    });  
                }
            });
            
            if(uiconf_id == '6709438'){
                player_entryid = '0_18cc4fqm';
            } else if(uiconf_id == '6709442'){
                player_entryid = '0_18cc4fqm';
            } else if (uiconf_id == '6709439' || uiconf_id == '6709440' || uiconf_id == '6709441'){ 
                $(xml_dom).find('featuresData').each(function(){
                    playlist_thumbnail =  $(this).find("feature[k_fullName='irImage']").attr('k_value') == "true" ? true : false;
                    playlist_name =  $(this).find("feature[k_fullName='irLink']").attr('k_value') == "true" ? true : false;
                    playlist_description =  $(this).find("feature[k_fullName='irDescription']").attr('k_value') == "true" ? true : false;
                    playlist_duration =  $(this).find("feature[k_fullName='irDuration']").attr('k_value') == "true" ? true : false;
                    playlist_plays = $(this).find("feature[k_fullName='irPlays']").attr('k_value') == "true" ? true : false;
                    playlist_rank = $(this).find("feature[k_fullName='irRank']").attr('k_value') == "true" ? true : false;
                    playlist_votes = $(this).find("feature[k_fullName='irVotes']").attr('k_value') == "true" ? true : false; 
                    playlist_tags =  $(this).find("feature[k_fullName='irTags']").attr('k_value') == "true" ? true : false;
                    playlist_createddate =  $(this).find("feature[k_fullName='irCreatedAt']").attr('k_value') == "true" ? true : false;
                    playlist_createdby =  $(this).find("feature[k_fullName='irCreatedBy']").attr('k_value') == "true" ? true : false;
                    playlist_previous = $(this).find("feature[k_fullName='previousBtn']").attr('k_value') == "true" ? true : false;
                    playlist_previous_tooltip = $(this).find("feature[k_fullName='previousBtn.Tooltip']").attr('k_value');
                    playlist_next = $(this).find("feature[k_fullName='nextBtn']").attr('k_value') == "true" ? true : false;
                    playlist_next_tooltip = $(this).find("feature[k_fullName='nextBtn.Tooltip']").attr('k_value');
                });

                playlist_items = 0;
            
                if(playlist_description){
                    playlist_items++;
                }
                if(playlist_plays){
                    playlist_items++;
                }
                if(playlist_rank){
                    playlist_items++;
                }
                if(playlist_votes){
                    playlist_items++;
                }
                if(playlist_tags){
                    playlist_items++;
                }
                if(playlist_admintags){
                    playlist_items++;
                }
                if(playlist_createddate){ 
                    playlist_items++;
                }
                if(playlist_createdby){
                    playlist_items++;
                }
            }

            smhPlayers.addPlayer(uiconf_id);
        }; 
        client.uiConf.get(cb, id);
    },
    //Create Basic Player Modal
    addPlayer:function(id){
        uiconf_id = id;
        auto_preview = false;
        smhMain.resetModal();
        var player_button = '<button onclick="smhPlayers.updatePlayer()" id="update-player" class="btn btn-primary update-player" type="button">Update Player</button>'
        if(!edit){
            smhPlayers.defaultPlayerSettings();
            player_button = '<button onclick="smhPlayers.createPlayer()" id="create-player" class="btn btn-primary" type="button">Create Player</button>';
        }        
        var header, content;
        $('#smh-modal3 .modal-body').css('padding','0');
        $('#smh-modal3').modal({
            backdrop: 'static'
        });
        $('#smh-modal3').addClass('previewModal');
        
        var display = '';
        var playlist_display = '';
        var mplaylist_display = '';
        var name = '';
        var watermark_locations = '<option value="bottomLeft" selected="selected">Bottom Left</option><option value="bottomRight">Bottom Right</option><option value="topLeft">Top Left</option><option value="topRight">Top Right</option>';
        if(uiconf_id == 6709442){
            display = 'style="display: none;"';
            mplaylist_display = 'style="display: none;"';
            watermark_locations = '<option value="topLeft">Top Left</option><option value="topRight" selected="selected">Top Right</option>';
        }
        if(uiconf_id == 6709438 || uiconf_id == 6709442){
            playlist_display = 'style="display: none;"';
            mplaylist_display = 'style="display: none;"';
        }
        if(uiconf_id == 6709439 || uiconf_id == 6709440){
            mplaylist_display = 'style="display: none;"';
        }
        
        if(edit){
            header = '<button type="button" class="close smh-close player_close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Player - '+player_name+'</h4>';              
            name = player_name;
        } else {
            header = '<button type="button" class="close smh-close player-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Create Player</h4>';            
        }

        $('#smh-modal3 .modal-header').html(header);
        
        content = '<div class="content">'+
            
        '<div class="player-tab tabbable">'+
        
        '<ul class="nav nav-pills nav-stacked player-menu">'+
        '<li class="active">'+
        '<a data-toggle="tab" href="#basic" id="basic-tab" class="enabled basic-tab"><i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Basic Display" class="fa fa-gears"></i></a>'+
        '</li>'+
        '<li>'+
        '<a data-toggle="tab" href="#display" id="display-tab" class="display-tab"><i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Look and Feel" class="fa fa-eye"></i></a>'+
        '</li>'+
        '<li '+playlist_display+'>'+
        '<a data-toggle="tab" href="#playlist" id="display-tab" class="playlist-tab"><i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Playlist Items" class="fa fa-list"></i></a>'+
        '</li>'+
        '<li>'+
        '<a data-toggle="tab" href="#ad" id="display-tab" class="ad-tab"><i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Advertising" class="fa fa-bullhorn"></i></a>'+
        '</li>'+
        '<li>'+
        '<a data-toggle="tab" href="#custom" id="display-tab" class="custom-tab"><i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Custom Styles" class="fa fa-paint-brush"></i></a>'+
        '</li>'+
        '<li '+mplaylist_display+'>'+
        '<a data-toggle="tab" href="#content" id="display-tab" class="content-tab"><i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Playlist Content" class="fa fa-tasks"></i></a>'+
        '</li>'+
        '</ul>'+
        
        '<div class="tab-content">'+
        
        '<div id="basic" class="tab-pane active">'+
        '<div class="options">'+
        '<h3>Basic Display</h3>'+
        '<p>Basic settings let you set player name and aspect ratio.</p>'+
        '<span class="pluginLabel" style="margin-bottom: 15px; display: inline-block;">Player\'s Name</span>'+
        '<input type="text" id="player_name" name="player_name" placeholder="Enter a name" class="form-control" value="'+name+'">'+
        '<hr>'+
        '<span class="pluginLabel" style="margin-bottom: 15px; display: block;">Player Dimensions</span>'+
        '<span class="pluginLabel" style="margin-bottom: 15px; display: inline-block;">Aspect Ratio:</span>'+
        '<select id="aspect_ratio" style="margin-bottom: 15px; display: inline-block; margin-left: 8px; width: 135px;" class="form-control"><option value="dim_4_3">4/3</option><option value="dim_16_9">16/9</option><option value="dim_custom" selected>custom</option></select>'+
        '<div class="clear"></div>'+
        '<span class="pluginLabel">Width</span><input type="text" value="'+width+'" id="dim_width" name="dim_width" style="width: 70px; margin-left: 5px; display: inline;" class="form-control"><span> px</span>'+
        '<div class="pull-right">'+
        '<span class="pluginLabel">Height</span><input type="text" value="'+height+'" id="dim_height" name="dim_height" style="width: 70px; margin-left: 5px; display: inline;" class="form-control"><span> px</span>'+
        '</div>'+
        '<div class="clear"></div>'+
        '<hr>'+
        '<span class="pluginLabel" style="margin-bottom: 15px;">Video Ratio</span>'+
        '<div class="radio" style="margin-bottom: 15px;"><label class="pluginLabel"><input type="radio" name="video_ratio" id="video_ratio_orig" style="margin-right: 5px" checked>Keep original media ratio</label></div>'+
        '<div class="radio"><label class="pluginLabel"><input type="radio" name="video_ratio" id="video_ratio_fit" style="margin-right: 5px">Stretch media to fit player</label></div>'+
        '<hr>'+
        '<div class="checkbox"><label class="pluginLabel"><input type="checkbox" id="auto_play" style="margin-right: 5px">Automatically play video on page load</label></div>'+
        '<hr>'+
        '<div class="checkbox"><label class="pluginLabel"><input type="checkbox" id="start_muted" style="margin-right: 5px">Start player muted</label></div>'+
        '<hr '+playlist_display+'>'+
        '<div class="checkbox" '+playlist_display+'><label class="pluginLabel"><input type="checkbox" id="hidePlaylist" style="margin-right: 5px">Hide Playlist Items</label></div>'+
        '<hr '+playlist_display+'>'+
        '<div class="checkbox" '+playlist_display+'><label class="pluginLabel"><input type="checkbox" id="autoContinue" style="margin-right: 5px">Automatically continue</label></div>'+
        '<hr '+playlist_display+'>'+
        '<div class="checkbox" '+playlist_display+'><label class="pluginLabel"><input type="checkbox" id="playlistLoop" style="margin-right: 5px">Loop Playlist</label></div>'+
        '</div>'+
        '</div>'+
        
        '<div id="display" class="tab-pane">'+
        '<div class="options">'+
        '<h3>Look and Feel</h3>'+
        '<p style="margin-bottom: 15px;">Adjust the visual appearance of the player.</p>'+
        
        '<div class="panel-group" id="accordion">'+
        '<div class="panel panel-default" '+display+'>'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseOne">'+
        'Title Text'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="title_text"></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseOne" class="panel-collapse collapse">'+
        '<div class="panel-body">'+
        'This feature allows you to display the title of the video currently playing.'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseTwo">'+
        'Watermark'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="watermark"></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseTwo" class="panel-collapse collapse">'+
        '<div class="panel-body">'+
        
        'Brand your player with your own logo displayed as a watermark on the video. Upload an image to a location on the web and provide the link below.<br /><br />'+
        '<span class="pluginLabel">Watermark URL</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="watermark_url" class="form-control" name="watermark_url" value="http://mediaplatform.streamingmediahosting.com/img/exampleWatermark.png" placeholder="Enter a URL" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Watermark landing page url</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="watermark_landing" class="form-control" name="watermark_landing" value="'+flashvars['watermark.watermarkClickPath']+'" size="33" placeholder="Enter a URL" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Watermark location on the video:</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<select id="watermark-location" class="form-control" disabled>'+watermark_locations+'</select><br />'+
        '</div>'+
        '<span class="pluginLabel">Padding</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;" class="pull-left">'+
        '<input type="text" id="water_padding" class="form-control" style="width:70px !important;" name="water_padding" value="'+flashvars['watermark.padding']+'" disabled>'+
        '</div>'+
        
        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseThree">'+
        'Logo Icon'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="logo-icon"></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseThree" class="panel-collapse collapse">'+
        '<div class="panel-body">'+

        'Brand your player with your own logo displayed as a icon on the control bar. Upload an image to a location on the web and provide the link below. Your icon\'s dimensions must have a maximum size of 30x30 pixels.<br /><br />'+
        '<span class="pluginLabel">Logo Icon URL</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="icon_url" name="icon_url" placeholder="Enter a URL" value="http://mediaplatform.streamingmediahosting.com/img/sample_icon.png" class="form-control" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Logo Icon landing page url</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="icon_landing" name="icon_landing" placeholder="Enter a URL" value="'+flashvars['mylogo.watermarkClickPath']+'" class="form-control" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Icon Width</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;" class="pull-left">'+
        '<input type="text" id="icon-width" class="form-control" style="width:70px !important;" name="icon_width" value="30" disabled>'+
        '</div>'+
        '<div class="clear"></div>'+
        '<span class="pluginLabel">Icon Height</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;" class="pull-left">'+
        '<input type="text" id="icon-height" class="form-control" style="width:70px !important;" name="icon_height" value="30" disabled>'+
        '</div>'+

        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseFour">'+
        'Left Play Counter'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="left-play-counter" checked></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseFour" class="panel-collapse collapse">'+
        '<div class="panel-body">'+

        'A timer that shows the video progress in minutes and seconds. This timer is located at the left side of the scrubber.<br /><br />'+
        '<span class="pluginLabel">Location & Playing States</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<select id="left-counterLoc" class="form-control" style="width: 174px;"><option value="forwards">Count Forwards</option><option value="backwards">Count Backwards</option><option value="total">Show Total</option><option value="both">Both (changes upon click)</option></select><br />'+
        '</div>'+

        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseFive">'+
        'Right Play Counter'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="right-play-counter" checked></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseFive" class="panel-collapse collapse">'+
        '<div class="panel-body">'+

        'A timer that shows the video progress in minutes and seconds. This timer is located at the right side of the scrubber.<br /><br />'+
        '<span class="pluginLabel">Location & Playing States</span><br />'+
        '<div style="margin-top:5px; margin-bottom:5px;">'+
        '<select id="right-counterLoc" class="form-control" style="width: 174px;"><option value="forwards">Count Forwards</option><option value="backwards">Count Backwards</option><option value="total" selected>Show Total</option><option value="both">Both (changes upon click)</option></select><br />'+
        '</div>'+

        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseSix">'+
        'Flavor Selector'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="flavor_selector"></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseSix" class="panel-collapse collapse">'+
        '<div class="panel-body">'+

        'Allow the user to select the flavor (Video quality) to watch.<br /><br />'+
        '<span class="pluginLabel">HD-on label</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="hdOn" class="form-control" placeholder="Enter a label" name="hdOn" value="'+flashvars['flavorComboControllerScreen.hdOn']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">HD-off label</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="hdOff" class="form-control" placeholder="Enter a label" name="hdOff" value="'+flashvars['flavorComboControllerScreen.hdOff']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Tooltip for auto select message</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="hdtool" class="form-control" placeholder="Enter a message" name="hdtool" value="'+flashvars['flavorComboControllerScreen.autoMessage']+'" size="33" disabled>'+
        '</div>'+

        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseSeven">'+
        'Full Screen Button'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="fullscreen" checked></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseSeven" class="panel-collapse collapse">'+
        '<div class="panel-body">'+

        'This button allows users to switch to full screen mode, and back to regular mode.<br /><br />'+
        '<span class="pluginLabel" style="margin-top: 5px; margin-bottom: 5px; display: block;">Location & Playing States</span>'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="fullscreen_video_area" id="fullscreen_video_area" style="margin-right: 5px" checked>Video Area</label></div>'+
        '<div id="fs-video-options" style="margin-left: 20px; margin-bottom: 5px; margin-top: 5px;">'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="fullscreen_video_before" id="fullscreen_video_before" style="margin-right: 5px">Before play</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="fullscreen_video_during" id="fullscreen_video_during" style="margin-right: 5px">During play</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="fullscreen_video_paused" id="fullscreen_video_paused" style="margin-right: 5px">When paused</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="fullscreen_video_end" id="fullscreen_video_end" style="margin-right: 5px">End play</label></div>'+
        '</div>'+
        '<hr>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="fullscreen_controls" id="fullscreen_controls" style="margin-right: 5px" checked>Controls Area</label></div>'+
        '<span class="pluginLabel">Button Label</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="fullscreen_label" name="fullscreen_label" placeholder="Enter a label" class="form-control" value="'+flashvars['fullScreenBtnStartScreen.label']+'" size="33">'+
        '</div>'+
        '<span class="pluginLabel">Tooltip - Open Full Screen</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="fullscreen-tool-play" name="fullscreen-tool-play" placeholder="Enter a tooltip" class="form-control" value="'+flashvars['fullScreenBtnControllerScreen.upTooltip']+'" size="33">'+
        '</div>'+
        '<span class="pluginLabel">Tooltip - Close Full Screen</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="fullscreen-tool-pause" name="fullscreen-tool-pause" placeholder="Enter a tooltip" class="form-control" value="'+flashvars['fullScreenBtnControllerScreen.selectedTooltip']+'" size="33">'+
        '</div>'+
        '</div>'+

        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseEight">'+
        'On-video Play Button'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="on_video_play" checked></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseEight" class="panel-collapse collapse">'+
        '<div class="panel-body">'+

        'Displays play button on the video area. Usually shown when the video is loading or paused.<br /><br />'+
        '<span class="pluginLabel" style="margin-top: 5px; margin-bottom: 5px; display: block;">Location & Playing States</span>'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="ovplay_video_area" id="ovplay_video_area" style="margin-right: 5px" checked>Video Area</label></div>'+
        '<div id="ovplay-video-options" style="margin-left: 20px; margin-bottom: 5px; margin-top: 5px;">'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="ovplay_video_before" id="ovplay_video_before" style="margin-right: 5px" checked>Before play</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="ovplay_video_paused" id="ovplay_video_paused" style="margin-right: 5px" checked>When paused</label></div>'+
        '</div>'+
        '<hr>'+
        '<span class="pluginLabel">Button Label</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="ovplay_label" name="ovplay_label" placeholder="Enter a label" class="form-control" value="'+flashvars['onVideoPlayBtnStartScreen.label']+'" size="33">'+
        '</div>'+
        '<span class="pluginLabel">Tooltip Text</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="ovplay_tool" name="ovplay_tool" placeholder="Enter a tooltip" class="form-control" value="'+flashvars['onVideoPlayBtnStartScreen.tooltip']+'" size="33">'+
        '</div>'+
        '</div>'+

        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseNine">'+
        'Play-Pause Button'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="play_pause" checked></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseNine" class="panel-collapse collapse">'+
        '<div class="panel-body">'+

        'Displays Play or Pause buttons according to the state of the video.<br /><br />'+
        '<span class="pluginLabel">Tooltip-Play</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="playpause_tool_play" name="playpause_tool_play" placeholder="Enter a tooltip" class="form-control" value="'+flashvars['playBtnControllerScreen.upTooltip']+'" size="33">'+
        '</div>'+
        '<span class="pluginLabel">Tooltip-Pause</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="playpause_tool_pause" name="playpause_tool_pause" placeholder="Enter a tooltip" class="form-control" value="'+flashvars['playBtnControllerScreen.selectedTooltip']+'" size="33">'+
        '</div>'+

        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseTen">'+
        'Volume Controller'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="volume" checked></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseTen" class="panel-collapse collapse">'+
        '<div class="panel-body">'+

        'Display mute/unmute button with a vertical volume control bar.<br /><br />'+
        '<span class="pluginLabel">Tooltip Text</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="volume_tool" name="volume_tool" placeholder="Enter a tooltip" class="form-control" value="'+flashvars['volumeBar.tooltip']+'" size="33">'+
        '</div>'+
        '<span class="pluginLabel">Volume level for first play</span><br />'+
        '<div class="pull-left" style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="volume_level" name="volume_level" class="form-control" style="width: 70px ! important; display: block;" value="'+flashvars['volumeBar.initialValue']+'">'+
        '</div>'+
        '<div class="clear"></div>'+
        '<span class="pluginLabel">Override user saved volume level</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<select id="vol_select" class="form-control" style="width: 90px ! important;"><option value="false" selected>No</option><option value="true">Yes</option></select>'+
        '</div>'+

        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseEleven">'+
        'Scrubber'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="scrubber" checked></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseEleven" class="panel-collapse collapse">'+
        '<div class="panel-body">'+

        'The scrubber enables users to navigate through the video by dragging the handle. The scrubber also shows the buffering and playing progress.<br /><br />'+

        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseTwelve">'+
        'Replay Button'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="replay" checked></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseTwelve" class="panel-collapse collapse">'+
        '<div class="panel-body">'+

        'Replays current video from the start.<br /><br />'+
        '<span class="pluginLabel">Button Label</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="replay_label" name="replay_label" placeholder="Enter a label" class="form-control" value="'+flashvars['replayBtnEndScreen.label']+'" size="33">'+
        '</div>'+
        '<span class="pluginLabel">Tooltip Text</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="replay_tool" name="replay_tool" placeholder="Enter a tooltip" class="form-control" value="'+flashvars['replayBtnEndScreen.tooltip']+'" size="33">'+
        '</div>'+

        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseThirteen">'+
        'On-video Unmute Button'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="unmute"></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseThirteen" class="panel-collapse collapse">'+
        '<div class="panel-body">'+

        'A button on the video area that turns the sound on. Used for videos that are set to auto play - starts the video muted and allows the user to easily switch on the sound.<br /><br />'+
        '<span class="pluginLabel" style="margin-top: 5px; margin-bottom: 5px; display: block;">Location & Playing States</span>'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="unmute_video_area" id="unmute_video_area" style="margin-right: 5px" checked disabled>Video Area</label></div>'+
        '<div id="unmute-video-options" style="margin-left: 20px; margin-bottom: 5px; margin-top: 5px;">'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="unmute_video_before" id="unmute_video_before" style="margin-right: 5px" checked disabled>Before play</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="unmute_video_during" id="unmute_video_during" style="margin-right: 5px" checked disabled>During play</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="unmute_video_paused" id="unmute_video_paused" style="margin-right: 5px" checked disabled>When paused</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="unmute_video_end" id="unmute_video_end" style="margin-right: 5px" checked disabled>End play</label></div>'+
        '</div>'+
        '<hr>'+
        '<span class="pluginLabel">Button Label</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="unmute_label" name="unmute_label" placeholder="Enter a label" class="form-control" value="'+flashvars['unmuteBtnStartScreen.label']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Tooltip Text</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="unmute_tool" name="unmute_tool" placeholder="Enter a tooltip" class="form-control" value="'+flashvars['unmuteBtnStartScreen.tooltip']+'" size="33" disabled>'+
        '</div>'+
        '</div>'+

        '</div>'+
        '</div>'+
        '</div>'+
                
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseFourteen">'+
        'Share Button'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="share"></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseFourteen" class="panel-collapse collapse">'+
        '<div class="panel-body">'+

        'Share this movie. Enables posting to social networks, social bookmarking, sending email and grabbing of embed code.<br /><br />'+
        '<span class="pluginLabel" style="margin-top: 5px; margin-bottom: 5px; display: block;">Location & Playing States</span>'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="share_video_area" id="share_video_area" style="margin-right: 5px" checked disabled>Video Area</label></div>'+
        '<div id="share-video-options" style="margin-left: 20px; margin-bottom: 5px; margin-top: 5px;">'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="share_video_before" id="share_video_before" style="margin-right: 5px" checked disabled>Before play</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="share_video_during" id="share_video_during" style="margin-right: 5px" disabled>During play</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="share_video_paused" id="share_video_paused" style="margin-right: 5px" checked disabled>When paused</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="share_video_end" id="share_video_end" style="margin-right: 5px" checked disabled>End play</label></div>'+
        '</div>'+
        '<hr>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="share_controls" id="share_controls" style="margin-right: 5px" checked disabled>Controls Area</label></div>'+
        '<span class="pluginLabel">Button Label</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="share_label" name="share_label" placeholder="Enter a label" class="form-control" value="'+flashvars['shareBtnStartScreen.label']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Tooltip Text</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="share_tool" name="share_tool" placeholder="Enter a tooltip" class="form-control" value="'+flashvars['shareBtnStartScreen.tooltip']+'" size="33" disabled>'+
        '</div>'+
        '</div>'+

        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseFifteen">'+
        'Download Button'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="download"></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseFifteen" class="panel-collapse collapse">'+
        '<div class="panel-body">'+

        'Enables download of video to your computer. Note that the download button only supports downloads of single video files.<br /><br />'+
        '<span class="pluginLabel" style="margin-top: 5px; margin-bottom: 5px; display: block;">Location & Playing States</span>'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="dwnld_video_area" id="dwnld_video_area" style="margin-right: 5px" checked disabled>Video Area</label></div>'+
        '<div id="dwnld-video-options" style="margin-left: 20px; margin-bottom: 5px; margin-top: 5px;">'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="dwnld_video_before" id="dwnld_video_before" style="margin-right: 5px" checked disabled>Before play</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="dwnld_video_during" id="dwnld_video_during" style="margin-right: 5px" checked disabled>During play</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="dwnld_video_paused" id="dwnld_video_paused" style="margin-right: 5px" checked disabled>When paused</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="dwnld_video_end" id="dwnld_video_end" style="margin-right: 5px" checked disabled>End play</label></div>'+
        '</div>'+
        '<hr>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="dwnld_controls" id="dwnld_controls" style="margin-right: 5px" checked disabled>Controls Area</label></div>'+
        '<span class="pluginLabel">Button Label</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="dwnld_label" name="dwnld_label" placeholder="Enter a label" class="form-control" value="'+flashvars['downloadBtnStartScreen.label']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Tooltip Text</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="dwnld_tool" name="dwnld_tool" placeholder="Enter a tooltip" class="form-control" value="'+flashvars['downloadBtnStartScreen.tooltip']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Force download of a specific flavor<br />(enter ID number from the transcoding settings below)</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="dwnld_flavor" name="dwnld_flavor" placeholder="Enter a number" style="width: 100px;" class="form-control" value="'+flashvars['download.flavorId']+'" size="33" disabled><br>'+
        '0: Source<br />'+
        '1: HD<br />'+
        '2: High-Large<br />'+
        '3: Standard-Large<br />'+
        '4: Standard-Small<br />'+
        '5: Basic-Small<br />'+
        '6: HQ MP4 for Export<br />'+
        '7: Editable<br />'+
        '8: Basic-Small(H264)<br />'+
        '9: Standard-Small(H264)<br />'+
        '10: Standard-Large(H264)<br />'+
        '11: High-Large(H264)<br />'+
        '12: HD(H264)<br />'+
        '13: iPad<br />'+
        '14: Mobile(3GP)<br />'+
        '15: Mobile(H264)-Basic<br />'+
        '16: Mobile(H264)-Standard<br />'+
        '10001: SD 240p(H264)<br />'+
        '10002: SD 360p(H264)<br />'+
        '10003: SD 480p(H264)<br />'+
        '10004: ED 576p(H264)<br />'+
        '10005: HD 720p(H264)<br />'+
        '10006: HD 1080p(H264)<br />'+
        '</div>'+
        '</div>'+

        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseSixteen">'+
        'Capture Thumbnail'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="thumbnail"></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseSixteen" class="panel-collapse collapse">'+
        '<div class="panel-body">'+
        'Allows users to change the thumbnail of the video. Users can play the video and click Capture at their preferred frame.<br /><br />'+
        '<span class="pluginLabel" style="margin-top: 5px; margin-bottom: 5px; display: block;">Location & Playing States</span>'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="thumbnail_video_area" id="thumbnail_video_area" style="margin-right: 5px" checked disabled>Video Area</label></div>'+
        '<div id="thumbnail-video-options" style="margin-left: 20px; margin-bottom: 5px; margin-top: 5px;">'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="thumbnail_video_before" id="thumbnail_video_before" style="margin-right: 5px" checked disabled>Before play</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="thumbnail_video_during" id="thumbnail_video_during" style="margin-right: 5px" checked disabled>During play</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="thumbnail_video_paused" id="thumbnail_video_paused" style="margin-right: 5px" checked disabled>When paused</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="thumbnail_video_end" id="thumbnail_video_end" style="margin-right: 5px" checked disabled>End play</label></div>'+
        '</div>'+
        '<hr>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="thumbnail_controls" id="thumbnail_controls" style="margin-right: 5px" checked disabled>Controls Area</label></div>'+
        '<span class="pluginLabel">Button Label</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="thumbnail_label" name="thumbnail_label" placeholder="Enter a label" class="form-control" value="'+flashvars['captureThumbBtnStartScreen.label']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Tooltip Text</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="thumbnail_tool" name="thumbnail_tool" placeholder="Enter a tooltip" class="form-control" value="'+flashvars['captureThumbBtnStartScreen.tooltip']+'" size="33" disabled>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseSeventeen">'+
        'Stars Rating'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="stars"></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseSeventeen" class="panel-collapse collapse">'+
        '<div class="panel-body">'+
        'Allows your viewers to rate the media they watch.<br /><br />'+
        '<span class="pluginLabel">View Only</span><br />'+
        '<div style="margin-top:5px; margin-bottom:5px;">'+
        '<select id="view-only" class="form-control" style="width: 174px;" disabled><option value="true">False</option><option value="false">True</option></select><br />'+
        '</div>'+

        '</div>'+
        '</div>'+
        '</div>'+
            
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseEighteen">'+
        'Captions'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="captions"></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseEighteen" class="panel-collapse collapse">'+
        '<div class="panel-body">'+
        'Display captions on top of the video.<br /><br />'+
        '<span class="pluginLabel">Text Color</span><br>'+
        '<div class="pull-left" style="margin-top:5px; margin-bottom:15px;">'+
        '<div class="input-group cap_textcolor"><input type="text" id="cap_textcolor" name="cap_textcolor" value="'+capVideo_textcolor+'" class="form-control" style="width: 85px;" disabled><span class="input-group-addon"><i></i></span></div>'+
        '</div>'+
        '<div class="clear"></div>'+
        '<span class="pluginLabel">Text Effect</span><br>'+
        '<div class="pull-left" style="margin-top:5px; margin-bottom:15px;">'+
        '<div style="float: left; margin-bottom: 5px;"><select id="text-effect" class="form-control" style="width: 174px;" disabled><option value="glow">Glow</option><option value="background">Background</option></select></div>'+
        '</div>'+
        '<div class="clear"></div>'+
        '<span class="pluginLabel">Glow Color <span style="font-size: 11px;">(if "Glow" selected)</span></span><br>'+
        '<div class="pull-left" style="margin-top:5px; margin-bottom:15px;">'+
        '<div class="input-group cap_glowcolor"><input type="text" id="cap_glowcolor" name="cap_glowcolor" value="'+capVideo_glowcolor+'" class="form-control" style="width: 85px;" disabled><span class="input-group-addon"><i></i></span></div>'+
        '</div>'+
        '<div class="clear"></div>'+
        '<span class="pluginLabel">Glow Blur</span></span><br>'+
        '<div class="pull-left" style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" value="'+capVideo_glowblur+'" style="width: 70px ! important; display: block;" class="form-control" name="cap_glowblur" id="cap_glowblur" disabled>'+
        '</div>'+
        '<div class="clear"></div>'+
        '<span class="pluginLabel">Background Color <span style="font-size: 11px;">(if "Background" selected)</span></span><br>'+
        '<div class="pull-left" style="margin-top:5px; margin-bottom:15px;">'+
        '<div class="input-group cap_backcolor"><input type="text" id="cap_backcolor" name="cap_backcolor" value="'+capVideo_backcolor+'" class="form-control" style="width: 85px;" disabled><span class="input-group-addon"><i></i></span></div>'+
        '</div>'+
        '<div class="clear"></div>'+
        '<span class="pluginLabel">Font Size</span></span><br>'+
        '<div class="pull-left" style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" value="'+capVideo_fontsize+'" style="width: 70px ! important; display: block;" class="form-control" name="cap_fontsize" id="cap_fontsize" disabled>'+
        '</div>'+
        '<div class="clear"></div>'+
        '<span class="pluginLabel">Font Family</span><br>'+
        '<div class="pull-left" style="margin-top:5px; margin-bottom:15px;">'+
        '<div style="float: left; margin-bottom: 5px;"><select id="cap-fontfam" class="form-control" style="width: 174px;" disabled><option value="Verdana">Verdana</option><option value="Arial">Arial</option><option value="Arial Black">Arial Black</option><option value="Tahoma">Tahoma</option><option value="Courier">Courier</option><option value="Comic Sans Ms">Comic Sans Ms</option><option value="Geneva">Geneva</option><option value="Impact">Impact</option><option value="Georgia">Georgia</option><option value="Lucida Console">Lucida Console</option><option value="Lucida Sans Unicode">Lucida Sans Unicode</option><option value="Palatino">Palatino</option><option value="Trebuchet MS">Trebuchet MS</option><option value="Times New Roman">Times New Roman</option></select></div>'+
        '</div>'+
        '<div class="clear"></div>'+
        '<span class="pluginLabel">Prompt <span style="font-size: 11px;">(text that appears on captions selector)</span></span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="cap_prompt" name="cap_prompt" placeholder="Enter a prompt" class="form-control" value="'+capVideo_prompt+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Tooltip</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="cap_tooltip" name="cap_tooltip" placeholder="Enter a tooltip" class="form-control" value="'+capVideo_tooltip+'" size="33" disabled>'+
        '</div>'+

        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseNinteen">'+
        'Custom Button 1'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="customButton1"></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseNinteen" class="panel-collapse collapse">'+
        '<div class="panel-body">'+

        'Allows custom action via Javascript, clicking on the button will invoke the javascript function <span style="font-weight: bold;">customFunc1</span>. Add the following code to your HTML page to integrate with this feature: <br /><span style="font-weight: bold;">&lt;script&gt;<br /> function customFunc1\(entryId\)\{<br />//add your custom code here...<br />\}<br />&lt;/script\&gt;</span><br /><br />'+
        '<span class="pluginLabel" style="margin-top: 5px; margin-bottom: 5px; display: block;">Location & Playing States</span>'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton1_video_area" id="customButton1_video_area" style="margin-right: 5px" checked disabled>Video Area</label></div>'+
        '<div id="customButton1-video-options" style="margin-left: 20px; margin-bottom: 5px; margin-top: 5px;">'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton1_video_before" id="customButton1_video_before" style="margin-right: 5px" checked disabled>Before play</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton1_video_during" id="customButton1_video_during" style="margin-right: 5px" checked disabled>During play</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton1_video_paused" id="customButton1_video_paused" style="margin-right: 5px" checked disabled>When paused</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton1_video_end" id="customButton1_video_end" style="margin-right: 5px" checked disabled>End play</label></div>'+
        '</div>'+
        '<hr>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton1_controls" id="customButton1_controls" style="margin-right: 5px" checked disabled>Controls Area</label></div>'+
        '<span class="pluginLabel">Button Label</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="customButton1_label" name="customButton1_label" placeholder="Enter a label" class="form-control" value="'+flashvars['custom1BtnStartScreen.label']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Tooltip</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="customButton1_tool" name="customButton1_tool" placeholder="Enter a tooltip" class="form-control" value="'+flashvars['custom1BtnStartScreen.tooltip']+'" size="33" disabled>'+
        '</div>'+
        '</div>'+

        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseTweenty">'+
        'Custom Button 2'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="customButton2"></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseTweenty" class="panel-collapse collapse">'+
        '<div class="panel-body">'+

        'Allows custom action via Javascript, clicking on the button will invoke the javascript function <span style="font-weight: bold;">customFunc2</span>. Add the following code to your HTML page to integrate with this feature: <br /><span style="font-weight: bold;">&lt;script&gt;<br /> function customFunc2\(entryId\)\{<br />//add your custom code here...<br />\}<br />&lt;/script\&gt;</span><br /><br />'+
        '<span class="pluginLabel" style="margin-top: 5px; margin-bottom: 5px; display: block;">Location & Playing States</span>'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton2_video_area" id="customButton2_video_area" style="margin-right: 5px" checked disabled>Video Area</label></div>'+
        '<div id="customButton2-video-options" style="margin-left: 20px; margin-bottom: 5px; margin-top: 5px;">'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton2_video_before" id="customButton2_video_before" style="margin-right: 5px" checked disabled>Before play</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton2_video_during" id="customButton2_video_during" style="margin-right: 5px" checked disabled>During play</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton2_video_paused" id="customButton2_video_paused" style="margin-right: 5px" checked disabled>When paused</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton2_video_end" id="customButton2_video_end" style="margin-right: 5px" checked disabled>End play</label></div>'+
        '</div>'+
        '<hr>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton2_controls" id="customButton2_controls" style="margin-right: 5px" checked disabled>Controls Area</label></div>'+
        '<span class="pluginLabel">Button Label</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="customButton2_label" name="customButton2_label" placeholder="Enter a label" class="form-control" value="'+flashvars['custom2BtnStartScreen.label']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Tooltip</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="customButton2_tool" name="customButton2_tool" placeholder="Enter a tooltip" class="form-control" value="'+flashvars['custom2BtnStartScreen.tooltip']+'" size="33" disabled>'+
        '</div>'+
        '</div>'+

        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseTweentyOne">'+
        'Custom Button 3'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="customButton3"></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseTweentyOne" class="panel-collapse collapse">'+
        '<div class="panel-body">'+

        'Allows custom action via Javascript, clicking on the button will invoke the javascript function <span style="font-weight: bold;">customFunc3</span>. Add the following code to your HTML page to integrate with this feature: <br /><span style="font-weight: bold;">&lt;script&gt;<br /> function customFunc3\(entryId\)\{<br />//add your custom code here...<br />\}<br />&lt;/script\&gt;</span><br /><br />'+
        '<span class="pluginLabel" style="margin-top: 5px; margin-bottom: 5px; display: block;">Location & Playing States</span>'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton3_video_area" id="customButton3_video_area" style="margin-right: 5px" checked disabled>Video Area</label></div>'+
        '<div id="customButton3-video-options" style="margin-left: 20px; margin-bottom: 5px; margin-top: 5px;">'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton3_video_before" id="customButton3_video_before" style="margin-right: 5px" checked disabled>Before play</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton3_video_during" id="customButton3_video_during" style="margin-right: 5px" checked disabled>During play</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton3_video_paused" id="customButton3_video_paused" style="margin-right: 5px" checked disabled>When paused</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton3_video_end" id="customButton3_video_end" style="margin-right: 5px" checked disabled>End play</label></div>'+
        '</div>'+
        '<hr>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton3_controls" id="customButton3_controls" style="margin-right: 5px" checked disabled>Controls Area</label></div>'+
        '<span class="pluginLabel">Button Label</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="customButton3_label" name="customButton3_label" placeholder="Enter a label" class="form-control" value="'+flashvars['custom3BtnStartScreen.label']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Tooltip</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="customButton3_tool" name="customButton3_tool" placeholder="Enter a tooltip" class="form-control" value="'+flashvars['custom3BtnStartScreen.tooltip']+'" size="33" disabled>'+
        '</div>'+
        '</div>'+

        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseTweentyTwo">'+
        'Custom Button 4'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="customButton4"></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseTweentyTwo" class="panel-collapse collapse">'+
        '<div class="panel-body">'+

        'Allows custom action via Javascript, clicking on the button will invoke the javascript function <span style="font-weight: bold;">customFunc4</span>. Add the following code to your HTML page to integrate with this feature: <br /><span style="font-weight: bold;">&lt;script&gt;<br /> function customFunc4\(entryId\)\{<br />//add your custom code here...<br />\}<br />&lt;/script\&gt;</span><br /><br />'+
        '<span class="pluginLabel" style="margin-top: 5px; margin-bottom: 5px; display: block;">Location & Playing States</span>'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton4_video_area" id="customButton4_video_area" style="margin-right: 5px" checked disabled>Video Area</label></div>'+
        '<div id="customButton4-video-options" style="margin-left: 20px; margin-bottom: 5px; margin-top: 5px;">'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton4_video_before" id="customButton4_video_before" style="margin-right: 5px" checked disabled>Before play</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton4_video_during" id="customButton4_video_during" style="margin-right: 5px" checked disabled>During play</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton4_video_paused" id="customButton4_video_paused" style="margin-right: 5px" checked disabled>When paused</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton4_video_end" id="customButton4_video_end" style="margin-right: 5px" checked disabled>End play</label></div>'+
        '</div>'+
        '<hr>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton4_controls" id="customButton4_controls" style="margin-right: 5px" checked disabled>Controls Area</label></div>'+
        '<span class="pluginLabel">Button Label</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="customButton4_label" name="customButton4_label" placeholder="Enter a label" class="form-control" value="'+flashvars['custom4BtnStartScreen.label']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Tooltip</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="customButton4_tool" name="customButton4_tool" placeholder="Enter a tooltip" class="form-control" value="'+flashvars['custom4BtnStartScreen.tooltip']+'" size="33" disabled>'+
        '</div>'+
        '</div>'+

        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseTweentyThree">'+
        'Custom Button 5'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="customButton5"></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseTweentyThree" class="panel-collapse collapse">'+
        '<div class="panel-body">'+

        'Allows custom action via Javascript, clicking on the button will invoke the javascript function <span style="font-weight: bold;">customFunc5</span>. Add the following code to your HTML page to integrate with this feature: <br /><span style="font-weight: bold;">&lt;script&gt;<br /> function customFunc5\(entryId\)\{<br />//add your custom code here...<br />\}<br />&lt;/script\&gt;</span><br /><br />'+
        '<span class="pluginLabel" style="margin-top: 5px; margin-bottom: 5px; display: block;">Location & Playing States</span>'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton5_video_area" id="customButton5_video_area" style="margin-right: 5px" checked disabled>Video Area</label></div>'+
        '<div id="customButton5-video-options" style="margin-left: 20px; margin-bottom: 5px; margin-top: 5px;">'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton5_video_before" id="customButton5_video_before" style="margin-right: 5px" checked disabled>Before play</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton5_video_during" id="customButton5_video_during" style="margin-right: 5px" checked disabled>During play</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton5_video_paused" id="customButton5_video_paused" style="margin-right: 5px" checked disabled>When paused</label></div>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton5_video_end" id="customButton5_video_end" style="margin-right: 5px" checked disabled>End play</label></div>'+
        '</div>'+
        '<hr>'+
        '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="customButton5_controls" id="customButton5_controls" style="margin-right: 5px" checked disabled>Controls Area</label></div>'+
        '<span class="pluginLabel">Button Label</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="customButton5_label" name="customButton5_label" placeholder="Enter a label" class="form-control" value="'+flashvars['custom5BtnStartScreen.label']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Tooltip</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="customButton5_tool" name="customButton5_tool" placeholder="Enter a tooltip" class="form-control" value="'+flashvars['custom5BtnStartScreen.tooltip']+'" size="33" disabled>'+
        '</div>'+
        '</div>'+

        '</div>'+
        '</div>'+
        '</div>'+
        
        '</div>'+
        '</div>'+
        '</div>'+ 
        
        
        '<div id="playlist" class="tab-pane">'+
        '<div class="options">'+
        '<h3>Playlist Items</h3>'+
        '<p>The playlist plugin supports associating multiple clips in sequence.</p>'+
        
        '<div id="accordion" class="panel-group">'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapsePone">'+
        'Previous Button'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="previous_button" checked></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapsePone" class="panel-collapse collapse">'+
        '<div class="panel-body">'+

        'Play previous item on playlist.<br /><br />'+
        '<span class="pluginLabel">Tooltip Text</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="previous_tool" name="previous_tool" placeholder="Enter a tooltip" class="form-control" value="'+playlist_previous_tooltip+'" size="33">'+
        '</div>'+

        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapsePtwo">'+
        'Next Button'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="next_button" checked></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapsePtwo" class="panel-collapse collapse">'+
        '<div class="panel-body">'+

        'Play next item on playlist.<br /><br />'+
        '<span class="pluginLabel">Tooltip Text</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="next_tool" name="next_tool" placeholder="Enter a tooltip" class="form-control" value="'+playlist_next_tooltip+'" size="33">'+
        '</div>'+

        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapsePthree">'+
        'Thumbnail'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="plist_thumb" checked></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapsePthree" class="panel-collapse collapse">'+
        '<div class="panel-body">'+
        'Show Thumbnail Images<br /><br />'+
        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapsePfour">'+
        'Name'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="plist_name" checked></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapsePfour" class="panel-collapse collapse">'+
        '<div class="panel-body">'+
        'Show Item Names<br /><br />'+
        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapsePfive">'+
        'Description'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="plist_desc" checked></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapsePfive" class="panel-collapse collapse">'+
        '<div class="panel-body">'+
        'Show Item Description<br /><br />'+
        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapsePsix">'+
        'Duration'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="plist_duration" checked></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapsePsix" class="panel-collapse collapse">'+
        '<div class="panel-body">'+
        'Show Item Duration<br /><br />'+
        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapsePseven">'+
        'Plays'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="plist_plays"></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapsePseven" class="panel-collapse collapse">'+
        '<div class="panel-body">'+
        'Show Item Plays<br /><br />'+
        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapsePeight">'+
        'Rank'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="plist_rank"></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapsePeight" class="panel-collapse collapse">'+
        '<div class="panel-body">'+
        'Show Item Rank<br /><br />'+
        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapsePnine">'+
        'Votes Count'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="plist_votes"></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapsePnine" class="panel-collapse collapse">'+
        '<div class="panel-body">'+
        'Show Item Description<br /><br />'+
        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapsePten">'+
        'Tags'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="plist_tags"></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapsePten" class="panel-collapse collapse">'+
        '<div class="panel-body">'+
        'Show Item Tags<br /><br />'+
        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapsePeleven">'+
        'Created Date'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="plist_createddat"></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapsePeleven" class="panel-collapse collapse">'+
        '<div class="panel-body">'+
        'Show Item Creation Date<br /><br />'+
        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapsePtwelve">'+
        'Created By'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="plist_createdby"></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapsePtwelve" class="panel-collapse collapse">'+
        '<div class="panel-body">'+
        'Show Item Created By<br /><br />'+
        '</div>'+
        '</div>'+
        '</div>'+
        
        
        
        '</div>'+            
        '</div>'+
        '</div>'+
        
        
        '<div id="ad" class="tab-pane">'+
        '<div class="options">'+
        '<h3>Advertising</h3>'+
        
        '<div id="accordion" class="panel-group">'+
        '<div class="panel panel-default">'+        
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseTweentyFour">'+
        'Bumper'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="bumper"></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseTweentyFour" class="panel-collapse collapse">'+
        '<div class="panel-body">'+
        'Bumpers enables a entry to be displayed before or after the content.<br /><br />'+
        '<span class="pluginLabel">Bumper Entry Id</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="bumper_id" name="bumper_id" placeholder="Enter a Entry Id" class="form-control" value="'+flashvars['bumper.bumperEntryID']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Click URL</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="bumper_url" name="bumper_url" placeholder="Enter a URL" class="form-control" value="'+flashvars['bumper.clickurl']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Display Bumper</span><br />'+
        '<div style="margin-top:5px; margin-bottom:5px;">'+
        '<select id="bumper_sequence" class="form-control" style="width: 200px !important; max-width: 200px !important;" disabled><option value="before">Before Content</option><option value="after">After Content</option><option value="both">Before and After Content</option></select><br />'+
        '</div>'+

        '</div>'+
        '</div>'+
        '</div>'+
        
        '<div class="panel panel-default">'+        
        '<div class="panel-heading">'+
        '<h4 class="panel-title">'+
        '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseTweentyFive">'+
        'Vast'+
        '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="vast"></div></a>'+
        '</h4>'+
        '</div>'+
        '<div id="collapseTweentyFive" class="panel-collapse collapse">'+
        '<div class="panel-body">'+
        'Player features robust VAST support for prerolls, midrolls, overlays, companions and postrolls<br /><br />'+
        '<span class="pluginLabel">Show Notice Text</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<div class="radio" style="display: inline-block;"><label class="pluginLabel"><input type="radio" style="margin-right: 5px" id="notice_text_yes" name="notice_display" disabled>Yes</label></div><div class="radio" style="display: inline-block; margin-left: 15px;"><label class="pluginLabel"><input type="radio" style="margin-right: 5px" id="notice_text_no" name="notice_display" checked disabled>No</label></div>'+
        '</div>'+
        '<span class="pluginLabel">Notice Text</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="notice_text" name="notice_text" placeholder="Enter a message" class="form-control" value="'+flashvars['noticeMessage.text']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Allow Skip</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<div class="radio" style="display: inline-block;"><label class="pluginLabel"><input type="radio" style="margin-right: 5px" id="ad_skip_yes" name="ad_skip" disabled>Yes</label></div><div class="radio" style="display: inline-block; margin-left: 15px;"><label class="pluginLabel"><input type="radio" style="margin-right: 5px" id="ad_skip_no" name="ad_skip" checked disabled>No</label></div>'+
        '</div>'+
        '<span class="pluginLabel">Skip Text</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="skip_text" name="skip_text" placeholder="Enter a skip text" class="form-control" value="'+flashvars['skipBtn.label']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Timeout Configuration (in seconds)</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="timeout" name="timeout" placeholder="Enter a time" class="form-control" value="'+flashvars['vast.timeout']+'" size="33" disabled>'+
        '</div>'+
        '<div style="margin-left: auto; margin-right: auto; width: 100%; margin-top: 30px;" class="tabbable tabs-left">'+
        '<ul id="myTab" class="nav nav-tabs"><li class="active"><a data-toggle="tab" href="#preroll">Preroll</a></li><li><a data-toggle="tab" href="#overlay">Overlay</a></li><li><a data-toggle="tab" href="#postroll">Postroll</a></li></ul>'+
        '<div style="width: 100%; margin: 15px auto;" class="tab-content">'+
        
        '<div class="tab-pane active" id="preroll">'+
        
        '<span class="pluginLabel">Request PreRoll Ads</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<div class="radio" style="display: inline-block;"><label class="pluginLabel"><input type="radio" style="margin-right: 5px" id="preroll_yes" name="preroll_enable" disabled>Enable</label></div><div class="radio" style="display: inline-block; margin-left: 15px;"><label class="pluginLabel"><input type="radio" style="margin-right: 5px" id="preroll_no" name="preroll_enable" checked disabled>Disable</label></div>'+
        '</div>'+
        '<span class="pluginLabel">Preroll URL</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="preroll_url" name="preroll_url" placeholder="Enter a URL" class="form-control" value="'+flashvars['vast.prerollUrl']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Preroll(s) amount</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="preroll_amount" name="preroll_amount" class="form-control" style="width: 80px;" value="'+flashvars['vast.numPreroll']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Number of prerolls to start with</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="preroll_start" name="preroll_start" class="form-control" style="width: 80px;" value="'+flashvars['vast.prerollStartWith']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Preroll interval</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="preroll_interval" name="preroll_interval" class="form-control" style="width: 80px;" value="'+flashvars['vast.prerollInterval']+'" size="33" disabled>'+
        '</div>'+
        
        '</div>'+
        
        '<div class="tab-pane" id="overlay">'+
        
        '<span class="pluginLabel">Request Overlay Ads</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<div class="radio" style="display: inline-block;"><label class="pluginLabel"><input type="radio" style="margin-right: 5px" id="overlay_yes" name="overlay_enable" disabled>Enable</label></div><div class="radio" style="display: inline-block; margin-left: 15px;"><label class="pluginLabel"><input type="radio" style="margin-right: 5px" id="overlay_no" name="overlay_enable" disabled checked>Disable</label></div>'+
        '</div>'+
        '<span class="pluginLabel">Overlay URL</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="overlay_url" name="overlay_url" placeholder="Enter a URL" class="form-control" value="'+flashvars['vast.overlayUrl']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Overlay start time</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="overlay_start" name="overlay_start" class="form-control" style="width: 80px;" value="'+flashvars['vast.overlayStartAt']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Overlay interval</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="overlay_interval" name="overlay_interval" class="form-control" style="width: 80px;" value="'+flashvars['vast.overlayInterval']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Timeout</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="overlay_timeout" name="overalay_timeout" class="form-control" style="width: 80px;" value="'+flashvars['overlay.displayDuration']+'" size="33" disabled>'+
        '</div>'+
        
        '</div>'+
        
        '<div class="tab-pane" id="postroll">'+
        
        '<span class="pluginLabel">Request PostRoll Ads</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<div class="radio" style="display: inline-block;"><label class="pluginLabel"><input type="radio" style="margin-right: 5px" id="postroll_yes" name="postroll_enable" disabled>Enable</label></div><div class="radio" style="display: inline-block; margin-left: 15px;"><label class="pluginLabel"><input type="radio" style="margin-right: 5px" id="postroll_no" name="postroll_enable" disabled checked>Disable</label></div>'+
        '</div>'+
        '<span class="pluginLabel">Postroll URL</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="postroll_url" name="postroll_url" placeholder="Enter a URL" class="form-control" value="'+flashvars['vast.postrollUrl']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Postroll(s) amount</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="postroll_amount" name="postroll_amount" class="form-control" style="width: 80px;" value="'+flashvars['vast.numPostroll']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Number of postrolls to start with</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="postroll_start" name="postroll_start" class="form-control" style="width: 80px;" value="'+flashvars['vast.postrollStartWith']+'" size="33" disabled>'+
        '</div>'+
        '<span class="pluginLabel">Postroll interval</span><br />'+
        '<div style="margin-top:5px; margin-bottom:15px;">'+
        '<input type="text" id="postroll_interval" name="postroll_interval" class="form-control" style="width: 80px;" value="'+flashvars['vast.postrollInterval']+'" size="33" disabled>'+
        '</div>'+
        
        '</div>'+
        
        '</div>'+
        
        '</div>'+

        '</div>'+
        '</div>'+
        '</div>'+
        
        
        
        '</div>'+
        '</div>'+
        '</div>'+  
        
        '<div id="custom" class="tab-pane">'+
        '<div class="options">'+
        '<h3>Style and Color</h3>'+
        '<span class="pluginLabel">Select Theme</span><br />'+
        '<div style="margin-top:5px; margin-bottom:20px;">'+
        '<select id="theme" class="form-control" style="width: 150px !important; max-width: 150px !important;"><option value="b">Black</option><option value="w">White</option></select><br />'+
        '</div>'+
        '<h3>Control bar buttons</h3>'+
        '<span class="pluginLabel">Colors of icons and labels</span><br>'+
        '<div class="pull-left" style="margin-top:5px; margin-bottom:5px;">'+
        '<div class="input-group style_icons_color"><input type="text" id="style_icons_color" name="style_icons_color" value="'+style_icons_color+'" class="form-control" style="width: 85px;"><span class="input-group-addon"><i></i></span></div>'+
        '</div>'+
        '<div class="clear"></div>'+
        '<span class="pluginLabel">Mouse over color</span><br>'+
        '<div class="pull-left" style="margin-top:5px; margin-bottom:10px;">'+
        '<div class="input-group style_mouse_color"><input type="text" id="style_mouse_color" name="style_mouse_color" value="'+style_mouse_color+'" class="form-control" style="width: 85px;"><span class="input-group-addon"><i></i></span></div>'+
        '</div>'+
        '<div class="clear"></div>'+
        '<h3>On-video buttons</h3>'+
        '<span class="pluginLabel">On-video buttons color</span><br>'+
        '<div class="pull-left" style="margin-top:5px; margin-bottom:5px;">'+
        '<div class="input-group style_onvideo_button_color"><input type="text" id="style_onvideo_button_color" name="style_onvideo_button_color" value="'+style_onvideo_button_color+'" class="form-control" style="width: 85px;"><span class="input-group-addon"><i></i></span></div>'+
        '</div>'+
        '<div class="clear"></div>'+
        '<span class="pluginLabel">On-video mouse over color</span><br>'+
        '<div class="pull-left" style="margin-top:5px; margin-bottom:5px;">'+
        '<div class="input-group style_onvideo_mouse_color"><input type="text" id="style_onvideo_mouse_color" name="style_onvideo_mouse_color" value="'+style_onvideo_mouse_color+'" class="form-control" style="width: 85px;"><span class="input-group-addon"><i></i></span></div>'+
        '</div>'+
        '<div class="clear"></div>'+
        '<span class="pluginLabel">On-video mouse icons and labels color</span><br>'+
        '<div class="pull-left" style="margin-top:5px; margin-bottom:10px;">'+
        '<div class="input-group style_onvideo_icons_color"><input type="text" id="style_onvideo_icons_color" name="style_onvideo_icons_color" value="'+style_onvideo_icons_color+'" class="form-control" style="width: 85px;"><span class="input-group-addon"><i></i></span></div>'+
        '</div>'+
        '<div class="clear"></div>'+
        '<h3>Font</h3>'+
        '<div style="margin-top:5px; margin-bottom:5px;">'+
        '<select id="style_font" class="form-control" style="width: 150px !important; max-width: 150px !important;"><option value="Verdana">Verdana</option><option value="Arial" selected>Arial</option><option value="Arial Black">Arial Black</option><option value="Tahoma">Tahoma</option><option value="Courier">Courier</option><option value="Comic Sans Ms">Comic Sans Ms</option><option value="Geneva">Geneva</option><option value="Impact">Impact</option><option value="Georgia">Georgia</option><option value="Lucida Console">Lucida Console</option><option value="Lucida Sans Unicode">Lucida Sans Unicode</option><option value="Palatino">Palatino</option><option value="Trebuchet MS">Trebuchet MS</option><option value="Times New Roman">Times New Roman</option></select><br />'+
        '</div>'+
        
        '</div>'+
        '</div>'+    
        
        
        '<div id="content" class="tab-pane">'+
        '<div class="options">'+
        '<h3>Playlist Content</h3>'+
        '<p>A channel playlist contains multiple tabs, each containing a different playlist.</p> <p>Drag and drop your playlists under the "Playlist Tabs" drop zone.</p>'+
        
        '</div>'+
        '</div>'+ 
        
        
        '</div>'+        
        '</div>'+
        
        
        '<div class="player_preview">'+
        '<div class="pull-left">'+
        '<div style="padding-top: 5px; margin-bottom: 10px; height: 32px; display: inline-block; position: relative;">'+
        '<div class="checkbox"><label><input type="checkbox" id="auto_preview" onclick="smhPlayers.setAutoPreview();" style="margin-right: 5px">Auto Preview</label></div>'+
        '</div>'+
        '<button onclick="smhPlayers.refreshPlayer()" style="margin-left: 20px" class="btn btn-default"><i class="fa fa-refresh">&nbsp;</i>Preview Changes</button>'+
        '</div>'+
        '<div class="pull-right" style="margin-top: 7px;">'+
        '<div id="pass-result" style="display: inline;"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div>'+player_button+
        '</div>'+
        '<div class="clear"></div>'+
        '<hr>'+
        '<div id="player-wrapper">'+
        '<div id="previewIframe" style="margin-top: 5px;"></div>'+
        '</div>'+
        '</div>'+
        '<div id="multi-content-wrapper" style="display: none;">'+
        
        '<div class="pull-right" style="margin-top: 7px;">'+
        '<div id="pass-result" style="display: inline;"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div>'+player_button+
        '</div>'+
        '<div class="clear"></div>'+
        '<hr>'+
        '<div class="playlist-content">'+
        '<div id="entries-wrapper">'+
        '<div class="header rs-header">'+
        '<div style="margin-top: 6px; margin-bottom: 5px; text-align: left;">All Playlists</div>'+
        '</div>'+
        '<div id="entries">'+
        '<div id="plist-table"></div>'+
        '</div>'+
        '</div>'+
        '<div id="playlist-wrapper">'+
        '<div style="text-align: left;" class="header">'+
        'Playlist Tabs'+
        '<div class="clear"></div>'+
        '<div id="plist-entries"></div>'+
        '<div class="clear"></div>'+
        '<div id="playlist-info">'+
        '<div id="duration-wrapper">Total Playlists: <span id="plist_num">0</span></div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        
        
        '</div>'+
        
        
        '</div>'+
        '</div>'; 
    
        $('#smh-modal3 .modal-body').html(content);
        
        if(edit){
            $('#video_ratio_orig').prop( "checked", false );
            $('#video_ratio_fit').prop( "checked", false );
            if(flashvars['video.stretchThumbnail']){
                $('#video_ratio_orig').prop( "checked", true );
            } else {
                $('#video_ratio_fit').prop( "checked", true );
            }
            
            if(playOnload){
                $('#auto_play').prop( "checked", true );
            } else {
                $('#auto_play').prop( "checked", false );
            }
            
            if(playerMute){
                $('#start_muted').prop( "checked", true );
            } else {
                $('#start_muted').prop( "checked", false );
            }

            if(playlist_visible){
                $('#hidePlaylist').prop( "checked", false );
            } else {
                $('#hidePlaylist').prop( "checked", true );
            }
            
            if(playlist_autocontinue){
                $('#autoContinue').prop( "checked", true );
            } else {
                $('#autoContinue').prop( "checked", false );
            }
            
            if(playlist_loop){
                $('#playlistLoop').prop( "checked", true );
            } else {
                $('#playlistLoop').prop( "checked", false );
            }
            
            if(flashvars['TopTitleScreen.visible']){
                $('#title_text').prop( "checked", true );
            } else {
                $('#title_text').prop( "checked", false );
            }
            
            if(flashvars['watermark.visible']){
                if (!$('#smh-modal3 #watermark').is(':checked')) {
                    $('#watermark_url').val(flashvars['watermark.watermarkPath']);
                    $('#smh-modal3 #watermark').click();
                }
            } else {
                if ($('#smh-modal3 #watermark').is(':checked')) {
                    $('#smh-modal3 #watermark').click();
                }
            }
            
            if(flashvars['mylogo.plugin']){
                if (!$('#smh-modal3 #logo-icon').is(':checked')) {
                    $('#icon-width').val(flashvars['mylogo.width']);
                    $('#icon-height').val(flashvars['mylogo.height']);
                    $('#icon_url').val(flashvars['mylogo.watermarkPath']);
                    $('#smh-modal3 #logo-icon').click();
                }
            } else {
                if ($('#smh-modal3 #logo-icon').is(':checked')) {
                    $('#smh-modal3 #logo-icon').click();
                }
            }
            
            if(flashvars['timerControllerScreen1.visible']){
                if (!$('#smh-modal3 #left-play-counter').is(':checked')) {
                    $('#left-counterLoc').val(flashvars['timerControllerScreen1.timerType']);
                    $('#smh-modal3 #left-play-counter').click();
                }
            } else {
                if ($('#smh-modal3 #left-play-counter').is(':checked')) {
                    $('#smh-modal3 #left-play-counter').click();
                }   
            }
            
            if(flashvars['timerControllerScreen2.visible']){
                if (!$('#smh-modal3 #right-play-counter').is(':checked')) {
                    $('#left-counterLoc').val(flashvars['timerControllerScreen2.timerType']);
                    $('#smh-modal3 #right-play-counter').click();
                }
            } else {
                if ($('#smh-modal3 #right-play-counter').is(':checked')) {
                    $('#smh-modal3 #right-play-counter').click();
                }   
            }
            
            if(flashvars['flavorComboControllerScreen.visible']){
                if (!$('#smh-modal3 #flavor_selector').is(':checked')) {
                    $('#smh-modal3 #flavor_selector').click();
                }
            } else {
                if ($('#smh-modal3 #flavor_selector').is(':checked')) {
                    $('#smh-modal3 #flavor_selector').click();
                }   
            }
            
            if(flashvars['flavorComboControllerScreen.visible']){
                if (!$('#smh-modal3 #flavor_selector').is(':checked')) {
                    $('#smh-modal3 #flavor_selector').click();
                }
            } else {
                if ($('#smh-modal3 #flavor_selector').is(':checked')) {
                    $('#smh-modal3 #flavor_selector').click();
                }   
            }
            
            if(fullscreen){
                if (!$('#smh-modal3 #fullscreen').is(':checked')) {
                    $('#smh-modal3 #fullscreen').click();
                    if(fullscreen_video){
                        $('#fullscreen_video_area').prop( "checked", true );
                    }
                    if(flashvars['fullScreenBtnControllerScreen.visible']){
                        $('#fullscreen_controls').prop( "checked", true );
                    }
                    if(flashvars['fullScreenBtnStartScreen.visible']){
                        $('#fullscreen_video_before').prop( "checked", true );
                    }
                    if(flashvars['fullScreenBtnPlayScreen.visible']){
                        $('#fullscreen_video_during').prop( "checked", true );
                    }
                    if(flashvars['fullScreenBtnPauseScreen.visible']){
                        $('#fullscreen_video_paused').prop( "checked", true );
                    }
                    if(flashvars['fullScreenBtnEndScreen.visible']){
                        $('#fullscreen_video_end').prop( "checked", true );
                    }
                }
            } else {
                if ($('#smh-modal3 #fullscreen').is(':checked')) {
                    $('#smh-modal3 #fullscreen').click();
                }   
            }
                        
            if(ovplay){
                if (!$('#smh-modal3 #on_video_play').is(':checked')) {
                    $('#smh-modal3 #on_video_play').click();
                    if(flashvars['playBtnControllerScreen.visible']){
                        $('#ovplay_video_area').prop( "checked", true );
                    }
                    if(flashvars['onVideoPlayBtnStartScreen.visible']){
                        $('#ovplay_video_before').prop( "checked", true );
                    }
                    if(flashvars['onVideoPlayBtnPauseScreen.visible']){
                        $('#ovplay_video_paused').prop( "checked", true );
                    }
                }
            } else {
                if ($('#smh-modal3 #on_video_play').is(':checked')) {
                    $('#smh-modal3 #on_video_play').click();
                }   
            }
            
            if(playpause){
                if (!$('#smh-modal3 #play_pause').is(':checked')) {
                    $('#smh-modal3 #play_pause').click();
                }
            } else {
                if ($('#smh-modal3 #play_pause').is(':checked')) {
                    $('#smh-modal3 #play_pause').click();
                }
            }
            
            if(vol){
                if (!$('#smh-modal3 #volume').is(':checked')) {
                    $('#vol_select').val(flashvars['volumeBar.forceInitialValue']);
                    $('#smh-modal3 #volume').click();
                }
            } else {
                if ($('#smh-modal3 #volume').is(':checked')) {
                    $('#smh-modal3 #volume').click();
                }
            }
            
            if(flashvars['scrubberContainer.visible']){
                if (!$('#smh-modal3 #scrubber').is(':checked')) {
                    $('#smh-modal3 #scrubber').click();
                }
            } else {
                if ($('#smh-modal3 #scrubber').is(':checked')) {
                    $('#smh-modal3 #scrubber').click();
                }
            }
            
            if(flashvars['replayBtnEndScreen.visible']){
                if (!$('#smh-modal3 #replay').is(':checked')) {
                    $('#smh-modal3 #replay').click();
                }
            } else {
                if ($('#smh-modal3 #replay').is(':checked')) {
                    $('#smh-modal3 #replay').click();
                }
            }
            
            if(unmute){
                if (!$('#smh-modal3 #unmute').is(':checked')) {
                    $('#smh-modal3 #unmute').click();
                    if(unmute_video){
                        $('#unmute_video_area').prop( "checked", true );
                    }
                    if(flashvars['unmuteBtnStartScreen.visible']){
                        $('#unmute_video_before').prop( "checked", true );
                    }
                    if(flashvars['unmuteBtnPlayScreen.visible']){
                        $('#unmute_video_during').prop( "checked", true );
                    }
                    if(flashvars['unmuteBtnPauseScreen.visible']){
                        $('#unmute_video_paused').prop( "checked", true );
                    }
                    if(flashvars['unmuteBtnEndScreen.visible']){
                        $('#unmute_video_end').prop( "checked", true );
                    }
                }
            } else {
                if ($('#smh-modal3 #unmute').is(':checked')) {
                    $('#smh-modal3 #unmute').click();
                }
            }
            
            if(share){
                if (!$('#smh-modal3 #share').is(':checked')) {
                    $('#smh-modal3 #share').click();
                    if(share_video){
                        $('#share_video_area').prop( "checked", true );
                    }
                    if(flashvars['shareBtnControllerScreen.visible']){
                        $('#share_controls').prop( "checked", true );
                    }
                    if(flashvars['shareBtnStartScreen.visible']){
                        $('#share_video_before').prop( "checked", true );
                    }
                    if(flashvars['shareBtnPlayScreen.visible']){
                        $('#share_video_during').prop( "checked", true );
                    }
                    if(flashvars['shareBtnPauseScreen.visible']){
                        $('#share_video_paused').prop( "checked", true );
                    }
                    if(flashvars['shareBtnEndScreen.visible']){
                        $('#share_video_end').prop( "checked", true );
                    }
                }
            } else {
                if ($('#smh-modal3 #share').is(':checked')) {
                    $('#smh-modal3 #share').click();
                }   
            }
            
            if(download){
                if (!$('#smh-modal3 #download').is(':checked')) {
                    $('#smh-modal3 #download').click();
                    if(download_video){
                        $('#download_video_area').prop( "checked", true );
                    }
                    if(flashvars['downloadBtnControllerScreen.visible']){
                        $('#download_controls').prop( "checked", true );
                    }
                    if(flashvars['downloadBtnStartScreen.visible']){
                        $('#download_video_before').prop( "checked", true );
                    }
                    if(flashvars['downloadBtnPlayScreen.visible']){
                        $('#download_video_during').prop( "checked", true );
                    }
                    if(flashvars['downloadBtnPauseScreen.visible']){
                        $('#download_video_paused').prop( "checked", true );
                    }
                    if(flashvars['downloadBtnEndScreen.visible']){
                        $('#download_video_end').prop( "checked", true );
                    }
                }
            } else {
                if ($('#smh-modal3 #download').is(':checked')) {
                    $('#smh-modal3 #download').click();
                }   
            }
            
            if(thumbnail){
                if (!$('#smh-modal3 #thumbnail').is(':checked')) {
                    $('#smh-modal3 #thumbnail').click();
                    if(thumbnail_video){
                        $('#thumbnail_video_area').prop( "checked", true );
                    }
                    if(flashvars['captureThumbBtnControllerScreen.visible']){
                        $('#thumbnail_controls').prop( "checked", true );
                    }
                    if(flashvars['captureThumbBtnStartScreen.visible']){
                        $('#thumbnail_video_before').prop( "checked", true );
                    }
                    if(flashvars['captureThumbBtnPlayScreen.visible']){
                        $('#thumbnail_video_during').prop( "checked", true );
                    }
                    if(flashvars['captureThumbBtnPauseScreen.visible']){
                        $('#thumbnail_video_paused').prop( "checked", true );
                    }
                    if(flashvars['captureThumbBtnEndScreen.visible']){
                        $('#thumbnail_video_end').prop( "checked", true );
                    }
                }
            } else {
                if ($('#smh-modal3 #thumbnail').is(':checked')) {
                    $('#smh-modal3 #thumbnail').click();
                }   
            }
            
            if(flashvars['stars.visible']){
                if (!$('#smh-modal3 #stars').is(':checked')) {
                    $('#smh-modal3 #view-only').val(flashvars['stars.editable']);
                    $('#smh-modal3 #stars').click();
                }
            } else {
                if ($('#smh-modal3 #stars').is(':checked')) {
                    $('#smh-modal3 #stars').click();
                }   
            }
            
            if(capVideo){
                if (!$('#smh-modal3 #captions').is(':checked')) {
                    $('#smh-modal3 #cap-fontfam').val(capVideo_fontfamily);
                    if(capVideo_textglow){
                        $('#smh-modal3 #text-effect').val('glow');
                    }else{
                        $('#smh-modal3 #text-effect').val('background');
                    }
                    $('#smh-modal3 #captions').click();
                }
            } else {
                if ($('#smh-modal3 #captions').is(':checked')) {
                    $('#smh-modal3 #captions').click();
                }   
            }
            
            if(customButton1){
                if (!$('#smh-modal3 #customButton1').is(':checked')) {
                    $('#smh-modal3 #customButton1').click();
                    if(customButton1_video){
                        $('#customButton1_video_area').prop( "checked", true );
                    }
                    if(flashvars['custom1BtnControllerScreen.visible']){
                        $('#customButton1_controls').prop( "checked", true );
                    }
                    if(flashvars['custom1BtnStartScreen.visible']){
                        $('#customButton1_video_before').prop( "checked", true );
                    }
                    if(flashvars['custom1BtnPlayScreen.visible']){
                        $('#customButton1_video_during').prop( "checked", true );
                    }
                    if(flashvars['custom1BtnPauseScreen.visible']){
                        $('#customButton1_video_paused').prop( "checked", true );
                    }
                    if(flashvars['custom1BtnEndScreen.visible']){
                        $('#customButton1_video_end').prop( "checked", true );
                    }
                }
            } else {
                if ($('#smh-modal3 #customButton1').is(':checked')) {
                    $('#smh-modal3 #customButton1').click();
                }   
            }
            
            if(customButton2){
                if (!$('#smh-modal3 #customButton2').is(':checked')) {
                    $('#smh-modal3 #customButton2').click();
                    if(customButton2_video){
                        $('#customButton2_video_area').prop( "checked", true );
                    }
                    if(flashvars['custom2BtnControllerScreen.visible']){
                        $('#customButton2_controls').prop( "checked", true );
                    }
                    if(flashvars['custom2BtnStartScreen.visible']){
                        $('#customButton2_video_before').prop( "checked", true );
                    }
                    if(flashvars['custom2BtnPlayScreen.visible']){
                        $('#customButton2_video_during').prop( "checked", true );
                    }
                    if(flashvars['custom2BtnPauseScreen.visible']){
                        $('#customButton2_video_paused').prop( "checked", true );
                    }
                    if(flashvars['custom2BtnEndScreen.visible']){
                        $('#customButton2_video_end').prop( "checked", true );
                    }
                }
            } else {
                if ($('#smh-modal3 #customButton2').is(':checked')) {
                    $('#smh-modal3 #customButton2').click();
                }   
            }
            
            if(customButton3){
                if (!$('#smh-modal3 #customButton3').is(':checked')) {
                    $('#smh-modal3 #customButton3').click();
                    if(customButton3_video){
                        $('#customButton3_video_area').prop( "checked", true );
                    }
                    if(flashvars['custom3BtnControllerScreen.visible']){
                        $('#customButton3_controls').prop( "checked", true );
                    }
                    if(flashvars['custom3BtnStartScreen.visible']){
                        $('#customButton3_video_before').prop( "checked", true );
                    }
                    if(flashvars['custom3BtnPlayScreen.visible']){
                        $('#customButton3_video_during').prop( "checked", true );
                    }
                    if(flashvars['custom3BtnPauseScreen.visible']){
                        $('#customButton3_video_paused').prop( "checked", true );
                    }
                    if(flashvars['custom3BtnEndScreen.visible']){
                        $('#customButton3_video_end').prop( "checked", true );
                    }
                }
            } else {
                if ($('#smh-modal3 #customButton3').is(':checked')) {
                    $('#smh-modal3 #customButton3').click();
                }   
            }
            
            if(customButton4){
                if (!$('#smh-modal3 #customButton4').is(':checked')) {
                    $('#smh-modal3 #customButton4').click();
                    if(customButton4_video){
                        $('#customButton4_video_area').prop( "checked", true );
                    }
                    if(flashvars['custom4BtnControllerScreen.visible']){
                        $('#customButton4_controls').prop( "checked", true );
                    }
                    if(flashvars['custom4BtnStartScreen.visible']){
                        $('#customButton4_video_before').prop( "checked", true );
                    }
                    if(flashvars['custom4BtnPlayScreen.visible']){
                        $('#customButton4_video_during').prop( "checked", true );
                    }
                    if(flashvars['custom4BtnPauseScreen.visible']){
                        $('#customButton4_video_paused').prop( "checked", true );
                    }
                    if(flashvars['custom4BtnEndScreen.visible']){
                        $('#customButton4_video_end').prop( "checked", true );
                    }
                }
            } else {
                if ($('#smh-modal3 #customButton4').is(':checked')) {
                    $('#smh-modal3 #customButton4').click();
                }   
            }
            
            if(customButton5){
                if (!$('#smh-modal3 #customButton5').is(':checked')) {
                    $('#smh-modal3 #customButton5').click();
                    if(customButton5_video){
                        $('#customButton5_video_area').prop( "checked", true );
                    }
                    if(flashvars['custom5BtnControllerScreen.visible']){
                        $('#customButton5_controls').prop( "checked", true );
                    }
                    if(flashvars['custom5BtnStartScreen.visible']){
                        $('#customButton5_video_before').prop( "checked", true );
                    }
                    if(flashvars['custom5BtnPlayScreen.visible']){
                        $('#customButton5_video_during').prop( "checked", true );
                    }
                    if(flashvars['custom5BtnPauseScreen.visible']){
                        $('#customButton5_video_paused').prop( "checked", true );
                    }
                    if(flashvars['custom5BtnEndScreen.visible']){
                        $('#customButton5_video_end').prop( "checked", true );
                    }
                }
            } else {
                if ($('#smh-modal3 #customButton5').is(':checked')) {
                    $('#smh-modal3 #customButton5').click();
                }   
            }
            
            if(bumper || vast_bumper){
                if (!$('#smh-modal3 #bumper').is(':checked')) {
                    if(bumper_presequence != '' & bumper_presequence != null){
                        if(flashvars['bumper.preSequence'] == 1 && flashvars['bumper.preSequence'] == 0){
                            $('#bumper_sequence').val('before');
                        };
                        if(flashvars['bumper.preSequence'] == 0 && flashvars['bumper.preSequence'] == 1){
                            $('#bumper_sequence').val('after');
                        };
                        if(flashvars['bumper.preSequence'] == 1 && flashvars['bumper.preSequence'] == 1){
                            $('#bumper_sequence').val('both');
                        };
                    } else {
                        $('#bumper_sequence').val('before');
                    }
                    $('#smh-modal3 #bumper').click();
                }
            } else {
                if ($('#smh-modal3 #bumper').is(':checked')) {
                    $('#smh-modal3 #bumper').click();
                }   
            }
            
            if(vast){
                if (!$('#smh-modal3 #vast').is(':checked')) {
                    $('#notice_text_yes').prop( "checked", false );
                    $('#notice_text_no').prop( "checked", false );
                    $('#ad_skip_yes').prop( "checked", false );
                    $('#ad_skip_no').prop( "checked", false );
                    $('#preroll_yes').prop( "checked", false );
                    $('#preroll_no').prop( "checked", false );
                    $('#postroll_yes').prop( "checked", false );
                    $('#postroll_no').prop( "checked", false );
                    $('#overlay_yes').prop( "checked", false );
                    $('#overlay_no').prop( "checked", false );
                    if(flashvars['noticeMessage.visible']){
                        $('#notice_text_yes').prop( "checked", true );
                    } else {
                        $('#notice_text_no').prop( "checked", true );
                    }
                    if(flashvars['skipBtn.visible']){
                        $('#ad_skip_yes').prop( "checked", true );
                    } else {
                        $('#ad_skip_no').prop( "checked", true );
                    }
                    if(vast_preroll){
                        $('#preroll_yes').prop( "checked", true );
                    } else {
                        $('#preroll_no').prop( "checked", true );
                    }
                    if(vast_postroll){
                        $('#postroll_yes').prop( "checked", true );
                    } else {
                        $('#postroll_no').prop( "checked", true );
                    }
                    if(vast_overlay){
                        $('#overlay_yes').prop( "checked", true );
                    } else {
                        $('#overlay_no').prop( "checked", true );
                    }
                    $('#smh-modal3 #vast').click();
                }
            } else {
                if ($('#smh-modal3 #vast').is(':checked')) {
                    $('#smh-modal3 #vast').click();
                }   
            }
            
            $('#theme').val(skin_theme);
            $('#style_font').val(style_fontfamily);
            
            if(playlist_previous){
                if (!$('#smh-modal3 #previous_button').is(':checked')) {
                    $('#smh-modal3 #previous_button').click();
                }
            } else {
                if ($('#smh-modal3 #previous_button').is(':checked')) {
                    $('#smh-modal3 #previous_button').click();
                }   
            }
            if(playlist_next){
                if (!$('#smh-modal3 #next_button').is(':checked')) {
                    $('#smh-modal3 #next_button').click();
                }
            } else {
                if ($('#smh-modal3 #next_button').is(':checked')) {
                    $('#smh-modal3 #next_button').click();
                }   
            }
            if(playlist_thumbnail){
                if (!$('#smh-modal3 #plist_thumb').is(':checked')) {
                    $('#smh-modal3 #plist_thumb').click();
                }
            } else {
                if ($('#smh-modal3 #plist_thumb').is(':checked')) {
                    $('#smh-modal3 #plist_thumb').click();
                }   
            }
            if(playlist_name){
                if (!$('#smh-modal3 #plist_name').is(':checked')) {
                    $('#smh-modal3 #plist_name').click();
                }
            } else {
                if ($('#smh-modal3 #plist_name').is(':checked')) {
                    $('#smh-modal3 #plist_name').click();
                }   
            }
            if(playlist_description){
                if (!$('#smh-modal3 #plist_desc').is(':checked')) {
                    $('#smh-modal3 #plist_desc').click();
                }
            } else {
                if ($('#smh-modal3 #plist_desc').is(':checked')) {
                    $('#smh-modal3 #plist_desc').click();
                }   
            }
            if(playlist_duration){
                if (!$('#smh-modal3 #plist_duration').is(':checked')) {
                    $('#smh-modal3 #plist_duration').click();
                }
            } else {
                if ($('#smh-modal3 #plist_duration').is(':checked')) {
                    $('#smh-modal3 #plist_duration').click();
                }   
            }
            if(playlist_plays){
                if (!$('#smh-modal3 #plist_plays').is(':checked')) {
                    $('#smh-modal3 #plist_plays').click();
                }
            } else {
                if ($('#smh-modal3 #plist_plays').is(':checked')) {
                    $('#smh-modal3 #plist_plays').click();
                }   
            }
            if(playlist_rank){
                if (!$('#smh-modal3 #plist_rank').is(':checked')) {
                    $('#smh-modal3 #plist_rank').click();
                }
            } else {
                if ($('#smh-modal3 #plist_rank').is(':checked')) {
                    $('#smh-modal3 #plist_rank').click();
                }   
            }
            if(playlist_votes){
                if (!$('#smh-modal3 #plist_votes').is(':checked')) {
                    $('#smh-modal3 #plist_votes').click();
                }
            } else {
                if ($('#smh-modal3 #plist_votes').is(':checked')) {
                    $('#smh-modal3 #plist_votes').click();
                }   
            }
            if(playlist_tags){
                if (!$('#smh-modal3 #plist_tags').is(':checked')) {
                    $('#smh-modal3 #plist_tags').click();
                }
            } else {
                if ($('#smh-modal3 #plist_tags').is(':checked')) {
                    $('#smh-modal3 #plist_tags').click();
                }   
            }
            if(playlist_createddate){
                if (!$('#smh-modal3 #plist_createddat').is(':checked')) {
                    $('#smh-modal3 #plist_createddat').click();
                }
            } else {
                if ($('#smh-modal3 #plist_createddat').is(':checked')) {
                    $('#smh-modal3 #plist_createddat').click();
                }   
            }
            if(playlist_createdby){
                if (!$('#smh-modal3 #playlist_createdby').is(':checked')) {
                    $('#smh-modal3 #playlist_createdby').click();
                }
            } else {
                if ($('#smh-modal3 #playlist_createdby').is(':checked')) {
                    $('#smh-modal3 #playlist_createdby').click();
                }   
            }
        }
        
        $('#smh-modal3 #plist-entries').mCustomScrollbar({
            theme:"inset-dark",
            scrollButtons:{
                enable: true
            }
        });
        $('#smh-modal3 #entries-wrapper .panel-body').mCustomScrollbar({
            theme:"inset-dark",
            scrollButtons:{
                enable: true
            }
        });
        
        if(uiconf_id == 6709441){
            smhPlayers.loadPlists();
            if(edit){
                $.each(PLAYLIST_ENTRIES, function(index, value){
                    $('#plist-entries .mCSB_container').append(value);
                });
                $('#playlist-info #plist_num').html($('#plist-entries .mCSB_container div.entry-wrapper').length);
            }
            $('#smh-modal3').on('click','.basic-tab', function(){
                $('.player_preview').css('display','block');
                $('#multi-content-wrapper').css('display','none');
            });
            $('#smh-modal3').on('click','.display-tab', function(){
                $('.player_preview').css('display','block');
                $('#multi-content-wrapper').css('display','none');
            });
            $('#smh-modal3').on('click','.playlist-tab', function(){
                $('.player_preview').css('display','block');
                $('#multi-content-wrapper').css('display','none');
            });
            $('#smh-modal3').on('click','.ad-tab', function(){
                $('.player_preview').css('display','block');
                $('#multi-content-wrapper').css('display','none');
            });
            $('#smh-modal3').on('click','.custom-tab', function(){
                $('.player_preview').css('display','block');
                $('#multi-content-wrapper').css('display','none');
            });
            $('#smh-modal3').on('click','.content-tab', function(){
                $('.player_preview').css('display','none');
                $('#multi-content-wrapper').css('display','block');
            });          
        }
                
        $("#smh-modal3 input[name='water_padding']").TouchSpin({
            initval: flashvars['watermark.padding'],
            min: 0,
            max: 100000,
            step: 1,
            verticalbuttons: true
        });
        $("#smh-modal3 input[name='icon_width']").TouchSpin({
            initval: flashvars['mylogo.width'],
            min: 0,
            max: 100000,
            step: 1,
            verticalbuttons: true
        });
        $("#smh-modal3 input[name='icon_height']").TouchSpin({
            initval: flashvars['mylogo.height'],
            min: 0,
            max: 100000,
            step: 1,
            verticalbuttons: true
        });
        $("#smh-modal3 input[name='volume_level']").TouchSpin({
            initval: flashvars['volumeBar.initialValue'],
            min: 0,
            max: 1,
            step: 0.1,
            decimals: 1,
            verticalbuttons: true
        });
        $("#smh-modal3 input[name='cap_glowblur']").TouchSpin({
            initval: capVideo_glowblur,
            min: 0,
            max: 10000,
            step: 1,
            verticalbuttons: true
        });
        $("#smh-modal3 input[name='cap_fontsize']").TouchSpin({
            initval: capVideo_fontsize,
            min: 0,
            max: 10000,
            step: 1,
            verticalbuttons: true
        });
        $('.cap_textcolor').colorpicker({
            format:'hex'
        }).on('changeColor.colorpicker', function(event){
            capVideo_textcolor = event.color.toHex();          
        });
        $('.cap_glowcolor').colorpicker({
            format:'hex'
        }).on('changeColor.colorpicker', function(event){
            capVideo_glowcolor = event.color.toHex();          
        });
        $('.cap_backcolor').colorpicker({
            format:'hex'
        }).on('changeColor.colorpicker', function(event){
            capVideo_backcolor = event.color.toHex();          
        });        
        $('.style_icons_color').colorpicker({
            format:'hex'
        }).on('changeColor.colorpicker', function(event){
            style_icons_color = event.color.toHex(); 
            flashvars['timerControllerScreen1.color1'] = style_icons_color.replace("#","0x");
            flashvars['timerControllerScreen2.color1'] = style_icons_color.replace("#","0x");
            flashvars['volumeBar.color1'] = style_icons_color.replace("#","0x");
            flashvars['movieName.color1'] = style_icons_color.replace("#","0x");
            flashvars['skipBtn.color1'] = style_icons_color.replace("#","0x");
            flashvars['flavorComboControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['fullScreenBtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['playBtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['downloadBtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['shareBtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['captureThumbBtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['flagBtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['uploadBtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['custom1BtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['custom2BtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['custom3BtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['custom4BtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['custom5BtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
            flashvars['previousBtnControllerScreen.color1'] =  style_icons_color.replace("#","0x");
            flashvars['nextBtnControllerScreen.color1'] =  style_icons_color.replace("#","0x");
        });
        $('.style_mouse_color').colorpicker({
            format:'hex'
        }).on('changeColor.colorpicker', function(event){
            style_mouse_color = event.color.toHex();   
            flashvars['volumeBar.color2'] = style_mouse_color.replace("#","0x");
            flashvars['skipBtn.color2'] = style_mouse_color.replace("#","0x");
            flashvars['fullScreenBtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
            flashvars['playBtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
            flashvars['downloadBtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
            flashvars['shareBtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
            flashvars['captureThumbBtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
            flashvars['flagBtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
            flashvars['uploadBtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
            flashvars['custom1BtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
            flashvars['custom2BtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
            flashvars['custom3BtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
            flashvars['custom4BtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
            flashvars['custom5BtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
            flashvars['previousBtnControllerScreen.color2'] =  style_mouse_color.replace("#","0x");
            flashvars['nextBtnControllerScreen.color2'] =  style_mouse_color.replace("#","0x");
        });
        $('.style_onvideo_button_color').colorpicker({
            format:'hex'
        }).on('changeColor.colorpicker', function(event){
            style_onvideo_button_color = event.color.toHex();
            flashvars['custom1BtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom2BtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom3BtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom4BtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom5BtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['shareBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['downloadBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['fullScreenBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['onVideoPlayBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['editBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['captureThumbBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['flagBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['uploadBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['unmuteBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom1BtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom2BtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom3BtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom4BtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom5BtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['shareBtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['downloadBtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['fullScreenBtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['editBtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['captureThumbBtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['flagBtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['uploadBtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['unmuteBtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom1BtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom2BtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom3BtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom4BtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom5BtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['shareBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['downloadBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['fullScreenBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['onVideoPlayBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['editBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['captureThumbBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['flagBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['uploadBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['unmuteBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom1BtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom2BtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom3BtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom4BtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['custom5BtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['shareBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['downloadBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['fullScreenBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['editBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['captureThumbBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['flagBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['uploadBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['unmuteBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
            flashvars['replayBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");            
        });
        $('.style_onvideo_mouse_color').colorpicker({
            format:'hex'
        }).on('changeColor.colorpicker', function(event){
            style_onvideo_mouse_color = event.color.toHex(); 
            flashvars['custom1BtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom2BtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom3BtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom4BtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom5BtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['shareBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['downloadBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['fullScreenBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['onVideoPlayBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['editBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['captureThumbBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['flagBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['uploadBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['unmuteBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom1BtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom2BtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom3BtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom4BtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom5BtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['shareBtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['downloadBtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['fullScreenBtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['editBtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['captureThumbBtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['flagBtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['uploadBtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['unmuteBtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom1BtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom2BtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom3BtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom4BtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom5BtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['shareBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['downloadBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['fullScreenBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['onVideoPlayBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['editBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['captureThumbBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['flagBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['uploadBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['unmuteBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom1BtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom2BtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom3BtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom4BtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['custom5BtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['shareBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['downloadBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['fullScreenBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['editBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['captureThumbBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['flagBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['uploadBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['unmuteBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
            flashvars['replayBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        });
        $('.style_onvideo_icons_color').colorpicker({
            format:'hex'
        }).on('changeColor.colorpicker', function(event){
            style_onvideo_icons_color = event.color.toHex(); 
            flashvars['noticeMessage.color1'] = style_onvideo_icons_color.replace("#","0x"); 
            flashvars['noticeMessage.color2'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom1BtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom2BtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom3BtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom4BtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom5BtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['shareBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['downloadBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['fullScreenBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['onVideoPlayBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['editBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['captureThumbBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['flagBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['uploadBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['unmuteBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom1BtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom2BtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom3BtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom4BtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom5BtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['shareBtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['downloadBtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['fullScreenBtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['editBtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['captureThumbBtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['flagBtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['uploadBtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['unmuteBtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom1BtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom2BtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom3BtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom4BtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom5BtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['shareBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['downloadBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['fullScreenBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['onVideoPlayBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['editBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['captureThumbBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['flagBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['uploadBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['unmuteBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom1BtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom2BtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom3BtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom4BtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['custom5BtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['shareBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['downloadBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['fullScreenBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['editBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['captureThumbBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['flagBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['uploadBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['unmuteBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['replayBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
            flashvars['irLinkIrScreen.color1'] =  style_onvideo_icons_color.replace("#","0x");
            flashvars['irDescriptionIrScreen.color1'] =  style_onvideo_icons_color.replace("#","0x");
            flashvars['irPlaysIrScreen.color1'] =  style_onvideo_icons_color.replace("#","0x");
            flashvars['irRankIrScreen.color1'] =  style_onvideo_icons_color.replace("#","0x");
            flashvars['irVotesIrScreen.color1'] =  style_onvideo_icons_color.replace("#","0x");
            flashvars['irDurationIrScreen.color1'] =  style_onvideo_icons_color.replace("#","0x");
            flashvars['irTagsIrScreen.color1'] =  style_onvideo_icons_color.replace("#","0x");
            flashvars['irAdminTagsIrScreen.color1'] =  style_onvideo_icons_color.replace("#","0x");
            flashvars['irCreatedAtIrScreen.color1'] =  style_onvideo_icons_color.replace("#","0x");
            flashvars['irCreatedByIrScreen.color1'] =  style_onvideo_icons_color.replace("#","0x"); 
            flashvars['tabBar.color1'] = style_onvideo_icons_color.replace("#","0x");
        });
        
        $('.collapse').on('shown.bs.collapse', function(){
            $(this).parent().find(".fa-caret-right").removeClass("fa-caret-right").addClass("fa-caret-down");
        }).on('hidden.bs.collapse', function(){
            $(this).parent().find(".fa-caret-down").removeClass("fa-caret-down").addClass("fa-caret-right");
        });
        
        $('.player-tab .options').mCustomScrollbar({
            theme:"inset-dark",
            scrollButtons:{
                enable: true
            }
        });
        smhPlayers.renderPlayer();
    },
    //Load playlists
    loadPlists:function(){
        var LISTING_RESULTS=new Array();
        var cb = function (success, results){
            if(!success)
                alert(results);

            if(results.code && results.message){
                alert(results.message);
                return;
            }
            
            var myData = results['objects'];
            var i=0;
            $.each(myData, function(key, value) {                   
                var theDate = new Date(value['createdAt'] * 1000);                 
                var newDatetime = theDate.toString("MM/dd/yyyy hh:mm tt");
                    
                var playlistType;
                if(value['playlistType'] == 10){
                    playlistType = 'Rule Based';
                } else if (value['playlistType'] == 3){
                    playlistType = 'Manual'; 
                }   
                
                var entry_container = '<div class="entry-wrapper" data-entryid="' + value['id'] + '" data-name="' + value['name'] + '">'+
                '<div class="entry-details">'+
                '<div class="entry-name">'+
                '<div>' + value['name'] + '</div>'+
                '</div>'+
                '<div class="entry-subdetails">'+
                '<span style="width: 85px; display: inline-block;">Playlist ID:</span><span>' + value['id'] +'</span>'+
                '</div>'+
                '<div class="entry-subdetails">'+
                '<span style="width: 85px; display: inline-block;">Created on:</span><span>' + newDatetime + '</span>'+
                '</div>'+
                '<div class="entry-subdetails">'+
                '<span style="width: 85px; display: inline-block;">Type:</span><span>' + playlistType + '</span>'+
                '</div>'+
                '</div>'+
                '<div class="tools" onclick="smhPlayers.removeDND(this);">'+
                '<i class="fa fa-trash-o"></i>'+
                '</div>'+
                '<div class="clear"></div>'+
                '</div>';
                
                LISTING_RESULTS[i] = new Array(entry_container);
                i++;		
            });
            
            $('#smh-modal3 #plist-table').empty();
            $('#smh-modal3 #plist-table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="plist-data"></table>');
            plistTable = $('#smh-modal3 #plist-data').DataTable({
                "dom": 'R<"H"lfr>t<"F"ip>',
                "order": [],
                "ordering": false,
                "jQueryUI": false,
                "processing": true,
                "serverSide": false,
                "autoWidth": false,
                "pagingType": "bootstrap",
                "pageLength": 10,
                "searching": false,
                "info": false,            
                "lengthChange": false,
                "scrollCollapse": true,
                "scrollY": "511px",
                "data": LISTING_RESULTS,
                "language": {
                    "zeroRecords": "No Playlists Found"
                },
                "columns": [
                {
                    "title": "<span style='float: left;'><div class='data-break'>Playlists</div></span>",
                    "width": "80px"
                }
                ],           
                "drawCallback": function( oSettings ) {
                    smhMain.fcmcAddRows(this, 1, 10);     
                    $('#smh-modal3 #plist-data .entry-wrapper').draggable({
                        appendTo: '#plist-entries',
                        containment: 'window',
                        scroll: false,
                        helper: 'clone',
                        zIndex: 1000,
                        connectToSortable: "#plist-entries .mCSB_container",
                        cursorAt: {
                            left: 200,
                            top: 85
                        }
                    }); 
                    $('#smh-modal3 #plist-entries').droppable({
                        accept: '#plist-data .entry-wrapper',
                        drop: function (event, ui) {
                            $('#plist-entries .mCSB_container').append($(ui.helper).clone());
                            $('#plist-entries .entry-wrapper').css('position', '');
                            $('#plist-entries .entry-wrapper').css('top', '');
                            $('#plist-entries .entry-wrapper').css('left', '');
                            $('#plist-entries .entry-wrapper').addClass('hover');
                            $('#playlist-info #plist_num').html($('#plist-entries .mCSB_container div.entry-wrapper').length);
                        }
                    });
                    $("#smh-modal3 #plist-entries .mCSB_container").sortable({
                        placeholder: "plist-hightlight",
                        helper: 'clone',
                        start: function( e, ui){
                            $('#plist-entries .entry-wrapper').addClass('hover');                        
                        },
                        stop: function( e, ui){
                            $('#playlist-info #plist_num').html($('#plist-entries .mCSB_container div.entry-wrapper').length);
                        }
                    });
                }                                
            });
            $('#smh-modal3 #plist-table .dataTables_scrollBody').mCustomScrollbar({
                theme:"inset-dark",
                scrollButtons:{
                    enable: true
                }
            });           
        };

        
        var filter = new KalturaPlaylistFilter();
        filter.orderBy = "-createdAt";
        var pager;
        client.playlist.listAction(cb, filter, pager);
    },
    //Removes Playlist Item
    removeDND:function(div){
        $(div).parent("div").remove();
        $('#playlist-info #plist_num').html($('#plist-entries .mCSB_container div.entry-wrapper').length);
    },
    //Ceates Player
    createPlayer:function(){        
        var tags = '';
        if(uiconf_id == '6709439' || uiconf_id == '6709440' || uiconf_id == '6709441'){
            tags += 'kdp3,playlist';                
        } else {
            tags += 'kdp3,player';
        }
        
        var player_name = $('#smh-modal3 #player_name').val();    
        if(player_name == null || player_name == ''){
            smhPlayers.displayError();
        } else {
            var confFileFeatures = smhPlayers.studioFeatures(uiconf_id);
            var confFile = smhPlayers.createConfig(uiconf_id,player_name);
        
            var defaults = {
                animatePadding: 60,
                ApiUrl:	"/api_v3/index.php?",
                sessSrv: 	"uiconf",
                sessAct:	"add",
                format:	"1"
            };
             
            var options = $.extend(defaults, options);
            var o =options;
            var sessData = {
                ks: sessInfo.ks,
                'uiConf:objectType':'KalturaUiConf',
                'uiConf:width': flashvars['width'],
                'uiConf:height': flashvars['height'],
                'uiConf:tags': tags,
                ignoreNull:1,
                'uiConf:swfUrl': "/flash/kdp3/v3.9.9/kdp3.swf",
                'uiConf:objType':8,
                'uiConf:creationMode':2,
                'uiConf:name':player_name,
                clientTag:'kmc:v4.2.14.9',
                'uiConf:confFileFeatures':confFileFeatures,
                'uiConf:confFile':confFile,
                'uiConf:confVars':'kalturaLogo.visible=false&kalturaLogo.includeInLayout=false'            
            };
            var reqObj = {
                service: o.sessSrv, 
                action: o.sessAct, 
                format: o.format
        
            };
            var reqUrl = o.ApiUrl + $.param(reqObj);
        
            $.ajax({
                cache:      false,
                url:        reqUrl,
                type:       'POST',
                async:      false,
                data:       sessData,
                dataType:   'json',
                beforeSend:function(){
                    $('#create-player').attr('disabled','');
                    $('#smh-modal3 #loading img').css('display','inline-block'); 
                },
                success:function(data) {
                    $('#smh-modal3 #loading').empty();
                    $('#smh-modal3 #pass-result').html('<span class="label label-success">Successfully Created!</span>');
                    setTimeout(function(){
                        $('#smh-modal3 #pass-result').empty();
                        $('#smh-modal3').modal('hide');
                    },3000); 
                    smhPlayers.getPlayers();
                }
            });
        }
    },
    //Update Player
    updatePlayer:function(){
        var tags = '';
        if(uiconf_id == '6709439' || uiconf_id == '6709440' || uiconf_id == '6709441'){
            tags += 'kdp3,playlist';                
        } else {
            tags += 'kdp3,player';
        }
        
        var player_name = $('#smh-modal3 #player_name').val();    
        if(player_name == null || player_name == ''){
            smhPlayers.displayError();
        } else {
            var confFileFeatures = smhPlayers.studioFeatures(uiconf_id);
            var confFile = smhPlayers.createConfig(uiconf_id,player_name);
        
            var defaults = {
                animatePadding: 60,
                ApiUrl:	"/api_v3/index.php?",
                sessSrv: 	"uiconf",
                sessAct:	"update",
                format:	"1"
            };
             
            var options = $.extend(defaults, options);
            var o =options;
            var sessData = {
                ks: sessInfo.ks,
                id:player_id,
                'uiConf:objectType':'KalturaUiConf',
                'uiConf:width': flashvars['width'],
                'uiConf:height': flashvars['height'],
                'uiConf:tags': tags,
                ignoreNull:1,
                'uiConf:swfUrl': "/flash/kdp3/v3.9.9/kdp3.swf",
                'uiConf:objType':8,
                'uiConf:creationMode':2,
                'uiConf:name':player_name,
                clientTag:'kmc:v4.2.14.9',
                'uiConf:confFileFeatures':confFileFeatures,
                'uiConf:confFile':confFile,
                'uiConf:confVars':'kalturaLogo.visible=false&kalturaLogo.includeInLayout=false'            
            };
            var reqObj = {
                service: o.sessSrv, 
                action: o.sessAct, 
                format: o.format
        
            };
            var reqUrl = o.ApiUrl + $.param(reqObj);
        
            $.ajax({
                cache:      false,
                url:        reqUrl,
                type:       'POST',
                async:      false,
                data:       sessData,
                dataType:   'json',
                beforeSend:function(){
                    $('.update-player').attr('disabled','');
                    $('#smh-modal3 #loading img').css('display','inline-block'); 
                },
                success:function(data) {
                    $('#smh-modal3 #loading').empty();
                    $('#smh-modal3 #pass-result').html('<span class="label label-success">Successfully Updated!</span>');
                    setTimeout(function(){
                        $('#smh-modal3 #pass-result').empty();
                        $('#smh-modal3').modal('hide');
                    },3000); 
                    smhPlayers.getPlayers();
                }
            });
        }
    },
    //Display player errors
    displayError:function(){        
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width','540px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        }); 
        
        $('#smh-modal2').css('z-index','2000');
        $('#smh-modal3').css('z-index','2');
        
        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Error</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = "<div style='margin-left: auto; margin-right: auto; text-align: center; height: 50px; margin-top: 20px;'>You must enter a player name</div>";        
        $('#smh-modal2 .modal-body').html(content);
        
        footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button>';
        $('#smh-modal2 .modal-footer').html(footer);
    },
    //Create Studio Features File
    studioFeatures:function(uiconf_id){
        var theme1 = '';
        var theme2 = '';
        var skin_theme = $('#smh-modal3 #theme').val();
        var download = $('#smh-modal3 #download').is(':checked')? true : false;
        if(download){
            var download_video = $('#smh-modal3 #dwnld_video_area').is(':checked')? true : false;
            var download_controls = $('#smh-modal3 #dwnld_controls').is(':checked')? true : false;
            var download_before = $('#smh-modal3 #dwnld_video_before').is(':checked')? true : false;
            var download_during = $('#smh-modal3 #dwnld_video_during').is(':checked')? true : false;
            var download_paused = $('#smh-modal3 #dwnld_video_paused').is(':checked')? true : false;
            var download_end = $('#smh-modal3 #dwnld_video_end').is(':checked')? true : false;
        } else {
            var download_video = false;
            var download_controls = false;
            var download_before = false;
            var download_during = false;
            var download_paused = false;
            var download_end = false; 
        }
        var thumbnail = $('#smh-modal3 #thumbnail').is(':checked')? true : false;
        if(thumbnail){
            var thumbnail_video = $('#smh-modal3 #thumbnail_video_area').is(':checked')? true : false;
            var thumbnail_controls = $('#smh-modal3 #thumbnail_controls').is(':checked')? true : false;
            var thumbnail_before = $('#smh-modal3 #thumbnail_video_before').is(':checked')? true : false;
            var thumbnail_during = $('#smh-modal3 #thumbnail_video_during').is(':checked')? true : false;
            var thumbnail_paused = $('#smh-modal3 #thumbnail_video_paused').is(':checked')? true : false;
            var thumbnail_end = $('#smh-modal3 #thumbnail_video_end').is(':checked')? true : false;
        } else {
            var thumbnail_video = false;
            var thumbnail_controls = false;
            var thumbnail_before = false;
            var thumbnail_during = false;
            var thumbnail_paused = false;
            var thumbnail_end = false;
        }
        var vast = $('#smh-modal3 #vast').is(':checked')? true : false;
        if(vast){
            var vast_preroll = $('#smh-modal3 #preroll_yes').is(':checked')? true : false;
            var vast_overlay = $('#smh-modal3 #overlay_yes').is(':checked')? true : false;
            var vast_postroll = $('#smh-modal3 #postroll_yes').is(':checked')? true : false;
            var vast_allowskip = $('#smh-modal3 #ad_skip_yes').is(':checked')? true : false;
            var vast_noticetext = $('#smh-modal3 #notice_text_yes').is(':checked')? true : false;
        } else {
            var vast_preroll = false;
            var vast_overlay = false;
            var vast_postroll = false;
            var vast_allowskip = false;
            var vast_noticetext = false; 
        }

        var title = $('#smh-modal3 #title_text').is(':checked')? true : false;
        var watermark = $('#smh-modal3 #watermark').is(':checked')? true : false;
        var bumper = $('#smh-modal3 #bumper').is(':checked')? true : false;
        var share = $('#smh-modal3 #share').is(':checked')? true : false;
        if(share){
            var share_video = $('#smh-modal3 #share_video_area').is(':checked')? true : false; 
            var share_controls = $('#smh-modal3 #share_controls').is(':checked')? true : false;
            var share_before = $('#smh-modal3 #share_video_before').is(':checked')? true : false;
            var share_during = $('#smh-modal3 #share_video_during').is(':checked')? true : false;
            var share_paused = $('#smh-modal3 #share_video_paused').is(':checked')? true : false;
            var share_end = $('#smh-modal3 #share_video_end').is(':checked')? true : false;
        } else {
            var share_video = false; 
            var share_controls = false;
            var share_before = false;
            var share_during = false;
            var share_paused = false;
            var share_end = false;
        }
        var playpause = $('#smh-modal3 #play_pause').is(':checked')? true : false; 
        var scrub = $('#smh-modal3 #scrubber').is(':checked')? true : false;
        var leftplay = $('#smh-modal3 #left-play-counter').is(':checked')? true : false;
        var rightplay = $('#smh-modal3 #right-play-counter').is(':checked')? true : false;
        var vol = $('#smh-modal3 #volume').is(':checked')? true : false;
        var flavor = $('#smh-modal3 #flavor_selector').is(':checked')? true : false;
        var fullscreen = $('#smh-modal3 #fullscreen').is(':checked')? true : false;
        if(fullscreen){
            var fullscreen_video = $('#smh-modal3 #fullscreen_video_area').is(':checked')? true : false;
            var fullscreen_controls = $('#smh-modal3 #fullscreen_controls').is(':checked')? true : false;
            var fullscreen_before = $('#smh-modal3 #fullscreen_video_before').is(':checked')? true : false;
            var fullscreen_during = $('#smh-modal3 #fullscreen_video_during').is(':checked')? true : false;
            var fullscreen_paused = $('#smh-modal3 #fullscreen_video_paused').is(':checked')? true : false;
            var fullscreen_end = $('#smh-modal3 #fullscreen_video_end').is(':checked')? true : false;  
        } else {  
            var fullscreen_video = false;
            var fullscreen_controls = false;
            var fullscreen_before = false;
            var fullscreen_during = false;
            var fullscreen_paused = false;
            var fullscreen_end = false;
        }
 
        var customButton1 = $('#smh-modal3 #customButton1').is(':checked')? true : false;
        if(customButton1){
            var customButton1_video = $('#smh-modal3 #customButton1_video_area').is(':checked')? true : false;
            var customButton1_controls = $('#smh-modal3 #customButton1_controls').is(':checked')? true : false;
            var customButton1_before = $('#smh-modal3 #customButton1_video_before').is(':checked')? true : false;
            var customButton1_during = $('#smh-modal3 #customButton1_video_during').is(':checked')? true : false;
            var customButton1_paused = $('#smh-modal3 #customButton1_video_paused').is(':checked')? true : false;
            var customButton1_end = $('#smh-modal3 #customButton1_video_end').is(':checked')? true : false;
        } else {
            var customButton1_video = false;
            var customButton1_controls = false;
            var customButton1_before = false;
            var customButton1_during = false;
            var customButton1_paused = false;
            var customButton1_end = false;
        }
        
        var customButton2 = $('#smh-modal3 #customButton2').is(':checked')? true : false;
        if(customButton2){
            var customButton2_video = $('#smh-modal3 #customButton2_video_area').is(':checked')? true : false;
            var customButton2_controls = $('#smh-modal3 #customButton2_controls').is(':checked')? true : false;
            var customButton2_before = $('#smh-modal3 #customButton2_video_before').is(':checked')? true : false;
            var customButton2_during = $('#smh-modal3 #customButton2_video_during').is(':checked')? true : false;
            var customButton2_paused = $('#smh-modal3 #customButton2_video_paused').is(':checked')? true : false;
            var customButton2_end = $('#smh-modal3 #customButton2_video_end').is(':checked')? true : false;
        } else {
            var customButton2_video = false;
            var customButton2_controls = false;
            var customButton2_before = false;
            var customButton2_during = false;
            var customButton2_paused = false;
            var customButton2_end = false;
        }
        
        var customButton3 = $('#smh-modal3 #customButton3').is(':checked')? true : false;
        if(customButton3){
            var customButton3_video = $('#smh-modal3 #customButton3_video_area').is(':checked')? true : false;
            var customButton3_controls = $('#smh-modal3 #customButton3_controls').is(':checked')? true : false;
            var customButton3_before = $('#smh-modal3 #customButton3_video_before').is(':checked')? true : false;
            var customButton3_during = $('#smh-modal3 #customButton3_video_during').is(':checked')? true : false;
            var customButton3_paused = $('#smh-modal3 #customButton3_video_paused').is(':checked')? true : false;
            var customButton3_end = $('#smh-modal3 #customButton3_video_end').is(':checked')? true : false;
        } else {
            var customButton3_video = false;
            var customButton3_controls = false;
            var customButton3_before = false;
            var customButton3_during = false;
            var customButton3_paused = false;
            var customButton3_end = false;
        }
        
        var customButton4 = $('#smh-modal3 #customButton4').is(':checked')? true : false;
        if(customButton4){
            var customButton4_video = $('#smh-modal3 #customButton4_video_area').is(':checked')? true : false;
            var customButton4_controls = $('#smh-modal3 #customButton4_controls').is(':checked')? true : false;
            var customButton4_before = $('#smh-modal3 #customButton4_video_before').is(':checked')? true : false;
            var customButton4_during = $('#smh-modal3 #customButton4_video_during').is(':checked')? true : false;
            var customButton4_paused = $('#smh-modal3 #customButton4_video_paused').is(':checked')? true : false;
            var customButton4_end = $('#smh-modal3 #customButton4_video_end').is(':checked')? true : false;
        } else {
            var customButton4_video = false;
            var customButton4_controls = false;
            var customButton4_before = false;
            var customButton4_during = false;
            var customButton4_paused = false;
            var customButton4_end = false;
        }
        
        var customButton5 = $('#smh-modal3 #customButton5').is(':checked')? true : false;
        if(customButton5){
            var customButton5_video = $('#smh-modal3 #customButton5_video_area').is(':checked')? true : false;
            var customButton5_controls = $('#smh-modal3 #customButton5_controls').is(':checked')? true : false;
            var customButton5_before = $('#smh-modal3 #customButton5_video_before').is(':checked')? true : false;
            var customButton5_during = $('#smh-modal3 #customButton5_video_during').is(':checked')? true : false;
            var customButton5_paused = $('#smh-modal3 #customButton5_video_paused').is(':checked')? true : false;
            var customButton5_end = $('#smh-modal3 #customButton5_video_end').is(':checked')? true : false;
        } else {
            var customButton5_video = false;
            var customButton5_controls = false;
            var customButton5_before = false;
            var customButton5_during = false;
            var customButton5_paused = false;
            var customButton5_end = false;
        }
        
        var ovplay = $('#smh-modal3 #on_video_play').is(':checked')? true : false;
        if(ovplay){
            var ovplay_video = $('#smh-modal3 #ovplay_video_area').is(':checked')? true : false;
            var ovplay_before = $('#smh-modal3 #ovplay_video_before').is(':checked')? true : false;
            var ovplay_paused = $('#smh-modal3 #ovplay_video_paused').is(':checked')? true : false;
        } else {
            var ovplay_video = false;
            var ovplay_before = false;
            var ovplay_paused = false;
        }

        var unmute = $('#smh-modal3 #unmute').is(':checked')? true : false;
        if(unmute){
            var unmute_video = $('#smh-modal3 #unmute_video_area').is(':checked')? true : false;
            var unmute_before = $('#smh-modal3 #unmute_video_before').is(':checked')? true : false;
            var unmute_during = $('#smh-modal3 #unmute_video_during').is(':checked')? true : false;
            var unmute_paused = $('#smh-modal3 #unmute_video_paused').is(':checked')? true : false;
            var unmute_end = $('#smh-modal3 #unmute_video_end').is(':checked')? true : false;
        } else {
            var unmute_video = false;
            var unmute_before = false;
            var unmute_during = false;
            var unmute_paused = false;
            var unmute_end = false;
        }

        var replay = $('#smh-modal3 #replay').is(':checked')? true : false;
        var user_icon = $('#smh-modal3 #logo-icon').is(':checked')? true : false;
        var user_icon_width = $('#smh-modal3 #icon-width').val();
        var user_icon_height = $('#smh-modal3 #icon-height').val();
        var user_icon_url = $('#smh-modal3 #icon_url').val();
        var user_icon_clickurl = $('#smh-modal3 #icon_landing').val();
        var origMedia = $('#smh-modal3 #video_ratio_orig').is(':checked')? true : false;
        var playOnload = $('#smh-modal3 #auto_play').is(':checked')? true : false;
        var playerMute = $('#smh-modal3 #start_muted').is(':checked')? true : false;
        var ads = ($('#smh-modal3 #bumper').is(':checked') || $('#smh-modal3 #vast').is(':checked'))? true : false;
        var stars = $('#smh-modal3 #stars').is(':checked')? true : false;
        var flashElement = '';
        var htmlCompanion = '';
    
        if (skin_theme == 'b'){
            theme1 = 'Dark';
            theme2 = 'dark';
        } else {
            theme1 = 'Light';
            theme2 = 'light';
        }
        
        var multi_feature = '';
        if(uiconf_id == '6709441'){
            var plist_arr = [];
            $('#plist-entries .mCSB_container div.entry-wrapper').each(function() {
                plist_arr.push({
                    'id':$(this).attr("data-entryid"),
                    'name':$(this).attr("data-name")
                });            
            });
            var i=0;
            $.each(plist_arr, function(key, value) {
                multi_feature += '<var key="kpl'+i+'EntryId" value="'+value.id+'"/>';
                multi_feature += '<var key="playlistAPI.kpl'+i+'Url" value="http%3A%2F%2Fmediaplatform.streamingmediahosting.com%2Findex.php%2Fpartnerservices2%2Fexecuteplaylist%3Fplaylist_id%3D'+value.id+'%26partner_id%3D'+sessInfo.pid+'%26subp_id%3D'+sessInfo.pid+'00%26format%3D8%26ks%3D%7Bks%7D"/>';
                multi_feature += '<var key="playlistAPI.kpl'+i+'Name" value="'+value.name+'"/>';
                i++;
            });
        }
        
        var custom_icon = '';
        if(user_icon){
            custom_icon += '<var key="mylogo.plugin" value="true"/>';
            custom_icon += '<var key="mylogo.watermarkPath" value="'+user_icon_url+'"/>';
            custom_icon += '<var key="mylogo.watermarkClickPath" value="'+user_icon_clickurl+'"/>';
            custom_icon += '<var key="mylogo.width" value="'+user_icon_width+'"/>';
            custom_icon += '<var key="mylogo.height" value="'+user_icon_height+'"/>';
        } else {
            custom_icon += '<var key="mylogo.plugin" value="false"/>';
        }
        
        var playistFeatures1 = '';
        var playistFeatures2 = '';
        var elements = '<element elementid="Controls" relativeTo="controlsHolder" position="lastChild"/>'+
        '<element elementid="Custom" relativeTo="" position=""/>';
        if(uiconf_id == '6709439' || uiconf_id == '6709440' || uiconf_id == '6709441'){
            elements = '<element elementid="Controls" relativeTo="controlsHolder" position="lastChild"/>'+
            '<element elementid="Playlist" relativeTo="playlistHolder" position="lastChild"/>'+
            '<element elementid="Custom" relativeTo="" position=""/>';
        
            playistFeatures1 = '<feature k_fullName="previousBtn" k_value="'+playlist_previous+'"/>'+
            '<feature k_fullName="previousBtn.ControllerScreen" k_value="true"/>'+
            '<feature k_fullName="previousBtn.Display" k_value="buttonIconControllerArea"/>'+
            '<feature k_fullName="previousBtn.Label" k_value="Previous"/>'+
            '<feature k_fullName="previousBtn.Tooltip" k_value="'+playlist_previous_tooltip+'"/>'+
            '<feature k_fullName="nextBtn" k_value="'+playlist_next+'"/>'+
            '<feature k_fullName="nextBtn.ControllerScreen" k_value="true"/>'+
            '<feature k_fullName="nextBtn.Display" k_value="buttonIconControllerArea"/>'+
            '<feature k_fullName="nextBtn.Label" k_value="Next"/>'+
            '<feature k_fullName="nextBtn.Tooltip" k_value="'+playlist_next_tooltip+'"/>';
        
            playistFeatures2 = '<feature k_fullName="irImage" k_value="'+playlist_thumbnail+'"/>'+
            '<feature k_fullName="irImage.irScreen" k_value="true"/>'+
            '<feature k_fullName="irImage.source" k_value="{this.thumbnailUrl}"/>'+
            '<feature k_fullName="irLink" k_value="'+playlist_name+'"/>'+
            '<feature k_fullName="irLink.irScreen" k_value="true"/>'+
            '<feature k_fullName="irLink.name" k_value="{this.name}"/>'+
            '<feature k_fullName="irLink.prefix" k_value=""/>'+
            '<feature k_fullName="irDescription" k_value="'+playlist_description+'"/>'+
            '<feature k_fullName="irDescription.irScreen" k_value="true"/>'+
            '<feature k_fullName="irDescription.Description" k_value="{this.description}"/>'+
            '<feature k_fullName="irDescription.prefix" k_value=""/>'+
            '<feature k_fullName="irDuration" k_value="'+playlist_duration+'"/>'+
            '<feature k_fullName="irDuration.irScreen" k_value="true"/>'+
            '<feature k_fullName="irDuration.duration" k_value="{formatDate(this.duration, \'NN:SS\')}"/>'+
            '<feature k_fullName="irDuration.prefix" k_value=""/>'+
            '<feature k_fullName="irPlays" k_value="'+playlist_plays+'"/>'+
            '<feature k_fullName="irPlays.irScreen" k_value="true"/>'+
            '<feature k_fullName="irPlays.playscountData" k_value="Plays: {this.plays}"/>'+
            '<feature k_fullName="irPlays.prefix" k_value=""/>'+
            '<feature k_fullName="irRank" k_value="'+playlist_rank+'"/>'+
            '<feature k_fullName="irRank.irScreen" k_value="true"/>'+
            '<feature k_fullName="irRank.rank" k_value="Rank: {this.rank}"/>'+
            '<feature k_fullName="irRank.prefix" k_value=""/>'+
            '<feature k_fullName="irVotes" k_value="'+playlist_votes+'"/>'+
            '<feature k_fullName="irVotes.irScreen" k_value="true"/>'+
            '<feature k_fullName="irVotes.votes" k_value=" ({this.votes} votes)"/>'+
            '<feature k_fullName="irVotes.prefix" k_value=""/>'+
            '<feature k_fullName="irTags" k_value="'+playlist_tags+'"/>'+
            '<feature k_fullName="irTags.irScreen" k_value="true"/>'+
            '<feature k_fullName="irTags.tags" k_value="Tags: {this.tags}"/>'+
            '<feature k_fullName="irTags.prefix" k_value=""/>'+
            '<feature k_fullName="irAdminTags" k_value="'+playlist_admintags+'"/>'+
            '<feature k_fullName="irAdminTags.irScreen" k_value="true"/>'+
            '<feature k_fullName="irAdminTags.adminTags" k_value="Categories: {this.adminTags}"/>'+
            '<feature k_fullName="irAdminTags.prefix" k_value=""/>'+
            '<feature k_fullName="irCreatedAt" k_value="'+playlist_createddate+'"/>'+
            '<feature k_fullName="irCreatedAt.irScreen" k_value="true"/>'+
            '<feature k_fullName="irCreatedAt.createDate" k_value="Created at: {formatDate(this.createdAt, \'DD/MM/YYY\')}"/>'+
            '<feature k_fullName="irCreatedAt.prefix" k_value=""/>'+
            '<feature k_fullName="irCreatedBy" k_value="'+playlist_createdby+'"/>'+
            '<feature k_fullName="irCreatedBy.irScreen" k_value="true"/>'+
            '<feature k_fullName="irCreatedBy.irCreatedBy" k_value="Created by: {this.userScreenName}"/>'+
            '<feature k_fullName="irCreatedBy.prefix" k_value=""/>';
        }

        var studioConfig = '<snapshot fullPlayerId="'+uiconf_id+'">'+
        '<featuresData>'+
        '<feature k_fullName="TopTitleScreen" k_value="'+title+'"/>'+
        '<feature k_fullName="watermark" k_value="'+watermark+'"/>'+
        '<feature k_fullName="watermark.watermarkPath" k_value="'+flashvars['watermark.watermarkPath']+'"/>'+
        '<feature k_fullName="watermark.watermarkClickPath" k_value="'+flashvars['watermark.watermarkClickPath']+'"/>'+
        '<feature k_fullName="watermark.watermarkPosition" k_value="'+flashvars['watermark.watermarkPosition']+'"/>'+
        '<feature k_fullName="watermark.padding" k_value="'+flashvars['watermark.padding']+'"/>'+
        '<feature k_fullName="timerControllerScreen1" k_value="'+leftplay+'"/>'+
        '<feature k_fullName="timerControllerScreen1.ControllerScreen" k_value="'+leftplay+'"/>'+
        '<feature k_fullName="timerControllerScreen1.timerType" k_value="'+flashvars['timerControllerScreen1.timerType']+'"/>'+
        '<feature k_fullName="timerControllerScreen2" k_value="'+rightplay+'"/>'+
        '<feature k_fullName="timerControllerScreen2.ControllerScreen" k_value="'+rightplay+'"/>'+
        '<feature k_fullName="timerControllerScreen2.timerType" k_value="'+flashvars['timerControllerScreen2.timerType']+'"/>'+
        '<feature k_fullName="flavorComboControllerScreen" k_value="'+flavor+'"/>'+
        '<feature k_fullName="flavorComboControllerScreen.hdOn" k_value="'+flashvars['flavorComboControllerScreen.hdOn']+'"/>'+
        '<feature k_fullName="flavorComboControllerScreen.hdOff" k_value="'+flashvars['flavorComboControllerScreen.hdOff']+'"/>'+
        '<feature k_fullName="flavorComboControllerScreen.autoMessage" k_value="'+flashvars['flavorComboControllerScreen.autoMessage']+'"/>'+
        '<feature k_fullName="fullScreenBtn" k_value="'+fullscreen+'"/>'+
        '<feature k_fullName="fullScreenBtn.showOnVideoControllers" k_value="'+fullscreen_video+'"/>'+
        '<feature k_fullName="fullScreenBtn.showOnVideoControllers.StartScreen" k_value="'+fullscreen_before+'"/>'+
        '<feature k_fullName="fullScreenBtn.showOnVideoControllers.PlayScreen" k_value="'+fullscreen_during+'"/>'+
        '<feature k_fullName="fullScreenBtn.showOnVideoControllers.PauseScreen" k_value="'+fullscreen_paused+'"/>'+
        '<feature k_fullName="fullScreenBtn.showOnVideoControllers.EndScreen" k_value="'+fullscreen_end+'"/>'+
        '<feature k_fullName="fullScreenBtn.ControllerScreen" k_value="'+fullscreen_controls+'"/>'+
        '<feature k_fullName="fullScreenBtn.Display" k_value="buttonIconControllerArea"/>'+
        '<feature k_fullName="fullScreenBtn.Label" k_value="'+flashvars['fullScreenBtnControllerScreen.label']+'"/>'+
        '<feature k_fullName="fullScreenBtn.tooltipGo" k_value="'+flashvars['fullScreenBtnControllerScreen.upTooltip']+'"/>'+
        '<feature k_fullName="fullScreenBtn.tooltipExit" k_value="'+flashvars['fullScreenBtnControllerScreen.selectedTooltip']+'"/>'+
        '<feature k_fullName="onVideoPlayBtn" k_value="'+ovplay+'"/>'+
        '<feature k_fullName="onVideoPlayBtn.showOnVideoControllers" k_value="'+ovplay_video+'"/>'+
        '<feature k_fullName="onVideoPlayBtn.showOnVideoControllers.StartScreen" k_value="'+ovplay_before+'"/>'+
        '<feature k_fullName="onVideoPlayBtn.showOnVideoControllers.PauseScreen" k_value="'+ovplay_paused+'"/>'+
        '<feature k_fullName="onVideoPlayBtn.Display" k_value="buttonIconControllerArea"/>'+
        '<feature k_fullName="onVideoPlayBtn.Label" k_value="'+flashvars['onVideoPlayBtnStartScreen.label']+'"/>'+
        '<feature k_fullName="onVideoPlayBtn.Tooltip" k_value="'+flashvars['onVideoPlayBtnStartScreen.tooltip']+'"/>'+
        '<feature k_fullName="playBtn" k_value="'+playpause+'"/>'+
        '<feature k_fullName="playBtn.ControllerScreen" k_value="'+playpause+'"/>'+
        '<feature k_fullName="playBtn.Display" k_value="buttonIconControllerArea"/>'+
        '<feature k_fullName="playBtn.tooltipPlay" k_value="'+flashvars['playBtnControllerScreen.upTooltip']+'"/>'+
        '<feature k_fullName="playBtn.tooltipPause" k_value="'+flashvars['playBtnControllerScreen.selectedTooltip']+'"/>'+
        '<feature k_fullName="volumeBar" k_value="'+vol+'"/>'+
        '<feature k_fullName="volumeBar.ControllerScreen" k_value="'+vol+'"/>'+
        '<feature k_fullName="volumeBar.Tooltip" k_value="'+flashvars['volumeBar.tooltip']+'"/>'+
        '<feature k_fullName="volumeBar.initialVolumeLevel" k_value="'+flashvars['volumeBar.initialValue']+'"/>'+
        '<feature k_fullName="volumeBar.volumeOverride" k_value="'+flashvars['volumeBar.forceInitialValue']+'"/>'+
        '<feature k_fullName="scrubberContainer" k_value="'+scrub+'"/>'+
        '<feature k_fullName="scrubberContainer.ControllerScreen" k_value="'+scrub+'"/>'+
        '<feature k_fullName="replayBtn" k_value="'+replay+'"/>'+
        '<feature k_fullName="replayBtn.EndScreen" k_value="'+replay+'"/>'+
        '<feature k_fullName="replayBtn.Label" k_value="'+flashvars['replayBtnEndScreen.label']+'"/>'+
        '<feature k_fullName="replayBtn.Tooltip" k_value="'+flashvars['replayBtnEndScreen.tooltip']+'"/>'+
        '<feature k_fullName="unmuteBtn" k_value="'+unmute+'"/>'+
        '<feature k_fullName="unmuteBtn.showOnVideoControllers" k_value="'+unmute_video+'"/>'+
        '<feature k_fullName="unmuteBtn.showOnVideoControllers.StartScreen" k_value="'+unmute_before+'"/>'+
        '<feature k_fullName="unmuteBtn.showOnVideoControllers.PlayScreen" k_value="'+unmute_during+'"/>'+
        '<feature k_fullName="unmuteBtn.showOnVideoControllers.PauseScreen" k_value="'+unmute_paused+'"/>'+
        '<feature k_fullName="unmuteBtn.showOnVideoControllers.EndScreen" k_value="'+unmute_end+'"/>'+
        '<feature k_fullName="unmuteBtn.Label" k_value="'+flashvars['unmuteBtnStartScreen.label']+'"/>'+
        '<feature k_fullName="unmuteBtn.Tooltip" k_value="'+flashvars['unmuteBtnStartScreen.tooltip']+'"/>'+
        playistFeatures1+
        '<feature k_fullName="shareBtn" k_value="'+share+'"/>'+
        '<feature k_fullName="shareBtn.showOnVideoControllers" k_value="'+share_video+'"/>'+
        '<feature k_fullName="shareBtn.showOnVideoControllers.StartScreen" k_value="'+share_before+'"/>'+
        '<feature k_fullName="shareBtn.showOnVideoControllers.PlayScreen" k_value="'+share_during+'"/>'+
        '<feature k_fullName="shareBtn.showOnVideoControllers.PauseScreen" k_value="'+share_paused+'"/>'+
        '<feature k_fullName="shareBtn.showOnVideoControllers.EndScreen" k_value="'+share_end+'"/>'+
        '<feature k_fullName="shareBtn.ControllerScreen" k_value="'+share_controls+'"/>'+
        '<feature k_fullName="shareBtn.Display" k_value="buttonIconControllerArea"/>'+
        '<feature k_fullName="shareBtn.Label" k_value="'+flashvars['shareBtnControllerScreen.label']+'"/>'+
        '<feature k_fullName="shareBtn.Tooltip" k_value="'+flashvars['shareBtnControllerScreen.tooltip']+'"/>'+
        '<feature k_fullName="shareBtn.uiconfId" k_value=""/>'+
        '<feature k_fullName="downloadBtn" k_value="'+download+'"/>'+
        '<feature k_fullName="downloadBtn.showOnVideoControllers" k_value="'+download_video+'"/>'+
        '<feature k_fullName="downloadBtn.showOnVideoControllers.StartScreen" k_value="'+download_before+'"/>'+
        '<feature k_fullName="downloadBtn.showOnVideoControllers.PlayScreen" k_value="'+download_during+'"/>'+
        '<feature k_fullName="downloadBtn.showOnVideoControllers.PauseScreen" k_value="'+download_paused+'"/>'+
        '<feature k_fullName="downloadBtn.showOnVideoControllers.EndScreen" k_value="'+download_end+'"/>'+
        '<feature k_fullName="downloadBtn.ControllerScreen" k_value="'+download_controls+'"/>'+
        '<feature k_fullName="downloadBtn.Display" k_value="buttonIconControllerArea"/>'+
        '<feature k_fullName="downloadBtn.Label" k_value="'+flashvars['downloadBtnControllerScreen.label']+'"/>'+
        '<feature k_fullName="downloadBtn.Tooltip" k_value="'+flashvars['downloadBtnControllerScreen.tooltip']+'"/>'+
        '<feature k_fullName="downloadBtn.flavor" k_value="'+flashvars['download.flavorId']+'"/>'+
        '<feature k_fullName="uploadBtn" k_value="false"/>'+
        '<feature k_fullName="uploadBtn.showOnVideoControllers" k_value="false"/>'+
        '<feature k_fullName="uploadBtn.showOnVideoControllers.StartScreen" k_value="false"/>'+
        '<feature k_fullName="uploadBtn.showOnVideoControllers.PlayScreen" k_value="false"/>'+
        '<feature k_fullName="uploadBtn.showOnVideoControllers.PauseScreen" k_value="false"/>'+
        '<feature k_fullName="uploadBtn.showOnVideoControllers.EndScreen" k_value="false"/>'+
        '<feature k_fullName="uploadBtn.ControllerScreen" k_value="false"/>'+
        '<feature k_fullName="uploadBtn.Display" k_value="buttonIconControllerArea"/>'+
        '<feature k_fullName="uploadBtn.Label" k_value="upload"/>'+
        '<feature k_fullName="uploadBtn.Tooltip" k_value="Add additional videos, images or audio files to this video"/>'+
        '<feature k_fullName="editBtn" k_value="false"/>'+
        '<feature k_fullName="editBtn.showOnVideoControllers" k_value="false"/>'+
        '<feature k_fullName="editBtn.showOnVideoControllers.StartScreen" k_value="false"/>'+
        '<feature k_fullName="editBtn.showOnVideoControllers.PlayScreen" k_value="false"/>'+
        '<feature k_fullName="editBtn.showOnVideoControllers.PauseScreen" k_value="false"/>'+
        '<feature k_fullName="editBtn.showOnVideoControllers.EndScreen" k_value="false"/>'+
        '<feature k_fullName="editBtn.ControllerScreen" k_value="false"/>'+
        '<feature k_fullName="editBtn.Display" k_value="buttonIconControllerArea"/>'+
        '<feature k_fullName="editBtn.Label" k_value="Edit"/>'+
        '<feature k_fullName="editBtn.Tooltip" k_value="Remix this video"/>'+
        '<feature k_fullName="captureThumbBtn" k_value="'+thumbnail+'"/>'+
        '<feature k_fullName="captureThumbBtn.showOnVideoControllers" k_value="'+thumbnail_video+'"/>'+
        '<feature k_fullName="captureThumbBtn.showOnVideoControllers.StartScreen" k_value="'+thumbnail_before+'"/>'+
        '<feature k_fullName="captureThumbBtn.showOnVideoControllers.PlayScreen" k_value="'+thumbnail_during+'"/>'+
        '<feature k_fullName="captureThumbBtn.showOnVideoControllers.PauseScreen" k_value="'+thumbnail_paused+'"/>'+
        '<feature k_fullName="captureThumbBtn.showOnVideoControllers.EndScreen" k_value="'+thumbnail_end+'"/>'+
        '<feature k_fullName="captureThumbBtn.ControllerScreen" k_value="'+thumbnail_controls+'"/>'+
        '<feature k_fullName="captureThumbBtn.Display" k_value="buttonIconControllerArea"/>'+
        '<feature k_fullName="captureThumbBtn.Label" k_value="'+flashvars['captureThumbBtnStartScreen.label']+'"/>'+
        '<feature k_fullName="captureThumbBtn.Tooltip" k_value="'+flashvars['captureThumbBtnStartScreen.tooltip']+'"/>'+
        '<feature k_fullName="flagBtn" k_value="false"/>'+
        '<feature k_fullName="flagBtn.showOnVideoControllers" k_value="false"/>'+
        '<feature k_fullName="flagBtn.showOnVideoControllers.StartScreen" k_value="false"/>'+
        '<feature k_fullName="flagBtn.showOnVideoControllers.PlayScreen" k_value="false"/>'+
        '<feature k_fullName="flagBtn.showOnVideoControllers.PauseScreen" k_value="false"/>'+
        '<feature k_fullName="flagBtn.showOnVideoControllers.EndScreen" k_value="false"/>'+
        '<feature k_fullName="flagBtn.ControllerScreen" k_value="false"/>'+
        '<feature k_fullName="flagBtn.Display" k_value="buttonIconControllerArea"/>'+
        '<feature k_fullName="flagBtn.Label" k_value="flag"/>'+
        '<feature k_fullName="flagBtn.Tooltip" k_value="Report this content as inappropriate"/>'+
        '<feature k_fullName="stars" k_value="'+stars+'"/>'+
        '<feature k_fullName="stars.editable" k_value="'+flashvars['stars.editable']+'"/>'+
        '<feature k_fullName="stars.starsSize" k_value="1"/>'+
        '<feature k_fullName="plymedia" k_value="false"/>'+
        '<feature k_fullName="ccOverComboBoxWrapper" k_value="'+capVideo+'"/>'+
        '<feature k_fullName="ccOverComboBoxWrapper.fontColor" k_value="'+capVideo_textcolor.replace("#","0x")+'"/>'+
        '<feature k_fullName="ccOverComboBoxWrapper.ccOverRG" k_value="'+capVideo_textglow+'"/>'+
        '<feature k_fullName="ccOverComboBoxWrapper.ccOverGlowRB" k_value="'+capVideo_textglow+'"/>'+
        '<feature k_fullName="ccOverComboBoxWrapper.ccOverGlowColor" k_value="'+capVideo_glowcolor.replace("#","0x")+'"/>'+
        '<feature k_fullName="ccOverComboBoxWrapper.ccOverGlowBlur" k_value="'+capVideo_glowblur+'"/>'+
        '<feature k_fullName="ccOverComboBoxWrapper.ccOverBgRB" k_value="'+capVideo_backlayer+'"/>'+
        '<feature k_fullName="ccOverComboBoxWrapper.bgColor" k_value="'+capVideo_backcolor.replace("#","0x")+'"/>'+
        '<feature k_fullName="ccOverComboBoxWrapper.fontsize" k_value="'+capVideo_fontsize+'"/>'+
        '<feature k_fullName="ccOverComboBoxWrapper.fontFamily" k_value="'+capVideo_fontfamily+'"/>'+
        '<feature k_fullName="ccOverComboBoxWrapper.ccOverPrompt" k_value="'+capVideo_prompt+'"/>'+
        '<feature k_fullName="ccOverComboBoxWrapper.ccOverTooltip" k_value="'+capVideo_tooltip+'"/>'+
        '<feature k_fullName="ccUnderComboBox" k_value="false"/>'+
        '<feature k_fullName="ccUnderComboBox.fontColor" k_value=""/>'+
        '<feature k_fullName="ccUnderComboBox.ccUnderRG" k_value=""/>'+
        '<feature k_fullName="ccUnderComboBox.ccUnderGlowRB" k_value=""/>'+
        '<feature k_fullName="ccUnderComboBox.ccUnderGlowColor" k_value=""/>'+
        '<feature k_fullName="ccUnderComboBox.ccUnderGlowBlur" k_value=""/>'+
        '<feature k_fullName="ccUnderComboBox.ccUnderBgRB" k_value=""/>'+
        '<feature k_fullName="ccUnderComboBox.bgColor" k_value=""/>'+
        '<feature k_fullName="ccUnderComboBox.fontsize" k_value=""/>'+
        '<feature k_fullName="ccUnderComboBox.fontFamily" k_value=""/>'+
        '<feature k_fullName="ccUnderComboBox.ccUnderPrompt" k_value=""/>'+
        '<feature k_fullName="ccUnderComboBox.ccUnderTooltip" k_value=""/>'+
        '<feature k_fullName="custom1Btn" k_value="'+customButton1+'"/>'+
        '<feature k_fullName="custom1Btn.showOnVideoControllers" k_value="'+customButton1_video+'"/>'+
        '<feature k_fullName="custom1Btn.showOnVideoControllers.StartScreen" k_value="'+customButton1_before+'"/>'+
        '<feature k_fullName="custom1Btn.showOnVideoControllers.PlayScreen" k_value="'+customButton1_during+'"/>'+
        '<feature k_fullName="custom1Btn.showOnVideoControllers.PauseScreen" k_value="'+customButton1_paused+'"/>'+
        '<feature k_fullName="custom1Btn.showOnVideoControllers.EndScreen" k_value="'+customButton1_end+'"/>'+
        '<feature k_fullName="custom1Btn.ControllerScreen" k_value="'+customButton1_controls+'"/>'+
        '<feature k_fullName="custom1Btn.Display" k_value="buttonIconControllerArea"/>'+
        '<feature k_fullName="custom1Btn.Label" k_value="'+flashvars['custom1BtnStartScreen.label']+'"/>'+
        '<feature k_fullName="custom1Btn.Tooltip" k_value="'+flashvars['custom1BtnStartScreen.tooltip']+'"/>'+
        '<feature k_fullName="custom2Btn" k_value="'+customButton2+'"/>'+
        '<feature k_fullName="custom2Btn.showOnVideoControllers" k_value="'+customButton2_video+'"/>'+
        '<feature k_fullName="custom2Btn.showOnVideoControllers.StartScreen" k_value="'+customButton2_before+'"/>'+
        '<feature k_fullName="custom2Btn.showOnVideoControllers.PlayScreen" k_value="'+customButton2_during+'"/>'+
        '<feature k_fullName="custom2Btn.showOnVideoControllers.PauseScreen" k_value="'+customButton2_paused+'"/>'+
        '<feature k_fullName="custom2Btn.showOnVideoControllers.EndScreen" k_value="'+customButton2_end+'"/>'+
        '<feature k_fullName="custom2Btn.ControllerScreen" k_value="'+customButton2_controls+'"/>'+
        '<feature k_fullName="custom2Btn.Display" k_value="buttonIconControllerArea"/>'+
        '<feature k_fullName="custom2Btn.Label" k_value="'+flashvars['custom2BtnStartScreen.label']+'"/>'+
        '<feature k_fullName="custom2Btn.Tooltip" k_value="'+flashvars['custom2BtnStartScreen.tooltip']+'"/>'+
        '<feature k_fullName="custom3Btn" k_value="'+customButton3+'"/>'+
        '<feature k_fullName="custom3Btn.showOnVideoControllers" k_value="'+customButton3_video+'"/>'+
        '<feature k_fullName="custom3Btn.showOnVideoControllers.StartScreen" k_value="'+customButton3_before+'"/>'+
        '<feature k_fullName="custom3Btn.showOnVideoControllers.PlayScreen" k_value="'+customButton3_during+'"/>'+
        '<feature k_fullName="custom3Btn.showOnVideoControllers.PauseScreen" k_value="'+customButton3_paused+'"/>'+
        '<feature k_fullName="custom3Btn.showOnVideoControllers.EndScreen" k_value="'+customButton3_end+'"/>'+
        '<feature k_fullName="custom3Btn.ControllerScreen" k_value="'+customButton3_controls+'"/>'+
        '<feature k_fullName="custom3Btn.Display" k_value="buttonIconControllerArea"/>'+
        '<feature k_fullName="custom3Btn.Label" k_value="'+flashvars['custom3BtnStartScreen.label']+'"/>'+
        '<feature k_fullName="custom3Btn.Tooltip" k_value="'+flashvars['custom3BtnStartScreen.tooltip']+'"/>'+
        '<feature k_fullName="custom4Btn" k_value="'+customButton4+'"/>'+
        '<feature k_fullName="custom4Btn.showOnVideoControllers" k_value="'+customButton4_video+'"/>'+
        '<feature k_fullName="custom4Btn.showOnVideoControllers.StartScreen" k_value="'+customButton4_before+'"/>'+
        '<feature k_fullName="custom4Btn.showOnVideoControllers.PlayScreen" k_value="'+customButton4_during+'"/>'+
        '<feature k_fullName="custom4Btn.showOnVideoControllers.PauseScreen" k_value="'+customButton4_paused+'"/>'+
        '<feature k_fullName="custom4Btn.showOnVideoControllers.EndScreen" k_value="'+customButton4_end+'"/>'+
        '<feature k_fullName="custom4Btn.ControllerScreen" k_value="'+customButton4_controls+'"/>'+
        '<feature k_fullName="custom4Btn.Display" k_value="buttonIconControllerArea"/>'+
        '<feature k_fullName="custom4Btn.Label" k_value="'+flashvars['custom4BtnStartScreen.label']+'"/>'+
        '<feature k_fullName="custom4Btn.Tooltip" k_value="'+flashvars['custom4BtnStartScreen.tooltip']+'"/>'+
        '<feature k_fullName="custom5Btn" k_value="'+customButton5+'"/>'+
        '<feature k_fullName="custom5Btn.showOnVideoControllers" k_value="'+customButton5_video+'"/>'+
        '<feature k_fullName="custom5Btn.showOnVideoControllers.StartScreen" k_value="'+customButton5_before+'"/>'+
        '<feature k_fullName="custom5Btn.showOnVideoControllers.PlayScreen" k_value="'+customButton5_during+'"/>'+
        '<feature k_fullName="custom5Btn.showOnVideoControllers.PauseScreen" k_value="'+customButton5_paused+'"/>'+
        '<feature k_fullName="custom5Btn.showOnVideoControllers.EndScreen" k_value="'+customButton5_end+'"/>'+
        '<feature k_fullName="custom5Btn.ControllerScreen" k_value="'+customButton5_controls+'"/>'+
        '<feature k_fullName="custom5Btn.Display" k_value="buttonIconControllerArea"/>'+
        '<feature k_fullName="custom5Btn.Label" k_value="'+flashvars['custom5BtnStartScreen.label']+'"/>'+
        '<feature k_fullName="custom5Btn.Tooltip" k_value="'+flashvars['custom5BtnStartScreen.tooltip']+'"/>'+
        playistFeatures2+
        '</featuresData>'+
        '<advertising enabled="'+ads+'">'+
        '<adSources>'+
        '<source label="Bumper Only" id="bumperOnly" url="no url" selected="'+bumper+'" preSequence="'+flashvars['bumper.preSequence']+'" postSequence="'+flashvars['bumper.postSequence']+'"/>'+
        '<source label="Custom swf" id="customSwf" url=""/>'+
        '<source label="Tremor" id="tremor" url="tremorPlugin.swf"/>'+
        '<source label="AdapTV" id="adaptv" url="adaptvPlugin.swf"/>'+
        '<source label="Eye Wonder" id="eyewonder" url="eyewonderPlugin.swf"/>'+
        '<source label="VAST Ad Server" id="vastAdServer" url="" selected="'+vast+'" preSequence="'+flashvars['vast.preSequence']+'" postSequence="'+flashvars['vast.postSequence']+'"/>'+
        '</adSources>'+
        '<playerConfig timeout="'+flashvars['vast.timeout']+'" trackCuePoints="'+flashvars['vast.trackCuePoints']+'">'+
        '<notice enabled="'+vast_noticetext+'">'+flashvars['noticeMessage.text']+'</notice>'+
        '<skip enabled="'+vast_allowskip+'" label="'+flashvars['skipBtn.label']+'"/>'+
        '<companion>'+
        '<elements>'+
        elements+
        '</elements>'+
        htmlCompanion+
        flashElement+
        '</companion>'+
        '</playerConfig>'+
        '<timeline>'+
        '<preroll enabled="'+vast_preroll+'" nads="'+flashvars['vast.numPreroll']+'" frequency="'+flashvars['vast.prerollInterval']+'" start="'+flashvars['vast.prerollStartWith']+'" url="'+smhPlayers.escape(flashvars['vast.prerollUrl'])+'"/>'+
        '<bumper enabled="'+bumper+'" entryid="'+flashvars['bumper.bumperEntryID']+'" clickurl="'+flashvars['bumper.clickurl']+'"/>'+
        '<postroll enabled="'+vast_postroll+'" nads="'+flashvars['vast.numPostroll']+'" frequency="'+flashvars['vast.postrollInterval']+'" start="'+flashvars['vast.postrollStartWith']+'" url="'+smhPlayers.escape(flashvars['vast.postrollUrl'])+'"/>'+
        '<overlay enabled="'+vast_overlay+'" nads="'+flashvars['overlay.displayDuration']+'" frequency="'+flashvars['vast.overlayInterval']+'" start="'+flashvars['vast.overlayStartAt']+'" url="'+smhPlayers.escape(flashvars['vast.overlayUrl'])+'"/>'+
        '<values>'+
        '<nads>'+
        '<item data="1" label="1"/>'+
        '<item data="2" label="2"/>'+
        '<item data="3" label="3"/>'+
        '<item data="4" label="4"/>'+
        '<item data="5" label="5"/>'+
        '<item data="6" label="6"/>'+
        '<item data="7" label="7"/>'+
        '<item data="8" label="8"/>'+
        '<item data="9" label="9"/>'+
        '<item data="10" label="10"/>'+
        '</nads>'+
        '<frequency>'+
        '<item data="1" label="1st"/>'+
        '<item data="2" label="2nd"/>'+
        '<item data="3" label="3rd"/>'+
        '<item data="4" label="4th"/>'+
        '<item data="5" label="5th"/>'+
        '<item data="6" label="6th"/>'+
        '<item data="7" label="7th"/>'+
        '<item data="8" label="8th"/>'+
        '<item data="9" label="9th"/>'+
        '<item data="10" label="10th"/>'+
        '</frequency>'+
        '<start>'+
        '<item data="1" label="1st"/>'+
        '<item data="2" label="2nd"/>'+
        '<item data="3" label="3rd"/>'+
        '<item data="4" label="4th"/>'+
        '<item data="5" label="5th"/>'+
        '<item data="6" label="6th"/>'+
        '<item data="7" label="7th"/>'+
        '<item data="8" label="8th"/>'+
        '<item data="9" label="9th"/>'+
        '<item data="10" label="10th"/>'+
        '</start>'+
        '</values>'+
        '</timeline>'+
        '</advertising>'+
        '<screenAssets>'+
        '<player ratio="4:3"/>'+
        '<fixedAdditional left="0" right="0" top="30" bottom="0"/>'+
        '<screenasset id="TopTitleScreen" height="30"/>'+
        '</screenAssets>'+
        '<visual>'+
        '<theme id="'+theme2+'" name="'+theme1+'">'+
        '<themeSkinPath>'+skin+'</themeSkinPath>'+
        '<color1>'+smhPlayers.h2d(style_icons_color.replace("#",""))+'</color1>'+
        '<color2>'+smhPlayers.h2d(style_mouse_color.replace("#",""))+'</color2>'+
        '<color3>'+smhPlayers.h2d(style_onvideo_button_color.replace("#",""))+'</color3>'+
        '<color4>'+smhPlayers.h2d(style_onvideo_mouse_color.replace("#",""))+'</color4>'+
        '<color5>'+smhPlayers.h2d(style_onvideo_icons_color.replace("#",""))+'</color5>'+
        '<font>'+style_fontfamily+'</font>'+
        '</theme>'+
        '</visual>'+
        '<playerProperties>'+
        '<width>'+flashvars['width']+'</width>'+
        '<height>'+flashvars['height']+'</height>'+
        '<theme>'+theme2+'</theme>'+
        '</playerProperties>'+
        '<uiVars>'+
        '<var key="video.keepAspectRatio" value="'+origMedia+'"/>'+
        '<var key="playlistAPI.autoContinue" value="'+playlist_autocontinue+'"/>'+
        '<var key="playlistAPI.loop" value="'+playlist_loop+'"/>'+
        '<var key="playlistHolder.visible" value="'+playlist_visible+'"/>'+
        '<var key="playlistHolder.includeInLayout" value="'+playlist_visible+'"/>'+
        '<var key="imageDefaultDuration" value="'+playlist_imageduration+'"/>'+
        '<var key="autoPlay" value="'+playOnload+'"/>'+
        '<var key="autoMute" value="'+playerMute+'"/>'+
        '<var key="Kaltura.ForceFlashOnDesktop" value="false"/>'+
        '<var key="list.rowHeight" value="'+playlist_rowHeight+'"/>'+
        multi_feature+
        custom_icon+
        '</uiVars>'+
        '</snapshot>';
    
        return studioConfig;


    },
    //Create Config file
    createConfig:function(uiconf_id,player_name){
        var fader = '';
        var bg_style1 = '';
        var bg_style2 = '';
        var playlist_plugin = '';
        var isplaylist = ' ';
        var download = $('#smh-modal3 #download').is(':checked')? true : false;
        var thumbnail = $('#smh-modal3 #thumbnail').is(':checked')? true : false;
        var vast = $('#smh-modal3 #vast').is(':checked')? true : false;
        var vast_preroll = $('#smh-modal3 #preroll_yes').is(':checked')? true : false;
        var vast_overlay = $('#smh-modal3 #overlay_yes').is(':checked')? true : false;
        var vast_postroll = $('#smh-modal3 #postroll_yes').is(':checked')? true : false;
        var title = $('#smh-modal3 #title_text').is(':checked')? true : false;
        var vast_noticetext = $('#smh-modal3 #notice_text_yes').is(':checked')? true : false;
        var watermark = $('#smh-modal3 #watermark').is(':checked')? true : false;
        var bumper = $('#smh-modal3 #bumper').is(':checked')? true : false;
        var vast_allowskip = $('#smh-modal3 #ad_skip_yes').is(':checked')? true : false;
        var share = $('#smh-modal3 #share').is(':checked')? true : false;
        var playpause = $('#smh-modal3 #play_pause').is(':checked')? true : false; 
        var scrub = $('#smh-modal3 #scrubber').is(':checked')? true : false;
        var leftplay = $('#smh-modal3 #left-play-counter').is(':checked')? true : false;
        var rightplay = $('#smh-modal3 #right-play-counter').is(':checked')? true : false;
        var vol = $('#smh-modal3 #volume').is(':checked')? true : false;
        var share_controls = $('#smh-modal3 #share_controls').is(':checked')? true : false;
        var download_controls = $('#smh-modal3 #dwnld_controls').is(':checked')? true : false;
        var thumbnail_controls = $('#smh-modal3 #thumbnail_controls').is(':checked')? true : false;
        var flavor = $('#smh-modal3 #flavor_selector').is(':checked')? true : false;
        var fullscreen = $('#smh-modal3 #fullscreen').is(':checked')? true : false; 
        var fullscreen_controls = $('#smh-modal3 #fullscreen_controls').is(':checked')? true : false; 
        var customButton1 = $('#smh-modal3 #customButton1').is(':checked')? true : false;
        var customButton1_controls = $('#smh-modal3 #customButton1_controls').is(':checked')? true : false;
        var customButton2 = $('#smh-modal3 #customButton2').is(':checked')? true : false;
        var customButton2_controls = $('#smh-modal3 #customButton2_controls').is(':checked')? true : false;
        var customButton3 = $('#smh-modal3 #customButton3').is(':checked')? true : false;
        var customButton3_controls = $('#smh-modal3 #customButton3_controls').is(':checked')? true : false;
        var customButton4 = $('#smh-modal3 #customButton4').is(':checked')? true : false;
        var customButton4_controls = $('#smh-modal3 #customButton4_controls').is(':checked')? true : false;
        var customButton5 = $('#smh-modal3 #customButton5').is(':checked')? true : false;
        var customButton5_controls = $('#smh-modal3 #customButton5_controls').is(':checked')? true : false;
        var ovplay = $('#smh-modal3 #on_video_play').is(':checked')? true : false;
        var ovplay_video = $('#smh-modal3 #ovplay_video_area').is(':checked')? true : false;
        var ovplay_before = $('#smh-modal3 #ovplay_video_before').is(':checked')? true : false;
        var ovplay_paused = $('#smh-modal3 #ovplay_video_paused').is(':checked')? true : false;
        var share_video = $('#smh-modal3 #share_video_area').is(':checked')? true : false; 
        var share_before = $('#smh-modal3 #share_video_before').is(':checked')? true : false;
        var share_during = $('#smh-modal3 #share_video_during').is(':checked')? true : false;
        var share_paused = $('#smh-modal3 #share_video_paused').is(':checked')? true : false;
        var share_end = $('#smh-modal3 #share_video_end').is(':checked')? true : false;
        var download_video = $('#smh-modal3 #dwnld_video_area').is(':checked')? true : false;
        var download_before = $('#smh-modal3 #dwnld_video_before').is(':checked')? true : false;
        var download_during = $('#smh-modal3 #dwnld_video_during').is(':checked')? true : false;
        var download_paused = $('#smh-modal3 #dwnld_video_paused').is(':checked')? true : false;
        var download_end = $('#smh-modal3 #dwnld_video_end').is(':checked')? true : false;
        var thumbnail_video = $('#smh-modal3 #thumbnail_video_area').is(':checked')? true : false;
        var thumbnail_before = $('#smh-modal3 #thumbnail_video_before').is(':checked')? true : false;
        var thumbnail_during = $('#smh-modal3 #thumbnail_video_during').is(':checked')? true : false;
        var thumbnail_paused = $('#smh-modal3 #thumbnail_video_paused').is(':checked')? true : false;
        var thumbnail_end = $('#smh-modal3 #thumbnail_video_end').is(':checked')? true : false;
        var fullscreen_video = $('#smh-modal3 #fullscreen_video_area').is(':checked')? true : false;
        var fullscreen_before = $('#smh-modal3 #fullscreen_video_before').is(':checked')? true : false;
        var fullscreen_during = $('#smh-modal3 #fullscreen_video_during').is(':checked')? true : false;
        var fullscreen_paused = $('#smh-modal3 #fullscreen_video_paused').is(':checked')? true : false;
        var fullscreen_end = $('#smh-modal3 #fullscreen_video_end').is(':checked')? true : false;
        var customButton1_video = $('#smh-modal3 #customButton1_video_area').is(':checked')? true : false;
        var customButton1_before = $('#smh-modal3 #customButton1_video_before').is(':checked')? true : false;
        var customButton1_during = $('#smh-modal3 #customButton1_video_during').is(':checked')? true : false;
        var customButton1_paused = $('#smh-modal3 #customButton1_video_paused').is(':checked')? true : false;
        var customButton1_end = $('#smh-modal3 #customButton1_video_end').is(':checked')? true : false;
        var customButton2_video = $('#smh-modal3 #customButton2_video_area').is(':checked')? true : false;
        var customButton2_before = $('#smh-modal3 #customButton2_video_before').is(':checked')? true : false;
        var customButton2_during = $('#smh-modal3 #customButton2_video_during').is(':checked')? true : false;
        var customButton2_paused = $('#smh-modal3 #customButton2_video_paused').is(':checked')? true : false;
        var customButton2_end = $('#smh-modal3 #customButton2_video_end').is(':checked')? true : false;
        var customButton3_video = $('#smh-modal3 #customButton3_video_area').is(':checked')? true : false;
        var customButton3_before = $('#smh-modal3 #customButton3_video_before').is(':checked')? true : false;
        var customButton3_during = $('#smh-modal3 #customButton3_video_during').is(':checked')? true : false;
        var customButton3_paused = $('#smh-modal3 #customButton3_video_paused').is(':checked')? true : false;
        var customButton3_end = $('#smh-modal3 #customButton3_video_end').is(':checked')? true : false;
        var customButton4_video = $('#smh-modal3 #customButton4_video_area').is(':checked')? true : false;
        var customButton4_before = $('#smh-modal3 #customButton4_video_before').is(':checked')? true : false;
        var customButton4_during = $('#smh-modal3 #customButton4_video_during').is(':checked')? true : false;
        var customButton4_paused = $('#smh-modal3 #customButton4_video_paused').is(':checked')? true : false;
        var customButton4_end = $('#smh-modal3 #customButton4_video_end').is(':checked')? true : false;
        var customButton5_video = $('#smh-modal3 #customButton5_video_area').is(':checked')? true : false;
        var customButton5_before = $('#smh-modal3 #customButton5_video_before').is(':checked')? true : false;
        var customButton5_during = $('#smh-modal3 #customButton5_video_during').is(':checked')? true : false;
        var customButton5_paused = $('#smh-modal3 #customButton5_video_paused').is(':checked')? true : false;
        var customButton5_end = $('#smh-modal3 #customButton5_video_end').is(':checked')? true : false;
        var unmute = $('#smh-modal3 #unmute').is(':checked')? true : false;
        var unmute_video = $('#smh-modal3 #unmute_video_area').is(':checked')? true : false;
        var unmute_before = $('#smh-modal3 #unmute_video_before').is(':checked')? true : false;
        var unmute_during = $('#smh-modal3 #unmute_video_during').is(':checked')? true : false;
        var unmute_paused = $('#smh-modal3 #unmute_video_paused').is(':checked')? true : false;
        var unmute_end = $('#smh-modal3 #unmute_video_end').is(':checked')? true : false;
        var replay = $('#smh-modal3 #replay').is(':checked')? true : false;
        var user_icon = $('#smh-modal3 #logo-icon').is(':checked')? true : false;
        var user_icon_width = $('#smh-modal3 #icon-width').val();
        var user_icon_height = $('#smh-modal3 #icon-height').val();
        var user_icon_url = $('#smh-modal3 #icon_url').val();
        var user_icon_clickurl = $('#smh-modal3 #icon_landing').val();
        var origMedia = $('#smh-modal3 #video_ratio_orig').is(':checked')? true : false;
        var playOnload = $('#smh-modal3 #auto_play').is(':checked')? true : false;
        var playerMute = $('#smh-modal3 #start_muted').is(':checked')? true : false;
        var stars = $('#smh-modal3 #stars').is(':checked')? true : false;
        var playlist_previous = $('#smh-modal3 #previous_button').is(':checked')? true : false;
        var playlist_next = $('#smh-modal3 #next_button').is(':checked')? true : false;
        var playlist_visible = $('#smh-modal3 #hidePlaylist').is(':checked')? false : true;
            
        if(uiconf_id == '6709442'){
            fader = '<Plugin id="fader" width="0%" height="0%" includeInLayout="false" target="{controllersVbox}" hoverTarget="{PlayerHolder}" duration="0.5" autoHide="true" />';
            bg_style1 = 'hoverBg';
            bg_style2 = '';
        } else if(uiconf_id == '6709438'){
            bg_style1 = 'darkBg';
            bg_style2 = 'darkBg';
        } else if (uiconf_id == '6709439' || uiconf_id == '6709440' || uiconf_id == '6709441'){
            bg_style1 = 'darkBg';
            bg_style2 = 'darkBg';        
            if(uiconf_id == '6709439' || uiconf_id == '6709440'){
                playlist_plugin = '<Plugin id="playlistAPI" width="0%" height="0%" includeInLayout="false"/>';
                isplaylist = ' isPlaylist="true" ';   
            } else if(uiconf_id == '6709441'){
                playlist_plugin = '<Plugin id="playlistAPI" width="0%" height="0%" includeInLayout="false" selectedDataProvider="{tabBar.selectedDataProvider}"/>';
                isplaylist = ' isPlaylist="multi" ';
            }        
        }
        if(uiconf_id == '6709440'){
            var box = 'VBox';
        } else {
            box = 'HBox';
        }
        
        var configFile = '<layout id="full" name="'+smhPlayers.htmlEntities(player_name)+'"'+isplaylist+'skinPath="'+skin+'">'+
        '<'+box+' id="topLevel" width="100%" height="100%">'+
        '<VBox id="player" width="100%" height="100%" styleName="black">'+
        '<Plugin id="kalturaMix" width="0%" height="0%" includeInLayout="false" loadingPolicy="onDemand"/>'+
        '<Plugin id="statistics" width="0%" height="0%" includeInLayout="false"/>'+
        fader+
        playlist_plugin;
        var vast_string = '';
        var vast_pre = '';
        var vast_over = '';
        var vast_post = '';
        
        if(download){
            configFile += '<Plugin id="download" width="0%" height="0%" includeInLayout="false" loadingPolicy="noWait" flavorId="'+flashvars['download.flavorId']+'"/>'; 
        }
    
        if(thumbnail){
            configFile += '<Plugin id="captureThumbnail" width="0%" height="0%" includeInLayout="false" loadingPolicy="noWait"/>';
        }
        
        if(vast){              
            vast_string = '<Plugin id="vast" ';
            if(vast_preroll){
                if(flashvars['vast.prerollUrl'] == 'http://'){
                    alert('Invalid field');
                } else {
                    vast_pre += 'numPreroll="'+flashvars['vast.numPreroll']+'" prerollInterval="'+flashvars['vast.prerollInterval']+'" prerollStartWith="'+flashvars['vast.prerollStartWith']+'" prerollUrl="'+smhPlayers.escape(flashvars['vast.prerollUrl'])+'" preSequence="'+flashvars['vast.preSequence']+'" ';       
                }
            }                    
                    
            if(vast_overlay){
                if(flashvars['vast.overlayUrl'] == 'http://'){
                    alert('Invalid field'); 
                } else {
                    vast_over += 'overlayStartAt="'+flashvars['vast.overlayStartAt']+'" overlayInterval="'+flashvars['vast.overlayInterval']+'" overlayUrl="'+smhPlayers.escape(flashvars['vast.overlayUrl'])+'" ';
                }
            }
                    
            if(vast_postroll){
                if(flashvars['vast.postrollUrl'] == 'http://'){
                    alert('Invalid field');
                } else {
                    vast_post += 'numPostroll="'+flashvars['vast.numPostroll']+'" postrollInterval="'+flashvars['vast.postrollInterval']+'" postrollStartWith="'+flashvars['vast.postrollStartWith']+'" postrollUrl="'+smhPlayers.escape(flashvars['vast.postrollUrl'])+'" postSequence="'+flashvars['vast.postSequence']+'" ';        
                }
            }
        
            vast_string += ''+vast_pre+vast_over+vast_post+'trackCuePoints="'+flashvars['vast.trackCuePoints']+'" timeout="'+flashvars['vast.timeout']+'" flashCompanions="" htmlCompanions=""/>';
        
            configFile += vast_string;
        }
        
        if(title){
            configFile += '<HBox id="TopTitleScreen" width="100%" height="30" styleName="darkBg">'+
            '<Label height="22" id="movieName" styleName="movieName" width="100%" text="{mediaProxy.entry.name}" dynamicColor="true" color1="'+style_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>'+
            '</HBox>';
        }
        
        configFile += '<Canvas id="PlayerHolder" height="100%" width="100%" styleName="black">'+
        '<Video id="video" width="100%" height="100%"/>';
    
        if(vast_noticetext){
            configFile += '<Label id="noticeMessage" text="'+flashvars['noticeMessage.text']+'" height="18" width="100%" font="TimesNewRoman" styleName="movieName" dynamicColor="true" color1="'+style_icons_color.replace("#","0x")+'" visible="'+flashvars['noticeMessage.visible']+'" includeInLayout="'+flashvars['noticeMessage.includeInLayout']+'"/>';
        } 
        
        configFile += '<VBox id="offlineMessageHolder" verticalAlign="middle" horizontalAlign="center" includeInLayout="false" width="100%" height="100%">'+
        '<Spacer height="100%"/>'+
        '<Spacer height="100%"/>'+
        '<Label id="offlineMessage" styleName="offlineMessage" text="{mediaProxy.entry.offlineMessage}" visible="{mediaProxy.isOffline}" width="100%" height="30"/>'+
        '<Spacer height="100%"/>'+
        '</VBox>';

        if(capVideo){
            configFile += '<VBox id="generalPluginContainer" width="100%" height="100%">'+
            '<Spacer id="contentPusher" height="100%"/>'+
            '<Plugin id="closedCaptionsOverPlayer" width="100%" height="15%" fontsize="'+capVideo_fontsize+'" bg="'+capVideo_backcolor.replace("#","0x")+'" fontFamily="'+capVideo_fontfamily+'" fontColor="'+capVideo_textcolor.replace("#","0x")+'" opacity="0" path="closedCaptionsPlugin.swf" useGlow="'+capVideo_textglow+'" glowColor="'+capVideo_glowcolor.replace("#","0x")+'" glowBlur="'+capVideo_glowblur+'"/>'+
            '</VBox>';
        } else {
        
            var content_bottom_plugin = '';
        
            if(uiconf_id == '6709442'){
                content_bottom_plugin = '<Spacer id="contentPusherBottom" height="30"/>';
            }
        
            configFile += '<VBox id="generalPluginContainer" width="100%" height="100%">'+
            '<Spacer id="contentPusher" height="100%"/>'+
            content_bottom_plugin+
            '</VBox>'; 
        }
        
        configFile += '<Screens id="screensLayer" width="100%" height="100%" mouseOverTarget="{PlayerHolder}" styleName="clickThrough" startScreenId="startScreen" startScreenOverId="startScreen" pauseScreenOverId="pauseScreen" pauseScreenId="pauseScreen" playScreenOverId="playScreen" endScreenId="endScreen" endScreenOverId="endScreen"/>';
        
        if(watermark){
            configFile += '<Watermark id="watermark" width="100%" height="100%" watermarkPath="'+flashvars['watermark.watermarkPath']+'" watermarkClickPath="'+flashvars['watermark.watermarkClickPath']+'" watermarkPosition="'+flashvars['watermark.watermarkPosition']+'" padding="'+flashvars['watermark.padding']+'"/>';
        }
        
        if(vast){
            if(vast_overlay){
                configFile += '<Plugin id="overlay" swfUrls="{vast.overlays}" overlayStartAt="{vast.overlayStartAt}" overlayInterval="{vast.overlayInterval}" displayDuration="'+flashvars['overlay.displayDuration']+'" width="100%" height="100%" trackCuePoints="'+flashvars['vast.trackCuePoints']+'"/>';
            }
        }
        
        if(bumper){
            if(flashvars['bumper.clickurl'] == null || flashvars['bumper.clickurl'] == ''){
                configFile += '<Plugin id="bumper" bumperEntryID="'+flashvars['bumper.bumperEntryID']+'" lockUI="true" playOnce="false" preSequence="'+flashvars['bumper.preSequence']+'" postSequence="'+flashvars['bumper.postSequence']+'" width="100%" height="100%"/>';            
            } else {
                configFile += '<Plugin id="bumper" bumperEntryID="'+flashvars['bumper.bumperEntryID']+'" clickurl="'+flashvars['bumper.clickurl']+'" lockUI="true" playOnce="false" preSequence="'+flashvars['bumper.preSequence']+'" postSequence="'+flashvars['bumper.postSequence']+'" width="100%" height="100%"/>'; 
            }
        }
        
        if(stars){
            configFile += '<Plugin id="stars" width="100%" height="30" editable="'+flashvars['stars.editable']+'" rating="-1"/>';
        }
        
        if(vast && vast_allowskip){
            configFile += '<VBox id="skipBtnHolder" width="100%" height="100%">'+
            '<Spacer height="100%"/>'+
            '<HBox width="100%" height="30">'+
            '<Spacer width="100%"/>'+
            '<Button id="skipBtn" visible="{sequenceProxy.isAdSkip}" includeInLayout="{sequenceProxy.isAdSkip}" type="labelButton" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" styleName="controllerScreen" height="30" width="20" allowDisable="false" label="'+flashvars['skipBtn.label']+'" kClick="sendNotification(\'sequenceSkipNext\')"/>'+
            '</HBox>'+
            '</VBox>';
        } else {
            configFile += '<VBox id="skipBtnHolder" width="100%" height="100%">'+
        '<Spacer height="100%"/>'+
        '<HBox width="100%" height="30">'+
        '<Spacer width="100%"/>'+
        '</HBox>'+
        '</VBox>';
        }
        
        if(capVideo){
            configFile += '<HBox id="ccOverComboBoxWrapper" horizontalAlign="right" width="100%" height="100%" paddingRight="5" paddingTop="5">'+
            '<Plugin id="captionsOverFader" width="0%" height="0%" includeInLayout="false" target="{ccOverComboBoxWrapper}" hoverTarget="{PlayerHolder}" duration="0.5" autoHide="true" path="faderPlugin.swf" />'+
            '<ComboBox id="ccOverComboBox" width="90" styleName="_kdp" selectedIndex="{closedCaptionsOverPlayer.currentCCFileIndex}" kevent_change="sendNotification( \'closedCaptionsSelected\' , ccOverComboBox.selectedItem)" dataProvider="{closedCaptionsOverPlayer.availableCCFilesLabels}" prompt="'+capVideo_prompt+'" visible="{closedCaptionsOverPlayer.hasCaptions}" tooltip="'+capVideo_tooltip+'"/>'+
            '</HBox>';
        }
        
        if(share){
            configFile += '<Plugin id="kalturaShare" uiconfId="" width="100%" height="100%" via="" pubid=""/>';
        }
        
        if(uiconf_id == '6709438' || uiconf_id == '6709439' || uiconf_id == '6709440' || uiconf_id == '6709441'){
            var controls_top = '</Canvas>'+
            '<Canvas id="controlsHolder" width="100%" height="30">';
            var controls_bottom = '</Canvas>';
        } else if(uiconf_id == '6709442'){
            controls_top = '<VBox id="controllersVbox" width="100%" height="100%" verticalAlign="Bottom" paddingRight="5" paddingLeft="5">'+
            '<Spacer id="controllerPusher" width="100%" height="100%" />';
            controls_bottom = '<Spacer id="PaddingBottom" height="5" />'+
        '</VBox>'+
        '</Canvas>';
        }
        
        configFile += controls_top+
        '<HBox id="ControllerScreenHolder" width="100%" height="30" verticalAlign="middle" styleName="'+bg_style1+'">'+
        '<HBox id="ControllerScreen" width="100%" height="30" horizontalGap="9" paddingLeft="9" verticalAlign="middle" styleName="'+bg_style2+'">';
    
        if(playpause){
            configFile += '<Button id="playBtnControllerScreen" command="play" buttonType="iconButton" focusRectPadding="0" icon="playIcon" overIcon="playIcon" downIcon="playIcon" disabeledIcon="playIcon" selectedUpIcon="pauseIcon" selectedOverIcon="pauseIcon" selectedDownIcon="pauseIcon" selectedDisabledIcon="pauseIcon" tooltip="'+flashvars['playBtnControllerScreen.upTooltip']+'" upTooltip="'+flashvars['playBtnControllerScreen.upTooltip']+'" selectedTooltip="'+flashvars['playBtnControllerScreen.selectedTooltip']+'" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
        }
        
        configFile += '<Button id="liveToggleStatus" toggle="true" color1="0xFF0000" color2="0xFF0000" upIcon="onAirIcon" overIcon="onAirIcon" downIcon="onAirIcon" disabeledIcon="onAirIcon" selectedUpIcon="offlineIcon" selectedOverIcon="offlineIcon" selectedDownIcon="offlineIcon" selectedDisabledIcon="offlineIcon" isSelected="{mediaProxy.isOffline}" visible="{mediaProxy.isLive}" includeInLayout="{mediaProxy.isLive}" mouseEnable="false" useHandCursor=""/>';

        if (uiconf_id == '6709439' || uiconf_id == '6709440' || uiconf_id == '6709441'){
            if(playlist_previous){
                configFile += '<Button id="previousBtnControllerScreen" kClick="sendNotification(\'playlistPlayPrevious\')" height="22" focusRectPadding="0" buttonType="iconButton" styleName="controllerScreen" icon="PreviousIcon" tooltip="'+playlist_previous_tooltip+'" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';           
            }
        
            if(playlist_next){
                configFile += '<Button id="nextBtnControllerScreen" kClick="sendNotification(\'playlistPlayNext\')" focusRectPadding="0" height="22" buttonType="iconButton" icon="NextIcon" styleName="controllerScreen" tooltip="'+playlist_next_tooltip+'" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
            }  
        }

        configFile += '<HBox id="seekBox" width="100%" height="30" visible="{mediaProxy.canSeek}" verticalAlign="middle" horizontalGap="9">'+
        '<Button id="goLiveBtn" buttonType="labelButton" textPadding="0" height="20" color1="0xCECECE" color2="0xFFFFFF" kClick="sendNotification(\'goLive\')" visible="{mediaProxy.isLive}" includeInLayout="{mediaProxy.isLive}" label="Live" styleName="controllerScreen"/>';

        if(scrub){
            configFile += '<VBox id="scrubberContainer" width="100%" height="30" verticalAlign="middle" verticalGap="-3" supportEnableGui="false">'+
            '<Spacer height="10"/>'+
            '<Scrubber id="scrubber" width="100%" height="10" styleName="" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_icons_color.replace("#","0x")+'"/>'+
            '<HBox width="100%">';
            if(leftplay){
                configFile += '<Timer id="timerControllerScreen1" width="60" styleName="timerProgressLeft" format="mm:ss" height="12" timerType="'+flashvars['timerControllerScreen1.timerType']+'" dynamicColor="true" color1="'+style_icons_color.replace("#","0x")+'"/>';
            }
            configFile += '<Spacer width="100%" height="8"/>';
        
            if(rightplay){
                configFile += '<Timer id="timerControllerScreen2" width="60" styleName="timerProgressRight" format="mm:ss" height="12" timerType="'+flashvars['timerControllerScreen2.timerType']+'" dynamicColor="true" color1="'+style_icons_color.replace("#","0x")+'"/>';  
            }
        
            configFile += '</HBox>'+
        '</VBox>';
        }
        
        configFile += '</HBox>';
         
        if(vol){
            configFile += '<VolumeBar id="volumeBar" styleName="volumeBtn" buttonWidth="20" width="20" height="20" buttonType="iconButton" tooltip="'+flashvars['volumeBar.tooltip']+'" initialValue="'+flashvars['volumeBar.initialValue']+'" forceInitialValue="'+flashvars['volumeBar.forceInitialValue']+'" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
        }
    
        if(share){
            if(share_controls){
                configFile += '<Button id="kalturaShareBtnControllerScreen" buttonType="iconButton" kClick="sendNotification(\'showAdvancedShare\')" height="22" styleName="controllerScreen" focusRectPadding="0" icon="shareIcon" tooltip="'+flashvars['shareBtnControllerScreen.tooltip']+'" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
            }
        }
    
        if(download){
            if(download_controls){
                configFile += '<Button id="downloadBtnControllerScreen" focusRectPadding="0" buttonType="iconButton" kClick="sendNotification(\'doDownload\')" height="22" icon="downloadIcon" styleName="controllerScreen" tooltip="'+flashvars['downloadBtnControllerScreen.tooltip']+'" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
            }
        }
    
        if(thumbnail){
            if(thumbnail_controls){
                configFile += '<Button id="captureThumbBtnControllerScreen" kClick="sendNotification(\'captureThumbnail\')" height="22" buttonType="iconButton" focusRectPadding="0" icon="thumbIcon" styleName="controllerScreen" tooltip="'+flashvars['captureThumbBtnControllerScreen.tooltip']+'" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
            }
        }
    
        if(flavor){
            configFile += '<FlavorCombo id="flavorComboControllerScreen" width="80" streamerType="{configProxy.flashvars.streamerType}" flavorDataProvider="{mediaProxy.kalturaMediaFlavorArray}" styleName="_kdp" color1="'+style_icons_color.replace("#","0x")+'" hdOn="'+flashvars['flavorComboControllerScreen.hdOn']+'" hdOff="'+flashvars['flavorComboControllerScreen.hdOff']+'" selectedMessage="" autoMessage="'+flashvars['flavorComboControllerScreen.autoMessage']+'" preferedFlavorBR="{mediaProxy.preferedFlavorBR}" tooltip="{flavorComboControllerScreen.selectedMessage}" usePixels="{mediaProxy.displayFlavorPixels}" isAutoSwitch="{mediaProxy.autoSwitchFlavors}" visible="true" includeInLayout="true"/>';
        }
    
        if(fullscreen){
            if(fullscreen_controls){
                configFile += '<Button id="fullScreenBtnControllerScreen" command="fullScreen" buttonType="iconButton" height="22" styleName="controllerScreen" icon="openFullScreenIcon" selectedUpIcon="closeFullScreenIcong" selectedOverIcon="closeFullScreenIcon" selectedDownIcon="closeFullScreenIcon" selectedDisabledIcon="closeFullScreenIcon" focusRectPadding="0" allowDisable="false" tooltip="Toggle fullscreen" k_buttonType="buttonIconControllerArea" upTooltip="'+flashvars['fullScreenBtnControllerScreen.upTooltip']+'" selectedTooltip="'+flashvars['fullScreenBtnControllerScreen.selectedTooltip']+'" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
            }
        }
        
        if(customButton1){
            if(customButton1_controls){
                configFile += '<Button id="custom1BtnControllerScreen" height="22" focusRectPadding="0" buttonType="iconButton" kClick="jsCall(\'customFunc1\', mediaProxy.entry.id )" tooltip="'+flashvars['custom1BtnControllerScreen.tooltip']+'" styleName="controllerScreen" icon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
            }
        }
    
        if(customButton2){
            if(customButton2_controls){
                configFile += '<Button id="custom2BtnControllerScreen" height="22" focusRectPadding="0" buttonType="iconButton" kClick="jsCall(\'customFunc2\', mediaProxy.entry.id )" tooltip="'+flashvars['custom2BtnControllerScreen.tooltip']+'" styleName="controllerScreen" icon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
            }
        }
    
        if(customButton3){
            if(customButton3_controls){
                configFile += '<Button id="custom3BtnControllerScreen" height="22" focusRectPadding="0" buttonType="iconButton" kClick="jsCall(\'customFunc3\', mediaProxy.entry.id )" tooltip="'+flashvars['custom3BtnControllerScreen.tooltip']+'" styleName="controllerScreen" icon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
            }
        }
    
        if(customButton4){
            if(customButton4_controls){
                configFile += '<Button id="custom4BtnControllerScreen" height="22" focusRectPadding="0" buttonType="iconButton" kClick="jsCall(\'customFunc4\', mediaProxy.entry.id )" tooltip="'+flashvars['custom4BtnControllerScreen.tooltip']+'" styleName="controllerScreen" icon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
            }
        }    
    
        if(customButton5){
            if(customButton5_controls){
                configFile += '<Button id="custom5BtnControllerScreen" height="22" focusRectPadding="0" buttonType="iconButton" kClick="jsCall(\'customFunc5\', mediaProxy.entry.id )" tooltip="'+flashvars['custom5BtnControllerScreen.tooltip']+'" styleName="controllerScreen" icon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
            }
        }        
        
        var playlist_holder = '';
        if (uiconf_id == '6709439' || uiconf_id == '6709440' || uiconf_id == '6709441'){
            var multi_playlist = '';
            if(uiconf_id == '6709441'){
                multi_playlist = '<VBox id="tabBarHolder" width="100%" height="26" styleName="tabBg" hideInFullScreen="true">'+
                '<Spacer height="8"/>'+
                '<Plugin id="tabBar" width="100%" height="26" rightArrowIcon="List_scrollRightArrowUp_default_icon" leftArrowIcon="List_scrollLeftArrowUp_default_icon" buttonType="iconButton" dataProvider="{playlistAPI.multiPlaylistDataProvider}" font="'+style_fontfamily+'" color1="'+style_onvideo_icons_color.replace("#","0x")+'"/>'+
                '</VBox>';
            }
            if(playlist_visible){
                var width, height;
                if(uiconf_id == '6709440'){
                    width = '100%';
                    height = '290';
                } else {
                    width = '340';
                    height = '100%';
                }
                playlist_holder = '<Canvas id="playlistHolder" width="'+width+'" height="'+height+'" hideInFullScreen="true">'+
                '<VBox id="playlist" width="'+width+'" height="'+height+'" styleName="List_background_default">'+
                multi_playlist+
                '<Spacer height="8"/>'+
                '<HBox id="playlistPadding" width="100%" height="100%" styleName="List_background_default">'+
                '<Spacer width="8"/>'+
                '<Plugin id="list" width="100%" height="100%" styleName="List_background_default" dataProvider="{playlistAPI.dataProvider}" itemRenderer="playlistItemRenderer" rowHeight="'+playlist_rowHeight+'"/>'+
                '<Spacer width="8"/>'+
                '</HBox>'+
                '<Spacer height="8"/>'+
                '</VBox>'+
                '</Canvas>';
            }
        }

        configFile += '</HBox>'+
        '<Spacer width="13"/>'+
        '<Button id="kalturaLogo" height="50" width="100" kClick="navigate(\'http://www.kaltura.com\')" styleName="controllerScreen" icon="kalturaLogo"/>'+
        '<Spacer width="13"/>'+
        '</HBox>'+
        controls_bottom+
        '</VBox>'+
        playlist_holder+
        '</'+box+'>';
    
        configFile += '<screens>'+
        '<screen id="startScreen">'+
        '<VBox id="startContainer" width="100%" height="100%" verticalAlign="middle" horizontalAlign="center">'+
        '<Spacer width="100%"/>'+
        '<Tile id="startTile" width="100%" verticalGap="10" verticalAlign="middle" horizontalAlign="center">';

        if(ovplay){
            if(ovplay_video){
                if(ovplay_before){
                    configFile += '<Button id="onVideoPlayBtnStartScreen" command="play" buttonType="onScreenButton" minWidth="60" labelPlacement="top" label="'+flashvars['onVideoPlayBtnStartScreen.label']+'" tooltip="'+flashvars['onVideoPlayBtnStartScreen.tooltip']+'" styleName="onScreenBtn" upIcon="playIcon" overIcon="playIcon" downIcon="playIcon" disabeledIcon="playIcon" selectedUpIcon="playIcon" selectedOverIcon="playIcon" selectedDownIcon="playIcon" selectedDisabledIcon="playIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }  
            }        
        }
        
        if(share){
            if(share_video){
                if(share_before){
                    configFile += '<Button id="kalturaShareBtnStartScreen" kClick="sendNotification(\'showAdvancedShare\')" buttonType="onScreenButton" minWidth="60" labelPlacement="top" label="'+flashvars['shareBtnStartScreen.label']+'" tooltip="'+flashvars['shareBtnStartScreen.tooltip']+'" styleName="onScreenBtn" upIcon="shareIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
    
        if(download){
            if(download_video){
                if(download_before){
                    configFile += '<Button id="downloadBtnStartScreen" kClick="sendNotification(\'doDownload\')" label="'+flashvars['downloadBtnStartScreen.label']+'" tooltip="'+flashvars['downloadBtnStartScreen.tooltip']+'" buttonType="onScreenButton" minWidth="60" labelPlacement="top" upIcon="downloadIcon" styleName="onScreenBtn" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
    
        if(thumbnail){
            if(thumbnail_video){
                if(thumbnail_before){
                    configFile += '<Button id="captureThumbBtnStartScreen" kClick="sendNotification(\'captureThumbnail\')" buttonType="onScreenButton" minWidth="60" labelPlacement="top" label="'+flashvars['captureThumbBtnStartScreen.label']+'" tooltip="'+flashvars['captureThumbBtnStartScreen.tooltip']+'" upIcon="thumbIcon" styleName="onScreenBtn" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>'
                }
            }
        }
    
        if(fullscreen){
            if(fullscreen_video){
                if(fullscreen_before){
                    configFile += '<Button id="fullScreenBtnStartScreen" command="fullScreen" label="'+flashvars['fullScreenBtnStartScreen.label']+'" styleName="onScreenBtn" buttonType="onScreenButton" minWidth="60" labelPlacement="top" upIcon="openFullScreenIcon" overIcon="openFullScreenIcon" downIcon="openFullScreenIcon" disabeledIcon="openFullScreenIcon" selectedUpIcon="closeFullScreenIcon" selectedOverIcon="closeFullScreenIcon" selectedDownIcon="closeFullScreenIcon" selectedDisabledIcon="closeFullScreenIcon" upTooltip="'+flashvars['fullScreenBtnControllerScreen.upTooltip']+'" selectedTooltip="'+flashvars['fullScreenBtnControllerScreen.selectedTooltip']+'" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
        
        if(customButton1){
            if(customButton1_video){
                if(customButton1_before){
                    configFile += '<Button id="custom1BtnStartScreen" label="'+flashvars['custom1BtnStartScreen.label']+'" tooltip="'+flashvars['custom1BtnStartScreen.tooltip']+'" kClick="jsCall(\'customFunc1\', mediaProxy.entry.id )" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" icon="generalIcon" upIcon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
    
        if(customButton2){
            if(customButton2_video){
                if(customButton2_before){
                    configFile += '<Button id="custom2BtnStartScreen" label="'+flashvars['custom2BtnStartScreen.label']+'" tooltip="'+flashvars['custom2BtnStartScreen.tooltip']+'" kClick="jsCall(\'customFunc2\', mediaProxy.entry.id )" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" icon="generalIcon" upIcon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
    
        if(customButton3){
            if(customButton3_video){
                if(customButton3_before){
                    configFile += '<Button id="custom3BtnStartScreen" label="'+flashvars['custom3BtnStartScreen.label']+'" tooltip="'+flashvars['custom3BtnStartScreen.tooltip']+'" kClick="jsCall(\'customFunc3\', mediaProxy.entry.id )" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" icon="generalIcon" upIcon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }    
    
        if(customButton4){
            if(customButton4_video){
                if(customButton4_before){
                    configFile += '<Button id="custom4BtnStartScreen" label="'+flashvars['custom4BtnStartScreen.label']+'" tooltip="'+flashvars['custom4BtnStartScreen.tooltip']+'" kClick="jsCall(\'customFunc4\', mediaProxy.entry.id )" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" icon="generalIcon" upIcon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        } 
    
        if(customButton5){
            if(customButton5_video){
                if(customButton5_before){
                    configFile += '<Button id="custom5BtnStartScreen" label="'+flashvars['custom5BtnStartScreen.label']+'" tooltip="'+flashvars['custom5BtnStartScreen.tooltip']+'" kClick="jsCall(\'customFunc5\', mediaProxy.entry.id )" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" icon="generalIcon" upIcon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        } 
        
        if(unmute){
            if(unmute_video){
                if(unmute_before){
                    configFile += '<Button id="unmuteBtnStartScreen" kClick="sendNotification(\'changeVolume\',1)" label="'+flashvars['unmuteBtnStartScreen.label']+'" tooltip="'+flashvars['unmuteBtnStartScreen.tooltip']+'" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" upIcon="Button_upIcon_volumeBtn" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
        
        configFile += '</Tile>'+
        '<Spacer width="100%"/>'+
        '</VBox>'+
        '</screen>'+
        '<screen id="pauseScreen">'+
        '<VBox id="pauseContainer" width="100%" height="100%" verticalAlign="middle" horizontalAlign="center">'+
        '<Spacer height="100%"/>'+
        '<Tile id="pauseTile" width="100%" verticalGap="10" verticalAlign="middle" horizontalAlign="center">';

        if(ovplay){
            if(ovplay_video){
                if(ovplay_paused){
                    configFile += '<Button id="onVideoPlayBtnPauseScreen" command="play" buttonType="onScreenButton" minWidth="60" labelPlacement="top" label="'+flashvars['onVideoPlayBtnPauseScreen.label']+'" tooltip="'+flashvars['onVideoPlayBtnPauseScreen.tooltip']+'" styleName="onScreenBtn" upIcon="playIcon" overIcon="playIcon" downIcon="playIcon" disabeledIcon="playIcon" selectedUpIcon="playIcon" selectedOverIcon="playIcon" selectedDownIcon="playIcon" selectedDisabledIcon="playIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
    
        if(share){
            if(share_video){
                if(share_paused){
                    configFile += '<Button id="kalturaShareBtnPauseScreen" kClick="sendNotification(\'showAdvancedShare\')" buttonType="onScreenButton" minWidth="60" labelPlacement="top" label="'+flashvars['shareBtnPauseScreen.label']+'" tooltip="'+flashvars['shareBtnPauseScreen.tooltip']+'" styleName="onScreenBtn" upIcon="shareIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
    
        if(download){
            if(download_video){
                if(download_paused){
                    configFile += '<Button id="downloadBtnPauseScreen" kClick="sendNotification(\'doDownload\')" label="'+flashvars['downloadBtnPauseScreen.label']+'" tooltip="'+flashvars['downloadBtnPauseScreen.tooltip']+'" upIcon="downloadIcon" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
    
        if(thumbnail){
            if(thumbnail_video){
                if(thumbnail_paused){
                    configFile += '<Button id="captureThumbBtnPauseScreen" kClick="sendNotification(\'captureThumbnail\')" buttonType="onScreenButton" minWidth="60" labelPlacement="top" upIcon="thumbIcon" label="'+flashvars['captureThumbBtnPauseScreen.label']+'" tooltip="'+flashvars['captureThumbBtnPauseScreen.tooltip']+'" styleName="onScreenBtn" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
    
        if(fullscreen){
            if(fullscreen_video){
                if(fullscreen_paused){
                    configFile += '<Button id="fullScreenBtnPauseScreen" command="fullScreen" label="'+flashvars['fullScreenBtnPauseScreen.label']+'" styleName="onScreenBtn" buttonType="onScreenButton" minWidth="60" labelPlacement="top" upIcon="openFullScreenIcon" overIcon="openFullScreenIcon" downIcon="openFullScreenIcon" disabeledIcon="openFullScreenIcon" selectedUpIcon="closeFullScreenIcon" selectedOverIcon="closeFullScreenIcon" selectedDownIcon="closeFullScreenIcon" selectedDisabledIcon="closeFullScreenIcon" upTooltip="'+flashvars['fullScreenBtnPauseScreen.upTooltip']+'" selectedTooltip="'+flashvars['fullScreenBtnPauseScreen.selectedTooltip']+'" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
    
        if(customButton1){
            if(customButton1_video){
                if(customButton1_paused){
                    configFile += '<Button id="custom1BtnPauseScreen" label="'+flashvars['custom1BtnPauseScreen.label']+'" tooltip="'+flashvars['custom1BtnPauseScreen.tooltip']+'" kClick="jsCall(\'customFunc1\', mediaProxy.entry.id )" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" upIcon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
    
        if(customButton2){
            if(customButton2_video){
                if(customButton2_paused){
                    configFile += '<Button id="custom2BtnPauseScreen" label="'+flashvars['custom2BtnPauseScreen.label']+'" tooltip="'+flashvars['custom2BtnPauseScreen.tooltip']+'" kClick="jsCall(\'customFunc2\', mediaProxy.entry.id )" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" upIcon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }  
    
        if(customButton3){
            if(customButton3_video){
                if(customButton3_paused){
                    configFile += '<Button id="custom3BtnPauseScreen" label="'+flashvars['custom3BtnPauseScreen.label']+'" tooltip="'+flashvars['custom3BtnPauseScreen.tooltip']+'" kClick="jsCall(\'customFunc3\', mediaProxy.entry.id )" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" upIcon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }       
    
        if(customButton4){
            if(customButton4_video){
                if(customButton4_paused){
                    configFile += '<Button id="custom4BtnPauseScreen" label="'+flashvars['custom4BtnPauseScreen.label']+'" tooltip="'+flashvars['custom4BtnPauseScreen.tooltip']+'" kClick="jsCall(\'customFunc4\', mediaProxy.entry.id )" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" upIcon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }    
    
        if(customButton5){
            if(customButton5_video){
                if(customButton5_paused){
                    configFile += '<Button id="custom5BtnPauseScreen" label="'+flashvars['custom5BtnPauseScreen.label']+'" tooltip="'+flashvars['custom5BtnPauseScreen.tooltip']+'" kClick="jsCall(\'customFunc5\', mediaProxy.entry.id )" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" upIcon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }     
    
        if(unmute){
            if(unmute_video){
                if(unmute_paused){
                    configFile += '<Button id="unmuteBtnPauseScreen" kClick="sendNotification(\'changeVolume\',1)" label="'+flashvars['unmuteBtnPauseScreen.label']+'" tooltip="'+flashvars['unmuteBtnPauseScreen.tooltip']+'" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" upIcon="Button_upIcon_volumeBtn" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
    
        configFile += '</Tile>'+
        '<Spacer height="100%"/>'+
        '</VBox>'+
        '</screen>'+
        '<screen id="playScreen">'+
        '<VBox id="playContainer" width="100%" height="100%" verticalAlign="middle" horizontalAlign="center">'+
        '<Spacer height="100%"/>'+
        '<Tile id="playTile" width="100%" verticalGap="10" verticalAlign="middle" horizontalAlign="center">';

        if(share){
            if(share_video){
                if(share_during){
                    configFile += '<Button id="kalturaShareBtnPlayScreen" kClick="sendNotification(\'showAdvancedShare\')" buttonType="onScreenButton" minWidth="60" labelPlacement="top" label="'+flashvars['shareBtnPlayScreen.label']+'" tooltip="'+flashvars['shareBtnPlayScreen.tooltip']+'" styleName="onScreenBtn" upIcon="shareIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
    
        if(download){
            if(download_video){
                if(download_during){
                    configFile += '<Button id="downloadBtnPlayScreen" kClick="sendNotification(\'doDownload\')" label="'+flashvars['downloadBtnPlayScreen.label']+'" tooltip="'+flashvars['downloadBtnPlayScreen.tooltip']+'" upIcon="downloadIcon" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
    
        if(thumbnail){
            if(thumbnail_video){
                if(thumbnail_during){
                    configFile += '<Button id="captureThumbBtnPlayScreen" kClick="sendNotification(\'captureThumbnail\')" buttonType="onScreenButton" minWidth="60" labelPlacement="top" upIcon="thumbIcon" label="'+flashvars['captureThumbBtnPlayScreen.label']+'" tooltip="'+flashvars['captureThumbBtnPlayScreen.label']+'" styleName="onScreenBtn" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
    
        if(fullscreen){
            if(fullscreen_video){
                if(fullscreen_during){
                    configFile += '<Button id="fullScreenBtnPlayScreen" command="fullScreen" label="'+flashvars['fullScreenBtnPlayScreen.label']+'" styleName="onScreenBtn" buttonType="onScreenButton" minWidth="60" labelPlacement="top" upIcon="openFullScreenIcon" overIcon="openFullScreenIcon" downIcon="openFullScreenIcon" disabeledIcon="openFullScreenIcon" selectedUpIcon="closeFullScreenIcon" selectedOverIcon="closeFullScreenIcon" selectedDownIcon="closeFullScreenIcon" selectedDisabledIcon="closeFullScreenIcon" upTooltip="'+flashvars['fullScreenBtnPlayScreen.upTooltip']+'" selectedTooltip="'+flashvars['fullScreenBtnPlayScreen.selectedTooltip']+'" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
    
        if(customButton1){
            if(customButton1_video){
                if(customButton1_during){
                    configFile += '<Button id="custom1BtnPlayScreen" label="'+flashvars['custom1BtnPlayScreen.label']+'" tooltip="'+flashvars['custom1BtnPlayScreen.tooltip']+'" kClick="jsCall(\'customFunc1\', mediaProxy.entry.id )" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" upIcon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
    
        if(customButton2){
            if(customButton2_video){
                if(customButton2_during){
                    configFile += '<Button id="custom2BtnPlayScreen" label="'+flashvars['custom2BtnPlayScreen.label']+'" tooltip="'+flashvars['custom2BtnPlayScreen.tooltip']+'" kClick="jsCall(\'customFunc2\', mediaProxy.entry.id )" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" upIcon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }  
    
        if(customButton3){
            if(customButton3_video){
                if(customButton3_during){
                    configFile += '<Button id="custom3BtnPlayScreen" label="'+flashvars['custom3BtnPlayScreen.label']+'" tooltip="'+flashvars['custom3BtnPlayScreen.tooltip']+'" kClick="jsCall(\'customFunc3\', mediaProxy.entry.id )" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" upIcon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }       
    
        if(customButton4){
            if(customButton4_video){
                if(customButton4_during){
                    configFile += '<Button id="custom4BtnPlayScreen" label="'+flashvars['custom4BtnPlayScreen.label']+'" tooltip="'+flashvars['custom4BtnPlayScreen.tooltip']+'" kClick="jsCall(\'customFunc4\', mediaProxy.entry.id )" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" upIcon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }    
    
        if(customButton5){
            if(customButton5_video){
                if(customButton5_during){
                    configFile += '<Button id="custom5BtnPlayScreen" label="'+flashvars['custom5BtnPlayScreen.label']+'" tooltip="'+flashvars['custom5BtnPlayScreen.tooltip']+'" kClick="jsCall(\'customFunc5\', mediaProxy.entry.id )" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" upIcon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }     
    
        if(unmute){
            if(unmute_video){
                if(unmute_during){
                    configFile += '<Button id="unmuteBtnPlayScreen" kClick="sendNotification(\'changeVolume\',1)" label="'+flashvars['unmuteBtnPlayScreen.label']+'" tooltip="'+flashvars['unmuteBtnPlayScreen.tooltip']+'" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" upIcon="Button_upIcon_volumeBtn" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
        
        configFile += '</Tile>'+
        '<Spacer height="100%"/>'+
        '</VBox>'+
        '</screen>'+
        '<screen id="endScreen">'+
        '<VBox id="endContainer" width="100%" height="100%" verticalAlign="middle" horizontalAlign="center">'+
        '<Spacer height="100%"/>'+
        '<Tile id="endTile" width="100%" verticalGap="10" verticalAlign="middle" horizontalAlign="center">';

        if(replay){
            configFile += '<Button id="replayBtnEndScreen" kClick="sendNotification(\'doPlay\')" buttonType="onScreenButton" minWidth="60" labelPlacement="top" label="'+flashvars['replayBtnEndScreen.label']+'" tooltip="'+flashvars['replayBtnEndScreen.tooltip']+'" styleName="onScreenBtn" upIcon="replayIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
        }
    
        if(share){
            if(share_video){
                if(share_end){
                    configFile += '<Button id="kalturaShareBtnEndScreen" kClick="sendNotification(\'showAdvancedShare\')" buttonType="onScreenButton" minWidth="60" labelPlacement="top" label="'+flashvars['shareBtnEndScreen.label']+'" tooltip="'+flashvars['shareBtnEndScreen.tooltip']+'" styleName="onScreenBtn" upIcon="shareIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
    
        if(download){
            if(download_video){
                if(download_end){
                    configFile += '<Button id="downloadBtnEndScreen" kClick="sendNotification(\'doDownload\')" label="'+flashvars['downloadBtnEndScreen.label']+'" tooltip="'+flashvars['downloadBtnEndScreen.tooltip']+'" upIcon="downloadIcon" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
    
        if(thumbnail){
            if(thumbnail_video){
                if(thumbnail_end){
                    configFile += '<Button id="captureThumbBtnEndScreen" kClick="sendNotification(\'captureThumbnail\')" buttonType="onScreenButton" minWidth="60" labelPlacement="top" upIcon="thumbIcon" label="'+flashvars['captureThumbBtnEndScreen.label']+'" tooltip="'+flashvars['captureThumbBtnEndScreen.tooltip']+'" styleName="onScreenBtn" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
    
        if(fullscreen){
            if(fullscreen_video){
                if(fullscreen_end){
                    configFile += '<Button id="fullScreenBtnEndScreen" command="fullScreen" label="'+flashvars['fullScreenBtnEndScreen.label']+'" styleName="onScreenBtn" buttonType="onScreenButton" minWidth="60" labelPlacement="top" upIcon="openFullScreenIcon" overIcon="openFullScreenIcon" downIcon="openFullScreenIcon" disabeledIcon="openFullScreenIcon" selectedUpIcon="closeFullScreenIcon" selectedOverIcon="closeFullScreenIcon" selectedDownIcon="closeFullScreenIcon" selectedDisabledIcon="closeFullScreenIcon" upTooltip="'+flashvars['fullScreenBtnEndScreen.upTooltip']+'" selectedTooltip="'+flashvars['fullScreenBtnEndScreen.selectedTooltip']+'" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
    
        if(customButton1){
            if(customButton1_video){
                if(customButton1_end){
                    configFile += '<Button id="custom1BtnEndScreen" label="'+flashvars['custom1BtnEndScreen.label']+'" tooltip="'+flashvars['custom1BtnEndScreen.tooltip']+'" kClick="jsCall(\'customFunc1\', mediaProxy.entry.id )" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" upIcon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
    
        if(customButton2){
            if(customButton2_video){
                if(customButton2_end){
                    configFile += '<Button id="custom2BtnEndScreen" label="'+flashvars['custom2BtnEndScreen.label']+'" tooltip="'+flashvars['custom2BtnEndScreen.tooltip']+'" kClick="jsCall(\'customFunc2\', mediaProxy.entry.id )" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" upIcon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }  
    
        if(customButton3){
            if(customButton3_video){
                if(customButton3_end){
                    configFile += '<Button id="custom3BtnEndScreen" label="'+flashvars['custom3BtnEndScreen.label']+'" tooltip="'+flashvars['custom3BtnEndScreen.tooltip']+'" kClick="jsCall(\'customFunc3\', mediaProxy.entry.id )" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" upIcon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }       
    
        if(customButton4){
            if(customButton4_video){
                if(customButton4_end){
                    configFile += '<Button id="custom4BtnEndScreen" label="'+flashvars['custom4BtnEndScreen.label']+'" tooltip="'+flashvars['custom4BtnEndScreen.tooltip']+'" kClick="jsCall(\'customFunc4\', mediaProxy.entry.id )" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" upIcon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }    
    
        if(customButton5){
            if(customButton5_video){
                if(customButton5_end){
                    configFile += '<Button id="custom5BtnEndScreen" label="'+flashvars['custom5BtnEndScreen.label']+'" tooltip="'+flashvars['custom5BtnEndScreen.tooltip']+'" kClick="jsCall(\'customFunc5\', mediaProxy.entry.id )" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" upIcon="generalIcon" k_buttonType="buttonIconControllerArea" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }     
    
        if(unmute){
            if(unmute_video){
                if(unmute_end){
                    configFile += '<Button id="unmuteBtnEndScreen" kClick="sendNotification(\'changeVolume\',1)" label="'+flashvars['unmuteBtnEndScreen.label']+'" tooltip="'+flashvars['unmuteBtnEndScreen.tooltip']+'" buttonType="onScreenButton" minWidth="60" labelPlacement="top" styleName="onScreenBtn" upIcon="Button_upIcon_volumeBtn" color1="'+style_icons_color.replace("#","0x")+'" color2="'+style_mouse_color.replace("#","0x")+'" color3="'+style_onvideo_button_color.replace("#","0x")+'" color4="'+style_onvideo_mouse_color.replace("#","0x")+'" color5="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
                }
            }
        }
        
        var playlistrender = '';
    
        if (uiconf_id == '6709439' || uiconf_id == '6709440' || uiconf_id == '6709441'){
            playlistrender = '<renderers>'+
            '<renderer id="playlistItemRenderer">'+
            '<HBox id="irCont" height="100%" width="100%" x="10" y="10" verticalAlign="top" paddingRight="20" styleName="Button_upSkin_default">';
            if(playlist_thumbnail){
                playlistrender += '<Image id="irImageIrScreen" height="48" width="72" url="{this.thumbnailUrl}" source="{this.thumbnailUrl}"/>';
            }
            playlistrender += '<VBox height="100%" width="100%" id="labelsHolder" verticalGap="0">';
            if(playlist_name || playlist_duration){
                playlistrender += '<HBox id="nameAndDuration" width="100%" height="18">';
                if(playlist_name){
                    playlistrender += '<Label id="irLinkIrScreen" height="18" width="100%" text="{this.name}" styleName="itemRendererLabel" label="{this.name}" prefix="" dynamicColor="true" color1="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';  
                }
                if(playlist_duration){
                    playlistrender += '<Label id="irDurationIrScreen" height="18" width="70" text="{formatDate(this.duration, \'NN:SS\')}" styleName="itemRendererLabel" prefix="" dynamicColor="true" color1="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>'; 
                }
                playlistrender += '</HBox>';
            }
            if(playlist_description){
                playlistrender += '<Label id="irDescriptionIrScreen" width="100%" height="18" text="{this.description}" styleName="itemRendererLabel" prefix="" dynamicColor="true" color1="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
            }
            if(playlist_plays){
                playlistrender += '<Label id="irPlaysIrScreen" width="100%" height="18" text="Plays: {this.plays}" styleName="itemRendererLabel" prefix="" dynamicColor="true" color1="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
            }
            if(playlist_rank){
                playlistrender += '<Label id="irRankIrScreen" width="100%" height="18" text="Rank: {this.rank}" styleName="itemRendererLabel" prefix="" dynamicColor="true" color1="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
            }
            if(playlist_votes){
                playlistrender += '<Label id="irVotesIrScreen" width="100%" height="18" text="{this.votes} votes" styleName="itemRendererLabel" prefix="" dynamicColor="true" color1="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
            }
            if(playlist_tags){
                playlistrender += '<Label id="irTagsIrScreen" width="100%" height="18" text="Tags: {this.tags}" styleName="itemRendererLabel" prefix="" dynamicColor="true" color1="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
            }
            if(playlist_admintags){
                playlistrender += '<Label id="irAdminTagsIrScreen" width="100%" height="18" text="Categories: {this.adminTags}" styleName="itemRendererLabel" prefix="" dynamicColor="true" color1="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
            }
            if(playlist_createddate){
                playlistrender += '<Label id="irCreatedAtIrScreen" width="100%" height="18" text="Created at: {formatDate(this.createdAt, \'DD/MM/YYY\')}" styleName="itemRendererLabel" prefix="" dynamicColor="true" color1="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
            }
            if(playlist_createdby){
                playlistrender += '<Label id="irCreatedByIrScreen" width="100%" height="18" text="Created by: {this.userScreenName}" styleName="itemRendererLabel" label="Created by: {this.userScreenName}" prefix="" dynamicColor="true" color1="'+style_onvideo_icons_color.replace("#","0x")+'" font="'+style_fontfamily+'"/>';
            }
            playlistrender += '</VBox>'+
        '</HBox>'+
        '</renderer>'+
        '</renderers>';
        }

        configFile += '</Tile>'+
        '<Spacer height="100%"/>'+
        '</VBox>'+
        '</screen>'+
        '</screens>'+
        playlistrender+
        '<strings>'+
        '<string key="ENTRY_CONVERTING" value="Entry is processing, please try again in a few minutes."/>'+
        '</strings>'+
        '<extraData></extraData>';
        
        var multi_feature = '';
        if(uiconf_id == '6709441'){
            var plist_arr = [];
            $('#plist-entries .mCSB_container div.entry-wrapper').each(function() {
                plist_arr.push({
                    'id':$(this).attr("data-entryid"),
                    'name':$(this).attr("data-name")
                });            
            });
            var i=0;
            $.each(plist_arr, function(key, value) {
                multi_feature += '<var key="kpl'+i+'EntryId" value="'+value.id+'"/>';
                multi_feature += '<var key="playlistAPI.kpl'+i+'Url" value="http%3A%2F%2Fmediaplatform.streamingmediahosting.com%2Findex.php%2Fpartnerservices2%2Fexecuteplaylist%3Fplaylist_id%3D'+value.id+'%26partner_id%3D'+sessInfo.pid+'%26subp_id%3D'+sessInfo.pid+'00%26format%3D8%26ks%3D%7Bks%7D"/>';
                multi_feature += '<var key="playlistAPI.kpl'+i+'Name" value="'+value.name+'"/>';
                i++;
            });
        }

        var custom_icon = '';
        if(user_icon){
            custom_icon += '<var key="mylogo.plugin" value="true"/>';
            custom_icon += '<var key="mylogo.className" value="Watermark"/>';
            custom_icon += '<var key="mylogo.width" value="'+user_icon_width+'"/>';
            custom_icon += '<var key="mylogo.height" value="'+user_icon_height+'"/>';
            custom_icon += '<var key="mylogo.watermarkPath" value="'+user_icon_url+'"/>';
            custom_icon += '<var key="mylogo.watermarkClickPath" value="'+user_icon_clickurl+'"/>';
            custom_icon += '<var key="mylogo.position" value="after"/>';
            custom_icon += '<var key="mylogo.relativeTo" value="kalturaLogo"/>';
        }
        
        configFile += '<plugins/>'+
        '<uiVars>'+
        '<var key="video.keepAspectRatio" value="'+origMedia+'"/>'+
        '<var key="playlistAPI.autoContinue" value="'+playlist_autocontinue+'"/>'+
        '<var key="playlistAPI.loop" value="'+playlist_loop+'"/>'+
        '<var key="playlistHolder.visible" value="'+playlist_visible+'"/>'+
        '<var key="playlistHolder.includeInLayout" value="'+playlist_visible+'"/>'+
        '<var key="imageDefaultDuration" value="'+playlist_imageduration+'"/>'+
        '<var key="autoPlay" value="'+playOnload+'"/>'+
        '<var key="autoMute" value="'+playerMute+'"/>'+
        '<var key="Kaltura.ForceFlashOnDesktop" value="false"/>'+
        '<var key="reloadOnPlayLS" value="true"/>'+
        multi_feature+
        custom_icon+
        '</uiVars>'+
        '</layout>';
    
        return configFile;

    },
    htmlEntities:function(str){
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    },
    //Escapes special characters
    escape:function(text){
        return text.replace(/'/g, "&#039;").replace(/"/g, "&quot;").replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;");
    },
    h2d:function(h){
        return parseInt(h,16);
    },
    d2h:function(d){
        return '#'+Number(d).toString(16);
    },
    //Set default player flashvars
    defaultPlayerSettings:function(){
        if(uiconf_id == '6709438'){  
            width = '400';
            height = '330';
            player_entryid = '0_18cc4fqm';
        } else if(uiconf_id == '6709442'){
            width = '400';
            height = '330';
            player_entryid = '0_18cc4fqm';
        } else if (uiconf_id == '6709439' || uiconf_id == '6709441'){ 
            width = '740';
            height = '330';  
            player_entryid = '0_4kegnhto';
            playlist_thumbnail = true;
            playlist_name = true;
            playlist_description = true;
            playlist_duration = true;
            playlist_plays = false;
            playlist_rank = false;
            playlist_votes = false;
            playlist_tags = false;
            playlist_admintags = false;
            playlist_createddate = false;
            playlist_createdby = false;
            playlist_previous = true;
            playlist_previous_tooltip = "Previous";
            playlist_next = true;
            playlist_next_tooltip = "Next";
            playlist_autocontinue = false;
            playlist_loop = false;
            playlist_visible = true;
            playlist_imageduration = 2;
            playlist_rowHeight = 30;
            playlist_items = 0;
            
            if(playlist_description){
                playlist_items++;
            }
            if(playlist_plays){
                playlist_items++;
            }
            if(playlist_rank){
                playlist_items++;
            }
            if(playlist_votes){
                playlist_items++;
            }
            if(playlist_tags){
                playlist_items++;
            }
            if(playlist_admintags){
                playlist_items++;
            }
            if(playlist_createddate){ 
                playlist_items++;
            }
            if(playlist_createdby){
                playlist_items++;
            }
            if(playlist_thumbnail){
                playlist_rowHeight = Number(playlist_rowHeight)+40;
                if(playlist_items > 2){
                    items = playlist_items - 2;
                    space = items * 20;
                    playlist_rowHeight += space;
                }
            }
            if(!playlist_thumbnail){
                space = playlist_items * 20;
                playlist_rowHeight += space;
            }
        }
        else if (uiconf_id == '6709440'){ 
            width = '400';
            height = '620';  
            player_entryid = '0_4kegnhto';
            playlist_thumbnail = true;
            playlist_name = true;
            playlist_description = true;
            playlist_duration = true;
            playlist_plays = false;
            playlist_rank = false;
            playlist_votes = false;
            playlist_tags = false;
            playlist_admintags = false;
            playlist_createddate = false;
            playlist_createdby = false;
            playlist_previous = true;
            playlist_previous_tooltip = "Previous";
            playlist_next = true;
            playlist_next_tooltip = "Next";
            playlist_autocontinue = false;
            playlist_loop = false;
            playlist_visible = true;
            playlist_imageduration = 2;
            playlist_rowHeight = 30;
            playlist_items = 0;
            var space, items;
            
            if(playlist_description){
                playlist_items++;
            }
            if(playlist_plays){
                playlist_items++;
            }
            if(playlist_rank){
                playlist_items++;
            }
            if(playlist_votes){
                playlist_items++;
            }
            if(playlist_tags){
                playlist_items++;
            }
            if(playlist_admintags){
                playlist_items++;
            }
            if(playlist_createddate){ 
                playlist_items++;
            }
            if(playlist_createdby){
                playlist_items++;
            }
            if(playlist_thumbnail){
                playlist_rowHeight = Number(playlist_rowHeight)+40;
                if(playlist_items > 2){
                    items = playlist_items - 2;
                    space = items * 20;
                    playlist_rowHeight += space;
                }
            }
            if(!playlist_thumbnail){
                space = playlist_items * 20;
                playlist_rowHeight += space;
            }
        }
        auto_preview = false;
        origMedia = true;
        stretMedia = false;
        playOnload = false;
        playerMute = false;
        capVideo = false;
        capVideo_textglow = false;
        capVideo_backlayer = false;
        capVideo_textcolor = '#FFFFFF';
        capVideo_glowcolor = '#000000';
        capVideo_glowblur = '4';
        capVideo_backcolor = '#000000';
        capVideo_fontsize = '12';
        capVideo_fontfamily = 'Arial';
        capVideo_prompt = 'Captions';
        capVideo_tooltip = '';
        style_fontfamily = 'Arial';
        style_icons_color = "#DDDDDD";
        style_mouse_color = "#FFFFFF";
        style_onvideo_button_color = "#333333";
        style_onvideo_mouse_color = "#999999";
        style_onvideo_icons_color = "#FFFFFF";
        skin = '/content/uiconf/kaltura/kmc/appstudio/kdp3/falcon/skin/v3.7/skin.swf';
        flashvars['width'] = width;
        flashvars['height'] = height;
        flashvars['streamerType'] = 'http';
        flashvars['full.skinPath'] = skin;
        flashvars['kalturaLogo.visible'] = false;
        flashvars['kalturaLogo.includeInLayout'] = false;
        flashvars['mylogo.plugin'] = false;
        flashvars['mylogo.className'] = 'Watermark';
        flashvars['mylogo.width'] = 0;
        flashvars['mylogo.height'] = 0;
        flashvars['mylogo.watermarkPath'] = '';
        flashvars['mylogo.watermarkClickPath'] = 'http://streamingmediahosting.com';
        flashvars['mylogo.position'] = 'after';
        flashvars['mylogo.relativeTo'] = 'kalturaLogo';
        flashvars['video.stretchThumbnail'] = false;
        flashvars['watermark.visible'] = false;
        flashvars['watermark.watermarkPath'] = '';
        flashvars['watermark.watermarkClickPath'] = 'http://streamingmediahosting.com';
        flashvars['watermark.padding'] = 5;
        flashvars['watermark.watermarkPosition'] = 'bottomLeft';
        flashvars['timerControllerScreen1.visible'] = true;
        flashvars['timerControllerScreen1.includeInLayout'] = true;
        flashvars['timerControllerScreen1.timerType'] = 'forwards';
        flashvars['timerControllerScreen1.color1'] = style_icons_color.replace("#","0x");
        flashvars['timerControllerScreen2.visible'] = true;
        flashvars['timerControllerScreen2.includeInLayout'] = true;
        flashvars['timerControllerScreen2.timerType'] = 'total';
        flashvars['timerControllerScreen2.color1'] = style_icons_color.replace("#","0x");
        flashvars['volumeBar.visible'] = true;
        flashvars['volumeBar.includeInLayout'] = true;
        flashvars['volumeBar.tooltip'] = 'Change volume';
        flashvars['volumeBar.initialValue'] = 1;
        flashvars['volumeBar.forceInitialValue'] = false;
        flashvars['volumeBar.color1'] = style_icons_color.replace("#","0x");
        flashvars['volumeBar.color2'] = style_mouse_color.replace("#","0x");
        flashvars['scrubberContainer.visible'] = true;
        flashvars['scrubberContainer.includeInLayout'] = true;
        flashvars['stars.visible'] = false;
        flashvars['stars.includeInLayout'] = false;
        flashvars['stars.editable'] = true;
        flashvars['stars.starScale'] = 1;
        flashvars['TopTitleScreen.visible'] = false;
        flashvars['TopTitleScreen.includeInLayout'] = false;
        flashvars['movieName.font'] = style_fontfamily;
        flashvars['movieName.dynamicColor'] = true; 
        flashvars['movieName.color1'] = style_icons_color.replace("#","0x"); 
        flashvars['vast.numPreroll'] = 1; 
        flashvars['vast.prerollInterval'] = 0; 
        flashvars['vast.prerollStartWith'] = 0; 
        flashvars['vast.prerollUrl'] = 'http://';
        flashvars['vast.overlayStartAt'] = 5; 
        flashvars['vast.overlayInterval'] = 300; 
        flashvars['vast.overlayUrl'] = 'http://'; 
        flashvars['vast.numPostroll'] = 1; 
        flashvars['vast.postrollInterval'] = 0;
        flashvars['vast.postrollStartWith'] = 0; 
        flashvars['vast.postrollUrl'] = 'http://'; 
        flashvars['vast.preSequence'] = 0; 
        flashvars['vast.postSequence'] = 0; 
        flashvars['vast.trackCuePoints'] = true; 
        flashvars['vast.timeout'] = 4; 
        flashvars['vast.htmlCompanions'] = ''; 
        flashvars['vast.flashCompanions'] = '';
        flashvars['overlay.visible'] = false; 
        flashvars['overlay.includeInLayout'] = false;
        flashvars['overlay.overlayStartAt'] = '{vast.overlayStartAt}'; 
        flashvars['overlay.overlayInterval'] = '{vast.overlayInterval}'; 
        flashvars['overlay.swfUrls'] = '{vast.overlays}';
        flashvars['overlay.displayDuration'] = 5;
        flashvars['overlay.width'] = '100%';
        flashvars['overlay.height'] = '100%';
        flashvars['bumper.bumperEntryID'] = '';
        flashvars['bumper.clickurl'] = ''; 
        flashvars['bumper.lockUI'] = true; 
        flashvars['bumper.playOnce'] = false; 
        flashvars['bumper.preSequence'] = 0;
        flashvars['bumper.postSequence'] = 0; 
        flashvars['noticeMessage.visible'] = false;
        flashvars['noticeMessage.includeInLayout'] = false;
        flashvars['noticeMessage.text'] = 'Video will start in {sequenceProxy.timeRemaining} seconds';
        flashvars['noticeMessage.dynamicColor'] = true; 
        flashvars['noticeMessage.color1'] = style_onvideo_icons_color.replace("#","0x"); 
        flashvars['noticeMessage.color2'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['noticeMessage.font'] = style_fontfamily;
        flashvars['skipBtn.visible'] = false;
        flashvars['skipBtn.includeInLayout'] = false;
        flashvars['skipBtn.dynamicColor'] = true; 
        flashvars['skipBtn.color1'] = style_icons_color.replace("#","0x");
        flashvars['skipBtn.color2'] = style_mouse_color.replace("#","0x");
        flashvars['skipBtn.font'] = style_fontfamily;
        flashvars['skipBtn.label'] = 'skip ad >';
        flashvars['scrubber.visible'] = true; 
        flashvars['scrubber.includeInLayout'] = true; 
        flashvars['flavorComboControllerScreen.visible'] = false;
        flashvars['flavorComboControllerScreen.includeInLayout'] = false;
        flashvars['flavorComboControllerScreen.hdOn'] = 'HD On';
        flashvars['flavorComboControllerScreen.hdOff'] = 'HD Off';
        flashvars['flavorComboControllerScreen.autoMessage'] = 'Automatically switches between bitrates';
        flashvars['flavorComboControllerScreen.color1'] = style_icons_color.replace("#","0x");
        flashvars['fullScreenBtnControllerScreen.visible'] = true;
        flashvars['fullScreenBtnControllerScreen.includeInLayout'] = true;
        flashvars['fullScreenBtnControllerScreen.k_buttonType'] = 'buttonIconControllerArea';
        flashvars['fullScreenBtnControllerScreen.label'] = ''; 
        flashvars['fullScreenBtnControllerScreen.upTooltip'] = 'Open Full Screen';
        flashvars['fullScreenBtnControllerScreen.selectedTooltip'] = 'Close Full Screen';
        flashvars['fullScreenBtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
        flashvars['fullScreenBtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
        flashvars['playBtnControllerScreen.visible'] = true;
        flashvars['playBtnControllerScreen.includeInLayout'] = true;
        flashvars['playBtnControllerScreen.k_buttonType'] = 'buttonIconControllerArea';
        flashvars['playBtnControllerScreen.upTooltip'] = 'Play';
        flashvars['playBtnControllerScreen.selectedTooltip'] = 'Pause';
        flashvars['playBtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
        flashvars['playBtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
        flashvars['ControllerScreenHolder.visible'] = true; 
        flashvars['ControllerScreenHolder.includeInLayout'] = true; 
        flashvars['downloadBtnControllerScreen.visible'] = false;
        flashvars['downloadBtnControllerScreen.includeInLayout'] = false;
        flashvars['downloadBtnControllerScreen.k_buttonType'] = 'buttonIconControllerArea';
        flashvars['downloadBtnControllerScreen.label'] = ''; 
        flashvars['downloadBtnControllerScreen.tooltip'] = 'download video';
        flashvars['downloadBtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
        flashvars['downloadBtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
        flashvars['download.flavorId'] = 0;
        flashvars['shareBtnControllerScreen.visible'] = false;
        flashvars['shareBtnControllerScreen.includeInLayout'] = false;
        flashvars['shareBtnControllerScreen.k_buttonType'] = 'buttonIconControllerArea';
        flashvars['shareBtnControllerScreen.label'] = ''; 
        flashvars['shareBtnControllerScreen.tooltip'] = 'share with friends';
        flashvars['shareBtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
        flashvars['shareBtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
        flashvars['editBtnControllerScreen.visible'] = false; 
        flashvars['editBtnControllerScreen.includeInLayout'] = false; 
        flashvars['captureThumbBtnControllerScreen.visible'] = false;
        flashvars['captureThumbBtnControllerScreen.includeInLayout'] = false;
        flashvars['captureThumbBtnControllerScreen.k_buttonType'] = 'buttonIconControllerArea';
        flashvars['captureThumbBtnControllerScreen.label'] = ''; 
        flashvars['captureThumbBtnControllerScreen.tooltip'] = 'Use current frame as the video thumbnail';
        flashvars['captureThumbBtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
        flashvars['captureThumbBtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
        flashvars['captureThumbBtnControllerScreen.font'] = style_fontfamily;
        flashvars['flagBtnControllerScreen.visible'] = false; 
        flashvars['flagBtnControllerScreen.includeInLayout'] = false; 
        flashvars['flagBtnControllerScreen.k_buttonType'] = 'buttonIconControllerArea';
        flashvars['flagBtnControllerScreen.label'] = 'flag';
        flashvars['flagBtnControllerScreen.tooltip'] = 'Report this content as inappropriate';
        flashvars['flagBtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
        flashvars['flagBtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
        flashvars['uploadBtnControllerScreen.visible'] = false; 
        flashvars['uploadBtnControllerScreen.includeInLayout'] = false; 
        flashvars['uploadBtnControllerScreen.k_buttonType'] = 'buttonIconControllerArea';
        flashvars['uploadBtnControllerScreen.label'] = ''; 
        flashvars['uploadBtnControllerScreen.tooltip'] = 'Add additional videos, images or audio files to this video';
        flashvars['uploadBtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
        flashvars['uploadBtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
        flashvars['custom1BtnControllerScreen.visible'] = false;
        flashvars['custom1BtnControllerScreen.includeInLayout'] = false;
        flashvars['custom1BtnControllerScreen.k_buttonType'] = 'buttonIconControllerArea';
        flashvars['custom1BtnControllerScreen.label'] = ''; 
        flashvars['custom1BtnControllerScreen.tooltip'] = 'Custom1 tooltip';
        flashvars['custom1BtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
        flashvars['custom1BtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
        flashvars['custom2BtnControllerScreen.visible'] = false;
        flashvars['custom2BtnControllerScreen.includeInLayout'] = false;
        flashvars['custom2BtnControllerScreen.k_buttonType'] = 'buttonIconControllerArea';
        flashvars['custom2BtnControllerScreen.label'] = ''; 
        flashvars['custom2BtnControllerScreen.tooltip'] = 'Custom2 tooltip';
        flashvars['custom2BtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
        flashvars['custom2BtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
        flashvars['custom3BtnControllerScreen.visible'] = false;
        flashvars['custom3BtnControllerScreen.includeInLayout'] = false;
        flashvars['custom3BtnControllerScreen.k_buttonType'] = 'buttonIconControllerArea';
        flashvars['custom3BtnControllerScreen.label'] = ''; 
        flashvars['custom3BtnControllerScreen.tooltip'] = 'Custom3 tooltip';
        flashvars['custom3BtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
        flashvars['custom3BtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
        flashvars['custom4BtnControllerScreen.visible'] = false;
        flashvars['custom4BtnControllerScreen.includeInLayout'] = false;
        flashvars['custom4BtnControllerScreen.k_buttonType'] = 'buttonIconControllerArea'; 
        flashvars['custom4BtnControllerScreen.label'] = ''; 
        flashvars['custom4BtnControllerScreen.tooltip'] = 'Custom4 tooltip';
        flashvars['custom4BtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
        flashvars['custom4BtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
        flashvars['custom5BtnControllerScreen.visible'] = false;
        flashvars['custom5BtnControllerScreen.includeInLayout'] = false;
        flashvars['custom5BtnControllerScreen.k_buttonType'] = 'buttonIconControllerArea'; 
        flashvars['custom5BtnControllerScreen.label'] = ''; 
        flashvars['custom5BtnControllerScreen.tooltip'] = 'Custom5 tooltip';
        flashvars['custom5BtnControllerScreen.color1'] = style_icons_color.replace("#","0x");
        flashvars['custom5BtnControllerScreen.color2'] = style_mouse_color.replace("#","0x");
        flashvars['custom1BtnStartScreen.visible'] = false;
        flashvars['custom1BtnStartScreen.includeInLayout'] = false;
        flashvars['custom1BtnStartScreen.label'] = 'custom1';
        flashvars['custom1BtnStartScreen.tooltip'] = 'Custom1 tooltip';
        flashvars['custom1BtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['custom1BtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['custom1BtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['custom1BtnStartScreen.font'] = style_fontfamily;
        flashvars['custom2BtnStartScreen.visible'] = false;
        flashvars['custom2BtnStartScreen.includeInLayout'] = false;
        flashvars['custom2BtnStartScreen.label'] = 'custom2';
        flashvars['custom2BtnStartScreen.tooltip'] = 'Custom2 tooltip';
        flashvars['custom2BtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['custom2BtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['custom2BtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['custom2BtnStartScreen.font'] = style_fontfamily;
        flashvars['custom3BtnStartScreen.visible'] = false;
        flashvars['custom3BtnStartScreen.includeInLayout'] = false;
        flashvars['custom3BtnStartScreen.label'] = 'custom3';
        flashvars['custom3BtnStartScreen.tooltip'] = 'Custom3 tooltip';
        flashvars['custom3BtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['custom3BtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['custom3BtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['custom3BtnStartScreen.font'] = style_fontfamily;
        flashvars['custom4BtnStartScreen.visible'] = false;
        flashvars['custom4BtnStartScreen.includeInLayout'] = false;
        flashvars['custom4BtnStartScreen.label'] = 'custom4';
        flashvars['custom4BtnStartScreen.tooltip'] = 'Custom4 tooltip';
        flashvars['custom4BtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['custom4BtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['custom4BtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['custom4BtnStartScreen.font'] = style_fontfamily;
        flashvars['custom5BtnStartScreen.visible'] = false;
        flashvars['custom5BtnStartScreen.includeInLayout'] = false;
        flashvars['custom5BtnStartScreen.label'] = 'custom5';
        flashvars['custom5BtnStartScreen.tooltip'] = 'Custom5 tooltip';
        flashvars['custom5BtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['custom5BtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['custom5BtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['custom5BtnStartScreen.font'] = style_fontfamily;
        flashvars['shareBtnStartScreen.visible'] = false;
        flashvars['shareBtnStartScreen.includeInLayout'] = false;
        flashvars['shareBtnStartScreen.k_buttonType'] = 'buttonIconControllerArea'; 
        flashvars['shareBtnStartScreen.label'] = 'Share';
        flashvars['shareBtnStartScreen.tooltip'] = 'share with friends';
        flashvars['shareBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['shareBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['shareBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['shareBtnStartScreen.font'] = style_fontfamily;
        flashvars['downloadBtnStartScreen.visible'] = false;
        flashvars['downloadBtnStartScreen.includeInLayout'] = false;
        flashvars['downloadBtnStartScreen.k_buttonType'] = 'buttonIconControllerArea'; 
        flashvars['downloadBtnStartScreen.label'] = 'Download';
        flashvars['downloadBtnStartScreen.tooltip'] = 'download video';
        flashvars['downloadBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['downloadBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['downloadBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['downloadBtnStartScreen.font'] = style_fontfamily;
        flashvars['fullScreenBtnStartScreen.visible'] = false;
        flashvars['fullScreenBtnStartScreen.includeInLayout'] = false;
        flashvars['fullScreenBtnStartScreen.label'] = 'Fullscreen';
        flashvars['fullScreenBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['fullScreenBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['fullScreenBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['fullScreenBtnStartScreen.font'] = style_fontfamily;
        flashvars['onVideoPlayBtnStartScreen.visible'] = true;
        flashvars['onVideoPlayBtnStartScreen.includeInLayout'] = true;
        flashvars['onVideoPlayBtnStartScreen.k_buttonType'] = 'buttonIconControllerArea'; 
        flashvars['onVideoPlayBtnStartScreen.label'] = 'Play';
        flashvars['onVideoPlayBtnStartScreen.tooltip'] = 'Play video';
        flashvars['onVideoPlayBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['onVideoPlayBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['onVideoPlayBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['onVideoPlayBtnStartScreen.font'] = style_fontfamily;
        flashvars['editBtnStartScreen.visible'] = false; 
        flashvars['editBtnStartScreen.includeInLayout'] = false; 
        flashvars['editBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['editBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['editBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['editBtnStartScreen.font'] = style_fontfamily;
        flashvars['captureThumbBtnStartScreen.visible'] = false;
        flashvars['captureThumbBtnStartScreen.includeInLayout'] = false;
        flashvars['captureThumbBtnStartScreen.label'] = 'Thumb';
        flashvars['captureThumbBtnStartScreen.tooltip'] = 'Use current frame as the video thumbnail';
        flashvars['captureThumbBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['captureThumbBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['captureThumbBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['captureThumbBtnStartScreen.font'] = style_fontfamily;
        flashvars['flagBtnStartScreen.visible'] = false; 
        flashvars['flagBtnStartScreen.includeInLayout'] = false; 
        flashvars['flagBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['flagBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['flagBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['flagBtnStartScreen.font'] = style_fontfamily;
        flashvars['uploadBtnStartScreen.visible'] = false; 
        flashvars['uploadBtnStartScreen.includeInLayout'] = false; 
        flashvars['uploadBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['uploadBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['uploadBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['uploadBtnStartScreen.font'] = style_fontfamily;
        flashvars['unmuteBtnStartScreen.visible'] = false;
        flashvars['unmuteBtnStartScreen.includeInLayout'] = false;
        flashvars['unmuteBtnStartScreen.label'] = 'Unmute';
        flashvars['unmuteBtnStartScreen.tooltip'] = 'unmute sound';
        flashvars['unmuteBtnStartScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['unmuteBtnStartScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['unmuteBtnStartScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['unmuteBtnStartScreen.font'] = style_fontfamily;
        flashvars['custom1BtnPlayScreen.visible'] = false;
        flashvars['custom1BtnPlayScreen.includeInLayout'] = false;
        flashvars['custom1BtnPlayScreen.label'] = 'custom1';
        flashvars['custom1BtnPlayScreen.tooltip'] = 'Custom1 tooltip';
        flashvars['custom1BtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['custom1BtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['custom1BtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['custom1BtnPlayScreen.font'] = style_fontfamily;
        flashvars['custom2BtnPlayScreen.visible'] = false;
        flashvars['custom2BtnPlayScreen.includeInLayout'] = false;
        flashvars['custom2BtnPlayScreen.label'] = 'custom2';
        flashvars['custom2BtnPlayScreen.tooltip'] = 'Custom2 tooltip';
        flashvars['custom2BtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['custom2BtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['custom2BtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['custom2BtnPlayScreen.font'] = style_fontfamily;
        flashvars['custom3BtnPlayScreen.visible'] = false;
        flashvars['custom3BtnPlayScreen.includeInLayout'] = false;
        flashvars['custom3BtnPlayScreen.label'] = 'custom3';
        flashvars['custom3BtnPlayScreen.tooltip'] = 'Custom3 tooltip';
        flashvars['custom3BtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['custom3BtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['custom3BtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['custom3BtnPlayScreen.font'] = style_fontfamily;
        flashvars['custom4BtnPlayScreen.visible'] = false;
        flashvars['custom4BtnPlayScreen.includeInLayout'] = false;
        flashvars['custom4BtnPlayScreen.label'] = 'custom4';
        flashvars['custom4BtnPlayScreen.tooltip'] = 'Custom4 tooltip';
        flashvars['custom4BtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['custom4BtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['custom4BtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['custom4BtnPlayScreen.font'] = style_fontfamily;
        flashvars['custom5BtnPlayScreen.visible'] = false;
        flashvars['custom5BtnPlayScreen.includeInLayout'] = false;
        flashvars['custom5BtnPlayScreen.label'] = 'custom5';
        flashvars['custom5BtnPlayScreen.tooltip'] = 'Custom5 tooltip';
        flashvars['custom5BtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['custom5BtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['custom5BtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['custom5BtnPlayScreen.font'] = style_fontfamily;
        flashvars['shareBtnPlayScreen.visible'] = false;
        flashvars['shareBtnPlayScreen.includeInLayout'] = false;
        flashvars['shareBtnPlayScreen.k_buttonType'] = 'buttonIconControllerArea'; 
        flashvars['shareBtnPlayScreen.label'] = 'Share';
        flashvars['shareBtnPlayScreen.tooltip'] = 'share with friends';
        flashvars['shareBtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['shareBtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['shareBtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['shareBtnPlayScreen.font'] = style_fontfamily;
        flashvars['downloadBtnPlayScreen.visible'] = false;
        flashvars['downloadBtnPlayScreen.includeInLayout'] = false;
        flashvars['downloadBtnPlayScreen.k_buttonType'] = 'buttonIconControllerArea'; 
        flashvars['downloadBtnPlayScreen.label'] = 'Download';
        flashvars['downloadBtnPlayScreen.tooltip'] = 'download video';
        flashvars['downloadBtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['downloadBtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['downloadBtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['downloadBtnPlayScreen.font'] = style_fontfamily;
        flashvars['fullScreenBtnPlayScreen.visible'] = false;
        flashvars['fullScreenBtnPlayScreen.includeInLayout'] = false;
        flashvars['fullScreenBtnPlayScreen.label'] = 'Fullscreen';
        flashvars['fullScreenBtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['fullScreenBtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['fullScreenBtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['fullScreenBtnPlayScreen.font'] = style_fontfamily;
        flashvars['editBtnPlayScreen.visible'] = false; 
        flashvars['editBtnPlayScreen.includeInLayout'] = false; 
        flashvars['editBtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['editBtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['editBtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['editBtnPlayScreen.font'] = style_fontfamily;
        flashvars['captureThumbBtnPlayScreen.visible'] = false;
        flashvars['captureThumbBtnPlayScreen.includeInLayout'] = false;
        flashvars['captureThumbBtnPlayScreen.label'] = 'Thumb';
        flashvars['captureThumbBtnPlayScreen.tooltip'] = 'Use current frame as the video thumbnail';
        flashvars['captureThumbBtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['captureThumbBtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['captureThumbBtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['captureThumbBtnPlayScreen.font'] = style_fontfamily;
        flashvars['flagBtnPlayScreen.visible'] = false; 
        flashvars['flagBtnPlayScreen.includeInLayout'] = false; 
        flashvars['flagBtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['flagBtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['flagBtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['flagBtnPlayScreen.font'] = style_fontfamily;
        flashvars['uploadBtnPlayScreen.visible'] = false; 
        flashvars['uploadBtnPlayScreen.includeInLayout'] = false; 
        flashvars['uploadBtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['uploadBtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['uploadBtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['uploadBtnPlayScreen.font'] = style_fontfamily;
        flashvars['unmuteBtnPlayScreen.visible'] = false;
        flashvars['unmuteBtnPlayScreen.includeInLayout'] = false;
        flashvars['unmuteBtnPlayScreen.label'] = 'Unmute';
        flashvars['unmuteBtnPlayScreen.tooltip'] = 'unmute sound';
        flashvars['unmuteBtnPlayScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['unmuteBtnPlayScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['unmuteBtnPlayScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['unmuteBtnPlayScreen.font'] = style_fontfamily;
        flashvars['custom1BtnPauseScreen.visible'] = false;
        flashvars['custom1BtnPauseScreen.includeInLayout'] = false;
        flashvars['custom1BtnPauseScreen.label'] = 'custom1';
        flashvars['custom1BtnPauseScreen.tooltip'] = 'Custom1 tooltip';
        flashvars['custom1BtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['custom1BtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['custom1BtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['custom1BtnPauseScreen.font'] = style_fontfamily;
        flashvars['custom2BtnPauseScreen.visible'] = false;
        flashvars['custom2BtnPauseScreen.includeInLayout'] = false;
        flashvars['custom2BtnPauseScreen.label'] = 'custom2';
        flashvars['custom2BtnPauseScreen.tooltip'] = 'Custom2 tooltip';
        flashvars['custom2BtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['custom2BtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['custom2BtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['custom2BtnPauseScreen.font'] = style_fontfamily;
        flashvars['custom3BtnPauseScreen.visible'] = false;
        flashvars['custom3BtnPauseScreen.includeInLayout'] = false;
        flashvars['custom3BtnPauseScreen.label'] = 'custom3';
        flashvars['custom3BtnPauseScreen.tooltip'] = 'Custom3 tooltip';
        flashvars['custom3BtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['custom3BtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['custom3BtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['custom3BtnPauseScreen.font'] = style_fontfamily;
        flashvars['custom4BtnPauseScreen.visible'] = false;
        flashvars['custom4BtnPauseScreen.includeInLayout'] = false;
        flashvars['custom4BtnPauseScreen.label'] = 'custom4';
        flashvars['custom4BtnPauseScreen.tooltip'] = 'Custom4 tooltip';
        flashvars['custom4BtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['custom4BtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['custom4BtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['custom4BtnPauseScreen.font'] = style_fontfamily;
        flashvars['custom5BtnPauseScreen.visible'] = false;
        flashvars['custom5BtnPauseScreen.includeInLayout'] = false;
        flashvars['custom5BtnPauseScreen.label'] = 'custom5';
        flashvars['custom5BtnPauseScreen.tooltip'] = 'Custom5 tooltip';
        flashvars['custom5BtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['custom5BtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['custom5BtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['custom5BtnPauseScreen.font'] = style_fontfamily;
        flashvars['shareBtnPauseScreen.visible'] = false;
        flashvars['shareBtnPauseScreen.includeInLayout'] = false;
        flashvars['shareBtnPauseScreen.k_buttonType'] = 'buttonIconControllerArea'; 
        flashvars['shareBtnPauseScreen.label'] = 'Share';
        flashvars['shareBtnPauseScreen.tooltip'] = 'share with friends';
        flashvars['shareBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['shareBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['shareBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['shareBtnPauseScreen.font'] = style_fontfamily;
        flashvars['downloadBtnPauseScreen.visible'] = false;
        flashvars['downloadBtnPauseScreen.includeInLayout'] = false;
        flashvars['downloadBtnPauseScreen.k_buttonType'] = 'buttonIconControllerArea'; 
        flashvars['downloadBtnPauseScreen.label'] = 'Download';
        flashvars['downloadBtnPauseScreen.tooltip'] = 'download video';
        flashvars['downloadBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['downloadBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['downloadBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['downloadBtnPauseScreen.font'] = style_fontfamily;
        flashvars['fullScreenBtnPauseScreen.visible'] = false;
        flashvars['fullScreenBtnPauseScreen.includeInLayout'] = false;
        flashvars['fullScreenBtnPauseScreen.label'] = 'Fullscreen';
        flashvars['fullScreenBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['fullScreenBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['fullScreenBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['fullScreenBtnPauseScreen.font'] = style_fontfamily;
        flashvars['onVideoPlayBtnPauseScreen.visible'] = true;
        flashvars['onVideoPlayBtnPauseScreen.includeInLayout'] = true;
        flashvars['onVideoPlayBtnPauseScreen.k_buttonType'] = 'buttonIconControllerArea'; 
        flashvars['onVideoPlayBtnPauseScreen.label'] = 'Play';
        flashvars['onVideoPlayBtnPauseScreen.tooltip'] = 'Play video';
        flashvars['onVideoPlayBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['onVideoPlayBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['onVideoPlayBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['onVideoPlayBtnPauseScreen.font'] = style_fontfamily;
        flashvars['editBtnPauseScreen.visible'] = false; 
        flashvars['editBtnPauseScreen.includeInLayout'] = false; 
        flashvars['editBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['editBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['editBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['editBtnPauseScreen.font'] = style_fontfamily;
        flashvars['captureThumbBtnPauseScreen.visible'] = false;
        flashvars['captureThumbBtnPauseScreen.includeInLayout'] = false;
        flashvars['captureThumbBtnPauseScreen.label'] = 'Thumb';
        flashvars['captureThumbBtnPauseScreen.tooltip'] = 'Use current frame as the video thumbnail';
        flashvars['captureThumbBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['captureThumbBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['captureThumbBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['captureThumbBtnPauseScreen.font'] = style_fontfamily;
        flashvars['flagBtnPauseScreen.visible'] = false; 
        flashvars['flagBtnPauseScreen.includeInLayout'] = false; 
        flashvars['flagBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['flagBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['flagBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['flagBtnPauseScreen.font'] = style_fontfamily;
        flashvars['uploadBtnPauseScreen.visible'] = false; 
        flashvars['uploadBtnPauseScreen.includeInLayout'] = false; 
        flashvars['uploadBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['uploadBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['uploadBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['uploadBtnPauseScreen.font'] = style_fontfamily;
        flashvars['unmuteBtnPauseScreen.visible'] = false;
        flashvars['unmuteBtnPauseScreen.includeInLayout'] = false;
        flashvars['unmuteBtnPauseScreen.label'] = 'Unmute';
        flashvars['unmuteBtnPauseScreen.tooltip'] = 'unmute sound';
        flashvars['unmuteBtnPauseScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['unmuteBtnPauseScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['unmuteBtnPauseScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['unmuteBtnPauseScreen.font'] = style_fontfamily;
        flashvars['custom1BtnEndScreen.visible'] = false;
        flashvars['custom1BtnEndScreen.includeInLayout'] = false;
        flashvars['custom1BtnEndScreen.label'] = 'custom1';
        flashvars['custom1BtnEndScreen.tooltip'] = 'Custom1 tooltip';
        flashvars['custom1BtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['custom1BtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['custom1BtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['custom1BtnEndScreen.font'] = style_fontfamily;
        flashvars['custom2BtnEndScreen.visible'] = false;
        flashvars['custom2BtnEndScreen.includeInLayout'] = false;
        flashvars['custom2BtnEndScreen.label'] = 'custom2';
        flashvars['custom2BtnEndScreen.tooltip'] = 'Custom2 tooltip';
        flashvars['custom2BtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['custom2BtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['custom2BtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['custom2BtnEndScreen.font'] = style_fontfamily;
        flashvars['custom3BtnEndScreen.visible'] = false;
        flashvars['custom3BtnEndScreen.includeInLayout'] = false;
        flashvars['custom3BtnEndScreen.label'] = 'custom3';
        flashvars['custom3BtnEndScreen.tooltip'] = 'Custom3 tooltip';
        flashvars['custom3BtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['custom3BtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['custom3BtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['custom3BtnEndScreen.font'] = style_fontfamily;
        flashvars['custom4BtnEndScreen.visible'] = false;
        flashvars['custom4BtnEndScreen.includeInLayout'] = false;
        flashvars['custom4BtnEndScreen.label'] = 'custom4';
        flashvars['custom4BtnEndScreen.tooltip'] = 'Custom4 tooltip';
        flashvars['custom4BtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['custom4BtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['custom4BtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['custom4BtnEndScreen.font'] = style_fontfamily;
        flashvars['custom5BtnEndScreen.visible'] = false;
        flashvars['custom5BtnEndScreen.includeInLayout'] = false;
        flashvars['custom5BtnEndScreen.label'] = 'custom5';
        flashvars['custom5BtnEndScreen.tooltip'] = 'Custom5 tooltip';
        flashvars['custom5BtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['custom5BtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['custom5BtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['custom5BtnEndScreen.font'] = style_fontfamily;
        flashvars['shareBtnEndScreen.visible'] = false;
        flashvars['shareBtnEndScreen.includeInLayout'] = false;
        flashvars['shareBtnEndScreen.k_buttonType'] = 'buttonIconControllerArea'; 
        flashvars['shareBtnEndScreen.label'] = 'Share';
        flashvars['shareBtnEndScreen.tooltip'] = 'share with friends';
        flashvars['shareBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['shareBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['shareBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['shareBtnEndScreen.font'] = style_fontfamily;
        flashvars['downloadBtnEndScreen.visible'] = false;
        flashvars['downloadBtnEndScreen.includeInLayout'] = false;
        flashvars['downloadBtnEndScreen.k_buttonType'] = 'buttonIconControllerArea'; 
        flashvars['downloadBtnEndScreen.label'] = 'Download';
        flashvars['downloadBtnEndScreen.tooltip'] = 'download video';
        flashvars['downloadBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['downloadBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['downloadBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['downloadBtnEndScreen.font'] = style_fontfamily;
        flashvars['fullScreenBtnEndScreen.visible'] = false;
        flashvars['fullScreenBtnEndScreen.includeInLayout'] = false;
        flashvars['fullScreenBtnEndScreen.label'] = 'Fullscreen';
        flashvars['fullScreenBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['fullScreenBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['fullScreenBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['fullScreenBtnEndScreen.font'] = style_fontfamily;
        flashvars['editBtnEndScreen.visible'] = false; 
        flashvars['editBtnEndScreen.includeInLayout'] = false; 
        flashvars['editBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['editBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['editBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['editBtnEndScreen.font'] = style_fontfamily;
        flashvars['captureThumbBtnEndScreen.visible'] = false;
        flashvars['captureThumbBtnEndScreen.includeInLayout'] = false;
        flashvars['captureThumbBtnEndScreen.label'] = 'Thumb';
        flashvars['captureThumbBtnEndScreen.tooltip'] = 'Use current frame as the video thumbnail';
        flashvars['captureThumbBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['captureThumbBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['captureThumbBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['captureThumbBtnEndScreen.font'] = style_fontfamily;
        flashvars['flagBtnEndScreen.visible'] = false; 
        flashvars['flagBtnEndScreen.includeInLayout'] = false; 
        flashvars['flagBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['flagBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['flagBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['flagBtnEndScreen.font'] = style_fontfamily;
        flashvars['uploadBtnEndScreen.visible'] = false; 
        flashvars['uploadBtnEndScreen.includeInLayout'] = false; 
        flashvars['uploadBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['uploadBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['uploadBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['uploadBtnEndScreen.font'] = style_fontfamily;
        flashvars['unmuteBtnEndScreen.visible'] = false;
        flashvars['unmuteBtnEndScreen.includeInLayout'] = false;
        flashvars['unmuteBtnEndScreen.label'] = 'Unmute';
        flashvars['unmuteBtnEndScreen.tooltip'] = 'unmute sound';
        flashvars['unmuteBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['unmuteBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['unmuteBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['unmuteBtnEndScreen.font'] = style_fontfamily;
        flashvars['replayBtnEndScreen.visible'] = true;
        flashvars['replayBtnEndScreen.includeInLayout'] = true;
        flashvars['replayBtnEndScreen.label'] = 'Replay';
        flashvars['replayBtnEndScreen.tooltip'] = 'Replay';
        flashvars['replayBtnEndScreen.color3'] = style_onvideo_button_color.replace("#","0x");
        flashvars['replayBtnEndScreen.color4'] = style_onvideo_mouse_color.replace("#","0x");
        flashvars['replayBtnEndScreen.color5'] = style_onvideo_icons_color.replace("#","0x");
        flashvars['replayBtnEndScreen.font'] = style_fontfamily;
    },
    //Export Metadata
    exportMetaData:function(){        
        if(total_entries){
            window.location = '/apps/platform/metadata/export.metadata.php?pid='+sessInfo.pid+'&ks='+sessInfo.ks+'&page_size='+total_entries+'&action=export_players_metadata';  
        }        
    },
    //Font Size
    fontsize:function(){
        var fontSize = $("#smh-modal3 .player-menu").width() * 0.60; 
        $("#smh-modal3 .player-tab .player-menu .fa").css('font-size', fontSize);
    },
    //Player Title Options
    playerTitle:function(){
        $('#smh-modal3').on('click', '#title_text' ,function(e){
            e.stopPropagation();
            if(this.checked){
                flashvars['TopTitleScreen.visible'] = true;
                flashvars['TopTitleScreen.includeInLayout'] = true;
            }
            else {
                flashvars['TopTitleScreen.visible'] = false;
                flashvars['TopTitleScreen.includeInLayout'] = false;
            }
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }  
        });
    },
    //Player Watermark Options
    playerWatermark:function(){
        $('#smh-modal3').on('click', '#watermark' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 #watermark_url').removeAttr('disabled');
                $('#smh-modal3 #watermark_landing').removeAttr('disabled');
                $('#smh-modal3 #watermark-location').removeAttr('disabled');
                $('#smh-modal3 #water_padding').removeAttr('disabled', '');
                var watermark_url = $('#smh-modal3 #watermark_url').val();
                var watermark_landing = $('#smh-modal3 #watermark_landing').val();
                var watermark_location = $('#smh-modal3 #watermark-location').val();
                var watermark_padding = $('#smh-modal3 #water_padding').val();
                flashvars['watermark.visible'] = true;
                flashvars['watermark.watermarkPath'] = watermark_url;
                flashvars['watermark.watermarkClickPath'] = watermark_landing;
                flashvars['watermark.padding'] = watermark_padding;
                flashvars['watermark.watermarkPosition'] = watermark_location;
            } else {
                $('#smh-modal3 #watermark_url').attr('disabled', '');
                $('#smh-modal3 #watermark_landing').attr('disabled', '');
                $('#smh-modal3 #watermark-location').attr('disabled', '');
                $('#smh-modal3 #water_padding').attr('disabled', '');
                flashvars['watermark.visible'] = false;
                flashvars['watermark.watermarkPath'] = '';
                flashvars['watermark.watermarkClickPath'] = 'http://streamingmediahosting.com';
                flashvars['watermark.padding'] = 5;
                flashvars['watermark.watermarkPosition'] = 'bottomLeft';
            }
            
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }  
        });
        $('#smh-modal3').on('change', '#watermark_url' ,function(){
            var watermark_url = $('#smh-modal3 #watermark_url').val();
            flashvars['watermark.watermarkPath'] = watermark_url;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#watermark_landing' ,function(){
            var watermark_landing = $('#smh-modal3 #watermark_landing').val();
            flashvars['watermark.watermarkClickPath'] = watermark_landing;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#watermark-location' ,function(){
            var watermark_location = $('#smh-modal3 #watermark-location').val();
            flashvars['watermark.watermarkPosition'] = watermark_location;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#water_padding' ,function(){
            var watermark_padding = $('#smh-modal3 #water_padding').val();
            flashvars['watermark.padding'] = watermark_padding;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
    },
    //Player Logo Options
    playerLogoIcon:function(){
        $('#smh-modal3').on('click', '#logo-icon' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 #icon_url').removeAttr('disabled');
                $('#smh-modal3 #icon_landing').removeAttr('disabled');
                $('#smh-modal3 #icon-width').removeAttr('disabled');
                $('#smh-modal3 #icon-height').removeAttr('disabled');
                var icon_url = $('#smh-modal3 #icon_url').val();
                var icon_landing = $('#smh-modal3 #icon_landing').val();
                var icon_width = $('#smh-modal3 #icon-width').val();
                var icon_height = $('#smh-modal3 #icon-height').val();
                flashvars['mylogo.plugin'] = true;
                flashvars['mylogo.className'] = 'Watermark';
                flashvars['mylogo.width'] = icon_width;
                flashvars['mylogo.height'] = icon_height;
                flashvars['mylogo.watermarkPath'] = icon_url;
                flashvars['mylogo.watermarkClickPath'] = icon_landing;
                flashvars['mylogo.position'] = 'after';
                flashvars['mylogo.relativeTo'] = 'kalturaLogo';
            }
            else {
                $('#smh-modal3 #icon_url').attr('disabled', '');
                $('#smh-modal3 #icon_landing').attr('disabled', '');
                $('#smh-modal3 #icon-width').attr('disabled', '');
                $('#smh-modal3 #icon-height').attr('disabled', '');
                flashvars['mylogo.plugin'] = false;
                flashvars['mylogo.className'] = 'Watermark';
                flashvars['mylogo.width'] = 0;
                flashvars['mylogo.height'] = 0;
                flashvars['mylogo.watermarkPath'] = '';
                flashvars['mylogo.watermarkClickPath'] = 'http://streamingmediahosting.com';
                flashvars['mylogo.position'] = 'after';
                flashvars['mylogo.relativeTo'] = 'kalturaLogo';
            }
            
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }  
        });
        $('#smh-modal3').on('change', '#icon_url' ,function(){
            var icon_url = $('#smh-modal3 #icon_url').val();
            flashvars['mylogo.watermarkPath'] = icon_url;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#icon_landing' ,function(){
            var icon_landing = $('#smh-modal3 #icon_landing').val();
            flashvars['mylogo.watermarkClickPath'] = icon_landing;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#icon-width' ,function(){
            var icon_width = $('#smh-modal3 #icon-width').val();
            flashvars['mylogo.width'] = icon_width;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#icon-height' ,function(){
            var icon_height = $('#smh-modal3 #icon-height').val();
            flashvars['mylogo.height'] = icon_height;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
    },    
    //Player Counter Options
    playerLeftCounter:function(){
        $('#smh-modal3').on('click', '#left-play-counter' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 #left-counterLoc').removeAttr('disabled');
                var left_counterLoc = $('#smh-modal3 #left-counterLoc').val();
                flashvars['timerControllerScreen1.visible'] = true;
                flashvars['timerControllerScreen1.includeInLayout'] = true;
                flashvars['timerControllerScreen1.timerType'] = left_counterLoc;
            } else {
                $('#smh-modal3 #left-counterLoc').attr('disabled', '');
                flashvars['timerControllerScreen1.visible'] = false;
                flashvars['timerControllerScreen1.includeInLayout'] = false;
                flashvars['timerControllerScreen1.timerType'] = 'forwards';
            }
            
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }  
        });
        $('#smh-modal3').on('change', '#left-counterLoc' ,function(){
            var left_counterLoc = $('#smh-modal3 #left-counterLoc').val();
            flashvars['timerControllerScreen1.timerType'] = left_counterLoc;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
    },
    //Player Counter Options
    playerRightCounter:function(){
        $('#smh-modal3').on('click', '#right-play-counter' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 #right-counterLoc').removeAttr('disabled');
                var right_counterLoc = $('#smh-modal3 #left-counterLoc').val();
                flashvars['timerControllerScreen2.visible'] = true;
                flashvars['timerControllerScreen2.includeInLayout'] = true;
                flashvars['timerControllerScreen2.timerType'] = right_counterLoc;
            } else {
                $('#smh-modal3 #right-counterLoc').attr('disabled', '');
                flashvars['timerControllerScreen2.visible'] = false;
                flashvars['timerControllerScreen2.includeInLayout'] = false;
                flashvars['timerControllerScreen2.timerType'] = 'forwards';
            }
            
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }  
        });
        $('#smh-modal3').on('change', '#right-counterLoc' ,function(){
            var right_counterLoc = $('#smh-modal3 #right-counterLoc').val();
            flashvars['timerControllerScreen2.timerType'] = right_counterLoc;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
    },
    //Player Counter Options
    playerFlavorSelect:function(){
        $('#smh-modal3').on('click', '#flavor_selector' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 #hdOn').removeAttr('disabled');
                $('#smh-modal3 #hdOff').removeAttr('disabled');
                $('#smh-modal3 #hdtool').removeAttr('disabled');
                var hdOn = $('#smh-modal3 #hdOn').val();
                var hdOff = $('#smh-modal3 #hdOff').val();
                var hdtool = $('#smh-modal3 #hdtool').val();
                flashvars['flavorComboControllerScreen.visible'] = true;
                flashvars['flavorComboControllerScreen.includeInLayout'] = true;
                flashvars['flavorComboControllerScreen.hdOn'] = hdOn;
                flashvars['flavorComboControllerScreen.hdOff'] = hdOff;
                flashvars['flavorComboControllerScreen.autoMessage'] = hdtool;
            } else {
                $('#smh-modal3 #hdOn').attr('disabled', '');
                $('#smh-modal3 #hdOff').attr('disabled', '');
                $('#smh-modal3 #hdtool').attr('disabled', '');
                flashvars['flavorComboControllerScreen.visible'] = false;
                flashvars['flavorComboControllerScreen.includeInLayout'] = false;
                flashvars['flavorComboControllerScreen.hdOn'] = 'HD On';
                flashvars['flavorComboControllerScreen.hdOff'] = 'HD Off';
                flashvars['flavorComboControllerScreen.autoMessage'] = 'Automatically switches between bitrates';
            }
            
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }  
        });
        $('#smh-modal3').on('change', '#hdOn' ,function(){
            var hdOn = $('#smh-modal3 #hdOn').val();
            flashvars['flavorComboControllerScreen.hdOn'] = hdOn;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#hdOff' ,function(){
            var hdOff = $('#smh-modal3 #hdOff').val();
            flashvars['flavorComboControllerScreen.hdOff'] = hdOff;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#hdtool' ,function(){
            var hdtool = $('#smh-modal3 #hdtool').val();
            flashvars['flavorComboControllerScreen.autoMessage'] = hdtool;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
    },
    //Player Fullscreen Option
    playerFullscreen:function(){
        $('#smh-modal3').on('click', '#fullscreen' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 #fullscreen_video_area').removeAttr('disabled');
                $('#smh-modal3 #fullscreen_video_before').removeAttr('disabled');
                $('#smh-modal3 #fullscreen_video_during').removeAttr('disabled');
                $('#smh-modal3 #fullscreen_video_paused').removeAttr('disabled');
                $('#smh-modal3 #fullscreen_video_end').removeAttr('disabled');
                $('#smh-modal3 #fullscreen_controls').removeAttr('disabled');
                $('#smh-modal3 #fullscreen_label').removeAttr('disabled');
                $('#smh-modal3 #fullscreen-tool-play').removeAttr('disabled');
                $('#smh-modal3 #fullscreen-tool-pause').removeAttr('disabled');
                if($('#fullscreen_video_area').is(':checked')){
                    flashvars['fullScreenBtnStartScreen.visible'] = $('#smh-modal3 #fullscreen_video_before').is(':checked')? true : false;
                    flashvars['fullScreenBtnStartScreen.includeInLayout'] = $('#smh-modal3 #fullscreen_video_before').is(':checked')? true : false;
                    flashvars['fullScreenBtnPlayScreen.visible'] = $('#smh-modal3 #fullscreen_video_during').is(':checked')? true : false;
                    flashvars['fullScreenBtnPlayScreen.includeInLayout'] = $('#smh-modal3 #fullscreen_video_during').is(':checked')? true : false;
                    flashvars['fullScreenBtnPauseScreen.visible'] = $('#smh-modal3 #fullscreen_video_paused').is(':checked')? true : false;
                    flashvars['fullScreenBtnPauseScreen.includeInLayout'] = $('#smh-modal3 #fullscreen_video_paused').is(':checked')? true : false;
                    flashvars['fullScreenBtnEndScreen.visible'] = $('#smh-modal3 #fullscreen_video_end').is(':checked')? true : false;
                    flashvars['fullScreenBtnEndScreen.includeInLayout'] = $('#smh-modal3 #fullscreen_video_end').is(':checked')? true : false;
                }
                var fullscreen_label = $('#smh-modal3 #fullscreen_label').val();
                var fullscreen_tool_play = $('#smh-modal3 #fullscreen-tool-play').val();
                var fullscreen_tool_pause = $('#smh-modal3 #fullscreen-tool-pause').val();
                flashvars['fullScreenBtnControllerScreen.visible'] = $('#smh-modal3 #fullscreen_controls').is(':checked')? true : false;
                flashvars['fullScreenBtnControllerScreen.includeInLayout'] = $('#smh-modal3 #fullscreen_controls').is(':checked')? true : false;
                flashvars['fullScreenBtnStartScreen.label'] = fullscreen_label;
                flashvars['fullScreenBtnPlayScreen.label'] = fullscreen_label;
                flashvars['fullScreenBtnPauseScreen.label'] = fullscreen_label;
                flashvars['fullScreenBtnEndScreen.label'] = fullscreen_label;
                flashvars['fullScreenBtnControllerScreen.upTooltip'] = fullscreen_tool_play;
                flashvars['fullScreenBtnControllerScreen.selectedTooltip'] = fullscreen_tool_pause;
            } else {
                $('#smh-modal3 #fullscreen_video_area').attr('disabled','');
                $('#smh-modal3 #fullscreen_video_before').attr('disabled','');
                $('#smh-modal3 #fullscreen_video_during').attr('disabled','');
                $('#smh-modal3 #fullscreen_video_paused').attr('disabled','');
                $('#smh-modal3 #fullscreen_video_end').attr('disabled','');
                $('#smh-modal3 #fullscreen_controls').attr('disabled','');
                $('#smh-modal3 #fullscreen_label').attr('disabled','');
                $('#smh-modal3 #fullscreen-tool-play').attr('disabled','');
                $('#smh-modal3 #fullscreen-tool-pause').attr('disabled','');
                flashvars['fullScreenBtnStartScreen.visible'] = false;
                flashvars['fullScreenBtnStartScreen.includeInLayout'] = false;
                flashvars['fullScreenBtnPlayScreen.visible'] = false;
                flashvars['fullScreenBtnPlayScreen.includeInLayout'] = false;
                flashvars['fullScreenBtnPauseScreen.visible'] = false;
                flashvars['fullScreenBtnPauseScreen.includeInLayout'] = false;
                flashvars['fullScreenBtnEndScreen.visible'] = false;
                flashvars['fullScreenBtnEndScreen.includeInLayout'] = false;
                flashvars['fullScreenBtnControllerScreen.visible'] = false;
                flashvars['fullScreenBtnControllerScreen.includeInLayout'] = false;
            }
            
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }  
        });
        $('#smh-modal3').on('change', '#fullscreen_video_area' ,function(){
            if(this.checked){
                $('#fs-video-options').css('display','block');
                flashvars['fullScreenBtnStartScreen.visible'] = $('#smh-modal3 #fullscreen_video_before').is(':checked')? true : false;
                flashvars['fullScreenBtnStartScreen.includeInLayout'] = $('#smh-modal3 #fullscreen_video_before').is(':checked')? true : false;
                flashvars['fullScreenBtnPlayScreen.visible'] = $('#smh-modal3 #fullscreen_video_during').is(':checked')? true : false;
                flashvars['fullScreenBtnPlayScreen.includeInLayout'] = $('#smh-modal3 #fullscreen_video_during').is(':checked')? true : false;
                flashvars['fullScreenBtnPauseScreen.visible'] = $('#smh-modal3 #fullscreen_video_paused').is(':checked')? true : false;
                flashvars['fullScreenBtnPauseScreen.includeInLayout'] = $('#smh-modal3 #fullscreen_video_paused').is(':checked')? true : false;
                flashvars['fullScreenBtnEndScreen.visible'] = $('#smh-modal3 #fullscreen_video_end').is(':checked')? true : false;
                flashvars['fullScreenBtnEndScreen.includeInLayout'] = $('#smh-modal3 #fullscreen_video_end').is(':checked')? true : false;
            } else {
                $('#fs-video-options').css('display','none');
                flashvars['fullScreenBtnStartScreen.visible'] = false;
                flashvars['fullScreenBtnStartScreen.includeInLayout'] = false;
                flashvars['fullScreenBtnPlayScreen.visible'] = false;
                flashvars['fullScreenBtnPlayScreen.includeInLayout'] = false;
                flashvars['fullScreenBtnPauseScreen.visible'] = false;
                flashvars['fullScreenBtnPauseScreen.includeInLayout'] = false;
                flashvars['fullScreenBtnEndScreen.visible'] = false;
                flashvars['fullScreenBtnEndScreen.includeInLayout'] = false;
            }                     
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#fullscreen_video_before' ,function(){
            flashvars['fullScreenBtnStartScreen.visible'] = $('#smh-modal3 #fullscreen_video_before').is(':checked')? true : false;
            flashvars['fullScreenBtnStartScreen.includeInLayout'] = $('#smh-modal3 #fullscreen_video_before').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#fullscreen_video_during' ,function(){
            flashvars['fullScreenBtnPlayScreen.visible'] = $('#smh-modal3 #fullscreen_video_during').is(':checked')? true : false;
            flashvars['fullScreenBtnPlayScreen.includeInLayout'] = $('#smh-modal3 #fullscreen_video_during').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#fullscreen_video_paused' ,function(){
            flashvars['fullScreenBtnPauseScreen.visible'] = $('#smh-modal3 #fullscreen_video_paused').is(':checked')? true : false;
            flashvars['fullScreenBtnPauseScreen.includeInLayout'] = $('#smh-modal3 #fullscreen_video_paused').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#fullscreen_video_end' ,function(){
            flashvars['fullScreenBtnEndScreen.visible'] = $('#smh-modal3 #fullscreen_video_end').is(':checked')? true : false;
            flashvars['fullScreenBtnEndScreen.includeInLayout'] = $('#smh-modal3 #fullscreen_video_end').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#fullscreen_controls' ,function(){
            flashvars['fullScreenBtnControllerScreen.visible'] = $('#smh-modal3 #fullscreen_controls').is(':checked')? true : false;
            flashvars['fullScreenBtnControllerScreen.includeInLayout'] = $('#smh-modal3 #fullscreen_controls').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#fullscreen_label' ,function(){
            var fullscreen_label = $('#smh-modal3 #fullscreen_label').val();
            flashvars['fullScreenBtnStartScreen.label'] = fullscreen_label;
            flashvars['fullScreenBtnPlayScreen.label'] = fullscreen_label;
            flashvars['fullScreenBtnPauseScreen.label'] = fullscreen_label;
            flashvars['fullScreenBtnEndScreen.label'] = fullscreen_label;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#fullscreen-tool-play' ,function(){
            var fullscreen_tool_play = $('#smh-modal3 #fullscreen-tool-play').val();
            flashvars['fullScreenBtnControllerScreen.upTooltip'] = fullscreen_tool_play;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#fullscreen-tool-pause' ,function(){
            var fullscreen_tool_pause = $('#smh-modal3 #fullscreen-tool-pause').val();
            flashvars['fullScreenBtnControllerScreen.selectedTooltip'] = fullscreen_tool_pause;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player On-video Play Button Option
    playerOVPlay:function(){
        $('#smh-modal3').on('click', '#on_video_play' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 #ovplay_video_area').removeAttr('disabled');
                $('#smh-modal3 #ovplay_video_before').removeAttr('disabled');
                $('#smh-modal3 #ovplay_video_paused').removeAttr('disabled');
                $('#smh-modal3 #ovplay_label').removeAttr('disabled');
                $('#smh-modal3 #ovplay_tool').removeAttr('disabled');
                if($('#ovplay_video_area').is(':checked')){
                    flashvars['onVideoPlayBtnStartScreen.visible'] = $('#smh-modal3 #ovplay_video_before').is(':checked')? true : false;
                    flashvars['onVideoPlayBtnStartScreen.includeInLayout'] = $('#smh-modal3 #ovplay_video_before').is(':checked')? true : false;
                    flashvars['onVideoPlayBtnPauseScreen.visible'] = $('#smh-modal3 #ovplay_video_paused').is(':checked')? true : false;
                    flashvars['onVideoPlayBtnPauseScreen.includeInLayout'] = $('#smh-modal3 #ovplay_video_paused').is(':checked')? true : false;
                }
                var ovplay_label = $('#smh-modal3 #ovplay_label').val();
                var ovplay_tool = $('#smh-modal3 #ovplay_tool').val();
                flashvars['onVideoPlayBtnStartScreen.label'] = ovplay_label;
                flashvars['onVideoPlayBtnPauseScreen.label'] = ovplay_label;
                flashvars['onVideoPlayBtnStartScreen.tooltip'] = ovplay_tool;
                flashvars['onVideoPlayBtnPauseScreen.tooltip'] = ovplay_tool;
            } else {
                $('#smh-modal3 #ovplay_video_area').attr('disabled','');
                $('#smh-modal3 #ovplay_video_before').attr('disabled','');
                $('#smh-modal3 #ovplay_video_paused').attr('disabled','');
                $('#smh-modal3 #ovplay_label').attr('disabled','');
                $('#smh-modal3 #ovplay_tool').attr('disabled','');
                flashvars['onVideoPlayBtnStartScreen.visible'] = false;
                flashvars['onVideoPlayBtnStartScreen.includeInLayout'] = false;
                flashvars['onVideoPlayBtnPauseScreen.visible'] = false;
                flashvars['onVideoPlayBtnPauseScreen.includeInLayout'] = false;
            }
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#ovplay_video_area' ,function(){
            if(this.checked){
                $('#ovplay-video-options').css('display','block');
                flashvars['onVideoPlayBtnStartScreen.visible'] = $('#smh-modal3 #ovplay_video_before').is(':checked')? true : false;
                flashvars['onVideoPlayBtnStartScreen.includeInLayout'] = $('#smh-modal3 #ovplay_video_before').is(':checked')? true : false;
                flashvars['onVideoPlayBtnPauseScreen.visible'] = $('#smh-modal3 #ovplay_video_paused').is(':checked')? true : false;
                flashvars['onVideoPlayBtnPauseScreen.includeInLayout'] = $('#smh-modal3 #ovplay_video_paused').is(':checked')? true : false;
            } else {
                $('#ovplay-video-options').css('display','none');
                flashvars['onVideoPlayBtnStartScreen.visible'] = false;
                flashvars['onVideoPlayBtnStartScreen.includeInLayout'] = false;
                flashvars['onVideoPlayBtnPauseScreen.visible'] = false;
                flashvars['onVideoPlayBtnPauseScreen.includeInLayout'] = false;
            }                     
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#ovplay_video_before' ,function(){
            flashvars['onVideoPlayBtnStartScreen.visible'] = $('#smh-modal3 #ovplay_video_before').is(':checked')? true : false;
            flashvars['onVideoPlayBtnStartScreen.includeInLayout'] = $('#smh-modal3 #ovplay_video_before').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#ovplay_video_paused' ,function(){
            flashvars['onVideoPlayBtnPauseScreen.visible'] = $('#smh-modal3 #ovplay_video_paused').is(':checked')? true : false;
            flashvars['onVideoPlayBtnPauseScreen.includeInLayout'] = $('#smh-modal3 #ovplay_video_paused').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#ovplay_label' ,function(){
            var ovplay_label = $('#smh-modal3 #ovplay_label').val();
            flashvars['onVideoPlayBtnStartScreen.label'] = ovplay_label;
            flashvars['onVideoPlayBtnPauseScreen.label'] = ovplay_label;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#ovplay_tool' ,function(){
            var ovplay_tool = $('#smh-modal3 #ovplay_tool').val();
            flashvars['onVideoPlayBtnStartScreen.tooltip'] = ovplay_tool;
            flashvars['onVideoPlayBtnPauseScreen.tooltip'] = ovplay_tool;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Play Pause Button Option
    playerPlayPause:function(){
        $('#smh-modal3').on('click', '#play_pause' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 #playpause_tool_play').removeAttr('disabled');
                $('#smh-modal3 #playpause_tool_pause').removeAttr('disabled');
                flashvars['playBtnControllerScreen.visible'] = true;
                flashvars['playBtnControllerScreen.includeInLayout'] = true;
                var playpause_tool_play = $('#smh-modal3 #playpause_tool_play').val();
                var playpause_tool_pause = $('#smh-modal3 #playpause_tool_pause').val();
                flashvars['playBtnControllerScreen.upTooltip'] = playpause_tool_play;
                flashvars['playBtnControllerScreen.selectedTooltip'] = playpause_tool_pause;
            } else {
                $('#smh-modal3 #playpause_tool_play').attr('disabled','');
                $('#smh-modal3 #playpause_tool_pause').attr('disabled','');
                flashvars['playBtnControllerScreen.visible'] = false;
                flashvars['playBtnControllerScreen.includeInLayout'] = false;
            }
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#playpause_tool_play' ,function(){
            var playpause_tool_play = $('#smh-modal3 #playpause_tool_play').val();
            flashvars['playBtnControllerScreen.upTooltip'] = playpause_tool_play;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#playpause_tool_pause' ,function(){
            var playpause_tool_pause = $('#smh-modal3 #playpause_tool_pause').val();
            flashvars['playBtnControllerScreen.selectedTooltip'] = playpause_tool_pause;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Volume Option
    playerVolume:function(){
        $('#smh-modal3').on('click', '#volume' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 #volume_tool').removeAttr('disabled');
                $('#smh-modal3 #volume_level').removeAttr('disabled');
                $('#smh-modal3 #vol_select').removeAttr('disabled');
                flashvars['volumeBar.visible'] = true;
                flashvars['volumeBar.includeInLayout'] = true;
                var volume_tool = $('#smh-modal3 #volume_tool').val();
                var volume_level = $('#smh-modal3 #volume_level').val();
                var vol_select = $('#smh-modal3 #vol_select').val();
                flashvars['volumeBar.tooltip'] = volume_tool;
                flashvars['volumeBar.initialValue'] = volume_level;
                flashvars['volumeBar.forceInitialValue'] = vol_select;
            } else {
                $('#smh-modal3 #volume_tool').attr('disabled','');
                $('#smh-modal3 #volume_level').attr('disabled','');
                $('#smh-modal3 #vol_select').attr('disabled','');
                flashvars['volumeBar.visible'] = false;
                flashvars['volumeBar.includeInLayout'] = false;
            }
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#volume_tool' ,function(){
            var volume_tool = $('#smh-modal3 #volume_tool').val();
            flashvars['volumeBar.tooltip'] = volume_tool;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#volume_level' ,function(){
            var volume_level = $('#smh-modal3 #volume_level').val();
            flashvars['volumeBar.initialValue'] = volume_level;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#vol_select' ,function(){
            var vol_select = $('#smh-modal3 #vol_select').val();
            flashvars['volumeBar.forceInitialValue'] = vol_select;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Scrubber Option
    playerScubber:function(){
        $('#smh-modal3').on('click', '#scrubber' ,function(e){
            e.stopPropagation();
            if(this.checked){
                flashvars['scrubberContainer.visible'] = true;
                flashvars['scrubberContainer.includeInLayout'] = true;
            } else {
                flashvars['scrubberContainer.visible'] = false;
                flashvars['scrubberContainer.includeInLayout'] = false;
            }
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Replay Options
    playerReplay:function(){
        $('#smh-modal3').on('click', '#replay' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 #replay_label').removeAttr('disabled');
                $('#smh-modal3 #replay_tool').removeAttr('disabled');
                flashvars['replayBtnEndScreen.visible'] = true;
                flashvars['replayBtnEndScreen.includeInLayout'] = true;
                var replay_label = $('#smh-modal3 #replay_label').val();
                var replay_tool = $('#smh-modal3 #replay_tool').val();
                flashvars['replayBtnEndScreen.label'] = replay_label;
                flashvars['replayBtnEndScreen.tooltip'] = replay_tool;
            }
            else {
                $('#smh-modal3 #replay_label').attr('disabled','');
                $('#smh-modal3 #replay_tool').attr('disabled','');
                flashvars['replayBtnEndScreen.visible'] = false;
                flashvars['replayBtnEndScreen.includeInLayout'] = false;
            }
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#replay_label' ,function(){
            var replay_label = $('#smh-modal3 #replay_label').val();
            flashvars['replayBtnEndScreen.label'] = replay_label;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#replay_tool' ,function(){
            var replay_tool = $('#smh-modal3 #replay_tool').val();
            flashvars['replayBtnEndScreen.tooltip'] = replay_tool;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Unmute Option
    playerUnmute:function(){
        $('#smh-modal3').on('click', '#unmute' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 #unmute_video_area').removeAttr('disabled');
                $('#smh-modal3 #unmute_video_before').removeAttr('disabled');
                $('#smh-modal3 #unmute_video_during').removeAttr('disabled');
                $('#smh-modal3 #unmute_video_paused').removeAttr('disabled');
                $('#smh-modal3 #unmute_video_end').removeAttr('disabled');
                $('#smh-modal3 #unmute_label').removeAttr('disabled');
                $('#smh-modal3 #unmute_tool').removeAttr('disabled');
                if($('#unmute_video_area').is(':checked')){
                    flashvars['unmuteBtnStartScreen.visible'] = $('#smh-modal3 #unmute_video_before').is(':checked')? true : false;
                    flashvars['unmuteBtnStartScreen.includeInLayout'] = $('#smh-modal3 #unmute_video_before').is(':checked')? true : false;
                    flashvars['unmuteBtnPlayScreen.visible'] = $('#smh-modal3 #unmute_video_during').is(':checked')? true : false;
                    flashvars['unmuteBtnPlayScreen.includeInLayout'] = $('#smh-modal3 #unmute_video_during').is(':checked')? true : false;
                    flashvars['unmuteBtnPauseScreen.visible'] = $('#smh-modal3 #unmute_video_paused').is(':checked')? true : false;
                    flashvars['unmuteBtnPauseScreen.includeInLayout'] = $('#smh-modal3 #unmute_video_paused').is(':checked')? true : false;
                    flashvars['unmuteBtnEndScreen.visible'] = $('#smh-modal3 #unmute_video_end').is(':checked')? true : false;
                    flashvars['unmuteBtnEndScreen.includeInLayout'] = $('#smh-modal3 #unmute_video_end').is(':checked')? true : false;
                }
                var unmute_label = $('#smh-modal3 #unmute_label').val();
                var unmute_tool = $('#smh-modal3 #unmute_tool').val();
                flashvars['unmuteBtnStartScreen.label'] = unmute_label;
                flashvars['unmuteBtnPlayScreen.label'] = unmute_label;
                flashvars['unmuteBtnPauseScreen.label'] = unmute_label;
                flashvars['unmuteBtnEndScreen.label'] = unmute_label;
                flashvars['unmuteBtnStartScreen.tooltip'] = unmute_tool;
                flashvars['unmuteBtnPlayScreen.tooltip'] = unmute_tool;
                flashvars['unmuteBtnPauseScreen.tooltip'] = unmute_tool;
                flashvars['unmuteBtnEndScreen.tooltip'] = unmute_tool;
            } else {
                $('#smh-modal3 #unmute_video_area').attr('disabled','');
                $('#smh-modal3 #unmute_video_before').attr('disabled','');
                $('#smh-modal3 #unmute_video_during').attr('disabled','');
                $('#smh-modal3 #unmute_video_paused').attr('disabled','');
                $('#smh-modal3 #unmute_video_end').attr('disabled','');
                $('#smh-modal3 #unmute_label').attr('disabled','');
                $('#smh-modal3 #unmute_tool').attr('disabled','');
                flashvars['unmuteBtnStartScreen.visible'] = false;
                flashvars['unmuteBtnStartScreen.includeInLayout'] = false;
                flashvars['unmuteBtnPlayScreen.visible'] = false;
                flashvars['unmuteBtnPlayScreen.includeInLayout'] = false;
                flashvars['unmuteBtnPauseScreen.visible'] = false;
                flashvars['unmuteBtnPauseScreen.includeInLayout'] = false;
                flashvars['unmuteBtnEndScreen.visible'] = false;
                flashvars['unmuteBtnEndScreen.includeInLayout'] = false;
            }
            
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }  
        });
        $('#smh-modal3').on('change', '#unmute_video_area' ,function(){
            if(this.checked){
                $('#unmute-video-options').css('display','block');
                flashvars['unmuteBtnStartScreen.visible'] = $('#smh-modal3 #unmute_video_before').is(':checked')? true : false;
                flashvars['unmuteBtnStartScreen.includeInLayout'] = $('#smh-modal3 #unmute_video_before').is(':checked')? true : false;
                flashvars['unmuteBtnPlayScreen.visible'] = $('#smh-modal3 #unmute_video_during').is(':checked')? true : false;
                flashvars['unmuteBtnPlayScreen.includeInLayout'] = $('#smh-modal3 #unmute_video_during').is(':checked')? true : false;
                flashvars['unmuteBtnPauseScreen.visible'] = $('#smh-modal3 #unmute_video_paused').is(':checked')? true : false;
                flashvars['unmuteBtnPauseScreen.includeInLayout'] = $('#smh-modal3 #unmute_video_paused').is(':checked')? true : false;
                flashvars['unmuteBtnEndScreen.visible'] = $('#smh-modal3 #unmute_video_end').is(':checked')? true : false;
                flashvars['unmuteBtnEndScreen.includeInLayout'] = $('#smh-modal3 #unmute_video_end').is(':checked')? true : false;
            }
            else {
                $('#unmute-video-options').css('display','none');
                flashvars['unmuteBtnStartScreen.visible'] = false;
                flashvars['unmuteBtnStartScreen.includeInLayout'] = false;
                flashvars['unmuteBtnPlayScreen.visible'] = false;
                flashvars['unmuteBtnPlayScreen.includeInLayout'] = false;
                flashvars['unmuteBtnPauseScreen.visible'] = false;
                flashvars['unmuteBtnPauseScreen.includeInLayout'] = false;
                flashvars['unmuteBtnEndScreen.visible'] = false;
                flashvars['unmuteBtnEndScreen.includeInLayout'] = false;
            }                     
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#unmute_video_before' ,function(){
            flashvars['unmuteBtnStartScreen.visible'] = $('#smh-modal3 #unmute_video_before').is(':checked')? true : false;
            flashvars['unmuteBtnStartScreen.includeInLayout'] = $('#smh-modal3 #unmute_video_before').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#unmute_video_during' ,function(){
            flashvars['unmuteBtnPlayScreen.visible'] = $('#smh-modal3 #unmute_video_during').is(':checked')? true : false;
            flashvars['unmuteBtnPlayScreen.includeInLayout'] = $('#smh-modal3 #unmute_video_during').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#unmute_video_paused' ,function(){
            flashvars['unmuteBtnPauseScreen.visible'] = $('#smh-modal3 #unmute_video_paused').is(':checked')? true : false;
            flashvars['unmuteBtnPauseScreen.includeInLayout'] = $('#smh-modal3 #unmute_video_paused').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#unmute_video_end' ,function(){
            flashvars['unmuteBtnEndScreen.visible'] = $('#smh-modal3 #unmute_video_end').is(':checked')? true : false;
            flashvars['unmuteBtnEndScreen.includeInLayout'] = $('#smh-modal3 #unmute_video_end').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#unmute_label' ,function(){
            var unmute_label = $('#smh-modal3 #unmute_label').val();
            flashvars['unmuteBtnStartScreen.label'] = unmute_label;
            flashvars['unmuteBtnPlayScreen.label'] = unmute_label;
            flashvars['unmuteBtnPauseScreen.label'] = unmute_label;
            flashvars['unmuteBtnEndScreen.label'] = unmute_label;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#unmute_tool' ,function(){
            var unmute_tool = $('#smh-modal3 #unmute_tool').val();
            flashvars['unmuteBtnStartScreen.tooltip'] = unmute_tool;
            flashvars['unmuteBtnPlayScreen.tooltip'] = unmute_tool;
            flashvars['unmuteBtnPauseScreen.tooltip'] = unmute_tool;
            flashvars['unmuteBtnEndScreen.tooltip'] = unmute_tool;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Share Option
    playerShare:function(){
        $('#smh-modal3').on('click', '#share' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 #share_video_area').removeAttr('disabled');
                $('#smh-modal3 #share_video_before').removeAttr('disabled');
                $('#smh-modal3 #share_video_during').removeAttr('disabled');
                $('#smh-modal3 #share_video_paused').removeAttr('disabled');
                $('#smh-modal3 #share_video_end').removeAttr('disabled');
                $('#smh-modal3 #share_controls').removeAttr('disabled');
                $('#smh-modal3 #share_label').removeAttr('disabled');
                $('#smh-modal3 #share_tool').removeAttr('disabled');
                if($('#share_video_area').is(':checked')){
                    flashvars['shareBtnStartScreen.visible'] = $('#smh-modal3 #share_video_before').is(':checked')? true : false;
                    flashvars['shareBtnStartScreen.includeInLayout'] = $('#smh-modal3 #share_video_before').is(':checked')? true : false;
                    flashvars['shareBtnPlayScreen.visible'] = $('#smh-modal3 #share_video_during').is(':checked')? true : false;
                    flashvars['shareBtnPlayScreen.includeInLayout'] = $('#smh-modal3 #share_video_during').is(':checked')? true : false;
                    flashvars['shareBtnPauseScreen.visible'] = $('#smh-modal3 #share_video_paused').is(':checked')? true : false;
                    flashvars['shareBtnPauseScreen.includeInLayout'] = $('#smh-modal3 #share_video_paused').is(':checked')? true : false;
                    flashvars['shareBtnEndScreen.visible'] = $('#smh-modal3 #share_video_end').is(':checked')? true : false;
                    flashvars['shareBtnEndScreen.includeInLayout'] = $('#smh-modal3 #share_video_end').is(':checked')? true : false;
                }
                var share_label = $('#smh-modal3 #share_label').val();
                var share_tool = $('#smh-modal3 #share_tool').val();
                flashvars['shareBtnControllerScreen.visible'] = $('#smh-modal3 #share_controls').is(':checked')? true : false;
                flashvars['shareBtnControllerScreen.includeInLayout'] = $('#smh-modal3 #share_controls').is(':checked')? true : false;
                flashvars['shareBtnStartScreen.label'] = share_label;
                flashvars['shareBtnPlayScreen.label'] = share_label;
                flashvars['shareBtnPauseScreen.label'] = share_label;
                flashvars['shareBtnEndScreen.label'] = share_label;
                flashvars['shareBtnControllerScreen.tooltip'] = share_tool;
                flashvars['shareBtnStartScreen.tooltip'] = share_tool;
                flashvars['shareBtnPlayScreen.tooltip'] = share_tool;
                flashvars['shareBtnPauseScreen.tooltip'] = share_tool;
                flashvars['shareBtnEndScreen.tooltip'] = share_tool;
            } else {
                $('#smh-modal3 #share_video_area').attr('disabled','');
                $('#smh-modal3 #share_video_before').attr('disabled','');
                $('#smh-modal3 #share_video_during').attr('disabled','');
                $('#smh-modal3 #share_video_paused').attr('disabled','');
                $('#smh-modal3 #share_video_end').attr('disabled','');
                $('#smh-modal3 #share_controls').attr('disabled','');
                $('#smh-modal3 #share_label').attr('disabled','');
                $('#smh-modal3 #share_tool').attr('disabled','');
                flashvars['shareBtnStartScreen.visible'] = false;
                flashvars['shareBtnStartScreen.includeInLayout'] = false;
                flashvars['shareBtnPlayScreen.visible'] = false;
                flashvars['shareBtnPlayScreen.includeInLayout'] = false;
                flashvars['shareBtnPauseScreen.visible'] = false;
                flashvars['shareBtnPauseScreen.includeInLayout'] = false;
                flashvars['shareBtnEndScreen.visible'] = false;
                flashvars['shareBtnEndScreen.includeInLayout'] = false;
                flashvars['shareBtnControllerScreen.visible'] = false;
                flashvars['shareBtnControllerScreen.includeInLayout'] = false;
            }
            
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }  
        });
        $('#smh-modal3').on('change', '#share_video_area' ,function(){
            if(this.checked){
                $('#share-video-options').css('display','block');
                flashvars['shareBtnStartScreen.visible'] = $('#smh-modal3 #share_video_before').is(':checked')? true : false;
                flashvars['shareBtnStartScreen.includeInLayout'] = $('#smh-modal3 #share_video_before').is(':checked')? true : false;
                flashvars['shareBtnPlayScreen.visible'] = $('#smh-modal3 #share_video_during').is(':checked')? true : false;
                flashvars['shareBtnPlayScreen.includeInLayout'] = $('#smh-modal3 #share_video_during').is(':checked')? true : false;
                flashvars['shareBtnPauseScreen.visible'] = $('#smh-modal3 #share_video_paused').is(':checked')? true : false;
                flashvars['shareBtnPauseScreen.includeInLayout'] = $('#smh-modal3 #share_video_paused').is(':checked')? true : false;
                flashvars['shareBtnEndScreen.visible'] = $('#smh-modal3 #share_video_end').is(':checked')? true : false;
                flashvars['shareBtnEndScreen.includeInLayout'] = $('#smh-modal3 #share_video_end').is(':checked')? true : false;
            } else {
                $('#share-video-options').css('display','none');
                flashvars['shareBtnStartScreen.visible'] = false;
                flashvars['shareBtnStartScreen.includeInLayout'] = false;
                flashvars['shareBtnPlayScreen.visible'] = false;
                flashvars['shareBtnPlayScreen.includeInLayout'] = false;
                flashvars['shareBtnPauseScreen.visible'] = false;
                flashvars['shareBtnPauseScreen.includeInLayout'] = false;
                flashvars['shareBtnEndScreen.visible'] = false;
                flashvars['shareBtnEndScreen.includeInLayout'] = false;
            }                     
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#share_video_before' ,function(){
            flashvars['shareBtnStartScreen.visible'] = $('#smh-modal3 #share_video_before').is(':checked')? true : false;
            flashvars['shareBtnStartScreen.includeInLayout'] = $('#smh-modal3 #share_video_before').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#share_video_during' ,function(){
            flashvars['shareBtnPlayScreen.visible'] = $('#smh-modal3 #share_video_during').is(':checked')? true : false;
            flashvars['shareBtnPlayScreen.includeInLayout'] = $('#smh-modal3 #share_video_during').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#share_video_paused' ,function(){
            flashvars['shareBtnPauseScreen.visible'] = $('#smh-modal3 #share_video_paused').is(':checked')? true : false;
            flashvars['shareBtnPauseScreen.includeInLayout'] = $('#smh-modal3 #share_video_paused').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#share_video_end' ,function(){
            flashvars['shareBtnEndScreen.visible'] = $('#smh-modal3 #share_video_end').is(':checked')? true : false;
            flashvars['shareBtnEndScreen.includeInLayout'] = $('#smh-modal3 #share_video_end').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#share_controls' ,function(){
            flashvars['shareBtnControllerScreen.visible'] = $('#smh-modal3 #share_controls').is(':checked')? true : false;
            flashvars['shareBtnControllerScreen.includeInLayout'] = $('#smh-modal3 #share_controls').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#share_label' ,function(){
            var share_label = $('#smh-modal3 #share_label').val();
            flashvars['shareBtnStartScreen.label'] = share_label;
            flashvars['shareBtnPlayScreen.label'] = share_label;
            flashvars['shareBtnPauseScreen.label'] = share_label;
            flashvars['shareBtnEndScreen.label'] = share_label;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#share_tool' ,function(){
            var share_tool = $('#smh-modal3 #share_tool').val();
            flashvars['shareBtnControllerScreen.tooltip'] = share_tool;
            flashvars['shareBtnStartScreen.tooltip'] = share_tool;
            flashvars['shareBtnPlayScreen.tooltip'] = share_tool;
            flashvars['shareBtnPauseScreen.tooltip'] = share_tool;
            flashvars['shareBtnEndScreen.tooltip'] = share_tool;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Download Option
    playerDownload:function(){
        $('#smh-modal3').on('click', '#download' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 #dwnld_video_area').removeAttr('disabled');
                $('#smh-modal3 #dwnld_video_before').removeAttr('disabled');
                $('#smh-modal3 #dwnld_video_during').removeAttr('disabled');
                $('#smh-modal3 #dwnld_video_paused').removeAttr('disabled');
                $('#smh-modal3 #dwnld_video_end').removeAttr('disabled');
                $('#smh-modal3 #dwnld_controls').removeAttr('disabled');
                $('#smh-modal3 #dwnld_label').removeAttr('disabled');
                $('#smh-modal3 #dwnld_tool').removeAttr('disabled');
                $('#smh-modal3 #dwnld_flavor').removeAttr('disabled');
                if($('#dwnld_video_area').is(':checked')){
                    flashvars['downloadBtnStartScreen.visible'] = $('#smh-modal3 #dwnld_video_before').is(':checked')? true : false;
                    flashvars['downloadBtnStartScreen.includeInLayout'] = $('#smh-modal3 #dwnld_video_before').is(':checked')? true : false;
                    flashvars['downloadBtnPlayScreen.visible'] = $('#smh-modal3 #dwnld_video_during').is(':checked')? true : false;
                    flashvars['downloadBtnPlayScreen.includeInLayout'] = $('#smh-modal3 #dwnld_video_during').is(':checked')? true : false;
                    flashvars['downloadBtnPauseScreen.visible'] = $('#smh-modal3 #dwnld_video_paused').is(':checked')? true : false;
                    flashvars['downloadBtnPauseScreen.includeInLayout'] = $('#smh-modal3 #dwnld_video_paused').is(':checked')? true : false;
                    flashvars['downloadBtnEndScreen.visible'] = $('#smh-modal3 #dwnld_video_end').is(':checked')? true : false;
                    flashvars['downloadBtnEndScreen.includeInLayout'] = $('#smh-modal3 #dwnld_video_end').is(':checked')? true : false;
                }
                var dwnld_label = $('#smh-modal3 #dwnld_label').val();
                var dwnld_tool = $('#smh-modal3 #dwnld_tool').val();
                var dwnld_flavor = $('#smh-modal3 #dwnld_flavor').val();
                flashvars['downloadBtnControllerScreen.visible'] = $('#smh-modal3 #dwnld_controls').is(':checked')? true : false;
                flashvars['downloadBtnControllerScreen.includeInLayout'] = $('#smh-modal3 #dwnld_controls').is(':checked')? true : false;
                flashvars['downloadBtnStartScreen.label'] = dwnld_label;
                flashvars['downloadBtnPlayScreen.label'] = dwnld_label;
                flashvars['downloadBtnPauseScreen.label'] = dwnld_label;
                flashvars['downloadBtnEndScreen.label'] = dwnld_label;
                flashvars['downloadBtnStartScreen.tooltip'] = dwnld_tool;
                flashvars['downloadBtnPlayScreen.tooltip'] = dwnld_tool;
                flashvars['downloadBtnPauseScreen.tooltip'] = dwnld_tool;
                flashvars['downloadBtnEndScreen.tooltip'] = dwnld_tool;
                flashvars['download.flavorId'] = dwnld_flavor;
            } else {
                $('#smh-modal3 #dwnld_video_area').attr('disabled','');
                $('#smh-modal3 #dwnld_video_before').attr('disabled','');
                $('#smh-modal3 #dwnld_video_during').attr('disabled','');
                $('#smh-modal3 #dwnld_video_paused').attr('disabled','');
                $('#smh-modal3 #dwnld_video_end').attr('disabled','');
                $('#smh-modal3 #dwnld_controls').attr('disabled','');
                $('#smh-modal3 #dwnld_label').attr('disabled','');
                $('#smh-modal3 #dwnld_tool').attr('disabled','');
                $('#smh-modal3 #dwnld_flavor').attr('disabled','');
                flashvars['downloadBtnStartScreen.visible'] = false;
                flashvars['downloadBtnStartScreen.includeInLayout'] = false;
                flashvars['downloadBtnPlayScreen.visible'] = false;
                flashvars['downloadBtnPlayScreen.includeInLayout'] = false;
                flashvars['downloadBtnPauseScreen.visible'] = false;
                flashvars['downloadBtnPauseScreen.includeInLayout'] = false;
                flashvars['downloadBtnEndScreen.visible'] = false;
                flashvars['downloadBtnEndScreen.includeInLayout'] = false;
                flashvars['downloadBtnControllerScreen.visible'] = false;
                flashvars['downloadBtnControllerScreen.includeInLayout'] = false;
            }
            
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }  
        });
        $('#smh-modal3').on('change', '#dwnld_video_area' ,function(){
            if(this.checked){
                $('#dwnld-video-options').css('display','block');
                flashvars['downloadBtnStartScreen.visible'] = $('#smh-modal3 #dwnld_video_before').is(':checked')? true : false;
                flashvars['downloadBtnStartScreen.includeInLayout'] = $('#smh-modal3 #dwnld_video_before').is(':checked')? true : false;
                flashvars['downloadBtnPlayScreen.visible'] = $('#smh-modal3 #dwnld_video_during').is(':checked')? true : false;
                flashvars['downloadBtnPlayScreen.includeInLayout'] = $('#smh-modal3 #dwnld_video_during').is(':checked')? true : false;
                flashvars['downloadBtnPauseScreen.visible'] = $('#smh-modal3 #dwnld_video_paused').is(':checked')? true : false;
                flashvars['downloadBtnPauseScreen.includeInLayout'] = $('#smh-modal3 #dwnld_video_paused').is(':checked')? true : false;
                flashvars['downloadBtnEndScreen.visible'] = $('#smh-modal3 #dwnld_video_end').is(':checked')? true : false;
                flashvars['downloadBtnEndScreen.includeInLayout'] = $('#smh-modal3 #dwnld_video_end').is(':checked')? true : false;
            }
            else {
                $('#dwnld-video-options').css('display','none');
                flashvars['downloadBtnStartScreen.visible'] = false;
                flashvars['downloadBtnStartScreen.includeInLayout'] = false;
                flashvars['downloadBtnPlayScreen.visible'] = false;
                flashvars['downloadBtnPlayScreen.includeInLayout'] = false;
                flashvars['downloadBtnPauseScreen.visible'] = false;
                flashvars['downloadBtnPauseScreen.includeInLayout'] = false;
                flashvars['downloadBtnEndScreen.visible'] = false;
                flashvars['downloadBtnEndScreen.includeInLayout'] = false;
            }                     
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#dwnld_video_before' ,function(){
            flashvars['downloadBtnStartScreen.visible'] = $('#smh-modal3 #dwnld_video_before').is(':checked')? true : false;
            flashvars['downloadBtnStartScreen.includeInLayout'] = $('#smh-modal3 #dwnld_video_before').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#dwnld_video_during' ,function(){
            flashvars['downloadBtnPlayScreen.visible'] = $('#smh-modal3 #dwnld_video_during').is(':checked')? true : false;
            flashvars['downloadBtnPlayScreen.includeInLayout'] = $('#smh-modal3 #dwnld_video_during').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#dwnld_video_paused' ,function(){
            flashvars['downloadBtnPauseScreen.visible'] = $('#smh-modal3 #dwnld_video_paused').is(':checked')? true : false;
            flashvars['downloadBtnPauseScreen.includeInLayout'] = $('#smh-modal3 #dwnld_video_paused').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#dwnld_video_end' ,function(){
            flashvars['downloadBtnEndScreen.visible'] = $('#smh-modal3 #dwnld_video_end').is(':checked')? true : false;
            flashvars['downloadBtnEndScreen.includeInLayout'] = $('#smh-modal3 #dwnld_video_end').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#dwnld_controls' ,function(){
            flashvars['downloadBtnControllerScreen.visible'] = $('#smh-modal3 #dwnld_controls').is(':checked')? true : false;
            flashvars['downloadBtnControllerScreen.includeInLayout'] = $('#smh-modal3 #dwnld_controls').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#dwnld_label' ,function(){
            var dwnld_label = $('#smh-modal3 #dwnld_label').val();
            flashvars['downloadBtnStartScreen.label'] = dwnld_label;
            flashvars['downloadBtnPlayScreen.label'] = dwnld_label;
            flashvars['downloadBtnPauseScreen.label'] = dwnld_label;
            flashvars['downloadBtnEndScreen.label'] = dwnld_label;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#dwnld_tool' ,function(){
            var dwnld_tool = $('#smh-modal3 #dwnld_tool').val();
            flashvars['downloadBtnStartScreen.tooltip'] = dwnld_tool;
            flashvars['downloadBtnPlayScreen.tooltip'] = dwnld_tool;
            flashvars['downloadBtnPauseScreen.tooltip'] = dwnld_tool;
            flashvars['downloadBtnEndScreen.tooltip'] = dwnld_tool;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#dwnld_flavor' ,function(){
            var dwnld_flavor = $('#smh-modal3 #dwnld_flavor').val();
            flashvars['download.flavorId'] = dwnld_flavor;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Thumbnail Option
    playerThumbnail:function(){
        $('#smh-modal3').on('click', '#thumbnail' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 #thumbnail_video_area').removeAttr('disabled');
                $('#smh-modal3 #thumbnail_video_before').removeAttr('disabled');
                $('#smh-modal3 #thumbnail_video_during').removeAttr('disabled');
                $('#smh-modal3 #thumbnail_video_paused').removeAttr('disabled');
                $('#smh-modal3 #thumbnail_video_end').removeAttr('disabled');
                $('#smh-modal3 #thumbnail_controls').removeAttr('disabled');
                $('#smh-modal3 #thumbnail_label').removeAttr('disabled');
                $('#smh-modal3 #thumbnail_tool').removeAttr('disabled');
                if($('#thumbnail_video_area').is(':checked')){
                    flashvars['captureThumbBtnStartScreen.visible'] = $('#smh-modal3 #thumbnail_video_before').is(':checked')? true : false;
                    flashvars['captureThumbBtnStartScreen.includeInLayout'] = $('#smh-modal3 #thumbnail_video_before').is(':checked')? true : false;
                    flashvars['captureThumbBtnPlayScreen.visible'] = $('#smh-modal3 #thumbnail_video_during').is(':checked')? true : false;
                    flashvars['captureThumbBtnPlayScreen.includeInLayout'] = $('#smh-modal3 #thumbnail_video_during').is(':checked')? true : false;
                    flashvars['captureThumbBtnPauseScreen.visible'] = $('#smh-modal3 #thumbnail_video_paused').is(':checked')? true : false;
                    flashvars['captureThumbBtnPauseScreen.includeInLayout'] = $('#smh-modal3 #thumbnail_video_paused').is(':checked')? true : false;
                    flashvars['captureThumbBtnEndScreen.visible'] = $('#smh-modal3 #thumbnail_video_end').is(':checked')? true : false;
                    flashvars['captureThumbBtnEndScreen.includeInLayout'] = $('#smh-modal3 #thumbnail_video_end').is(':checked')? true : false;
                }
                var thumbnail_label = $('#smh-modal3 #thumbnail_label').val();
                var thumbnail_tool = $('#smh-modal3 #thumbnail_tool').val();
                flashvars['captureThumbBtnControllerScreen.visible'] = $('#smh-modal3 #thumbnail_controls').is(':checked')? true : false;
                flashvars['captureThumbBtnControllerScreen.includeInLayout'] = $('#smh-modal3 #thumbnail_controls').is(':checked')? true : false;
                flashvars['captureThumbBtnStartScreen.label'] = thumbnail_label;
                flashvars['captureThumbBtnPlayScreen.label'] = thumbnail_label;
                flashvars['captureThumbBtnPauseScreen.label'] = thumbnail_label;
                flashvars['captureThumbBtnEndScreen.label'] = thumbnail_label;
                flashvars['captureThumbBtnStartScreen.tooltip'] = thumbnail_tool;
                flashvars['captureThumbBtnPlayScreen.tooltip'] = thumbnail_tool;
                flashvars['captureThumbBtnPauseScreen.tooltip'] = thumbnail_tool;
                flashvars['captureThumbBtnEndScreen.tooltip'] = thumbnail_tool;
            } else {
                $('#smh-modal3 #thumbnail_video_area').attr('disabled','');
                $('#smh-modal3 #thumbnail_video_before').attr('disabled','');
                $('#smh-modal3 #thumbnail_video_during').attr('disabled','');
                $('#smh-modal3 #thumbnail_video_paused').attr('disabled','');
                $('#smh-modal3 #thumbnail_video_end').attr('disabled','');
                $('#smh-modal3 #thumbnail_controls').attr('disabled','');
                $('#smh-modal3 #thumbnail_label').attr('disabled','');
                $('#smh-modal3 #thumbnail_tool').attr('disabled','');
                flashvars['captureThumbBtnStartScreen.visible'] = false;
                flashvars['captureThumbBtnStartScreen.includeInLayout'] = false;
                flashvars['captureThumbBtnPlayScreen.visible'] = false;
                flashvars['captureThumbBtnPlayScreen.includeInLayout'] = false;
                flashvars['captureThumbBtnPauseScreen.visible'] = false;
                flashvars['captureThumbBtnPauseScreen.includeInLayout'] = false;
                flashvars['captureThumbBtnEndScreen.visible'] = false;
                flashvars['captureThumbBtnEndScreen.includeInLayout'] = false;
                flashvars['captureThumbBtnControllerScreen.visible'] = false;
                flashvars['captureThumbBtnControllerScreen.includeInLayout'] = false;
            }
            
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }  
        });
        $('#smh-modal3').on('change', '#thumbnail_video_area' ,function(){
            if(this.checked){
                $('#thumbnail-video-options').css('display','block');
                flashvars['captureThumbBtnStartScreen.visible'] = $('#smh-modal3 #thumbnail_video_before').is(':checked')? true : false;
                flashvars['captureThumbBtnStartScreen.includeInLayout'] = $('#smh-modal3 #thumbnail_video_before').is(':checked')? true : false;
                flashvars['captureThumbBtnPlayScreen.visible'] = $('#smh-modal3 #thumbnail_video_during').is(':checked')? true : false;
                flashvars['captureThumbBtnPlayScreen.includeInLayout'] = $('#smh-modal3 #thumbnail_video_during').is(':checked')? true : false;
                flashvars['captureThumbBtnPauseScreen.visible'] = $('#smh-modal3 #thumbnail_video_paused').is(':checked')? true : false;
                flashvars['captureThumbBtnPauseScreen.includeInLayout'] = $('#smh-modal3 #thumbnail_video_paused').is(':checked')? true : false;
                flashvars['captureThumbBtnEndScreen.visible'] = $('#smh-modal3 #thumbnail_video_end').is(':checked')? true : false;
                flashvars['captureThumbBtnEndScreen.includeInLayout'] = $('#smh-modal3 #thumbnail_video_end').is(':checked')? true : false;
            } else {
                $('#thumbnail-video-options').css('display','none');
                flashvars['captureThumbBtnStartScreen.visible'] = false;
                flashvars['captureThumbBtnStartScreen.includeInLayout'] = false;
                flashvars['captureThumbBtnPlayScreen.visible'] = false;
                flashvars['captureThumbBtnPlayScreen.includeInLayout'] = false;
                flashvars['captureThumbBtnPauseScreen.visible'] = false;
                flashvars['captureThumbBtnPauseScreen.includeInLayout'] = false;
                flashvars['captureThumbBtnEndScreen.visible'] = false;
                flashvars['captureThumbBtnEndScreen.includeInLayout'] = false;
            }                     
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#thumbnail_video_before' ,function(){
            flashvars['captureThumbBtnStartScreen.visible'] = $('#smh-modal3 #thumbnail_video_before').is(':checked')? true : false;
            flashvars['captureThumbBtnStartScreen.includeInLayout'] = $('#smh-modal3 #thumbnail_video_before').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#thumbnail_video_during' ,function(){
            flashvars['captureThumbBtnPlayScreen.visible'] = $('#smh-modal3 #thumbnail_video_during').is(':checked')? true : false;
            flashvars['captureThumbBtnPlayScreen.includeInLayout'] = $('#smh-modal3 #thumbnail_video_during').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#thumbnail_video_paused' ,function(){
            flashvars['captureThumbBtnPauseScreen.visible'] = $('#smh-modal3 #thumbnail_video_paused').is(':checked')? true : false;
            flashvars['captureThumbBtnPauseScreen.includeInLayout'] = $('#smh-modal3 #thumbnail_video_paused').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#thumbnail_video_end' ,function(){
            flashvars['captureThumbBtnEndScreen.visible'] = $('#smh-modal3 #thumbnail_video_end').is(':checked')? true : false;
            flashvars['captureThumbBtnEndScreen.includeInLayout'] = $('#smh-modal3 #thumbnail_video_end').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#thumbnail_controls' ,function(){
            flashvars['captureThumbBtnControllerScreen.visible'] = $('#smh-modal3 #thumbnail_controls').is(':checked')? true : false;
            flashvars['captureThumbBtnControllerScreen.includeInLayout'] = $('#smh-modal3 #thumbnail_controls').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#thumbnail_label' ,function(){
            var thumbnail_label = $('#smh-modal3 #thumbnail_label').val();
            flashvars['captureThumbBtnStartScreen.label'] = thumbnail_label;
            flashvars['captureThumbBtnPlayScreen.label'] = thumbnail_label;
            flashvars['captureThumbBtnPauseScreen.label'] = thumbnail_label;
            flashvars['captureThumbBtnEndScreen.label'] = thumbnail_label;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#thumbnail_tool' ,function(){
            var thumbnail_tool = $('#smh-modal3 #thumbnail_tool').val();
            flashvars['captureThumbBtnStartScreen.tooltip'] = thumbnail_tool;
            flashvars['captureThumbBtnPlayScreen.tooltip'] = thumbnail_tool;
            flashvars['captureThumbBtnPauseScreen.tooltip'] = thumbnail_tool;
            flashvars['captureThumbBtnEndScreen.tooltip'] = thumbnail_tool;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Stars Option
    playerStars:function(){
        $('#smh-modal3').on('click', '#stars' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 #view-only').removeAttr('disabled');
                flashvars['stars.visible'] = true;
                flashvars['stars.includeInLayout'] = true;
                var view_only = $('#smh-modal3 #view-only').val();
                flashvars['stars.editable'] = view_only;
            } else {
                $('#smh-modal3 #view-only').attr('disabled','');
                flashvars['stars.visible'] = false;
                flashvars['stars.includeInLayout'] = false;
            }            
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }  
        });
        $('#smh-modal3').on('change', '#view-only' ,function(){
            var view_only = $('#smh-modal3 #view-only').val();
            flashvars['stars.editable'] = view_only;                  
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
    },
    //Player Captions Option
    playerCaptions:function(){
        $('#smh-modal3').on('click', '#captions' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 #cap_textcolor').removeAttr('disabled');
                $('#smh-modal3 #text-effect').removeAttr('disabled');
                $('#smh-modal3 #cap_glowcolor').removeAttr('disabled');
                $('#smh-modal3 #cap_glowblur').removeAttr('disabled');
                $('#smh-modal3 #cap_backcolor').removeAttr('disabled');
                $('#smh-modal3 #cap_fontsize').removeAttr('disabled');
                $('#smh-modal3 #cap-fontfam').removeAttr('disabled');
                $('#smh-modal3 #cap_prompt').removeAttr('disabled');
                $('#smh-modal3 #cap_tooltip').removeAttr('disabled');
                capVideo = true;
                var text_color = $('#smh-modal3 #cap_textcolor').val();
                capVideo_textcolor = text_color;
                var text_effect = $('#smh-modal3 #text-effect').val();
                if(text_effect == 'glow'){
                    capVideo_textglow = true;
                    capVideo_backlayer = false;
                } else {
                    capVideo_textglow = false;
                    capVideo_backlayer = true;
                }
                var glow_color = $('#smh-modal3 #cap_glowcolor').val();
                capVideo_glowcolor = glow_color;
                var glow_blur = $('#smh-modal3 #cap_glowblur').val();
                capVideo_glowblur = glow_blur;
                var background = $('#smh-modal3 #cap_backcolor').val();
                capVideo_backcolor = background;
                var fontsize = $('#smh-modal3 #cap_fontsize').val();
                capVideo_fontsize = fontsize;
                var fontfam = $('#smh-modal3 #cap-fontfam').val();
                capVideo_fontfamily = fontfam;
                var prompt = $('#smh-modal3 #cap_prompt').val();
                capVideo_prompt = prompt;
                var tooltip = $('#smh-modal3 #cap_tooltip').val();
                capVideo_tooltip = tooltip;
                
            } else {
                $('#smh-modal3 #cap_textcolor').attr('disabled','');
                $('#smh-modal3 #text-effect').attr('disabled','');
                $('#smh-modal3 #cap_glowcolor').attr('disabled','');
                $('#smh-modal3 #cap_glowblur').attr('disabled','');
                $('#smh-modal3 #cap_backcolor').attr('disabled','');
                $('#smh-modal3 #cap_fontsize').attr('disabled','');
                $('#smh-modal3 #cap-fontfam').attr('disabled','');
                $('#smh-modal3 #cap_prompt').attr('disabled','');
                $('#smh-modal3 #cap_tooltip').attr('disabled','');
                capVideo = false;
            }            
        });
        $('#smh-modal3').on('change', '#text-effect' ,function(){
            var text_effect = $('#smh-modal3 #text-effect').val();
            if(text_effect == 'glow'){
                capVideo_textglow = true;
                capVideo_backlayer = false;
            } else {
                capVideo_textglow = false;
                capVideo_backlayer = true;
            }
        });
        $('#smh-modal3').on('change', '#cap_glowblur' ,function(){
            var glow_blur = $('#smh-modal3 #cap_glowblur').val();
            capVideo_glowblur = glow_blur;
        });
        $('#smh-modal3').on('change', '#cap_fontsize' ,function(){
            var fontsize = $('#smh-modal3 #cap_fontsize').val();
            capVideo_fontsize = fontsize;
        });
        $('#smh-modal3').on('change', '#cap-fontfam' ,function(){
            var fontfam = $('#smh-modal3 #cap-fontfam').val();
            capVideo_fontfamily = fontfam;
        });
        $('#smh-modal3').on('change', '#cap_prompt' ,function(){
            var prompt = $('#smh-modal3 #cap_prompt').val();
            capVideo_prompt = prompt;
        });
        $('#smh-modal3').on('change', '#cap_tooltip' ,function(){
            var tooltip = $('#smh-modal3 #cap_tooltip').val();
            capVideo_tooltip = tooltip;
        });
    },
    //Player Custom Button 1 Option
    customButton1:function(){
        $('#smh-modal3').on('click', '#customButton1' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 #customButton1_video_area').removeAttr('disabled');
                $('#smh-modal3 #customButton1_video_before').removeAttr('disabled');
                $('#smh-modal3 #customButton1_video_during').removeAttr('disabled');
                $('#smh-modal3 #customButton1_video_paused').removeAttr('disabled');
                $('#smh-modal3 #customButton1_video_end').removeAttr('disabled');
                $('#smh-modal3 #customButton1_controls').removeAttr('disabled');
                $('#smh-modal3 #customButton1_label').removeAttr('disabled');
                $('#smh-modal3 #customButton1_tool').removeAttr('disabled');
                if($('#customButton1_video_area').is(':checked')){
                    flashvars['custom1BtnStartScreen.visible'] = $('#smh-modal3 #customButton1_video_before').is(':checked')? true : false;
                    flashvars['custom1BtnStartScreen.includeInLayout'] = $('#smh-modal3 #customButton1_video_before').is(':checked')? true : false;
                    flashvars['custom1BtnPlayScreen.visible'] = $('#smh-modal3 #customButton1_video_during').is(':checked')? true : false;
                    flashvars['custom1BtnPlayScreen.includeInLayout'] = $('#smh-modal3 #customButton1_video_during').is(':checked')? true : false;
                    flashvars['custom1BtnPauseScreen.visible'] = $('#smh-modal3 #customButton1_video_paused').is(':checked')? true : false;
                    flashvars['custom1BtnPauseScreen.includeInLayout'] = $('#smh-modal3 #customButton1_video_paused').is(':checked')? true : false;
                    flashvars['custom1BtnEndScreen.visible'] = $('#smh-modal3 #customButton1_video_end').is(':checked')? true : false;
                    flashvars['custom1BtnEndScreen.includeInLayout'] = $('#smh-modal3 #customButton1_video_end').is(':checked')? true : false;
                }
                var customButton1_label = $('#smh-modal3 #customButton1_label').val();
                var customButton1_tool = $('#smh-modal3 #customButton1_tool').val();
                flashvars['custom1BtnControllerScreen.visible'] = $('#smh-modal3 #customButton1_controls').is(':checked')? true : false;
                flashvars['custom1BtnControllerScreen.includeInLayout'] = $('#smh-modal3 #customButton1_controls').is(':checked')? true : false;
                flashvars['custom1BtnStartScreen.label'] = customButton1_label;
                flashvars['custom1BtnPlayScreen.label'] = customButton1_label;
                flashvars['custom1BtnPauseScreen.label'] = customButton1_label;
                flashvars['custom1BtnEndScreen.label'] = customButton1_label;
                flashvars['custom1BtnStartScreen.tooltip'] = customButton1_tool;
                flashvars['custom1BtnPlayScreen.tooltip'] = customButton1_tool;
                flashvars['custom1BtnPauseScreen.tooltip'] = customButton1_tool;
                flashvars['custom1BtnEndScreen.tooltip'] = customButton1_tool;
            } else {                
                $('#smh-modal3 #customButton1_video_area').attr('disabled','');
                $('#smh-modal3 #customButton1_video_before').attr('disabled','');
                $('#smh-modal3 #customButton1_video_during').attr('disabled','');
                $('#smh-modal3 #customButton1_video_paused').attr('disabled','');
                $('#smh-modal3 #customButton1_video_end').attr('disabled','');
                $('#smh-modal3 #customButton1_controls').attr('disabled','');
                $('#smh-modal3 #customButton1_label').attr('disabled','');
                $('#smh-modal3 #customButton1_tool').attr('disabled','');
                flashvars['custom1BtnStartScreen.visible'] = false;
                flashvars['custom1BtnStartScreen.includeInLayout'] = false;
                flashvars['custom1BtnPlayScreen.visible'] = false;
                flashvars['custom1BtnPlayScreen.includeInLayout'] = false;
                flashvars['custom1BtnPauseScreen.visible'] = false;
                flashvars['custom1BtnPauseScreen.includeInLayout'] = false;
                flashvars['custom1BtnEndScreen.visible'] = false;
                flashvars['custom1BtnEndScreen.includeInLayout'] = false;
                flashvars['custom1BtnControllerScreen.visible'] = false;
                flashvars['custom1BtnControllerScreen.includeInLayout'] = false;
            }            
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }  
        });
        $('#smh-modal3').on('change', '#customButton1_video_area' ,function(){
            if(this.checked){
                $('#customButton1-video-options').css('display','block');
                flashvars['custom1BtnStartScreen.visible'] = $('#smh-modal3 #customButton1_video_before').is(':checked')? true : false;
                flashvars['custom1BtnStartScreen.includeInLayout'] = $('#smh-modal3 #customButton1_video_before').is(':checked')? true : false;
                flashvars['custom1BtnPlayScreen.visible'] = $('#smh-modal3 #customButton1_video_during').is(':checked')? true : false;
                flashvars['custom1BtnPlayScreen.includeInLayout'] = $('#smh-modal3 #customButton1_video_during').is(':checked')? true : false;
                flashvars['custom1BtnPauseScreen.visible'] = $('#smh-modal3 #customButton1_video_paused').is(':checked')? true : false;
                flashvars['custom1BtnPauseScreen.includeInLayout'] = $('#smh-modal3 #customButton1_video_paused').is(':checked')? true : false;
                flashvars['custom1BtnEndScreen.visible'] = $('#smh-modal3 #customButton1_video_end').is(':checked')? true : false;
                flashvars['custom1BtnEndScreen.includeInLayout'] = $('#smh-modal3 #customButton1_video_end').is(':checked')? true : false;
            } else {
                $('#customButton1-video-options').css('display','none');
                flashvars['custom1BtnStartScreen.visible'] = false;
                flashvars['custom1BtnStartScreen.includeInLayout'] = false;
                flashvars['custom1BtnPlayScreen.visible'] = false;
                flashvars['custom1BtnPlayScreen.includeInLayout'] = false;
                flashvars['custom1BtnPauseScreen.visible'] = false;
                flashvars['custom1BtnPauseScreen.includeInLayout'] = false;
                flashvars['custom1BtnEndScreen.visible'] = false;
                flashvars['custom1BtnEndScreen.includeInLayout'] = false;
            }                     
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#customButton1_video_before' ,function(){
            flashvars['custom1BtnStartScreen.visible'] = $('#smh-modal3 #customButton1_video_before').is(':checked')? true : false;
            flashvars['custom1BtnStartScreen.includeInLayout'] = $('#smh-modal3 #customButton1_video_before').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton1_video_during' ,function(){
            flashvars['custom1BtnPlayScreen.visible'] = $('#smh-modal3 #customButton1_video_during').is(':checked')? true : false;
            flashvars['custom1BtnPlayScreen.includeInLayout'] = $('#smh-modal3 #customButton1_video_during').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton1_video_paused' ,function(){
            flashvars['custom1BtnPauseScreen.visible'] = $('#smh-modal3 #customButton1_video_paused').is(':checked')? true : false;
            flashvars['custom1BtnPauseScreen.includeInLayout'] = $('#smh-modal3 #customButton1_video_paused').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton1_video_end' ,function(){
            flashvars['custom1BtnEndScreen.visible'] = $('#smh-modal3 #customButton1_video_end').is(':checked')? true : false;
            flashvars['custom1BtnEndScreen.includeInLayout'] = $('#smh-modal3 #customButton1_video_end').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton1_controls' ,function(){
            flashvars['custom1BtnControllerScreen.visible'] = $('#smh-modal3 #customButton1_controls').is(':checked')? true : false;
            flashvars['custom1BtnControllerScreen.includeInLayout'] = $('#smh-modal3 #customButton1_controls').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton1_label' ,function(){
            var customButton1_label = $('#smh-modal3 #customButton1_label').val();
            flashvars['custom1BtnStartScreen.label'] = customButton1_label;
            flashvars['custom1BtnPlayScreen.label'] = customButton1_label;
            flashvars['custom1BtnPauseScreen.label'] = customButton1_label;
            flashvars['custom1BtnEndScreen.label'] = customButton1_label;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton1_tool' ,function(){
            var customButton1_tool = $('#smh-modal3 #customButton1_tool').val();
            flashvars['custom1BtnStartScreen.tooltip'] = customButton1_tool;
            flashvars['custom1BtnPlayScreen.tooltip'] = customButton1_tool;
            flashvars['custom1BtnPauseScreen.tooltip'] = customButton1_tool;
            flashvars['custom1BtnEndScreen.tooltip'] = customButton1_tool;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Custom Button 2 Option
    customButton2:function(){
        $('#smh-modal3').on('click', '#customButton2' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 #customButton2_video_area').removeAttr('disabled');
                $('#smh-modal3 #customButton2_video_before').removeAttr('disabled');
                $('#smh-modal3 #customButton2_video_during').removeAttr('disabled');
                $('#smh-modal3 #customButton2_video_paused').removeAttr('disabled');
                $('#smh-modal3 #customButton2_video_end').removeAttr('disabled');
                $('#smh-modal3 #customButton2_controls').removeAttr('disabled');
                $('#smh-modal3 #customButton2_label').removeAttr('disabled');
                $('#smh-modal3 #customButton2_tool').removeAttr('disabled');
                if($('#customButton2_video_area').is(':checked')){
                    flashvars['custom2BtnStartScreen.visible'] = $('#smh-modal3 #customButton2_video_before').is(':checked')? true : false;
                    flashvars['custom2BtnStartScreen.includeInLayout'] = $('#smh-modal3 #customButton2_video_before').is(':checked')? true : false;
                    flashvars['custom2BtnPlayScreen.visible'] = $('#smh-modal3 #customButton2_video_during').is(':checked')? true : false;
                    flashvars['custom2BtnPlayScreen.includeInLayout'] = $('#smh-modal3 #customButton2_video_during').is(':checked')? true : false;
                    flashvars['custom2BtnPauseScreen.visible'] = $('#smh-modal3 #customButton2_video_paused').is(':checked')? true : false;
                    flashvars['custom2BtnPauseScreen.includeInLayout'] = $('#smh-modal3 #customButton2_video_paused').is(':checked')? true : false;
                    flashvars['custom2BtnEndScreen.visible'] = $('#smh-modal3 #customButton2_video_end').is(':checked')? true : false;
                    flashvars['custom2BtnEndScreen.includeInLayout'] = $('#smh-modal3 #customButton2_video_end').is(':checked')? true : false;
                }
                var customButton2_label = $('#smh-modal3 #customButton2_label').val();
                var customButton2_tool = $('#smh-modal3 #customButton2_tool').val();
                flashvars['custom2BtnControllerScreen.visible'] = $('#smh-modal3 #customButton2_controls').is(':checked')? true : false;
                flashvars['custom2BtnControllerScreen.includeInLayout'] = $('#smh-modal3 #customButton2_controls').is(':checked')? true : false;
                flashvars['custom2BtnStartScreen.label'] = customButton2_label;
                flashvars['custom2BtnPlayScreen.label'] = customButton2_label;
                flashvars['custom2BtnPauseScreen.label'] = customButton2_label;
                flashvars['custom2BtnEndScreen.label'] = customButton2_label;
                flashvars['custom2BtnStartScreen.tooltip'] = customButton2_tool;
                flashvars['custom2BtnPlayScreen.tooltip'] = customButton2_tool;
                flashvars['custom2BtnPauseScreen.tooltip'] = customButton2_tool;
                flashvars['custom2BtnEndScreen.tooltip'] = customButton2_tool;
            } else {                
                $('#smh-modal3 #customButton2_video_area').attr('disabled','');
                $('#smh-modal3 #customButton2_video_before').attr('disabled','');
                $('#smh-modal3 #customButton2_video_during').attr('disabled','');
                $('#smh-modal3 #customButton2_video_paused').attr('disabled','');
                $('#smh-modal3 #customButton2_video_end').attr('disabled','');
                $('#smh-modal3 #customButton2_controls').attr('disabled','');
                $('#smh-modal3 #customButton2_label').attr('disabled','');
                $('#smh-modal3 #customButton2_tool').attr('disabled','');
                flashvars['custom2BtnStartScreen.visible'] = false;
                flashvars['custom2BtnStartScreen.includeInLayout'] = false;
                flashvars['custom2BtnPlayScreen.visible'] = false;
                flashvars['custom2BtnPlayScreen.includeInLayout'] = false;
                flashvars['custom2BtnPauseScreen.visible'] = false;
                flashvars['custom2BtnPauseScreen.includeInLayout'] = false;
                flashvars['custom2BtnEndScreen.visible'] = false;
                flashvars['custom2BtnEndScreen.includeInLayout'] = false;
                flashvars['custom2BtnControllerScreen.visible'] = false;
                flashvars['custom2BtnControllerScreen.includeInLayout'] = false;
            }            
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }  
        });
        $('#smh-modal3').on('change', '#customButton2_video_area' ,function(){
            if(this.checked){
                $('#customButton2-video-options').css('display','block');
                flashvars['custom2BtnStartScreen.visible'] = $('#smh-modal3 #customButton2_video_before').is(':checked')? true : false;
                flashvars['custom2BtnStartScreen.includeInLayout'] = $('#smh-modal3 #customButton2_video_before').is(':checked')? true : false;
                flashvars['custom2BtnPlayScreen.visible'] = $('#smh-modal3 #customButton2_video_during').is(':checked')? true : false;
                flashvars['custom2BtnPlayScreen.includeInLayout'] = $('#smh-modal3 #customButton2_video_during').is(':checked')? true : false;
                flashvars['custom2BtnPauseScreen.visible'] = $('#smh-modal3 #customButton2_video_paused').is(':checked')? true : false;
                flashvars['custom2BtnPauseScreen.includeInLayout'] = $('#smh-modal3 #customButton2_video_paused').is(':checked')? true : false;
                flashvars['custom2BtnEndScreen.visible'] = $('#smh-modal3 #customButton2_video_end').is(':checked')? true : false;
                flashvars['custom2BtnEndScreen.includeInLayout'] = $('#smh-modal3 #customButton2_video_end').is(':checked')? true : false;
            } else {
                $('#customButton2-video-options').css('display','none');
                flashvars['custom2BtnStartScreen.visible'] = false;
                flashvars['custom2BtnStartScreen.includeInLayout'] = false;
                flashvars['custom2BtnPlayScreen.visible'] = false;
                flashvars['custom2BtnPlayScreen.includeInLayout'] = false;
                flashvars['custom2BtnPauseScreen.visible'] = false;
                flashvars['custom2BtnPauseScreen.includeInLayout'] = false;
                flashvars['custom2BtnEndScreen.visible'] = false;
                flashvars['custom2BtnEndScreen.includeInLayout'] = false;
            }                     
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#customButton2_video_before' ,function(){
            flashvars['custom2BtnStartScreen.visible'] = $('#smh-modal3 #customButton2_video_before').is(':checked')? true : false;
            flashvars['custom2BtnStartScreen.includeInLayout'] = $('#smh-modal3 #customButton2_video_before').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton2_video_during' ,function(){
            flashvars['custom2BtnPlayScreen.visible'] = $('#smh-modal3 #customButton2_video_during').is(':checked')? true : false;
            flashvars['custom2BtnPlayScreen.includeInLayout'] = $('#smh-modal3 #customButton2_video_during').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton2_video_paused' ,function(){
            flashvars['custom2BtnPauseScreen.visible'] = $('#smh-modal3 #customButton2_video_paused').is(':checked')? true : false;
            flashvars['custom2BtnPauseScreen.includeInLayout'] = $('#smh-modal3 #customButton2_video_paused').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton2_video_end' ,function(){
            flashvars['custom2BtnEndScreen.visible'] = $('#smh-modal3 #customButton2_video_end').is(':checked')? true : false;
            flashvars['custom2BtnEndScreen.includeInLayout'] = $('#smh-modal3 #customButton2_video_end').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton2_controls' ,function(){
            flashvars['custom2BtnControllerScreen.visible'] = $('#smh-modal3 #customButton2_controls').is(':checked')? true : false;
            flashvars['custom2BtnControllerScreen.includeInLayout'] = $('#smh-modal3 #customButton2_controls').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton2_label' ,function(){
            var customButton2_label = $('#smh-modal3 #customButton2_label').val();
            flashvars['custom2BtnStartScreen.label'] = customButton2_label;
            flashvars['custom2BtnPlayScreen.label'] = customButton2_label;
            flashvars['custom2BtnPauseScreen.label'] = customButton2_label;
            flashvars['custom2BtnEndScreen.label'] = customButton2_label;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton2_tool' ,function(){
            var customButton2_tool = $('#smh-modal3 #customButton2_tool').val();
            flashvars['custom2BtnStartScreen.tooltip'] = customButton2_tool;
            flashvars['custom2BtnPlayScreen.tooltip'] = customButton2_tool;
            flashvars['custom2BtnPauseScreen.tooltip'] = customButton2_tool;
            flashvars['custom2BtnEndScreen.tooltip'] = customButton2_tool;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Custom Button 3 Option
    customButton3:function(){
        $('#smh-modal3').on('click', '#customButton3' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 #customButton3_video_area').removeAttr('disabled');
                $('#smh-modal3 #customButton3_video_before').removeAttr('disabled');
                $('#smh-modal3 #customButton3_video_during').removeAttr('disabled');
                $('#smh-modal3 #customButton3_video_paused').removeAttr('disabled');
                $('#smh-modal3 #customButton3_video_end').removeAttr('disabled');
                $('#smh-modal3 #customButton3_controls').removeAttr('disabled');
                $('#smh-modal3 #customButton3_label').removeAttr('disabled');
                $('#smh-modal3 #customButton3_tool').removeAttr('disabled');
                if($('#customButton3_video_area').is(':checked')){
                    flashvars['custom3BtnStartScreen.visible'] = $('#smh-modal3 #customButton3_video_before').is(':checked')? true : false;
                    flashvars['custom3BtnStartScreen.includeInLayout'] = $('#smh-modal3 #customButton3_video_before').is(':checked')? true : false;
                    flashvars['custom3BtnPlayScreen.visible'] = $('#smh-modal3 #customButton3_video_during').is(':checked')? true : false;
                    flashvars['custom3BtnPlayScreen.includeInLayout'] = $('#smh-modal3 #customButton3_video_during').is(':checked')? true : false;
                    flashvars['custom3BtnPauseScreen.visible'] = $('#smh-modal3 #customButton3_video_paused').is(':checked')? true : false;
                    flashvars['custom3BtnPauseScreen.includeInLayout'] = $('#smh-modal3 #customButton3_video_paused').is(':checked')? true : false;
                    flashvars['custom3BtnEndScreen.visible'] = $('#smh-modal3 #customButton3_video_end').is(':checked')? true : false;
                    flashvars['custom3BtnEndScreen.includeInLayout'] = $('#smh-modal3 #customButton3_video_end').is(':checked')? true : false;
                }
                var customButton3_label = $('#smh-modal3 #customButton3_label').val();
                var customButton3_tool = $('#smh-modal3 #customButton3_tool').val();
                flashvars['custom3BtnControllerScreen.visible'] = $('#smh-modal3 #customButton3_controls').is(':checked')? true : false;
                flashvars['custom3BtnControllerScreen.includeInLayout'] = $('#smh-modal3 #customButton3_controls').is(':checked')? true : false;
                flashvars['custom3BtnStartScreen.label'] = customButton3_label;
                flashvars['custom3BtnPlayScreen.label'] = customButton3_label;
                flashvars['custom3BtnPauseScreen.label'] = customButton3_label;
                flashvars['custom3BtnEndScreen.label'] = customButton3_label;
                flashvars['custom3BtnStartScreen.tooltip'] = customButton3_tool;
                flashvars['custom3BtnPlayScreen.tooltip'] = customButton3_tool;
                flashvars['custom3BtnPauseScreen.tooltip'] = customButton3_tool;
                flashvars['custom3BtnEndScreen.tooltip'] = customButton3_tool;
            } else {                
                $('#smh-modal3 #customButton3_video_area').attr('disabled','');
                $('#smh-modal3 #customButton3_video_before').attr('disabled','');
                $('#smh-modal3 #customButton3_video_during').attr('disabled','');
                $('#smh-modal3 #customButton3_video_paused').attr('disabled','');
                $('#smh-modal3 #customButton3_video_end').attr('disabled','');
                $('#smh-modal3 #customButton3_controls').attr('disabled','');
                $('#smh-modal3 #customButton3_label').attr('disabled','');
                $('#smh-modal3 #customButton3_tool').attr('disabled','');
                flashvars['custom3BtnStartScreen.visible'] = false;
                flashvars['custom3BtnStartScreen.includeInLayout'] = false;
                flashvars['custom3BtnPlayScreen.visible'] = false;
                flashvars['custom3BtnPlayScreen.includeInLayout'] = false;
                flashvars['custom3BtnPauseScreen.visible'] = false;
                flashvars['custom3BtnPauseScreen.includeInLayout'] = false;
                flashvars['custom3BtnEndScreen.visible'] = false;
                flashvars['custom3BtnEndScreen.includeInLayout'] = false;
                flashvars['custom3BtnControllerScreen.visible'] = false;
                flashvars['custom3BtnControllerScreen.includeInLayout'] = false;
            }            
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }  
        });
        $('#smh-modal3').on('change', '#customButton3_video_area' ,function(){
            if(this.checked){
                $('#customButton3-video-options').css('display','block');
                flashvars['custom3BtnStartScreen.visible'] = $('#smh-modal3 #customButton3_video_before').is(':checked')? true : false;
                flashvars['custom3BtnStartScreen.includeInLayout'] = $('#smh-modal3 #customButton3_video_before').is(':checked')? true : false;
                flashvars['custom3BtnPlayScreen.visible'] = $('#smh-modal3 #customButton3_video_during').is(':checked')? true : false;
                flashvars['custom3BtnPlayScreen.includeInLayout'] = $('#smh-modal3 #customButton3_video_during').is(':checked')? true : false;
                flashvars['custom3BtnPauseScreen.visible'] = $('#smh-modal3 #customButton3_video_paused').is(':checked')? true : false;
                flashvars['custom3BtnPauseScreen.includeInLayout'] = $('#smh-modal3 #customButton3_video_paused').is(':checked')? true : false;
                flashvars['custom3BtnEndScreen.visible'] = $('#smh-modal3 #customButton3_video_end').is(':checked')? true : false;
                flashvars['custom3BtnEndScreen.includeInLayout'] = $('#smh-modal3 #customButton3_video_end').is(':checked')? true : false;
            } else {
                $('#customButton3-video-options').css('display','none');
                flashvars['custom3BtnStartScreen.visible'] = false;
                flashvars['custom3BtnStartScreen.includeInLayout'] = false;
                flashvars['custom3BtnPlayScreen.visible'] = false;
                flashvars['custom3BtnPlayScreen.includeInLayout'] = false;
                flashvars['custom3BtnPauseScreen.visible'] = false;
                flashvars['custom3BtnPauseScreen.includeInLayout'] = false;
                flashvars['custom3BtnEndScreen.visible'] = false;
                flashvars['custom3BtnEndScreen.includeInLayout'] = false;
            }                     
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#customButton3_video_before' ,function(){
            flashvars['custom3BtnStartScreen.visible'] = $('#smh-modal3 #customButton3_video_before').is(':checked')? true : false;
            flashvars['custom3BtnStartScreen.includeInLayout'] = $('#smh-modal3 #customButton3_video_before').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton3_video_during' ,function(){
            flashvars['custom3BtnPlayScreen.visible'] = $('#smh-modal3 #customButton3_video_during').is(':checked')? true : false;
            flashvars['custom3BtnPlayScreen.includeInLayout'] = $('#smh-modal3 #customButton3_video_during').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton3_video_paused' ,function(){
            flashvars['custom3BtnPauseScreen.visible'] = $('#smh-modal3 #customButton3_video_paused').is(':checked')? true : false;
            flashvars['custom3BtnPauseScreen.includeInLayout'] = $('#smh-modal3 #customButton3_video_paused').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton3_video_end' ,function(){
            flashvars['custom3BtnEndScreen.visible'] = $('#smh-modal3 #customButton3_video_end').is(':checked')? true : false;
            flashvars['custom3BtnEndScreen.includeInLayout'] = $('#smh-modal3 #customButton3_video_end').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton3_controls' ,function(){
            flashvars['custom3BtnControllerScreen.visible'] = $('#smh-modal3 #customButton3_controls').is(':checked')? true : false;
            flashvars['custom3BtnControllerScreen.includeInLayout'] = $('#smh-modal3 #customButton3_controls').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton3_label' ,function(){
            var customButton3_label = $('#smh-modal3 #customButton3_label').val();
            flashvars['custom3BtnStartScreen.label'] = customButton3_label;
            flashvars['custom3BtnPlayScreen.label'] = customButton3_label;
            flashvars['custom3BtnPauseScreen.label'] = customButton3_label;
            flashvars['custom3BtnEndScreen.label'] = customButton3_label;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton3_tool' ,function(){
            var customButton3_tool = $('#smh-modal3 #customButton3_tool').val();
            flashvars['custom3BtnStartScreen.tooltip'] = customButton3_tool;
            flashvars['custom3BtnPlayScreen.tooltip'] = customButton3_tool;
            flashvars['custom3BtnPauseScreen.tooltip'] = customButton3_tool;
            flashvars['custom3BtnEndScreen.tooltip'] = customButton3_tool;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Custom Button 4 Option
    customButton4:function(){
        $('#smh-modal3').on('click', '#customButton4' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 #customButton4_video_area').removeAttr('disabled');
                $('#smh-modal3 #customButton4_video_before').removeAttr('disabled');
                $('#smh-modal3 #customButton4_video_during').removeAttr('disabled');
                $('#smh-modal3 #customButton4_video_paused').removeAttr('disabled');
                $('#smh-modal3 #customButton4_video_end').removeAttr('disabled');
                $('#smh-modal3 #customButton4_controls').removeAttr('disabled');
                $('#smh-modal3 #customButton4_label').removeAttr('disabled');
                $('#smh-modal3 #customButton4_tool').removeAttr('disabled');
                if($('#customButton4_video_area').is(':checked')){
                    flashvars['custom4BtnStartScreen.visible'] = $('#smh-modal3 #customButton4_video_before').is(':checked')? true : false;
                    flashvars['custom4BtnStartScreen.includeInLayout'] = $('#smh-modal3 #customButton4_video_before').is(':checked')? true : false;
                    flashvars['custom4BtnPlayScreen.visible'] = $('#smh-modal3 #customButton4_video_during').is(':checked')? true : false;
                    flashvars['custom4BtnPlayScreen.includeInLayout'] = $('#smh-modal3 #customButton4_video_during').is(':checked')? true : false;
                    flashvars['custom4BtnPauseScreen.visible'] = $('#smh-modal3 #customButton4_video_paused').is(':checked')? true : false;
                    flashvars['custom4BtnPauseScreen.includeInLayout'] = $('#smh-modal3 #customButton4_video_paused').is(':checked')? true : false;
                    flashvars['custom4BtnEndScreen.visible'] = $('#smh-modal3 #customButton4_video_end').is(':checked')? true : false;
                    flashvars['custom4BtnEndScreen.includeInLayout'] = $('#smh-modal3 #customButton4_video_end').is(':checked')? true : false;
                }
                var customButton4_label = $('#smh-modal3 #customButton4_label').val();
                var customButton4_tool = $('#smh-modal3 #customButton4_tool').val();
                flashvars['custom4BtnControllerScreen.visible'] = $('#smh-modal3 #customButton4_controls').is(':checked')? true : false;
                flashvars['custom4BtnControllerScreen.includeInLayout'] = $('#smh-modal3 #customButton4_controls').is(':checked')? true : false;
                flashvars['custom4BtnStartScreen.label'] = customButton4_label;
                flashvars['custom4BtnPlayScreen.label'] = customButton4_label;
                flashvars['custom4BtnPauseScreen.label'] = customButton4_label;
                flashvars['custom4BtnEndScreen.label'] = customButton4_label;
                flashvars['custom4BtnStartScreen.tooltip'] = customButton4_tool;
                flashvars['custom4BtnPlayScreen.tooltip'] = customButton4_tool;
                flashvars['custom4BtnPauseScreen.tooltip'] = customButton4_tool;
                flashvars['custom4BtnEndScreen.tooltip'] = customButton4_tool;
            } else {                
                $('#smh-modal3 #customButton4_video_area').attr('disabled','');
                $('#smh-modal3 #customButton4_video_before').attr('disabled','');
                $('#smh-modal3 #customButton4_video_during').attr('disabled','');
                $('#smh-modal3 #customButton4_video_paused').attr('disabled','');
                $('#smh-modal3 #customButton4_video_end').attr('disabled','');
                $('#smh-modal3 #customButton4_controls').attr('disabled','');
                $('#smh-modal3 #customButton4_label').attr('disabled','');
                $('#smh-modal3 #customButton4_tool').attr('disabled','');
                flashvars['custom4BtnStartScreen.visible'] = false;
                flashvars['custom4BtnStartScreen.includeInLayout'] = false;
                flashvars['custom4BtnPlayScreen.visible'] = false;
                flashvars['custom4BtnPlayScreen.includeInLayout'] = false;
                flashvars['custom4BtnPauseScreen.visible'] = false;
                flashvars['custom4BtnPauseScreen.includeInLayout'] = false;
                flashvars['custom4BtnEndScreen.visible'] = false;
                flashvars['custom4BtnEndScreen.includeInLayout'] = false;
                flashvars['custom4BtnControllerScreen.visible'] = false;
                flashvars['custom4BtnControllerScreen.includeInLayout'] = false;
            }            
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }  
        });
        $('#smh-modal3').on('change', '#customButton4_video_area' ,function(){
            if(this.checked){
                $('#customButton4-video-options').css('display','block');
                flashvars['custom4BtnStartScreen.visible'] = $('#smh-modal3 #customButton4_video_before').is(':checked')? true : false;
                flashvars['custom4BtnStartScreen.includeInLayout'] = $('#smh-modal3 #customButton4_video_before').is(':checked')? true : false;
                flashvars['custom4BtnPlayScreen.visible'] = $('#smh-modal3 #customButton4_video_during').is(':checked')? true : false;
                flashvars['custom4BtnPlayScreen.includeInLayout'] = $('#smh-modal3 #customButton4_video_during').is(':checked')? true : false;
                flashvars['custom4BtnPauseScreen.visible'] = $('#smh-modal3 #customButton4_video_paused').is(':checked')? true : false;
                flashvars['custom4BtnPauseScreen.includeInLayout'] = $('#smh-modal3 #customButton4_video_paused').is(':checked')? true : false;
                flashvars['custom4BtnEndScreen.visible'] = $('#smh-modal3 #customButton4_video_end').is(':checked')? true : false;
                flashvars['custom4BtnEndScreen.includeInLayout'] = $('#smh-modal3 #customButton4_video_end').is(':checked')? true : false;
            } else {
                $('#customButton4-video-options').css('display','none');
                flashvars['custom4BtnStartScreen.visible'] = false;
                flashvars['custom4BtnStartScreen.includeInLayout'] = false;
                flashvars['custom4BtnPlayScreen.visible'] = false;
                flashvars['custom4BtnPlayScreen.includeInLayout'] = false;
                flashvars['custom4BtnPauseScreen.visible'] = false;
                flashvars['custom4BtnPauseScreen.includeInLayout'] = false;
                flashvars['custom4BtnEndScreen.visible'] = false;
                flashvars['custom4BtnEndScreen.includeInLayout'] = false;
            }                     
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#customButton4_video_before' ,function(){
            flashvars['custom4BtnStartScreen.visible'] = $('#smh-modal3 #customButton4_video_before').is(':checked')? true : false;
            flashvars['custom4BtnStartScreen.includeInLayout'] = $('#smh-modal3 #customButton4_video_before').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton4_video_during' ,function(){
            flashvars['custom4BtnPlayScreen.visible'] = $('#smh-modal3 #customButton4_video_during').is(':checked')? true : false;
            flashvars['custom4BtnPlayScreen.includeInLayout'] = $('#smh-modal3 #customButton4_video_during').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton4_video_paused' ,function(){
            flashvars['custom4BtnPauseScreen.visible'] = $('#smh-modal3 #customButton4_video_paused').is(':checked')? true : false;
            flashvars['custom4BtnPauseScreen.includeInLayout'] = $('#smh-modal3 #customButton4_video_paused').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton4_video_end' ,function(){
            flashvars['custom4BtnEndScreen.visible'] = $('#smh-modal3 #customButton4_video_end').is(':checked')? true : false;
            flashvars['custom4BtnEndScreen.includeInLayout'] = $('#smh-modal3 #customButton4_video_end').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton4_controls' ,function(){
            flashvars['custom4BtnControllerScreen.visible'] = $('#smh-modal3 #customButton4_controls').is(':checked')? true : false;
            flashvars['custom4BtnControllerScreen.includeInLayout'] = $('#smh-modal3 #customButton4_controls').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton4_label' ,function(){
            var customButton4_label = $('#smh-modal3 #customButton4_label').val();
            flashvars['custom4BtnStartScreen.label'] = customButton4_label;
            flashvars['custom4BtnPlayScreen.label'] = customButton4_label;
            flashvars['custom4BtnPauseScreen.label'] = customButton4_label;
            flashvars['custom4BtnEndScreen.label'] = customButton4_label;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton4_tool' ,function(){
            var customButton4_tool = $('#smh-modal3 #customButton4_tool').val();
            flashvars['custom4BtnStartScreen.tooltip'] = customButton4_tool;
            flashvars['custom4BtnPlayScreen.tooltip'] = customButton4_tool;
            flashvars['custom4BtnPauseScreen.tooltip'] = customButton4_tool;
            flashvars['custom4BtnEndScreen.tooltip'] = customButton4_tool;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Custom Button 5 Option
    customButton5:function(){
        $('#smh-modal3').on('click', '#customButton5' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 #customButton5_video_area').removeAttr('disabled');
                $('#smh-modal3 #customButton5_video_before').removeAttr('disabled');
                $('#smh-modal3 #customButton5_video_during').removeAttr('disabled');
                $('#smh-modal3 #customButton5_video_paused').removeAttr('disabled');
                $('#smh-modal3 #customButton5_video_end').removeAttr('disabled');
                $('#smh-modal3 #customButton5_controls').removeAttr('disabled');
                $('#smh-modal3 #customButton5_label').removeAttr('disabled');
                $('#smh-modal3 #customButton5_tool').removeAttr('disabled');
                if($('#customButton5_video_area').is(':checked')){
                    flashvars['custom5BtnStartScreen.visible'] = $('#smh-modal3 #customButton5_video_before').is(':checked')? true : false;
                    flashvars['custom5BtnStartScreen.includeInLayout'] = $('#smh-modal3 #customButton5_video_before').is(':checked')? true : false;
                    flashvars['custom5BtnPlayScreen.visible'] = $('#smh-modal3 #customButton5_video_during').is(':checked')? true : false;
                    flashvars['custom5BtnPlayScreen.includeInLayout'] = $('#smh-modal3 #customButton5_video_during').is(':checked')? true : false;
                    flashvars['custom5BtnPauseScreen.visible'] = $('#smh-modal3 #customButton5_video_paused').is(':checked')? true : false;
                    flashvars['custom5BtnPauseScreen.includeInLayout'] = $('#smh-modal3 #customButton5_video_paused').is(':checked')? true : false;
                    flashvars['custom5BtnEndScreen.visible'] = $('#smh-modal3 #customButton5_video_end').is(':checked')? true : false;
                    flashvars['custom5BtnEndScreen.includeInLayout'] = $('#smh-modal3 #customButton5_video_end').is(':checked')? true : false;
                }
                var customButton5_label = $('#smh-modal3 #customButton5_label').val();
                var customButton5_tool = $('#smh-modal3 #customButton5_tool').val();
                flashvars['custom5BtnControllerScreen.visible'] = $('#smh-modal3 #customButton5_controls').is(':checked')? true : false;
                flashvars['custom5BtnControllerScreen.includeInLayout'] = $('#smh-modal3 #customButton5_controls').is(':checked')? true : false;
                flashvars['custom5BtnStartScreen.label'] = customButton5_label;
                flashvars['custom5BtnPlayScreen.label'] = customButton5_label;
                flashvars['custom5BtnPauseScreen.label'] = customButton5_label;
                flashvars['custom5BtnEndScreen.label'] = customButton5_label;
                flashvars['custom5BtnStartScreen.tooltip'] = customButton5_tool;
                flashvars['custom5BtnPlayScreen.tooltip'] = customButton5_tool;
                flashvars['custom5BtnPauseScreen.tooltip'] = customButton5_tool;
                flashvars['custom5BtnEndScreen.tooltip'] = customButton5_tool;
            } else {                
                $('#smh-modal3 #customButton5_video_area').attr('disabled','');
                $('#smh-modal3 #customButton5_video_before').attr('disabled','');
                $('#smh-modal3 #customButton5_video_during').attr('disabled','');
                $('#smh-modal3 #customButton5_video_paused').attr('disabled','');
                $('#smh-modal3 #customButton5_video_end').attr('disabled','');
                $('#smh-modal3 #customButton5_controls').attr('disabled','');
                $('#smh-modal3 #customButton5_label').attr('disabled','');
                $('#smh-modal3 #customButton5_tool').attr('disabled','');
                flashvars['custom5BtnStartScreen.visible'] = false;
                flashvars['custom5BtnStartScreen.includeInLayout'] = false;
                flashvars['custom5BtnPlayScreen.visible'] = false;
                flashvars['custom5BtnPlayScreen.includeInLayout'] = false;
                flashvars['custom5BtnPauseScreen.visible'] = false;
                flashvars['custom5BtnPauseScreen.includeInLayout'] = false;
                flashvars['custom5BtnEndScreen.visible'] = false;
                flashvars['custom5BtnEndScreen.includeInLayout'] = false;
                flashvars['custom5BtnControllerScreen.visible'] = false;
                flashvars['custom5BtnControllerScreen.includeInLayout'] = false;
            }            
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }  
        });
        $('#smh-modal3').on('change', '#customButton5_video_area' ,function(){
            if(this.checked){
                $('#customButton5-video-options').css('display','block');
                flashvars['custom5BtnStartScreen.visible'] = $('#smh-modal3 #customButton5_video_before').is(':checked')? true : false;
                flashvars['custom5BtnStartScreen.includeInLayout'] = $('#smh-modal3 #customButton5_video_before').is(':checked')? true : false;
                flashvars['custom5BtnPlayScreen.visible'] = $('#smh-modal3 #customButton5_video_during').is(':checked')? true : false;
                flashvars['custom5BtnPlayScreen.includeInLayout'] = $('#smh-modal3 #customButton5_video_during').is(':checked')? true : false;
                flashvars['custom5BtnPauseScreen.visible'] = $('#smh-modal3 #customButton5_video_paused').is(':checked')? true : false;
                flashvars['custom5BtnPauseScreen.includeInLayout'] = $('#smh-modal3 #customButton5_video_paused').is(':checked')? true : false;
                flashvars['custom5BtnEndScreen.visible'] = $('#smh-modal3 #customButton5_video_end').is(':checked')? true : false;
                flashvars['custom5BtnEndScreen.includeInLayout'] = $('#smh-modal3 #customButton5_video_end').is(':checked')? true : false;
            } else {
                $('#customButton5-video-options').css('display','none');
                flashvars['custom5BtnStartScreen.visible'] = false;
                flashvars['custom5BtnStartScreen.includeInLayout'] = false;
                flashvars['custom5BtnPlayScreen.visible'] = false;
                flashvars['custom5BtnPlayScreen.includeInLayout'] = false;
                flashvars['custom5BtnPauseScreen.visible'] = false;
                flashvars['custom5BtnPauseScreen.includeInLayout'] = false;
                flashvars['custom5BtnEndScreen.visible'] = false;
                flashvars['custom5BtnEndScreen.includeInLayout'] = false;
            }                     
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#customButton5_video_before' ,function(){
            flashvars['custom5BtnStartScreen.visible'] = $('#smh-modal3 #customButton5_video_before').is(':checked')? true : false;
            flashvars['custom5BtnStartScreen.includeInLayout'] = $('#smh-modal3 #customButton5_video_before').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton5_video_during' ,function(){
            flashvars['custom5BtnPlayScreen.visible'] = $('#smh-modal3 #customButton5_video_during').is(':checked')? true : false;
            flashvars['custom5BtnPlayScreen.includeInLayout'] = $('#smh-modal3 #customButton5_video_during').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton5_video_paused' ,function(){
            flashvars['custom5BtnPauseScreen.visible'] = $('#smh-modal3 #customButton5_video_paused').is(':checked')? true : false;
            flashvars['custom5BtnPauseScreen.includeInLayout'] = $('#smh-modal3 #customButton5_video_paused').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton5_video_end' ,function(){
            flashvars['custom5BtnEndScreen.visible'] = $('#smh-modal3 #customButton5_video_end').is(':checked')? true : false;
            flashvars['custom5BtnEndScreen.includeInLayout'] = $('#smh-modal3 #customButton5_video_end').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton5_controls' ,function(){
            flashvars['custom5BtnControllerScreen.visible'] = $('#smh-modal3 #customButton5_controls').is(':checked')? true : false;
            flashvars['custom5BtnControllerScreen.includeInLayout'] = $('#smh-modal3 #customButton5_controls').is(':checked')? true : false;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton5_label' ,function(){
            var customButton5_label = $('#smh-modal3 #customButton5_label').val();
            flashvars['custom5BtnStartScreen.label'] = customButton5_label;
            flashvars['custom5BtnPlayScreen.label'] = customButton5_label;
            flashvars['custom5BtnPauseScreen.label'] = customButton5_label;
            flashvars['custom5BtnEndScreen.label'] = customButton5_label;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#customButton5_tool' ,function(){
            var customButton5_tool = $('#smh-modal3 #customButton5_tool').val();
            flashvars['custom5BtnStartScreen.tooltip'] = customButton5_tool;
            flashvars['custom5BtnPlayScreen.tooltip'] = customButton5_tool;
            flashvars['custom5BtnPauseScreen.tooltip'] = customButton5_tool;
            flashvars['custom5BtnEndScreen.tooltip'] = customButton5_tool;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Bumper Options
    playerBumper:function(){
        $('#smh-modal3').on('click', '#bumper' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 #bumper_id').removeAttr('disabled');
                $('#smh-modal3 #bumper_url').removeAttr('disabled');
                $('#smh-modal3 #bumper_sequence').removeAttr('disabled');
                var bumper_id = $('#smh-modal3 #bumper_id').val();
                var bumper_url = $('#smh-modal3 #bumper_url').val();
                var bumper_sequence = $('#smh-modal3 #bumper_sequence').val();
                flashvars['bumper.bumperEntryID'] = bumper_id;
                flashvars['bumper.clickurl'] = bumper_url;
                if(bumper_sequence == 'before'){
                    if($('#smh-modal3 #vast').is(':checked')){  
                        if($('#smh-modal3 #preroll_yes').is(':checked')){ 
                            flashvars['bumper.preSequence'] = 2;
                        } else {
                            flashvars['bumper.preSequence'] = 1;
                        }
                    } else {
                        flashvars['bumper.preSequence'] = 1;
                    }
                    flashvars['bumper.postSequence'] = 0;
                } else if (bumper_sequence == 'after'){
                    flashvars['bumper.preSequence'] = 0;
                    flashvars['bumper.postSequence'] = 1;
                } else {
                    flashvars['bumper.preSequence'] = 1;
                    flashvars['bumper.postSequence'] = 1;
                }
            } else {
                $('#smh-modal3 #bumper_id').attr('disabled','');
                $('#smh-modal3 #bumper_url').attr('disabled','');
                $('#smh-modal3 #bumper_sequence').attr('disabled','');
                flashvars['bumper.bumperEntryID'] = '';
                flashvars['bumper.clickurl'] = '';
                flashvars['bumper.preSequence'] = 0;
                flashvars['bumper.postSequence'] = 0;
            }            
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }  
        });
        $('#smh-modal3').on('change', '#bumper_id' ,function(){
            var bumper_id = $('#smh-modal3 #bumper_id').val();    
            flashvars['bumper.bumperEntryID'] = bumper_id;            
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#bumper_url' ,function(){
            var bumper_url = $('#smh-modal3 #bumper_url').val();  
            flashvars['bumper.clickurl'] = bumper_url;            
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#bumper_sequence' ,function(){
            var bumper_sequence = $('#smh-modal3 #bumper_sequence').val();  
            if(bumper_sequence == 'before'){
                if($('#smh-modal3 #vast').is(':checked')){  
                    if($('#smh-modal3 #preroll_yes').is(':checked')){ 
                        flashvars['bumper.preSequence'] = 2;
                    } else {
                        flashvars['bumper.preSequence'] = 1;
                    }
                } else {
                    flashvars['bumper.preSequence'] = 1;
                }
                flashvars['bumper.postSequence'] = 0;
            } else if (bumper_sequence == 'after'){
                flashvars['bumper.preSequence'] = 0;
                if($('#smh-modal3 #vast').is(':checked')){  
                    if($('#smh-modal3 #postoll_yes').is(':checked')){ 
                        flashvars['bumper.postSequence'] = 2;
                    } else {
                        flashvars['bumper.postSequence'] = 1;
                    }
                } else {
                    flashvars['bumper.postSequence'] = 1;
                }
            } else {
                if($('#smh-modal3 #vast').is(':checked')){  
                    if($('#smh-modal3 #preroll_yes').is(':checked')){ 
                        flashvars['bumper.preSequence'] = 2;
                    } else {
                        flashvars['bumper.preSequence'] = 1;
                    }
                } else {
                    flashvars['bumper.preSequence'] = 1;
                }
                if($('#smh-modal3 #vast').is(':checked')){  
                    if($('#smh-modal3 #postoll_yes').is(':checked')){ 
                        flashvars['bumper.postSequence'] = 2;
                    } else {
                        flashvars['bumper.postSequence'] = 1;
                    }
                } else {
                    flashvars['bumper.postSequence'] = 1;
                }
            }          
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
    },
    //Player Vast Options
    playerVast:function(){
        $('#smh-modal3').on('click', '#vast' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 input[name="notice_display"]').removeAttr('disabled');
                $('#smh-modal3 input[name="ad_skip"]').removeAttr('disabled');
                if($('#smh-modal3 #notice_text_yes').is(':checked')){
                    $('#smh-modal3 #notice_text').removeAttr('disabled');
                    var notice_text = $('#smh-modal3 #notice_text').val();
                    flashvars['noticeMessage.visible'] = '{sequenceProxy.isAdLoaded}';
                    flashvars['noticeMessage.includeInLayout'] = '{sequenceProxy.isAdLoaded}';
                    flashvars['noticeMessage.text'] = notice_text;
                } else {
                    $('#smh-modal3 #notice_text').attr('disabled','');
                    flashvars['noticeMessage.visible'] = false;
                    flashvars['noticeMessage.includeInLayout'] = false;
                }
                if($('#smh-modal3 #ad_skip_yes').is(':checked')){
                    $('#smh-modal3 #skip_text').removeAttr('disabled');
                    var skip_text = $('#smh-modal3 #skip_text').val();
                    flashvars['skipBtn.label'] = skip_text;
                    flashvars['skipBtn.visible'] = '{sequenceProxy.isAdLoaded}';
                    flashvars['skipBtn.includeInLayout'] = '{sequenceProxy.isAdLoaded}';
                } else {
                    $('#smh-modal3 #skip_text').attr('disabled','');
                    flashvars['skipBtn.visible'] = false;
                    flashvars['skipBtn.includeInLayout'] = false;
                }            
                $('#smh-modal3 #timeout').removeAttr('disabled');
                var timeout = $('smh-modal3 #timeout').val();
                flashvars['vast.timeout'] = timeout;
                $('#smh-modal3 input[name="preroll_enable"]').removeAttr('disabled');
                if($('#smh-modal3 #preroll_yes').is(':checked')){
                    $('#smh-modal3 #preroll_url').removeAttr('disabled');
                    $('#smh-modal3 #preroll_amount').removeAttr('disabled');
                    $('#smh-modal3 #preroll_start').removeAttr('disabled');
                    $('#smh-modal3 #preroll_interval').removeAttr('disabled');
                    
                    if($('#smh-modal3 #bumper').is(':checked')){
                        var bumper_sequence = $('#smh-modal3 #bumper_sequence').val();  
                        if(bumper_sequence == 'before' || bumper_sequence == 'both'){ 
                            flashvars['bumper.preSequence'] = 2;
                        }
                    }
                    flashvars['vast.preSequence'] = 1; 
                    
                    var preroll_url = $('#smh-modal3 #preroll_url').val();
                    flashvars['vast.prerollUrl'] = preroll_url;
                    var preroll_amount = $('#smh-modal3 #preroll_amount').val();
                    flashvars['vast.numPreroll'] = preroll_amount;
                    var preroll_start = $('#smh-modal3 #preroll_start').val();
                    flashvars['vast.prerollStartWith'] = preroll_start;
                    var preroll_interval = $('#smh-modal3 #preroll_interval').val();
                    flashvars['vast.prerollStartWith'] = preroll_interval;
                } else {
                    $('#smh-modal3 #preroll_url').attr('disabled','');
                    $('#smh-modal3 #preroll_amount').attr('disabled','');
                    $('#smh-modal3 #preroll_start').attr('disabled','');
                    $('#smh-modal3 #preroll_interval').attr('disabled','');
                    if($('#smh-modal3 #bumper').is(':checked')){
                        var bumper_sequence = $('#smh-modal3 #bumper_sequence').val();  
                        if(bumper_sequence == 'before' || bumper_sequence == 'both'){ 
                            flashvars['bumper.preSequence'] = 1;
                        }
                    }
                    flashvars['vast.preSequence'] = 0;
                }                 
                
                $('#smh-modal3 input[name="overlay_enable"]').removeAttr('disabled');
                if($('#smh-modal3 #overlay_yes').is(':checked')){
                    $('#smh-modal3 #overlay_url').removeAttr('disabled');
                    $('#smh-modal3 #overlay_start').removeAttr('disabled');
                    $('#smh-modal3 #overlay_interval').removeAttr('disabled');
                    $('#smh-modal3 #overlay_timeout').removeAttr('disabled');
                    flashvars['overlay.visible'] = true; 
                    flashvars['overlay.includeInLayout'] = true;                     
                    var overlay_url = $('#smh-modal3 #overlay_url').val();
                    flashvars['vast.overlayUrl'] = overlay_url;
                    var overlay_start = $('#smh-modal3 #overlay_start').val();
                    flashvars['vast.overlayStartAt'] = overlay_start;
                    var overlay_interval = $('#smh-modal3 #overlay_interval').val();
                    flashvars['vast.overlayInterval'] = overlay_interval;
                    var overlay_timeout = $('#smh-modal3 #overlay_timeout').val();
                    flashvars['overlay.displayDuration'] = overlay_timeout;
                } else {
                    $('#smh-modal3 #overlay_url').attr('disabled','');
                    $('#smh-modal3 #overlay_start').attr('disabled','');
                    $('#smh-modal3 #overlay_interval').attr('disabled','');
                    $('#smh-modal3 #overlay_timeout').attr('disabled','');
                    flashvars['overlay.visible'] = false; 
                    flashvars['overlay.includeInLayout'] = false;   
                }
                
                $('#smh-modal3 input[name="postroll_enable"]').removeAttr('disabled');
                if($('#smh-modal3 #postroll_yes').is(':checked')){
                    $('#smh-modal3 #postroll_url').removeAttr('disabled');
                    $('#smh-modal3 #postroll_amount').removeAttr('disabled');
                    $('#smh-modal3 #postroll_start').removeAttr('disabled');
                    $('#smh-modal3 #postroll_interval').removeAttr('disabled');
                    
                    if($('#smh-modal3 #bumper').is(':checked')){
                        var bumper_sequence = $('#smh-modal3 #bumper_sequence').val();  
                        if(bumper_sequence == 'after' || bumper_sequence == 'both'){ 
                            flashvars['bumper.postSequence'] = 2;
                        }
                    }
                    flashvars['vast.postSequence'] = 1; 
                    
                    var postroll_url = $('#smh-modal3 #postroll_url').val();
                    flashvars['vast.postrollUrl'] = postroll_url;
                    var postroll_amount = $('#smh-modal3 #postroll_amount').val();
                    flashvars['vast.numPreroll'] = postroll_amount;
                    var postroll_start = $('#smh-modal3 #postroll_start').val();
                    flashvars['vast.postrollStartWith'] = postroll_start;
                    var postroll_interval = $('#smh-modal3 #postroll_interval').val();
                    flashvars['vast.postrollStartWith'] = postroll_interval;
                } else {
                    $('#smh-modal3 #postroll_url').attr('disabled','');
                    $('#smh-modal3 #postroll_amount').attr('disabled','');
                    $('#smh-modal3 #postroll_start').attr('disabled','');
                    $('#smh-modal3 #postroll_interval').attr('disabled','');
                    if($('#smh-modal3 #bumper').is(':checked')){
                        var bumper_sequence = $('#smh-modal3 #bumper_sequence').val();  
                        if(bumper_sequence == 'after' || bumper_sequence == 'both'){ 
                            flashvars['bumper.postSequence'] = 1;
                        }
                    }
                    flashvars['vast.postSequence'] = 0;
                } 
            } else {
                $('#smh-modal3 input[name="notice_display"]').attr('disabled','');
                $('#smh-modal3 #notice_text').attr('disabled','');
                $('#smh-modal3 input[name="ad_skip"]').attr('disabled','');
                $('#smh-modal3 #skip_text').attr('disabled','');
                $('#smh-modal3 #timeout').attr('disabled','');
                $('#smh-modal3 input[name="preroll_enable"]').attr('disabled','');
                $('#smh-modal3 #preroll_url').attr('disabled','');
                $('#smh-modal3 #preroll_amount').attr('disabled','');
                $('#smh-modal3 #preroll_start').attr('disabled','');
                $('#smh-modal3 #preroll_interval').attr('disabled','');
                if($('#smh-modal3 #bumper').is(':checked')){
                    var bumper_sequence = $('#smh-modal3 #bumper_sequence').val();  
                    if(bumper_sequence == 'before' || bumper_sequence == 'both'){ 
                        flashvars['bumper.preSequence'] = 1;
                    }
                }
                flashvars['noticeMessage.visible'] = false;
                flashvars['noticeMessage.includeInLayout'] = false;
                flashvars['vast.preSequence'] = 0;
                flashvars['skipBtn.visible'] = false;
                flashvars['skipBtn.includeInLayout'] = false;
                
                $('#smh-modal3 #overlay_url').attr('disabled','');
                $('#smh-modal3 #overlay_start').attr('disabled','');
                $('#smh-modal3 #overlay_interval').attr('disabled','');
                $('#smh-modal3 #overlay_timeout').attr('disabled','');
                flashvars['overlay.visible'] = false; 
                flashvars['overlay.includeInLayout'] = false; 
                
                $('#smh-modal3 #postroll_url').attr('disabled','');
                $('#smh-modal3 #postroll_amount').attr('disabled','');
                $('#smh-modal3 #postroll_start').attr('disabled','');
                $('#smh-modal3 #postroll_interval').attr('disabled','');
                if($('#smh-modal3 #bumper').is(':checked')){
                    var bumper_sequence = $('#smh-modal3 #bumper_sequence').val();  
                    if(bumper_sequence == 'before' || bumper_sequence == 'both'){ 
                        flashvars['bumper.postSequence'] = 1;
                    }
                }
                flashvars['vast.postSequence'] = 0;
            }            
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }  
        });
        $('#smh-modal3').on('change', 'input[name="notice_display"]' ,function(){
            if($('#smh-modal3 #notice_text_yes').is(':checked')){
                $('#smh-modal3 #notice_text').removeAttr('disabled');
                var notice_text = $('#smh-modal3 #notice_text').val();
                flashvars['noticeMessage.visible'] = '{sequenceProxy.isAdLoaded}';
                flashvars['noticeMessage.includeInLayout'] = '{sequenceProxy.isAdLoaded}';
                flashvars['noticeMessage.text'] = notice_text;
            } else {
                $('#smh-modal3 #notice_text').attr('disabled','');
                flashvars['noticeMessage.visible'] = false;
                flashvars['noticeMessage.includeInLayout'] = false;
            }           
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#notice_text', function(){
            var notice_text = $('#smh-modal3 #notice_text').val();
            flashvars['noticeMessage.text'] = notice_text;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', 'input[name="ad_skip"]' ,function(){
            if($('#smh-modal3 #ad_skip_yes').is(':checked')){
                $('#smh-modal3 #skip_text').removeAttr('disabled');
                var skip_text = $('#smh-modal3 #skip_text').val();
                flashvars['skipBtn.label'] = skip_text;
                flashvars['skipBtn.visible'] = '{sequenceProxy.isAdLoaded}';
                flashvars['skipBtn.includeInLayout'] = '{sequenceProxy.isAdLoaded}';
            } else {
                $('#smh-modal3 #skip_text').attr('disabled','');
                flashvars['skipBtn.visible'] = false;
                flashvars['skipBtn.includeInLayout'] = false;
            }           
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#skip_text', function(){
            var skip_text = $('#smh-modal3 #skip_text').val();
            flashvars['skipBtn.label'] = skip_text;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#timeout', function(){
            var timeout = $('#smh-modal3 #timeout').val();
            flashvars['vast.timeout'] = timeout;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', 'input[name="preroll_enable"]' ,function(){
            if($('#smh-modal3 #preroll_yes').is(':checked')){
                $('#smh-modal3 #preroll_url').removeAttr('disabled');
                $('#smh-modal3 #preroll_amount').removeAttr('disabled');
                $('#smh-modal3 #preroll_start').removeAttr('disabled');
                $('#smh-modal3 #preroll_interval').removeAttr('disabled');
                if($('#smh-modal3 #bumper').is(':checked')){
                    var bumper_sequence = $('#smh-modal3 #bumper_sequence').val();  
                    if(bumper_sequence == 'before' || bumper_sequence == 'both'){ 
                        flashvars['bumper.preSequence'] = 2;
                    }
                }
                flashvars['vast.preSequence'] = 1;
                var preroll_url = $('#smh-modal3 #preroll_url').val();
                flashvars['vast.prerollUrl'] = preroll_url;
                var preroll_amount = $('#smh-modal3 #preroll_amount').val();
                flashvars['vast.numPreroll'] = preroll_amount;
                var preroll_start = $('#smh-modal3 #preroll_start').val();
                flashvars['vast.prerollStartWith'] = preroll_start;
                var preroll_interval = $('#smh-modal3 #preroll_interval').val();
                flashvars['vast.prerollStartWith'] = preroll_interval;
            } else {
                $('#smh-modal3 #preroll_url').attr('disabled','');
                $('#smh-modal3 #preroll_amount').attr('disabled','');
                $('#smh-modal3 #preroll_start').attr('disabled','');
                $('#smh-modal3 #preroll_interval').attr('disabled','');
                if($('#smh-modal3 #bumper').is(':checked')){
                    var bumper_sequence = $('#smh-modal3 #bumper_sequence').val();  
                    if(bumper_sequence == 'before' || bumper_sequence == 'both'){ 
                        flashvars['bumper.preSequence'] = 1;
                    }
                }
                flashvars['vast.preSequence'] = 0;
            }           
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#preroll_url', function(){
            var preroll_url = $('#smh-modal3 #preroll_url').val();
            flashvars['vast.prerollUrl'] = preroll_url;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#preroll_amount', function(){
            var preroll_amount = $('#smh-modal3 #preroll_amount').val();
            flashvars['vast.numPreroll'] = preroll_amount;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#preroll_start', function(){
            var preroll_start = $('#smh-modal3 #preroll_start').val();
            flashvars['vast.prerollStartWith'] = preroll_start;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#preroll_interval', function(){
            var preroll_interval = $('#smh-modal3 #preroll_interval').val();
            flashvars['vast.prerollStartWith'] = preroll_interval;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        
        $('#smh-modal3').on('change', 'input[name="overlay_enable"]' ,function(){
            if($('#smh-modal3 #overlay_yes').is(':checked')){
                $('#smh-modal3 #overlay_url').removeAttr('disabled');
                $('#smh-modal3 #overlay_start').removeAttr('disabled');
                $('#smh-modal3 #overlay_interval').removeAttr('disabled');
                $('#smh-modal3 #overlay_timeout').removeAttr('disabled');
                flashvars['overlay.visible'] = true; 
                flashvars['overlay.includeInLayout'] = true;                     
                var overlay_url = $('#smh-modal3 #overlay_url').val();
                flashvars['vast.overlayUrl'] = overlay_url;
                var overlay_start = $('#smh-modal3 #overlay_start').val();
                flashvars['vast.overlayStartAt'] = overlay_start;
                var overlay_interval = $('#smh-modal3 #overlay_interval').val();
                flashvars['vast.overlayInterval'] = overlay_interval;
                var overlay_timeout = $('#smh-modal3 #overlay_timeout').val();
                flashvars['overlay.displayDuration'] = overlay_timeout;
            } else {
                $('#smh-modal3 #overlay_url').attr('disabled','');
                $('#smh-modal3 #overlay_start').attr('disabled','');
                $('#smh-modal3 #overlay_interval').attr('disabled','');
                $('#smh-modal3 #overlay_timeout').attr('disabled','');
                flashvars['overlay.visible'] = false; 
                flashvars['overlay.includeInLayout'] = false;   
            }         
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#overlay_url', function(){
            var overlay_url = $('#smh-modal3 #overlay_url').val();
            flashvars['vast.overlayUrl'] = overlay_url;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#overlay_start', function(){
            var overlay_start = $('#smh-modal3 #overlay_start').val();
            flashvars['vast.overlayStartAt'] = overlay_start;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#overlay_interval', function(){
            var overlay_interval = $('#smh-modal3 #overlay_interval').val();
            flashvars['vast.overlayInterval'] = overlay_interval;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#overlay_timeout', function(){
            var overlay_timeout = $('#smh-modal3 #overlay_timeout').val();
            flashvars['overlay.displayDuration'] = overlay_timeout;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        
        $('#smh-modal3').on('change', 'input[name="postroll_enable"]' ,function(){
            if($('#smh-modal3 #postroll_yes').is(':checked')){
                $('#smh-modal3 #postroll_url').removeAttr('disabled');
                $('#smh-modal3 #postroll_amount').removeAttr('disabled');
                $('#smh-modal3 #postroll_start').removeAttr('disabled');
                $('#smh-modal3 #postroll_interval').removeAttr('disabled');
                if($('#smh-modal3 #bumper').is(':checked')){
                    var bumper_sequence = $('#smh-modal3 #bumper_sequence').val();  
                    if(bumper_sequence == 'before' || bumper_sequence == 'both'){ 
                        flashvars['bumper.postSequence'] = 2;
                    }
                }
                flashvars['vast.postSequence'] = 1;
                var postroll_url = $('#smh-modal3 #postroll_url').val();
                flashvars['vast.postrollUrl'] = postroll_url;
                var postroll_amount = $('#smh-modal3 #postroll_amount').val();
                flashvars['vast.numPreroll'] = postroll_amount;
                var postroll_start = $('#smh-modal3 #postroll_start').val();
                flashvars['vast.postrollStartWith'] = postroll_start;
                var postroll_interval = $('#smh-modal3 #postroll_interval').val();
                flashvars['vast.postrollStartWith'] = postroll_interval;
            } else {
                $('#smh-modal3 #postroll_url').attr('disabled','');
                $('#smh-modal3 #postroll_amount').attr('disabled','');
                $('#smh-modal3 #postroll_start').attr('disabled','');
                $('#smh-modal3 #postroll_interval').attr('disabled','');
                if($('#smh-modal3 #bumper').is(':checked')){
                    var bumper_sequence = $('#smh-modal3 #bumper_sequence').val();  
                    if(bumper_sequence == 'before'|| bumper_sequence == 'both'){ 
                        flashvars['bumper.postSequence'] = 1;
                    }
                }
                flashvars['vast.postSequence'] = 0;
            }           
            if(auto_postview){
                smhPlayers.refreshPlayer();  
            } 
        });
        $('#smh-modal3').on('change', '#postroll_url', function(){
            var postroll_url = $('#smh-modal3 #postroll_url').val();
            flashvars['vast.postrollUrl'] = postroll_url;
            if(auto_postview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#postroll_amount', function(){
            var postroll_amount = $('#smh-modal3 #postroll_amount').val();
            flashvars['vast.numPreroll'] = postroll_amount;
            if(auto_postview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#postroll_start', function(){
            var postroll_start = $('#smh-modal3 #postroll_start').val();
            flashvars['vast.postrollStartWith'] = postroll_start;
            if(auto_postview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#postroll_interval', function(){
            var postroll_interval = $('#smh-modal3 #postroll_interval').val();
            flashvars['vast.postrollStartWith'] = postroll_interval;
            if(auto_postview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Playlist Previos Button
    playerPrevious:function(){
        $('#smh-modal3').on('click', '#previous_button' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 #previous_tool').removeAttr('disabled');
                var previous_tooltip = $('#smh-modal3 #previous_tool').val();
                playlist_previous = true;
                playlist_previous_tooltip = previous_tooltip;
            } else {
                $('#smh-modal3 #previous_tool').attr('disabled','');
                playlist_previous = false;
            }
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#previous_tool' ,function(){
            var previous_tooltip = $('#smh-modal3 #previous_tool').val();
            playlist_previous_tooltip = previous_tooltip;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Playlist Next Button
    playerNext:function(){
        $('#smh-modal3').on('click', '#next_button' ,function(e){
            e.stopPropagation();
            if(this.checked){
                $('#smh-modal3 #next_tool').removeAttr('disabled');
                var next_tooltip = $('#smh-modal3 #next_tool').val();
                playlist_next = true;
                playlist_next_tooltip = next_tooltip;
            } else {
                $('#smh-modal3 #next_tool').attr('disabled','');
                playlist_next = false;
            }
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#previous_tool' ,function(){
            var next_tooltip = $('#smh-modal3 #next_tool').val();
            playlist_next_tooltip = next_tooltip;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Playlist Thumbnails
    playerPlistThumb:function(){
        $('#smh-modal3').on('click', '#plist_thumb' ,function(e){
            e.stopPropagation();
            playlist_rowHeight = 30;
            playlist_items = 0;
            var space, items;
            if(playlist_description){
                playlist_items++;
            }
            if(playlist_plays){
                playlist_items++;
            }
            if(playlist_rank){
                playlist_items++;
            }
            if(playlist_votes){
                playlist_items++;
            }
            if(playlist_tags){
                playlist_items++;
            }
            if(playlist_admintags){
                playlist_items++;
            }
            if(playlist_createddate){ 
                playlist_items++;
            }
            if(playlist_createdby){
                playlist_items++;
            }
            if(this.checked){
                playlist_thumbnail = true;
                playlist_rowHeight = Number(playlist_rowHeight)+40;
                if(playlist_items > 2){
                    items = playlist_items - 2;
                    space = items * 20;
                    playlist_rowHeight += space;
                }
            } else {
                playlist_thumbnail = false;
                space = playlist_items * 20;
                playlist_rowHeight += space;                  
            }
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Playlist Thumbnails
    playerPlistName:function(){
        $('#smh-modal3').on('click', '#plist_name' ,function(e){
            e.stopPropagation();
            playlist_rowHeight = 30;
            playlist_items = 0;
            var space, items;
            if(this.checked){
                playlist_name = true;
            } else {
                playlist_name = false;
            }
            if(playlist_description){
                playlist_items++;
            }
            if(playlist_plays){
                playlist_items++;
            }
            if(playlist_rank){
                playlist_items++;
            }
            if(playlist_votes){
                playlist_items++;
            }
            if(playlist_tags){
                playlist_items++;
            }
            if(playlist_admintags){
                playlist_items++;
            }
            if(playlist_createddate){ 
                playlist_items++;
            }
            if(playlist_createdby){
                playlist_items++;
            }
            if(playlist_thumbnail){
                playlist_rowHeight = Number(playlist_rowHeight)+40;
                if(playlist_items > 2){
                    items = playlist_items - 2;
                    space = items * 20;
                    playlist_rowHeight += space;
                }
            }
            if(!playlist_thumbnail){
                space = playlist_items * 20;
                playlist_rowHeight += space;   
            }
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Playlist Description
    playerPlistDesc:function(){
        $('#smh-modal3').on('click', '#plist_desc' ,function(e){
            e.stopPropagation();
            playlist_rowHeight = 30;
            playlist_items = 0;
            var space, items;
            if(this.checked){
                playlist_description = true;
            } else {
                playlist_description = false;
            }
            if(playlist_description){
                playlist_items++;
            }
            if(playlist_plays){
                playlist_items++;
            }
            if(playlist_rank){
                playlist_items++;
            }
            if(playlist_votes){
                playlist_items++;
            }
            if(playlist_tags){
                playlist_items++;
            }
            if(playlist_admintags){
                playlist_items++;
            }
            if(playlist_createddate){ 
                playlist_items++;
            }
            if(playlist_createdby){
                playlist_items++;
            }
            if(playlist_thumbnail){
                playlist_rowHeight = Number(playlist_rowHeight)+40;
                if(playlist_items > 2){
                    items = playlist_items - 2;
                    space = items * 20;
                    playlist_rowHeight += space;
                }
            }
            if(!playlist_thumbnail){
                space = playlist_items * 20;
                playlist_rowHeight += space;
            }
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Playlist Duration
    playerPlistDuration:function(){
        $('#smh-modal3').on('click', '#plist_duration' ,function(e){
            e.stopPropagation();
            playlist_rowHeight = 30;
            playlist_items = 0;
            var space, items;
            if(this.checked){
                playlist_duration = true;
            } else {
                playlist_duration = false;
            }
            if(playlist_description){
                playlist_items++;
            }
            if(playlist_plays){
                playlist_items++;
            }
            if(playlist_rank){
                playlist_items++;
            }
            if(playlist_votes){
                playlist_items++;
            }
            if(playlist_tags){
                playlist_items++;
            }
            if(playlist_admintags){
                playlist_items++;
            }
            if(playlist_createddate){ 
                playlist_items++;
            }
            if(playlist_createdby){
                playlist_items++;
            }
            if(playlist_thumbnail){
                playlist_rowHeight = Number(playlist_rowHeight)+40;
                if(playlist_items > 2){
                    items = playlist_items - 2;
                    space = items * 20;
                    playlist_rowHeight += space;
                }
            }
            if(!playlist_thumbnail){
                space = playlist_items * 20;
                playlist_rowHeight += space;  
            }
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Playlist Plays
    playerPlistPlays:function(){
        $('#smh-modal3').on('click', '#plist_plays' ,function(e){
            e.stopPropagation();
            playlist_rowHeight = 30;
            playlist_items = 0;
            var space, items;
            if(this.checked){
                playlist_plays = true;
            } else {
                playlist_plays = false;
            }
            if(playlist_description){
                playlist_items++;
            }
            if(playlist_plays){
                playlist_items++;
            }
            if(playlist_rank){
                playlist_items++;
            }
            if(playlist_votes){
                playlist_items++;
            }
            if(playlist_tags){
                playlist_items++;
            }
            if(playlist_admintags){
                playlist_items++;
            }
            if(playlist_createddate){ 
                playlist_items++;
            }
            if(playlist_createdby){
                playlist_items++;
            }
            if(playlist_thumbnail){
                playlist_rowHeight = Number(playlist_rowHeight)+40;
                if(playlist_items > 2){
                    items = playlist_items - 2;
                    space = items * 20;
                    playlist_rowHeight += space;
                }
            }
            if(!playlist_thumbnail){
                space = playlist_items * 20;
                playlist_rowHeight += space;
            }
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Playlist Rank
    playerPlistRank:function(){
        $('#smh-modal3').on('click', '#plist_rank' ,function(e){
            e.stopPropagation();
            playlist_rowHeight = 30;
            playlist_items = 0;
            var space, items;
            if(this.checked){
                playlist_rank = true;
            } else {
                playlist_rank = false;
            }
            if(playlist_description){
                playlist_items++;
            }
            if(playlist_plays){
                playlist_items++;
            }
            if(playlist_rank){
                playlist_items++;
            }
            if(playlist_votes){
                playlist_items++;
            }
            if(playlist_tags){
                playlist_items++;
            }
            if(playlist_admintags){
                playlist_items++;
            }
            if(playlist_createddate){ 
                playlist_items++;
            }
            if(playlist_createdby){
                playlist_items++;
            }
            if(playlist_thumbnail){
                playlist_rowHeight = Number(playlist_rowHeight)+40;
                if(playlist_items > 2){
                    items = playlist_items - 2;
                    space = items * 20;
                    playlist_rowHeight += space;
                }
            }
            if(!playlist_thumbnail){
                space = playlist_items * 20;
                playlist_rowHeight += space;                   
            }
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Playlist Votes
    playerPlistVotes:function(){
        $('#smh-modal3').on('click', '#plist_votes' ,function(e){
            e.stopPropagation();
            playlist_rowHeight = 30;
            playlist_items = 0;
            var space, items;
            if(this.checked){
                playlist_votes = true;
            } else {
                playlist_votes = false;
            }
            if(playlist_description){
                playlist_items++;
            }
            if(playlist_plays){
                playlist_items++;
            }
            if(playlist_rank){
                playlist_items++;
            }
            if(playlist_votes){
                playlist_items++;
            }
            if(playlist_tags){
                playlist_items++;
            }
            if(playlist_admintags){
                playlist_items++;
            }
            if(playlist_createddate){ 
                playlist_items++;
            }
            if(playlist_createdby){
                playlist_items++;
            }
            if(playlist_thumbnail){
                playlist_rowHeight = Number(playlist_rowHeight)+40;
                if(playlist_items > 2){
                    items = playlist_items - 2;
                    space = items * 20;
                    playlist_rowHeight += space;
                }
            }
            if(!playlist_thumbnail){
                space = playlist_items * 20;
                playlist_rowHeight += space;                
            }
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Playlist Tags
    playerPlistTags:function(){
        $('#smh-modal3').on('click', '#plist_tags' ,function(e){
            e.stopPropagation();
            playlist_rowHeight = 30;
            playlist_items = 0;
            var space, items;
            if(this.checked){
                playlist_tags = true;
            } else {
                playlist_tags = false;
            }
            if(playlist_description){
                playlist_items++;
            }
            if(playlist_plays){
                playlist_items++;
            }
            if(playlist_rank){
                playlist_items++;
            }
            if(playlist_votes){
                playlist_items++;
            }
            if(playlist_tags){
                playlist_items++;
            }
            if(playlist_admintags){
                playlist_items++;
            }
            if(playlist_createddate){ 
                playlist_items++;
            }
            if(playlist_createdby){
                playlist_items++;
            }
            if(playlist_thumbnail){
                playlist_rowHeight = Number(playlist_rowHeight)+40;
                if(playlist_items > 2){
                    items = playlist_items - 2;
                    space = items * 20;
                    playlist_rowHeight += space;
                }
            }
            if(!playlist_thumbnail){
                space = playlist_items * 20;
                playlist_rowHeight += space;                    
            }
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Playlist Created Date
    playerPlistCreatedDate:function(){
        $('#smh-modal3').on('click', '#plist_createddat' ,function(e){
            e.stopPropagation();
            playlist_rowHeight = 30;
            playlist_items = 0;
            var space, items;
            if(this.checked){
                playlist_createddate = true;
            } else {
                playlist_createddate = false;
            }
            if(playlist_description){
                playlist_items++;
            }
            if(playlist_plays){
                playlist_items++;
            }
            if(playlist_rank){
                playlist_items++;
            }
            if(playlist_votes){
                playlist_items++;
            }
            if(playlist_tags){
                playlist_items++;
            }
            if(playlist_admintags){
                playlist_items++;
            }
            if(playlist_createddate){ 
                playlist_items++;
            }
            if(playlist_createdby){
                playlist_items++;
            }
            if(playlist_thumbnail){
                playlist_rowHeight = Number(playlist_rowHeight)+40;
                if(playlist_items > 2){
                    items = playlist_items - 2;
                    space = items * 20;
                    playlist_rowHeight += space;
                }
            }
            if(!playlist_thumbnail){
                space = playlist_items * 20;
                playlist_rowHeight += space;                  
            }
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Player Playlist Created By
    playerPlistCreatedBy:function(){
        $('#smh-modal3').on('click', '#plist_createdby' ,function(e){
            e.stopPropagation();
            playlist_rowHeight = 30;
            playlist_items = 0;
            var items;
            var space;
            if(this.checked){
                playlist_createdby = true;
            } else {
                playlist_createdby = false;
            }
            if(playlist_description){
                playlist_items++;
            }
            if(playlist_plays){
                playlist_items++;
            }
            if(playlist_rank){
                playlist_items++;
            }
            if(playlist_votes){
                playlist_items++;
            }
            if(playlist_tags){
                playlist_items++;
            }
            if(playlist_admintags){
                playlist_items++;
            }
            if(playlist_createddate){ 
                playlist_items++;
            }
            if(playlist_createdby){
                playlist_items++;
            }
            if(playlist_thumbnail){
                playlist_rowHeight = Number(playlist_rowHeight)+40;
                if(playlist_items > 2){
                    items = playlist_items - 2;
                    space = items * 20;
                    playlist_rowHeight += space;
                }
            }
            if(!playlist_thumbnail){
                space = playlist_items * 20;
                playlist_rowHeight += space;                  
            }
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
    },
    //Register actions
    registerActions:function(){
        $('#smh-modal3').on('click', '.player_close', function(event){
            edit = false;  
        });
        
        $('#smh-modal2').on('click', '.smh-close2', function(){
            $('#smh-modal3').css('z-index','');    
            $('#smh-modal2').on('hidden.bs.modal', function (e) {
                $('body').addClass('modal-open');
            });
        });
        $(window).resize(function() {
            smhPlayers.fontsize()
        });
        $('#smh-modal3').on('change', '#aspect_ratio' ,function(){
            var ratio = $('#aspect_ratio').val();
            var width, height;
            if(ratio !== 'dim_custom'){
                $('#dim_height').attr('disabled','');
                var aspect = ratio == 'dim_16_9' ? 9 / 16 : 3 / 4;
                width = $('#dim_width').val();
                height = parseInt(width * aspect);       
                $('#dim_height').val(height);
                if(auto_preview){
                    smhPlayers.refreshPlayer();  
                }                
            } else {
                $('#dim_height').removeAttr('disabled');
                if(auto_preview){
                    smhPlayers.refreshPlayer();  
                } 
            }                       
        });

        $('#smh-modal3').on('keyup', '#dim_width' ,function(){
            var ratio = $('#aspect_ratio').val();
            var width, height;
            if(ratio !== 'dim_custom'){
                var aspect = ratio == 'dim_16_9' ? 9 / 16 : 3 / 4;
                width = $('#dim_width').val();
                height = parseInt(width * aspect);       
                $('#dim_height').val(height);
                if(auto_preview){
                    smhPlayers.refreshPlayer();  
                }                
            }
        });
        
        $('#smh-modal3').on('change', '#theme' ,function(){
            var theme = $('#smh-modal3 #theme').val();
            if(theme == 'w'){ 
                skin = '/content/uiconf/kaltura/kmc/appstudio/kdp3/falcon/skin/v3.7/skin_light.swf';
            } else {
                skin = '/content/uiconf/kaltura/kmc/appstudio/kdp3/falcon/skin/v3.7/skin.swf';
            }
            flashvars['full.skinPath'] = skin;
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', 'input[name="video_ratio"]' ,function(){
            origMedia = $('#video_ratio_orig').is(':checked')? true : false;
            stretMedia = $('#video_ratio_fit').is(':checked')? true : false;
        });
        $('#smh-modal3').on('change', '#auto_play' ,function(){
            playOnload = $('#auto_play').is(':checked')? true : false;
        });
        $('#smh-modal3').on('change', '#start_muted' ,function(){
            playerMute = $('#start_muted').is(':checked')? true : false;
        });
        $('#smh-modal3').on('change', '#hidePlaylist' ,function(){
            if($('#hidePlaylist').is(':checked')){
                playlist_visible = false;                
                width = '400';
                height = '330';
            } else {
                playlist_visible = true;
                if (uiconf_id == '6709439' || uiconf_id == '6709441'){
                    width = '740';
                    height = '330';
                } else if (uiconf_id == '6709440'){
                    width = '400';
                    height = '620';
                }
            }
            flashvars['width'] = width;
            flashvars['height'] = height;
            $('#dim_width').val(width);
            $('#dim_height').val(height);
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#autoContinue' ,function(){
            if($('#autoContinue').is(':checked')){
                playlist_autocontinue = true;
            } else {
                playlist_autocontinue = false;
            }
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#playlistLoop' ,function(){
            if($('#playlistLoop').is(':checked')){
                playlist_loop = true;
            } else {
                playlist_loop = false;
            }
            if(auto_preview){
                smhPlayers.refreshPlayer();  
            }
        });
        $('#smh-modal3').on('change', '#style_font' ,function(){
            style_fontfamily = $('#smh-modal3 #style_font').val();
            flashvars['movieName.font'] = style_fontfamily;
            flashvars['noticeMessage.font'] = style_fontfamily;
            flashvars['skipBtn.font'] = style_fontfamily;
            flashvars['captureThumbBtnControllerScreen.font'] = style_fontfamily;
            flashvars['custom1BtnStartScreen.font'] = style_fontfamily;
            flashvars['custom2BtnStartScreen.font'] = style_fontfamily;
            flashvars['custom3BtnStartScreen.font'] = style_fontfamily;
            flashvars['custom4BtnStartScreen.font'] = style_fontfamily;
            flashvars['custom5BtnStartScreen.font'] = style_fontfamily;
            flashvars['shareBtnStartScreen.font'] = style_fontfamily;
            flashvars['downloadBtnStartScreen.font'] = style_fontfamily;
            flashvars['fullScreenBtnStartScreen.font'] = style_fontfamily;
            flashvars['onVideoPlayBtnStartScreen.font'] = style_fontfamily;
            flashvars['editBtnStartScreen.font'] = style_fontfamily;
            flashvars['captureThumbBtnStartScreen.font'] = style_fontfamily;
            flashvars['flagBtnStartScreen.font'] = style_fontfamily;
            flashvars['uploadBtnStartScreen.font'] = style_fontfamily;
            flashvars['unmuteBtnStartScreen.font'] = style_fontfamily;
            flashvars['custom1BtnPlayScreen.font'] = style_fontfamily;
            flashvars['custom2BtnPlayScreen.font'] = style_fontfamily;
            flashvars['custom3BtnPlayScreen.font'] = style_fontfamily;
            flashvars['custom4BtnPlayScreen.font'] = style_fontfamily;
            flashvars['custom5BtnPlayScreen.font'] = style_fontfamily;
            flashvars['shareBtnPlayScreen.font'] = style_fontfamily;
            flashvars['downloadBtnPlayScreen.font'] = style_fontfamily;
            flashvars['fullScreenBtnPlayScreen.font'] = style_fontfamily;
            flashvars['editBtnPlayScreen.font'] = style_fontfamily;
            flashvars['captureThumbBtnPlayScreen.font'] = style_fontfamily;
            flashvars['flagBtnPlayScreen.font'] = style_fontfamily;
            flashvars['uploadBtnPlayScreen.font'] = style_fontfamily;
            flashvars['unmuteBtnPlayScreen.font'] = style_fontfamily;
            flashvars['custom1BtnPauseScreen.font'] = style_fontfamily;
            flashvars['custom2BtnPauseScreen.font'] = style_fontfamily;
            flashvars['custom3BtnPauseScreen.font'] = style_fontfamily;
            flashvars['custom4BtnPauseScreen.font'] = style_fontfamily;
            flashvars['custom5BtnPauseScreen.font'] = style_fontfamily;
            flashvars['shareBtnPauseScreen.font'] = style_fontfamily;
            flashvars['downloadBtnPauseScreen.font'] = style_fontfamily;
            flashvars['fullScreenBtnPauseScreen.font'] = style_fontfamily;
            flashvars['onVideoPlayBtnPauseScreen.font'] = style_fontfamily;
            flashvars['editBtnPauseScreen.font'] = style_fontfamily;
            flashvars['captureThumbBtnPauseScreen.font'] = style_fontfamily;
            flashvars['flagBtnPauseScreen.font'] = style_fontfamily;
            flashvars['uploadBtnPauseScreen.font'] = style_fontfamily;
            flashvars['unmuteBtnPauseScreen.font'] = style_fontfamily;
            flashvars['custom1BtnEndScreen.font'] = style_fontfamily;
            flashvars['custom2BtnEndScreen.font'] = style_fontfamily;
            flashvars['custom3BtnEndScreen.font'] = style_fontfamily;
            flashvars['custom4BtnEndScreen.font'] = style_fontfamily;
            flashvars['custom5BtnEndScreen.font'] = style_fontfamily;
            flashvars['shareBtnEndScreen.font'] = style_fontfamily;
            flashvars['downloadBtnEndScreen.font'] = style_fontfamily;
            flashvars['fullScreenBtnEndScreen.font'] = style_fontfamily;
            flashvars['editBtnEndScreen.font'] = style_fontfamily;
            flashvars['captureThumbBtnEndScreen.font'] = style_fontfamily;
            flashvars['flagBtnEndScreen.font'] = style_fontfamily;
            flashvars['uploadBtnEndScreen.font'] = style_fontfamily;
            flashvars['unmuteBtnEndScreen.font'] = style_fontfamily;
            flashvars['replayBtnEndScreen.font'] = style_fontfamily;
        });
    }
}

// Main on ready
$(document).ready(function(){
    smhPlayers = new Players();
    smhPlayers.getPlayers();
    smhPlayers.registerActions();
    smhPlayers.playerTitle();
    smhPlayers.playerWatermark();
    smhPlayers.playerLogoIcon();
    smhPlayers.playerLeftCounter();
    smhPlayers.playerRightCounter();
    smhPlayers.playerFlavorSelect();
    smhPlayers.playerFullscreen();
    smhPlayers.playerOVPlay();
    smhPlayers.playerPlayPause();
    smhPlayers.playerVolume();
    smhPlayers.playerScubber();
    smhPlayers.playerReplay();
    smhPlayers.playerUnmute();
    smhPlayers.playerShare();
    smhPlayers.playerDownload();
    smhPlayers.playerThumbnail();
    smhPlayers.playerStars();
    smhPlayers.playerCaptions();
    smhPlayers.customButton1();
    smhPlayers.customButton2();
    smhPlayers.customButton3();
    smhPlayers.customButton4();
    smhPlayers.customButton5();
    smhPlayers.playerBumper();
    smhPlayers.playerVast();
    smhPlayers.playerPrevious();
    smhPlayers.playerNext();
    smhPlayers.playerPlistThumb();
    smhPlayers.playerPlistName();
    smhPlayers.playerPlistDesc();
    smhPlayers.playerPlistDuration();
    smhPlayers.playerPlistPlays();
    smhPlayers.playerPlistRank();
    smhPlayers.playerPlistVotes();
    smhPlayers.playerPlistTags();
    smhPlayers.playerPlistCreatedDate();
    smhPlayers.playerPlistCreatedBy();
});
