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
var count_plays, pageSize;

//Login prototype/class
Stats.prototype = {
    constructor: Stats,
    //Gets total plays
    getTotalPlays:function(from,to){
        var cb = function(success, results){
            if(!success)
                alert(results);
        
            if(results.code && results.message){
                alert(results.message);
                return;
            }
            
            var i, count_plays, count_plays_25, count_plays_50, count_plays_75, count_plays_100;
            var headers = results.header.split(",");
            var data = results.data.split(",");
            var totals = {};
                       
            for (i = 0; i < headers.length; i++) {
                totals[headers[i]] = data[i];
            }
            
            if(totals.count_plays == '' || totals.count_plays == null){
                count_plays = 0
            }
            else {
                count_plays = totals.count_plays;
            }
            
            if(totals.count_plays_25 == '' || totals.count_plays_25 == null){
                count_plays_25 = 0
            } else {
                count_plays_25 = smhStats.format(totals.count_plays_25);
            }
            if(totals.count_plays_50 == '' || totals.count_plays_50 == null){
                count_plays_50 = 0
            } else {
                count_plays_50 = smhStats.format(totals.count_plays_50);
            }
            if(totals.count_plays_75 == '' || totals.count_plays_75 == null){
                count_plays_75 = 0
            } else {
                count_plays_75 = smhStats.format(totals.count_plays_75);
            }
            if(totals.count_plays_100 == '' || totals.count_plays_100 == null){
                count_plays_100 = 0
            } else {
                count_plays_100 = smhStats.format(totals.count_plays_100);
            }
            $('#plays').html(smhStats.format(count_plays));
            $('#tweentyfive').html(count_plays_25);
            $('#fifty').html(count_plays_50);
            $('#seventyfive').html(count_plays_75);
            $('#onehundred').html(count_plays_100);
            $('#ratio').html((totals.play_through_ratio*100).toFixed(2)+'%');       
      
        };
        
        var offset = smhStats.getOffset();
        var reportType = KalturaReportType.MAP_OVERLAY;
        var reportInputFilter = new KalturaReportInputFilter();
        reportInputFilter.fromDay = from;
        reportInputFilter.toDay = to;
        reportInputFilter.searchInTags = true;
        reportInputFilter.searchInAdminTags = true;
        reportInputFilter.timeZoneOffset = offset;
        client.report.getTotal(cb, reportType, reportInputFilter, null);  
    },
    //Gets table data
    getTabelData:function(from,to){
        var timezone = jstz.determine();
        var tz = timezone.name();
        var offset = smhStats.getOffset();                        
        $('#geo-dataTable').empty();
        $('#geo-dataTable').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="geo-data"></table>');            
        geoTable = $('#geo-data').DataTable({
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
                        "table": "geo_map",
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
                "zeroRecords": "No Countries Found"
            },
            "columns": [
            {
                "title": "<span style='float: left;'>Region</span>"
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
            "drawCallback": function( oSettings ) {
                smhMain.fcmcAddRows(this, 7, 10);             
            }                                
        });                
    },
    //Load yesterday graph
    loadYesterdayMap:function(){       
        $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
        var days = 1;
        var from = Date.today().add(-days).days().toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");
        var from_calendar = Date.today().add(-days).days().toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy");
        $('#date-picker-1').val(from_calendar);
        $('#date-picker-2').val(to_calendar);        
        smhStats.getMapData(from,to);
        smhStats.getTotalPlays(from,to); 
        smhStats.getTabelData(from,to); 
    },
    ///Load last 7 days graph
    loadLastSevenDaysMap:function(){
        $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />'); 
        var days = 7;
        var from = Date.today().addDays(-days).toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");
        var from_calendar = Date.today().add(-days).days().toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy");
        $('#date-picker-1').val(from_calendar);
        $('#date-picker-2').val(to_calendar);        
        smhStats.getMapData(from,to);
        smhStats.getTotalPlays(from,to); 
        smhStats.getTabelData(from,to);      
    },
    //Load this weeks graph
    loadThisWeekMap:function(){
        var from = Date.today().moveToDayOfWeek(0, -1).toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");
        var from_calendar = Date.today().moveToDayOfWeek(0, -1).toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy");
        $('#date-picker-1').val(from_calendar);
        $('#date-picker-2').val(to_calendar);        
        smhStats.getMapData(from,to);
        smhStats.getTotalPlays(from,to); 
        smhStats.getTabelData(from,to);
    },
    //Load last weeks graph
    loadLastWeekMap:function(){
        $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
        var from = Date.today().addDays(-6).moveToDayOfWeek(0, -1).toString("yyyyMMdd");
        var to = Date.today().moveToDayOfWeek(6, -1).toString("yyyyMMdd");
        var from_calendar = Date.today().addDays(-6).moveToDayOfWeek(0, -1).toString("MM/dd/yyyy");
        var to_calendar = Date.today().moveToDayOfWeek(6, -1).toString("MM/dd/yyyy");
        $('#date-picker-1').val(from_calendar);
        $('#date-picker-2').val(to_calendar);        
        smhStats.getMapData(from,to);
        smhStats.getTotalPlays(from,to); 
        smhStats.getTabelData(from,to);
    },
    //Load last 30 days graph
    loadLastThirtyDaysMap:function(){
        $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
        var days = 30;        
        var from = Date.today().addDays(-days).toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");  
        var from_calendar = Date.today().addDays(-days).toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy"); 
        $('#date-picker-1').val(from_calendar);
        $('#date-picker-2').val(to_calendar);        
        smhStats.getMapData(from,to);
        smhStats.getTotalPlays(from,to); 
        smhStats.getTabelData(from,to);       
    },
    //Loads this month's graph
    loadThisMonthMap:function(){
        $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');
        $('#graph-loading2').html('<img src="/img/chart-loading.gif" height="20px" />');
        var from = Date.today().moveToFirstDayOfMonth().toString("yyyyMMdd");
        var to = Date.today().toString("yyyyMMdd");
        var from_calendar = Date.today().moveToFirstDayOfMonth().toString("MM/dd/yyyy");
        var to_calendar = Date.today().toString("MM/dd/yyyy");
        $('#date-picker-1').val(from_calendar);
        $('#date-picker-2').val(to_calendar);        
        smhStats.getMapData(from,to);
        smhStats.getTotalPlays(from,to); 
        smhStats.getTabelData(from,to);
    },
    //Loads this month's graph
    loadLastMonthMap:function(){
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
        smhStats.getMapData(from,to);
        smhStats.getTotalPlays(from,to); 
        smhStats.getTabelData(from,to);
    },
    //Loads last 12 month's graph
    loadLastTwelveMonthMap:function(){
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
        smhStats.getMapData(from,to);
        smhStats.getTotalPlays(from,to); 
        smhStats.getTabelData(from,to);
    },
    //Loads this year's graph
    loadThisYearMap:function(){
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
        smhStats.getMapData(from,to);
        smhStats.getTotalPlays(from,to); 
        smhStats.getTabelData(from,to);
    },
    //Export CSV
    exportCSV:function(){
        var cb = function(success, results){
            if(!success)
                alert(results);
        
            if(results.code && results.message){
                alert(results.message);
                return;
            }
            $('#loading img').css('display','none');
            window.open(results);                                                  
        };
            
        $('#loading img').css('display','inline-block');
        var date1 = $('#date-picker-1').val();
        var date2 = $('#date-picker-2').val();
        var split1 = date1.split("/");
        var split2 = date2.split("/");
        var from = split1[2]+split1[0]+split1[1];
        var to = split2[2]+split2[0]+split2[1];
        var offset = smhStats.getOffset(); 
        var reportTitle = "Geographic Distribution";
        var reportText = "";
        var headers = "Plays,25% Play-through,50% Play-through,75% Play-through,100% Play-through,Play-through Ratio;Object Id,Region,Plays,25% Play-through,50% Play-through,75% Play-through,100% Play-through,Play-through Ratio";
        var reportType = KalturaReportType.MAP_OVERLAY;
        var reportInputFilter = new KalturaReportInputFilter();
        reportInputFilter.fromDay = from;
        reportInputFilter.toDay = to;
        reportInputFilter.timeZoneOffset = offset;
        var dimension = null;
        var pager = new KalturaFilterPager();
        pager.pageSize = pageSize;
        pager.pageIndex = 1;
        var order = "count_plays";
        client.report.getUrlForReportAsCsv(cb, reportTitle, reportText, headers, reportType, reportInputFilter, dimension, pager, order, null);
    },
    //Format number
    formatNumber:function(num){
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
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
    //Gets time offset
    getOffset:function(){
        var dt = new Date();
        var tz = dt.getTimezoneOffset();
        return tz;
    },
    //Gets Map data
    getMapData:function(from,to){
        var cb = function(success, results){
            if(!success)
                alert(results);
        
            if(results.code && results.message){
                alert(results.message);
                return;
            }
            
            var i;
            var country_data = {};
            var country_ids = {};
            var countries = {};
            var data = {};
            var plays = {};
            var fillData = {};
            
            if(results.length > 0){
                for (i = 0; i < results.length; i++) {
                    country_data[results[i]['id']] = results[i]['data'];
                }   
            
                country_ids = country_data.country.split(';');
            
                for (i = 0; i < country_ids.length - 1; i++) {
                    var ids = country_ids[i].split(',');
                    if(ids[1] !== 'ZZ'){
                        countries[ids[1]] = ids[0];  
                    }               
                }
            
                data = country_data.count_plays.split(';');
            
                for (i = 0; i < data.length - 1; i++) {
                    var cp = data[i].split(',');
                    if(cp[1] !== ''){
                        plays[cp[0]] = cp[1];  
                    }                                 
                }

                $.each(countries, function(index1, value1) {
                    $.each(plays, function(index2, value2) {
                        if(value1 == index2){
                            if(index1 == 'UK'){
                                index1 = 'GB';
                            }
                            fillData[index1] = "#66C2A5";
                        }
                    });
                });
                
                $('#geo-dist-map').vectorMap({
                    map: 'world_mill_en',
                    normalizeFunction: 'polynomial',
                    hoverOpacity: 0.7,
                    hoverColor: false,
                    backgroundColor: 'transparent',
                    regionStyle: {
                        initial: {
                            fill: 'rgba(210, 214, 222, 1)',
                            "fill-opacity": 1,
                            stroke: 'none',
                            "stroke-width": 0,
                            "stroke-opacity": 1
                        },
                        hover: {
                            "fill-opacity": 0.7,
                            cursor: 'pointer'
                        },
                        selected: {
                            fill: 'yellow'
                        },
                        selectedHover: {
                    }
                    },
                    series: {
                        regions: [{
                            values: fillData,
                            attribute: 'fill'
                        }]
                    },
                    onRegionTipShow: function(e, el, code){
                        var country_plays
                        if(code == 'GB'){
                            code = 'UK'
                        }
                        if(countries[code]){
                            var country = countries[code];
                            if(plays[country]){
                                country_plays = smhStats.formatNumber(plays[country]); 
                            } else {
                                country_plays = 0;  
                            }                            
                        } else {
                            country_plays = 0;
                        }

                        el.html(el.html()+' ( '+country_plays+' Plays )');
                    }

                }); 
            } else {
                $('#geo-dist-map').vectorMap({
                    map: 'world_mill_en',
                    normalizeFunction: 'polynomial',
                    hoverOpacity: 0.7,
                    hoverColor: false,
                    backgroundColor: 'transparent',
                    regionStyle: {
                        initial: {
                            fill: 'rgba(210, 214, 222, 1)',
                            "fill-opacity": 1,
                            stroke: 'none',
                            "stroke-width": 0,
                            "stroke-opacity": 1
                        },
                        hover: {
                            "fill-opacity": 0.7,
                            cursor: 'pointer'
                        },
                        selected: {
                            fill: 'yellow'
                        },
                        selectedHover: {
                    }
                    },
                    onRegionTipShow: function(e, el, code){
                        el.html(el.html()+' ( 0 Plays )');
                    }
                }); 
            }
            $('#graph-loading1').empty();           
        };

        $('#geo-dist-map').empty();
        var offset = smhStats.getOffset();
        var reportType = KalturaReportType.MAP_OVERLAY;   
        var dimension = 'count_plays';
        var reportInputFilter = new KalturaReportInputFilter();
        reportInputFilter.fromDay = from;
        reportInputFilter.toDay = to;     
        reportInputFilter.searchInTags = true;
        reportInputFilter.searchInAdminTags = true;
        reportInputFilter.timeZoneOffset = offset;
        client.report.getGraphs(cb, reportType, reportInputFilter, dimension, null);
    },
    //Register actions
    registerActions:function(){
        $("#menu1 li a").click(function(){
            var selText = $(this).text();
            $(this).parents('.dropdown').find('.filter-btn').html('<span class="text">'+selText+'</span>');
        });
        $(".date-picker1").datepicker();
        $(".date-picker2").datepicker();
        
        $('#date-picker-1').change(function(){             
            var date1 = $('#date-picker-1').val();
            var date2 = $('#date-picker-2').val();
            var split1 = date1.split("/");
            var split2 = date2.split("/");
            $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');       
            var from = split1[2]+split1[0]+split1[1];
            var to = split2[2]+split2[0]+split2[1];        
            smhStats.getMapData(from,to);
            smhStats.getTotalPlays(from,to); 
            smhStats.getTabelData(from,to); 
        });
        $('#date-picker-2').change(function(){             
            var date1 = $('#date-picker-1').val();
            var date2 = $('#date-picker-2').val();
            var split1 = date1.split("/");
            var split2 = date2.split("/");
            $('#graph-loading1').html('<img src="/img/chart-loading.gif" height="20px" />');      
            var from = split1[2]+split1[0]+split1[1];
            var to = split2[2]+split2[0]+split2[1];
            smhStats.getMapData(from,to);
            smhStats.getTotalPlays(from,to); 
            smhStats.getTabelData(from,to);
        });
    }
}

// smhStats on ready
$(document).ready(function(){
    smhStats = new Stats();
    smhStats.registerActions();
    smhStats.loadLastThirtyDaysMap();        
});
