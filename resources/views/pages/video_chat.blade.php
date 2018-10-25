@extends('app')

@section('css') 
<link href="/css/responsive.dataTables.min.css?v=1" rel="stylesheet"> 
<style>
    #vchat_admin {
        float: left;
    }
    #vchat_client {
        float: left;
        margin-left: 10px;
    }
    #vchat_viewer {
        float: left;
        margin-left: 10px;
    }
</style>
@stop

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1><i class="fa fa-video-camera"></i> Video Chat</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li class="active">Video Chat</li>
        </ol>
    </section>
    <!-- Main content -->
    <section class="content">
        @if ($status[0]['bandwidth_limit_80'] && !$status[0]['bandwidth_limit_80_ackd'] && !$status[0]['bandwidth_limit_90'] && !$status[0]['bandwidth_limit_100'] && $status[0]['bandwidth_limit'])
        <div class="row">
            <div class="col-md-12">
                <div class="alert alert-warning">
                    <button aria-hidden="true" data-dismiss="alert" class="close" type="button" onclick="smhMain.alertAckd('bandwidth_limit_80')"><i class="fa fa-remove"></i></button>
                    <h4><i class="icon fa fa-warning"></i> Warning!</h4>
                    The following service has reached <b>80%</b> it's limit: <b>Bandwidth</b>
                </div>
            </div>
        </div>
        @endif
        @if ($status[0]['bandwidth_limit_90'] && !$status[0]['bandwidth_limit_90_ackd'] && !$status[0]['bandwidth_limit_100'] && $status[0]['bandwidth_limit'])
        <div class="row">
            <div class="col-md-12">
                <div class="alert alert-warning">
                    <button aria-hidden="true" data-dismiss="alert" class="close" type="button" onclick="smhMain.alertAckd('bandwidth_limit_90')"><i class="fa fa-remove"></i></button>
                    <h4><i class="icon fa fa-warning"></i> Warning!</h4>
                    The following service has reached <b>90%</b> it's limit: <b>Bandwidth</b>
                </div>
            </div>
        </div>
        @endif
        @if ($status[0]['bandwidth_limit_100'] && $status[0]['bandwidth_limit'])
        <div class="row">
            <div class="col-md-12">
                <div class="alert alert-danger">
                    <h4><i class="icon fa fa-warning"></i> Alert!</h4>
                    There has been a service disruption on your account: <b>Bandwidth Limit Reached!</b> Please contact your support department for assistance.
                </div>
            </div>
        </div>
        @endif
        @if ($status[0]['storage_limit_80'] && !$status[0]['storage_limit_80_ackd'] && !$status[0]['storage_limit_90'] && !$status[0]['storage_limit_100'] && $status[0]['storage_limit'])
        <div class="row">
            <div class="col-md-12">
                <div class="alert alert-warning">
                    <button aria-hidden="true" data-dismiss="alert" class="close" type="button" onclick="smhMain.alertAckd('storage_limit_80')"><i class="fa fa-remove"></i></button>
                    <h4><i class="icon fa fa-warning"></i> Warning!</h4>
                    The following service has reached <b>80%</b> it's limit: <b>Storage</b>
                </div>
            </div>
        </div>
        @endif
        @if ($status[0]['storage_limit_90'] && !$status[0]['storage_limit_90_ackd'] && !$status[0]['storage_limit_100'] && $status[0]['storage_limit'])
        <div class="row">
            <div class="col-md-12">
                <div class="alert alert-warning">
                    <button aria-hidden="true" data-dismiss="alert" class="close" type="button" onclick="smhMain.alertAckd('storage_limit_90')"><i class="fa fa-remove"></i></button>
                    <h4><i class="icon fa fa-warning"></i> Warning!</h4>
                    The following service has reached <b>90%</b> it's limit: <b>Storage</b>
                </div>
            </div>
        </div>
        @endif
        @if ($status[0]['storage_limit_100'] && $status[0]['storage_limit'])
        <div class="row">
            <div class="col-md-12">
                <div class="alert alert-danger">
                    <h4><i class="icon fa fa-warning"></i> Alert!</h4>
                    There has been a service disruption on your account: <b>Storage Limit Reached!</b> Please contact your support department for assistance.
                </div>
            </div>
        </div>
        @endif
        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper">  
                    <div id="page-header-body">
                        <div id="text">Embed the video chat client on your site.</div>
                        <div id="icon"><i class="fa fa-comments-o"></i></div>                      
                        <div class="clear"></div>                        
                    </div>                      
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="box">
                    <div class="box-body">
                        <div id='vchat_controls' style="width:585px;margin-bottom: 46px; margin-left: auto; margin-right: auto;">
                            <div id='vchat_admin'><button class="btn btn-default">Admin Embed Code</button></div>
                            <div id='vchat_client'><button class="btn btn-default">Client Embed Code</button></div>
                            <div id='vchat_viewer'><button class="btn btn-default">View Embed Code</button></div>
                        </div>
                        <div class="clear"></div>
                        <div style='margin-left: auto; margin-right: auto; width:1135px;'>
                            <div id='defaultEmbed'></div> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div><!-- /.content-wrapper -->
@stop

@section('footer')
<script src="/js/videochat.js?v=1" type="text/javascript"></script>
@stop