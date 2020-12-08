@extends('app')

@section('css')
<link href="/css/morris.css?v=1" rel="stylesheet"> 
<link href="/css/jquery-jvectormap-2.0.2.css?v=1" rel="stylesheet"> 
<link href="/css/jquery.mCustomScrollbar.css?v=1" rel="stylesheet"> 
<link href="/css/bootstrap-datetimepicker.min.css?v=1" rel="stylesheet"> 
@stop

@section('content')

<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
<!--    <section class="content-header">
        <h1><i class="fa fa-dashboard"></i> Dashboard</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li class="active">Dashboard</li>
        </ol>
    </section>-->
    <!-- Main content -->
    <section class="content">
        @include('alerts')
        <h2 class="page-header">Storage, Data Transfer and Transcoding Usage Statistics..</h2>
        <div class="row">
            <div class="col-md-12">
                <div class="date-wrapper usage-year-picker" style="position: absolute;z-index: 2;right: 50px;top: 104px;">
                    <div class="input-group input-append date" id="datetimepicker1">
                        <input type="text" class="form-control" style="margin: auto; width: 80px; height: 41px; background-color: #F8F8F8;" readonly/>
                        <span class="input-group-addon">
                            <span class="glyphicon glyphicon-calendar"></span>
                        </span>
                    </div>
                </div>
                <div class="box nav-tabs-custom usage-tabs">
                    <ul class="nav nav-tabs pull-left ui-sortable-handle">
                        <li class="active"><a data-toggle="tab" href="#storage-usage" aria-expanded="true">Storage</a></li>
                        <li class=""><a data-toggle="tab" href="#bandwidth-usage" aria-expanded="false">Data Transfer</a></li>
                        <li class=""><a data-toggle="tab" href="#transcoding-usage" aria-expanded="false">Transcoding</a></li>
                    </ul>
                    <div class="box-body">
                        <div class="tab-content no-padding">
                            <div id="storage-usage" class="tab-pane active">
                                <div class="col-md-12">
                                    <div class="row" id="user-usage">
                                        <div class="col-md-3 col-sm-6 col-xs-12">
                                            <div class="info-box" style="background: #F9F9F9;">
                                                <span class="info-box-icon bg-aqua"><i class="fa fa-fw fa-database"></i></span>
                                                <div class="info-box-content">
                                                    <span class="info-box-text">TOTAL STORAGE <i data-placement="right" data-toggle="tooltip" data-delay='{"show":700, "hide":30}' data-original-title="Storage statistics are updated once a day" class="fa fa-question-circle"></i></span>
                                                    <span class="info-box-number" id="user-storage"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="clear"></div>
                                <div id="storage-graph"></div>
                            </div>
                            <div id="bandwidth-usage" class="tab-pane">
                                <div class="col-md-3 col-sm-6 col-xs-12">
                                    <div class="info-box" style="background: #F9F9F9;">
                                        <span class="info-box-icon bg-red"><i class="ion ion-arrow-swap"></i></span>
                                        <div class="info-box-content">
                                            <span class="info-box-text">DATA TRANSFER THIS MONTH <i data-placement="right" data-toggle="tooltip" data-delay='{"show":700, "hide":30}' data-original-title="Data transfer statistics are updated once a day" class="fa fa-question-circle"></i></span>
                                            <span class="info-box-number" id="user-transfer"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="clear"></div>
                                <div id="bandwidth-graph"></div>
                            </div>
                            <div id="transcoding-usage" class="tab-pane">
                                <div class="col-md-12">
                                    <div class="row" id="user-usage">
                                        <div class="col-md-3 col-sm-6 col-xs-12">
                                            <div class="info-box" style="background: #F9F9F9;">
                                                <span class="info-box-icon bg-custom"><i class="ion ion-fork-repo fa-rotate-90"></i></span>
                                                <div class="info-box-content">
                                                    <span class="info-box-text">TRANSCODED THIS MONTH 
                                                        <span class="info-box-number" id="user-transcoding"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="clear"></div>
                                <div class="col-md-11">
                                    <div id="transcoding-graph"></div>   
                                </div>    
                                <div class="col-md-1">
                                    <div class="row">
                                        <div class="tanscode-legend border-bottom" id="transcode-legend-sd">
                                            <span class="description-percentage">SD Video</span>  
                                            <h5 class="description-header" id="transcode-sd"></h5>
                                        </div>                                        
                                    </div>
                                    <div class="row">
                                        <div class="tanscode-legend border-bottom" id="transcode-legend-hd">
                                            <span class="description-percentage">HD Video</span>  
                                            <h5 class="description-header" id="transcode-hd"></h5>
                                        </div>  
                                    </div>
                                    <div class="row">
                                        <div class="tanscode-legend border-bottom" id="transcode-legend-uhd">
                                            <span class="description-percentage">UHD Video</span>  
                                            <h5 class="description-header" id="transcode-uhd"></h5>
                                        </div>  
                                    </div>
                                    <div class="row">
                                        <div class="tanscode-legend" id="transcode-legend-audio">
                                            <span class="description-percentage">Audio Only</span>  
                                            <h5 class="description-header" id="transcode-audio"></h5>
                                        </div>  
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        @if (in_array("ANALYTICS_BASE", $permissions))
        <h2 class="page-header">Player Statistics <i style="font-size: 14px; position: relative; top: -1px;" data-placement="right" data-toggle="tooltip" data-delay='{"show":700, "hide":30}' data-original-title="Player statistics are updated once a day" class="fa fa-question-circle"></i>
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
        <h2 class="page-header">Information</h2>
        <div class="row">
            <div class="col-md-6">
                <div class="box">
                    <div class="box-header">
                        <div class="header"><i class="fa fa-book"></i> Tutorials</div>
                    </div>
                    <div class="box-body">
                        <div class="row">
                            <div id="tutvids"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="nav-tabs-custom">
                    <ul class="nav nav-tabs pull-right ui-sortable-handle">
                        <li class=""><a data-toggle="tab" href="#inactive-features" aria-expanded="true">Inactive</a></li>
                        <li class="active"><a data-toggle="tab" href="#active-features" aria-expanded="false">Active</a></li>
                        <li class="pull-left header"><i class="fa fa-th"></i> Features</li>
                    </ul>
                    <div class="tab-content no-padding">
                        <div style="position: relative; height: 474px;" id="active-features" class="tab-pane active">
                            <div id="active-content">
                                <ul class="products-list product-list-in-box">
                                    <li class="item">
                                        <div class="product-img"><i class="fa fa-film"></i></div>
                                        <div class="product-info">
                                            <div class="product-title">Content Manager</div>
                                            <span class="product-description">
                                                Full media management tool where publishers organize and track their rich-media content.
                                            </span>
                                        </div>
                                    </li>
                                    <li class="item">
                                        <div class="product-img"><i class="fa fa-play"></i></div>
                                        <div class="product-info">
                                            <div class="product-title">Player Creation</div>
                                            <span class="product-description">
                                                Control player size, color, fonts, and branding. Add or remove buttons, enable subtitles, sharing, and more.
                                            </span>
                                        </div>
                                    </li>
                                    <li class="item">
                                        <div class="product-img"><i class="fa fa-th-list"></i></div>
                                        <div class="product-info">
                                            <div class="product-title">Playlists</div>
                                            <span class="product-description">
                                                Create manually or dynamically generated playlists.
                                            </span>
                                        </div>
                                    </li>
                                    <li class="item">
                                        <div class="product-img"><i class="fa fa-th"></i></div>
                                        <div class="product-info">
                                            <div class="product-title">Categories</div>
                                            <span class="product-description">
                                                Categories are built in a tree-like hierarchy where each category can include multiple sub-categories. You can add, assign, remove and edit categories from the Categories section.
                                            </span>
                                        </div>
                                    </li>
                                    <li class="item">
                                        <div class="product-img"><i class="fa fa-lock"></i></div>
                                        <div class="product-info">
                                            <div class="product-title">Access Control</div>
                                            <span class="product-description">
                                                Authorized and restricted domains, countries, IP addresses, flavors and advanced security settings such as protection with token authentication.
                                            </span>
                                        </div>
                                    </li>
                                    <li class="item">
                                        <div class="product-img"><i class="fa fa-wifi"></i></div>
                                        <div class="product-info">
                                            <div class="product-title">Live Stream</div>
                                            <span class="product-description">
                                                Create, broadcast, and manage live streams.
                                            </span>
                                        </div>
                                    </li>
                                    <li class="item">
                                        <div class="product-img"><i class="fa fa-cloud-upload"></i></div>
                                        <div class="product-info">
                                            <div class="product-title">Upload</div>
                                            <span class="product-description">
                                                Upload and ingest video, audio, and images. Bulk or individual file uploads via your browser.
                                            </span>
                                        </div>
                                    </li>
                                    <!--                                    <li class="item">
                                                                            <div class="product-img"><i class="fa fa-line-chart"></i></div>
                                                                            <div class="product-info">
                                                                                <div class="product-title">Real-time Statistics</div>
                                                                                <span class="product-description">
                                                                                    View real-time statistics of your live streams.
                                                                                </span>
                                                                            </div>
                                                                        </li>-->
                                    <li class="item">
                                        <div class="product-img"><i class="fa fa-bar-chart-o"></i></div>
                                        <div class="product-info">
                                            <div class="product-title">Analytics</div>
                                            <span class="product-description">
                                                Analyze metrics and usage reports.
                                            </span>
                                        </div>
                                    </li>
                                    <li class="item">
                                        <div class="product-img"><i class="fa fa-user"></i></div>
                                        <div class="product-info">
                                            <div class="product-title">Administration</div>
                                            <span class="product-description">
                                                Manage users with various levels of access to your account.
                                            </span>
                                        </div>
                                    </li>
                                    <li class="item">
                                        <div class="product-img"><i class="fa fa-question-circle"></i></div>
                                        <div class="product-info">
                                            <div class="product-title">Help</div>
                                            <span class="product-description">
                                                Open a new support ticket or check the status of an existing one.
                                            </span>
                                        </div>
                                    </li>
                                    @if (Auth::user()->mb == 1)
                                    <li class="item">
                                        <div class="product-img"><i class="fa fa-mobile"></i></div>
                                        <div class="product-info">
                                            <div class="product-title">Mobile Streaming</div>
                                            <span class="product-description">
                                                Live and On-Demand streaming to mobile devices.
                                            </span>
                                        </div>
                                    </li>
                                    @endif
                                    @if (Auth::user()->trans_vod == 1)
                                    <li class="item">
                                        <div class="product-img"><i class="fa fa-share-alt"></i></div>
                                        <div class="product-info">
                                            <div class="product-title">Transcoding</div>
                                            <span class="product-description">
                                                Convert videos into multiple flavors (optimized output files).
                                            </span>
                                        </div>
                                    </li>
                                    @endif
                                    @if (Auth::user()->ppv == 1)
                                    <li class="item">
                                        <div class="product-img"><i class="fa fa-ticket"></i></div>
                                        <div class="product-info">
                                            <div class="product-title">Pay Per View</div>
                                            <span class="product-description">
                                                Centrally manage, publish and monetize your content.
                                            </span>
                                        </div>
                                    </li>
                                    @endif
                                    @if (Auth::user()->membership == 1)
                                    <li class="item">
                                        <div class="product-img"><i class="fa fa-users"></i></div>
                                        <div class="product-info">
                                            <div class="product-title">Membership</div>
                                            <span class="product-description">
                                                Manage membership accounts and protected content.
                                            </span>
                                        </div>
                                    </li>
                                    @endif                                    
                                    @if (Auth::user()->rs == 1 && Auth::user()->child == 0)
                                    <li class="item">
                                        <div class="product-img"><i class="fa fa-users"></i></div>
                                        <div class="product-info">
                                            <div class="product-title">Reseller</div>
                                            <span class="product-description">
                                                Resell our services.
                                            </span>
                                        </div>
                                    </li>
                                    @endif
                                    @if (Auth::user()->vc == 1)
                                    <li class="item">
                                        <div class="product-img"><i class="fa fa-video-camera"></i></div>
                                        <div class="product-info">
                                            <div class="product-title">Video Chat</div>
                                            <span class="product-description">
                                                Embed the video chat client on your site.
                                            </span>
                                        </div>
                                    </li>
                                    @endif
                                    @if (Auth::user()->wl == 1)
                                    <li class="item">
                                        <div class="product-img"><i class="fa fa-tag"></i></div>
                                        <div class="product-info">
                                            <div class="product-title">Platform White Label</div>
                                            <span class="product-description">
                                                Modify the look of the Platform.
                                            </span>
                                        </div>
                                    </li>
                                    @endif
                                </ul>
                            </div>
                        </div>
                        <div style="position: relative; height: 474px;" id="inactive-features" class="tab-pane">
                            <div style="height: 474px; padding: 20px;">
                                <div id="inactive-content">
                                    @if (Auth::user()->mb == 1 && Auth::user()->trans_vod == 1 && Auth::user()->ppv == 1&& Auth::user()->rs == 1 && Auth::user()->vc == 1)
                                    <p class="text-center">
                                        <strong>All features have been activated.</strong>
                                    </p>
                                    @else
                                    <p class="text-center">
                                        <strong>Contact our sales team to enable any of the features below. <a href="mailto:sales@streamingmediahosting.com?Subject=Feature%20Request">Contact Us</a></strong>
                                    </p>
                                    <ul class="products-list product-list-in-box">
                                        @if (Auth::user()->mb == 0)
                                        <li class="item">
                                            <div class="product-img"><i class="fa fa-mobile"></i></div>
                                            <div class="product-info">
                                                <div class="product-title">Mobile Streaming</div>
                                                <span class="product-description">
                                                    Live and On-Demand streaming to mobile devices.
                                                </span>
                                            </div>
                                        </li>
                                        @endif
                                        @if (Auth::user()->trans_vod == 0)
                                        <li class="item">
                                            <div class="product-img"><i class="fa fa-share-alt"></i></div>
                                            <div class="product-info">
                                                <div class="product-title">Transcoding</div>
                                                <span class="product-description">
                                                    Convert videos into multiple flavors (optimized output files).
                                                </span>
                                            </div>
                                        </li>
                                        @endif
                                        @if (Auth::user()->ppv == 0)
                                        <li class="item">
                                            <div class="product-img"><i class="fa fa-ticket"></i></div>
                                            <div class="product-info">
                                                <div class="product-title">Pay Per View</div>
                                                <span class="product-description">
                                                    Centrally manage, publish and monetize your content.
                                                </span>
                                            </div>
                                        </li>
                                        @endif
                                        @if (Auth::user()->membership == 0)
                                        <li class="item">
                                            <div class="product-img"><i class="fa fa-users"></i></div>
                                            <div class="product-info">
                                                <div class="product-title">Membership</div>
                                                <span class="product-description">
                                                    Manage membership accounts and protected content.
                                                </span>
                                            </div>
                                        </li>
                                        @endif                                         
                                        @if (Auth::user()->rs == 0 && Auth::user()->child == 0)
                                        <li class="item">
                                            <div class="product-img"><i class="fa fa-users"></i></div>
                                            <div class="product-info">
                                                <div class="product-title">Reseller</div>
                                                <span class="product-description">
                                                    Resell our services.
                                                </span>
                                            </div>
                                        </li>
                                        @endif
                                        @if (Auth::user()->vc == 0)
                                        <li class="item">
                                            <div class="product-img"><i class="fa fa-video-camera"></i></div>
                                            <div class="product-info">
                                                <div class="product-title">Video Chat</div>
                                                <span class="product-description">
                                                    Embed the video chat client on your site.
                                                </span>
                                            </div>
                                        </li>
                                        @endif
                                        @if (Auth::user()->wl == 0)
                                        <li class="item">
                                            <div class="product-img"><i class="fa fa-tag"></i></div>
                                            <div class="product-info">
                                                <div class="product-title">Platform White Label</div>
                                                <span class="product-description">
                                                    Modify the look of the Platform.
                                                </span>
                                            </div>
                                        </li>
                                        @endif
                                    </ul>
                                    @endif
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

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
<script src="/js/moment.min.js?v=1" type="text/javascript"></script>
<script src="/js/moment-timezone-with-data.min.js?v=1" type="text/javascript"></script>
<script src="/js/bootstrap-datetimepicker.min.js?v=1" type="text/javascript"></script>
<script src="/js/dashboard.js?v=1" type="text/javascript"></script>
@stop
