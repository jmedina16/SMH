/*
 *
 *	Streaming Media Hosting
 *	
 *	Stats
 *
 *	6-01-2015
 */
//smhStats constructor
function Stats() {}

//Global variables
var graph1, graph2, live_count_plays, count_plays, sum_time_viewed, avg_time_viewed, active_tab, active_menu, count_loads, days_glbl, days_from_today_glbl, pageSize;
var dropOff_stats = false;
var graph_entryId = null;
var bargraph_entryId = null;

//Login prototype/class
Stats.prototype = {
    constructor: Stats,
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
    //Gets graph data
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
                data = smhStats.formatBarData(totals['content_dropoff']);
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
                        graphData = smhStats.formatDateRange(count_plays);
                    } else if (count_plays == null || count_plays == '') {
                        dataString = from + '00,0;' + to + '00,0;';
                        count_plays = dataString;
                        graphData = smhStats.formatDateRange(count_plays);
                    }
                } else if (button_text == 'Minutes Viewed') {
                    label = 'Minutes';
                    if (sum_time_viewed) {
                        graphData = smhStats.formatDateRange(sum_time_viewed);
                    } else if (sum_time_viewed == null || sum_time_viewed == '') {
                        dataString = from + '00,0;' + to + '00,0;';
                        sum_time_viewed = dataString;
                        graphData = smhStats.formatDateRange(sum_time_viewed);
                    }
                } else if (button_text == 'Avg. View Time') {
                    label = 'Minutes';
                    if (avg_time_viewed) {
                        graphData = smhStats.formatDateRange(avg_time_viewed);
                    } else if (avg_time_viewed == null || avg_time_viewed == '') {
                        dataString = from + '00,0;' + to + '00,0;';
                        avg_time_viewed = dataString;
                        graphData = smhStats.formatDateRange(avg_time_viewed);
                    }
                } else if (button_text == 'Player Impressions') {
                    label = 'Impressions';
                    if (count_loads) {
                        graphData = smhStats.formatDateRange(count_loads);
                    } else if (count_loads == null || count_loads == '') {
                        dataString = from + '00,0;' + to + '00,0;';
                        count_loads = dataString;
                        graphData = smhStats.formatDateRange(count_loads);
                    }
                }
                preGraphData = smhStats.generalDate(graphData, days, days_from_today);
                data = smhStats.formatLineData(preGraphData);
                graph1.options.labels = [label];
                graph1.setData(data);
            }

            $('#graph-loading1').empty();
            $('#graph-loading2').empty();
        };
        days_glbl = days;
        days_from_today_glbl = days_from_today;

        var reportType;
        var offset = smhStats.getOffset();
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
                    count_loads = smhStats.format(totals.count_loads);
                }
                $('#top-content #plays').html(smhStats.format(count_plays));
                $('#top-content #minutes').html(smhStats.convertToHHMM(Number(totals.sum_time_viewed)));
                $('#top-content #time').html(smhStats.convertToHHMM(Number(totals.avg_time_viewed)));
                $('#top-content #impressions').html(smhStats.format(count_loads));
                $('#top-content #ratio').html((totals.load_play_ratio * 100).toFixed(2) + '%');
                $('#top-content #drop').html((totals.avg_view_drop_off * 100).toFixed(2) + '%');
            } else {
                if (totals.count_plays_25 == '' || totals.count_plays_25 == null) {
                    count_plays_25 = 0
                } else {
                    count_plays_25 = smhStats.format(totals.count_plays_25);
                }
                if (totals.count_plays_50 == '' || totals.count_plays_50 == null) {
                    count_plays_50 = 0
                } else {
                    count_plays_50 = smhStats.format(totals.count_plays_50);
                }
                if (totals.count_plays_75 == '' || totals.count_plays_75 == null) {
                    count_plays_75 = 0
                } else {
                    count_plays_75 = smhStats.format(totals.count_plays_75);
                }
                if (totals.count_plays_100 == '' || totals.count_plays_100 == null) {
                    count_plays_100 = 0
                } else {
                    count_plays_100 = smhStats.format(totals.count_plays_100);
                }
                $('#content-dropoff #plays').html(smhStats.format(count_plays));
                $('#content-dropoff #tweentyfive').html(count_plays_25);
                $('#content-dropoff #fifty').html(count_plays_50);
                $('#content-dropoff #seventyfive').html(count_plays_75);
                $('#content-dropoff #onehundred').html(count_plays_100);
                $('#content-dropoff #ratio').html((totals.play_through_ratio * 100).toFixed(2) + '%');
            }

        };

        var offset = smhStats.getOffset();
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
    //Gets table data
    getTabelData: function (from, to, type) {
        var timezone = jstz.determine();
        var tz = timezone.name();
        var offset = smhStats.getOffset();
        if (type == 'top_content') {
            $('#topContent-dataTable').empty();
            $('#topContent-dataTable').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="data"></table>');
            contentTable = $('#data').DataTable({
                "dom": 'R<"H"lfr>t<"F"ip>',
                "order": [],
                "jQueryUI": false,
                "processing": true,
                "serverSide": true,
                "autoWidth": false,
                "pagingType": "bootstrap",
                "searching": false,
                "ordering": false,
                "info": true,
                "lengthChange": false,
                "ajax": {
                    "url": "/api/v1/player_stats/table",
                    "type": "POST",
                    "data": function (d) {
                        return $.extend({}, d, {
                            "offset": offset,
                            "from": from,
                            "to": to,
                            "table": "top_content",
                            "_token": $('meta[name="csrf-token"]').attr('content'),
                            "ks": sessInfo.ks,
                            "tz": tz
                        });
                    },
                    "dataSrc": function (json) {
                        pageSize = json['recordsTotal'];
                        return json.data
                    }
                },
                "language": {
                    "zeroRecords": "No Videos Found"
                },
                "columns": [
                    {
                        "title": "<span style='float: left;'>Video</span>"
                    },
                    {
                        "title": "<span style='float: left;'>Plays</span>"
                    },
                    {
                        "title": "<span style='float: left;'>Minutes Viewed</span>"
                    },
                    {
                        "title": "<span style='float: left;'>Avg. View Time</span>"
                    },
                    {
                        "title": "<span style='float: left;'>Player Impressions</span>"
                    },
                    {
                        "title": "<span style='float: left;'>Play to Impression Ratio</span>"
                    },
                    {
                        "title": "<span style='float: left;'>Avg. View Drop-off</span>"
                    }
                ],
                "drawCallback": function (oSettings) {
                    smhMain.fcmcAddRows(this, 7, 10);
                }
            });
        } else if (type == 'content_dropoff') {
            $('#dropoff-dataTable').empty();
            $('#dropoff-dataTable').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="dropoff-data"></table>');
            dropOffTable = $('#dropoff-data').DataTable({
                "dom": 'R<"H"lfr>t<"F"ip>',
                "order": [],
                "jQueryUI": false,
                "processing": true,
                "serverSide": true,
                "autoWidth": false,
                "pagingType": "bootstrap",
                "searching": false,
                "ordering": false,
                "info": true,
                "lengthChange": false,
                "ajax": {
                    "url": "/api/v1/player_stats/table",
                    "type": "POST",
                    "data": function (d) {
                        return $.extend({}, d, {
                            "offset": offset,
                            "from": from,
                            "to": to,
                            "table": "dropoff_content",
                            "_token": $('meta[name="csrf-token"]').attr('content'),
                            "ks": sessInfo.ks,
                            "tz": tz
                        });
                    },
                    "dataSrc": function (json) {
                        pageSize = json['recordsTotal'];
                        return json.data
                    }
                },
                "language": {
                    "zeroRecords": "No Videos Found"
                },
                "columns": [
                    {
                        "title": "<span style='float: left;'>Video</span>"
                    },
                    {
                        "title": "<span style='float: left;'>Plays</span>"
                    },
                    {
                        "title": "<span style='float: left;'>25% Play-through</span>"
                    },
                    {
                        "title": "<span style='float: left;'>50% Play-through</span>"
                    },
                    {
                        "title": "<span style='float: left;'>75% Play-through</span>"
                    },
                    {
                        "title": "<span style='float: left;'>100% Play-through</span>"
                    },
                    {
                        "title": "<span style='float: left;'>Play-through Ratio</span>"
                    }
                ],
                "drawCallback": function (oSettings) {
                    smhMain.fcmcAddRows(this, 7, 10);
                }
            });
        }
    },
    //Display table again
    returnTableTopContent: function () {
        $('#top-content #table-header').html('<h2 class="page-header">Details</h2>');
        $('#top-content #table-body').html('<div id="topContent-dataTable"></div>');
        var date1 = $('#date-picker-1').val();
        var date2 = $('#date-picker-2').val();
        var split1 = date1.split("/");
        var split2 = date2.split("/");
        var from = split1[2] + split1[0] + split1[1];
        var to = split2[2] + split2[0] + split2[1];
        var diff = new TimeSpan(Date.parseExact(date2, "MM/dd/yyyy") - Date.parseExact(date1, "MM/dd/yyyy"));
        var days = diff.days;
        var diff2 = new TimeSpan(Date.today() - Date.parseExact(date1, "MM/dd/yyyy"));
        var days_from_today = diff2.days;
        graph_entryId = null;
        smhStats.getGraphData(days_from_today, from, to, days, 'top_content', 'count_plays', null);
        smhStats.getTotalPlays(from, to, 'top_content', null);
        smhStats.getTabelData(from, to, 'top_content');
    },
    //Display table again
    returnTableDropOff: function () {
        $('#content-dropoff #table-header').html('<h2 class="page-header">Details</h2>');
        $('#content-dropoff #table-body').html('<div id="dropoff-dataTable"></div>');
        var date1 = $('#date-picker-3').val();
        var date2 = $('#date-picker-4').val();
        var split1 = date1.split("/");
        var split2 = date2.split("/");
        var from = split1[2] + split1[0] + split1[1];
        var to = split2[2] + split2[0] + split2[1];
        var diff = new TimeSpan(Date.parseExact(date2, "MM/dd/yyyy") - Date.parseExact(date1, "MM/dd/yyyy"));
        var days = diff.days;
        var diff2 = new TimeSpan(Date.today() - Date.parseExact(date1, "MM/dd/yyyy"));
        var days_from_today = diff2.days;
        bargraph_entryId = null;
        smhStats.getGraphData(days_from_today, from, to, days, 'content_dropoff', 'count_plays', null);
        smhStats.getTotalPlays(from, to, 'content_dropoff', null);
        smhStats.getTabelData(from, to, 'content_dropoff');
    },
    //Display video details
    videoDetailTopContent: function (id, name, desc, tags, duration, date) {
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
        $('#top-content #table-header').html('<div class="row">' +
                '<div class="col-md-3 col-sm-6 col-xs-12">' +
                '<div class="pull-left"><button onclick="smhStats.returnTableTopContent();" class="btn btn-block bg-olive pull-right"><i class="fa fa-reply"></i> View All Entries</button></div>' +
                '</div>' +
                '</div>');
        $('#top-content #table-body').html('</div>' +
                '<div class="row">' +
                '<div style="width: 455px; float: left;"><div id="thumbPreviewIframe1"></div></div>' +
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
                '</div>');
        player_prev_gen = smhStats.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
        player_prev = player_prev_gen.getCode();
        smhStats.generateThumbIframe(player_prev,1);

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
        graph_entryId = id;
        smhStats.getGraphData(days_from_today, from, to, days, 'top_content', 'count_plays', id);
        smhStats.getTotalPlays(from, to, 'top_content', id);
    },
    //Generate embed code
    generateEmbed: function (uiconf_id, entryId, width, height, protocol, streamerType, embed, seo, name, preview, sizing, aspectRatio) {
        var flashvars = {};
        flashvars.LeadHLSOnAndroid = true;

        if (preview) {
            flashvars.ks = sessInfo.ks;
        }

        var cacheSt = smhStats.getCacheSt();
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
    generateThumbIframe: function (embedCode,num) {
        $('#thumbPreviewIframe'+num).empty();
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
        $('#thumbPreviewIframe'+num).append(iframe);
        var newDoc = iframe.contentDocument;
        newDoc.open();
        newDoc.write('<!doctype html><html><head>' + style + '</head><body><div id="framePlayerContainer">' + embedCode + '</div></body></html>');
        newDoc.close();
    },
    //Display video details
    videoDetailDropOff: function (id, name, desc, tags, duration, date) {
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
        $('#content-dropoff #table-header').html('<div class="row">' +
                '<div class="col-md-3 col-sm-6 col-xs-12">' +
                '<div class="pull-left"><button onclick="smhStats.returnTableDropOff();" class="btn btn-block bg-olive pull-right"><i class="fa fa-reply"></i> View All Entries</button></div>' +
                '</div>' +
                '</div>');
        $('#content-dropoff #table-body').html('</div>' +
                '<div class="row">' +
                '<div style="width: 455px; float: left;"><div id="thumbPreviewIframe2"></div></div>' +
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
                '</div>');
        player_prev_gen = smhStats.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
        player_prev = player_prev_gen.getCode();
        smhStats.generateThumbIframe(player_prev,2);

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
        bargraph_entryId = id;
        smhStats.getGraphData(days_from_today, from, to, days, 'content_dropoff', 'count_plays', id);
        smhStats.getTotalPlays(from, to, 'content_dropoff', id);
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
            smhStats.getGraphData(days_from_today, from, to, days, reportType, dimension, graph_entryId);
            smhStats.getTotalPlays(from, to, reportType, graph_entryId);
            if (graph_entryId == null) {
                smhStats.getTabelData(from, to, reportType);
            }
        } else if (active_tab == '#content-dropoff') {
            smhStats.getGraphData(days_from_today, from, to, days, reportType, dimension, bargraph_entryId);
            smhStats.getTotalPlays(from, to, reportType, bargraph_entryId);
            if (bargraph_entryId == null) {
                smhStats.getTabelData(from, to, reportType);
            }
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
            smhStats.getGraphData(days_from_today, from, to, days, reportType, dimension, graph_entryId);
            smhStats.getTotalPlays(from, to, reportType, graph_entryId);
            if (graph_entryId == null) {
                smhStats.getTabelData(from, to, reportType);
            }
        } else if (active_tab == '#content-dropoff') {
            smhStats.getGraphData(days_from_today, from, to, days, reportType, dimension, bargraph_entryId);
            smhStats.getTotalPlays(from, to, reportType, bargraph_entryId);
            if (bargraph_entryId == null) {
                smhStats.getTabelData(from, to, reportType);
            }
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
            smhStats.getGraphData(days_from_today, from, to, days, reportType, dimension, graph_entryId);
            smhStats.getTotalPlays(from, to, reportType, graph_entryId);
            if (graph_entryId == null) {
                smhStats.getTabelData(from, to, reportType);
            }
        } else if (active_tab == '#content-dropoff') {
            smhStats.getGraphData(days_from_today, from, to, days, reportType, dimension, bargraph_entryId);
            smhStats.getTotalPlays(from, to, reportType, bargraph_entryId);
            if (bargraph_entryId == null) {
                smhStats.getTabelData(from, to, reportType);
            }
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
            smhStats.getGraphData(days_from_today, from, to, days, reportType, dimension, graph_entryId);
            smhStats.getTotalPlays(from, to, reportType, graph_entryId);
            if (graph_entryId == null) {
                smhStats.getTabelData(from, to, reportType);
            }
        } else if (active_tab == '#content-dropoff') {
            smhStats.getGraphData(days_from_today, from, to, days, reportType, dimension, bargraph_entryId);
            smhStats.getTotalPlays(from, to, reportType, bargraph_entryId);
            if (bargraph_entryId == null) {
                smhStats.getTabelData(from, to, reportType);
            }
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
            smhStats.getGraphData(days_from_today, from, to, days, reportType, dimension, graph_entryId);
            smhStats.getTotalPlays(from, to, reportType, graph_entryId);
            if (graph_entryId == null) {
                smhStats.getTabelData(from, to, reportType);
            }
        } else if (active_tab == '#content-dropoff') {
            smhStats.getGraphData(days_from_today, from, to, days, reportType, dimension, bargraph_entryId);
            smhStats.getTotalPlays(from, to, reportType, bargraph_entryId);
            if (bargraph_entryId == null) {
                smhStats.getTabelData(from, to, reportType);
            }
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
            smhStats.getGraphData(days_from_today, from, to, days, reportType, dimension, graph_entryId);
            smhStats.getTotalPlays(from, to, reportType, graph_entryId);
            if (graph_entryId == null) {
                smhStats.getTabelData(from, to, reportType);
            }
        } else if (active_tab == '#content-dropoff') {
            smhStats.getGraphData(days_from_today, from, to, days, reportType, dimension, bargraph_entryId);
            smhStats.getTotalPlays(from, to, reportType, bargraph_entryId);
            if (bargraph_entryId == null) {
                smhStats.getTabelData(from, to, reportType);
            }
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
            smhStats.getGraphData(days_from_today, from, to, days, reportType, dimension, graph_entryId);
            smhStats.getTotalPlays(from, to, reportType, graph_entryId);
            if (graph_entryId == null) {
                smhStats.getTabelData(from, to, reportType);
            }
        } else if (active_tab == '#content-dropoff') {
            smhStats.getGraphData(days_from_today, from, to, days, reportType, dimension, bargraph_entryId);
            smhStats.getTotalPlays(from, to, reportType, bargraph_entryId);
            if (bargraph_entryId == null) {
                smhStats.getTabelData(from, to, reportType);
            }
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
            smhStats.getGraphData(days_from_today, from, to, days, reportType, dimension, graph_entryId);
            smhStats.getTotalPlays(from, to, reportType, graph_entryId);
            if (graph_entryId == null) {
                smhStats.getTabelData(from, to, reportType);
            }
        } else if (active_tab == '#content-dropoff') {
            smhStats.getGraphData(days_from_today, from, to, days, reportType, dimension, bargraph_entryId);
            smhStats.getTotalPlays(from, to, reportType, bargraph_entryId);
            if (bargraph_entryId == null) {
                smhStats.getTabelData(from, to, reportType);
            }
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
            smhStats.getGraphData(days_from_today, from, to, days, reportType, dimension, graph_entryId);
            smhStats.getTotalPlays(from, to, reportType, graph_entryId);
            if (graph_entryId == null) {
                smhStats.getTabelData(from, to, reportType);
            }
        } else if (active_tab == '#content-dropoff') {
            smhStats.getGraphData(days_from_today, from, to, days, reportType, dimension, bargraph_entryId);
            smhStats.getTotalPlays(from, to, reportType, bargraph_entryId);
            if (bargraph_entryId == null) {
                smhStats.getTabelData(from, to, reportType);
            }
        }
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
            offset = smhStats.getOffset();
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
            objectIds = '';
            if (graph_entryId !== null) {
                objectIds = graph_entryId;
            } else if (graph_entryId == null) {
                objectIds = null;
            }
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
            offset = smhStats.getOffset();
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
            objectIds = '';
            if (bargraph_entryId !== null) {
                objectIds = bargraph_entryId;
            } else if (bargraph_entryId == null) {
                objectIds = null;
            }
            client.report.getUrlForReportAsCsv(cb, reportTitle, reportText, headers, reportType, reportInputFilter, dimension, pager, order, objectIds);
        }
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
            if (!smhStats.inArray(data, date)) {
                data.push({
                    date: date,
                    hour: '00:00',
                    value: 0
                });
            }
        }
        return data;
    },
    //Format number
    formatNumber: function (num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    },
    //Formats line graph data
    formatLineData: function (data) {
        var formatedData = [];
        for (var index = 0; index < data.length; ++index) {
            var dateData = data[index]['date'];
            var result1 = smhStats.insert(dateData, 4, "-");
            var result2 = smhStats.insert(result1, 7, "-");
            var date = result2 + " " + data[index]['hour'];
            var value = data[index]['value'];
            formatedData.push({
                date: date,
                value: Number(value).toFixed(2)
            });
        }
        return formatedData;
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
    convertToHHMM: function (secs) {
        secs = Math.floor(secs * 60);
        var h = Math.floor(secs / 3600);
        var sh = h * 3600;
        var m = Math.floor((secs - sh) / 60);
        var sm = m * 60;
        var s = secs - sh - sm;

        return ((h < 10) && (h > 0) ? "0" + h + ':' : ((h == 0) ? "" : h + ':')) + ((m < 10) && (m > 0) ? "0" + m + ':' : ((m == 0) ? "00:" : m + ':')) + ((s < 10) && (s > 0) ? "0" + s : ((s == 0) ? "00" : s));
    },
    //Gets time offset
    getOffset: function () {
        var dt = new Date();
        var tz = dt.getTimezoneOffset();
        return tz;
    },
    //Formats user's storage
    formatStorage: function (size) {
        var storage_size = Number(size);
        if (storage_size >= 1) {
            return storage_size.toFixed(2) + " GB";
        } else {
            storage_size = storage_size * 1000;
            return storage_size.toFixed(2) + " MB";
        }
    },
    //Register actions
    registerActions: function () {
        $("#menu1 li a").click(function () {
            var selText = $(this).text();
            $(this).parents('.dropdown').find('.filter-btn').html('<span class="text">' + selText + '</span>');
        });
        $("#menu2 li a").click(function () {
            var selText = $(this).text();
            $(this).parents('.dropdown').find('.filter-btn').html('<span class="text">' + selText + '</span>');
        });
        $(".date-picker1").datepicker();
        $(".date-picker2").datepicker();
        $(".date-picker3").datepicker();
        $(".date-picker4").datepicker();

        $('.nav-tabs-custom .nav-tabs a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var target = $(e.target).attr("href") // activated tab
            active_tab = target;
            if (active_tab == '#content-dropoff') {
                if (!dropOff_stats) {
                    smhStats.createAreaGraphInstance('vod-bar-graph');
                    smhStats.loadLastThirtyDaysGraph('content_dropoff', 'count_plays', 'vod-bar');
                    dropOff_stats = true;
                }
            }
        });
        $('.nav-tabs-custom .nav-tabs a[data-toggle="tab"]:first').trigger("shown.bs.tab");

        $('#date-picker-1').change(function () {
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

            smhStats.getGraphData(days_from_today, from, to, days, 'top_content', 'count_plays', graph_entryId);
            smhStats.getTotalPlays(from, to, 'top_content', graph_entryId);
            if (graph_entryId == null) {
                smhStats.getTabelData(from, to, 'top_content');
            }
        });
        $('#date-picker-2').change(function () {
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

            smhStats.getGraphData(days_from_today, from, to, days, 'top_content', 'count_plays', graph_entryId);
            smhStats.getTotalPlays(from, to, 'top_content', graph_entryId);
            if (graph_entryId == null) {
                smhStats.getTabelData(from, to, 'top_content');
            }
        });
        $('#date-picker-3').change(function () {
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
            smhStats.getGraphData(days_from_today, from, to, days, 'content_dropoff', 'count_plays', bargraph_entryId);
            smhStats.getTotalPlays(from, to, 'content_dropoff', bargraph_entryId);
            if (bargraph_entryId == null) {
                smhStats.getTabelData(from, to, 'content_dropoff');
            }
        });
        $('#date-picker-4').change(function () {
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
            smhStats.getGraphData(days_from_today, from, to, days, 'content_dropoff', 'count_plays', bargraph_entryId);
            smhStats.getTotalPlays(from, to, 'content_dropoff', bargraph_entryId);
            if (bargraph_entryId == null) {
                smhStats.getTabelData(from, to, 'content_dropoff');
            }
        });

        $("#menu1 li a").click(function () {
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
                    graphData = smhStats.formatDateRange(count_plays);
                } else if (count_plays == null || count_plays == '') {
                    dataString = from + '00,0;' + to + '00,0;';
                    count_plays = dataString;
                    graphData = smhStats.formatDateRange(count_plays);
                }
            } else if (selText == 'Minutes Viewed') {
                label = 'Minutes';
                if (sum_time_viewed) {
                    graphData = smhStats.formatDateRange(sum_time_viewed);
                } else if (sum_time_viewed == null || sum_time_viewed == '') {
                    dataString = from + '00,0;' + to + '00,0;';
                    sum_time_viewed = dataString;
                    graphData = smhStats.formatDateRange(sum_time_viewed);
                }
            } else if (selText == 'Avg. View Time') {
                label = 'Minutes';
                if (avg_time_viewed) {
                    graphData = smhStats.formatDateRange(avg_time_viewed);
                } else if (avg_time_viewed == null || avg_time_viewed == '') {
                    dataString = from + '00,0;' + to + '00,0;';
                    avg_time_viewed = dataString;
                    graphData = smhStats.formatDateRange(avg_time_viewed);
                }
            } else if (selText == 'Player Impressions') {
                label = 'Impressions';
                if (count_loads) {
                    graphData = smhStats.formatDateRange(count_loads);
                } else if (count_loads == null || count_loads == '') {
                    dataString = from + '00,0;' + to + '00,0;';
                    count_loads = dataString;
                    graphData = smhStats.formatDateRange(count_loads);
                }
            }
            preGraphData = smhStats.generalDate(graphData, days_glbl, days_from_today_glbl);
            data = smhStats.formatLineData(preGraphData, days_glbl, days_from_today_glbl);
            graph1.options.labels = [label];
            graph1.setData(data);
            $(this).parents('.dropdown').find('.dropdown-text').html(selText);
            $('#graph-loading1').empty();
            $('#graph-loading2').empty();
        });
    }
}

// smhStats on ready
$(document).ready(function () {
    smhStats = new Stats();
    smhStats.registerActions();
    smhStats.createAreaGraphInstance('vod-line-graph');
    smhStats.loadLastThirtyDaysGraph('top_content', 'count_plays', 'vod');
});
