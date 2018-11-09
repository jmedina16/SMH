/*
 *
 *	Streaming Media Hosting
 *	
 *	LiveStreams
 *
 *	9-15-2015
 */
//Main constructor
function Content() {}

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
var mediaTypes = [];
var duration = [];
var clipped = [];
var flavors = [];
var flavors_filter = [];
var shortlink;
var validator;
var num = 1;
var graph1, graph2, live_count_plays, count_plays, sum_time_viewed, avg_time_viewed, active_tab, active_menu, count_loads, days_glbl, days_from_today_glbl, pageSize;
var dropOff_stats = false;
var graph_entryId = null;
var bargraph_entryId = null;
var slices = 40;
var frameRate = 400;
var timer = null;
var slice = 0;
var img = new Image();
var chapterBoxWidth, chapters_entry, chapters_layout, chapters_position, chapters_overflow, chapters_thumbnail, chapters_thumbnail_width, chapters_thumbrotator, chapters_numberpattern, chapters_startime, chapters_duration, chapters_pause, chapters_titlelimit, chapters_descriptionlimit, chapters_streamertype, chapter_player;
var chapters_array = new Array();
var survey_entry, survey_player, survey_streamertype, survey_hexcolor, survey_alpha;
var cap_num, cap_entry, cap_ex, cap_e, cap_flavor, cap_token, cap_url, cap_type, cap_lang, cap_label;
var CAP_RESULTS = new Array();
var SnApiUrl = "/apps/sn/v1.0/dev.php?";
var CacheApiUrl = "/apps/cache/v1.0/index.php?";
var yt_ready = false;
var fb_ready = false;
var twch_ready = false;

