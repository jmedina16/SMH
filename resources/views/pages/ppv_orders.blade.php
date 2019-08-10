@extends('app')

@section('css') 
<link href="/css/jquery.mCustomScrollbar.css?v=1" rel="stylesheet"> 
@stop

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1><i class="fa fa-list-ul"></i> Orders</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li>Pay Per View</li>
            <li class="active">Orders</li>
        </ol>
    </section>
    <!-- Main content -->
    <section class="content">
        @include('alerts')
        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper">  
                    <div id="page-header-body">
                        <div id="text">Easily keep track of all your orders and subscriptions here.</div>
                        <div id="icon"><i class="fa fa-comments-o"></i></div>                      
                        <div class="clear"></div>   
                    </div>                      
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="box nav-tabs-custom">
                    <ul class="nav nav-tabs pull-left ui-sortable-handle">
                        <li class="active"><a data-toggle="tab" href="#orders-tab" aria-expanded="true">Orders</a></li>
                        <li class=""><a data-toggle="tab" href="#subs-tab" aria-expanded="false">Subscriptions</a></li>
                    </ul>
                    <div class="box-body">
                        <div class="tab-content no-padding">
                            <div style="position: relative;" id="orders-tab" class="tab-pane active">
                                <div id="users-buttons">
                                    <div style="display: inline-block; float: left;">
                                        <button class="btn btn-block bg-olive" id="add-order" onclick="smhPPV.addOrder();">Create Order</button>
                                    </div>
                                    <div style="display: inline-block; float: right;">
                                        <div class="pull-left" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhPPV.exportMetaData('orders')">Export to Excel <img height="20px" src="/img/xls-icon.jpg"></a></div>
                                        <div style="display: inline-block; float: right; margin-top: 7px; margin-right: 10px;"><a href="#" id="refresh" onclick="smhPPV.getOrders();"><i class="fa fa-refresh"></i> Refresh</a></div>
                                    </div>  
                                </div>
                                <div class="clear"></div>
                                <div id="orders-table"></div>
                            </div>
                            <div style="position: relative;" id="subs-tab" class="tab-pane">
                                <div id="users-buttons">
                                    <div style="display: inline-block; float: right;">
                                        <div class="pull-left" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhPPV.exportMetaData('subs')">Export to Excel <img height="20px" src="/img/xls-icon.jpg"></a></div>
                                        <div style="display: inline-block; float: right; margin-top: 7px; margin-right: 10px;"><a href="#" id="refresh" onclick="smhPPV.getSubs();"><i class="fa fa-refresh"></i> Refresh</a></div>
                                    </div>  
                                </div>
                                <div class="clear"></div>
                                <div id="subs-table"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Modal -->
</div>
@stop

@section('footer')
<script src="/js/jquery.mCustomScrollbar.min.js?v=1" type="text/javascript"></script>
<script src="/js/jstz.min.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.cookie.js?v=1" type="text/javascript"></script>
<script src="/js/ppv.orders.js?v=1" type="text/javascript"></script>
@stop