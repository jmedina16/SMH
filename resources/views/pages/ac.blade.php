@extends('app')

@section('css') 
<link href="/css/jquery.mCustomScrollbar.css?v=1" rel="stylesheet"> 
<link href="/css/jquery.ui.spinner.css?v=1" rel="stylesheet">
<link href="/css/jquery.ui.timepicker.css?v=1" rel="stylesheet">
@stop

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1><i class="fa fa-lock"></i> Viewer Access</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li class="active">Viewer Access</li>
        </ol>
    </section>
    <!-- Main content -->
    <section class="content">
        @include('alerts')
        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper">
                    <div id="page-header-body">
                        <div id="text">An Access Control Profile defines authorized and restricted domains, countries, IP addresses, flavors and advanced security settings such as protection with token authentication. You can select an appropriate Access Control Profile for each entry or group of entries.</div>
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
                        <div class="header rs-header">Profiles</div>
                        <div class="rs-right-header"><a href="#" id="refresh" onclick="smhAC.getAC();"><i class="fa fa-refresh"></i> Refresh</a></div>
                    </div>
                    <div class="box-body">
                        <div id="users-buttons">
                            <div style="display: inline-block; float: left;">
                                <button class="btn btn-block bg-olive" id="add-ac" onclick="smhAC.addAC();" {{ (in_array("ACCESS_CONTROL_ADD", $permissions))? '' : 'disabled' }}>Add Profile</button>
                            </div>
                            <div style="display: inline-block; float: right;">
                                <div class="pull-left" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhAC.exportMetaData()">Export to Excel <img height="20px" src="/img/xls-icon.jpg"></a></div>
                                <span class="dropdown header">
                                    <div class="btn-group">
                                        <button class="btn btn-default dd-delete-btn" type="button" disabled=""><span class="text">Bulk Actions</span></button>
                                        <button aria-expanded="true" data-toggle="dropdown" id="dropdownMenu" type="button" class="btn btn-disabled dropdown-toggle dd-delete-btn" disabled=""><span class="caret"></span></button>
                                        <ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu">
                                            <li role="presentation"><a onclick="smhAC.bulkDeleteModal();" tabindex="-1" role="menuitem">Delete</a></li>
                                        </ul>
                                    </div>
                                </span>
                            </div>  
                        </div>
                        <div class="clear"></div>
                        <div id="ac-table"></div>                       
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
<script src="/js/jquery.bootstrap.wizard.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.ui.spinner.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.ui.timepicker.js?v=1" type="text/javascript"></script>
<script src="/js/ac.js?v=1" type="text/javascript"></script>
@stop