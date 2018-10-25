@extends('appVR')

@section('css') 
<link href="/css/jquery.mCustomScrollbar.css?v=1" rel="stylesheet"> 
<link href="/css/responsive.dataTables.min.css?v=1" rel="stylesheet"> 
<link href="/css/jquery.tree.css?v=1" rel="stylesheet"> 
<link href="/css/jquery.bootstrap-touchspin.css?v=1" rel="stylesheet">
<link href="/css/dhtmlxscheduler_flat.css?v=1" rel="stylesheet">
<link href="/css/bootstrap-toggle.min.css?v=1" rel="stylesheet"> 
<link href="/css/bootstrap-datetimepicker.min.css?v=1" rel="stylesheet"> 
<link href="/css/jquery.ui.spinner.css?v=1" rel="stylesheet">
@stop

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1><i class="fa fa-toggle-right"></i> Channel Manager</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li class="active">Channel Manager</li>
        </ol>
    </section>
    <!-- Main content -->
    <section class="content">
        @include('alerts')
        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper">  
                    <div id="page-header-body">
                        <div id="text">Create programs and schedule them to occur multiple times a week, or create recurring events from a simple-to-use interface.</div>
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
                        <div class="header rs-header">Channels <div id="channel-user-guide"><a href="/user_guide/smh_channel_manager_user_guide.pdf" target="_blank">User Guide <i class="fa fa-external-link" style="width: 100%; text-align: center; display: inline; font-size: 12px;"></i></a></div></div>
                        <div class="rs-right-header"><a href="#" id="refresh" onclick="smhCM.refresh_schedule();"><i class="fa fa-refresh"></i> Refresh</a></div>
                    </div>
                    <div class="box-body">
                        <div id="users-buttons" style="position:  absolute; top: 64px; z-index: 1000; left: 16px;">
                            <div style="display: inline-block; float: left;">
                                <span style="display: inline-block; float: left;"><button class="btn btn-block bg-olive" id="add-channel" onclick="smhCM.addChannel();" {{ (in_array("LIVE_STREAM_ADD", $permissions))? '' : 'disabled' }}>Create Channel</button></span>
                                <span style="display: inline-block; float: left;" id="channel-search"><label>Search:<input type="search" class="" placeholder=""></label></span>
                                <span class="dropdown header dropdown-accordion">
                                    <div class="btn-group">
                                        <button class="btn btn-default filter-btn" type="button"><span class="text">Filters</span></button>
                                        <button aria-expanded="false" data-toggle="dropdown" id="dropdownMenu" type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button> 
                                        <ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu dropdown-filter">
                                            <li role="presentation">
                                                <div class="panel-group" id="accordion">
                                                    <div class="panel panel-default">
                                                        <div class="panel-heading">
                                                            <h4 class="panel-title">
                                                                <a href="#collapseOne" data-toggle="collapse" data-parent="#accordion">
                                                                    Filter by Categories
                                                                </a>
                                                            </h4>
                                                        </div>
                                                        <div class="panel-collapse collapse in" id="collapseOne">
                                                            <div class="panel-body">
                                                                <div id="tree1">
                                                                    <div class="filter-header">
                                                                        <ul>
                                                                            <li>
                                                                                <div class="checkbox"><label><input type="checkbox" value="all" class="cat_all" checked> <b>All Categories</b></label></div>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                    <div class="filter-body cat-filter"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="panel panel-default">
                                                        <div class="panel-heading">
                                                            <h4 class="panel-title">
                                                                <a href="#collapseTwo" data-toggle="collapse" data-parent="#accordion">
                                                                    Additional Filters
                                                                </a>
                                                            </h4>
                                                        </div>
                                                        <div class="panel-collapse collapse" id="collapseTwo">
                                                            <div class="panel-body">
                                                                <div id="tree2">
                                                                    <div id="filter-header">
                                                                        <ul>
                                                                            <li>
                                                                                <div class="checkbox"><label><input type="checkbox" value="all" class="ac_all" checked> <b>All Access Control Profiles</b></label></div>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                    <div class="filter-body ac-filter"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </span>
                            </div>
                        </div>
                        <div class="clear"></div>
                        <!--                        <div id="channel-table"></div> -->
                        <div style="height: 700px">
                            <div id="scheduler" class="dhx_cal_container" style='width:100%; height:100%;'>
                                <div class="dhx_cal_navline">
                                    <div class="preview_embed_schedule" title="Preview & Embed" onclick="smhCM.previewEmbedSchedule();"><i class="fa fa-code"></i></div>
                                    <div class="scheduler_zoom_out" title="Zoom Out" onclick="smhCM.zoomOut();"><i class="fa fa-search-minus" aria-hidden="true"></i></div>
                                    <div class="scheduler_zoom_in" title="Zoom In" onclick="smhCM.zoomIn();"><i class="fa fa-search-plus" aria-hidden="true"></i></div>
                                    <div class="dhx_cal_prev_button">&nbsp;</div>
                                    <div class="dhx_cal_next_button">&nbsp;</div>
                                    <div id="time-zone-wrapper">Your Time Zone: <span id="time-zone"></span> <a onclick="smhCM.changeZone();">Change Time Zone</a></div>
                                    <div class="dhx_cal_date"></div>
                                    <div class="dhx_minical_icon" id="dhx_minical_icon" onclick="smhCM.show_minical()" style="left: 190px;">&nbsp;</div>
                                </div>
                                <div class="dhx_cal_header">
                                </div>
                                <div class="dhx_cal_data">
                                </div>		
                            </div>  
                        </div>                          
                    </div>
                </div>
            </div>
        </div>      
    </section>
    <!-- Modal -->
    <div class="modal fade" id="smh-modal2" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog smh-dialog2">
            <div class="modal-content">
                <div class="modal-header"></div>
                <div class="modal-body"></div>
                <div class="clear"></div>
                <div class="modal-footer"></div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="smh-modal3" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog smh-dialog3">
            <div class="modal-content">
                <div class="modal-header"></div>
                <div class="modal-body"></div>
                <div class="clear"></div>
                <div class="modal-footer"></div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="smh-modal4" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog smh-dialog4">
            <div class="modal-content">
                <div class="modal-header"></div>
                <div class="modal-body"></div>
            </div>
        </div>
    </div>
