@extends('appVR')

@section('css') 
<link href="/css/jquery.mCustomScrollbar.css?v=1" rel="stylesheet"> 
@stop

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1><i class="fa fa-check-square-o"></i> Administration</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li>Administration</li>
            <li class="active">Roles</li>
        </ol>
    </section>
    <!-- Main content -->
    <section class="content">
        @include('alerts')
        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper">  
                    <div id="page-header-body">
                        <div id="text">Define different roles with specific permissions to the Platform functionalities. You can assign these roles to each user accordingly.</div>
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
                        <div class="header rs-header">Roles</div>
                        <div class="rs-right-header"><a href="#" id="refresh" onclick="smhRoles.getRoles();"><i class="fa fa-refresh"></i> Refresh</a></div>
                    </div>
                    <div class="box-body">
                        <div id="users-buttons">
                            <div style="display: inline-block; float: left;">
                                <button class="btn btn-block bg-olive" id="add-role" onclick="smhRoles.addRole();" {{ (in_array("ADMIN_ROLE_ADD", $permissions))? : 'disabled' }}>Add Role</button>
                            </div>  
                            <div style="display: inline-block; float: right;">
                                <div class="pull-left" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhRoles.exportMetaData()">Export to Excel <img height="20px" src="/img/xls-icon.jpg"></a></div>
                            </div> 
                        </div>
                        <div class="clear"></div>
                        <div id="roles-table"></div>                       
                    </div>               
                </div>
            </div>
        </div>
    </section>
</div>
@stop

@section('footer')
<script src="/js/jquery.mCustomScrollbar.min.js?v=1" type="text/javascript"></script>
<script src="/js/jstz.min.js?v=1" type="text/javascript"></script>
<script src="/js/vr.admin.roles.js?v=1" type="text/javascript"></script>
@stop