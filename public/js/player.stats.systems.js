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
var graph1, graph2, graph3, graph4, count_plays, sum_time_viewed, avg_time_viewed, count_loads, count_plays_platforms_bar, sum_time_viewed_platforms_bar, avg_time_viewed_platforms_bar, count_loads_platforms_bar, count_plays_os_bar, sum_time_viewed_os_bar, avg_time_viewed_os_bar, count_loads_os_bar, count_plays_browsers_bar, sum_time_viewed_browsers_bar, avg_time_viewed_browsers_bar, count_loads_browsers_bar, active_tab, active_menu, days_glbl, days_from_today_glbl, pageSize;
var os_stats = false;
var browsers_stats = false;
var platforms_entryId = null;
var platforms_available = [];
var platforms_color = [];

//Login prototype/class
Stats.prototype = {
    constructor: Stats,
    //Creates area graph instance
    createAreaGraphInstance:function(id){
        if(id == 'platforms-graph'){  
            graph1 =  Morris.Line({
                element: id,
                behaveLikeLine: true,
                xkey: 'date',
                ykeys: ['unknown'],
                labels: ['Plays'],
                hideHover: 'auto',
                pointSize: 0,
                lineColors:['gray'],
                fillOpacity: 0.4,
                smooth: true,
                resize: true,
                xLabelMargin: 50,
                parseTime: true
            }); 
        } else if(id == 'platforms-bar-graph') {
            graph2 =  Morris.Bar({
                element: id,
                xkey: 'barX',
                ykeys: ['value'],
                labels: ['Plays'],
                xLabelAngle: 60,
                hideHover: 'auto',
                barColors: ['#41817C'],
                fillOpacity: 0.4,
                resize: true
            }); 
        } else if(id == 'vod-bar-os-graph'){
            graph3 =  Morris.Bar({
                element: id,
                xkey: 'barX',
                ykeys: ['value'],
                labels: ['Plays'],
                xLabelAngle: 60,
                hideHover: 'auto',
                barColors: ['#41817C'],
                fillOpacity: 0.4,
                resize: true
            }); 
        } else if (id == 'vod-bar-browser-graph'){
            graph4 =  Morris.Bar({
                element: id,
                xkey: 'barX',
                ykeys: ['value'],
                labels: ['Plays'],
                xLabelAngle: 60,
                hideHover: 'auto',
                barColors: ['#41817C'],
                fillOpacity: 0.4,
                resize: true
            }); 
        }

    },
    //Gets graph data
    getGraphData:function(days_from_today,from,to,days,type,dimension){
        var cb = function(success, results){
            if(!success)
                alert(results);
        
            if(results.code && results.message){
                alert(results.message);
                return;
            }
            
            var dataString, graphData, preGraphData, i, label, button_text;
            var totals = {};
            var data = [];
            
            for (i = 0; i < results.length; i++) {
                totals[results[i]['id']] = results[i]['data'];
            }   
            
            if(type == 'platforms-bar') {
                button_text = $('#platforms .dropdown-text .text').text();
                count_plays_platforms_bar = totals['count_plays'];
                sum_time_viewed_platforms_bar = totals['sum_time_viewed'];
                avg_time_viewed_platforms_bar = totals['avg_time_viewed'];
                count_loads_platforms_bar = totals['count_loads'];
                if(button_text == 'Plays'){
                    label = "Plays";
                    if(count_plays_platforms_bar){
                        data = smhStats.formatBarData(count_plays_platforms_bar);
                    } else if(count_plays_platforms_bar == null || count_plays_platforms_bar == '' || count_plays_platforms_bar == undefined){
                        dataString = 'NO_DATA,0;';
                        count_plays_platforms_bar = dataString;
                        data = smhStats.formatBarData(count_plays_platforms_bar);
                    }       
                } else if(button_text == 'Minutes Viewed'){
                    label = "Minutes";
                    if(sum_time_viewed_platforms_bar){
                        data = smhStats.formatBarData(sum_time_viewed_platforms_bar);
                    } else if(sum_time_viewed_platforms_bar == null || sum_time_viewed_platforms_bar == '' || sum_time_viewed_platforms_bar == undefined){
                        dataString = 'NO_DATA,0;';
                        sum_time_viewed_platforms_bar = dataString;
                        data = smhStats.formatBarData(sum_time_viewed_platforms_bar);
                    }               
                } else if(button_text == 'Avg. View Time'){
                    label = "Minutes";
                    if(avg_time_viewed_platforms_bar){
                        data = smhStats.formatBarData(avg_time_viewed_platforms_bar);
                    } else if(avg_time_viewed_platforms_bar == null || avg_time_viewed_platforms_bar == '' || avg_time_viewed_platforms_bar == undefined){
                        dataString = 'NO_DATA,0;';
                        avg_time_viewed_platforms_bar = dataString;
                        data = smhStats.formatBarData(avg_time_viewed_platforms_bar);
                    }     
                } else if (button_text == 'Player Impressions'){
                    label = "Impressions";
                    if(count_loads_platforms_bar){
                        data = smhStats.formatBarData(count_loads_platforms_bar);
                    } else if(count_loads_platforms_bar == null || count_loads_platforms_bar == '' || count_loads_platforms_bar == undefined){
                        dataString = 'NO_DATA,0;';
                        count_loads_platforms_bar = dataString;
                        data = smhStats.formatBarData(count_loads_platforms_bar);
                    } 
                }
                graph2.options.labels = [label];
                graph2.setData(data);
                $('#graph-loading2').empty();
            } else if(type == 'platforms') {          
                label = [];            
                button_text = $('#platforms .dropdown-text .text').text();
            
                count_plays = totals.count_plays;
                sum_time_viewed = totals.sum_time_viewed;
                avg_time_viewed = totals.avg_time_viewed;
                count_loads = totals.count_loads;
                if(button_text == 'Plays'){
                    if(count_plays){
                        graphData = smhStats.formatDateRange(count_plays);
                        graph1.options.ykeys = platforms_available;
                        graph1.options.lineColors = platforms_color;
                        $.each(platforms_available,function(index,value){
                            label.push('Plays');
                        });      
                    } else if (count_plays == null || count_plays == ''){
                        dataString = from+'00,0;'+to+'00,0;';
                        count_plays = dataString;
                        graphData = smhStats.formatDateRange(count_plays);
                        label.push('Plays');
                    }                    
                } else if(button_text == 'Minutes Viewed'){
                    if(sum_time_viewed){
                        graphData = smhStats.formatDateRange(sum_time_viewed); 
                        graph1.options.ykeys = platforms_available;
                        graph1.options.lineColors = platforms_color;
                        $.each(platforms_available,function(index,value){
                            label.push('Minutes');
                        });  
                    } else if (sum_time_viewed == null || sum_time_viewed == ''){
                        dataString = from+'00,0;'+to+'00,0;';
                        sum_time_viewed = dataString;
                        graphData = smhStats.formatDateRange(sum_time_viewed);
                        label.push('Minutes');
                    }  
                } else if(button_text == 'Avg. View Time'){
                    if(avg_time_viewed){
                        graphData = smhStats.formatDateRange(avg_time_viewed); 
                        graph1.options.ykeys = platforms_available;
                        graph1.options.lineColors = platforms_color;
                        $.each(platforms_available,function(index,value){
                            label.push('Minutes');
                        }); 
                    } else if (avg_time_viewed == null || avg_time_viewed == ''){
                        dataString = from+'00,0;'+to+'00,0;';
                        avg_time_viewed = dataString;
                        graphData = smhStats.formatDateRange(avg_time_viewed);
                        label.push('Minutes');
                    }  
                } else if(button_text == 'Player Impressions'){
                    if(count_loads){
                        graphData = smhStats.formatDateRange(count_loads);
                        graph1.options.ykeys = platforms_available;
                        graph1.options.lineColors = platforms_color;
                        $.each(platforms_available,function(index,value){
                            label.push('Impressions');
                        }); 
                    } else if (count_loads == null || count_loads == ''){
                        dataString = from+'00,0;'+to+'00,0;';
                        count_loads = dataString;
                        graphData = smhStats.formatDateRange(count_loads);
                        label.push('Impressions');
                    }  
                }
                preGraphData = smhStats.generalDate(graphData,days,days_from_today);
                data = smhStats.formatLineData(preGraphData,days,days_from_today);
                graph1.options.labels = label;
                graph1.setData(data);
                $('#graph-loading1').empty();
            } else if (type == 'os'){
                button_text = $('#operating_systems .dropdown-text .text').text();
                count_plays_os_bar = totals['count_plays'];
                sum_time_viewed_os_bar = totals['sum_time_viewed'];
                avg_time_viewed_os_bar = totals['avg_time_viewed'];
                count_loads_os_bar = totals['count_loads'];
                if(button_text == 'Plays'){
                    label = "Plays";
                    if(count_plays_os_bar){
                        data = smhStats.formatBarData(count_plays_os_bar);
                    } else if(count_plays_os_bar == null || count_plays_os_bar == '' || count_plays_os_bar == undefined){
                        dataString = 'NO_DATA,0;';
                        count_plays_os_bar = dataString;
                        data = smhStats.formatBarData(count_plays_os_bar);
                    }       
                } else if(button_text == 'Minutes Viewed'){
                    label = "Minutes";
                    if(sum_time_viewed_os_bar){
                        data = smhStats.formatBarData(sum_time_viewed_os_bar);
                    } else if(sum_time_viewed_os_bar == null || sum_time_viewed_os_bar == '' || sum_time_viewed_os_bar == undefined){
                        dataString = 'NO_DATA,0;';
                        sum_time_viewed_os_bar = dataString;
                        data = smhStats.formatBarData(sum_time_viewed_os_bar);
                    }               
                } else if(button_text == 'Avg. View Time'){
                    label = "Minutes";
                    if(avg_time_viewed_os_bar){
                        data = smhStats.formatBarData(avg_time_viewed_os_bar);
                    } else if(avg_time_viewed_os_bar == null || avg_time_viewed_os_bar == '' || avg_time_viewed_os_bar == undefined){
                        dataString = 'NO_DATA,0;';
                        avg_time_viewed_os_bar = dataString;
                        data = smhStats.formatBarData(avg_time_viewed_os_bar);
                    }     
                } else if (button_text == 'Player Impressions'){
                    label = "Impressions";
                    if(count_loads_os_bar){
                        data = smhStats.formatBarData(count_loads_os_bar);
                    } else if(count_loads_os_bar == null || count_loads_os_bar == '' || count_loads_os_bar == undefined){
                        dataString = 'NO_DATA,0;';
                        count_loads_os_bar = dataString;
                        data = smhStats.formatBarData(count_loads_os_bar);
                    } 
                }
                graph3.options.labels = [label];
                graph3.setData(data);
                $('#graph-loading3').empty();
            } else if (type == 'browser'){
                button_text = $('#browsers .dropdown-text .text').text();
                count_plays_browsers_bar = totals['count_plays'];
                sum_time_viewed_browsers_bar = totals['sum_time_viewed'];
                avg_time_viewed_browsers_bar = totals['avg_time_viewed'];
                count_loads_browsers_bar = totals['count_loads'];
                if(button_text == 'Plays'){
                    label = "Plays";
                    if(count_plays_browsers_bar){
                        data = smhStats.formatBarData(count_plays_browsers_bar);
                    } else if(count_plays_browsers_bar == null || count_plays_browsers_bar == '' || count_plays_browsers_bar == undefined){
                        dataString = 'NO_DATA,0;';
                        count_plays_browsers_bar = dataString;
                        data = smhStats.formatBarData(count_plays_browsers_bar);
                    }       
                } else if(button_text == 'Minutes Viewed'){
                    label = "Minutes";
                    if(sum_time_viewed_browsers_bar){
                        data = smhStats.formatBarData(sum_time_viewed_browsers_bar);
                    } else if(sum_time_viewed_browsers_bar == null || sum_time_viewed_browsers_bar == '' || sum_time_viewed_browsers_bar == undefined){
                        dataString = 'NO_DATA,0;';
                        sum_time_viewed_browsers_bar = dataString;
                        data = smhStats.formatBarData(sum_time_viewed_browsers_bar);
                    }               
                } else if(button_text == 'Avg. View Time'){
                    label = "Minutes";
                    if(avg_time_viewed_browsers_bar){
                        data = smhStats.formatBarData(avg_time_viewed_browsers_bar);
                    } else if(avg_time_viewed_browsers_bar == null || avg_time_viewed_browsers_bar == '' || avg_time_viewed_browsers_bar == undefined){
                        dataString = 'NO_DATA,0;';
                        avg_time_viewed_browsers_bar = dataString;
                        data = smhStats.formatBarData(avg_time_viewed_browsers_bar);
                    }     
                } else if (button_text == 'Player Impressions'){
                    label = "Impressions";
                    if(count_loads_browsers_bar){
                        data = smhStats.formatBarData(count_loads_browsers_bar);
                    } else if(count_loads_browsers_bar == null || count_loads_browsers_bar == '' || count_loads_browsers_bar == undefined){
                        dataString = 'NO_DATA,0;';
                        count_loads_browsers_bar = dataString;
                        data = smhStats.formatBarData(count_loads_browsers_bar);
                    } 
                }
                graph4.options.labels = [label];
                graph4.setData(data);
                $('#graph-loading4').empty();
            }
        };
        days_glbl = days; 
        days_from_today_glbl = days_from_today;
        
        var objectId = null;
        if(active_tab == '#platforms'){
            objectId = platforms_entryId;
        }
        
        var reportType;
        var offset = smhStats.getOffset();
        if(type == 'platforms'){
            $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
            reportType = KalturaReportType.PLATFORMS;      
        } else if(type == 'platforms-bar') {
            $('#graph-loading2').html('<img src="/img/chart-loading.gif" height="20px" />');
            reportType = KalturaReportType.PLATFORMS;
        } else if(type == 'os') {
            $('#graph-loading3').html('<img src="/img/chart-loading.gif" height="20px" />');
            reportType = KalturaReportType.OPERATION_SYSTEM;
        } else if(type == 'browser') {
            $('#graph-loading4').html('<img src="/img/chart-loading.gif" height="20px" />');
            reportType = KalturaReportType.BROWSERS;
        }      
        var reportInputFilter = new KalturaReportInputFilter();
        reportInputFilter.fromDay = from;
        reportInputFilter.toDay = to;     
        reportInputFilter.searchInTags = true;
        reportInputFilter.searchInAdminTags = true;
        reportInputFilter.timeZoneOffset = offset;
        client.report.getGraphs(cb, reportType, reportInputFilter, dimension, objectId);
    },
    //Gets total plays
    getTotalPlays:function(from,to,type){
        var cb = function(success, results){
            if(!success)
                alert(results);
        
            if(results.code && results.message){
                alert(results.message);
                return;
            }
            
            var i, count_plays, count_loads;
            var headers = results.header.split(",");
            var data = results.data.split(",");
            var totals = {};
                       
            for (i = 0; i < headers.length; i++) {
                totals[headers[i]] = data[i];
            }
            
            if(totals.count_plays == '' || totals.count_plays == null){
                count_plays = 0
            } else {
                count_plays = totals.count_plays;
            }
            
            if (type == 'platforms' || type == 'platforms-bar') {
                if(totals.count_loads == '' || totals.count_loads == null){
                    count_loads = 0
                } else {
                    count_loads = smhStats.format(totals.count_loads);
                }
                $('#platforms #plays').html(smhStats.format(count_plays));
                $('#platforms #minutes').html(smhStats.convertToHHMM(Number(totals.sum_time_viewed)));
                $('#platforms #time').html(smhStats.convertToHHMM(Number(totals.avg_time_viewed)));
                $('#platforms #impressions').html(smhStats.format(count_loads));
                $('#platforms #ratio').html((totals.load_play_ratio*100).toFixed(2)+'%');
                $('#platforms #drop').html((totals.avg_view_drop_off*100).toFixed(2)+'%');
            } else if (type == 'os'){
                if(totals.count_loads == '' || totals.count_loads == null){
                    count_loads = 0
                } else {
                    count_loads = smhStats.format(totals.count_loads);
                }
                $('#operating_systems #plays').html(smhStats.format(count_plays));
                $('#operating_systems #minutes').html(smhStats.convertToHHMM(Number(totals.sum_time_viewed)));
                $('#operating_systems #time').html(smhStats.convertToHHMM(Number(totals.avg_time_viewed)));
                $('#operating_systems #impressions').html(smhStats.format(count_loads));
                $('#operating_systems #ratio').html((totals.load_play_ratio*100).toFixed(2)+'%');
                $('#operating_systems #drop').html((totals.avg_view_drop_off*100).toFixed(2)+'%');
            } else if (type == 'browser'){
                if(totals.count_loads == '' || totals.count_loads == null){
                    count_loads = 0
                } else {
                    count_loads = smhStats.format(totals.count_loads);
                }
                $('#browsers #plays').html(smhStats.format(count_plays));
                $('#browsers #minutes').html(smhStats.convertToHHMM(Number(totals.sum_time_viewed)));
                $('#browsers #time').html(smhStats.convertToHHMM(Number(totals.avg_time_viewed)));
                $('#browsers #impressions').html(smhStats.format(count_loads));
                $('#browsers #ratio').html((totals.load_play_ratio*100).toFixed(2)+'%');
                $('#browsers #drop').html((totals.avg_view_drop_off*100).toFixed(2)+'%');
            }        
        };
        var offset = smhStats.getOffset();
        var reportType;
        if (type == 'platforms') {
            reportType = KalturaReportType.PLATFORMS;
        } else if (type == 'platforms-bar') {
            reportType = KalturaReportType.PLATFORMS;
        } else if (type == 'os') {
            reportType = KalturaReportType.OPERATION_SYSTEM;
        } else if (type == 'browser') {
            reportType = KalturaReportType.BROWSERS;
        }
        
        var objectId = null;
        if(active_tab == '#platforms'){
            objectId = platforms_entryId;
        }

        var reportInputFilter = new KalturaReportInputFilter();
        reportInputFilter.fromDay = from;
        reportInputFilter.toDay = to;
        reportInputFilter.searchInTags = true;
        reportInputFilter.searchInAdminTags = true;
        reportInputFilter.timeZoneOffset = offset;
        client.report.getTotal(cb, reportType, reportInputFilter, objectId);  
    },
    //Gets table data
    getTabelData:function(from,to,type){
        var objectId = null;
        if(active_tab == '#platforms'){
            objectId = platforms_entryId;
        }
        var timezone = jstz.determine();
        var tz = timezone.name();
        var offset = smhStats.getOffset();            
        if (type == 'platforms') {                              
            $('#platforms-dataTable').empty();
            $('#platforms-dataTable').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="platforms-data"></table>');            
            platformsTable = $('#platforms-data').DataTable({
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
                    "data": function ( d ) {                    
                        return $.extend( {}, d, {
                            "offset": offset,
                            "from": from,
                            "to": to,
                            "table": "platforms",
                            "_token": $('meta[name="csrf-token"]').attr('content'),
                            "ks": sessInfo.ks,
                            "tz": tz
                        } );
                    },
                    "dataSrc": function ( json ) {
                        pageSize = json['recordsTotal'];
                        return json.data 
                    }
                },
                "language": {
                    "zeroRecords": "No Platforms Found"
                },
                "columns": [
                {
                    "title": "<span style='float: left;'>Platform</span>"
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
                "drawCallback": function( oSettings ) {
                    smhMain.fcmcAddRows(this, 7, 10);             
                }                                
            });
        } else if (type == 'platforms-bar') {            
            $('#platforms-dataTable').empty();
            $('#platforms-dataTable').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="platforms-data"></table>');             
            platformsBarTable = $('#platforms-data').DataTable({
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
                    "data": function ( d ) {                    
                        return $.extend( {}, d, {
                            "offset": offset,
                            "from": from,
                            "to": to,
                            "table": "platforms_bar",
                            "_token": $('meta[name="csrf-token"]').attr('content'),
                            "ks": sessInfo.ks,
                            "tz": tz,
                            "objectId": objectId
                        } );
                    },
                    "dataSrc": function ( json ) {
                        pageSize = json['recordsTotal'];
                        return json.data 
                    }
                },
                "language": {
                    "zeroRecords": "No Operating Systems Found"
                },
                "columns": [
                {
                    "title": "<span style='float: left;'>Operating System</span>"
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
                "drawCallback": function( oSettings ) {
                    smhMain.fcmcAddRows(this, 7, 10);             
                }                                
            });
        } else if (type == 'os') {            
            $('#os-dataTable').empty();
            $('#os-dataTable').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="os-data"></table>');             
            osBarTable = $('#os-data').DataTable({
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
                    "data": function ( d ) {                    
                        return $.extend( {}, d, {
                            "offset": offset,
                            "from": from,
                            "to": to,
                            "table": "os_bar",
                            "_token": $('meta[name="csrf-token"]').attr('content'),
                            "ks": sessInfo.ks,
                            "tz": tz
                        } );
                    },
                    "dataSrc": function ( json ) {
                        pageSize = json['recordsTotal'];
                        return json.data 
                    }
                },
                "language": {
                    "zeroRecords": "No Operating Systems Found"
                },
                "columns": [
                {
                    "title": "<span style='float: left;'>Operating System</span>"
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
                "drawCallback": function( oSettings ) {
                    smhMain.fcmcAddRows(this, 7, 10);             
                }                                
            });
        } else if (type == 'browser') {            
            $('#browser-dataTable').empty();
            $('#browser-dataTable').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="browser-data"></table>');             
            browserBarTable = $('#browser-data').DataTable({
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
                    "data": function ( d ) {                    
                        return $.extend( {}, d, {
                            "offset": offset,
                            "from": from,
                            "to": to,
                            "table": "browser_bar",
                            "_token": $('meta[name="csrf-token"]').attr('content'),
                            "ks": sessInfo.ks,
                            "tz": tz
                        } );
                    },
                    "dataSrc": function ( json ) {
                        pageSize = json['recordsTotal'];
                        return json.data 
                    }
                },
                "language": {
                    "zeroRecords": "No Browsers Found"
                },
                "columns": [
                {
                    "title": "<span style='float: left;'>Browser</span>"
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
                "drawCallback": function( oSettings ) {
                    smhMain.fcmcAddRows(this, 7, 10);             
                }                                
            });
        }                 
    },
    //Display table again
    returnTablePlatforms:function(){
        var date1 = $('#date-picker-3').val();
        var date2 = $('#date-picker-4').val();
        $('#platforms #date-range-wrapper').html('<div class="col-md-10 col-sm-6 col-xs-12">'+
            '<span id="date-range" class="dropdown header">'+
            '<div class="date-range-sub">'+
            '<span id="datesrange-title">Date Range:</span>'+
            '<div class="btn-group">'+
            '<button class="btn btn-default filter-btn" type="button" style="width: 138px;"><span class="text">Last 30 days</span></button>'+
            '<button aria-expanded="true" data-toggle="dropdown" id="dropdownMenu2" type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button>'+
            '<ul aria-labelledby="dropdownMenu2" role="menu" id="menu2" class="dropdown-menu">'+
            '<li role="presentation"><a onclick="smhStats.loadYesterdayGraph(\'platforms\',\'count_plays\',\'vod\');" tabindex="-1" role="menuitem">Yesterday</a></li>'+
            '<li role="presentation"><a onclick="smhStats.loadLastSevenDaysGraph(\'platforms\',\'count_plays\',\'vod\');" tabindex="-1" role="menuitem">Last 7 days</a></li>'+
            '<li role="presentation"><a onclick="smhStats.loadThisWeekGraph(\'platforms\',\'count_plays\',\'vod\');" tabindex="-1" role="menuitem">This week</a></li>'+
            '<li role="presentation"><a onclick="smhStats.loadLastWeekGraph(\'platforms\',\'count_plays\',\'vod\');" tabindex="-1" role="menuitem">Last week</a></li>'+
            '<li role="presentation"><a onclick="smhStats.loadLastThirtyDaysGraph(,\'platforms\',\'count_plays\',\'vod\');" tabindex="-1" role="menuitem">Last 30 days</a></li>'+
            '<li role="presentation"><a onclick="smhStats.loadThisMonthGraph(\'platforms\',\'count_plays\',\'vod\');" tabindex="-1" role="menuitem">This month</a></li>'+
            '<li role="presentation"><a onclick="smhStats.loadLastMonthGraph(\'platforms\',\'count_plays\',\'vod\');" tabindex="-1" role="menuitem">Last month</a></li>'+
            '<li role="presentation"><a onclick="smhStats.loadLastTwelveMonthGraph(\'platforms\',\'count_plays\',\'vod\');" tabindex="-1" role="menuitem">Last 12 months</a></li>'+
            '<li role="presentation"><a onclick="smhStats.loadThisYearGraph(\'platforms\',\'count_plays\',\'vod\');" tabindex="-1" role="menuitem">This year</a></li>'+
            '</ul>'+
            '</div>'+
            '<span class="vertical-line">&nbsp;</span>'+
            '</div>'+
            '<div class="date-range-sub">'+
            '<span id="custom-dates">'+
            '<span id="dates-title">Dates:</span>'+
            '<div class="input-group">'+
            '<div class="input-group-addon">'+
            '<i class="fa fa-calendar"></i>'+
            '</div>'+
            '<input type="text" class="date-picker1 form-control" id="date-picker-1">'+
            '</div>'+
            '</span>'+
            '</div>'+
            '<div class="date-range-sub">'+
            '<span id="custom-dates">To'+
            '<div class="input-group" style="margin-left: 15px;">'+
            '<div class="input-group-addon">'+
            '<i class="fa fa-calendar"></i>'+
            '</div>'+
            '<input type="text" class="date-picker2 form-control" id="date-picker-2">'+
            '</div>'+
            '</span>'+
            '</div>'+
            '</span>'+
            '</div>'+
            '<div class="col-md-2 col-sm-6 col-xs-12">'+
            '<div class="pull-right" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhStats.exportCSV(\'platforms\')">Export to CSV <img height="20px" src="/img/xls-icon.jpg" /></a></div>'+
            '</div>');
        $('#platforms #platforms-graph-wrapper').html('<div class="col-md-11">'+
            '<span class="dropdown header">'+
            '<div class="btn-group">'+
            '<button class="btn btn-default dropdown-text" type="button"><span class="text">Plays</span></button>'+
            '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-expanded="true"><span class="caret"></span></button>'+
            '<ul class="dropdown-menu" id="menu1" role="menu" aria-labelledby="dropdownMenu">'+
            '<li role="presentation"><a role="menuitem" tabindex="-1">Plays</a></li>'+
            '<li role="presentation"><a role="menuitem" tabindex="-1">Minutes Viewed</a></li>'+
            '<li role="presentation"><a role="menuitem" tabindex="-1">Avg. View Time</a></li>'+
            '<li role="presentation"><a role="menuitem" tabindex="-1">Player Impressions</a></li>'+
            '</ul>'+
            '</div>'+
            '</span>&nbsp;&nbsp;&nbsp;<span id="graph-loading1">Loading..</span>'+
            '<div id="platforms-graph"></div>'+
            '</div>'+
            '<div class="col-md-1" id="graph-legend">'+
            '<ul class="chart-legend clearfix">'+
            '<li><i class="fa fa-square" style="color: #dd4b39;"></i> COMPUTER</li>'+
            '<li><i class="fa fa-square" style="color: #40a189;"></i> MOBILE</li>'+
            '<li><i class="fa fa-square" style="color: #f39c12;"></i> TABLET</li>'+
            '<li><i class="fa fa-square" style="color: gray;"></i> GAME CONSOLE</li>'+
            '<li><i class="fa fa-square" style="color: #ee812d;"></i> DMR</li>'+
            '<li><i class="fa fa-square" style="color: #2c9ab7;"></i> UNKNOWN</li>'+
            '</ul>'+
            '</div>');
        $('#platforms #table-header').html('<h2 class="page-header">Details</h2>');

        $(".date-picker1").datepicker();
        $(".date-picker2").datepicker();     
        smhStats.createAreaGraphInstance('platforms-graph'); 
        var split1 = date1.split("/");
        var split2 = date2.split("/");  
        $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
        var from = split1[2]+split1[0]+split1[1];
        var to = split2[2]+split2[0]+split2[1];   
        var diff = new TimeSpan(Date.parseExact(date2, "MM/dd/yyyy") - Date.parseExact(date1, "MM/dd/yyyy"));
        var days = diff.days;
        var diff2 = new TimeSpan(Date.today() - Date.parseExact(date1, "MM/dd/yyyy"));
        var days_from_today = diff2.days; 
        $('#date-picker-1').val(date1);
        $('#date-picker-2').val(date2);
        platforms_entryId = null;
        smhStats.getGraphData(days_from_today,from,to,days,'platforms','count_plays');
        smhStats.getTotalPlays(from,to,'platforms');         
        smhStats.getTabelData(from,to,'platforms');
    },
    //Display video details
    deviceDetailPlatform:function(device){
        var date1 = $('#date-picker-1').val();
        var date2 = $('#date-picker-2').val();
        $('#platforms #date-range-wrapper').html('<div class="col-md-10 col-sm-6 col-xs-12">'+
            '<span id="date-range" class="dropdown header">'+
            '<div class="date-range-sub">'+
            '<span id="datesrange-title">Date Range:</span>'+
            '<div class="btn-group">'+
            '<button class="btn btn-default filter-btn" type="button" style="width: 138px;"><span class="text">Last 30 days</span></button>'+
            '<button aria-expanded="true" data-toggle="dropdown" id="dropdownMenu2" type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button>'+
            '<ul aria-labelledby="dropdownMenu2" role="menu" id="menu2" class="dropdown-menu">'+
            '<li role="presentation"><a onclick="smhStats.loadYesterdayGraph(\'platforms-bar\',\'count_plays\',\'vod-bar\');" tabindex="-1" role="menuitem">Yesterday</a></li>'+
            '<li role="presentation"><a onclick="smhStats.loadLastSevenDaysGraph(\'platforms-bar\',\'count_plays\',\'vod-bar\');" tabindex="-1" role="menuitem">Last 7 days</a></li>'+
            '<li role="presentation"><a onclick="smhStats.loadThisWeekGraph(\'platforms-bar\',\'count_plays\',\'vod-bar\');" tabindex="-1" role="menuitem">This week</a></li>'+
            '<li role="presentation"><a onclick="smhStats.loadLastWeekGraph(\'platforms-bar\',\'count_plays\',\'vod-bar\');" tabindex="-1" role="menuitem">Last week</a></li>'+
            '<li role="presentation"><a onclick="smhStats.loadLastThirtyDaysGraph(\'platforms-bar\',\'count_plays\',\'vod-bar\');" tabindex="-1" role="menuitem">Last 30 days</a></li>'+
            '<li role="presentation"><a onclick="smhStats.loadThisMonthGraph(\'platforms-bar\',\'count_plays\',\'vod-bar\');" tabindex="-1" role="menuitem">This month</a></li>'+
            '<li role="presentation"><a onclick="smhStats.loadLastMonthGraph(\'platforms-bar\',\'count_plays\',\'vod-bar\');" tabindex="-1" role="menuitem">Last month</a></li>'+
            '<li role="presentation"><a onclick="smhStats.loadLastTwelveMonthGraph(\'platforms-bar\',\'count_plays\',\'vod-bar\');" tabindex="-1" role="menuitem">Last 12 months</a></li>'+
            '<li role="presentation"><a onclick="smhStats.loadThisYearGraph(\'platforms-bar\',\'count_plays\',\'vod-bar\');" tabindex="-1" role="menuitem">This year</a></li>'+
            '</ul>'+
            '</div>'+
            '<span class="vertical-line">&nbsp;</span>'+
            '</div>'+
            '<div class="date-range-sub">'+
            '<span id="custom-dates">'+
            '<span id="dates-title">Dates:</span>'+
            '<div class="input-group">'+
            '<div class="input-group-addon">'+
            '<i class="fa fa-calendar"></i>'+
            '</div>'+
            '<input type="text" class="date-picker3 form-control" id="date-picker-3">'+
            '</div>'+
            '</span>'+
            '</div>'+
            '<div class="date-range-sub">'+
            '<span id="custom-dates">To'+
            '<div class="input-group" style="margin-left: 15px;">'+
            '<div class="input-group-addon">'+
            '<i class="fa fa-calendar"></i>'+
            '</div>'+
            '<input type="text" class="date-picker4 form-control" id="date-picker-4">'+
            '</div>'+
            '</span>'+
            '</div>'+
            '</span>'+
            '</div>'+
            '<div class="col-md-2 col-sm-6 col-xs-12">'+
            '<div class="pull-right" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhStats.exportCSV(\'platforms-bar\')">Export to CSV <img height="20px" src="/img/xls-icon.jpg" /></a></div>'+
            '</div>');
        $('#platforms #platforms-graph-wrapper').html('<div class="col-md-12">'+
            '<span class="dropdown header">'+
            '<div class="btn-group">'+
            '<button class="btn btn-default dropdown-text" type="button"><span class="text">Plays</span></button>'+
            '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-expanded="true"><span class="caret"></span></button>'+
            '<ul class="dropdown-menu" id="menu3" role="menu" aria-labelledby="dropdownMenu">'+
            '<li role="presentation"><a role="menuitem" tabindex="-1">Plays</a></li>'+
            '<li role="presentation"><a role="menuitem" tabindex="-1">Minutes Viewed</a></li>'+
            '<li role="presentation"><a role="menuitem" tabindex="-1">Avg. View Time</a></li>'+
            '<li role="presentation"><a role="menuitem" tabindex="-1">Player Impressions</a></li>'+
            '</ul>'+
            '</div>'+
            '</span>&nbsp;&nbsp;&nbsp;<span id="graph-loading2">Loading..</span>'+
            '<div id="platforms-bar-graph"></div>'+
            '</div>');
        $('#platforms #table-header').html('<div class="row">'+
            '<div class="col-md-3 col-sm-6 col-xs-12">'+
            '<div class="pull-left"><button onclick="smhStats.returnTablePlatforms();" class="btn btn-block bg-olive pull-right"><i class="fa fa-reply"></i> View All Platforms</button></div>'+
            '</div>'+
            '</div>'+
            '<h2 class="page-header">'+device.replace(/_/g, " ")+' Details</h2>');
    
        $(".date-picker3").datepicker();
        $(".date-picker4").datepicker();     
        smhStats.createAreaGraphInstance('platforms-bar-graph');        
        var split1 = date1.split("/");
        var split2 = date2.split("/");
        $('#graph-loading2').html('<img src="/img/chart-loading.gif" height="20px" />');       
        var from = split1[2]+split1[0]+split1[1];
        var to = split2[2]+split2[0]+split2[1];        
        var diff = new TimeSpan(Date.parseExact(date2, "MM/dd/yyyy") - Date.parseExact(date1, "MM/dd/yyyy"));
        var days = diff.days;
        var diff2 = new TimeSpan(Date.today() - Date.parseExact(date1, "MM/dd/yyyy"));
        var days_from_today = diff2.days; 
        $('#date-picker-3').val(date1);
        $('#date-picker-4').val(date2);
        platforms_entryId = device;
        smhStats.getGraphData(days_from_today,from,to,days,'platforms-bar','count_plays');
        smhStats.getTotalPlays(from,to,'platforms-bar');
        smhStats.getTabelData(from,to,'platforms-bar');
    },
    //Load yesterday graph
    loadYesterdayGraph:function(reportType,dimension,graph){
        var days = 1;
        var from = Date.today().add(-days).days().toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");
        var from_calendar = Date.today().add(-days).days().toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy");
        if(graph == 'vod'){ 
            $('#date-picker-1').val(from_calendar);
            $('#date-picker-2').val(to_calendar);
        } else if(graph == 'vod-bar'){ 
            $('#date-picker-3').val(from_calendar);
            $('#date-picker-4').val(to_calendar);
        } else if(graph == 'vod-bar-os'){ 
            $('#date-picker-5').val(from_calendar);
            $('#date-picker-6').val(to_calendar);
        } else if(graph == 'vod-bar-browser'){ 
            $('#date-picker-7').val(from_calendar);
            $('#date-picker-8').val(to_calendar);
        }  
        var days_from_today = days;
        smhStats.getGraphData(days_from_today,from,to,days,reportType,dimension);
        smhStats.getTotalPlays(from,to,reportType); 
        smhStats.getTabelData(from,to,reportType); 
    },
    ///Load last 7 days graph
    loadLastSevenDaysGraph:function(reportType,dimension,graph){
        var days = 7;
        var from = Date.today().addDays(-days).toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");
        var from_calendar = Date.today().add(-days).days().toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy");
        var days_from_today = days;   
        if(graph == 'vod'){ 
            $('#date-picker-1').val(from_calendar);
            $('#date-picker-2').val(to_calendar);
        } else if(graph == 'vod-bar'){ 
            $('#date-picker-3').val(from_calendar);
            $('#date-picker-4').val(to_calendar);
        } else if(graph == 'vod-bar-os'){ 
            $('#date-picker-5').val(from_calendar);
            $('#date-picker-6').val(to_calendar);
        } else if(graph == 'vod-bar-browser'){ 
            $('#date-picker-7').val(from_calendar);
            $('#date-picker-8').val(to_calendar);
        }  
        smhStats.getGraphData(days_from_today,from,to,days,reportType,dimension);
        smhStats.getTotalPlays(from,to,reportType); 
        smhStats.getTabelData(from,to,reportType);    
    },
    //Load this weeks graph
    loadThisWeekGraph:function(reportType,dimension,graph){
        var from = Date.today().moveToDayOfWeek(0, -1).toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");
        var from_calendar = Date.today().moveToDayOfWeek(0, -1).toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy");
        if(graph == 'vod'){ 
            $('#date-picker-1').val(from_calendar);
            $('#date-picker-2').val(to_calendar);
        } else if(graph == 'vod-bar'){ 
            $('#date-picker-3').val(from_calendar);
            $('#date-picker-4').val(to_calendar);
        } else if(graph == 'vod-bar-os'){ 
            $('#date-picker-5').val(from_calendar);
            $('#date-picker-6').val(to_calendar);
        } else if(graph == 'vod-bar-browser'){ 
            $('#date-picker-7').val(from_calendar);
            $('#date-picker-8').val(to_calendar);
        }  
        var diff = new TimeSpan(Date.today() - Date.today().moveToDayOfWeek(0, -1));
        var days = diff.days;  
        var days_from_today = diff.days;
        
        smhStats.getGraphData(days_from_today,from,to,days,reportType,dimension);
        smhStats.getTotalPlays(from,to,reportType); 
        smhStats.getTabelData(from,to,reportType);
    },
    //Load last weeks graph
    loadLastWeekGraph:function(reportType,dimension,graph){
        var from = Date.today().addDays(-6).moveToDayOfWeek(0, -1).toString("yyyyMMdd");
        var to = Date.today().moveToDayOfWeek(6, -1).toString("yyyyMMdd");
        var from_calendar = Date.today().addDays(-6).moveToDayOfWeek(0, -1).toString("MM/dd/yyyy");
        var to_calendar = Date.today().moveToDayOfWeek(6, -1).toString("MM/dd/yyyy");
        if(graph == 'vod'){ 
            $('#date-picker-1').val(from_calendar);
            $('#date-picker-2').val(to_calendar);
        } else if(graph == 'vod-bar'){ 
            $('#date-picker-3').val(from_calendar);
            $('#date-picker-4').val(to_calendar);
        } else if(graph == 'vod-bar-os'){ 
            $('#date-picker-5').val(from_calendar);
            $('#date-picker-6').val(to_calendar);
        } else if(graph == 'vod-bar-browser'){ 
            $('#date-picker-7').val(from_calendar);
            $('#date-picker-8').val(to_calendar);
        }  
        var diff = new TimeSpan(Date.today().moveToDayOfWeek(6, -1) - Date.today().addDays(-6).moveToDayOfWeek(0, -1));
        var days = diff.days;
        var diff2 = new TimeSpan(Date.today() - Date.today().addDays(-6).moveToDayOfWeek(0, -1));
        var days_from_today = diff2.days;
        
        smhStats.getGraphData(days_from_today,from,to,days,reportType,dimension);
        smhStats.getTotalPlays(from,to,reportType); 
        smhStats.getTabelData(from,to,reportType);
    },
    //Load last 30 days graph
    loadLastThirtyDaysGraph:function(reportType,dimension,graph){
        var days = 30;        
        var from = Date.today().addDays(-days).toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");
        var from_calendar = Date.today().addDays(-days).toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy"); 
        if(graph == 'vod'){ 
            $('#date-picker-1').val(from_calendar);
            $('#date-picker-2').val(to_calendar);
        } else if(graph == 'vod-bar'){ 
            $('#date-picker-3').val(from_calendar);
            $('#date-picker-4').val(to_calendar);
        } else if(graph == 'vod-bar-os'){ 
            $('#date-picker-5').val(from_calendar);
            $('#date-picker-6').val(to_calendar);
        } else if(graph == 'vod-bar-browser'){ 
            $('#date-picker-7').val(from_calendar);
            $('#date-picker-8').val(to_calendar);
        }  
        var days_from_today = days;
        smhStats.getGraphData(days_from_today,from,to,days,reportType,dimension);
        smhStats.getTotalPlays(from,to,reportType); 
        smhStats.getTabelData(from,to,reportType);    
    },
    //Loads this month's graph
    loadThisMonthGraph:function(reportType,dimension,graph){
        var from = Date.today().moveToFirstDayOfMonth().toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");
        var from_calendar = Date.today().moveToFirstDayOfMonth().toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy");
        if(graph == 'vod'){ 
            $('#date-picker-1').val(from_calendar);
            $('#date-picker-2').val(to_calendar);
        } else if(graph == 'vod-bar'){ 
            $('#date-picker-3').val(from_calendar);
            $('#date-picker-4').val(to_calendar);
        } else if(graph == 'vod-bar-os'){ 
            $('#date-picker-5').val(from_calendar);
            $('#date-picker-6').val(to_calendar);
        } else if(graph == 'vod-bar-browser'){ 
            $('#date-picker-7').val(from_calendar);
            $('#date-picker-8').val(to_calendar);
        }  
        var diff = new TimeSpan(Date.today() - Date.today().moveToFirstDayOfMonth());
        var days = diff.days;
        var days_from_today = days;
        
        smhStats.getGraphData(days_from_today,from,to,days,reportType,dimension);
        smhStats.getTotalPlays(from,to,reportType); 
        smhStats.getTabelData(from,to,reportType);
    },
    //Loads this month's graph
    loadLastMonthGraph:function(reportType,dimension,graph){
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
        if(graph == 'vod'){ 
            $('#date-picker-1').val(from_calendar);
            $('#date-picker-2').val(to_calendar);
        } else if(graph == 'vod-bar'){ 
            $('#date-picker-3').val(from_calendar);
            $('#date-picker-4').val(to_calendar);
        } else if(graph == 'vod-bar-os'){ 
            $('#date-picker-5').val(from_calendar);
            $('#date-picker-6').val(to_calendar);
        } else if(graph == 'vod-bar-browser'){ 
            $('#date-picker-7').val(from_calendar);
            $('#date-picker-8').val(to_calendar);
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
        
        smhStats.getGraphData(days_from_today,from,to,days,reportType,dimension);
        smhStats.getTotalPlays(from,to,reportType); 
        smhStats.getTabelData(from,to,reportType);
    },
    //Loads last 12 month's graph
    loadLastTwelveMonthGraph:function(reportType,dimension,graph){
        var from = Date.today().add({
            months: -12
        }).toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");
        var from_calendar = Date.today().add({
            months: -12
        }).toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy");
        if(graph == 'vod'){ 
            $('#date-picker-1').val(from_calendar);
            $('#date-picker-2').val(to_calendar);
        } else if(graph == 'vod-bar'){ 
            $('#date-picker-3').val(from_calendar);
            $('#date-picker-4').val(to_calendar);
        } else if(graph == 'vod-bar-os'){ 
            $('#date-picker-5').val(from_calendar);
            $('#date-picker-6').val(to_calendar);
        } else if(graph == 'vod-bar-browser'){ 
            $('#date-picker-7').val(from_calendar);
            $('#date-picker-8').val(to_calendar);
        }  
        var diff = new TimeSpan(Date.today() - Date.today().add({
            months: -12
        }));
        var days = diff.days;
        var days_from_today = days;
        
        smhStats.getGraphData(days_from_today,from,to,days,reportType,dimension);
        smhStats.getTotalPlays(from,to,reportType); 
        smhStats.getTabelData(from,to,reportType);
    },
    //Loads this year's graph
    loadThisYearGraph:function(reportType,dimension,graph){
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
        if(graph == 'vod'){ 
            $('#date-picker-1').val(from_calendar);
            $('#date-picker-2').val(to_calendar);
        } else if(graph == 'vod-bar'){ 
            $('#date-picker-3').val(from_calendar);
            $('#date-picker-4').val(to_calendar);
        } else if(graph == 'vod-bar-os'){ 
            $('#date-picker-5').val(from_calendar);
            $('#date-picker-6').val(to_calendar);
        } else if(graph == 'vod-bar-browser'){ 
            $('#date-picker-7').val(from_calendar);
            $('#date-picker-8').val(to_calendar);
        }  
        var days = diff.days;
        var days_from_today = days;
        
        smhStats.getGraphData(days_from_today,from,to,days,reportType,dimension);
        smhStats.getTotalPlays(from,to,reportType); 
        smhStats.getTabelData(from,to,reportType);
    },
    //Export CSV
    exportCSV:function(type){
        var date1, date2, split1, split2, from, to, offset, reportTitle, reportText, headers, reportType, reportInputFilter, dimension, pager, order, objectId, cb;
        if(type == 'platforms'){
            cb = function(success, results){
                if(!success)
                    alert(results);
        
                if(results.code && results.message){
                    alert(results.message);
                    return;
                }
                $('#platforms #loading img').css('display','none');
                window.open(results);                                                  
            };
            
            $('#platforms #loading img').css('display','inline-block');
            date1 = $('#date-picker-1').val();
            date2 = $('#date-picker-2').val();
            split1 = date1.split("/");
            split2 = date2.split("/");
            from = split1[2]+split1[0]+split1[1];
            to = split2[2]+split2[0]+split2[1];
            offset = smhStats.getOffset(); 
            reportTitle = "Platforms";
            reportText = "";
            headers = "Plays,Minutes Viewed,Avg. View Time,Player Impressions,Play to Impression Ratio,Avg. View Drop-off;Platform,Plays,Minutes Viewed,Avg. View Time,Player Impressions,Play to Impression Ratio,Avg. View Drop-off";
            reportType = KalturaReportType.PLATFORMS;
            reportInputFilter = new KalturaReportInputFilter();
            reportInputFilter.fromDay = from;
            reportInputFilter.toDay = to;
            reportInputFilter.timeZoneOffset = offset;
            dimension = "count_plays";
            pager = new KalturaFilterPager();
            pager.pageSize = pageSize;
            pager.pageIndex = 1;
            order = "count_plays";
            objectId = '';
            if(platforms_entryId !== null){
                objectId = platforms_entryId;
            } else if (platforms_entryId == null){
                objectId = null;
            }
            client.report.getUrlForReportAsCsv(cb, reportTitle, reportText, headers, reportType, reportInputFilter, dimension, pager, order, objectId);
        } else if(type == 'platforms-bar'){
            cb = function(success, results){
                if(!success)
                    alert(results);
        
                if(results.code && results.message){
                    alert(results.message);
                    return;
                }
                $('#platforms #loading img').css('display','none');
                window.open(results);                                                  
            };
            
            $('#platforms #loading img').css('display','inline-block');
            date1 = $('#date-picker-3').val();
            date2 = $('#date-picker-4').val();
            split1 = date1.split("/");
            split2 = date2.split("/");
            from = split1[2]+split1[0]+split1[1];
            to = split2[2]+split2[0]+split2[1];
            offset = smhStats.getOffset(); 
            reportTitle = "Platforms";
            reportText = "";
            headers = "Plays,Minutes Viewed,Avg. View Time,Player Impressions,Play to Impression Ratio,Avg. View Drop-off;Operating System,Plays,Minutes Viewed,Avg. View Time,Player Impressions,Play to Impression Ratio,Avg. View Drop-off";
            reportType = KalturaReportType.PLATFORMS;
            reportInputFilter = new KalturaReportInputFilter();
            reportInputFilter.fromDay = from;
            reportInputFilter.toDay = to;
            reportInputFilter.timeZoneOffset = offset;
            dimension = "count_plays";
            pager = new KalturaFilterPager();
            pager.pageSize = pageSize;
            pager.pageIndex = 1;
            order = "count_plays";
            objectId = '';
            if(platforms_entryId !== null){
                objectId = platforms_entryId;
            } else if (platforms_entryId == null){
                objectId = null;
            }
            client.report.getUrlForReportAsCsv(cb, reportTitle, reportText, headers, reportType, reportInputFilter, dimension, pager, order, objectId);
        } else if(type == 'os'){
            cb = function(success, results){
                if(!success)
                    alert(results);
        
                if(results.code && results.message){
                    alert(results.message);
                    return;
                }
                $('#operating_systems #loading img').css('display','none');
                window.open(results);                                                  
            };
            
            $('#operating_systems #loading img').css('display','inline-block');
            date1 = $('#date-picker-5').val();
            date2 = $('#date-picker-6').val();
            split1 = date1.split("/");
            split2 = date2.split("/");
            from = split1[2]+split1[0]+split1[1];
            to = split2[2]+split2[0]+split2[1];
            offset = smhStats.getOffset(); 
            reportTitle = "Operating Systems";
            reportText = "";
            headers = "Plays,Minutes Viewed,Avg. View Time,Player Impressions,Play to Impression Ratio,Avg. View Drop-off;Operating System,Plays,Minutes Viewed,Avg. View Time,Player Impressions,Play to Impression Ratio,Avg. View Drop-off";
            reportType = KalturaReportType.OPERATION_SYSTEM;
            reportInputFilter = new KalturaReportInputFilter();
            reportInputFilter.fromDay = from;
            reportInputFilter.toDay = to;
            reportInputFilter.timeZoneOffset = offset;
            dimension = "count_plays";
            pager = new KalturaFilterPager();
            pager.pageSize = pageSize;
            pager.pageIndex = 1;
            order = "count_plays";
            objectId = null;
            client.report.getUrlForReportAsCsv(cb, reportTitle, reportText, headers, reportType, reportInputFilter, dimension, pager, order, objectId);
        } else if(type == 'browser'){
            cb = function(success, results){
                if(!success)
                    alert(results);
        
                if(results.code && results.message){
                    alert(results.message);
                    return;
                }
                $('#browsers #loading img').css('display','none');
                window.open(results);                                                  
            };
            
            $('#browsers #loading img').css('display','inline-block');
            date1 = $('#date-picker-7').val();
            date2 = $('#date-picker-8').val();
            split1 = date1.split("/");
            split2 = date2.split("/");
            from = split1[2]+split1[0]+split1[1];
            to = split2[2]+split2[0]+split2[1];
            offset = smhStats.getOffset(); 
            reportTitle = "Browsers";
            reportText = "";
            headers = "Plays,Minutes Viewed,Avg. View Time,Player Impressions,Play to Impression Ratio,Avg. View Drop-off;Operating System,Plays,Minutes Viewed,Avg. View Time,Player Impressions,Play to Impression Ratio,Avg. View Drop-off";
            reportType = KalturaReportType.BROWSERS;
            reportInputFilter = new KalturaReportInputFilter();
            reportInputFilter.fromDay = from;
            reportInputFilter.toDay = to;
            reportInputFilter.timeZoneOffset = offset;
            dimension = "count_plays";
            pager = new KalturaFilterPager();
            pager.pageSize = pageSize;
            pager.pageIndex = 1;
            order = "count_plays";
            objectId = null;
            client.report.getUrlForReportAsCsv(cb, reportTitle, reportText, headers, reportType, reportInputFilter, dimension, pager, order, objectId);
        }
    },
    //Adds date range to stats
    formatDateRange:function(data){
        var index, i;
        var dateRange = [];
        var computer = [];
        var unknown = [];
        var mobile = [];
        var tablet = [];
        var gameConsole = [];
        var dmr = [];
        platforms_available = [];
        platforms_color = [];
        var split = data.split(";");
        for (index = 0; index < split.length; ++index) {
            if (split[index]){
                var result = split[index].split(",");
                var date = result[0].substring(0, 8); 
                var hour = result[0].substring(8, 11);
                if(hour == null || hour == ''){
                    hour = '00';
                } 
                for (i = 1; i < result.length; ++i) {
                    var platform = result[i].split(":");
                    var value = platform[1];
                    if(platform[0] == 'COMPUTER'){
                        if($.inArray("computer", platforms_available) == -1) {
                            platforms_available.push('computer');
                        }     
                        if($.inArray("#dd4b39", platforms_color) == -1) {
                            platforms_color.push('#dd4b39');
                        }
                        computer.push({
                            date:  date,
                            hour: hour+":00",
                            value: value
                        });
                    }
                    if(platform[0] == 'UNKNOWN'){
                        if($.inArray("unknown", platforms_available) == -1) {
                            platforms_available.push('unknown');
                        } 
                        if($.inArray("#2c9ab7", platforms_color) == -1) {
                            platforms_color.push('#2c9ab7');
                        }
                        unknown.push({
                            date:  date,
                            hour: hour+":00",
                            value: value
                        });
                    }
                    if(platform[0] == 'MOBILE'){
                        if($.inArray("mobile", platforms_available) == -1) {
                            platforms_available.push('mobile');
                        } 
                        if($.inArray("#40a189", platforms_color) == -1) {
                            platforms_color.push('#40a189');
                        }
                        mobile.push({
                            date:  date,
                            hour: hour+":00",
                            value: value
                        });
                    }
                    if(platform[0] == 'TABLET'){
                        if($.inArray("tablet", platforms_available) == -1) {
                            platforms_available.push('tablet');
                        } 
                        if($.inArray("#f39c12", platforms_color) == -1) {
                            platforms_color.push('#f39c12');
                        }
                        tablet.push({
                            date:  date,
                            hour: hour+":00",
                            value: value
                        });
                    }
                    if(platform[0] == 'GAME_CONSOLE'){
                        if($.inArray("game_console", platforms_available) == -1) {
                            platforms_available.push('game_console');
                        } 
                        if($.inArray("gray", platforms_color) == -1) {
                            platforms_color.push('gray');
                        }
                        gameConsole.push({
                            date:  date,
                            hour: hour+":00",
                            value: value
                        });
                    }
                    if(platform[0] == 'DMR'){
                        if($.inArray("dmr", platforms_available) == -1) {
                            platforms_available.push('dmr');
                        } 
                        if($.inArray("#ee812d", platforms_color) == -1) {
                            platforms_color.push('#ee812d');
                        }
                        dmr.push({
                            date:  date,
                            hour: hour+":00",
                            value: value
                        });
                    }    
                }                               
            }
        }
        dateRange.push({
            computer: computer,
            unknown: unknown,
            mobile: mobile,
            tablet: tablet,
            game_console: gameConsole,
            dmr: dmr
        });
        return dateRange;
    },
    //Get general date range
    generalDate:function(data,days,days_from_today){
        var index, date;                
        if(data[0].computer.length > 0){
            for (index = 0; index <= days; ++index) {
                date = Date.today().addDays(-days_from_today).addDays(+index).toString("yyyyMMdd");
                if(!smhStats.inArray(data[0].computer,date)){
                    data[0].computer.push({
                        date: date, 
                        hour: '00:00',
                        value: 0
                    });
                }
            }        
        }
        if(data[0].unknown.length > 0){
            for (index = 0; index <= days; ++index) {
                date = Date.today().addDays(-days_from_today).addDays(+index).toString("yyyyMMdd");          
                if(!smhStats.inArray(data[0].unknown,date)){
                    data[0].unknown.push({
                        date: date, 
                        hour: '00:00',
                        value: 0
                    });
                }
            } 
        }
        if(data[0].mobile.length > 0){
            for (index = 0; index <= days; ++index) {
                date = Date.today().addDays(-days_from_today).addDays(+index).toString("yyyyMMdd");          
                if(!smhStats.inArray(data[0].mobile,date)){
                    data[0].mobile.push({
                        date: date, 
                        hour: '00:00',
                        value: 0
                    });
                } 
            } 
        }
        if(data[0].tablet.length > 0){
            for (index = 0; index <= days; ++index) {
                date = Date.today().addDays(-days_from_today).addDays(+index).toString("yyyyMMdd");           
                if(!smhStats.inArray(data[0].tablet,date)){
                    data[0].tablet.push({
                        date: date, 
                        hour: '00:00',
                        value: 0
                    });
                }
            } 
        }
        if(data[0].dmr.length > 0){
            for (index = 0; index <= days; ++index) {
                date = Date.today().addDays(-days_from_today).addDays(+index).toString("yyyyMMdd");           
                if(!smhStats.inArray(data[0].dmr,date)){
                    data[0].dmr.push({
                        date: date, 
                        hour: '00:00',
                        value: 0
                    });
                }
            } 
        }
        if(data[0].game_console.length > 0){
            for (index = 0; index <= days; ++index) {
                date = Date.today().addDays(-days_from_today).addDays(+index).toString("yyyyMMdd");           
                if(!smhStats.inArray(data[0].game_console,date)){
                    data[0].game_console.push({
                        date: date,
                        hour: '00:00',
                        value: 0
                    });
                }
            } 
        }
        return data;  
    },
    //Format number
    formatNumber:function(num){
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    },
    //Formats line graph data
    formatLineData:function(data,days,days_from_today){
        var formatedData = [];
        var date;
        for (var index = 0; index <= days; ++index) {
            date = Date.today().addDays(-days_from_today).addDays(+index).toString("yyyyMMdd");            
            var platform_data = {};
            var result1 = smhStats.insert(date, 4, "-");
            var result2 = smhStats.insert(result1, 7, "-");
            var dateFinal = result2+" 00:00";
            platform_data['date'] = dateFinal;
            if(data[0].computer.length > 0){
                $.each(data[0].computer,function(i,v){
                    if(date == v.date){
                        platform_data['computer'] = Number(v.value).toFixed(2)
                    }                
                });       
            }
            if(data[0].unknown.length > 0){
                $.each(data[0].unknown,function(i,v){
                    if(date == v.date){
                        platform_data['unknown'] = Number(v.value).toFixed(2)
                    }                
                });      
            }
            if(data[0].mobile.length > 0){
                $.each(data[0].mobile,function(i,v){
                    if(date == v.date){
                        platform_data['mobile'] = Number(v.value).toFixed(2)
                    }                
                });      
            }
            if(data[0].tablet.length > 0){
                $.each(data[0].tablet,function(i,v){
                    if(date == v.date){
                        platform_data['tablet'] = Number(v.value).toFixed(2)
                    }                
                });      
            }
            if(data[0].game_console.length > 0){
                $.each(data[0].game_console,function(i,v){
                    if(date == v.date){
                        platform_data['game_console'] = Number(v.value).toFixed(2)
                    }                
                });      
            }
            if(data[0].dmr.length > 0){
                $.each(data[0].dmr,function(i,v){
                    if(date == v.date){
                        platform_data['dmr'] = Number(v.value).toFixed(2)
                    }                
                });      
            }            
            formatedData.push(platform_data)              
        }
        return formatedData;
    },
    inArray:function(data,date){
        var inArray = false;
        var index;
        for (index = 0; index < data.length; ++index) {
            if(data[index]['date'] == date){
                inArray = true;
            }
        }
        return inArray;
    },
    //Inserts string value at specified integer index
    insert:function(str, index, value){
        return str.substr(0, index) + value + str.substr(index);
    },
    //Format Number
    format:function(nStr){
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
    formatBarData:function(data){
        var temp = data.split(';');
        var formatedData = [];
        for (var index = 0; index < temp.length - 1; ++index) {
            var barData = temp[index].split(',');
            var title = barData[0].replace(/_/g, " ");       
            if(title == 'MAC OS X IPAD'){
                title = 'IPAD';
            }
            if(title == 'MAC OS X IPHONE'){
                title = 'IPHONE';
            }
            formatedData.push({
                barX: title, 
                value: Number(barData[1]).toFixed(2)
            });                 
                     
        }
        return formatedData;
    },
    convertToHHMM:function(secs){
        secs = Math.floor(secs * 60);
        var h = Math.floor(secs/3600);
        var sh = h * 3600;
        var m = Math.floor((secs - sh)/60);
        var sm = m * 60;
        var s = secs - sh - sm;

        return ((h < 10) && (h > 0) ? "0"+h+':' : ((h == 0) ? "" : h+':'))+((m < 10) && (m > 0) ? "0"+m+':' : ((m == 0) ? "00:" : m+':'))+((s < 10) && (s > 0) ? "0"+s : ((s == 0) ? "00" : s));
    },
    //Gets time offset
    getOffset:function(){
        var dt = new Date();
        var tz = dt.getTimezoneOffset();
        return tz;
    },
    //Register actions
    registerActions:function(){
        $("#platforms").on('click', '#menu1 li a',function(){
            var selText = $(this).text();
            $(this).parents('.dropdown').find('.filter-btn').html('<span class="text">'+selText+'</span>');
        });
        $("#platforms").on('click', '#menu2 li a',function(){
            var selText = $(this).text();
            $(this).parents('.dropdown').find('.filter-btn').html('<span class="text">'+selText+'</span>');
        });
        $("#operating_systems").on('click', '#menu2 li a',function(){
            var selText = $(this).text();
            $(this).parents('.dropdown').find('.filter-btn').html('<span class="text">'+selText+'</span>');
        });
        $("#browsers").on('click', '#menu2 li a',function(){
            var selText = $(this).text();
            $(this).parents('.dropdown').find('.filter-btn').html('<span class="text">'+selText+'</span>');
        });
        $(".date-picker1").datepicker();
        $(".date-picker2").datepicker();
        $(".date-picker5").datepicker();
        $(".date-picker6").datepicker();
        $(".date-picker7").datepicker();
        $(".date-picker8").datepicker();
        
        $('.nav-tabs-custom .nav-tabs a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var target = $(e.target).attr("href") // activated tab
            active_tab = target;
            if (active_tab == '#operating_systems'){
                if(!os_stats){
                    smhStats.createAreaGraphInstance('vod-bar-os-graph');
                    smhStats.loadLastThirtyDaysGraph('os','count_plays','vod-bar-os');
                    os_stats = true; 
                }                                               
            } else if (active_tab == '#browsers'){
                if(!browsers_stats){
                    smhStats.createAreaGraphInstance('vod-bar-browser-graph');
                    smhStats.loadLastThirtyDaysGraph('browser','count_plays','vod-bar-browser');
                    browsers_stats = true; 
                }                                               
            }
        });        
        $('.nav-tabs-custom .nav-tabs a[data-toggle="tab"]:first').trigger("shown.bs.tab");
        
        $("#platforms").on('change', '#date-picker-1',function(){            
            var date1 = $('#date-picker-1').val();
            var date2 = $('#date-picker-2').val();
            var split1 = date1.split("/");
            var split2 = date2.split("/");
            $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');       
            var from = split1[2]+split1[0]+split1[1];
            var to = split2[2]+split2[0]+split2[1];
            var diff = new TimeSpan(Date.parseExact(date2, "MM/dd/yyyy") - Date.parseExact(date1, "MM/dd/yyyy"));
            var days = diff.days;
            var diff2 = new TimeSpan(Date.today() - Date.parseExact(date1, "MM/dd/yyyy"));
            var days_from_today = diff2.days;                        
            smhStats.getGraphData(days_from_today,from,to,days,'platforms','count_plays');
            smhStats.getTotalPlays(from,to,'platforms'); 
            smhStats.getTabelData(from,to,'platforms');
        });
        $("#platforms").on('change', '#date-picker-2',function(){            
            var date1 = $('#date-picker-1').val();
            var date2 = $('#date-picker-2').val();
            var split1 = date1.split("/");
            var split2 = date2.split("/");
            $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');      
            var from = split1[2]+split1[0]+split1[1];
            var to = split2[2]+split2[0]+split2[1];
            var diff = new TimeSpan(Date.parseExact(date2, "MM/dd/yyyy") - Date.parseExact(date1, "MM/dd/yyyy"));
            var days = diff.days;
            var diff2 = new TimeSpan(Date.today() - Date.parseExact(date1, "MM/dd/yyyy"));
            var days_from_today = diff2.days;
            smhStats.getGraphData(days_from_today,from,to,days,'platforms','count_plays');
            smhStats.getTotalPlays(from,to,'platforms'); 
            smhStats.getTabelData(from,to,'platforms');
        });
        $("#platforms").on('change', '#date-picker-3',function(){             
            var date1 = $('#date-picker-3').val();
            var date2 = $('#date-picker-4').val();
            var split1 = date1.split("/");
            var split2 = date2.split("/");
            $('#graph-loading2').html('<img src="/img/chart-loading.gif" height="20px" />');       
            var from = split1[2]+split1[0]+split1[1];
            var to = split2[2]+split2[0]+split2[1];
            var diff = new TimeSpan(Date.parseExact(date2, "MM/dd/yyyy") - Date.parseExact(date1, "MM/dd/yyyy"));
            var days = diff.days;
            var diff2 = new TimeSpan(Date.today() - Date.parseExact(date1, "MM/dd/yyyy"));
            var days_from_today = diff2.days;            
            smhStats.getGraphData(days_from_today,from,to,days,'platforms-bar','count_plays');
            smhStats.getTotalPlays(from,to,'platforms-bar'); 
            smhStats.getTabelData(from,to,'platforms-bar');
        });
        $("#platforms").on('change', '#date-picker-4',function(){             
            var date1 = $('#date-picker-3').val();
            var date2 = $('#date-picker-4').val();
            var split1 = date1.split("/");
            var split2 = date2.split("/");
            $('#graph-loading2').html('<img src="/img/chart-loading.gif" height="20px" />');       
            var from = split1[2]+split1[0]+split1[1];
            var to = split2[2]+split2[0]+split2[1];
            var diff = new TimeSpan(Date.parseExact(date2, "MM/dd/yyyy") - Date.parseExact(date1, "MM/dd/yyyy"));
            var days = diff.days;
            var diff2 = new TimeSpan(Date.today() - Date.parseExact(date1, "MM/dd/yyyy"));
            var days_from_today = diff2.days;            
            smhStats.getGraphData(days_from_today,from,to,days,'platforms-bar','count_plays');
            smhStats.getTotalPlays(from,to,'platforms-bar'); 
            smhStats.getTabelData(from,to,'platforms-bar');
        });
        $("#operating_systems").on('change', '#date-picker-5',function(){             
            var date1 = $('#date-picker-5').val();
            var date2 = $('#date-picker-6').val();
            var split1 = date1.split("/");
            var split2 = date2.split("/");
            $('#graph-loading3').html('<img src="/img/chart-loading.gif" height="20px" />');       
            var from = split1[2]+split1[0]+split1[1];
            var to = split2[2]+split2[0]+split2[1];
            var diff = new TimeSpan(Date.parseExact(date2, "MM/dd/yyyy") - Date.parseExact(date1, "MM/dd/yyyy"));
            var days = diff.days;
            var diff2 = new TimeSpan(Date.today() - Date.parseExact(date1, "MM/dd/yyyy"));
            var days_from_today = diff2.days;            
            smhStats.getGraphData(days_from_today,from,to,days,'os','count_plays');
            smhStats.getTotalPlays(from,to,'os'); 
            smhStats.getTabelData(from,to,'os');
        });
        $("#operating_systems").on('change', '#date-picker-6',function(){             
            var date1 = $('#date-picker-5').val();
            var date2 = $('#date-picker-6').val();
            var split1 = date1.split("/");
            var split2 = date2.split("/");
            $('#graph-loading3').html('<img src="/img/chart-loading.gif" height="20px" />');       
            var from = split1[2]+split1[0]+split1[1];
            var to = split2[2]+split2[0]+split2[1];
            var diff = new TimeSpan(Date.parseExact(date2, "MM/dd/yyyy") - Date.parseExact(date1, "MM/dd/yyyy"));
            var days = diff.days;
            var diff2 = new TimeSpan(Date.today() - Date.parseExact(date1, "MM/dd/yyyy"));
            var days_from_today = diff2.days;            
            smhStats.getGraphData(days_from_today,from,to,days,'os','count_plays');
            smhStats.getTotalPlays(from,to,'os'); 
            smhStats.getTabelData(from,to,'os');
        });
        $("#browsers").on('change', '#date-picker-7',function(){             
            var date1 = $('#date-picker-7').val();
            var date2 = $('#date-picker-8').val();
            var split1 = date1.split("/");
            var split2 = date2.split("/");
            $('#graph-loading4').html('<img src="/img/chart-loading.gif" height="20px" />');       
            var from = split1[2]+split1[0]+split1[1];
            var to = split2[2]+split2[0]+split2[1];
            var diff = new TimeSpan(Date.parseExact(date2, "MM/dd/yyyy") - Date.parseExact(date1, "MM/dd/yyyy"));
            var days = diff.days;
            var diff2 = new TimeSpan(Date.today() - Date.parseExact(date1, "MM/dd/yyyy"));
            var days_from_today = diff2.days;            
            smhStats.getGraphData(days_from_today,from,to,days,'browser','count_plays');
            smhStats.getTotalPlays(from,to,'browser'); 
            smhStats.getTabelData(from,to,'browser');
        });
        $("#browsers").on('change', '#date-picker-8',function(){             
            var date1 = $('#date-picker-7').val();
            var date2 = $('#date-picker-8').val();
            var split1 = date1.split("/");
            var split2 = date2.split("/");
            $('#graph-loading4').html('<img src="/img/chart-loading.gif" height="20px" />');       
            var from = split1[2]+split1[0]+split1[1];
            var to = split2[2]+split2[0]+split2[1];
            var diff = new TimeSpan(Date.parseExact(date2, "MM/dd/yyyy") - Date.parseExact(date1, "MM/dd/yyyy"));
            var days = diff.days;
            var diff2 = new TimeSpan(Date.today() - Date.parseExact(date1, "MM/dd/yyyy"));
            var days_from_today = diff2.days;            
            smhStats.getGraphData(days_from_today,from,to,days,'browser','count_plays');
            smhStats.getTotalPlays(from,to,'browser'); 
            smhStats.getTabelData(from,to,'browser');
        });
                
        $("#platforms").on('click', '#menu1 li a',function(){
            var selText = $(this).text();
            var dataString, graphData, preGraphData;
            var data = [];
            var label = [];
            var date1 = $('#date-picker-1').val();
            var date2 = $('#date-picker-2').val();
            var split1 = date1.split("/");
            var split2 = date2.split("/");
            var from = split1[2]+split1[0]+split1[1];
            var to = split2[2]+split2[0]+split2[1];
            if(selText == 'Plays'){
                if(count_plays){
                    graphData = smhStats.formatDateRange(count_plays); 
                    graph1.options.ykeys = platforms_available;
                    graph1.options.lineColors = platforms_color;
                    $.each(platforms_available,function(index,value){
                        label.push('Plays');
                    });      
                } else if (count_plays == null || count_plays == ''){
                    dataString = from+'00,0;'+to+'00,0;';
                    count_plays = dataString;
                    graphData = smhStats.formatDateRange(count_plays);
                    label.push('Plays');
                } 
            } else if(selText == 'Minutes Viewed'){
                if(sum_time_viewed){
                    graphData = smhStats.formatDateRange(sum_time_viewed); 
                    graph1.options.ykeys = platforms_available;
                    graph1.options.lineColors = platforms_color;
                    $.each(platforms_available,function(index,value){
                        label.push('Minutes');
                    });  
                } else if (sum_time_viewed == null || sum_time_viewed == ''){
                    dataString = from+'00,0;'+to+'00,0;';
                    sum_time_viewed = dataString;
                    graphData = smhStats.formatDateRange(sum_time_viewed);
                    label.push('Minutes');
                }  
            } else if(selText == 'Avg. View Time'){
                if(avg_time_viewed){
                    graphData = smhStats.formatDateRange(avg_time_viewed); 
                    graph1.options.ykeys = platforms_available;
                    graph1.options.lineColors = platforms_color;
                    $.each(platforms_available,function(index,value){
                        label.push('Minutes');
                    }); 
                } else if (avg_time_viewed == null || avg_time_viewed == ''){
                    dataString = from+'00,0;'+to+'00,0;';
                    avg_time_viewed = dataString;
                    graphData = smhStats.formatDateRange(avg_time_viewed);
                    label.push('Minutes');
                }  
            } else if(selText == 'Player Impressions'){
                if(count_loads){
                    graphData = smhStats.formatDateRange(count_loads);
                    graph1.options.ykeys = platforms_available;
                    graph1.options.lineColors = platforms_color;
                    $.each(platforms_available,function(index,value){
                        label.push('Impressions');
                    }); 
                } else if (count_loads == null || count_loads == ''){
                    dataString = from+'00,0;'+to+'00,0;';
                    count_loads = dataString;
                    graphData = smhStats.formatDateRange(count_loads);
                    label.push('Impressions');
                }  
            }

            preGraphData = smhStats.generalDate(graphData,days_glbl,days_from_today_glbl);
            data = smhStats.formatLineData(preGraphData,days_glbl,days_from_today_glbl);
            graph1.options.labels = label;
            graph1.setData(data);
            $(this).parents('.dropdown').find('.dropdown-text').html('<span class="text">'+selText+'</span>');
            $('#graph-loading1').empty();
        });
        
        $("#platforms").on('click', '#menu3 li a',function(){
            var selText = $(this).text();
            var data = [];
            var label = '';
            var dataString = '';
            if(selText == 'Plays'){
                label = "Plays";
                if(count_plays_platforms_bar){
                    data = smhStats.formatBarData(count_plays_platforms_bar);
                } else if(count_plays_platforms_bar == null || count_plays_platforms_bar == '' || count_plays_platforms_bar == undefined){
                    dataString = 'NO_DATA,0;';
                    count_plays_platforms_bar = dataString;
                    data = smhStats.formatBarData(count_plays_platforms_bar);
                }  
            } else if(selText == 'Minutes Viewed'){
                label = "Minutes";
                if(sum_time_viewed_platforms_bar){
                    data = smhStats.formatBarData(sum_time_viewed_platforms_bar);
                } else if(sum_time_viewed_platforms_bar == null || sum_time_viewed_platforms_bar == '' || sum_time_viewed_platforms_bar == undefined){
                    dataString = 'NO_DATA,0;';
                    sum_time_viewed_platforms_bar = dataString;
                    data = smhStats.formatBarData(sum_time_viewed_platforms_bar);
                } 
            } else if(selText == 'Avg. View Time'){
                label = "Minutes";
                if(avg_time_viewed_platforms_bar){
                    data = smhStats.formatBarData(avg_time_viewed_platforms_bar);
                } else if(avg_time_viewed_platforms_bar == null || avg_time_viewed_platforms_bar == '' || avg_time_viewed_platforms_bar == undefined){
                    dataString = 'NO_DATA,0;';
                    avg_time_viewed_platforms_bar = dataString;
                    data = smhStats.formatBarData(avg_time_viewed_platforms_bar);
                } 
            } else if(selText == 'Player Impressions'){
                label = "Impressions";
                if(count_loads_platforms_bar){
                    data = smhStats.formatBarData(count_loads_platforms_bar);
                } else if(count_loads_platforms_bar == null || count_loads_platforms_bar == '' || count_loads_platforms_bar == undefined){
                    dataString = 'NO_DATA,0;';
                    count_loads_platforms_bar = dataString;
                    data = smhStats.formatBarData(count_loads_platforms_bar);
                }  
            }
            graph2.options.labels = [label];
            graph2.setData(data);
            $(this).parents('.dropdown').find('.dropdown-text').html('<span class="text">'+selText+'</span>');
        });
        
        $("#operating_systems").on('click', '#menu4 li a',function(){
            var selText = $(this).text();
            var data = [];
            var label = '';
            var dataString = '';
            if(selText == 'Plays'){
                label = "Plays";
                if(count_plays_os_bar){
                    data = smhStats.formatBarData(count_plays_os_bar);
                } else if(count_plays_os_bar == null || count_plays_os_bar == '' || count_plays_os_bar == undefined){
                    dataString = 'NO_DATA,0;';
                    count_plays_os_bar = dataString;
                    data = smhStats.formatBarData(count_plays_os_bar);
                }  
            } else if(selText == 'Minutes Viewed'){
                label = "Minutes";
                if(sum_time_viewed_os_bar){
                    data = smhStats.formatBarData(sum_time_viewed_os_bar);
                } else if(sum_time_viewed_os_bar == null || sum_time_viewed_os_bar == '' || sum_time_viewed_os_bar == undefined){
                    dataString = 'NO_DATA,0;';
                    sum_time_viewed_os_bar = dataString;
                    data = smhStats.formatBarData(sum_time_viewed_os_bar);
                } 
            } else if(selText == 'Avg. View Time'){
                label = "Minutes";
                if(avg_time_viewed_os_bar){
                    data = smhStats.formatBarData(avg_time_viewed_os_bar);
                } else if(avg_time_viewed_os_bar == null || avg_time_viewed_os_bar == '' || avg_time_viewed_os_bar == undefined){
                    dataString = 'NO_DATA,0;';
                    avg_time_viewed_os_bar = dataString;
                    data = smhStats.formatBarData(avg_time_viewed_os_bar);
                } 
            } else if(selText == 'Player Impressions'){
                label = "Impressions";
                if(count_loads_os_bar){
                    data = smhStats.formatBarData(count_loads_os_bar);
                } else if(count_loads_os_bar == null || count_loads_os_bar == '' || count_loads_os_bar == undefined){
                    dataString = 'NO_DATA,0;';
                    count_loads_os_bar = dataString;
                    data = smhStats.formatBarData(count_loads_os_bar);
                }  
            }
            graph3.options.labels = [label];
            graph3.setData(data);
            $(this).parents('.dropdown').find('.dropdown-text').html('<span class="text">'+selText+'</span>');
        });
        $("#browsers").on('click', '#menu5 li a',function(){
            var selText = $(this).text();
            var data = [];
            var label = '';
            var dataString = '';
            if(selText == 'Plays'){
                label = "Plays";
                if(count_plays_browsers_bar){
                    data = smhStats.formatBarData(count_plays_browsers_bar);
                } else if(count_plays_browsers_bar == null || count_plays_browsers_bar == '' || count_plays_browsers_bar == undefined){
                    dataString = 'NO_DATA,0;';
                    count_plays_browsers_bar = dataString;
                    data = smhStats.formatBarData(count_plays_browsers_bar);
                }  
            } else if(selText == 'Minutes Viewed'){
                label = "Minutes";
                if(sum_time_viewed_browsers_bar){
                    data = smhStats.formatBarData(sum_time_viewed_browsers_bar);
                } else if(sum_time_viewed_browsers_bar == null || sum_time_viewed_browsers_bar == '' || sum_time_viewed_browsers_bar == undefined){
                    dataString = 'NO_DATA,0;';
                    sum_time_viewed_browsers_bar = dataString;
                    data = smhStats.formatBarData(sum_time_viewed_browsers_bar);
                } 
            } else if(selText == 'Avg. View Time'){
                label = "Minutes";
                if(avg_time_viewed_browsers_bar){
                    data = smhStats.formatBarData(avg_time_viewed_browsers_bar);
                } else if(avg_time_viewed_browsers_bar == null || avg_time_viewed_browsers_bar == '' || avg_time_viewed_browsers_bar == undefined){
                    dataString = 'NO_DATA,0;';
                    avg_time_viewed_browsers_bar = dataString;
                    data = smhStats.formatBarData(avg_time_viewed_browsers_bar);
                } 
            } else if(selText == 'Player Impressions'){
                label = "Impressions";
                if(count_loads_browsers_bar){
                    data = smhStats.formatBarData(count_loads_browsers_bar);
                } else if(count_loads_browsers_bar == null || count_loads_browsers_bar == '' || count_loads_browsers_bar == undefined){
                    dataString = 'NO_DATA,0;';
                    count_loads_browsers_bar = dataString;
                    data = smhStats.formatBarData(count_loads_browsers_bar);
                }  
            }
            graph4.options.labels = [label];
            graph4.setData(data);
            $(this).parents('.dropdown').find('.dropdown-text').html('<span class="text">'+selText+'</span>');
        });
    }
}

// smhStats on ready
$(document).ready(function(){
    smhStats = new Stats();
    smhStats.registerActions();     
    smhStats.createAreaGraphInstance('platforms-graph');
    smhStats.loadLastThirtyDaysGraph('platforms','count_plays','vod');
});
