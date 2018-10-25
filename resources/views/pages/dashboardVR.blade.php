@extends('appVR')

@section('css')
<link href="/css/morris.css?v=1" rel="stylesheet"> 
<link href="/css/jquery-jvectormap-2.0.2.css?v=1" rel="stylesheet"> 
<link href="/css/jquery.mCustomScrollbar.css?v=1" rel="stylesheet"> 
@stop

@section('content')

<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Main content -->
    <section class="content">
        @include('alerts')
        <div class="row">
            <div class="col-md-12">
                <div class="row" id="user-usage">
                    <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="info-box">
                            <span class="info-box-icon bg-aqua"><i class="fa fa-fw fa-database"></i></span>
                            <div class="info-box-content">
                                <span class="info-box-text">STORAGE USED <i data-placement="right" data-toggle="tooltip" data-delay='{"show":700, "hide":30}' data-original-title="Storage statistics are updated once a day" class="fa fa-question-circle"></i></span>
                                <span class="info-box-number" id="user-storage"></span>
                            </div><!-- /.info-box-content -->
                        </div><!-- /.info-box -->
                    </div>
                    <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="info-box">
                            <span class="info-box-icon bg-red"><i class="ion ion-arrow-swap"></i></span>
                            <div class="info-box-content">
                                <span class="info-box-text">DATA TRANSFER <i data-placement="right" data-toggle="tooltip" data-delay='{"show":700, "hide":30}' data-original-title="Data transfer statistics are updated once a day" class="fa fa-question-circle"></i></span>
                                <span class="info-box-number" id="user-transfer"></span>
                            </div><!-- /.info-box-content -->
                        </div><!-- /.info-box -->
                    </div>
                    <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="info-box">
                            <span class="info-box-icon bg-custom"><i class="ion ion-ios-film-outline"></i></span>
                            <div class="info-box-content">
                                <span class="info-box-text">ON DEMAND ENTRIES</span>
                                <span class="info-box-number" id="user-vod"></span>
                            </div><!-- /.info-box-content -->
                        </div><!-- /.info-box -->
                    </div>
                    <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="info-box">
                            <span class="info-box-icon bg-yellow"><i class="ion ion-radio-waves"></i></span>
                            <div class="info-box-content">
                                <span class="info-box-text">LIVE STREAM ENTRIES</span>
                                <span class="info-box-number" id="user-live"></span>
                            </div><!-- /.info-box-content -->
                        </div><!-- /.info-box -->
                    </div>
                </div>
            </div>
        </div>
        @if (in_array("ANALYTICS_BASE", $permissions))
        <h2 class="page-header">Statistics <i style="font-size: 14px; position: relative; top: -1px;" data-placement="right" data-toggle="tooltip" data-delay='{"show":700, "hide":30}' data-original-title="Player statistics are updated once a day" class="fa fa-question-circle"></i>
            <div style="margin-top: 10px;">
                <a class="btn bg-olive" href="player_stats/content_reports" type="button">View All Reports</a>
            </div>
        </h2>
        <div class="row" id="top_content-graph">
            <div class="col-md-12">
                <div class="box">
                    <div class="box-header">
                        <div class="header"><i class="fa fa-film"></i> Top Content</div>
                    </div>
                    <div class="box-body no-padding">
                        <div class="row">
                            <div class="col-md-10">
                                <span class="dropdown header">
                                    <div class="btn-group">
                                        <button class="btn btn-default dropdown-text" type="button">Plays</button>
                                        <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-expanded="true"><span class="caret"></span></button>
                                        <ul class="dropdown-menu" id="menu" role="menu" aria-labelledby="dropdownMenu">
                                            <li role="presentation"><a role="menuitem" tabindex="-1">Plays</a></li>
                                            <li role="presentation"><a role="menuitem" tabindex="-1">Minutes Viewed</a></li>
                                            <li role="presentation"><a role="menuitem" tabindex="-1">Avg. View Time</a></li>
                                            <li role="presentation"><a role="menuitem" tabindex="-1">Player Impressions</a></li>                                        
                                        </ul>
                                    </div>
                                </span>&nbsp;&nbsp;&nbsp;<span id="graph-loading">Loading..</span>
                                <div id="vodEntries"></div>
                            </div>
                            <div class="col-md-2">
                                <div id="totals-wrapper" class="pad box-pane-right bg-custom">
                                    <div class="total-item">
                                        <div class="description-block">
                                            <span class="description-percentage">Plays</span>
                                            <h5 class="description-header" id="plays"></h5>
                                        </div><!-- /.description-block -->
                                    </div>
                                    <div class="total-item">
                                        <div class="description-block">
                                            <span class="description-percentage">Minutes Viewed</span>
                                            <h5 class="description-header" id="minutes"></h5>
                                        </div><!-- /.description-block -->
                                    </div>
                                    <div class="total-item">
                                        <div class="description-block">
                                            <span class="description-percentage">Avg. View Time</span>
                                            <h5 class="description-header" id="time"></h5>
                                        </div><!-- /.description-block -->
                                    </div>
                                    <div class="total-item">
                                        <div class="description-block">
                                            <span class="description-percentage">Player Impressions</span>
                                            <h5 class="description-header" id="impressions"></h5>
                                        </div><!-- /.description-block -->
                                    </div>
                                    <div class="total-item">
                                        <div class="description-block">
                                            <span class="description-percentage">Play to Impressions Ratio</span>
                                            <h5 class="description-header" id="ratio"></h5>
                                        </div><!-- /.description-block -->
                                    </div>
                                    <div class="total-item">
                                        <div class="description-block">
                                            <span class="description-percentage">Avg. View Drop-off</span>
                                            <h5 class="description-header" id="drop"></h5>
                                        </div><!-- /.description-block -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" id="live-graph">
            <div class="col-md-6">
                <div class="box">
                    <div class="box-header">
                        <div class="header"><i class="fa fa-wifi"></i> Live Streams</div>
                    </div>
                    <div class="box-body no-padding">
                        <div class="row">
                            <div class="col-md-12">
                                <p id="ls-plays" class="text-center">
                                    <strong>0 Plays</strong>
                                </p>
                                <div id="liveEntries"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="box">
                    <div class="box-header">
                        <div class="header"><i class="fa fa-globe"></i> Geographic Distribution</div>
                    </div>
                    <div class="box-body no-padding">
                        <div class="row">
                            <div class="col-md-12">
                                <div id="geo-wrapper">
                                    <div id="geo-dist"></div>
                                </div>                                 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        @endif

    </section><!-- /.content -->
</div><!-- /.content-wrapper -->

@stop

@section('footer')
<script src="/js/raphael-min.js?v=1" type="text/javascript"></script>
<script src="/js/morris.js?v=1" type="text/javascript"></script>
<script src="/js/date.min.js?v=1" type="text/javascript"></script>
<script src="/js/jquery-jvectormap-2.0.2.min.js?v=1" type="text/javascript"></script>
<script src="/js/jquery-jvectormap-world-mill-en.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.mCustomScrollbar.min.js?v=1" type="text/javascript"></script>
<script src="/js/vr.dashboard.js?v=1" type="text/javascript"></script>
@stop