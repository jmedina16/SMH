@extends('appVR')

@section('css')
<link href="/css/jquery-jvectormap-2.0.2.css?v=1" rel="stylesheet"> 
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
            <li class="active">Geographic Distribution</li>
        </ol>
    </section>
    <!-- Main content -->
    <section class="content">
        @include('alerts')
        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper">  
                    <div id="page-header-body">
                        <div id="text">Geographic Distribution displays data for play-through according to geographic location.</div>
                        <div id="icon"><i class="fa fa-comments-o"></i></div>                      
                        <div class="clear"></div>                        
                    </div>                      
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="box">
                    <div class="box-header">
                        <div class="header">Geographic Distribution</div>
                    </div>
                    <div class="box-body">
                        <div class="col-md-12">
                            <div class="row">
                                <div class="col-md-10 col-sm-6 col-xs-12">
                                    <span id="date-range" class="dropdown header">
                                        <div class="date-range-sub">
                                            <span id="datesrange-title">Date Range:</span>
                                            <div class="btn-group">
                                                <button class="btn btn-default filter-btn" type="button" style="width: 138px;"><span class="text">Last 30 days</span></button>
                                                <button aria-expanded="true" data-toggle="dropdown" id="dropdownMenu2" type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button>
                                                <ul aria-labelledby="dropdownMenu2" role="menu" id="menu1" class="dropdown-menu">
                                                    <li role="presentation"><a onclick="smhStats.loadYesterdayMap();" tabindex="-1" role="menuitem">Yesterday</a></li>
                                                    <li role="presentation"><a onclick="smhStats.loadLastSevenDaysMap();" tabindex="-1" role="menuitem">Last 7 days</a></li>
                                                    <li role="presentation"><a onclick="smhStats.loadThisWeekMap();" tabindex="-1" role="menuitem">This week</a></li>
                                                    <li role="presentation"><a onclick="smhStats.loadLastWeekMap();" tabindex="-1" role="menuitem">Last week</a></li>
                                                    <li role="presentation"><a onclick="smhStats.loadLastThirtyDaysMap();" tabindex="-1" role="menuitem">Last 30 days</a></li>
                                                    <li role="presentation"><a onclick="smhStats.loadThisMonthMap();" tabindex="-1" role="menuitem">This month</a></li>
                                                    <li role="presentation"><a onclick="smhStats.loadLastMonthMap();" tabindex="-1" role="menuitem">Last month</a></li>
                                                    <li role="presentation"><a onclick="smhStats.loadLastTwelveMonthMap();" tabindex="-1" role="menuitem">Last 12 months</a></li>
                                                    <li role="presentation"><a onclick="smhStats.loadThisYearMap();" tabindex="-1" role="menuitem">This year</a></li>
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
                                            </span>&nbsp;&nbsp;&nbsp;<span id="graph-loading1">Loading..</span>                                             
                                        </div>
                                    </span>
                                </div>                                   
                                <div class="col-md-2 col-sm-6 col-xs-12">
                                    <div class="pull-right" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhStats.exportCSV()">Export to CSV <img height="20px" src="/img/xls-icon.jpg" /></a></div>
                                </div> 
                            </div>
                        </div>
                        <div class="col-md-12" id="geo-graph">
                            <div id="geo-dist-map"></div>
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
                                    <span class="description-percentage text-yellow">25% Play-through</span>
                                    <h5 class="description-header" id="tweentyfive">0</h5>
                                </div><!-- /.description-block -->
                            </div><!-- /.col -->
                            <div class="col-sm-2 col-xs-6">
                                <div class="description-block border-right">
                                    <span class="description-percentage text-green">50% Play-through</span>
                                    <h5 class="description-header" id="fifty">0</h5>
                                </div><!-- /.description-block -->
                            </div><!-- /.col -->
                            <div class="col-sm-2 col-xs-6">
                                <div class="description-block border-right">
                                    <span class="description-percentage text-red">75% Play-through</span>
                                    <h5 class="description-header" id="seventyfive">0</h5>
                                </div><!-- /.description-block -->
                            </div>
                            <div class="col-sm-2 col-xs-6">
                                <div class="description-block border-right">
                                    <span class="description-percentage text-green">100% Play-through</span>
                                    <h5 class="description-header" id="onehundred">0</h5>
                                </div><!-- /.description-block -->
                            </div>
                            <div class="col-sm-2 col-xs-6">
                                <div class="description-block">
                                    <span class="description-percentage text-orange">Play-through Ratio</span>
                                    <h5 class="description-header" id="ratio">0.00%</h5>
                                </div><!-- /.description-block -->
                            </div>
                        </div>
                        <div class="col-md-12" id="table-header">
                            <h2 class="page-header">Details</h2>
                        </div>
                        <div class="col-md-12" id="table-body">
                            <div id="geo-dataTable"></div>
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
<script src="/js/date.min.js?v=1" type="text/javascript"></script>
<script src="/js/jquery-jvectormap-2.0.2.min.js?v=1" type="text/javascript"></script>
<script src="/js/jquery-jvectormap-world-mill-en.js?v=1" type="text/javascript"></script>
<script src="/js/player.stats.geo.js?v=1" type="text/javascript"></script>
@stop