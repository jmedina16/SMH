/*
 *
 *	Streaming Media Hosting
 *	
 *	LiveStreams
 *
 *	9-15-2015
 */
//Main constructor
function LiveStreams() {}

//Global variables
var bulkdelete = new Array();
var bulkac = new Array();
var bulktags = new Array();
var bulkcat = new Array();
var uiconf_ids = new Array();
var categories = [];
var cats = [];
var categoryIDs = [];
var ac = [];
var ac_select = {};
var ac_filter = [];
var shortlink;
var validator;
var num = 1;
var graph1, count_plays, pageSize, days_glbl, days_from_today_glbl, total_entries;
var graph_entryId = null;
var SnApiUrl = "/apps/sn/v1.0/dev.php?";
var CacheApiUrl = "/apps/cache/v1.0/index.php?";
var yt_ready = false;
var yt_embed = false;
var fb_ready = false;
var twch_ready = false;

//Login prototype/class
LiveStreams.prototype = {
    constructor: LiveStreams,
    //Build tickets table
    getLiveStreams: function () {
        var categories_id = categoryIDs.join();
        var ac_id = ac_filter.join();
        var timezone = jstz.determine();
        var tz = timezone.name();
        var columns = [];
        if (services.sn == 1) {
            columns = [
                {
                    "title": "<span style='float: left;'><input type='checkbox' class='livestream-bulk' id='livestream-bulkAll' style='width:16px; margin-right: 7px;' name='livestream_bulkAll' /></span>",
                    "width": "10px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Thumbnail</div></span>",
                    "width": "177px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Name</div></span>",
                    "width": "222px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>ID</div></span>",
                    "width": "90px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Encoder Settings</div></span>",
                    "width": "120px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Created On</div></span>",
                    "width": "150px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Social Media</div></span>",
                    "width": "130px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Statistics <i data-placement='top' data-toggle='tooltip' data-delay=\'{\"show\":700, \"hide\":30}\' data-original-title='Player statistics are updated once a day' class='fa fa-question-circle'></i></div></span>",
                    "width": "100px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Actions</div></span>",
                    "width": "170px"
                },
            ];
        } else {
            columns = [
                {
                    "title": "<span style='float: left;'><input type='checkbox' class='livestream-bulk' id='livestream-bulkAll' style='width:16px; margin-right: 7px;' name='livestream_bulkAll' /></span>",
                    "width": "10px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Thumbnail</div></span>",
                    "width": "177px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Name</div></span>",
                    "width": "222px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>ID</div></span>",
                    "width": "90px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Encoder Settings</div></span>",
                    "width": "120px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Created On</div></span>",
                    "width": "150px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Statistics <i data-placement='top' data-toggle='tooltip' data-delay=\'{\"show\":700, \"hide\":30}\' data-original-title='Player statistics are updated once a day' class='fa fa-question-circle'></i></div></span>",
                    "width": "100px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Actions</div></span>",
                    "width": "170px"
                },
            ];
        }
        $('#livestream-table').empty();
        $('#livestream-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="livestream-data"></table>');
        livestreamTable = $('#livestream-data').DataTable({
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
                "url": "/api/v1/getLiveStreams",
                "type": "GET",
                "data": function (d) {
                    return $.extend({}, d, {
                        "_token": $('meta[name="csrf-token"]').attr('content'),
                        "pid": sessInfo.pid,
                        "ks": sessInfo.ks,
                        "tz": tz,
                        "category": categories_id,
                        "ac": ac_id,
                        "m": ($.inArray("CONTENT_MANAGE_METADATA", sessPerm) != -1) ? true : false,
                        "d": ($.inArray("CONTENT_MANAGE_DELETE", sessPerm) != -1) ? true : false,
                        "config_perm": ($.inArray("LIVE_STREAM_UPDATE", sessPerm) != -1) ? true : false,
                        "ac_perm": ($.inArray("CONTENT_MANAGE_ACCESS_CONTROL", sessPerm) != -1) ? true : false,
                        "thumb_perm": ($.inArray("CONTENT_MANAGE_THUMBNAIL", sessPerm) != -1) ? true : false,
                        "stats_perm": ($.inArray("ANALYTICS_BASE", sessPerm) != -1) ? true : false,
                        "sn": services.sn
                    });
                },
                "dataSrc": function (json) {
                    total_entries = json['recordsTotal'];
                    return json.data
                }
            },
            "language": {
                "zeroRecords": "No Live Streams Found"
            },
            "columns": columns,
            "preDrawCallback": function () {
                smhMain.showProcessing();
            },
            "drawCallback": function (oSettings) {
                smhMain.hideProcessing();
                if (services.sn == 1) {
                    smhMain.fcmcAddRows(this, 9, 10);
                } else {
                    smhMain.fcmcAddRows(this, 8, 10);
                }
            }
        });

        $('#users-buttons .dd-delete-btn').removeClass('btn-default');
        $('#users-buttons .dd-delete-btn').addClass('btn-disabled');
        $('#users-buttons .dd-delete-btn').attr('disabled', '');
        $('#livestream-table').on('change', ".livestream-bulk", function () {
            var anyBoxesChecked = false;
            $('#livestream-table input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                }
            });

            if (anyBoxesChecked == true) {
                $('#users-buttons .dd-delete-btn').removeClass('btn-disabled');
                $('#users-buttons .dd-delete-btn').addClass('btn-default');
                $('#users-buttons .dd-delete-btn').removeAttr('disabled');
            } else {
                $('#users-buttons .dd-delete-btn').removeClass('btn-default');
                $('#users-buttons .dd-delete-btn').addClass('btn-disabled');
                $('#users-buttons .dd-delete-btn').attr('disabled', '');
            }
        });
        $('#livestream-bulkAll').click(function () {
            if (this.checked) {
                $('.livestream-bulk').each(function () {
                    this.checked = true;
                });
            } else {
                $('.livestream-bulk').each(function () {
                    this.checked = false;
                });
            }
        });
    },
    //Get player uiconf ids
    getUiConfs: function () {
        var sessData = {
            ks: sessInfo.ks,
            partner_id: sessInfo.pid,
            type: "player"
        };

        var reqUrl = "/index.php/kmc/getuiconfs";
        $.ajax({
            cache: false,
            url: reqUrl,
            async: false,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            success: function (data) {
                $.each(data, function (key, value) {
                    if (value['id'] !== 6710348 && value['id'] !== 6717463) {
                        var insert_obj = {id: value['id'], name: value['name'], width: value['width'], height: value['height']}
                        uiconf_ids.push(insert_obj);
                    }
                });
            }
        });
    },
    //Preview and Embed
    previewEmbed: function (entryId, name, platforms) {
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
        if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
            header_text = 'Preview & Embed';
        }

        name = name.replace(/"/g, '&quot;');

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">' + header_text + ': ' + name.replace(/%20/g, " ") + '</h4>';
        $('#smh-modal3 .modal-header').html(header);

        var player_options = '';
        $.each(uiconf_ids, function (key, value) {
            if (value['id'] !== 6710348) {
                player_options += "<option value='" + value['id'] + "'>" + value['name'] + "</option>";
            }
        });
        var uiconf_id = uiconf_ids[0]['id'];
        var width = uiconf_ids[0]['width'];
        var height = uiconf_ids[0]['height'];
        var sizing = 'fixed';
        var ratio = '16:9';

        var embed_perm = '';
        var embed_type = '';
        var secure_seo = '';
        var platform_options = '';
        var smh = false;
        var youtube = false;
        var facebook = false;
        var twitch = false;
        if (services.sn == '1') {
            if ((platforms !== '') && (yt_ready || fb_ready || twch_ready)) {
                var select_options = '';
                var options = platforms.split(';');
                var youtube_id = '';
                var twitch_id = '';
                $.each(options, function (key, value) {
                    var platform = value.split(':');
                    if ((platform[0] == 'smh') && (platform[1] == 1)) {
                        smh = true;
                        select_options += "<option value='smh'>Streaming Media Hosting</option>";
                    }
                    if ((platform[0] == 'youtube') && (platform[1] == 1)) {
                        youtube = true;
                        youtube_id += platform[2];
                        select_options += "<option value='youtube'>YouTube Live</option>";
                    }
                    if ((platform[0] == 'facebook') && (platform[1] == 1)) {
                        facebook = true;
                        select_options += "<option value='facebook'>Facebook Live</option>";
                    }
                    if ((platform[0] == 'twitch') && (platform[1] == 1)) {
                        twitch = true;
                        twitch_id += platform[2];
                        select_options += "<option value='twitch'>Twitch</option>";
                    }
                });
                if ((smh && youtube) || (smh && facebook) || (smh && twitch) || (youtube && twitch)) {
                    platform_options += '<div style="font-size: 14px; font-weight: bold; margin-left: auto; margin-right: auto; margin-top: 10px;"><span style="margin-right: 17px; color: #444; font-size: 12px;">Select Platform:</span><span><select id="platforms" class="form-control" style="width: 213px;">' + select_options + '</select></span></div>' +
                            '<div style="margin-top: 5px;"><span style="font-size: 12px; color: #999;">Select the platform from which you would like to grab your player embed codes</span></div>' +
                            '<hr>';
                }
            } else {
                smh = true;
            }
        } else {
            smh = true;
        }

        if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
            embed_perm = '<div style="margin-top: 10px; font-weight: bold;"><div style="color: #444; font-size: 12px; padding-top: 15px; float: left;">Embed Code:</div><div style="float: right; margin-right: 13px;"><button id="select-bttn" class="btn btn-default" style="margin: 10px 0 10px 0;">Select Code</button></div></div>' +
                    '<textarea class="form-control" id="embed_code" rows="5" cols="30"></textarea>' +
                    '<hr>';
            embed_type = '<div id="embed-types-options">' +
                    '<div style="margin-top: 10px; font-weight: bold;"><span style="color: #444; font-size: 12px; margin-right: 37px;">Embed Type:</span><span><select class="form-control embedType" style="width: 213px;"><option value="dynamic">Dynamic Embed</option><option value="thumb">Thumbnail Embed</option><option value="iframe">Iframe Embed</option></select></span></div>' +
                    '<div style="margin-top: 5px;"><span id="embedType-text" style="font-size: 12px; color: #999;">Dynamic embed is the preferred method to dynamically embed the player into web sites and web applications.</span></div>' +
                    '<hr>' +
                    '</div>';
            secure_seo = '<div id="seo-options">' +
                    '<div style="margin-top: 10px; font-weight: bold;"><span><input type="checkbox" id="secure" name="secure"></span>&nbsp;<span style="color: #444; font-size: 12px; font-weight: bold; margin-left: 5px; position: relative; top: -2px;">Support for HTTPS embed code</span></div>' +
                    '<div style="margin-top: 10px; font-weight: bold;"><span><input type="checkbox" id="seo" name="seo"></span>&nbsp;<span style="color: #444; font-size: 12px; font-weight: bold; margin-left: 5px; position: relative; top: -2px;">Include Search Engine Optimization data</span></div>' +
                    '<hr>' +
                    '</div>';
        }

        content = '<div class="content">' +
                '<div class="options">' +
                platform_options +
                '<div id="select-player-options">' +
                '<div style="font-size: 14px; font-weight: bold; margin-left: auto; margin-right: auto; margin-top: 10px;"><span style="margin-right: 30px; color: #444; font-size: 12px;">Select Player:</span><span><select id="players" class="form-control" style="width: 213px;">' + player_options + '</select></span></div>' +
                '<div style="margin-top: 5px;"><span style="font-size: 12px; color: #999;">Player includes both layout and functionality (advertising, substitles, etc)</span></div>' +
                '<hr>' +
                '</div>' +
                '<div id="yt-embed-warning">' +
                '<span class="fa fa-warning" style="font-size: 15px; margin-right: 5px;"></span>Your YouTube account may not be eligible to embed live streams on other websites. <br><br>For more information, visit <a href="https://www.youtube.com/features">https://www.youtube.com/features</a> and follow the instructions under the "<b>Embed live streams</b>" section to enable it.' +
                '</div>' +
                '<div id="embed-options">' +
                embed_type +
                '<div style="margin-top: 10px; margin-bottom: 10px; font-weight: bold;">' +
                '<span style="color: #444; font-size: 12px;margin-right: 30px;">Player Dimensions</span>' +
                '</div>' +
                '<div id="player-sizing">' +
                '<span style="color: #444; font-size: 12px; font-weight: bold;">Sizing:</span>' +
                '<div style="margin-top:5px; margin-bottom:15px;display: inline-block; margin-left: 8px;">' +
                '<div class="radio" style="display: inline-block;">' +
                '<label class="pluginLabel">' +
                '<input type="radio" style="margin-right: 5px" id="player_fixed" name="player_sizing" checked>Fixed' +
                '</label>' +
                '</div>' +
                '<div class="radio" style="display: inline-block; margin-left: 15px;">' +
                '<label class="pluginLabel">' +
                '<input type="radio" style="margin-right: 5px" id="player_responsive" name="player_sizing">Responsive' +
                '</label>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<span style="color: #444; font-size: 12px; font-weight: bold;">Aspect Ratio:</span>' +
                '<select id="aspect_ratio" style="margin-bottom: 15px; display: inline-block; margin-left: 8px; width: 135px; font-weight: bold;" class="form-control"><option value="16:9">16:9</option><option value="4:3">4:3</option><option value="custom" selected>custom</option></select>' +
                '<div class="clear"></div>' +
                '<span style="color: #444; font-size: 12px; font-weight: bold;">Width</span><input type="text" value="' + width + '" id="dim_width" name="dim_width" style="width: 70px; margin-left: 10px; display: inline;" class="form-control"><span> px</span>' +
                '<div class="right-ar">' +
                '<span style="color: #444; font-size: 12px; font-weight: bold;">Height</span><input type="text" value="' + height + '" id="dim_height" name="dim_height" style="width: 70px; margin-left: 5px; display: inline;" class="form-control"><span> px</span>' +
                '</div>' +
                '<button class="btn btn-default" style="margin-top: 20px" id="update-dim"><i class="fa fa-refresh">&nbsp;</i>Update Dimensions</button>' +
                '<div class="clear"></div>' +
                '<hr>' +
                secure_seo +
                '<div id="preview-options">' +
                '<div style="margin-top: 10px; font-weight: bold;"><span style="color: #444; font-size: 12px; margin-right: 52px;">Preview:</span></div>' +
                '<div style="margin-top: 5px;"><span style="font-size: 12px; color: #999;">Scan the QR code to preview in your mobile device</span></div>' +
                '<div id="qrcode" style="margin-top: 5px; font-size: 12px; width: 80px; height: 80px;"></div>' +
                '<hr>' +
                '<div style="margin-top: 5px;"><span style="font-size: 12px; color: #999;">View a standalone page with this player</span></div>' +
                '<div id="shortlink" style="margin-top: 5px; font-size: 12px; word-wrap: break-word;"></div>' +
                '</div>' +
                '<div id="youtube-options">' +
                '<div style="margin-top: 10px; font-weight: bold;"><span><input type="checkbox" id="yt-autoplay" name="yt-autoplay"></span>&nbsp;<span style="color: #444; font-size: 12px; font-weight: bold; margin-left: 5px; position: relative; top: -2px;">Auto Play</span></div>' +
                '<hr>' +
                '</div>' +
                '<div id="twitch-options">' +
                '<div style="margin-top: 10px; font-weight: bold;"><span><input type="checkbox" id="twch-autoplay" name="twch-autoplay"></span>&nbsp;<span style="color: #444; font-size: 12px; font-weight: bold; margin-left: 5px; position: relative; top: -2px;">Auto Play</span></div>' +
                '<hr>' +
                '</div>' +
                embed_perm +
                '</div>' +
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
        var delivery = 'hls';
        if (smh) {
            smhLS.getShortLink(uiconf_id, entryId, embed, delivery);
            if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
                gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                embedCode = gen.getCode();
                $('#embed_code').text(embedCode);
            }

            player_prev_gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
            player_prev = player_prev_gen.getCode();
            smhLS.generateIframe(player_prev);
        }

        if ((!smh && !twitch && youtube) || (!smh && twitch && youtube)) {
            $('#select-player-options').css('display', 'none');
            $('#embed-types-options').css('display', 'none');
            $('#seo-options').css('display', 'none');
            $('#preview-options').css('display', 'none');
            $('#player-sizing').css('display', 'none');
            $('#twitch-options').css('display', 'none');
            $('#youtube-options').css('display', 'block');
            $('#smh-modal3 #aspect_ratio').html('<option value="16:9">16:9</option><option value="4:3">4:3</option><option value="custom" selected>custom</option>');
            $('#dim_height').removeAttr('disabled');
            if (!yt_embed) {
                $('#embed-options').css('display', 'none');
                $('#yt-embed-warning').css('display', 'block');
            }
            if ($("#yt-autoplay").is(':checked')) {
                embedCode = '<script src="https://mediaplatform.streamingmediahosting.com/apps/sn/v1.0/youtube_embed.js" type="text/javascript"></script><div id="smhYoutubeContainer" style="width:' + width + 'px; height:' + height + 'px;"></div><script>function smh_youtube_embed() {youtube.init(' + sessInfo.pid + ',\'' + entryId + '\',' + width + ',' + height + ',true);youtube.loadPlayer();}</script>';
                $('#embed_code').text(embedCode);
                player_prev = '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + youtube_id + '?autoplay=1" frameborder="0" allowfullscreen></iframe>';
                smhLS.generateYoutubeIframe(player_prev);
            } else {
                embedCode = '<script src="https://mediaplatform.streamingmediahosting.com/apps/sn/v1.0/youtube_embed.js" type="text/javascript"></script><div id="smhYoutubeContainer" style="width:' + width + 'px; height:' + height + 'px;"></div><script>function smh_youtube_embed() {youtube.init(' + sessInfo.pid + ',\'' + entryId + '\',' + width + ',' + height + ',false);youtube.loadPlayer();}</script>';
                $('#embed_code').text(embedCode);
                player_prev = '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + youtube_id + '" frameborder="0" allowfullscreen></iframe>';
                smhLS.generateYoutubeIframe(player_prev);
            }
            $('#sn-wrapper').css('width', width + 'px');
        }

        if (!smh && facebook) {
            $('#select-player-options').css('display', 'none');
            $('#embed-types-options').css('display', 'none');
            $('#seo-options').css('display', 'none');
            $('#preview-options').css('display', 'none');
            $('#player-sizing').css('display', 'none');
            $('#twitch-options').css('display', 'none');
            $('#youtube-options').css('display', 'none');
            $('#smh-modal3 #aspect_ratio').html('<option value="16:9">16:9</option><option value="4:3">4:3</option><option value="custom" selected>custom</option>');
            $('#dim_height').removeAttr('disabled');
            embedCode = '<script src="https://mediaplatform.streamingmediahosting.com/apps/sn/v1.0/facebook_embed.js" type="text/javascript"></script><div id="smhFacebookContainer" style="width:' + width + 'px; height:' + height + 'px;"></div><script>function smh_facebook_embed() {facebook.init(' + sessInfo.pid + ',' + width + ',' + height + ');facebook.loadPlayer();}</script>';
            $('#embed_code').text(embedCode);
            smhLS.generateFacebookIframe(embedCode);
            $('#sn-wrapper').css('width', width + 'px');
        }

        if (!smh && !youtube && twitch) {
            $('#select-player-options').css('display', 'none');
            $('#embed-types-options').css('display', 'none');
            $('#seo-options').css('display', 'none');
            $('#preview-options').css('display', 'none');
            $('#player-sizing').css('display', 'none');
            $('#twitch-options').css('display', 'block');
            $('#youtube-options').css('display', 'none');
            $('#smh-modal3 #aspect_ratio').html('<option value="16:9">16:9</option><option value="4:3">4:3</option><option value="custom" selected>custom</option>');
            $('#dim_height').removeAttr('disabled');
            if ($("#twch-autoplay").is(':checked')) {
                embedCode = '<iframe width="' + width + '" height="' + height + '" src="https://player.twitch.tv/?channel=' + twitch_id + '&autoplay=true" frameborder="0" allowfullscreen></iframe>';
                $('#embed_code').text(embedCode);
                smhLS.generateTwitchIframe(embedCode);
            } else {
                embedCode = '<iframe width="' + width + '" height="' + height + '" src="https://player.twitch.tv/?channel=' + twitch_id + '&autoplay=false" frameborder="0" allowfullscreen></iframe>';
                $('#embed_code').text(embedCode);
                smhLS.generateTwitchIframe(embedCode);
            }
            $('#sn-wrapper').css('width', width + 'px');
        }

        $('#smh-modal3').on('change', 'input:radio[name=player_sizing]', function (event) {
            if ($('#smh-modal3 #player_fixed').prop('checked')) {
                $('#smh-modal3 #aspect_ratio').html('<option value="16:9">16:9</option><option value="4:3">4:3</option><option value="custom" selected>custom</option>');
                $('#dim_height').removeAttr('disabled');
                sizing = "fixed";
            } else if ($('#smh-modal3 #player_responsive').prop('checked')) {
                $('#smh-modal3 #aspect_ratio').html('<option value="16:9" selected>16:9</option><option value="4:3">4:3</option>');
                $('#dim_height').attr('disabled', '');
                sizing = "responsive";
            }
            var aspect = ratio == '16:9' ? 9 / 16 : 3 / 4;
            width = $('#dim_width').val();
            height = parseInt(width * aspect);
            $('#dim_height').val(height);
            if (smh) {
                player_prev_gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
                if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
                    gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                }
                player_prev = player_prev_gen.getCode();
                smhLS.generateIframe(player_prev);
            }
        });

        $('#smh-modal3').on('change', 'select#platforms', function (event) {
            var selected_platform = $('select#platforms option:selected').val();
            if (selected_platform == 'smh') {
                smh = true;
                youtube = false;
                facebook = false;
                twitch = false;
                $('#select-player-options').css('display', 'block');
                $('#embed-types-options').css('display', 'block');
                $('#seo-options').css('display', 'block');
                $('#preview-options').css('display', 'block');
                $('#twitch-options').css('display', 'none');
                $('#youtube-options').css('display', 'none');
                $('#embed-options').css('display', 'block');
                $('#yt-embed-warning').css('display', 'none');
                $('#player-sizing').css('display', 'block');
                player_prev_gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
                smhLS.getShortLink(uiconf_id, entryId, embed, delivery);
                if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
                    gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                }
                player_prev = player_prev_gen.getCode();
                smhLS.generateIframe(player_prev);
            } else if (selected_platform == 'youtube') {
                smh = false;
                youtube = true;
                facebook = false;
                twitch = false;
                $('#select-player-options').css('display', 'none');
                $('#embed-types-options').css('display', 'none');
                $('#seo-options').css('display', 'none');
                $('#preview-options').css('display', 'none');
                $('#twitch-options').css('display', 'none');
                $('#youtube-options').css('display', 'block');
                $('#player-sizing').css('display', 'none');
                $('#smh-modal3 #aspect_ratio').html('<option value="16:9">16:9</option><option value="4:3">4:3</option><option value="custom" selected>custom</option>');
                $('#dim_height').removeAttr('disabled');
                if (!yt_embed) {
                    $('#embed-options').css('display', 'none');
                    $('#yt-embed-warning').css('display', 'block');
                }
                if ($("#yt-autoplay").is(':checked')) {
                    embedCode = '<script src="https://mediaplatform.streamingmediahosting.com/apps/sn/v1.0/youtube_embed.js" type="text/javascript"></script><div id="smhYoutubeContainer" style="width:' + width + 'px; height:' + height + 'px;"></div><script>function smh_youtube_embed() {youtube.init(' + sessInfo.pid + ',\'' + entryId + '\',' + width + ',' + height + ',true);youtube.loadPlayer();}</script>';
                    $('#embed_code').text(embedCode);
                    player_prev = '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + youtube_id + '?autoplay=1" frameborder="0" allowfullscreen></iframe>';
                    smhLS.generateYoutubeIframe(player_prev);
                } else {
                    embedCode = '<script src="https://mediaplatform.streamingmediahosting.com/apps/sn/v1.0/youtube_embed.js" type="text/javascript"></script><div id="smhYoutubeContainer" style="width:' + width + 'px; height:' + height + 'px;"></div><script>function smh_youtube_embed() {youtube.init(' + sessInfo.pid + ',\'' + entryId + '\',' + width + ',' + height + ',false);youtube.loadPlayer();}</script>';
                    $('#embed_code').text(embedCode);
                    player_prev = '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + youtube_id + '" frameborder="0" allowfullscreen></iframe>';
                    smhLS.generateYoutubeIframe(player_prev);
                }
                $('#sn-wrapper').css('width', width + 'px');
            } else if (selected_platform == 'facebook') {
                smh = false;
                youtube = false;
                facebook = true;
                twitch = false;
                $('#select-player-options').css('display', 'none');
                $('#embed-types-options').css('display', 'none');
                $('#seo-options').css('display', 'none');
                $('#preview-options').css('display', 'none');
                $('#twitch-options').css('display', 'none');
                $('#youtube-options').css('display', 'none');
                $('#player-sizing').css('display', 'none');
                $('#smh-modal3 #aspect_ratio').html('<option value="16:9">16:9</option><option value="4:3">4:3</option><option value="custom" selected>custom</option>');
                $('#dim_height').removeAttr('disabled');
                embedCode = '<script src="https://mediaplatform.streamingmediahosting.com/apps/sn/v1.0/facebook_embed.js" type="text/javascript"></script><div id="smhFacebookContainer" style="width:' + width + 'px; height:' + height + 'px;"></div><script>function smh_facebook_embed() {facebook.init(' + sessInfo.pid + ',' + width + ',' + height + ');facebook.loadPlayer();}</script>';
                $('#embed_code').text(embedCode);
                smhLS.generateFacebookIframe(embedCode);
                $('#sn-wrapper').css('width', width + 'px');
            } else if (selected_platform == 'twitch') {
                smh = false;
                youtube = false;
                facebook = false;
                twitch = true;
                $('#select-player-options').css('display', 'none');
                $('#embed-types-options').css('display', 'none');
                $('#seo-options').css('display', 'none');
                $('#preview-options').css('display', 'none');
                $('#twitch-options').css('display', 'block');
                $('#youtube-options').css('display', 'none');
                $('#player-sizing').css('display', 'none');
                $('#smh-modal3 #aspect_ratio').html('<option value="16:9">16:9</option><option value="4:3">4:3</option><option value="custom" selected>custom</option>');
                $('#dim_height').removeAttr('disabled');
                if ($("#twch-autoplay").is(':checked')) {
                    embedCode = '<iframe width="' + width + '" height="' + height + '" src="https://player.twitch.tv/?channel=' + twitch_id + '&autoplay=true" frameborder="0" allowfullscreen></iframe>';
                    $('#embed_code').text(embedCode);
                    smhLS.generateTwitchIframe(embedCode);
                } else {
                    embedCode = '<iframe width="' + width + '" height="' + height + '" src="https://player.twitch.tv/?channel=' + twitch_id + '&autoplay=false" frameborder="0" allowfullscreen></iframe>';
                    $('#embed_code').text(embedCode);
                    smhLS.generateTwitchIframe(embedCode);
                }
                $('#sn-wrapper').css('width', width + 'px');
            }
        });

        $('#smh-modal3').on('change', '#yt-autoplay', function (event) {
            if ($("#yt-autoplay").is(':checked')) {
                embedCode = '<script src="https://mediaplatform.streamingmediahosting.com/apps/sn/v1.0/youtube_embed.js" type="text/javascript"></script><div id="smhYoutubeContainer" style="width:' + width + 'px; height:' + height + 'px;"></div><script>function smh_youtube_embed() {youtube.init(' + sessInfo.pid + ',\'' + entryId + '\',' + width + ',' + height + ',true);youtube.loadPlayer();}</script>';
                $('#embed_code').text(embedCode);
                player_prev = '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + youtube_id + '?autoplay=1" frameborder="0" allowfullscreen></iframe>';
                smhLS.generateYoutubeIframe(player_prev);
            } else {
                embedCode = '<script src="https://mediaplatform.streamingmediahosting.com/apps/sn/v1.0/youtube_embed.js" type="text/javascript"></script><div id="smhYoutubeContainer" style="width:' + width + 'px; height:' + height + 'px;"></div><script>function smh_youtube_embed() {youtube.init(' + sessInfo.pid + ',\'' + entryId + '\',' + width + ',' + height + ',false);youtube.loadPlayer();}</script>';
                $('#embed_code').text(embedCode);
                player_prev = '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + youtube_id + '" frameborder="0" allowfullscreen></iframe>';
                smhLS.generateYoutubeIframe(player_prev);
            }
        });

        $('#smh-modal3').on('change', '#twch-autoplay', function (event) {
            if ($("#twch-autoplay").is(':checked')) {
                embedCode = '<iframe width="' + width + '" height="' + height + '" src="https://player.twitch.tv/?channel=' + twitch_id + '&autoplay=true" frameborder="0" allowfullscreen></iframe>';
                $('#embed_code').text(embedCode);
                smhLS.generateTwitchIframe(embedCode);
            } else {
                embedCode = '<iframe width="' + width + '" height="' + height + '" src="https://player.twitch.tv/?channel=' + twitch_id + '&autoplay=false" frameborder="0" allowfullscreen></iframe>';
                $('#embed_code').text(embedCode);
                smhLS.generateTwitchIframe(embedCode);
            }
        });

        $('#smh-modal3').on('change', 'select#players', function (event) {
            uiconf_id = $('select#players option:selected').val();
            $.each(uiconf_ids, function (key, value) {
                if (uiconf_id == value['id']) {
                    width = value['width'];
                    height = value['height'];
                }
            });

            $('#dim_width').val(width);
            $('#dim_height').val(height);

            player_prev_gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
            smhLS.getShortLink(uiconf_id, entryId, embed, delivery);
            if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
                gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                embedCode = gen.getCode();
                $('#embed_code').text(embedCode);
            }
            player_prev = player_prev_gen.getCode();
            smhLS.generateIframe(player_prev);
        });

        $('#smh-modal3').on('click', '#update-dim', function () {
            width = $('#dim_width').val();
            height = $('#dim_height').val();
            if (smh) {
                player_prev_gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
                if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
                    gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                }
                player_prev = player_prev_gen.getCode();
                smhLS.generateIframe(player_prev);
            } else if (youtube) {
                if ($("#yt-autoplay").is(':checked')) {
                    embedCode = '<script src="https://mediaplatform.streamingmediahosting.com/apps/sn/v1.0/youtube_embed.js" type="text/javascript"></script><div id="smhYoutubeContainer" style="width:' + width + 'px; height:' + height + 'px;"></div><script>function smh_youtube_embed() {youtube.init(' + sessInfo.pid + ',\'' + entryId + '\',' + width + ',' + height + ',true);youtube.loadPlayer();}</script>';
                    $('#embed_code').text(embedCode);
                    player_prev = '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + youtube_id + '?autoplay=1" frameborder="0" allowfullscreen></iframe>';
                    smhLS.generateYoutubeIframe(player_prev);
                } else {
                    embedCode = '<script src="https://mediaplatform.streamingmediahosting.com/apps/sn/v1.0/youtube_embed.js" type="text/javascript"></script><div id="smhYoutubeContainer" style="width:' + width + 'px; height:' + height + 'px;"></div><script>function smh_youtube_embed() {youtube.init(' + sessInfo.pid + ',\'' + entryId + '\',' + width + ',' + height + ',false);youtube.loadPlayer();}</script>';
                    $('#embed_code').text(embedCode);
                    player_prev = '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + youtube_id + '" frameborder="0" allowfullscreen></iframe>';
                    smhLS.generateYoutubeIframe(player_prev);
                }
                $('#sn-wrapper').css('width', width + 'px');
            } else if (facebook) {
                embedCode = '<script src="https://mediaplatform.streamingmediahosting.com/apps/sn/v1.0/facebook_embed.js" type="text/javascript"></script><div id="smhFacebookContainer" style="width:' + width + 'px; height:' + height + 'px;"></div><script>function smh_facebook_embed() {facebook.init(' + sessInfo.pid + ',' + width + ',' + height + ');facebook.loadPlayer();}</script>';
                $('#embed_code').text(embedCode);
                smhLS.generateFacebookIframe(embedCode);
                $('#sn-wrapper').css('width', width + 'px');
            } else if (twitch) {
                if ($("#twch-autoplay").is(':checked')) {
                    embedCode = '<iframe width="' + width + '" height="' + height + '" src="https://player.twitch.tv/?channel=' + twitch_id + '&autoplay=true" frameborder="0" allowfullscreen></iframe>';
                    $('#embed_code').text(embedCode);
                    smhLS.generateTwitchIframe(embedCode);
                } else {
                    embedCode = '<iframe width="' + width + '" height="' + height + '" src="https://player.twitch.tv/?channel=' + twitch_id + '&autoplay=false" frameborder="0" allowfullscreen></iframe>';
                    $('#embed_code').text(embedCode);
                    smhLS.generateTwitchIframe(embedCode);
                }
                $('#sn-wrapper').css('width', width + 'px');
            }
        });

        $('#smh-modal3').on('keyup', '#dim_width', function () {
            ratio = $('#aspect_ratio').val();
            if (ratio !== 'custom') {
                var aspect = ratio == '16:9' ? 9 / 16 : 3 / 4;
                width = $('#dim_width').val();
                height = parseInt(width * aspect);
                $('#dim_height').val(height);
            }
        });

        $('#smh-modal3').on('change', '#aspect_ratio', function () {
            ratio = $('#aspect_ratio').val();
            if (ratio !== 'custom') {
                $('#dim_height').attr('disabled', '');
                var aspect = ratio == '16:9' ? 9 / 16 : 3 / 4;
                width = $('#dim_width').val();
                height = parseInt(width * aspect);
                $('#dim_height').val(height);
            } else {
                $('#dim_height').removeAttr('disabled');
            }
        });

        if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
            $('select.embedType').on('change', function (event) {
                embed = $('select.embedType option:selected').val();
                if (embed == 'dynamic') {
                    $('#embedType-text').html('Dynamic embed is the preferred method to dynamically embed the player into web sites and web applications.');
                } else if (embed == 'thumb') {
                    $('#embedType-text').html('This is the recommended method to use when you need to embed many players/entries in the same web page.');
                } else if (embed == 'iframe') {
                    $('#embedType-text').html('Iframe embed is good for sites that do not allow 3rd party JavaScript to be embeded on their pages.');
                }
                player_prev_gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
                smhLS.getShortLink(uiconf_id, entryId, embed, delivery);

                gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                embedCode = gen.getCode();
                $('#embed_code').text(embedCode);
                player_prev = player_prev_gen.getCode();
                smhLS.generateIframe(player_prev);
            });
            $('.previewModal .options').on('change', '#secure', function (event) {
                if ($("#secure").is(':checked')) {
                    protocol = 'https';
                    gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                } else {
                    protocol = 'http';
                    gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                }
            });
            $('.previewModal .options').on('change', '#seo', function (event) {
                if ($("#seo").is(':checked')) {
                    seo = true;
                    gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                } else {
                    seo = false;
                    gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                }
            });
        }

        $('#smh-modal3').on('click', '#select-bttn', function (event) {
            $('#smh-modal3 #embed_code').select();
        });
    },
    //Preview and Embed
    wizardPreviewEmbed: function (entryId, name, platforms) {
        smhLS.resetModal();
        var header, content, gen, embedCode, player_prev_gen, player_prev;
        var protocol = 'http';
        var seo = false;
        $('#smh-modal4 .modal-body').css('padding', '0');
        $('#smh-modal4').modal({
            backdrop: 'static'
        });
        $('#smh-modal4').addClass('previewModal');

        $('#smh-modal4').css('z-index', '2000');
        $('#smh-modal').css('z-index', '2');

        var header_text = 'Preview';
        if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
            header_text = 'Preview & Embed';
        }

        header = '<button type="button" class="close smh-close4" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">' + header_text + ': ' + name.replace(/%20/g, " ") + '</h4>';
        $('#smh-modal4 .modal-header').html(header);

        var player_options = '';
        $.each(uiconf_ids, function (key, value) {
            if (value['id'] !== 6710348) {
                player_options += "<option value='" + value['id'] + "'>" + value['name'] + "</option>";
            }
        });
        var uiconf_id = uiconf_ids[0]['id'];
        var width = uiconf_ids[0]['width'];
        var height = uiconf_ids[0]['height'];
        var sizing = 'fixed';
        var ratio = '16:9';

        var embed_perm = '';
        var embed_type = '';
        var secure_seo = '';
        var platform_options = '';
        var smh = false;
        var youtube = false;
        var facebook = false;
        var twitch = false;
        if (services.sn == '1') {
            if ((platforms !== '') && (yt_ready || fb_ready || twch_ready)) {
                var select_options = '';
                var options = platforms.split(';');
                var youtube_id = '';
                var twitch_id = '';
                $.each(options, function (key, value) {
                    var platform = value.split(':');
                    if ((platform[0] == 'smh') && (platform[1] == 1)) {
                        smh = true;
                        select_options += "<option value='smh'>Streaming Media Hosting</option>";
                    }
                    if ((platform[0] == 'youtube') && (platform[1] == 1)) {
                        youtube = true;
                        youtube_id += platform[2];
                        select_options += "<option value='youtube'>YouTube Live</option>";
                    }
                    if ((platform[0] == 'facebook') && (platform[1] == 1)) {
                        facebook = true;
                        select_options += "<option value='facebook'>Facebook Live</option>";
                    }
                    if ((platform[0] == 'twitch') && (platform[1] == 1)) {
                        twitch = true;
                        twitch_id += platform[2];
                        select_options += "<option value='twitch'>Twitch</option>";
                    }
                });
                if ((smh && youtube) || (smh && facebook) || (smh && twitch) || (youtube && twitch)) {
                    platform_options += '<div style="font-size: 14px; font-weight: bold; margin-left: auto; margin-right: auto; margin-top: 10px;"><span style="margin-right: 17px; color: #444; font-size: 12px;">Select Platform:</span><span><select id="platforms" class="form-control" style="width: 213px;">' + select_options + '</select></span></div>' +
                            '<div style="margin-top: 5px;"><span style="font-size: 12px; color: #999;">Select the platform from which you would like to grab your player embed codes</span></div>' +
                            '<hr>';
                }
            } else {
                smh = true;
            }
        } else {
            smh = true;
        }
        if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
            embed_perm = '<div style="margin-top: 10px; font-weight: bold;"><div style="color: #444; font-size: 12px; padding-top: 15px; float: left;">Embed Code:</div><div style="float: right; margin-right: 13px;"><button id="select-bttn" class="btn btn-default" style="margin: 10px 0 10px 0;">Select Code</button></div></div>' +
                    '<textarea class="form-control" id="embed_code" rows="5" cols="30"></textarea>' +
                    '<hr>';
            embed_type = '<div id="embed-types-options">' +
                    '<div style="margin-top: 10px; font-weight: bold;"><span style="color: #444; font-size: 12px; margin-right: 37px;">Embed Type:</span><span><select class="form-control embedType" style="width: 213px;"><option value="dynamic">Dynamic Embed</option><option value="thumb">Thumbnail Embed</option><option value="iframe">Iframe Embed</option></select></span></div>' +
                    '<div style="margin-top: 5px;"><span id="embedType-text" style="font-size: 12px; color: #999;">Dynamic embed is the preferred method to dynamically embed the player into web sites and web applications.</span></div>' +
                    '<hr>' +
                    '</div>';
            secure_seo = '<div id="seo-options">' +
                    '<div style="margin-top: 10px; font-weight: bold;"><span><input type="checkbox" id="secure" name="secure"></span>&nbsp;<span style="color: #444; font-size: 12px; font-weight: bold; margin-left: 5px; position: relative; top: -2px;">Support for HTTPS embed code</span></div>' +
                    '<div style="margin-top: 10px; font-weight: bold;"><span><input type="checkbox" id="seo" name="seo"></span>&nbsp;<span style="color: #444; font-size: 12px; font-weight: bold; margin-left: 5px; position: relative; top: -2px;">Include Search Engine Optimization data</span></div>' +
                    '<hr>' +
                    '</div>';
        }

        content = '<div class="content">' +
                '<div class="options">' +
                platform_options +
                '<div id="select-player-options">' +
                '<div style="font-size: 14px; font-weight: bold; margin-left: auto; margin-right: auto; margin-top: 10px;"><span style="margin-right: 30px; color: #444; font-size: 12px;">Select Player:</span><span><select id="players" class="form-control" style="width: 213px;">' + player_options + '</select></span></div>' +
                '<div style="margin-top: 5px;"><span style="font-size: 12px; color: #999;">Player includes both layout and functionality (advertising, substitles, etc)</span></div>' +
                '<hr>' +
                '</div>' +
                '<div id="yt-embed-warning">' +
                '<span class="fa fa-warning" style="font-size: 15px; margin-right: 5px;"></span>Your YouTube account may not be eligible to embed live streams on other websites. <br><br>For more information, visit <a href="https://www.youtube.com/features">https://www.youtube.com/features</a> and follow the instructions under the "<b>Embed live streams</b>" section to enable it.' +
                '</div>' +
                '<div id="embed-options">' +
                embed_type +
                '<div style="margin-top: 10px; margin-bottom: 10px; font-weight: bold;">' +
                '<span style="color: #444; font-size: 12px;margin-right: 30px;">Player Dimensions</span>' +
                '</div>' +
                '<div id="player-sizing">' +
                '<span style="color: #444; font-size: 12px; font-weight: bold;">Sizing:</span>' +
                '<div style="margin-top:5px; margin-bottom:15px;display: inline-block; margin-left: 8px;">' +
                '<div class="radio" style="display: inline-block;">' +
                '<label class="pluginLabel">' +
                '<input type="radio" style="margin-right: 5px" id="player_fixed" name="player_sizing" checked>Fixed' +
                '</label>' +
                '</div>' +
                '<div class="radio" style="display: inline-block; margin-left: 15px;">' +
                '<label class="pluginLabel">' +
                '<input type="radio" style="margin-right: 5px" id="player_responsive" name="player_sizing">Responsive' +
                '</label>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<span style="color: #444; font-size: 12px; font-weight: bold;">Aspect Ratio:</span>' +
                '<select id="aspect_ratio" style="margin-bottom: 15px; display: inline-block; margin-left: 8px; width: 135px; font-weight: bold;" class="form-control"><option value="4:3">4:3</option><option value="16:9">16:9</option><option value="custom" selected>custom</option></select>' +
                '<div class="clear"></div>' +
                '<span style="color: #444; font-size: 12px; font-weight: bold;">Width</span><input type="text" value="' + width + '" id="dim_width" name="dim_width" style="width: 70px; margin-left: 10px; display: inline;" class="form-control"><span> px</span>' +
                '<div class="right-ar">' +
                '<span style="color: #444; font-size: 12px; font-weight: bold;">Height</span><input type="text" value="' + height + '" id="dim_height" name="dim_height" style="width: 70px; margin-left: 5px; display: inline;" class="form-control"><span> px</span>' +
                '</div>' +
                '<button class="btn btn-default" style="margin-top: 20px" id="update-dim"><i class="fa fa-refresh">&nbsp;</i>Update Dimensions</button>' +
                '<div class="clear"></div>' +
                '<hr>' +
                secure_seo +
                '<div id="preview-options">' +
                '<div style="margin-top: 10px; font-weight: bold;"><span style="color: #444; font-size: 12px; margin-right: 52px;">Preview:</span></div>' +
                '<div style="margin-top: 5px;"><span style="font-size: 12px; color: #999;">Scan the QR code to preview in your mobile device</span></div>' +
                '<div id="qrcode" style="margin-top: 5px; font-size: 12px; width: 80px; height: 80px;"></div>' +
                '<hr>' +
                '<div style="margin-top: 5px;"><span style="font-size: 12px; color: #999;">View a standalone page with this player</span></div>' +
                '<div id="shortlink" style="margin-top: 5px; font-size: 12px; word-wrap: break-word;"></div>' +
                '</div>' +
                '<div id="youtube-options">' +
                '<div style="margin-top: 10px; font-weight: bold;"><span><input type="checkbox" id="yt-autoplay" name="yt-autoplay"></span>&nbsp;<span style="color: #444; font-size: 12px; font-weight: bold; margin-left: 5px; position: relative; top: -2px;">Auto Play</span></div>' +
                '<hr>' +
                '</div>' +
                '<div id="twitch-options">' +
                '<div style="margin-top: 10px; font-weight: bold;"><span><input type="checkbox" id="twch-autoplay" name="twch-autoplay"></span>&nbsp;<span style="color: #444; font-size: 12px; font-weight: bold; margin-left: 5px; position: relative; top: -2px;">Auto Play</span></div>' +
                '<hr>' +
                '</div>' +
                embed_perm +
                '</div>' +
                '</div>' +
                '<div class="player_preview">Preview Player<hr>' +
                '<div id="previewIframe" style="margin-top: 5px;"></div>' +
                '</div>' +
                '</div>';
        $('#smh-modal4 .modal-body').html(content);

        $('.options').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        var embed = $('select.embedType option:selected').val();
        var delivery = 'hls';
        if (smh) {
            smhLS.getShortLink(uiconf_id, entryId, embed, delivery);
            if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
                gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                embedCode = gen.getCode();
                $('#embed_code').text(embedCode);
            }

            player_prev_gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
            player_prev = player_prev_gen.getCode();
            smhLS.generateIframe(player_prev);
        }

        if ((!smh && !twitch && youtube) || (!smh && twitch && youtube)) {
            $('#select-player-options').css('display', 'none');
            $('#embed-types-options').css('display', 'none');
            $('#seo-options').css('display', 'none');
            $('#preview-options').css('display', 'none');
            $('#player-sizing').css('display', 'none');
            $('#twitch-options').css('display', 'none');
            $('#youtube-options').css('display', 'block');
            $('#smh-modal4 #aspect_ratio').html('<option value="16:9">16:9</option><option value="4:3">4:3</option><option value="custom" selected>custom</option>');
            $('#dim_height').removeAttr('disabled');
            if (!yt_embed) {
                $('#embed-options').css('display', 'none');
                $('#youtube-options').css('display', 'block');
                $('#yt-embed-warning').css('display', 'block');
            }
            if ($("#yt-autoplay").is(':checked')) {
                embedCode = '<script src="https://mediaplatform.streamingmediahosting.com/apps/sn/v1.0/youtube_embed.js" type="text/javascript"></script><div id="smhYoutubeContainer" style="width:' + width + 'px; height:' + height + 'px;"></div><script>function smh_youtube_embed() {youtube.init(' + sessInfo.pid + ',\'' + entryId + '\',' + width + ',' + height + ',true);youtube.loadPlayer();}</script>';
                $('#embed_code').text(embedCode);
                player_prev = '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + youtube_id + '?autoplay=1" frameborder="0" allowfullscreen></iframe>';
                smhLS.generateYoutubeIframe(player_prev);
            } else {
                embedCode = '<script src="https://mediaplatform.streamingmediahosting.com/apps/sn/v1.0/youtube_embed.js" type="text/javascript"></script><div id="smhYoutubeContainer" style="width:' + width + 'px; height:' + height + 'px;"></div><script>function smh_youtube_embed() {youtube.init(' + sessInfo.pid + ',\'' + entryId + '\',' + width + ',' + height + ',false);youtube.loadPlayer();}</script>';
                $('#embed_code').text(embedCode);
                player_prev = '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + youtube_id + '" frameborder="0" allowfullscreen></iframe>';
                smhLS.generateYoutubeIframe(player_prev);
            }
            $('#sn-wrapper').css('width', width + 'px');
        }

        if (!smh && facebook) {
            $('#select-player-options').css('display', 'none');
            $('#embed-types-options').css('display', 'none');
            $('#seo-options').css('display', 'none');
            $('#preview-options').css('display', 'none');
            $('#player-sizing').css('display', 'none');
            $('#twitch-options').css('display', 'none');
            $('#youtube-options').css('display', 'none');
            $('#smh-modal4 #aspect_ratio').html('<option value="16:9">16:9</option><option value="4:3">4:3</option><option value="custom" selected>custom</option>');
            $('#dim_height').removeAttr('disabled');
            embedCode = '<script src="https://mediaplatform.streamingmediahosting.com/apps/sn/v1.0/facebook_embed.js" type="text/javascript"></script><div id="smhFacebookContainer" style="width:' + width + 'px; height:' + height + 'px;"></div><script>function smh_facebook_embed() {facebook.init(' + sessInfo.pid + ',' + width + ',' + height + ');facebook.loadPlayer();}</script>';
            $('#embed_code').text(embedCode);
            smhLS.generateFacebookIframe(embedCode);
            $('#sn-wrapper').css('width', width + 'px');
        }

        if (!smh && !youtube && twitch) {
            $('#select-player-options').css('display', 'none');
            $('#embed-types-options').css('display', 'none');
            $('#seo-options').css('display', 'none');
            $('#preview-options').css('display', 'none');
            $('#player-sizing').css('display', 'none');
            $('#twitch-options').css('display', 'block');
            $('#youtube-options').css('display', 'none');
            $('#smh-modal4 #aspect_ratio').html('<option value="16:9">16:9</option><option value="4:3">4:3</option><option value="custom" selected>custom</option>');
            $('#dim_height').removeAttr('disabled');
            if ($("#twch-autoplay").is(':checked')) {
                embedCode = '<iframe width="' + width + '" height="' + height + '" src="https://player.twitch.tv/?channel=' + twitch_id + '&autoplay=true" frameborder="0" allowfullscreen></iframe>';
                $('#embed_code').text(embedCode);
                smhLS.generateTwitchIframe(embedCode);
            } else {
                embedCode = '<iframe width="' + width + '" height="' + height + '" src="https://player.twitch.tv/?channel=' + twitch_id + '&autoplay=false" frameborder="0" allowfullscreen></iframe>';
                $('#embed_code').text(embedCode);
                smhLS.generateTwitchIframe(embedCode);
            }
            $('#sn-wrapper').css('width', width + 'px');
        }

        $('#smh-modal4').on('change', 'input:radio[name=player_sizing]', function (event) {
            if ($('#smh-modal4 #player_fixed').prop('checked')) {
                $('#smh-modal4 #aspect_ratio').html('<option value="16:9">16:9</option><option value="4:3">4:3</option><option value="custom" selected>custom</option>');
                $('#dim_height').removeAttr('disabled');
                sizing = "fixed";
            } else if ($('#smh-modal4 #player_responsive').prop('checked')) {
                $('#smh-modal4 #aspect_ratio').html('<option value="16:9" selected>16:9</option><option value="4:3">4:3</option>');
                $('#dim_height').attr('disabled', '');
                sizing = "responsive";
            }
            var aspect = ratio == '16:9' ? 9 / 16 : 3 / 4;
            width = $('#dim_width').val();
            height = parseInt(width * aspect);
            $('#dim_height').val(height);
            if (smh) {
                player_prev_gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
                if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
                    gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                }
                player_prev = player_prev_gen.getCode();
                smhLS.generateIframe(player_prev);
            }
        });

        $('#smh-modal4').on('change', 'select#platforms', function (event) {
            var selected_platform = $('select#platforms option:selected').val();
            if (selected_platform == 'smh') {
                smh = true;
                youtube = false;
                facebook = false;
                twitch = false;
                $('#select-player-options').css('display', 'block');
                $('#embed-types-options').css('display', 'block');
                $('#seo-options').css('display', 'block');
                $('#preview-options').css('display', 'block');
                $('#youtube-options').css('display', 'none');
                $('#twitch-options').css('display', 'none');
                $('#embed-options').css('display', 'block');
                $('#yt-embed-warning').css('display', 'none');
                $('#player-sizing').css('display', 'block');
                player_prev_gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
                smhLS.getShortLink(uiconf_id, entryId, embed, delivery);
                if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
                    gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                }
                player_prev = player_prev_gen.getCode();
                smhLS.generateIframe(player_prev);
            } else if (selected_platform == 'youtube') {
                smh = false;
                youtube = true;
                facebook = false;
                twitch = false;
                $('#select-player-options').css('display', 'none');
                $('#embed-types-options').css('display', 'none');
                $('#seo-options').css('display', 'none');
                $('#preview-options').css('display', 'none');
                $('#youtube-options').css('display', 'block');
                $('#twitch-options').css('display', 'none');
                $('#player-sizing').css('display', 'none');
                $('#smh-modal4 #aspect_ratio').html('<option value="16:9">16:9</option><option value="4:3">4:3</option><option value="custom" selected>custom</option>');
                $('#dim_height').removeAttr('disabled');
                if (!yt_embed) {
                    $('#embed-options').css('display', 'none');
                    $('#youtube-options').css('display', 'block');
                    $('#yt-embed-warning').css('display', 'block');
                }
                if ($("#yt-autoplay").is(':checked')) {
                    embedCode = '<script src="https://mediaplatform.streamingmediahosting.com/apps/sn/v1.0/youtube_embed.js" type="text/javascript"></script><div id="smhYoutubeContainer" style="width:' + width + 'px; height:' + height + 'px;"></div><script>function smh_youtube_embed() {youtube.init(' + sessInfo.pid + ',\'' + entryId + '\',' + width + ',' + height + ',true);youtube.loadPlayer();}</script>';
                    $('#embed_code').text(embedCode);
                    player_prev = '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + youtube_id + '?autoplay=1" frameborder="0" allowfullscreen></iframe>';
                    smhLS.generateYoutubeIframe(player_prev);
                } else {
                    embedCode = '<script src="https://mediaplatform.streamingmediahosting.com/apps/sn/v1.0/youtube_embed.js" type="text/javascript"></script><div id="smhYoutubeContainer" style="width:' + width + 'px; height:' + height + 'px;"></div><script>function smh_youtube_embed() {youtube.init(' + sessInfo.pid + ',\'' + entryId + '\',' + width + ',' + height + ',false);youtube.loadPlayer();}</script>';
                    $('#embed_code').text(embedCode);
                    player_prev = '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + youtube_id + '" frameborder="0" allowfullscreen></iframe>';
                    smhLS.generateYoutubeIframe(player_prev);
                }
                $('#sn-wrapper').css('width', width + 'px');
            } else if (selected_platform == 'facebook') {
                smh = false;
                youtube = false;
                facebook = true;
                twitch = false;
                $('#select-player-options').css('display', 'none');
                $('#embed-types-options').css('display', 'none');
                $('#seo-options').css('display', 'none');
                $('#preview-options').css('display', 'none');
                $('#youtube-options').css('display', 'none');
                $('#twitch-options').css('display', 'none');
                $('#player-sizing').css('display', 'none');
                $('#smh-modal4 #aspect_ratio').html('<option value="16:9">16:9</option><option value="4:3">4:3</option><option value="custom" selected>custom</option>');
                $('#dim_height').removeAttr('disabled');
                embedCode = '<script src="https://mediaplatform.streamingmediahosting.com/apps/sn/v1.0/facebook_embed.js" type="text/javascript"></script><div id="smhFacebookContainer" style="width:' + width + 'px; height:' + height + 'px;"></div><script>function smh_facebook_embed() {facebook.init(' + sessInfo.pid + ',' + width + ',' + height + ');facebook.loadPlayer();}</script>';
                $('#embed_code').text(embedCode);
                smhLS.generateFacebookIframe(embedCode);
                $('#sn-wrapper').css('width', width + 'px');
            } else if (selected_platform == 'twitch') {
                smh = false;
                youtube = false;
                facebook = false;
                twitch = true;
                $('#select-player-options').css('display', 'none');
                $('#embed-types-options').css('display', 'none');
                $('#seo-options').css('display', 'none');
                $('#preview-options').css('display', 'none');
                $('#twitch-options').css('display', 'block');
                $('#youtube-options').css('display', 'none');
                $('#player-sizing').css('display', 'none');
                $('#smh-modal4 #aspect_ratio').html('<option value="16:9">16:9</option><option value="4:3">4:3</option><option value="custom" selected>custom</option>');
                $('#dim_height').removeAttr('disabled');
                if ($("#twch-autoplay").is(':checked')) {
                    embedCode = '<iframe width="' + width + '" height="' + height + '" src="https://player.twitch.tv/?channel=' + twitch_id + '&autoplay=true" frameborder="0" allowfullscreen></iframe>';
                    $('#embed_code').text(embedCode);
                    smhLS.generateTwitchIframe(embedCode);
                } else {
                    embedCode = '<iframe width="' + width + '" height="' + height + '" src="https://player.twitch.tv/?channel=' + twitch_id + '&autoplay=false" frameborder="0" allowfullscreen></iframe>';
                    $('#embed_code').text(embedCode);
                    smhLS.generateTwitchIframe(embedCode);
                }
                $('#sn-wrapper').css('width', width + 'px');
            }
        });

        $('#smh-modal4').on('change', '#yt-autoplay', function (event) {
            if ($("#yt-autoplay").is(':checked')) {
                embedCode = '<script src="https://mediaplatform.streamingmediahosting.com/apps/sn/v1.0/youtube_embed.js" type="text/javascript"></script><div id="smhYoutubeContainer" style="width:' + width + 'px; height:' + height + 'px;"></div><script>function smh_youtube_embed() {youtube.init(' + sessInfo.pid + ',\'' + entryId + '\',' + width + ',' + height + ',true);youtube.loadPlayer();}</script>';
                $('#embed_code').text(embedCode);
                player_prev = '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + youtube_id + '?autoplay=1" frameborder="0" allowfullscreen></iframe>';
                smhLS.generateYoutubeIframe(player_prev);
            } else {
                embedCode = '<script src="https://mediaplatform.streamingmediahosting.com/apps/sn/v1.0/youtube_embed.js" type="text/javascript"></script><div id="smhYoutubeContainer" style="width:' + width + 'px; height:' + height + 'px;"></div><script>function smh_youtube_embed() {youtube.init(' + sessInfo.pid + ',\'' + entryId + '\',' + width + ',' + height + ',false);youtube.loadPlayer();}</script>';
                $('#embed_code').text(embedCode);
                player_prev = '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + youtube_id + '" frameborder="0" allowfullscreen></iframe>';
                smhLS.generateYoutubeIframe(player_prev);
            }
        });

        $('#smh-modal4').on('change', '#twch-autoplay', function (event) {
            if ($("#twch-autoplay").is(':checked')) {
                embedCode = '<iframe width="' + width + '" height="' + height + '" src="https://player.twitch.tv/?channel=' + twitch_id + '&autoplay=true" frameborder="0" allowfullscreen></iframe>';
                $('#embed_code').text(embedCode);
                smhLS.generateTwitchIframe(embedCode);
            } else {
                embedCode = '<iframe width="' + width + '" height="' + height + '" src="https://player.twitch.tv/?channel=' + twitch_id + '&autoplay=false" frameborder="0" allowfullscreen></iframe>';
                $('#embed_code').text(embedCode);
                smhLS.generateTwitchIframe(embedCode);
            }
        });

        $('#smh-modal4').on('change', 'select#players', function (event) {
            uiconf_id = $('select#players option:selected').val();
            $.each(uiconf_ids, function (key, value) {
                if (uiconf_id == value['id']) {
                    width = value['width'];
                    height = value['height'];
                }
            });

            $('#dim_width').val(width);
            $('#dim_height').val(height);

            player_prev_gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);

            smhLS.getShortLink(uiconf_id, entryId, embed, delivery);
            if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
                gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                embedCode = gen.getCode();
                $('#embed_code').text(embedCode);
            }
            player_prev = player_prev_gen.getCode();
            smhLS.generateIframe(player_prev);
        });

        $('#smh-modal4').on('click', '#update-dim', function () {
            width = $('#dim_width').val();
            height = $('#dim_height').val();
            if (smh) {
                player_prev_gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
                if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
                    gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                }
                player_prev = player_prev_gen.getCode();
                smhLS.generateIframe(player_prev);
            } else if (youtube) {
                if ($("#yt-autoplay").is(':checked')) {
                    embedCode = '<script src="https://mediaplatform.streamingmediahosting.com/apps/sn/v1.0/youtube_embed.js" type="text/javascript"></script><div id="smhYoutubeContainer" style="width:' + width + 'px; height:' + height + 'px;"></div><script>function smh_youtube_embed() {youtube.init(' + sessInfo.pid + ',\'' + entryId + '\',' + width + ',' + height + ',true);youtube.loadPlayer();}</script>';
                    $('#embed_code').text(embedCode);
                    player_prev = '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + youtube_id + '?autoplay=1" frameborder="0" allowfullscreen></iframe>';
                    smhLS.generateYoutubeIframe(player_prev);
                } else {
                    embedCode = '<script src="https://mediaplatform.streamingmediahosting.com/apps/sn/v1.0/youtube_embed.js" type="text/javascript"></script><div id="smhYoutubeContainer" style="width:' + width + 'px; height:' + height + 'px;"></div><script>function smh_youtube_embed() {youtube.init(' + sessInfo.pid + ',\'' + entryId + '\',' + width + ',' + height + ',false);youtube.loadPlayer();}</script>';
                    $('#embed_code').text(embedCode);
                    player_prev = '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + youtube_id + '" frameborder="0" allowfullscreen></iframe>';
                    smhLS.generateYoutubeIframe(player_prev);
                }
                $('#sn-wrapper').css('width', width + 'px');
            } else if (facebook) {
                embedCode = '<script src="https://mediaplatform.streamingmediahosting.com/apps/sn/v1.0/facebook_embed.js" type="text/javascript"></script><div id="smhFacebookContainer" style="width:' + width + 'px; height:' + height + 'px;"></div><script>function smh_facebook_embed() {facebook.init(' + sessInfo.pid + ',' + width + ',' + height + ');facebook.loadPlayer();}</script>';
                $('#embed_code').text(embedCode);
                smhLS.generateFacebookIframe(embedCode);
                $('#sn-wrapper').css('width', width + 'px');
            } else if (twitch) {
                if ($("#twch-autoplay").is(':checked')) {
                    embedCode = '<iframe width="' + width + '" height="' + height + '" src="https://player.twitch.tv/?channel=' + twitch_id + '&autoplay=true" frameborder="0" allowfullscreen></iframe>';
                    $('#embed_code').text(embedCode);
                    smhLS.generateTwitchIframe(embedCode);
                } else {
                    embedCode = '<iframe width="' + width + '" height="' + height + '" src="https://player.twitch.tv/?channel=' + twitch_id + '&autoplay=false" frameborder="0" allowfullscreen></iframe>';
                    $('#embed_code').text(embedCode);
                    smhLS.generateTwitchIframe(embedCode);
                }
            }
        });

        $('#smh-modal4').on('keyup', '#dim_width', function () {
            ratio = $('#aspect_ratio').val();
            if (ratio !== 'custom') {
                var aspect = ratio == '16:9' ? 9 / 16 : 3 / 4;
                width = $('#dim_width').val();
                height = parseInt(width * aspect);
                $('#dim_height').val(height);
            }
        });

        $('#smh-modal4').on('change', '#aspect_ratio', function () {
            ratio = $('#aspect_ratio').val();
            if (ratio !== 'custom') {
                $('#dim_height').attr('disabled', '');
                var aspect = ratio == '16:9' ? 9 / 16 : 3 / 4;
                width = $('#dim_width').val();
                height = parseInt(width * aspect);
                $('#dim_height').val(height);
            } else {
                $('#dim_height').removeAttr('disabled');
            }
        });

        if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
            $('select.embedType').on('change', function (event) {
                embed = $('select.embedType option:selected').val();
                if (embed == 'dynamic') {
                    $('#embedType-text').html('Dynamic embed is the preferred method to dynamically embed the player into web sites and web applications.');
                } else if (embed == 'thumb') {
                    $('#embedType-text').html('This is the recommended method to use when you need to embed many players/entries in the same web page.');
                } else if (embed == 'iframe') {
                    $('#embedType-text').html('Iframe embed is good for sites that do not allow 3rd party JavaScript to be embeded on their pages.');
                }
                player_prev_gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
                smhLS.getShortLink(uiconf_id, entryId, embed, delivery);

                gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                embedCode = gen.getCode();
                $('#embed_code').text(embedCode);
                player_prev = player_prev_gen.getCode();
                smhLS.generateIframe(player_prev);
            });
            $('.previewModal .options').on('change', '#secure', function (event) {
                if ($("#secure").is(':checked')) {
                    protocol = 'https';
                    gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                } else {
                    protocol = 'http';
                    gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                }
            });
            $('.previewModal .options').on('change', '#seo', function (event) {
                if ($("#seo").is(':checked')) {
                    seo = true;
                    gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                } else {
                    seo = false;
                    gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                }
            });
        }

        $('#smh-modal4').on('click', '#select-bttn', function (event) {
            $('#smh-modal4 #embed_code').select();
        });
    },
    //Reset Modal
    resetPreviewModal: function () {
        $('#smh-modal3 .modal-header').empty();
        $('#smh-modal3 .modal-body').empty();
        $('#smh-modal3 .modal-footer').empty();
        $('#smh-modal3 .modal-content').css('min-height', '');
        $('#smh-modal3 .smh-dialog2').css('width', '');
        $('#smh-modal3 .modal-body').css('height', '');
        $('#smh-modal3 .modal-body').css('padding', '15px');
    },
    //Generate iframe code
    generateIframe: function (embedCode) {
        $('#previewIframe').empty();
        var style = '<style>html, body {margin: 0; padding: 0; width: 100%; height: 100%; } #framePlayerContainer {margin: 0 auto; padding-top: 20px; text-align: center; } object, div { margin: 0 auto; }</style>';
        var iframe = document.createElement('iframe');
        // Reset iframe style
        iframe.frameborder = "0";
        iframe.frameBorder = "0";
        iframe.marginheight = "0";
        iframe.marginwidth = "0";
        iframe.frameborder = "0";
        iframe.setAttribute('allowFullScreen', '');
        iframe.setAttribute('webkitallowfullscreen', '');
        iframe.setAttribute('mozallowfullscreen', '');
        iframe.setAttribute('id', 'smh-iframe');
        $('#previewIframe').append(iframe);
        var newDoc = iframe.contentDocument;
        newDoc.open();
        newDoc.write('<!doctype html><html><head>' + style + '</head><body><div id="framePlayerContainer">' + embedCode + '</div></body></html>');
        newDoc.close();
    },
    generateYoutubeIframe: function (embedCode) {
        $('#previewIframe').empty();
        $('#previewIframe').append('<div id="sn-wrapper">' + embedCode + '</div>');
    },
    generateFacebookIframe: function (embedCode) {
        $('#previewIframe').empty();
        $('#previewIframe').append('<div id="sn-wrapper">' + embedCode + '</div>');
    },
    generateTwitchIframe: function (embedCode) {
        $('#previewIframe').empty();
        $('#previewIframe').append('<div id="sn-wrapper">' + embedCode + '</div>');
    },
    //Get Shortlink
    getShortLink: function (uiconf, entryid, embed, delivery) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            $('#qrcode').empty();
            shortlink = 'https://mediaplatform.streamingmediahosting.com/tiny/' + results['id'];
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
            url = "http://mediaplatform.streamingmediahosting.com/index.php/extwidget/preview/partner_id/" + sessInfo.pid + "/uiconf_id/" + uiconf + "/entry_id/" + entryid + "/embed/" + embed + "?&flashvars[ks]=" + sessInfo.ks;
        } else {
            url = "http://mediaplatform.streamingmediahosting.com/index.php/extwidget/preview/partner_id/" + sessInfo.pid + "/uiconf_id/" + uiconf + "/entry_id/" + entryid + "/embed/" + embed + "?&flashvars[streamerType]=rtmp&flashvars[mediaProtocol]=rtmp&flashvars[ks]=" + sessInfo.ks;
        }

        $('#shortlink').html('Generating...');
        $('#qrcode').html('Generating...');
        var shortLink = new KalturaShortLink();
        shortLink.systemName = "KMC-PREVIEW";
        shortLink.fullUrl = url;
        client.shortLink.add(cb, shortLink);
    },
    //Generate embed code
    generateEmbed: function (uiconf_id, entryId, width, height, protocol, streamerType, embed, seo, name, preview, sizing, aspectRatio) {
        var flashvars = {};
        flashvars.LeadHLSOnAndroid = true;

        if (preview) {
            flashvars.ks = sessInfo.ks;
        }

        var cacheSt = smhLS.getCacheSt();
        var gen = new kEmbedCodeGenerator({
            host: "mediaplatform.streamingmediahosting.com",
            securedHost: "mediaplatform.streamingmediahosting.com",
            embedType: embed,
            partnerId: sessInfo.pid,
            widgetId: "_" + sessInfo.pid,
            uiConfId: uiconf_id,
            entryId: entryId,
            playerId: "smh_player",
            width: width,
            height: height,
            cacheSt: cacheSt,
            includeKalturaLinks: false,
            includeSeoMetadata: seo,
            sizing: sizing,
            aspectRatio: aspectRatio,
            preview: preview,
            protocol: protocol,
            flashVars: flashvars,
            entryMeta: {
                name: name,
                thumbnailUrl: "http://imgs.mediaportal.streamingmediahosting.com/p/" + sessInfo.pid + "/sp/" + sessInfo.pid + "00/thumbnail/entry_id/" + entryId + "/width/120/height/90/bgcolor/000000/type/2",
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
    //Delete Live Stream Modal
    deleteLiveStream: function (id, name) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '435px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Delete</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='text-align: center; margin: 27px 27px 0; height: 75px; width: 378px;'>Are you sure you want to delete the following live stream?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>(" + name + ")</div>";

        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="delete-livestream" onclick="smhLS.removeLiveStream(\'' + id + '\')">Delete</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    removeSmhLiveStream: function (id) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results == null) {
                smhLS.purgeCache('delete');
                $('#smh-modal').modal('hide');
                smhLS.getLiveStreams();
            } else if (results.code && results.message) {
                alert(results.message);
                return;
            }
        };
        client.liveStream.deleteAction(cb, id);
    },
    doDeleteSnLiveStreams: function (eid) {
        var sessData = {
            action: 'delete_sn_livestream',
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            eid: eid
        }

        $.ajax({
            cache: false,
            url: SnApiUrl,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            success: function (data) {
                if (data['success']) {
                    smhLS.removeSmhLiveStream(eid);
                } else {
                    $('#smh-modal').modal('hide');
                    smhLS.getLiveStreams();
                    alert(data['message']);
                }
            }
        });
    },
    //Do delete
    removeLiveStream: function (id) {
        $('#delete-livestream').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        if (services.sn == '1') {
            if (yt_ready || fb_ready || twch_ready) {
                smhLS.doDeleteSnLiveStreams(id);
            } else {
                smhLS.removeSmhLiveStream(id);
            }
        } else {
            smhLS.removeSmhLiveStream(id);
        }
    },
    //Bulk Delete Modal
    bulkDeleteModal: function () {
        bulkdelete = new Array();
        var rowcollection = livestreamTable.$(".livestream-bulk:checked", {
            "page": "all"
        });
        rowcollection.each(function (index, elem) {
            var checkbox_value = $(elem).val().split(';');
            bulkdelete.push(checkbox_value[0]);
        });

        if (bulkdelete.length == 0) {
            smhLS.noEntrySelected();
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

            content = '<div style="padding-top: 25px; padding-bottom: 25px; text-align: center;">Are you sure you want to delete the selected live streams?</div>';

            $('#smh-modal .modal-body').html(content);

            footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="delete-livestreams" onclick="smhLS.bulkDelete()">Delete</button>';
            $('#smh-modal .modal-footer').html(footer);
        }
    },
    doBulkDeleteSnLiveStreams: function (eid) {
        var sessData = {
            action: 'delete_sn_livestream',
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            eid: eid
        }
        var result = false;
        $.ajax({
            cache: false,
            url: SnApiUrl,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            async: false,
            success: function (data) {
                result = data['success'];
            }
        });
        return result;
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
            smhLS.purgeCache('delete');
            $('#smh-modal').modal('hide');
            smhLS.getLiveStreams();
        };

        $('#delete-livestreams').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        client.startMultiRequest();
        $.each(bulkdelete, function (key, value) {
            if (services.sn == '1') {
                if (yt_ready || fb_ready || twch_ready) {
                    var snLsBulkResult = smhLS.doBulkDeleteSnLiveStreams(value);
                    if (snLsBulkResult) {
                        client.liveStream.deleteAction(cb, value);
                    }
                } else {
                    client.liveStream.deleteAction(cb, value);
                }
            } else {
                client.liveStream.deleteAction(cb, value);
            }
        });
        client.doMultiRequest(cb);
    },
    //Bulk Access Control modal
    bulkACModal: function () {
        bulkac = new Array();
        var rowcollection = livestreamTable.$(".livestream-bulk:checked", {
            "page": "all"
        });
        rowcollection.each(function (index, elem) {
            var checkbox_value = $(elem).val().split(';');
            bulkac.push(checkbox_value[0]);
        });

        if (bulkac.length == 0) {
            smhLS.noEntrySelected();
        } else {
            smhMain.resetModal();
            var header, content, footer;
            $('.smh-dialog').css('width', '440px');
            $('#smh-modal').modal({
                backdrop: 'static'
            });

            var access_select = '';

            $.each(ac_select, function (index, value) {
                access_select += '<option value="' + index + '">' + value + '</option>';
            });

            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Set Access Control Profile</h4>';
            $('#smh-modal .modal-header').html(header);

            content = '<div style="padding-top: 25px; padding-bottom: 25px; text-align: center; font-size: 13px;">' +
                    'This will override Access Control Profile settings for all selected entries' +
                    '<table id="ac-bulk-table">' +
                    '<tr><td style="width: 155px;">Access Control Profile:</td><td><select class="form-control" id="ac-select">' + access_select + '</select></td></tr>' +
                    '</table>' +
                    '</div>';

            $('#smh-modal .modal-body').html(content);

            footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="bulkac-livestreams" onclick="smhLS.bulkAC()">Apply</button>';
            $('#smh-modal .modal-footer').html(footer);
        }
    },
    //Do bulk Access Control
    bulkAC: function () {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            smhLS.purgeCache('ac');
            $('#smh-modal').modal('hide');
            smhLS.getLiveStreams();
        };

        $('#bulkac-livestreams').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        var ac = $('#smh-modal #ac-select').val();
        client.startMultiRequest();
        $.each(bulkac, function (key, value) {
            var liveStreamEntry = new KalturaLiveStreamAdminEntry();
            liveStreamEntry.accessControlId = ac;
            client.liveStream.update(cb, value, liveStreamEntry);
        });
        client.doMultiRequest(cb);
    },
    //Bulk Add Tags
    bulkTagsAddModal: function () {
        bulktags = new Array();
        var rowcollection = livestreamTable.$(".livestream-bulk:checked", {
            "page": "all"
        });
        rowcollection.each(function (index, elem) {
            var checkbox_value = $(elem).val().split(';');
            var tags_split = checkbox_value[1].split(',');
            bulktags.push({
                key: checkbox_value[0],
                value: tags_split
            });
        });

        if (bulktags.length == 0) {
            smhLS.noEntrySelected();
        } else {
            smhMain.resetModal();
            var header, content, footer;
            $('.smh-dialog').css('width', '330px');
            $('#smh-modal').modal({
                backdrop: 'static'
            });

            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Add Tags</h4>';
            $('#smh-modal .modal-header').html(header);

            content = '<div style="padding-top: 25px; padding-bottom: 25px; text-align: center; font-size: 13px;">' +
                    'Enter tags to be appended to all selected entries. Use a comma to add multiple tags.' +
                    '<table id="ac-bulk-table">' +
                    '<tr><td><input type="text" class="form-control" id="tags-bulk"></td></tr>' +
                    '</table>' +
                    '</div>';

            $('#smh-modal .modal-body').html(content);

            footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="bulkaddtags-livestreams" onclick="smhLS.bulkAddTags()">Save</button>';
            $('#smh-modal .modal-footer').html(footer);
        }
    },
    //Do bulk add tags
    bulkAddTags: function () {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            $('#smh-modal').modal('hide');
            smhLS.getLiveStreams();
        };

        var tags = $('#ac-bulk-table #tags-bulk').val().split(',');
        $.each(bulktags, function (index, value) {
            var temp = value.value;
            temp = $.grep(temp, function (n) {
                return(n);
            });
            $.each(tags, function (i, v) {
                if ($.inArray(v, temp) == -1) {
                    temp.push($.trim(v));
                }
            });
            value.value = temp;
        });

        $('#bulkaddtags-livestreams').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        client.startMultiRequest();
        $.each(bulktags, function (key, value) {
            var liveStreamEntry = new KalturaLiveStreamAdminEntry();
            liveStreamEntry.tags = value.value.join();
            client.liveStream.update(cb, value.key, liveStreamEntry);
        });
        client.doMultiRequest(cb);
    },
    //Bulk Remove Tags Modal
    bulkTagsRemoveModal: function () {
        bulktags = new Array();
        var tags_arr = [];
        var rowcollection = livestreamTable.$(".livestream-bulk:checked", {
            "page": "all"
        });
        rowcollection.each(function (index, elem) {
            var checkbox_value = $(elem).val().split(';');
            var tags_split = checkbox_value[1].split(',');
            bulktags.push({
                key: checkbox_value[0],
                value: tags_split
            });
            $.each(tags_split, function (i, v) {
                if ($.inArray(v, tags_arr) == -1) {
                    if (v != '') {
                        tags_arr.push(v);
                    }
                }
            });
        });

        if (bulktags.length == 0) {
            smhLS.noEntrySelected();
        } else {
            smhMain.resetModal();
            var header, content, footer;
            $('.smh-dialog').css('width', '390px');
            $('#smh-modal').modal({
                backdrop: 'static'
            });

            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Remove Tags</h4>';
            $('#smh-modal .modal-header').html(header);

            content = '<div style="padding-top: 25px; padding-bottom: 25px; text-align: center; font-size: 13px;">' +
                    'Select the tags you wish to remove from the selected entries.' +
                    '<div id="remove-tags-wrapper">' +
                    '</div>' +
                    '</div>';

            $('#smh-modal .modal-body').html(content);

            footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="bulkremovetags-livestreams" onclick="smhLS.bulkRemoveTags()" disabled>Remove</button>';
            $('#smh-modal .modal-footer').html(footer);

            $('#remove-tags-wrapper').mCustomScrollbar({
                theme: "inset-dark",
                scrollButtons: {
                    enable: true
                }
            });

            $.each(tags_arr, function (index, value) {
                $('#remove-tags-wrapper .mCSB_container').append('<div class="tags-spacing">' + value + '</div>');
            });
        }
    },
    //Do Remove Tags
    bulkRemoveTags: function () {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            $('#smh-modal').modal('hide');
            smhLS.getLiveStreams();
        };

        var tags_to_remove = [];
        $('#remove-tags-wrapper .tag-selected').each(function () {
            tags_to_remove.push($(this).text());
        });

        $.each(bulktags, function (index, value) {
            var temp = value.value;
            $.each(tags_to_remove, function (i, v) {
                temp = $.grep(temp, function (value) {
                    return value != v;
                });
            });
            value.value = temp;
        });

        $('#bulkremovetags-livestreams').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        client.startMultiRequest();
        $.each(bulktags, function (key, value) {
            var liveStreamEntry = new KalturaLiveStreamAdminEntry();
            liveStreamEntry.tags = value.value.join();
            client.liveStream.update(cb, value.key, liveStreamEntry);
        });
        client.doMultiRequest(cb);
    },
    //Bulk add to categories modal
    bulkCatAddModal: function () {
        bulkcat = new Array();
        var rowcollection = livestreamTable.$(".livestream-bulk:checked", {
            "page": "all"
        });
        rowcollection.each(function (index, elem) {
            var checkbox_value = $(elem).val().split(';');
            var cats_split = checkbox_value[2].split(',');
            bulkcat.push({
                key: checkbox_value[0],
                value: cats_split
            });
        });

        if (bulkcat.length == 0) {
            smhLS.noEntrySelected();
        } else {
            smhMain.resetModal();
            var header, content, footer;
            $('.smh-dialog').css('width', '330px');
            $('#smh-modal').modal({
                backdrop: 'static'
            });

            var tree = '<div style="margin-left: auto; margin-right: auto; width: 135px; font-weight: bold; margin-top: 50px;">No Categories found</div>';
            var apply_button = '';
            if (categories.length > 0) {
                tree = smhLS.json_tree(categories, 'cat');
                apply_button = '<button type="button" class="btn btn-primary" id="bulkaddcats-livestreams" onclick="smhLS.bulkAddCats()">Apply</button>'
            }
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Select Categories</h4>';
            $('#smh-modal .modal-header').html(header);

            content = '<div id="catselect-wrapper">' +
                    '<div id="tree3">' +
                    '<div class="cat-options">' +
                    tree +
                    '</div>' +
                    '</div>' +
                    '</div>';

            $('#smh-modal .modal-body').html(content);

            footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default smh-close" data-dismiss="modal">Close</button>' + apply_button;
            $('#smh-modal .modal-footer').html(footer);

            if (categories.length > 0) {
                $('#smh-modal #catselect-wrapper #tree3').tree({
                    collapseDuration: 100,
                    expandDuration: 100,
                    onCheck: {
                        ancestors: null
                    }
                });
                $('#smh-modal #catselect-wrapper').mCustomScrollbar({
                    theme: "inset-dark",
                    scrollButtons: {
                        enable: true
                    }
                });
            }
        }
    },
    //Do bulk add categories
    bulkAddCats: function () {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            $('#smh-modal').modal('hide');
            smhLS.getLiveStreams();
        };

        var catIDs = [];
        $('#smh-modal .cat-options input[type="checkbox"]').each(function () {
            if ($(this).is(":checked")) {
                var checkbox_value = $(this).val();
                catIDs.push(checkbox_value);
            }
        });

        $.each(bulkcat, function (index, value) {
            var temp = value.value;
            temp = $.grep(temp, function (n) {
                return(n);
            });
            $.each(catIDs, function (i, v) {
                if ($.inArray(v, temp) == -1) {
                    temp.push($.trim(v));
                }
            });
            value.value = temp;
        });

        $('#bulkaddcats-livestreams').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        client.startMultiRequest();
        $.each(bulkcat, function (key, value) {
            var liveStreamEntry = new KalturaLiveStreamAdminEntry();
            liveStreamEntry.categoriesIds = value.value.join(',');
            client.liveStream.update(cb, value.key, liveStreamEntry);
        });
        client.doMultiRequest(cb);
    },
    //Bulk remove categories modal
    bulkCatRemoveModal: function () {
        bulkcat = new Array();
        var cats_arr = [];
        var rowcollection = livestreamTable.$(".livestream-bulk:checked", {
            "page": "all"
        });
        rowcollection.each(function (index, elem) {
            var checkbox_value = $(elem).val().split(';');
            var cats_split = checkbox_value[2].split(',');
            $.each(cats_split, function (i, v) {
                if (cats[v] != undefined) {
                    cats_split[i] = cats[v];
                }
            });
            bulkcat.push({
                key: checkbox_value[0],
                value: cats_split
            });
            $.each(cats_split, function (i, v) {
                if ($.inArray(v, cats_arr) == -1) {
                    if (v != '') {
                        cats_arr.push(v);
                    }
                }
            });
        });

        if (bulkcat.length == 0) {
            smhLS.noEntrySelected();
        } else {
            smhMain.resetModal();
            var header, content, footer;
            $('.smh-dialog').css('width', '390px');
            $('#smh-modal').modal({
                backdrop: 'static'
            });

            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Remove Categories</h4>';
            $('#smh-modal .modal-header').html(header);

            content = '<div style="padding-top: 25px; padding-bottom: 25px; text-align: center; font-size: 13px;">' +
                    'Remove selected entries from these categories.' +
                    '<div id="remove-cats-wrapper">' +
                    '</div>' +
                    '</div>';

            $('#smh-modal .modal-body').html(content);

            footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="bulkremovecats-livestreams" onclick="smhLS.bulkRemoveCats()" disabled>Remove</button>';
            $('#smh-modal .modal-footer').html(footer);

            $('#remove-cats-wrapper').mCustomScrollbar({
                theme: "inset-dark",
                scrollButtons: {
                    enable: true
                }
            });

            $.each(cats_arr, function (index, value) {
                $('#remove-cats-wrapper .mCSB_container').append('<div class="cats-spacing">' + value + '</div>');
            });
        }
    },
    //Do bulk remove cats
    bulkRemoveCats: function () {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            $('#smh-modal').modal('hide');
            smhLS.getLiveStreams();
        };

        var cats_to_remove = [];
        $('#remove-cats-wrapper .cats-selected').each(function () {
            cats_to_remove.push($(this).text());
        });

        $.each(bulkcat, function (index, value) {
            var temp = value.value;
            $.each(cats_to_remove, function (i, v) {
                temp = $.grep(temp, function (value) {
                    return value != v;
                });
            });
            value.value = temp;
        });

        $('#bulkremovecats-livestreams').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        client.startMultiRequest();
        $.each(bulkcat, function (key, value) {
            var liveStreamEntry = new KalturaLiveStreamAdminEntry();
            liveStreamEntry.categories = value.value.join();
            client.liveStream.update(cb, value.key, liveStreamEntry);
        });
        client.doMultiRequest(cb);
    },
    //No Entry selected modal
    noEntrySelected: function () {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '286px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">No Live Stream Selected</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div style="padding-top: 15px; padding-bottom: 15px; text-align: center;">You must select a live stream</div>';

        $('#smh-modal .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
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
                categories = smhLS.getNestedChildren(categories_arr, 0);
                smhLS.addCats();
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
                smhLS.addAC();
            }
        };

        var filter = null;
        var pager = null;
        client.accessControlProfile.listAction(cb, filter, pager);
    },
    //Creates nested children
    getNestedChildren: function (arr, parentId) {
        var out = []
        for (var i in arr) {
            if (arr[i].parentId == parentId) {
                var children = smhLS.getNestedChildren(arr, arr[i].id)

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
                json = json + smhLS.json_tree(data[i].children, type);
            } else {
                json = json + '<li><div class="checkbox"><label><input type="checkbox" class="' + type + '_list" value="' + data[i].id + '" /> ' + data[i].name + '</label></div>';
            }
            json = json + '</li>';
        }
        return json + '</ul>';
    },
    //Adds filter categories
    addCats: function () {
        var tree = smhLS.json_tree(categories, 'cat');
        $('.cat-filter').html(tree);
        $('.dropdown-filter #tree1').tree({
            collapseDuration: 100,
            expandDuration: 100,
            onCheck: {
                ancestors: null
            }
        });
        $('#users-buttons .dropdown-filter .panel-body').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        // Collapse accordion every time dropdown is shown
        $('#users-buttons .dropdown-accordion').on('show.bs.dropdown', function (event) {
            var accordion = $(this).find($(this).data('accordion'));
            accordion.find('.panel-collapse.in').collapse('hide');
        });

        // Prevent dropdown to be closed when we click on an accordion link
        $('#users-buttons .dropdown-accordion').on('click', 'a[data-toggle="collapse"]', function (event) {
            event.preventDefault();
            event.stopPropagation();
            $($(this).data('parent')).find('.panel-collapse.in').collapse('hide');
            $($(this).attr('href')).collapse('show');
        });

        $('#users-buttons .dropdown-accordion').on('click', '.panel-body', function (event) {
            event.stopPropagation();
        });

        $('#users-buttons .dropdown-filter #tree1').on('change', ".cat_all", function () {
            if ($(this).is(":checked")) {
                $('#users-buttons .dropdown-filter .cat-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            categoryIDs = [];
            smhLS.getLiveStreams();
        });
        $('#users-buttons .dropdown-filter #tree1').on('click', ".cat_list", function () {
            setTimeout(function () {
                var anyBoxesChecked = false;
                categoryIDs = [];
                $('#users-buttons .dropdown-filter .cat-filter input[type="checkbox"]').each(function () {
                    if ($(this).is(":checked")) {
                        anyBoxesChecked = true;
                        var checkbox_value = $(this).val();
                        categoryIDs.push(checkbox_value);
                    }
                });
                if (anyBoxesChecked == true) {
                    $('#users-buttons .dropdown-filter .cat_all').prop('checked', false);
                } else {
                    $('#users-buttons .dropdown-filter .cat_all').prop('checked', true);
                }
            }, 50);
            setTimeout(function () {
                smhLS.getLiveStreams();
            }, 100);
        });
    },
    //Adds Access Control Filter
    addAC: function () {
        var tree_ac = smhLS.json_tree(ac, 'ac');
        $('.ac-filter').html(tree_ac);
        $('.dropdown-filter #tree2').tree({
            collapseDuration: 100,
            expandDuration: 100,
            onCheck: {
                ancestors: null
            }
        });
        $('#users-buttons .dropdown-filter .panel-body').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
        $('#users-buttons .dropdown-filter #tree2').on('change', ".ac_all", function () {
            if ($(this).is(":checked")) {
                $('#users-buttons .dropdown-filter .ac-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            ac_filter = [];
            smhLS.getLiveStreams();
        });
        $('#users-buttons .dropdown-filter #tree2').on('click', ".ac_list", function () {
            var anyBoxesChecked = false;
            ac_filter = [];
            $('#users-buttons .dropdown-filter .ac-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    ac_filter.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#users-buttons .dropdown-filter .ac_all').prop('checked', false);
            } else {
                $('#users-buttons .dropdown-filter .ac_all').prop('checked', true);
            }
            smhLS.getLiveStreams();
        });
    },
    //View Encoder Settings Modal
    viewSettings: function (name, bitrate, stream_name) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '900px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        var bitrate_arr = bitrate.split(";");
        var streams = '';
        if (bitrate_arr.length > 1) {
            $.each(bitrate_arr, function (index, value) {
                var bitsplit = value.split(",");
                var i = index + 1;
                streams += '<tr>' +
                        '<td><div class="title">Stream ' + i + ':</div></td>' +
                        '<td><div class="col-sm-4 col-md-8 col-lg-12"><input type="text" class="form-control" value="' + stream_name.replace("?", i + "?") + '"></div></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td></td><td><div class="col-sm-4 col-md-8 col-lg-12"><b>Output Size:</b> ' + bitsplit[0] + ' x ' + bitsplit[1] + ', <b>Bitrate:</b> ' + bitsplit[2] + 'Kbps</div></td>' +
                        '</tr>';
            });
        } else {
            $.each(bitrate_arr, function (index, value) {
                var bitsplit = value.split(",");
                streams += '<tr>' +
                        '<td><div class="title">Stream:</div></td>' +
                        '<td><div class="col-sm-4 col-md-8 col-lg-12"><input type="text" class="form-control" value="' + stream_name + '"></div></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td></td><td><div class="col-sm-4 col-md-8 col-lg-12"><b>Output Size:</b> ' + bitsplit[0] + ' x ' + bitsplit[1] + ', <b>Bitrate:</b> ' + bitsplit[2] + 'Kbps</div></td>' +
                        '</tr>';
            });
        }

        var config_file = '';
        if (services.tricaster == '1') {
            config_file += '<tr>' +
                    '<td><div class="title">Config File (XML):</div></td>' +
                    '<td><div class="col-sm-4 col-md-8 col-lg-12"><button class="btn btn-default" type="button">Download Settings to TriCaster</button></div></td>' +
                    '</tr>';
        } else {
            config_file += '<tr>' +
                    '<td style="vertical-align:top"><div class="title">Config File (XML):</div></td>' +
                    '<td><div class="col-sm-4 col-md-8 col-lg-12"><div style="margin-bottom: 10px;">The config file below is only compatible with <b>Flash Media Live Encoder</b></div><button class="btn btn-default" type="button" onclick="smhLS.exportXML(\'' + stream_name + '\',\'' + bitrate + '\');">Download FMLE Config File</button></div></td>' +
                    '</tr>';
        }

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Encoder Settings: ' + name + '</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div id="encoders-wrapper">' +
                '<h4><b>Broadcasting Settings</b></h4>' +
                '<table id="pub-table">' +
                '<tbody>' +
                '<tr>' +
                '<td style="width: 130px;"><div class="title">RTMP URL:</div></td><td><div class="col-sm-4 col-md-8 col-lg-12"><input type="text" class="form-control" value="rtmp://lvip.smhcdn.com/' + sessInfo.pid + '-live"></div></td>' +
                '</tr>' +
                streams +
                config_file +
                '<tr>' +
                '<td><div class="title">Playback URLs:</div></td>' +
                '<td><div class="col-sm-4 col-md-8 col-lg-12"><a style="font-weight: bold;" onclick="smhLS.viewUrls(\'' + name + '\',\'' + stream_name + '\',\'' + bitrate + '\');">View URLs <i style="width: 100%; text-align: center; display: inline; font-size: 12px;" class="fa fa-external-link"></i></a></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '<div class="clear"></div>' +
                '<hr>' +
                '<h4><b>Encoder Support</b></h4>' +
                '<div id="encoders">' +
                '<div class="encoder-row odd">' +
                '<div class="pull-left"><img src="/img/flashmedia.png"></div>' +
                '<div class="pull-left encoder-text-wrapper"><div class="encoder-title">Flash Media Encoder</div><div class="desc">The free Adobe Flash Media Live Encoder can help you stream from just about any source.</div></div>' +
                '<div class="pull-right"><div class="button-wrapper"><button class="btn btn-default" type="button" onclick="window.open(\'https://offers.adobe.com/en/na/leap/landings/fmle3.html\')">Download</button></div></div>' +
                '</div>' +
                '<div class="encoder-row even">' +
                '<div class="pull-left"><img src="/img/wirecast.png"></div>' +
                '<div class="pull-left encoder-text-wrapper"><div class="encoder-title">Wirecast</div><div class="desc">Produce professional-looking live events with just a camera, internet connection and a computer.</div></div>' +
                '<div class="pull-right"><div class="button-wrapper"><button class="btn btn-default" type="button" onclick="window.open(\'http://www.telestream.net/wirecast/overview.htm\')">Download</button></div></div>' +
                '</div>' +
                '<div class="encoder-row odd">' +
                '<div class="pull-left"><img src="/img/tricaster.png"></div>' +
                '<div class="pull-left encoder-text-wrapper"><div class="encoder-title">TriCaster</div><div class="desc">NewTek all-in-one integrated live production system offers the power of a live network studio.</div></div>' +
                '<div class="pull-right"><div class="button-wrapper"><button class="btn btn-default" type="button" onclick="window.open(\'http://www.newtek.com/tricaster.html\')">Download</button></div></div>' +
                '</div>' +
                '<div class="encoder-row even">' +
                '<div class="pull-left"><img src="/img/datavideo.png"></div>' +
                '<div class="pull-left encoder-text-wrapper"><div class="encoder-title">Datavideo</div><div class="desc">Quickly stream live events over the internet, as well as live streaming to mobile digital devices.</div></div>' +
                '<div class="pull-right"><div class="button-wrapper"><button class="btn btn-default" type="button" onclick="window.open(\'http://www.datavideo.com/\')">Download</button></div></div>' +
                '</div>' +
                '<div class="encoder-row odd">' +
                '<div class="pull-left"><img src="/img/xsplit.png"></div>' +
                '<div class="pull-left encoder-text-wrapper"><div class="encoder-title">XSplit</div><div class="desc">A desktop application designed to make your multimedia broadcasting and recording a lot easier.</div></div>' +
                '<div class="pull-right"><div class="button-wrapper"><button class="btn btn-default" type="button" onclick="window.open(\'https://www.xsplit.com/download\')">Download</button></div></div>' +
                '</div>' +
                '<div class="encoder-row even">' +
                '<div class="pull-left"><img src="/img/vidblaster.png"></div>' +
                '<div class="pull-left encoder-text-wrapper"><div class="encoder-title">VidBlaster</div><div class="desc">An advanced audio/video-encoding and live-broadcasting application.</div></div>' +
                '<div class="pull-right"><div class="button-wrapper"><button class="btn btn-default" type="button" onclick="window.open(\'http://vidblaster.com/downloads/downloads.html\')">Download</button></div></div>' +
                '</div>' +
                '<div class="encoder-row odd">' +
                '<div class="pull-left"><img src="/img/teradek.png"></div>' +
                '<div class="pull-left encoder-text-wrapper"><div class="encoder-title">Teradek Cube</div><div class="desc">A compact H.264 encoder / decoder designed to stream live HD video directly to the Web.</div></div>' +
                '<div class="pull-right"><div class="button-wrapper"><button class="btn btn-default" type="button" onclick="window.open(\'http://teradek.com/pages/cube\')">Download</button></div></div>' +
                '</div>' +
                '<div class="encoder-row even">' +
                '<div class="pull-left"><img src="/img/ios.png"></div>' +
                '<div class="pull-left encoder-text-wrapper"><div class="encoder-title">IOS Live Broadcaster</div><div class="desc">Broadcast and stream live video from your IOS mobile device directly to your own website.</div></div>' +
                '<div class="pull-right"><div class="button-wrapper"><button class="btn btn-default" type="button" onclick="window.open(\'https://itunes.apple.com/is/app/smh-mobile-live-encoder/id613617453?mt=8\')">Download</button></div></div>' +
                '</div>' +
                '<div class="encoder-row odd">' +
                '<div class="pull-left"><img src="/img/android.png"></div>' +
                '<div class="pull-left encoder-text-wrapper"><div class="encoder-title">Android Live Broadcaster</div><div class="desc">Broadcast and stream live video from your Android mobile device directly to your own website.</div></div>' +
                '<div class="pull-right"><div class="button-wrapper"><button class="btn btn-default" type="button" onclick="window.open(\'https://play.google.com/store/apps/details?id=air.com.smh.liveencoder\')">Download</button></div></div>' +
                '</div>' +
                '</div>' +
                '</div>';

        $('#smh-modal .modal-body').html(content);

        $('#encoders-wrapper #encoders').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //View URLs modal
    viewUrls: function (name, stream_name, bitrate) {
        smhLS.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '700px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '2');

        var bitrate_arr = bitrate.split(";");
        var hls_urls = '';
        var hlss_urls = '';
        var stream_name_split = stream_name.split('?');
        if (bitrate_arr.length > 1) {
            $.each(bitrate_arr, function (index, value) {
                var i = index + 1;
                var stream_name_final = stream_name_split[0] + i;
                hls_urls += '<tr>' +
                        '<td style="width: 100px;"><div class="title">HLS URL (HTTP) ' + i + ':</div></td>' +
                        '<td><div class="col-sm-4 col-md-8 col-lg-12"><input type="text" class="form-control" value="http://wpc.19BC0.taucdn.net/2419BC0/' + sessInfo.pid + '-live/' + stream_name_final + '.m3u8"></div></td>' +
                        '</tr>';
                hlss_urls += '<tr>' +
                        '<td style="width: 100px;"><div class="title">HLS URL (HTTPS) ' + i + ':</div></td>' +
                        '<td><div class="col-sm-4 col-md-8 col-lg-12"><input type="text" class="form-control" value="https://secure.streamingmediahosting.com/2419BC0/' + sessInfo.pid + '-live/' + stream_name_final + '.m3u8"></div></td>' +
                        '</tr>';
            });
        } else {
            $.each(bitrate_arr, function (index, value) {
                var stream_name_final = stream_name_split[0];
                hls_urls += '<tr>' +
                        '<td style="width: 100px;"><div class="title">HLS URL (HTTP):</div></td>' +
                        '<td><div class="col-sm-4 col-md-8 col-lg-12"><input type="text" class="form-control" value="http://wpc.19BC0.taucdn.net/2419BC0/' + sessInfo.pid + '-live/' + stream_name_final + '.m3u8"></div></td>' +
                        '</tr>';
                hlss_urls += '<tr>' +
                        '<td style="width: 100px;"><div class="title">HLS URL (HTTPS):</div></td>' +
                        '<td><div class="col-sm-4 col-md-8 col-lg-12"><input type="text" class="form-control" value="https://secure.streamingmediahosting.com/2419BC0/' + sessInfo.pid + '-live/' + stream_name_final + '.m3u8"></div></td>' +
                        '</tr>';
            });
        }

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">' + name + '</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = '<div id="encoders-wrapper">' +
                '<h4><b>Playback URLs</b></h4>' +
                '<table id="urls-table">' +
                '<tbody>' +
                hls_urls +
                hlss_urls +
                '</tbody>' +
                '</table>' +
                '</div>';

        $('#smh-modal2 .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button>';
        $('#smh-modal2 .modal-footer').html(footer);
    },
    //Reset Modal
    resetModal: function () {
        $('#smh-modal2 .modal-header').empty();
        $('#smh-modal2 .modal-body').empty();
        $('#smh-modal2 .modal-footer').empty();
        $('#smh-modal2 .modal-content').css('min-height', '');
        $('#smh-modal2 .smh-dialog2').css('width', '');
        $('#smh-modal2 .modal-body').css('height', '');
        $('#smh-modal2 .modal-body').css('padding', '15px');
        $('#smh-modal4 .modal-header').empty();
        $('#smh-modal4 .modal-body').empty();
        $('#smh-modal4 .modal-footer').empty();
        $('#smh-modal4 .modal-content').css('min-height', '');
        $('#smh-modal4 .smh-dialog4').css('width', '');
        $('#smh-modal4 .modal-body').css('height', '');
        $('#smh-modal4 .modal-body').css('padding', '15px');
    },
    //Download XML
    exportXML: function (stream_name, bitrates) {
        var pUrl = 'rtmp://lvip.smhcdn.com/' + sessInfo.pid + '-live';
        var bitrate_arr = bitrates.split(";");
        var datarate = '';
        var outputsize = '';
        if (bitrate_arr.length > 1) {
            stream_name = stream_name.replace("?", "%i&");
        } else {
            stream_name = stream_name.replace("?", "&");
        }

        $.each(bitrate_arr, function (index, value) {
            var bitsplit = value.split(",");
            datarate += bitsplit[2] + ';';
            outputsize += bitsplit[0] + 'x' + bitsplit[1] + ';';
        });

        if (services.tricaster == '1') {
            window.location = '/apps/platform/xml/tricaster.xml?datarate=' + datarate + '&outputsize=' + outputsize + '&url=' + pUrl + '&stream=' + stream_name + '&pid=' + sessInfo.pid + '&encodeFormat=H.264&tri=true';
        } else {
            window.open('/apps/platform/xml/xml.php?datarate=' + datarate + '&outputsize=' + outputsize + '&url=' + pUrl + '&stream=' + stream_name + '&pid=' + sessInfo.pid + '&encodeFormat=H.264&tri=false');
        }
    },
    //Add Live Stream Modal
    addLiveStream: function () {
        smhMain.resetModal();
        var header, content;
        $('.smh-dialog').css('width', '680px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        var sn_row = '';
        if (services.sn == 1) {
            if (yt_ready || fb_ready || twch_ready) {
                sn_row += '<tr class="sn-data">' +
                        '<td style="width: 170px;"><span style="font-weight: normal;">Social Media:</span></td>' +
                        '<td>' +
                        '<a style="font-weight: bold;" id="platform-config-link" onclick="smhLS.editPlatformConfig();">Configure Platforms <i style="width: 100%; text-align: center; display: inline; font-size: 12px;" class="fa fa-external-link"></i></a>' +
                        '</td>' +
                        '</tr>';
            }
        }

        var access_select = '';
        var ac_disable = ($.inArray("CONTENT_MANAGE_ACCESS_CONTROL", sessPerm) != -1) ? '' : 'disabled';
        var cat_disable = ($.inArray("CONTENT_MANAGE_ASSIGN_CATEGORIES", sessPerm) != -1) ? '' : 'disabled';
        var refid_disable = ($.inArray("CONTENT_INGEST_REFERENCE_MODIFY", sessPerm) != -1) ? '' : 'disabled';
        var metadata_disable = ($.inArray("CONTENT_MANAGE_METADATA", sessPerm) != -1) ? '' : 'disabled';
        num = 1;

        $.each(ac_select, function (index, value) {
            access_select += '<option value="' + index + '">' + value + '</option>';
        });

        header = '<button type="button" class="close smh-close add-ls-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Create Live Stream</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div class="card wizard-card ct-wizard-green" id="wizard">' +
                '<div id="crumbs">' +
                '<ul class="nav nav-pills">' +
                '<li style="width: 33.33%;" class="active"><a href="#metadata-tab" data-toggle="tab">METADATA</a></li>' +
                '<li style="width: 33.33%;"><a href="#config-tab" data-toggle="tab">STREAM CONFIGURATION</a></li>' +
                '<li style="width: 33.33%;"><a href="#encoder-tab" data-toggle="tab">ENCODER SETTINGS</a></li>' +
                '</ul>' +
                '</div>' +
                '<div class="tab-content">' +
                '<div class="tab-pane active" id="metadata-tab">' +
                '<form id="add-ls-form">' +
                '<div class="row">' +
                '<div class="col-sm-8 center-block">' +
                '<table width="100%" border="0" id="ls-add-table">' +
                '<tr>' +
                '<td style="width: 151px;"><span class="required" style="font-weight: normal;">Name:</span></td><td><input type="text" name="ls_name" id="ls_name" class="form-control" placeholder="Enter a name"></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Description:</span></td><td><input type="text" name="ls_desc" id="ls_desc" class="form-control" placeholder="Enter a description" ' + metadata_disable + '></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Tags:</span></td><td><input type="text" name="ls_tags" id="ls_tags" class="form-control" placeholder="Enter tags separated by commas" ' + metadata_disable + '></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Reference ID:</span></td><td><input type="text" name="ls_ref" id="ls_ref" class="form-control" placeholder="Enter a reference ID" ' + refid_disable + '></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Categories: <i class="fa fa-external-link" onclick="smhLS.selectCat();"></i></span></td><td><input type="text" name="ls_cat" id="ls_cat" class="form-control" placeholder="Enter categories separated by commas" ' + cat_disable + '></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Access Control Profile:</span></td><td><select class="form-control" id="ac-select" ' + ac_disable + '>' + access_select + '</select></td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '</form>' +
                '</div>' +
                '<div class="tab-pane" id="config-tab">' +
                '<div class="row">' +
                '<div class="col-sm-9 center-block">' +
                '<table width="100%" border="0" id="ls-add-table">' +
                '<tr>' +
                '<td style="width: 170px;"><span style="font-weight: normal;">Stream Name (optional):</span></td><td><input type="text" name="ls_sname" id="ls_sname" class="form-control" placeholder="Enter a stream name (no spaces)"></td>' +
                '</tr>' +
                '<tr>' +
                '<td style="width: 170px;"><span style="font-weight: normal;">Offline Message:</span></td><td><input type="text" name="ls_offline" id="ls_offline" class="form-control" placeholder="Enter a offline message"></td>' +
                '</tr>' +
                '<tr>' +
                '<td style="width: 170px;"><span style="font-weight: normal;">Server-side Recording:</span></td><td><input data-toggle="toggle" id="server-recording" type="checkbox"></td>' +
                '</tr>' +
                '<tr class="recording-options">' +
                '<td style="width: 170px;"><span style="font-weight: normal;">Recording Options:</span></td><td><select id="rec-opt" class="form-control" disabled><option value="comp_stream">Complete Stream</option><option value="rec_min">By Duration</option><option value="rec_size">By Size</option></select></td>' +
                '</tr>' +
                '<tr class="recording-options">' +
                '<td style="width: 170px;"><span style="font-weight: normal;">Segment Duration:</span></td><td><div style="float: left;"><input type="text" id="duration" name="duration" style="width:90px !important;" class="form-control" disabled /></div><div style="float: left; margin-left: 10px; margin-top: 5px;">Mintutes</div></td>' +
                '</tr>' +
                '<tr class="recording-options">' +
                '<td style="width: 170px;"><span style="font-weight: normal;">Segment Size:</span></td><td><div style="float: left;"><input type="text" id="size" name="size" style="width:90px !important;" class="form-control" disabled /></div><div style="float: left; margin-left: 10px; margin-top: 5px;">MB</div></td>' +
                '</tr>' +
                sn_row +
                '<tr>' +
                '<td colspan="2"><span style="font-weight: normal;">Bitrate Configuration:</span></td>' +
                '</tr>' +
                '<tr>' +
                '<td style="text-align: center;" colspan="2">' +
                '<div id="bitrate-wrapper">' +
                '<table id="bitrate-table">' +
                '<thead><tr><th><span style="font-weight: bold;">Bitrate <span style="font-weight: normal;">(Kbps)</span></span></th><th><span style="font-weight: bold;">Resolution</span></th><th><span style="font-weight: bold;">Remove</span></th></tr></thead>' +
                '<tr class="bitrate-row">' +
                '<td><input type="text" class="bitrate" name="bitrate" style="width:70px !important;" class="form-control" /></td>' +
                '<td>' +
                '<div class="dropdown">' +
                '<div class="input-group">' +
                '<div class="input-group-btn">' +
                '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                '<span id="res-val0" class="resolution">426x240 (240p)</span> <span class="caret"></span>' +
                '</button>' +
                '<ul id="res-list0" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                '<li><a href="#">426x240 (240p)</a></li>' +
                '<li><a href="#">640x360 (360p)</a></li>' +
                '<li><a href="#">854x480 (480p)</a></li>' +
                '<li><a href="#">1280x720 (720p)</a></li>' +
                '<li><a href="#">1920x1080 (1080p)</a></li>' +
                '<li><a href="#">2560x1440 (1440p)</a></li>' +
                '<li><a href="#">3840x2160 (2160p)</a></li>' +
                '</ul>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</td>' +
                '<td></td>' +
                '</tr>' +
                '</table>' +
                '<div id="add-bitrate"><i class="fa fa-plus"></i> Add Bitrate</div>' +
                '</div>' +
                '</td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="tab-pane" id="encoder-tab">' +
                '<div id="wizard-finish-wrapper">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="wizard-footer">' +
                '<div class="pull-right">' +
                '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div>' +
                '<input type="button" class="btn btn-next btn-fill btn-success btn-wd btn-sm" name="next" value="Next" />' +
                '<input type="button" class="btn btn-finish btn-fill btn-success btn-wd btn-sm" onclick="smhLS.closeModal()" name="finish" value="Finish" />' +
                '</div>' +
                '<div class="pull-left">' +
                '<input type="button" class="btn btn-previous btn-fill btn-default btn-wd btn-sm" name="previous" value="Previous" />' +
                '</div>' +
                '<div class="clearfix"></div>' +
                '</div>';

        $('#smh-modal .modal-body').html(content);
        $('#smh-modal .modal-footer').css('padding', '5px');
        $('#smh-modal .modal-footer').css('border-top-color', '#ffffff');

        if (services.sn == 1) {
            if (yt_ready || fb_ready || twch_ready) {
                var platforms_status_data = {
                    "smh": 1,
                    "youtube": 0,
                    "facebook": 0,
                    "twitch": 0
                }
                $('#smh-modal .sn-data').data({
                    "data": platforms_status_data
                });
            }
        }

        $('#server-recording').bootstrapToggle();
        $("#bitrate-table input[name='bitrate']").TouchSpin({
            initval: 300,
            min: 0,
            max: 100000,
            step: 1,
            verticalbuttons: true
        });
        $("#bitrate-table input[name='width']").TouchSpin({
            initval: 320,
            min: 0,
            max: 100000,
            step: 1,
            verticalbuttons: true
        });
        $("#bitrate-table input[name='height']").TouchSpin({
            initval: 240,
            min: 0,
            max: 100000,
            step: 1,
            verticalbuttons: true
        });

        $('#server-recording').change(function () {
            if ($(this).prop('checked')) {
                $('#rec-opt').removeAttr('disabled');
                $('.recording-options').css('display', 'table-row');
            } else {
                $('#rec-opt').attr('disabled', '');
                $('#duration').attr('disabled', '');
                $('#size').attr('disabled', '');
                $('.recording-options').css('display', 'none');
            }
        });

        $('#smh-modal').on('change', '#rec-opt', function (event) {
            if ($('#rec-opt').val() == 'comp_stream') {
                $('#duration').attr('disabled', '');
                $('#size').attr('disabled', '');
            } else if ($('#rec-opt').val() == 'rec_min') {
                $('#duration').removeAttr('disabled');
                $('#size').attr('disabled', '');
            } else if ($('#rec-opt').val() == 'rec_size') {
                $('#size').removeAttr('disabled');
                $('#duration').attr('disabled', '');
            }
        });

        $("input[name='duration']").TouchSpin({
            initval: 0,
            min: 0,
            max: 100000,
            step: 1,
            verticalbuttons: true
        });

        $("input[name='size']").TouchSpin({
            initval: 0,
            min: 0,
            max: 1000000,
            step: 1,
            verticalbuttons: true
        });

        smhLS.activateWizard();

        $('#add-ls-form input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
        validator = $("#add-ls-form").validate({
            highlight: function (element, errorClass) {
                $(element).removeClass("valid").removeClass("error").addClass("validate-error");
            },
            unhighlight: function (element, errorClass) {
                $(element).removeClass("valid").removeClass("validate-error");
            },
            errorPlacement: function (error, element) {
                $(element).tooltipster('update', $(error).text());
                $(element).tooltipster('show');
            },
            success: function (label, element) {
                $(element).tooltipster('hide');
            },
            rules: {
                ls_name: "required"
            },
            messages: {
                ls_name: "Please enter a name"
            }
        });
    },
    createSnConfig: function (smh_status, youtube_status, youtube_resolution, facebook_status, twitch_status) {
        var snConfig = {};
        snConfig['platforms'] = [];
        snConfig['platforms'].push({
            platform: "smh",
            status: smh_status
        });
        if (youtube_status) {
            snConfig['platforms'].push({
                platform: "youtube_live",
                status: youtube_status,
                config: {
                    res: youtube_resolution
                }
            });
        } else {
            snConfig['platforms'].push({
                platform: "youtube_live",
                status: youtube_status
            });
        }
        snConfig['platforms'].push({
            platform: "facebook_live",
            status: facebook_status
        });
        snConfig['platforms'].push({
            platform: "twitch",
            status: twitch_status
        });
        return JSON.stringify(snConfig);
    },
    doCeateSnLiveStreams: function (eid, name, desc, bitrates, streamName, platforms, sn_status) {
        var sessData = {
            action: 'create_sn_livestreams',
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            name: name,
            desc: desc,
            eid: eid,
            platforms: platforms,
            projection: 'rectangular'
        }

        $.ajax({
            cache: false,
            url: SnApiUrl,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                if (sn_status) {
                    $('#wizard-finish-wrapper').html('<div id="creating-stream">Creating social platform live streams, please wait...</div>');
                    $('#creating-stream').css('width', '330px');
                }
            },
            success: function (data) {
                if (data['success']) {
                    if (data['youtube_embed_status']) {
                        yt_embed = true;
                    } else {
                        yt_embed = false;
                    }
                    smhLS.displayBroadcastSettings(eid, name, bitrates, streamName, data['configSettings']);
                    $.each(data['platforms_responses'], function (key, value) {
                        if (value['platform'] === 'youtube') {
                            if (!value['success']) {
                                if (value['message'] === 'YouTube: you may have reached your daily broadcasting limit') {
                                    smhLS.yt_blocked();
                                }
                            }
                        }
                    });
                } else {
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#wizard-finish-wrapper').html('<div id="creating-stream">' + data['message'] + '</div>');
                    $('#creating-stream').css('width', '280px');
                }
            }
        });
    },
    //Do create live stream
    saveLS: function () {
        var snConfig = 0;
        var sn_status = false;
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }

            var platforms = '';
            if (services.sn == '1') {
                if (yt_ready || fb_ready || twch_ready) {
                    smhLS.doCeateSnLiveStreams(results.id, results.name, results.description, results.bitrates, results.streamName, snConfig, sn_status);
                } else {
                    smhLS.displayBroadcastSettings(results.id, results.name, results.bitrates, results.streamName, platforms);
                }
            } else {
                smhLS.displayBroadcastSettings(results.id, results.name, results.bitrates, results.streamName, platforms);
            }
        };

        $('#smh-modal #loading img').css('display', 'inline-block');
        $('#wizard-finish-wrapper').html('<div id="creating-stream">Creating Stream, please wait...</div>');
        $('#creating-stream').css('width', '217px');
        var name = $('#smh-modal #ls_name').val();
        var desc = $('#smh-modal #ls_desc').val();
        var tags = $('#smh-modal #ls_tags').val();
        var ref = $('#smh-modal #ls_ref').val();
        var cat = $('#smh-modal #ls_cat').val();
        var ac = $('#smh-modal #ac-select').val();
        var sname = $('#smh-modal #ls_sname').val();
        var offline = $('#smh-modal #ls_offline').val();
        var stream_rec = $('#server-recording').is(':checked') ? true : false;
        var stream_option = '';
        var stream_partnerData = '';
        var stream_rec_json = '';
        if (stream_rec) {
            if ($('#smh-modal #rec-opt').val() == 'comp_stream') {
                stream_option = '';
            } else if ($('#smh-modal #rec-opt').val() == 'rec_min') {
                if ($('#smh-modal #duration').val() != null || $('#smh-modal #duration').val() != '') {
                    stream_option = ' "byDuration":' + $('#smh-modal #duration').val() + ',';
                }
            } else if ($('#smh-modal #rec-opt').val() == 'rec_size') {
                if ($('#smh-modal #size').val() != null || $('#smh-modal #size').val() != '') {
                    stream_option = ' "byFileSize":' + $('#smh-modal #size').val() + ',';
                }
            }
            stream_rec_json += '"record":[{"enable":"true",' + stream_option + ' "format":"mp4"}]';
        } else {
            stream_rec_json += '"record":[{"enable":"false"}]';
        }

        stream_partnerData += stream_rec_json;
        var sourceType = 30;
        var liveStreamEntry = new KalturaLiveStreamAdminEntry();
        if (!(typeof desc === "undefined") && !(desc === null) && desc.length > 0) {
            liveStreamEntry.description = desc;
        }
        if (!(typeof tags === "undefined") && !(tags === null) && tags.length > 0) {
            liveStreamEntry.tags = tags;
        }
        if (!(typeof ref === "undefined") && !(ref === null) && ref.length > 0) {
            liveStreamEntry.referenceId = ref;
        }
        if (!(typeof cat === "undefined") && !(cat === null) && cat.length > 0) {
            liveStreamEntry.categories = cat;
        }
        if (!(typeof ac === "undefined") && !(ac === null) && ac.length > 0 && ac > 0) {
            liveStreamEntry.accessControlId = ac;
        }
        if (!(typeof offline === "undefined") && !(offline === null) && offline.length > 0) {
            liveStreamEntry.offlineMessage = offline;
        }
        if (!(typeof sname === "undefined") && !(sname === null) && sname.length > 0) {
            liveStreamEntry.streamName = sname.replace(/\s/g, '_');
        }

        var bit_arr = new Array();
        var res_arr = new Array();
        liveStreamEntry.bitrates = new Array();
        var table = $("#smh-modal #bitrate-table tbody");
        table.find('tr.bitrate-row').each(function () {
            bit_arr.push($(this).find('td').find('.input-group').find('.bitrate').val());
            var resolution = $(this).find('td').find('.input-group').find('.resolution').text();
            var width = 0;
            var height = 0;
            if (resolution == '426x240 (240p)') {
                width = 426;
                height = 240;
            } else if (resolution == '640x360 (360p)') {
                width = 640;
                height = 360;
            } else if (resolution == '854x480 (480p)') {
                width = 854;
                height = 480;
            } else if (resolution == '1280x720 (720p)') {
                width = 1280;
                height = 720;
            } else if (resolution == '1920x1080 (1080p)') {
                width = 1920;
                height = 1080;
            } else if (resolution == '2560x1440 (1440p)') {
                width = 2560;
                height = 1440;
            } else if (resolution == '3840x2160 (2160p)') {
                width = 3840;
                height = 2160;
            }
            res_arr.push(height);
            liveStreamEntry.bitrates.push({
                'bitrate': $(this).find('td').find('.input-group').find('.bitrate').val(),
                'width': width,
                'height': height
            });
        });

        if (bit_arr.length > 1) {
            var closest_br = smhLS.hlsClosest(bit_arr, 500);
            var key = smhLS.array_search(closest_br, bit_arr);
            var stream_num = Number(key) + 1;
            liveStreamEntry.hlsStreamUrl = stream_num;
        } else {
            liveStreamEntry.hlsStreamUrl = "";
        }

        if (services.sn == 1) {
            var youtube_status = false;
            var resolution = '';
            var facebook_status = false;
            var smh_status = true;
            var twitch_status = false;
            if (yt_ready || fb_ready || twch_ready) {
                var data = $('#smh-modal .sn-data').data("data");
                if (yt_ready) {
                    var largest_res = Math.max.apply(Math, res_arr);
                    resolution = largest_res + 'p';
                    youtube_status = (data.youtube) ? true : false;
                }
                if (fb_ready) {
                    facebook_status = (data.facebook) ? true : false;
                }
                if (twch_ready) {
                    twitch_status = (data.twitch) ? true : false;
                }
                smh_status = (data.smh) ? true : false;
                sn_status = (youtube_status || facebook_status || twitch_status) ? true : false;
            }
            snConfig = smhLS.createSnConfig(smh_status, youtube_status, resolution, facebook_status, twitch_status);
        }

        liveStreamEntry.name = name;
        liveStreamEntry.userId = sessInfo.Id;
        liveStreamEntry.type = 7;
        liveStreamEntry.partnerData = '{' + stream_partnerData + '}';
        liveStreamEntry.mediaType = 100;
        liveStreamEntry.sourceType = 30;
        liveStreamEntry.creditUserName = sessInfo.Id;
        liveStreamEntry.encodingIP1 = '0.0.0.0';
        liveStreamEntry.encodingIP2 = '0.0.0.0';
        client.liveStream.add(cb, liveStreamEntry, sourceType);
    },
    displayBroadcastSettings: function (id, name, bitrates, streamName, platforms) {
        smhLS.getLiveStreams();
        $('#smh-modal #loading img').css('display', 'none');
        $('.smh-dialog').css('width', '900px');

        var facebook = false;
        var youtube = false;
        var twitch = false;
        if (services.sn == '1') {
            if ((platforms !== '') && (yt_ready || fb_ready || twch_ready)) {
                var options = platforms.split(';');
                $.each(options, function (key, value) {
                    var platform = value.split(':');
                    if ((platform[0] == 'youtube') && (platform[1] == 1)) {
                        youtube = true;
                    }
                    if ((platform[0] == 'facebook') && (platform[1] == 1)) {
                        facebook = true;
                    }
                    if ((platform[0] == 'twitch') && (platform[1] == 1)) {
                        twitch = true;
                    }
                });
            }
        }

        var sn = '';
        if (youtube || facebook || twitch) {
            sn = streamName + '&entryId=' + id;
        } else {
            sn = streamName;
        }

        var temp_arr = [];
        var temp = bitrates;
        $.each(temp, function (index, value) {
            temp_arr.push([value[1], value[2], value[0]]);
        });

        var bitrate = temp_arr.join(';');
        var bitrate_arr = bitrate.split(";");
        var streams = '';
        if (bitrate_arr.length > 1) {
            $.each(bitrate_arr, function (index, value) {
                var bitsplit = value.split(",");
                var i = index + 1;
                streams += '<tr>' +
                        '<td><div class="title">Stream ' + i + ':</div></td>' +
                        '<td><div class="col-sm-4 col-md-8 col-lg-12"><input type="text" class="form-control" value="' + sn.replace("?", i + "?") + '"></div></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td></td><td><div class="col-sm-4 col-md-8 col-lg-12"><b>Output Size:</b> ' + bitsplit[0] + ' x ' + bitsplit[1] + ', <b>Bitrate:</b> ' + bitsplit[2] + 'Kbps</div></td>' +
                        '</tr>';
            });
        } else {
            $.each(bitrate_arr, function (index, value) {
                var bitsplit = value.split(",");
                streams += '<tr>' +
                        '<td><div class="title">Stream:</div></td>' +
                        '<td><div class="col-sm-4 col-md-8 col-lg-12"><input type="text" class="form-control" value="' + sn + '"></div></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td></td><td><div class="col-sm-4 col-md-8 col-lg-12"><b>Output Size:</b> ' + bitsplit[0] + ' x ' + bitsplit[1] + ', <b>Bitrate:</b> ' + bitsplit[2] + 'Kbps</div></td>' +
                        '</tr>';
            });
        }

        var config_file = '';
        if (services.tricaster == '1') {
            config_file += '<tr>' +
                    '<td><div class="title">Config File (XML):</div></td>' +
                    '<td><div class="col-sm-4 col-md-8 col-lg-12"><button class="btn btn-default" type="button">Download Settings to TriCaster</button></div></td>' +
                    '</tr>';
        } else {
            config_file += '<tr>' +
                    '<td style="vertical-align:top"><div class="title">Config File (XML):</div></td>' +
                    '<td><div class="col-sm-4 col-md-8 col-lg-12"><div style="margin-bottom: 10px;">The config file below is only compatible with <b>Flash Media Live Encoder</b></div><button class="btn btn-default" type="button" onclick="smhLS.exportXML(\'' + sn + '\',\'' + bitrate + '\');">Download FMLE Config File</button></div></td>' +
                    '</tr>';
        }

        var content = '<div id="encoders-wrapper">' +
                '<h4><b>Broadcasting Settings</b></h4>' +
                '<table id="pub-table">' +
                '<tbody>' +
                '<tr>' +
                '<td style="width: 130px;"><div class="title">RTMP URL:</div></td><td><div class="col-sm-4 col-md-8 col-lg-12"><input type="text" class="form-control" value="rtmp://lvip.smhcdn.com/' + sessInfo.pid + '-live"></div></td>' +
                '</tr>' +
                streams +
                config_file +
                '<tr>' +
                '<td><div class="title">Playback URLs:</div></td>' +
                '<td><div class="col-sm-4 col-md-8 col-lg-12"><a style="font-weight: bold;" onclick="smhLS.viewUrls(\'' + name + '\',\'' + streamName + '\',\'' + bitrate + '\');">View URLs <i style="width: 100%; text-align: center; display: inline; font-size: 12px;" class="fa fa-external-link"></i></a></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td><div class="title">Player:</div></td>' +
                '<td><div class="col-sm-4 col-md-8 col-lg-12"><a style="font-weight: bold;" onclick="smhLS.wizardPreviewEmbed(\'' + id + '\',\'' + name + '\',\'' + platforms + '\');">Preview & Embed <i style="width: 100%; text-align: center; display: inline; font-size: 12px;" class="fa fa-external-link"></i></a></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '<div class="clear"></div>' +
                '<hr>' +
                '<h4><b>Encoder Support</b></h4>' +
                '<div id="encoders">' +
                '<div class="encoder-row odd">' +
                '<div class="pull-left"><img src="/img/flashmedia.png"></div>' +
                '<div class="pull-left encoder-text-wrapper"><div class="encoder-title">Flash Media Encoder</div><div class="desc">The free Adobe Flash Media Live Encoder can help you stream from just about any source.</div></div>' +
                '<div class="pull-right"><div class="button-wrapper"><button class="btn btn-default" type="button" onclick="window.open(\'https://offers.adobe.com/en/na/leap/landings/fmle3.html\')">Download</button></div></div>' +
                '</div>' +
                '<div class="encoder-row even">' +
                '<div class="pull-left"><img src="/img/wirecast.png"></div>' +
                '<div class="pull-left encoder-text-wrapper"><div class="encoder-title">Wirecast</div><div class="desc">Produce professional-looking live events with just a camera, internet connection and a computer.</div></div>' +
                '<div class="pull-right"><div class="button-wrapper"><button class="btn btn-default" type="button" onclick="window.open(\'http://www.telestream.net/wirecast/overview.htm\')">Download</button></div></div>' +
                '</div>' +
                '<div class="encoder-row odd">' +
                '<div class="pull-left"><img src="/img/tricaster.png"></div>' +
                '<div class="pull-left encoder-text-wrapper"><div class="encoder-title">TriCaster</div><div class="desc">NewTek all-in-one integrated live production system offers the power of a live network studio.</div></div>' +
                '<div class="pull-right"><div class="button-wrapper"><button class="btn btn-default" type="button" onclick="window.open(\'http://www.newtek.com/tricaster.html\')">Download</button></div></div>' +
                '</div>' +
                '<div class="encoder-row even">' +
                '<div class="pull-left"><img src="/img/datavideo.png"></div>' +
                '<div class="pull-left encoder-text-wrapper"><div class="encoder-title">Datavideo</div><div class="desc">Quickly stream live events over the internet, as well as live streaming to mobile digital devices.</div></div>' +
                '<div class="pull-right"><div class="button-wrapper"><button class="btn btn-default" type="button" onclick="window.open(\'http://www.datavideo.com/\')">Download</button></div></div>' +
                '</div>' +
                '<div class="encoder-row odd">' +
                '<div class="pull-left"><img src="/img/xsplit.png"></div>' +
                '<div class="pull-left encoder-text-wrapper"><div class="encoder-title">XSplit</div><div class="desc">A desktop application designed to make your multimedia broadcasting and recording a lot easier.</div></div>' +
                '<div class="pull-right"><div class="button-wrapper"><button class="btn btn-default" type="button" onclick="window.open(\'https://www.xsplit.com/download\')">Download</button></div></div>' +
                '</div>' +
                '<div class="encoder-row even">' +
                '<div class="pull-left"><img src="/img/vidblaster.png"></div>' +
                '<div class="pull-left encoder-text-wrapper"><div class="encoder-title">VidBlaster</div><div class="desc">An advanced audio/video-encoding and live-broadcasting application.</div></div>' +
                '<div class="pull-right"><div class="button-wrapper"><button class="btn btn-default" type="button" onclick="window.open(\'http://vidblaster.com/downloads/downloads.html\')">Download</button></div></div>' +
                '</div>' +
                '<div class="encoder-row odd">' +
                '<div class="pull-left"><img src="/img/teradek.png"></div>' +
                '<div class="pull-left encoder-text-wrapper"><div class="encoder-title">Teradek Cube</div><div class="desc">A compact H.264 encoder / decoder designed to stream live HD video directly to the Web.</div></div>' +
                '<div class="pull-right"><div class="button-wrapper"><button class="btn btn-default" type="button" onclick="window.open(\'http://teradek.com/pages/cube\')">Download</button></div></div>' +
                '</div>' +
                '<div class="encoder-row even">' +
                '<div class="pull-left"><img src="/img/ios.png"></div>' +
                '<div class="pull-left encoder-text-wrapper"><div class="encoder-title">IOS Live Broadcaster</div><div class="desc">Broadcast and stream live video from your IOS mobile device directly to your own website.</div></div>' +
                '<div class="pull-right"><div class="button-wrapper"><button class="btn btn-default" type="button" onclick="window.open(\'https://itunes.apple.com/is/app/smh-mobile-live-encoder/id613617453?mt=8\')">Download</button></div></div>' +
                '</div>' +
                '<div class="encoder-row odd">' +
                '<div class="pull-left"><img src="/img/android.png"></div>' +
                '<div class="pull-left encoder-text-wrapper"><div class="encoder-title">Android Live Broadcaster</div><div class="desc">Broadcast and stream live video from your Android mobile device directly to your own website.</div></div>' +
                '<div class="pull-right"><div class="button-wrapper"><button class="btn btn-default" type="button" onclick="window.open(\'https://play.google.com/store/apps/details?id=air.com.smh.liveencoder\')">Download</button></div></div>' +
                '</div>' +
                '</div>' +
                '</div>';
        $('#wizard-finish-wrapper').html(content);
        $('#encoders-wrapper #encoders').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
    },
    //Edit Live Stream Metadata Modal
    editMetadata: function (id, name, desc, tags, refid, cats, ac) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '680px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        var cat_disable = ($.inArray("CONTENT_MANAGE_ASSIGN_CATEGORIES", sessPerm) != -1) ? '' : 'disabled';
        var refid_disable = ($.inArray("CONTENT_INGEST_REFERENCE_MODIFY", sessPerm) != -1) ? '' : 'disabled';
        var metadata_disable = ($.inArray("CONTENT_MANAGE_METADATA", sessPerm) != -1) ? '' : 'disabled';
        var cat_select = ($.inArray("CONTENT_MANAGE_ASSIGN_CATEGORIES", sessPerm) != -1) ? 'onclick="smhLS.selectCat();"' : '';

        name = name.replace(/"/g, '&quot;');
        desc = desc.replace(/"/g, '&quot;');

        header = '<button type="button" class="close smh-close edit-ls-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Metadata</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<form id="edit-ls-form">' +
                '<div class="row">' +
                '<div class="col-sm-8 center-block">' +
                '<table width="100%" border="0" id="ls-edit-table">' +
                '<tr>' +
                '<td style="width: 151px;"><span class="required" style="font-weight: normal;">Name:</span></td><td><input type="text" name="ls_name" id="ls_name" class="form-control" value="' + name + '" placeholder="Enter a name"></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Description:</span></td><td><input type="text" name="ls_desc" id="ls_desc" class="form-control" placeholder="Enter a description" value="' + desc + '" ' + metadata_disable + '></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Tags:</span></td><td><input type="text" name="ls_tags" id="ls_tags" class="form-control" placeholder="Enter tags separated by commas" value="' + tags + '" ' + metadata_disable + '></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Reference ID:</span></td><td><input type="text" name="ls_ref" id="ls_ref" class="form-control" placeholder="Enter a reference ID" value="' + refid + '" ' + refid_disable + '></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Categories: <i class="fa fa-external-link" ' + cat_select + '></i></span></td><td><input type="text" name="ls_cat" id="ls_cat" class="form-control" placeholder="Enter categories separated by commas" value="' + cats + '" ' + cat_disable + '></td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '</form>';

        $('#smh-modal .modal-body').html(content);

        $('#ac-select').val(ac);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default edit-ls-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="edit-ls" onclick="smhLS.updateMetadata(\'' + id + '\')">Update</button>';
        $('#smh-modal .modal-footer').html(footer);

        $('#edit-ls-form input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
        validator = $("#edit-ls-form").validate({
            highlight: function (element, errorClass) {
                $(element).removeClass("valid").removeClass("error").addClass("validate-error");
            },
            unhighlight: function (element, errorClass) {
                $(element).removeClass("valid").removeClass("validate-error");
            },
            errorPlacement: function (error, element) {
                $(element).tooltipster('update', $(error).text());
                $(element).tooltipster('show');
            },
            success: function (label, element) {
                $(element).tooltipster('hide');
            },
            rules: {
                ls_name: "required"
            },
            messages: {
                ls_name: "Please enter a name"
            }
        });
    },
    displayUpdatedMetadataResponse: function () {
        var purgeResponse = smhLS.purgeCache('metadata');
        if (purgeResponse) {
            $('#smh-modal #loading img').css('display', 'none');
            $('#smh-modal #pass-result').html('<span class="label label-success">Metadata Successfully Updated!</span>');
        } else {
            $('#smh-modal #loading img').css('display', 'none');
            $('#smh-modal #pass-result').html('<span class="label label-danger">Error: Could not purge cache</span>');
        }
        setTimeout(function () {
            $('#smh-modal #pass-result').empty();
            $('#edit-ls').removeAttr('disabled');
        }, 3000);
        smhLS.getLiveStreams();
    },
    doUpdateSnMetaData: function (eid, name, desc) {
        var sessData = {
            action: 'update_live_sn_metadata',
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            name: name,
            desc: desc,
            eid: eid
        }

        $.ajax({
            cache: false,
            url: SnApiUrl,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            success: function (data) {
                if (data['success']) {
                    smhLS.displayUpdatedMetadataResponse();
                } else {
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-danger">' + data['message'] + '</span>');
                }
            }
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
    //Do metadata update
    updateMetadata: function (id) {
        var valid = validator.form();
        if (valid) {
            var cb = function (success, results) {
                if (!success)
                    alert(results);

                if (results.code && results.message) {
                    alert(results.message);
                    return;
                }

                if (services.sn == '1') {
                    if (yt_ready) {
                        smhLS.doUpdateSnMetaData(results.id, results.name, results.description);
                    } else {
                        smhLS.displayUpdatedMetadataResponse();
                    }
                } else {
                    smhLS.displayUpdatedMetadataResponse();
                }
            };

            $('#smh-modal #loading img').css('display', 'inline-block');
            $('#edit-ls').attr('disabled', '');
            var name = $('#smh-modal #ls_name').val();
            var desc = $('#smh-modal #ls_desc').val();
            var tags = $('#smh-modal #ls_tags').val();
            var ref = $('#smh-modal #ls_ref').val();
            var cat = $('#smh-modal #ls_cat').val();

            var liveStreamEntry = new KalturaLiveStreamAdminEntry();
            if (!(typeof ref === "undefined") && !(ref === null) && ref.length > 0) {
                liveStreamEntry.referenceId = ref;
            }

            liveStreamEntry.name = name;
            liveStreamEntry.description = desc;
            liveStreamEntry.tags = tags;
            liveStreamEntry.categories = cat;
            client.liveStream.update(cb, id, liveStreamEntry);
        }
    },
    //Edit Access Control Modal
    editAC: function (id, ac) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '440px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        var access_select = '';
        var ac_disable = ($.inArray("CONTENT_MANAGE_ACCESS_CONTROL", sessPerm) != -1) ? '' : 'disabled';

        $.each(ac_select, function (index, value) {
            access_select += '<option value="' + index + '">' + value + '</option>';
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Access Control</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div style="padding-top: 25px; padding-bottom: 25px; text-align: center;">' +
                'Assign an Access Control Profile to this entry.' +
                '<div class="row">' +
                '<div class="col-sm-12 center-block">' +
                '<table width="100%" border="0" id="ac-bulk-table">' +
                '<tr>' +
                '<td style="width: 155px;"><span style="font-weight: normal;">Access Control Profile:</span></td><td><select class="form-control" id="ac-select" ' + ac_disable + '>' + access_select + '</select></td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '</div>';
        $('#smh-modal .modal-body').html(content);

        $('#ac-select').val(ac);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="edit-ac" onclick="smhLS.updateAC(\'' + id + '\')">Update</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Do update access control
    updateAC: function (id) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }

            var purgeResponse = smhLS.purgeCache('ac');
            if (purgeResponse) {
                $('#smh-modal #loading img').css('display', 'none');
                $('#smh-modal #pass-result').html('<span class="label label-success">Access Control Successfully Updated!</span>');
            } else {
                $('#smh-modal #loading img').css('display', 'none');
                $('#smh-modal #pass-result').html('<span class="label label-danger">Error: Could not purge cache</span>');
            }
            setTimeout(function () {
                $('#smh-modal #pass-result').empty();
                $('#edit-ac').removeAttr('disabled');
            }, 3000);
            smhLS.getLiveStreams();
        };

        $('#smh-modal #loading img').css('display', 'inline-block');
        $('#edit-ac').attr('disabled', '');
        var ac = $('#smh-modal #ac-select').val();

        var liveStreamEntry = new KalturaLiveStreamAdminEntry();
        liveStreamEntry.accessControlId = ac;
        client.liveStream.update(cb, id, liveStreamEntry);
    },
    //Edit Thumbnail Modal
    editThumbnail: function (id) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '800px');
        $('#smh-modal .modal-body').css('height', '615px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Thumbnail</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<iframe style="width:0px;height:0px;border:0px;position: absolute;" name=hiddenIFrame />' +
                '<form id="thumbUp" enctype="multipart/form-data" target="hiddenIFrame" method="post" action="/api_v3/index.php?service=thumbAsset&action=addfromimage">' +
                '<input type="hidden" name="ks" value="' + sessInfo.ks + '">' +
                '<input type="hidden" name="entryId" value="' + id + '">' +
                '<input class="upload" type="file" name="fileData">' +
                '</form>' +
                '<div class="dropdown thumb-dropdown">' +
                '<div class="btn-group">' +
                '<button class="btn btn-default" type="button"><span class="text">Add Thumbnail</span></button>' +
                '<button aria-expanded="true" data-toggle="dropdown" id="dropdownMenu1" type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button>' +
                '<ul aria-labelledby="dropdownMenu1" role="menu" class="dropdown-menu">' +
                '<li role="presentation"><a onclick="smhLS.uploadThumb(\'' + id + '\')" href="#" tabindex="-1" role="menuitem">Upload</span></a></li>' +
                '</ul>' +
                '</div>' +
                '</div>' +
                '<span id="status" style="float: left; margin-top: 4px; margin-left: 18px;"><div id="loading"><img height="20px" src="/img/loading.gif"></div></span><div id="thumb-table" style="padding-top: 39px;"></div>';

        $('#smh-modal .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
        smhLS.loadThumbs(id);
    },
    //Load Thumbnails table
    loadThumbs: function (id) {
        var thumb_results = new Array();

        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }

            $('#thumb-data_processing').css('display', 'none');
            var myData = results['objects'];
            var i = 0;
            $.each(myData, function (key, value) {
                var dimensions = value['width'] + ' X ' + value['height'];
                var size = Math.floor(value['size'] / 1024);
                var actions, image, default_thumb;

                if (value['tags'] == "default_thumb") {
                    image = "<div style='height: 100px;'><span class='helper'></span><img src='/api_v3/service/thumbAsset/action/serve/ks/" + sessInfo.ks + "/thumbAssetId/" + value['id'] + "' style='width: 130px; max-height: 100px; vertical-align: middle;' /></div>";
                    default_thumb = '<i style="color: #676a6c; width: 100%; text-align: center;" class="fa fa-check-square-o"></i>';
                    actions = '<span class="dropdown header">' +
                            '<div class="btn-group">' +
                            '<button class="btn btn-default" type="button"><span class="text">Select Action</span></button>' +
                            '<button aria-expanded="false" data-toggle="dropdown" id="dropdownMenu" type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button>' +
                            '<ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu">' +
                            '<li role="presentation"><a href="http://mediaplatform.streamingmediahosting.com/api_v3/service/thumbAsset/action/serve/thumbAssetId/' + value['id'] + '/options:download/true" tabindex="-1" role="menuitem">Download</a></li>' +
                            '</ul>' +
                            '</div>' +
                            '</span>';
                } else {
                    image = "<div style='height: 100px;'><span class='helper'></span><img src='/api_v3/service/thumbAsset/action/serve/ks/" + sessInfo.ks + "/thumbAssetId/" + value['id'] + "' style='width: 130px; max-height: 100px; vertical-align: middle;' /></div>";
                    default_thumb = '';
                    actions = '<span class="dropdown header">' +
                            '<div class="btn-group">' +
                            '<button class="btn btn-default" type="button"><span class="text">Select Action</span></button>' +
                            '<button aria-expanded="false" data-toggle="dropdown" id="dropdownMenu" type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button>' +
                            '<ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu">' +
                            '<li role="presentation"><a onclick="smhLS.setThumbdefault(\'' + value['id'] + '\',\'' + id + '\')" tabindex="-1" role="menuitem">Set as Default</a></li>' +
                            '<li role="presentation"><a href="http://mediaplatform.streamingmediahosting.com/api_v3/service/thumbAsset/action/serve/thumbAssetId/' + value['id'] + '/options:download/true" tabindex="-1" role="menuitem">Download</a></li>' +
                            '<li role="presentation"><a onclick="smhLS.deleteThumbModal(\'' + value['id'] + '\',\'' + id + '\')" tabindex="-1" role="menuitem">Delete</a></li>' +
                            '</ul>' +
                            '</div>' +
                            '</span>';
                }
                thumb_results[i] = new Array(image, dimensions, size, default_thumb, actions);
                i++;
            });

            $('#thumb-table').empty();
            $('#thumb-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="thumb-data"></table>');
            $('#thumb-data').DataTable({
                "dom": 'R<"H"lfr>t<"F"ip>',
                "order": [],
                "ordering": false,
                "jQueryUI": false,
                "autoWidth": false,
                "pagingType": "bootstrap",
                "pageLength": 10,
                "searching": false,
                "processing": true,
                "info": false,
                "lengthChange": false,
                "data": thumb_results,
                "language": {
                    "zeroRecords": "No Thumbnails Found"
                },
                "columns": [
                    {
                        "title": "<span style='float: left;'><div class='data-break'>Thumbnail</div></span>"
                    },
                    {
                        "title": "<span style='float: left;'><div class='data-break'>Dimensions</div></span>"
                    },
                    {
                        "title": "<span style='float: left;'><div class='data-break'>Size (KB)</div></span>"
                    },
                    {
                        "title": "<span style='float: left;'><div class='data-break'>Default</div></span>"
                    },
                    {
                        "title": "<span style='float: left;'><div class='data-break'>Actions</div></span>",
                        "width": "170px"
                    },
                ],
                "drawCallback": function (oSettings) {
                    smhMain.fcmcAddRows(this, 5, 4);
                }
            });
        }

        $('#thumb-data_processing').css('display', 'inline');
        var filter = new KalturaThumbAssetFilter();
        filter.orderBy = "tags";
        filter.entryIdEqual = id;
        filter.statusEqual = KalturaThumbAssetStatus.READY;
        var pager;
        client.thumbAsset.listAction(cb, filter, pager);
    },
    displayThumbResults: function (entry_id) {
        smhLS.purgeCache('thumbnail');
        $('#thumb-data_processing').css('display', 'none');
        smhLS.loadThumbs(entry_id);
        smhLS.getLiveStreams();
    },
    doUpdateSnThumbnail: function (eid) {
        var sessData = {
            action: 'update_sn_thumbnail',
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            eid: eid
        }

        $.ajax({
            cache: false,
            url: SnApiUrl,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            success: function (data) {
                if (data['success']) {
                    smhLS.displayThumbResults(eid);
                }
            }
        });
    },
    //Set thumbnail as default
    setThumbdefault: function (thumb_id, entry_id) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results == null) {
                if (services.sn == '1') {
                    if (yt_ready) {
                        smhLS.doUpdateSnThumbnail(entry_id);
                    } else {
                        smhLS.displayThumbResults(entry_id);
                    }
                } else {
                    smhLS.displayThumbResults(entry_id);
                }

            } else if (results.code && results.message) {
                alert(results.message);
                return;
            }
        };

        $('#thumb-data_processing').css('display', 'inline');
        client.thumbAsset.setAsDefault(cb, thumb_id);
    },
    //Delete Thumbnail modal
    deleteThumbModal: function (thumb_id, entry_id) {
        smhLS.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '415px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });
        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '2');

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Delete Thumbnail</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = '<div style="font-size:13px !important; text-align: center;">Are you sure you want to delete the selected thumbnail?</div>';
        $('#smh-modal2 .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="edit-ac" onclick="smhLS.deleteThumb(\'' + thumb_id + '\',\'' + entry_id + '\')">Delete</button>';
        $('#smh-modal2 .modal-footer').html(footer);
    },
    //Do Delete Thumbnail
    deleteThumb: function (thumb_id, entry_id) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results == null) {
                $('#smh-modal2 #loading img').css('display', 'none');
                $('#smh-modal2 .smh-close2').click();
                smhLS.loadThumbs(entry_id);
            } else if (results.code && results.message) {
                alert(results.message);
                return;
            }
        };

        $('#smh-modal2 #loading img').css('display', 'inline-block');
        client.thumbAsset.deleteAction(cb, thumb_id);
    },
    //Upload thumbnail
    uploadThumb: function (vid) {
        entryId = vid;
        $('#thumbUp input').click();
    },
    //Edit Stream Configuration Modal
    editStreamConfig: function (id, sname, key, offline, record, record_duration, record_size, bitrates, platforms_status) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '680px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        var sn_row = '';
        if (services.sn == 1) {
            var platforms_status_data = {};
            if (platforms_status === '') {
                platforms_status_data = {
                    "smh": 1,
                    "youtube": 0,
                    "facebook": 0,
                    "twitch": 0
                }
            } else {
                var platforms_arr = platforms_status.split(';');
                $.each(platforms_arr, function (index, value) {
                    var temp = value.split(':');
                    if (temp[0] === 'smh') {
                        if (temp[1] == '1') {
                            platforms_status_data['smh'] = 1;
                        } else {
                            platforms_status_data['smh'] = 0;
                        }
                    }
                    if (temp[0] == 'youtube') {
                        if (yt_ready) {
                            if (temp[1] == '1') {
                                platforms_status_data['youtube'] = 1;
                            } else {
                                platforms_status_data['youtube'] = 0;
                            }
                        } else {
                            platforms_status_data['youtube'] = 0;
                        }
                    }
                    if (temp[0] == 'facebook') {
                        if (fb_ready) {
                            if (temp[1] == '1') {
                                platforms_status_data['facebook'] = 1;
                            } else {
                                platforms_status_data['facebook'] = 0;
                            }
                        } else {
                            platforms_status_data['facebook'] = 0;
                        }
                    }
                    if (temp[0] == 'twitch') {
                        if (twch_ready) {
                            if (temp[1] == '1') {
                                platforms_status_data['twitch'] = 1;
                            } else {
                                platforms_status_data['twitch'] = 0;
                            }
                        } else {
                            platforms_status_data['twitch'] = 0;
                        }
                    }
                });
            }

            if (yt_ready || fb_ready || twch_ready) {
                sn_row += '<tr class="sn-data">' +
                        '<td style="width: 170px;"><span style="font-weight: normal;">Social Media:</span></td>' +
                        '<td>' +
                        '<a style="font-weight: bold;" id="platform-config-link" onclick="smhLS.editPlatformConfig();">Configure Platforms <i style="width: 100%; text-align: center; display: inline; font-size: 12px;" class="fa fa-external-link"></i></a>' +
                        '</td>' +
                        '</tr>';
            }
        }

        var record_check = (record == 'true') ? 'checked' : '';
        num = 1;

        var bitrates_arr = bitrates.split(';');
        var bitrate_rows = [];
        $.each(bitrates_arr, function (index, value) {
            var temp = value.split(',');
            bitrate_rows.push([temp[0], temp[1], temp[2]]);
        });

        var bitrate_tr = '';
        var res_val = '';
        $.each(bitrate_rows, function (index, value) {
            if ((value[1] >= 0) && (value[1] <= 240)) {
                res_val = '426x240 (240p)';
            } else if ((value[1] >= 241) && (value[1] <= 360)) {
                res_val = '640x360 (360p)';
            } else if ((value[1] >= 361) && (value[1] <= 480)) {
                res_val = '854x480 (480p)';
            } else if ((value[1] >= 381) && (value[1] <= 720)) {
                res_val = '1280x720 (720p)';
            } else if ((value[1] >= 721) && (value[1] <= 1080)) {
                res_val = '1920x1080 (1080p)';
            } else if ((value[1] >= 1081) && (value[1] <= 1440)) {
                res_val = '2560x1440 (1440p)';
            } else if (value[1] >= 1441) {
                res_val = '3840x2160 (2160p)';
            }
            if (index == 0) {
                bitrate_tr += '<tr class="bitrate-row"><td><input type="text" class="bitrate" name="bitrate" style="width:70px !important;" class="form-control" value="' + value[2] + '" /></td>' +
                        '<td>' +
                        '<div class="dropdown">' +
                        '<div class="input-group">' +
                        '<div class="input-group-btn">' +
                        '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span id="res-val0" class="resolution">' + res_val + '</span> <span class="caret"></span>' +
                        '</button>' +
                        '<ul id="res-list0" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                        '<li><a href="#">426x240 (240p)</a></li>' +
                        '<li><a href="#">640x360 (360p)</a></li>' +
                        '<li><a href="#">854x480 (480p)</a></li>' +
                        '<li><a href="#">1280x720 (720p)</a></li>' +
                        '<li><a href="#">1920x1080 (1080p)</a></li>' +
                        '<li><a href="#">2560x1440 (1440p)</a></li>' +
                        '<li><a href="#">3840x2160 (2160p)</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</td>' +
                        '<td></td>' +
                        '</tr>';
            } else {
                bitrate_tr += '<tr class="bitrate-row" id="stream-num' + num + '"><td><input type="text" class="bitrate" name="bitrate" style="width:70px !important;" class="form-control" value="' + value[2] + '" /></td>' +
                        '<td>' +
                        '<div class="dropdown">' +
                        '<div class="input-group">' +
                        '<div class="input-group-btn">' +
                        '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span id="res-val' + num + '" class="resolution">' + res_val + '</span> <span class="caret"></span>' +
                        '</button>' +
                        '<ul id="res-list' + num + '" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                        '<li><a href="#" onclick="smhLS.resClicked(this,' + num + ')">426x240 (240p)</a></li>' +
                        '<li><a href="#" onclick="smhLS.resClicked(this,' + num + ')">640x360 (360p)</a></li>' +
                        '<li><a href="#" onclick="smhLS.resClicked(this,' + num + ')">854x480 (480p)</a></li>' +
                        '<li><a href="#" onclick="smhLS.resClicked(this,' + num + ')">1280x720 (720p)</a></li>' +
                        '<li><a href="#" onclick="smhLS.resClicked(this,' + num + ')">1920x1080 (1080p)</a></li>' +
                        '<li><a href="#" onclick="smhLS.resClicked(this,' + num + ')">2560x1440 (1440p)</a></li>' +
                        '<li><a href="#" onclick="smhLS.resClicked(this,' + num + ')">3840x2160 (2160p)</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</td>' +
                        '<td><div class="remove-bitrate-icon"><i class="fa fa-remove" onclick="smhLS.removeBitrate(\'stream-num' + num + '\')"></i></div></td>' +
                        '</tr>';
                num++;
            }
        });

        offline = offline.replace(/"/g, '&quot;');

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Configuration</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div class="row">' +
                '<div class="col-sm-9 center-block">' +
                '<table width="100%" border="0" id="ls-add-table">' +
                '<tr>' +
                '<td style="width: 160px;"><span style="font-weight: normal;">Stream Name:</span></td><td><input type="text" name="ls_sname" id="ls_sname" class="form-control" value="' + sname + '" placeholder="Enter a stream name (no spaces)"></td>' +
                '</tr>' +
                '<tr>' +
                '<td style="width: 160px;"><span style="font-weight: normal;">Offline Message:</span></td><td><input type="text" name="ls_offline" id="ls_offline" class="form-control" value="' + offline + '" placeholder="Enter a offline message"></td>' +
                '</tr>' +
                '<tr>' +
                '<td style="width: 160px;"><span style="font-weight: normal;">Server-side Recording:</span></td><td><input data-toggle="toggle" id="server-recording" type="checkbox" ' + record_check + '></td>' +
                '</tr>' +
                '<tr class="recording-options">' +
                '<td style="width: 160px;"><span style="font-weight: normal;">Recording Options:</span></td><td><select id="rec-opt" class="form-control" disabled><option value="comp_stream">Complete Stream</option><option value="rec_min">By Duration</option><option value="rec_size">By Size</option></select></td>' +
                '</tr>' +
                '<tr class="recording-options">' +
                '<td style="width: 160px;"><span style="font-weight: normal;">Segment Duration:</span></td><td><div style="float: left;"><input type="text" id="duration" name="duration" style="width:90px !important;" class="form-control" value="' + record_duration + '" disabled /></div><div style="float: left; margin-left: 10px; margin-top: 5px;">Mintutes</div></td>' +
                '</tr>' +
                '<tr class="recording-options">' +
                '<td style="width: 160px;"><span style="font-weight: normal;">Segment Size:</span></td><td><div style="float: left;"><input type="text" id="size" name="size" style="width:90px !important;" class="form-control" value="' + record_size + '" disabled /></div><div style="float: left; margin-left: 10px; margin-top: 5px;">MB</div></td>' +
                '</tr>' +
                sn_row +
                '<tr>' +
                '<td colspan="2"><span style="font-weight: normal;">Bitrate Configuration:</span></td>' +
                '</tr>' +
                '<tr>' +
                '<td style="text-align: center;" colspan="2">' +
                '<div id="bitrate-wrapper">' +
                '<table id="bitrate-table">' +
                '<thead><tr><th><span style="font-weight: bold;">Bitrate <span style="font-weight: normal;">(Kbps)</span></span></th><th><span style="font-weight: bold;">Resolution</span></th><th><span style="font-weight: bold;">Remove</span></th></tr></thead>' +
                bitrate_tr +
                '</table>' +
                '<div id="add-bitrate"><i class="fa fa-plus"></i> Add Bitrate</div>' +
                '</div>' +
                '</td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '</div>';

        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="edit-ls-config" onclick="smhLS.updateLSConfig(\'' + id + '\',\'' + key + '\')">Update</button>';
        $('#smh-modal .modal-footer').html(footer);

        if (services.sn == 1) {
            if (yt_ready || fb_ready || twch_ready) {
                $('#smh-modal .sn-data').data({
                    "data": platforms_status_data
                });
            }
        }

        if (record == 'true') {
            $('#rec-opt').removeAttr('disabled');
            $('.recording-options').css('display', 'table-row');
        } else {
            $('#rec-opt').attr('disabled', '');
            $('#duration').attr('disabled', '');
            $('#size').attr('disabled', '');
            $('.recording-options').css('display', 'none');
        }

        if (record_duration == '' && record_size == '') {
            $('#rec-opt').val('comp_stream');
        } else if (record_duration != '' && record_size == '') {
            $('#rec-opt').val('rec_min');
            $('#duration').removeAttr('disabled');
        } else if (record_duration == '' && record_size != '') {
            $('#rec-opt').val('rec_size');
            $('#size').removeAttr('disabled');
        }

        $('#server-recording').bootstrapToggle();
        $("#bitrate-table input[name='bitrate']").TouchSpin({
            min: 0,
            max: 100000,
            step: 1,
            verticalbuttons: true
        });

        $('#server-recording').change(function () {
            if ($(this).prop('checked')) {
                $('#rec-opt').removeAttr('disabled');
                $('.recording-options').css('display', 'table-row');
            } else {
                $('#rec-opt').attr('disabled', '');
                $('#duration').attr('disabled', '');
                $('#size').attr('disabled', '');
                $('.recording-options').css('display', 'none');
            }
        });

        $('#smh-modal').on('change', '#rec-opt', function (event) {
            if ($('#rec-opt').val() == 'comp_stream') {
                $('#duration').attr('disabled', '');
                $('#size').attr('disabled', '');
            } else if ($('#rec-opt').val() == 'rec_min') {
                $('#duration').removeAttr('disabled');
                $('#size').attr('disabled', '');
            } else if ($('#rec-opt').val() == 'rec_size') {
                $('#size').removeAttr('disabled');
                $('#duration').attr('disabled', '');
            }
        });

        $("input[name='duration']").TouchSpin({
            initval: 0,
            min: 0,
            max: 100000,
            step: 1,
            verticalbuttons: true
        });

        $("input[name='size']").TouchSpin({
            initval: 0,
            min: 0,
            max: 1000000,
            step: 1,
            verticalbuttons: true
        });
    },
    editPlatformConfig: function () {
        smhLS.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '500px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '2');

        header = '<button type="button" class="close smh-close2" data-dismiss="modal" onclick="smhLS.updatePlatformConfig();"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Social Media</h4>';
        $('#smh-modal2 .modal-header').html(header);

        var yt_row = '';
        var fb_row = '';
        var twch_row = '';
        var smh_checked = '';
        var youtube_checked = '';
        var facebook_checked = '';
        var twitch_checked = '';
        var data = $('#smh-modal .sn-data').data("data");

        smh_checked = (data.smh) ? 'checked' : '';
        if (yt_ready) {
            youtube_checked = (data.youtube) ? 'checked' : '';
            yt_row += '<div class="sn-choice-wrapper"><div style="margin-left: 10px; float: left; position: relative; top: -5px;"><img src="/img/youtube_live_logo.png" width="110px"></div><div style="float: right; position: relative; top: 1px;"><input name="sn_option" value="youtube" id="youtube" type="checkbox" data-style="ios" data-on=" " data-off=" " data-size="mini" data-onstyle="olive" data-width="40" ' + youtube_checked + '></div><div class="clear"></div></div>';
        }
        if (fb_ready) {
            facebook_checked = (data.facebook) ? 'checked' : '';
            fb_row += '<div id="fb-notice">* Facebook can only be simultaneously streamed with Streaming Media Hosting</div>' +
                    '<div class="sn-choice-wrapper"><div style="margin-left: 10px; float: left; position: relative; top: -5px;"><img src="/img/facebook_live_logo.png" width="85px"></div><div style="float: right; position: relative; top: 1px;"><input name="sn_option" value="facebook" id="facebook" type="checkbox" data-style="ios" data-on=" " data-off=" " data-size="mini" data-onstyle="olive" data-width="40" ' + facebook_checked + '></div><div class="clear"></div></div>';
            if (yt_ready) {
                fb_row += '<div class="platform-separator-wrapper">' +
                        '<span id="text">OR</span></div>';
            }
        }
        if (twch_ready) {
            twitch_checked = (data.twitch) ? 'checked' : '';
            twch_row += '<div class="sn-choice-wrapper"><div style="margin-left: 10px; float: left; position: relative; top: -6px;"><img src="/img/twitch_logo.png" width="80px"></div><div style="float: right; position: relative; top: 1px;"><input name="sn_option" value="twitch" id="twitch" type="checkbox" data-style="ios" data-on=" " data-off=" " data-size="mini" data-onstyle="olive" data-width="40" ' + twitch_checked + '></div><div class="clear"></div></div>';
        }

        content = '<div style="color: #797979; text-align: center;">Enable the platforms you would like this stream to broadcast on.<div style="font-size: 12px; color: #999999">*At least one platform must be enabled.</div></div>' +
                '<div id="platform-configs">' +
                '<div id="platform-configs-wrapper">' +
                '<div class="platform-title">Default Platform</div>' +
                '<div class="sn-choice-wrapper"><div style="margin-left: 10px; float: left; position: relative; top: 2px;"><img src="/img/smh_logo.png" width="120px"></div><div style="float: right; position: relative; top: 1px;"><input name="sn_option" value="smh" id="smh" type="checkbox" data-style="ios" data-on=" " data-off=" " data-size="mini" data-onstyle="olive" data-width="40" ' + smh_checked + '></div><div class="clear"></div></div>' +
                '<div class="platform-title" style="margin-top: 20px;">Social Media Platforms</div>' +
                fb_row +
                '<div class="platform-config-wrapper">' +
                yt_row +
                twch_row +
                '</div>' +
                '</div>' +
                '</div>';
        $('#smh-modal2 .modal-body').html(content);

        if (!fb_ready) {
            $('#platform-configs #platform-configs-wrapper').css('height', '387px');
            $('.platform-config-wrapper').css('height', '235px');
        }

        $('#platform-configs .platform-config-wrapper').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true,
            },
            scrollbarPosition: "outside"
        });

        $('#smh').bootstrapToggle();
        $('#youtube').bootstrapToggle();
        $('#facebook').bootstrapToggle();
        $('#twitch').bootstrapToggle();

        footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal" onclick="smhLS.updatePlatformConfig();">Close</button>';
        $('#smh-modal2 .modal-footer').html(footer);
    },
    updatePlatformConfig: function () {
        var smh_status = 1;
        var youtube_status = 0;
        var facebook_status = 0;
        var twitch_status = 0;
        smh_status = ($('#smh-modal2 #smh').prop('checked')) ? 1 : 0;
        if (yt_ready) {
            youtube_status = ($('#smh-modal2 #youtube').prop('checked')) ? 1 : 0;
        }
        if (fb_ready) {
            facebook_status = ($('#smh-modal2 #facebook').prop('checked')) ? 1 : 0;
        }
        if (twch_ready) {
            twitch_status = ($('#smh-modal2 #twitch').prop('checked')) ? 1 : 0;
        }
        var platforms_status_data = {
            "smh": smh_status,
            "youtube": youtube_status,
            "facebook": facebook_status,
            "twitch": twitch_status
        }
        $('#smh-modal .sn-data').data({
            "data": platforms_status_data
        });
    },
    displayUpdatedLSConfig: function () {
        $('#smh-modal #loading img').css('display', 'none');
        $('#smh-modal #pass-result').html('<span class="label label-success">Configuration Successfully Updated!</span>');
        setTimeout(function () {
            $('#smh-modal #pass-result').empty();
            $('#edit-ls-config').removeAttr('disabled');
        }, 3000);
        smhLS.getLiveStreams();
    },
    doUpdateSnLiveStreams: function (name, desc, eid, platforms, sn_status) {
        var sessData = {
            action: 'update_sn_livestreams',
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            name: name,
            desc: desc,
            eid: eid,
            platforms: platforms,
            projection: 'rectangular'
        }

        $.ajax({
            cache: false,
            url: SnApiUrl,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                if (sn_status) {
                    $('#smh-modal #pass-result').html('<span class="label label-primary" style="margin-right: 10px;">Configuring social platform live streams...</span>');
                }
            },
            success: function (data) {
                if (data['success']) {
                    if (data['youtube_embed_status']) {
                        yt_embed = true;
                    } else {
                        yt_embed = false;
                    }
                    smhLS.displayUpdatedLSConfig();
                    $.each(data['platforms_responses'], function (key, value) {
                        if (value['platform'] === 'youtube') {
                            if (!value['success']) {
                                if (value['message'] === 'YouTube: you may have reached your daily broadcasting limit') {
                                    smhLS.yt_blocked();
                                }
                            }
                        }
                    });
                } else {
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-danger">' + data['message'] + '</span>');
                }
            }
        });
    },
    yt_blocked: function () {
        smhLS.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '415px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '2');

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">YouTube Error</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = '<div style="text-align: center; font-size: 13px ! important; margin-top: 10px; margin-bottom: 10px;">A live stream could not be created in your YouTube account.<br> You may have reached YouTube\'s daily broadcasting limit.<br> Please try again later.</div>';
        $('#smh-modal2 .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button>';
        $('#smh-modal2 .modal-footer').html(footer);
    },
    //Do livestream configuration update
    updateLSConfig: function (id, smh_key) {
        var snConfig = 0;
        var sn_status = false;
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }

            if (services.sn == '1') {
                if (yt_ready || fb_ready || twch_ready) {
                    smhLS.doUpdateSnLiveStreams(results.name, results.description, results.id, snConfig, sn_status);
                } else {
                    smhLS.displayUpdatedLSConfig();
                }
            } else {
                smhLS.displayUpdatedLSConfig();
            }
        };

        $('#smh-modal #loading img').css('display', 'inline-block');
        $('#edit-ls-config').attr('disabled', '');
        var sname = $('#smh-modal #ls_sname').val();
        var offline = $('#smh-modal #ls_offline').val();
        var sn = '';
        var sn_final = '';
        var stream_rec = $('#server-recording').is(':checked') ? true : false;
        var stream_option = '';
        var stream_partnerData = '';
        var stream_rec_json = '';
        if (!(typeof sname === "undefined") && !(sname === null) && sname.length > 0) {
            sn = sname.replace(/\s/g, '_');
        } else {
            sn = id;
        }
        sn_final += sn + '?key=' + smh_key;
        if (stream_rec) {
            sn_final += '&record=true';
            if ($('#smh-modal #rec-opt').val() == 'comp_stream') {
                stream_option = '';
            } else if ($('#smh-modal #rec-opt').val() == 'rec_min') {
                if ($('#smh-modal #duration').val() != null || $('#smh-modal #duration').val() != '') {
                    sn_final += '&ByDuration=' + $('#smh-modal #duration').val();
                    stream_option = ' "byDuration":' + $('#smh-modal #duration').val() + ',';
                }
            } else if ($('#smh-modal #rec-opt').val() == 'rec_size') {
                if ($('#smh-modal #size').val() != null || $('#smh-modal #size').val() != '') {
                    sn_final += '&ByFileSize=' + $('#smh-modal #size').val();
                    stream_option = ' "byFileSize":' + $('#smh-modal #size').val() + ',';
                }
            }
            sn_final += '&format=mp4';
            stream_rec_json += '"record":[{"enable":"true",' + stream_option + ' "format":"mp4"}]';
        } else {
            stream_rec_json += '"record":[{"enable":"false"}]';
        }

        stream_partnerData += stream_rec_json;

        var liveStreamEntry = new KalturaLiveStreamAdminEntry();
        var bit_arr = new Array();
        var res_arr = new Array();
        liveStreamEntry.bitrates = new Array();
        var table = $("#smh-modal #bitrate-table tbody");
        table.find('tr.bitrate-row').each(function () {
            bit_arr.push($(this).find('td').find('.input-group').find('.bitrate').val());
            var resolution = $(this).find('td').find('.input-group').find('.resolution').text();
            var width = 0;
            var height = 0;
            if (resolution == '426x240 (240p)') {
                width = 426;
                height = 240;
            } else if (resolution == '640x360 (360p)') {
                width = 640;
                height = 360;
            } else if (resolution == '854x480 (480p)') {
                width = 854;
                height = 480;
            } else if (resolution == '1280x720 (720p)') {
                width = 1280;
                height = 720;
            } else if (resolution == '1920x1080 (1080p)') {
                width = 1920;
                height = 1080;
            } else if (resolution == '2560x1440 (1440p)') {
                width = 2560;
                height = 1440;
            } else if (resolution == '3840x2160 (2160p)') {
                width = 3840;
                height = 2160;
            }
            res_arr.push(height);
            liveStreamEntry.bitrates.push({
                'bitrate': $(this).find('td').find('.input-group').find('.bitrate').val(),
                'width': width,
                'height': height
            });
        });

        if (services.sn == 1) {
            var youtube_status = false;
            var resolution = '';
            var facebook_status = false;
            var smh_status = true;
            var twitch_status = false;
            if (yt_ready || fb_ready || twch_ready) {
                var data = $('#smh-modal .sn-data').data("data");
                if (yt_ready) {
                    var largest_res = Math.max.apply(Math, res_arr);
                    resolution = largest_res + 'p';
                    youtube_status = (data.youtube) ? true : false;
                }
                if (fb_ready) {
                    facebook_status = (data.facebook) ? true : false;
                }
                if (twch_ready) {
                    twitch_status = (data.twitch) ? true : false;
                }
                smh_status = (data.smh) ? true : false;
                sn_status = (youtube_status || facebook_status || twitch_status) ? true : false;
            }
            snConfig = smhLS.createSnConfig(smh_status, youtube_status, resolution, facebook_status, twitch_status);
        }

        if (bit_arr.length > 1) {
            var closest_br = smhLS.hlsClosest(bit_arr, 500);
            var key = smhLS.array_search(closest_br, bit_arr);
            var stream_num = Number(key) + 1;
            liveStreamEntry.hlsStreamUrl = "http://cvip.smhcdn.com/" + smhMain.pid + "-live/" + sn + stream_num + "/playlist.m3u8";
        } else {
            liveStreamEntry.hlsStreamUrl = "http://cvip.smhcdn.com/" + smhMain.pid + "-live/" + sn + "/playlist.m3u8";
        }

        liveStreamEntry.streamName = sn_final;
        liveStreamEntry.partnerData = '{' + stream_partnerData + '}';
        liveStreamEntry.offlineMessage = offline;
        client.liveStream.update(cb, id, liveStreamEntry);
    },
    //Find closest bitrate for HLS playback
    hlsClosest: function (arrNums, lookFor) {
        var distances = new Array();

        $.each(arrNums, function (key, num) {
            distances[key] = Math.abs(lookFor - num);
        });

        return arrNums [smhLS.array_search(smhLS.min_in_array(distances), distances)];
    },
    //Find min number in array
    min_in_array: function (array) {
        return Math.min.apply(Math, array);
    },
    //Array search
    array_search: function (needle, haystack, argStrict) {
        var strict = !!argStrict,
                key = '';

        if (haystack && typeof haystack === 'object' && haystack.change_key_case) { // Duck-type check for our own array()-created PHPJS_Array
            return haystack.search(needle, argStrict);
        }
        if (typeof needle === 'object' && needle.exec) { // Duck-type for RegExp
            if (!strict) { // Let's consider case sensitive searches as strict
                var flags = 'i' + (needle.global ? 'g' : '') +
                        (needle.multiline ? 'm' : '') +
                        (needle.sticky ? 'y' : ''); // sticky is FF only
                needle = new RegExp(needle.source, flags);
            }
            for (key in haystack) {
                if (needle.test(haystack[key])) {
                    return key;
                }
            }
            return false;
        }

        for (key in haystack) {
            if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
                return key;
            }
        }

        return false;
    },
    //Closes Modal
    closeModal: function () {
        $('#smh-modal').modal('hide');
    },
    //Remove bitrate
    removeBitrate: function (row) {
        $('#' + row).remove();
    },
    //Activate wizard
    activateWizard: function () {
        $('.wizard-card').bootstrapWizard({
            'tabClass': 'nav nav-pills',
            'nextSelector': '.btn-next',
            'previousSelector': '.btn-previous',
            onNext: function (tab, navigation, index) {
                if (index == 1) {
                    return smhLS.validateFirstStep();
                }
                if (index == 2) {
                    return smhLS.saveLS();
                }
            },
            onTabClick: function (tab, navigation, index) {
                // Disable the posibility to click on tabs
                return false;
            },
            onTabShow: function (tab, navigation, index) {
                var $total = navigation.find('li').length;
                var $current = index + 1;

                var wizard = navigation.closest('.wizard-card');

                // If it's the last tab then hide the last button and show the finish instead
                if ($current >= $total) {
                    $(wizard).find('.btn-previous').hide();
                    $(wizard).find('.btn-next').hide();
                    $(wizard).find('.btn-finish').show();
                } else {
                    $(wizard).find('.btn-next').show();
                    $(wizard).find('.btn-finish').hide();
                }
            }
        });
    },
    //First step validation
    validateFirstStep: function () {
        if (!$(".wizard-card #add-ls-form").valid()) {
            //form is invalid
            return false;
        }
        return true;
    },
    //Select categories modal
    selectCat: function () {
        smhLS.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '350px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '2');

        var tree = '<div style="margin-left: auto; margin-right: auto; width: 135px; font-weight: bold; margin-top: 50px;">No Categories found</div>';
        var apply_button = '';
        if (categories.length > 0) {
            tree = smhLS.json_tree(categories, 'cat');
            apply_button = '<button type="button" class="btn btn-primary" onclick="smhLS.applyCat();">Apply</button>'
        }
        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Select Categories</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = '<div id="catselect-wrapper">' +
                '<div id="tree3">' +
                '<div class="cat-options">' +
                tree +
                '</div>' +
                '</div>' +
                '</div>';

        $('#smh-modal2 .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button>' + apply_button;
        $('#smh-modal2 .modal-footer').html(footer);

        if (categories.length > 0) {
            $('#catselect-wrapper #tree3').tree({
                collapseDuration: 100,
                expandDuration: 100,
                onCheck: {
                    ancestors: null
                }
            });
            $('#catselect-wrapper').mCustomScrollbar({
                theme: "inset-dark",
                scrollButtons: {
                    enable: true
                }
            });
        }
    },
    //Inserts Categories
    applyCat: function () {
        var catIDs = [];
        $('#smh-modal2 .cat-options input[type="checkbox"]').each(function () {
            if ($(this).is(":checked")) {
                var checkbox_value = $(this).val();
                catIDs.push(cats[checkbox_value]);
            }
        });
        $('#ls_cat').val(catIDs.join(','));
        $('#smh-modal2 .smh-close2').click();
    },
    //View Player Statistics
    viewStats: function (id, name, desc, tags, date) {
        $('.rs-header').html('Player Statistics');
        $('.rs-right-header').css('display', 'none');
        var player_id = Math.floor(new Date().getTime() / 1000);
        var player_prev_gen, player_prev;
        var uiconf_id = '6709796';
        var entryId = id;
        var width = '450';
        var height = '253';
        var delivery = 'hls';
        var embed = 'dynamic';
        var seo = false;
        var sizing = 'fixed';
        var ratio = '16:9';
        var player = '<object id="smh_player_' + player_id + '" name="smh_player_' + player_id + '" type="application/x-shockwave-flash" allowFullScreen="true" allowNetworking="all" allowScriptAccess="always" height="330px" width="400px" bgcolor="#000000" xmlns:dc="http://purl.org/dc/terms/" xmlns:media="http://search.yahoo.com/searchmonkey/media/" rel="media:video" resource="https://mediaplatform.streamingmediahosting.com/index.php/kwidget/cache_st/' + player_id + '/wid/_' + sessInfo.pid + '/uiconf_id/6709796/entry_id/' + id + '" data="https://mediaplatform.streamingmediahosting.com/index.php/kwidget/cache_st/' + player_id + '/wid/_' + sessInfo.pid + '/uiconf_id/6709796/entry_id/' + id + '"><param name="wmode" value="opaque"/><param name="allowFullScreen" value="true" /><param name="allowNetworking" value="all" /><param name="allowScriptAccess" value="always" /><param name="bgcolor" value="#000000" /><param name="flashVars" value="streamerType=rtmp&ks=' + sessInfo.ks + '" /><param name="movie" value="https://mediaplatform.streamingmediahosting.com/index.php/kwidget/cache_st/' + player_id + '/wid/_' + sessInfo.pid + '/uiconf_id/6709796/entry_id/' + id + '" /></object>';
        $('#livestream-table-wrapper').html('<div id="table-header" class="col-md-12">' +
                '<div class="row">' +
                '<div class="col-md-3 col-sm-6 col-xs-12">' +
                '<div class="pull-left"><button onclick="smhLS.returnTable();" class="btn btn-block bg-olive pull-right"><i class="fa fa-reply"></i> View All Entries</button></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-12">' +
                '<div class="row">' +
                '<div style="width: 455px; float: left;"><div id="thumbPreviewIframe"></div></div>' +
                '<div class="col-md-4 col-sm-6 col-xs-12">' +
                '<table id="video-details">' +
                '<tr>' +
                '<td colspan="2"><h2 class="page-header">Video Details</h2></td>' +
                '</tr>' +
                '<tr>' +
                '<td style="width: 100px;"><b>Name:</b></td><td>' + name + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Description:</b></td><td>' + desc + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Tags:</b></td><td>' + tags + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Created On:</b></td><td>' + date + '</td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-12">' +
                '<div class="pull-left"><h2 class="page-header stats-header">Statistics</h2></div>' +
                '</div>' +
                '<div style="padding-right: 15px;" class="pull-right"><button class="btn btn-block bg-olive pull-right" onclick="window.location=\'player_stats/live_reports\'">View All Reports</button></div>' +
                '<div class="col-md-12">' +
                '<div class="row">' +
                '<div class="col-md-10 col-sm-6 col-xs-12">' +
                '<span id="date-range" class="dropdown header">' +
                '<div class="date-range-sub">' +
                '<span id="datesrange-title">Date Range:</span><div class="btn-group"><button class="btn btn-default filter-btn" style="width: 138px;" type="button"><span class="text">Last 30 days</span></button><button aria-expanded="true" data-toggle="dropdown" id="dropdownMenu" type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button>' +
                '<ul aria-labelledby="dropdownMenu" role="menu" id="menu1" class="dropdown-menu">' +
                '<li role="presentation"><a onclick="smhLS.loadYesterdayMap();" tabindex="-1" role="menuitem">Yesterday</a></li>' +
                '<li role="presentation"><a onclick="smhLS.loadLastSevenDaysMap();" tabindex="-1" role="menuitem">Last 7 days</a></li>' +
                '<li role="presentation"><a onclick="smhLS.loadThisWeekMap();" tabindex="-1" role="menuitem">This week</a></li>' +
                '<li role="presentation"><a onclick="smhLS.loadLastWeekMap();" tabindex="-1" role="menuitem">Last week</a></li>' +
                '<li role="presentation"><a onclick="smhLS.loadLastThirtyDaysMap();" tabindex="-1" role="menuitem">Last 30 days</a></li>' +
                '<li role="presentation"><a onclick="smhLS.loadThisMonthMap();" tabindex="-1" role="menuitem">This month</a></li>' +
                '<li role="presentation"><a onclick="smhLS.loadLastMonthMap();" tabindex="-1" role="menuitem">Last month</a></li>' +
                '<li role="presentation"><a onclick="smhLS.loadLastTwelveMonthMap();" tabindex="-1" role="menuitem">Last 12 months</a></li>' +
                '<li role="presentation"><a onclick="smhLS.loadThisYearMap();" tabindex="-1" role="menuitem">This year</a></li>' +
                '</ul>' +
                '</div>' +
                '<span class="vertical-line">&nbsp;</span>' +
                '</div>' +
                '<div class="date-range-sub">' +
                '<span id="custom-dates">' +
                '<span id="dates-title">Dates:</span>' +
                '<div class="input-group">' +
                '<div class="input-group-addon">' +
                '<i class="fa fa-calendar"></i>' +
                '</div>' +
                '<input type="text" class="date-picker1 form-control" id="date-picker-1">' +
                '</div>' +
                '</span>' +
                '</div>' +
                '<div class="date-range-sub">' +
                '<span id="custom-dates">To' +
                '<div class="input-group" style="margin-left: 15px;">' +
                '<div class="input-group-addon">' +
                '<i class="fa fa-calendar"></i>' +
                '</div>' +
                '<input type="text" class="date-picker2 form-control" id="date-picker-2">' +
                '</div>' +
                '</span>&nbsp;&nbsp;&nbsp;<span id="graph-loading1">Loading..</span>' +
                '</div>' +
                '</span>' +
                '</div>' +
                '<div class="col-md-2 col-sm-6 col-xs-12">' +
                '<div class="pull-right" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhLS.exportCSV()">Export to CSV <img height="20px" src="/img/xls-icon.jpg" /></a></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-12" id="live-graph">' +
                '<div id="line-live-graph"></div>' +
                '</div>' +
                '<div class="col-md-12">' +
                '<h2 class="page-header">Totals</h2>' +
                '</div>' +
                '<div class="col-md-12">' +
                '<div class="col-sm-2 col-xs-6">' +
                '<div class="description-block" style="text-align: left;">' +
                '<span class="description-percentage text-green">Plays</span>' +
                '<h5 class="description-header" id="plays">0</h5>' +
                '</div>' +
                '</div>' +
                '</div>');
        player_prev_gen = smhLS.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
        player_prev = player_prev_gen.getCode();
        smhLS.generateThumbIframe(player_prev);
        graph_entryId = id;
        $(".date-picker1").datepicker();
        $(".date-picker2").datepicker();
        smhLS.createAreaGraphInstance('line-live-graph');
        smhLS.loadLastThirtyDaysMap();
    },
    generateThumbIframe: function (embedCode) {
        $('#thumbPreviewIframe').empty();
        var style = '<style>html, body {margin: 0; padding: 0; width: 100%; height: 100%; } #framePlayerContainer {margin: 0 auto; padding-top: 20px; text-align: center; } object, div { margin: 0 auto; }</style>';
        var iframe = document.createElement('iframe');
        // Reset iframe style
        iframe.frameborder = "0";
        iframe.frameBorder = "0";
        iframe.marginheight = "0";
        iframe.marginwidth = "0";
        iframe.frameborder = "0";
        iframe.setAttribute('allowFullScreen', '');
        iframe.setAttribute('webkitallowfullscreen', '');
        iframe.setAttribute('mozallowfullscreen', '');
        iframe.setAttribute('id', 'smh-iframe');
        $('#thumbPreviewIframe').append(iframe);
        var newDoc = iframe.contentDocument;
        newDoc.open();
        newDoc.write('<!doctype html><html><head>' + style + '</head><body><div id="framePlayerContainer">' + embedCode + '</div></body></html>');
        newDoc.close();
    },
    //Creates area graph instance
    createAreaGraphInstance: function (id) {
        graph1 = Morris.Area({
            element: id,
            behaveLikeLine: true,
            xkey: 'date',
            ykeys: ['value'],
            labels: ['plays'],
            hideHover: 'auto',
            pointSize: 0,
            lineColors: ['#73B597'],
            fillOpacity: 0.4,
            smooth: true,
            resize: true,
            xLabelMargin: 50,
            parseTime: true
        });
    },
    //Gets time offset
    getOffset: function () {
        var dt = new Date();
        var tz = dt.getTimezoneOffset();
        return tz;
    },
    //Adds date range to stats
    formatDateRange: function (data) {
        var index;
        var dateRange = [];
        var split = data.split(";");
        for (index = 0; index < split.length; ++index) {
            if (split[index]) {
                var result = split[index].split(",");
                var date = result[0].substring(0, 8);
                var hour = result[0].substring(8, 11);
                var value = result[1];

                if (hour == null || hour == '') {
                    hour = '00';
                }
                dateRange.push({
                    date: date,
                    hour: hour + ":00",
                    value: Number(value).toFixed(2)
                });
            }
        }
        return dateRange;
    },
    //Get general date range
    generalDate: function (data, days, days_from_today) {
        var index;
        for (index = 0; index <= days; ++index) {
            var date = Date.today().addDays(-days_from_today).addDays(+index).toString("yyyyMMdd");
            if (!smhLS.inArray(data, date)) {
                data.push({
                    date: date,
                    hour: '00:00',
                    value: 0
                });
            }
        }
        return data;
    },
    inArray: function (data, date) {
        var inArray = false;
        var index;
        for (index = 0; index < data.length; ++index) {
            if (data[index]['date'] == date) {
                inArray = true;
            }
        }
        return inArray;
    },
    //Formats line graph data
    formatLineData: function (data) {
        var formatedData = [];
        for (var index = 0; index < data.length; ++index) {
            var dateData = data[index]['date'];
            var result1 = smhLS.insert(dateData, 4, "-");
            var result2 = smhLS.insert(result1, 7, "-");
            var date = result2 + " " + data[index]['hour'];
            var value = data[index]['value'];
            formatedData.push({
                date: date,
                value: Number(value).toFixed(2)
            });
        }
        return formatedData;
    },
    //Inserts string value at specified integer index
    insert: function (str, index, value) {
        return str.substr(0, index) + value + str.substr(index);
    },
    //Format Number
    format: function (nStr) {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    },
    //Gets total plays
    getTotalPlays: function (from, to) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }

            var i, count_plays;
            var headers = results.header.split(",");
            var data = results.data.split(",");
            var totals = {};

            for (i = 0; i < headers.length; i++) {
                totals[headers[i]] = data[i];
            }

            if (totals.count_plays == '' || totals.count_plays == null) {
                count_plays = 0
            } else {
                count_plays = totals.count_plays;
            }

            $('#plays').html(smhLS.format(count_plays));

        };

        var objectId = graph_entryId;
        var offset = smhLS.getOffset();
        var reportType = KalturaReportType.LIVE;
        var reportInputFilter = new KalturaReportInputFilter();
        reportInputFilter.fromDay = from;
        reportInputFilter.toDay = to;
        reportInputFilter.searchInTags = true;
        reportInputFilter.searchInAdminTags = true;
        reportInputFilter.timeZoneOffset = offset;
        client.report.getTotal(cb, reportType, reportInputFilter, objectId);
    },
    //Gets Graph data
    getGraphData: function (days_from_today, from, to, days) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }

            var dataString, graphData, preGraphData, i;
            var totals = {};
            var data = [];

            for (i = 0; i < results.length; i++) {
                totals[results[i]['id']] = results[i]['data'];
            }

            var label = '';
            count_plays = totals.count_plays;

            label = 'Plays';
            if (count_plays) {
                graphData = smhLS.formatDateRange(count_plays);
            } else if (count_plays == null || count_plays == '') {
                dataString = from + '00,0;' + to + '00,0;';
                count_plays = dataString;
                graphData = smhLS.formatDateRange(count_plays);
            }

            preGraphData = smhLS.generalDate(graphData, days, days_from_today);
            data = smhLS.formatLineData(preGraphData);
            graph1.options.labels = [label];
            graph1.setData(data);
            $('#graph-loading1').empty();

        };
        days_glbl = days;
        days_from_today_glbl = days_from_today;
        var dimension = 'count_plays';
        var objectId = graph_entryId;
        var reportType = KalturaReportType.LIVE;
        var offset = smhLS.getOffset();
        var reportInputFilter = new KalturaReportInputFilter();
        reportInputFilter.fromDay = from;
        reportInputFilter.toDay = to;
        reportInputFilter.searchInTags = true;
        reportInputFilter.searchInAdminTags = true;
        reportInputFilter.timeZoneOffset = offset;
        client.report.getGraphs(cb, reportType, reportInputFilter, dimension, objectId);
    },
    //Export CSV
    exportCSV: function () {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            $('#loading img').css('display', 'none');
            window.open(results);
        };

        $('#loading img').css('display', 'inline-block');
        var date1 = $('#date-picker-1').val();
        var date2 = $('#date-picker-2').val();
        var split1 = date1.split("/");
        var split2 = date2.split("/");
        var from = split1[2] + split1[0] + split1[1];
        var to = split2[2] + split2[0] + split2[1];
        var offset = smhLS.getOffset();
        var reportTitle = "Live";
        var reportText = "";
        var headers = "Plays;Entry Id,Entry Name,Plays";
        var reportType = KalturaReportType.LIVE;
        var reportInputFilter = new KalturaReportInputFilter();
        reportInputFilter.fromDay = from;
        reportInputFilter.toDay = to;
        reportInputFilter.timeZoneOffset = offset;
        var dimension = "count_plays";
        var pager = new KalturaFilterPager();
        pager.pageSize = pageSize;
        pager.pageIndex = 1;
        var order = "count_plays";
        client.report.getUrlForReportAsCsv(cb, reportTitle, reportText, headers, reportType, reportInputFilter, dimension, pager, order, graph_entryId);
    },
    //Export Metadata
    exportMetaData: function () {
        if (total_entries) {
            window.location = '/apps/platform/metadata/export.metadata.php?pid=' + sessInfo.pid + '&ks=' + sessInfo.ks + '&page_size=' + total_entries + '&action=export_live_metadata';
        }
    },
    //Load yesterday graph
    loadYesterdayMap: function () {
        $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
        var days = 1;
        var from = Date.today().add(-days).days().toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");
        var from_calendar = Date.today().add(-days).days().toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy");
        $('#date-picker-1').val(from_calendar);
        $('#date-picker-2').val(to_calendar);
        var days_from_today = days;
        smhLS.getGraphData(days_from_today, from, to, days);
        smhLS.getTotalPlays(from, to);
    },
    ///Load last 7 days graph
    loadLastSevenDaysMap: function () {
        $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
        var days = 7;
        var from = Date.today().addDays(-days).toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");
        var from_calendar = Date.today().add(-days).days().toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy");
        $('#date-picker-1').val(from_calendar);
        $('#date-picker-2').val(to_calendar);
        var days_from_today = days;
        smhLS.getGraphData(days_from_today, from, to, days);
        smhLS.getTotalPlays(from, to);
    },
    //Load this weeks graph
    loadThisWeekMap: function () {
        var from = Date.today().moveToDayOfWeek(0, -1).toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");
        var from_calendar = Date.today().moveToDayOfWeek(0, -1).toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy");
        $('#date-picker-1').val(from_calendar);
        $('#date-picker-2').val(to_calendar);
        var diff = new TimeSpan(Date.today() - Date.today().moveToDayOfWeek(0, -1));
        var days = diff.days;
        var days_from_today = diff.days;
        smhLS.getGraphData(days_from_today, from, to, days);
        smhLS.getTotalPlays(from, to);
    },
    //Load last weeks graph
    loadLastWeekMap: function () {
        $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
        var from = Date.today().addDays(-6).moveToDayOfWeek(0, -1).toString("yyyyMMdd");
        var to = Date.today().moveToDayOfWeek(6, -1).toString("yyyyMMdd");
        var from_calendar = Date.today().addDays(-6).moveToDayOfWeek(0, -1).toString("MM/dd/yyyy");
        var to_calendar = Date.today().moveToDayOfWeek(6, -1).toString("MM/dd/yyyy");
        $('#date-picker-1').val(from_calendar);
        $('#date-picker-2').val(to_calendar);
        var diff = new TimeSpan(Date.today().moveToDayOfWeek(6, -1) - Date.today().addDays(-6).moveToDayOfWeek(0, -1));
        var days = diff.days;
        var diff2 = new TimeSpan(Date.today() - Date.today().addDays(-6).moveToDayOfWeek(0, -1));
        var days_from_today = diff2.days;
        smhLS.getGraphData(days_from_today, from, to, days);
        smhLS.getTotalPlays(from, to);
    },
    //Load last 30 days graph
    loadLastThirtyDaysMap: function () {
        $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
        var days = 30;
        var from = Date.today().addDays(-days).toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");
        var from_calendar = Date.today().addDays(-days).toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy");
        $('#date-picker-1').val(from_calendar);
        $('#date-picker-2').val(to_calendar);
        var days_from_today = days;
        smhLS.getGraphData(days_from_today, from, to, days);
        smhLS.getTotalPlays(from, to);
    },
    //Loads this month's graph
    loadThisMonthMap: function () {
        $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
        $('#graph-loading2').html('<img src="/img/chart-loading.gif" height="20px" />');
        var from = Date.today().moveToFirstDayOfMonth().toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");
        var from_calendar = Date.today().moveToFirstDayOfMonth().toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy");
        $('#date-picker-1').val(from_calendar);
        $('#date-picker-2').val(to_calendar);
        var diff = new TimeSpan(Date.today() - Date.today().moveToFirstDayOfMonth());
        var days = diff.days;
        var days_from_today = days;
        smhLS.getGraphData(days_from_today, from, to, days);
        smhLS.getTotalPlays(from, to);
    },
    //Loads this month's graph
    loadLastMonthMap: function () {
        $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
        var from = Date.today().add({
            months: -1
        }).moveToFirstDayOfMonth().toString("yyyyMMdd");
        var to = Date.today().add({
            months: -1
        }).moveToLastDayOfMonth().toString("yyyyMMdd");
        var from_calendar = Date.today().add({
            months: -1
        }).moveToFirstDayOfMonth().toString("MM/dd/yyyy");
        var to_calendar = Date.today().add({
            months: -1
        }).moveToLastDayOfMonth().toString("MM/dd/yyyy");
        $('#date-picker-1').val(from_calendar);
        $('#date-picker-2').val(to_calendar);
        var diff = new TimeSpan(Date.today().add({
            months: -1
        }).moveToLastDayOfMonth() - Date.today().add({
            months: -1
        }).moveToFirstDayOfMonth());
        var days = diff.days;
        var diff2 = new TimeSpan(Date.today() - Date.today().add({
            months: -1
        }).moveToFirstDayOfMonth());
        var days_from_today = diff2.days;
        smhLS.getGraphData(days_from_today, from, to, days);
        smhLS.getTotalPlays(from, to);
    },
    //Loads last 12 month's graph
    loadLastTwelveMonthMap: function () {
        $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
        var from = Date.today().add({
            months: -12
        }).toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");
        var from_calendar = Date.today().add({
            months: -12
        }).toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy");
        $('#date-picker-1').val(from_calendar);
        $('#date-picker-2').val(to_calendar);
        var diff = new TimeSpan(Date.today() - Date.today().add({
            months: -12
        }));
        var days = diff.days;
        var days_from_today = days;
        smhLS.getGraphData(days_from_today, from, to, days);
        smhLS.getTotalPlays(from, to);
    },
    //Loads this year's graph
    loadThisYearMap: function () {
        $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
        var from = Date.today().set({
            day: 1,
            month: 0
        }).toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");
        var from_calendar = Date.today().set({
            day: 1,
            month: 0
        }).toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy");
        $('#date-picker-1').val(from_calendar);
        $('#date-picker-2').val(to_calendar);
        var diff = new TimeSpan(Date.today() - Date.today().set({
            day: 1,
            month: 0
        }));
        var days = diff.days;
        var days_from_today = days;
        smhLS.getGraphData(days_from_today, from, to, days);
        smhLS.getTotalPlays(from, to);
    },
    //Return to all entries
    returnTable: function () {
        $('.rs-header').html('Live Streams');
        $('.rs-right-header').css('display', 'block');
        var add_livestream_disabled = ($.inArray("LIVE_STREAM_ADD", sessPerm) != -1) ? '' : 'disabled';
        var ac_livestream_disabled = ($.inArray("CONTENT_MANAGE_ACCESS_CONTROL", sessPerm) != -1) ? 'onclick=smhLS.bulkACModal();' : '';
        var addtags_livestream_disabled = ($.inArray("CONTENT_MANAGE_METADATA", sessPerm) != -1) ? 'onclick=smhLS.bulkTagsAddModal();' : '';
        var removetags_livestream_disabled = ($.inArray("CONTENT_MANAGE_METADATA", sessPerm) != -1) ? 'onclick=smhLS.bulkTagsRemoveModal();' : '';
        var addcat_livestream_disabled = ($.inArray("CONTENT_MANAGE_ASSIGN_CATEGORIES", sessPerm) != -1) ? 'onclick=smhLS.bulkCatAddModal();' : '';
        var removecat_livestream_disabled = ($.inArray("CONTENT_MANAGE_ASSIGN_CATEGORIES", sessPerm) != -1) ? 'onclick=smhLS.bulkCatRemoveModal();' : '';
        var delete_livestream_disabled = ($.inArray("CONTENT_MANAGE_DELETE", sessPerm) != -1) ? 'onclick=smhLS.bulkDeleteModal();' : '';
        $('#livestream-table-wrapper').html('<div id="users-buttons">' +
                '<div style="display: inline-block; float: left;">' +
                '<span style="display: inline-block; float: left;"><button class="btn btn-block bg-olive" id="add-livestream" onclick="smhLS.addLiveStream();" ' + add_livestream_disabled + '>Create Live Stream</button></span>' +
                '<span class="dropdown header dropdown-accordion">' +
                '<div class="btn-group">' +
                '<button class="btn btn-default filter-btn" type="button"><span class="text">Filters</span></button>' +
                '<button aria-expanded="false" data-toggle="dropdown" id="dropdownMenu" type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button>' +
                '<ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu dropdown-filter">' +
                '<li role="presentation">' +
                '<div class="panel-group" id="accordion">' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a href="#collapseOne" data-toggle="collapse" data-parent="#accordion">' +
                'Filter by Categories' +
                '</a>' +
                '</h4>' +
                '</div>' +
                '<div class="panel-collapse collapse in" id="collapseOne">' +
                '<div class="panel-body">' +
                '<div id="tree1">' +
                '<div class="filter-header">' +
                '<ul>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="all" class="cat_all" checked> <b>All Categories</b></label></div>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div class="filter-body cat-filter"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' +
                '<a href="#collapseTwo" data-toggle="collapse" data-parent="#accordion">' +
                'Additional Filters' +
                '</a>' +
                '</h4>' +
                '</div>' +
                '<div class="panel-collapse collapse" id="collapseTwo">' +
                '<div class="panel-body">' +
                '<div id="tree2">' +
                '<div id="filter-header">' +
                '<ul>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="all" class="ac_all" checked> <b>All Access Control Profiles</b></label></div>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div class="filter-body ac-filter"></div>' +
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
                '<div style="display: inline-block; float: right;">' +
                '<div class="pull-left" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhLS.exportMetaData()">Export to Excel <img height="20px" src="/img/xls-icon.jpg"></a></div>' +
                '<span class="dropdown header">' +
                '<div class="btn-group">' +
                '<button class="btn btn-default dd-delete-btn" type="button"><span class="text">Bulk Actions</span></button>' +
                '<button aria-expanded="true" data-toggle="dropdown" id="dropdownMenu" type="button" class="btn btn-disabled dropdown-toggle dd-delete-btn" disabled=""><span class="caret"></span></button>' +
                '<ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu livestream-bulk">' +
                '<li role="presentation"><a ' + ac_livestream_disabled + ' tabindex="-1" role="menuitem">Set Access Control</a></li>' +
                '<li role="presentation" class="dropdown dropdown-submenu">' +
                '<a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-caret-left"></i> Add/Remove Tags</a>' +
                '<ul class="dropdown-menu">' +
                '<li>' +
                '<a ' + addtags_livestream_disabled + '>Add Tags</a>' +
                '</li>' +
                '<li>' +
                '<a ' + removetags_livestream_disabled + '>Remove Tags</a>' +
                '</li>' +
                '</ul>' +
                '</li>' +
                '<li role="presentation" class="dropdown dropdown-submenu">' +
                '<a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-caret-left"></i> Add/Remove Categories</a>' +
                '<ul class="dropdown-menu cat-menu">' +
                '<li>' +
                '<a ' + addcat_livestream_disabled + '>Add to Categories</a>' +
                '</li>' +
                '<li>' +
                '<a ' + removecat_livestream_disabled + '>Remove from Categories</a>' +
                '</li>' +
                '</ul>' +
                '</li>' +
                '<li role="presentation"><a ' + delete_livestream_disabled + ' tabindex="-1" role="menuitem">Delete</a></li>' +
                '</ul>' +
                '</div>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div id="livestream-table"></div>');
        smhLS.getLiveStreams();
        smhLS.getUiConfs();
        smhLS.getCats();
        smhLS.getAccessControlProfiles();
    },
    getSnConfig: function () {
        var sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            projection: 'rectangular'
        }

        var reqUrl = SnApiUrl + 'action=get_sn_config';
        $.ajax({
            cache: false,
            url: reqUrl,
            type: 'GET',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#add-livestream').attr('disabled', '');
            },
            success: function (data) {
                $.each(data['platforms'], function (key, value) {
                    if (value['platform'] == 'youtube_live') {
                        var yt_authorized = false;
                        var yt_ls_enabled = false;
                        if (value['authorized']) {
                            yt_authorized = true;
                        }
                        if (value['ls_enabled']) {
                            yt_ls_enabled = true;
                        }
                        if (value['embed_status']) {
                            yt_embed = true;
                        } else {
                            yt_embed = false;
                        }
                        yt_ready = yt_authorized && yt_ls_enabled;
                    }
                    if (value['platform'] == 'facebook_live') {
                        var fb_authorized = false;
                        var fb_settings = false;
                        if (value['authorized']) {
                            fb_authorized = true;
                        }
                        if (value['settings']) {
                            fb_settings = true;
                        }
                        fb_ready = fb_authorized && fb_settings;
                    }
                    if (value['platform'] == 'twitch') {
                        var twch_authorized = false;
                        if (value['authorized']) {
                            twch_authorized = true;
                        }
                        twch_ready = twch_authorized;
                    }
                });
                $('#add-livestream').removeAttr('disabled');
            }
        });
    },
    resClicked: function (a, number) {
        $('#smh-modal #bitrate-table #res-val' + number).text($(a).html());
    },
    viewPlatforms: function (platforms) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '410px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Platforms</h4>';
        $('#smh-modal .modal-header').html(header);

        var platforms_arr = platforms.split(",");
        var logos = '';
        $.each(platforms_arr, function (index, value) {
            if (value === 'smh') {
                logos += "<div class='logo-spacing'><img src='/img/smh_logo.png' width='140px'></div>";
            } else if (value === 'yt') {
                logos += "<div class='logo-spacing'><img src='/img/youtube_live_logo.png' width='115px'></div>";
            } else if (value === 'fb') {
                logos += "<div class='logo-spacing'><img src='/img/facebook_live_logo.png' width='75px'></div>";
            } else if (value === 'twch') {
                logos += "<div class='logo-spacing'><img src='/img/twitch_logo.png' width='75px'></div>";
            }
        });
        content = '<div style="color: #797979; text-align: center;">This stream will broadcast on the following platforms:</div>' +
                '<div id="platform-logos">' +
                '<div id="logos-wrapper">' +
                '<div class="logo-wrapper">' +
                logos +
                '</div>' +
                '</div>' +
                '</div>';
        $('#smh-modal .modal-body').html(content);
        $('#platform-logos .logo-wrapper').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        footer = '<button type="button" class="btn btn-default smh-close" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Register actions
    registerActions: function () {
        $('#smh-modal').on('click', '.add-ls-close', function () {
            $('#add-ls-form input[type="text"]').tooltipster('destroy');
        });
        $('#smh-modal').on('click', '.edit-ls-close', function () {
            $('#edit-ls-form input[type="text"]').tooltipster('destroy');
        });
        $('#smh-modal3').on('click', '.smh-close', function () {
            $('#smh-modal3').on('hidden.bs.modal', function (e) {
                smhLS.resetPreviewModal();
            });
        });
        $('#smh-modal2').on('click', '.smh-close2', function () {
            $('#smh-modal').css('z-index', '');
            $('#smh-modal2').on('hidden.bs.modal', function (e) {
                $('body').addClass('modal-open');
            });
        });
        $('#smh-modal4').on('click', '.smh-close4', function () {
            $('#smh-modal').css('z-index', '');
            $('#smh-modal4').on('hidden.bs.modal', function (e) {
                $('body').addClass('modal-open');
            });
        });

        $('#smh-modal').on('click', '#add-bitrate', function (event) {
            $('#bitrate-table tr:last').after('<tr class="bitrate-row" id="stream-num' + num + '">' +
                    '<td><input type="text" class="bitrate" name="bitrate" style="width:70px !important;" class="form-control" /></td>' +
                    '<td>' +
                    '<div class="dropdown">' +
                    '<div class="input-group">' +
                    '<div class="input-group-btn">' +
                    '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                    '<span id="res-val' + num + '" class="resolution">426x240 (240p)</span> <span class="caret"></span>' +
                    '</button>' +
                    '<ul id="res-list' + num + '" class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                    '<li><a href="#" onclick="smhLS.resClicked(this,' + num + ')">426x240 (240p)</a></li>' +
                    '<li><a href="#" onclick="smhLS.resClicked(this,' + num + ')">640x360 (360p)</a></li>' +
                    '<li><a href="#" onclick="smhLS.resClicked(this,' + num + ')">854x480 (480p)</a></li>' +
                    '<li><a href="#" onclick="smhLS.resClicked(this,' + num + ')">1280x720 (720p)</a></li>' +
                    '<li><a href="#" onclick="smhLS.resClicked(this,' + num + ')">1920x1080 (1080p)</a></li>' +
                    '<li><a href="#" onclick="smhLS.resClicked(this,' + num + ')">2560x1440 (1440p)</a></li>' +
                    '<li><a href="#" onclick="smhLS.resClicked(this,' + num + ')">3840x2160 (2160p)</a></li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</td>' +
                    '<td><div class="remove-bitrate-icon"><i class="fa fa-remove" onclick="smhLS.removeBitrate(\'stream-num' + num + '\')"></i></div></td>' +
                    '</tr>');
            num++;
            $("#bitrate-table input[name='bitrate']").TouchSpin({
                initval: 300,
                min: 0,
                max: 100000,
                step: 1,
                verticalbuttons: true
            });
        });

        $('#smh-modal').on('click', '#remove-tags-wrapper .tags-spacing', function () {
            if ($(this).hasClass('tag-selected')) {
                $(this).removeClass('tag-selected');
            } else {
                $(this).addClass('tag-selected');
            }
            if ($('#remove-tags-wrapper .tag-selected').length > 0) {
                $('#bulkremovetags-livestreams').removeAttr('disabled');
            } else {
                $('#bulkremovetags-livestreams').attr('disabled', '');
            }
        });

        $('#smh-modal').on('click', '#remove-cats-wrapper .cats-spacing', function () {
            if ($(this).hasClass('cats-selected')) {
                $(this).removeClass('cats-selected');
            } else {
                $(this).addClass('cats-selected');
            }
            if ($('#remove-cats-wrapper .cats-selected').length > 0) {
                $('#bulkremovecats-livestreams').removeAttr('disabled');
            } else {
                $('#bulkremovecats-livestreams').attr('disabled', '');
            }
        });

        $('#smh-modal').on('change', '#thumbUp input[type=file]', function () {
            // select the form and submit
            $('#smh-modal form').submit();
            var options = {
                dataType: 'xml',
                complete: function () {
                    setTimeout(function () {
                        $('#smh-modal #loading img').css('display', 'none');
                        smhLS.loadThumbs(entryId);
                    }, 1800);
                },
                beforeSend: function () {
                    $('#smh-modal #loading img').css('display', 'inline-block');
                }
            };
            $(this).ajaxSubmit(options);
            return false;
        });

        $('#livestream-table-wrapper').on('click', '#menu1 li a', function () {
            var selText = $(this).text();
            $(this).parents('.dropdown').find('.filter-btn').html('<span class="text">' + selText + '</span>');
        });

        $('#livestream-table-wrapper').on('change', '#date-picker-1', function () {
            var date1 = $('#date-picker-1').val();
            var date2 = $('#date-picker-2').val();
            var split1 = date1.split("/");
            var split2 = date2.split("/");
            $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
            var from = split1[2] + split1[0] + split1[1];
            var to = split2[2] + split2[0] + split2[1];
            var diff = new TimeSpan(Date.parseExact(date2, "MM/dd/yyyy") - Date.parseExact(date1, "MM/dd/yyyy"));
            var days = diff.days;
            var diff2 = new TimeSpan(Date.today() - Date.parseExact(date1, "MM/dd/yyyy"));
            var days_from_today = diff2.days;
            smhLS.getGraphData(days_from_today, from, to, days);
            smhLS.getTotalPlays(from, to);
        });
        $('#livestream-table-wrapper').on('change', '#date-picker-2', function () {
            var date1 = $('#date-picker-1').val();
            var date2 = $('#date-picker-2').val();
            var split1 = date1.split("/");
            var split2 = date2.split("/");
            $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
            var from = split1[2] + split1[0] + split1[1];
            var to = split2[2] + split2[0] + split2[1];
            var diff = new TimeSpan(Date.parseExact(date2, "MM/dd/yyyy") - Date.parseExact(date1, "MM/dd/yyyy"));
            var days = diff.days;
            var diff2 = new TimeSpan(Date.today() - Date.parseExact(date1, "MM/dd/yyyy"));
            var days_from_today = diff2.days;
            smhLS.getGraphData(days_from_today, from, to, days);
            smhLS.getTotalPlays(from, to);
        });

        $('#smh-modal').on('click', '#res-list0 li a', function () {
            $('#res-val0').text($(this).html());
        });

        $('#smh-modal2').on('change', '#smh', function (event) {
            if (!$(this).prop('checked')) {
                if (!$('#smh-modal2 #youtube').prop('checked') && !$('#smh-modal2 #facebook').prop('checked') && !$('#smh-modal2 #twitch').prop('checked')) {
                    $('#smh-modal2 #smh').bootstrapToggle('on');
                }
            }
        });

        $('#smh-modal2').on('change', '#youtube', function (event) {
            if (!$(this).prop('checked')) {
                if (!$('#smh-modal2 #smh').prop('checked') && !$('#smh-modal2 #facebook').prop('checked') && !$('#smh-modal2 #twitch').prop('checked')) {
                    $('#smh-modal2 #smh').bootstrapToggle('on');
                }
            } else if ($(this).prop('checked')) {
                $('#smh-modal2 #facebook').bootstrapToggle('off');
            }
        });

        $('#smh-modal2').on('change', '#facebook', function (event) {
            if (!$(this).prop('checked')) {
                if (!$('#smh-modal2 #smh').prop('checked') && !$('#smh-modal2 #youtube').prop('checked') && !$('#smh-modal2 #twitch').prop('checked')) {
                    $('#smh-modal2 #smh').bootstrapToggle('on');
                }
            } else if ($(this).prop('checked')) {
                $('#smh-modal2 #youtube').bootstrapToggle('off');
                $('#smh-modal2 #twitch').bootstrapToggle('off');
            }
        });
        $('#smh-modal2').on('change', '#twitch', function (event) {
            if (!$(this).prop('checked')) {
                if (!$('#smh-modal2 #smh').prop('checked') && !$('#smh-modal2 #youtube').prop('checked') && !$('#smh-modal2 #facebook').prop('checked')) {
                    $('#smh-modal2 #smh').bootstrapToggle('on');
                }
            } else if ($(this).prop('checked')) {
                $('#smh-modal2 #facebook').bootstrapToggle('off');
            }
        });
    }
}

// Main on ready
$(document).ready(function () {
    smhLS = new LiveStreams();
    smhLS.getLiveStreams();
    smhLS.registerActions();
    smhLS.getUiConfs();
    smhLS.getCats();
    smhLS.getAccessControlProfiles();
    if (services.sn == 1) {
        smhLS.getSnConfig();
    }
});
