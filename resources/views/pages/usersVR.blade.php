@extends('appVR')

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1><i class="fa fa-user"></i> Administration</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li>Administration</li>
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
                        <div id="text">Manage users with various levels of access to your account. You can create new users, edit permissions for existing users and more.</div>
                        <div id="icon"><i class="fa fa-comments-o"></i></div>                      
                        <div class="clear"></div>                        
                    </div>                      
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="row">
                    <div class="col-md-2 col-sm-6 col-xs-12">
                        <div class="small-box bg-red" id="available-accounts">
                            <div class="inner">
                                <h3 id="available">0</h3>
                                <p>Available Users</p>
                            </div>
                            <div class="icon">
                                <i class="ion ion-person-add"></i>
                            </div>        
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="box">
                    <div class="box-header">
                        <div class="header rs-header">Users</div>
                        <div class="rs-right-header"><a href="#" id="refresh" onclick="smhAdmin.getUsers();"><i class="fa fa-refresh"></i> Refresh</a></div>
                    </div>
                    <div class="box-body">
                        <div id="users-buttons">
                            <div style="display: inline-block; float: left;">
                                <button class="btn btn-block bg-olive" id="add-user" onclick="smhAdmin.addUser();" {{ (in_array("ADMIN_USER_ADD", $permissions))? : 'disabled' }}>Add User</button>
                            </div>  
                            <div style="display: inline-block; float: right;">
                                <div class="pull-left" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhAdmin.exportMetaData()">Export to Excel <img height="20px" src="/img/xls-icon.jpg"></a></div>
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
<script src="/js/jstz.min.js?v=1" type="text/javascript"></script>
<script src="/js/admin.users.js?v=1" type="text/javascript"></script>
@stop