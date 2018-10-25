@extends('app')

@section('css')
<link href="/css/bootstrap-toggle.min.css?v=1" rel="stylesheet"> 
<link href="/css/jquery.bootstrap-touchspin.css?v=1" rel="stylesheet"> 
@stop

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1><i class="fa fa-users"></i> Sub Accounts</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li class="active">Sub Accounts</li>
        </ol>
    </section>
    <!-- Main content -->
    <section class="content">
        @include('alerts')
        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper">  
                    <div id="page-header-body">
                        <div id="text">Give your clients access to all of the features the Platform has to offer by creating sub accounts (child accounts). Your sub accounts will appear to be completely independent from the parent account.</div>
                        <div id="icon"><i class="fa fa-comments-o"></i></div>                      
                        <div class="clear"></div>                         
                    </div>                      
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="row">
                    <div class="col-md-2 col-sm-6 col-xs-12">
                        <div class="small-box bg-red" id="available-accounts">
                            <div class="inner">
                                <h3 id="available">0</h3>
                                <p>Available Accounts</p>
                            </div>
                            <div class="icon">
                                <i class="ion ion-person-add"></i>
                            </div>        
                        </div>
                    </div>
                    <div class="col-md-5 col-sm-6 col-xs-12" id="storage-bandwidth-meter">
                        <div class="info-box">
                            <span class="info-box-icon bg-custom"><i class="fa fa-fw fa-database"></i></span>
                            <div class="info-box-content">
                                <div class="progress-group">
                                    <span class="progress-text">Total Storage Used</span>
                                    <span class="progress-number"><b><span id="parent_total_storage">0</span></b> / <span id="parent_storage_limit">0</span>GB</span>
                                    <div class="progress sm">
                                        <div id="parent_storage_progress" class="progress-bar progress-bar-green"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-5 col-sm-6 col-xs-12" id="storage-bandwidth-meter">
                        <div class="info-box">
                            <span class="info-box-icon bg-aqua"><i class="ion ion-arrow-swap"></i></span>
                            <div class="info-box-content">
                                <div class="progress-group">
                                    <span class="progress-text">Total Data Transfered</span>
                                    <span class="progress-number"><b><span id="parent_total_transfer">0</span></b> / <span id="parent_bandwidth_limit">0</span>GB</span>
                                    <div class="progress sm">
                                        <div id="parent_bandwidth_progress" class="progress-bar progress-bar-green"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="box">
                    <div class="box-header">
                        <div class="header rs-header">Accounts</div>
                        <div class="rs-right-header"><a onclick="smhRS.getResellerAccounts();" id="refresh" href="#"><i class="fa fa-refresh"></i> Refresh</a></div>
                    </div>
                    <div class="box-body">
                        <div id="reseller-buttons">
                            <div style="display: inline-block; float: left;">
                                <button class="btn btn-block bg-olive" id="add-account" onclick="smhRS.createAccount();">Create Account</button>
                            </div>
                            <div style="display: inline-block; float: right;">
                                <div class="pull-left" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhRS.exportMetaData()">Export to Excel <img height="20px" src="/img/xls-icon.jpg"></a></div>
                                <button class="btn btn-default dd-delete-btn" type="button" onclick="smhRS.exportAllStats()"><span class="text">Child Statistics</span></button>
                            </div> 
                        </div>                                
                        <div class="clear"></div>
                        <div id="reseller-table"></div>                       
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
<script src="/js/bootstrap-toggle.min.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.bootstrap-touchspin.js?v=1" type="text/javascript"></script>
<script src="/js/jstz.min.js?v=1" type="text/javascript"></script>
<script src="/js/date.min.js?v=1" type="text/javascript"></script>
<script src="/js/reseller.js?v=1" type="text/javascript"></script>
@stop