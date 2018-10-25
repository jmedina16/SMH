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
var graph1, count_plays, pageSize, days_glbl, days_from_today_glbl;
var graph_entryId = null;

//Login prototype/class
Stats.prototype = {
    constructor: Stats,
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
                graphData = smhStats.formatDateRange(count_plays);
            } else if (count_plays == null || count_plays == '') {
                dataString = from + '00,0;' + to + '00,0;';
                count_plays = dataString;
                graphData = smhStats.formatDateRange(count_plays);
            }

            preGraphData = smhStats.generalDate(graphData, days, days_from_today);
            data = smhStats.formatLineData(preGraphData);
            graph1.options.labels = [label];
            graph1.setData(data);
            $('#graph-loading1').empty();

        };
        days_glbl = days;
        days_from_today_glbl = days_from_today;
        var dimension = 'count_plays';
        var objectId = graph_entryId;
        var reportType = KalturaReportType.LIVE;
        var offset = smhStats.getOffset();
        var reportInputFilter = new KalturaReportInputFilter();
        reportInputFilter.fromDay = from;
        reportInputFilter.toDay = to;
        reportInputFilter.searchInTags = true;
        reportInputFilter.searchInAdminTags = true;
        reportInputFilter.timeZoneOffset = offset;
        client.report.getGraphs(cb, reportType, reportInputFilter, dimension, objectId);
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

            $('#plays').html(smhStats.format(count_plays));

        };

        var objectId = graph_entryId;
        var offset = smhStats.getOffset();
        var reportType = KalturaReportType.LIVE;
        var reportInputFilter = new KalturaReportInputFilter();
        reportInputFilter.fromDay = from;
        reportInputFilter.toDay = to;
        reportInputFilter.searchInTags = true;
        reportInputFilter.searchInAdminTags = true;
        reportInputFilter.timeZoneOffset = offset;
        client.report.getTotal(cb, reportType, reportInputFilter, objectId);
    },
    //Gets table data
    getTabelData: function (from, to) {
        var timezone = jstz.determine();
        var tz = timezone.name();
        var offset = smhStats.getOffset();
        $('#live-dataTable').empty();
        $('#live-dataTable').html('<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="live-data"></table>');
        liveTable = $('#live-data').DataTable({
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
                        "table": "live",
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
                "zeroRecords": "No Live Streams Found"
            },
            "columns": [
                {
                    "title": "<span style='float: left;'>Video</span>",
                    "width": "50%"
                },
                {
                    "title": "<span style='float: left;'>Plays</span>",
                    "width": "50%"
                }
            ],
            "drawCallback": function (oSettings) {
                smhMain.fcmcAddRows(this, 2, 10);
            }
        });
    },
    //Display table again
    returnTable: function () {
        $('#table-header').html('<h2 class="page-header">Details</h2>');
        $('#table-body').html('<div id="live-dataTable"></div>');
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
        smhStats.getGraphData(days_from_today, from, to, days);
        smhStats.getTotalPlays(from, to);
        smhStats.getTabelData(from, to);
    },
    //Display video details
    liveDetail: function (id, name, desc, tags, date) {
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
        $('#table-header').html('<div class="row">' +
                '<div class="col-md-3 col-sm-6 col-xs-12">' +
                '<div class="pull-left"><button onclick="smhStats.returnTable();" class="btn btn-block bg-olive pull-right"><i class="fa fa-reply"></i> View All Entries</button></div>' +
                '</div>' +
                '</div>');
        $('#table-body').html('</div>' +
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
                '</div>');
        player_prev_gen = smhStats.generateEmbed(uiconf_id, entryId, width, height, 'https', delivery, embed, seo, name, true, sizing, ratio);
        player_prev = player_prev_gen.getCode();
        smhStats.generateThumbIframe(player_prev);

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
        smhStats.getGraphData(days_from_today, from, to, days);
        smhStats.getTotalPlays(from, to);
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
        smhStats.getGraphData(days_from_today, from, to, days);
        smhStats.getTotalPlays(from, to);
        if (graph_entryId == null) {
            smhStats.getTabelData(from, to);
        }
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
        smhStats.getGraphData(days_from_today, from, to, days);
        smhStats.getTotalPlays(from, to);
        if (graph_entryId == null) {
            smhStats.getTabelData(from, to);
        }
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
        smhStats.getGraphData(days_from_today, from, to, days);
        smhStats.getTotalPlays(from, to);
        if (graph_entryId == null) {
            smhStats.getTabelData(from, to);
        }
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
        smhStats.getGraphData(days_from_today, from, to, days);
        smhStats.getTotalPlays(from, to);
        if (graph_entryId == null) {
            smhStats.getTabelData(from, to);
        }
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
        smhStats.getGraphData(days_from_today, from, to, days);
        smhStats.getTotalPlays(from, to);
        if (graph_entryId == null) {
            smhStats.getTabelData(from, to);
        }
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
        smhStats.getGraphData(days_from_today, from, to, days);
        smhStats.getTotalPlays(from, to);
        if (graph_entryId == null) {
            smhStats.getTabelData(from, to);
        }
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
        smhStats.getGraphData(days_from_today, from, to, days);
        smhStats.getTotalPlays(from, to);
        if (graph_entryId == null) {
            smhStats.getTabelData(from, to);
        }
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
        smhStats.getGraphData(days_from_today, from, to, days);
        smhStats.getTotalPlays(from, to);
        if (graph_entryId == null) {
            smhStats.getTabelData(from, to);
        }
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
        smhStats.getGraphData(days_from_today, from, to, days);
        smhStats.getTotalPlays(from, to);
        if (graph_entryId == null) {
            smhStats.getTabelData(from, to);
        }
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
        var offset = smhStats.getOffset();
        var reportTitle = "Live";
        var reportText = "";
        var headers = "Plays;Object Id,Entry Name,Plays";
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
    //Format number
    formatNumber: function (num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
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
    //Register actions
    registerActions: function () {
        $("#menu1 li a").click(function () {
            var selText = $(this).text();
            $(this).parents('.dropdown').find('.filter-btn').html('<span class="text">' + selText + '</span>');
        });
        $(".date-picker1").datepicker();
        $(".date-picker2").datepicker();

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
            smhStats.getGraphData(days_from_today, from, to, days);
            smhStats.getTotalPlays(from, to);
            if (graph_entryId == null) {
                smhStats.getTabelData(from, to);
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
            smhStats.getGraphData(days_from_today, from, to, days);
            smhStats.getTotalPlays(from, to);
            if (graph_entryId == null) {
                smhStats.getTabelData(from, to);
            }
        });
    }
}

// smhStats on ready
$(document).ready(function () {
    smhStats = new Stats();
    smhStats.registerActions();
    smhStats.createAreaGraphInstance('line-live-graph');
    smhStats.loadLastThirtyDaysMap();
});
