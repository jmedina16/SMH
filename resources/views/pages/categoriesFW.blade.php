@extends('app')

@section('css') 
<link href="/css/jquery.mCustomScrollbar.css?v=1" rel="stylesheet"> 
<link href="/css/jquery.tree.css?v=1" rel="stylesheet"> 
@stop

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
<!--    <section class="content-header">
        <h1><i class="fa fa-th"></i> Categories</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li class="active">Categories</li>
        </ol>
    </section>-->
    <!-- Main content -->
    <section class="content">
        @include('alerts')
<!--        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper">
                    <div id="page-header-body">
                        <div id="text">Categories are built in a tree-like hierarchy where each category can include multiple sub-categories. You can add, assign, remove and edit categories from this section. You can also assign a media entry to a specific category from the content section.</div>
                        <div id="icon"><i class="fa fa-comments-o"></i></div>                      
                        <div class="clear"></div>
                    </div>                      
                </div>
            </div>
        </div>-->
        <div class="row">
            <div class="col-md-12">
                <div class="box">
                    <div class="box-header">
                        <div class="header rs-header">Categories</div>
                        <div class="rs-right-header"><a href="#" id="refresh" onclick="smhCat.getCategories();"><i class="fa fa-refresh"></i> Refresh</a></div>
                    </div>
                    <div class="box-body">
                        <div id="users-buttons">
                            <div style="display: inline-block; float: left;">
                                <button class="btn btn-block bg-olive" id="add-ac" onclick="smhCat.addCategory();" {{ (in_array("CONTENT_MANAGE_EDIT_CATEGORIES", $permissions))? '' : 'disabled' }}>Add Category</button>
                            </div>
                            <div style="display: inline-block; float: right;">
                                <div class="pull-left" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhCat.exportMetaData()">Export to Excel <img height="20px" src="/img/xls-icon.jpg"></a></div>
                                <span class="dropdown header">
                                    <div class="btn-group">
                                        <button class="btn btn-default dd-delete-btn" type="button" disabled=""><span class="text">Bulk Actions</span></button>
                                        <button aria-expanded="true" data-toggle="dropdown" id="dropdownMenu" type="button" class="btn btn-disabled dropdown-toggle dd-delete-btn" disabled=""><span class="caret"></span></button>
                                        <ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu">
                                            <li role="presentation"><a onclick="smhCat.bulkMove();" tabindex="-1" role="menuitem">Move Categories</a></li>
                                            <li role="presentation"><a onclick="smhCat.bulkDeleteModal();" tabindex="-1" role="menuitem">Delete</a></li>
                                        </ul>
                                    </div>
                                </span>
                            </div>  
                        </div>
                        <div class="clear"></div>
                        <div id="cat-table"></div>                       
                    </div>               
                </div>
            </div>
        </div>
    </section>
</div>
@stop

@section('footer')
<script src="/js/jquery.mCustomScrollbar.min.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.bootstrap.wizard.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.tree.js?v=1" type="text/javascript"></script>
<script src="/js/jstz.min.js?v=1" type="text/javascript"></script>
<script src="/js/fw.categories.js?v=1" type="text/javascript"></script>
@stop