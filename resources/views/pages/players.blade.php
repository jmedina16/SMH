@extends('app')

@section('css') 
<link href="/css/jquery.mCustomScrollbar.css?v=1" rel="stylesheet"> 
<link href="/css/responsive.dataTables.min.css?v=1" rel="stylesheet"> 
<link href="/css/jquery.tree.css?v=1" rel="stylesheet"> 
<link href="/css/jquery.bootstrap-touchspin.css?v=1" rel="stylesheet">
@stop

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1><i class="fa fa-play"></i> Players</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li class="active">Players</li>
        </ol>
    </section>
    <!-- Main content -->
    <section class="content">
        @include('alerts')
        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper">  
                    <div id="page-header-body">
                        <div id="text">Control player size, color, fonts, and branding. Add or remove buttons, enable subtitles, sharing, and more.</div>
                        <div id="icon"><i class="fa fa-comments-o"></i></div>                      
                        <div class="clear"></div>                        
                    </div>                      
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="box" style="margin-bottom: 80px;">
                    <div class="box-header">
                        <div class="header rs-header">Players</div>
                        <div class="rs-right-header"><a href="#" id="refresh" onclick="smhPlayers.getPlayers();"><i class="fa fa-refresh"></i> Refresh</a></div>
                    </div>
                    <div class="box-body">
                        <div id="users-buttons">
                            <div style="display: inline-block; float: left;">
                                <span class="dropdown header">
                                    <div class="btn-group">
                                        <button class="btn bg-olive" type="button" {{ (in_array("STUDIO_ADD_UICONF", $permissions))? '' : 'disabled' }}><span class="text">Create Player</span></button>
                                        <button aria-expanded="true" data-toggle="dropdown" class="btn bg-olive dropdown-toggle" id="add-playlist" {{ (in_array("STUDIO_ADD_UICONF", $permissions))? '' : 'disabled' }}><span class="caret"></span></button>
                                        <ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu playlist-add">
                                            <li role="presentation"><a onclick="smhPlayers.addPlayer(6709438);" tabindex="-1" role="menuitem">Single Video Player</a></li>
                                            <li role="presentation"><a onclick="smhPlayers.addPlayer(6709439);" tabindex="-1" role="menuitem">Playlist Player</a></li>
                                            <!--                                            <li role="presentation"><a onclick="smhPlayers.addPlayer(6709440);" tabindex="-1" role="menuitem">Vertical Playlist Player</a></li>-->
                                            <li role="presentation"><a onclick="smhPlayers.addPlayer(6709441);" tabindex="-1" role="menuitem">Channel Playlist Player</a></li>
                                        </ul>
                                    </div>
                                </span>
                            </div>
                            <div style="display: inline-block; float: right;">
                                <div class="pull-left" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhPlayers.exportMetaData()">Export to Excel <img height="20px" src="/img/xls-icon.jpg"></a></div>
                                <span class="dropdown header">
                                    <div class="btn-group">
                                        <button class="btn btn-default dd-delete-btn" type="button" disabled=""><span class="text">Bulk Actions</span></button>
                                        <button aria-expanded="true" data-toggle="dropdown" id="dropdownMenu" type="button" class="btn btn-disabled dropdown-toggle dd-delete-btn" disabled=""><span class="caret"></span></button>
                                        <ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu playlist-bulk">
                                            <li role="presentation"><a onclick="smhPlayers.bulkDeleteModal();" tabindex="-1" role="menuitem">Delete</a></li>
                                        </ul>
                                    </div>
                                </span>
                            </div>
                        </div>
                        <div class="clear"></div>
                        <div id="players-table"></div>                       
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
</div><!-- /.content-wrapper -->
@stop

@section('footer')
<script src="/p/10364/sp/1036400/embedIframeJs/uiconf_id/6709438/partner_id/10364"></script>
<script src="/js/dataTables.responsive.min.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.mCustomScrollbar.min.js?v=1" type="text/javascript"></script>
<script src="/js/jstz.min.js?v=1" type="text/javascript"></script>
<script src="/js/qrcode.min.js?v=1" type="text/javascript"></script>
<script src="/js/KalturaEmbedCodeGeneratorPlayer.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.tree.js?v=1" type="text/javascript"></script>
<script src="/js/date.min.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.bootstrap-touchspin.js?v=1" type="text/javascript"></script>
<script src="/js/players.js?v=1.5" type="text/javascript"></script>
@stop