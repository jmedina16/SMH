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
                <div class="box">
                    <div class="box-header">
                        <div class="header">
                            <div class="pull-left pad"><i class="fa fa-ticket"></i> Open A New Ticket</div>
                            <div class="pull-right margin"><button class="btn btn-block bg-olive pull-right" onclick="window.open('/support_tickets', '_self')"><i class="fa fa-reply"></i> View All Tickets</button></div>
                        </div>
                    </div>
                    <div class="box-body">
                        <form class="form-horizontal" id="ticketForm" method="POST">
                            <input type="hidden" name="_token" value="{{ csrf_token() }}">
                            <input type="hidden" name="ip" value="{{  Request::ip() }}">
                            <div class="box-body">
                                <h4 class="margin-top-20 text-light-blue">Contact Information</h4>
                                <p></p>
                                <div class="form-group">
                                    <label class="col-xs-12 col-sm-3 control-label required-before">Full Name:</label>
                                    <div class="col-xs-12 col-sm-8">
                                        <input type="text" value="{{addslashes(trim(Session::get('user.fullName')))}}" name="name" placeholder="Enter Full Name" class="form-control" maxlength="64" size="40" id="name">
                                    </div>                      
                                </div>
                                <div class="form-group">
                                    <label class="col-xs-12 col-sm-3 control-label required-before">Email Address:</label>
                                    <div class="col-xs-12 col-sm-8">
                                        <input type="text" value="{{addslashes(trim(Session::get('user.userName')))}}" name="useremail" placeholder="Enter Email Address" class="form-control" maxlength="64" size="40" id="useremail">
                                    </div>                      
                                </div>
                                <div class="form-group">
                                    <label class="col-xs-12 col-sm-3 control-label">Phone:</label>
                                    <div class="col-xs-12 col-sm-8">
                                        <input type="text" value="" name="phone" id="phone" placeholder="Enter Phone Number" class="form-control phone_main"> Ext:
                                        <input type="text" size="5" value="" name="phoneext" id="phoneext" placeholder="Enter Ext." class="form-control phone_ext">
                                    </div>                      
                                </div>
                                <div class="form-group">
                                    <label class="col-xs-12 col-sm-3 control-label required-before">Help Topic:</label>
                                    <div class="col-xs-12 col-sm-8">
                                        <select class="form-control" name="topicId" id="topicId">
                                            <option selected="selected" value="">&mdash; Select a Help Topic &mdash;</option>
                                            <option value="13">Billing</option>
                                            <option value="18">Support</option>              
                                        </select>
                                    </div>                      
                                </div>
                                <h4 class="margin-top-20 text-light-blue">Ticket Details</h4>
                                <div class="form-group">
                                    <label class="col-xs-12 col-sm-3 control-label required-before">Subject:</label>
                                    <div class="col-xs-12 col-sm-8">
                                        <input type="text" value="" name="subject" placeholder="Enter Subject" class="form-control" maxlength="64" size="40" id="subject">
                                    </div>                    
                                </div>
                                <div class="form-group">
                                    <label class="col-xs-12 col-sm-3 control-label required-before">Message:</label>
                                    <div class="col-xs-12 col-sm-8">
                                        <textarea name="message" placeholder="Enter Message" class="form-control" id="message"></textarea>
                                    </div>                    
                                </div>
                            </div>
                            <div class="box-footer">
                                <div id="loading"><img height="20px" src="/img/loading.gif"></div><button class="btn btn-primary pull-right" id="ticketSubmit" type="button" onclick="smhHelp.submitTicket(); return false;">Submit</button>
                            </div>
                        </form>                        
                    </div>                   
                </div>
            </div>
        </div>
    </section>

</div>
@stop

@section('footer')
<script src="/js/help.ticket.js?v=1" type="text/javascript"></script>
@stop