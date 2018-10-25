@extends('appVR')

@section('css')
<link href="/css/morris.css?v=1" rel="stylesheet"> 
@stop

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1><i class="fa fa-bar-chart"></i> Player Statistics <i style="font-size: 14px; position: relative; top: -1px;" data-placement="right" data-toggle="tooltip" data-delay='{"show":700, "hide":30}' data-original-title="Player statistics are updated once a day" class="fa fa-question-circle"></i></h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li>Analytics</li>
            <li>Player Statistics</li>
            <li class="active">System Reports</li>
        </ol>
    </section>
    <!-- Main content -->
    <section class="content">
        @include('alerts')
        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper">  
                    <div id="page-header-body">
                        <div id="text">System Reports displays information per the OS, browser, or platform used.</div>
                        <div id="icon"><i class="fa fa-comments-o"></i></div>                      
                        <div class="clear"></div>                        
                    </div>                      
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="box nav-tabs-custom">
                    <ul class="nav nav-tabs pull-left ui-sortable-handle">
                        <li class="active"><a data-toggle="tab" href="#platforms" aria-expanded="true">Platforms</a></li>
                        <li class=""><a data-toggle="tab" href="#operating_systems" aria-expanded="false">Operating Systems</a></li>
                        <li class=""><a data-toggle="tab" href="#browsers" aria-expanded="false">Browsers</a></li>
                    </ul>
                    <div class="box-body">
                        <div class="tab-content no-padding">
                            <div style="position: relative; min-height: 1240px;" id="platforms" class="tab-pane active">
                                <div class="col-md-12">
                                    <div class="row" id="date-range-wrapper">
                                        <div class="col-md-10 col-sm-6 col-xs-12">
                                            <span id="date-range" class="dropdown header">
                                                <div class="date-range-sub">
                                                    <span id="datesrange-title">Date Range:</span>
                                                    <div class="btn-group">
                                                        <button class="btn btn-default filter-btn" type="button" style="width: 138px;"><span class="text">Last 30 days</span></button>
                                                        <button aria-expanded="true" data-toggle="dropdown" id="dropdownMenu2" type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button>
                                                        <ul aria-labelledby="dropdownMenu2" role="menu" id="menu2" class="dropdown-menu">
                                                            <li role="presentation"><a onclick="smhStats.loadYesterdayGraph('platforms', 'count_plays', 'vod');" tabindex="-1" role="menuitem">Yesterday</a></li>
                                                            <li role="presentation"><a onclick="smhStats.loadLastSevenDaysGraph('platforms', 'count_plays', 'vod');" tabindex="-1" role="menuitem">Last 7 days</a></li>
                                                            <li role="presentation"><a onclick="smhStats.loadThisWeekGraph('platforms', 'count_plays', 'vod');" tabindex="-1" role="menuitem">This week</a></li>
                                                            <li role="presentation"><a onclick="smhStats.loadLastWeekGraph('platforms', 'count_plays', 'vod');" tabindex="-1" role="menuitem">Last week</a></li>
                                                            <li role="presentation"><a onclick="smhStats.loadLastThirtyDaysGraph('platforms', 'count_plays', 'vod');" tabindex="-1" role="menuitem">Last 30 days</a></li>
                                                            <li role="presentation"><a onclick="smhStats.loadThisMonthGraph('platforms', 'count_plays', 'vod');" tabindex="-1" role="menuitem">This month</a></li>
                                                            <li role="presentation"><a onclick="smhStats.loadLastMonthGraph('platforms', 'count_plays', 'vod');" tabindex="-1" role="menuitem">Last month</a></li>
                                                            <li role="presentation"><a onclick="smhStats.loadLastTwelveMonthGraph('platforms', 'count_plays', 'vod');" tabindex="-1" role="menuitem">Last 12 months</a></li>
                                                            <li role="presentation"><a onclick="smhStats.loadThisYearGraph('platforms', 'count_plays', 'vod');" tabindex="-1" role="menuitem">This year</a></li>
                                                        </ul>
                                                    </div>
                                                    <span class="vertical-line">&nbsp;</span>                                                 
                                                </div>
                                                <div class="date-range-sub">
                                                    <span id="custom-dates">
                                                        <span id="dates-title">Dates:</span>
                                                        <div class="input-group">
                                                            <div class="input-group-addon">
                                                                <i class="fa fa-calendar"></i>
                                                            </div>
                                                            <input type="text" class="date-picker1 form-control" id="date-picker-1">
                                                        </div>                                        
                                                    </span>                                          
                                                </div>
                                                <div class="date-range-sub">
                                                    <span id="custom-dates">To
                                                        <div class="input-group" style="margin-left: 15px;">
                                                            <div class="input-group-addon">
                                                                <i class="fa fa-calendar"></i>
                                                            </div>
                                                            <input type="text" class="date-picker2 form-control" id="date-picker-2">
                                                        </div>
                                                    </span>                                            
                                                </div>
                                            </span>
                                        </div>                                   
                                        <div class="col-md-2 col-sm-6 col-xs-12">
                                            <div class="pull-right" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhStats.exportCSV('platforms')">Export to CSV <img height="20px" src="/img/xls-icon.jpg" /></a></div>
                                        </div> 
                                    </div>
                                </div>
                                <div class="col-md-12" id="platforms-graph-wrapper">
                                    <div class="col-md-11">
                                        <span class="dropdown header">
                                            <div class="btn-group">
                                                <button class="btn btn-default dropdown-text" type="button"><span class="text">Plays</span></button>
                                                <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-expanded="true"><span class="caret"></span></button>
                                                <ul class="dropdown-menu" id="menu1" role="menu" aria-labelledby="dropdownMenu">
                                                    <li role="presentation"><a role="menuitem" tabindex="-1">Plays</a></li>
                                                    <li role="presentation"><a role="menuitem" tabindex="-1">Minutes Viewed</a></li>
                                                    <li role="presentation"><a role="menuitem" tabindex="-1">Avg. View Time</a></li>
                                                    <li role="presentation"><a role="menuitem" tabindex="-1">Player Impressions</a></li>                                        
                                                </ul>
                                            </div>
                                        </span>&nbsp;&nbsp;&nbsp;<span id="graph-loading1">Loading..</span>
                                        <div id="platforms-graph"></div>
                                    </div>
                                    <div class="col-md-1" id="graph-legend">
                                        <ul class="chart-legend clearfix">
                                            <li><i class="fa fa-square" style="color: #dd4b39;"></i> COMPUTER</li>
                                            <li><i class="fa fa-square" style="color: #40a189;"></i> MOBILE</li>
                                            <li><i class="fa fa-square" style="color: #f39c12;"></i> TABLET</li>
                                            <li><i class="fa fa-square" style="color: gray;"></i> GAME CONSOLE</li>
                                            <li><i class="fa fa-square" style="color: #ee812d;"></i> DMR</li>
                                            <li><i class="fa fa-square" style="color: #2c9ab7;"></i> UNKNOWN</li>
                                        </ul>
                                    </div>                                  
                                </div>
                                <div class="col-md-12">
                                    <h2 class="page-header">Totals</h2>
                                </div>
                                <div class="col-md-12">
                                    <div class="col-sm-2 col-xs-6">
                                        <div class="description-block border-right">
                                            <span class="description-percentage text-green">Plays</span>
                                            <h5 class="description-header" id="plays">0</h5>
                                        </div><!-- /.description-block -->
                                    </div><!-- /.col -->
                                    <div class="col-sm-2 col-xs-6">
                                        <div class="description-block border-right">
                                            <span class="description-percentage text-yellow">Minutes Viewed</span>
                                            <h5 class="description-header" id="minutes">00:00</h5>
                                        </div><!-- /.description-block -->
                                    </div><!-- /.col -->
                                    <div class="col-sm-2 col-xs-6">
                                        <div class="description-block border-right">
                                            <span class="description-percentage text-green">Avg. View Time</span>
                                            <h5 class="description-header" id="time">00:00</h5>
                                        </div><!-- /.description-block -->
                                    </div><!-- /.col -->
                                    <div class="col-sm-2 col-xs-6">
                                        <div class="description-block border-right">
                                            <span class="description-percentage text-red">Player Impressions</span>
                                            <h5 class="description-header" id="impressions">0</h5>
                                        </div><!-- /.description-block -->
                                    </div>
                                    <div class="col-sm-2 col-xs-6">
                                        <div class="description-block border-right">
                                            <span class="description-percentage text-green">Play to Impressions Ratio</span>
                                            <h5 class="description-header" id="ratio">0.00%</h5>
                                        </div><!-- /.description-block -->
                                    </div>
                                    <div class="col-sm-2 col-xs-6">
                                        <div class="description-block">
                                            <span class="description-percentage text-orange">Avg. View Drop-off</span>
                                            <h5 class="description-header" id="drop">0.00%</h5>
                                        </div><!-- /.description-block -->
                                    </div>
                                </div>
                                <div class="col-md-12" id="table-header">
                                    <h2 class="page-header">Details</h2>
                                </div>
                                <div class="col-md-12" id="table-body">
                                    <div id="platforms-dataTable"></div>
                                </div>
                            </div>
                            <div style="position: relative; min-height: 1240px;" id="operating_systems" class="tab-pane">
                                <div class="col-md-12">
                                    <div class="row">
                                        <div class="col-md-10 col-sm-6 col-xs-12">
                                            <span id="date-range" class="dropdown header">
                                                <div class="date-range-sub">
                                                    <span id="datesrange-title">Date Range:</span>
                                                    <div class="btn-group">
                                                        <button class="btn btn-default filter-btn" type="button" style="width: 138px;"><span class="text">Last 30 days</span></button>
                                                        <button aria-expanded="true" data-toggle="dropdown" id="dropdownMenu2" type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button>
                                                        <ul aria-labelledby="dropdownMenu2" role="menu" id="menu2" class="dropdown-menu">
                                                            <li role="presentation"><a onclick="smhStats.loadYesterdayGraph('os', 'count_plays', 'vod-bar-os');" tabindex="-1" role="menuitem">Yesterday</a></li>
                                                            <li role="presentation"><a onclick="smhStats.loadLastSevenDaysGraph('os', 'count_plays', 'vod-bar-os');" tabindex="-1" role="menuitem">Last 7 days</a></li>
                                                            <li role="presentation"><a onclick="smhStats.loadThisWeekGraph('os', 'count_plays', 'vod-bar-os');" tabindex="-1" role="menuitem">This week</a></li>
                                                            <li role="presentation"><a onclick="smhStats.loadLastWeekGraph('os', 'count_plays', 'vod-bar-os');" tabindex="-1" role="menuitem">Last week</a></li>
                                                            <li role="presentation"><a onclick="smhStats.loadLastThirtyDaysGraph('os', 'count_plays', 'vod-bar-os');" tabindex="-1" role="menuitem">Last 30 days</a></li>
                                                            <li role="presentation"><a onclick="smhStats.loadThisMonthGraph('os', 'count_plays', 'vod-bar-os');" tabindex="-1" role="menuitem">This month</a></li>
                                                            <li role="presentation"><a onclick="smhStats.loadLastMonthGraph('os', 'count_plays', 'vod-bar-os');" tabindex="-1" role="menuitem">Last month</a></li>
                                                            <li role="presentation"><a onclick="smhStats.loadLastTwelveMonthGraph('os', 'count_plays', 'vod-bar-os');" tabindex="-1" role="menuitem">Last 12 months</a></li>
                                                            <li role="presentation"><a onclick="smhStats.loadThisYearGraph('os', 'count_plays', 'vod-bar-os');" tabindex="-1" role="menuitem">This year</a></li>
                                                        </ul>
                                                    </div>
                                                    <span class="vertical-line">&nbsp;</span>
                                                </div>
                                                <div class="date-range-sub">
                                                    <span id="custom-dates">
                                                        <span id="dates-title">Dates:</span>
                                                        <div class="input-group">
                                                            <div class="input-group-addon">
                                                                <i class="fa fa-calendar"></i>
                                                            </div>
                                                            <input type="text" class="date-picker5 form-control" id="date-picker-5">
                                                        </div>                                        
                                                    </span>                                                 
                                                </div>
                                                <div class="date-range-sub">
                                                    <span id="custom-dates">To
                                                        <div class="input-group" style="margin-left: 15px;">
                                                            <div class="input-group-addon">
                                                                <i class="fa fa-calendar"></i>
                                                            </div>
                                                            <input type="text" class="date-picker6 form-control" id="date-picker-6">
                                                        </div>
                                                    </span>&nbsp;&nbsp;&nbsp;<span id="graph-loading3">Loading..</span>                                                 
                                                </div>
                                            </span>                                         
                                        </div>
                                        <div class="col-md-2 col-sm-6 col-xs-12">
                                            <div class="pull-right" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhStats.exportCSV('os')">Export to CSV <img height="20px" src="/img/xls-icon.jpg" /></a></div>
                                        </div> 
                                    </div>
                                </div>
                                <div class="col-md-12" id="os-graph-wrapper">
                                    <span class="dropdown header">
                                        <div class="btn-group">
                                            <button class="btn btn-default dropdown-text" type="button"><span class="text">Plays</span></button>
                                            <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-expanded="true"><span class="caret"></span></button>
                                            <ul class="dropdown-menu" id="menu4" role="menu" aria-labelledby="dropdownMenu">
                                                <li role="presentation"><a role="menuitem" tabindex="-1">Plays</a></li>
                                                <li role="presentation"><a role="menuitem" tabindex="-1">Minutes Viewed</a></li>
                                                <li role="presentation"><a role="menuitem" tabindex="-1">Avg. View Time</a></li>
                                                <li role="presentation"><a role="menuitem" tabindex="-1">Player Impressions</a></li>                                        
                                            </ul>
                                        </div>
                                    </span>
                                    <div id="vod-bar-os-graph"></div>
                                </div>
                                <div class="col-md-12">
                                    <h2 class="page-header">Totals</h2>
                                </div>
                                <div class="col-md-12">
                                    <div class="col-sm-2 col-xs-6">
                                        <div class="description-block border-right">
                                            <span class="description-percentage text-green">Plays</span>
                                            <h5 class="description-header" id="plays">0</h5>
                                        </div>
                                    </div> 
                                    <div class="col-sm-2 col-xs-6">
                                        <div class="description-block border-right">
                                            <span class="description-percentage text-yellow">Minutes Viewed</span>
                                            <h5 class="description-header" id="minutes">00:00</h5>
                                        </div>
                                    </div> 
                                    <div class="col-sm-2 col-xs-6">
                                        <div class="description-block border-right">
                                            <span class="description-percentage text-green">Avg. View Time</span>
                                            <h5 class="description-header" id="time">00:00</h5>
                                        </div> 
                                    </div> 
                                    <div class="col-sm-2 col-xs-6">
                                        <div class="description-block border-right">
                                            <span class="description-percentage text-red">Player Impressions</span>
                                            <h5 class="description-header" id="impressions">0</h5>
                                        </div> 
                                    </div>
                                    <div class="col-sm-2 col-xs-6">
                                        <div class="description-block border-right">
                                            <span class="description-percentage text-green">Play to Impressions Ratio</span>
                                            <h5 class="description-header" id="ratio">0.00%</h5>
                                        </div> 
                                    </div>
                                    <div class="col-sm-2 col-xs-6">
                                        <div class="description-block">
                                            <span class="description-percentage text-orange">Avg. View Drop-off</span>
                                            <h5 class="description-header" id="drop">0.00%</h5>
                                        </div> 
                                    </div>
                                </div>
                                <div class="col-md-12" id="table-header">
                                    <h2 class="page-header">Details</h2>
                                </div>
                                <div class="col-md-12" id="table-body">
                                    <div id="os-dataTable"></div>
                                </div> 
                            </div>
                            <div style="position: relative; min-height: 1240px;" id="browsers" class="tab-pane">
                                <div class="col-md-12">
                                    <div class="row">
                                        <div class="col-md-10 col-sm-6 col-xs-12">
                                            <span id="date-range" class="dropdown header">
                                                <div class="date-range-sub">
                                                    <span id="datesrange-title">Date Range:</span>
                                                    <div class="btn-group">
                                                        <button class="btn btn-default filter-btn" type="button" style="width: 138px;"><span class="text">Last 30 days</span></button>
                                                        <button aria-expanded="true" data-toggle="dropdown" id="dropdownMenu2" type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button>
                                                        <ul aria-labelledby="dropdownMenu2" role="menu" id="menu2" class="dropdown-menu">
                                                            <li role="presentation"><a onclick="smhStats.loadYesterdayGraph('browser', 'count_plays', 'vod-bar-browser');" tabindex="-1" role="menuitem">Yesterday</a></li>
                                                            <li role="presentation"><a onclick="smhStats.loadLastSevenDaysGraph('browser', 'count_plays', 'vod-bar-browser');" tabindex="-1" role="menuitem">Last 7 days</a></li>
                                                            <li role="presentation"><a onclick="smhStats.loadThisWeekGraph('browser', 'count_plays', 'vod-bar-browser');" tabindex="-1" role="menuitem">This week</a></li>
                                                            <li role="presentation"><a onclick="smhStats.loadLastWeekGraph('browser', 'count_plays', 'vod-bar-browser');" tabindex="-1" role="menuitem">Last week</a></li>
                                                            <li role="presentation"><a onclick="smhStats.loadLastThirtyDaysGraph('browser', 'count_plays', 'vod-bar-browser');" tabindex="-1" role="menuitem">Last 30 days</a></li>
                                                            <li role="presentation"><a onclick="smhStats.loadThisMonthGraph('browser', 'count_plays', 'vod-bar-browser');" tabindex="-1" role="menuitem">This month</a></li>
                                                            <li role="presentation"><a onclick="smhStats.loadLastMonthGraph('browser', 'count_plays', 'vod-bar-browser');" tabindex="-1" role="menuitem">Last month</a></li>
                                                            <li role="presentation"><a onclick="smhStats.loadLastTwelveMonthGraph('browser', 'count_plays', 'vod-bar-browser');" tabindex="-1" role="menuitem">Last 12 months</a></li>
                                                            <li role="presentation"><a onclick="smhStats.loadThisYearGraph('browser', 'count_plays', 'vod-bar-browser');" tabindex="-1" role="menuitem">This year</a></li>
                                                        </ul>
                                                    </div>
                                                    <span class="vertical-line">&nbsp;</span>
                                                </div>
                                                <div class="date-range-sub">
                                                    <span id="custom-dates">
                                                        <span id="dates-title">Dates:</span>
                                                        <div class="input-group">
                                                            <div class="input-group-addon">
                                                                <i class="fa fa-calendar"></i>
                                                            </div>
                                                            <input type="text" class="date-picker7 form-control" id="date-picker-7">
                                                        </div>                                        
                                                    </span>                                                 
                                                </div>
                                                <div class="date-range-sub">
                                                    <span id="custom-dates">To
                                                        <div class="input-group" style="margin-left: 15px;">
                                                            <div class="input-group-addon">
                                                                <i class="fa fa-calendar"></i>
                                                            </div>
                                                            <input type="text" class="date-picker8 form-control" id="date-picker-8">
                                                        </div>
                                                    </span>&nbsp;&nbsp;&nbsp;<span id="graph-loading4">Loading..</span>                                                 
                                                </div>
                                            </span>                                         
                                        </div>
                                        <div class="col-md-2 col-sm-6 col-xs-12">
                                            <div class="pull-right" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhStats.exportCSV('browser')">Export to CSV <img height="20px" src="/img/xls-icon.jpg" /></a></div>
                                        </div> 
                                    </div>
                                </div>
                                <div class="col-md-12" id="browser-graph-wrapper">
                                    <span class="dropdown header">
                                        <div class="btn-group">
                                            <button class="btn btn-default dropdown-text" type="button"><span class="text">Plays</span></button>
                                            <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-expanded="true"><span class="caret"></span></button>
                                            <ul class="dropdown-menu" id="menu5" role="menu" aria-labelledby="dropdownMenu">
                                                <li role="presentation"><a role="menuitem" tabindex="-1">Plays</a></li>
                                                <li role="presentation"><a role="menuitem" tabindex="-1">Minutes Viewed</a></li>
                                                <li role="presentation"><a role="menuitem" tabindex="-1">Avg. View Time</a></li>
                                                <li role="presentation"><a role="menuitem" tabindex="-1">Player Impressions</a></li>                                        
                                            </ul>
                                        </div>
                                    </span>
                                    <div id="vod-bar-browser-graph"></div>
                                </div>
                                <div class="col-md-12">
                                    <h2 class="page-header">Totals</h2>
                                </div>
                                <div class="col-md-12">
                                    <div class="col-sm-2 col-xs-6">
                                        <div class="description-block border-right">
                                            <span class="description-percentage text-green">Plays</span>
                                            <h5 class="description-header" id="plays">0</h5>
                                        </div>
                                    </div> 
                                    <div class="col-sm-2 col-xs-6">
                                        <div class="description-block border-right">
                                            <span class="description-percentage text-yellow">Minutes Viewed</span>
                                            <h5 class="description-header" id="minutes">00:00</h5>
                                        </div>
                                    </div> 
                                    <div class="col-sm-2 col-xs-6">
                                        <div class="description-block border-right">
                                            <span class="description-percentage text-green">Avg. View Time</span>
                                            <h5 class="description-header" id="time">00:00</h5>
                                        </div> 
                                    </div> 
                                    <div class="col-sm-2 col-xs-6">
                                        <div class="description-block border-right">
                                            <span class="description-percentage text-red">Player Impressions</span>
                                            <h5 class="description-header" id="impressions">0</h5>
                                        </div> 
                                    </div>
                                    <div class="col-sm-2 col-xs-6">
                                        <div class="description-block border-right">
                                            <span class="description-percentage text-green">Play to Impressions Ratio</span>
                                            <h5 class="description-header" id="ratio">0.00%</h5>
                                        </div> 
                                    </div>
                                    <div class="col-sm-2 col-xs-6">
                                        <div class="description-block">
                                            <span class="description-percentage text-orange">Avg. View Drop-off</span>
                                            <h5 class="description-header" id="drop">0.00%</h5>
                                        </div> 
                                    </div>
                                </div>
                                <div class="col-md-12" id="table-header">
                                    <h2 class="page-header">Details</h2>
                                </div>
                                <div class="col-md-12" id="table-body">
                                    <div id="browser-dataTable"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div><!-- /.content-wrapper -->
@stop

@section('footer')
<script src="/js/jstz.min.js?v=1" type="text/javascript"></script>
<script src="/js/raphael-min.js?v=1" type="text/javascript"></script>
<script src="/js/morris.js?v=1" type="text/javascript"></script>
<script src="/js/date.min.js?v=1" type="text/javascript"></script>
<script src="/js/player.stats.systems.js?v=1" type="text/javascript"></script>
@stop