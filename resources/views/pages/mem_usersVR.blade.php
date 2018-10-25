@extends('appVR')

@section('css') 
<link href="/css/jquery.mCustomScrollbar.css?v=1" rel="stylesheet"> 
<link href="/css/bootstrap-toggle.min.css?v=1" rel="stylesheet">
@stop

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1><i class="fa fa-user"></i> Users</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li>Membership</li>
            <li class="active">Users</li>
        </ol>
    </section>
    <!-- Main content -->
    <section class="content">
        @include('alerts')
        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper">
                    <div id="page-header-body">
                        <div id="text">A user account consists of both a user name (email) and a password that allows access to your protected content. You can manually add a user account or a user can easily register through the player widget.</div>
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
                        <div class="header">Configuration</div>
                    </div>
                    <div class="box-body">
                        <form id="config-form" action="">
                            <table id="gateway-table">
                                <tr>
                                    <td style="width: 300px;"><div style="margin-left: 10px;">Allow Concurrent Logins</div></td><td><input type="checkbox" id="concurrent-logins" /><div style="margin-top: 5px; color: #999;"><i>Allow concurrent logins for a user account.</i></div></td>
                                </tr>
                                <tr>
                                    <td style="width: 300px;"><div style="margin-left: 10px;">Skip Activation Step</div></td><td><input type="checkbox" id="activation-step" /><div style="margin-top: 5px; color: #999;"><i>Skip the requirement of activating an account with an activation link sent to a user's email address.</i></div></td>
                                </tr>                                
                                <tr>
                                    <td style="width: 300px;"><div style="margin-left: 10px;">User Registration Form</div></td><td><div style="display: inline-block; float: left;"><button class="btn btn-block btn-primary" id="edit-reg" onclick="smhMEM.editReg(); return false;">Registration Form</button></div><div class="clear"></div><div style="margin-top: 5px; color: #999;"><i>Add up to 5 additional form fields to the user registration form.</i></div></td>
                                </tr>
                            </table>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="box">
                    <div class="box-header">
                        <div class="header rs-header">Users</div>
                        <div class="rs-right-header"><a href="#" id="refresh" onclick="smhMEM.getUsers();"><i class="fa fa-refresh"></i> Refresh</a></div>
                    </div>
                    <div class="box-body">
                        <div id="users-buttons">
                            <div style="display: inline-block; float: left;">
                                <button class="btn btn-block bg-olive" id="add-user" onclick="smhMEM.addUser();">Create User</button>
                            </div>
                            <div style="display: inline-block; float: right;">
                                <div class="pull-left" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhMEM.exportMetaData()">Export to Excel <img height="20px" src="/img/xls-icon.jpg"></a></div>
                            </div>  
                        </div>
                        <div class="clear"></div>
                        <div id="users-table"></div>                       
                    </div>               
                </div>
            </div>
        </div>
    </section>
</div>
@stop

@section('footer')
<script src="/js/jquery.mCustomScrollbar.min.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.cookie.js?v=1" type="text/javascript"></script>
<script src="/js/jstz.min.js?v=1" type="text/javascript"></script>
<script src="/js/bootstrap-toggle.min.js?v=1" type="text/javascript"></script>
<script src="/js/mem.users.js?v=1" type="text/javascript"></script>
@stop