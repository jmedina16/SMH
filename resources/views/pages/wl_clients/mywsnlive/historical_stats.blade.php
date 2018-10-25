@extends('app')

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
<!--    <section class="content-header">
        <h1><i class="fa fa-area-chart"></i> Streaming Statistics</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li>Analytics</li>
            <li class="active">Streaming Statistics</li>
        </ol>
    </section>-->
    <!-- Main content -->
    <section class="content">
        @include('alerts')
<!--        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper">  
                    <div id="page-header-body">
                        <div id="text">Analyze your streaming statistics with detailed usage reports.</div>
                        <div id="icon"><i class="fa fa-comments-o"></i></div>                      
                        <div class="clear"></div>                        
                    </div>                      
                </div>
            </div>
        </div>-->
        <div class="row">
            <div class="col-md-12">
                <div id="stats" style="width: 100%; height: 100%; margin-left: auto; margin-right: auto;"></div>          
            </div>
        </div>
    </section>
</div><!-- /.content-wrapper -->
@stop

@section('footer')
<script src="/wl_clients/mywsnlive/js/mywsnlive.history.stats.js?v=1" type="text/javascript"></script>
@stop