@extends('appVR')

@section('css') 
<link href="/css/jquery.bootstrap-touchspin.css?v=1" rel="stylesheet">
@stop

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1><i class="fa fa-ticket"></i> Tickets</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li>Pay Per View</li>
            <li class="active">Tickets</li>
        </ol>
    </section>
    <!-- Main content -->
    <section class="content">
        @include('alerts')
        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper">
                    <div id="page-header-body">
                        <div id="text">A ticket consists of a set of rules that can be applied to any entry: price, expiration date, and maximum views.</div>
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
                        <div class="header rs-header">Tickets</div>
                        <div class="rs-right-header"><a href="#" id="refresh" onclick="smhPPV.getTickets();"><i class="fa fa-refresh"></i> Refresh</a></div>
                    </div>
                    <div class="box-body">
                        <div id="users-buttons">
                            <div style="display: inline-block; float: left;">
                                <button class="btn btn-block bg-olive" id="add-ticket" onclick="smhPPV.addTicket();">Create Ticket</button>
                            </div>
                            <div style="display: inline-block; float: right;">
                                <div class="pull-left" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhPPV.exportMetaData()">Export to Excel <img height="20px" src="/img/xls-icon.jpg"></a></div>
                            </div>  
                        </div>
                        <div class="clear"></div>
                        <div id="tickets-table"></div>                       
                    </div>               
                </div>
            </div>
        </div>
    </section>
</div>
@stop

@section('footer')
<script src="/js/jquery.cookie.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.bootstrap-touchspin.js?v=1" type="text/javascript"></script>
<script src="/js/jstz.min.js?v=1" type="text/javascript"></script>
<script src="/js/ppv.tickets.js?v=1" type="text/javascript"></script>
@stop