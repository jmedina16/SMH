@extends('app')

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1><i class="fa fa-question-circle"></i> Help</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li class="active">Help</li>
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
            <div class="col-md-5 center-block">
                <div class="box box-primary">
                    <div class="box-header with-border">
                        <div class="header">
                            <div class="pull-left pad"><i class="fa fa-ticket"></i> Thank You</div>
                            <div class="pull-right margin"><button class="btn btn-block bg-olive pull-right" onclick="window.open('/help', '_self')"><i class="fa fa-reply"></i> View All Tickets</button></div>
                        </div>
                    </div>
                    <div class="box-body">
                        <div style="margin-left: auto; margin-right: auto; max-width: 540px;">
                            <br>
                            {{addslashes(trim(Session::get('user.fullName')))}},<br><br>

                            Thank you for contacting us.<br><br>

                            A support ticket request has been created and a representative will be getting back to you shortly if necessary.<br><br>

                            Support Team<br><br>    
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
@stop