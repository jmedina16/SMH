@extends('appVR')

@section('css') 
<link href="/css/jquery.mCustomScrollbar.css?v=1" rel="stylesheet"> 
@stop

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1><i class="fa fa-users"></i> Affiliate Program</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li>Pay Per View</li>
            <li class="active">Affiliate Program</li>
        </ol>
    </section>
    <!-- Main content -->
    <section class="content">
        @include('alerts')
        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper">  
                    <div id="page-header-body">
                        <div id="text"> Manage all of your affiliates here. You can edit, delete or add new affiliates manually by using the wizards under the "Actions" column.</div>
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
                        <li class="active"><a data-toggle="tab" href="#affiliates-tab" aria-expanded="true">Affiliates</a></li>
                        <li class=""><a data-toggle="tab" href="#campaigns-tab" aria-expanded="false">Campaigns</a></li>
                        <li class=""><a data-toggle="tab" href="#marketing-tab" aria-expanded="false">Marketing</a></li>
                        <li class=""><a data-toggle="tab" href="#commissions-tab" aria-expanded="false">Commissions</a></li>
                    </ul>
                    <div class="box-body">
                        <div class="tab-content no-padding">
                            <div style="position: relative;" id="affiliates-tab" class="tab-pane active">
                                <div id="users-buttons">
                                    <div style="display: inline-block; float: left;">
                                        <button class="btn btn-block bg-olive" id="add-affiliate" onclick="smhPPV.addAff();">Create Affiliate</button>
                                    </div>
                                    <div style="display: inline-block; float: right;">
                                        <div class="pull-left" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhPPV.exportMetaData('affiiliates')">Export to Excel <img height="20px" src="/img/xls-icon.jpg"></a></div>
                                        <div style="display: inline-block; float: right; margin-top: 7px; margin-right: 10px;"><a href="#" id="refresh" onclick="smhPPV.getAffiliates();"><i class="fa fa-refresh"></i> Refresh</a></div>
                                    </div>  
                                </div>
                                <div class="clear"></div>
                                <div id="affiliate-table"></div>
                            </div>
                            <div style="position: relative;" id="campaigns-tab" class="tab-pane">
                                <div id="users-buttons">
                                    <div style="display: inline-block; float: left;">
                                        <button class="btn btn-block bg-olive" id="add-campaign" onclick="smhPPV.addCampaign();">Create Campaign</button>
                                    </div>
                                    <div style="display: inline-block; float: right;">
                                        <div class="pull-left" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhPPV.exportMetaData('campaign')">Export to Excel <img height="20px" src="/img/xls-icon.jpg"></a></div>
                                        <div style="display: inline-block; float: right; margin-top: 7px; margin-right: 10px;"><a href="#" id="refresh" onclick="smhPPV.getCampaigns();"><i class="fa fa-refresh"></i> Refresh</a></div>
                                    </div>  
                                </div>
                                <div class="clear"></div>
                                <div id="campaign-table"></div>
                            </div>
                            <div style="position: relative;" id="marketing-tab" class="tab-pane">
                                <div id="users-buttons">
                                    <div style="display: inline-block; float: left;">
                                        <button class="btn btn-block bg-olive" id="add-marketing" onclick="smhPPV.addMarketing();">Create Link</button>
                                    </div>
                                    <div style="display: inline-block; float: right;">
                                        <div class="pull-left" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhPPV.exportMetaData('marketing')">Export to Excel <img height="20px" src="/img/xls-icon.jpg"></a></div>
                                        <div style="display: inline-block; float: right; margin-top: 7px; margin-right: 10px;"><a href="#" id="refresh" onclick="smhPPV.getMarketing();"><i class="fa fa-refresh"></i> Refresh</a></div>
                                    </div>  
                                </div>
                                <div class="clear"></div>
                                <div id="marketing-table"></div>
                            </div>
                            <div style="position: relative;" id="commissions-tab" class="tab-pane">
                                <div id="users-buttons">
                                    <div style="display: inline-block; float: right;">
                                        <div class="pull-left" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhPPV.exportMetaData('commissions')">Export to Excel <img height="20px" src="/img/xls-icon.jpg"></a></div>
                                        <div style="display: inline-block; float: right; margin-top: 7px; margin-right: 10px;"><a href="#" id="refresh" onclick="smhPPV.getCommissions();"><i class="fa fa-refresh"></i> Refresh</a></div>
                                    </div>  
                                </div>
                                <div class="clear"></div>
                                <div id="commissions-table"></div>
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
<script src="/js/ppv.affiliates.js?v=1" type="text/javascript"></script>
@stop