</div><!-- /.content-wrapper -->
@stop

@section('footer')
<script src="/js/dataTables.responsive.min.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.mCustomScrollbar.min.js?v=1" type="text/javascript"></script>
<script src="/js/jstz.min.js?v=1" type="text/javascript"></script>
<script src="/js/moment.min.js?v=1" type="text/javascript"></script>
<script src="/js/moment-timezone-with-data.min.js?v=1" type="text/javascript"></script>
<script src="/js/rrule.js?v=1" type="text/javascript"></script>
<script src="/js/bootstrap-datetimepicker.min.js?v=1" type="text/javascript"></script>
<script src="/js/KalturaEmbedCodeGenerator.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.tree.js?v=1" type="text/javascript"></script>
<script src="/js/date.min.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.bootstrap-touchspin.js?v=1" type="text/javascript"></script>
<script src="/js/bootstrap-toggle.min.js?v=1" type="text/javascript"></script>
<script src="/js/qrcode.min.js?v=1" type="text/javascript"></script>
<script src="/js/dhtmlxscheduler.js?v=1.5" type="text/javascript"></script>
<script src="/js/dhtmlxscheduler_limit.js?v=1.5" type="text/javascript"></script>
<script src="/js/dhtmlxscheduler_timeline.js?v=1.5" type="text/javascript"></script>
<script src="/js/dhtmlxscheduler_minical.js?v=1.5" type="text/javascript"></script>
<script src="/js/dhtmlxscheduler_collision.js?v=1.5" type="text/javascript"></script>
<script src="/js/dhtmlxscheduler_tooltip.js?v=1.5" type="text/javascript"></script>
<script src="/js/dhtmlxscheduler_container_autoresize.js?v=1.5" type="text/javascript"></script>
<script src="/js/dhtmlxscheduler_recurring.js?v=1.5" type="text/javascript"></script>
<script src="/js/jquery.dotdotdot.js?v=1.5" type="text/javascript"></script>
<script src="/js/datatable.ellipsis.js?v=1.5" type="text/javascript"></script>
<script src="/js/jquery.ui.spinner.js?v=1" type="text/javascript"></script>
<script src="/js/channel_manager.js?v=1.5" type="text/javascript"></script>
@stop