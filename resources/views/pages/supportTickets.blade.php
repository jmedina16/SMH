@extends('app')

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1><i class="fa fa-question-circle"></i> Support Tickets</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li class="active">Support Tickets</li>
        </ol>
    </section>
    <!-- Main content -->
    <section class="content">
        @include('alerts')
        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper">
                    <div id="page-header-body">
                        <div id="text">In order to streamline support requests and better serve you, we utilize a support ticket system. Every support request is assigned a unique ticket number which you can use to track the progress and responses online. When creating a ticket, please provide as much detail as possible so we can best assist you.</div>
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
                        <div class="header">Tickets</div>
                    </div>
                    <div class="box-body">
                        <div id="help-buttons">
                            <div style="display: inline-block; float: left;"><button class="btn btn-block bg-olive" onclick="window.open('/help/newticket', '_self')"><i class="fa fa-plus"></i> Open A New Ticket</button></div>@if (Session::get("user.partnerParentId") === 0)<div style="display: inline-block; float: left; margin-left: 10px;"><button class="btn btn-block btn-primary" onclick="window.open('http://help.streamingmediahosting.com/tickets.php', '_blank')"><i class="fa fa-check-square-o"></i> Check Ticket Status</button></div>@endif  
                        </div>                                
                        <div class="clear"></div>
                        <div id="help-table"></div>                       
                    </div>               
                </div>


            </div>
        </div>
    </section>
</div>
@stop

@section('footer')
<script src="/js/jstz.min.js?v=1" type="text/javascript"></script>
<script src="/js/help.js?v=1" type="text/javascript"></script>
@stop