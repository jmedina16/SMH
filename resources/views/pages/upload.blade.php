@extends('app')

@section('css')
<link href="/css/jquery.mCustomScrollbar.css?v=1" rel="stylesheet">
<link href="/css/fileuploader.css?v=1" rel="stylesheet"> 
<link href="/css/uploadstyle.css?v=1" rel="stylesheet"> 
<link href="/css/blueimp-gallery.min.css?v=1" rel="stylesheet">
<link href="/css/jquery.fileupload.css?v=1" rel="stylesheet">
<link href="/css/jquery.fileupload-ui.css?v=1" rel="stylesheet">
<link href="/css/jquery.tree.css?v=1" rel="stylesheet"> 
<link href="/css/bootstrap-toggle.min.css?v=1" rel="stylesheet">
@stop

@section('content')

<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1><i class="glyphicon glyphicon-cloud-upload"></i> Upload -<span style="font-size: 15px; font-weight: bold;"> Quickly upload any file type - video, audio, or images. Customize your uploads by modifying the metadata, add them directly to categories, or use specific Access Control or Transcoding Profiles.</span></h1>
<!--        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li class="active">Upload</li>
        </ol>-->
    </section>
    <!-- Main content -->
    <section class="content">
        @include('alerts')
<!--        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper"> 
                    <div id="page-header-body">
                        <div id="text">Quickly upload any file type - video, audio, or images. Customize your uploads by modifying the metadata, add them directly to categories, or use specific Access Control or Transcoding Profiles.</div>
                        <div id="icon"><i class="fa fa-comments-o"></i></div>                      
                        <div class="clear"></div>                        
                    </div>                      
                </div>
            </div>
        </div>-->
        <div class="row">
            <div class="col-md-12">
                <div class="box">
                    <div class="box-body">
                        <form id="fileupload" name="files" action="/upload" method="POST" >
                            <div id="dropzone"> 
                                <div id="upload-head">
                                    <h4>Drag and Drop Files Here</h4>
                                    or                        
                                </div>
                                <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->
                                <div class="row fileupload-buttonbar" style="min-width: 210px; max-width: 410px; margin-left: auto; margin-right: auto;">
                                    <div class="col-lg-7">
                                        <!-- The fileinput-button span is used to style the file input field as button -->
                                        <span class="upload-btn upload-btn-success fileinput-button">
                                            <i class="fa fa-plus"></i>
                                            <span>Add file</span>
                                            <input type="file" name="files">
                                        </span>
                                        <button type="submit" class="btn btn-primary start" style="display:none;">
                                            <i class="fa fa-arrow-circle-o-up"></i>
                                            <span>Start upload</span>
                                        </button>
                                        <button type="reset" class="upload-btn upload-btn-warning cancel" style="display:none;">
                                            <i class="fa fa-ban"></i>
                                            <span>Cancel upload</span>
                                        </button>
                                        <!-- The global file processing state -->
                                        <span class="fileupload-process"></span>
                                    </div>
                                    <!-- The global progress state -->
                                    <div class="col-lg-5 fileupload-progress fade">
                                        <!-- The global progress bar -->
                                        <div class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                                            <div class="progress-bar progress-bar-success" style="width:0%;"></div>
                                        </div>
                                        <!-- The extended global progress state -->
                                        <div class="progress-extended">&nbsp;</div>
                                    </div>
                                </div>
                                <div id="upload-head2">
                                    Maximum files is 10
                                </div>
                            </div>
                            <!-- The table listing the files available for upload/download -->
                            <table role="presentation" class="table table-striped"><tbody class="files"></tbody></table>
                            <!-- The template to display files available for upload -->
                            <script id="template-upload" type="text/x-tmpl">
                                {% var rowid=Math.random().toString(36).substr(2, 5); %}
                                {% for (var i=0, file; file=o.files[i]; i++) { %}                        
                                <tr class="template-upload fade">
                                <td>
                                <p class="name">{%=file.name%}</p>
                                <strong class="error text-danger"></strong>
                                <span class="preview"></span>
                                <p class="size">Processing...</p>
                                <div class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="progress-bar progress-bar-success" style="width:0%;"></div></div>
                                </td>
                                <td>
                                {% if (!i && !o.options.autoUpload) { %}
                                <button class="upload-btn upload-btn-primary start" disabled>
                                <i class="fa fa-arrow-circle-o-up"></i>
                                <span>Start</span>
                                </button>
                                {% } %}
                                {% if (!i) { %}
                                <button class="upload-btn upload-btn-warning cancel">
                                <i class="fa fa-ban"></i>
                                <span>Cancel</span>
                                </button>
                                <button class="upload-btn btn-primary customize" onclick="smhUpload.customizeEntry(this,'{%=file.name%}'); return false;">
                                <i class="fa fa-edit"></i>
                                <span>Customize</span>
                                </button>
                                <div id="media-data"></div>
                                {% } %}
                                </td>
                                </tr>
                                {% } %}
                            </script>
                            <!-- The template to display files available for download -->
                            <script id="template-download" type="text/x-tmpl">
                                {% for (var i=0, file; file=o.files[i]; i++) { %}
                                <tr class="template-download fade">
                                <td>
                                <span class="preview">
                                {% if (file.thumbnailUrl) { %}
                                <a href="{%=file.url%}" title="{%=file.name%}" download="{%=file.name%}" data-gallery><img src="{%=file.thumbnailUrl%}"></a>
                                {% } %}
                                </span>
                                </td>
                                <td>
                                <p class="name">
                                {% if (file.url) { %}
                                <a href="{%=file.url%}" title="{%=file.name%}" download="{%=file.name%}" {%=file.thumbnailUrl?'data-gallery':''%}>{%=file.name%}</a>
                                {% } else { %}
                                <span>{%=file.name%}</span>
                                {% } %}
                                </p>
                                {% if (file.error) { %}
                                <div><span class="label label-danger">Error</span> {%=file.error%}</div>
                                {% } %}
                                </td>
                                <td>
                                <span class="size">{%=o.formatFileSize(file.size)%}</span>
                                </td>
                                <td>
                                {% if (file.deleteUrl) { %}
                                <button class="btn btn-danger delete" data-type="{%=file.deleteType%}" data-url="{%=file.deleteUrl%}"{% if (file.deleteWithCredentials) { %} data-xhr-fields='{"withCredentials":true}'{% } %}>
                                <i class="glyphicon glyphicon-trash"></i>
                                <span>Delete</span>
                                </button>
                                <input type="checkbox" name="delete" value="1" class="toggle">
                                {% } else { %}
                                <button class="btn btn-warning cancel">
                                <i class="glyphicon glyphicon-ban-circle"></i>
                                <span>Cancel</span>
                                </button>
                                {% } %}
                                </td>
                                </tr>
                                {% } %}
                            </script>
                        </form>                         
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

</div>

@stop

@section('footer')
<!--[if lt IE 9]><script src="/js/excanvas.min.js?v=1" type="text/javascript"></script><![endif]-->
<script src="/js/vendor/jquery.ui.widget.js?v=1" type="text/javascript"></script>
<script src="/js/tmpl.min.js?v=1" type="text/javascript"></script>
<script src="/js/load-image.min.js?v=1" type="text/javascript"></script>
<script src="/js/canvas-to-blob.min.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.iframe-transport.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.fileupload.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.fileupload-process.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.fileupload-image.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.fileupload-audio.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.fileupload-video.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.fileupload-validate.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.fileupload-ui.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.base64.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.mCustomScrollbar.min.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.tree.js?v=1" type="text/javascript"></script>
<script src="/js/bootstrap-toggle.min.js?v=1" type="text/javascript"></script>
<script src="/js/upload.js?v=1" type="text/javascript"></script>
@stop