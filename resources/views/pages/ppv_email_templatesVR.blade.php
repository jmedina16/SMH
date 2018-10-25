@extends('appVR')

@section('css') 
<link href="/css/bootstrap3-wysihtml5.min.css?v=1" rel="stylesheet">
@stop

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1><i class="fa fa-file-text-o"></i> Email Templates</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li>Pay Per View</li>
            <li>Email</li>
            <li class="active">Templates</li>
        </ol>
    </section>
    <!-- Main content -->
    <section class="content">
        @include('alerts')
        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper">  
                    <div id="page-header-body">
                        <div id="text">There are a few e-mails that get automatically sent out to your registered users. Please click on each tab below and specify the correct messages you would like your registered users to see.</div>
                        <div id="icon"><i class="fa fa-comments-o"></i></div>                      
                        <div class="clear"></div>   
                    </div>                      
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="box nav-tabs-custom">
                    <ul class="nav nav-tabs pull-left ui-sortable-handle">
                        <li class="active"><a data-toggle="tab" href="#register-email" aria-expanded="true">Register Email</a></li>
                        <li class=""><a data-toggle="tab" href="#thankyou-email" aria-expanded="false">Thank You Email</a></li>
                        <li class=""><a data-toggle="tab" href="#pass-email" aria-expanded="false">Password Reset Email</a></li>
                    </ul>
                    <div class="box-body">
                        <div class="tab-content no-padding">
                            <div style="position: relative;" id="register-email" class="tab-pane active">
                                <div id="register-table">
                                    <form id="pur-email" action="">
                                        <table id="gateway-table" style="margin-top: 10px; margin-bottom: 15px;">
                                            <tr>
                                                <td style="width: 300px;"><div style="margin-left: 10px;">Description</div></td><td>This e-mail is automatically sent out when a user first registers or when you manually register a user.<br />Your message <strong>MUST</strong> include the at least the "User Name" variable.</td>
                                            </tr>
                                            <tr>
                                                <td style="width: 300px;"><div style="margin-left: 10px;">Email Template</div></td><td><select class="form-control" id="reg-email-template"><option value="default">Default Template</option><option value="custom">Custom Template</option></select><div style="margin-top: 5px; color: #999;"><i>Use the default template or customize your own message.</i></div></td>
                                            </tr>                                        
                                            <tr>
                                                <td style="width: 300px;"><div style="margin-left: 10px;">Subject</div></td><td><input type="text" name="reg_subject" class="form-control" placeholder="Enter a Subject" id="reg_subject"/><div style="margin-top: 5px; color: #999;"><i>The subject that will be used for this email.</i></div></td>
                                            </tr>
                                            <tr>
                                                <td style="width: 300px;"><div style="margin-left: 10px;">Insert Variable</div></td><td><div class="pull-left"><select class="form-control" id="reg-variables"><option value="0">Business Name</option><option value="1">User Name</option><option value="2">Email</option></select></div><button id="insert_variable" class="btn btn-default variable-btn" onclick="smhPPV.addRegVariable(); return false;">Insert Variable</button><button id="clear" class="btn btn-default variable-btn" onclick="smhPPV.clearRegData(); return false;">Clear Data</button><button id="restore" class="btn btn-default variable-btn" onclick="smhPPV.restoreRegData(); return false;">Restore Template Data</button></td>
                                            <tr>
                                                <td style="width: 300px;"><div style="margin-left: 10px;">Body</div></td><td><textarea name="reg_body" class="form-control" placeholder="Enter a Body" id="reg_body" /></textarea><div style="margin-top: 5px; color: #999;"><i>The message that will be used for this email.</i></div></td>
                                            </tr>  
                                            <tr>
                                                <td></td><td><div style="float: left"><button id="save_pur" class="btn btn-primary" onclick="smhPPV.saveRegEmail(); return false;">Save Changes</button></div><div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div></td>
                                            </tr>
                                        </table>          
                                    </form>
                                </div>
                            </div>
                            <div style="position: relative;" id="thankyou-email" class="tab-pane">
                                <div id="register-table">
                                    <form id="ty-email" action="">
                                        <table id="gateway-table" style="margin-top: 10px; margin-bottom: 15px;">
                                            <tr>
                                                <td style="width: 300px;"><div style="margin-left: 10px;">Description</div></td><td>This e-mail is automatically sent out when a user completes a Pay-Per-View purchase. Your message <strong>MUST</strong> include the following variables:<br> "Order Number", "Order Date", "Entry Name", "Ticket Name", "Ticket Description", "Ticket Price", "Ticket Expiration", and "Ticket Views"</td>
                                            </tr>
                                            <tr>
                                                <td style="width: 300px;"><div style="margin-left: 10px;">Email Template</div></td><td><select class="form-control" id="ty-email-template"><option value="default">Default Template</option><option value="custom">Custom Template</option></select><div style="margin-top: 5px; color: #999;"><i>Use the default template or customize your own message.</i></div></td>
                                            </tr>                                        
                                            <tr>
                                                <td style="width: 300px;"><div style="margin-left: 10px;">Subject</div></td><td><input type="text" name="ty_subject" class="form-control" placeholder="Enter a Subject" id="ty_subject"/><div style="margin-top: 5px; color: #999;"><i>The subject that will be used for this email.</i></div></td>
                                            </tr>
                                            <tr>
                                                <td style="width: 300px;"><div style="margin-left: 10px;">Insert Variable</div></td><td><div class="pull-left"><select class="form-control" id="ty-variables"><option value="0">Business Name</option><option value="1">Ticket Name</option><option value="2">Ticket Description</option><option value="3">Ticket Price</option><option value="4">Ticket Expiration</option><option value="5">Ticket Views</option><option value="6">Email</option><option value="7">Order Number</option><option value="8">Order Date</option><option value="9">Entry Name</option></select></div><button id="insert_variable" class="btn btn-default variable-btn" onclick="smhPPV.addTyVariable(); return false;">Insert Variable</button><button id="clear" class="btn btn-default variable-btn" onclick="smhPPV.clearTyData(); return false;">Clear Data</button><button id="restore" class="btn btn-default variable-btn" onclick="smhPPV.restoreTyData(); return false;">Restore Template Data</button></td>
                                            <tr>
                                                <td style="width: 300px;"><div style="margin-left: 10px;">Body</div></td><td><textarea name="ty_body" class="form-control" placeholder="Enter a Body" id="ty_body" /></textarea><div style="margin-top: 5px; color: #999;"><i>The message that will be used for this email.</i></div></td>
                                            </tr>  
                                            <tr>
                                                <td></td><td><div style="float: left"><button id="save_ty" class="btn btn-primary" onclick="smhPPV.saveTyEmail(); return false;">Save Changes</button></div><div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div></td>
                                            </tr>
                                        </table>          
                                    </form>
                                </div> 

                            </div>
                            <div style="position: relative;" id="pass-email" class="tab-pane">
                                <div id="register-table">
                                    <form id="pswd-email" action="">
                                        <table id="gateway-table" style="margin-top: 10px; margin-bottom: 15px;">
                                            <tr>
                                                <td style="width: 300px;"><div style="margin-left: 10px;">Description</div></td><td>This e-mail is automatically sent out when you reset a user's password or when the registered user completes the "Forgot Password" wizard.<br> Your message <strong>MUST</strong> include at least the "Password" variable.</td>
                                            </tr>
                                            <tr>
                                                <td style="width: 300px;"><div style="margin-left: 10px;">Email Template</div></td><td><select class="form-control" id="pswd-email-template"><option value="default">Default Template</option><option value="custom">Custom Template</option></select><div style="margin-top: 5px; color: #999;"><i>Use the default template or customize your own message.</i></div></td>
                                            </tr>                                        
                                            <tr>
                                                <td style="width: 300px;"><div style="margin-left: 10px;">Subject</div></td><td><input type="text" name="pswd_subject" class="form-control" placeholder="Enter a Subject" id="pswd_subject"/><div style="margin-top: 5px; color: #999;"><i>The subject that will be used for this email.</i></div></td>
                                            </tr>
                                            <tr>
                                                <td style="width: 300px;"><div style="margin-left: 10px;">Insert Variable</div></td><td><div class="pull-left"><select class="form-control" id="pswd-variables"><option value="0">Business Name</option><option value="1">User Name</option><option value="2">Password</option><option value="3">Email</option></select></div><button id="insert_variable" class="btn btn-default variable-btn" onclick="smhPPV.addPswdVariable(); return false;">Insert Variable</button><button id="clear" class="btn btn-default variable-btn" onclick="smhPPV.clearPswdData(); return false;">Clear Data</button><button id="restore" class="btn btn-default variable-btn" onclick="smhPPV.restorePswdData(); return false;">Restore Template Data</button></td>
                                            <tr>
                                                <td style="width: 300px;"><div style="margin-left: 10px;">Body</div></td><td><textarea name="pswd_body" class="form-control" placeholder="Enter a Body" id="pswd_body" /></textarea><div style="margin-top: 5px; color: #999;"><i>The message that will be used for this email.</i></div></td>
                                            </tr>  
                                            <tr>
                                                <td></td><td><div style="float: left"><button id="save_pswd" class="btn btn-primary" onclick="smhPPV.savePswdEmail(); return false;">Save Changes</button></div><div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div></td>
                                            </tr>
                                        </table>          
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Modal -->
</div>
@stop

@section('footer')
<script src="/js/bootstrap3-wysihtml5.all.min.js?v=1" type="text/javascript"></script>
<script src="/js/jquery.cookie.js?v=1" type="text/javascript"></script>
<script src="/js/ppv.email.templates.js?v=1" type="text/javascript"></script>
@stop