@extends('app')

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1><i class="fa fa-question-circle"></i> Support Tickets</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li class="active">InPlayer API Calls</li>
        </ol>
    </section>
    <!-- Main content -->
    <section class="content">
        @include('alerts')
        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper">
                    <div id="page-header-body">
                        <div id="text">This page allows tests of the InPlayer API Calls to be run.</div>
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
                        <div class="header">API Call Results</div>
                    </div>
                    <div class="box-body">
                        <div id="help-buttons">
                            <div style="display: inline-block; float: left;"><button class="btn btn-block bg-olive" onclick="runAPICalls()"><i class="fa fa-plus"></i> Run the Calls</button></div>@if (Session::get("user.partnerParentId") === 0)<div style="display: inline-block; float: left; margin-left: 10px;">All API Call Results Here</div>@endif  
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
