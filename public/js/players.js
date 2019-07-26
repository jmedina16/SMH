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
var uiconf_id;
var player_name = '';
var player_id = '';
var player_entryid;
var width;
var height;
var social_networks = new Array();
var playlist_options = '';
var CacheApiUrl = "/apps/cache/v1.0/index.php?";
var categories = [];
var cats = [];
var ac = [];
var ac_filter = [];
var ac_select = {};
var mediaTypes = [];
var flavors = [];
var flavors_filter = [];
var duration = [];
var clipped = [];

//Login prototype/class
Players.prototype = {
    constructor: Players,
    //Build tickets table
    getPlayers: function () {
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#players-table').empty();
        $('#players-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="players-data"></table>');
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
            "lengthChange": true,
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
                "data": function (d) {
                    return $.extend({}, d, {
                        "_token": $('meta[name="csrf-token"]').attr('content'),
                        "pid": sessInfo.pid,
                        "ks": sessInfo.ks,
                        "tz": tz,
                        "m": ($.inArray("STUDIO_UPDATE_UICONF", sessPerm) != -1) ? true : false,
                        "d": ($.inArray("STUDIO_DELETE_UICONF", sessPerm) != -1) ? true : false
                    });
                },
                "dataSrc": function (json) {
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
            "preDrawCallback": function () {
                smhMain.showProcessing();
            },
            "drawCallback": function (oSettings) {
                smhMain.hideProcessing();
                smhMain.fcmcAddRows(this, 7, 10);
            }
        });
        $('#users-buttons .dd-delete-btn').removeClass('btn-default');
        $('#users-buttons .dd-delete-btn').addClass('btn-disabled');
        $('#users-buttons .dd-delete-btn').attr('disabled', '');
        $('#players-table').on('change', ".players-bulk", function () {
            var anyBoxesChecked = false;
            $('#players-table input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                }
            });

            if (anyBoxesChecked == true && ($.inArray("STUDIO_DELETE_UICONF", sessPerm) != -1)) {
                $('#users-buttons .dd-delete-btn').removeClass('btn-disabled');
                $('#users-buttons .dd-delete-btn').addClass('btn-default');
                $('#users-buttons .dd-delete-btn').removeAttr('disabled');
            } else {
                $('#users-buttons .dd-delete-btn').removeClass('btn-default');
                $('#users-buttons .dd-delete-btn').addClass('btn-disabled');
                $('#users-buttons .dd-delete-btn').attr('disabled', '');
            }
        });
        $('#players-bulkAll').click(function () {
            if (this.checked) {
                $('.players-bulk').each(function () {
                    this.checked = true;
                });
            } else {
                $('.players-bulk').each(function () {
                    this.checked = false;
                });
            }
        });
    },
    //Delete Player modal
    deletePlayer: function (id, name) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '435px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Delete</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='text-align: center; margin: 27px 27px 0; height: 75px; width: 378px;'>Are you sure you want to delete the following player?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>(" + name + ")</div>";

        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="delete-player" onclick="smhPlayers.removePlayer(\'' + id + '\')">Delete</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Remove Player
    removePlayer: function (id) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results == null) {
                smhPlayers.purgeCache('delete');
                $('#smh-modal').modal('hide');
                smhPlayers.getPlayers();
            } else if (results.code && results.message) {
                alert(results.message);
                return;
            }
        };

        $('#delete-player').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        client.uiConf.deleteAction(cb, id);
    },
    //Bulk delete modal
    bulkDeleteModal: function () {
        bulkdelete = new Array();
        var rowcollection = playersTable.$(".players-bulk:checked", {
            "page": "all"
        });
        rowcollection.each(function (index, elem) {
            var checkbox_value = $(elem).val();
            bulkdelete.push(checkbox_value);
        });

        if (bulkdelete.length == 0) {
            smhPlayers.noEntrySelected();
        } else {
            smhMain.resetModal();
            var header, content, footer;
            $('.smh-dialog').css('width', '440px');
            $('#smh-modal .modal-body').css('padding', '0');
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
    bulkDelete: function () {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            smhPlayers.purgeCache('delete');
            $('#smh-modal').modal('hide');
            smhPlayers.getPlayers();
        };

        $('#delete-players').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        client.startMultiRequest();
        $.each(bulkdelete, function (key, value) {
            client.uiConf.deleteAction(cb, value);
        });
        client.doMultiRequest(cb);
    },
    //No Entry selected
    noEntrySelected: function () {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '286px');
        $('#smh-modal .modal-body').css('padding', '0');
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
    duplicatePlayer: function (id) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            smhPlayers.getPlayers();
        };

        client.uiConf.cloneAction(cb, id);
    },
    //Renders Player
    renderPlayer: function () {
        var player_prev_gen = smhPlayers.generateEmbed(player_entryid, flashvars['width'], flashvars['height'], 'https', 'dynamic', false, 'Player Preview', true);
        var player_prev = player_prev_gen.getCode();
        smhPlayers.generateIframe(player_prev);
    },
    //Generates QR code
    getShortLink: function (uiconf, embed, delivery) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            $('#qrcode').empty();
            shortlink = 'http://mediaplatform.streamingmediahosting.com/tiny/' + results['id'];
            var qrcode = new QRCode(document.getElementById("qrcode"), {
                width: 80,
                height: 80
            });
            qrcode.clear();
            qrcode.makeCode(shortlink);
            $('#shortlink').html('<a target="_blank" href="' + shortlink + '">' + shortlink + '</a>');
        };
        var url = '';
        if (delivery == 'http') {
            url = "http://mediaplatform.streamingmediahosting.com/index.php/extwidget/preview/partner_id/" + sessInfo.pid + "/uiconf_id/" + uiconf + "/embed/" + embed + "?&flashvars[ks]=" + sessInfo.ks;
        } else {
            url = "http://mediaplatform.streamingmediahosting.com/index.php/extwidget/preview/partner_id/" + sessInfo.pid + "/uiconf_id/" + uiconf + "/embed/" + embed + "?&flashvars[streamerType]=rtmp&flashvars[mediaProtocol]=rtmp&flashvars[ks]=" + sessInfo.ks;
        }

        $('#shortlink').html('Generating...');
        $('#qrcode').html('Generating...');
        var shortLink = new KalturaShortLink();
        shortLink.systemName = "KMC-PREVIEW";
        shortLink.fullUrl = url;
        client.shortLink.add(cb, shortLink);
    },
    //Parses an xml file
    parseXML: function (xml) {
        var dom = null;
        if (window.DOMParser) {
            try {
                dom = (new DOMParser()).parseFromString(xml, "text/xml");
            } catch (e) {
                dom = null;
            }
        } else if (window.ActiveXObject) {
            try {
                dom = new ActiveXObject('Microsoft.XMLDOM');
                dom.async = false;
                if (!dom.loadXML(xml)) // parse error ..
                    window.alert(dom.parseError.reason + dom.parseError.srcText);
            } catch (e) {
                dom = null;
            }
        } else
            alert("cannot parse xml string!");
        return dom;
    },
    //Gets available playlists
    getAvailablePlaylist: function (parr) {
        var MULTI = new Array();
        var addOn = "";

        var defaults = {
            animatePadding: 60,
            ApiUrl: "/api_v3/index.php?",
            sessSrv: "multirequest",
            sessAct: "null",
            format: "1"
        };

        var options = $.extend(defaults, options);

        var o = options;

        var x = 1;
        $.each(parr, function (key, value) {
            addOn += '&' + x + ':service=playlist&' + x + ':action=get&' + x + ':id=' + value;
            x++;
        });

        var sessData = 'ks=' + sessInfo.ks + '&ignoreNull=1' + addOn;

        var reqObj = {
            service: o.sessSrv,
            action: o.sessAct,
            format: o.format

        };
        var reqUrl = o.ApiUrl + $.param(reqObj);
        var i = 0;
        $.ajax({
            cache: false,
            async: false,
            url: reqUrl,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            success: function (data) {
                $.each(data, function (key, value) {
                    if (value['code']) {
                    } else {
                        var theDate = new Date(value['createdAt'] * 1000);
                        var newDatetime = theDate.toString("MM/dd/yyyy hh:mm tt");

                        var playlistType;
                        if (value['playlistType'] == 10) {
                            playlistType = 'Rule Based';
                        } else if (value['playlistType'] == 3) {
                            playlistType = 'Manual';
                        }

                        var entry_container = '<div class="entry-wrapper ui-draggable ui-draggable-dragging hover" data-entryid="' + value['id'] + '" data-name="' + value['name'] + '">' +
                                '<div class="entry-details">' +
                                '<div class="entry-name">' +
                                '<div>' + value['name'] + '</div>' +
                                '</div>' +
                                '<div class="entry-subdetails">' +
                                '<span style="width: 85px; display: inline-block;">Playlist ID:</span><span>' + value['id'] + '</span>' +
                                '</div>' +
                                '<div class="entry-subdetails">' +
                                '<span style="width: 85px; display: inline-block;">Created on:</span><span>' + newDatetime + '</span>' +
                                '</div>' +
                                '<div class="entry-subdetails">' +
                                '<span style="width: 85px; display: inline-block;">Type:</span><span>' + playlistType + '</span>' +
                                '</div>' +
                                '</div>' +
                                '<div class="tools" onclick="smhPlayers.removeDND(this);">' +
                                '<i class="fa fa-trash-o"></i>' +
                                '</div>' +
                                '<div class="clear"></div>' +
                                '</div>';

                        MULTI[i] = new Array(entry_container, value['id']);
                        i++;
                    }

                });
            }
        });
        return MULTI;
    },
    //Generate Player Embed Code
    generatePlayerEmbed: function (uiconf_id, width, height, protocol, streamerType, embed, seo, name, preview, playlist) {
        var entries = playlist.split(':');
        var flashvars = {};
        if (streamerType == 'http') {
            flashvars.disableHLSOnJs = true;
        } else {
            flashvars.LeadHLSOnAndroid = true;
        }

        var i = 0;
        $.each(entries, function (key, value) {
            flashvars['playlistAPI.kpl' + i + 'Id'] = value;
            i++;
        });

        if (preview) {
            flashvars.ks = sessInfo.ks;
        }

        var cacheSt = smhPlayers.getCacheSt();
        var gen = new kEmbedCodeGenerator({
            host: "mediaplatform.streamingmediahosting.com",
            securedHost: "mediaplatform.streamingmediahosting.com",
            embedType: embed,
            partnerId: sessInfo.pid,
            widgetId: "_" + sessInfo.pid,
            uiConfId: uiconf_id,
            playerId: "smh_player",
            width: width,
            height: height,
            cacheSt: cacheSt,
            includeKalturaLinks: false,
            includeSeoMetadata: seo,
            protocol: protocol,
            flashVars: flashvars,
            entryMeta: {
                name: name,
                thumbnailUrl: "",
                width: width,
                height: height
            }
        });
        return gen;
    },
    //Preview and embed playlists
    previewPlayer: function (uiconf_id, name) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }

            var PLAYLIST_ENTRIES = new Array();
            var TEMP_MULTI = new Array();
            var multi;
            var playlist = '';
            var config = JSON.parse(results['config']);
            var plugins = config.plugins;
            var width, height;

            width = results['width'];
            height = results['height'];

            $.each(plugins.playlistAPI, function (key, value) {
                if (key.match(/kpl/g)) {
                    if (key.match(/Id/g)) {
                        TEMP_MULTI.push(value);
                    }
                }
            });
            multi = smhPlayers.getAvailablePlaylist(TEMP_MULTI);
            $.each(multi, function (key, value) {
                PLAYLIST_ENTRIES.push(value[1]);
            });

            playlist = PLAYLIST_ENTRIES.join(":");

            smhMain.resetModal();
            var header, content, gen, embedCode, player_prev_gen, player_prev;
            var protocol = 'http';
            var seo = false;
            $('#smh-modal3 .modal-body').css('padding', '0');
            $('#smh-modal3').modal({
                backdrop: 'static'
            });
            $('#smh-modal3').addClass('previewModal');

            var header_text = 'Preview';
            if ($.inArray("PLAYLIST_EMBED_CODE", sessPerm) != -1) {
                header_text = 'Preview & Embed';
            }

            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">' + header_text + ': ' + name.replace(/%20/g, " ") + '</h4>';
            $('#smh-modal3 .modal-header').html(header);

            var embed_perm = '';
            var embed_type = '';
            var secure_seo = '';
            if ($.inArray("PLAYLIST_EMBED_CODE", sessPerm) != -1) {
                embed_perm = '<hr>' +
                        '<div style="margin-top: 10px; font-weight: bold;"><div style="color: #444; font-size: 12px; padding-top: 15px; float: left;">Embed Code:</div><div style="float: right; margin-right: 13px;"><button id="select-bttn" class="btn btn-default" style="margin: 10px 0 10px 0;">Select Code</button></div></div>' +
                        '<textarea class="form-control" id="embed_code" rows="5" cols="30"></textarea>';
                embed_type = '<hr>' +
                        '<div style="margin-top: 10px; font-weight: bold;"><span style="color: #444; font-size: 12px; margin-right: 37px;">Embed Type:</span><span><select class="form-control embedType" style="width: 213px;"><option value="dynamic">Dynamic Embed</option><option value="iframe">Iframe Embed</option></select></span></div>' +
                        '<div style="margin-top: 5px;"><span id="embedType-text" style="font-size: 12px; color: #999;">Dynamic embed is the preferred method to dynamically embed the player into web sites and web applications.</span></div>';
                secure_seo = '<hr>' +
                        '<div style="margin-top: 10px; font-weight: bold;"><span><input type="checkbox" id="secure" name="secure"></span>&nbsp;<span style="color: #444; font-size: 12px; font-weight: bold; margin-left: 5px; position: relative; top: -2px;">Support for HTTPS embed code</span></div>' +
                        '<div style="margin-top: 10px; font-weight: bold;"><span><input type="checkbox" id="seo" name="seo"></span>&nbsp;<span style="color: #444; font-size: 12px; font-weight: bold; margin-left: 5px; position: relative; top: -2px;">Include Search Engine Optimization data</span></div>';
            }

            content = '<div class="content">' +
                    '<div class="options">' +
                    '<div style="margin-top: 10px; font-weight: bold;"><span style="color: #444; font-size: 12px;margin-right: 30px;">Delivery Type:</span><span><select class="form-control delivery" style="width: 213px;"><option value="hls">HLS Streaming</option><option value="http">HTTP Progressive Download</option></select></span></div>' +
                    '<div style="margin-top: 5px;"><span style="font-size: 12px; color: #999;">Adaptive Streaming automatically adjusts to the viewer\'s bandwidth,while Progressive Download allows buffering of the content.</span></div>' +
                    embed_type +
                    secure_seo +
                    '<hr>' +
                    '<div style="margin-top: 10px; font-weight: bold;"><span style="color: #444; font-size: 12px; margin-right: 52px;">Preview:</span></div>' +
                    '<div style="margin-top: 5px;"><span style="font-size: 12px; color: #999;">Scan the QR code to preview in your mobile device</span></div>' +
                    '<div id="qrcode" style="margin-top: 5px; font-size: 12px; width: 80px; height: 80px;"></div>' +
                    '<hr>' +
                    '<div style="margin-top: 5px;"><span style="font-size: 12px; color: #999;">View a standalone page with this player</span></div>' +
                    '<div id="shortlink" style="margin-top: 5px; font-size: 12px; word-wrap: break-word;"></div>' +
                    embed_perm +
                    '</div>' +
                    '<div class="player_preview">Preview Player<hr>' +
                    '<div id="previewIframe" style="margin-top: 5px;"></div>' +
                    '</div>' +
                    '</div>';
            $('#smh-modal3 .modal-body').html(content);

            $('.options').mCustomScrollbar({
                theme: "inset-dark",
                scrollButtons: {
                    enable: true
                }
            });

            var embed = $('select.embedType option:selected').val();
            var delivery = $('select.delivery option:selected').val();

            smhPlayers.getShortLink(uiconf_id, embed, delivery);
            if ($.inArray("PLAYLIST_EMBED_CODE", sessPerm) != -1) {
                gen = smhPlayers.generatePlayerEmbed(uiconf_id, width, height, protocol, delivery, embed, seo, name, false, playlist);
                embedCode = gen.getCode();
                $('#embed_code').text(embedCode);
            }

            player_prev_gen = smhPlayers.generatePlayerEmbed(uiconf_id, width, height, 'https', delivery, embed, seo, name, true, playlist);
            player_prev = player_prev_gen.getCode();
            smhPlayers.generateIframe(player_prev);

            $('select.delivery').on('change', function (event) {
                delivery = $('select.delivery option:selected').val();
                player_prev_gen = smhPlayers.generatePlayerEmbed(uiconf_id, width, height, 'https', delivery, embed, seo, name, true, playlist);
                smhPlayers.getShortLink(uiconf_id, embed, delivery);
                if ($.inArray("PLAYLIST_EMBED_CODE", sessPerm) != -1) {
                    gen = smhPlayers.generatePlayerEmbed(uiconf_id, width, height, protocol, delivery, embed, seo, name, false, playlist);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                }
                player_prev = player_prev_gen.getCode();
                smhPlayers.generateIframe(player_prev);
            });

            if ($.inArray("PLAYLIST_EMBED_CODE", sessPerm) != -1) {
                $('select.embedType').on('change', function (event) {
                    embed = $('select.embedType option:selected').val();
                    if (embed == 'dynamic') {
                        $('#embedType-text').html('Dynamic embed is the preferred method to dynamically embed the player into web sites and web applications.');
                    } else if (embed == 'iframe') {
                        $('#embedType-text').html('Iframe embed is good for sites that do not allow 3rd party JavaScript to be embeded on their pages.');
                    }
                    player_prev_gen = smhPlayers.generatePlayerEmbed(uiconf_id, width, height, 'https', delivery, embed, seo, name, true, playlist);
                    smhPlayers.getShortLink(uiconf_id, embed, delivery);

                    gen = smhPlayers.generatePlayerEmbed(uiconf_id, width, height, protocol, delivery, embed, seo, name, false, playlist);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                    player_prev = player_prev_gen.getCode();
                    smhPlayers.generateIframe(player_prev);
                });
                $('.previewModal .options').on('change', '#secure', function (event) {
                    if ($("#secure").is(':checked')) {
                        protocol = 'https';
                        gen = smhPlayers.generatePlayerEmbed(uiconf_id, width, height, protocol, delivery, embed, seo, name, false, playlist);
                        embedCode = gen.getCode();
                        $('#embed_code').text(embedCode);
                    } else {
                        protocol = 'http';
                        gen = smhPlayers.generatePlayerEmbed(uiconf_id, width, height, protocol, delivery, embed, seo, name, false, playlist);
                        embedCode = gen.getCode();
                        $('#embed_code').text(embedCode);
                    }
                });
                $('.previewModal .options').on('change', '#seo', function (event) {
                    if ($("#seo").is(':checked')) {
                        seo = true;
                        gen = smhPlayers.generatePlayerEmbed(uiconf_id, width, height, protocol, delivery, embed, seo, name, false, playlist);
                        embedCode = gen.getCode();
                        $('#embed_code').text(embedCode);
                    } else {
                        seo = false;
                        gen = smhPlayers.generatePlayerEmbed(uiconf_id, width, height, protocol, delivery, embed, seo, name, false, playlist);
                        embedCode = gen.getCode();
                        $('#embed_code').text(embedCode);
                    }
                });
            }

            $('#smh-modal3').on('click', '#select-bttn', function (event) {
                $('#smh-modal3 #embed_code').select();
            });
        };

        client.uiConf.get(cb, uiconf_id);
    },
    //Generate Playlist Embed Code
    generatePlaylistEmbed: function (uiconf_id, entryId, width, height, protocol, streamerType, embed, seo, name, preview) {
        var flashvars = {};
        if (streamerType == 'http') {
            flashvars.disableHLSOnJs = true;
        } else {
            flashvars.LeadHLSOnAndroid = true;
        }

        flashvars['playlistAPI.kpl0Id'] = entryId;

        if (preview) {
            flashvars.ks = sessInfo.ks;
        }

        var cacheSt = smhPlayers.getCacheSt();
        var gen = new kEmbedCodeGenerator({
            host: "mediaplatform.streamingmediahosting.com",
            securedHost: "mediaplatform.streamingmediahosting.com",
            embedType: embed,
            partnerId: sessInfo.pid,
            widgetId: "_" + sessInfo.pid,
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
            entryMeta: {
                name: name,
                thumbnailUrl: protocol + "://imgs.mediaportal.streamingmediahosting.com/p/" + sessInfo.pid + "/sp/" + sessInfo.pid + "00/thumbnail/entry_id/" + entryId + "/width/120/height/90/bgcolor/000000/type/2",
                width: width,
                height: height
            }
        });
        return gen;
    },
    //Generate Cache
    getCacheSt: function () {
        var d = new Date();
        return Math.floor(d.getTime() / 1000) + (15 * 60); // start caching in 15 minutes
    },
    //Generate iframe code
    generateIframe: function (embedCode) {
        $('#previewIframe').empty();
        $('#previewIframe').append(embedCode);
    },
    //Generate embed code
    generateEmbed: function (entryId, width, height, protocol, embed, seo, name) {
        var cacheSt = smhPlayers.getCacheSt();
        if (uiconf_id == '6709439' || uiconf_id == '6709441') {
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
                entryMeta: {
                    name: name,
                    thumbnailUrl: "http://imgs.mediaportal.streamingmediahosting.com/p/10364/sp/1036400/thumbnail/entry_id/" + entryId + "/width/120/height/90/bgcolor/000000/type/2",
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
                entryMeta: {
                    name: name,
                    thumbnailUrl: "http://imgs.mediaportal.streamingmediahosting.com/p/10364/sp/1036400/thumbnail/entry_id/" + entryId + "/width/120/height/90/bgcolor/000000/type/2",
                    width: width,
                    height: height
                }
            });
        }

        return gen;
    },
    //Refresh Player
    refreshPlayer: function () {
        var width = $('#dim_width').val();
        var height = $('#dim_height').val();
        flashvars['width'] = width;
        flashvars['height'] = height;
        $('#previewTarget').css('width', width);
        $('#previewTarget').css('height', height);
        smhPlayers.renderPlayer();
    },
    //Set Auto Preview
    setAutoPreview: function () {
        if ($('#auto_preview').is(':checked')) {
            auto_preview = true;
        } else {
            auto_preview = false;
        }
    },
    //Configures player for editing
    editPlayer: function (id) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }

            smhPlayers.defaultPlayerSettings();
            edit = true;
            PLAYLIST_ENTRIES = new Array();
            var TEMP_MULTI = new Array();
            var multi;

            player_name = results['name'];
            player_id = id;
            var config = JSON.parse(results['config']);
            var plugins = config.plugins;
            var uivars = config.uiVars;

            $.each(uivars, function (key, value) {
                if (value.key === 'autoPlay') {
                    if (value.value) {
                        flashvars['autoPlay'] = true;
                    } else {
                        flashvars['autoPlay'] = false;
                    }
                }
                if (value.key === 'autoMute') {
                    if (value.value) {
                        flashvars['autoMute'] = true;
                    } else {
                        flashvars['autoMute'] = false;
                    }
                }
                if (value.key === 'enableTooltips') {
                    if (value.value) {
                        flashvars['enableTooltips'] = true;
                    } else {
                        flashvars['enableTooltips'] = false;
                    }
                }
                if (value.key === 'adsOnReplay') {
                    if (value.value) {
                        flashvars['adsOnReplay'] = true;
                    } else {
                        flashvars['adsOnReplay'] = false;
                    }
                }
                if (value.key === 'mediaProxy.preferedFlavorBR') {
                    flashvars['mediaProxy.preferedFlavorBR'] = value.value;
                }
            });

            flashvars['width'] = results['width'];
            flashvars['height'] = results['height'];

            if (typeof plugins.titleLabel !== 'undefined') {
                flashvars['titleLabel.plugin'] = true;
                flashvars['titleLabel.align'] = plugins.titleLabel.align;
                flashvars['titleLabel.text'] = plugins.titleLabel.text;
                flashvars['titleLabel.truncateLongTitles'] = plugins.titleLabel.truncateLongTitles;
            } else {
                flashvars['titleLabel.plugin'] = false;
            }

            if (typeof plugins.watermark !== 'undefined') {
                flashvars['watermark.plugin'] = true;
                flashvars['watermark.watermarkPosition'] = plugins.watermark.cssClass;
                flashvars['watermark.watermarkPath'] = plugins.watermark.img;
                flashvars['watermark.watermarkClickPath'] = plugins.watermark.href;
                flashvars['watermark.padding'] = plugins.watermark.padding;
            } else {
                flashvars['watermark.plugin'] = false;
            }

            if (typeof plugins.logo !== 'undefined') {
                if (plugins.logo.plugin) {
                    flashvars['logo.plugin'] = true;
                    flashvars['logo.img'] = plugins.logo.img;
                    flashvars['logo.href'] = plugins.logo.href;
                    flashvars['logo.title'] = plugins.logo.title;
                } else {
                    flashvars['logo.plugin'] = false;
                }
            } else {
                flashvars['logo.plugin'] = false;
            }

            if (typeof plugins.currentTimeLabel !== 'undefined') {
                if (plugins.currentTimeLabel.plugin) {
                    flashvars['currentTimeLabel.plugin'] = true;
                } else {
                    flashvars['currentTimeLabel.plugin'] = false;
                }
            } else {
                flashvars['currentTimeLabel.plugin'] = false;
            }

            if (typeof plugins.durationLabel !== 'undefined') {
                if (plugins.durationLabel.plugin) {
                    flashvars['durationLabel.plugin'] = true;
                } else {
                    flashvars['durationLabel.plugin'] = false;
                }
            } else {
                flashvars['durationLabel.plugin'] = false;
            }

            if (typeof plugins.sourceSelector !== 'undefined') {
                flashvars['sourceSelector.plugin'] = true;
                flashvars['sourceSelector.switchOnResize'] = plugins.sourceSelector.switchOnResize;
                flashvars['sourceSelector.simpleFormat'] = plugins.sourceSelector.simpleFormat;
            } else {
                flashvars['sourceSelector.plugin'] = false;
            }

            if (typeof plugins.fullScreenBtn !== 'undefined') {
                if (plugins.fullScreenBtn.plugin) {
                    flashvars['fullScreenBtn.plugin'] = true;
                } else {
                    flashvars['fullScreenBtn.plugin'] = false;
                }
            } else {
                flashvars['fullScreenBtn.plugin'] = false;
            }

            if (typeof plugins.largePlayBtn !== 'undefined') {
                if (plugins.largePlayBtn.plugin) {
                    flashvars['largePlayBtn.plugin'] = true;
                } else {
                    flashvars['largePlayBtn.plugin'] = false;
                }
            } else {
                flashvars['largePlayBtn.plugin'] = false;
            }

            if (typeof plugins.playPauseBtn !== 'undefined') {
                if (plugins.playPauseBtn.plugin) {
                    flashvars['playPauseBtn.plugin'] = true;
                } else {
                    flashvars['playPauseBtn.plugin'] = false;
                }
            } else {
                flashvars['playPauseBtn.plugin'] = false;
            }

            if (typeof plugins.volumeControl !== 'undefined') {
                if (plugins.volumeControl.plugin) {
                    flashvars['volumeControl.plugin'] = true;
                    flashvars['volumeControl.showSlider'] = plugins.volumeControl.showSlider;
                    flashvars['volumeControl.pinVolumeBar'] = plugins.volumeControl.pinVolumeBar;
                } else {
                    flashvars['volumeControl.plugin'] = false;
                }
            } else {
                flashvars['volumeControl.plugin'] = false;
            }

            if (typeof plugins.controlBarContainer !== 'undefined') {
                if (plugins.controlBarContainer.plugin) {
                    flashvars['controlBarContainer.plugin'] = true;
                    if (plugins.controlBarContainer.hover) {
                        flashvars['controlBarContainer.hover'] = true;
                    } else {
                        flashvars['controlBarContainer.hover'] = false;
                    }
                } else {
                    flashvars['controlBarContainer.plugin'] = false;
                }
            } else {
                flashvars['controlBarContainer.plugin'] = false;
            }

            if (typeof plugins.scrubber !== 'undefined') {
                if (plugins.scrubber.plugin) {
                    flashvars['scrubber.plugin'] = true;
                } else {
                    flashvars['scrubber.plugin'] = false;
                }
            } else {
                flashvars['scrubber.plugin'] = false;
            }

            if (typeof plugins.chromecast !== 'undefined') {
                flashvars['chromecast.plugin'] = true;
                flashvars['chromecast.parent'] = plugins.chromecast.parent;
                flashvars['chromecast.align'] = plugins.chromecast.align;
                if (typeof plugins.chromecast.logoUrl !== 'undefined') {
                    flashvars['chromecast.logoUrl'] = plugins.chromecast.logoUrl;
                } else {
                    flashvars['chromecast.logoUrl'] = '';
                }
            } else {
                flashvars['chromecast.plugin'] = false;
            }

            if (typeof plugins.share !== 'undefined') {
                flashvars['share.plugin'] = true;
                flashvars['share.parent'] = plugins.share.parent;
                flashvars['share.align'] = plugins.share.align;
                flashvars['share.socialShareURL'] = plugins.share.socialShareURL;
                flashvars['share.socialNetworks'] = plugins.share.socialNetworks;
                flashvars['share.socialShareEnabled'] = plugins.share.socialShareEnabled;
                flashvars['share.embedEnabled'] = plugins.share.embedEnabled;
                flashvars['share.allowTimeOffset'] = plugins.share.allowTimeOffset;
                flashvars['share.allowSecuredEmbed'] = plugins.share.allowSecuredEmbed;
                flashvars['share.emailEnabled'] = plugins.share.emailEnabled;
                flashvars['share.shareUiconfID'] = plugins.share.shareUiconfID;
                flashvars['share.embedOptions.width'] = plugins.share.embedOptions.width;
                flashvars['share.embedOptions.height'] = plugins.share.embedOptions.height;
            } else {
                flashvars['share.plugin'] = false;
            }

            if (typeof plugins.download !== 'undefined') {
                flashvars['download.plugin'] = true;
                flashvars['download.parent'] = plugins.download.parent;
                flashvars['download.align'] = plugins.download.align;
                flashvars['download.flavorID'] = plugins.download.flavorID;
                flashvars['download.preferredBitrate'] = plugins.download.preferredBitrate;
            } else {
                flashvars['download.plugin'] = false;
            }

            if (typeof plugins.captureThumbnail !== 'undefined') {
                flashvars['captureThumbnail.plugin'] = true;
                flashvars['captureThumbnail.tooltip'] = plugins.captureThumbnail.tooltip;
            } else {
                flashvars['captureThumbnail.plugin'] = false;
            }

            if (typeof plugins.playbackRateSelector !== 'undefined') {
                flashvars['playbackRateSelector.plugin'] = true;
                flashvars['playbackRateSelector.defaultSpeed'] = plugins.playbackRateSelector.defaultSpeed;
            } else {
                flashvars['playbackRateSelector.plugin'] = false;
            }

            if (typeof plugins.resumePlayback !== 'undefined') {
                flashvars['resumePlayback.plugin'] = true;
            } else {
                flashvars['resumePlayback.plugin'] = false;
            }

            if (typeof plugins.closedCaptions !== 'undefined') {
                flashvars['closedCaptions.plugin'] = true;
                flashvars['closedCaptions.layout'] = plugins.closedCaptions.layout;
                flashvars['closedCaptions.displayCaptions'] = plugins.closedCaptions.displayCaptions;
                flashvars['closedCaptions.fontFamily'] = plugins.closedCaptions.fontFamily;
                flashvars['closedCaptions.fontsize'] = plugins.closedCaptions.fontsize;
                flashvars['closedCaptions.fontColor'] = plugins.closedCaptions.fontColor;
                flashvars['closedCaptions.bg'] = plugins.closedCaptions.bg;
                flashvars['closedCaptions.useGlow'] = plugins.closedCaptions.useGlow;
                flashvars['closedCaptions.glowBlur'] = plugins.closedCaptions.glowBlur;
                flashvars['closedCaptions.glowColor'] = plugins.closedCaptions.glowColor;
                flashvars['closedCaptions.hideWhenEmpty'] = plugins.closedCaptions.hideWhenEmpty;
                flashvars['closedCaptions.showEmbeddedCaptions'] = plugins.closedCaptions.showEmbeddedCaptions;
            } else {
                flashvars['closedCaptions.plugin'] = false;
            }

            if (typeof plugins.related !== 'undefined') {
                flashvars['related.plugin'] = true;
                flashvars['related.parent'] = plugins.related.parent;
                flashvars['related.align'] = plugins.related.align;
                flashvars['related.displayOnPlaybackDone'] = plugins.related.displayOnPlaybackDone;
                flashvars['related.autoContinueEnabled'] = plugins.related.autoContinueEnabled;
                flashvars['related.autoContinueTime'] = plugins.related.autoContinueTime;
                flashvars['related.itemsLimit'] = plugins.related.itemsLimit;
                if (typeof plugins.related.playlistId !== 'undefined') {
                    flashvars['related.playlistId'] = plugins.related.playlistId;
                }
                if (typeof plugins.related.entryList !== 'undefined') {
                    flashvars['related.entryList'] = plugins.related.entryList;
                }
            } else {
                flashvars['related.plugin'] = false;
            }

            if (typeof plugins.infoScreen !== 'undefined') {
                flashvars['infoScreen.plugin'] = true;
                flashvars['infoScreen.parent'] = plugins.infoScreen.parent;
                flashvars['infoScreen.align'] = plugins.infoScreen.align;
            } else {
                flashvars['infoScreen.plugin'] = false;
            }

            if (typeof plugins.loadingSpinner !== 'undefined') {
                if (plugins.loadingSpinner.plugin) {
                    flashvars['loadingSpinner.plugin'] = true;
                    flashvars['loadingSpinner.imageUrl'] = plugins.loadingSpinner.imageUrl;
                    flashvars['loadingSpinner.lineLength'] = plugins.loadingSpinner.lineLength;
                    flashvars['loadingSpinner.width'] = plugins.loadingSpinner.width;
                    flashvars['loadingSpinner.radius'] = plugins.loadingSpinner.radius;
                    flashvars['loadingSpinner.corners'] = plugins.loadingSpinner.corners;
                    flashvars['loadingSpinner.rotate'] = plugins.loadingSpinner.rotate;
                    flashvars['loadingSpinner.direction'] = plugins.loadingSpinner.direction;
                    flashvars['loadingSpinner.color'] = plugins.loadingSpinner.color;
                    flashvars['loadingSpinner.speed'] = plugins.loadingSpinner.speed;
                    flashvars['loadingSpinner.trail'] = plugins.loadingSpinner.trail;
                    flashvars['loadingSpinner.shadow'] = plugins.loadingSpinner.shadow;
                    flashvars['loadingSpinner.top'] = plugins.loadingSpinner.top;
                    flashvars['loadingSpinner.left'] = plugins.loadingSpinner.left;
                } else {
                    flashvars['loadingSpinner.plugin'] = false;
                }
            } else {
                flashvars['loadingSpinner.plugin'] = false;
            }

            if (typeof plugins.bumper !== 'undefined') {
                flashvars['bumper.plugin'] = true;
                flashvars['bumper.bumperEntryID'] = plugins.bumper.bumperEntryID;
                flashvars['bumper.clickurl'] = plugins.bumper.clickurl;
                flashvars['bumper.lockUI'] = plugins.bumper.lockUI;
                flashvars['bumper.preSequence'] = plugins.bumper.preSequence;
                flashvars['bumper.postSequence'] = plugins.bumper.postSequence;
            } else {
                flashvars['bumper.plugin'] = false;
            }

            if (typeof plugins.vast !== 'undefined') {
                flashvars['vast.plugin'] = true;
                flashvars['vast.pauseAdOnClick'] = plugins.vast.pauseAdOnClick;
                flashvars['vast.enableCORS'] = plugins.vast.enableCORS;
                flashvars['vast.loadAdsOnPlay'] = plugins.vast.loadAdsOnPlay;
                flashvars['vast.numPreroll'] = plugins.vast.numPreroll;
                flashvars['vast.prerollInterval'] = plugins.vast.prerollInterval;
                flashvars['vast.prerollStartWith'] = plugins.vast.prerollStartWith;
                flashvars['vast.prerollUrl'] = plugins.vast.prerollUrl;
                flashvars['vast.overlayStartAt'] = plugins.vast.overlayStartAt;
                flashvars['vast.overlayInterval'] = plugins.vast.overlayInterval;
                flashvars['vast.overlayUrl'] = plugins.vast.overlayUrl;
                flashvars['vast.numPostroll'] = plugins.vast.numPostroll;
                flashvars['vast.postrollInterval'] = plugins.vast.postrollInterval;
                flashvars['vast.postrollStartWith'] = plugins.vast.postrollStartWith;
                flashvars['vast.postrollUrl'] = plugins.vast.postrollUrl;
                flashvars['vast.preSequence'] = plugins.vast.preSequence;
                flashvars['vast.postSequence'] = plugins.vast.postSequence;
                flashvars['vast.trackCuePoints'] = plugins.vast.trackCuePoints;
                flashvars['vast.timeout'] = plugins.vast.timeout;
                flashvars['vast.htmlCompanions'] = plugins.vast.htmlCompanions;
            } else {
                flashvars['vast.plugin'] = false;
            }

            if (typeof plugins.skipBtn !== 'undefined') {
                flashvars['skipBtn.plugin'] = true;
                flashvars['skipBtn.label'] = plugins.skipBtn.label;
                flashvars['skipBtn.skipOffset'] = plugins.skipBtn.skipOffset;
            } else {
                flashvars['skipBtn.plugin'] = false;
            }

            if (typeof plugins.skipNotice !== 'undefined') {
                flashvars['skipNotice.plugin'] = true;
                flashvars['skipNotice.text'] = plugins.skipNotice.text;
            } else {
                flashvars['skipNotice.plugin'] = false;
            }

            if (typeof plugins.noticeMessage !== 'undefined') {
                flashvars['noticeMessage.plugin'] = true;
                flashvars['noticeMessage.text'] = plugins.noticeMessage.text;
            } else {
                flashvars['noticeMessage.plugin'] = false;
            }

            if (typeof plugins.theme !== 'undefined') {
                flashvars['theme.plugin'] = true;
                flashvars['theme.applyToLargePlayButton'] = plugins.theme.applyToLargePlayButton;
                flashvars['theme.buttonsSize'] = plugins.theme.buttonsSize;
                flashvars['theme.buttonsColor'] = plugins.theme.buttonsColor;
                flashvars['theme.buttonsIconColor'] = plugins.theme.buttonsIconColor;
                flashvars['theme.sliderColor'] = plugins.theme.sliderColor;
                flashvars['theme.scrubberColor'] = plugins.theme.scrubberColor;
                flashvars['theme.controlsBkgColor'] = plugins.theme.controlsBkgColor;
                flashvars['theme.watchedSliderColor'] = plugins.theme.watchedSliderColor;
                flashvars['theme.bufferedSliderColor'] = plugins.theme.bufferedSliderColor;
                flashvars['theme.buttonsIconColorDropShadow'] = plugins.theme.buttonsIconColorDropShadow;
            } else {
                flashvars['theme.plugin'] = false;
            }

            if (typeof plugins.playlistAPI !== 'undefined') {
                flashvars['playlistAPI.plugin'] = true;
                flashvars['playlistAPI.containerPosition'] = plugins.playlistAPI.containerPosition;
                flashvars['playlistAPI.layout'] = plugins.playlistAPI.layout;
                flashvars['playlistAPI.includeInLayout'] = plugins.playlistAPI.includeInLayout;
                flashvars['playlistAPI.showControls'] = plugins.playlistAPI.showControls;
                flashvars['playlistAPI.includeHeader'] = plugins.playlistAPI.includeHeader;
                flashvars['playlistAPI.autoContinue'] = plugins.playlistAPI.autoContinue;
                flashvars['playlistAPI.autoPlay'] = plugins.playlistAPI.autoPlay;
                flashvars['playlistAPI.loop'] = plugins.playlistAPI.loop;
                flashvars['playlistAPI.hideClipPoster'] = plugins.playlistAPI.hideClipPoster;
                if (plugins.playlistAPI.MinClips && plugins.playlistAPI.MinClips !== '') {
                    flashvars['playlistAPI.MinClips'] = plugins.playlistAPI.MinClips;
                }
                if (plugins.playlistAPI.MaxClips && plugins.playlistAPI.MaxClips !== '') {
                    flashvars['playlistAPI.MaxClips'] = plugins.playlistAPI.MaxClips;
                }
                if (plugins.playlistAPI.initItemEntryId && plugins.playlistAPI.initItemEntryId !== '') {
                    flashvars['playlistAPI.initItemEntryId'] = plugins.playlistAPI.initItemEntryId;
                }
                if (typeof plugins.playlistAPI.kpl0Id !== 'undefined') {

                }
            } else {
                flashvars['playlistAPI.plugin'] = false;
            }

            if (typeof plugins.smhVR !== 'undefined') {
                flashvars['smhVR.plugin'] = true;
                flashvars['smhVRBtn.plugin'] = true;
                flashvars['smhVR.iframeHTML5Js1'] = plugins.smhVR.iframeHTML5Js1;
                if (typeof plugins.smhVR.fallbackEntryID !== 'undefined') {
                    flashvars['smhVR.fallbackEntryID'] = plugins.smhVR.fallbackEntryID;
                }
                if (typeof plugins.smhVR.showCompMessage !== 'undefined') {
                    flashvars['smhVR.showCompMessage'] = plugins.smhVR.showCompMessage;
                }
            } else {
                flashvars['smhVR.plugin'] = false;
                flashvars['smhVRBtn.plugin'] = false;
            }

            var xml = smhPlayers.parseXML(results['confFile']);

            if (typeof $(xml).find("layout").attr('isPlaylist') !== 'undefined') {
                uiconf_id = $(xml).find("layout").attr('isPlaylist') == "true" ? 6709439 : 6709441;
                if (uiconf_id == 6709439) {
                    flashvars['playlistAPI.kpl0Id'] = '0_aaizhxk0';
                    flashvars['playlistAPI.kpl0Name'] = 'playlist';
                    flashvars['playlistAPI.kpl1Id'] = null;
                    flashvars['playlistAPI.kpl1Name'] = null;
                }
                if (uiconf_id == 6709441) {
                    $.each(plugins.playlistAPI, function (key, value) {
                        if (key.match(/kpl/g)) {
                            if (key.match(/Id/g)) {
                                TEMP_MULTI.push(value);
                            }
                        }
                    });
                    multi = smhPlayers.getAvailablePlaylist(TEMP_MULTI);
                    $.each(multi, function (key, value) {
                        PLAYLIST_ENTRIES.push(value[0]);
                    });
                    flashvars['playlistAPI.kpl0Id'] = '0_aaizhxk0';
                    flashvars['playlistAPI.kpl0Name'] = 'playlist1';
                    flashvars['playlistAPI.kpl1Id'] = '0_iv57gfw0';
                    flashvars['playlistAPI.kpl1Name'] = 'playlist2';
                }
                smhPlayers.addPlayer(uiconf_id);
            } else {
                uiconf_id = 6709438;
                player_entryid = '0_vznwb0q7';
                smhPlayers.addPlayer(uiconf_id);
            }
        };
        client.uiConf.get(cb, id);
    },
    //Create Basic Player Modal
    addPlayer: function (id) {
        uiconf_id = id;
        auto_preview = false;
        smhMain.resetModal();
        social_networks = new Array();
        var player_button = '<button onclick="smhPlayers.updatePlayer()" id="update-player" class="btn btn-primary update-player" type="button">Update Player</button>'
        if (!edit) {
            player_name = '';
            smhPlayers.defaultPlayerSettings();
            player_button = '<button onclick="smhPlayers.createPlayer()" id="create-player" class="btn btn-primary" type="button">Create Player</button>';
        }
        var header, content;
        $('#smh-modal3 .modal-body').css('padding', '0');
        $('#smh-modal3').modal({
            backdrop: 'static'
        });
        $('#smh-modal3').addClass('previewModal');

        var playlist_display = '';
        var mplaylist_display = '';
        if (uiconf_id == 6709438) {
            playlist_display = 'style="display: none;"';
            mplaylist_display = 'style="display: none;"';
        }
        if (uiconf_id == 6709439) {
            mplaylist_display = 'style="display: none;"';
        }

        if (edit) {
            header = '<button type="button" class="close smh-close player_close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Player - ' + player_name + '</h4>';
        } else {
            header = '<button type="button" class="close smh-close player-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Create Player</h4>';
        }

        $('#smh-modal3 .modal-header').html(header);

        content = '<div class="content">' +
                '<div class="player-tab tabbable">' +
                '<ul class="nav nav-pills nav-stacked player-menu">' +
                '<li class="active">' +
                '<a data-toggle="tab" href="#basic" id="basic-tab" class="enabled basic-tab"><i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Basic Display" class="fa fa-gears"></i></a>' +
                '</li>' +
                '<li>' +
                '<a data-toggle="tab" href="#display" id="display-tab" class="display-tab"><i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Look and Feel" class="fa fa-eye"></i></a>' +
                '</li>' +
                '<li ' + playlist_display + '>' +
                '<a data-toggle="tab" href="#playlist" id="display-tab" class="playlist-tab"><i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Playlist Items" class="fa fa-list"></i></a>' +
                '</li>' +
                '<li>' +
                '<a data-toggle="tab" href="#ad" id="display-tab" class="ad-tab"><i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Advertising" class="fa fa-bullhorn"></i></a>' +
                '</li>' +
                '<li>' +
                '<a data-toggle="tab" href="#custom" id="display-tab" class="custom-tab"><i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Custom Styles" class="fa fa-paint-brush"></i></a>' +
                '</li>' +
                '<li ' + mplaylist_display + '>' +
                '<a data-toggle="tab" href="#content" id="display-tab" class="content-tab"><i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Playlist Content" class="fa fa-tasks"></i></a>' +
                '</li>' +
                '<li>' +
                '<a data-toggle="tab" href="#vr" id="display-tab" class="custom-tab"><i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Virtual Reality" class="icon-vr"></i></a>' +
                '</li>' +
                '</ul>' +
                '<div class="tab-content">' +
                '<div id="basic" class="tab-pane active">' +
                '<div class="options">' +
                '<h3>Basic Display</h3>' +
                '<p>Basic settings let you set player name and aspect ratio.</p>' +
                '<span class="pluginLabel" style="margin-bottom: 15px; display: inline-block;">Player\'s Name <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Please enter your player\'s name" class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span>' +
                '<input type="text" id="player_name" name="player_name" placeholder="Enter a name" class="form-control" value="' + player_name + '">' +
                '<hr>' +
                '<span class="pluginLabel" style="margin-bottom: 15px; display: block;">Player Dimensions <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Set Player Dimensions" class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span>' +
                '<span class="pluginLabel" style="margin-bottom: 15px; display: inline-block;">Aspect Ratio:</span>' +
                '<select id="aspect_ratio" style="margin-bottom: 15px; display: inline-block; margin-left: 8px; width: 135px;" class="form-control"><option value="dim_4_3">4/3</option><option value="dim_16_9">16/9</option><option value="dim_custom" selected>custom</option></select>' +
                '<div class="clear"></div>' +
                '<span class="pluginLabel">Width</span><input type="text" value="' + flashvars['width'] + '" id="dim_width" name="dim_width" style="width: 70px; margin-left: 10px; display: inline;" class="form-control"><span> px</span>' +
                '<div class="right-ar">' +
                '<span class="pluginLabel">Height</span><input type="text" value="' + flashvars['height'] + '" id="dim_height" name="dim_height" style="width: 70px; margin-left: 5px; display: inline;" class="form-control"><span> px</span>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<hr>' +
                '<div class="checkbox"><label class="pluginLabel"><input type="checkbox" id="auto_play" style="margin-right: 5px">Automatically play video on page load</label></div>' +
                '<hr>' +
                '<div class="checkbox"><label class="pluginLabel"><input type="checkbox" id="start_muted" style="margin-right: 5px">Start player muted</label></div>' +
                '<hr>' +
                '<div class="checkbox"><label class="pluginLabel"><input type="checkbox" id="hovering_controls" style="margin-right: 5px">Hovering controls</label></div>' +
                '</div>' +
                '</div>' +
                '<div id="display" class="tab-pane">' +
                '<div class="options">' +
                '<h3>Look and Feel</h3>' +
                '<p style="margin-bottom: 15px;">Adjust the visual appearance of the player.</p>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel" style="margin-bottom: 15px;"><input name="show_tooltips" id="show-tooltips" style="margin-right: 5px" type="checkbox" checked>Show tooltips</label>' +
                '</div>' +
                '<div class="panel-group" id="accordion">' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseOne">' +
                'Title Label' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="title_text"></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseOne" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'Enables a title hover overlay over the video content.<br><br>' +
                '<span class="pluginLabel">Align <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Alignment for title text" class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<select id="title-location" class="form-control" disabled><option value="left" selected="selected">Left</option><option value="right">Right</option></select><br />' +
                '</div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel"><input name="title_truncate" id="title-truncate" style="margin-right: 5px" type="checkbox" disabled>Truncate long titles <i data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Truncate long titles to fit in one line. Truncated titles get a tooltip and 3 dots at the end of the truncated text." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseTwo">' +
                'Watermark' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="watermark"></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseTwo" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'Brand your player with your own logo displayed as a watermark on the video. Upload an image to a location on the web and provide the link below.<br /><br />' +
                '<span class="pluginLabel">Image URL <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="The URL path to the watermark image." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="watermark_url" class="form-control" name="watermark_url" value="' + flashvars['watermark.watermarkPath'] + '" placeholder="Enter a URL" size="33" disabled>' +
                '</div>' +
                '<span class="pluginLabel">Click URL <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="The URL for the watermark click." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="watermark_landing" class="form-control" name="watermark_landing" value="' + flashvars['watermark.watermarkClickPath'] + '" size="33" placeholder="Enter a URL" disabled>' +
                '</div>' +
                '<span class="pluginLabel">Position <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Position of the watermark." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<select id="watermark-location" class="form-control" disabled><option value="bottomLeft" selected="selected">Bottom Left</option><option value="bottomRight">Bottom Right</option><option value="topLeft">Top Left</option><option value="topRight">Top Right</option></select><br />' +
                '</div>' +
                '<span class="pluginLabel">Padding <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Padding CSS property from the edge of the play screen; top right bottom left, or single value." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;" class="pull-left">' +
                '<input type="text" id="water_padding" class="form-control" style="width:70px !important;" name="water_padding" value="' + flashvars['watermark.padding'] + '" disabled>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseThree">' +
                'Logo Icon' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="logo-icon"></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseThree" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'Brand your player with your own logo displayed as a icon on the control bar. Upload an image to a location on the web and provide the link below. Your icon\'s dimensions must have a maximum size of 30x30 pixels.<br /><br />' +
                '<span class="pluginLabel">Image URL <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="URL for custom control bar logo image." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="icon_url" name="icon_url" placeholder="Enter a URL" value="' + flashvars['logo.img'] + '" class="form-control" size="33" disabled>' +
                '</div>' +
                '<span class="pluginLabel">Click URL <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="URL for the control bar logo to click through to." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="icon_landing" name="icon_landing" placeholder="Enter a URL" value="' + flashvars['logo.href'] + '" class="form-control" size="33" disabled>' +
                '</div>' +
                '<span class="pluginLabel">Title <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Title tooltip for the logo" class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="icon_title" class="form-control" size="33" placeholder="Enter a title" name="icon_title" value="' + flashvars['logo.title'] + '" disabled>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseFour">' +
                'Left Play Counter' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="left-play-counter" checked></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseFour" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'A timer that shows the video progress in minutes and seconds. This timer is located at the left side of the scrubber.<br /><br />' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseFive">' +
                'Right Play Counter' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="right-play-counter" checked></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseFive" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'A timer that shows the video progress in minutes and seconds. Usually shows the total duration of the media.<br /><br />' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseSix">' +
                'Flavor Selector' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="flavor_selector"></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseSix" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'Enables users to select the video quality.<br /><br />' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel"><input name="switch_resize" id="switch-resize" style="margin-right: 5px" type="checkbox" disabled>Switch on resize <i data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="When the player changes size or goes into fullscreen, the source will update per playback resolution. By default, the embed size is only taken into consideration at startup." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel"><input name="simple_format" id="simple-format" style="margin-right: 5px" type="checkbox" disabled checked>Simple format <i data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Use simple format to restrict to two sources only per named size, and not list content type." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '<span class="pluginLabel">Preferred flavor bitrate <i data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Preferred flavor bitrate" class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="pre-flavor" class="form-control" placeholder="Enter a bitrate" name="pre_flavor" value="' + flashvars['mediaProxy.preferedFlavorBR'] + '" size="33" disabled>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseSeven">' +
                'Full Screen Button' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="fullscreen" checked></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseSeven" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'This button allows users to switch to full screen mode, and back to regular mode.<br /><br />' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseEight">' +
                'On-video Play Button' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="on_video_play" checked></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseEight" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'Displays play button on the video area. Usually shown when the video is loading or paused.<br /><br />' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseNine">' +
                'Play-Pause Button' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="play_pause" checked></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseNine" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'Displays Play or Pause buttons according to the state of the video.<br /><br />' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseTen">' +
                'Volume Controller' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="volume" checked></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseTen" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'Display mute/unmute button with a vertical volume control bar.<br /><br />' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel"><input name="vol_show_slider" id="vol-show-slider" style="margin-right: 5px" type="checkbox" checked>Show slider <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Show the volume slider." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel"><input name="vol_pin_bar" id="vol-pin-bar" style="margin-right: 5px" type="checkbox">Pin volume bar <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="If the volume slider bar should always be shown." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseEleven">' +
                'Controls Bar' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="control-bar" checked></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseEleven" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'The controls bar, located towards the bottom of the player, contains the different player functions and features.<br /><br />' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseTwelve">' +
                'Scrubber' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="scrubber" checked></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseTwelve" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'The scrubber enables users to navigate through the video by dragging the handle. The scrubber also shows the buffering and playing progress.<br /><br />' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseThirteen">' +
                'Chromecast' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="chromecast"></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseThirteen" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'Enable casting the video stream to Google Chromecast.<br /><br />' +
                '<span class="pluginLabel">Location <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Parent container for component." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<select id="chromecast-location" class="form-control" disabled><option value="topBarContainer">Top bar container</option><option value="controlsContainer" selected>Controls container</option></select><br />' +
                '</div>' +
                '<span class="pluginLabel">Align <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Alignment for component, can be left or right." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<select id="chromecast-align" class="form-control" disabled><option value="left">Left</option><option value="right" selected>Right</option></select><br />' +
                '</div>' +
                '<span class="pluginLabel">Logo URL <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="URL for custom receiver logo" class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="chromecast-url" class="form-control" placeholder="Enter a url" name="chromecast_url" value="' + flashvars['chromecast.logoUrl'] + '" size="33" disabled>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseFourteen">' +
                'Share Button' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="share"></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseFourteen" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'Share this movie. Enables posting to social networks, social bookmarking, sending email and grabbing of embed code.<br /><br />' +
                '<span class="pluginLabel">Location <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Parent container for component." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<select id="share-location" class="form-control" disabled><option value="topBarContainer">Top bar container</option><option value="controlsContainer" selected>Controls container</option></select><br />' +
                '</div>' +
                '<span class="pluginLabel">Align <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Alignment for component, can be left or right." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<select id="share-align" class="form-control" disabled><option value="left">Left</option><option value="right" selected>Right</option></select><br />' +
                '</div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel"><input name="share_social_enabled" id="share-social-enabled" style="margin-right: 5px" type="checkbox" checked disabled>Display share link <i data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Display Share link." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel"><input name="share_embed_enabled" id="share-embed-enabled" style="margin-right: 5px" type="checkbox" checked disabled>Embed enabled <i data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Display Embed code." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel"><input name="share_time_offset" id="share-time-offset" style="margin-right: 5px" type="checkbox" checked disabled>Allow time offset <i data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Allow setting a time offset for the entry." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel"><input name="share_allow_secured_embed" id="share-allow-secured-embed" style="margin-right: 5px" type="checkbox" checked disabled>Allow secured embed <i data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Display secured embed option." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '<span class="pluginLabel" style="margin-top: 5px; margin-bottom: 5px; display: block;">Social networks</span>' +
                '<div style="margin-left: 20px; margin-bottom: 5px; margin-top: 5px;">' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="share_networks_fb" id="share-networks-fb" style="margin-right: 5px" checked disabled>Facebook</label></div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="share_networks_twtr" id="share-networks-twtr" style="margin-right: 5px" checked disabled>Twitter</label></div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="share_networks_gp" id="share-networks-gp" style="margin-right: 5px" checked disabled>Google+</label></div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="share_networks_email" id="share-networks-email" style="margin-right: 5px" checked disabled>Email</label></div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;"><label class="pluginLabel"><input type="checkbox" name="share_networks_lnkdin" id="share-networks-lnkdin" style="margin-right: 5px" checked disabled>Linkedin</label></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseFifteen">' +
                'Download Button' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="download"></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseFifteen" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'Enables users to add a download button to the player controls. The download button will enable users to download the media to a local file.<br /><br />' +
                '<span class="pluginLabel">Location <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Parent container for component." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<select id="dwnld-location" class="form-control" disabled><option value="topBarContainer">Top bar container</option><option value="controlsContainer" selected>Controls container</option></select><br />' +
                '</div>' +
                '<span class="pluginLabel">Align <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Alignment for component, can be left or right." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<select id="dwnld-align" class="form-control" disabled><option value="left">Left</option><option value="right" selected>Right</option></select><br />' +
                '</div>' +
                '<span class="pluginLabel">Flavor ID <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Flavor ID for the downloaded movie source. When specified, overrides any preferred bitrate settings" class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="dwnld-flavorid" class="form-control" placeholder="Enter a Flavor ID" name="dwnld_flavorid" value="' + flashvars['download.flavorID'] + '" size="33" disabled>' +
                '</div>' +
                '<span class="pluginLabel">Preferred bitrate <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Preferred bitrate for the downloaded movie source (when Flavor ID is not specified). Keep empty for the highest bitrate. Enter \'0\' for the original movie source file" class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="dwnld-pre-flavor" class="form-control" placeholder="Enter a bitrate" name="dwnld_pre_flavor" value="' + flashvars['download.preferredBitrate'] + '" size="33" disabled>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseSixteen">' +
                'Capture Thumbnail' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="thumbnail"></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseSixteen" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'Allows users to change the thumbnail of the video. Users can play the video and click Capture at their preferred frame.<br /><br />' +
                '<span class="pluginLabel">Title <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Title tooltip" class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="thumbnail_tool" name="thumbnail_tool" placeholder="Enter a tooltip" class="form-control" value="' + flashvars['captureThumbnail.tooltip'] + '" size="33" disabled>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseSeventeen">' +
                'Playback rate selector' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="playback-rate"></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseSeventeen" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'Enables users to select the video playback rate. Note http streamerType must be used to support playbackRateSelector in capable HTML5 browsers.<br /><br />' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseResumePlayback">' +
                'Resume Playback' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="resume-playback"></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseResumePlayback" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'Remembers position in video, to resume playback later.<br /><br />' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseEighteen">' +
                'Captions' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="captions"></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseEighteen" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'Reach multi-lingual audience and comply with FCC regulations with multi-lingual closed captions support.<br /><br />' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel"><input name="cap_display" id="cap-display" style="margin-right: 5px" type="checkbox" checked disabled>Display captions <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Should caption be displayed by default." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '<span class="pluginLabel">Font Color <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Color of the caption text." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br>' +
                '<div class="pull-left" style="margin-top:5px; margin-bottom:15px;">' +
                '<div class="input-group cap_textcolor"><input type="text" id="cap_textcolor" name="cap_textcolor" value="' + flashvars['closedCaptions.fontColor'] + '" class="form-control" style="width: 85px;" disabled><span class="input-group-addon"><i></i></span></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel"><input name="cap_use_glow" id="cap-use-glow" style="margin-right: 5px" type="checkbox" checked disabled>Use glow <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="If the timed text should have a glow / shadow." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<span class="pluginLabel">Glow Color <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="The color of the glow." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br>' +
                '<div class="pull-left" style="margin-top:5px; margin-bottom:15px;">' +
                '<div class="input-group cap_glowcolor"><input type="text" id="cap_glowcolor" name="cap_glowcolor" value="' + flashvars['closedCaptions.glowColor'] + '" class="form-control" style="width: 85px;" disabled><span class="input-group-addon"><i></i></span></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<span class="pluginLabel">Glow Blur <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="The glow amount in pixels." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span></span><br>' +
                '<div class="pull-left" style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" value="' + flashvars['closedCaptions.glowBlur'] + '" style="width: 70px ! important; display: block;" class="form-control" name="cap_glowblur" id="cap_glowblur" disabled>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<span class="pluginLabel">Background Color <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Background color for timed text." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br>' +
                '<div class="pull-left" style="margin-top:5px; margin-bottom:15px;">' +
                '<div class="input-group cap_backcolor"><input type="text" id="cap_backcolor" name="cap_backcolor" value="' + flashvars['closedCaptions.bg'] + '" class="form-control" style="width: 85px;" disabled><span class="input-group-addon"><i></i></span></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<span class="pluginLabel">Font Size <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Captions font size." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span></span><br>' +
                '<div class="pull-left" style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" value="' + flashvars['closedCaptions.fontsize'] + '" style="width: 70px ! important; display: block;" class="form-control" name="cap_fontsize" id="cap_fontsize" disabled>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<span class="pluginLabel">Font Family <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Font familiy for Captions text." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br>' +
                '<div class="pull-left" style="margin-top:5px; margin-bottom:15px;">' +
                '<div style="float: left; margin-bottom: 5px;"><select id="cap-fontfam" class="form-control" style="width: 174px;" disabled><option value="Verdana">Verdana</option><option value="Arial">Arial</option><option value="Arial Black">Arial Black</option><option value="Tahoma">Tahoma</option><option value="Courier">Courier</option><option value="Comic Sans Ms">Comic Sans Ms</option><option value="Geneva">Geneva</option><option value="Impact">Impact</option><option value="Georgia">Georgia</option><option value="Lucida Console">Lucida Console</option><option value="Lucida Sans Unicode">Lucida Sans Unicode</option><option value="Palatino">Palatino</option><option value="Trebuchet MS">Trebuchet MS</option><option value="Times New Roman">Times New Roman</option></select></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel"><input name="cap_hide" id="cap-hide" style="margin-right: 5px" type="checkbox" disabled>Hide when empty <i data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="If the caption button should be hidden when no captions are available for the current entry." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseNinteen">' +
                'Related' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="related"></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseNinteen" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'Add the Related Videos screen at the end of the video to attract users to watch additional videos.<br /><br />' +
                '<span class="pluginLabel">Location <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Parent container for component." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<select id="related-location" class="form-control" disabled><option value="topBarContainer" selected>Top bar container</option><option value="controlsContainer">Controls container</option></select><br />' +
                '</div>' +
                '<span class="pluginLabel">Align <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Alignment for component, can be left or right." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<select id="related-align" class="form-control" disabled><option value="left">Left</option><option value="right" selected>Right</option></select><br />' +
                '</div>' +
                '<span class="pluginLabel">Playlist <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Playlist that will be used as the data source for related items." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<select id="related-playlist" class="form-control" disabled></select>' +
                '</div>' +
                '<span class="pluginLabel">Entry IDs list <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Allows runtime injection of list of related entries seperated by commas. This will only be used if the playlist is null." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="related-entries" class="form-control" placeholder="Enter entries" name="related_entries" value="' + flashvars['related.entryList'] + '" size="33" disabled>' +
                '</div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel"><input name="related_playback_done" id="related-playback-done" style="margin-right: 5px" type="checkbox" disabled checked>Display on playback done <i data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Display related screen automatically when playback has finished" class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel"><input name="related_autocontinue" id="related-autocontinue" style="margin-right: 5px" type="checkbox" disabled>Auto continue enabled <i data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Should the Next Item be automatically played." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '<span class="pluginLabel">Auto continue time <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Number of seconds for auto play." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="related-autocontinue-time" name="related_autocontinue_time" placeholder="Enter a number" class="form-control" style="width: 125px;" value="' + flashvars['related.autoContinueTime'] + '" size="33" disabled>' +
                '</div>' +
                '<span class="pluginLabel">Items limit <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Maximum number of items to show on the related screen." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="related-items-limit" name="related_items_limit" placeholder="Enter a number" class="form-control" style="width: 125px;" value="' + flashvars['related.itemsLimit'] + '" size="33" disabled>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseTweenty">' +
                'Info screen' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="info-screen"></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseTweenty" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'Add Information screen about the video.<br /><br />' +
                '<span class="pluginLabel">Location <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Parent container for component." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<select id="infoscreen-location" class="form-control" disabled><option value="topBarContainer" selected>Top bar container</option><option value="controlsContainer">Controls container</option></select><br />' +
                '</div>' +
                '<span class="pluginLabel">Align <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Alignment for component, can be left or right." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<select id="infoscreen-align" class="form-control" disabled><option value="left">Left</option><option value="right" selected>Right</option></select><br />' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseTweentyOne">' +
                'Loading spinner' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="loading-spinner" checked></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseTweentyOne" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'Loading spinner options allows you to customize the look of the loading spinner.<br /><br />' +
                '<span class="pluginLabel">Image url <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="An image URL, to use as the loading spinner. By default it is null. If a URL is provided, it will replace the dynamic loading spinner." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="spinner-url" class="form-control" placeholder="Enter a url" name="spinner_url" value="' + flashvars['loadingSpinner.imageUrl'] + '" size="33">' +
                '</div>' +
                '<span class="pluginLabel">Line length <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="The length of each line, 10 pixels by default." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="spinner-line-length" name="spinner_line_length" placeholder="Enter a number" class="form-control" style="width: 125px;" value="' + flashvars['loadingSpinner.lineLength'] + '" size="33">' +
                '</div>' +
                '<span class="pluginLabel">Width <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="The line thickness, 6 pixels thick by default." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="spinner-width" name="spinner_width" placeholder="Enter a number" class="form-control" style="width: 125px;" value="' + flashvars['loadingSpinner.width'] + '" size="33">' +
                '</div>' +
                '<span class="pluginLabel">Radius <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="The radius of the inner circle, 12 pixels thick by default." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="spinner-radius" name="spinner_radius" placeholder="Enter a number" class="form-control" style="width: 125px;" value="' + flashvars['loadingSpinner.radius'] + '" size="33">' +
                '</div>' +
                '<span class="pluginLabel">Corners <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Corner roundness (0..1), default 1 for fully rounded corners." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="spinner-corners" name="spinner_corners" placeholder="Enter a number" class="form-control" style="width: 125px;" value="' + flashvars['loadingSpinner.corners'] + '" size="33">' +
                '</div>' +
                '<span class="pluginLabel">Rotate <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="The rotation offset, 0 by default." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="spinner-rotate" name="spinner_rotate" placeholder="Enter a number" class="form-control" style="width: 125px;" value="' + flashvars['loadingSpinner.rotate'] + '" size="33">' +
                '</div>' +
                '<span class="pluginLabel">Direction <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="1: clockwise, -1: counterclockwise, clockwise by default." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="spinner-direction" name="spinner_direction" placeholder="Enter a number" class="form-control" style="width: 125px;" value="' + flashvars['loadingSpinner.direction'] + '" size="33">' +
                '</div>' +
                '<span class="pluginLabel">Color <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="An array of RGB colors delimited by |, or a single RGB style color string. By default uses the color wheel." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="spinner-color" class="form-control" placeholder="Enter a url" name="spinner_color" value="' + flashvars['loadingSpinner.color'] + '" size="33">' +
                '</div>' +
                '<span class="pluginLabel">Speed <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Rounds per second, default 1.6." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="spinner-speed" name="spinner_speed" placeholder="Enter a number" class="form-control" style="width: 125px;" value="' + flashvars['loadingSpinner.speed'] + '" size="33">' +
                '</div>' +
                '<span class="pluginLabel">Trail <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Afterglow percentage. 100 by default." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="spinner-trail" name="spinner_trail" placeholder="Enter a number" class="form-control" style="width: 125px;" value="' + flashvars['loadingSpinner.trail'] + '" size="33">' +
                '</div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel"><input name="spinner_shadow" id="spinner-shadow" style="margin-right: 5px" type="checkbox">Shadow <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Whether to render a shadow, false by default." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '<span class="pluginLabel">Top <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Top position relative to parent in px, auto by default." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="spinner-top" class="form-control" placeholder="Enter a url" name="spinner_top" value="' + flashvars['loadingSpinner.top'] + '" size="33">' +
                '</div>' +
                '<span class="pluginLabel">Left <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Left position relative to parent in px, auto by default." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="spinner-left" class="form-control" placeholder="Enter a url" name="spinner_left" value="' + flashvars['loadingSpinner.left'] + '" size="33">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="playlist" class="tab-pane">' +
                '<div class="options">' +
                '<h3>Playlist Configuration</h3>' +
                '<p>The playlist plugin supports associating multiple clips in sequence.</p>' +
                '<span class="pluginLabel">Position <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Position of the playlist." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<select id="plist-position" class="form-control"><option value="left">Left of the video</option><option value="right" selected>Right of the video</option><option value="top">Above the video</option><option value="bottom">Below the video</option></select><br />' +
                '</div>' +
                '<span class="pluginLabel">Layout <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Playlist layout." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<select id="plist-layout" class="form-control"><option value="vertical" selected>Vertical playlist</option><option value="horizontal">Horizontal playlist</option></select><br />' +
                '</div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel"><input name="hide_plist" id="hidePlaylist" style="margin-right: 5px" type="checkbox">Hide Playlist Items <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Hide clip list." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel"><input name="show_controls" id="showControls" style="margin-right: 5px" type="checkbox" checked>Show controls <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Display Next / Previous buttons." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel"><input name="include_header" id="includeHeader" style="margin-right: 5px" type="checkbox" checked>Include header <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Display playlist header, including title, number of clips and playlist controls." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel"><input name="auto_continue" id="autoContinue" style="margin-right: 5px" type="checkbox">Automatically continue <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="If the playlist should autocontinue." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel"><input name="plist_auto_play" id="playlistAutoPlay" style="margin-right: 5px" type="checkbox">Automatically play <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="If the playlist should autoplay on load." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel"><input name="plist_loop" id="playlistLoop" style="margin-right: 5px" type="checkbox">Loop playlist <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="If the playlist should loop." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel"><input name="hide_clip_post" id="hideClipPost" style="margin-right: 5px" type="checkbox">Hide clip poster <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Hide clip poster when switching to another clip." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '<span class="pluginLabel">Min clips <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Minimum number of clips to show in the playlist without scrolling." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="plist-min-clips" name="plist_min_clips" placeholder="Enter a number" class="form-control" style="width: 125px;" value="' + flashvars['playlistAPI.MinClips'] + '" size="33">' +
                '</div>' +
                '<span class="pluginLabel">Max clips <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Max number of clips to show in the playlist." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="plist-max-clips" name="plist_max_clips" placeholder="Enter a number" class="form-control" style="width: 125px;" value="' + flashvars['playlistAPI.MaxClips'] + '" size="33">' + '</div>' +
                '<span class="pluginLabel">Init item entry id <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="The entryId that should be played first." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="plist-init-entryid" name="plist_init_entryid" placeholder="Enter an entry id" class="form-control" value="' + flashvars['playlistAPI.initItemEntryId'] + '" size="33">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="ad" class="tab-pane">' +
                '<div class="options">' +
                '<h3>Advertising</h3>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel" style="margin-bottom: 15px;"><input name="ads_onreplay" id="ads-onreplay" style="margin-right: 5px; margin-top: 3px;" type="checkbox" checked>Display ads on replay</label>' +
                '</div>' +
                '<div id="accordion" class="panel-group">' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseTweentyFour">' +
                'Bumper' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="bumper"></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseTweentyFour" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'Bumpers enables a entry to be displayed before or after the content.<br /><br />' +
                '<span class="pluginLabel">Bumper Entry Id <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Bumper entry ID" class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="bumper_id" name="bumper_id" placeholder="Enter a Entry Id" class="form-control" value="' + flashvars['bumper.bumperEntryID'] + '" size="33" disabled>' +
                '</div>' +
                '<span class="pluginLabel">Click URL <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="The URL to open when the user clicks the bumper video." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="bumper_url" name="bumper_url" placeholder="Enter a URL" class="form-control" value="' + flashvars['bumper.clickurl'] + '" size="33" disabled>' +
                '</div>' +
                '<span class="pluginLabel">Display Bumper</span><br />' +
                '<div style="margin-top:5px; margin-bottom:5px;">' +
                '<select id="bumper_sequence" class="form-control" style="width: 200px !important; max-width: 200px !important;" disabled><option value="before">Before Content</option><option value="after">After Content</option><option value="both">Before and After Content</option></select><br />' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseTweentyFive">' +
                'Vast' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="vast"></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseTweentyFive" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'Player features robust VAST support for prerolls, midrolls, overlays, companions and postrolls<br /><br />' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel" style="margin-bottom: 15px;"><input name="pause_onclick" id="pause-onclick" style="margin-right: 5px; margin-top: 3px;" type="checkbox" checked disabled>Pause ad on click <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="If the ad should pause when clicked." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel" style="margin-bottom: 15px;"><input name="enable_cors" id="enable-cors" style="margin-right: 5px; margin-top: 3px;" type="checkbox" checked disabled>Enable CORS <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Enable CORS request to support request cookies to secured domains over ajax" class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel" style="margin-bottom: 15px;"><input name="load_ads_onplay" id="load-ads-onplay" style="margin-right: 5px; margin-top: 3px;" type="checkbox" disabled>Load ads on play <i data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="By default ads are loaded at player startup time. Checking this option will load ads only once the user presses play." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></label>' +
                '</div>' +
                '<span class="pluginLabel">Vast notice message</span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<div class="radio" style="display: inline-block;"><label class="pluginLabel"><input type="radio" style="margin-right: 5px" id="notice_text_yes" name="notice_display" disabled>Yes</label></div><div class="radio" style="display: inline-block; margin-left: 15px;"><label class="pluginLabel"><input type="radio" style="margin-right: 5px" id="notice_text_no" name="notice_display" checked disabled>No</label></div>' +
                '</div>' +
                '<span class="pluginLabel">Notice message <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Notice message (can use evaluated expressions)" class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="notice_text" name="notice_text" placeholder="Enter a message" class="form-control" value="' + flashvars['noticeMessage.text'] + '" size="33" disabled>' +
                '</div>' +
                '<span class="pluginLabel">Vast skip notice</span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<div class="radio" style="display: inline-block;"><label class="pluginLabel"><input type="radio" style="margin-right: 5px" id="ad_skip_notice_yes" name="ad_skip_notice" disabled>Yes</label></div><div class="radio" style="display: inline-block; margin-left: 15px;"><label class="pluginLabel"><input type="radio" style="margin-right: 5px" id="ad_skip_notice_no" name="ad_skip_notice" checked disabled>No</label></div>' +
                '</div>' +
                '<span class="pluginLabel">Skip notice text <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Skip notice text (can use evaluated expressions)" class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="skip_notice_text" name="skip_notice_text" placeholder="Enter a skip text" class="form-control" value="' + flashvars['skipNotice.text'] + '" size="33" disabled>' +
                '</div>' +
                '<div style="margin-left: auto; margin-right: auto; width: 100%; margin-top: 30px;" class="tabbable tabs-left">' +
                '<ul id="myTab" class="nav nav-tabs"><li class="active"><a data-toggle="tab" href="#preroll">Preroll</a></li><li><a data-toggle="tab" href="#overlay">Overlay</a></li><li><a data-toggle="tab" href="#postroll">Postroll</a></li></ul>' +
                '<div style="width: 100%; margin: 15px auto;" class="tab-content">' +
                '<div class="tab-pane active" id="preroll">' +
                '<span class="pluginLabel">Preroll URL <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="The VAST ad tag XML URL." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="preroll_url" name="preroll_url" placeholder="Enter a URL" class="form-control" value="' + flashvars['vast.prerollUrl'] + '" size="33" disabled>' +
                '</div>' +
                '<span class="pluginLabel">Preroll(s) amount <i data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="The number of prerolls to be played." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="preroll_amount" name="preroll_amount" class="form-control" style="width: 80px;" value="' + flashvars['vast.numPreroll'] + '" size="33" disabled>' +
                '</div>' +
                '<span class="pluginLabel">Number of prerolls to start with <i data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Number of prerolls to start with." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="preroll_start" name="preroll_start" class="form-control" style="width: 80px;" value="' + flashvars['vast.prerollStartWith'] + '" size="33" disabled>' +
                '</div>' +
                '<span class="pluginLabel">Preroll interval <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="How often to show prerolls" class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="preroll_interval" name="preroll_interval" class="form-control" style="width: 80px;" value="' + flashvars['vast.prerollInterval'] + '" size="33" disabled>' +
                '</div>' +
                '</div>' +
                '<div class="tab-pane" id="overlay">' +
                '<span class="pluginLabel">Overlay URL <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="The VAST XML file that contains the overlay media and tracking info." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="overlay_url" name="overlay_url" placeholder="Enter a URL" class="form-control" value="' + flashvars['vast.overlayUrl'] + '" size="33" disabled>' +
                '</div>' +
                '<span class="pluginLabel">Overlay start time <i data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Start time (in seconds) for overlay." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="overlay_start" name="overlay_start" class="form-control" style="width: 80px;" value="' + flashvars['vast.overlayStartAt'] + '" size="33" disabled>' +
                '</div>' +
                '<span class="pluginLabel">Overlay interval <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="How often should the overlay be displayed." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="overlay_interval" name="overlay_interval" class="form-control" style="width: 80px;" value="' + flashvars['vast.overlayInterval'] + '" size="33" disabled>' +
                '</div>' +
                '<span class="pluginLabel">Timeout <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="The timeout in seconds, for displaying an overlay VAST ad." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="overlay_timeout" name="overalay_timeout" class="form-control" style="width: 80px;" value="' + flashvars['vast.timeout'] + '" size="33" disabled>' +
                '</div>' +
                '</div>' +
                '<div class="tab-pane" id="postroll">' +
                '<span class="pluginLabel">Postroll URL <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="The VAST ad tag XML URL." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="postroll_url" name="postroll_url" placeholder="Enter a URL" class="form-control" value="' + flashvars['vast.postrollUrl'] + '" size="33" disabled>' +
                '</div>' +
                '<span class="pluginLabel">Postroll(s) amount <i data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="The number of postrolls to be played." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="postroll_amount" name="postroll_amount" class="form-control" style="width: 80px;" value="' + flashvars['vast.numPostroll'] + '" size="33" disabled>' +
                '</div>' +
                '<span class="pluginLabel">Number of postrolls to start with <i data-placement="top" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Number of postrolls to start with." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="postroll_start" name="postroll_start" class="form-control" style="width: 80px;" value="' + flashvars['vast.postrollStartWith'] + '" size="33" disabled>' +
                '</div>' +
                '<span class="pluginLabel">Postroll interval <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="How often to show postrolls." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="postroll_interval" name="postroll_interval" class="form-control" style="width: 80px;" value="' + flashvars['vast.postrollInterval'] + '" size="33" disabled>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a class="accordion-toggle pluginLabel" data-toggle="collapse" href="#collapseTweentySix">' +
                'Skip Button' +
                '<i class="indicator fa fa-caret-right"></i><div class="checkbox pull-right"><input type="checkbox" style="margin-right: 5px" id="ad_skip_button"></div></a>' +
                '</h4>' +
                '</div>' +
                '<div id="collapseTweentySix" class="panel-collapse collapse">' +
                '<div class="panel-body">' +
                'Skip button settings.<br /><br />' +
                '<span class="pluginLabel">Skip button label <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="Skip button label." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="skip_text" name="skip_text" placeholder="Enter a skip text" class="form-control" value="' + flashvars['skipBtn.label'] + '" size="33" disabled>' +
                '</div>' +
                '<span class="pluginLabel">Skip offset <i data-placement="right" data-toggle="tooltip" data-delay=\'{"show":700, "hide":30}\' data-original-title="The time in seconds, before the skip ad link is active." class="fa fa-question-circle" style="font-size: 14px; margin-left: 0; top: 0;"></i></span><br />' +
                '<div style="margin-top:5px; margin-bottom:15px;">' +
                '<input type="text" id="timeout" name="timeout" placeholder="Enter a time" class="form-control" value="' + flashvars['skipBtn.skipOffset'] + '" size="33" disabled>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="custom" class="tab-pane">' +
                '<div class="options">' +
                '<h3 style="margin-top: 0;">Theme CSS style</h3>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel" style="margin-bottom: 10px;"><input name="theme_apply_large_button" id="theme-apply-large-button" style="margin-right: 5px; margin-top: 3px;" type="checkbox" checked>Apply to large play button</label>' +
                '</div>' +
                '<span class="pluginLabel">Button\'s size</span><br />' +
                '<div style="margin-top:5px; margin-bottom:10px;">' +
                '<input type="text" id="theme-button-size" name="theme_button_size" class="form-control" style="width: 80px;" value="' + flashvars['theme.buttonsSize'] + '" size="33">' +
                '</div>' +
                '<span class="pluginLabel">Button\'s color</span><br>' +
                '<div class="pull-left" style="margin-top:5px; margin-bottom:5px;">' +
                '<div class="input-group style_button_color"><input type="text" id="theme-button-color" name="theme_button_color" value="' + flashvars['theme.buttonsColor'] + '" class="form-control" style="width: 85px;"><span class="input-group-addon"><i></i></span></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<span class="pluginLabel">Button\'s icon color</span><br>' +
                '<div class="pull-left" style="margin-top:5px; margin-bottom:10px;">' +
                '<div class="input-group style_button_icon_color"><input type="text" id="theme-button-icon-color" name="theme_button_icon_color" value="' + flashvars['theme.buttonsIconColor'] + '" class="form-control" style="width: 85px;"><span class="input-group-addon"><i></i></span></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<span class="pluginLabel">Slider color</span><br>' +
                '<div class="pull-left" style="margin-top:5px; margin-bottom:5px;">' +
                '<div class="input-group style_slider_color"><input type="text" id="theme-slider-color" name="theme_slider_color" value="' + flashvars['theme.sliderColor'] + '" class="form-control" style="width: 85px;"><span class="input-group-addon"><i></i></span></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<span class="pluginLabel">Scrubber color</span><br>' +
                '<div class="pull-left" style="margin-top:5px; margin-bottom:5px;">' +
                '<div class="input-group style_scrubber_color"><input type="text" id="theme-scrubber-color" name="theme_scrubber_color" value="' + flashvars['theme.scrubberColor'] + '" class="form-control" style="width: 85px;"><span class="input-group-addon"><i></i></span></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<span class="pluginLabel">Controls bar color</span><br>' +
                '<div class="pull-left" style="margin-top:5px; margin-bottom:10px;">' +
                '<div class="input-group style_contbar_color"><input type="text" id="theme-contbar-color" name="theme_contbar_color" value="' + flashvars['theme.controlsBkgColor'] + '" class="form-control" style="width: 85px;"><span class="input-group-addon"><i></i></span></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<span class="pluginLabel">Slider watched color</span><br>' +
                '<div class="pull-left" style="margin-top:5px; margin-bottom:10px;">' +
                '<div class="input-group style_slider_watched_color"><input type="text" id="theme-slider-watched-color" name="theme_slider_watched_color" value="' + flashvars['theme.watchedSliderColor'] + '" class="form-control" style="width: 85px;"><span class="input-group-addon"><i></i></span></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<span class="pluginLabel">Slider buffer color</span><br>' +
                '<div class="pull-left" style="margin-top:5px; margin-bottom:10px;">' +
                '<div class="input-group style_slider_buffer_color"><input type="text" id="theme-slider-buffer-color" name="theme_slider_buffer_color" value="' + flashvars['theme.bufferedSliderColor'] + '" class="form-control" style="width: 85px;"><span class="input-group-addon"><i></i></span></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel"><input name="theme_apply_icon_shadow" id="theme-apply-icon-shadow" style="margin-right: 5px; margin-top: 3px;" type="checkbox" checked>Apply drop shadow to icons</label>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="content" class="tab-pane">' +
                '<div class="options">' +
                '<h3>Playlist Content</h3>' +
                '<p>A channel playlist contains multiple tabs, each containing a different playlist.</p> <p>Drag and drop your playlists under the "Playlist Tabs" drop zone.</p>' +
                '</div>' +
                '</div>' +
                '<div id="vr" class="tab-pane">' +
                '<div class="options">' +
                '<h3>360&deg; Video / VR</h3>' +
                '<div class="checkbox" style="margin-top: 5px; margin-bottom: 5px; display: block;">' +
                '<label class="pluginLabel" style="margin-bottom: 15px;"><input name="vr_enabled" id="vr-enabled" style="margin-right: 5px; margin-top: 3px;" type="checkbox">Display videos in 360&deg; / VR</label>' +
                '</div>' +
                '<div id="vr-format-options">' +
                '<div style="margin-top: 10px; font-weight: bold;"><span style="color: #444; font-size: 12px;margin-right: 11px;">VR Video Format:</span><span><select class="form-control format" style="width: 213px;" disabled><option value="2d">2D</option><option value="sbs">Side By Side</option><option value="tb">Top/Bottom</option></select></span></div>' +
                '<div style="margin-top: 5px;"><span style="font-size: 12px; color: #999;">Supported VR video formats include 2D, 3D side-by-side and 3D top/bottom.</span></div>' +
                '<hr>' +
                '</div>' +
                '<div id="vr-options">' +
                '<div style="margin-top: 10px; font-weight: bold;"><span style="color: #444; font-size: 12px; padding-top: 15px; margin-right: 15px;">Fallback EntryId:</span><span style="font-weight: normal; font-size: 15px;"><a href="#" id="update-fb-eid" class="disable-link" onclick="smhPlayers.selectFBModal();">None Selected</a></span></div>' +
                '<div style="margin-top: 5px;"><span id="embedType-text" style="font-size: 12px; color: #999;">If the browser does not support VR, fallback to flat projection, switch source, and playback the selected Fallback EntryId instead. By default, the player will playback the same EntryId source if no Fallback EntryId is selected.</span></div>' +
                '<hr>' +
                '</div>' +
                '<div id="comp-options">' +
                '<div style="margin-top: 10px; font-weight: bold;"><span><input type="checkbox" id="error-comp" name="error_comp" checked disabled></span>&nbsp;<span style="color: #444; font-size: 12px; font-weight: bold; margin-left: 5px; position: relative; top: -2px;">Display Browser Compatibility Warning</span></div>' +
                '<div style="margin-top: 5px;"><span id="embedType-text" style="font-size: 12px; color: #999;">If the browser does not support VR, display a browser compatibility warning message.</span></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="player_preview">' +
                '<div class="pull-left">' +
                '<div style="padding-top: 5px; margin-bottom: 10px; height: 32px; display: inline-block; position: relative;">' +
                '<div class="checkbox"><label><input type="checkbox" id="auto_preview" onclick="smhPlayers.setAutoPreview();" style="margin-right: 5px">Auto Preview</label></div>' +
                '</div>' +
                '<button onclick="smhPlayers.refreshPlayer()" style="margin-left: 20px" class="btn btn-default"><i class="fa fa-refresh">&nbsp;</i>Preview Changes</button>' +
                '</div>' +
                '<div class="pull-right" style="margin-top: 7px;">' +
                '<div id="pass-result" style="display: inline;"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div>' + player_button +
                '</div>' +
                '<div class="clear"></div>' +
                '<hr>' +
                '<div id="player-wrapper">' +
                '<div id="previewIframe" style="margin-top: 5px;"></div>' +
                '</div>' +
                '</div>' +
                '<div id="multi-content-wrapper" style="display: none;">' +
                '<div class="pull-right" style="margin-top: 7px;">' +
                '<div id="pass-result" style="display: inline;"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div>' + player_button +
                '</div>' +
                '<div class="clear"></div>' +
                '<hr>' +
                '<div class="playlist-content">' +
                '<div id="entries-wrapper">' +
                '<div class="header rs-header">' +
                '<div style="margin-top: 6px; margin-bottom: 5px; text-align: left;">All Playlists</div>' +
                '</div>' +
                '<div id="entries">' +
                '<div id="plist-table"></div>' +
                '</div>' +
                '</div>' +
                '<div id="playlist-wrapper">' +
                '<div style="text-align: left;" class="header">' +
                'Playlist Tabs' +
                '<div class="clear"></div>' +
                '<div id="plist-entries"></div>' +
                '<div class="clear"></div>' +
                '<div id="playlist-info">' +
                '<div id="duration-wrapper">Total Playlists: <span id="plist_num">0</span></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';

        $('#smh-modal3 .modal-body').html(content);
        smhPlayers.loadPlists();
        if (edit) {
            if (flashvars['autoPlay']) {
                $('#auto_play').prop("checked", true);
            } else {
                $('#auto_play').prop("checked", false);
            }
            if (flashvars['autoMute']) {
                $('#start_muted').prop("checked", true);
            } else {
                $('#start_muted').prop("checked", false);
            }
            if (flashvars['enableTooltips']) {
                $('#show-tooltips').prop("checked", true);
            } else {
                $('#show-tooltips').prop("checked", false);
            }
            if (flashvars['adsOnReplay']) {
                $('#ads-onreplay').prop("checked", true);
            } else {
                $('#ads-onreplay').prop("checked", false);
            }
            if (flashvars['titleLabel.plugin']) {
                $('#title-location').val(flashvars['titleLabel.align']);
                (flashvars['titleLabel.truncateLongTitles']) ? $('#title-truncate').prop("checked", true) : $('#title-truncate').prop("checked", false);
                if (!$('#smh-modal3 #title_text').is(':checked')) {
                    $('#smh-modal3 #title_text').click();
                }
            } else {
                $('#title_text').prop("checked", false);
            }
            if (flashvars['watermark.plugin']) {
                $('#watermark_url').val(flashvars['watermark.watermarkPath']);
                $('#watermark_landing').val(flashvars['watermark.watermarkClickPath']);
                $('#watermark-location').val(flashvars['watermark.watermarkPosition']);
                $('#water_padding').val(flashvars['watermark.padding']);
                if (!$('#smh-modal3 #watermark').is(':checked')) {
                    $('#smh-modal3 #watermark').click();
                }
            } else {
                $('#watermark').prop("checked", false);
            }
            if (flashvars['logo.plugin']) {
                $('#icon_url').val(flashvars['logo.img']);
                $('#icon_landing').val(flashvars['logo.href']);
                $('#icon_title').val(flashvars['logo.title']);
                if (!$('#smh-modal3 #logo-icon').is(':checked')) {
                    $('#smh-modal3 #logo-icon').click();
                }
            } else {
                $('#logo-icon').prop("checked", false);
            }
            if (flashvars['currentTimeLabel.plugin']) {
                if (!$('#smh-modal3 #left-play-counter').is(':checked')) {
                    $('#smh-modal3 #left-play-counter').click();
                }
            } else {
                $('#left-play-counter').prop("checked", false);
            }
            if (flashvars['durationLabel.plugin']) {
                if (!$('#smh-modal3 #right-play-counter').is(':checked')) {
                    $('#smh-modal3 #right-play-counter').click();
                }
            } else {
                $('#right-play-counter').prop("checked", false);
            }
            if (flashvars['sourceSelector.plugin']) {
                (flashvars['sourceSelector.switchOnResize']) ? $('#switch-resize').prop("checked", true) : $('#switch-resize').prop("checked", false);
                (flashvars['sourceSelector.simpleFormat']) ? $('#simple-format').prop("checked", true) : $('#simple-format').prop("checked", false);
                $('#smh-modal3 #pre-flavor').val(flashvars['mediaProxy.preferedFlavorBR']);
                if (!$('#smh-modal3 #flavor_selector').is(':checked')) {
                    $('#smh-modal3 #flavor_selector').click();
                }
            } else {
                $('#flavor_selector').prop("checked", false);
            }
            if (flashvars['fullScreenBtn.plugin']) {
                if (!$('#smh-modal3 #fullscreen').is(':checked')) {
                    $('#smh-modal3 #fullscreen').click();
                }
            } else {
                $('#fullscreen').prop("checked", false);
            }
            if (flashvars['largePlayBtn.plugin']) {
                if (!$('#smh-modal3 #on_video_play').is(':checked')) {
                    $('#smh-modal3 #on_video_play').click();
                }
            } else {
                $('#on_video_play').prop("checked", false);
            }
            if (flashvars['playPauseBtn.plugin']) {
                if (!$('#smh-modal3 #play_pause').is(':checked')) {
                    $('#smh-modal3 #play_pause').click();
                }
            } else {
                $('#play_pause').prop("checked", false);
            }
            if (flashvars['volumeControl.plugin']) {
                (flashvars['volumeControl.showSlider']) ? $('#vol-show-slider').prop("checked", true) : $('#vol-show-slider').prop("checked", false);
                (flashvars['volumeControl.pinVolumeBar']) ? $('#vol-pin-bar').prop("checked", true) : $('#vol-pin-bar').prop("checked", false);
                if (!$('#smh-modal3 #volume').is(':checked')) {
                    $('#smh-modal3 #volume').click();
                }
            } else {
                $('#volume').prop("checked", false);
            }
            if (flashvars['controlBarContainer.plugin']) {
                (flashvars['controlBarContainer.hover']) ? $('#hovering_controls').prop("checked", true) : $('#hovering_controls').prop("checked", false);
                if (!$('#smh-modal3 #control-bar').is(':checked')) {
                    $('#smh-modal3 #control-bar').click();
                }
            } else {
                $('#control-bar').prop("checked", false);
            }
            if (flashvars['scrubber.plugin']) {
                if (!$('#smh-modal3 #scrubber').is(':checked')) {
                    $('#smh-modal3 #scrubber').click();
                }
            } else {
                $('#scrubber').prop("checked", false);
            }
            if (flashvars['chromecast.plugin']) {
                $('#smh-modal3 #chromecast-location').val(flashvars['chromecast.parent']);
                $('#smh-modal3 #chromecast-align').val(flashvars['chromecast.align']);
                $('#smh-modal3 #chromecast-url').val(flashvars['chromecast.logoUrl']);
                if (!$('#smh-modal3 #chromecast').is(':checked')) {
                    $('#smh-modal3 #chromecast').click();
                }
            } else {
                $('#chromecast').prop("checked", false);
            }
            if (flashvars['share.plugin']) {
                $('#smh-modal3 #share-location').val(flashvars['share.parent']);
                $('#smh-modal3 #share-align').val(flashvars['share.align']);
                (flashvars['share.socialShareEnabled']) ? $('#share-social-enabled').prop("checked", true) : $('#share-social-enabled').prop("checked", false);
                (flashvars['share.embedEnabled']) ? $('#share-embed-enabled').prop("checked", true) : $('#share-embed-enabled').prop("checked", false);
                (flashvars['share.allowTimeOffset']) ? $('#share-time-offset').prop("checked", true) : $('#share-time-offset').prop("checked", false);
                (flashvars['share.allowSecuredEmbed']) ? $('#share-allow-secured-embed').prop("checked", true) : $('#share-allow-secured-embed').prop("checked", false);
                var networks = flashvars['share.socialNetworks'].split(",");
                if ($.inArray('facebook', networks) === -1) {
                    $('#share-networks-fb').prop("checked", false);
                } else {
                    $('#share-networks-fb').prop("checked", true);
                }
                if ($.inArray('twitter', networks) === -1) {
                    $('#share-networks-twtr').prop("checked", false);
                } else {
                    $('#share-networks-twtr').prop("checked", true);
                }
                if ($.inArray('googleplus', networks) === -1) {
                    $('#share-networks-gp').prop("checked", false);
                } else {
                    $('#share-networks-gp').prop("checked", true);
                }
                if ($.inArray('email', networks) === -1) {
                    $('#share-networks-email').prop("checked", false);
                } else {
                    $('#share-networks-email').prop("checked", true);
                }
                if ($.inArray('linkedin', networks) === -1) {
                    $('#share-networks-lnkdin').prop("checked", false);
                } else {
                    $('#share-networks-lnkdin').prop("checked", true);
                }
                if (!$('#smh-modal3 #share').is(':checked')) {
                    $('#smh-modal3 #share').click();
                }
            } else {
                $('#share').prop("checked", false);
            }
            if (flashvars['download.plugin']) {
                $('#smh-modal3 #dwnld-location').val(flashvars['download.parent']);
                $('#smh-modal3 #dwnld-align').val(flashvars['download.align']);
                $('#smh-modal3 #dwnld-flavorid').val(flashvars['download.flavorID']);
                $('#smh-modal3 #dwnld-pre-flavor').val(flashvars['download.preferredBitrate']);
                if (!$('#smh-modal3 #download').is(':checked')) {
                    $('#smh-modal3 #download').click();
                }
            } else {
                $('#download').prop("checked", false);
            }
            if (flashvars['captureThumbnail.plugin']) {
                $('#smh-modal3 #thumbnail_tool').val(flashvars['captureThumbnail.tooltip']);
                if (!$('#smh-modal3 #thumbnail').is(':checked')) {
                    $('#smh-modal3 #thumbnail').click();
                }
            } else {
                $('#thumbnail').prop("checked", false);
            }
            if (flashvars['playbackRateSelector.plugin']) {
                if (!$('#smh-modal3 #playback-rate').is(':checked')) {
                    $('#smh-modal3 #playback-rate').click();
                }
            } else {
                $('#playback-rate').prop("checked", false);
            }

            if (flashvars['resumePlayback.plugin']) {
                if (!$('#smh-modal3 #resume-playback').is(':checked')) {
                    $('#smh-modal3 #resume-playback').click();
                }
            } else {
                $('#resume-playback').prop("checked", false);
            }

            if (flashvars['closedCaptions.plugin']) {
                (flashvars['closedCaptions.displayCaptions']) ? $('#cap-display').prop("checked", true) : $('#cap-display').prop("checked", false);
                $('#smh-modal3 #cap_textcolor').val(flashvars['closedCaptions.fontColor']);
                (flashvars['closedCaptions.useGlow']) ? $('#cap-use-glow').prop("checked", true) : $('#cap-use-glow').prop("checked", false);
                $('#smh-modal3 #cap_glowcolor').val(flashvars['closedCaptions.glowColor']);
                $('#smh-modal3 #cap_glowblur').val(flashvars['closedCaptions.glowBlur']);
                $('#smh-modal3 #cap_backcolor').val(flashvars['closedCaptions.bg']);
                $('#smh-modal3 #cap_fontsize').val(flashvars['closedCaptions.fontsize']);
                $('#smh-modal3 #cap-fontfam').val(flashvars['closedCaptions.fontFamily']);
                (flashvars['closedCaptions.hideWhenEmpty']) ? $('#cap-hide').prop("checked", true) : $('#cap-hide').prop("checked", false);
                if (!$('#smh-modal3 #captions').is(':checked')) {
                    $('#smh-modal3 #captions').click();
                }
            } else {
                $('#captions').prop("checked", false);
            }
            if (flashvars['related.plugin']) {
                $('#smh-modal3 #related-location').val(flashvars['related.parent']);
                $('#smh-modal3 #related-align').val(flashvars['related.align']);
                $('#smh-modal3 #related-entries').val(flashvars['related.entryList']);
                (flashvars['related.displayOnPlaybackDone']) ? $('#related-playback-done').prop("checked", true) : $('#related-playback-done').prop("checked", false);
                (flashvars['related.autoContinueEnabled']) ? $('#related-autocontinue').prop("checked", true) : $('#related-autocontinue').prop("checked", false);
                $('#smh-modal3 #related-autocontinue-time').val(flashvars['related.autoContinueTime']);
                $('#smh-modal3 #related-items-limit').val(flashvars['related.itemsLimit']);
            } else {
                $('#related').prop("checked", false);
            }
            if (flashvars['infoScreen.plugin']) {
                $('#smh-modal3 #infoscreen-location').val(flashvars['infoScreen.parent']);
                $('#smh-modal3 #infoscreen-align').val(flashvars['infoScreen.align']);
                if (!$('#smh-modal3 #info-screen').is(':checked')) {
                    $('#smh-modal3 #info-screen').click();
                }
            } else {
                $('#info-screen').prop("checked", false);
            }
            if (flashvars['loadingSpinner.plugin']) {
                $('#smh-modal3 #spinner-url').val(flashvars['loadingSpinner.imageUrl']);
                $('#smh-modal3 #spinner-line-length').val(flashvars['loadingSpinner.lineLength']);
                $('#smh-modal3 #spinner-width').val(flashvars['loadingSpinner.width']);
                $('#smh-modal3 #spinner-radius').val(flashvars['loadingSpinner.radius']);
                $('#smh-modal3 #spinner-corners').val(flashvars['loadingSpinner.corners']);
                $('#smh-modal3 #spinner-rotate').val(flashvars['loadingSpinner.rotate']);
                $('#smh-modal3 #spinner-direction').val(flashvars['loadingSpinner.direction']);
                $('#smh-modal3 #spinner-color').val(flashvars['loadingSpinner.color']);
                $('#smh-modal3 #spinner-speed').val(flashvars['loadingSpinner.speed']);
                $('#smh-modal3 #spinner-trail').val(flashvars['loadingSpinner.trail']);
                (flashvars['loadingSpinner.shadow']) ? $('#spinner-shadow').prop("checked", true) : $('#spinner-shadow').prop("checked", false);
                $('#smh-modal3 #spinner-top').val(flashvars['loadingSpinner.top']);
                $('#smh-modal3 #spinner-left').val(flashvars['loadingSpinner.left']);
                if (!$('#smh-modal3 #loading-spinner').is(':checked')) {
                    $('#smh-modal3 #loading-spinner').click();
                }
            } else {
                $('#loading-spinner').prop("checked", false);
            }
            if (flashvars['bumper.plugin']) {
                $('#smh-modal3 #bumper_id').val(flashvars['bumper.bumperEntryID']);
                $('#smh-modal3 #bumper_url').val(flashvars['bumper.clickurl']);
                if ((flashvars['bumper.preSequence'] === 2 || flashvars['bumper.preSequence'] === 1) && (flashvars['bumper.postSequence'] === 0)) {
                    $('#smh-modal3 #bumper_sequence').val('before');
                }
                if (flashvars['bumper.preSequence'] === 0 && flashvars['bumper.postSequence'] === 1) {
                    $('#smh-modal3 #bumper_sequence').val('after');
                }
                if (flashvars['bumper.preSequence'] === 1 && flashvars['bumper.postSequence'] === 1) {
                    $('#smh-modal3 #bumper_sequence').val('both');
                }
                if (!$('#smh-modal3 #bumper').is(':checked')) {
                    $('#smh-modal3 #bumper').click();
                }
            } else {
                $('#bumper').prop("checked", false);
            }
            if (flashvars['skipBtn.plugin']) {
                $('#smh-modal3 #skip_text').val(flashvars['skipBtn.label']);
                $('#smh-modal3 #timeout').val(flashvars['skipBtn.skipOffset']);
                if (!$('#smh-modal3 #ad_skip_button').is(':checked')) {
                    $('#smh-modal3 #ad_skip_button').click();
                }
            } else {
                $('#ad_skip_button').prop("checked", false);
            }
            if (flashvars['vast.plugin']) {
                (flashvars['vast.pauseAdOnClick']) ? $('#pause-onclick').prop("checked", true) : $('#pause-onclick').prop("checked", false);
                (flashvars['vast.enableCORS']) ? $('#enable-cors').prop("checked", true) : $('#enable-cors').prop("checked", false);
                (flashvars['vast.loadAdsOnPlay']) ? $('#load-ads-onplay').prop("checked", true) : $('#load-ads-onplay').prop("checked", false);
                (flashvars['noticeMessage.plugin']) ? $('#notice_text_yes').prop("checked", true) : $('#notice_text_no').prop("checked", true);
                $('#smh-modal3 #notice_text').val(flashvars['noticeMessage.text']);
                (flashvars['skipNotice.plugin']) ? $('#ad_skip_notice_yes').prop("checked", true) : $('#ad_skip_notice_no').prop("checked", true);
                $('#smh-modal3 #skip_notice_text').val(flashvars['skipNotice.text']);
                $('#smh-modal3 #preroll_url').val(flashvars['vast.prerollUrl']);
                $('#smh-modal3 #preroll_amount').val(flashvars['vast.numPreroll']);
                $('#smh-modal3 #preroll_start').val(flashvars['vast.prerollStartWith']);
                $('#smh-modal3 #preroll_interval').val(flashvars['vast.prerollInterval']);
                $('#smh-modal3 #overlay_url').val(flashvars['vast.overlayUrl']);
                $('#smh-modal3 #overlay_start').val(flashvars['vast.overlayStartAt']);
                $('#smh-modal3 #overlay_interval').val(flashvars['vast.overlayInterval']);
                $('#smh-modal3 #overlay_timeout').val(flashvars['vast.timeout']);
                $('#smh-modal3 #postroll_url').val(flashvars['vast.postrollUrl']);
                $('#smh-modal3 #postroll_amount').val(flashvars['vast.numPostroll']);
                $('#smh-modal3 #postroll_start').val(flashvars['vast.postrollStartWith']);
                $('#smh-modal3 #postroll_interval').val(flashvars['vast.postrollInterval']);
                if (!$('#smh-modal3 #vast').is(':checked')) {
                    $('#smh-modal3 #vast').click();
                }
            } else {
                $('#vast').prop("checked", false);
            }
            if (flashvars['theme.plugin']) {
                (flashvars['theme.applyToLargePlayButton']) ? $('#theme-apply-large-button').prop("checked", true) : $('#theme-apply-large-button').prop("checked", false);
                (flashvars['theme.buttonsIconColorDropShadow']) ? $('#theme-apply-icon-shadow').prop("checked", true) : $('#theme-apply-icon-shadow').prop("checked", false);
                $('#smh-modal3 #theme-button-size').val(flashvars['theme.buttonsSize']);
                $('#smh-modal3 #theme-button-color').val(flashvars['theme.buttonsColor']);
                $('#smh-modal3 #theme-button-icon-color').val(flashvars['theme.buttonsIconColor']);
                $('#smh-modal3 #theme-slider-color').val(flashvars['theme.sliderColor']);
                $('#smh-modal3 #theme-scrubber-color').val(flashvars['theme.scrubberColor']);
                $('#smh-modal3 #theme-contbar-color').val(flashvars['theme.controlsBkgColor']);
                $('#smh-modal3 #theme-slider-watched-color').val(flashvars['theme.watchedSliderColor']);
                $('#smh-modal3 #theme-slider-buffer-color').val(flashvars['theme.bufferedSliderColor']);
            }
            if (flashvars['playlistAPI.plugin']) {
                $('#smh-modal3 #plist-position').val(flashvars['playlistAPI.containerPosition']);
                $('#smh-modal3 #plist-layout').val(flashvars['playlistAPI.layout']);
                (flashvars['playlistAPI.includeInLayout']) ? $('#hidePlaylist').prop("checked", false) : $('#hidePlaylist').prop("checked", true);
                (flashvars['playlistAPI.showControls']) ? $('#showControls').prop("checked", true) : $('#showControls').prop("checked", false);
                (flashvars['playlistAPI.includeHeader']) ? $('#includeHeader').prop("checked", true) : $('#includeHeader').prop("checked", false);
                (flashvars['playlistAPI.autoContinue']) ? $('#autoContinue').prop("checked", true) : $('#autoContinue').prop("checked", false);
                (flashvars['playlistAPI.autoPlay']) ? $('#playlistAutoPlay').prop("checked", true) : $('#playlistAutoPlay').prop("checked", false);
                (flashvars['playlistAPI.loop']) ? $('#playlistLoop').prop("checked", true) : $('#playlistLoop').prop("checked", false);
                (flashvars['playlistAPI.hideClipPoster']) ? $('#hideClipPost').prop("checked", true) : $('#hideClipPost').prop("checked", false);
                $('#smh-modal3 #plist-min-clips').val(flashvars['playlistAPI.MinClips']);
                $('#smh-modal3 #plist-max-clips').val(flashvars['playlistAPI.MaxClips']);
                $('#smh-modal3 #plist-init-entryid').val(flashvars['playlistAPI.initItemEntryId']);
            }
            if (flashvars['smhVR.plugin']) {
                var format = flashvars['smhVR.iframeHTML5Js1'];
                if (format === '{onPagePluginPath}/smhVR/js/vrIframeAddin2D.js') {
                    $('#smh-modal3 #vr-format-options select').val('2d');
                } else if (format === '{onPagePluginPath}/smhVR/js/vrIframeAddinSBS.js') {
                    $('#smh-modal3 #vr-format-options select').val('sbs');
                } else if (format === '{onPagePluginPath}/smhVR/js/vrIframeAddinTB.js') {
                    $('#smh-modal3 #vr-format-options select').val('tb');

                }
                if (flashvars['smhVR.fallbackEntryID']) {
                    $('#update-fb-eid').text(flashvars['smhVR.fallbackEntryID']);
                }
                if (!flashvars['smhVR.showCompMessage'] && typeof flashvars['smhVR.showCompMessage'] !== 'undefined') {
                    $('#smh-modal3 #error-comp').prop('checked', false);
                } else {
                    $('#smh-modal3 #error-comp').prop('checked', true);
                }
                $('#smh-modal3 #vr-enabled').click();
            }
        }

        $('#smh-modal3 #plist-entries').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
        $('#smh-modal3 #entries-wrapper .panel-body').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        if (uiconf_id == 6709441) {
            if (edit) {
                $.each(PLAYLIST_ENTRIES, function (index, value) {
                    $('#plist-entries .mCSB_container').append(value);
                });
                $('#playlist-info #plist_num').html($('#plist-entries .mCSB_container div.entry-wrapper').length);
            }
            $('#smh-modal3').on('click', '.basic-tab', function () {
                $('.player_preview').css('display', 'block');
                $('#multi-content-wrapper').css('display', 'none');
            });
            $('#smh-modal3').on('click', '.display-tab', function () {
                $('.player_preview').css('display', 'block');
                $('#multi-content-wrapper').css('display', 'none');
            });
            $('#smh-modal3').on('click', '.playlist-tab', function () {
                $('.player_preview').css('display', 'block');
                $('#multi-content-wrapper').css('display', 'none');
            });
            $('#smh-modal3').on('click', '.ad-tab', function () {
                $('.player_preview').css('display', 'block');
                $('#multi-content-wrapper').css('display', 'none');
            });
            $('#smh-modal3').on('click', '.custom-tab', function () {
                $('.player_preview').css('display', 'block');
                $('#multi-content-wrapper').css('display', 'none');
            });
            $('#smh-modal3').on('click', '.content-tab', function () {
                $('.player_preview').css('display', 'none');
                $('#multi-content-wrapper').css('display', 'block');
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
            initval: flashvars['closedCaptions.glowBlur'],
            min: 0,
            max: 10000,
            step: 1,
            verticalbuttons: true
        });
        $("#smh-modal3 input[name='cap_fontsize']").TouchSpin({
            initval: flashvars['closedCaptions.fontsize'],
            min: 0,
            max: 10000,
            step: 1,
            verticalbuttons: true
        });
        $('.cap_textcolor').colorpicker({
            format: 'hex'
        }).on('changeColor.colorpicker', function (event) {
            flashvars['closedCaptions.fontColor'] = event.color.toHex();
        });
        $('.cap_glowcolor').colorpicker({
            format: 'hex'
        }).on('changeColor.colorpicker', function (event) {
            flashvars['closedCaptions.glowColor'] = event.color.toHex();
        });
        $('.cap_backcolor').colorpicker({
            format: 'hex'
        }).on('changeColor.colorpicker', function (event) {
            flashvars['closedCaptions.bg'] = event.color.toHex();
        });
        $('.style_button_color').colorpicker({
            format: 'hex'
        }).on('changeColor.colorpicker', function (event) {
            var rgb = event.color.toRGB();
            if (flashvars['theme.applyToLargePlayButton']) {
                var largePlayBtn = $("#smh_player_ifp").contents().find(".largePlayBtn");
                largePlayBtn.css("cssText", largePlayBtn.attr('style') + '; ' + "background: rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + rgb.a + ") !important;");
            }
            var btnColor = $("#smh_player_ifp").contents().find(".mwPlayerContainer:not(.mobileSkin) .btn:not(.playHead)");
            btnColor.css("cssText", btnColor.attr('style') + '; ' + "background: rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + rgb.a + ") !important;");
            flashvars['theme.buttonsColor'] = event.color.toHex();
        });
        $('.style_button_icon_color').colorpicker({
            format: 'hex'
        }).on('changeColor.colorpicker', function (event) {
            if (flashvars['theme.applyToLargePlayButton']) {
                var largePlayBtn = $("#smh_player_ifp").contents().find(".largePlayBtn");
                largePlayBtn.css("cssText", largePlayBtn.attr('style') + '; ' + "color: " + event.color.toHex() + " !important;");
            }
            var btnColor = $("#smh_player_ifp").contents().find(".mwPlayerContainer:not(.mobileSkin) .btn:not(.playHead)");
            btnColor.css("cssText", btnColor.attr('style') + '; ' + "color: " + event.color.toHex() + " !important;");
            flashvars['theme.buttonsIconColor'] = event.color.toHex();
        });
        $('.style_slider_color').colorpicker({
            format: 'hex'
        }).on('changeColor.colorpicker', function (event) {
            var rgb = event.color.toRGB();
            var sliderColor = $("#smh_player_ifp").contents().find(".scrubber");
            sliderColor.css("cssText", sliderColor.attr('style') + '; ' + "background: rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + rgb.a + ") !important;");
            var volSliderColor = $("#smh_player_ifp").contents().find(".volumeControl .slider");
            volSliderColor.css("cssText", volSliderColor.attr('style') + '; ' + "background: rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + rgb.a + ") !important;");
            flashvars['theme.sliderColor'] = event.color.toHex();
        });
        $('.style_scrubber_color').colorpicker({
            format: 'hex'
        }).on('changeColor.colorpicker', function (event) {
            var rgb = event.color.toRGB();
            var scrubberColor = $("#smh_player_ifp").contents().find(".playHead");
            scrubberColor.css("cssText", scrubberColor.attr('style') + '; ' + "background: rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + rgb.a + ") !important;");
            flashvars['theme.scrubberColor'] = event.color.toHex();
        });
        $('.style_contbar_color').colorpicker({
            format: 'hex'
        }).on('changeColor.colorpicker', function (event) {
            var rgb = event.color.toRGB();
            var contbarColor = $("#smh_player_ifp").contents().find(".controlsContainer");
            contbarColor.css("cssText", contbarColor.attr('style') + '; ' + "background: rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + rgb.a + ") !important;");
            flashvars['theme.controlsBkgColor'] = event.color.toHex();
        });
        $('.style_slider_watched_color').colorpicker({
            format: 'hex'
        }).on('changeColor.colorpicker', function (event) {
            var rgb = event.color.toRGB();
            var watchedColor = $("#smh_player_ifp").contents().find(".scrubber .watched");
            watchedColor.css("cssText", watchedColor.attr('style') + '; ' + "background: rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + rgb.a + ") !important;");
            flashvars['theme.watchedSliderColor'] = event.color.toHex();
        });
        $('.style_slider_buffer_color').colorpicker({
            format: 'hex'
        }).on('changeColor.colorpicker', function (event) {
            var rgb = event.color.toRGB();
            var bufferColor = $("#smh_player_ifp").contents().find(".scrubber .buffered");
            bufferColor.css("cssText", bufferColor.attr('style') + '; ' + "background: rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + rgb.a + ") !important;");
            flashvars['theme.bufferedSliderColor'] = event.color.toHex();
        });

        $('.collapse').on('shown.bs.collapse', function () {
            $(this).parent().find(".fa-caret-right").removeClass("fa-caret-right").addClass("fa-caret-down");
        }).on('hidden.bs.collapse', function () {
            $(this).parent().find(".fa-caret-down").removeClass("fa-caret-down").addClass("fa-caret-right");
        });

        $('.player-tab .options').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
        smhPlayers.renderPlayer();
    },
    selectFBModal: function () {
        if ($("#smh-modal3 #vr-enabled").is(':checked')) {
            smhPlayers.resetFilters();
            var header, content, footer;
            $('.smh-dialog2').css('width', '650px');
            $('#smh-modal2').modal({
                backdrop: 'static'
            });

            $('#smh-modal2').css('z-index', '2000');
            $('#smh-modal2 .modal-body').css('padding', '15px 15px 0');
            $('#smh-modal3').css('z-index', '1050');

            header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Fallback EntryId</h4>';
            $('#smh-modal2 .modal-header').html(header);

            var tree = smhPlayers.json_tree(categories, 'cat');
            var tree_ac = smhPlayers.json_tree(ac, 'ac');
            var tree_flavors = smhPlayers.json_tree(flavors, 'flavors');

            content = '<div class="col-sm-11 center-block" style="margin-bottom: 20px; text-align: center;">Select the EntryId the player should fallback to if the browser does not support VR</div>' +
                    '<div class="col-sm-11 center-block">' +
                    '<div class="radio"><label><input name="fb_list" id="no_fb" value="0" checked="" type="radio"> No Fallback</label></div>' +
                    '<hr style="width: 100%; height: 1px; margin-bottom: 10px; margin-top: 10px;">' +
                    '<div id="fb-wrapper">' +
                    '<span class="dropdown header dropdown-accordion">' +
                    '<div class="btn-group">' +
                    '<button type="button" class="btn btn-default filter-btn"><span class="text">Filters</span></button>' +
                    '<button aria-expanded="false" data-toggle="dropdown" id="dropdownMenu" type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button>' +
                    '<ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu">' +
                    '<li role="presentation">' +
                    '<div class="panel-group" id="accordion">' +
                    '<div class="panel panel-default">' +
                    '<div class="panel-heading">' +
                    '<h4 class="panel-title">' +
                    '<a href="#collapseFBOne" data-toggle="collapse" data-parent="#accordion">' +
                    'Filter by Categories' +
                    '</a>' +
                    '</h4>' +
                    '</div>' +
                    '<div class="panel-collapse collapse in" id="collapseFBOne">' +
                    '<div class="panel-body">' +
                    '<div id="tree1">' +
                    '<div class="filter-header">' +
                    '<ul>' +
                    '<li>' +
                    '<div class="checkbox"><label><input type="checkbox" value="all" class="cat_all" checked> <b>All Categories</b></label></div>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '<div class="filter-body cat-filter">' +
                    tree +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="panel panel-default">' +
                    '<div class="panel-heading">' +
                    '<h4 class="panel-title">' +
                    '<a href="#collapseFBTwo" data-toggle="collapse" data-parent="#accordion">' +
                    'Additional Filters' +
                    '</a>' +
                    '</h4>' +
                    '</div>' +
                    '<div class="panel-collapse collapse" id="collapseFBTwo">' +
                    '<div class="panel-body">' +
                    '<div id="tree2">' +
                    '<div id="filter-header">' +
                    '<ul>' +
                    '<li>' +
                    '<div class="checkbox"><label><input type="checkbox" value="all" class="media_all" checked> <b>All Media Types</b></label></div>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '<div class="filter-body media-filter">' +
                    '<ul>' +
                    '<li>' +
                    '<div class="checkbox"><label><input type="checkbox" value="1" class="media_list"> Video</label></div>' +
                    '</li>' +
                    '<li>' +
                    '<div class="checkbox"><label><input type="checkbox" value="2" class="media_list"> Image</label></div>' +
                    '</li>' +
                    '<li>' +
                    '<div class="checkbox"><label><input type="checkbox" value="5" class="media_list"> Audio</label></div>' +
                    '</li>' +
                    '<li>' +
                    '<div class="checkbox"><label><input type="checkbox" value="100" class="media_list"> Live Stream</label></div>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '<div id="filter-header" style="margin-top: 13px;">' +
                    '<ul>' +
                    '<li>' +
                    '<div class="checkbox"><label><input type="checkbox" value="all" class="durations_all" checked> <b>All Durations</b></label></div>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '<div class="filter-body duration-filter">' +
                    '<ul>' +
                    '<li>' +
                    '<div class="checkbox"><label><input type="checkbox" value="short" class="duration_list"> Short (0-4 min.)</label></div>' +
                    '</li>' +
                    '<li>' +
                    '<div class="checkbox"><label><input type="checkbox" value="medium" class="duration_list"> Medium (4-20 min.)</label></div>' +
                    '</li>' +
                    '<li>' +
                    '<div class="checkbox"><label><input type="checkbox" value="long" class="duration_list"> Long (20+ min.)</label></div>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '<div id="filter-header" style="margin-top: 13px;">' +
                    '<ul>' +
                    '<li>' +
                    '<div class="checkbox"><label><input type="checkbox" value="all" class="clipped_all" checked> <b>All Original & Clipped Entries</b></label></div>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '<div class="filter-body clipped-filter">' +
                    '<ul>' +
                    '<li>' +
                    '<div class="checkbox"><label><input type="checkbox" value="1" class="clipped_list"> Original Entries</label></div>' +
                    '</li>' +
                    '<li>' +
                    '<div class="checkbox"><label><input type="checkbox" value="0" class="clipped_list"> Clipped Entries</label></div>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '<div id="filter-header" style="margin-top: 13px;">' +
                    '<ul>' +
                    '<li>' +
                    '<div class="checkbox"><label><input type="checkbox" value="all" class="ac_all" checked> <b>All Access Control Profiles</b></label></div>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '<div class="filter-body ac-filter">' +
                    tree_ac +
                    '</div>' +
                    '<div id="filter-header" style="margin-top: 13px;">' +
                    '<ul>' +
                    '<li>' +
                    '<div class="checkbox"><label><input type="checkbox" value="all" class="flavors_all" checked> <b>All Flavors</b></label></div>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '<div class="filter-body flavors-filter">' +
                    tree_flavors +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '</span>' +
                    '</div>' +
                    '<div id="fblist-table"></div>' +
                    '</div>' +
                    '</div>';

            $('#smh-modal2 .modal-body').html(content);

            footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="doFBSelect">Select</button>';
            $('#smh-modal2 .modal-footer').html(footer);

            $('#smh-modal2 #tree1').tree({
                collapseDuration: 100,
                expandDuration: 100,
                onCheck: {
                    ancestors: null
                }
            });

            $('#smh-modal2 #tree2').tree({
                collapseDuration: 100,
                expandDuration: 100,
                onCheck: {
                    ancestors: null
                }
            });

            $('#smh-modal2 #fb-wrapper .panel-body').mCustomScrollbar({
                theme: "inset-dark",
                scrollButtons: {
                    enable: true
                }
            });

            $('#smh-modal2 #tree1').on('change', ".cat_all", function () {
                if ($(this).is(":checked")) {
                    $('#smh-modal2 .cat-filter input[type="checkbox"]').each(function () {
                        $(this).prop('checked', false);
                    });
                } else {
                    $(this).prop('checked', true);
                }
                categoryIDs = [];
                smhPlayers.loadEntries_fblist();
            });
            $('#smh-modal2 #tree1').on('click', ".cat_list", function () {
                setTimeout(function () {
                    var anyBoxesChecked = false;
                    categoryIDs = [];
                    $('#smh-modal2 .cat-filter input[type="checkbox"]').each(function () {
                        if ($(this).is(":checked")) {
                            anyBoxesChecked = true;
                            var checkbox_value = $(this).val();
                            categoryIDs.push(checkbox_value);
                        }
                    });
                    if (anyBoxesChecked == true) {
                        $('#smh-modal2 .cat_all').prop('checked', false);
                    } else {
                        $('#smh-modal2 .cat_all').prop('checked', true);
                    }
                }, 50);
                setTimeout(function () {
                    smhPlayers.loadEntries_fblist();
                }, 100);
            });
            $('#smh-modal2 #tree2').on('change', ".media_all", function () {
                if ($(this).is(":checked")) {
                    $('#smh-modal2 .media-filter input[type="checkbox"]').each(function () {
                        $(this).prop('checked', false);
                    });
                } else {
                    $(this).prop('checked', true);
                }
                mediaTypes = [];
                smhPlayers.loadEntries_fblist();
            });
            $('#smh-modal2 #tree2').on('click', ".media_list", function () {
                var anyBoxesChecked = false;
                mediaTypes = [];
                $('#smh-modal2 .media-filter input[type="checkbox"]').each(function () {
                    if ($(this).is(":checked")) {
                        anyBoxesChecked = true;
                        var checkbox_value = $(this).val();
                        mediaTypes.push(checkbox_value);
                    }
                });
                if (anyBoxesChecked == true) {
                    $('#smh-modal2 .media_all').prop('checked', false);
                } else {
                    $('#smh-modal2 .media_all').prop('checked', true);
                }
                smhPlayers.loadEntries_fblist();
            });
            $('#smh-modal2 #tree2').on('change', ".durations_all", function () {
                if ($(this).is(":checked")) {
                    $('.duration-filter input[type="checkbox"]').each(function () {
                        $(this).prop('checked', false);
                    });
                } else {
                    $(this).prop('checked', true);
                }
                duration = [];
                smhPlayers.loadEntries_fblist();
            });
            $('#smh-modal2 #tree2').on('click', ".duration_list", function () {
                var anyBoxesChecked = false;
                duration = [];
                $('#smh-modal2 .duration-filter input[type="checkbox"]').each(function () {
                    if ($(this).is(":checked")) {
                        anyBoxesChecked = true;
                        var checkbox_value = $(this).val();
                        duration.push(checkbox_value);
                    }
                });
                if (anyBoxesChecked == true) {
                    $('#smh-modal2 .durations_all').prop('checked', false);
                } else {
                    $('#smh-modal2 .durations_all').prop('checked', true);
                }
                smhPlayers.loadEntries_fblist();
            });
            $('#smh-modal2 #tree2').on('change', ".clipped_all", function () {
                if ($(this).is(":checked")) {
                    $('#smh-modal2 .clipped-filter input[type="checkbox"]').each(function () {
                        $(this).prop('checked', false);
                    });
                } else {
                    $(this).prop('checked', true);
                }
                clipped = [];
                smhPlayers.loadEntries_fblist();
            });
            $('#smh-modal2 #tree2').on('click', ".clipped_list", function () {
                var anyBoxesChecked = false;
                clipped = [];
                $('#smh-modal2 .clipped-filter input[type="checkbox"]').each(function () {
                    if ($(this).is(":checked")) {
                        anyBoxesChecked = true;
                        var checkbox_value = $(this).val();
                        clipped.push(checkbox_value);
                    }
                });
                if (anyBoxesChecked == true) {
                    $('#smh-modal2 .clipped_all').prop('checked', false);
                } else {
                    $('#smh-modal2 .clipped_all').prop('checked', true);
                }
                smhPlayers.loadEntries_fblist();
            });
            $('#smh-modal2 #tree2').on('change', ".ac_all", function () {
                if ($(this).is(":checked")) {
                    $('#smh-modal2 .ac-filter input[type="checkbox"]').each(function () {
                        $(this).prop('checked', false);
                    });
                } else {
                    $(this).prop('checked', true);
                }
                ac_filter = [];
                smhPlayers.loadEntries_fblist();
            });
            $('#smh-modal2 #tree2').on('click', ".ac_list", function () {
                var anyBoxesChecked = false;
                ac_filter = [];
                $('#smh-modal2 .ac-filter input[type="checkbox"]').each(function () {
                    if ($(this).is(":checked")) {
                        anyBoxesChecked = true;
                        var checkbox_value = $(this).val();
                        ac_filter.push(checkbox_value);
                    }
                });
                if (anyBoxesChecked == true) {
                    $('#smh-modal2 .ac_all').prop('checked', false);
                } else {
                    $('#smh-modal2 .ac_all').prop('checked', true);
                }
                smhPlayers.loadEntries_fblist();
            });
            $('#smh-modal2 #tree2').on('change', ".flavors_all", function () {
                if ($(this).is(":checked")) {
                    $('#smh-modal2 .flavors-filter input[type="checkbox"]').each(function () {
                        $(this).prop('checked', false);
                    });
                } else {
                    $(this).prop('checked', true);
                }
                flavors_filter = [];
                smhPlayers.loadEntries_fblist();
            });
            $('#smh-modal2 #tree2').on('click', ".flavors_list", function () {
                var anyBoxesChecked = false;
                flavors_filter = [];
                $('#smh-modal2 .flavors-filter input[type="checkbox"]').each(function () {
                    if ($(this).is(":checked")) {
                        anyBoxesChecked = true;
                        var checkbox_value = $(this).val();
                        flavors_filter.push(checkbox_value);
                    }
                });
                if (anyBoxesChecked == true) {
                    $('#smh-modal2 .flavors_all').prop('checked', false);
                } else {
                    $('#smh-modal2 .flavors_all').prop('checked', true);
                }
                smhPlayers.loadEntries_fblist();
            });

            // Collapse accordion every time dropdown is shown
            $('#smh-modal2 #fb-wrapper .dropdown-accordion').on('show.bs.dropdown', function (event) {
                var accordion = $(this).find($(this).data('accordion'));
                accordion.find('.panel-collapse.in').collapse('hide');
            });

            // Prevent dropdown to be closed when we click on an accordion link
            $('#smh-modal2 #fb-wrapper .dropdown-accordion').on('click', 'a[data-toggle="collapse"]', function (event) {
                event.preventDefault();
                event.stopPropagation();
                $('#fb-wrapper ' + $(this).data('parent')).find('.panel-collapse.in').collapse('hide');
                $($(this).attr('href')).collapse('show');
            });

            $('#smh-modal2 .dropdown-accordion').on('click', '.panel-body', function (event) {
                event.stopPropagation();
            });
            smhPlayers.loadEntries_fblist();
        }
    },
    loadEntries_fblist: function () {
        var categories_id = categoryIDs.join();
        var mediaTypes_id = mediaTypes.join();
        var durations = duration.join();
        var clipped_id = clipped.join();
        var ac_id = ac_filter.join();
        var flavors_id = flavors_filter.join();
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#smh-modal2 #fblist-table').empty();
        $('#smh-modal2 #fblist-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="fblist-data"></table>');
        fbTable = $('#smh-modal2 #fblist-data').DataTable({
            "dom": 'R<"H"lfr>t<"F"ip>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": true,
            "serverSide": true,
            "autoWidth": false,
            "pagingType": "bootstrap",
            "pageLength": 10,
            "searching": true,
            "info": false,
            "lengthChange": false,
            "scrollCollapse": true,
            "scrollY": "425px",
            "ajax": {
                "url": "/api/v1/getVREntries",
                "type": "GET",
                "data": function (d) {
                    return $.extend({}, d, {
                        "_token": $('meta[name="csrf-token"]').attr('content'),
                        "action": "get_vr_fbcontent",
                        "ks": sessInfo.ks,
                        "tz": tz,
                        "category": categories_id,
                        "mediaType": mediaTypes_id,
                        "duration": durations,
                        "clipped": clipped_id,
                        "ac": ac_id,
                        "flavors": flavors_id
                    });
                }
            },
            "language": {
                "zeroRecords": "No Entries Found"
            },
            "columns": [
                {
                    "title": "<span style='float: left;'></span>",
                    "width": "10px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Entries</div></span>",
                    "width": "80px"
                }
            ],
            "drawCallback": function (oSettings) {
                smhMain.fcmcAddRows(this, 2, 10);
            }
        });
        $('#smh-modal2 #fblist-table .dataTables_scrollBody').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
    },
    //Resets filters
    resetFilters: function () {
        categoryIDs = [];
        mediaTypes = [];
        duration = [];
        clipped = [];
        ac_filter = [];
        flavors_filter = [];
        limit = 20;
        order = '-recent';
    },
    //Get Categories
    getCats: function () {
        var cb = function (success, results) {
            if (!success)
                alert(results);
            if (results.code && results.message) {
                alert(results.message);
                return;
            } else {
                var categories_arr = [];
                $.each(results.objects, function (index, value) {
                    cats[value.id] = value.fullName;
                    var cat_arr = {};
                    cat_arr['id'] = value.id;
                    cat_arr['parentId'] = value.parentId;
                    cat_arr['name'] = value.name;
                    cat_arr['partnerSortValue'] = value.partnerSortValue;
                    categories_arr.push(cat_arr);
                });
                categories_arr.sort(function (a, b) {
                    return a.partnerSortValue - b.partnerSortValue;
                });
                categories = smhPlayers.getNestedChildren(categories_arr, 0);
            }
        };

        var filter = new KalturaCategoryFilter();
        filter.orderBy = "+name";
        var pager = null;
        client.category.listAction(cb, filter, pager);
    },
    //Get Access Control Profiles
    getAccessControlProfiles: function () {
        var cb = function (success, results) {
            if (!success)
                alert(results);
            if (results.code && results.message) {
                alert(results.message);
                return;
            } else {
                var ac_arr = [];
                $.each(results.objects, function (index, value) {
                    ac_select[value.id] = value.name

                    var ac_obj = {};
                    ac_obj['id'] = value.id;
                    ac_obj['name'] = value.name;
                    ac_obj['parentId'] = 0;
                    ac_obj['children'] = [];
                    ac_arr.push(ac_obj);
                });
                ac = ac_arr;
            }
        };

        var filter = null;
        var pager = null;
        client.accessControlProfile.listAction(cb, filter, pager);
    },
    //Get Conversion Profiles
    getFlavors: function () {
        var cb = function (success, results) {
            if (!success)
                alert(results);
            if (results.code && results.message) {
                alert(results.message);
                return;
            } else {
                var flavors_arr = [];
                $.each(results.objects, function (index, value) {
                    var flavors_obj = {};
                    flavors_obj['id'] = value.id;
                    flavors_obj['name'] = value.name;
                    flavors_obj['parentId'] = 0;
                    flavors_obj['children'] = [];
                    flavors_arr.push(flavors_obj);
                });
                flavors = flavors_arr;
            }
        };

        var pager = null;
        var filter = null;
        client.flavorParams.listAction(cb, filter, pager);
    },
    //Creates nested children
    getNestedChildren: function (arr, parentId) {
        var out = []
        for (var i in arr) {
            if (arr[i].parentId == parentId) {
                var children = smhPlayers.getNestedChildren(arr, arr[i].id)

                if (children.length) {
                    arr[i].children = children
                } else {
                    arr[i].children = []
                }
                out.push(arr[i])
            }
        }
        return out
    },
    //Creates unordered tree
    json_tree: function (data, type) {
        var json = '<ul>';
        for (var i = 0; i < data.length; ++i) {
            if (data[i].children.length) {
                json = json + '<li class="collapsed"><div class="checkbox"><label><input type="checkbox" class="' + type + '_list" value="' + data[i].id + '" /> ' + data[i].name + '</label></div>';
                json = json + smhPlayers.json_tree(data[i].children, type);
            } else {
                json = json + '<li><div class="checkbox"><label><input type="checkbox" class="' + type + '_list" value="' + data[i].id + '" /> ' + data[i].name + '</label></div>';
            }
            json = json + '</li>';
        }
        return json + '</ul>';
    },
    //Load playlists
    loadPlists: function () {
        var LISTING_RESULTS = new Array();
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }

            var myData = results['objects'];
            var i = 0;
            playlist_options = '<option value=""></option>';
            $.each(myData, function (key, value) {
                var theDate = new Date(value['createdAt'] * 1000);
                var newDatetime = theDate.toString("MM/dd/yyyy hh:mm tt");

                var playlistType;
                if (value['playlistType'] == 10) {
                    playlistType = 'Rule Based';
                } else if (value['playlistType'] == 3) {
                    playlistType = 'Manual';
                }

                if (flashvars['related.playlistId'] === value['id']) {
                    playlist_options += '<option value="' + value['id'] + '" selected>' + value['name'] + '</option>';
                } else {
                    playlist_options += '<option value="' + value['id'] + '">' + value['name'] + '</option>';
                }
                var entry_container = '<div class="entry-wrapper" data-entryid="' + value['id'] + '" data-name="' + value['name'] + '">' +
                        '<div class="entry-details">' +
                        '<div class="entry-name">' +
                        '<div>' + value['name'] + '</div>' +
                        '</div>' +
                        '<div class="entry-subdetails">' +
                        '<span style="width: 85px; display: inline-block;">Playlist ID:</span><span>' + value['id'] + '</span>' +
                        '</div>' +
                        '<div class="entry-subdetails">' +
                        '<span style="width: 85px; display: inline-block;">Created on:</span><span>' + newDatetime + '</span>' +
                        '</div>' +
                        '<div class="entry-subdetails">' +
                        '<span style="width: 85px; display: inline-block;">Type:</span><span>' + playlistType + '</span>' +
                        '</div>' +
                        '</div>' +
                        '<div class="tools" onclick="smhPlayers.removeDND(this);">' +
                        '<i class="fa fa-trash-o"></i>' +
                        '</div>' +
                        '<div class="clear"></div>' +
                        '</div>';

                LISTING_RESULTS[i] = new Array(entry_container);
                i++;
            });
            $('#related-playlist').html(playlist_options);
            if (flashvars['related.plugin']) {
                if (!$('#smh-modal3 #related').is(':checked')) {
                    $('#smh-modal3 #related').click();
                }
            }

            $('#smh-modal3 #plist-table').empty();
            $('#smh-modal3 #plist-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="plist-data"></table>');
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
                "drawCallback": function (oSettings) {
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
                        start: function (e, ui) {
                            $('#plist-entries .entry-wrapper').addClass('hover');
                        },
                        stop: function (e, ui) {
                            $('#playlist-info #plist_num').html($('#plist-entries .mCSB_container div.entry-wrapper').length);
                        }
                    });
                }
            });
            $('#smh-modal3 #plist-table .dataTables_scrollBody').mCustomScrollbar({
                theme: "inset-dark",
                scrollButtons: {
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
    removeDND: function (div) {
        $(div).parent("div").remove();
        $('#playlist-info #plist_num').html($('#plist-entries .mCSB_container div.entry-wrapper').length);
    },
    //Ceates Player
    createPlayer: function () {
        var tags = '';
        if (uiconf_id == '6709439' || uiconf_id == '6709441') {
            tags += 'kdp3,playlist';
        } else {
            tags += 'kdp3,player';
        }

        var player_name = $('#smh-modal3 #player_name').val();
        if (player_name == null || player_name == '') {
            smhPlayers.displayError();
        } else {
            var confFile = smhPlayers.createConfig(uiconf_id, player_name);
            var jsonConfig = smhPlayers.createJson();

            var defaults = {
                animatePadding: 60,
                ApiUrl: "/api_v3/index.php?",
                sessSrv: "uiconf",
                sessAct: "add",
                format: "1"
            };

            var options = $.extend(defaults, options);
            var o = options;
            var sessData = {
                ks: sessInfo.ks,
                'uiConf:objectType': 'KalturaUiConf',
                'uiConf:width': flashvars['width'],
                'uiConf:height': flashvars['height'],
                'uiConf:tags': tags,
                'ignoreNull': 1,
                'uiConf:swfUrl': "/flash/kdp3/v3.9.9/kdp3.swf",
                'uiConf:objType': 8,
                'uiConf:creationMode': 2,
                'uiConf:name': player_name,
                'clientTag': 'kmc:v4.2.14.9',
                'uiConf:config': jsonConfig,
                'uiConf:confFile': confFile,
                'uiConf:confVars': 'kalturaLogo.visible=false&kalturaLogo.includeInLayout=false'
            };
            var reqObj = {
                service: o.sessSrv,
                action: o.sessAct,
                format: o.format

            };
            var reqUrl = o.ApiUrl + $.param(reqObj);

            $.ajax({
                cache: false,
                url: reqUrl,
                type: 'POST',
                async: false,
                data: sessData,
                dataType: 'json',
                beforeSend: function () {
                    $('#create-player').attr('disabled', '');
                    $('#smh-modal3 #loading img').css('display', 'inline-block');
                },
                success: function (data) {
                    $('#smh-modal3 #loading').empty();
                    $('#smh-modal3 #pass-result').html('<span class="label label-success">Successfully Created!</span>');
                    setTimeout(function () {
                        $('#smh-modal3 #pass-result').empty();
                        $('#smh-modal3').modal('hide');
                    }, 3000);
                    smhPlayers.getPlayers();
                }
            });
        }
    },
    //Update Player
    updatePlayer: function () {
        var tags = '';
        if (uiconf_id == '6709439' || uiconf_id == '6709441') {
            tags += 'kdp3,playlist';
        } else {
            tags += 'kdp3,player';
        }

        var player_name = $('#smh-modal3 #player_name').val();
        if (player_name == null || player_name == '') {
            smhPlayers.displayError();
        } else {
            var jsonConfig = smhPlayers.createJson();
            var confFile = smhPlayers.createConfig(uiconf_id, player_name);

            var defaults = {
                animatePadding: 60,
                ApiUrl: "/api_v3/index.php?",
                sessSrv: "uiconf",
                sessAct: "update",
                format: "1"
            };

            var options = $.extend(defaults, options);
            var o = options;
            var sessData = {
                ks: sessInfo.ks,
                id: player_id,
                'uiConf:objectType': 'KalturaUiConf',
                'uiConf:width': flashvars['width'],
                'uiConf:height': flashvars['height'],
                'uiConf:tags': tags,
                'ignoreNull': 1,
                'uiConf:swfUrl': "/flash/kdp3/v3.9.9/kdp3.swf",
                'uiConf:objType': 8,
                'uiConf:creationMode': 2,
                'uiConf:name': player_name,
                'clientTag': 'kmc:v4.2.14.9',
                'uiConf:config': jsonConfig,
                'uiConf:confFile': confFile,
                'uiConf:confVars': 'kalturaLogo.visible=false&kalturaLogo.includeInLayout=false'
            };
            var reqObj = {
                service: o.sessSrv,
                action: o.sessAct,
                format: o.format

            };
            var reqUrl = o.ApiUrl + $.param(reqObj);

            $.ajax({
                cache: false,
                url: reqUrl,
                type: 'POST',
                async: false,
                data: sessData,
                dataType: 'json',
                beforeSend: function () {
                    $('.update-player').attr('disabled', '');
                    $('#smh-modal3 #loading img').css('display', 'inline-block');
                },
                success: function (data) {
                    var purgeResponse = smhPlayers.purgeCache('player');
                    if (purgeResponse) {
                        $('#smh-modal3 #loading').empty();
                        $('#smh-modal3 #pass-result').html('<span class="label label-success">Successfully Updated!</span>');
                    } else {
                        $('#smh-modal3 #loading').empty();
                        $('#smh-modal3 #pass-result').html('<span class="label label-danger">Error: Could not purge cache</span>');
                    }
                    setTimeout(function () {
                        $('#smh-modal3 #pass-result').empty();
                        $('#smh-modal3').modal('hide');
                    }, 3000);
                    smhPlayers.getPlayers();
                }
            });
        }
    },
    //Display player errors
    displayError: function () {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '540px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal3').css('z-index', '2');

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Error</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = "<div style='margin-left: auto; margin-right: auto; text-align: center; height: 50px; margin-top: 20px;'>You must enter a player name</div>";
        $('#smh-modal2 .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button>';
        $('#smh-modal2 .modal-footer').html(footer);
    },
    createJson: function () {
        var json = {};
        var plugins = {};
        var uivars = [];

        if (flashvars['controlBarContainer.plugin']) {
            plugins['controlBarContainer'] = {
                "plugin": true
            }
            if (flashvars['controlBarContainer.hover']) {
                plugins['controlBarContainer'].hover = true;
            }
        } else {
            plugins['controlBarContainer'] = {
                "plugin": false
            }
        }

        if (flashvars['titleLabel.plugin']) {
            plugins['titleLabel'] = {
                "plugin": true,
                "text": '{mediaProxy.entry.name}',
                'align': flashvars['titleLabel.align'],
                'truncateLongTitles': flashvars['titleLabel.truncateLongTitles']
            }
        }

        if (flashvars['watermark.plugin']) {
            plugins['watermark'] = {
                "plugin": true,
                "cssClass": flashvars['watermark.watermarkPosition'],
                "img": flashvars['watermark.watermarkPath'],
                "href": flashvars['watermark.watermarkClickPath'],
                "padding": flashvars['watermark.padding']
            }
        }

        if (flashvars['logo.plugin']) {
            plugins['logo'] = {
                "plugin": true,
                "img": flashvars['logo.img'],
                "href": flashvars['logo.href'],
                "title": flashvars['logo.title']
            }
        } else {
            plugins['logo'] = {
                "plugin": false
            }
        }

        if (flashvars['currentTimeLabel.plugin']) {
            plugins['currentTimeLabel'] = {
                "plugin": true
            }
        } else {
            plugins['currentTimeLabel'] = {
                "plugin": false
            }
        }

        if (flashvars['durationLabel.plugin']) {
            plugins['durationLabel'] = {
                "plugin": true
            }
        } else {
            plugins['durationLabel'] = {
                "plugin": false
            }
        }

        if (flashvars['sourceSelector.plugin']) {
            plugins['sourceSelector'] = {
                "plugin": true,
                "switchOnResize": flashvars['sourceSelector.switchOnResize'],
                "simpleFormat": flashvars['sourceSelector.simpleFormat']
            }
            uivars.push({
                "key": "mediaProxy.preferedFlavorBR",
                "value": $('#smh-modal3 #pre-flavor').val()
            });
        }

        if (flashvars['fullScreenBtn.plugin']) {
            plugins['fullScreenBtn'] = {
                "plugin": true
            }
        } else {
            plugins['fullScreenBtn'] = {
                "plugin": false
            }
        }

        if (flashvars['largePlayBtn.plugin']) {
            plugins['largePlayBtn'] = {
                "plugin": true
            }
        } else {
            plugins['largePlayBtn'] = {
                "plugin": false
            }
        }

        if (flashvars['playPauseBtn.plugin']) {
            plugins['playPauseBtn'] = {
                "plugin": true
            }
        } else {
            plugins['playPauseBtn'] = {
                "plugin": false
            }
        }

        if (flashvars['volumeControl.plugin']) {
            plugins['volumeControl'] = {
                "plugin": true,
                "showSlider": flashvars['volumeControl.showSlider'],
                "pinVolumeBar": flashvars['volumeControl.pinVolumeBar']
            }
        } else {
            plugins['volumeControl'] = {
                "plugin": false
            }
        }

        if (flashvars['scrubber.plugin']) {
            plugins['scrubber'] = {
                "plugin": true
            }
        } else {
            plugins['scrubber'] = {
                "plugin": false
            }
        }

        if (flashvars['chromecast.plugin']) {
            plugins['chromecast'] = {
                "plugin": true,
                "parent": flashvars['chromecast.parent'],
                "align": flashvars['chromecast.align']
            }
            if (flashvars['chromecast.logoUrl'] && flashvars['chromecast.logoUrl'] != '') {
                plugins['chromecast'].logoUrl = flashvars['chromecast.logoUrl'];
            }
        }

        if (flashvars['share.plugin']) {
            plugins['share'] = {
                "plugin": true,
                "parent": flashvars['share.parent'],
                "align": flashvars['share.align'],
                "socialShareURL": flashvars['share.socialShareURL'],
                "socialNetworks": flashvars['share.socialNetworks'],
                "socialShareEnabled": flashvars['share.socialShareEnabled'],
                "embedEnabled": flashvars['share.embedEnabled'],
                "allowTimeOffset": flashvars['share.allowTimeOffset'],
                "allowSecuredEmbed": flashvars['share.allowSecuredEmbed'],
                "emailEnabled": flashvars['share.emailEnabled'],
                "shareUiconfID": flashvars['share.shareUiconfID'],
                "embedOptions": {
                    "streamerType": flashvars['share.embedOptions.streamerType'],
                    "uiconfID": flashvars['share.embedOptions.uiconfID'],
                    "width": flashvars['width'],
                    "height": flashvars['height'],
                    "borderWidth": flashvars['share.embedOptions.borderWidth']
                },
                "shareConfig": {
                    "facebook": {
                        "name": flashvars['share.shareConfig.facebook.name'],
                        "icon": flashvars['share.shareConfig.facebook.icon'],
                        "cssClass": flashvars['share.shareConfig.facebook.cssClass'],
                        "template": flashvars['share.shareConfig.facebook.template'],
                        "redirectUrl": flashvars['share.shareConfig.facebook.redirectUrl']
                    },
                    "twitter": {
                        "name": flashvars['share.shareConfig.twitter.name'],
                        "icon": flashvars['share.shareConfig.twitter.icon'],
                        "cssClass": flashvars['share.shareConfig.twitter.cssClass'],
                        "template": flashvars['share.shareConfig.twitter.template'],
                        "redirectUrl": flashvars['share.shareConfig.twitter.redirectUrl']
                    },
                    "googleplus": {
                        "name": flashvars['share.shareConfig.googleplus.name'],
                        "icon": flashvars['share.shareConfig.googleplus.icon'],
                        "cssClass": flashvars['share.shareConfig.googleplus.cssClass'],
                        "template": flashvars['share.shareConfig.googleplus.template'],
                        "redirectUrl": flashvars['share.shareConfig.googleplus.redirectUrl']
                    },
                    "email": {
                        "name": flashvars['share.shareConfig.email.name'],
                        "icon": flashvars['share.shareConfig.email.icon'],
                        "cssClass": flashvars['share.shareConfig.email.cssClass'],
                        "template": flashvars['share.shareConfig.email.template'],
                        "redirectUrl": flashvars['share.shareConfig.email.redirectUrl']
                    },
                    "linkedin": {
                        "name": flashvars['share.shareConfig.linkedin.name'],
                        "icon": flashvars['share.shareConfig.linkedin.icon'],
                        "cssClass": flashvars['share.shareConfig.linkedin.cssClass'],
                        "template": flashvars['share.shareConfig.linkedin.template'],
                        "redirectUrl": flashvars['share.shareConfig.linkedin.redirectUrl']
                    },
                    "sms": {
                        "name": flashvars['share.shareConfig.sms.name'],
                        "icon": flashvars['share.shareConfig.sms.icon'],
                        "cssClass": flashvars['share.shareConfig.sms.cssClass'],
                        "template": flashvars['share.shareConfig.sms.template'],
                        "redirectUrl": flashvars['share.shareConfig.sms.redirectUrl']
                    }
                }
            }
        }

        if (flashvars['download.plugin']) {
            plugins['download'] = {
                "plugin": true,
                "parent": flashvars['download.parent'],
                "align": flashvars['download.align'],
                "flavorID": flashvars['download.flavorID'],
                "preferredBitrate": flashvars['download.preferredBitrate']
            }
        }

        if (flashvars['captureThumbnail.plugin']) {
            plugins['captureThumbnail'] = {
                "plugin": true,
                "tooltip": flashvars['captureThumbnail.tooltip']
            }
        }

        if (flashvars['playbackRateSelector.plugin']) {
            plugins['playbackRateSelector'] = {
                "plugin": true,
                "defaultSpeed": flashvars['playbackRateSelector.defaultSpeed']
            }
        }

        if (flashvars['resumePlayback.plugin']) {
            plugins['resumePlayback'] = {
                "plugin": true,
                "iframeHTML5Js1": '{onPagePluginPath}/resumePlayback/js/resume.js'
            }
        }

        if (flashvars['closedCaptions.plugin']) {
            plugins['closedCaptions'] = {
                "plugin": true,
                "layout": flashvars['closedCaptions.layout'],
                "displayCaptions": flashvars['closedCaptions.displayCaptions'],
                "fontFamily": flashvars['closedCaptions.fontFamily'],
                "fontsize": flashvars['closedCaptions.fontsize'],
                "fontColor": flashvars['closedCaptions.fontColor'],
                "bg": flashvars['closedCaptions.bg'],
                "useGlow": flashvars['closedCaptions.useGlow'],
                "glowBlur": flashvars['closedCaptions.glowBlur'],
                "glowColor": flashvars['closedCaptions.glowColor'],
                "hideWhenEmpty": flashvars['closedCaptions.hideWhenEmpty'],
                "showEmbeddedCaptions": flashvars['closedCaptions.showEmbeddedCaptions']
            }
        }

        if (flashvars['related.plugin']) {
            plugins['related'] = {
                "plugin": true,
                "parent": flashvars['related.parent'],
                "align": flashvars['related.align'],
                "displayOnPlaybackDone": flashvars['related.displayOnPlaybackDone'],
                "autoContinueEnabled": flashvars['related.autoContinueEnabled'],
                "autoContinueTime": flashvars['related.autoContinueTime'],
                "itemsLimit": flashvars['related.itemsLimit']
            }
            if (flashvars['related.playlistId'] && flashvars['related.playlistId'] != '') {
                plugins['related'].playlistId = flashvars['related.playlistId'];
            }
            if (flashvars['related.entryList'] && flashvars['related.entryList'] != '') {
                plugins['related'].entryList = flashvars['related.entryList'];
            }
        }

        if (flashvars['bumper.plugin']) {
            plugins['bumper'] = {
                "plugin": true,
                "bumperEntryID": flashvars['bumper.bumperEntryID'],
                "clickurl": flashvars['bumper.clickurl'],
                "lockUI": flashvars['bumper.lockUI'],
                "preSequence": flashvars['bumper.preSequence'],
                "postSequence": flashvars['bumper.postSequence']
            }
        }

        if (flashvars['vast.plugin']) {
            plugins['vast'] = {
                "plugin": true,
                "pauseAdOnClick": flashvars['vast.pauseAdOnClick'],
                "enableCORS": flashvars['vast.enableCORS'],
                "loadAdsOnPlay": flashvars['vast.loadAdsOnPlay'],
                "numPreroll": flashvars['vast.numPreroll'],
                "prerollInterval": flashvars['vast.prerollInterval'],
                "prerollStartWith": flashvars['vast.prerollStartWith'],
                "prerollUrl": flashvars['vast.prerollUrl'],
                "overlayStartAt": flashvars['vast.overlayStartAt'],
                "overlayInterval": flashvars['vast.overlayInterval'],
                "overlayUrl": flashvars['vast.overlayUrl'],
                "numPostroll": flashvars['vast.numPostroll'],
                "postrollInterval": flashvars['vast.postrollInterval'],
                "postrollStartWith": flashvars['vast.postrollStartWith'],
                "postrollUrl": flashvars['vast.postrollUrl'],
                "preSequence": flashvars['vast.preSequence'],
                "postSequence": flashvars['vast.postSequence'],
                "trackCuePoints": flashvars['vast.trackCuePoints'],
                "timeout": flashvars['vast.timeout'],
                "htmlCompanions": flashvars['vast.htmlCompanions']
            }
        }

        if (flashvars['skipBtn.plugin']) {
            plugins['skipBtn'] = {
                "plugin": true,
                "label": flashvars['skipBtn.label'],
                "skipOffset": flashvars['skipBtn.skipOffset']
            }
        }

        if (flashvars['skipNotice.plugin']) {
            plugins['skipNotice'] = {
                "plugin": true,
                "text": flashvars['skipNotice.text']
            }
        }

        if (flashvars['noticeMessage.plugin']) {
            plugins['noticeMessage'] = {
                "plugin": true,
                "text": flashvars['noticeMessage.text']
            }
        }

        if (flashvars['infoScreen.plugin']) {
            plugins['infoScreen'] = {
                "plugin": true,
                "parent": flashvars['infoScreen.parent'],
                "align": flashvars['infoScreen.align']
            }
        }

        if (flashvars['loadingSpinner.plugin']) {
            plugins['loadingSpinner'] = {
                "plugin": true,
                "imageUrl": flashvars['loadingSpinner.imageUrl'],
                "lines": 10,
                "lineLength": flashvars['loadingSpinner.lineLength'],
                "width": flashvars['loadingSpinner.width'],
                "radius": flashvars['loadingSpinner.radius'],
                "corners": flashvars['loadingSpinner.corners'],
                "rotate": flashvars['loadingSpinner.rotate'],
                "direction": flashvars['loadingSpinner.direction'],
                "color": flashvars['loadingSpinner.color'],
                "speed": flashvars['loadingSpinner.speed'],
                "trail": flashvars['loadingSpinner.trail'],
                "shadow": flashvars['loadingSpinner.shadow'],
                "className": flashvars['loadingSpinner.className'],
                "zIndex": flashvars['loadingSpinner.zIndex'],
                "top": flashvars['loadingSpinner.top'],
                "left": flashvars['loadingSpinner.left']
            }
        } else {
            plugins['loadingSpinner'] = {
                "plugin": false
            }
        }

        if (flashvars['playlistAPI.plugin']) {
            plugins['playlistAPI'] = {
                "plugin": true,
                "containerPosition": flashvars['playlistAPI.containerPosition'],
                "layout": flashvars['playlistAPI.layout'],
                "includeInLayout": flashvars['playlistAPI.includeInLayout'],
                "showControls": flashvars['playlistAPI.showControls'],
                "includeHeader": flashvars['playlistAPI.includeHeader'],
                "autoContinue": flashvars['playlistAPI.autoContinue'],
                "autoPlay": flashvars['playlistAPI.autoPlay'],
                "loop": flashvars['playlistAPI.loop'],
                "hideClipPoster": flashvars['playlistAPI.hideClipPoster']
            }
            if (flashvars['playlistAPI.MinClips'] && flashvars['playlistAPI.MinClips'] != '') {
                plugins['playlistAPI'].MinClips = flashvars['playlistAPI.MinClips'];
            }
            if (flashvars['playlistAPI.MaxClips'] && flashvars['playlistAPI.MaxClips'] != '') {
                plugins['playlistAPI'].MaxClips = flashvars['playlistAPI.MaxClips'];
            }
            if (flashvars['playlistAPI.initItemEntryId'] && flashvars['playlistAPI.initItemEntryId'] != '') {
                plugins['playlistAPI'].initItemEntryId = flashvars['playlistAPI.initItemEntryId'];
            }
            var plist_arr = [];
            $('#plist-entries .mCSB_container div.entry-wrapper').each(function () {
                plist_arr.push({
                    'id': $(this).attr("data-entryid"),
                    'name': $(this).attr("data-name")
                });
            });

            if (plist_arr.length > 1) {
                var i = 0;
                $.each(plist_arr, function (key, value) {
                    plugins['playlistAPI']['kpl' + i + 'Id'] = value.id;
                    plugins['playlistAPI']['kpl' + i + 'Name'] = value.name;
                    i++;
                });
            }
        }

        if (flashvars['smhVR.plugin']) {
            plugins['smhVR'] = {
                "plugin": true,
                "iframeHTML5Js1": flashvars['smhVR.iframeHTML5Js1']
            }
            if (flashvars['smhVR.fallbackEntryID']) {
                plugins['smhVR'].fallbackEntryID = flashvars['smhVR.fallbackEntryID'];
            }
            if (!flashvars['smhVR.showCompMessage']) {
                plugins['smhVR'].showCompMessage = flashvars['smhVR.showCompMessage'];
            }
            plugins['smhVRBtn'] = {
                "plugin": true
            }
        }

        plugins['theme'] = {
            "plugin": true,
            "applyToLargePlayButton": flashvars['theme.applyToLargePlayButton'],
            "buttonsSize": flashvars['theme.buttonsSize'],
            "buttonsColor": flashvars['theme.buttonsColor'],
            "buttonsIconColor": flashvars['theme.buttonsIconColor'],
            "sliderColor": flashvars['theme.sliderColor'],
            "scrubberColor": flashvars['theme.scrubberColor'],
            "controlsBkgColor": flashvars['theme.controlsBkgColor'],
            "watchedSliderColor": flashvars['theme.watchedSliderColor'],
            "bufferedSliderColor": flashvars['theme.bufferedSliderColor'],
            "buttonsIconColorDropShadow": flashvars['theme.buttonsIconColorDropShadow']
        }

        plugins['topBarContainer'] = {
            "plugin": true
        }

        plugins['playHead'] = {
            "plugin": true
        }

        plugins['liveCore'] = {
            "plugin": true
        }

        plugins['liveStatus'] = {
            "plugin": true
        }

        plugins['liveBackBtn'] = {
            "plugin": true
        }

        plugins['moderation'] = {
            "plugin": false
        }

        if (flashvars['autoPlay']) {
            uivars.push({
                "key": "autoPlay",
                "value": true,
                "overrideFlashvar": false
            });
        } else {
            uivars.push({
                "key": "autoPlay",
                "value": false,
                "overrideFlashvar": false
            });
        }

        if (flashvars['autoMute']) {
            uivars.push({
                "key": "autoMute",
                "value": true,
                "overrideFlashvar": false
            });
        } else {
            uivars.push({
                "key": "autoMute",
                "value": false,
                "overrideFlashvar": false
            });
        }

        if (flashvars['enableTooltips']) {
            uivars.push({
                "key": "enableTooltips",
                "value": true,
                "overrideFlashvar": false
            });
        } else {
            uivars.push({
                "key": "enableTooltips",
                "value": false,
                "overrideFlashvar": false
            });
        }

        if (flashvars['adsOnReplay']) {
            uivars.push({
                "key": "adsOnReplay",
                "value": true,
                "overrideFlashvar": false
            });
        } else {
            uivars.push({
                "key": "adsOnReplay",
                "value": false,
                "overrideFlashvar": false
            });
        }

        json['plugins'] = plugins;
        json['uiVars'] = uivars;
        json['layout'] = {
            "skin": "kdark"
        }
        return JSON.stringify(json);
    },
    //Create Config file
    createConfig: function (uiconf_id, player_name) {
        var isplaylist = ' ';
        if (uiconf_id == '6709439') {
            isplaylist = ' isPlaylist="true" ';
        } else if (uiconf_id == '6709441') {
            isplaylist = ' isPlaylist="multi" ';
        }

        var configFile = '<layout id="full" name="' + smhPlayers.htmlEntities(player_name) + '"' + isplaylist + 'skinPath="/content/uiconf/kaltura/kmc/appstudio/kdp3/falcon/skin/v3.7/skin.swf">' +
                '<HBox id="topLevel" width="100%" height="100%">' +
                '<VBox id="player" width="100%" height="100%" styleName="black">' +
                '<Plugin id="kalturaMix" width="0%" height="0%" includeInLayout="false" loadingPolicy="onDemand"/>' +
                '<Plugin id="statistics" width="0%" height="0%" includeInLayout="false"/>' +
                '<Canvas id="PlayerHolder" height="100%" width="100%" styleName="black">' +
                '<Video id="video" width="100%" height="100%"/>' +
                '<VBox id="offlineMessageHolder" verticalAlign="middle" horizontalAlign="center" includeInLayout="false" width="100%" height="100%">' +
                '<Spacer height="100%"/>' +
                '<Spacer height="100%"/>' +
                '<Label id="offlineMessage" styleName="offlineMessage" text="{mediaProxy.entry.offlineMessage}" visible="{mediaProxy.isOffline}" width="100%" height="30"/>' +
                '<Spacer height="100%"/>' +
                '</VBox>' +
                '<Screens id="screensLayer" width="100%" height="100%" mouseOverTarget="{PlayerHolder}" styleName="clickThrough" startScreenId="startScreen" startScreenOverId="startScreen" pauseScreenOverId="pauseScreen" pauseScreenId="pauseScreen" playScreenOverId="playScreen" endScreenId="endScreen" endScreenOverId="endScreen"/>' +
                '</Canvas>' +
                '<Canvas id="controlsHolder" width="100%" height="30">' +
                '<HBox id="ControllerScreenHolder" width="100%" height="30" verticalAlign="middle" styleName="darkBg">' +
                '<HBox id="ControllerScreen" width="100%" height="30" horizontalGap="9" paddingLeft="9" verticalAlign="middle" styleName="darkBg">' +
                '<Button id="playBtnControllerScreen" command="play" buttonType="iconButton" focusRectPadding="0" icon="playIcon" overIcon="playIcon" downIcon="playIcon" disabeledIcon="playIcon" selectedUpIcon="pauseIcon" selectedOverIcon="pauseIcon" selectedDownIcon="pauseIcon" selectedDisabledIcon="pauseIcon" tooltip="" upTooltip="Play" selectedTooltip="Pause" k_buttonType="buttonIconControllerArea" color1="11184810" color2="16777215" color3="16777215" color4="11184810" color5="0" font="Arial"/>' +
                '<Button id="liveToggleStatus" toggle="true" color1="0xFF0000" color2="0xFF0000" upIcon="onAirIcon" overIcon="onAirIcon" downIcon="onAirIcon" disabeledIcon="onAirIcon" selectedUpIcon="offlineIcon" selectedOverIcon="offlineIcon" selectedDownIcon="offlineIcon" selectedDisabledIcon="offlineIcon" isSelected="{mediaProxy.isOffline}" visible="{mediaProxy.isLive}" includeInLayout="{mediaProxy.isLive}" mouseEnable="false" useHandCursor=""/>' +
                '<HBox id="seekBox" width="100%" height="30" visible="{mediaProxy.canSeek}" verticalAlign="middle" horizontalGap="9">' +
                '<Button id="goLiveBtn" buttonType="labelButton" textPadding="0" height="20" color1="0xCECECE" color2="0xFFFFFF" kClick="sendNotification(\'goLive\')" visible="{mediaProxy.isLive}" includeInLayout="{mediaProxy.isLive}" label="Live" styleName="controllerScreen"/>' +
                '<VBox id="scrubberContainer" width="100%" height="30" verticalAlign="middle" verticalGap="-3" supportEnableGui="false">' +
                '<Spacer height="10"/>' +
                '<Scrubber id="scrubber" width="100%" height="10" styleName=""/>' +
                '<HBox width="100%">' +
                '<Timer id="timerControllerScreen1" width="60" styleName="timerProgressLeft" format="mm:ss" height="12"/>' +
                '<Spacer width="100%" height="8"/>' +
                '<Timer id="timerControllerScreen2" width="60" styleName="timerProgressRight" format="mm:ss" height="12" timerType="total"/>' +
                '</HBox>' +
                '</VBox>' +
                '</HBox>' +
                '<VolumeBar id="volumeBar" styleName="volumeBtn" buttonWidth="20" width="20" height="20" buttonType="iconButton" tooltip="Change volume" color1="11184810" color2="16777215" color3="16777215" color4="11184810" color5="0" font="Arial"/>' +
                '<Button id="fullScreenBtnControllerScreen" command="fullScreen" buttonType="iconButton" height="22" styleName="controllerScreen" icon="openFullScreenIcon" selectedUpIcon="closeFullScreenIcong" selectedOverIcon="closeFullScreenIcon" selectedDownIcon="closeFullScreenIcon" selectedDisabledIcon="closeFullScreenIcon" focusRectPadding="0" allowDisable="false" tooltip="Toggle fullscreen" k_buttonType="buttonIconControllerArea" color1="11184810" color2="16777215" color3="16777215" color4="11184810" color5="0" font="Arial"/>' +
                '</HBox>' +
                '<Spacer width="13"/>' +
                '<Button id="kalturaLogo" height="50" width="100" kClick="navigate(\'http://www.kaltura.com\')" styleName="controllerScreen" icon="kalturaLogo"/>' +
                '<Spacer width="13"/>' +
                '</HBox>' +
                '</Canvas>' +
                '</VBox>' +
                '</HBox>' +
                '<screens>' +
                '<screen id="startScreen">' +
                '<VBox id="startContainer" width="100%" height="100%" verticalAlign="middle" horizontalAlign="center">' +
                '<Spacer width="100%"/>' +
                '<Tile id="startTile" width="100%" verticalGap="10" verticalAlign="middle" horizontalAlign="center">' +
                '</Tile>' +
                '<Spacer width="100%"/>' +
                '</VBox>' +
                '</screen>' +
                '<screen id="pauseScreen">' +
                '<VBox id="pauseContainer" width="100%" height="100%" verticalAlign="middle" horizontalAlign="center">' +
                '<Spacer height="100%"/>' +
                '<Tile id="pauseTile" width="100%" verticalGap="10" verticalAlign="middle" horizontalAlign="center">' +
                '</Tile>' +
                '<Spacer height="100%"/>' +
                '</VBox>' +
                '</screen>' +
                '<screen id="playScreen">' +
                '<VBox id="playContainer" width="100%" height="100%" verticalAlign="middle" horizontalAlign="center">' +
                '<Spacer height="100%"/>' +
                '<Tile id="playTile" width="100%" verticalGap="10" verticalAlign="middle" horizontalAlign="center">' +
                '</Tile>' +
                '<Spacer height="100%"/>' +
                '</VBox>' +
                '</screen>' +
                '<screen id="endScreen">' +
                '<VBox id="endContainer" width="100%" height="100%" verticalAlign="middle" horizontalAlign="center">' +
                '<Spacer height="100%"/>' +
                '<Tile id="endTile" width="100%" verticalGap="10" verticalAlign="middle" horizontalAlign="center">' +
                '</Tile>' +
                '<Spacer height="100%"/>' +
                '</VBox>' +
                '</screen>' +
                '</screens>' +
                '<strings>' +
                '<string key="ENTRY_CONVERTING" value="Entry is processing, please try again in a few minutes."/>' +
                '</strings>' +
                '<extraData></extraData>' +
                '<uiVars>' +
                '<var key="streamerType" value="auto" overrideFlashvar="true"/>' +
                '</uiVars>' +
                '</layout>';

        return configFile;

    },
    htmlEntities: function (str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    },
    //Escapes special characters
    escape: function (text) {
        return text.replace(/'/g, "&#039;").replace(/"/g, "&quot;").replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;");
    },
    h2d: function (h) {
        return parseInt(h, 16);
    },
    d2h: function (d) {
        return '#' + Number(d).toString(16);
    },
    //Set default player flashvars
    defaultPlayerSettings: function () {
        if (uiconf_id == '6709438') {
            width = '400';
            height = '330';
            player_entryid = '0_vznwb0q7';
            flashvars['playlistAPI.plugin'] = false;
        } else if (uiconf_id == '6709439') {
            width = '740';
            height = '330';
            flashvars['playlistAPI.plugin'] = true;
            flashvars['playlistAPI.containerPosition'] = 'right';
            flashvars['playlistAPI.layout'] = 'vertical';
            flashvars['playlistAPI.includeInLayout'] = true;
            flashvars['playlistAPI.showControls'] = true;
            flashvars['playlistAPI.includeHeader'] = true;
            flashvars['playlistAPI.autoContinue'] = false;
            flashvars['playlistAPI.autoPlay'] = false;
            flashvars['playlistAPI.loop'] = false;
            flashvars['playlistAPI.hideClipPoster'] = false;
            flashvars['playlistAPI.MinClips'] = '';
            flashvars['playlistAPI.MaxClips'] = '';
            flashvars['playlistAPI.initItemEntryId'] = '';
            flashvars['playlistAPI.kpl0Id'] = '0_aaizhxk0';
            flashvars['playlistAPI.kpl0Name'] = 'playlist';
            flashvars['playlistAPI.kpl1Id'] = null;
            flashvars['playlistAPI.kpl1Name'] = null;
        } else if (uiconf_id == '6709441') {
            width = '740';
            height = '330';
            flashvars['playlistAPI.plugin'] = true;
            flashvars['playlistAPI.containerPosition'] = 'right';
            flashvars['playlistAPI.layout'] = 'vertical';
            flashvars['playlistAPI.includeInLayout'] = true;
            flashvars['playlistAPI.showControls'] = true;
            flashvars['playlistAPI.includeHeader'] = true;
            flashvars['playlistAPI.autoContinue'] = false;
            flashvars['playlistAPI.autoPlay'] = false;
            flashvars['playlistAPI.loop'] = false;
            flashvars['playlistAPI.hideClipPoster'] = false;
            flashvars['playlistAPI.MinClips'] = '';
            flashvars['playlistAPI.MaxClips'] = '';
            flashvars['playlistAPI.initItemEntryId'] = '';
            flashvars['playlistAPI.kpl0Id'] = '0_aaizhxk0';
            flashvars['playlistAPI.kpl0Name'] = 'playlist1';
            flashvars['playlistAPI.kpl1Id'] = '0_iv57gfw0';
            flashvars['playlistAPI.kpl1Name'] = 'playlist2';
        }
        auto_preview = false;
        flashvars['width'] = width;
        flashvars['height'] = height;
        flashvars['streamerType'] = 'http';
        flashvars['titleLabel.plugin'] = false;
        flashvars['titleLabel.align'] = 'left';
        flashvars['titleLabel.text'] = '{mediaProxy.entry.name}';
        flashvars['titleLabel.truncateLongTitles'] = true;

        flashvars['logo.plugin'] = false;
        flashvars['logo.img'] = 'http://mediaplatform.streamingmediahosting.com/img/sample_icon.png';
        flashvars['logo.href'] = 'http://streamingmediahosting.com';
        flashvars['logo.title'] = 'my logo';

        flashvars['loadingSpinner.plugin'] = true;
        flashvars['loadingSpinner.imageUrl'] = '';
        flashvars['loadingSpinner.lineLength'] = 10;
        flashvars['loadingSpinner.width'] = 6;
        flashvars['loadingSpinner.radius'] = 12;
        flashvars['loadingSpinner.corners'] = 1;
        flashvars['loadingSpinner.rotate'] = 0;
        flashvars['loadingSpinner.direction'] = 1;
        flashvars['loadingSpinner.color'] = "rgb(0,154,218)|rgb(255,221,79)|rgb(0,168,134)|rgb(233,44,46)|rgb(181,211,52)|rgb(252,237,0)|rgb(0,180,209)|rgb(117,192,68)|rgb(232,44,46)|rgb(250,166,26)|rgb(0,154,218)|rgb(232,44,46)|rgb(255,221,79)|rgb(117,192,68)|rgb(232,44,46)";
        flashvars['loadingSpinner.speed'] = 1.6;
        flashvars['loadingSpinner.trail'] = 100;
        flashvars['loadingSpinner.shadow'] = false;
        flashvars['loadingSpinner.className'] = 'spinner';
        flashvars['loadingSpinner.zIndex'] = 2000000000;
        flashvars['loadingSpinner.top'] = 'auto';
        flashvars['loadingSpinner.left'] = 'auto';

        flashvars['volumeControl.plugin'] = true;
        flashvars['volumeControl.showSlider'] = true;
        flashvars['volumeControl.pinVolumeBar'] = false;

        flashvars['closedCaptions.plugin'] = false;
        flashvars['closedCaptions.layout'] = 'ontop';
        flashvars['closedCaptions.displayCaptions'] = true;
        flashvars['closedCaptions.fontFamily'] = 'Arial';
        flashvars['closedCaptions.fontsize'] = 12;
        flashvars['closedCaptions.fontColor'] = '#FFFFFF';
        flashvars['closedCaptions.bg'] = '#000000';
        flashvars['closedCaptions.useGlow'] = false;
        flashvars['closedCaptions.glowBlur'] = 4;
        flashvars['closedCaptions.glowColor'] = '#000000';
        flashvars['closedCaptions.hideWhenEmpty'] = false;
        flashvars['closedCaptions.showEmbeddedCaptions'] = false;

        flashvars['watermark.plugin'] = false;
        flashvars['watermark.watermarkPosition'] = 'bottomLeft';
        flashvars['watermark.watermarkPath'] = 'http://mediaplatform.streamingmediahosting.com/img/exampleWatermark.png';
        flashvars['watermark.watermarkClickPath'] = 'http://streamingmediahosting.com';
        flashvars['watermark.padding'] = 5;

        flashvars['infoScreen.plugin'] = false;
        flashvars['infoScreen.parent'] = 'topBarContainer';
        flashvars['infoScreen.align'] = 'right';

        flashvars['share.plugin'] = false;
        flashvars['share.parent'] = 'controlsContainer';
        flashvars['share.align'] = 'right';
        flashvars['share.socialShareURL'] = 'smart';
        flashvars['share.socialNetworks'] = '';
        flashvars['share.socialShareEnabled'] = true;
        flashvars['share.embedEnabled'] = true;
        flashvars['share.allowTimeOffset'] = true;
        flashvars['share.allowSecuredEmbed'] = true;
        flashvars['share.emailEnabled'] = true;
        flashvars['share.shareUiconfID'] = '';
        flashvars['share.shareConfig.facebook.name'] = 'Facebook';
        flashvars['share.shareConfig.facebook.icon'] = '';
        flashvars['share.shareConfig.facebook.cssClass'] = 'icon-share-facebook';
        flashvars['share.shareConfig.facebook.template'] = 'https://www.facebook.com/sharer/sharer.php?u={share.shareURL}';
        flashvars['share.shareConfig.facebook.redirectUrl'] = 'fb://feed/';
        flashvars['share.shareConfig.twitter.name'] = 'Twitter';
        flashvars['share.shareConfig.twitter.icon'] = '';
        flashvars['share.shareConfig.twitter.cssClass'] = 'icon-share-twitter';
        flashvars['share.shareConfig.twitter.template'] = 'https://twitter.com/share?url={share.shareURL}';
        flashvars['share.shareConfig.twitter.redirectUrl'] = 'https://twitter.com/intent/tweet/complete?,https://twitter.com/intent/tweet/update';
        flashvars['share.shareConfig.googleplus.name'] = 'Google+';
        flashvars['share.shareConfig.googleplus.icon'] = '';
        flashvars['share.shareConfig.googleplus.cssClass'] = 'icon-share-google';
        flashvars['share.shareConfig.googleplus.template'] = 'https://plus.google.com/share?url={share.shareURL}';
        flashvars['share.shareConfig.googleplus.redirectUrl'] = 'https://plus.google.com/app/basic/stream';
        flashvars['share.shareConfig.email.name'] = 'Email';
        flashvars['share.shareConfig.email.icon'] = '';
        flashvars['share.shareConfig.email.cssClass'] = 'icon-share-email';
        flashvars['share.shareConfig.email.template'] = 'mailto:?subject=Check out {mediaProxy.entry.name}&body=Check out {mediaProxy.entry.name}: {share.shareURL}';
        flashvars['share.shareConfig.email.redirectUrl'] = '';
        flashvars['share.shareConfig.linkedin.name'] = 'LinkedIn';
        flashvars['share.shareConfig.linkedin.icon'] = '';
        flashvars['share.shareConfig.linkedin.cssClass'] = 'icon-share-linkedin';
        flashvars['share.shareConfig.linkedin.template'] = 'http://www.linkedin.com/shareArticle?mini=true&url={share.shareURL}';
        flashvars['share.shareConfig.linkedin.redirectUrl'] = '';
        flashvars['share.shareConfig.sms.name'] = 'SMS';
        flashvars['share.shareConfig.sms.icon'] = '';
        flashvars['share.shareConfig.sms.cssClass'] = 'icon-share-sms';
        flashvars['share.shareConfig.sms.template'] = 'Check out {mediaProxy.entry.name}: {share.shareURL}';
        flashvars['share.shareConfig.sms.redirectUrl'] = '';
        flashvars['share.embedOptions.streamerType'] = 'auto';
        flashvars['share.embedOptions.uiconfID'] = '';
        flashvars['share.embedOptions.width'] = 560;
        flashvars['share.embedOptions.height'] = 395;
        flashvars['share.embedOptions.borderWidth'] = 0;

        flashvars['related.plugin'] = false;
        flashvars['related.parent'] = 'topBarContainer';
        flashvars['related.align'] = 'right';
        flashvars['related.playlistId'] = '';
        flashvars['related.entryList'] = '';
        flashvars['related.displayOnPlaybackDone'] = true;
        flashvars['related.autoContinueEnabled'] = false;
        flashvars['related.autoContinueTime'] = '';
        flashvars['related.itemsLimit'] = '';

        flashvars['bumper.plugin'] = false;
        flashvars['bumper.bumperEntryID'] = '';
        flashvars['bumper.clickurl'] = '';
        flashvars['bumper.lockUI'] = true;
        flashvars['bumper.playOnce'] = false;
        flashvars['bumper.preSequence'] = 0;
        flashvars['bumper.postSequence'] = 0;

        flashvars['vast.plugin'] = false;
        flashvars['vast.pauseAdOnClick'] = false;
        flashvars['vast.enableCORS'] = false;
        flashvars['vast.loadAdsOnPlay'] = false;
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
        flashvars['vast.htmlCompanions'] = "";

        flashvars['skipBtn.plugin'] = false;
        flashvars['skipBtn.label'] = 'Skip Ad';
        flashvars['skipBtn.skipOffset'] = 0;

        flashvars['skipNotice.plugin'] = false;
        flashvars['skipNotice.text'] = 'You can skip this ad in {sequenceProxy.skipOffsetRemaining} seconds';

        flashvars['noticeMessage.plugin'] = false;
        flashvars['noticeMessage.text'] = 'Video will start in {sequenceProxy.timeRemaining} seconds';

        flashvars['playbackRateSelector.plugin'] = false;
        flashvars['playbackRateSelector.defaultSpeed'] = 1;

        flashvars['sourceSelector.plugin'] = false;
        flashvars['sourceSelector.switchOnResize'] = false;
        flashvars['sourceSelector.simpleFormat'] = false;
        flashvars['mediaProxy.preferedFlavorBR'] = 1600;

        flashvars['download.plugin'] = false;
        flashvars['download.parent'] = 'controlsContainer';
        flashvars['download.align'] = 'right';
        flashvars['download.flavorID'] = '';
        flashvars['download.preferredBitrate'] = '';

        flashvars['chromecast.plugin'] = false;
        flashvars['chromecast.parent'] = 'controlsContainer';
        flashvars['chromecast.align'] = 'right';
        flashvars['chromecast.logoUrl'] = '';

        flashvars['theme.plugin'] = true;
        flashvars['theme.applyToLargePlayButton'] = true;
        flashvars['theme.buttonsSize'] = 12;
        flashvars['theme.buttonsColor'] = '#000000';
        flashvars['theme.buttonsIconColor'] = '#ffffff';
        flashvars['theme.sliderColor'] = '#333333';
        flashvars['theme.scrubberColor'] = '#ffffff';
        flashvars['theme.controlsBkgColor'] = '#000000';
        flashvars['theme.watchedSliderColor'] = '#2ec7e1';
        flashvars['theme.bufferedSliderColor'] = '#AFAFAF';
        flashvars['theme.buttonsIconColorDropShadow'] = true;

        flashvars['captureThumbnail.plugin'] = false;
        flashvars['captureThumbnail.tooltip'] = 'Capture Thumbnail';

        flashvars['scrubber.plugin'] = true;

        flashvars['topBarContainer.plugin'] = true;

        flashvars['fullScreenBtn.plugin'] = true;

        flashvars['largePlayBtn.plugin'] = true;

        flashvars['playPauseBtn.plugin'] = true;

        flashvars['controlBarContainer.plugin'] = true;
        flashvars['controlBarContainer.hover'] = false;

        flashvars['playHead.plugin'] = true;

        flashvars['durationLabel.plugin'] = true;

        flashvars['currentTimeLabel.plugin'] = true;

        flashvars['liveCore.plugin'] = true;

        flashvars['liveStatus.plugin'] = true;

        flashvars['liveBackBtn.plugin'] = true;

        flashvars['moderation.plugin'] = false;

        flashvars['autoPlay'] = false;
        flashvars['autoMute'] = false;
        flashvars['enableTooltips'] = true;
        flashvars['adsOnReplay'] = true;

        flashvars['layout.skin'] = 'kdark';

        flashvars['smhVR.plugin'] = false;
        flashvars['smhVRBtn.plugin'] = false;
    },
    //Export Metadata
    exportMetaData: function () {
        if (total_entries) {
            window.location = '/apps/platform/metadata/export.metadata.php?pid=' + sessInfo.pid + '&ks=' + sessInfo.ks + '&page_size=' + total_entries + '&action=export_players_metadata';
        }
    },
    //Font Size
    fontsize: function () {
        var fontSize = $("#smh-modal3 .player-menu").width() * 0.60;
        $("#smh-modal3 .player-tab .player-menu .fa").css('font-size', fontSize);
        $("#smh-modal3 .player-tab .player-menu .icon-vr").css('font-size', fontSize);
    },
    //Player Title Options
    playerTitle: function () {
        $('#smh-modal3').on('click', '#title_text', function (e) {
            e.stopPropagation();
            if (this.checked) {
                $('#smh-modal3 #title-location').removeAttr('disabled');
                $('#smh-modal3 #title-truncate').removeAttr('disabled');
                flashvars['titleLabel.plugin'] = true;
                flashvars['titleLabel.align'] = $('#smh-modal3 #title-location').val();
                ;
                flashvars['titleLabel.truncateLongTitles'] = $('#smh-modal3 #title-truncate').is(':checked') ? true : false;
            } else {
                $('#smh-modal3 #title-location').attr('disabled', '');
                $('#smh-modal3 #title-truncate').attr('disabled', '');
                flashvars['titleLabel.plugin'] = false;
                flashvars['titleLabel.align'] = '';
                flashvars['titleLabel.truncateLongTitles'] = false;
            }
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#title-location', function () {
            flashvars['titleLabel.align'] = $('#smh-modal3 #title-location').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#title-truncate', function () {
            flashvars['titleLabel.truncateLongTitles'] = $('#smh-modal3 #title-truncate').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    //Player Watermark Options
    playerWatermark: function () {
        $('#smh-modal3').on('click', '#watermark', function (e) {
            e.stopPropagation();
            if (this.checked) {
                $('#smh-modal3 #watermark_url').removeAttr('disabled');
                $('#smh-modal3 #watermark_landing').removeAttr('disabled');
                $('#smh-modal3 #watermark-location').removeAttr('disabled');
                $('#smh-modal3 #water_padding').removeAttr('disabled', '');
                flashvars['watermark.plugin'] = true;
                flashvars['watermark.watermarkPath'] = $('#smh-modal3 #watermark_url').val();
                flashvars['watermark.watermarkClickPath'] = $('#smh-modal3 #watermark_landing').val();
                flashvars['watermark.padding'] = $('#smh-modal3 #water_padding').val();
                flashvars['watermark.watermarkPosition'] = $('#smh-modal3 #watermark-location').val();
            } else {
                $('#smh-modal3 #watermark_url').attr('disabled', '');
                $('#smh-modal3 #watermark_landing').attr('disabled', '');
                $('#smh-modal3 #watermark-location').attr('disabled', '');
                $('#smh-modal3 #water_padding').attr('disabled', '');
                flashvars['watermark.plugin'] = false;
                flashvars['watermark.watermarkPath'] = '';
                flashvars['watermark.watermarkClickPath'] = 'http://streamingmediahosting.com';
                flashvars['watermark.padding'] = 5;
                flashvars['watermark.watermarkPosition'] = 'bottomLeft';
            }

            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#watermark_url', function () {
            flashvars['watermark.watermarkPath'] = $('#smh-modal3 #watermark_url').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#watermark_landing', function () {
            flashvars['watermark.watermarkClickPath'] = $('#smh-modal3 #watermark_landing').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#watermark-location', function () {
            flashvars['watermark.watermarkPosition'] = $('#smh-modal3 #watermark-location').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#water_padding', function () {
            flashvars['watermark.padding'] = $('#smh-modal3 #water_padding').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    //Player Logo Options
    playerLogoIcon: function () {
        $('#smh-modal3').on('click', '#logo-icon', function (e) {
            e.stopPropagation();
            if (this.checked) {
                $('#smh-modal3 #icon_url').removeAttr('disabled');
                $('#smh-modal3 #icon_landing').removeAttr('disabled');
                $('#smh-modal3 #icon_title').removeAttr('disabled');
                flashvars['logo.plugin'] = true;
                flashvars['logo.img'] = $('#smh-modal3 #icon_url').val();
                flashvars['logo.href'] = $('#smh-modal3 #icon_landing').val();
                flashvars['logo.title'] = $('#smh-modal3 #icon_title').val();
            } else {
                $('#smh-modal3 #icon_url').attr('disabled', '');
                $('#smh-modal3 #icon_landing').attr('disabled', '');
                $('#smh-modal3 #icon_title').attr('disabled', '');
                flashvars['logo.plugin'] = false;
                flashvars['logo.img'] = '';
                flashvars['mylogo.href'] = 'http://streamingmediahosting.com';
                flashvars['logo.title'] = '';
            }

            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#icon_url', function () {
            flashvars['logo.img'] = $('#smh-modal3 #icon_url').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#icon_landing', function () {
            flashvars['logo.href'] = $('#smh-modal3 #icon_landing').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#icon_title', function () {
            flashvars['logo.title'] = $('#smh-modal3 #icon_title').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    //Player Counter Options
    playerLeftCounter: function () {
        $('#smh-modal3').on('click', '#left-play-counter', function (e) {
            e.stopPropagation();
            if (this.checked) {
                $('#smh-modal3 #left-counterLoc').removeAttr('disabled');
                flashvars['currentTimeLabel.plugin'] = true;
            } else {
                $('#smh-modal3 #left-counterLoc').attr('disabled', '');
                flashvars['currentTimeLabel.plugin'] = false;
            }

            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#left-counterLoc', function () {
            flashvars['timerControllerScreen1.timerType'] = $('#smh-modal3 #left-counterLoc').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    //Player Counter Options
    playerRightCounter: function () {
        $('#smh-modal3').on('click', '#right-play-counter', function (e) {
            e.stopPropagation();
            if (this.checked) {
                $('#smh-modal3 #right-counterLoc').removeAttr('disabled');
                flashvars['durationLabel.plugin'] = true;
            } else {
                $('#smh-modal3 #right-counterLoc').attr('disabled', '');
                flashvars['durationLabel.plugin'] = false;
            }

            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#right-counterLoc', function () {
            flashvars['timerControllerScreen2.timerType'] = $('#smh-modal3 #right-counterLoc').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    //Player Counter Options
    playerFlavorSelect: function () {
        $('#smh-modal3').on('click', '#flavor_selector', function (e) {
            e.stopPropagation();
            if (this.checked) {
                $('#smh-modal3 #switch-resize').removeAttr('disabled');
                $('#smh-modal3 #simple-format').removeAttr('disabled');
                $('#smh-modal3 #pre-flavor').removeAttr('disabled');
                flashvars['sourceSelector.plugin'] = true;
                flashvars['sourceSelector.switchOnResize'] = $('#smh-modal3 #switch-resize').is(':checked') ? true : false;
                flashvars['sourceSelector.simpleFormat'] = $('#smh-modal3 #simple-format').is(':checked') ? true : false;
                flashvars['mediaProxy.preferedFlavorBR'] = $('#smh-modal3 #pre-flavor').val();
            } else {
                $('#smh-modal3 #switch-resize').attr('disabled', '');
                $('#smh-modal3 #simple-format').attr('disabled', '');
                $('#smh-modal3 #pre-flavor').attr('disabled', '');
                flashvars['sourceSelector.plugin'] = false;
            }

            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#switch-resize', function () {
            flashvars['sourceSelector.switchOnResize'] = $('#smh-modal3 #switch-resize').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#simple-format', function () {
            flashvars['sourceSelector.simpleFormat'] = $('#smh-modal3 #simple-format').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#pre-flavor', function () {
            flashvars['mediaProxy.preferedFlavorBR'] = $('#smh-modal3 #pre-flavor').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    //Player Fullscreen Option
    playerFullscreen: function () {
        $('#smh-modal3').on('click', '#fullscreen', function (e) {
            e.stopPropagation();
            if (this.checked) {
                flashvars['fullScreenBtn.plugin'] = true;
            } else {
                flashvars['fullScreenBtn.plugin'] = false;
            }

            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    //Player On-video Play Button Option
    playerOVPlay: function () {
        $('#smh-modal3').on('click', '#on_video_play', function (e) {
            e.stopPropagation();
            if (this.checked) {
                flashvars['largePlayBtn.plugin'] = true;
            } else {
                flashvars['largePlayBtn.plugin'] = false;
            }
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    //Player Play Pause Button Option
    playerPlayPause: function () {
        $('#smh-modal3').on('click', '#play_pause', function (e) {
            e.stopPropagation();
            if (this.checked) {
                flashvars['playPauseBtn.plugin'] = true;
            } else {
                flashvars['playPauseBtn.plugin'] = false;
            }
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    //Player Volume Option
    playerVolume: function () {
        $('#smh-modal3').on('click', '#volume', function (e) {
            e.stopPropagation();
            if (this.checked) {
                flashvars['volumeControl.plugin'] = true;
                $('#smh-modal3 #vol-show-slider').removeAttr('disabled');
                $('#smh-modal3 #vol-pin-bar').removeAttr('disabled');
                flashvars['volumeControl.showSlider'] = $('#smh-modal3 #vol-show-slider').is(':checked') ? true : false;
                flashvars['volumeControl.pinVolumeBar'] = $('#smh-modal3 #vol-pin-bar').is(':checked') ? true : false;
            } else {
                flashvars['volumeControl.plugin'] = false;
                $('#smh-modal3 #vol-show-slider').attr('disabled', '');
                $('#smh-modal3 #vol-pin-bar').attr('disabled', '');
                flashvars['volumeControl.showSlider'] = true;
                flashvars['volumeControl.pinVolumeBar'] = false;
            }
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#vol-show-slider', function () {
            flashvars['volumeControl.showSlider'] = $('#smh-modal3 #vol-show-slider').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#vol-pin-bar', function () {
            flashvars['volumeControl.pinVolumeBar'] = $('#smh-modal3 #vol-pin-bar').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    controlBar: function () {
        $('#smh-modal3').on('click', '#control-bar', function (e) {
            e.stopPropagation();
            if (this.checked) {
                flashvars['controlBarContainer.plugin'] = true;
            } else {
                flashvars['controlBarContainer.plugin'] = false;
            }
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    playbackRate: function () {
        $('#smh-modal3').on('click', '#playback-rate', function (e) {
            e.stopPropagation();
            if (this.checked) {
                flashvars['playbackRateSelector.plugin'] = true;
            } else {
                flashvars['playbackRateSelector.plugin'] = false;
            }
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    resumePlayback: function () {
        $('#smh-modal3').on('click', '#resume-playback', function (e) {
            e.stopPropagation();
            if (this.checked) {
                flashvars['resumePlayback.plugin'] = true;
            } else {
                flashvars['resumePlayback.plugin'] = false;
            }
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    chromecast: function () {
        $('#smh-modal3').on('click', '#chromecast', function (e) {
            e.stopPropagation();
            if (this.checked) {
                $('#smh-modal3 #chromecast-location').removeAttr('disabled');
                $('#smh-modal3 #chromecast-align').removeAttr('disabled');
                $('#smh-modal3 #chromecast-url').removeAttr('disabled');
                flashvars['chromecast.plugin'] = true;
                flashvars['chromecast.parent'] = $('#smh-modal3 #chromecast-location').val();
                flashvars['chromecast.align'] = $('#smh-modal3 #chromecast-align').val();
                flashvars['chromecast.logoUrl'] = $('#smh-modal3 #chromecast-url').val();
            } else {
                $('#smh-modal3 #chromecast-location').attr('disabled', '');
                $('#smh-modal3 #chromecast-align').attr('disabled', '');
                $('#smh-modal3 #chromecast-url').attr('disabled', '');
                flashvars['chromecast.plugin'] = false;
            }

            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#chromecast-location', function () {
            flashvars['chromecast.parent'] = $('#smh-modal3 #chromecast-location').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#chromecast-align', function () {
            flashvars['chromecast.align'] = $('#smh-modal3 #chromecast-align').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#chromecast-url', function () {
            flashvars['chromecast.logoUrl'] = $('#smh-modal3 #chromecast-url').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    infoScreen: function () {
        $('#smh-modal3').on('click', '#info-screen', function (e) {
            e.stopPropagation();
            if (this.checked) {
                $('#smh-modal3 #infoscreen-location').removeAttr('disabled');
                $('#smh-modal3 #infoscreen-align').removeAttr('disabled');
                flashvars['infoScreen.plugin'] = true;
                flashvars['infoScreen.parent'] = $('#smh-modal3 #infoscreen-location').val();
                flashvars['infoScreen.align'] = $('#smh-modal3 #infoscreen-align').val();
            } else {
                $('#smh-modal3 #infoscreen-location').attr('disabled', '');
                $('#smh-modal3 #infoscreen-align').attr('disabled', '');
                flashvars['infoScreen.plugin'] = false;
            }

            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#infoscreen-location', function () {
            flashvars['infoScreen.parent'] = $('#smh-modal3 #infoscreen-location').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#infoscreen-align', function () {
            flashvars['infoScreen.align'] = $('#smh-modal3 #infoscreen-align').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    spinner: function () {
        $('#smh-modal3').on('click', '#loading-spinner', function (e) {
            e.stopPropagation();
            if (this.checked) {
                $('#smh-modal3 #spinner-url').removeAttr('disabled');
                $('#smh-modal3 #spinner-line-length').removeAttr('disabled');
                $('#smh-modal3 #spinner-width').removeAttr('disabled');
                $('#smh-modal3 #spinner-radius').removeAttr('disabled');
                $('#smh-modal3 #spinner-corners').removeAttr('disabled');
                $('#smh-modal3 #spinner-rotate').removeAttr('disabled');
                $('#smh-modal3 #spinner-direction').removeAttr('disabled');
                $('#smh-modal3 #spinner-color').removeAttr('disabled');
                $('#smh-modal3 #spinner-speed').removeAttr('disabled');
                $('#smh-modal3 #spinner-trail').removeAttr('disabled');
                $('#smh-modal3 #spinner-shadow').removeAttr('disabled');
                $('#smh-modal3 #spinner-top').removeAttr('disabled');
                $('#smh-modal3 #spinner-left').removeAttr('disabled');
                flashvars['loadingSpinner.plugin'] = true;
                flashvars['loadingSpinner.imageUrl'] = $('#smh-modal3 #spinner-url').val();
                flashvars['loadingSpinner.lineLength'] = $('#smh-modal3 #spinner-line-length').val();
                flashvars['loadingSpinner.width'] = $('#smh-modal3 #spinner-width').val();
                flashvars['loadingSpinner.radius'] = $('#smh-modal3 #spinner-radius').val();
                flashvars['loadingSpinner.corners'] = $('#smh-modal3 #spinner-corners').val();
                flashvars['loadingSpinner.rotate'] = $('#smh-modal3 #spinner-rotate').val();
                flashvars['loadingSpinner.direction'] = $('#smh-modal3 #spinner-direction').val();
                flashvars['loadingSpinner.color'] = $('#smh-modal3 #spinner-color').val();
                flashvars['loadingSpinner.speed'] = $('#smh-modal3 #spinner-speed').val();
                flashvars['loadingSpinner.trail'] = $('#smh-modal3 #spinner-trail').val();
                flashvars['loadingSpinner.shadow'] = $('#smh-modal3 #spinner-shadow').is(':checked') ? true : false;
                flashvars['loadingSpinner.top'] = $('#smh-modal3 #spinner-top').val();
                flashvars['loadingSpinner.left'] = $('#smh-modal3 #spinner-left').val();
            } else {
                $('#smh-modal3 #spinner-url').attr('disabled', '');
                $('#smh-modal3 #spinner-line-length').attr('disabled', '');
                $('#smh-modal3 #spinner-width').attr('disabled', '');
                $('#smh-modal3 #spinner-radius').attr('disabled', '');
                $('#smh-modal3 #spinner-corners').attr('disabled', '');
                $('#smh-modal3 #spinner-rotate').attr('disabled', '');
                $('#smh-modal3 #spinner-direction').attr('disabled', '');
                $('#smh-modal3 #spinner-color').attr('disabled', '');
                $('#smh-modal3 #spinner-speed').attr('disabled', '');
                $('#smh-modal3 #spinner-trail').attr('disabled', '');
                $('#smh-modal3 #spinner-shadow').attr('disabled', '');
                $('#smh-modal3 #spinner-top').attr('disabled', '');
                $('#smh-modal3 #spinner-left').attr('disabled', '');
                flashvars['loadingSpinner.plugin'] = false;
            }

            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#spinner-url', function () {
            flashvars['loadingSpinner.imageUrl'] = $('#smh-modal3 #spinner-url').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#spinner-line-length', function () {
            flashvars['loadingSpinner.lineLength'] = $('#smh-modal3 #spinner-line-length').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#spinner-width', function () {
            flashvars['loadingSpinner.width'] = $('#smh-modal3 #spinner-width').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#spinner-radius', function () {
            flashvars['loadingSpinner.radius'] = $('#smh-modal3 #spinner-radius').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#spinner-corners', function () {
            flashvars['loadingSpinner.corners'] = $('#smh-modal3 #spinner-corners').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#spinner-rotate', function () {
            flashvars['loadingSpinner.rotate'] = $('#smh-modal3 #spinner-rotate').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#spinner-direction', function () {
            flashvars['loadingSpinner.direction'] = $('#smh-modal3 #spinner-direction').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#spinner-color', function () {
            flashvars['loadingSpinner.color'] = $('#smh-modal3 #spinner-color').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#spinner-speed', function () {
            flashvars['loadingSpinner.speed'] = $('#smh-modal3 #spinner-speed').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#spinner-trail', function () {
            flashvars['loadingSpinner.trail'] = $('#smh-modal3 #spinner-trail').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#spinner-shadow', function () {
            flashvars['loadingSpinner.shadow'] = $('#smh-modal3 #spinner-shadow').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#spinner-top', function () {
            flashvars['loadingSpinner.top'] = $('#smh-modal3 #spinner-top').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#spinner-left', function () {
            flashvars['loadingSpinner.left'] = $('#smh-modal3 #spinner-left').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    related: function () {
        $('#smh-modal3').on('click', '#related', function (e) {
            e.stopPropagation();
            if (this.checked) {
                $('#smh-modal3 #related-location').removeAttr('disabled');
                $('#smh-modal3 #related-align').removeAttr('disabled');
                $('#smh-modal3 #related-playlist').removeAttr('disabled');
                $('#smh-modal3 #related-entries').removeAttr('disabled');
                $('#smh-modal3 #related-playback-done').removeAttr('disabled');
                $('#smh-modal3 #related-autocontinue').removeAttr('disabled');
                $('#smh-modal3 #related-autocontinue-time').removeAttr('disabled');
                $('#smh-modal3 #related-items-limit').removeAttr('disabled');
                flashvars['related.plugin'] = true;
                flashvars['related.parent'] = $('#smh-modal3 #related-location').val();
                flashvars['related.align'] = $('#smh-modal3 #related-align').val();
                flashvars['related.playlistId'] = $('#smh-modal3 #related-playlist').val();
                flashvars['related.entryList'] = $('#smh-modal3 #related-entries').val();
                flashvars['related.displayOnPlaybackDone'] = $('#smh-modal3 #related-playback-done').is(':checked') ? true : false;
                flashvars['related.autoContinueEnabled'] = $('#smh-modal3 #related-autocontinue').is(':checked') ? true : false;
                flashvars['related.autoContinueTime'] = $('#smh-modal3 #related-autocontinue-time').val();
                flashvars['related.itemsLimit'] = $('#smh-modal3 #related-items-limit').val();
            } else {
                $('#smh-modal3 #related-location').attr('disabled', '');
                $('#smh-modal3 #related-align').attr('disabled', '');
                $('#smh-modal3 #related-playlist').attr('disabled', '');
                $('#smh-modal3 #related-entries').attr('disabled', '');
                $('#smh-modal3 #related-playback-done').attr('disabled', '');
                $('#smh-modal3 #related-autocontinue').attr('disabled', '');
                $('#smh-modal3 #related-autocontinue-time').attr('disabled', '');
                $('#smh-modal3 #related-items-limit').attr('disabled', '');
                flashvars['related.plugin'] = false;
            }

            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#related-location', function () {
            flashvars['related.parent'] = $('#smh-modal3 #related-location').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#related-align', function () {
            flashvars['related.align'] = $('#smh-modal3 #related-align').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#related-playlist', function () {
            flashvars['related.playlistId'] = $('#smh-modal3 #related-playlist').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#related-entries', function () {
            flashvars['related.entryList'] = $('#smh-modal3 #related-entries').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#related-playback-done', function () {
            flashvars['related.displayOnPlaybackDone'] = $('#smh-modal3 #related-playback-done').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#related-autocontinue', function () {
            flashvars['related.autoContinueEnabled'] = $('#smh-modal3 #related-autocontinue').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#related-autocontinue-time', function () {
            flashvars['related.autoContinueTime'] = $('#smh-modal3 #related-autocontinue-time').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#related-items-limit', function () {
            flashvars['related.itemsLimit'] = $('#smh-modal3 #related-items-limit').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    //Player Scrubber Option
    playerScubber: function () {
        $('#smh-modal3').on('click', '#scrubber', function (e) {
            e.stopPropagation();
            if (this.checked) {
                flashvars['scrubber.plugin'] = true;
            } else {
                flashvars['scrubber.plugin'] = false;
            }
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    //Player Share Option
    playerShare: function () {
        $('#smh-modal3').on('click', '#share', function (e) {
            e.stopPropagation();
            if (this.checked) {
                $('#smh-modal3 #share-location').removeAttr('disabled');
                $('#smh-modal3 #share-align').removeAttr('disabled');
                $('#smh-modal3 #share-social-enabled').removeAttr('disabled');
                $('#smh-modal3 #share-embed-enabled').removeAttr('disabled');
                $('#smh-modal3 #share-time-offset').removeAttr('disabled');
                $('#smh-modal3 #share-allow-secured-embed').removeAttr('disabled');
                $('#smh-modal3 #share-networks-fb').removeAttr('disabled');
                $('#smh-modal3 #share-networks-twtr').removeAttr('disabled');
                $('#smh-modal3 #share-networks-gp').removeAttr('disabled');
                $('#smh-modal3 #share-networks-email').removeAttr('disabled');
                $('#smh-modal3 #share-networks-lnkdin').removeAttr('disabled');
                flashvars['share.plugin'] = true;
                flashvars['share.parent'] = $('#smh-modal3 #share-location').val();
                flashvars['share.align'] = $('#smh-modal3 #share-align').val();
                flashvars['share.socialShareEnabled'] = $('#smh-modal3 #share-social-enabled').is(':checked') ? true : false;
                flashvars['share.embedEnabled'] = $('#smh-modal3 #share-embed-enabled').is(':checked') ? true : false;
                flashvars['share.allowTimeOffset'] = $('#smh-modal3 #share-time-offset').is(':checked') ? true : false;
                flashvars['share.allowSecuredEmbed'] = $('#smh-modal3 #share-allow-secured-embed').is(':checked') ? true : false;

                if ($('#smh-modal3 #share-networks-fb').is(':checked')) {
                    social_networks.push("facebook");
                }
                if ($('#smh-modal3 #share-networks-twtr').is(':checked')) {
                    social_networks.push("twitter");
                }
                if ($('#smh-modal3 #share-networks-gp').is(':checked')) {
                    social_networks.push("googleplus");
                }
                if ($('#smh-modal3 #share-networks-email').is(':checked')) {
                    social_networks.push("email");
                    flashvars['share.emailEnabled'] = true;
                }
                if ($('#smh-modal3 #share-networks-lnkdin').is(':checked')) {
                    social_networks.push("linkedin");
                }
                flashvars['share.socialNetworks'] = social_networks.join();
                flashvars['share.embedOptions.width'] = $('#smh-modal3 #dim_width').val();
                flashvars['share.embedOptions.height'] = $('#smh-modal3 #dim_height').val();
            } else {
                $('#smh-modal3 #share-location').attr('disabled', '');
                $('#smh-modal3 #share-align').attr('disabled', '');
                $('#smh-modal3 #share-social-enabled').attr('disabled', '');
                $('#smh-modal3 #share-embed-enabled').attr('disabled', '');
                $('#smh-modal3 #share-time-offset').attr('disabled', '');
                $('#smh-modal3 #share-allow-secured-embed').attr('disabled', '');
                $('#smh-modal3 #share-networks-fb').attr('disabled', '');
                $('#smh-modal3 #share-networks-twtr').attr('disabled', '');
                $('#smh-modal3 #share-networks-gp').attr('disabled', '');
                $('#smh-modal3 #share-networks-email').attr('disabled', '');
                $('#smh-modal3 #share-networks-lnkdin').attr('disabled', '');
                flashvars['share.plugin'] = false;
            }

            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#share-location', function () {
            flashvars['share.parent'] = $('#smh-modal3 #share-location').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#share-align', function () {
            flashvars['share.align'] = $('#smh-modal3 #share-align').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#share-social-enabled', function () {
            flashvars['share.socialShareEnabled'] = $('#smh-modal3 #share-social-enabled').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#share-embed-enabled', function () {
            flashvars['share.embedEnabled'] = $('#smh-modal3 #share-embed-enabled').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#share-time-offset', function () {
            flashvars['share.allowTimeOffset'] = $('#smh-modal3 #share-time-offset').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#share-allow-secured-embed', function () {
            flashvars['share.allowSecuredEmbed'] = $('#smh-modal3 #share-allow-secured-embed').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#share-networks-fb', function () {
            if ($('#smh-modal3 #share-networks-fb').is(':checked')) {
                if ($.inArray('facebook', social_networks) == -1) {
                    social_networks.push("facebook");
                }
            } else {
                if ($.inArray('facebook', social_networks) != -1) {
                    var index = social_networks.indexOf("facebook");
                    if (index >= 0) {
                        social_networks.splice(index, 1);
                    }
                }
            }
            flashvars['share.socialNetworks'] = social_networks.join();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#share-networks-twtr', function () {
            if ($('#smh-modal3 #share-networks-twtr').is(':checked')) {
                if ($.inArray('twitter', social_networks) == -1) {
                    social_networks.push("twitter");
                }
            } else {
                if ($.inArray('twitter', social_networks) != -1) {
                    var index = social_networks.indexOf("twitter");
                    if (index >= 0) {
                        social_networks.splice(index, 1);
                    }
                }
            }
            flashvars['share.socialNetworks'] = social_networks.join();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#share-networks-gp', function () {
            if ($('#smh-modal3 #share-networks-gp').is(':checked')) {
                if ($.inArray('googleplus', social_networks) == -1) {
                    social_networks.push("googleplus");
                }
            } else {
                if ($.inArray('googleplus', social_networks) != -1) {
                    var index = social_networks.indexOf("googleplus");
                    if (index >= 0) {
                        social_networks.splice(index, 1);
                    }
                }
            }
            flashvars['share.socialNetworks'] = social_networks.join();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#share-networks-email', function () {
            if ($('#smh-modal3 #share-networks-email').is(':checked')) {
                if ($.inArray('email', social_networks) == -1) {
                    social_networks.push("email");
                }
            } else {
                if ($.inArray('email', social_networks) != -1) {
                    var index = social_networks.indexOf("email");
                    if (index >= 0) {
                        social_networks.splice(index, 1);
                    }
                }
            }
            flashvars['share.socialNetworks'] = social_networks.join();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#share-networks-lnkdin', function () {
            if ($('#smh-modal3 #share-networks-lnkdin').is(':checked')) {
                if ($.inArray('linkedin', social_networks) == -1) {
                    social_networks.push("linkedin");
                }
            } else {
                if ($.inArray('linkedin', social_networks) != -1) {
                    var index = social_networks.indexOf("linkedin");
                    if (index >= 0) {
                        social_networks.splice(index, 1);
                    }
                }
            }
            flashvars['share.socialNetworks'] = social_networks.join();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    //Player Download Option
    playerDownload: function () {
        $('#smh-modal3').on('click', '#download', function (e) {
            e.stopPropagation();
            if (this.checked) {
                $('#smh-modal3 #dwnld-location').removeAttr('disabled');
                $('#smh-modal3 #dwnld-align').removeAttr('disabled');
                $('#smh-modal3 #dwnld-flavorid').removeAttr('disabled');
                $('#smh-modal3 #dwnld-pre-flavor').removeAttr('disabled');
                flashvars['download.plugin'] = true;
                flashvars['download.parent'] = $('#smh-modal3 #dwnld-location').val();
                flashvars['download.align'] = $('#smh-modal3 #dwnld-align').val();
                flashvars['download.flavorID'] = $('#smh-modal3 #dwnld-flavorid').val();
                flashvars['download.preferredBitrate'] = $('#smh-modal3 #dwnld-pre-flavor').val();
            } else {
                $('#smh-modal3 #dwnld-location').attr('disabled', '');
                $('#smh-modal3 #dwnld-align').attr('disabled', '');
                $('#smh-modal3 #dwnld-flavorid').attr('disabled', '');
                $('#smh-modal3 #dwnld-pre-flavor').attr('disabled', '');
                flashvars['download.plugin'] = false;
            }

            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#dwnld-location', function () {
            flashvars['download.parent'] = $('#smh-modal3 #dwnld-location').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#dwnld-align', function () {
            flashvars['download.align'] = $('#smh-modal3 #dwnld-align').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#dwnld-flavorid', function () {
            flashvars['download.flavorID'] = $('#smh-modal3 #dwnld-flavorid').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#dwnld-pre-flavor', function () {
            flashvars['download.preferredBitrate'] = $('#smh-modal3 #dwnld-pre-flavor').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    //Player Thumbnail Option
    playerThumbnail: function () {
        $('#smh-modal3').on('click', '#thumbnail', function (e) {
            e.stopPropagation();
            if (this.checked) {
                $('#smh-modal3 #thumbnail_tool').removeAttr('disabled');
                flashvars['captureThumbnail.plugin'] = true;
                flashvars['captureThumbnail.tooltip'] = $('#smh-modal3 #thumbnail_tool').val();
            } else {
                $('#smh-modal3 #thumbnail_tool').attr('disabled', '');
                flashvars['captureThumbnail.plugin'] = false;
            }

            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#thumbnail_tool', function () {
            flashvars['captureThumbnail.tooltip'] = $('#smh-modal3 #thumbnail_tool').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    //Player Captions Option
    playerCaptions: function () {
        $('#smh-modal3').on('click', '#captions', function (e) {
            e.stopPropagation();
            if (this.checked) {
                $('#smh-modal3 #cap_textcolor').removeAttr('disabled');
                $('#smh-modal3 #cap-use-glow').removeAttr('disabled');
                $('#smh-modal3 #cap_glowcolor').removeAttr('disabled');
                $('#smh-modal3 #cap_glowblur').removeAttr('disabled');
                $('#smh-modal3 #cap_backcolor').removeAttr('disabled');
                $('#smh-modal3 #cap_fontsize').removeAttr('disabled');
                $('#smh-modal3 #cap-fontfam').removeAttr('disabled');
                $('#smh-modal3 #cap-display').removeAttr('disabled');
                $('#smh-modal3 #cap-hide').removeAttr('disabled');
                flashvars['closedCaptions.plugin'] = true;
                flashvars['closedCaptions.fontColor'] = $('#smh-modal3 #cap_textcolor').val();
                flashvars['closedCaptions.useGlow'] = $('#smh-modal3 #cap-use-glow').is(':checked') ? true : false;
                flashvars['closedCaptions.glowColor'] = $('#smh-modal3 #cap_glowcolor').val();
                flashvars['closedCaptions.glowBlur'] = $('#smh-modal3 #cap_glowblur').val();
                flashvars['closedCaptions.bg'] = $('#smh-modal3 #cap_backcolor').val();
                flashvars['closedCaptions.fontsize'] = $('#smh-modal3 #cap_fontsize').val();
                flashvars['closedCaptions.fontFamily'] = $('#smh-modal3 #cap-fontfam').val();
                flashvars['closedCaptions.displayCaptions'] = $('#smh-modal3 #cap-display').is(':checked') ? true : false;
                flashvars['closedCaptions.hideWhenEmpty'] = $('#smh-modal3 #cap-hide').is(':checked') ? true : false;

            } else {
                $('#smh-modal3 #cap_textcolor').attr('disabled', '');
                $('#smh-modal3 #cap-use-glow').attr('disabled', '');
                $('#smh-modal3 #cap_glowcolor').attr('disabled', '');
                $('#smh-modal3 #cap_glowblur').attr('disabled', '');
                $('#smh-modal3 #cap_backcolor').attr('disabled', '');
                $('#smh-modal3 #cap_fontsize').attr('disabled', '');
                $('#smh-modal3 #cap-fontfam').attr('disabled', '');
                $('#smh-modal3 #cap-display').attr('disabled', '');
                $('#smh-modal3 #cap-hide').attr('disabled', '');
                flashvars['closedCaptions.plugin'] = false;
            }
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#cap-use-glow', function () {
            flashvars['closedCaptions.useGlow'] = $('#smh-modal3 #cap-use-glow').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#cap_glowblur', function () {
            flashvars['closedCaptions.glowBlur'] = $('#smh-modal3 #cap_glowblur').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#cap_fontsize', function () {
            flashvars['closedCaptions.fontsize'] = $('#smh-modal3 #cap_fontsize').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#cap-fontfam', function () {
            flashvars['closedCaptions.fontFamily'] = $('#smh-modal3 #cap-fontfam').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#cap-display', function () {
            flashvars['closedCaptions.displayCaptions'] = $('#smh-modal3 #cap-display').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#cap-hide', function () {
            flashvars['closedCaptions.hideWhenEmpty'] = $('#smh-modal3 #cap-hide').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    //Player Bumper Options
    playerBumper: function () {
        $('#smh-modal3').on('click', '#bumper', function (e) {
            e.stopPropagation();
            if (this.checked) {
                flashvars['bumper.plugin'] = true;
                $('#smh-modal3 #bumper_id').removeAttr('disabled');
                $('#smh-modal3 #bumper_url').removeAttr('disabled');
                $('#smh-modal3 #bumper_sequence').removeAttr('disabled');
                var bumper_sequence = $('#smh-modal3 #bumper_sequence').val();
                flashvars['bumper.bumperEntryID'] = $('#smh-modal3 #bumper_id').val();
                flashvars['bumper.clickurl'] = $('#smh-modal3 #bumper_url').val();
                if (bumper_sequence == 'before') {
                    if ($('#smh-modal3 #vast').is(':checked')) {
                        flashvars['bumper.preSequence'] = 2;
                    } else {
                        flashvars['bumper.preSequence'] = 1;
                    }
                    flashvars['bumper.postSequence'] = 0;
                } else if (bumper_sequence == 'after') {
                    flashvars['bumper.preSequence'] = 0;
                    flashvars['bumper.postSequence'] = 1;
                } else {
                    flashvars['bumper.preSequence'] = 1;
                    flashvars['bumper.postSequence'] = 1;
                }
            } else {
                flashvars['bumper.plugin'] = false;
                $('#smh-modal3 #bumper_id').attr('disabled', '');
                $('#smh-modal3 #bumper_url').attr('disabled', '');
                $('#smh-modal3 #bumper_sequence').attr('disabled', '');
                flashvars['bumper.bumperEntryID'] = '';
                flashvars['bumper.clickurl'] = '';
                flashvars['bumper.preSequence'] = 0;
                flashvars['bumper.postSequence'] = 0;
            }
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#bumper_id', function () {
            flashvars['bumper.bumperEntryID'] = $('#smh-modal3 #bumper_id').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#bumper_url', function () {
            flashvars['bumper.clickurl'] = $('#smh-modal3 #bumper_url').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#bumper_sequence', function () {
            var bumper_sequence = $('#smh-modal3 #bumper_sequence').val();
            if (bumper_sequence == 'before') {
                if ($('#smh-modal3 #vast').is(':checked')) {
                    flashvars['bumper.preSequence'] = 2;
                } else {
                    flashvars['bumper.preSequence'] = 1;
                }
                flashvars['bumper.postSequence'] = 0;
            } else if (bumper_sequence == 'after') {
                flashvars['bumper.preSequence'] = 0;
                if ($('#smh-modal3 #vast').is(':checked')) {
                    flashvars['bumper.postSequence'] = 2;
                } else {
                    flashvars['bumper.postSequence'] = 1;
                }
            } else {
                if ($('#smh-modal3 #vast').is(':checked')) {
                    flashvars['bumper.preSequence'] = 2;
                } else {
                    flashvars['bumper.preSequence'] = 1;
                }
                if ($('#smh-modal3 #vast').is(':checked')) {
                    flashvars['bumper.postSequence'] = 2;
                } else {
                    flashvars['bumper.postSequence'] = 1;
                }
            }
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    skipButton: function () {
        $('#smh-modal3').on('click', '#ad_skip_button', function (e) {
            e.stopPropagation();
            if (this.checked) {
                $('#smh-modal3 #skip_text').removeAttr('disabled');
                $('#smh-modal3 #timeout').removeAttr('disabled');
                flashvars['skipBtn.plugin'] = true;
                flashvars['skipBtn.label'] = $('#smh-modal3 #skip_text').val();
                flashvars['skipBtn.skipOffset'] = $('smh-modal3 #timeout').val();
            } else {
                $('#smh-modal3 #skip_text').attr('disabled', '');
                $('#smh-modal3 #timeout').attr('disabled', '');
                flashvars['skipBtn.plugin'] = false;
            }
        });
        $('#smh-modal3').on('change', '#skip_text', function () {
            flashvars['skipBtn.label'] = $('#smh-modal3 #skip_text').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#timeout', function () {
            flashvars['skipBtn.skipOffset'] = $('#smh-modal3 #timeout').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    //Player Vast Options
    playerVast: function () {
        $('#smh-modal3').on('click', '#vast', function (e) {
            e.stopPropagation();
            if (this.checked) {
                flashvars['vast.plugin'] = true;
                $('#smh-modal3 #pause-onclick').removeAttr('disabled');
                $('#smh-modal3 #enable-cors').removeAttr('disabled');
                $('#smh-modal3 #load-ads-onplay').removeAttr('disabled');
                $('#smh-modal3 input[name="notice_display"]').removeAttr('disabled');
                $('#smh-modal3 input[name="ad_skip_notice"]').removeAttr('disabled');
                if ($('#smh-modal3 #pause-onclick').is(':checked')) {
                    $('#smh-modal3 #pause-onclick').removeAttr('disabled');
                    flashvars['vast.pauseAdOnClick'] = true;
                } else {
                    flashvars['vast.pauseAdOnClick'] = false;
                }
                if ($('#smh-modal3 #enable-cors').is(':checked')) {
                    $('#smh-modal3 #enable-cors').removeAttr('disabled');
                    flashvars['vast.enableCORS'] = true;
                } else {
                    flashvars['vast.enableCORS'] = false;
                }
                if ($('#smh-modal3 #load-ads-onplay').is(':checked')) {
                    $('#smh-modal3 #load-ads-onplay').removeAttr('disabled');
                    flashvars['vast.loadAdsOnPlay'] = true;
                } else {
                    flashvars['vast.loadAdsOnPlay'] = false;
                }
                if ($('#smh-modal3 #notice_text_yes').is(':checked')) {
                    $('#smh-modal3 #notice_text').removeAttr('disabled');
                    flashvars['noticeMessage.plugin'] = true;
                    flashvars['noticeMessage.text'] = $('#smh-modal3 #notice_text').val();
                } else {
                    $('#smh-modal3 #notice_text').attr('disabled', '');
                    flashvars['noticeMessage.plugin'] = false;
                }
                if ($('#smh-modal3 #ad_skip_notice_yes').is(':checked')) {
                    $('#smh-modal3 #skip_notice_text').removeAttr('disabled');
                    flashvars['skipNotice.plugin'] = true;
                    flashvars['skipNotice.text'] = $('#smh-modal3 #skip_notice_text').val();
                } else {
                    $('#smh-modal3 #skip_notice_text').attr('disabled', '');
                    flashvars['skipNotice.plugin'] = false;
                }
                $('#smh-modal3 #preroll_url').removeAttr('disabled');
                $('#smh-modal3 #preroll_amount').removeAttr('disabled');
                $('#smh-modal3 #preroll_start').removeAttr('disabled');
                $('#smh-modal3 #preroll_interval').removeAttr('disabled');

                if ($('#smh-modal3 #bumper').is(':checked')) {
                    var bumper_sequence = $('#smh-modal3 #bumper_sequence').val();
                    if (bumper_sequence == 'before' || bumper_sequence == 'both') {
                        flashvars['bumper.preSequence'] = 2;
                    }
                }

                flashvars['vast.preSequence'] = 1;
                flashvars['vast.prerollUrl'] = $('#smh-modal3 #preroll_url').val();
                flashvars['vast.numPreroll'] = $('#smh-modal3 #preroll_amount').val();
                flashvars['vast.prerollStartWith'] = $('#smh-modal3 #preroll_start').val();
                flashvars['vast.prerollStartWith'] = $('#smh-modal3 #preroll_interval').val();

                $('#smh-modal3 #overlay_url').removeAttr('disabled');
                $('#smh-modal3 #overlay_start').removeAttr('disabled');
                $('#smh-modal3 #overlay_interval').removeAttr('disabled');
                $('#smh-modal3 #overlay_timeout').removeAttr('disabled');
                flashvars['vast.overlayUrl'] = $('#smh-modal3 #overlay_url').val();
                flashvars['vast.overlayStartAt'] = $('#smh-modal3 #overlay_start').val();
                flashvars['vast.overlayInterval'] = $('#smh-modal3 #overlay_interval').val();
                flashvars['vast.timeout'] = $('#smh-modal3 #overlay_timeout').val();

                $('#smh-modal3 #postroll_url').removeAttr('disabled');
                $('#smh-modal3 #postroll_amount').removeAttr('disabled');
                $('#smh-modal3 #postroll_start').removeAttr('disabled');
                $('#smh-modal3 #postroll_interval').removeAttr('disabled');

                if ($('#smh-modal3 #bumper').is(':checked')) {
                    var bumper_sequence = $('#smh-modal3 #bumper_sequence').val();
                    if (bumper_sequence == 'after' || bumper_sequence == 'both') {
                        flashvars['bumper.postSequence'] = 2;
                    }
                }
                flashvars['vast.postSequence'] = 1;
                flashvars['vast.postrollUrl'] = $('#smh-modal3 #postroll_url').val();
                flashvars['vast.numPostroll'] = $('#smh-modal3 #postroll_amount').val();
                flashvars['vast.postrollStartWith'] = $('#smh-modal3 #postroll_start').val();
                flashvars['vast.postrollStartWith'] = $('#smh-modal3 #postroll_interval').val();
            } else {
                flashvars['vast.plugin'] = false;
                $('#smh-modal3 #pause-onclick').attr('disabled', '');
                $('#smh-modal3 #enable-cors').attr('disabled', '');
                $('#smh-modal3 #load-ads-onplay').attr('disabled', '');
                $('#smh-modal3 input[name="notice_display"]').attr('disabled', '');
                $('#smh-modal3 #notice_text').attr('disabled', '');
                $('#smh-modal3 input[name="ad_skip_notice"]').attr('disabled', '');
                $('#smh-modal3 #skip_notice_text').attr('disabled', '');
                $('#smh-modal3 input[name="preroll_enable"]').attr('disabled', '');
                $('#smh-modal3 #preroll_url').attr('disabled', '');
                $('#smh-modal3 #preroll_amount').attr('disabled', '');
                $('#smh-modal3 #preroll_start').attr('disabled', '');
                $('#smh-modal3 #preroll_interval').attr('disabled', '');
                if ($('#smh-modal3 #bumper').is(':checked')) {
                    var bumper_sequence = $('#smh-modal3 #bumper_sequence').val();
                    if (bumper_sequence == 'before' || bumper_sequence == 'both') {
                        flashvars['bumper.preSequence'] = 1;
                    }
                }
                flashvars['noticeMessage.plugin'] = false;
                flashvars['vast.preSequence'] = 0;
                flashvars['skipNotice.plugin'] = false;

                $('#smh-modal3 #overlay_url').attr('disabled', '');
                $('#smh-modal3 #overlay_start').attr('disabled', '');
                $('#smh-modal3 #overlay_interval').attr('disabled', '');
                $('#smh-modal3 #overlay_timeout').attr('disabled', '');

                $('#smh-modal3 #postroll_url').attr('disabled', '');
                $('#smh-modal3 #postroll_amount').attr('disabled', '');
                $('#smh-modal3 #postroll_start').attr('disabled', '');
                $('#smh-modal3 #postroll_interval').attr('disabled', '');
                if ($('#smh-modal3 #bumper').is(':checked')) {
                    var bumper_sequence = $('#smh-modal3 #bumper_sequence').val();
                    if (bumper_sequence == 'before' || bumper_sequence == 'both') {
                        flashvars['bumper.postSequence'] = 1;
                    }
                }
                flashvars['vast.postSequence'] = 0;
            }
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', 'input[name="notice_display"]', function () {
            if ($('#smh-modal3 #notice_text_yes').is(':checked')) {
                $('#smh-modal3 #notice_text').removeAttr('disabled');
                flashvars['noticeMessage.plugin'] = true;
                flashvars['noticeMessage.text'] = $('#smh-modal3 #notice_text').val();
            } else {
                $('#smh-modal3 #notice_text').attr('disabled', '');
                flashvars['noticeMessage.plugin'] = false;
            }
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#notice_text', function () {
            flashvars['noticeMessage.text'] = $('#smh-modal3 #notice_text').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', 'input[name="ad_skip_notice"]', function () {
            if ($('#smh-modal3 #ad_skip_notice_yes').is(':checked')) {
                $('#smh-modal3 #skip_notice_text').removeAttr('disabled');
                flashvars['skipNotice.plugin'] = true;
                flashvars['skipNotice.text'] = $('#smh-modal3 #skip_notice_text').val();
            } else {
                $('#smh-modal3 #skip_notice_text').attr('disabled', '');
                flashvars['skipNotice.plugin'] = false;
            }
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#skip_notice_text', function () {
            flashvars['skipNotice.text'] = $('#smh-modal3 #skip_notice_text').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#pause-onclick', function () {
            if ($('#smh-modal3 #pause-onclick').is(':checked')) {
                flashvars['vast.pauseAdOnClick'] = true;
            } else {
                flashvars['vast.pauseAdOnClick'] = false;
            }
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#enable-cors', function () {
            if ($('#smh-modal3 #enable-cors').is(':checked')) {
                flashvars['vast.enableCORS'] = true;
            } else {
                flashvars['vast.enableCORS'] = false;
            }
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#load-ads-onplay', function () {
            if ($('#smh-modal3 #load-ads-onplay').is(':checked')) {
                flashvars['vast.loadAdsOnPlay'] = true;
            } else {
                flashvars['vast.loadAdsOnPlay'] = false;
            }
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#preroll_url', function () {
            flashvars['vast.prerollUrl'] = $('#smh-modal3 #preroll_url').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#preroll_amount', function () {
            flashvars['vast.numPreroll'] = $('#smh-modal3 #preroll_amount').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#preroll_start', function () {
            flashvars['vast.prerollStartWith'] = $('#smh-modal3 #preroll_start').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#preroll_interval', function () {
            flashvars['vast.prerollInterval'] = $('#smh-modal3 #preroll_interval').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#overlay_url', function () {
            flashvars['vast.overlayUrl'] = $('#smh-modal3 #overlay_url').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#overlay_start', function () {
            flashvars['vast.overlayStartAt'] = $('#smh-modal3 #overlay_start').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#overlay_interval', function () {
            flashvars['vast.overlayInterval'] = $('#smh-modal3 #overlay_interval').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#overlay_timeout', function () {
            flashvars['vast.timeout'] = $('#smh-modal3 #overlay_timeout').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#postroll_url', function () {
            flashvars['vast.postrollUrl'] = $('#smh-modal3 #postroll_url').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#postroll_amount', function () {
            flashvars['vast.numPostroll'] = $('#smh-modal3 #postroll_amount').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#postroll_start', function () {
            flashvars['vast.postrollStartWith'] = $('#smh-modal3 #postroll_start').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#postroll_interval', function () {
            flashvars['vast.postrollInterval'] = $('#smh-modal3 #postroll_interval').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    playlist: function () {
        $('#smh-modal3').on('change', '#plist-position', function () {
            flashvars['playlistAPI.containerPosition'] = $('#smh-modal3 #plist-position').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#plist-layout', function () {
            flashvars['playlistAPI.layout'] = $('#smh-modal3 #plist-layout').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#hidePlaylist', function () {
            flashvars['playlistAPI.includeInLayout'] = $('#smh-modal3 #hidePlaylist').is(':checked') ? false : true;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#showControls', function () {
            flashvars['playlistAPI.showControls'] = $('#smh-modal3 #showControls').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#includeHeader', function () {
            flashvars['playlistAPI.includeHeader'] = $('#smh-modal3 #includeHeader').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#autoContinue', function () {
            flashvars['playlistAPI.autoContinue'] = $('#smh-modal3 #autoContinue').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#playlistAutoPlay', function () {
            flashvars['playlistAPI.autoPlay'] = $('#smh-modal3 #playlistAutoPlay').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#playlistLoop', function () {
            flashvars['playlistAPI.loop'] = $('#smh-modal3 #playlistLoop').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#hideClipPost', function () {
            flashvars['playlistAPI.hideClipPoster'] = $('#smh-modal3 #hideClipPost').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#plist-min-clips', function () {
            flashvars['playlistAPI.MinClips'] = $('#smh-modal3 #plist-min-clips').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#plist-max-clips', function () {
            flashvars['playlistAPI.MaxClips'] = $('#smh-modal3 #plist-max-clips').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#plist-init-entryid', function () {
            flashvars['playlistAPI.initItemEntryId'] = $('#smh-modal3 #plist-init-entryid').val();
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
    },
    //Player Bumper Options
    playerVr: function () {
        $('#smh-modal3').on('click', '#vr-enabled', function (e) {
            e.stopPropagation();
            if (this.checked) {
                $('#smh-modal3 #vr-format-options select').removeAttr('disabled');
                $('#smh-modal3 #comp-options input').removeAttr('disabled');
                $('#smh-modal3 #vr-options a').removeClass('disable-link');

                var fb_eid = $('#smh-modal3 #update-fb-eid').text();
                var fb_selected = false;
                if (fb_eid !== 'None Selected') {
                    fb_selected = true;
                }

                var vr_format_selected = $('#smh-modal3 #vr-format-options select').val();
                var vr_format = '';
                if (vr_format_selected === '2d') {
                    vr_format = '{onPagePluginPath}/smhVR/js/vrIframeAddin2D.js';
                } else if (vr_format_selected === 'sbs') {
                    vr_format = '{onPagePluginPath}/smhVR/js/vrIframeAddinSBS.js';
                } else {
                    vr_format = '{onPagePluginPath}/smhVR/js/vrIframeAddinTB.js';
                }
                flashvars['smhVR.plugin'] = true;
                flashvars['smhVR.iframeHTML5Js1'] = vr_format;
                flashvars['smhVRBtn.plugin'] = true;
                if (fb_selected) {
                    flashvars['smhVR.fallbackEntryID'] = fb_eid;
                }
                if ($("#smh-modal3 #error-comp").is(':checked')) {
                    delete flashvars['smhVR.showCompMessage'];
                } else {
                    flashvars['smhVR.showCompMessage'] = false;
                }
            } else {
                $('#smh-modal3 #vr-format-options select').attr('disabled', '');
                $('#smh-modal3 #comp-options input').attr('disabled', '');
                $('#smh-modal3 #vr-options a').addClass('disable-link');
                flashvars['smhVR.plugin'] = false;
                flashvars['smhVRBtn.plugin'] = false;
                delete flashvars['smhVR.fallbackEntryID'];
                delete flashvars['smhVR.iframeHTML5Js1'];
                delete flashvars['smhVR.showCompMessage'];
            }
            $('#smh-modal3 #vr-format-options').on('change', 'select', function (e) {
                var vr_format_selected = $('#smh-modal3 #vr-format-options select').val();
                var vr_format = '';
                if (vr_format_selected === '2d') {
                    vr_format = '{onPagePluginPath}/smhVR/js/vrIframeAddin2D.js';
                } else if (vr_format_selected === 'sbs') {
                    vr_format = '{onPagePluginPath}/smhVR/js/vrIframeAddinSBS.js';
                } else {
                    vr_format = '{onPagePluginPath}/smhVR/js/vrIframeAddinTB.js';
                }
                flashvars['smhVR.iframeHTML5Js1'] = vr_format;
                if (auto_preview) {
                    smhPlayers.refreshPlayer();
                }
            });
            $('#smh-modal2').on('click', '#doFBSelect', function (event) {
                var fb_eid = $('#smh-modal3 #update-fb-eid').text();
                var fb_selected = false;
                if (fb_eid !== 'None Selected') {
                    fb_selected = true;
                }
                if (fb_selected) {
                    flashvars['smhVR.fallbackEntryID'] = fb_eid;
                } else {
                    delete flashvars['smhVR.fallbackEntryID'];
                }
                if (auto_preview) {
                    smhPlayers.refreshPlayer();
                }
            });
            $('#smh-modal3').on('click', '#error-comp', function (event) {
                if ($("#error-comp").is(':checked')) {
                    delete flashvars['smhVR.showCompMessage'];
                } else {
                    flashvars['smhVR.showCompMessage'] = false;
                }
                if (auto_preview) {
                    smhPlayers.refreshPlayer();
                }
            });

            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal2').on('click', '#doFBSelect', function (event) {
            fb_eid = null;
            var rowcollection = fbTable.$(".fb-entry:checked", {
                "page": "all"
            });
            rowcollection.each(function (index, elem) {
                var checkbox_value = $(elem).val();
                fb_eid = checkbox_value;
            });
            if (fb_eid) {
                $('#update-fb-eid').text(fb_eid);
            } else {
                $('#update-fb-eid').text('None Selected');
            }
            $(".smh-close2").click();
        });
    },
    purgeCache: function (asset) {
        var response = false;
        var sessData = {
            action: 'purge_cache',
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            asset: asset
        }

        $.ajax({
            cache: false,
            url: CacheApiUrl,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            async: false,
            success: function (data) {
                if (data['success']) {
                    response = true;
                }
            }
        });
        return response;
    },
    //Register actions
    registerActions: function () {
        $('#smh-modal3').on('click', '.player_close', function (event) {
            edit = false;
        });

        $('#smh-modal2').on('click', '.smh-close2', function () {
            $('#smh-modal3').css('z-index', '');
            $('#smh-modal2').on('hidden.bs.modal', function (e) {
                $('body').addClass('modal-open');
            });
        });
        $(window).resize(function () {
            smhPlayers.fontsize()
        });
        $('#smh-modal3').on('change', '#aspect_ratio', function () {
            var ratio = $('#aspect_ratio').val();
            var width, height;
            if (ratio !== 'dim_custom') {
                $('#dim_height').attr('disabled', '');
                var aspect = ratio == 'dim_16_9' ? 9 / 16 : 3 / 4;
                width = $('#dim_width').val();
                height = parseInt(width * aspect);
                $('#dim_height').val(height);
                if (auto_preview) {
                    smhPlayers.refreshPlayer();
                }
            } else {
                $('#dim_height').removeAttr('disabled');
                if (auto_preview) {
                    smhPlayers.refreshPlayer();
                }
            }
        });

        $('#smh-modal3').on('keyup', '#dim_width', function () {
            var ratio = $('#aspect_ratio').val();
            var width, height;
            if (ratio !== 'dim_custom') {
                var aspect = ratio == 'dim_16_9' ? 9 / 16 : 3 / 4;
                width = $('#dim_width').val();
                height = parseInt(width * aspect);
                $('#dim_height').val(height);
                if (auto_preview) {
                    smhPlayers.refreshPlayer();
                }
            }
        });
        $('#smh-modal3').on('change', '#auto_play', function () {
            flashvars['autoPlay'] = $('#auto_play').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#start_muted', function () {
            flashvars['autoMute'] = $('#start_muted').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#hovering_controls', function () {
            flashvars['controlBarContainer.hover'] = $('#hovering_controls').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#show-tooltips', function () {
            flashvars['enableTooltips'] = $('#show-tooltips').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#ads-onreplay', function () {
            flashvars['adsOnReplay'] = $('#ads-onreplay').is(':checked') ? true : false;
            if (auto_preview) {
                smhPlayers.refreshPlayer();
            }
        });
        $('#smh-modal3').on('change', '#theme-button-size', function () {
            var size = $('#theme-button-size').val();
            var dimSize = Number(size) + 4;
            if (flashvars['theme.applyToLargePlayButton']) {
                var videoHolder = $("#smh_player_ifp").contents().find(".videoHolder");
                videoHolder.css("cssText", "font-size: " + size + "px !important;");
            }
            var btnSize = $("#smh_player_ifp").contents().find(".mwPlayerContainer:not(.mobileSkin) .btn:not(.playHead)");
            var playPauseBtn = $("#smh_player_ifp").contents().find(".playPauseBtn");
            btnSize.css("cssText", playPauseBtn.attr('style') + '; ' + "font-size: " + size + "px !important;");
            var controlsContainer = $("#smh_player_ifp").contents().find(".controlsContainer");
            controlsContainer.css("cssText", controlsContainer.attr('style') + '; ' + "font-size: " + size + "px !important;");
            var scrubber = $("#smh_player_ifp").contents().find(".scrubber");
            scrubber.css("cssText", scrubber.attr('style') + '; ' + "font-size: " + size + "px !important;");
            var playHead = $("#smh_player_ifp").contents().find(".scrubber .playHead");
            playHead.css("cssText", playHead.attr('style') + '; ' + "font-size: " + size + "px !important; height: " + dimSize + "px !important; width: " + dimSize + "px !important;");
            var topBarContainer = $("#smh_player_ifp").contents().find(".topBarContainer");
            topBarContainer.css("cssText", topBarContainer.attr('style') + '; ' + "font-size: " + size + "px !important;");
            flashvars['theme.buttonsSize'] = size;
        });
        $('#smh-modal3').on('change', '#theme-apply-icon-shadow', function () {
            var btn = $("#smh_player_ifp").contents().find(".mwPlayerContainer:not(.mobileSkin) .btn:not(.playHead)");
            var playPauseBtn = $("#smh_player_ifp").contents().find(".playPauseBtn");
            if ($('#theme-apply-icon-shadow').is(':checked')) {
                flashvars['theme.buttonsIconColorDropShadow'] = true;
                btn.css("cssText", playPauseBtn.attr('style') + '; ' + "text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8) !important;");
            } else {
                flashvars['theme.buttonsIconColorDropShadow'] = false;
                btn.css("cssText", playPauseBtn.attr('style') + '; ' + "text-shadow: 0 0 0 rgba(0, 0, 0, 0) !important;");
            }
        });
        $('#smh-modal3').on('change', '#theme-apply-large-button', function () {
            var largePlayBtn = $("#smh_player_ifp").contents().find(".largePlayBtn");
            if ($('#theme-apply-large-button').is(':checked')) {
                largePlayBtn.css("cssText", largePlayBtn.attr('style') + '; ' + "background-color: " + flashvars['theme.buttonsColor'] + " !important; color: " + flashvars['theme.buttonsIconColor'] + " !important;");
                flashvars['theme.applyToLargePlayButton'] = true;
            } else {
                largePlayBtn.css("cssText", largePlayBtn.attr('style') + '; ' + "background-color: #000000 !important; color: #ffffff !important;");
                flashvars['theme.applyToLargePlayButton'] = false;
            }
        });
    }
}

// Main on ready
$(document).ready(function () {
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
    smhPlayers.controlBar();
    smhPlayers.playbackRate();
    smhPlayers.resumePlayback();
    smhPlayers.chromecast();
    smhPlayers.related();
    smhPlayers.infoScreen();
    smhPlayers.spinner();
    smhPlayers.playerScubber();
    smhPlayers.playerShare();
    smhPlayers.playerDownload();
    smhPlayers.playerThumbnail();
    smhPlayers.playerCaptions();
    smhPlayers.playerBumper();
    smhPlayers.skipButton();
    smhPlayers.playerVast();
    smhPlayers.playlist();
    smhPlayers.playerVr();
    smhPlayers.getCats();
    smhPlayers.getAccessControlProfiles();
    smhPlayers.getFlavors();
});
