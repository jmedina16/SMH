@extends('app')

@section('css') 
<link href="/css/jquery.mCustomScrollbar.css?v=1" rel="stylesheet"> 
@stop

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
<!--    <section class="content-header">
        <h1><i class="fa fa-cog"></i> VOD Transcoding</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li class="active">VOD Transcoding</li>
        </ol>
    </section>-->
    <!-- Main content -->
    <section class="content">
        @include('alerts')
<!--        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper">
                    <div id="page-header-body">
                        <div id="text">A Transcoding Profile may be comprised of a single flavor or multiple flavors. Flavors are transcoded versions of an entry that are used to specify resolutions and formats. They are made from taking an encoded piece of video and then converting it into one or more newly and more compressed streams that can then be played in a player on a computer or mobile device depending on the settings and methods used.</div>
                        <div id="icon"><i class="fa fa-comments-o"></i></div>                      
                        <div class="clear"></div>                        
                    </div>                      
                </div>
            </div>
        </div>-->
        <div class="row">
            <div class="col-md-12">
                <div class="box">
                    <div class="box-header">
                        <div class="header rs-header">Profiles</div>
                        <div class="rs-right-header"><a href="#" id="refresh" onclick="smhTrans.getTransProfiles();"><i class="fa fa-refresh"></i> Refresh</a></div>
                    </div>
                    <div class="box-body">
                        <div id="users-buttons">
                            <div style="display: inline-block; float: left;">
                                <button class="btn btn-block bg-olive" id="add-ac" onclick="smhTrans.addTrans();" {{ (in_array("TRANSCODING_ADD", $permissions))? : 'disabled' }}>Add Profile</button>
                            </div>
                            <div style="display: inline-block; float: right;">
                                <div class="pull-left" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhTrans.exportMetaData()">Export to Excel <img height="20px" src="/img/xls-icon.jpg"></a></div>
                                <span class="dropdown header">
                                    <div class="btn-group">
                                        <button class="btn btn-default dd-delete-btn" type="button" disabled=""><span class="text">Bulk Actions</span></button>
                                        <button aria-expanded="true" data-toggle="dropdown" id="dropdownMenu" type="button" class="btn btn-disabled dropdown-toggle dd-delete-btn" disabled=""><span class="caret"></span></button>
                                        <ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu">
                                            <li role="presentation"><a onclick="smhTrans.bulkDeleteModal();" tabindex="-1" role="menuitem">Delete</a></li>
                                        </ul>
                                    </div>
                                </span>
                            </div>  
                        </div>
                        <div class="clear"></div>
                        <div id="trans-table"></div>                       
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
</div>
@stop

@section('footer')
<script src="/js/jquery.mCustomScrollbar.min.js?v=1" type="text/javascript"></script>
<script src="/js/jstz.min.js?v=1" type="text/javascript"></script>
<script src="/js/trans.js?v=1" type="text/javascript"></script>
@stop