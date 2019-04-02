@extends('app')

@section('css') 
<link href="/html5/html5lib/v2.55/kWidget/onPagePlugins/miroSubsOnPage/mirosubs/media/css/mirosubs-widget.css?v=1" rel="stylesheet">
<link href="/css/jquery.mCustomScrollbar.css?v=1" rel="stylesheet"> 
<link href="/css/responsive.dataTables.min.css?v=1" rel="stylesheet"> 
<link href="/css/morris.css?v=1" rel="stylesheet"> 
<link href="/css/jquery.tree.css?v=1" rel="stylesheet"> 
<link href="/css/bootstrap-toggle.min.css?v=1" rel="stylesheet">
<link href="/css/jquery.bootstrap-touchspin.css?v=1" rel="stylesheet">
@stop

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
<!--    <section class="content-header">
        <h1><i class="fa fa-film"></i> Content</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li class="active">Content</li>
        </ol>
    </section>-->
    <!-- Main content -->
    <section class="content">
        @include('alerts')
<!--        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper">  
                    <div id="page-header-body">
                        <div id="text">Full media management tool where publishers organize and track their rich-media content.</div>
                        <div id="icon"><i class="fa fa-comments-o"></i></div>                      
                        <div class="clear"></div>                        
                    </div>                      
                </div>
            </div>
        </div>-->
        <div class="row">
            <div class="col-md-12">
                <div class="box" id="box-wrapper">
                    <div class="box-header">
                        <div class="header rs-header">Content - Preview and Embed, Trim and Clip, Add Captions, Edit Meta Data and more.</div>
                        <div class="rs-right-header"><a href="#" id="refresh" onclick="smhContent.getEntries();"><i class="fa fa-refresh"></i> Refresh</a></div>
                    </div>
                    <div class="box-body" id="entries-table-wrapper">
                        <div id="users-buttons">
                            <div style="display: inline-block; float: left;">
                                <span class="dropdown header dropdown-accordion">
                                    <div class="btn-group">
                                        <button class="btn btn-default filter-btn" type="button"><span class="text">Filters</span></button>
                                        <button aria-expanded="false" data-toggle="dropdown" id="dropdownMenu" type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button> 
                                        <ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu dropdown-filter">
                                            <li role="presentation">
                                                <div class="panel-group" id="accordion">
                                                    <div class="panel panel-default">
                                                        <div class="panel-heading">
                                                            <h4 class="panel-title">
                                                                <a href="#collapseOne" data-toggle="collapse" data-parent="#accordion">
                                                                    Filter by Categories
                                                                </a>
                                                            </h4>
                                                        </div>
                                                        <div class="panel-collapse collapse in" id="collapseOne">
                                                            <div class="panel-body">
                                                                <div id="tree1">
                                                                    <div class="filter-header">
                                                                        <ul>
                                                                            <li>
                                                                                <div class="checkbox"><label><input type="checkbox" value="all" class="cat_all" checked> <b>All Categories</b></label></div>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                    <div class="filter-body cat-filter"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="panel panel-default">
                                                        <div class="panel-heading">
                                                            <h4 class="panel-title">
                                                                <a href="#collapseTwo" data-toggle="collapse" data-parent="#accordion">
                                                                    Additional Filters
                                                                </a>
                                                            </h4>
                                                        </div>
                                                        <div class="panel-collapse collapse" id="collapseTwo">
                                                            <div class="panel-body">
                                                                <div id="tree2">
                                                                    <div id="filter-header">
                                                                        <ul>
                                                                            <li>
                                                                                <div class="checkbox"><label><input type="checkbox" value="all" class="media_all" checked> <b>All Media Types</b></label></div>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                    <div class="filter-body media-filter">
                                                                        <ul>
                                                                            <li>
                                                                                <div class="checkbox"><label><input type="checkbox" value="1" class="media_list"> Video</label></div>
                                                                            </li>
                                                                            <li>
                                                                                <div class="checkbox"><label><input type="checkbox" value="2" class="media_list"> Image</label></div>
                                                                            </li>
                                                                            <li>
                                                                                <div class="checkbox"><label><input type="checkbox" value="5" class="media_list"> Audio</label></div>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                    <div id="filter-header" style="margin-top: 13px;">
                                                                        <ul>
                                                                            <li>
                                                                                <div class="checkbox"><label><input type="checkbox" value="all" class="durations_all" checked> <b>All Durations</b></label></div>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                    <div class="filter-body duration-filter">
                                                                        <ul>
                                                                            <li>
                                                                                <div class="checkbox"><label><input type="checkbox" value="short" class="duration_list"> Short (0-4 min.)</label></div>
                                                                            </li>
                                                                            <li>
                                                                                <div class="checkbox"><label><input type="checkbox" value="medium" class="duration_list"> Medium (4-20 min.)</label></div>
                                                                            </li>
                                                                            <li>
                                                                                <div class="checkbox"><label><input type="checkbox" value="long" class="duration_list"> Long (20+ min.)</label></div>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                    <div id="filter-header" style="margin-top: 13px;">
                                                                        <ul>
                                                                            <li>
                                                                                <div class="checkbox"><label><input type="checkbox" value="all" class="clipped_all" checked> <b>All Original & Clipped Entries</b></label></div>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                    <div class="filter-body clipped-filter">
                                                                        <ul>
                                                                            <li>
                                                                                <div class="checkbox"><label><input type="checkbox" value="1" class="clipped_list"> Original Entries</label></div>
                                                                            </li>
                                                                            <li>
                                                                                <div class="checkbox"><label><input type="checkbox" value="0" class="clipped_list"> Clipped Entries</label></div>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                    <div id="filter-header">
                                                                        <ul>
                                                                            <li>
                                                                                <div class="checkbox"><label><input type="checkbox" value="all" class="ac_all" checked> <b>All Access Control Profiles</b></label></div>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                    <div class="filter-body ac-filter"></div>
                                                                    <div id="filter-header" style="margin-top: 13px;">
                                                                        <ul>
                                                                            <li>
                                                                                <div class="checkbox"><label><input type="checkbox" value="all" class="flavors_all" checked> <b>All Flavors</b></label></div>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                    <div class="filter-body flavors-filter"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </span>
                            </div>
                            <div style="display: inline-block; float: right;">
                                <div class="pull-left" id="dwnld-csv"><div id="loading"><img height="20px" src="/img/loading.gif"></div><a onclick="smhContent.exportMetaData()">Export to Excel <img height="20px" src="/img/xls-icon.jpg"></a></div>
                                <span class="dropdown header">
                                    <div class="btn-group">
                                        <button class="btn btn-default dd-delete-btn" type="button" disabled=""><span class="text">Bulk Actions</span></button>
                                        <button aria-expanded="true" data-toggle="dropdown" id="dropdownMenu" type="button" class="btn btn-disabled dropdown-toggle dd-delete-btn" disabled=""><span class="caret"></span></button>
                                        <ul aria-labelledby="dropdownMenu" role="menu" id="menu" class="dropdown-menu livestream-bulk">
                                            <li role="presentation"><a {{ (in_array("CONTENT_MANAGE_ACCESS_CONTROL", $permissions))? 'onclick=smhContent.bulkACModal();' : '' }} tabindex="-1" role="menuitem">Set Access Control</a></li>
                                            <li role="presentation" class="dropdown dropdown-submenu">
                                                <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-caret-left"></i> Add/Remove Tags</a>
                                                <ul class="dropdown-menu">
                                                    <li>
                                                        <a {{ (in_array("CONTENT_MANAGE_METADATA", $permissions))? 'onclick=smhContent.bulkTagsAddModal();' : '' }} >Add Tags</a>
                                                    </li>
                                                    <li>
                                                        <a {{ (in_array("CONTENT_MANAGE_METADATA", $permissions))? 'onclick=smhContent.bulkTagsRemoveModal();' : '' }}>Remove Tags</a>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li role="presentation" class="dropdown dropdown-submenu">
                                                <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-caret-left"></i> Add/Remove Categories</a>
                                                <ul class="dropdown-menu cat-menu">
                                                    <li>
                                                        <a {{ (in_array("CONTENT_MANAGE_ASSIGN_CATEGORIES", $permissions))? 'onclick=smhContent.bulkCatAddModal();' : '' }} >Add to Categories</a>
                                                    </li>
                                                    <li>
                                                        <a {{ (in_array("CONTENT_MANAGE_ASSIGN_CATEGORIES", $permissions))? 'onclick=smhContent.bulkCatRemoveModal();' : '' }}>Remove from Categories</a>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li role="presentation"><a {{ (in_array("CONTENT_MANAGE_DELETE", $permissions))? 'onclick=smhContent.bulkDeleteModal();' : '' }} tabindex="-1" role="menuitem">Delete</a></li>
                                        </ul>
                                    </div>
                                </span>
                            </div>
                        </div>
                        <div class="clear"></div>
                        <div id="entries-table"></div>                       
                    </div>               
                </div>
            </div>
        </div>
    </section>
    <!-- Modal -->
    <div class="modal fade" id="smh-modal2" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog smh-dialog2">
            <div class="modal-content">
                <div class="modal-header"></div>
                <div class="modal-body"></div>
                <div class="modal-footer"></div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="smh-modal3" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog smh-dialog3">
            <div class="modal-content">
                <div class="modal-header"></div>
                <div class="modal-body"></div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="smh-modal4" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog smh-dialog4">
            <div class="modal-content">
                <div class="modal-header"></div>
                <div class="modal-body"></div>
            </div>
        </div>
    </div>
</div><!-- /.content-wrapper -->
@stop

@section('footer')
<script src="/js/dataTables.responsive.min.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.mCustomScrollbar.min.js?v=1" type="text/javascript"></script>
<script src="/js/jstz.min.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.bootstrap.wizard.js?v=1" type="text/javascript"></script>
<script src="/js/qrcode.min.js?v=1" type="text/javascript"></script>
<script src="/js/KalturaEmbedCodeGenerator.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.tree.js?v=1" type="text/javascript"></script>
<script src="/js/raphael-min.js?v=1" type="text/javascript"></script>
<script src="/js/morris.js?v=1" type="text/javascript"></script>
<script src="/js/date.min.js?v=1" type="text/javascript"></script>
<script src="/js/bootstrap-toggle.min.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.bootstrap-touchspin.js?v=1" type="text/javascript"></script>
<script src="/html5/html5lib/v2.55/kWidget/onPagePlugins/miroSubsOnPage/miroSubs.js?v=1" type="text/javascript"></script>
<script src="/js/content.js?v=1.5" type="text/javascript"></script>
@stop
