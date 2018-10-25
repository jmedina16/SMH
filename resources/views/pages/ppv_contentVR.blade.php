@extends('appVR')

@section('css') 
<link href="/css/bootstrap3-wysihtml5.min.css?v=1" rel="stylesheet">
<link href="/css/jquery.mCustomScrollbar.css?v=1" rel="stylesheet">
<link href="/css/jquery.tree.css?v=1" rel="stylesheet"> 
<link href="/css/bootstrap-datetimepicker.min.css?v=1" rel="stylesheet"> 
@stop

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1><i class="fa fa-film"></i> Content</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li>Pay Per View</li>
            <li class="active">Content</li>
        </ol>
    </section>
    <!-- Main content -->
    <section class="content">
        @include('alerts')
        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper">
                    <div id="page-header-body">
                        <div id="text">Easily setup your entries for pay-per-view by using the setup wizard.</div>
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
                        <div class="header rs-header">PPV Entries</div>
                        <div class="rs-right-header"><a href="#" id="refresh" onclick="smhPPV.getContent();"><i class="fa fa-refresh"></i> Refresh</a></div>
                    </div>
                    <div class="box-body">
                        <div id="users-buttons">
                            <div style="display: inline-block; float: left;">
                                <span class="dropdown header">
                                    <div class="btn-group">
                                        <button class="btn bg-olive" type="button"><span class="text">Add Entry</span></button>
                                        <button aria-expanded="true" data-toggle="dropdown" class="btn bg-olive dropdown-toggle" id="add-entry"><span class="caret"></span></button>
                                        <ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu playlist-add">
                                            <li role="presentation"><a onclick="smhPPV.addSingleEntry();" tabindex="-1" role="menuitem">Single Entry</a></li>
                                            <li role="presentation"><a onclick="smhPPV.addPlistEntry();" tabindex="-1" role="menuitem">Playlist</a></li>
                                            <!-- <li role="presentation"><a onclick="smhPPV.addCatEntry();" tabindex="-1" role="menuitem">Category</a></li>-->
                                        </ul>
                                    </div>
                                </span>
                            </div>
                            <div style="display: inline-block; float: right;">
                                <div class="pull-left" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhPPV.exportMetaData()">Export to Excel <img height="20px" src="/img/xls-icon.jpg"></a></div>
                            </div>  
                        </div>
                        <div class="clear"></div>
                        <div id="content-table"></div>                       
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
                <div class="modal-footer"></div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="smh-modal3" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog smh-dialog3">
            <div class="modal-content">
                <div class="modal-header"></div>
                <div class="modal-body"></div>
            </div>
        </div>
    </div>
</div>
@stop

@section('footer')
<script src="/js/bootstrap3-wysihtml5.all.min.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.mCustomScrollbar.min.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.cookie.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.bootstrap.wizard.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.tree.js?v=1" type="text/javascript"></script>
<script src="/js/jstz.min.js?v=1" type="text/javascript"></script>
<script src="/js/moment.min.js?v=1" type="text/javascript"></script>
<script src="/js/moment-timezone-with-data.min.js?v=1" type="text/javascript"></script>
<script src="/js/bootstrap-datetimepicker.min.js?v=1" type="text/javascript"></script>
<script src="/js/vr.ppv.content.js?v=1" type="text/javascript"></script>
@stop