//Login prototype/class
Content.prototype = {
    constructor: Content,
    //Build tickets table
    getEntries: function () {
        var categories_id = categoryIDs.join();
        var mediaTypes_id = mediaTypes.join();
        var durations = duration.join();
        var clipped_id = clipped.join();
        var ac_id = ac_filter.join();
        var flavors_id = flavors_filter.join();
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#entries-table').empty();
        $('#entries-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="entries-data"></table>');
        entriesTable = $('#entries-data').DataTable({
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
                "url": "/api/v1/getEntries",
                "type": "GET",
                "data": function (d) {
                    return $.extend({}, d, {
                        "_token": $('meta[name="csrf-token"]').attr('content'),
                        "ks": sessInfo.ks,
                        "tz": tz,
                        "category": categories_id,
                        "mediaType": mediaTypes_id,
                        "duration": durations,
                        "clipped": clipped_id,
                        "ac": ac_id,
                        "flavors": flavors_id,
                        "modify_perm": ($.inArray("CONTENT_MANAGE_METADATA", sessPerm) != -1) ? true : false,
                        "delete_perm": ($.inArray("CONTENT_MANAGE_DELETE", sessPerm) != -1) ? true : false,
                        "ac_perm": ($.inArray("CONTENT_MANAGE_ACCESS_CONTROL", sessPerm) != -1) ? true : false,
                        "thumb_perm": ($.inArray("CONTENT_MANAGE_THUMBNAIL", sessPerm) != -1) ? true : false,
                        "stats_perm": ($.inArray("ANALYTICS_BASE", sessPerm) != -1) ? true : false,
                        "download_perm": ($.inArray("CONTENT_MANAGE_DOWNLOAD", sessPerm) != -1) ? true : false,
                        "clip_perm": ($.inArray("CONTENT_INGEST_CLIP_MEDIA", sessPerm) != -1) ? true : false,
                        "captions_perm": ($.inArray("CAPTION_MODIFY", sessPerm) != -1) ? true : false,
                        "sn": services.sn
                    });
                },
                "dataSrc": function (json) {
                    total_entries = json['recordsTotal'];
                    return json.data
                }
            },
            "language": {
                "zeroRecords": "No Entries Found"
            },
            "columns": [
                {
                    "title": "<span style='float: left;'><input type='checkbox' class='entries-bulk' id='entries-bulkAll' style='width:16px; margin-right: 7px;' name='entries_bulkAll' /></span>",
                    "width": "10px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Thumbnail</div></span>",
                    "width": "177px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Name</div></span>",
                    "width": "177px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>ID</div></span>",
                    "width": "177px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Created On</div></span>",
                    "width": "177px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Type</div></span>",
                    "width": "177px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Statistics <i data-placement='top' data-toggle='tooltip' data-delay=\'{\"show\":700, \"hide\":30}\' data-original-title='Player statistics are updated once a day' class='fa fa-question-circle'></i></div></span>",
                    "width": "100px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Status</div></span>",
                    "width": "177px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Actions</div></span>",
                    "width": "182px"
                },
            ],
            "preDrawCallback": function () {
                smhMain.showProcessing();
            },
            "drawCallback": function (oSettings) {
                smhMain.hideProcessing();
                smhMain.fcmcAddRows(this, 9, 10);
            }
        });

        $('#users-buttons .dd-delete-btn').removeClass('btn-default');
        $('#users-buttons .dd-delete-btn').addClass('btn-disabled');
        $('#users-buttons .dd-delete-btn').attr('disabled', '');
        $('#entries-table').on('change', ".entries-bulk", function () {
            var anyBoxesChecked = false;
            $('#entries-table input[type="checkbox"]').each(function () {
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
        $('#entries-bulkAll').click(function () {
            if (this.checked) {
                $('.entries-bulk').each(function () {
                    this.checked = true;
                });
            } else {
                $('.entries-bulk').each(function () {
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
        var smh = true;
        var youtube = false;
        var facebook = false;
        var twitch = false;

        if (services.sn == '1') {
            if ((platforms !== '') && (yt_ready || fb_ready || twch_ready)) {
                var select_options = "<option value='smh'>Streaming Media Hosting</option>";
                var options = platforms.split(';');
                var youtube_id = '';
                var facebook_id = '';
                var twitch_id = '';
                $.each(options, function (key, value) {
                    var platform = value.split(':');
                    if ((platform[0] == 'youtube') && (platform[1] == 1) && (platform[2] != 'pending')) {
                        youtube = true;
                        youtube_id += platform[2];
                        select_options += "<option value='youtube'>YouTube</option>";
                    }
                    if ((platform[0] == 'facebook') && (platform[1] == 1) && (platform[2] != 'pending')) {
                        facebook = true;
                        facebook_id += platform[2];
                        select_options += "<option value='facebook'>Facebook</option>";
                    }
                    if ((platform[0] == 'twitch') && (platform[1] == 1) && (platform[2] != 'pending')) {
                        twitch = true;
                        twitch_id += platform[2];
                        select_options += "<option value='twitch'>Twitch</option>";
                    }
                });
                if (youtube || facebook || twitch) {
                    platform_options += '<div style="font-size: 14px; font-weight: bold; margin-left: auto; margin-right: auto; margin-top: 10px;"><span style="margin-right: 17px; color: #444; font-size: 12px;">Select Platform:</span><span><select id="platforms" class="form-control" style="width: 213px;">' + select_options + '</select></span></div>' +
                            '<div style="margin-top: 5px;"><span style="font-size: 12px; color: #999;">Select the platform from which you would like to grab your player embed codes</span></div>' +
                            '<hr>';
                }
            }
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
                '<div id="delivery-options">' +
                '<div style="margin-top: 10px; font-weight: bold;"><span style="color: #444; font-size: 12px;margin-right: 30px;">Delivery Type:</span><span><select class="form-control delivery" style="width: 213px;"><option value="hls">HLS Streaming</option><option value="http">HTTP Progressive Download</option></select></span></div>' +
                '<div style="margin-top: 5px;"><span style="font-size: 12px; color: #999;">Adaptive Streaming automatically adjusts to the viewer\'s bandwidth,while Progressive Download allows buffering of the content.</span></div>' +
                '<hr>' +
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
                '<div id="facebook-options">' +
                '<div style="margin-top: 10px; font-weight: bold;"><span><input type="checkbox" id="fb-autoplay" name="fb-autoplay"></span>&nbsp;<span style="color: #444; font-size: 12px; font-weight: bold; margin-left: 5px; position: relative; top: -2px;">Auto Play</span></div>' +
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
        var delivery = $('select.delivery option:selected').val();

        smhContent.getShortLink(uiconf_id, entryId, embed, delivery);
        if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
            gen = smhContent.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
            embedCode = gen.getCode();
            $('#embed_code').text(embedCode);
        }

        player_prev_gen = smhContent.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
        player_prev = player_prev_gen.getCode();
        smhContent.generateIframe(player_prev);

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
                player_prev_gen = smhContent.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
                if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
                    gen = smhContent.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                }
                player_prev = player_prev_gen.getCode();
                smhContent.generateIframe(player_prev);
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
                $('#delivery-options').css('display', 'block');
                $('#seo-options').css('display', 'block');
                $('#preview-options').css('display', 'block');
                $('#youtube-options').css('display', 'none');
                $('#facebook-options').css('display', 'none');
                $('#twitch-options').css('display', 'none');
                $('#embed-options').css('display', 'block');
                $('#player-sizing').css('display', 'block');
                player_prev_gen = smhContent.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
                smhContent.getShortLink(uiconf_id, entryId, embed, delivery);
                if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
                    gen = smhContent.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                }
                player_prev = player_prev_gen.getCode();
                smhContent.generateIframe(player_prev);
            } else if (selected_platform == 'youtube') {
                smh = false;
                youtube = true;
                facebook = false;
                twitch = false;
                $('#smh-modal3 #aspect_ratio').html('<option value="16:9">16:9</option><option value="4:3">4:3</option><option value="custom" selected>custom</option>');
                $('#dim_height').removeAttr('disabled');
                $('#select-player-options').css('display', 'none');
                $('#embed-types-options').css('display', 'none');
                $('#delivery-options').css('display', 'none');
                $('#seo-options').css('display', 'none');
                $('#preview-options').css('display', 'none');
                $('#youtube-options').css('display', 'block');
                $('#facebook-options').css('display', 'none');
                $('#twitch-options').css('display', 'none');
                $('#player-sizing').css('display', 'none');
                if ($("#yt-autoplay").is(':checked')) {
                    embedCode = '<iframe id="ytplayer" width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + youtube_id + '?autoplay=1" frameborder="0" allowfullscreen></iframe>';
                    $('#embed_code').text(embedCode);
                    smhContent.generateYoutubeIframe(embedCode);
                } else {
                    embedCode = '<iframe id="ytplayer" width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + youtube_id + '" frameborder="0" allowfullscreen></iframe>';
                    $('#embed_code').text(embedCode);
                    smhContent.generateYoutubeIframe(embedCode);
                }
                $('#sn-wrapper').css('width', width + 'px');
            } else if (selected_platform == 'facebook') {
                smh = false;
                youtube = false;
                facebook = true;
                twitch = false;
                $('#smh-modal3 #aspect_ratio').html('<option value="16:9">16:9</option><option value="4:3">4:3</option><option value="custom" selected>custom</option>');
                $('#dim_height').removeAttr('disabled');
                $('#select-player-options').css('display', 'none');
                $('#embed-types-options').css('display', 'none');
                $('#delivery-options').css('display', 'none');
                $('#seo-options').css('display', 'none');
                $('#preview-options').css('display', 'none');
                $('#youtube-options').css('display', 'none');
                $('#facebook-options').css('display', 'block');
                $('#twitch-options').css('display', 'none');
                $('#player-sizing').css('display', 'none');
                if ($("#fb-autoplay").is(':checked')) {
                    embedCode = '<iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F' + facebook_id + '%2F&width=' + width + '&show_text=false&appId=1880095552209614&height=' + height + '&autoplay=true" width="' + width + '" height="' + height + '" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>';
                    $('#embed_code').text(embedCode);
                    smhContent.generateFacebookIframe(embedCode);
                } else {
                    embedCode = '<iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F' + facebook_id + '%2F&width=' + width + '&show_text=false&appId=1880095552209614&height=' + height + '" width="' + width + '" height="' + height + '" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>';
                    $('#embed_code').text(embedCode);
                    smhContent.generateFacebookIframe(embedCode);
                }
                $('#sn-wrapper').css('width', width + 'px');
            } else if (selected_platform == 'twitch') {
                smh = false;
                youtube = false;
                facebook = false;
                twitch = true;
                $('#smh-modal3 #aspect_ratio').html('<option value="16:9">16:9</option><option value="4:3">4:3</option><option value="custom" selected>custom</option>');
                $('#dim_height').removeAttr('disabled');
                $('#select-player-options').css('display', 'none');
                $('#embed-types-options').css('display', 'none');
                $('#delivery-options').css('display', 'none');
                $('#seo-options').css('display', 'none');
                $('#preview-options').css('display', 'none');
                $('#youtube-options').css('display', 'none');
                $('#facebook-options').css('display', 'none');
                $('#twitch-options').css('display', 'block');
                $('#player-sizing').css('display', 'none');
                if ($("#twitch-autoplay").is(':checked')) {
                    embedCode = '<iframe width="' + width + '" height="' + height + '" src="https://player.twitch.tv/?video=v' + twitch_id + '&autoplay=true" frameborder="0" allowfullscreen></iframe>';
                    $('#embed_code').text(embedCode);
                    smhContent.generateTwitchIframe(embedCode);
                } else {
                    embedCode = '<iframe width="' + width + '" height="' + height + '" src="https://player.twitch.tv/?video=v' + twitch_id + '&autoplay=false" frameborder="0" allowfullscreen></iframe>';
                    $('#embed_code').text(embedCode);
                    smhContent.generateTwitchIframe(embedCode);
                }
                $('#sn-wrapper').css('width', width + 'px');
            }
        });

        $('#smh-modal3').on('change', '#yt-autoplay', function (event) {
            if ($("#yt-autoplay").is(':checked')) {
                embedCode = '<iframe id="ytplayer" width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + youtube_id + '?autoplay=1" frameborder="0" allowfullscreen></iframe>';
                $('#embed_code').text(embedCode);
                smhContent.generateYoutubeIframe(embedCode);
            } else {
                embedCode = '<iframe id="ytplayer" width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + youtube_id + '" frameborder="0" allowfullscreen></iframe>';
                $('#embed_code').text(embedCode);
                smhContent.generateYoutubeIframe(embedCode);
            }
        });

        $('#smh-modal3').on('change', '#fb-autoplay', function (event) {
            if ($("#fb-autoplay").is(':checked')) {
                embedCode = '<iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F' + facebook_id + '%2F&width=' + width + '&show_text=false&appId=1880095552209614&height=' + height + '&autoplay=true" width="' + width + '" height="' + height + '" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>';
                $('#embed_code').text(embedCode);
                smhContent.generateFacebookIframe(embedCode);
            } else {
                embedCode = '<iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F' + facebook_id + '%2F&width=' + width + '&show_text=false&appId=1880095552209614&height=' + height + '" width="' + width + '" height="' + height + '" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>';
                $('#embed_code').text(embedCode);
                smhContent.generateFacebookIframe(embedCode);
            }
        });

        $('#smh-modal3').on('change', '#twch-autoplay', function (event) {
            if ($("#twch-autoplay").is(':checked')) {
                embedCode = '<iframe width="' + width + '" height="' + height + '" src="https://player.twitch.tv/?video=v' + twitch_id + '&autoplay=true" frameborder="0" allowfullscreen></iframe>';
                $('#embed_code').text(embedCode);
                smhContent.generateTwitchIframe(embedCode);
            } else {
                embedCode = '<iframe width="' + width + '" height="' + height + '" src="https://player.twitch.tv/?video=v' + twitch_id + '&autoplay=false" frameborder="0" allowfullscreen></iframe>';
                $('#embed_code').text(embedCode);
                smhContent.generateTwitchIframe(embedCode);
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

            player_prev_gen = smhContent.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);

            smhContent.getShortLink(uiconf_id, entryId, embed, delivery);
            if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
                gen = smhContent.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                embedCode = gen.getCode();
                $('#embed_code').text(embedCode);
            }
            player_prev = player_prev_gen.getCode();
            smhContent.generateIframe(player_prev);
        });

        $('#smh-modal3').on('click', '#update-dim', function () {
            width = $('#dim_width').val();
            height = $('#dim_height').val();
            if (smh) {
                player_prev_gen = smhContent.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
                if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
                    gen = smhContent.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                }
                player_prev = player_prev_gen.getCode();
                smhContent.generateIframe(player_prev);
            } else if (youtube) {
                if ($("#yt-autoplay").is(':checked')) {
                    embedCode = '<iframe id="ytplayer" width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + youtube_id + '?autoplay=1" frameborder="0" allowfullscreen></iframe>';
                    $('#embed_code').text(embedCode);
                    smhContent.generateYoutubeIframe(embedCode);
                } else {
                    embedCode = '<iframe id="ytplayer" width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + youtube_id + '" frameborder="0" allowfullscreen></iframe>';
                    $('#embed_code').text(embedCode);
                    smhContent.generateYoutubeIframe(embedCode);
                }
                $('#sn-wrapper').css('width', width + 'px');
            } else if (facebook) {
                if ($("#fb-autoplay").is(':checked')) {
                    embedCode = '<iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F' + facebook_id + '%2F&width=' + width + '&show_text=false&appId=1880095552209614&height=' + height + '&autoplay=true" width="' + width + '" height="' + height + '" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>';
                    $('#embed_code').text(embedCode);
                    smhContent.generateFacebookIframe(embedCode);
                } else {
                    embedCode = '<iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F' + facebook_id + '%2F&width=' + width + '&show_text=false&appId=1880095552209614&height=' + height + '" width="' + width + '" height="' + height + '" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>';
                    $('#embed_code').text(embedCode);
                    smhContent.generateFacebookIframe(embedCode);
                }
                $('#sn-wrapper').css('width', width + 'px');
            } else if (twitch) {
                if ($("#twch-autoplay").is(':checked')) {
                    embedCode = '<iframe width="' + width + '" height="' + height + '" src="https://player.twitch.tv/?video=v' + twitch_id + '&autoplay=true" frameborder="0" allowfullscreen></iframe>';
                    $('#embed_code').text(embedCode);
                    smhContent.generateTwitchIframe(embedCode);
                } else {
                    embedCode = '<iframe width="' + width + '" height="' + height + '" src="https://player.twitch.tv/?video=v' + twitch_id + '&autoplay=false" frameborder="0" allowfullscreen></iframe>';
                    $('#embed_code').text(embedCode);
                    smhContent.generateTwitchIframe(embedCode);
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

        $('select.delivery').on('change', function (event) {
            delivery = $('select.delivery option:selected').val();

            player_prev_gen = smhContent.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);

            smhContent.getShortLink(uiconf_id, entryId, embed, delivery);
            if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
                gen = smhContent.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                embedCode = gen.getCode();
                $('#embed_code').text(embedCode);
            }
            player_prev = player_prev_gen.getCode();
            smhContent.generateIframe(player_prev);
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
                player_prev_gen = smhContent.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
                smhContent.getShortLink(uiconf_id, entryId, embed, delivery);

                gen = smhContent.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                embedCode = gen.getCode();
                $('#embed_code').text(embedCode);
                player_prev = player_prev_gen.getCode();
                smhContent.generateIframe(player_prev);
            });
            $('.previewModal .options').on('change', '#secure', function (event) {
                if ($("#secure").is(':checked')) {
                    protocol = 'https';
                    gen = smhContent.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                } else {
                    protocol = 'http';
                    gen = smhContent.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                }
            });
            $('.previewModal .options').on('change', '#seo', function (event) {
                if ($("#seo").is(':checked')) {
                    seo = true;
                    gen = smhContent.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                } else {
                    seo = false;
                    gen = smhContent.generateEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                }
            });
        }

        $('#smh-modal3').on('click', '#select-bttn', function (event) {
            $('#smh-modal3 #embed_code').select();
        });
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
    editPlatformConfig: function (eid, platforms, stereo_mode) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Social Media</h4>';
        $('#smh-modal .modal-header').html(header);

        if (!yt_ready && !fb_ready && !twch_ready) {
            content = '<div style="color: #797979; text-align: center;">You must have at least one social media account connected to the Platform.</div>';
            $('#smh-modal .modal-body').html(content);
            footer = '<button type="button" class="btn btn-default smh-close" data-dismiss="modal">Close</button>';
            $('#smh-modal .modal-footer').html(footer);
        } else {
            var yt_row = '';
            var fb_row = '';
            var twch_row = '';
            var youtube_checked = '';
            var youtube_available = '';
            var youtube_upload_status = '';
            var facebook_checked = '';
            var facebook_available = '';
            var facebook_upload_status = '';
            var twitch_checked = '';
            var twitch_available = '';
            var twitch_upload_status = '';
            var options = platforms.split(';');
            $.each(options, function (key, value) {
                var platform = value.split(':');
                if ((platform[0] == 'youtube') && (platform[1] == 1)) {
                    youtube_checked = 'checked';
                    if (platform[2] == 1) {
                        youtube_upload_status = '<span class="sn-upload-status">uploading</span>';
                        youtube_available = 'disabled';
                    } else if (platform[2] == 3) {
                        youtube_upload_status = '<span class="sn-upload-status">queued</span>';
                    }
                }
                if ((platform[0] == 'facebook') && (platform[1] == 1)) {
                    facebook_checked = 'checked';
                    if (platform[2] == 1) {
                        facebook_upload_status = '<span class="sn-upload-status">uploading</span>';
                        facebook_available = 'disabled';
                    } else if (platform[2] == 3) {
                        facebook_upload_status = '<span class="sn-upload-status">queued</span>';
                    }
                }
                if ((platform[0] == 'twitch') && (platform[1] == 1)) {
                    twitch_checked = 'checked';
                    if (platform[2] == 1) {
                        twitch_upload_status = '<span class="sn-upload-status">uploading</span>';
                        twitch_available = 'disabled';
                    } else if (platform[2] == 3) {
                        twitch_upload_status = '<span class="sn-upload-status">queued</span>';
                    }
                }
            });

            if (yt_ready) {
                yt_row += '<div class="sn-choice-wrapper"><div style="margin-left: 10px; float: left; position: relative; top: -5px;"><img src="/img/youtube_logo.png" width="70px"></div><div style="float: right; position: relative; top: 1px;">' + youtube_upload_status + '<input name="sn_option" value="youtube" id="youtube" type="checkbox" data-style="ios" data-on=" " data-off=" " data-size="mini" data-onstyle="olive" data-width="40" ' + youtube_checked + ' ' + youtube_available + '></div><div class="clear"></div></div>';
            }
            if (fb_ready) {
                fb_row += '<div class="sn-choice-wrapper"><div style="margin-left: 10px; float: left; position: relative;"><img src="/img/facebook_logo.png" width="70px"></div><div style="float: right; position: relative; top: 1px;">' + facebook_upload_status + '<input name="sn_option" value="facebook" id="facebook" type="checkbox" data-style="ios" data-on=" " data-off=" " data-size="mini" data-onstyle="olive" data-width="40" ' + facebook_checked + ' ' + facebook_available + '></div><div class="clear"></div></div>';
            }
            if (twch_ready) {
                twch_row += '<div class="sn-choice-wrapper"><div style="margin-left: 10px; float: left; position: relative;; top: -4px;"><img src="/img/twitch_logo.png" width="70px"></div><div style="float: right; position: relative; top: 1px;">' + twitch_upload_status + '<input name="sn_option" value="twitch" id="twitch" type="checkbox" data-style="ios" data-on=" " data-off=" " data-size="mini" data-onstyle="olive" data-width="40" ' + twitch_checked + ' ' + twitch_available + '></div><div class="clear"></div></div>';
            }

            content = '<div style="color: #797979; text-align: center;">Enable the platforms you would like to upload this video to.</div>' +
                    '<div id="platform-configs">' +
                    '<div class="sn-choice-wrapper vr-wrapper">' +
                    '<table style="width: 100%;top: -6px;position: relative;">' +
                    '<tr>' +
                    '<td style="width: 130px;"><b>360&deg; Video:</b></td><td><div style="float: right; position: relative; top: 1px;"><input data-toggle="toggle" id="threesixty-video" type="checkbox"></div></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td style="padding-top: 15px;"><div class="threesixty-format"><b>VR Video Format:</b></div></td><td style="padding-top: 15px;">' +
                    '<div class="dropdown threesixty-format">' +
                    '<select id="vr-select" class="form-control"><option value="none">2D</option><option value="top-bottom">3D Top/Bottom</option><option value="left-right">3D Side By Side</option></select>' +
                    '</div>' +
                    '<div class="clear"></div>' +
                    '</td>' +
                    '</tr>' +
                    '</table>' +
                    '</div>' +
                    '<div id="platform-vod-configs-wrapper">' +
                    '<div class="platform-title" style="margin-top: 20px;">Social Media Platforms</div>' +
                    '<div class="platform-vod-config-wrapper">' +
                    //fb_row +
                    yt_row +
                    twch_row +
                    '</div>' +
                    '</div>' +
                    '</div>';
            $('#smh-modal .modal-body').html(content);
            $('#threesixty-video').bootstrapToggle({
                on: 'Yes',
                off: 'No'
            });
            if (stereo_mode) {
                $('#threesixty-video').bootstrapToggle('on');
                $('.threesixty-format').css('display', 'block');
                $('.vr-wrapper').css('height', '100px');
                $('#vr-select').val(stereo_mode);
            }
            $('#threesixty-video').change(function () {
                if ($(this).prop('checked')) {
                    $('.threesixty-format').css('display', 'block');
                    $('.vr-wrapper').css('height', '100px');
                } else {
                    $('.threesixty-format').css('display', 'none');
                    $('.vr-wrapper').css('height', '50px');
                }
            });

            $('#platform-configs .platform-vod-config-wrapper').mCustomScrollbar({
                theme: "inset-dark",
                scrollButtons: {
                    enable: true,
                },
                scrollbarPosition: "outside"
            });
            $('#youtube').bootstrapToggle();
            $('#facebook').bootstrapToggle();
            $('#twitch').bootstrapToggle();

            footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default smh-close" data-dismiss="modal">Close</button><button id="sn-vod-config" type="button" class="btn btn-primary" onclick="smhContent.doSnUpdate(\'' + eid + '\');">Update</button>';
            $('#smh-modal .modal-footer').html(footer);
        }
    },
    doSnUpdate: function (eid) {
        var youtube_status = false;
        var facebook_status = false;
        var twitch_status = false;
        var stereo_mode = null;
        if ($('#smh-modal #threesixty-video').prop('checked')) {
            stereo_mode = $('#smh-modal #vr-select').val();
        }
        if (yt_ready || fb_ready || twch_ready) {
            if (yt_ready) {
                youtube_status = ($('#smh-modal #youtube').prop('checked')) ? true : false;
            }
            if (fb_ready) {
                facebook_status = ($('#smh-modal #facebook').prop('checked')) ? true : false;
            }
            if (twch_ready) {
                twitch_status = ($('#smh-modal #twitch').prop('checked')) ? true : false;
            }
        }

        var snConfig = smhContent.createSnConfig(youtube_status, facebook_status, twitch_status);

        var sessData = {
            action: 'update_sn_vod_config',
            pid: sessInfo.pid,
            ks: sessInfo.ks,
            eid: eid,
            snConfig: snConfig,
            projection: 'rectangular',
            stereo_mode: stereo_mode
        }

        $.ajax({
            cache: false,
            url: SnApiUrl,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            beforeSend: function () {
                $('#smh-modal #loading img').css('display', 'inline-block');
                $('#smh-modal #sn-vod-config').attr('disabled', '');
            },
            success: function (data) {
                if (data['success']) {
                    smhContent.getEntries();
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Updated!</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal #sn-vod-config').removeAttr('disabled');
                    }, 3000);
                } else {
                    $('#smh-modal #loading img').css('display', 'none');
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Something went wrong</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal #sn-vod-config').removeAttr('disabled');
                    }, 3000);
                }
            }
        });
    },
    createSnConfig: function (youtube_status, facebook_status, twitch_status) {
        var snConfig = {};
        snConfig['platforms'] = [];
        snConfig['platforms'].push({
            platform: "youtube",
            status: youtube_status
        });
        snConfig['platforms'].push({
            platform: "facebook",
            status: facebook_status
        });
        snConfig['platforms'].push({
            platform: "twitch",
            status: twitch_status
        });
        return JSON.stringify(snConfig);
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
        if (streamerType == 'http') {
            flashvars.disableHLSOnJs = true;
        } else {
            flashvars.LeadHLSOnAndroid = true;
        }

        if (preview) {
            flashvars.ks = sessInfo.ks;
        }

        var cacheSt = smhContent.getCacheSt();
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
                thumbnailUrl: "http://mediaportal.streamingmediahosting.com/p/" + sessInfo.pid + "/sp/" + sessInfo.pid + "00/thumbnail/entry_id/" + entryId + "/width/120/height/90/bgcolor/000000/type/2",
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
    //ReImport Modal
    reImport: function (url, flavor_id) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '435px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Retry Import</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='text-align: center; margin: 27px 27px 0; height: 75px; width: 378px;'>There was an error trying to import this video.<br> Would you like to retry importing?</div>";

        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="retry-entry" onclick="smhContent.doReImport(\'' + url + '\',\'' + flavor_id + '\')">Retry</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Do reimport
    doReImport: function (url, flavor_id) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            $('#smh-modal').modal('hide');
            smhContent.getEntries();
        };
        $('#retry-entry').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        var contentResource = new KalturaUrlResource();
        contentResource.url = url;
        client.flavorAsset.setContent(cb, flavor_id, contentResource);
    },
    //Delete Entry Modal
    deleteEntry: function (id, name) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '435px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Delete</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='text-align: center; margin: 27px 27px 0; height: 75px; width: 378px;'>Are you sure you want to delete the following entry?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>(" + name + ")</div>";

        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="delete-entry" onclick="smhContent.removeEntry(\'' + id + '\')">Delete</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Do delete
    removeSmhEntry: function (id) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results == null) {
                smhContent.purgeCache('delete');
                $('#smh-modal').modal('hide');
                smhContent.getEntries();
            } else if (results.code && results.message) {
                alert(results.message);
                return;
            }
        };
        client.baseEntry.deleteAction(cb, id);
    },
    doDeleteSnEntry: function (eid) {
        var sessData = {
            action: 'delete_sn_entry',
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
                    smhContent.removeSmhEntry(eid);
                } else {
                    $('#smh-modal').modal('hide');
                    smhContent.getEntries();
                    alert(data['message']);
                }
            }
        });
    },
    removeEntry: function (id) {
        $('#delete-entry').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        if (services.sn == '1') {
            if (yt_ready || fb_ready || twch_ready) {
                smhContent.doDeleteSnEntry(id);
            } else {
                smhContent.removeSmhEntry(id);
            }
        } else {
            smhContent.removeSmhEntry(id);
        }
    },
    //Bulk Delete Modal
    bulkDeleteModal: function () {
        bulkdelete = new Array();
        var rowcollection = entriesTable.$(".entries-bulk:checked", {
            "page": "all"
        });
        rowcollection.each(function (index, elem) {
            var checkbox_value = $(elem).val().split(';');
            bulkdelete.push(checkbox_value[0]);
        });

        if (bulkdelete.length == 0) {
            smhContent.noEntrySelected();
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

            content = '<div style="padding-top: 25px; padding-bottom: 25px; text-align: center;">Are you sure you want to delete the selected entries?</div>';

            $('#smh-modal .modal-body').html(content);

            footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="delete-entries" onclick="smhContent.bulkDelete()">Delete</button>';
            $('#smh-modal .modal-footer').html(footer);
        }
    },
    doBulkDeleteSnEntries: function (eid) {
        var sessData = {
            action: 'delete_sn_entry',
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
            smhContent.purgeCache('delete');
            $('#smh-modal').modal('hide');
            smhContent.getEntries();
        };

        $('#delete-entries').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        client.startMultiRequest();
        $.each(bulkdelete, function (key, value) {
            if (services.sn == '1') {
                if (yt_ready || fb_ready || twch_ready) {
                    var snVodBulkResult = smhContent.doBulkDeleteSnEntries(value);
                    if (snVodBulkResult) {
                        client.baseEntry.deleteAction(cb, value);
                    }
                } else {
                    client.baseEntry.deleteAction(cb, value);
                }
            } else {
                client.baseEntry.deleteAction(cb, value);
            }
        });
        client.doMultiRequest(cb);
    },
    //Bulk Access Control modal
    bulkACModal: function () {
        bulkac = new Array();
        var rowcollection = entriesTable.$(".entries-bulk:checked", {
            "page": "all"
        });
        rowcollection.each(function (index, elem) {
            var checkbox_value = $(elem).val().split(';');
            bulkac.push(checkbox_value[0]);
        });

        if (bulkac.length == 0) {
            smhContent.noEntrySelected();
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

            footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="bulkac-entries" onclick="smhContent.bulkAC()">Apply</button>';
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
            smhContent.purgeCache('ac');
            $('#smh-modal').modal('hide');
            smhContent.getEntries();
        };

        $('#bulkac-entries').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        var ac = $('#smh-modal #ac-select').val();
        client.startMultiRequest();
        $.each(bulkac, function (key, value) {
            var baseEntry = new KalturaBaseEntry();
            baseEntry.accessControlId = ac;
            client.baseEntry.update(cb, value, baseEntry);
        });
        client.doMultiRequest(cb);
    },
    //Bulk Add Tags
    bulkTagsAddModal: function () {
        bulktags = new Array();
        var rowcollection = entriesTable.$(".entries-bulk:checked", {
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
            smhContent.noEntrySelected();
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

            footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="bulkaddtags-entries" onclick="smhContent.bulkAddTags()">Save</button>';
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
            smhContent.getEntries();
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

        $('#bulkaddtags-entries').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        client.startMultiRequest();
        $.each(bulktags, function (key, value) {
            var baseEntry = new KalturaBaseEntry();
            baseEntry.tags = value.value.join();
            client.baseEntry.update(cb, value.key, baseEntry);
        });
        client.doMultiRequest(cb);
    },
    //Bulk Remove Tags Modal
    bulkTagsRemoveModal: function () {
        bulktags = new Array();
        var tags_arr = [];
        var rowcollection = entriesTable.$(".entries-bulk:checked", {
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
            smhContent.noEntrySelected();
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

            footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="bulkremovetags-entries" onclick="smhContent.bulkRemoveTags()" disabled>Remove</button>';
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
            smhContent.getEntries();
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

        $('#bulkremovetags-entries').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        client.startMultiRequest();
        $.each(bulktags, function (key, value) {
            var baseEntry = new KalturaBaseEntry();
            baseEntry.tags = value.value.join();
            client.baseEntry.update(cb, value.key, baseEntry);
        });
        client.doMultiRequest(cb);
    },
    //Bulk add to categories modal
    bulkCatAddModal: function () {
        bulkcat = new Array();
        var rowcollection = entriesTable.$(".entries-bulk:checked", {
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
            smhContent.noEntrySelected();
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
                tree = smhContent.json_tree(categories, 'cat');
                apply_button = '<button type="button" class="btn btn-primary" id="bulkaddcats-entries" onclick="smhContent.bulkAddCats()">Apply</button>'
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
            smhContent.getEntries();
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

        $('#bulkaddcats-entries').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        client.startMultiRequest();
        $.each(bulkcat, function (key, value) {
            var baseEntry = new KalturaBaseEntry();
            baseEntry.categoriesIds = value.value.join(',');
            client.baseEntry.update(cb, value.key, baseEntry);
        });
        client.doMultiRequest(cb);
    },
    //Bulk remove categories modal
    bulkCatRemoveModal: function () {
        bulkcat = new Array();
        var cats_arr = [];
        var rowcollection = entriesTable.$(".entries-bulk:checked", {
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
            smhContent.noEntrySelected();
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

            footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="bulkremovecats-entries" onclick="smhContent.bulkRemoveCats()" disabled>Remove</button>';
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
            smhContent.getEntries();
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

        $('#bulkremovecats-entries').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        client.startMultiRequest();
        $.each(bulkcat, function (key, value) {
            var baseEntry = new KalturaBaseEntry();
            baseEntry.categories = value.value.join();
            client.baseEntry.update(cb, value.key, baseEntry);
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

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">No Entry Selected</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div style="padding-top: 15px; padding-bottom: 15px; text-align: center;">You must select an entry</div>';

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
                categories = smhContent.getNestedChildren(categories_arr, 0);
                smhContent.addCats();
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
                smhContent.addAC();
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
                smhContent.addFlavors();
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
                var children = smhContent.getNestedChildren(arr, arr[i].id)

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
                json = json + smhContent.json_tree(data[i].children, type);
            } else {
                json = json + '<li><div class="checkbox"><label><input type="checkbox" class="' + type + '_list" value="' + data[i].id + '" /> ' + data[i].name + '</label></div>';
            }
            json = json + '</li>';
        }
        return json + '</ul>';
    },
    //Adds filter categories
    addCats: function () {
        var tree = smhContent.json_tree(categories, 'cat');
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
            smhContent.getEntries();
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
                smhContent.getEntries();
            }, 100);
        });
    },
    //Adds Access Control Filter
    addAC: function () {
        var tree_ac = smhContent.json_tree(ac, 'ac');
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
            smhContent.getEntries();
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
            smhContent.getEntries();
        });
    },
    //Adds Access Control Filter
    addFlavors: function () {
        var tree_flavor = smhContent.json_tree(flavors, 'flavors');
        $('.flavors-filter').html(tree_flavor);
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
        $('#users-buttons .dropdown-filter #tree2').on('change', ".flavors_all", function () {
            if ($(this).is(":checked")) {
                $('#users-buttons .dropdown-filter .flavors-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            flavors_filter = [];
            smhContent.getEntries();
        });
        $('#users-buttons .dropdown-filter #tree2').on('click', ".flavors_list", function () {
            var anyBoxesChecked = false;
            flavors_filter = [];
            $('#users-buttons .dropdown-filter .flavors-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    flavors_filter.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#users-buttons .dropdown-filter .flavors_all').prop('checked', false);
            } else {
                $('#users-buttons .dropdown-filter .flavors_all').prop('checked', true);
            }
            smhContent.getEntries();
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
    resetClipModal: function () {
        $('#smh-modal .modal-header').empty();
        $('#smh-modal .modal-body').empty();
        $('#smh-modal .modal-footer').empty();
        $('#smh-modal .modal-content').css('min-height', '');
        $('#smh-modal .smh-dialog2').css('width', '');
        $('#smh-modal .modal-body').css('height', '');
        $('#smh-modal .modal-body').css('padding', '15px');
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
        var cat_select = ($.inArray("CONTENT_MANAGE_ASSIGN_CATEGORIES", sessPerm) != -1) ? 'onclick="smhContent.selectCat();"' : '';

        name = name.replace(/"/g, '&quot;');
        desc = desc.replace(/"/g, '&quot;');

        header = '<button type="button" class="close smh-close edit-entry-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Metadata</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<form id="edit-entry-form">' +
                '<div class="row">' +
                '<div class="col-sm-8 center-block">' +
                '<table width="100%" border="0" id="entry-edit-table">' +
                '<tr>' +
                '<td style="width: 151px;"><span class="required" style="font-weight: normal;">Name:</span></td><td><input type="text" name="entry_name" id="entry_name" class="form-control" value="' + name + '" placeholder="Enter a name"></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Description:</span></td><td><input type="text" name="entry_desc" id="entry_desc" class="form-control" placeholder="Enter a description" value="' + desc + '" ' + metadata_disable + '></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Tags:</span></td><td><input type="text" name="entry_tags" id="entry_tags" class="form-control" placeholder="Enter tags separated by commas" value="' + tags + '" ' + metadata_disable + '></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Reference ID:</span></td><td><input type="text" name="entry_ref" id="entry_ref" class="form-control" placeholder="Enter a reference ID" value="' + refid + '" ' + refid_disable + '></td>' +
                '</tr>' +
                '<tr>' +
                '<td><span style="font-weight: normal;">Categories: <i class="fa fa-external-link" ' + cat_select + '></i></span></td><td><input type="text" name="entry_cat" id="entry_cat" class="form-control" placeholder="Enter categories separated by commas" value="' + cats + '" ' + cat_disable + '></td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '</form>';

        $('#smh-modal .modal-body').html(content);

        $('#ac-select').val(ac);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default edit-entry-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="edit-entry" onclick="smhContent.updateMetadata(\'' + id + '\')">Update</button>';
        $('#smh-modal .modal-footer').html(footer);

        $('#edit-entry-form input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
        validator = $("#edit-entry-form").validate({
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
                entry_name: "required"
            },
            messages: {
                entry_name: "Please enter a name"
            }
        });
    },
    displayUpdatedMetadataResponse: function () {
        var purgeResponse = smhContent.purgeCache('metadata');
        if (purgeResponse) {
            $('#smh-modal #loading img').css('display', 'none');
            $('#smh-modal #pass-result').html('<span class="label label-success">Metadata Successfully Updated!</span>');
        } else {
            $('#smh-modal #loading img').css('display', 'none');
            $('#smh-modal #pass-result').html('<span class="label label-danger">Error: Could not purge cache</span>');
        }
        setTimeout(function () {
            $('#smh-modal #pass-result').empty();
            $('#edit-entry').removeAttr('disabled');
        }, 3000);
        smhContent.getEntries();
    },
    doUpdateSnMetaData: function (eid, name, desc) {
        var sessData = {
            action: 'update_vod_sn_metadata',
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
                    smhContent.displayUpdatedMetadataResponse();
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
                    if (yt_ready || fb_ready || twch_ready) {
                        smhContent.doUpdateSnMetaData(results.id, results.name, results.description);
                    } else {
                        smhContent.displayUpdatedMetadataResponse();
                    }
                } else {
                    smhContent.displayUpdatedMetadataResponse();
                }
            };

            $('#smh-modal #loading img').css('display', 'inline-block');
            $('#edit-entry').attr('disabled', '');
            var name = $('#smh-modal #entry_name').val();
            var desc = $('#smh-modal #entry_desc').val();
            var tags = $('#smh-modal #entry_tags').val();
            var ref = $('#smh-modal #entry_ref').val();
            var cat = $('#smh-modal #entry_cat').val();

            var baseEntry = new KalturaBaseEntry();
            if (!(typeof ref === "undefined") && !(ref === null) && ref.length > 0) {
                baseEntry.referenceId = ref;
            }

            baseEntry.name = name;
            baseEntry.description = desc;
            baseEntry.tags = tags;
            baseEntry.categories = cat;
            client.baseEntry.update(cb, id, baseEntry);
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

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="edit-ac" onclick="smhContent.updateAC(\'' + id + '\')">Update</button>';
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

            var purgeResponse = smhContent.purgeCache('ac');
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
            smhContent.getEntries();
        };

        $('#smh-modal #loading img').css('display', 'inline-block');
        $('#edit-ac').attr('disabled', '');
        var ac = $('#smh-modal #ac-select').val();

        var baseEntry = new KalturaBaseEntry();
        baseEntry.accessControlId = ac;
        client.baseEntry.update(cb, id, baseEntry);
    },
    //Edit Thumbnail Modal
    editThumbnail: function (id, type) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '800px');
        $('#smh-modal .modal-body').css('height', '615px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        var grab_thumb = '';
        if (type == 'Video') {
            grab_thumb = '<li role="presentation"><a onclick="smhContent.grabFromVideo(\'' + id + '\')" href="#" tabindex="-1" role="menuitem">Grab from Video</a></li>';
        }

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
                '<li role="presentation"><a onclick="smhContent.uploadThumb(\'' + id + '\')" href="#" tabindex="-1" role="menuitem">Upload</span></a></li>' +
                grab_thumb +
                '</ul>' +
                '</div>' +
                '</div>' +
                '<span id="status" style="float: left; margin-top: 4px; margin-left: 18px;"><div id="loading"><img height="20px" src="/img/loading.gif"></div></span><div id="thumb-table" style="padding-top: 39px;"></div>';

        $('#smh-modal .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
        smhContent.loadThumbs(id);
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
                            '<li role="presentation"><a onclick="smhContent.setThumbdefault(\'' + value['id'] + '\',\'' + id + '\')" tabindex="-1" role="menuitem">Set as Default</a></li>' +
                            '<li role="presentation"><a href="http://mediaplatform.streamingmediahosting.com/api_v3/service/thumbAsset/action/serve/thumbAssetId/' + value['id'] + '/options:download/true" tabindex="-1" role="menuitem">Download</a></li>' +
                            '<li role="presentation"><a onclick="smhContent.deleteThumbModal(\'' + value['id'] + '\',\'' + id + '\')" tabindex="-1" role="menuitem">Delete</a></li>' +
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
    //Set thumbnail as default
    setThumbdefault: function (thumb_id, entry_id) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results == null) {
                smhContent.purgeCache('thumbnail');
                $('#thumb-data_processing').css('display', 'none');
                smhContent.loadThumbs(entry_id);
                smhContent.getEntries();
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
        smhContent.resetModal();
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

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="edit-ac" onclick="smhContent.deleteThumb(\'' + thumb_id + '\',\'' + entry_id + '\')">Delete</button>';
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
                smhContent.loadThumbs(entry_id);
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
    //Grab thumbnail from video
    grabFromVideo: function (vid) {
        var header, content, footer;
        var pid = sessInfo.pid;
        entryId = vid;
        var uiconf_id = '6709431';
        var width = '350';
        var height = '300';
        //var thumbPlayer = smhContent.getThumbPlayerEmbed(pid, vid, width, height, uiconf_id);
        var player_prev_gen, player_prev;
        var delivery = 'hls';
        var embed = 'dynamic';
        var seo = false;
        var name = '';
        var sizing = 'fixed';
        var ratio = '16:9';


        $('.smh-dialog2').css('width', '512px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '2');

        header = '<button type="button" class="close smh-close2 grab-thumb-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Grab From Video</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = '<div style="width: 445px; margin-left: auto; margin-right: auto;"><div style="width: 350px; margin-left: auto; margin-right: auto;"><div id="thumbPreviewIframe"></div><div style="font-size: 12px; padding: 10px;">Pause the video on the appropriate frame and click the thumbnail capture button</div></div>';
        $('#smh-modal2 .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close2 grab-thumb-close" data-dismiss="modal">Close</button>';
        $('#smh-modal2 .modal-footer').html(footer);

        player_prev_gen = smhContent.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
        player_prev = player_prev_gen.getCode();
        smhContent.generateThumbIframe(player_prev);
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
    //Embeds thumbnail capture widget
    getThumbPlayerEmbed: function (pid, entryId, width, height, uiconf_id) {
        var widget = '';
        widget += '<div id="kcw-thumb-capture"></div><script type="text/javascript">' +
                'var params = {' +
                'allowScriptAccess: "always",' +
                'allowNetworking: "all",' +
                'wmode: "opaque"' +
                '};' +
                'var flashVars = {' +
                'uid : "' + sessInfo.Id + '",' +
                'partnerId : "' + pid + '",' +
                'subpId : "' + pid + '00",' +
                'ks : "' + sessInfo.ks + '",' +
                'entryId : "' + entryId + '"' +
                '};' +
                'swfobject.embedSWF("/kwidget/wid/_' + sessInfo.pid + '/ui_conf_id/' + uiconf_id + '/nowrapper/1/a", "kcw-thumb-capture", "' + width + '", "' + height + '", "9.0.0", "expressInstall.swf", flashVars, params);' +
                '</script>';
        return widget;
    },
    //Closes Modal
    closeModal: function () {
        $('#smh-modal').modal('hide');
    },
    //Select categories modal
    selectCat: function () {
        smhContent.resetModal();
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
            tree = smhContent.json_tree(categories, 'cat');
            apply_button = '<button type="button" class="btn btn-primary" onclick="smhContent.applyCat();">Apply</button>'
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
        $('#entry_cat').val(catIDs.join(','));
        $('#smh-modal2 .smh-close2').click();
    },
    //View Player Statistics
    viewStats: function (id, name, desc, tags, duration, date) {
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
        $('#entries-table-wrapper').html('<div id="table-header" class="col-md-12">' +
                '<div class="row">' +
                '<div class="col-md-3 col-sm-6 col-xs-12">' +
                '<div class="pull-left"><button onclick="smhContent.returnTable();" class="btn btn-block bg-olive pull-right"><i class="fa fa-reply"></i> View All Entries</button></div>' +
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
                '<td><b>Duration:</b></td><td>' + duration + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Created On:</b></td><td>' + date + '</td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-12">' +
                '<h2 class="page-header stats-header">Statistics</h2>' +
                '</div>' +
                '<div class="col-md-12">' +
                '<div class="row">' +
                '<div class="pull-right" style="padding-right: 15px;"><button onclick="window.location=\'player_stats/content_reports\'" class="btn btn-block bg-olive pull-right">View All Reports</button></div>' +
                '<div style="margin-left: auto; margin-right: auto; margin-top: 10px; padding-left: 15px; padding-right: 15px;" class="tabbable tabs-left">' +
                '<ul id="myTab" class="nav nav-tabs">' +
                '<li class="active"><a data-toggle="tab" href="#top-content">Viewer Engagement</a></li>' +
                '<li><a data-toggle="tab" href="#content-dropoff">Drop-off</a></li>' +
                '</ul>' +
                '<div style="margin: 15px auto;" class="tab-content">' +
                '<div class="tab-pane active" id="top-content">' +
                '<div class="col-md-12">' +
                '<div class="row">' +
                '<div class="col-md-10 col-sm-6 col-xs-12">' +
                '<span id="date-range" class="dropdown header">' +
                '<div class="date-range-sub">' +
                '<span id="datesrange-title">Date Range:</span><div class="btn-group"><button class="btn btn-default filter-btn" style="width: 138px;" type="button"><span class="text">Last 30 days</span></button><button aria-expanded="true" data-toggle="dropdown" id="dropdownMenu" type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button>' +
                '<ul aria-labelledby="dropdownMenu" role="menu" id="menu1" class="dropdown-menu">' +
                '<li role="presentation"><a onclick="smhContent.loadYesterdayGraph(\'top_content\',\'count_plays\',\'vod\');" tabindex="-1" role="menuitem">Yesterday</a></li>' +
                '<li role="presentation"><a onclick="smhContent.loadLastSevenDaysGraph(\'top_content\',\'count_plays\',\'vod\');" tabindex="-1" role="menuitem">Last 7 days</a></li>' +
                '<li role="presentation"><a onclick="smhContent.loadThisWeekGraph(\'top_content\',\'count_plays\',\'vod\');" tabindex="-1" role="menuitem">This week</a></li>' +
                '<li role="presentation"><a onclick="smhContent.loadLastWeekGraph(\'top_content\',\'count_plays\',\'vod\');" tabindex="-1" role="menuitem">Last week</a></li>' +
                '<li role="presentation"><a onclick="smhContent.loadLastThirtyDaysGraph(\'top_content\',\'count_plays\',\'vod\');" tabindex="-1" role="menuitem">Last 30 days</a></li>' +
                '<li role="presentation"><a onclick="smhContent.loadThisMonthGraph(\'top_content\',\'count_plays\',\'vod\');" tabindex="-1" role="menuitem">This month</a></li>' +
                '<li role="presentation"><a onclick="smhContent.loadLastMonthGraph(\'top_content\',\'count_plays\',\'vod\');" tabindex="-1" role="menuitem">Last month</a></li>' +
                '<li role="presentation"><a onclick="smhContent.loadLastTwelveMonthGraph(\'top_content\',\'count_plays\',\'vod\');" tabindex="-1" role="menuitem">Last 12 months</a></li>' +
                '<li role="presentation"><a onclick="smhContent.loadThisYearGraph(\'top_content\',\'count_plays\',\'vod\');" tabindex="-1" role="menuitem">This year</a></li>' +
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
                '</div>' +
                '</span>' +
                '</div>' +
                '<div class="col-md-2 col-sm-6 col-xs-12">' +
                '<div class="pull-right" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhContent.exportCSV(\'top_content\')">Export to CSV <img height="20px" src="/img/xls-icon.jpg" /></a></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-12" id="top_content-graph">' +
                '<span class="dropdown header">' +
                '<div class="btn-group">' +
                '<button class="btn btn-default dropdown-text" type="button"><span class="text">Plays</span></button>' +
                '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-expanded="true"><span class="caret"></span></button>' +
                '<ul class="dropdown-menu" id="menu1" role="menu" aria-labelledby="dropdownMenu">' +
                '<li role="presentation"><a role="menuitem" tabindex="-1">Plays</a></li>' +
                '<li role="presentation"><a role="menuitem" tabindex="-1">Minutes Viewed</a></li>' +
                '<li role="presentation"><a role="menuitem" tabindex="-1">Avg. View Time</a></li>' +
                '<li role="presentation"><a role="menuitem" tabindex="-1">Player Impressions</a></li>' +
                '</ul>' +
                '</div>' +
                '</span>&nbsp;&nbsp;&nbsp;<span id="graph-loading1">Loading..</span>' +
                '<div id="vod-line-graph"></div>' +
                '</div>' +
                '<div class="col-md-12">' +
                '<h2 class="page-header">Totals</h2>' +
                '</div>' +
                '<div class="col-md-12" style="margin-bottom: 50px;">' +
                '<div class="col-sm-2 col-xs-6">' +
                '<div class="description-block border-right">' +
                '<span class="description-percentage text-green">Plays</span>' +
                '<h5 class="description-header" id="plays">0</h5>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-2 col-xs-6">' +
                '<div class="description-block border-right">' +
                '<span class="description-percentage text-yellow">Minutes Viewed</span>' +
                '<h5 class="description-header" id="minutes">00:00</h5>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-2 col-xs-6">' +
                '<div class="description-block border-right">' +
                '<span class="description-percentage text-green">Avg. View Time</span>' +
                '<h5 class="description-header" id="time">00:00</h5>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-2 col-xs-6">' +
                '<div class="description-block border-right">' +
                '<span class="description-percentage text-red">Player Impressions</span>' +
                '<h5 class="description-header" id="impressions">0</h5>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-2 col-xs-6">' +
                '<div class="description-block border-right">' +
                '<span class="description-percentage text-green">Play to Impressions Ratio</span>' +
                '<h5 class="description-header" id="ratio">0.00%</h5>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-2 col-xs-6">' +
                '<div class="description-block">' +
                '<span class="description-percentage text-orange">Avg. View Drop-off</span>' +
                '<h5 class="description-header" id="drop">0.00%</h5>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="tab-pane" id="content-dropoff">' +
                '<div class="col-md-12">' +
                '<div class="row">' +
                '<div class="col-md-10 col-sm-6 col-xs-12">' +
                '<span id="date-range" class="dropdown header">' +
                '<div class="date-range-sub">' +
                '<span id="datesrange-title">Date Range:</span><div class="btn-group"><button class="btn btn-default filter-btn" style="width: 138px;" type="button"><span class="text">Last 30 days</span></button><button aria-expanded="true" data-toggle="dropdown" id="dropdownMenu" type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button>' +
                '<ul aria-labelledby="dropdownMenu" role="menu" id="menu2" class="dropdown-menu">' +
                '<li role="presentation"><a onclick="smhContent.loadYesterdayGraph(\'content_dropoff\',\'count_plays\',\'vod-bar\');" tabindex="-1" role="menuitem">Yesterday</a></li>' +
                '<li role="presentation"><a onclick="smhContent.loadLastSevenDaysGraph(\'content_dropoff\',\'count_plays\',\'vod-bar\');" tabindex="-1" role="menuitem">Last 7 days</a></li>' +
                '<li role="presentation"><a onclick="smhContent.loadThisWeekGraph(\'content_dropoff\',\'count_plays\',\'vod-bar\');" tabindex="-1" role="menuitem">This week</a></li>' +
                '<li role="presentation"><a onclick="smhContent.loadLastWeekGraph(\'content_dropoff\',\'count_plays\',\'vod-bar\');" tabindex="-1" role="menuitem">Last week</a></li>' +
                '<li role="presentation"><a onclick="smhContent.loadLastThirtyDaysGraph(\'content_dropoff\',\'count_plays\',\'vod-bar\');" tabindex="-1" role="menuitem">Last 30 days</a></li>' +
                '<li role="presentation"><a onclick="smhContent.loadThisMonthGraph(\'content_dropoff\',\'count_plays\',\'vod-bar\');" tabindex="-1" role="menuitem">This month</a></li>' +
                '<li role="presentation"><a onclick="smhContent.loadLastMonthGraph(\'content_dropoff\',\'count_plays\',\'vod-bar\');" tabindex="-1" role="menuitem">Last month</a></li>' +
                '<li role="presentation"><a onclick="smhContent.loadLastTwelveMonthGraph(\'content_dropoff\',\'count_plays\',\'vod-bar\');" tabindex="-1" role="menuitem">Last 12 months</a></li>' +
                '<li role="presentation"><a onclick="smhContent.loadThisYearGraph(\'content_dropoff\',\'count_plays\',\'vod-bar\');" tabindex="-1" role="menuitem">This year</a></li>' +
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
                '<input type="text" class="date-picker3 form-control" id="date-picker-3">' +
                '</div>' +
                '</span>' +
                '</div>' +
                '<div class="date-range-sub">' +
                '<span id="custom-dates">To' +
                '<div class="input-group" style="margin-left: 15px;">' +
                '<div class="input-group-addon">' +
                '<i class="fa fa-calendar"></i>' +
                '</div>' +
                '<input type="text" class="date-picker4 form-control" id="date-picker-4">' +
                '</div>' +
                '<span id="graph-loading2"></span>' +
                '</div>' +
                '</span>' +
                '</div>' +
                '<div class="col-md-2 col-sm-6 col-xs-12">' +
                '<div class="pull-right" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhContent.exportCSV(\'content_dropoff\')">Export to CSV <img height="20px" src="/img/xls-icon.jpg" /></a></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-12" id="content_dropoff-graph">' +
                '<div id="vod-bar-graph"></div>' +
                '</div>' +
                '<div class="col-md-12">' +
                '<h2 class="page-header">Totals</h2>' +
                '</div>' +
                '<div class="col-md-12" style="margin-bottom: 50px;">' +
                '<div class="col-sm-2 col-xs-6">' +
                '<div class="description-block border-right">' +
                '<span class="description-percentage text-green">Plays</span>' +
                '<h5 class="description-header" id="plays">0</h5>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-2 col-xs-6">' +
                '<div class="description-block border-right">' +
                '<span class="description-percentage text-yellow">25% Play-through</span>' +
                '<h5 class="description-header" id="tweentyfive">0</h5>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-2 col-xs-6">' +
                '<div class="description-block border-right">' +
                '<span class="description-percentage text-green">50% Play-through</span>' +
                '<h5 class="description-header" id="fifty">0</h5>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-2 col-xs-6">' +
                '<div class="description-block border-right">' +
                '<span class="description-percentage text-red">75% Play-through</span>' +
                '<h5 class="description-header" id="seventyfive">0</h5>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-2 col-xs-6">' +
                '<div class="description-block border-right">' +
                '<span class="description-percentage text-green">100% Play-through</span>' +
                '<h5 class="description-header" id="onehundred">0</h5>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-2 col-xs-6">' +
                '<div class="description-block">' +
                '<span class="description-percentage text-orange">Play-through Ratio</span>' +
                '<h5 class="description-header" id="ratio">0.00%</h5>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
        player_prev_gen = smhContent.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
        player_prev = player_prev_gen.getCode();
        smhContent.generateThumbIframe(player_prev);

        $('.tabbable .nav-tabs a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var target = $(e.target).attr("href") // activated tab
            active_tab = target;
            if (active_tab == '#content-dropoff') {
                if (!dropOff_stats) {
                    bargraph_entryId = id;
                    $(".date-picker3").datepicker();
                    $(".date-picker4").datepicker();
                    smhContent.createAreaGraphInstance('vod-bar-graph');
                    smhContent.loadLastThirtyDaysGraph('content_dropoff', 'count_plays', 'vod-bar');
                    dropOff_stats = true;
                }
            }
        });
        $('.tabbable .nav-tabs a[data-toggle="tab"]:first').trigger("shown.bs.tab");

        graph_entryId = id;
        $(".date-picker1").datepicker();
        $(".date-picker2").datepicker();
        smhContent.createAreaGraphInstance('vod-line-graph');
        smhContent.loadLastThirtyDaysGraph('top_content', 'count_plays', 'vod');
    },
    //Creates area graph instance
    createAreaGraphInstance: function (id) {
        if (id == 'vod-line-graph') {
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
        } else if (id == 'vod-bar-graph') {
            graph2 = Morris.Bar({
                element: id,
                xkey: 'barX',
                ykeys: ['value'],
                labels: ['value'],
                hideHover: 'auto',
                barColors: ['#41817C'],
                fillOpacity: 0.4,
                resize: true
            });
        }
    },
    //Gets time offset
    getOffset: function () {
        var dt = new Date();
        var tz = dt.getTimezoneOffset();
        return tz;
    },
    //Formats bar graph data
    formatBarData: function (data) {
        var temp = data.split(';');
        var formatedData = [];
        for (var index = 0; index < temp.length - 2; ++index) {
            var barData = temp[index].split(',');
            var title = '';
            if (barData[0] == 'count_plays') {
                title = 'Plays';
            } else if (barData[0] == 'count_plays_25') {
                title = '25% Play-through';
            } else if (barData[0] == 'count_plays_50') {
                title = '50% Play-through';
            } else if (barData[0] == 'count_plays_75') {
                title = '75% Play-through';
            } else if (barData[0] == 'count_plays_100') {
                title = '100% Play-through';
            }

            formatedData.push({
                barX: title,
                value: barData[1]
            });

        }
        return formatedData;
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
            if (!smhContent.inArray(data, date)) {
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
            var result1 = smhContent.insert(dateData, 4, "-");
            var result2 = smhContent.insert(result1, 7, "-");
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
    convertToHHMM: function (secs) {
        secs = Math.floor(secs * 60);
        var h = Math.floor(secs / 3600);
        var sh = h * 3600;
        var m = Math.floor((secs - sh) / 60);
        var sm = m * 60;
        var s = secs - sh - sm;

        return ((h < 10) && (h > 0) ? "0" + h + ':' : ((h == 0) ? "" : h + ':')) + ((m < 10) && (m > 0) ? "0" + m + ':' : ((m == 0) ? "00:" : m + ':')) + ((s < 10) && (s > 0) ? "0" + s : ((s == 0) ? "00" : s));
    },
    //Gets total plays
    getTotalPlays: function (from, to, type, entry) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }

            var i, count_plays, count_loads, count_plays_25, count_plays_50, count_plays_75, count_plays_100;
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

            if (type == 'top_content') {
                if (totals.count_loads == '' || totals.count_loads == null) {
                    count_loads = 0
                } else {
                    count_loads = smhContent.format(totals.count_loads);
                }
                $('#top-content #plays').html(smhContent.format(count_plays));
                $('#top-content #minutes').html(smhContent.convertToHHMM(Number(totals.sum_time_viewed)));
                $('#top-content #time').html(smhContent.convertToHHMM(Number(totals.avg_time_viewed)));
                $('#top-content #impressions').html(smhContent.format(count_loads));
                $('#top-content #ratio').html((totals.load_play_ratio * 100).toFixed(2) + '%');
                $('#top-content #drop').html((totals.avg_view_drop_off * 100).toFixed(2) + '%');
            } else {
                if (totals.count_plays_25 == '' || totals.count_plays_25 == null) {
                    count_plays_25 = 0
                } else {
                    count_plays_25 = smhContent.format(totals.count_plays_25);
                }
                if (totals.count_plays_50 == '' || totals.count_plays_50 == null) {
                    count_plays_50 = 0
                } else {
                    count_plays_50 = smhContent.format(totals.count_plays_50);
                }
                if (totals.count_plays_75 == '' || totals.count_plays_75 == null) {
                    count_plays_75 = 0
                } else {
                    count_plays_75 = smhContent.format(totals.count_plays_75);
                }
                if (totals.count_plays_100 == '' || totals.count_plays_100 == null) {
                    count_plays_100 = 0
                } else {
                    count_plays_100 = smhContent.format(totals.count_plays_100);
                }
                $('#content-dropoff #plays').html(smhContent.format(count_plays));
                $('#content-dropoff #tweentyfive').html(count_plays_25);
                $('#content-dropoff #fifty').html(count_plays_50);
                $('#content-dropoff #seventyfive').html(count_plays_75);
                $('#content-dropoff #onehundred').html(count_plays_100);
                $('#content-dropoff #ratio').html((totals.play_through_ratio * 100).toFixed(2) + '%');
            }

        };

        var offset = smhContent.getOffset();
        var reportType, objectIds;
        if (type == 'top_content') {
            reportType = KalturaReportType.TOP_CONTENT;
        } else if (type == 'content_dropoff') {
            reportType = KalturaReportType.CONTENT_DROPOFF;
        }

        if (entry == null) {
            objectIds = null;
        } else {
            objectIds = entry;
        }

        var reportInputFilter = new KalturaReportInputFilter();
        reportInputFilter.fromDay = from;
        reportInputFilter.toDay = to;
        reportInputFilter.searchInTags = true;
        reportInputFilter.searchInAdminTags = true;
        reportInputFilter.timeZoneOffset = offset;
        client.report.getTotal(cb, reportType, reportInputFilter, objectIds);
    },
    //Gets Graph data
    getGraphData: function (days_from_today, from, to, days, type, dimension, entryId) {
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

            if (type == 'content_dropoff') {
                data = smhContent.formatBarData(totals['content_dropoff']);
                graph2.setData(data);
            } else {
                var button_text;
                var label = '';
                button_text = $('.dropdown-text').text();

                count_plays = totals.count_plays;
                sum_time_viewed = totals.sum_time_viewed;
                avg_time_viewed = totals.avg_time_viewed;
                count_loads = totals.count_loads;
                if (button_text == 'Plays') {
                    label = 'Plays';
                    if (count_plays) {
                        graphData = smhContent.formatDateRange(count_plays);
                    } else if (count_plays == null || count_plays == '') {
                        dataString = from + '00,0;' + to + '00,0;';
                        count_plays = dataString;
                        graphData = smhContent.formatDateRange(count_plays);
                    }
                } else if (button_text == 'Minutes Viewed') {
                    label = 'Minutes';
                    if (sum_time_viewed) {
                        graphData = smhContent.formatDateRange(sum_time_viewed);
                    } else if (sum_time_viewed == null || sum_time_viewed == '') {
                        dataString = from + '00,0;' + to + '00,0;';
                        sum_time_viewed = dataString;
                        graphData = smhContent.formatDateRange(sum_time_viewed);
                    }
                } else if (button_text == 'Avg. View Time') {
                    label = 'Minutes';
                    if (avg_time_viewed) {
                        graphData = smhContent.formatDateRange(avg_time_viewed);
                    } else if (avg_time_viewed == null || avg_time_viewed == '') {
                        dataString = from + '00,0;' + to + '00,0;';
                        avg_time_viewed = dataString;
                        graphData = smhContent.formatDateRange(avg_time_viewed);
                    }
                } else if (button_text == 'Player Impressions') {
                    label = 'Impressions';
                    if (count_loads) {
                        graphData = smhContent.formatDateRange(count_loads);
                    } else if (count_loads == null || count_loads == '') {
                        dataString = from + '00,0;' + to + '00,0;';
                        count_loads = dataString;
                        graphData = smhContent.formatDateRange(count_loads);
                    }
                }
                preGraphData = smhContent.generalDate(graphData, days, days_from_today);
                data = smhContent.formatLineData(preGraphData);
                graph1.options.labels = [label];
                graph1.setData(data);
            }

            $('#graph-loading1').empty();
            $('#graph-loading2').empty();
        };
        days_glbl = days;
        days_from_today_glbl = days_from_today;

        var reportType;
        var offset = smhContent.getOffset();
        if (type == 'top_content') {
            reportType = KalturaReportType.TOP_CONTENT;
        } else if (type == 'content_dropoff') {
            reportType = KalturaReportType.CONTENT_DROPOFF;
        }
        var reportInputFilter = new KalturaReportInputFilter();
        reportInputFilter.fromDay = from;
        reportInputFilter.toDay = to;
        reportInputFilter.searchInTags = true;
        reportInputFilter.searchInAdminTags = true;
        reportInputFilter.timeZoneOffset = offset;
        client.report.getGraphs(cb, reportType, reportInputFilter, dimension, entryId);
    },
    //Export CSV
    exportCSV: function (type) {
        var date1, date2, split1, split2, from, to, offset, reportTitle, reportText, headers, reportType, reportInputFilter, dimension, pager, order, objectIds, cb;
        if (type == 'top_content') {
            cb = function (success, results) {
                if (!success)
                    alert(results);

                if (results.code && results.message) {
                    alert(results.message);
                    return;
                }
                $('#top-content #loading img').css('display', 'none');
                window.location = results;
            };

            $('#top-content #loading img').css('display', 'inline-block');
            date1 = $('#date-picker-1').val();
            date2 = $('#date-picker-2').val();
            split1 = date1.split("/");
            split2 = date2.split("/");
            from = split1[2] + split1[0] + split1[1];
            to = split2[2] + split2[0] + split2[1];
            offset = smhContent.getOffset();
            reportTitle = "Top Content";
            reportText = "";
            headers = "Plays,Minutes Viewed,Avg. View Time,Player Impressions,Play to Impression Ratio,Avg. View Drop-off;Object Id,Entry Name,Plays,Minutes Viewed,Avg. View Time,Player Impressions,Play to Impression Ratio,Avg. View Drop-off";
            reportType = KalturaReportType.TOP_CONTENT;
            reportInputFilter = new KalturaReportInputFilter();
            reportInputFilter.fromDay = from;
            reportInputFilter.toDay = to;
            reportInputFilter.timeZoneOffset = offset;
            dimension = "count_plays";
            pager = new KalturaFilterPager();
            pager.pageSize = pageSize;
            pager.pageIndex = 1;
            order = "count_plays";
            objectIds = graph_entryId;
            client.report.getUrlForReportAsCsv(cb, reportTitle, reportText, headers, reportType, reportInputFilter, dimension, pager, order, objectIds);
        } else if (type == 'content_dropoff') {
            cb = function (success, results) {
                if (!success)
                    alert(results);

                if (results.code && results.message) {
                    alert(results.message);
                    return;
                }
                $('#content-dropoff #loading img').css('display', 'none');
                window.location = results;
            };

            $('#content-dropoff #loading img').css('display', 'inline-block');
            date1 = $('#date-picker-3').val();
            date2 = $('#date-picker-4').val();
            split1 = date1.split("/");
            split2 = date2.split("/");
            from = split1[2] + split1[0] + split1[1];
            to = split2[2] + split2[0] + split2[1];
            offset = smhContent.getOffset();
            reportTitle = "Content Drop-off";
            reportText = "";
            headers = "Plays,25% Play-through,50% Play-through,75% Play-through,100% Play-through,Play-through Ratio;Object Id,Entry Name,Plays,25% Play-through,50% Play-through,75% Play-through,100% Play-through,Play-through Ratio";
            reportType = KalturaReportType.CONTENT_DROPOFF;
            reportInputFilter = new KalturaReportInputFilter();
            reportInputFilter.fromDay = from;
            reportInputFilter.toDay = to;
            reportInputFilter.timeZoneOffset = offset;
            dimension = "content_dropoff";
            pager = new KalturaFilterPager();
            pager.pageSize = pageSize;
            pager.pageIndex = 1;
            order = "count_plays";
            objectIds = bargraph_entryId;
            client.report.getUrlForReportAsCsv(cb, reportTitle, reportText, headers, reportType, reportInputFilter, dimension, pager, order, objectIds);
        }
    },
    //Export Metadata
    exportMetaData: function () {
        if (total_entries) {
            window.location = '/apps/platform/metadata/export.metadata.php?pid=' + sessInfo.pid + '&ks=' + sessInfo.ks + '&page_size=' + total_entries + '&action=export_entries_metadata';
        }
    },
    //Load yesterday graph
    loadYesterdayGraph: function (reportType, dimension, graph) {
        $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
        $('#graph-loading2').html('<img src="/img/chart-loading.gif" height="20px" />');
        var days = 1;
        var from = Date.today().add(-days).days().toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");
        var from_calendar = Date.today().add(-days).days().toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy");
        if (graph == 'vod') {
            $('#date-picker-1').val(from_calendar);
            $('#date-picker-2').val(to_calendar);
        } else if (graph == 'vod-bar') {
            $('#date-picker-3').val(from_calendar);
            $('#date-picker-4').val(to_calendar);
        }
        var days_from_today = days;

        if (active_tab == '#top-content') {
            smhContent.getGraphData(days_from_today, from, to, days, reportType, dimension, graph_entryId);
            smhContent.getTotalPlays(from, to, reportType, graph_entryId);
        } else if (active_tab == '#content-dropoff') {
            smhContent.getGraphData(days_from_today, from, to, days, reportType, dimension, bargraph_entryId);
            smhContent.getTotalPlays(from, to, reportType, bargraph_entryId);
        }
    },
    ///Load last 7 days graph
    loadLastSevenDaysGraph: function (reportType, dimension, graph) {
        $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
        $('#graph-loading2').html('<img src="/img/chart-loading.gif" height="20px" />');
        var days = 7;
        var from = Date.today().addDays(-days).toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");
        var from_calendar = Date.today().add(-days).days().toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy");
        var days_from_today = days;
        if (graph == 'vod') {
            $('#date-picker-1').val(from_calendar);
            $('#date-picker-2').val(to_calendar);
        } else if (graph == 'vod-bar') {
            $('#date-picker-3').val(from_calendar);
            $('#date-picker-4').val(to_calendar);
        }

        if (active_tab == '#top-content') {
            smhContent.getGraphData(days_from_today, from, to, days, reportType, dimension, graph_entryId);
            smhContent.getTotalPlays(from, to, reportType, graph_entryId);
        } else if (active_tab == '#content-dropoff') {
            smhContent.getGraphData(days_from_today, from, to, days, reportType, dimension, bargraph_entryId);
            smhContent.getTotalPlays(from, to, reportType, bargraph_entryId);
        }
    },
    //Load this weeks graph
    loadThisWeekGraph: function (reportType, dimension, graph) {
        $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
        $('#graph-loading2').html('<img src="/img/chart-loading.gif" height="20px" />');
        var from = Date.today().moveToDayOfWeek(0, -1).toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");
        var from_calendar = Date.today().moveToDayOfWeek(0, -1).toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy");
        if (graph == 'vod') {
            $('#date-picker-1').val(from_calendar);
            $('#date-picker-2').val(to_calendar);
        } else if (graph == 'vod-bar') {
            $('#date-picker-3').val(from_calendar);
            $('#date-picker-4').val(to_calendar);
        }
        var diff = new TimeSpan(Date.today() - Date.today().moveToDayOfWeek(0, -1));
        var days = diff.days;
        var days_from_today = diff.days;

        if (active_tab == '#top-content') {
            smhContent.getGraphData(days_from_today, from, to, days, reportType, dimension, graph_entryId);
            smhContent.getTotalPlays(from, to, reportType, graph_entryId);
        } else if (active_tab == '#content-dropoff') {
            smhContent.getGraphData(days_from_today, from, to, days, reportType, dimension, bargraph_entryId);
            smhContent.getTotalPlays(from, to, reportType, bargraph_entryId);
        }
    },
    //Load last weeks graph
    loadLastWeekGraph: function (reportType, dimension, graph) {
        $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
        $('#graph-loading2').html('<img src="/img/chart-loading.gif" height="20px" />');
        var from = Date.today().addDays(-6).moveToDayOfWeek(0, -1).toString("yyyyMMdd");
        var to = Date.today().moveToDayOfWeek(6, -1).toString("yyyyMMdd");
        var from_calendar = Date.today().addDays(-6).moveToDayOfWeek(0, -1).toString("MM/dd/yyyy");
        var to_calendar = Date.today().moveToDayOfWeek(6, -1).toString("MM/dd/yyyy");
        if (graph == 'vod') {
            $('#date-picker-1').val(from_calendar);
            $('#date-picker-2').val(to_calendar);
        } else if (graph == 'vod-bar') {
            $('#date-picker-3').val(from_calendar);
            $('#date-picker-4').val(to_calendar);
        }
        var diff = new TimeSpan(Date.today().moveToDayOfWeek(6, -1) - Date.today().addDays(-6).moveToDayOfWeek(0, -1));
        var days = diff.days;
        var diff2 = new TimeSpan(Date.today() - Date.today().addDays(-6).moveToDayOfWeek(0, -1));
        var days_from_today = diff2.days;

        if (active_tab == '#top-content') {
            smhContent.getGraphData(days_from_today, from, to, days, reportType, dimension, graph_entryId);
            smhContent.getTotalPlays(from, to, reportType, graph_entryId);
        } else if (active_tab == '#content-dropoff') {
            smhContent.getGraphData(days_from_today, from, to, days, reportType, dimension, bargraph_entryId);
            smhContent.getTotalPlays(from, to, reportType, bargraph_entryId);
        }
    },
    //Load last 30 days graph
    loadLastThirtyDaysGraph: function (reportType, dimension, graph) {
        $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
        $('#graph-loading2').html('<img src="/img/chart-loading.gif" height="20px" />');
        var days = 30;
        var from = Date.today().addDays(-days).toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");
        var from_calendar = Date.today().addDays(-days).toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy");

        if (graph == 'vod') {
            $('#date-picker-1').val(from_calendar);
            $('#date-picker-2').val(to_calendar);
        } else if (graph == 'vod-bar') {
            $('#date-picker-3').val(from_calendar);
            $('#date-picker-4').val(to_calendar);
        }

        var days_from_today = days;

        if (active_tab == '#top-content') {
            smhContent.getGraphData(days_from_today, from, to, days, reportType, dimension, graph_entryId);
            smhContent.getTotalPlays(from, to, reportType, graph_entryId);
        } else if (active_tab == '#content-dropoff') {
            smhContent.getGraphData(days_from_today, from, to, days, reportType, dimension, bargraph_entryId);
            smhContent.getTotalPlays(from, to, reportType, bargraph_entryId);
        }
    },
    //Loads this month's graph
    loadThisMonthGraph: function (reportType, dimension, graph) {
        $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
        $('#graph-loading2').html('<img src="/img/chart-loading.gif" height="20px" />');
        var from = Date.today().moveToFirstDayOfMonth().toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");
        var from_calendar = Date.today().moveToFirstDayOfMonth().toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy");
        if (graph == 'vod') {
            $('#date-picker-1').val(from_calendar);
            $('#date-picker-2').val(to_calendar);
        } else if (graph == 'vod-bar') {
            $('#date-picker-3').val(from_calendar);
            $('#date-picker-4').val(to_calendar);
        }
        var diff = new TimeSpan(Date.today() - Date.today().moveToFirstDayOfMonth());
        var days = diff.days;
        var days_from_today = days;

        if (active_tab == '#top-content') {
            smhContent.getGraphData(days_from_today, from, to, days, reportType, dimension, graph_entryId);
            smhContent.getTotalPlays(from, to, reportType, graph_entryId);
        } else if (active_tab == '#content-dropoff') {
            smhContent.getGraphData(days_from_today, from, to, days, reportType, dimension, bargraph_entryId);
            smhContent.getTotalPlays(from, to, reportType, bargraph_entryId);
        }
    },
    //Loads this month's graph
    loadLastMonthGraph: function (reportType, dimension, graph) {
        $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
        $('#graph-loading2').html('<img src="/img/chart-loading.gif" height="20px" />');
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
        if (graph == 'vod') {
            $('#date-picker-1').val(from_calendar);
            $('#date-picker-2').val(to_calendar);
        } else if (graph == 'vod-bar') {
            $('#date-picker-3').val(from_calendar);
            $('#date-picker-4').val(to_calendar);
        }
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

        if (active_tab == '#top-content') {
            smhContent.getGraphData(days_from_today, from, to, days, reportType, dimension, graph_entryId);
            smhContent.getTotalPlays(from, to, reportType, graph_entryId);
        } else if (active_tab == '#content-dropoff') {
            smhContent.getGraphData(days_from_today, from, to, days, reportType, dimension, bargraph_entryId);
            smhContent.getTotalPlays(from, to, reportType, bargraph_entryId);
        }
    },
    //Loads last 12 month's graph
    loadLastTwelveMonthGraph: function (reportType, dimension, graph) {
        $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
        $('#graph-loading2').html('<img src="/img/chart-loading.gif" height="20px" />');
        var from = Date.today().add({
            months: -12
        }).toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");
        var from_calendar = Date.today().add({
            months: -12
        }).toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy");
        if (graph == 'vod') {
            $('#date-picker-1').val(from_calendar);
            $('#date-picker-2').val(to_calendar);
        } else if (graph == 'vod-bar') {
            $('#date-picker-3').val(from_calendar);
            $('#date-picker-4').val(to_calendar);
        }
        var diff = new TimeSpan(Date.today() - Date.today().add({
            months: -12
        }));
        var days = diff.days;
        var days_from_today = days;

        if (active_tab == '#top-content') {
            smhContent.getGraphData(days_from_today, from, to, days, reportType, dimension, graph_entryId);
            smhContent.getTotalPlays(from, to, reportType, graph_entryId);
        } else if (active_tab == '#content-dropoff') {
            smhContent.getGraphData(days_from_today, from, to, days, reportType, dimension, bargraph_entryId);
            smhContent.getTotalPlays(from, to, reportType, bargraph_entryId);
        }
    },
    //Loads this year's graph
    loadThisYearGraph: function (reportType, dimension, graph) {
        $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
        $('#graph-loading2').html('<img src="/img/chart-loading.gif" height="20px" />');
        var from = Date.today().set({
            day: 1,
            month: 0
        }).toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");
        var diff = new TimeSpan(Date.today() - Date.today().set({
            day: 1,
            month: 0
        }));
        var from_calendar = Date.today().set({
            day: 1,
            month: 0
        }).toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy");
        if (graph == 'vod') {
            $('#date-picker-1').val(from_calendar);
            $('#date-picker-2').val(to_calendar);
        } else if (graph == 'vod-bar') {
            $('#date-picker-3').val(from_calendar);
            $('#date-picker-4').val(to_calendar);
        }
        var days = diff.days;
        var days_from_today = days;

        if (active_tab == '#top-content') {
            smhContent.getGraphData(days_from_today, from, to, days, reportType, dimension, graph_entryId);
            smhContent.getTotalPlays(from, to, reportType, graph_entryId);
        } else if (active_tab == '#content-dropoff') {
            smhContent.getGraphData(days_from_today, from, to, days, reportType, dimension, bargraph_entryId);
            smhContent.getTotalPlays(from, to, reportType, bargraph_entryId);
        }
    },
    //Return to all entries
    returnTable: function () {
        $('.rs-header').html('Entries');
        $('.rs-right-header').css('display', 'block');
        var ac_disabled = ($.inArray("CONTENT_MANAGE_ACCESS_CONTROL", sessPerm) != -1) ? 'onclick=smhContent.bulkACModal();' : '';
        var addtags_disabled = ($.inArray("CONTENT_MANAGE_METADATA", sessPerm) != -1) ? 'onclick=smhContent.bulkTagsAddModal();' : '';
        var removetags_disabled = ($.inArray("CONTENT_MANAGE_METADATA", sessPerm) != -1) ? 'onclick=smhContent.bulkTagsRemoveModal();' : '';
        var addcat_disabled = ($.inArray("CONTENT_MANAGE_ASSIGN_CATEGORIES", sessPerm) != -1) ? 'onclick=smhContent.bulkCatAddModal();' : '';
        var removecat_disabled = ($.inArray("CONTENT_MANAGE_ASSIGN_CATEGORIES", sessPerm) != -1) ? 'onclick=smhContent.bulkCatRemoveModal();' : '';
        var delete_disabled = ($.inArray("CONTENT_MANAGE_DELETE", sessPerm) != -1) ? 'onclick=smhContent.bulkDeleteModal();' : '';
        $('#entries-table-wrapper').html('<div id="users-buttons">' +
                '<div style="display: inline-block; float: left;">' +
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
                '<div id="filter-header">' +
                '<ul>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="all" class="ac_all" checked> <b>All Access Control Profiles</b></label></div>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div class="filter-body ac-filter"></div>' +
                '<div id="filter-header" style="margin-top: 13px;">' +
                '<ul>' +
                '<li>' +
                '<div class="checkbox"><label><input type="checkbox" value="all" class="flavors_all" checked> <b>All Flavors</b></label></div>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div class="filter-body flavors-filter"></div>' +
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
                '<div class="pull-left" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhContent.exportMetaData()">Export to Excel <img height="20px" src="/img/xls-icon.jpg"></a></div>' +
                '<span class="dropdown header">' +
                '<div class="btn-group">' +
                '<button class="btn btn-default dd-delete-btn" type="button"><span class="text">Bulk Actions</span></button>' +
                '<button aria-expanded="true" data-toggle="dropdown" id="dropdownMenu" type="button" class="btn btn-disabled dropdown-toggle dd-delete-btn" disabled=""><span class="caret"></span></button>' +
                '<ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu entries-bulk">' +
                '<li role="presentation"><a ' + ac_disabled + ' tabindex="-1" role="menuitem">Set Access Control</a></li>' +
                '<li role="presentation" class="dropdown dropdown-submenu">' +
                '<a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-caret-left"></i> Add/Remove Tags</a>' +
                '<ul class="dropdown-menu">' +
                '<li>' +
                '<a ' + addtags_disabled + '>Add Tags</a>' +
                '</li>' +
                '<li>' +
                '<a ' + removetags_disabled + '>Remove Tags</a>' +
                '</li>' +
                '</ul>' +
                '</li>' +
                '<li role="presentation" class="dropdown dropdown-submenu">' +
                '<a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-caret-left"></i> Add/Remove Categories</a>' +
                '<ul class="dropdown-menu cat-menu">' +
                '<li>' +
                '<a ' + addcat_disabled + '>Add to Categories</a>' +
                '</li>' +
                '<li>' +
                '<a ' + removecat_disabled + '>Remove from Categories</a>' +
                '</li>' +
                '</ul>' +
                '</li>' +
                '<li role="presentation"><a ' + delete_disabled + ' tabindex="-1" role="menuitem">Delete</a></li>' +
                '</ul>' +
                '</div>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div id="entries-table"></div>');
        dropOff_stats = false;
        smhContent.getEntries();
        smhContent.getUiConfs();
        smhContent.getCats();
        smhContent.getAccessControlProfiles();
        smhContent.getFlavors();
    },
    thumbBase: function (o) {
        var path = o.src;
        var pos = path.indexOf("/vid_slice");
        if (pos != -1)
            path = path.substring(0, pos);

        return path;
    },
    change: function (o, i) {
        slice = (i + 1) % slices;

        var path = smhContent.thumbBase(o);

        o.src = path + "/vid_slice/" + i + "/vid_slices/" + slices;
        img.src = path + "/vid_slice/" + slice + "/vid_slices/" + slices;

        i = i % slices;
        i++;

        timer = setTimeout(function () {
            smhContent.change(o, i)
        }, frameRate);
    },
    thumbRotatorStart: function (o) {
        clearTimeout(timer);
        var path = smhContent.thumbBase(o);
        smhContent.change(o, 1);
    },
    thumbRotatorEnd: function (o) {
        clearTimeout(timer);
        o.src = smhContent.thumbBase(o);
    },
    //Clip App Modal
    clipEntry: function (id) {
        smhContent.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '994px');
        $('#smh-modal .modal-body').css('height', '580px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close clip-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Clip Video</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<iframe id="trim-clip" scrolling="no" width="100%" height="100%" frameborder="0" src="/apps/platform/clipApp/v1.0.1s/index.php?kdpUiconf=6709432&kclipUiconf=6709434&partnerId=' + sessInfo.pid + '&mode=clip&config=kmc&entryId=' + id + '&uid=' + sessInfo.id + '&ks=' + sessInfo.ks + '">';
        $('#smh-modal .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close clip-close" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Clip App Modal
    trimEntry: function (id) {
        smhContent.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '994px');
        $('#smh-modal .modal-body').css('height', '580px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close clip-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Trim Video</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<iframe id="trim-clip" scrolling="no" width="100%" height="100%" frameborder="0" src="/apps/platform/clipApp/v1.0.1s/index.php?kdpUiconf=6709432&kclipUiconf=6709434&partnerId=' + sessInfo.pid + '&mode=trim&config=kmc&entryId=' + id + '&uid=' + sessInfo.id + '&ks=' + sessInfo.ks + '">';
        $('#smh-modal .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close clip-close" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Flavors Modal
    editFlavors: function (id) {
        smhContent.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '994px');
        $('#smh-modal .modal-body').css('height', '580px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Flavors</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div id="flavor-header">' +
                '<span style="float:left;">Click the Action dropdown menu below to manage the Transcoding Flavors for this entry.</span>' +
                '<span style="float: right;"><a href="#" id="refresh" onClick="smhContent.refreshFlavors(\'' + id + '\')"><i class="fa fa-refresh"></i> Refresh</a></span>' +
                '</div>' +
                '<div id="flavor-table" style="padding-top: 10px;"></div>';
        $('#smh-modal .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);

        smhContent.buildFlavorsTable(id);
    },
    //Build Flavors Table
    buildFlavorsTable: function (id) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            $('#flavor-data_processing').css({
                'display': 'none',
                'z-index': '0'
            });
            smhContent.loadFlavors(results);

        };
        $('#flavor-data_processing').css({
            'display': 'none',
            'z-index': '1'
        });
        client.flavorAsset.getFlavorAssetsWithParams(cb, id);
    },
    //Loads flavors
    loadFlavors: function (data) {
        var flavors_results = new Array();
        var conv_arr = new Array();
        var delete_arr = new Array();
        var mobile = new Array();
        var flavor_select, trans_flavor, asset_id, rtmp_url, format, videoCodec, biterate, width, height, size, st, paramId, entry, status, version, dimensions;
        var i = 0;
        $.each(data, function (key, value) {
            if (value['flavorAsset'] === null) {
                mobile = value['flavorParams']['tags'].split(",");
                if ($.inArray("mobile", mobile) != -1 || $.inArray("iphone", mobile) != -1 || $.inArray("iphonenew", mobile) != -1 || $.inArray("ipad", mobile) != -1 || $.inArray("ipadnew", mobile) != -1) {
                    if (services.mb == '1') {
                        flavor_select = '<div class="btn-group"><button type="button" class="btn btn-default">Select Action</button><button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-expanded="false"><span class="caret"></span></button><ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu">';
                    } else {
                        flavor_select = '<div class="btn-group"><button type="button" class="btn btn-disabled" disabled>Select Action</button><button class="btn btn-disabled dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-expanded="false" disabled><span class="caret"></span></button><ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu">';
                    }
                } else {
                    flavor_select = '<div class="btn-group"><button type="button" class="btn btn-default">Select Action</button><button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-expanded="false"><span class="caret"></span></button><ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu">';
                }

                trans_flavor = "<span class='flavor-null'>" + value['flavorParams']['name'] + "</span>";
                asset_id = "";
                format = "";
                videoCodec = "";
                biterate = "";
                width = "";
                height = "";
                size = "";
                st = "";
                paramId = value['flavorParams']['id'];
                entry = value['entryId'];
                if (value['flavorParams']['width'] == 0) {
                    width = "null";
                } else {
                    width = value['flavorParams']['width']
                }
                if (value['flavorParams']['height'] == 0) {
                    height = "null";
                } else {
                    height = value['flavorParams']['height']
                }
                dimensions = "<span class='flavor-null'>" + width + " x " + height + "</span>";
                if (services.trans_vod == '1' && ($.inArray("CONTENT_MANAGE_RECONVERT", sessPerm) != -1)) {
                    if ($.inArray("mobile", mobile) != -1 || $.inArray("iphone", mobile) != -1 || $.inArray("iphonenew", mobile) != -1 || $.inArray("ipad", mobile) != -1 || $.inArray("ipadnew", mobile) != -1) {
                        if (services.mb == '1') {
                            flavor_select += '<li role="presentation"><a onclick="smhContent.convertFlavor(\'' + entry + '\',\'' + paramId + '\');" tabindex="-1" role="menuitem">Convert</a></li><li role="presentation"><a onclick="smhContent.uploadFlavorModal(\'' + entry + '\',\'' + paramId + '\',\'' + value['flavorParams']['name'] + '\');" tabindex="-1" role="menuitem">Upload</a></li>';
                        } else {
                            flavor_select += '<li role="presentation"><a onclick="smhContent.convertFlavor(\'' + entry + '\',\'' + paramId + '\',\'' + value['flavorParams']['name'] + '\');" tabindex="-1" role="menuitem">Upload</a></li>';
                        }
                    } else {
                        flavor_select += '<li role="presentation"><a onclick="smhContent.convertFlavor(\'' + entry + '\',\'' + paramId + '\');" tabindex="-1" role="menuitem">Convert</a></li><li role="presentation"><a onclick="smhContent.uploadFlavorModal(\'' + entry + '\',\'' + paramId + '\',\'' + value['flavorParams']['name'] + '\');" tabindex="-1" role="menuitem">Upload</a></li>';
                    }
                } else {
                    flavor_select += '<li role="presentation"><a onclick="smhContent.uploadFlavorModal(\'' + entry + '\',\'' + paramId + '\',\'' + value['flavorParams']['name'] + '\');" tabindex="-1" role="menuitem">Upload</a></li>';
                }
                flavor_select += "</ul></div>";
                flavors_results[i] = new Array(asset_id, trans_flavor, format, videoCodec, biterate, dimensions, size, st, flavor_select);
                i++;
            } else {
                flavor_select = '<div class="btn-group"><button type="button" class="btn btn-default">Select Action</button><button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-expanded="false"><span class="caret"></span></button><ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu">';
                trans_flavor = value['flavorParams']['name'];
                asset_id = value['flavorAsset']['id'];
                entry = value['flavorAsset']['entryId'];
                format = value['flavorAsset']['fileExt'];
                videoCodec = value['flavorAsset']['videoCodecId'];
                biterate = value['flavorAsset']['bitrate'];
                width = "";
                height = "";
                size = value['flavorAsset']['size'];
                status = value['flavorAsset']['status'];
                paramId = value['flavorAsset']['flavorParamsId'];
                st = "";
                version = value['flavorAsset']['version'];

                if (status == 2 && trans_flavor != 'Source') {
                    delete_arr = new Array();
                    conv_arr = new Array();
                    st = "OK";
                    delete_arr.push(asset_id, entry);
                    conv_arr.push(entry, paramId, trans_flavor);
                    if (services.trans_vod == '1' && ($.inArray("CONTENT_MANAGE_RECONVERT", sessPerm) != -1)) {
                        flavor_select += '<li role="presentation"><a onclick="smhContent.deleteFlavorModal(\'' + asset_id + '\',\'' + entry + '\');" tabindex="-1" role="menuitem">Delete</a></li><li role="presentation"><a onclick="smhContent.downloadFlavor(\'' + asset_id + '\');" tabindex="-1" role="menuitem">Download</a></li><li role="presentation"><a onclick="smhContent.convertFlavor(\'' + entry + '\',\'' + paramId + '\');" tabindex="-1" role="menuitem">Reconvert</a></li><li role="presentation"><a onclick="smhContent.viewURLs(\'' + entry + '\',\'' + asset_id + '\',\'' + version + '\',\'' + format + '\');" tabindex="-1" role="menuitem">View URLs</a></li>';
                    } else {
                        flavor_select += '<li role="presentation"><a onclick="smhContent.deleteFlavorModal(\'' + asset_id + '\',\'' + entry + '\');" tabindex="-1" role="menuitem">Delete</a></li><li role="presentation"><a onclick="smhContent.downloadFlavor(\'' + asset_id + '\');" tabindex="-1" role="menuitem">Download</a></li><li role="presentation"><a onclick="smhContent.viewURLs(\'' + entry + '\',\'' + asset_id + '\',\'' + version + '\',\'' + format + '\');" tabindex="-1" role="menuitem">View URLs</a></li>';
                    }
                    flavor_select += "</ul></div>";
                } else if (status == 2 && trans_flavor == 'Source') {
                    delete_arr = new Array();
                    st = "OK";
                    delete_arr.push(asset_id, entry);
                    flavor_select += '<li role="presentation"><a onclick="smhContent.deleteFlavorModal(\'' + asset_id + '\',\'' + entry + '\');" tabindex="-1" role="menuitem">Delete</a></li><li role="presentation"><a onclick="smhContent.downloadFlavor(\'' + asset_id + '\');" tabindex="-1" role="menuitem">Download</a></li><li role="presentation"><a onclick="smhContent.viewURLs(\'' + entry + '\',\'' + asset_id + '\',\'' + version + '\',\'' + format + '\');" tabindex="-1" role="menuitem">View URLs</a></li>';
                    flavor_select += "</ul></div>";
                } else if (status == 4) {
                    st = "N/A";
                    flavor_select += '<li role="presentation"><a onclick="smhContent.deleteFlavorModal(\'' + asset_id + '\',\'' + entry + '\');" tabindex="-1" role="menuitem">Delete</a></li>';
                    flavor_select += "</ul></div>";
                } else if (status == 1) {
                    st = "Converting";
                    flavor_select = "<div style='margin-left: auto; margin-right: auto; width: 41px;'><img src='/img/loading.gif' width='16px' /></div>";
                } else if (status == 3) {
                    st = "Deleted";
                    flavor_select += "";
                    flavor_select += "</ul></div>";
                } else if (status == -1) {
                    st = "<span style='color: red'>Error</span>";
                    if (services.trans_vod == '1' && ($.inArray("CONTENT_MANAGE_RECONVERT", sessPerm) != -1)) {
                        flavor_select += '<li role="presentation"><a onclick="smhContent.convertFlavor(\'' + entry + '\',\'' + paramId + '\');" tabindex="-1" role="menuitem">Reconvert</a></li><li role="presentation"><a onclick="smhContent.uploadFlavorModal(\'' + entry + '\',\'' + paramId + '\',\'' + value['flavorParams']['name'] + '\');" tabindex="-1" role="menuitem">Upload</a></li>';
                    } else {
                        flavor_select += '<li role="presentation"><a onclick="smhContent.uploadFlavorModal(\'' + entry + '\',\'' + paramId + '\',\'' + value['flavorParams']['name'] + '\');" tabindex="-1" role="menuitem">Upload</a></li>';
                    }
                    flavor_select += "</ul></div>";
                } else if (status == 7) {
                    st = "Importing";
                    flavor_select = "<div style='margin-left: auto; margin-right: auto; width: 41px;'><img src='/img/loading.gif' width='16px' /></div>";
                } else if (status == 0) {
                    st = "Queued";
                    flavor_select += "";
                    flavor_select += "</ul></div>";
                } else if (status == 5) {
                    st = "Temp";
                    flavor_select += "";
                    flavor_select += "</ul></div>";
                } else if (status == 8) {
                    st = "Validating";
                    flavor_select = "<div style='margin-left: auto; margin-right: auto; width: 41px;'><img src='/img/loading.gif' width='16px' /></div>";
                } else if (status == 6) {
                    st = "Wait For Convert";
                    flavor_select = "<div style='margin-left: auto; margin-right: auto; width: 41px;'><img src='/img/loading.gif' width='16px' /></div>";
                }

                if (value['flavorAsset']['width'] == 0) {
                    width = "null";
                } else {
                    width = value['flavorAsset']['width']
                }
                if (value['flavorAsset']['height'] == 0) {
                    height = "null";
                } else {
                    height = value['flavorAsset']['height']
                }
                dimensions = width + " x " + height;
                flavors_results[i] = new Array(asset_id, trans_flavor, format, videoCodec, biterate, dimensions, size, st, flavor_select);
                i++;
            }
        });

        $('#flavor-table').empty();
        $('#flavor-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="flavor-data"></table>');
        flavorsTable = $('#flavor-data').DataTable({
            "dom": '<"H"lfr>t<"F"ip>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": true,
            "serverSide": false,
            "autoWidth": false,
            "paging": false,
            "searching": false,
            "info": false,
            "scrollCollapse": true,
            "scrollY": "473px",
            "lengthChange": false,
            "data": flavors_results,
            "language": {
                "zeroRecords": "No flavors found"
            },
            "columns": [
                {
                    "title": "<span style='float: left;'>Asset ID</span>",
                    "width": "55px"
                },
                {
                    "title": "<span style='float: left;'>Transcoding Flavor</span>",
                    "width": "137px"
                },
                {
                    "title": "<span style='float: left;'>Format</span>"
                },
                {
                    "title": "<span style='float: left;'>Codec</span>",
                    "width": "92px"
                },
                {
                    "title": "<span style='float: left;'>Bitrate (kbps)</span>"
                },
                {
                    "title": "<span style='float: left;'>Dimensions</span>",
                    "width": "102px"
                },
                {
                    "title": "<span style='float: left;'>Size (KB)</span>",
                    "width": "90px"
                },
                {
                    "title": "<span style='float: left;'>Status</span>"
                },
                {
                    "title": "<span style='float: left;'>Action</span>",
                    "width": "170px"
                }
            ]
        });

        $('#flavor-table .dataTables_scrollBody').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
    },
    //View Playback URLs
    viewURLs: function (entry_id, flavor_id, version, format) {
        smhContent.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '700px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '2');
        var hls_urls = '';
        var hlss_urls = '';
        var http_urls = '';
        var https_urls = '';
        if (services.mb == '1') {
            hls_urls += '<tr>' +
                    '<td style="width: 100px;"><div class="title">HLS URL (HTTP):</div></td>' +
                    '<td><div class="col-sm-4 col-md-8 col-lg-12"><input type="text" class="form-control" value="http://mediaplatform.streamingmediahosting.com/p/' + sessInfo.pid + '/sp/' + sessInfo.pid + '00/playManifest/entryId/'+ entry_id + '/flavorId/' + flavor_id + '/format/applehttp/protocol/http/a.m3u8"></div></td>' +
                    '</tr>';
            hlss_urls += '<tr>' +
                    '<td style="width: 100px;"><div class="title">HLS URL (HTTPS):</div></td>' +
                    '<td><div class="col-sm-4 col-md-8 col-lg-12"><input type="text" class="form-control" value="https://mediaplatform.streamingmediahosting.com/p/' + sessInfo.pid + '/sp/' + sessInfo.pid + '00/playManifest/entryId/'+ entry_id + '/flavorId/' + flavor_id + '/format/applehttp/protocol/https/a.m3u8"></div></td>' +
                    '</tr>';
            http_urls += '<tr>' +
                    '<td style="width: 100px;"><div class="title">HTTP URL:</div></td>' +
                    '<td><div class="col-sm-4 col-md-8 col-lg-12"><input type="text" class="form-control" value="http://mediaplatform.streamingmediahosting.com/p/' + sessInfo.pid + '/sp/' + sessInfo.pid + '00/playManifest/entryId/'+ entry_id + '/flavorId/' + flavor_id + '/format/url/protocol/http/a.mp4"></div></td>' +
                    '</tr>';
            https_urls += '<tr>' +
                    '<td style="width: 100px;"><div class="title">HTTPS URL:</div></td>' +
                    '<td><div class="col-sm-4 col-md-8 col-lg-12"><input type="text" class="form-control" value="https://mediaplatform.streamingmediahosting.com/p/' + sessInfo.pid + '/sp/' + sessInfo.pid + '00/playManifest/entryId/'+ entry_id + '/flavorId/' + flavor_id + '/format/url/protocol/https/a.mp4"></div></td>' +
                    '</tr>';
        } else {
            http_urls += '<tr>' +
                    '<td style="width: 100px;"><div class="title">HTTP URL:</div></td>' +
                    '<td><div class="col-sm-4 col-md-8 col-lg-12"><input type="text" class="form-control" value="http://mediaplatform.streamingmediahosting.com/p/' + sessInfo.pid + '/sp/' + sessInfo.pid + '00/playManifest/entryId/'+ entry_id + '/flavorId/' + flavor_id + '/format/url/protocol/http/a.mp4"></div></td>' +
                    '</tr>';
            https_urls += '<tr>' +
                    '<td style="width: 100px;"><div class="title">HTTPS URL:</div></td>' +
                    '<td><div class="col-sm-4 col-md-8 col-lg-12"><input type="text" class="form-control" value="https://mediaplatform.streamingmediahosting.com/p/' + sessInfo.pid + '/sp/' + sessInfo.pid + '00/playManifest/entryId/'+ entry_id + '/flavorId/' + flavor_id + '/format/url/protocol/https/a.mp4"></div></td>' +
                    '</tr>';
        }

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Playback URLs</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = '<div id="encoders-wrapper">' +
                '<table id="urls-table" style="margin-top: 20px;">' +
                '<tbody>' +
                hls_urls +
                hlss_urls +
                http_urls +
                https_urls +
                '</tbody>' +
                '</table>' +
                '</div>';

        $('#smh-modal2 .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button>';
        $('#smh-modal2 .modal-footer').html(footer);
    },
    //Refreshes flavors
    refreshFlavors: function (id) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            $('#flavor-data_processing').css({
                'display': 'none',
                'z-index': '0'
            });
            smhContent.loadFlavors(results);
        };

        $('#flavor-data_processing').css({
            'display': 'inline',
            'z-index': '1'
        });
        client.flavorAsset.getFlavorAssetsWithParams(cb, id);
    },
    //Download Flavor
    downloadFlavor: function (assetId) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            window.location = results;
        };

        var storageId;
        client.flavorAsset.getUrl(cb, assetId, storageId);
    },
    //Delete Flavor Modal
    deleteFlavorModal: function (flavor_id, entry_id) {
        smhContent.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '415px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });
        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '2');

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Delete Asset</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = '<div style="font-size:13px !important; text-align: center;">Are you sure you want to delete this Asset: ' + flavor_id + '?</div>';
        $('#smh-modal2 .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="delete-flavor" onclick="smhContent.deleteFlavor(\'' + flavor_id + '\',\'' + entry_id + '\')">Delete</button>';
        $('#smh-modal2 .modal-footer').html(footer);
    },
    //Deletes flavor
    deleteFlavor: function (flavorid, entryid) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results == null) {
                $('#smh-modal2 #loading img').css('display', 'none');
                $('#smh-modal2 .smh-close2').click();
                smhContent.refreshFlavors(entryid);
            } else if (results.code && results.message) {
                alert(results.message);
                return;
            }
        };

        $('#smh-modal2 #loading img').css('display', 'inline-block');
        client.flavorAsset.deleteAction(cb, flavorid);
    },
    //Converts flavor
    convertFlavor: function (entryid, paramId) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results == null) {
                smhContent.refreshFlavors(entryid);
            } else if (results.code && results.message) {
                alert(results.message);
                return;
            }
        };

        client.flavorAsset.convert(cb, entryid, paramId);
    },
    //Loads flavor upload modal
    uploadFlavorModal: function (entryid, paramId, name) {
        flav_entryId = entryid;
        smhContent.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '635px');
        $('#smh-modal2 .modal-body').css('height', '308px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });
        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '2');

        header = '<button type="button" class="close smh-close2 flavor-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Upload Flavor ' + name + '</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = '<iframe id="upload_form" scrolling="no" width="100%" height="100%" frameborder="0" src="/apps/platform/newFlavorUpload.php?eid=' + entryid + '&paramid=' + paramId + '&ks=' + sessInfo.ks + '&pid=' + sessInfo.pid +'">';
        $('#smh-modal2 .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default smh-close2 flavor-close" data-dismiss="modal">Close</button>';
        $('#smh-modal2 .modal-footer').html(footer);
    },
    //Chapters Plugin Modal
    chaptersPlugin: function (id) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '810px');
        $('#smh-modal .modal-body').css('height', '545px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Chapters</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<iframe scrolling="no" width="788px" height="485px" frameborder="0" src="html5/html5lib/' + html5_ver + '/kWidget/onPagePlugins/chapters/chaptersEdit.php?ks=' + sessInfo.ks + '&pid=' + sessInfo.pid + '&eid=' + id + '" /><div style="margin-left:auto; margin-right:auto; width: 170px;"><button class="btn btn-default" onclick="smhContent.chaptersVeiw(\'' + id + '\')">Preview & Embed</button></div>';
        $('#smh-modal .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Loads chapters view modal
    chaptersVeiw: function (entry) {
        chapterBoxWidth = '320';
        chapters_layout = 'vertical';
        chapters_position = 'right';
        chapters_overflow = 'false';
        chapters_thumbnail = 'true';
        chapters_thumbnail_width = '100';
        chapters_thumbrotator = 'true';
        chapters_numberpattern = '';
        chapters_startime = 'true';
        chapters_duration = 'true';
        chapters_pause = 'false';
        chapters_titlelimit = '24';
        chapters_descriptionlimit = '70';
        chapters_streamertype = 'rtmp';
        chapter_player = '6710347';
        chapters_entry = entry;

        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            if (results['partnerData']) {
                var partnerData = $.parseJSON(results['partnerData']);
                $.each(partnerData, function (key, value) {
                    if (key == 'chaptersConfig') {
                        $.each(value, function (key3, value3) {
                            chapterBoxWidth = value3.horizontalChapterBoxWidth;
                            chapters_layout = value3.layout;
                            chapters_position = value3.containerPosition;
                            chapters_overflow = value3.overflow;
                            chapters_thumbnail = value3.includeThumbnail;
                            chapters_thumbnail_width = value3.thumbnailWidth;
                            chapters_thumbrotator = value3.thumbnailRotator;
                            chapters_numberpattern = value3.includeChapterNumberPattern;
                            chapters_startime = value3.includeChapterStartTime;
                            chapters_duration = value3.includeChapterDuration;
                            chapters_pause = value3.pauseAfterChapter;
                            chapters_titlelimit = value3.titleLimit;
                            chapters_descriptionlimit = value3.descriptionLimit;
                            chapters_streamertype = value3.streamerType;
                            chapter_player = value3.player;
                        });
                    }
                });
            }

            var players = uiconf_ids;

            var player_select = "<select id='chapter_players' class='state form-control' style='width: 180px;'>";
            var width = 400;
            var height = 330;

            var i = 0;
            $.each(players, function (key, value) {
                if (value['id'] == '6709584' || value['id'] == '6709796') {
                } else {
                    chapters_array[i] = new Array(value['id'], value['width'], value['height']);
                    player_select += "<option id='" + i + "' value='" + value['id'] + "'>" + value['name'] + "</option>";
                    i++;
                }
                if (value['id'] == chapter_player) {
                    width = value['width'];
                    height = value['height'];
                }
            });
            player_select += "</select>";

            if (chapters_position == 'before' || chapters_position == 'after' || chapters_layout == 'horizontal') {
                wrapper_width = Number(width);
            } else {
                wrapper_width = Number(width) + Number(chapterBoxWidth) + 17;
            }

            var player_script = smhContent.getPlayerScriptEmbed();

            $('.smh-dialog2').css('width', '905px');
            $('#smh-modal2 .modal-body').css('height', '790px');
            $('#smh-modal2').modal({
                backdrop: 'static'
            });
            $('#smh-modal2').css('z-index', '2000');
            $('#smh-modal').css('z-index', '2');

            var header, content, footer;

            header = '<button type="button" class="close smh-close2 chapters-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Chapters View</h4>';
            $('#smh-modal2 .modal-header').html(header);

            content = '<div id="player-wrapper" style="margin-left: auto; margin-right: auto; width: ' + wrapper_width + 'px;">' +
                    '<div id="smh_chapters_player" style="width:' + width + 'px;height:' + height + 'px;"></div>' +
                    '</div>' +
                    '<div style="clear:both;"></div>' +
                    '<div class="tabbable tabs-left" style="margin-left: auto; margin-right: auto; width: 778px; margin-top: 30px;">' +
                    '<ul class="nav nav-tabs" id="myTab">' +
                    '<li class="active"><a href="#edit" data-toggle="tab">Edit</a></li>' +
                    '<li><a href="#embed" data-toggle="tab">Embed</a></li>' +
                    '</ul>' +
                    '<div class="tab-content" style="width: 632px; margin: 15px auto;">' +
                    '<div id="edit" class="tab-pane active">' +
                    '<div style="padding-bottom: 10px;">' +
                    '<div style="float:left;margin-right:10px;"><button class="btn btn-disabled" id="update-preview" onclick="smhContent.updateChapter();" disabled="disabled">Update Preview</button></div><div style="float:left;"><button class="btn btn-disabled" id="save-config" onclick="smhContent.saveChapterConfig();" disabled="disabled">Save Player</button></div><div id="chapter-result" style="float:left;margin-left: 35px; margin-top: 7px;"></div>' +
                    '<div class="clear"></div>' +
                    '</div>' +
                    '<div id="chapters-options-wrapper">' +
                    '<table class="table table-bordered table-striped" style="width: 99% !important;">' +
                    '<thead>' +
                    '<th style="width:140px">Attribute</th>' +
                    '<th style="width:160px">Value</th>' +
                    '<th style="width:180px">Description</th>' +
                    '</thead>' +
                    '<tbody>' +
                    '<tr><td>player</td><td>' + player_select + '</td><td>The player to use with your chapters.</td></tr>' +
                    '<tr><td>deliveryType</td><td><select id="chapters-streamer" class="state form-control" style="width: 180px;"><option id="0" value="rtmp">rtmp</option><option id="1" value="http">http</option></select></td><td>The flash delivery type.</td></tr>' +
                    '<tr><td>layout</td><td><select id="chapters-layout" class="state form-control" style="width: 180px;"><option id="0" value="vertical">vertical</option><option id="1" value="horizontal">horizontal</option></select></td><td>Will affect the layout of the chapters.</td></tr>' +
                    '<tr><td>containerPosition</td><td><select id="chapters-position" class="state form-control" style="width: 180px;"><option id="0" value="before">before</option><option id="1" value="after">after</option><option id="2" value="left">left</option><option id="3" value="right">right</option></select></td><td>Will affect the position of the chaptering UI in relation to the video.</td></tr>' +
                    '<tr><td>overflow</td><td><select id="chapters-overflow" class="state form-control" style="width: 180px;"><option id="0" value="true">true</option><option id="1" value="false">false</option></select></td><td>Defines what should happen in case list of chapters require more space than videos dimensions. Combined with the "layout" and "position" parameters, this parameter will cause a prev/next UI to appear if overflow is set to false.</td></tr>' +
                    '<tr><td>includeThumbnail</td><td><select id="chapters-thumbnail" class="state form-control" style="width: 180px;"><option id="0" value="true">true</option><option id="1" value="false">false</option></select></td><td>If set to true, a thumbnail HTML element will be generated containing the video frame from the startTime of the chapter.</td></tr>' +
                    '<tr><td>thumbnailWidth</td><td><input type="text" id="chapters-thumbnailWidth" class="state form-control" value="' + chapters_thumbnail_width + '" style="width: 166px !important;" /></td><td>The width of the clip thumbnails in pixels (default 100).</td></tr>' +
                    '<tr><td>horizontalChapterBoxWidth</td><td><input type="text" id="chapterBoxWidth" class="state form-control" value="' + chapterBoxWidth + '" style="width: 166px !important;" /></td><td>The total width of the chapter box for horizontal layout, in pixels (default 320).</td></tr>' +
                    '<tr><td>thumbnailRotator</td><td><select id="chapters-thumbrotator" class="state form-control" style="width: 180px;"><option id="0" value="true">true</option><option id="1" value="false">false</option></select></td><td>If set to true (and assuming that includeThumbnail = true), will enable a thumbnail-rotator experience.</td></tr>' +
                    '<tr><td>includeChapterNumberPattern</td><td><input type="text" id="chapters-numberpattern" class="state form-control" value="' + chapters_numberpattern + '" style="width: 166px !important;" /></td><td>If set to true, chapter number will prefix chapter. If set to string, will substitute chapter into pattern, i.e. "Ch $1 -" will prefix chapter text with "Ch 1 -", "Ch 2 -" etc.</td></tr>' +
                    '<tr><td>includeChapterStartTime</td><td><select id="chapters-startime" class="state form-control" style="width: 180px;"><option id="0" value="true">true</option><option id="1" value="false">false</option></select></td><td>If the chapter start time should be included left of the title.</td></tr>' +
                    '<tr><td>includeChapterDuration</td><td><select id="chapters-duration" class="state form-control" style="width: 180px;"><option id="0" value="true">true</option><option id="1" value="false">false</option></select></td><td>If the chapter duration should be included right of the title.</td></tr>' +
                    '<tr><td>pauseAfterChapter</td><td><select id="chapters-pause" class="state form-control" style="width: 180px;"><option id="0" value="true">true</option><option id="1" value="false">false</option></select></td><td>If set to true, video playback will pause on chapter complete.</td></tr>' +
                    '<tr><td>titleLimit</td><td><input type="text" id="chapters-titlelimit" class="state form-control" value="' + chapters_titlelimit + '" style="width: 166px !important;" /></td><td>Display limit for chapter titles, default 24 characters.</td></tr>' +
                    '<tr><td>descriptionLimit</td><td><input type="text" id="chapters-descriptionlimit" class="state form-control" value="' + chapters_descriptionlimit + '" style="width: 166px !important;" /></td><td>Display limit for chapter description, default 70 characters.</td></tr>' +
                    '</tbody>' +
                    '</table>' +
                    '</div>' +
                    '</div>' +
                    '<div id="embed" class="tab-pane">' +
                    '<div>' +
                    '<div style="width: 632px; text-align: center; font-weight: bold; margin-top: 63px;">Embed Code:</div>' +
                    '<div style="text-align: center; padding-top: 10px; height: 177px; width: 502px; margin-left: auto; margin-right: auto;"><textarea class="form-control" style="width: 500px !important; height: 163px !important;" id="embed_code" cols="37" rows="7"><script>if( !window.jQuery ){document.write(' + '<script type="text/javascript" src="http://mediaplatform.streamingmediahosting.com/html5/html5lib/' + html5_ver + '/resources/jquery/jquery.min.js"><' + '/script>' + ');}</script><div id="smh_chapters_player" style="width:' + width + 'px;height:' + height + 'px;"></div>' + player_script + '</textarea></div>' +
                    '<div id="result-select"></div>' +
                    '<div style="width: 632px; text-align: center; padding-top: 10px;"><button class="btn btn-default" id="select-bttn">Select Code</button></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<script src="/html5/html5lib/' + html5_ver + '/mwEmbedLoader.php/partner_id/' + sessInfo.pid + '"></script>' +
                    '<script>' +
                    'mw.setConfig(\'Kaltura.EnableEmbedUiConfJs\', true);' +
                    'mw.setConfig(\'debug\', true);' +
                    '</script>';

            $('#smh-modal2 .modal-body').html(content);

            $('#smh-modal2 #chapters-options-wrapper').mCustomScrollbar({
                theme: "inset-dark",
                scrollButtons: {
                    enable: true
                }
            });

            footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button>';
            $('#smh-modal2 .modal-footer').html(footer);

            kWidget.embed({
                targetId: "smh_chapters_player",
                wid: "_" + sessInfo.pid,
                uiconf_id: chapter_player,
                entry_id: chapters_entry,
                flashvars: {
                    "streamerType": chapters_streamertype,
                    "chaptersView": {
                        "plugin": true,
                        "path": "/p/" + sessInfo.pid + "/sp/" + sessInfo.pid + "00/flash/kdp3/v3.9.8/plugins/facadePlugin.swf",
                        "includeInLayout": false,
                        "relativeTo": "video",
                        "position": "before",
                        "onPageJs1": "{onPagePluginPath}/chapters/chaptersView.js",
                        "onPageJs2": "{onPagePluginPath}/libs/jcarousellite.js",
                        "onPageJs3": "{onPagePluginPath}/libs/jquery.sortElements.js",
                        "onPageCss1": "{onPagePluginPath}/chapters/chaptersView.css",
                        "containerId": "",
                        "tags": "chaptering",
                        "layout": chapters_layout,
                        "containerPosition": chapters_position,
                        "overflow": chapters_overflow,
                        "includeThumbnail": chapters_thumbnail,
                        "thumbnailWidth": chapters_thumbnail_width,
                        "horizontalChapterBoxWidth": chapterBoxWidth,
                        "thumbnailRotator": chapters_thumbrotator,
                        "includeChapterNumberPattern": chapters_numberpattern,
                        "includeChapterStartTime": chapters_startime,
                        "includeChapterDuration": chapters_duration,
                        "pauseAfterChapter": chapters_pause,
                        "titleLimit": chapters_titlelimit,
                        "descriptionLimit": chapters_descriptionlimit,
                        "chapterRenderer": "onChapterRenderer",
                        "chaptersRenderDone": "onChaptersRenderDone"
                    }
                },
                'params': {
                    'wmode': 'transparent'
                }
            });

            $("#smh-modal2 select#chapter_players").val(chapter_player);

            if (chapters_streamertype == 'rtmp') {
                $("#smh-modal2 select#chapters-streamer").find("option#0").attr("selected", true);
            } else {
                $("#smh-modal2 select#chapters-streamer").find("option#1").attr("selected", true);
            }

            if (chapters_layout == 'vertical') {
                $("#smh-modal2 select#chapters-layout").find("option#0").attr("selected", true);
            } else {
                $("#smh-modal2 select#chapters-layout").find("option#1").attr("selected", true);
            }

            if (chapters_position == 'before') {
                $("#smh-modal2 select#chapters-position").find("option#0").attr("selected", true);
            } else if (chapters_position == 'after') {
                $("#smh-modal2 select#chapters-position").find("option#1").attr("selected", true);
            } else if (chapters_position == 'left') {
                $("#smh-modal2 select#chapters-position").find("option#2").attr("selected", true);
            } else if (chapters_position == 'right') {
                $("#smh-modal2 select#chapters-position").find("option#3").attr("selected", true);
            }

            if (chapters_overflow == 'true') {
                $("#smh-modal2 select#chapters-overflow").find("option#0").attr("selected", true);
            } else {
                $("#smh-modal2 select#chapters-overflow").find("option#1").attr("selected", true);
            }

            if (chapters_thumbnail == 'true') {
                $("#smh-modal2 select#chapters-thumbnail").find("option#0").attr("selected", true);
            } else {
                $("#smh-modal2 select#chapters-thumbnail").find("option#1").attr("selected", true);
            }

            if (chapters_thumbrotator == 'true') {
                $("#smh-modal2 select#chapters-thumbrotator").find("option#0").attr("selected", true);
            } else {
                $("#smh-modal2 select#chapters-thumbrotator").find("option#1").attr("selected", true);
            }

            if (chapters_startime == 'true') {
                $("#smh-modal2 select#chapters-startime").find("option#0").attr("selected", true);
            } else {
                $("#smh-modal2 select#chapters-startime").find("option#1").attr("selected", true);
            }

            if (chapters_duration == 'true') {
                $("#smh-modal2 select#chapters-duration").find("option#0").attr("selected", true);
            } else {
                $("#smh-modal2 select#chapters-duration").find("option#1").attr("selected", true);
            }

            if (chapters_pause == 'true') {
                $("#smh-modal2 select#chapters-pause").find("option#0").attr("selected", true);
            } else {
                $("#smh-modal2 select#chapters-pause").find("option#1").attr("selected", true);
            }
        }

        var version;
        client.baseEntry.get(cb, entry, version);
    },
    //Returns embed script for player
    getPlayerScriptEmbed: function () {
        var player_script = '<script src="http://mediaplatform.streamingmediahosting.com/html5/html5lib/' + html5_ver + '/mwEmbedLoader.php/partner_id/' + sessInfo.pid + '"></script>' +
                '<script>' +
                'mw.setConfig(\'Kaltura.EnableEmbedUiConfJs\', true);' +
                'kWidget.embed({' +
                'targetId: "smh_chapters_player",' +
                'wid: "_' + sessInfo.pid + '",' +
                'uiconf_id: "' + chapter_player + '",' +
                'entry_id: "' + chapters_entry + '",' +
                'flashvars: {' +
                '"streamerType" : "' + chapters_streamertype + '",' +
                '"chaptersView": {' +
                '"plugin" : true,' +
                '"path" : "/p/' + sessInfo.pid + '/sp/' + sessInfo.pid + '00/flash/kdp3/v3.8_hds/plugins/facadePlugin.swf",' +
                '"includeInLayout" : false,' +
                '"relativeTo" : "video",' +
                '"position" : "before",' +
                '"onPageJs1" : "{onPagePluginPath}/chapters/chaptersView.js",' +
                '"onPageJs2" : "{onPagePluginPath}/libs/jcarousellite.js",' +
                '"onPageJs3" : "{onPagePluginPath}/libs/jquery.sortElements.js",' +
                '"onPageCss1" : "{onPagePluginPath}/chapters/chaptersView.css",' +
                '"containerId" : "",' +
                '"tags" : "chaptering",' +
                '"layout" : "' + chapters_layout + '",' +
                '"containerPosition" : "' + chapters_position + '",' +
                '"overflow" : ' + chapters_overflow + ',' +
                '"includeThumbnail" : ' + chapters_thumbnail + ',' +
                '"thumbnailWidth" : "' + chapters_thumbnail_width + '",' +
                '"horizontalChapterBoxWidth" : "' + chapterBoxWidth + '",' +
                '"thumbnailRotator" : ' + chapters_thumbrotator + ',' +
                '"includeChapterNumberPattern" : "' + chapters_numberpattern + '",' +
                '"includeChapterStartTime" : ' + chapters_startime + ',' +
                '"includeChapterDuration" : ' + chapters_duration + ',' +
                '"pauseAfterChapter" : ' + chapters_pause + ',' +
                '"titleLimit" : "' + chapters_titlelimit + '",' +
                '"descriptionLimit" : "' + chapters_descriptionlimit + '",' +
                '"chapterRenderer" : "onChapterRenderer",' +
                '"chaptersRenderDone" : "onChaptersRenderDone"' +
                '}' +
                '}' +
                '});' +
                '</script>';
        return player_script;
    },
    //Updates Chapters preview
    updateChapter: function () {
        chapters_layout = $('#smh-modal2 select#chapters-layout option:selected').val();
        chapters_position = $('#smh-modal2 select#chapters-position option:selected').val();
        chapters_overflow = $('#smh-modal2 select#chapters-overflow option:selected').val() == "true" ? true : false;
        chapters_thumbnail = $('#smh-modal2 select#chapters-thumbnail option:selected').val() == "true" ? true : false;
        chapters_thumbnail_width = $('#smh-modal2 #chapters-thumbnailWidth').val();
        chapterBoxWidth = $('#smh-modal2 #chapterBoxWidth').val();
        chapters_thumbrotator = $('#smh-modal2 select#chapters-thumbrotator option:selected').val();
        chapters_numberpattern = $('#smh-modal2 #chapters-numberpattern').val();
        chapters_startime = $('#smh-modal2 select#chapters-startime option:selected').val() == "true" ? true : false;
        chapters_duration = $('#smh-modal2 select#chapters-duration option:selected').val() == "true" ? true : false;
        chapters_pause = $('#smh-modal2 select#chapters-pause option:selected').val() == "true" ? true : false;
        chapters_titlelimit = $('#smh-modal2 #chapters-titlelimit').val();
        chapters_descriptionlimit = $('#smh-modal2 #chapters-descriptionlimit').val();
        chapters_streamertype = $('#smh-modal2 select#chapters-streamer option:selected').val();
        chapter_player = $('#smh-modal2 select#chapter_players option:selected').val();
        kWidget.destroy('smh_chapters_player');
        var width, height;
        $.each(chapters_array, function (key, value) {
            if (chapter_player == value[0]) {
                width = value[1];
                height = value[2];
            }
        });

        var wrapper_width;
        if (chapters_position == 'before' || chapters_position == 'after' || chapters_layout == 'horizontal') {
            wrapper_width = Number(width);
        } else {
            wrapper_width = Number(width) + Number(chapterBoxWidth) + 17;
        }

        $('#smh-modal2 #player-wrapper').css('width', wrapper_width);
        $('#smh-modal2 #smh_chapters_player').css({
            'width': width,
            'height': height
        });
        kWidget.embed({
            targetId: "smh_chapters_player",
            wid: "_" + sessInfo.pid,
            uiconf_id: chapter_player,
            entry_id: chapters_entry,
            flashvars: {
                "streamerType": chapters_streamertype,
                "chaptersView": {
                    "plugin": true,
                    "path": "/p/" + sessInfo.pid + "/sp/" + sessInfo.pid + "00/flash/kdp3/v3.8_hds/plugins/facadePlugin.swf",
                    "includeInLayout": false,
                    "relativeTo": "video",
                    "position": "before",
                    "onPageJs1": "{onPagePluginPath}/chapters/chaptersView.js",
                    "onPageJs2": "{onPagePluginPath}/libs/jcarousellite.js",
                    "onPageJs3": "{onPagePluginPath}/libs/jquery.sortElements.js",
                    "onPageCss1": "{onPagePluginPath}/chapters/chaptersView.css",
                    "containerId": "",
                    "tags": "chaptering",
                    "layout": chapters_layout,
                    "containerPosition": chapters_position,
                    "overflow": chapters_overflow,
                    "includeThumbnail": chapters_thumbnail,
                    "thumbnailWidth": chapters_thumbnail_width,
                    "horizontalChapterBoxWidth": chapterBoxWidth,
                    "thumbnailRotator": chapters_thumbrotator,
                    "includeChapterNumberPattern": chapters_numberpattern,
                    "includeChapterStartTime": chapters_startime,
                    "includeChapterDuration": chapters_duration,
                    "pauseAfterChapter": chapters_pause,
                    "titleLimit": chapters_titlelimit,
                    "descriptionLimit": chapters_descriptionlimit,
                    "chapterRenderer": "onChapterRenderer",
                    "chaptersRenderDone": "onChaptersRenderDone"
                }
            },
            'params': {
                'wmode': 'transparent'
            }
        });

        var player_script = smhContent.getPlayerScriptEmbed();
        var jquery = '<script>if( !window.jQuery ){document.write(\'<script type="text/javascript" src="http://mediaplatform.streamingmediahosting.com/html5/html5lib/' + html5_ver + '/resources/jquery/jquery.min.js"><\\/script>\');}</script><div id="smh_chapters_player" style="width:' + width + 'px;height:' + height + 'px;"></div>';
        $('#smh-modal2 #embed_code').text(jquery + player_script);
    },
    //Saves Chapter Configuration
    saveChapterConfig: function () {
        chapters_layout = $('#smh-modal2 select#chapters-layout option:selected').val();
        chapters_position = $('#smh-modal2 select#chapters-position option:selected').val();
        chapters_overflow = $('#smh-modal2 select#chapters-overflow option:selected').val() == "true" ? true : false;
        chapters_thumbnail = $('#smh-modal2 select#chapters-thumbnail option:selected').val() == "true" ? true : false;
        chapters_thumbnail_width = $('#smh-modal2 #chapters-thumbnailWidth').val();
        chapterBoxWidth = $('#smh-modal2 #chapterBoxWidth').val();
        chapters_thumbrotator = $('#smh-modal2 select#chapters-thumbrotator option:selected').val();
        chapters_numberpattern = $('#smh-modal2 #chapters-numberpattern').val();
        chapters_startime = $('#smh-modal2 select#chapters-startime option:selected').val() == "true" ? true : false;
        chapters_duration = $('#smh-modal2 select#chapters-duration option:selected').val() == "true" ? true : false;
        chapters_pause = $('#smh-modal2 select#chapters-pause option:selected').val() == "true" ? true : false;
        chapters_titlelimit = $('#smh-modal2 #chapters-titlelimit').val();
        chapters_descriptionlimit = $('#smh-modal2 #chapters-descriptionlimit').val();
        chapters_streamertype = $('#smh-modal2 select#chapters-streamer option:selected').val();
        chapter_player = $('#smh-modal2 select#chapter_players option:selected').val();
        smhContent.saveChaptersPlayer();
    },
    //Saves Chapters player
    saveChaptersPlayer: function () {
        var cb2 = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            $('#smh-modal2 #chapter-result').html('<span class="label label-success">Player Successfully Saved!</span>');
            setTimeout(function () {
                $('#smh-modal2 #chapter-result').html('');
            }, 3000);
        };

        var cb1 = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }

            var baseEntry = new KalturaBaseEntry();
            if (results['partnerData']) {
                var pData = $.parseJSON(results['partnerData']);
                var survey = false;
                var surveyData = '';

                $.each(pData, function (key1, value1) {
                    if (key1 == 'surveyConfig') {
                        survey = true;
                        $.each(value1, function (key2, value2) {
                            surveyData = '"surveyConfig":[{"player":"' + value2.player + '","streamerType":"' + value2.streamerType + '","backgroundHexColor":"' + value2.backgroundHexColor + '","backgroundAlpha":"' + value2.backgroundAlpha + '"}]';
                        });
                    }
                });

                if (survey) {
                    baseEntry.partnerData = '{"chaptersConfig":[{"player":"' + chapter_player + '","streamerType":"' + chapters_streamertype + '","layout":"' + chapters_layout + '","containerPosition":"' + chapters_position + '","overflow":"' + chapters_overflow + '","includeThumbnail":"' + chapters_thumbnail + '","thumbnailWidth":"' + chapters_thumbnail_width + '","horizontalChapterBoxWidth":"' + chapterBoxWidth + '","thumbnailRotator":"' + chapters_thumbrotator + '","includeChapterNumberPattern":"' + chapters_numberpattern + '","includeChapterStartTime":"' + chapters_startime + '","includeChapterDuration":"' + chapters_duration + '","pauseAfterChapter":"' + chapters_pause + '","titleLimit":"' + chapters_titlelimit + '","descriptionLimit":"' + chapters_descriptionlimit + '"}],' + surveyData + '}';
                } else {
                    baseEntry.partnerData = '{"chaptersConfig":[{"player":"' + chapter_player + '","streamerType":"' + chapters_streamertype + '","layout":"' + chapters_layout + '","containerPosition":"' + chapters_position + '","overflow":"' + chapters_overflow + '","includeThumbnail":"' + chapters_thumbnail + '","thumbnailWidth":"' + chapters_thumbnail_width + '","horizontalChapterBoxWidth":"' + chapterBoxWidth + '","thumbnailRotator":"' + chapters_thumbrotator + '","includeChapterNumberPattern":"' + chapters_numberpattern + '","includeChapterStartTime":"' + chapters_startime + '","includeChapterDuration":"' + chapters_duration + '","pauseAfterChapter":"' + chapters_pause + '","titleLimit":"' + chapters_titlelimit + '","descriptionLimit":"' + chapters_descriptionlimit + '"}]}';
                }
            } else {
                baseEntry.partnerData = '{"chaptersConfig":[{"player":"' + chapter_player + '","streamerType":"' + chapters_streamertype + '","layout":"' + chapters_layout + '","containerPosition":"' + chapters_position + '","overflow":"' + chapters_overflow + '","includeThumbnail":"' + chapters_thumbnail + '","thumbnailWidth":"' + chapters_thumbnail_width + '","horizontalChapterBoxWidth":"' + chapterBoxWidth + '","thumbnailRotator":"' + chapters_thumbrotator + '","includeChapterNumberPattern":"' + chapters_numberpattern + '","includeChapterStartTime":"' + chapters_startime + '","includeChapterDuration":"' + chapters_duration + '","pauseAfterChapter":"' + chapters_pause + '","titleLimit":"' + chapters_titlelimit + '","descriptionLimit":"' + chapters_descriptionlimit + '"}]}';
            }
            client.baseEntry.update(cb2, entryId, baseEntry);
        };

        $('#smh-modal2 #chapter-result').html('<span class="label label-success">Saving Player...</span>');
        var entryId = chapters_entry;
        var baseEntry = new KalturaBaseEntry();
        client.baseEntry.get(cb1, entryId, baseEntry);
    },
    surveyPlugin: function (id) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '826px');
        $('#smh-modal .modal-body').css('height', '545px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Survey</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<iframe id="survey" scrolling="no" width="810px" height="485px" frameborder="0" src="html5/html5lib/' + html5_ver + '/kWidget/onPagePlugins/limeSurveyCuePointForms/surveyEdit.php?ks=' + sessInfo.ks + '&pid=' + sessInfo.pid + '&eid=' + id + '" /><div style="margin-left:auto; margin-right:auto; width: 170px;"><button class="btn btn-default" onclick="smhContent.surveyVeiw(\'' + id + '\')">Preview & Embed</button></div>';
        $('#smh-modal .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    surveyVeiw: function (id) {
        survey_player = '6710347';
        survey_streamertype = 'rtmp';
        survey_hexcolor = '#ccccff';
        survey_alpha = '0.4';
        survey_entry = id;

        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            if (results['partnerData']) {
                var partnerData = $.parseJSON(results['partnerData']);
                $.each(partnerData, function (key, value) {
                    if (key == 'surveyConfig') {
                        $.each(value, function (key4, value4) {
                            survey_streamertype = value4.streamerType;
                            survey_player = value4.player;
                            survey_hexcolor = value4.backgroundHexColor;
                            survey_alpha = value4.backgroundAlpha;
                        });
                    }
                });
            }

            var players = uiconf_ids;
            var width = 400;
            var height = 330;

            $.each(players, function (key, value) {
                if (value['id'] == survey_player) {
                    width = value['width'];
                    height = value['height'];
                }
            });

            var wrapper_width;
            wrapper_width = Number(width);

            var iframe_width;
            var iframe_height;
            if (Number(wrapper_width) < 778) {
                iframe_width = 778;
                iframe_height = Number(height) + 470;
            } else {
                iframe_width = Number(wrapper_width) + 30;
                iframe_height = Number(height) + 500;
            }
            var hex = survey_hexcolor.substring(1);

            smhContent.resetModal();
            var header, content, footer;
            $('.smh-dialog2').css('width', '905px');
            $('#smh-modal2 .modal-body').css('height', '819px');
            $('#smh-modal2').modal({
                backdrop: 'static'
            });

            $('#smh-modal2').css('z-index', '2000');
            $('#smh-modal').css('z-index', '2');

            header = '<button type="button" class="close smh-close2 survey-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Survey View</h4>';
            $('#smh-modal2 .modal-header').html(header);

            content = '<div style="margin-left: auto; margin-right: auto; width: ' + iframe_width + 'px;"><iframe id="survey-view" scrolling="no" width="' + iframe_width + 'px" height="' + iframe_height + 'px" frameborder="0" src="html5/html5lib/' + html5_ver + '/kWidget/onPagePlugins/limeSurveyCuePointForms/surveyView.php?ks=' + sessInfo.ks + '&pid=' + sessInfo.pid + '&eid=' + survey_entry + '&width=' + width + '&height=' + height + '&wrapper_width=' + wrapper_width + '&uiconf=' + survey_player + '&streamer=' + survey_streamertype + '&hexcolor=' + hex + '&alpha=' + survey_alpha + '" /></div>';
            $('#smh-modal2 .modal-body').html(content);

            footer = '<button type="button" class="btn btn-default smh-close2 survey-close" data-dismiss="modal">Close</button>';
            $('#smh-modal2 .modal-footer').html(footer);
        }

        var version;
        client.baseEntry.get(cb, id, version);
    },
    //Captions Modal
    editCaptions: function (id) {
        cap_e = '';
        cap_flavor = '';
        cap_ex = '';
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            var cap_found = false;

            $.each(results, function (key, value) {
                if (value['flavorAsset'] != null) {
                    var entry = value['flavorAsset']['entryId'];
                    var format = value['flavorAsset']['fileExt'];
                    var asset_id = value['flavorAsset']['id'];
                    if (!cap_found) {
                        if (format == 'mp4') {
                            cap_found = true;
                            cap_e = entry;
                            cap_flavor = asset_id;
                            cap_ex = format;
                        }
                    }
                }
            });

            var cap_button = '';
            var cap_details = '';
            if (cap_ex == 'mp4' && !navigator.userAgent.match(/msie|trident/i)) {
                cap_button = '<button id="create-cap" class="btn btn-default" onclick="showEditor();">Create Caption File</button>';
                cap_details = '<br>To create a caption file, click on the "Create Caption File" button to invoke the captions editor.';
            }

            smhContent.resetModal();
            var header, content, footer;
            $('.smh-dialog').css('width', '994px');
            $('#smh-modal .modal-body').css('height', '425px');
            $('#smh-modal').modal({
                backdrop: 'static'
            });

            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Captions</h4>';
            $('#smh-modal .modal-header').html(header);

            content = '<div id="cap-header">' +
                    'You can add multiple captions files to each entry (e.g., for multiple languages).<br />' +
                    'To assign a file, either paste an external URL of the file or upload a SRT/DFXP file from your computer.' + cap_details + '<br>' +
                    '<div style="margin-top: 10px; margin-bottom: 10px; float: left;"><button id="add-cap" class="btn btn-default" onclick="smhContent.addCaption(\'' + id + '\');">Add Another Caption</button></div><div id="create-cap-button" style="margin-top: 10px; margin-bottom: 10px; float: left; margin-left: 10px;">' + cap_button + '</div>' +
                    '<span style="float: right;"><a href="#" id="refresh" onClick="smhContent.refreshCaptions(\'' + id + '\')"><i class="fa fa-refresh"></i> Refresh</a></span>' +
                    '</div>' +
                    '<div class="clear"></div>' +
                    '<div id="cap-table" style="padding-top: 10px;"></div>';
            $('#smh-modal .modal-body').html(content);

            footer = '<button type="button" class="btn btn-default smh-close" data-dismiss="modal">Close</button>';
            $('#smh-modal .modal-footer').html(footer);
            smhContent.loadCaptions(id);

        };
        client.flavorAsset.getFlavorAssetsWithParams(cb, id);
    },
    //Loads caption files for entry
    loadCaptions: function (id) {
        CAP_RESULTS = new Array();
        cap_num = 0;
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }

            var myData = results['objects'];
            var cap_options, cap_srt_check, cap_dfxp_check, label, cap_status, cap_lang, cap_id, cap_default, cap_url, language;

            $.each(myData, function (key, value) {
                if (value['fileExt'] == 'srt') {
                    cap_srt_check = 'checked';
                    cap_options = '<option value="srt" ' + cap_srt_check + '>SRT</option><option value="dfxp" >DFXP (XML)</option>';
                } else {
                    cap_srt_check = '';
                }

                if (value['fileExt'] == 'xml' || value['fileExt'] == 'dfxp') {
                    cap_dfxp_check = 'checked';
                    cap_options = '<option value="dfxp" ' + cap_dfxp_check + '>DFXP (XML)</option><option value="srt">SRT</option>';
                } else {
                    cap_dfxp_check = '';
                }

                if (value['label'] == null) {
                    label = '';
                } else {
                    label = value['label'];
                }

                if (value['status'] == '3') {
                    cap_status = 'Deleted';
                } else if (value['status'] == '-1') {
                    cap_status = 'Error';
                } else if (value['status'] == '7') {
                    cap_status = 'Uploading';
                } else if (value['status'] == '0') {
                    cap_status = 'Queued';
                } else if (value['status'] == '2') {
                    cap_status = 'Saved';
                }

                cap_lang = '"' + value['language'] + '"';

                cap_id = value['id'];

                if (value['isDefault'] == true) {
                    cap_default = '';
                } else {
                    cap_default = '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="smhContent.setCapDefault(\'' + id + '\',\'' + cap_id + '\');">Set as Default</a></li>';
                }

                if (cap_status == 'Error') {
                    cap_url = '';
                } else {
                    cap_url = '/api_v3/service/caption_captionAsset/action/serve/ks/' + sessInfo.ks + '/captionAssetId/' + cap_id;
                }

                language = '<option value="none">Select a Language</option>' +
                        '<option value="Abkhazian">Abkhazian</option>' +
                        '<option value="Afar">Afar</option>' +
                        '<option value="Afrikaans">Afrikaans</option>' +
                        '<option value="Albanian">Albanian</option>' +
                        '<option value="Amharic">Amharic</option>' +
                        '<option value="Arabic">Arabic</option>' +
                        '<option value="Armenian">Armenian</option>' +
                        '<option value="Assamese">Assamese</option>' +
                        '<option value="Aymara">Aymara</option>' +
                        '<option value="Azerbaijani">Azerbaijani</option>' +
                        '<option value="Bashkir">Bashkir</option>' +
                        '<option value="Basque">Basque</option>' +
                        '<option value="Bengali (Bangla)">Bengali (Bangla)</option>' +
                        '<option value="Bhutani">Bhutani</option>' +
                        '<option value="Bihari">Bihari</option>' +
                        '<option value="Bislama">Bislama</option>' +
                        '<option value="Breton">Breton</option>' +
                        '<option value="Bulgarian">Bulgarian</option>' +
                        '<option value="Burmese">Burmese</option>' +
                        '<option value="Byelorussian">Byelorussian</option>' +
                        '<option value="Cambodian">Cambodian</option>' +
                        '<option value="Catalan">Catalan</option>' +
                        '<option value="Chinese">Chinese</option>' +
                        '<option value="Corsican">Corsican</option>' +
                        '<option value="Croatian">Croatian</option>' +
                        '<option value="Czech">Czech</option>' +
                        '<option value="Danish">Danish</option>' +
                        '<option value="Dutch">Dutch</option>' +
                        '<option value="English">English</option>' +
                        '<option value="Esperanto">Esperanto</option>' +
                        '<option value="Estonian">Estonian</option>' +
                        '<option value="Faeroese">Faeroese</option>' +
                        '<option value="Farsi">Farsi</option>' +
                        '<option value="Fiji">Fiji</option>' +
                        '<option value="Finnish">Finnish</option>' +
                        '<option value="French">French</option>' +
                        '<option value="Frisian">Frisian</option>' +
                        '<option value="Galician">Galician</option>' +
                        '<option value="Gaelic (Scottish)">Gaelic (Scottish)</option>' +
                        '<option value="Gaelic (Manx)">Gaelic (Manx)</option>' +
                        '<option value="Georgian">Georgian</option>' +
                        '<option value="German">German</option>' +
                        '<option value="Greek">Greek</option>' +
                        '<option value="Greenlandic">Greenlandic</option>' +
                        '<option value="Guarani">Guarani</option>' +
                        '<option value="Gujarati">Gujarati</option>' +
                        '<option value="Hausa">Hausa</option>' +
                        '<option value="Hebrew">Hebrew</option>' +
                        '<option value="Hindi">Hindi</option>' +
                        '<option value="Hungarian">Hungarian</option>' +
                        '<option value="Icelandic">Icelandic</option>' +
                        '<option value="Indonesian">Indonesian</option>' +
                        '<option value="Interlingua">Interlingua</option>' +
                        '<option value="Interlingue">Interlingue</option>' +
                        '<option value="Inuktitut">Inuktitut</option>' +
                        '<option value="Inupiak">Inupiak</option>' +
                        '<option value="Irish">Irish</option>' +
                        '<option value="Italian">Italian</option>' +
                        '<option value="Japanese">Japanese</option>' +
                        '<option value="Javanese">Javanese</option>' +
                        '<option value="Kannada">Kannada</option>' +
                        '<option value="Kashmiri">Kashmiri</option>' +
                        '<option value="Kazakh">Kazakh</option>' +
                        '<option value="Kinyarwanda (Ruanda)">Kinyarwanda (Ruanda)</option>' +
                        '<option value="Kirghiz">Kirghiz</option>' +
                        '<option value="Kirundi (Rundi)">Kirundi (Rundi)</option>' +
                        '<option value="Korean">Korean</option>' +
                        '<option value="Kurdish">Kurdish</option>' +
                        '<option value="Laothian">Laothian</option>' +
                        '<option value="Latvian (Lettish)">Latvian (Lettish)</option>' +
                        '<option value="Limburgish (Limburger)">Limburgish (Limburger)</option>' +
                        '<option value="Lingala">Lingala</option>' +
                        '<option value="Lithuanian">Lithuanian</option>' +
                        '<option value="Macedonian">Macedonian</option>' +
                        '<option value="Malagasy">Malagasy</option>' +
                        '<option value="Malay">Malay</option>' +
                        '<option value="Malayalam">Malayalam</option>' +
                        '<option value="Maltese">Maltese</option>' +
                        '<option value="Marathi">Marathi</option>' +
                        '<option value="Moldavian">Moldavian</option>' +
                        '<option value="Mongolian">Mongolian</option>' +
                        '<option value="Nauru">Nauru</option>' +
                        '<option value="Nepali">Nepali</option>' +
                        '<option value="Norwegian">Norwegian</option>' +
                        '<option value="Occitan">Occitan</option>' +
                        '<option value="Oriya">Oriya</option>' +
                        '<option value="Oromo (Afan, Galla)">Oromo (Afan, Galla)</option>' +
                        '<option value="Pashto (Pushto)">Pashto (Pushto)</option>' +
                        '<option value="Polish">Polish</option>' +
                        '<option value="Portuguese">Portuguese</option>' +
                        '<option value="Punjabi">Punjabi</option>' +
                        '<option value="Quechua">Quechua</option>' +
                        '<option value="Rhaeto-Romance">Rhaeto-Romance</option>' +
                        '<option value="Romanian">Romanian</option>' +
                        '<option value="Russian">Russian</option>' +
                        '<option value="Samoan">Samoan</option>' +
                        '<option value="Sangro">Sangro</option>' +
                        '<option value="Sanskrit">Sanskrit</option>' +
                        '<option value="Serbian">Serbian</option>' +
                        '<option value="Serbo-Croatian">Serbo-Croatian</option>' +
                        '<option value="Sesotho">Sesotho</option>' +
                        '<option value="Setswana">Setswana</option>' +
                        '<option value="Shona">Shona</option>' +
                        '<option value="Sindhi">Sindhi</option>' +
                        '<option value="Sinhalese">Sinhalese</option>' +
                        '<option value="Siswati">Siswati</option>' +
                        '<option value="Slovak">Slovak</option>' +
                        '<option value="Slovenian">Slovenian</option>' +
                        '<option value="Somali">Somali</option>' +
                        '<option value="Spanish">Spanish</option>' +
                        '<option value="Sundanese">Sundanese</option>' +
                        '<option value="Swahili (Kiswahili)">Swahili (Kiswahili)</option>' +
                        '<option value="Swedish">Swedish</option>' +
                        '<option value="Tagalog">Tagalog</option>' +
                        '<option value="Tajik">Tajik</option>' +
                        '<option value="Tamil">Tamil</option>' +
                        '<option value="Tatar">Tatar</option>' +
                        '<option value="Telugu">Telugu</option>' +
                        '<option value="Thai">Thai</option>' +
                        '<option value="Tibetan">Tibetan</option>' +
                        '<option value="Tigrinya">Tigrinya</option>' +
                        '<option value="Tonga">Tonga</option>' +
                        '<option value="Tsonga">Tsonga</option>' +
                        '<option value="Turkish">Turkish</option>' +
                        '<option value="Turkmen">Turkmen</option>' +
                        '<option value="Twi">Twi</option>' +
                        '<option value="Uighur">Uighur</option>' +
                        '<option value="Ukrainian">Ukrainian</option>' +
                        '<option value="Urdu">Urdu</option>' +
                        '<option value="Uzbek">Uzbek</option>' +
                        '<option value="Vietnamese">Vietnamese</option>' +
                        '<option value="Volapuk">Volapuk</option>' +
                        '<option value="Welsh">Welsh</option>' +
                        '<option value="Wolof">Wolof</option>' +
                        '<option value="Xhosa">Xhosa</option>' +
                        '<option value="Yiddish">Yiddish</option>' +
                        '<option value="Yoruba">Yoruba</option>' +
                        '<option value="Zulu">Zulu</option>';

                var re = new RegExp(cap_lang, 'g')
                var lang = language.replace(re, '"' + value['language'] + '" selected');
                var cap_edit = '';
                if (!navigator.userAgent.match(/msie|trident/i) && value['fileExt'] == 'srt') {
                    cap_edit = '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="smhContent.editCap(\'' + cap_url + '\');">Edit Caption</a></li>';
                }

                var cap_select = '<div class="btn-group"><button class="btn btn-default" type="button">Select Action</button><button aria-expanded="false" data-toggle="dropdown" id="dropdownMenu" type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button><ul class="dropdown-menu" id="menu" role="menu" aria-labelledby="dropdownMenu"><li role="presentation"><a role="menuitem" tabindex="-1" onclick="smhContent.updateCap(\'' + id + '\',\'' + cap_id + '\',' + cap_num + ');">Update</a></li><li role="presentation"><a role="menuitem" tabindex="-1" onclick="smhContent.deleteCap(\'' + id + '\',\'' + cap_id + '\');">Remove</a></li><li role="presentation"><a role="menuitem" tabindex="-1" onclick="smhContent.dwnldCap(\'' + cap_url + '\');">Download File</a></li>' + cap_default + cap_edit + '</ul></div>';
                CAP_RESULTS.push(new Array('<input type="text" name="file-location" class="form-control" style="width: 100%;" id="cap-url' + cap_num + '" name="filelocation" value="http://mediaplatform.streamingmediahosting.com' + cap_url + '" />', '<div style="margin-left: auto; margin-right: auto; width: 120px;"><select id="cap-type' + cap_num + '" class="form-control" disabled>' + cap_options + '</select></div>', '<div style="margin-left: auto; margin-right: auto; width: 203px;"><select name="cap-language" class="form-control" id="cap-language' + cap_num + '">' + lang + '</select></div>', '<input type="text" style="width: 100%;" class="form-control" name="label" id="cap-label' + cap_num + '" value="' + label + '"/>', '<div style="margin-left:auto; margin-right:auto; width: 50px;">' + cap_status + '</div>', cap_select));
                cap_num++;
            });

            $('#cap-table').empty();
            $('#cap-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="cap-data"></table>');
            $('#cap-data').dataTable({
                "dom": 'R<"H"lfr>t<"F"ip>',
                "order": [],
                "ordering": false,
                "jQueryUI": false,
                "processing": true,
                "serverSide": false,
                "autoWidth": false,
                "paging": true,
                "searching": false,
                "info": false,
                "lengthChange": false,
                "data": CAP_RESULTS,
                "pagingType": "bootstrap",
                "pageLength": 4,
                "language": {
                    "zeroRecords": "No Captions Found"
                },
                "columns": [
                    {
                        "title": "<span style='float: left;'>File Location</span>",
                        "width": "120px"
                    },
                    {
                        "title": "<span style='float: left;'>File Type</span>",
                        "width": "70px"
                    },
                    {
                        "title": "<span style='float: left;'>Language</span>",
                        "width": "120px"
                    },
                    {
                        "title": "<span style='float: left;'>Label</span>",
                        "width": "70px"
                    },
                    {
                        "title": "<span style='float: left;'>Status</span>",
                        "width": "70px"
                    },
                    {
                        "title": "<span style='float: left;'>Actions</span>",
                        "width": "120px"
                    }
                ],
                "drawCallback": function (oSettings) {
                    smhMain.fcmcAddRows(this, 6, 4);
                }
            });
        };

        var filter = new KalturaAssetFilter();
        filter.entryIdEqual = id;
        var pager;
        client.captionAsset.listAction(cb, filter, pager);
    },
    //Do refresh Captions
    refreshCaptions: function (entry_id) {
        $('#cap-data_processing').css('display', 'inline');
        smhContent.loadCaptions(entry_id);
    },
    //Do update Caption
    updateCap: function (entry_id, cap_id, num) {
        var lang = $("#cap-language" + num).val();
        var label = $("#cap-label" + num).val();
        if (lang == 'none') {
            alert('You must select a language');
        } else {
            var cb = function (success, results) {
                if (!success)
                    alert(results);

                if (results.code && results.message) {
                    alert(results.message);
                    return;
                }
                smhContent.purgeCache('caption');
                $('#cap-data_processing').css('display', 'none');
                smhContent.loadCaptions(entry_id);
            };

            $('#cap-data_processing').css('display', 'inline');
            var captionAsset = new KalturaCaptionAsset();
            captionAsset.language = lang;
            captionAsset.label = label;
            client.captionAsset.update(cb, cap_id, captionAsset);
        }
    },
    //Deletes caption file
    deleteCap: function (entry_id, cap_id) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results == null) {
                smhContent.purgeCache('caption');
                $('#cap-data_processing').css('display', 'none');
                smhContent.loadCaptions(entry_id);
            } else if (results.code && results.message) {
                alert(results.message);
                return;
            }
        };
        $('#cap-data_processing').css('display', 'inline');
        client.captionAsset.deleteAction(cb, cap_id);
    },
    //Sets default caption file
    setCapDefault: function (entry_id, cap_id) {
        var cb = function (success, results) {
            if (!success)
                alert(results);
            if (results == null) {
                smhContent.purgeCache('caption');
                $('#cap-data_processing').css('display', 'none');
                smhContent.loadCaptions(entry_id);
            } else if (results.code && results.message) {
                alert(results.message);
                return;
            }
        };
        $('#cap-data_processing').css('display', 'inline');
        client.captionAsset.setAsDefault(cb, cap_id);
    },
    //Downloads Caption file
    dwnldCap: function (url) {
        window.open(url);
    },
    //Add caption
    addCaption: function (id) {
        var language = '<option value="none">Select a Language</option>' +
                '<option value="Abkhazian">Abkhazian</option>' +
                '<option value="Afar">Afar</option>' +
                '<option value="Afrikaans">Afrikaans</option>' +
                '<option value="Albanian">Albanian</option>' +
                '<option value="Amharic">Amharic</option>' +
                '<option value="Arabic">Arabic</option>' +
                '<option value="Armenian">Armenian</option>' +
                '<option value="Assamese">Assamese</option>' +
                '<option value="Aymara">Aymara</option>' +
                '<option value="Azerbaijani">Azerbaijani</option>' +
                '<option value="Bashkir">Bashkir</option>' +
                '<option value="Basque">Basque</option>' +
                '<option value="Bengali (Bangla)">Bengali (Bangla)</option>' +
                '<option value="Bhutani">Bhutani</option>' +
                '<option value="Bihari">Bihari</option>' +
                '<option value="Bislama">Bislama</option>' +
                '<option value="Breton">Breton</option>' +
                '<option value="Bulgarian">Bulgarian</option>' +
                '<option value="Burmese">Burmese</option>' +
                '<option value="Byelorussian">Byelorussian</option>' +
                '<option value="Cambodian">Cambodian</option>' +
                '<option value="Catalan">Catalan</option>' +
                '<option value="Chinese">Chinese</option>' +
                '<option value="Corsican">Corsican</option>' +
                '<option value="Croatian">Croatian</option>' +
                '<option value="Czech">Czech</option>' +
                '<option value="Danish">Danish</option>' +
                '<option value="Dutch">Dutch</option>' +
                '<option value="English">English</option>' +
                '<option value="Esperanto">Esperanto</option>' +
                '<option value="Estonian">Estonian</option>' +
                '<option value="Faeroese">Faeroese</option>' +
                '<option value="Farsi">Farsi</option>' +
                '<option value="Fiji">Fiji</option>' +
                '<option value="Finnish">Finnish</option>' +
                '<option value="French">French</option>' +
                '<option value="Frisian">Frisian</option>' +
                '<option value="Galician">Galician</option>' +
                '<option value="Gaelic (Scottish)">Gaelic (Scottish)</option>' +
                '<option value="Gaelic (Manx)">Gaelic (Manx)</option>' +
                '<option value="Georgian">Georgian</option>' +
                '<option value="German">German</option>' +
                '<option value="Greek">Greek</option>' +
                '<option value="Greenlandic">Greenlandic</option>' +
                '<option value="Guarani">Guarani</option>' +
                '<option value="Gujarati">Gujarati</option>' +
                '<option value="Hausa">Hausa</option>' +
                '<option value="Hebrew">Hebrew</option>' +
                '<option value="Hindi">Hindi</option>' +
                '<option value="Hungarian">Hungarian</option>' +
                '<option value="Icelandic">Icelandic</option>' +
                '<option value="Indonesian">Indonesian</option>' +
                '<option value="Interlingua">Interlingua</option>' +
                '<option value="Interlingue">Interlingue</option>' +
                '<option value="Inuktitut">Inuktitut</option>' +
                '<option value="Inupiak">Inupiak</option>' +
                '<option value="Irish">Irish</option>' +
                '<option value="Italian">Italian</option>' +
                '<option value="Japanese">Japanese</option>' +
                '<option value="Javanese">Javanese</option>' +
                '<option value="Kannada">Kannada</option>' +
                '<option value="Kashmiri">Kashmiri</option>' +
                '<option value="Kazakh">Kazakh</option>' +
                '<option value="Kinyarwanda (Ruanda)">Kinyarwanda (Ruanda)</option>' +
                '<option value="Kirghiz">Kirghiz</option>' +
                '<option value="Kirundi (Rundi)">Kirundi (Rundi)</option>' +
                '<option value="Korean">Korean</option>' +
                '<option value="Kurdish">Kurdish</option>' +
                '<option value="Laothian">Laothian</option>' +
                '<option value="Latvian (Lettish)">Latvian (Lettish)</option>' +
                '<option value="Limburgish (Limburger)">Limburgish (Limburger)</option>' +
                '<option value="Lingala">Lingala</option>' +
                '<option value="Lithuanian">Lithuanian</option>' +
                '<option value="Macedonian">Macedonian</option>' +
                '<option value="Malagasy">Malagasy</option>' +
                '<option value="Malay">Malay</option>' +
                '<option value="Malayalam">Malayalam</option>' +
                '<option value="Maltese">Maltese</option>' +
                '<option value="Marathi">Marathi</option>' +
                '<option value="Moldavian">Moldavian</option>' +
                '<option value="Mongolian">Mongolian</option>' +
                '<option value="Nauru">Nauru</option>' +
                '<option value="Nepali">Nepali</option>' +
                '<option value="Norwegian">Norwegian</option>' +
                '<option value="Occitan">Occitan</option>' +
                '<option value="Oriya">Oriya</option>' +
                '<option value="Oromo (Afan, Galla)">Oromo (Afan, Galla)</option>' +
                '<option value="Pashto (Pushto)">Pashto (Pushto)</option>' +
                '<option value="Polish">Polish</option>' +
                '<option value="Portuguese">Portuguese</option>' +
                '<option value="Punjabi">Punjabi</option>' +
                '<option value="Quechua">Quechua</option>' +
                '<option value="Rhaeto-Romance">Rhaeto-Romance</option>' +
                '<option value="Romanian">Romanian</option>' +
                '<option value="Russian">Russian</option>' +
                '<option value="Samoan">Samoan</option>' +
                '<option value="Sangro">Sangro</option>' +
                '<option value="Sanskrit">Sanskrit</option>' +
                '<option value="Serbian">Serbian</option>' +
                '<option value="Serbo-Croatian">Serbo-Croatian</option>' +
                '<option value="Sesotho">Sesotho</option>' +
                '<option value="Setswana">Setswana</option>' +
                '<option value="Shona">Shona</option>' +
                '<option value="Sindhi">Sindhi</option>' +
                '<option value="Sinhalese">Sinhalese</option>' +
                '<option value="Siswati">Siswati</option>' +
                '<option value="Slovak">Slovak</option>' +
                '<option value="Slovenian">Slovenian</option>' +
                '<option value="Somali">Somali</option>' +
                '<option value="Spanish">Spanish</option>' +
                '<option value="Sundanese">Sundanese</option>' +
                '<option value="Swahili (Kiswahili)">Swahili (Kiswahili)</option>' +
                '<option value="Swedish">Swedish</option>' +
                '<option value="Tagalog">Tagalog</option>' +
                '<option value="Tajik">Tajik</option>' +
                '<option value="Tamil">Tamil</option>' +
                '<option value="Tatar">Tatar</option>' +
                '<option value="Telugu">Telugu</option>' +
                '<option value="Thai">Thai</option>' +
                '<option value="Tibetan">Tibetan</option>' +
                '<option value="Tigrinya">Tigrinya</option>' +
                '<option value="Tonga">Tonga</option>' +
                '<option value="Tsonga">Tsonga</option>' +
                '<option value="Turkish">Turkish</option>' +
                '<option value="Turkmen">Turkmen</option>' +
                '<option value="Twi">Twi</option>' +
                '<option value="Uighur">Uighur</option>' +
                '<option value="Ukrainian">Ukrainian</option>' +
                '<option value="Urdu">Urdu</option>' +
                '<option value="Uzbek">Uzbek</option>' +
                '<option value="Vietnamese">Vietnamese</option>' +
                '<option value="Volapuk">Volapuk</option>' +
                '<option value="Welsh">Welsh</option>' +
                '<option value="Wolof">Wolof</option>' +
                '<option value="Xhosa">Xhosa</option>' +
                '<option value="Yiddish">Yiddish</option>' +
                '<option value="Yoruba">Yoruba</option>' +
                '<option value="Zulu">Zulu</option>';
        var select = '<div class="btn-group">' +
                '<button type="button" class="btn btn-default">Select Action</button>' +
                '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-expanded="false"><span class="caret"></span></button>' +
                '<ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu">' +
                '<li role="presentation"><a onclick="smhContent.capSave(\'' + id + '\',' + cap_num + ');" tabindex="-1" role="menuitem">Save</a></li>' +
                '<li role="presentation"><a onclick="smhContent.capUpload(\'' + id + '\',' + cap_num + ');" tabindex="-1" role="menuitem">Upload File</a></li>' +
                '</ul>' +
                '</div>';
        CAP_RESULTS.push(new Array('<input type="text" style="width: 100%;" class="form-control" name="file-location" id="cap-url' + cap_num + '" />', '<div style="margin-left: auto; margin-right: auto; width: 120px;"><select id="cap-type' + cap_num + '" class="form-control"><option value="srt">SRT</option><option value="dfxp">DFXP (XML)</option></select></div>', '<div style="margin-left: auto; margin-right: auto; width: 203px;"><select name="cap-language" class="form-control" id="cap-language' + cap_num + '">' + language + '</select></div>', '<input type="text" style="width: 100%;" name="label" class="form-control" id="cap-label' + cap_num + '" />', '', select));
        cap_num++;
        smhContent.updateCaptionsList();
    },
    //Updates caption list
    updateCaptionsList: function () {
        $('#cap-table').empty();
        $('#cap-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="cap-data"></table>');
        $('#cap-data').dataTable({
            "dom": 'R<"H"lfr>t<"F"ip>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": true,
            "serverSide": false,
            "autoWidth": false,
            "paging": true,
            "searching": false,
            "info": false,
            "lengthChange": false,
            "data": CAP_RESULTS,
            "pagingType": "bootstrap",
            "pageLength": 4,
            "language": {
                "zeroRecords": "No Captions Found"
            },
            "columns": [
                {
                    "title": "<span style='float: left;'>File Location</span>",
                    "width": "120px"
                },
                {
                    "title": "<span style='float: left;'>File Type</span>",
                    "width": "70px"
                },
                {
                    "title": "<span style='float: left;'>Language</span>",
                    "width": "120px"
                },
                {
                    "title": "<span style='float: left;'>Label</span>",
                    "width": "70px"
                },
                {
                    "title": "<span style='float: left;'>Status</span>",
                    "width": "70px"
                },
                {
                    "title": "<span style='float: left;'>Actions</span>",
                    "width": "120px"
                }
            ],
            "drawCallback": function (oSettings) {
                smhMain.fcmcAddRows(this, 6, 4);
            }
        });
    },
    //Saves caption file
    capSave: function (id, num) {
        var url = $("#cap-url" + num).val();
        var lang = $("#cap-language" + num).val();
        var label = $("#cap-label" + num).val();
        if (url == null || url == '') {
            alert('You must either paste an external URL of the file or upload a SRT/DFXP file from your computer');
        } else if (lang == 'none') {
            alert('You must select a language');
        } else {
            var cb = function (success, results) {
                if (!success)
                    alert(results);

                if (results.code && results.message) {
                    alert(results.message);
                    return;
                }
                smhContent.setContentURL(id, results['id'], url);
            };

            var captionAsset = new KalturaCaptionAsset();
            captionAsset.language = lang;
            captionAsset.label = label;
            client.captionAsset.add(cb, id, captionAsset);
        }
    },
    setContentURL: function (entry_id, cap_id, cap_url) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            smhContent.purgeCache('caption');
            $('#cap-data_processing').css('display', 'none');
            smhContent.loadCaptions(entry_id);
        };

        $('#cap-data_processing').css('display', 'inline');
        var contentResource = new KalturaUrlResource();
        contentResource.url = cap_url;
        client.captionAsset.setContent(cb, cap_id, contentResource);
    },
    //Loads caption upload modal
    capUpload: function (id, num) {
        var url = $("#cap-url" + num).val();
        var type = $("#cap-type" + num).val();
        var lang = $("#cap-language" + num).val();
        var label = $("#cap-label" + num).val();
        if (lang == 'none') {
            alert('You must select a language');
        } else {

            var cb = function (success, results) {
                if (!success)
                    alert(results);

                if (results.code && results.message) {
                    alert(results.message);
                    return;
                }

                cap_entry = id;
                cap_url = url;
                cap_type = type;
                cap_lang = lang;
                cap_label = label;
                cap_token = results['id'];

                $('.smh-dialog2').css('width', '565px');
                $('#smh-modal2 .modal-body').css('height', '105px');
                $('#smh-modal2').modal({
                    backdrop: 'static'
                });
                $('#smh-modal2').css('z-index', '2000');
                $('#smh-modal').css('z-index', '2');

                var header, content, footer;

                header = '<button type="button" class="close smh-close2 survey-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Upload Caption File</h4>';
                $('#smh-modal2 .modal-header').html(header);

                content = '<div style="width: 425px; margin-left: auto; margin-right: auto;"><iframe style="width:0px;height:0px;border:0px;" name=hiddenIFrame />' +
                        '<form id="capUpload" enctype="multipart/form-data" target="hiddenIFrame" method="post" action="/api_v3/index.php?service=uploadtoken&action=upload">' +
                        '<input type="hidden" name="ks" value="' + sessInfo.ks + '">' +
                        '<input type="hidden" name="uploadTokenId" value="' + cap_token + '">' +
                        '<div style="float: left; display: inline-block;"><div style="float: left;">File:</div><input class="upload" type="file" name="fileData" style="width: 300px; border: 1px solid #CDCDCD; float: right; margin-left: 10px;"></div><div style="float: left; display: inline-block;"><input id="submit-button" class="btn btn-default" style="display: inline-block; margin-left: 10px;" type="submit" value="Upload" /></div>' +
                        '<div class="clear"></div>' +
                        '<div id="cap-status" style="width: 115px; margin-left: auto; margin-right: auto; margin-top: 6px;"></div>' +
                        '</form></div>';
                $('#smh-modal2 .modal-body').html(content);

                footer = '<button type="button" class="btn btn-default smh-close2 survey-close" data-dismiss="modal">Close</button>';
                $('#smh-modal2 .modal-footer').html(footer);

                $('#capUpload input[type="file"]').tooltipster({
                    trigger: 'custom',
                    onlyOne: false,
                    position: 'bottom'
                });

                validator = $("#capUpload").validate({
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
                        fileData: {
                            required: true
                        }
                    },
                    messages: {
                        fileData: {
                            required: "Error: No file selected"
                        }
                    }
                });
            };
            var uploadToken;
            client.uploadToken.add(cb, uploadToken);
        }
    },
    xml: function (what, where) {
        return jQuery(where).find(what).length > 0;
    },
    //Show caption file status while uploading
    before: function () {
        $('#cap-status').html('<span class="label label-success">Uploading File ...</span>');
    },
    //Show caption file status after uploading
    showResponse: function (responseText, statusText, xhr, $form) {
        if (smhContent.xml('error', responseText)) {
            $('#cap-status').empty();
            $('#cap-status').html('<span class="label label-success">File Upload Failed</span>');
        } else {
            $('#smh-modal2 .smh-close2').click();
            smhContent.addCap(cap_type, cap_lang, cap_label);
        }
    },
    //Adds caption file
    addCap: function (type, lang, label) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            smhContent.setContent(results['id']);
        };

        if (type == 'srt') {
            var format = 1;
        } else {
            format = 2;
        }

        $('#cap-data_processing').css('display', 'inline');
        var captionAsset = new KalturaCaptionAsset();
        captionAsset.fileExt = type;
        captionAsset.language = lang;
        captionAsset.label = label;
        captionAsset.format = format;
        client.captionAsset.add(cb, cap_entry, captionAsset);
    },
    setContent: function (cap_id) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            smhContent.purgeCache('caption');
            $('#cap-status').empty();
            $('#cap-data_processing').css('display', 'none');
            smhContent.loadCaptions(cap_entry);
        };

        var contentResource = new KalturaUploadedFileTokenResource();
        contentResource.token = cap_token;
        client.captionAsset.setContent(cb, cap_id, contentResource);
    },
    //Edit captions
    editCap: function (url) {
        cap_url = url;
        invokeEditor();
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
            success: function (data) {
                $.each(data['platforms'], function (key, value) {
                    if (value['platform'] == 'youtube_live') {
                        var yt_authorized = false;
                        if (value['authorized']) {
                            yt_authorized = true;
                        }
                        yt_ready = yt_authorized;
                    }
                    if (value['platform'] == 'facebook_live') {
                        var fb_authorized = false;
                        if (value['authorized']) {
                            fb_authorized = true;
                        }
                        fb_ready = fb_authorized;
                    }
                    if (value['platform'] == 'twitch') {
                        var twch_authorized = false;
                        if (value['authorized']) {
                            twch_authorized = true;
                        }
                        twch_ready = twch_authorized;
                    }
                });
            }
        });
    },
    //Register actions
    registerActions: function () {
        $('#smh-modal2').on('click', '#select-bttn', function (event) {
            $('#smh-modal2 #embed_code').select();
            $('#smh-modal2 #result-select').css({
                "display": "block",
                "margin-top": "10px",
                "font-weight": "bold",
                "width": "632px",
                "text-align": "center"
            });
            $('#smh-modal2 #result-select').html('<span class="label label-info">Press Ctrl+C to copy embed code (Command+C on Mac)</span>');
        });

        $('#smh-modal2').on('change', '.state', function () {
            $('#update-preview').removeClass("btn-disabled");
            $('#update-preview').addClass("btn-default");
            $('#update-preview').removeAttr("disabled");
            $('#save-config').removeClass("btn-disabled");
            $('#save-config').addClass("btn-default");
            $('#save-config').removeAttr("disabled");
            $('#result-select').css("display", "none");
        });

        $('#smh-modal').on('click', '.add-ls-close', function () {
            $('#add-ls-form input[type="text"]').tooltipster('destroy');
        });
        $('#smh-modal').on('click', '.edit-entry-close', function () {
            $('#edit-entry-form input[type="text"]').tooltipster('destroy');
        });
        $('#smh-modal3').on('click', '.smh-close', function () {
            $('#smh-modal3').on('hidden.bs.modal', function (e) {
                smhContent.resetPreviewModal();
            });
        });
        $('#smh-modal2').on('click', '.smh-close2', function () {
            $('#smh-modal').css('z-index', '');
            $('#smh-modal2').on('hidden.bs.modal', function (e) {
                $('body').addClass('modal-open');
            });
        });
        $('#smh-modal2').on('click', '.grab-thumb-close', function () {
            smhContent.loadThumbs(entryId);
        });
        $('#smh-modal').on('click', '.clip-close', function () {
            smhContent.getEntries();
            smhContent.resetClipModal();
        });
        $('#smh-modal2').on('click', '.flavor-close', function () {
            smhContent.refreshFlavors(flav_entryId);
        });
        $('#smh-modal4').on('click', '.smh-close4', function () {
            $('#smh-modal').css('z-index', '');
            $('#smh-modal4').on('hidden.bs.modal', function (e) {
                $('body').addClass('modal-open');
            });
        });

        $('#smh-modal').on('click', '#remove-tags-wrapper .tags-spacing', function () {
            if ($(this).hasClass('tag-selected')) {
                $(this).removeClass('tag-selected');
            } else {
                $(this).addClass('tag-selected');
            }
            if ($('#remove-tags-wrapper .tag-selected').length > 0) {
                $('#bulkremovetags-entries').removeAttr('disabled');
            } else {
                $('#bulkremovetags-entries').attr('disabled', '');
            }
        });

        $('#smh-modal').on('click', '#remove-cats-wrapper .cats-spacing', function () {
            if ($(this).hasClass('cats-selected')) {
                $(this).removeClass('cats-selected');
            } else {
                $(this).addClass('cats-selected');
            }
            if ($('#remove-cats-wrapper .cats-selected').length > 0) {
                $('#bulkremovecats-entries').removeAttr('disabled');
            } else {
                $('#bulkremovecats-entries').attr('disabled', '');
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
                        smhContent.loadThumbs(entryId);
                    }, 1800);
                },
                beforeSend: function () {
                    $('#smh-modal #loading img').css('display', 'inline-block');
                }
            };
            $(this).ajaxSubmit(options);
            return false;
        });

        $('#smh-modal2').on('submit', '#capUpload', function () {
            var valid = validator.form();
            if (valid) {
                var options = {
                    dataType: 'xml',
                    success: smhContent.showResponse,
                    beforeSend: smhContent.before,
                    complete: function (xhr) {
                    }
                };
                $(this).ajaxSubmit(options);
                return false;
            }
        });

        $('#entries-table-wrapper').on('click', '#menu1 li a', function () {
            var selText = $(this).text();
            $(this).parents('.dropdown').find('.filter-btn').html('<span class="text">' + selText + '</span>');
        });
        $('#entries-table-wrapper').on('click', '#menu2 li a', function () {
            var selText = $(this).text();
            $(this).parents('.dropdown').find('.filter-btn').html('<span class="text">' + selText + '</span>');
        });

        $('#entries-table-wrapper').on('change', '#date-picker-1', function () {
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

            smhContent.getGraphData(days_from_today, from, to, days, 'top_content', 'count_plays', graph_entryId);
            smhContent.getTotalPlays(from, to, 'top_content', graph_entryId);
        });
        $('#entries-table-wrapper').on('change', '#date-picker-2', function () {
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

            smhContent.getGraphData(days_from_today, from, to, days, 'top_content', 'count_plays', graph_entryId);
            smhContent.getTotalPlays(from, to, 'top_content', graph_entryId);
        });
        $('#entries-table-wrapper').on('change', '#date-picker-3', function () {
            var date1 = $('#date-picker-3').val();
            var date2 = $('#date-picker-4').val();
            var split1 = date1.split("/");
            var split2 = date2.split("/");
            $('#graph-loading2').html('<img src="/img/chart-loading.gif" height="20px" />');
            var from = split1[2] + split1[0] + split1[1];
            var to = split2[2] + split2[0] + split2[1];
            var diff = new TimeSpan(Date.parseExact(date2, "MM/dd/yyyy") - Date.parseExact(date1, "MM/dd/yyyy"));
            var days = diff.days;
            var diff2 = new TimeSpan(Date.today() - Date.parseExact(date1, "MM/dd/yyyy"));
            var days_from_today = diff2.days;
            smhContent.getGraphData(days_from_today, from, to, days, 'content_dropoff', 'count_plays', bargraph_entryId);
            smhContent.getTotalPlays(from, to, 'content_dropoff', bargraph_entryId);
        });
        $('#entries-table-wrapper').on('change', '#date-picker-4', function () {
            var date1 = $('#date-picker-3').val();
            var date2 = $('#date-picker-4').val();
            var split1 = date1.split("/");
            var split2 = date2.split("/");
            $('#graph-loading2').html('<img src="/img/chart-loading.gif" height="20px" />');
            var from = split1[2] + split1[0] + split1[1];
            var to = split2[2] + split2[0] + split2[1];
            var diff = new TimeSpan(Date.parseExact(date2, "MM/dd/yyyy") - Date.parseExact(date1, "MM/dd/yyyy"));
            var days = diff.days;
            var diff2 = new TimeSpan(Date.today() - Date.parseExact(date1, "MM/dd/yyyy"));
            var days_from_today = diff2.days;
            smhContent.getGraphData(days_from_today, from, to, days, 'content_dropoff', 'count_plays', bargraph_entryId);
            smhContent.getTotalPlays(from, to, 'content_dropoff', bargraph_entryId);
        });
        $('#entries-table-wrapper').on('click', '#menu1 li a', function () {
            $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
            $('#graph-loading2').html('<img src="/img/chart-loading.gif" height="20px" />');
            var selText = $(this).text();
            var dataString, graphData, preGraphData;
            var data = [];
            var label = '';
            var date1 = $('#date-picker-1').val();
            var date2 = $('#date-picker-2').val();
            var split1 = date1.split("/");
            var split2 = date2.split("/");
            var from = split1[2] + split1[0] + split1[1];
            var to = split2[2] + split2[0] + split2[1];
            if (selText == 'Plays') {
                label = 'Plays';
                if (count_plays) {
                    graphData = smhContent.formatDateRange(count_plays);
                } else if (count_plays == null || count_plays == '') {
                    dataString = from + '00,0;' + to + '00,0;';
                    count_plays = dataString;
                    graphData = smhContent.formatDateRange(count_plays);
                }
            } else if (selText == 'Minutes Viewed') {
                label = 'Minutes';
                if (sum_time_viewed) {
                    graphData = smhContent.formatDateRange(sum_time_viewed);
                } else if (sum_time_viewed == null || sum_time_viewed == '') {
                    dataString = from + '00,0;' + to + '00,0;';
                    sum_time_viewed = dataString;
                    graphData = smhContent.formatDateRange(sum_time_viewed);
                }
            } else if (selText == 'Avg. View Time') {
                label = 'Minutes';
                if (avg_time_viewed) {
                    graphData = smhContent.formatDateRange(avg_time_viewed);
                } else if (avg_time_viewed == null || avg_time_viewed == '') {
                    dataString = from + '00,0;' + to + '00,0;';
                    avg_time_viewed = dataString;
                    graphData = smhContent.formatDateRange(avg_time_viewed);
                }
            } else if (selText == 'Player Impressions') {
                label = 'Impressions';
                if (count_loads) {
                    graphData = smhContent.formatDateRange(count_loads);
                } else if (count_loads == null || count_loads == '') {
                    dataString = from + '00,0;' + to + '00,0;';
                    count_loads = dataString;
                    graphData = smhContent.formatDateRange(count_loads);
                }
            }
            preGraphData = smhContent.generalDate(graphData, days_glbl, days_from_today_glbl);
            data = smhContent.formatLineData(preGraphData, days_glbl, days_from_today_glbl);
            graph1.options.labels = [label];
            graph1.setData(data);
            $(this).parents('.dropdown').find('.dropdown-text').html(selText);
            $('#graph-loading1').empty();
            $('#graph-loading2').empty();
        });


        $('#users-buttons .dropdown-filter #tree2').on('change', ".media_all", function () {
            if ($(this).is(":checked")) {
                $('#users-buttons .dropdown-filter .media-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            mediaTypes = [];
            smhContent.getEntries();
        });
        $('#users-buttons .dropdown-filter #tree2').on('click', ".media_list", function () {
            var anyBoxesChecked = false;
            mediaTypes = [];
            $('#users-buttons .dropdown-filter .media-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    mediaTypes.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#users-buttons .dropdown-filter .media_all').prop('checked', false);
            } else {
                $('#users-buttons .dropdown-filter .media_all').prop('checked', true);
            }
            smhContent.getEntries();
        });
        $('#users-buttons .dropdown-filter #tree2').on('change', ".durations_all", function () {
            if ($(this).is(":checked")) {
                $('.duration-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            duration = [];
            smhContent.getEntries();
        });
        $('#users-buttons .dropdown-filter #tree2').on('click', ".duration_list", function () {
            var anyBoxesChecked = false;
            duration = [];
            $('#users-buttons .dropdown-filter .duration-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    duration.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#users-buttons .dropdown-filter .durations_all').prop('checked', false);
            } else {
                $('#users-buttons .dropdown-filter .durations_all').prop('checked', true);
            }
            smhContent.getEntries();
        });

        $('#users-buttons .dropdown-filter #tree2').on('change', ".clipped_all", function () {
            if ($(this).is(":checked")) {
                $('#users-buttons .dropdown-filter .clipped-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            clipped = [];
            smhContent.getEntries();
        });
        $('#users-buttons .dropdown-filter #tree2').on('click', ".clipped_list", function () {
            var anyBoxesChecked = false;
            clipped = [];
            $('#users-buttons .dropdown-filter .clipped-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    clipped.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#users-buttons .dropdown-filter .clipped_all').prop('checked', false);
            } else {
                $('#users-buttons .dropdown-filter .clipped_all').prop('checked', true);
            }
            smhContent.getEntries();
        });
    }
}

// Main on ready
$(document).ready(function () {
    smhContent = new Content();
    smhContent.getEntries();
    smhContent.registerActions();
    smhContent.getUiConfs();
    smhContent.getCats();
    smhContent.getAccessControlProfiles();
    smhContent.getFlavors();
    if (services.sn == 1) {
        smhContent.getSnConfig();
    }
});
