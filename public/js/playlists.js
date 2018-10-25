/*
 *
 *	Streaming Media Hosting
 *	
 *	Playlists
 *
 *	9-15-2015
 */
//Main constructor
function Playlists() {}

//Global variables
var slices = 40;
var frameRate = 400;
var timer = null;
var slice = 0;
var img = new Image();
var bulkdelete = new Array();
var uiconf_ids = new Array();
var categories_data = [];
var categories = [];
var categoryIDs = [];
var mediaTypes = [];
var duration = [];
var clipped = [];
var ac = [];
var ac_filter = [];
var flavors = [];
var flavors_filter = [];
var shortlink;
var validator;
var limit = 20;
var order = '-recent';
var rule_duration = 0;
var rule_count = 0;
var total_entries;
var CacheApiUrl = "/apps/cache/v1.0/index.php?";

//Login prototype/class
Playlists.prototype = {
    constructor: Playlists,
    //Build tickets table
    getPlaylists: function () {
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#playlist-table').empty();
        $('#playlist-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="playlists-data"></table>');
        playlistsTable = $('#playlists-data').DataTable({
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
                "url": "/api/v1/getPlaylists",
                "type": "GET",
                "data": function (d) {
                    return $.extend({}, d, {
                        "_token": $('meta[name="csrf-token"]').attr('content'),
                        "ks": sessInfo.ks,
                        "tz": tz,
                        "m": ($.inArray("PLAYLIST_UPDATE", sessPerm) != -1) ? true : false,
                        "d": ($.inArray("PLAYLIST_DELETE", sessPerm) != -1) ? true : false
                    });
                },
                "dataSrc": function (json) {
                    total_entries = json['recordsTotal'];
                    return json.data
                }
            },
            "language": {
                "zeroRecords": "No Playlists Found"
            },
            "columns": [
                {
                    "title": "<span style='float: left;'><input type='checkbox' class='playlist-bulk' id='playlist-bulkAll' style='width:16px; margin-right: 7px;' name='playlist_bulkAll' /></span>",
                    "width": "10px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Playlist</div></span>",
                    "width": "500px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Name</div></span>",
                    "width": "190px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>ID</div></span>",
                    "width": "190px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Type</div></span>",
                    "width": "190px"
                },
                {
                    "title": "<span style='float: left;'><div class='data-break'>Created On</div></span>",
                    "width": "190px"
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
        $('#playlist-table').on('change', ".playlist-bulk", function () {
            var anyBoxesChecked = false;
            $('#playlist-table input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                }
            });

            if (anyBoxesChecked == true && ($.inArray("PLAYLIST_DELETE", sessPerm) != -1)) {
                $('#users-buttons .dd-delete-btn').removeClass('btn-disabled');
                $('#users-buttons .dd-delete-btn').addClass('btn-default');
                $('#users-buttons .dd-delete-btn').removeAttr('disabled');
            } else {
                $('#users-buttons .dd-delete-btn').removeClass('btn-default');
                $('#users-buttons .dd-delete-btn').addClass('btn-disabled');
                $('#users-buttons .dd-delete-btn').attr('disabled', '');
            }
        });
        $('#playlist-bulkAll').click(function () {
            if (this.checked) {
                $('.playlist-bulk').each(function () {
                    this.checked = true;
                });
            } else {
                $('.playlist-bulk').each(function () {
                    this.checked = false;
                });
            }
        });
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

        var path = smhPlaylists.thumbBase(o);

        o.src = path + "/vid_slice/" + i + "/vid_slices/" + slices;
        img.src = path + "/vid_slice/" + slice + "/vid_slices/" + slices;

        i = i % slices;
        i++;

        timer = setTimeout(function () {
            smhPlaylists.change(o, i)
        }, frameRate);
    },
    thumbRotatorStart: function (o) {
        clearTimeout(timer);
        var path = smhPlaylists.thumbBase(o);
        smhPlaylists.change(o, 1);
    },
    thumbRotatorEnd: function (o) {
        clearTimeout(timer);
        o.src = smhPlaylists.thumbBase(o);
    },
    //Bulk delete modal
    bulkDeleteModal: function () {
        bulkdelete = new Array();
        var rowcollection = playlistsTable.$(".playlist-bulk:checked", {
            "page": "all"
        });
        rowcollection.each(function (index, elem) {
            var checkbox_value = $(elem).val();
            bulkdelete.push(checkbox_value);
        });

        if (bulkdelete.length == 0) {
            smhPlaylists.noEntrySelected();
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

            content = '<div style="padding-top: 25px; padding-bottom: 25px; text-align: center;">Are you sure you want to delete the selected playlists?</div>';

            $('#smh-modal .modal-body').html(content);

            footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="delete-playlists" onclick="smhPlaylists.bulkDelete()">Delete</button>';
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
            smhPlaylists.purgeCache('delete');
            $('#smh-modal').modal('hide');
            smhPlaylists.getPlaylists();
        };

        $('#delete-playlists').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        if (services.ppv == 1) {
            client.startMultiRequest();
            $.each(bulkdelete, function (key, value) {
                var sessData = {
                    pid: sessInfo.pid,
                    ks: sessInfo.ks,
                    playlist_id: value
                }

                var reqUrl = '/apps/ppv/v1.0/?action=delete_playlist_entry';

                $.ajax({
                    cache: false,
                    url: reqUrl,
                    type: 'GET',
                    data: sessData,
                    dataType: 'json',
                    success: function (data) {
                    }
                });
                client.playlist.deleteAction(cb, value);
            });
            client.doMultiRequest(cb);
        } else {
            client.startMultiRequest();
            $.each(bulkdelete, function (key, value) {
                client.playlist.deleteAction(cb, value);
            });
            client.doMultiRequest(cb);
        }
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

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">No Playlist Selected</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div style="padding-top: 15px; padding-bottom: 15px; text-align: center;">You must select a playlist</div>';

        $('#smh-modal .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Delete Playlist modal
    deletePlaylist: function (id, name) {
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '435px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Delete</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='text-align: center; margin: 27px 27px 0; height: 75px; width: 378px;'>Are you sure you want to delete the following playlist?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>(" + name + ")</div>";

        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="delete-playlist" onclick="smhPlaylists.removePlaylist(\'' + id + '\')">Delete</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Remove playlist
    removePlaylist: function (id) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results == null) {
                smhPlaylists.purgeCache('delete');
                $('#smh-modal').modal('hide');
                smhPlaylists.getPlaylists();
            } else if (results.code && results.message) {
                alert(results.message);
                return;
            }
        };

        $('#delete-playlist').attr('disabled', '');
        $('#smh-modal #loading img').css('display', 'inline-block');
        client.playlist.deleteAction(cb, id);
    },
    //Get playlist uiconf ids
    getUiConfs: function () {
        var sessData = {
            ks: sessInfo.ks,
            partner_id: sessInfo.pid,
            type: "playlist"
        };

        var reqUrl = "/index.php/kmc/getuiconfs";
        var players;
        $.ajax({
            cache: false,
            url: reqUrl,
            async: false,
            type: 'POST',
            data: sessData,
            dataType: 'json',
            success: function (data) {
                uiconf_ids = data;
                var index;
                index = smhMain.getIndex(uiconf_ids, '6709427');
                uiconf_ids.splice(index, 1);
                index = smhMain.getIndex(uiconf_ids, '6709426');
                uiconf_ids.splice(index, 1);
                index = smhMain.getIndex(uiconf_ids, '6709425');
                uiconf_ids.splice(index, 1);
                index = smhMain.getIndex(uiconf_ids, '6709424');
                uiconf_ids.splice(index, 1);

                var array1 = {};
                array1['id'] = "6709427";
                array1['name'] = "Horizontal Default Playlist";
                array1['width'] = "680";
                array1['height'] = "333";

                var array2 = {};
                array2['id'] = "6709426";
                array2['name'] = "Vertical Default Playlist";
                array2['width'] = "400";
                array2['height'] = "680";

                var array3 = {};
                array3['id'] = "6709425";
                array3['name'] = "Horizontal Light skin Playlist";
                array3['width'] = "680";
                array3['height'] = "333";

                var array4 = {};
                array4['id'] = "6709424";
                array4['name'] = "Vertical Light skin Playlist";
                array4['width'] = "400";
                array4['height'] = "680";
                uiconf_ids.unshift(array1, array2, array3, array4);
            }
        });
    },
    //Preview and embed playlists
    previewPlaylist: function (entryId, name) {
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

        var player_options = '';
        $.each(uiconf_ids, function (key, value) {
            if ((value['id'] !== '6709424') && (value['id'] !== '6709425')) {
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
                '<div style="font-size: 14px; font-weight: bold; margin-left: auto; margin-right: auto; margin-top: 10px;"><span style="margin-right: 30px; color: #444; font-size: 12px;">Select Player:</span><span><select id="players" class="form-control" style="width: 213px;">' + player_options + '</select></span></div>' +
                '<div style="margin-top: 5px;"><span style="font-size: 12px; color: #999;">Player includes both layout and functionality (advertising, substitles, etc)</span></div>' +
                '<hr>' +
                '<div style="margin-top: 10px; font-weight: bold;"><span style="color: #444; font-size: 12px;margin-right: 30px;">Delivery Type:</span><span><select class="form-control delivery" style="width: 213px;"><option value="hls">HLS Streaming</option><option value="http">HTTP Progressive Download</option></select></span></div>' +
                '<div style="margin-top: 5px;"><span style="font-size: 12px; color: #999;">Adaptive Streaming automatically adjusts to the viewer\'s bandwidth,while Progressive Download allows buffering of the content.</span></div>' +
                embed_type +
                '<hr>' +
                '<div style="margin-top: 10px; margin-bottom: 10px; font-weight: bold;">' +
                '<span style="color: #444; font-size: 12px;margin-right: 30px;">Player Dimensions</span>' +
                '</div>' +
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

        smhPlaylists.getShortLink(uiconf_id, entryId, embed, delivery);
        if ($.inArray("PLAYLIST_EMBED_CODE", sessPerm) != -1) {
            gen = smhPlaylists.generatePlaylistEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
            embedCode = gen.getCode();
            $('#embed_code').text(embedCode);
        }

        player_prev_gen = smhPlaylists.generatePlaylistEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
        player_prev = player_prev_gen.getCode();
        smhPlaylists.generateIframe(player_prev);

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
            width = $('#smh-modal3 #dim_width').val();
            height = parseInt(width * aspect);
            $('#dim_height').val(height);
            player_prev_gen = smhPlaylists.generatePlaylistEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
            if ($.inArray("PLAYLIST_EMBED_CODE", sessPerm) != -1) {
                gen = smhPlaylists.generatePlaylistEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                embedCode = gen.getCode();
                $('#embed_code').text(embedCode);
            }
            player_prev = player_prev_gen.getCode();
            smhPlaylists.generateIframe(player_prev);
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

            player_prev_gen = smhPlaylists.generatePlaylistEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
            smhPlaylists.getShortLink(uiconf_id, entryId, embed, delivery);
            if ($.inArray("PLAYLIST_EMBED_CODE", sessPerm) != -1) {
                gen = smhPlaylists.generatePlaylistEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                embedCode = gen.getCode();
                $('#embed_code').text(embedCode);
            }
            player_prev = player_prev_gen.getCode();
            smhPlaylists.generateIframe(player_prev);
        });

        $('#smh-modal3').on('click', '#update-dim', function () {
            width = $('#dim_width').val();
            height = $('#dim_height').val();
            player_prev_gen = smhPlaylists.generatePlaylistEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);

            if ($.inArray("CONTENT_MANAGE_EMBED_CODE", sessPerm) != -1) {
                gen = smhPlaylists.generatePlaylistEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                embedCode = gen.getCode();
                $('#embed_code').text(embedCode);
            }
            player_prev = player_prev_gen.getCode();
            smhPlaylists.generateIframe(player_prev);
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
            player_prev_gen = smhPlaylists.generatePlaylistEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
            smhPlaylists.getShortLink(uiconf_id, entryId, embed, delivery);
            if ($.inArray("PLAYLIST_EMBED_CODE", sessPerm) != -1) {
                gen = smhPlaylists.generatePlaylistEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                embedCode = gen.getCode();
                $('#embed_code').text(embedCode);
            }
            player_prev = player_prev_gen.getCode();
            smhPlaylists.generateIframe(player_prev);
        });

        if ($.inArray("PLAYLIST_EMBED_CODE", sessPerm) != -1) {
            $('select.embedType').on('change', function (event) {
                embed = $('select.embedType option:selected').val();
                if (embed == 'dynamic') {
                    $('#embedType-text').html('Dynamic embed is the preferred method to dynamically embed the player into web sites and web applications.');
                } else if (embed == 'iframe') {
                    $('#embedType-text').html('Iframe embed is good for sites that do not allow 3rd party JavaScript to be embeded on their pages.');
                } else if (embed == 'legacy') {
                    $('#embedType-text').html('This basic player embed method works by including the JavaScript library followed by the Flash object tag embed.');
                }
                player_prev_gen = smhPlaylists.generatePlaylistEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
                smhPlaylists.getShortLink(uiconf_id, entryId, embed, delivery);

                gen = smhPlaylists.generatePlaylistEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                embedCode = gen.getCode();
                $('#embed_code').text(embedCode);
                player_prev = player_prev_gen.getCode();
                smhPlaylists.generateIframe(player_prev);
            });
            $('.previewModal .options').on('change', '#secure', function (event) {
                if ($("#secure").is(':checked')) {
                    protocol = 'https';
                    gen = smhPlaylists.generatePlaylistEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                } else {
                    protocol = 'http';
                    gen = smhPlaylists.generatePlaylistEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                }
            });
            $('.previewModal .options').on('change', '#seo', function (event) {
                if ($("#seo").is(':checked')) {
                    seo = true;
                    gen = smhPlaylists.generatePlaylistEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                } else {
                    seo = false;
                    gen = smhPlaylists.generatePlaylistEmbed(uiconf_id, entryId, width, height, protocol, delivery, embed, seo, name, false, sizing, ratio);
                    embedCode = gen.getCode();
                    $('#embed_code').text(embedCode);
                }
            });
        }

        $('#smh-modal3').on('click', '#select-bttn', function (event) {
            $('#smh-modal3 #embed_code').select();
        });
    },
    //Manual playlist modal
    addManual: function () {
        smhMain.resetModal();
        smhPlaylists.resetModal();
        smhPlaylists.resetFilters();
        var header, content, footer;
        $('.smh-dialog').css('width', '985px');
        $('#smh-modal .modal-body').css('height', '600px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close mplist-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Create Manual Playlist</h4>';
        $('#smh-modal .modal-header').html(header);

        var tree = smhPlaylists.json_tree(categories, 'cat');
        var tree_ac = smhPlaylists.json_tree(ac, 'ac');
        var tree_flavors = smhPlaylists.json_tree(flavors, 'flavors');

        content = '<div class="playlist-content">' +
                '<div class="header ls-header">' +
                '<div id="playlist-fields-wrapper">' +
                '<form id="create-manual-plist" action="">' +
                '<table width="98%" border="0" id="playlist-fields">' +
                '<tr><td><span style="font-weight: normal;" class="required">Name:</span></td><td style="width: 89%;"><input type="text" placeholder="Enter a name" class="form-control" id="playlist_name" name="playlist_name"></td></tr>' +
                '<tr><td><span style="font-weight: normal;">Description:</span></td><td><input type="text" placeholder="Enter a description" class="form-control" id="playlist_desc" name="playlist_desc"></td></tr>' +
                '</table>' +
                '</form>' +
                '</div>' +
                '</div>' +
                '<div id="entries-wrapper">' +
                '<div class="header rs-header">' +
                '<div style="margin-top: 6px; margin-bottom: 5px; text-align: left;">Entries</div>' +
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
                '<div id="entries">' +
                '<div id="plist-table"></div>' +
                '</div>' +
                '</div>' +
                '<div id="playlist-wrapper">' +
                '<div class="header" style="text-align: left;">' +
                'Playlist' +
                '<div style="text-align: right; font-size: 12px; color: #868991; margin-bottom: 6px;"><div style="display: inline-block; position: relative; right: 168px;">Drag And Drop Your Entries Below</div><div id="drag-drop-icon"><i class="fa fa-arrow-down"></i></div><div id="drag-drop-elip"><i class="fa fa-ellipsis-h"></i></div><div id="drag-drop-icon"><i class="fa fa-arrows"></i></div></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div id="plist-entries"></div>' +
                '<div class="clear"></div>' +
                '<div id="playlist-info">' +
                '<div id="entries-num-wrapper">Entries: <span id="entries-num">0</span></div><div id="duration-wrapper">Duration: <span id="duration">00:00</span></div>' +
                '</div>' +
                '</div>' +
                '</div>';

        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default mplist-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="add-manual-plist" onclick="smhPlaylists.addManualPlist()">Create</button>';
        $('#smh-modal .modal-footer').html(footer);

        $('#smh-modal #plist-entries').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        $('#smh-modal #tree1').on('change', ".cat_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal .cat-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            categoryIDs = [];
            smhPlaylists.loadEntries_manual_plist();
        });
        $('#smh-modal #tree1').on('click', ".cat_list", function () {
            setTimeout(function () {
                var anyBoxesChecked = false;
                categoryIDs = [];
                $('#smh-modal .cat-filter input[type="checkbox"]').each(function () {
                    if ($(this).is(":checked")) {
                        anyBoxesChecked = true;
                        var checkbox_value = $(this).val();
                        categoryIDs.push(checkbox_value);
                    }
                });
                if (anyBoxesChecked == true) {
                    $('#smh-modal .cat_all').prop('checked', false);
                } else {
                    $('#smh-modal .cat_all').prop('checked', true);
                }
            }, 50);
            setTimeout(function () {
                smhPlaylists.loadEntries_manual_plist();
            }, 100);
        });

        $('#smh-modal #tree2').on('change', ".media_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal .media-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            mediaTypes = [];
            smhPlaylists.loadEntries_manual_plist();
        });
        $('#smh-modal #tree2').on('click', ".media_list", function () {
            var anyBoxesChecked = false;
            mediaTypes = [];
            $('#smh-modal .media-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    mediaTypes.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#smh-modal .media_all').prop('checked', false);
            } else {
                $('#smh-modal .media_all').prop('checked', true);
            }
            smhPlaylists.loadEntries_manual_plist();
        });

        $('#smh-modal #tree2').on('change', ".durations_all", function () {
            if ($(this).is(":checked")) {
                $('.duration-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            duration = [];
            smhPlaylists.loadEntries_manual_plist();
        });
        $('#smh-modal #tree2').on('click', ".duration_list", function () {
            var anyBoxesChecked = false;
            duration = [];
            $('#smh-modal .duration-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    duration.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#smh-modal .durations_all').prop('checked', false);
            } else {
                $('#smh-modal .durations_all').prop('checked', true);
            }
            smhPlaylists.loadEntries_manual_plist();
        });

        $('#smh-modal #tree2').on('change', ".clipped_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal .clipped-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            clipped = [];
            smhPlaylists.loadEntries_manual_plist();
        });
        $('#smh-modal #tree2').on('click', ".clipped_list", function () {
            var anyBoxesChecked = false;
            clipped = [];
            $('#smh-modal .clipped-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    clipped.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#smh-modal .clipped_all').prop('checked', false);
            } else {
                $('#smh-modal .clipped_all').prop('checked', true);
            }
            smhPlaylists.loadEntries_manual_plist();
        });

        $('#smh-modal #tree2').on('change', ".ac_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal .ac-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            ac_filter = [];
            smhPlaylists.loadEntries_manual_plist();
        });
        $('#smh-modal #tree2').on('click', ".ac_list", function () {
            var anyBoxesChecked = false;
            ac_filter = [];
            $('#smh-modal .ac-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    ac_filter.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#smh-modal .ac_all').prop('checked', false);
            } else {
                $('#smh-modal .ac_all').prop('checked', true);
            }
            smhPlaylists.loadEntries_manual_plist();
        });

        $('#smh-modal #tree2').on('change', ".flavors_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal .flavors-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            flavors_filter = [];
            smhPlaylists.loadEntries_manual_plist();
        });
        $('#smh-modal #tree2').on('click', ".flavors_list", function () {
            var anyBoxesChecked = false;
            flavors_filter = [];
            $('#smh-modal .flavors-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    flavors_filter.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#smh-modal .flavors_all').prop('checked', false);
            } else {
                $('#smh-modal .flavors_all').prop('checked', true);
            }
            smhPlaylists.loadEntries_manual_plist();
        });

        // Collapse accordion every time dropdown is shown
        $('#smh-modal .dropdown-accordion').on('show.bs.dropdown', function (event) {
            var accordion = $(this).find($(this).data('accordion'));
            accordion.find('.panel-collapse.in').collapse('hide');
        });

        // Prevent dropdown to be closed when we click on an accordion link
        $('#smh-modal .dropdown-accordion').on('click', 'a[data-toggle="collapse"]', function (event) {
            event.preventDefault();
            event.stopPropagation();
            $($(this).data('parent')).find('.panel-collapse.in').collapse('hide');
            $($(this).attr('href')).collapse('show');
        });

        $('#smh-modal .dropdown-accordion').on('click', '.panel-body', function (event) {
            event.stopPropagation();
        });

        $('#smh-modal #tree1').tree({
            collapseDuration: 100,
            expandDuration: 100,
            onCheck: {
                ancestors: null
            }
        });

        $('#smh-modal #tree2').tree({
            collapseDuration: 100,
            expandDuration: 100,
            onCheck: {
                ancestors: null
            }
        });

        $('#smh-modal #entries-wrapper .panel-body').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        $('#create-manual-plist input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });

        validator = $("#create-manual-plist").validate({
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
                playlist_name: {
                    required: true
                }
            },
            messages: {
                playlist_name: {
                    required: 'Please enter a name'
                }
            }
        });
        smhPlaylists.loadEntries_manual_plist();
    },
    //Rule Based playlist modal
    addRB: function () {
        smhMain.resetModal();
        smhPlaylists.resetModal();
        smhPlaylists.resetFilters();
        var header, content, footer;
        $('.smh-dialog').css('width', '900px');
        $('#smh-modal .modal-body').css('height', '600px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close rbplist-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Create Rule Based Playlist</h4>';
        $('#smh-modal .modal-header').html(header);

        var tree = smhPlaylists.json_tree(categories, 'cat');
        var tree_ac = smhPlaylists.json_tree(ac, 'ac');
        var tree_flavors = smhPlaylists.json_tree(flavors, 'flavors');

        content = '<div class="playlist-content">' +
                '<div class="header ls-header">' +
                '<div id="playlist-fields-wrapper">' +
                '<form id="create-rb-plist" action="">' +
                '<table width="97%" border="0" id="playlist-fields">' +
                '<tr><td><span style="font-weight: normal;" class="required">Name:</span></td><td style="width: 89%;"><input type="text" placeholder="Enter a name" class="form-control" id="playlist_name" name="playlist_name"></td></tr>' +
                '<tr><td><span style="font-weight: normal;">Description:</span></td><td><input type="text" placeholder="Enter a description" class="form-control" id="playlist_desc" name="playlist_desc"></td></tr>' +
                '</table>' +
                '</form>' +
                '</div>' +
                '</div>' +
                '<div id="entries-filter-wrapper">' +
                '<div class="header rs-header">' +
                '<div style="margin-top: 6px; margin-bottom: 5px; text-align: left; margin-left: 7px;">Filters</div>' +
                '</div>' +
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
                '</div>' +
                '<div id="rb-entries-wrapper">' +
                '<div class="header rs-header">' +
                '<div style="margin-top: 6px; margin-bottom: 5px; text-align: left; position: absolute;">Entries</div>' +
                '</div>' +
                '<div id="entries">' +
                '<div id="plist-table"></div>' +
                '<div class="clear"></div>' +
                '<div id="playlist-info">' +
                '<div id="entries-num-wrapper">Entries: <span id="entries-num">0</span></div><div id="duration-wrapper">Duration: <span id="duration">00:00</span></div>' +
                '</div>' +
                '<div id="playlist-search-info">' +
                '<div id="orderby-wrapper">' +
                '<span id="text">Order by</span>' +
                '<span class="dropdown header dropdown-orderby">' +
                '<div class="btn-group">' +
                '<button type="button" class="btn btn-default order-text">Most Recent</button>' +
                '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-expanded="true"><span class="caret"></span></button>' +
                '<ul class="dropdown-menu" id="menu" role="menu" aria-labelledby="dropdownMenu">' +
                '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="smhPlaylists.updatePlistOrder(\'-plays\');">Most Played</a></li>' +
                '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="smhPlaylists.updatePlistOrder(\'-recent\');">Most Recent</a></li>' +
                '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="smhPlaylists.updatePlistOrder(\'-rank\');">Hightest Rated</a></li>' +
                '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="smhPlaylists.updatePlistOrder(\'+name\');">Entry Name</a></li>' +
                '</ul>' +
                '</div>' +
                '</span>' +
                '</div>' +
                '<div id="limit-wrapper">' +
                '<span id="text">Limit Playlist Result</span>' +
                '<div class="col-md-5"><input id="entries-limit" type="text" name="entries-limit" class="col-md-8 form-control"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';

        $('#smh-modal .modal-body').html(content);

        footer = '<div class="pull-left"><button data-dismiss="modal" class="btn btn-default" type="button" onclick="smhPlaylists.AdvRB();">Switch to Advanced Mode</button></div><div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default rbplist-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="add-rb-plist" onclick="smhPlaylists.addRBPlist()">Create</button>';
        $('#smh-modal .modal-footer').html(footer);

        $("#smh-modal input[name='entries-limit']").TouchSpin({
            initval: limit,
            min: 1,
            max: 100000,
            step: 1,
            verticalbuttons: true
        });

        $("#smh-modal input[name='entries-limit']").on('change', function () {
            limit = parseInt($('#entries-limit').val());
            smhPlaylists.loadEntries_rb_plist();
        });

        $("#smh-modal #orderby-wrapper #menu li a").click(function () {
            var selText = $(this).text();
            $(this).parents('.dropdown').find('.order-text').html(selText);
        });

        $('#smh-modal #tree1').on('change', ".cat_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal .cat-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            categoryIDs = [];
            smhPlaylists.loadEntries_rb_plist();
        });
        $('#smh-modal #tree1').on('click', ".cat_list", function () {
            setTimeout(function () {
                var anyBoxesChecked = false;
                categoryIDs = [];
                $('#smh-modal .cat-filter input[type="checkbox"]').each(function () {
                    if ($(this).is(":checked")) {
                        anyBoxesChecked = true;
                        var checkbox_value = $(this).val();
                        categoryIDs.push(checkbox_value);
                    }
                });
                if (anyBoxesChecked == true) {
                    $('#smh-modal .cat_all').prop('checked', false);
                } else {
                    $('#smh-modal .cat_all').prop('checked', true);
                }
            }, 50);
            setTimeout(function () {
                smhPlaylists.loadEntries_rb_plist();
            }, 100);
        });

        $('#smh-modal #tree2').on('change', ".media_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal .media-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            mediaTypes = [];
            smhPlaylists.loadEntries_rb_plist();
        });
        $('#smh-modal #tree2').on('click', ".media_list", function () {
            var anyBoxesChecked = false;
            mediaTypes = [];
            $('#smh-modal .media-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    mediaTypes.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#smh-modal .media_all').prop('checked', false);
            } else {
                $('#smh-modal .media_all').prop('checked', true);
            }
            smhPlaylists.loadEntries_rb_plist();
        });

        $('#smh-modal #tree2').on('change', ".durations_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal .duration-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            duration = [];
            smhPlaylists.loadEntries_rb_plist();
        });
        $('#smh-modal #tree2').on('click', ".duration_list", function () {
            var anyBoxesChecked = false;
            duration = [];
            $('#smh-modal .duration-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    duration.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#smh-modal .durations_all').prop('checked', false);
            } else {
                $('#smh-modal .durations_all').prop('checked', true);
            }
            smhPlaylists.loadEntries_rb_plist();
        });

        $('#smh-modal #tree2').on('change', ".clipped_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal .clipped-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            clipped = [];
            smhPlaylists.loadEntries_rb_plist();
        });
        $('#smh-modal #tree2').on('click', ".clipped_list", function () {
            var anyBoxesChecked = false;
            clipped = [];
            $('#smh-modal .clipped-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    clipped.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#smh-modal .clipped_all').prop('checked', false);
            } else {
                $('#smh-modal .clipped_all').prop('checked', true);
            }
            smhPlaylists.loadEntries_rb_plist();
        });

        $('#smh-modal #tree2').on('change', ".ac_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal .ac-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            ac_filter = [];
            smhPlaylists.loadEntries_rb_plist();
        });
        $('#smh-modal #tree2').on('click', ".ac_list", function () {
            var anyBoxesChecked = false;
            ac_filter = [];
            $('#smh-modal .ac-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    ac_filter.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#smh-modal .ac_all').prop('checked', false);
            } else {
                $('#smh-modal .ac_all').prop('checked', true);
            }
            smhPlaylists.loadEntries_rb_plist();
        });

        $('#smh-modal #tree2').on('change', ".flavors_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal .flavors-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            flavors_filter = [];
            smhPlaylists.loadEntries_rb_plist();
        });
        $('#smh-modal #tree2').on('click', ".flavors_list", function () {
            var anyBoxesChecked = false;
            flavors_filter = [];
            $('#smh-modal .flavors-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    flavors_filter.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('#smh-modal .flavors_all').prop('checked', false);
            } else {
                $('#smh-modal .flavors_all').prop('checked', true);
            }
            smhPlaylists.loadEntries_rb_plist();
        });

        $('#smh-modal #tree1').tree({
            collapseDuration: 100,
            expandDuration: 100,
            onCheck: {
                ancestors: null
            }
        });

        $('#smh-modal #tree2').tree({
            collapseDuration: 100,
            expandDuration: 100,
            onCheck: {
                ancestors: null
            }
        });

        $('#smh-modal #entries-filter-wrapper .panel-body').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        $('#create-rb-plist input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });

        validator = $("#create-rb-plist").validate({
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
                playlist_name: {
                    required: true
                }
            },
            messages: {
                playlist_name: {
                    required: 'Please enter a name'
                }
            }
        });
        smhPlaylists.loadEntries_rb_plist();
    },
    //Advanced Rule Based Playlist Modal
    AdvRB: function () {
        smhMain.resetModal();
        smhPlaylists.resetModal();
        smhPlaylists.resetFilters();
        rule_num = 0;
        var header, content, footer;
        $('.smh-dialog').css('width', '900px');
        $('#smh-modal .modal-body').css('height', '643px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close rbplist-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Create Rule Based Playlist</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div class="playlist-content">' +
                '<div class="header ls-header">' +
                '<div id="playlist-fields-wrapper">' +
                '<form id="create-rb-plist" action="">' +
                '<table width="97%" border="0" id="playlist-fields">' +
                '<tr><td><span style="font-weight: normal;" class="required">Name:</span></td><td style="width: 89%;"><input type="text" placeholder="Enter a name" class="form-control" id="playlist_name" name="playlist_name"></td></tr>' +
                '<tr><td><span style="font-weight: normal;">Description:</span></td><td><input type="text" placeholder="Enter a description" class="form-control" id="playlist_desc" name="playlist_desc"></td></tr>' +
                '</table>' +
                '</form>' +
                '</div>' +
                '</div>' +
                '<div id="advrb-entries-wrapper">' +
                '<div id="entries">' +
                '<table cellspacing="0" cellpadding="0" border="0" class="display content-data dataTable no-footer" role="grid" style="margin-left: 0px; width: 100%;">' +
                '<thead>' +
                '<tr role="row"><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 100px;"><span style="float: left;">Type</span></th><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 100px;"><span style="float: left;">Order By</span></th><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 100px;"><span style="float: left;">Limit</span></th></tr>' +
                '</thead>' +
                '</table>' +
                '<div id="adv-plist-table"></div>' +
                '<div class="clear"></div>' +
                '<div id="playlist-info">' +
                '<div class="pull-left"><button type="button" class="btn btn-primary" id="add-rule" onclick="smhPlaylists.addRule()">Add Rule</button></div>' +
                '<div id="entries-num-wrapper">Entries: <span id="entries-num">0</span></div><div id="duration-wrapper">Duration: <span id="duration">00:00</span></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';

        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default rbplist-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="add-rb-plist" onclick="smhPlaylists.addAdvRB()">Create</button>';
        $('#smh-modal .modal-footer').html(footer);

        $('#smh-modal .mediatype-wrapper').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        $('#smh-modal #adv-plist-table').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        $("#smh-modal #adv-plist-table .mCSB_container").sortable({
            placeholder: "advplist-hightlight",
            helper: 'clone'
        });

        $('#create-rb-plist input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });

        validator = $("#create-rb-plist").validate({
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
                playlist_name: {
                    required: true
                }
            },
            messages: {
                playlist_name: {
                    required: 'Please enter a name'
                }
            }
        });
    },
    //Add playlist rule modal
    addRule: function () {
        smhPlaylists.resetModal();
        smhPlaylists.resetFilters();
        var header, content, footer;
        $('.smh-dialog2').css('width', '900px');
        $('#smh-modal2 .modal-body').css('height', '502px');
        $('#smh-modal2 .modal-body').css('padding', '0');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '2');

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Add Rule</h4>';
        $('#smh-modal2 .modal-header').html(header);

        var tree = smhPlaylists.json_tree(categories, 'cat');
        var tree_ac = smhPlaylists.json_tree(ac, 'ac');
        var tree_flavors = smhPlaylists.json_tree(flavors, 'flavors');

        content = '<div class="playlist-content">' +
                '<div id="entries-filter-wrapper">' +
                '<div class="header rs-header">' +
                '<div style="margin-top: 6px; margin-bottom: 5px; text-align: left; margin-left: 7px;">Filters</div>' +
                '</div>' +
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
                '</div>' +
                '<div id="rule-entries-wrapper">' +
                '<div class="header rs-header">' +
                '<div style="margin-top: 6px; margin-bottom: 5px; text-align: left; position: absolute;">Entries</div>' +
                '</div>' +
                '<div id="entries">' +
                '<div id="plist-table"></div>' +
                '<div class="clear"></div>' +
                '<div id="playlist-info">' +
                '<div id="entries-num-wrapper">Entries: <span id="entries-num">0</span></div><div id="duration-wrapper">Duration: <span id="duration">00:00</span></div>' +
                '</div>' +
                '<div id="playlist-search-info">' +
                '<div id="orderby-wrapper">' +
                '<span id="text">Order by</span>' +
                '<span class="dropdown header dropdown-orderby">' +
                '<div class="btn-group">' +
                '<button type="button" class="btn btn-default order-text">Most Recent</button>' +
                '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-expanded="true"><span class="caret"></span></button>' +
                '<ul class="dropdown-menu" id="menu" role="menu" aria-labelledby="dropdownMenu">' +
                '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="smhPlaylists.updateAdvPlistOrder(\'-plays\');">Most Played</a></li>' +
                '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="smhPlaylists.updateAdvPlistOrder(\'-recent\');">Most Recent</a></li>' +
                '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="smhPlaylists.updateAdvPlistOrder(\'-rank\');">Hightest Rated</a></li>' +
                '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="smhPlaylists.updateAdvPlistOrder(\'+name\');">Entry Name</a></li>' +
                '</ul>' +
                '</div>' +
                '</span>' +
                '</div>' +
                '<div id="limit-wrapper">' +
                '<span id="text">Limit Playlist Result</span>' +
                '<div class="col-md-5"><input id="entries-limit" type="text" name="entries-limit" class="col-md-8 form-control"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';

        $('#smh-modal2 .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="add-rule" onclick="smhPlaylists.addAdvRule()">Add</button>';
        $('#smh-modal2 .modal-footer').html(footer);

        $("#smh-modal2 input[name='entries-limit']").TouchSpin({
            initval: limit,
            min: 1,
            max: 100000,
            step: 1,
            verticalbuttons: true
        });

        $("#smh-modal2 input[name='entries-limit']").on('change', function () {
            limit = parseInt($('#entries-limit').val());
            smhPlaylists.loadEntries_advrb_plist();
        });

        $("#smh-modal2 #orderby-wrapper #menu li a").click(function () {
            var selText = $(this).text();
            $(this).parents('.dropdown').find('.order-text').html(selText);
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
            smhPlaylists.loadEntries_advrb_plist();
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
                smhPlaylists.loadEntries_advrb_plist();
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
            smhPlaylists.loadEntries_advrb_plist();
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
            smhPlaylists.loadEntries_advrb_plist();
        });

        $('#smh-modal2 #tree2').on('change', ".durations_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal2 .duration-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            duration = [];
            smhPlaylists.loadEntries_advrb_plist();
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
            smhPlaylists.loadEntries_advrb_plist();
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
            smhPlaylists.loadEntries_advrb_plist();
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
            smhPlaylists.loadEntries_advrb_plist();
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
            smhPlaylists.loadEntries_advrb_plist();
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
            smhPlaylists.loadEntries_advrb_plist();
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
            smhPlaylists.loadEntries_advrb_plist();
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
            smhPlaylists.loadEntries_advrb_plist();
        });

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

        $('#smh-modal2 #entries-filter-wrapper .panel-body').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
        smhPlaylists.loadEntries_advrb_plist();
    },
    //Edit Rule
    editRule: function (rule_num, rule_categories, rule_mediatype, rule_duration, rule_clip, rule_ac, rule_flavors, rule_order, rule_limit) {
        categoryIDs = (rule_categories == '') ? [] : rule_categories.split(",");
        mediaTypes = (rule_mediatype == '') ? [] : rule_mediatype.split(",");
        duration = (rule_duration == '') ? [] : rule_duration.split(",");
        clipped = (rule_clip == '') ? [] : rule_clip.split(",");
        ac_filter = (rule_ac == '') ? [] : rule_ac.split(",");
        flavors_filter = (rule_flavors == '') ? [] : rule_flavors.split(",");
        order = rule_order;
        limit = rule_limit;
        smhPlaylists.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '900px');
        $('#smh-modal2 .modal-body').css('height', '502px');
        $('#smh-modal2 .modal-body').css('padding', '0');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '2');

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Add Rule</h4>';
        $('#smh-modal2 .modal-header').html(header);

        var tree = smhPlaylists.json_tree(categories, 'cat');
        var tree_ac = smhPlaylists.json_tree(ac, 'ac');
        var tree_flavors = smhPlaylists.json_tree(flavors, 'flavors');

        content = '<div class="playlist-content">' +
                '<div id="entries-filter-wrapper">' +
                '<div class="header rs-header">' +
                '<div style="margin-top: 6px; margin-bottom: 5px; text-align: left; margin-left: 7px;">Filters</div>' +
                '</div>' +
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
                '</div>' +
                '<div id="rule-entries-wrapper">' +
                '<div class="header rs-header">' +
                '<div style="margin-top: 6px; margin-bottom: 5px; text-align: left; position: absolute;">Entries</div>' +
                '</div>' +
                '<div id="entries">' +
                '<div id="plist-table"></div>' +
                '<div class="clear"></div>' +
                '<div id="playlist-info">' +
                '<div id="entries-num-wrapper">Entries: <span id="entries-num">0</span></div><div id="duration-wrapper">Duration: <span id="duration">00:00</span></div>' +
                '</div>' +
                '<div id="playlist-search-info">' +
                '<div id="orderby-wrapper">' +
                '<span id="text">Order by</span>' +
                '<span class="dropdown header dropdown-orderby">' +
                '<div class="btn-group">' +
                '<button type="button" class="btn btn-default order-text">Most Recent</button>' +
                '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-expanded="true"><span class="caret"></span></button>' +
                '<ul class="dropdown-menu" id="menu" role="menu" aria-labelledby="dropdownMenu">' +
                '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="smhPlaylists.updateAdvPlistOrder(\'-plays\');">Most Played</a></li>' +
                '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="smhPlaylists.updateAdvPlistOrder(\'-recent\');">Most Recent</a></li>' +
                '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="smhPlaylists.updateAdvPlistOrder(\'-rank\');">Hightest Rated</a></li>' +
                '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="smhPlaylists.updateAdvPlistOrder(\'+name\');">Entry Name</a></li>' +
                '</ul>' +
                '</div>' +
                '</span>' +
                '</div>' +
                '<div id="limit-wrapper">' +
                '<span id="text">Limit Playlist Result</span>' +
                '<div class="col-md-5"><input id="entries-limit" type="text" name="entries-limit" class="col-md-8 form-control"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';

        $('#smh-modal2 .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="save-rule" onclick="smhPlaylists.saveRule(' + rule_num + ')">Save</button>';
        $('#smh-modal2 .modal-footer').html(footer);

        $("#smh-modal2 input[name='entries-limit']").TouchSpin({
            initval: limit,
            min: 1,
            max: 100000,
            step: 1,
            verticalbuttons: true
        });

        $('.cat-filter input[type="checkbox"]').each(function (index, value) {
            if ($.inArray($(this).val(), categoryIDs) != -1) {
                $(this).prop('checked', true);
                $('.cat_all').prop('checked', false);
            }
        });

        $('.media-filter input[type="checkbox"]').each(function (index, value) {
            if ($.inArray($(this).val(), mediaTypes) != -1) {
                $(this).prop('checked', true);
                $('.media_all').prop('checked', false);
            }
        });

        $('.duration-filter input[type="checkbox"]').each(function (index, value) {
            if ($.inArray($(this).val(), duration) != -1) {
                $(this).prop('checked', true);
                $('.durations_all').prop('checked', false);
            }
        });

        $('.clipped-filter input[type="checkbox"]').each(function (index, value) {
            if ($.inArray($(this).val(), clipped) != -1) {
                $(this).prop('checked', true);
                $('.clipped_all').prop('checked', false);
            }
        });

        $('.ac-filter input[type="checkbox"]').each(function (index, value) {
            if ($.inArray($(this).val(), ac_filter) != -1) {
                $(this).prop('checked', true);
                $('.ac_all').prop('checked', false);
            }
        });

        $('.flavors-filter input[type="checkbox"]').each(function (index, value) {
            if ($.inArray($(this).val(), flavors_filter) != -1) {
                $(this).prop('checked', true);
                $('.flavors_all').prop('checked', false);
            }
        });

        if (order.indexOf('plays') > -1) {
            $('.dropdown-orderby .order-text').html('Most Played');
        } else if (order.indexOf('recent') > -1) {
            $('.dropdown-orderby .order-text').html('Most Recent');
        } else if (order.indexOf('rank') > -1) {
            $('.dropdown-orderby .order-text').html('Hightest Rated');
        } else if (order.indexOf('name') > -1) {
            $('.dropdown-orderby .order-text').html('Entry Name');
        }

        $("#smh-modal2 input[name='entries-limit']").on('change', function () {
            limit = parseInt($('#entries-limit').val());
            smhPlaylists.loadEntries_advrb_plist();
        });

        $("#smh-modal2 #orderby-wrapper #menu li a").click(function () {
            var selText = $(this).text();
            $(this).parents('.dropdown').find('.order-text').html(selText);
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
            smhPlaylists.loadEntries_advrb_plist();
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
                smhPlaylists.loadEntries_advrb_plist();
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
            smhPlaylists.loadEntries_advrb_plist();
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
            smhPlaylists.loadEntries_advrb_plist();
        });

        $('#smh-modal2 #tree2').on('change', ".durations_all", function () {
            if ($(this).is(":checked")) {
                $('#smh-modal2 .duration-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            duration = [];
            smhPlaylists.loadEntries_advrb_plist();
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
            smhPlaylists.loadEntries_advrb_plist();
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
            smhPlaylists.loadEntries_advrb_plist();
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
            smhPlaylists.loadEntries_advrb_plist();
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
            smhPlaylists.loadEntries_advrb_plist();
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
            smhPlaylists.loadEntries_advrb_plist();
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
            smhPlaylists.loadEntries_advrb_plist();
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
            smhPlaylists.loadEntries_advrb_plist();
        });

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

        $('#smh-modal2 #entries-filter-wrapper .panel-body').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
        smhPlaylists.loadEntries_advrb_plist();
    },
    //Update Rule
    saveRule: function (rule_num) {
        $('#adv-plist-table').find('.mCustomScrollBox:first').find('.mCSB_container:first div.rule-wrapper').each(function () {
            if ($(this).attr("data-rulenum") == rule_num) {
                $(this).attr("data-categories", categoryIDs.join(','));
                $(this).attr("data-mediatypes", mediaTypes.join(','));
                $(this).attr("data-durations", duration.join(','));
                $(this).attr("data-clipped", clipped.join(','));
                $(this).attr("data-ac", ac_filter.join(','));
                $(this).attr("data-flavors", flavors_filter.join(','));
                $(this).attr("data-ruleduration", rule_duration);
                $(this).attr("data-count", rule_count);
                var mediaTypes_arr = [];
                var mediaTypes_text_arr = [];
                mediaTypes_arr[1] = 'Video';
                mediaTypes_arr[2] = 'Image';
                mediaTypes_arr[5] = 'Audio';
                mediaTypes_arr[100] = 'Live Stream';
                $.each(mediaTypes, function (index, value) {
                    mediaTypes_text_arr.push(mediaTypes_arr[value]);
                });
                var mediaTypes_text = (mediaTypes_text_arr.length > 0) ? mediaTypes_text_arr.join(", ") : 'All';

                var duration_arr = [];
                var duration_text_arr = [];
                duration_arr['short'] = 'Short (0-4 min.)';
                duration_arr['medium'] = 'Medium (4-20 min.)';
                duration_arr['long'] = 'Long (20+ min.)';
                $.each(duration, function (index, value) {
                    duration_text_arr.push(duration_arr[value]);
                });
                var duration_text = (duration_text_arr.length > 0) ? duration_text_arr.join(", ") : 'All';

                var clipped_arr = [];
                var clipped_text_arr = [];
                clipped_arr[1] = 'Original Entries';
                clipped_arr[0] = 'Clipped Entries';
                $.each(clipped, function (index, value) {
                    clipped_text_arr.push(clipped_arr[value]);
                });
                var clipped_text = (clipped_text_arr.length > 0) ? clipped_text_arr.join(", ") : 'All';

                var ac_text_arr = [];
                $.each(ac, function (index, value) {
                    if ($.inArray(value.id.toString(), ac_filter) != -1) {
                        ac_text_arr.push(value.name);
                    }
                });
                var ac_text = (ac_text_arr.length > 0) ? '<div class="mediatype"><b>Access Control Profiles: </b>' + ac_text_arr.join(", ") + '</div>' : '';

                var flavors_text_arr = [];
                $.each(flavors, function (index, value) {
                    if ($.inArray(value.id.toString(), flavors_filter) != -1) {
                        flavors_text_arr.push(value.name);
                    }
                });
                var flavors_text = (flavors_text_arr.length > 0) ? '<div class="mediatype"><b>Flavors: </b>' + flavors_text_arr.join(", ") + '</div>' : '';

                var cat_text_arr = [];
                $.each(categories_data, function (index, value) {
                    if ($.inArray(value.id.toString(), categoryIDs) != -1) {
                        cat_text_arr.push(value.name);
                    }
                });
                var cat_text = (cat_text_arr.length > 0) ? '<div class="mediatype"><b>Categories: </b>' + cat_text_arr.join(", ") + '</div>' : '';

                var rule_order = (order == '-recent') ? 'Most Recent' : (order == '-plays') ? 'Most Played' : (order == '-rank') ? 'Highest Rated' : (order == '+name') ? 'Entry Name' : '';
                $(this).find(".orderby-wrapper").html(rule_order);
                $(this).find(".limit-wrapper").html(limit);

                $(this).find(".mediatype-wrapper .mCSB_container").html('<div class="mediatype"><b>Media Type: </b>' + mediaTypes_text + '</div>' +
                        '<div class="mediatype"><b>Duration: </b>' + duration_text + '</div>' +
                        '<div class="mediatype"><b>Original & Clipped Entries: </b>' + clipped_text + '</div>' +
                        ac_text +
                        flavors_text +
                        cat_text);
                $(this).find(".mediatype-wrapper").mCustomScrollbar({
                    theme: "inset-dark",
                    scrollButtons: {
                        enable: true
                    }
                });

                var categories_id = categoryIDs.join();
                var mediaTypes_id = mediaTypes.join();
                var durations = duration.join();
                var clipped_id = clipped.join();
                var ac_id = ac_filter.join();
                var flavors_id = flavors_filter.join();
                $(this).find(".tools").html('<i class="fa fa-edit" onclick="smhPlaylists.editRule(' + rule_num + ',\'' + categories_id + '\',\'' + mediaTypes_id + '\',\'' + durations + '\',\'' + clipped_id + '\',\'' + ac_id + '\',\'' + flavors_id + '\',\'' + order + '\',' + limit + ');"></i>' +
                        '<i class="fa fa-trash-o" onclick="smhPlaylists.removeAdvDND(this);"></i>');

                var entries_count = 0;
                $('#adv-plist-table').find('.mCustomScrollBox:first').find('.mCSB_container:first div.rule-wrapper').each(function () {
                    entries_count += Number($(this).attr("data-count"));
                });
                $('#advrb-entries-wrapper #entries-num').html(entries_count);

                var ruleduration = 0;
                $('#adv-plist-table').find('.mCustomScrollBox:first').find('.mCSB_container:first div.rule-wrapper').each(function () {
                    ruleduration += Number($(this).attr("data-ruleduration"));
                });
                var final_duration = smhPlaylists.convertToHHMM(ruleduration);
                $('#advrb-entries-wrapper #duration').html(final_duration);

                $('#smh-modal2 .smh-close2').click();
            }
        });
    },
    //Inserts Rule
    addAdvRule: function () {
        var categories_id = categoryIDs.join();
        var mediaTypes_id = mediaTypes.join();
        var durations = duration.join();
        var clipped_id = clipped.join();
        var ac_id = ac_filter.join();
        var flavors_id = flavors_filter.join();

        var mediaTypes_arr = [];
        var mediaTypes_text_arr = [];
        mediaTypes_arr[1] = 'Video';
        mediaTypes_arr[2] = 'Image';
        mediaTypes_arr[5] = 'Audio';
        mediaTypes_arr[100] = 'Live Stream';
        $.each(mediaTypes, function (index, value) {
            mediaTypes_text_arr.push(mediaTypes_arr[value]);
        });
        var mediaTypes_text = (mediaTypes_text_arr.length > 0) ? mediaTypes_text_arr.join(", ") : 'All';

        var duration_arr = [];
        var duration_text_arr = [];
        duration_arr['short'] = 'Short (0-4 min.)';
        duration_arr['medium'] = 'Medium (4-20 min.)';
        duration_arr['long'] = 'Long (20+ min.)';
        $.each(duration, function (index, value) {
            duration_text_arr.push(duration_arr[value]);
        });
        var duration_text = (duration_text_arr.length > 0) ? duration_text_arr.join(", ") : 'All';

        var clipped_arr = [];
        var clipped_text_arr = [];
        clipped_arr[1] = 'Original Entries';
        clipped_arr[0] = 'Clipped Entries';
        $.each(clipped, function (index, value) {
            clipped_text_arr.push(clipped_arr[value]);
        });
        var clipped_text = (clipped_text_arr.length > 0) ? clipped_text_arr.join(", ") : 'All';

        var ac_text_arr = [];
        $.each(ac, function (index, value) {
            if ($.inArray(value.id.toString(), ac_filter) != -1) {
                ac_text_arr.push(value.name);
            }
        });
        var ac_text = (ac_text_arr.length > 0) ? '<div class="mediatype"><b>Access Control Profiles: </b>' + ac_text_arr.join(", ") + '</div>' : '';

        var flavors_text_arr = [];
        $.each(flavors, function (index, value) {
            if ($.inArray(value.id.toString(), flavors_filter) != -1) {
                flavors_text_arr.push(value.name);
            }
        });
        var flavors_text = (flavors_text_arr.length > 0) ? '<div class="mediatype"><b>Flavors: </b>' + flavors_text_arr.join(", ") + '</div>' : '';

        var cat_text_arr = [];
        $.each(categories_data, function (index, value) {
            if ($.inArray(value.id.toString(), categoryIDs) != -1) {
                cat_text_arr.push(value.name);
            }
        });
        var cat_text = (cat_text_arr.length > 0) ? '<div class="mediatype"><b>Categories: </b>' + cat_text_arr.join(", ") + '</div>' : '';

        var rule_order = (order == '-recent') ? 'Most Recent' : (order == '-plays') ? 'Most Played' : (order == '-rank') ? 'Highest Rated' : (order == '+name') ? 'Entry Name' : '';

        var rule = '<div class="rule-wrapper" data-rulenum="' + rule_num + '" data-categories="' + categories_id + '" data-mediatypes="' + mediaTypes_id + '" data-durations="' + durations + '" data-clipped="' + clipped_id + '" data-ac="' + ac_id + '" data-flavors="' + flavors_id + '" data-ruleduration="' + rule_duration + '" data-count="' + rule_count + '">' +
                '<div class="mediatype-wrapper">' +
                '<div class="mediatype"><b>Media Type: </b>' + mediaTypes_text + '</div>' +
                '<div class="mediatype"><b>Duration: </b>' + duration_text + '</div>' +
                '<div class="mediatype"><b>Original & Clipped Entries: </b>' + clipped_text + '</div>' +
                ac_text +
                flavors_text +
                cat_text +
                '</div>' +
                '<div class="orderby-wrapper">' + rule_order + '</div>' +
                '<div class="limit-wrapper">' + limit + '</div>' +
                '<div class="tools">' +
                '<i class="fa fa-edit" onclick="smhPlaylists.editRule(' + rule_num + ',\'' + categories_id + '\',\'' + mediaTypes_id + '\',\'' + durations + '\',\'' + clipped_id + '\',\'' + ac_id + '\',\'' + flavors_id + '\',\'' + order + '\',' + limit + ');"></i>' +
                '<i class="fa fa-trash-o" onclick="smhPlaylists.removeAdvDND(this);"></i>' +
                '</div>' +
                '<div class="clear"></div>' +
                '</div>';

        $('#adv-plist-table').find('.mCustomScrollBox:first').find('.mCSB_container:first').append(rule);
        $('#smh-modal .mediatype-wrapper').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        var entries_count = 0;
        $('#adv-plist-table').find('.mCustomScrollBox:first').find('.mCSB_container:first div.rule-wrapper').each(function () {
            entries_count += Number($(this).attr("data-count"));
        });
        $('#advrb-entries-wrapper #entries-num').html(entries_count);

        var ruleduration = 0;
        $('#adv-plist-table').find('.mCustomScrollBox:first').find('.mCSB_container:first div.rule-wrapper').each(function () {
            ruleduration += Number($(this).attr("data-ruleduration"));
        });
        var final_duration = smhPlaylists.convertToHHMM(ruleduration);
        $('#advrb-entries-wrapper #duration').html(final_duration);
        rule_num++;

        $('#smh-modal2 .smh-close2').click();
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
    //Update order
    updatePlistOrder: function (plist_order) {
        order = plist_order;
        smhPlaylists.loadEntries_rb_plist();
    },
    //Updat order
    updateAdvPlistOrder: function (plist_order) {
        order = plist_order;
        smhPlaylists.loadEntries_advrb_plist();
    },
    //Adds Rule Based Playlist
    addRBPlist: function () {
        var valid = validator.form();
        if (valid) {
            var cb = function (success, results) {
                if (!success)
                    alert(results);

                if (results.code && results.message) {
                    alert(results.message);
                    return;
                }
                $('#smh-modal #loading').empty();
                $('#smh-modal #pass-result').html('<span class="label label-success">Playlist Successfully Created!</span>');
                setTimeout(function () {
                    $('#smh-modal #pass-result').empty();
                    $('#smh-modal').modal('hide');
                }, 3000);
                smhPlaylists.getPlaylists();
            };

            var name = $('#create-rb-plist #playlist_name').val();
            var desc = $('#create-rb-plist #playlist_desc').val();
            $('#add-rb-plist').attr('disabled', '');
            $('#smh-modal #loading img').css('display', 'inline-block');
            var categories_id = categoryIDs.join();
            var mediaTypes_id = mediaTypes.join();
            var durations = duration.join();
            var clipped_id = clipped.join();
            var ac_id = ac_filter.join();
            var flavors_id = flavors_filter.join();
            var updateStats;
            var playlist = new KalturaPlaylist();
            playlist.name = name;
            playlist.description = desc;
            playlist.playlistType = 10;
            playlist.totalResults = 200;
            playlist.filters = new Array();
            playlist.filters.push({
                'categoriesIdsMatchOr': categories_id,
                'mediaTypeIn': mediaTypes_id,
                'durationTypeMatchOr': durations,
                'isRoot': clipped_id,
                'accessControlIdIn': ac_id,
                'flavorParamsIdsMatchOr': flavors_id,
                'orderBy': order,
                'limit': limit
            });
            client.playlist.add(cb, playlist, updateStats);
        }
    },
    //Adds Advanced Rule Based Playlist
    addAdvRB: function () {
        var valid = validator.form();
        if (valid) {

            var plist_arr = [];
            $('#adv-plist-table').find('.mCustomScrollBox:first').find('.mCSB_container:first div.rule-wrapper').each(function () {
                var order = $(this).find(".orderby-wrapper").text()
                var rule_order = (order == 'Most Recent') ? '-recent' : (order == 'Most Played') ? '-plays' : (order == 'Highest Rated') ? '-rank' : (order == 'Entry Name') ? '+name' : '';
                var limit = $(this).find(".limit-wrapper").text();
                plist_arr.push({
                    'categories': $(this).attr("data-categories"),
                    'mediatypes': $(this).attr("data-mediatypes"),
                    'durations': $(this).attr("data-durations"),
                    'clipped': $(this).attr("data-clipped"),
                    'ac': $(this).attr("data-ac"),
                    'flavors': $(this).attr("data-flavors"),
                    'order': rule_order,
                    'limit': limit
                })
            });

            if (plist_arr.length > 0) {
                var cb = function (success, results) {
                    if (!success)
                        alert(results);

                    if (results.code && results.message) {
                        alert(results.message);
                        return;
                    }
                    $('#smh-modal #loading').empty();
                    $('#smh-modal #pass-result').html('<span class="label label-success">Playlist Successfully Created!</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    }, 3000);
                    smhPlaylists.getPlaylists();
                };

                var name = $('#create-rb-plist #playlist_name').val();
                var desc = $('#create-rb-plist #playlist_desc').val();
                $('#add-rb-plist').attr('disabled', '');
                $('#smh-modal #loading img').css('display', 'inline-block');
                var updateStats;
                var playlist = new KalturaPlaylist();
                playlist.name = name;
                playlist.description = desc;
                playlist.playlistType = 10;
                playlist.totalResults = 200;
                playlist.filters = new Array();
                $.each(plist_arr, function (index, value) {
                    playlist.filters.push({
                        'categoriesIdsMatchOr': value.categories,
                        'mediaTypeIn': value.mediatypes,
                        'durationTypeMatchOr': value.durations,
                        'isRoot': value.clipped,
                        'accessControlIdIn': value.ac,
                        'flavorParamsIdsMatchOr': value.flavors,
                        'orderBy': value.order,
                        'limit': value.limit
                    });
                });
                client.playlist.add(cb, playlist, updateStats);
            } else {
                smhPlaylists.noPlist();
            }
        }
    },
    //Adds Manual Playlist
    addManualPlist: function () {
        var valid = validator.form();
        if (valid) {
            var plist_arr = [];
            $('#plist-entries .mCSB_container div.entry-wrapper').each(function () {
                plist_arr.push($(this).attr("data-entryid"));
            });

            if (plist_arr.length > 0) {
                var cb = function (success, results) {
                    if (!success)
                        alert(results);

                    if (results.code && results.message) {
                        alert(results.message);
                        return;
                    }
                    $('#smh-modal #loading').empty();
                    $('#smh-modal #pass-result').html('<span class="label label-success">Playlist Successfully Created!</span>');
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    }, 3000);
                    smhPlaylists.getPlaylists();
                };

                var name = $('#create-manual-plist #playlist_name').val();
                var desc = $('#create-manual-plist #playlist_desc').val();
                var playlistContent = plist_arr.join(",");
                $('#add-manual-plist').attr('disabled', '');
                $('#smh-modal #loading img').css('display', 'inline-block');
                var updateStats;
                var playlist = new KalturaPlaylist();
                playlist.name = name;
                playlist.description = desc;
                playlist.playlistContent = playlistContent;
                playlist.playlistType = 3;
                client.playlist.add(cb, playlist, updateStats);
            } else {
                smhPlaylists.noPlist();
            }
        }
    },
    //Do manual playlist update
    updateManualPlist: function (id) {
        var valid = validator.form();
        if (valid) {
            var plist_arr = [];
            $('#plist-entries .mCSB_container div.entry-wrapper').each(function () {
                plist_arr.push($(this).attr("data-entryid"));
            });

            if (plist_arr.length > 0) {
                var cb = function (success, results) {
                    if (!success)
                        alert(results);

                    if (results.code && results.message) {
                        alert(results.message);
                        return;
                    }
                    var purgeResponse = smhPlaylists.purgeCache('playlist');
                    if (purgeResponse) {
                        $('#smh-modal .modal-footer #loading').empty();
                        $('#smh-modal .modal-footer #pass-result').html('<span class="label label-success">Playlist Successfully Updated!</span>');
                    } else {
                        $('#smh-modal .modal-footer #loading').empty();
                        $('#smh-modal .modal-footer #pass-result').html('<span class="label label-danger">Error: Could not purge cache</span>');
                    }
                    setTimeout(function () {
                        $('#smh-modal .modal-footer #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    }, 3000);
                    smhPlaylists.getPlaylists();
                };

                var name = $('#create-manual-plist #playlist_name').val();
                var desc = $('#create-manual-plist #playlist_desc').val();
                var playlistContent = plist_arr.join(",");
                $('#update-manual-plist').attr('disabled', '');
                $('#smh-modal .modal-footer #loading img').css('display', 'inline-block');
                var updateStats;
                var playlist = new KalturaPlaylist();
                playlist.name = name;
                playlist.description = desc;
                playlist.playlistContent = playlistContent;
                client.playlist.update(cb, id, playlist, updateStats);
            } else {
                smhPlaylists.noPlist();
            }
        }
    },
    //No playlist modal
    noPlist: function () {
        smhPlaylists.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '340px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">No Playlist</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = '<div style="padding-top: 15px; padding-bottom: 15px; text-align: center;">You must add at least one entry to the playlist</div>';

        $('#smh-modal2 .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button>';
        $('#smh-modal2 .modal-footer').html(footer);

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '2');
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
    //Load Entries
    loadEntries_manual_plist: function () {
        var categories_id = categoryIDs.join();
        var mediaTypes_id = mediaTypes.join();
        var durations = duration.join();
        var clipped_id = clipped.join();
        var ac_id = ac_filter.join();
        var flavors_id = flavors_filter.join();
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#smh-modal #plist-table').empty();
        $('#smh-modal #plist-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="plist-data"></table>');
        manualTable = $('#smh-modal #plist-data').DataTable({
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
            "scrollY": "511px",
            "ajax": {
                "url": "/api/v1/getPlaylists_Entries",
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
                        "flavors": flavors_id
                    });
                }
            },
            "language": {
                "zeroRecords": "No Entries Found"
            },
            "columns": [
                {
                    "title": "<span style='float: left;'><div class='data-break'>Playlist</div></span>",
                    "width": "80px"
                }
            ],
            "drawCallback": function (oSettings) {
                smhMain.fcmcAddRows(this, 1, 10);
                $('#smh-modal #plist-data .entry-wrapper').draggable({
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
                $('#smh-modal #plist-entries').droppable({
                    accept: '#plist-data .entry-wrapper',
                    drop: function (event, ui) {
                        $('#plist-entries .mCSB_container').append($(ui.helper).clone());
                        $('#plist-entries .entry-wrapper').css('position', '');
                        $('#plist-entries .entry-wrapper').css('top', '');
                        $('#plist-entries .entry-wrapper').css('left', '');
                        $('#plist-entries .entry-wrapper').addClass('hover');
                        $('#playlist-info #entries-num').html($('#plist-entries .mCSB_container div.entry-wrapper').length);
                        var duration = 0;
                        $('#plist-entries .mCSB_container div.entry-wrapper').each(function () {
                            duration += Number($(this).attr("data-duration"));
                        });
                        var final_duration = smhPlaylists.convertToHHMM(duration);
                        $('#playlist-info #duration').html(final_duration);
                    }
                });
                $("#smh-modal #plist-entries .mCSB_container").sortable({
                    placeholder: "plist-hightlight",
                    helper: 'clone',
                    start: function (e, ui) {
                        $('#plist-entries .entry-wrapper').addClass('hover');
                    },
                    stop: function (e, ui) {
                        $('#playlist-info #entries-num').html($('#plist-entries .mCSB_container div.entry-wrapper').length);
                        var duration = 0;
                        $('#plist-entries .mCSB_container div.entry-wrapper').each(function () {
                            duration += Number($(this).attr("data-duration"));
                        });
                        var final_duration = smhPlaylists.convertToHHMM(duration);
                        $('#playlist-info #duration').html(final_duration);
                    }
                });
            }
        });
        $('#smh-modal #plist-table .dataTables_scrollBody').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
    },
    //Load Entries
    loadEntries_rb_plist: function () {
        var categories_id = categoryIDs.join();
        var mediaTypes_id = mediaTypes.join();
        var durations = duration.join();
        var clipped_id = clipped.join();
        var ac_id = ac_filter.join();
        var flavors_id = flavors_filter.join();
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#smh-modal #plist-table').empty();
        $('#smh-modal #plist-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="plist-data"></table>');
        rbTable = $('#smh-modal #plist-data').DataTable({
            "dom": 'R<"H"lfr>t<"F"ip>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": true,
            "serverSide": true,
            "autoWidth": false,
            "paginate": false,
            "searching": true,
            "info": false,
            "lengthChange": false,
            "scrollCollapse": true,
            "scrollY": "511px",
            "ajax": {
                "url": "/api/v1/getRBPlaylists_Entries",
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
                        "limit": limit,
                        "orderby": order
                    });
                },
                "dataSrc": function (json) {
                    $('#smh-modal #playlist-info #entries-num').html(json['recordsTotal']);
                    $('#smh-modal #playlist-info #duration').html(json['total_duration']);
                    return json.data
                }
            },
            "language": {
                "zeroRecords": "No Entries Found"
            },
            "columns": [
                {
                    "title": "<span style='float: left;'><div class='data-break'>Playlist</div></span>",
                    "width": "80px"
                }
            ],
            "drawCallback": function (oSettings) {
                smhMain.fcmcAddRows(this, 1, 5);
            }
        });
        $('#rb-entries-wrapper #plist-table .dataTables_scrollBody').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
    },
    //Load Entries
    loadEntries_advrb_plist: function () {
        var categories_id = categoryIDs.join();
        var mediaTypes_id = mediaTypes.join();
        var durations = duration.join();
        var clipped_id = clipped.join();
        var ac_id = ac_filter.join();
        var flavors_id = flavors_filter.join();
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#smh-modal2 #plist-table').empty();
        $('#smh-modal2 #plist-table').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="plist-data"></table>');
        advrbTable = $('#smh-modal2 #plist-data').DataTable({
            "dom": 'R<"H"lfr>t<"F"ip>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": true,
            "serverSide": true,
            "autoWidth": false,
            "paginate": false,
            "searching": true,
            "info": false,
            "lengthChange": false,
            "scrollCollapse": true,
            "scrollY": "511px",
            "ajax": {
                "url": "/api/v1/getRBPlaylists_Entries",
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
                        "limit": limit,
                        "orderby": order
                    });
                },
                "dataSrc": function (json) {
                    $('#smh-modal2 #playlist-info #entries-num').html(json['recordsTotal']);
                    $('#smh-modal2 #playlist-info #duration').html(json['total_duration']);
                    rule_duration = json['total_duration_raw'];
                    rule_count = json['recordsTotal'];
                    return json.data
                }
            },
            "language": {
                "zeroRecords": "No Entries Found"
            },
            "columns": [
                {
                    "title": "<span style='float: left;'><div class='data-break'>Playlist</div></span>",
                    "width": "80px"
                }
            ],
            "drawCallback": function (oSettings) {
                smhMain.fcmcAddRows(this, 1, 5);
            }
        });
        $('#rule-entries-wrapper #plist-table .dataTables_scrollBody').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
    },
    //Removes drag and drop icon
    removeDND: function (div) {
        $(div).parent("div").remove();
        $('#playlist-info #entries-num').html($('#plist-entries .mCSB_container div.entry-wrapper').length);
        var duration = 0;
        $('#plist-entries .mCSB_container div.entry-wrapper').each(function () {
            duration += Number($(this).attr("data-duration"));
        });
        var final_duration = smhPlaylists.convertToHHMM(duration);
        $('#playlist-info #duration').html(final_duration);
    },
    //Removes advanced drag and drop icon
    removeAdvDND: function (div) {
        $(div).closest(".rule-wrapper").remove();
        var entries_count = 0;
        $('#adv-plist-table').find('.mCustomScrollBox:first').find('.mCSB_container:first div.rule-wrapper').each(function () {
            entries_count += Number($(this).attr("data-count"));
        });
        $('#advrb-entries-wrapper #entries-num').html(entries_count);

        var ruleduration = 0;
        $('#adv-plist-table').find('.mCustomScrollBox:first').find('.mCSB_container:first div.rule-wrapper').each(function () {
            ruleduration += Number($(this).attr("data-ruleduration"));
        });
        var final_duration = smhPlaylists.convertToHHMM(ruleduration);
        $('#advrb-entries-wrapper #duration').html(final_duration);
    },
    convertToHHMM: function (secs) {
        var hr = Math.floor(secs / 3600);
        var min = Math.floor((secs - (hr * 3600)) / 60);
        var sec = secs - (hr * 3600) - (min * 60);
        return ((hr < 10) && (hr > 0) ? "0" + hr + ':' : ((hr == 0) ? "" : hr + ':')) + ((min < 10) && (min > 0) ? "0" + min + ':' : ((min == 0) ? "00:" : min + ':')) + ((sec < 10) && (sec > 0) ? "0" + sec : ((sec == 0) ? "00" : sec));
    },
    //Generates QR code
    getShortLink: function (uiconf, entryid, embed, delivery) {
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
            url = "/index.php/extwidget/preview/partner_id/" + sessInfo.pid + "/uiconf_id/" + uiconf + "/embed/" + embed + "?&flashvars[playlistAPI.kpl0Id]=" + entryid + "&flashvars[ks]=" + sessInfo.ks;
        } else {
            url = "/index.php/extwidget/preview/partner_id/" + sessInfo.pid + "/uiconf_id/" + uiconf + "/embed/" + embed + "?&flashvars[playlistAPI.kpl0Id]=" + entryid + "&flashvars[streamerType]=rtmp&flashvars[mediaProtocol]=rtmp&flashvars[ks]=" + sessInfo.ks;
        }

        $('#shortlink').html('Generating...');
        $('#qrcode').html('Generating...');
        var shortLink = new KalturaShortLink();
        shortLink.systemName = "KMC-PREVIEW";
        shortLink.fullUrl = url;
        client.shortLink.add(cb, shortLink);
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
    //Generate Playlist Embed Code
    generatePlaylistEmbed: function (uiconf_id, entryId, width, height, protocol, streamerType, embed, seo, name, preview, sizing, aspectRatio) {
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

        var cacheSt = smhPlaylists.getCacheSt();
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
            sizing: sizing,
            aspectRatio: aspectRatio,
            preview: preview,
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
                categories_data = categories_arr;
                categories = smhPlaylists.getNestedChildren(categories_arr, 0);
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
                var children = smhPlaylists.getNestedChildren(arr, arr[i].id)

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
                json = json + smhPlaylists.json_tree(data[i].children, type);
            } else {
                json = json + '<li><div class="checkbox"><label><input type="checkbox" class="' + type + '_list" value="' + data[i].id + '" /> ' + data[i].name + '</label></div>';
            }
            json = json + '</li>';
        }
        return json + '</ul>';
    },
    //Edit playlist
    editPlaylist: function (id, name, desc, type) {
        if (type == 3) {
            smhPlaylists.editManualPlaylist(id, name, desc);
        } else if (type == 10) {
            smhPlaylists.editRBPlaylist(id, name, desc);
        }
    },
    //Edit Rule Based Playlist
    editRBPlaylist: function (id, name, desc) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }

            var filter = results['filters'].length;
            if (filter == 1) {
                categoryIDs = (results['filters'][0]['categoriesIdsMatchOr'] == '' || results['filters'][0]['categoriesIdsMatchOr'] == null) ? [] : results['filters'][0]['categoriesIdsMatchOr'].split(",");
                mediaTypes = (results['filters'][0]['mediaTypeIn'] == '' || results['filters'][0]['mediaTypeIn'] == null) ? [] : results['filters'][0]['mediaTypeIn'].split(",");
                duration = (results['filters'][0]['durationTypeMatchOr'] == '' || results['filters'][0]['durationTypeMatchOr'] == null) ? [] : results['filters'][0]['durationTypeMatchOr'].split(",");
                clipped = (results['filters'][0]['isRoot'] == '' || results['filters'][0]['isRoot'] == null) ? [] : results['filters'][0]['isRoot'].split(",");
                ac_filter = (results['filters'][0]['accessControlIdIn'] == '' || results['filters'][0]['accessControlIdIn'] == null) ? [] : results['filters'][0]['accessControlIdIn'].split(",");
                flavors_filter = (results['filters'][0]['flavorParamsIdsMatchOr'] == '' || results['filters'][0]['flavorParamsIdsMatchOr'] == null) ? [] : results['filters'][0]['flavorParamsIdsMatchOr'].split(",");
                limit = results['filters'][0]['limit'];
                order = results['filters'][0]['orderBy'];
                smhPlaylists.editRBSinglePlaylist(name, desc, id);
            } else {
                smhPlaylists.editRBMultiPlaylist(name, desc, results['filters'], id);
            }
        };

        var version;
        client.playlist.get(cb, id, version);
    },
    //Edit Single Rule Based Playlist Modal
    editRBSinglePlaylist: function (name, desc, id) {
        smhMain.resetModal();
        smhPlaylists.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '900px');
        $('#smh-modal .modal-body').css('height', '600px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close mplist-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Rule Based Playlist</h4>';
        $('#smh-modal .modal-header').html(header);

        var tree = smhPlaylists.json_tree(categories, 'cat');
        var tree_ac = smhPlaylists.json_tree(ac, 'ac');
        var tree_flavors = smhPlaylists.json_tree(flavors, 'flavors');

        content = '<div class="playlist-content">' +
                '<div class="header ls-header">' +
                '<div id="playlist-fields-wrapper">' +
                '<form id="create-manual-plist" action="">' +
                '<table width="97%" border="0" id="playlist-fields">' +
                '<tr><td><span style="font-weight: normal;" class="required">Name:</span></td><td style="width: 89%;"><input type="text" placeholder="Enter a name" class="form-control" id="playlist_name" name="playlist_name" value="' + name + '"></td></tr>' +
                '<tr><td><span style="font-weight: normal;">Description:</span></td><td><input type="text" placeholder="Enter a description" class="form-control" id="playlist_desc" name="playlist_desc" value="' + desc + '"></td></tr>' +
                '</table>' +
                '</form>' +
                '</div>' +
                '</div>' +
                '<div id="entries-filter-wrapper">' +
                '<div class="header rs-header">' +
                '<div style="margin-top: 6px; margin-bottom: 5px; text-align: left; margin-left: 7px;">Filters</div>' +
                '</div>' +
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
                '</div>' +
                '<div id="rb-entries-wrapper">' +
                '<div class="header rs-header">' +
                '<div style="margin-top: 6px; margin-bottom: 5px; text-align: left; position: absolute;">Entries</div>' +
                '</div>' +
                '<div id="entries">' +
                '<div id="plist-table"></div>' +
                '<div class="clear"></div>' +
                '<div id="playlist-info">' +
                '<div id="entries-num-wrapper">Entries: <span id="entries-num">0</span></div><div id="duration-wrapper">Duration: <span id="duration">00:00</span></div>' +
                '</div>' +
                '<div id="playlist-search-info">' +
                '<div id="orderby-wrapper">' +
                '<span id="text">Order by</span>' +
                '<span class="dropdown header dropdown-orderby">' +
                '<div class="btn-group">' +
                '<button type="button" class="btn btn-default order-text">Most Recent</button>' +
                '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-expanded="true"><span class="caret"></span></button>' +
                '<ul class="dropdown-menu" id="menu" role="menu" aria-labelledby="dropdownMenu">' +
                '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="smhPlaylists.updatePlistOrder(\'-plays\');">Most Played</a></li>' +
                '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="smhPlaylists.updatePlistOrder(\'-recent\');">Most Recent</a></li>' +
                '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="smhPlaylists.updatePlistOrder(\'-rank\');">Hightest Rated</a></li>' +
                '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="smhPlaylists.updatePlistOrder(\'+name\');">Entry Name</a></li>' +
                '</ul>' +
                '</div>' +
                '</span>' +
                '</div>' +
                '<div id="limit-wrapper">' +
                '<span id="text">Limit Playlist Result</span>' +
                '<div class="col-md-5"><input id="entries-limit" type="text" name="entries-limit" class="col-md-8 form-control"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';

        $('#smh-modal .modal-body').html(content);

        footer = '<div class="pull-left"><button data-dismiss="modal" class="btn btn-default" type="button" onclick="smhPlaylists.editAdvRB(\'' + name + '\',\'' + desc + '\',\'' + id + '\');">Switch to Advanced Mode</button></div><div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default mplist-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="update-rb-plist" onclick="smhPlaylists.updateSingleRBPlist(\'' + id + '\')">Update</button>';
        $('#smh-modal .modal-footer').html(footer);

        $("input[name='entries-limit']").TouchSpin({
            initval: limit,
            min: 1,
            max: 100000,
            step: 1,
            verticalbuttons: true
        });

        $('.cat-filter input[type="checkbox"]').each(function (index, value) {
            if ($.inArray($(this).val(), categoryIDs) != -1) {
                $(this).prop('checked', true);
                $('.cat_all').prop('checked', false);
            }
        });

        $('.media-filter input[type="checkbox"]').each(function (index, value) {
            if ($.inArray($(this).val(), mediaTypes) != -1) {
                $(this).prop('checked', true);
                $('.media_all').prop('checked', false);
            }
        });

        $('.duration-filter input[type="checkbox"]').each(function (index, value) {
            if ($.inArray($(this).val(), duration) != -1) {
                $(this).prop('checked', true);
                $('.durations_all').prop('checked', false);
            }
        });

        $('.clipped-filter input[type="checkbox"]').each(function (index, value) {
            if ($.inArray($(this).val(), clipped) != -1) {
                $(this).prop('checked', true);
                $('.clipped_all').prop('checked', false);
            }
        });

        $('.ac-filter input[type="checkbox"]').each(function (index, value) {
            if ($.inArray($(this).val(), ac_filter) != -1) {
                $(this).prop('checked', true);
                $('.ac_all').prop('checked', false);
            }
        });

        $('.flavors-filter input[type="checkbox"]').each(function (index, value) {
            if ($.inArray($(this).val(), flavors_filter) != -1) {
                $(this).prop('checked', true);
                $('.flavors_all').prop('checked', false);
            }
        });

        if (order.indexOf('plays') > -1) {
            $('.dropdown-orderby .order-text').html('Most Played');
        } else if (order.indexOf('recent') > -1) {
            $('.dropdown-orderby .order-text').html('Most Recent');
        } else if (order.indexOf('rank') > -1) {
            $('.dropdown-orderby .order-text').html('Hightest Rated');
        } else if (order.indexOf('name') > -1) {
            $('.dropdown-orderby .order-text').html('Entry Name');
        }

        $("input[name='entries-limit']").on('change', function () {
            limit = parseInt($('#entries-limit').val());
            smhPlaylists.loadEntries_rb_plist();
        });

        $("#orderby-wrapper #menu li a").click(function () {
            var selText = $(this).text();
            $(this).parents('.dropdown').find('.order-text').html(selText);
        });

        $('#tree1').on('change', ".cat_all", function () {
            if ($(this).is(":checked")) {
                $('.cat-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            categoryIDs = [];
            smhPlaylists.loadEntries_rb_plist();
        });
        $('#tree1').on('click', ".cat_list", function () {
            setTimeout(function () {
                var anyBoxesChecked = false;
                categoryIDs = [];
                $('.cat-filter input[type="checkbox"]').each(function () {
                    if ($(this).is(":checked")) {
                        anyBoxesChecked = true;
                        var checkbox_value = $(this).val();
                        categoryIDs.push(checkbox_value);
                    }
                });
                if (anyBoxesChecked == true) {
                    $('.cat_all').prop('checked', false);
                } else {
                    $('.cat_all').prop('checked', true);
                }
            }, 50);
            setTimeout(function () {
                smhPlaylists.loadEntries_rb_plist();
            }, 100);
        });

        $('#tree2').on('change', ".media_all", function () {
            if ($(this).is(":checked")) {
                $('.media-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            mediaTypes = [];
            smhPlaylists.loadEntries_rb_plist();
        });
        $('#tree2').on('click', ".media_list", function () {
            var anyBoxesChecked = false;
            mediaTypes = [];
            $('.media-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    mediaTypes.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('.media_all').prop('checked', false);
            } else {
                $('.media_all').prop('checked', true);
            }
            smhPlaylists.loadEntries_rb_plist();
        });

        $('#tree2').on('change', ".durations_all", function () {
            if ($(this).is(":checked")) {
                $('.duration-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            duration = [];
            smhPlaylists.loadEntries_rb_plist();
        });
        $('#tree2').on('click', ".duration_list", function () {
            var anyBoxesChecked = false;
            duration = [];
            $('.duration-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    duration.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('.durations_all').prop('checked', false);
            } else {
                $('.durations_all').prop('checked', true);
            }
            smhPlaylists.loadEntries_rb_plist();
        });

        $('#tree2').on('change', ".clipped_all", function () {
            if ($(this).is(":checked")) {
                $('.clipped-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            clipped = [];
            smhPlaylists.loadEntries_rb_plist();
        });
        $('#tree2').on('click', ".clipped_list", function () {
            var anyBoxesChecked = false;
            clipped = [];
            $('.clipped-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    clipped.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('.clipped_all').prop('checked', false);
            } else {
                $('.clipped_all').prop('checked', true);
            }
            smhPlaylists.loadEntries_rb_plist();
        });

        $('#tree2').on('change', ".ac_all", function () {
            if ($(this).is(":checked")) {
                $('.ac-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            ac_filter = [];
            smhPlaylists.loadEntries_rb_plist();
        });
        $('#tree2').on('click', ".ac_list", function () {
            var anyBoxesChecked = false;
            ac_filter = [];
            $('.ac-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    ac_filter.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('.ac_all').prop('checked', false);
            } else {
                $('.ac_all').prop('checked', true);
            }
            smhPlaylists.loadEntries_rb_plist();
        });

        $('#tree2').on('change', ".flavors_all", function () {
            if ($(this).is(":checked")) {
                $('.flavors-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            flavors_filter = [];
            smhPlaylists.loadEntries_rb_plist();
        });
        $('#tree2').on('click', ".flavors_list", function () {
            var anyBoxesChecked = false;
            flavors_filter = [];
            $('.flavors-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    flavors_filter.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('.flavors_all').prop('checked', false);
            } else {
                $('.flavors_all').prop('checked', true);
            }
            smhPlaylists.loadEntries_rb_plist();
        });

        $('#tree1').tree({
            collapseDuration: 100,
            expandDuration: 100,
            onCheck: {
                ancestors: null
            }
        });

        $('#tree2').tree({
            collapseDuration: 100,
            expandDuration: 100,
            onCheck: {
                ancestors: null
            }
        });

        $('#entries-filter-wrapper .panel-body').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        $('#rb-entries-wrapper .panel-body').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        $('#create-manual-plist input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });

        validator = $("#create-manual-plist").validate({
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
                playlist_name: {
                    required: true
                }
            },
            messages: {
                playlist_name: {
                    required: 'Please enter a name'
                }
            }
        });
        smhPlaylists.loadEntries_rb_plist();
    },
    editAdvRB: function (name, desc, id) {
        smhMain.resetModal();
        smhPlaylists.resetModal();
        smhPlaylists.resetFilters();
        rule_num = 0;
        var header, content, footer;
        $('.smh-dialog').css('width', '900px');
        $('#smh-modal .modal-body').css('height', '643px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close rbplist-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Rule Based Playlist</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div class="playlist-content">' +
                '<div class="header ls-header">' +
                '<div id="playlist-fields-wrapper">' +
                '<form id="create-rb-plist" action="">' +
                '<table width="97%" border="0" id="playlist-fields">' +
                '<tr><td><span style="font-weight: normal;" class="required">Name:</span></td><td style="width: 89%;"><input type="text" placeholder="Enter a name" class="form-control" id="playlist_name" name="playlist_name" value="' + name + '"></td></tr>' +
                '<tr><td><span style="font-weight: normal;">Description:</span></td><td><input type="text" placeholder="Enter a description" class="form-control" id="playlist_desc" name="playlist_desc" value="' + desc + '"></td></tr>' +
                '</table>' +
                '</form>' +
                '</div>' +
                '</div>' +
                '<div id="advrb-entries-wrapper">' +
                '<div id="entries">' +
                '<table cellspacing="0" cellpadding="0" border="0" class="display content-data dataTable no-footer" role="grid" style="margin-left: 0px; width: 100%;">' +
                '<thead>' +
                '<tr role="row"><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 100px;"><span style="float: left;">Type</span></th><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 100px;"><span style="float: left;">Order By</span></th><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 100px;"><span style="float: left;">Limit</span></th></tr>' +
                '</thead>' +
                '</table>' +
                '<div id="adv-plist-table"></div>' +
                '<div class="clear"></div>' +
                '<div id="playlist-info">' +
                '<div class="pull-left"><button type="button" class="btn btn-primary" id="add-rule" onclick="smhPlaylists.addRule()">Add Rule</button></div>' +
                '<div id="entries-num-wrapper">Entries: <span id="entries-num">0</span></div><div id="duration-wrapper">Duration: <span id="duration">00:00</span></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';

        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default rbplist-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="update-rb-plist" onclick="smhPlaylists.updateMultiRBPlist(\'' + id + '\')">Update</button>';
        $('#smh-modal .modal-footer').html(footer);

        $('#smh-modal .mediatype-wrapper').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        $('#smh-modal #adv-plist-table').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        $("#smh-modal #adv-plist-table .mCSB_container").sortable({
            placeholder: "advplist-hightlight",
            helper: 'clone'
        });

        $('#create-rb-plist input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });

        validator = $("#create-rb-plist").validate({
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
                playlist_name: {
                    required: true
                }
            },
            messages: {
                playlist_name: {
                    required: 'Please enter a name'
                }
            }
        });
    },
    //Edit Multiple Rule Based Playlist
    editRBMultiPlaylist: function (name, desc, filters, id) {
        smhMain.resetModal();
        smhPlaylists.resetModal();
        smhPlaylists.resetFilters();
        rule_num = 0;
        var duration_count_arr = [];
        var header, content, footer;
        $('.smh-dialog').css('width', '900px');
        $('#smh-modal .modal-body').css('height', '643px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close rbplist-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Rule Based Playlist</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div class="playlist-content">' +
                '<div class="header ls-header">' +
                '<div id="playlist-fields-wrapper">' +
                '<form id="create-rb-plist" action="">' +
                '<table width="97%" border="0" id="playlist-fields">' +
                '<tr><td><span style="font-weight: normal;" class="required">Name:</span></td><td style="width: 89%;"><input type="text" placeholder="Enter a name" class="form-control" id="playlist_name" name="playlist_name" value="' + name + '"></td></tr>' +
                '<tr><td><span style="font-weight: normal;">Description:</span></td><td><input type="text" placeholder="Enter a description" class="form-control" id="playlist_desc" name="playlist_desc" value="' + desc + '"></td></tr>' +
                '</table>' +
                '</form>' +
                '</div>' +
                '</div>' +
                '<div id="advrb-entries-wrapper">' +
                '<div id="entries">' +
                '<table cellspacing="0" cellpadding="0" border="0" class="display content-data dataTable no-footer" role="grid" style="margin-left: 0px; width: 100%;">' +
                '<thead>' +
                '<tr role="row"><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 100px;"><span style="float: left;">Type</span></th><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 100px;"><span style="float: left;">Order By</span></th><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 100px;"><span style="float: left;">Limit</span></th></tr>' +
                '</thead>' +
                '</table>' +
                '<div id="adv-plist-table"></div>' +
                '<div id="playlist-loading"><img height="20px" src="/img/loading.gif"></div>' +
                '<div class="clear"></div>' +
                '<div id="playlist-info">' +
                '<div class="pull-left"><button type="button" class="btn btn-primary" id="add-rule" onclick="smhPlaylists.addRule()">Add Rule</button></div>' +
                '<div id="entries-num-wrapper">Entries: <span id="entries-num">0</span></div><div id="duration-wrapper">Duration: <span id="duration">00:00</span></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';

        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default rbplist-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="update-rb-plist" onclick="smhPlaylists.updateMultiRBPlist(\'' + id + '\')">Update</button>';
        $('#smh-modal .modal-footer').html(footer);

        $('#smh-modal #adv-plist-table').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }

            $('#smh-modal #playlist-loading img').css('display', 'none');
            $.each(results, function (index, value) {
                var total_duration = 0;
                var entry_count = 0;
                $.each(value, function (i, v) {
                    total_duration += v.duration;
                    entry_count++;
                });
                var temp_arr = [];
                temp_arr['duration'] = total_duration;
                temp_arr['total_entries'] = entry_count;
                duration_count_arr.push(temp_arr);
            });

            $.each(filters, function (index, value) {
                categoryIDs = (value.categoriesIdsMatchOr == '' || value.categoriesIdsMatchOr == null) ? [] : value.categoriesIdsMatchOr.split(",");
                mediaTypes = (value.mediaTypeIn == '' || value.mediaTypeIn == null) ? [] : value.mediaTypeIn.split(",");
                duration = (value.durationTypeMatchOr == '' || value.durationTypeMatchOr == null) ? [] : value.durationTypeMatchOr.split(",");
                clipped = (value.isRoot == '' || value.isRoot == null) ? [] : value.isRoot.split(",");
                ac_filter = (value.accessControlIdIn == '' || value.accessControlIdIn == null) ? [] : value.accessControlIdIn.split(",");
                flavors_filter = (value.flavorParamsIdsMatchOr == '' || value.flavorParamsIdsMatchOr == null) ? [] : value.flavorParamsIdsMatchOr.split(",");
                limit = value.limit;
                order = value.orderBy;
                rule_duration = duration_count_arr[index]['duration'];
                rule_count = duration_count_arr[index]['total_entries'];

                var categories_id = categoryIDs.join();
                var mediaTypes_id = mediaTypes.join();
                var durations = duration.join();
                var clipped_id = clipped.join();
                var ac_id = ac_filter.join();
                var flavors_id = flavors_filter.join();

                var mediaTypes_arr = [];
                var mediaTypes_text_arr = [];
                mediaTypes_arr[1] = 'Video';
                mediaTypes_arr[2] = 'Image';
                mediaTypes_arr[5] = 'Audio';
                mediaTypes_arr[100] = 'Live Stream';
                $.each(mediaTypes, function (index, value) {
                    mediaTypes_text_arr.push(mediaTypes_arr[value]);
                });
                var mediaTypes_text = (mediaTypes_text_arr.length > 0) ? mediaTypes_text_arr.join(", ") : 'All';

                var duration_arr = [];
                var duration_text_arr = [];
                duration_arr['short'] = 'Short (0-4 min.)';
                duration_arr['medium'] = 'Medium (4-20 min.)';
                duration_arr['long'] = 'Long (20+ min.)';
                $.each(duration, function (index, value) {
                    duration_text_arr.push(duration_arr[value]);
                });
                var duration_text = (duration_text_arr.length > 0) ? duration_text_arr.join(", ") : 'All';

                var clipped_arr = [];
                var clipped_text_arr = [];
                clipped_arr[1] = 'Original Entries';
                clipped_arr[0] = 'Clipped Entries';
                $.each(clipped, function (index, value) {
                    clipped_text_arr.push(clipped_arr[value]);
                });
                var clipped_text = (clipped_text_arr.length > 0) ? clipped_text_arr.join(", ") : 'All';

                var ac_text_arr = [];
                $.each(ac, function (index, value) {
                    if ($.inArray(value.id.toString(), ac_filter) != -1) {
                        ac_text_arr.push(value.name);
                    }
                });
                var ac_text = (ac_text_arr.length > 0) ? '<div class="mediatype"><b>Access Control Profiles: </b>' + ac_text_arr.join(", ") + '</div>' : '';

                var flavors_text_arr = [];
                $.each(flavors, function (index, value) {
                    if ($.inArray(value.id.toString(), flavors_filter) != -1) {
                        flavors_text_arr.push(value.name);
                    }
                });
                var flavors_text = (flavors_text_arr.length > 0) ? '<div class="mediatype"><b>Flavors: </b>' + flavors_text_arr.join(", ") + '</div>' : '';

                var cat_text_arr = [];
                $.each(categories_data, function (index, value) {
                    if ($.inArray(value.id.toString(), categoryIDs) != -1) {
                        cat_text_arr.push(value.name);
                    }
                });
                var cat_text = (cat_text_arr.length > 0) ? '<div class="mediatype"><b>Categories: </b>' + cat_text_arr.join(", ") + '</div>' : '';

                var rule_order = (order == '-recent') ? 'Most Recent' : (order == '-plays') ? 'Most Played' : (order == '-rank') ? 'Highest Rated' : (order == '+name') ? 'Entry Name' : '';

                var rule = '<div class="rule-wrapper" data-rulenum="' + rule_num + '" data-categories="' + categories_id + '" data-mediatypes="' + mediaTypes_id + '" data-durations="' + durations + '" data-clipped="' + clipped_id + '" data-ac="' + ac_id + '" data-flavors="' + flavors_id + '" data-ruleduration="' + rule_duration + '" data-count="' + rule_count + '">' +
                        '<div class="mediatype-wrapper">' +
                        '<div class="mediatype"><b>Media Type: </b>' + mediaTypes_text + '</div>' +
                        '<div class="mediatype"><b>Duration: </b>' + duration_text + '</div>' +
                        '<div class="mediatype"><b>Original & Clipped Entries: </b>' + clipped_text + '</div>' +
                        ac_text +
                        flavors_text +
                        cat_text +
                        '</div>' +
                        '<div class="orderby-wrapper">' + rule_order + '</div>' +
                        '<div class="limit-wrapper">' + limit + '</div>' +
                        '<div class="tools">' +
                        '<i class="fa fa-edit" onclick="smhPlaylists.editRule(' + rule_num + ',\'' + categories_id + '\',\'' + mediaTypes_id + '\',\'' + durations + '\',\'' + clipped_id + '\',\'' + ac_id + '\',\'' + flavors_id + '\',\'' + order + '\',' + limit + ');"></i>' +
                        '<i class="fa fa-trash-o" onclick="smhPlaylists.removeAdvDND(this);"></i>' +
                        '</div>' +
                        '<div class="clear"></div>' +
                        '</div>';

                $('#adv-plist-table').find('.mCustomScrollBox:first').find('.mCSB_container:first').append(rule);
                rule_num++;
            });

            var entries_count = 0;
            $('#adv-plist-table').find('.mCustomScrollBox:first').find('.mCSB_container:first div.rule-wrapper').each(function () {
                entries_count += Number($(this).attr("data-count"));
            });
            $('#advrb-entries-wrapper #entries-num').html(entries_count);

            var ruleduration = 0;
            $('#adv-plist-table').find('.mCustomScrollBox:first').find('.mCSB_container:first div.rule-wrapper').each(function () {
                ruleduration += Number($(this).attr("data-ruleduration"));
            });
            var final_duration = smhPlaylists.convertToHHMM(ruleduration);
            $('#advrb-entries-wrapper #duration').html(final_duration);

            $('#smh-modal .mediatype-wrapper').mCustomScrollbar({
                theme: "inset-dark",
                scrollButtons: {
                    enable: true
                }
            });

            $("#smh-modal #adv-plist-table .mCSB_container").sortable({
                placeholder: "advplist-hightlight",
                helper: 'clone'
            });

            $('#create-rb-plist input[type="text"]').tooltipster({
                trigger: 'custom',
                onlyOne: false,
                position: 'right'
            });

            validator = $("#create-rb-plist").validate({
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
                    playlist_name: {
                        required: true
                    }
                },
                messages: {
                    playlist_name: {
                        required: 'Please enter a name'
                    }
                }
            });
        };

        $('#smh-modal #playlist-loading img').css('display', 'inline-block');
        client.startMultiRequest();
        $.each(filters, function (index, value) {
            var totalResults = 200;
            var detailed = null;
            var rules = new Array();
            rules.push({
                'categoriesIdsMatchOr': value.categoriesIdsMatchOr,
                'mediaTypeIn': value.mediaTypeIn,
                'durationTypeMatchOr': value.durationTypeMatchOr,
                'isRoot': value.isRoot,
                'accessControlIdIn': value.accessControlIdIn,
                'flavorParamsIdsMatchOr': value.flavorParamsIdsMatchOr,
                'orderBy': value.orderBy,
                'limit': value.limit
            });
            client.playlist.executeFromFilters(cb, rules, totalResults, detailed);
        });
        client.doMultiRequest(cb);
    },
    //Updates Single Rule Based Playlist
    updateSingleRBPlist: function (id) {
        var valid = validator.form();
        if (valid) {
            var cb = function (success, results) {
                if (!success)
                    alert(results);

                if (results.code && results.message) {
                    alert(results.message);
                    return;
                }
                $('#smh-modal #loading').empty();
                $('#smh-modal #pass-result').html('<span class="label label-success">Playlist Successfully Updated!</span>');
                setTimeout(function () {
                    $('#smh-modal #pass-result').empty();
                    $('#smh-modal').modal('hide');
                }, 3000);
                smhPlaylists.getPlaylists();
            };

            var name = $('#create-manual-plist #playlist_name').val();
            var desc = $('#create-manual-plist #playlist_desc').val();
            $('#update-rb-plist').attr('disabled', '');
            $('#smh-modal #loading img').css('display', 'inline-block');
            var categories_id = categoryIDs.join();
            var mediaTypes_id = mediaTypes.join();
            var durations = duration.join();
            var clipped_id = clipped.join();
            var ac_id = ac_filter.join();
            var flavors_id = flavors_filter.join();
            var updateStats;
            var playlist = new KalturaPlaylist();
            playlist.name = name;
            playlist.description = desc;
            playlist.playlistType = 10;
            playlist.totalResults = 200;
            playlist.filters = new Array();
            playlist.filters.push({
                'categoriesIdsMatchOr': categories_id,
                'mediaTypeIn': mediaTypes_id,
                'durationTypeMatchOr': durations,
                'isRoot': clipped_id,
                'accessControlIdIn': ac_id,
                'flavorParamsIdsMatchOr': flavors_id,
                'orderBy': order,
                'limit': limit
            });
            client.playlist.update(cb, id, playlist, updateStats);
        }
    },
    //Updates Multiple Rule Based Playlist
    updateMultiRBPlist: function (id) {
        var valid = validator.form();
        if (valid) {
            var plist_arr = [];
            $('#adv-plist-table').find('.mCustomScrollBox:first').find('.mCSB_container:first div.rule-wrapper').each(function () {
                var order = $(this).find(".orderby-wrapper").text()
                var rule_order = (order == 'Most Recent') ? '-recent' : (order == 'Most Played') ? '-plays' : (order == 'Highest Rated') ? '-rank' : (order == 'Entry Name') ? '+name' : '';
                var limit = $(this).find(".limit-wrapper").text();
                plist_arr.push({
                    'categories': $(this).attr("data-categories"),
                    'mediatypes': $(this).attr("data-mediatypes"),
                    'durations': $(this).attr("data-durations"),
                    'clipped': $(this).attr("data-clipped"),
                    'ac': $(this).attr("data-ac"),
                    'flavors': $(this).attr("data-flavors"),
                    'order': rule_order,
                    'limit': limit
                })
            });

            if (plist_arr.length > 0) {
                var cb = function (success, results) {
                    if (!success)
                        alert(results);

                    if (results.code && results.message) {
                        alert(results.message);
                        return;
                    }
                    var purgeResponse = smhPlaylists.purgeCache('playlist');
                    if (purgeResponse) {
                        $('#smh-modal #loading').empty();
                        $('#smh-modal #pass-result').html('<span class="label label-success">Playlist Successfully Updated!</span>');
                    } else {
                        $('#smh-modal #loading').empty();
                        $('#smh-modal #pass-result').html('<span class="label label-danger">Error: Could not purge cache</span>');
                    }
                    setTimeout(function () {
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    }, 3000);
                    smhPlaylists.getPlaylists();
                };

                var name = $('#create-rb-plist #playlist_name').val();
                var desc = $('#create-rb-plist #playlist_desc').val();
                $('#update-rb-plist').attr('disabled', '');
                $('#smh-modal #loading img').css('display', 'inline-block');
                var updateStats;
                var playlist = new KalturaPlaylist();
                playlist.name = name;
                playlist.description = desc;
                playlist.playlistType = 10;
                playlist.totalResults = 200;
                playlist.filters = new Array();
                $.each(plist_arr, function (index, value) {
                    playlist.filters.push({
                        'categoriesIdsMatchOr': value.categories,
                        'mediaTypeIn': value.mediatypes,
                        'durationTypeMatchOr': value.durations,
                        'isRoot': value.clipped,
                        'accessControlIdIn': value.ac,
                        'flavorParamsIdsMatchOr': value.flavors,
                        'orderBy': value.order,
                        'limit': value.limit
                    });
                });
                client.playlist.update(cb, id, playlist, updateStats);
            } else {
                smhPlaylists.noPlist();
            }
        }
    },
    //Edit Manual Playlist Modal
    editManualPlaylist: function (id, name, desc) {
        smhMain.resetModal();
        smhPlaylists.resetFilters();
        smhPlaylists.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width', '985px');
        $('#smh-modal .modal-body').css('height', '600px');
        $('#smh-modal .modal-body').css('padding', '0');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        header = '<button type="button" class="close smh-close mplist-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Manual Playlist</h4>';
        $('#smh-modal .modal-header').html(header);

        var tree = smhPlaylists.json_tree(categories, 'cat');
        var tree_ac = smhPlaylists.json_tree(ac, 'ac');
        var tree_flavors = smhPlaylists.json_tree(flavors, 'flavors');

        content = '<div class="playlist-content">' +
                '<div class="header ls-header">' +
                '<div id="playlist-fields-wrapper">' +
                '<form id="create-manual-plist" action="">' +
                '<table width="98%" border="0" id="playlist-fields">' +
                '<tr><td><span style="font-weight: normal;" class="required">Name:</span></td><td style="width: 89%;"><input type="text" placeholder="Enter a name" class="form-control" id="playlist_name" name="playlist_name" value="' + name + '"></td></tr>' +
                '<tr><td><span style="font-weight: normal;">Description:</span></td><td><input type="text" placeholder="Enter a description" class="form-control" id="playlist_desc" name="playlist_desc" value="' + desc + '"></td></tr>' +
                '</table>' +
                '</form>' +
                '</div>' +
                '</div>' +
                '<div id="entries-wrapper">' +
                '<div class="header rs-header">' +
                '<div style="margin-top: 6px; margin-bottom: 5px; text-align: left;">Entries</div>' +
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
                '<div id="entries">' +
                '<div id="plist-table"></div>' +
                '</div>' +
                '</div>' +
                '<div id="playlist-wrapper">' +
                '<div class="header" style="text-align: left;">' +
                'Playlist' +
                '<div style="text-align: right; font-size: 12px; color: #868991; margin-bottom: 6px;"><div style="display: inline-block; position: relative; right: -58px;"><div id="loading"><img height="20px" src="/img/loading.gif"></div></div><div style="display: inline-block; position: relative; right: 168px;">Drag And Drop Your Entries Below</div><div id="drag-drop-icon"><i class="fa fa-arrow-down"></i></div><div id="drag-drop-elip"><i class="fa fa-ellipsis-h"></i></div><div id="drag-drop-icon"><i class="fa fa-arrows"></i></div></div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<div id="plist-entries"></div>' +
                '<div class="clear"></div>' +
                '<div id="playlist-info">' +
                '<div id="entries-num-wrapper">Entries: <span id="entries-num">0</span></div><div id="duration-wrapper">Duration: <span id="duration">00:00</span></div>' +
                '</div>' +
                '</div>' +
                '</div>';

        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default mplist-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="update-manual-plist" onclick="smhPlaylists.updateManualPlist(\'' + id + '\')">Update</button>';
        $('#smh-modal .modal-footer').html(footer);

        $('#plist-entries').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });

        $('#tree1').on('change', ".cat_all", function () {
            if ($(this).is(":checked")) {
                $('.cat-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            categoryIDs = [];
            smhPlaylists.loadEntries_manual_plist();
        });
        $('#tree1').on('click', ".cat_list", function () {
            setTimeout(function () {
                var anyBoxesChecked = false;
                categoryIDs = [];
                $('.cat-filter input[type="checkbox"]').each(function () {
                    if ($(this).is(":checked")) {
                        anyBoxesChecked = true;
                        var checkbox_value = $(this).val();
                        categoryIDs.push(checkbox_value);
                    }
                });
                if (anyBoxesChecked == true) {
                    $('.cat_all').prop('checked', false);
                } else {
                    $('.cat_all').prop('checked', true);
                }
            }, 50);
            setTimeout(function () {
                smhPlaylists.loadEntries_manual_plist();
            }, 100);
        });

        $('#tree2').on('change', ".media_all", function () {
            if ($(this).is(":checked")) {
                $('.media-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            mediaTypes = [];
            smhPlaylists.loadEntries_manual_plist();
        });
        $('#tree2').on('click', ".media_list", function () {
            var anyBoxesChecked = false;
            mediaTypes = [];
            $('.media-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    mediaTypes.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('.media_all').prop('checked', false);
            } else {
                $('.media_all').prop('checked', true);
            }
            smhPlaylists.loadEntries_manual_plist();
        });

        $('#tree2').on('change', ".durations_all", function () {
            if ($(this).is(":checked")) {
                $('.duration-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            duration = [];
            smhPlaylists.loadEntries_manual_plist();
        });
        $('#tree2').on('click', ".duration_list", function () {
            var anyBoxesChecked = false;
            duration = [];
            $('.duration-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    duration.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('.durations_all').prop('checked', false);
            } else {
                $('.durations_all').prop('checked', true);
            }
            smhPlaylists.loadEntries_manual_plist();
        });

        $('#tree2').on('change', ".clipped_all", function () {
            if ($(this).is(":checked")) {
                $('.clipped-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            clipped = [];
            smhPlaylists.loadEntries_manual_plist();
        });
        $('#tree2').on('click', ".clipped_list", function () {
            var anyBoxesChecked = false;
            clipped = [];
            $('.clipped-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    clipped.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('.clipped_all').prop('checked', false);
            } else {
                $('.clipped_all').prop('checked', true);
            }
            smhPlaylists.loadEntries_manual_plist();
        });

        $('#tree2').on('change', ".ac_all", function () {
            if ($(this).is(":checked")) {
                $('.ac-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            ac_filter = [];
            smhPlaylists.loadEntries_manual_plist();
        });
        $('#tree2').on('click', ".ac_list", function () {
            var anyBoxesChecked = false;
            ac_filter = [];
            $('.ac-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    ac_filter.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('.ac_all').prop('checked', false);
            } else {
                $('.ac_all').prop('checked', true);
            }
            smhPlaylists.loadEntries_manual_plist();
        });

        $('#tree2').on('change', ".flavors_all", function () {
            if ($(this).is(":checked")) {
                $('.flavors-filter input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            } else {
                $(this).prop('checked', true);
            }
            flavors_filter = [];
            smhPlaylists.loadEntries_manual_plist();
        });
        $('#tree2').on('click', ".flavors_list", function () {
            var anyBoxesChecked = false;
            flavors_filter = [];
            $('.flavors-filter input[type="checkbox"]').each(function () {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                    var checkbox_value = $(this).val();
                    flavors_filter.push(checkbox_value);
                }
            });
            if (anyBoxesChecked == true) {
                $('.flavors_all').prop('checked', false);
            } else {
                $('.flavors_all').prop('checked', true);
            }
            smhPlaylists.loadEntries_manual_plist();
        });

        // Collapse accordion every time dropdown is shown
        $('.dropdown-accordion').on('show.bs.dropdown', function (event) {
            var accordion = $(this).find($(this).data('accordion'));
            accordion.find('.panel-collapse.in').collapse('hide');
        });

        // Prevent dropdown to be closed when we click on an accordion link
        $('.dropdown-accordion').on('click', 'a[data-toggle="collapse"]', function (event) {
            event.preventDefault();
            event.stopPropagation();
            $($(this).data('parent')).find('.panel-collapse.in').collapse('hide');
            $($(this).attr('href')).collapse('show');
        });

        $('.dropdown-accordion').on('click', '.panel-body', function (event) {
            event.stopPropagation();
        });

        $('#tree1').tree({
            collapseDuration: 100,
            expandDuration: 100,
            onCheck: {
                ancestors: null
            }
        });

        $('#tree2').tree({
            collapseDuration: 100,
            expandDuration: 100,
            onCheck: {
                ancestors: null
            }
        });

        $('#entries-wrapper .panel-body').mCustomScrollbar({
            theme: "inset-dark",
            scrollButtons: {
                enable: true
            }
        });
        smhPlaylists.loadEntries_manual_plist();

        $('#create-manual-plist input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });

        validator = $("#create-manual-plist").validate({
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
                playlist_name: {
                    required: true
                }
            },
            messages: {
                playlist_name: {
                    required: 'Please enter a name'
                }
            }
        });

        smhPlaylists.getPlaylist(id);
    },
    //Get playlist
    getPlaylist: function (id) {
        var cb = function (success, results) {
            if (!success)
                alert(results);

            if (results.code && results.message) {
                alert(results.message);
                return;
            }
            var entries_arr = [];
            $.each(results, function (index, value) {
                var duration_data = 0;
                var duration = '';
                var mediaType = '';
                var time = smhPlaylists.convertToHHMM(value.duration);
                if (value.mediaType == '1' || value.mediaType == '5') {
                    duration_data = value.duration;
                    if (time.length == 5) {
                        duration = "<div class='videos-num'>" + time + "</div>";
                    } else if (time.length == 8) {
                        duration = "<div class='videos-num-long'>" + time + "</div>";
                    }
                }

                if (value.mediaType == '1') {
                    mediaType = 'Video';
                } else if (value.mediaType == '2') {
                    mediaType = 'Image';
                } else if (value.mediaType == '201' || value.mediaType == '202' || value.mediaType == '203' || value.mediaType == '204' || value.mediaType == '100' || value.mediaType == '101') {
                    mediaType = 'Live Stream';
                } else if (value.mediaType == '5') {
                    mediaType = 'Audio';
                }

                var theDate = new Date(value.createdAt * 1000);
                var newDatetime = theDate.toString("MM/dd/yyyy hh:mm tt");
                var entry_name = smhPlaylists.stripslashes(value.name);
                if (entry_name.length > 44) {
                    entry_name = entry_name.substr(0, 44) + "...";
                }

                var entry_container = "<div class='entry-wrapper ui-draggable hover' data-entryid='" + value.id + "' data-duration='" + duration_data + "'>" +
                        "<div class='entry-thumbnail'>" +
                        "<img src='/p/" + value.partnerId + "/thumbnail/entry_id/" + value.id + "/quality/100/type/1/width/300/height/90' width='100' height='68'>" +
                        "</div>" +
                        "<div class='entry-details'>" +
                        "<div class='entry-name'>" +
                        "<div>" + entry_name + "</div>" +
                        "</div>" +
                        "<div class='entry-subdetails'>" +
                        "<span style='width: 85px; display: inline-block;'>Entry ID:</span><span>" + value.id + "</span>" +
                        "</div>" +
                        "<div class='entry-subdetails'>" +
                        "<span style='width: 85px; display: inline-block;'>Created on:</span><span>" + newDatetime + "</span>" +
                        "</div>" +
                        "<div class='entry-subdetails'>" +
                        "<span style='width: 85px; display: inline-block;'>Type:</span><span>" + mediaType + " " + duration + "</span>" +
                        "</div>" +
                        "</div>" +
                        "<div class='tools' onclick='smhPlaylists.removeDND(this);'>" +
                        "<i class='fa fa-trash-o'></i>" +
                        "</div>" +
                        "<div class='clear'></div>" +
                        "</div>";
                entries_arr.push(entry_container);
            });
            $.each(entries_arr, function (index, value) {
                $('#plist-entries .mCSB_container').append(value);
            });
            $('#playlist-wrapper #loading img').css('display', '');

            $('#playlist-info #entries-num').html($('#plist-entries .mCSB_container div.entry-wrapper').length);
            var duration = 0;
            $('#plist-entries .mCSB_container div.entry-wrapper').each(function () {
                duration += Number($(this).attr("data-duration"));
            });
            var final_duration = smhPlaylists.convertToHHMM(duration);
            $('#playlist-info #duration').html(final_duration);
        };
        $('#playlist-wrapper #loading img').css('display', 'inline-block');
        var detailed = null;
        var playlistContext = null;
        var filter = null;
        client.playlist.execute(cb, id, detailed, playlistContext, filter);
    },
    //Strip slashes
    stripslashes: function (str) {
        return (str + '')
                .replace(/\\(.?)/g, function (s, n1) {
                    switch (n1) {
                        case '\\':
                            return '\\';
                        case '0':
                            return '\u0000';
                        case '':
                            return '';
                        default:
                            return n1;
                    }
                });
    },
    //Export Metadata
    exportMetaData: function () {
        if (total_entries) {
            window.location = '/apps/platform/metadata/export.metadata.php?pid=' + sessInfo.pid + '&ks=' + sessInfo.ks + '&page_size=' + total_entries + '&action=export_plist_metadata';
        }
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
        $('#smh-modal').on('click', '.mplist-close', function () {
            $('#create-manual-plist input').tooltipster('destroy');
        });
        $('#smh-modal').on('click', '.rbplist-close', function () {
            $('#create-rb-plist input').tooltipster('destroy');
        });
        $('#smh-modal2').on('click', '.smh-close2', function () {
            $('#smh-modal').css('z-index', '');
            $('#smh-modal2').on('hidden.bs.modal', function (e) {
                $('body').addClass('modal-open');
            });
        });
        $('#smh-modal3').on('click', '.smh-close', function () {
            $('#smh-modal3').on('hidden.bs.modal', function (e) {
                smhPlaylists.resetPreviewModal();
            });
        });
    }
}

// Main on ready
$(document).ready(function () {
    smhPlaylists = new Playlists();
    smhPlaylists.getPlaylists();
    smhPlaylists.registerActions();
    smhPlaylists.getUiConfs();
    smhPlaylists.getCats();
    smhPlaylists.getAccessControlProfiles();
    smhPlaylists.getFlavors();
});
