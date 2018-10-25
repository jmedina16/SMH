@extends('app')

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1><i class="fa fa-gears"></i> Email Configuration</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li>Pay Per View</li>
            <li>Email</li>
            <li class="active">Configuration</li>
        </ol>
    </section>
    <!-- Main content -->
    <section class="content">
        @include('alerts')
        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper">  
                    <div id="page-header-body">
                        <div id="text">Configure the "From Name" and "From Email" your e-mails should be sent from. Choose whether to use the default SMTP server or configure and use your own SMTP server.</div>
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
                                    <td style="width: 300px;"><div style="margin-left: 10px;">From Name</div></td><td><input type="text" id="from_name" placeholder="Enter a name" class="form-control" name="from_name"><div style="margin-top: 5px; color: #999;"><i>Specify the name that e-mails should be sent from.</i></div></td>
                                </tr>
                                <tr>
                                    <td style="width: 300px;"><div style="margin-left: 10px;">From Email</div></td><td><input type="text" id="from_email" placeholder="Enter an email" class="form-control" name="from_email"><div style="margin-top: 5px; color: #999;"><i>Specify the email that e-mails should be sent from.</i></div></td>
                                </tr>
                                <tr>
                                    <td style="width: 300px;"><div style="margin-left: 10px;">SMTP Server</div></td><td><div class="radio pull-left"><label><input type="radio" name="smtp_server" id="smtp_default" checked=""> Default</label></div><div style="margin-left: 50px;" class="radio pull-left"><label><input type="radio" id="smtp_custom" name="smtp_server"> Custom</label></div><div class="clear"></div><div style="margin-top: 5px; color: #999;"><i>Use the default SMTP Server or enter your custom SMTP Server settings below.</i></div></td>
                                </tr>
                            </table>
                            <table id="gateway-table" style="margin-top: 10px; margin-bottom: 15px;">
                                <tr>
                                    <td style="width: 300px;"><div style="margin-left: 10px;">Server</div></td><td><input type="text" id="smtp_server" placeholder="Enter Your SMTP Server" class="form-control" name="smtp_server"><div style="margin-top: 5px; color: #999;"><i>The IP address or domain name for the e-mail server.</i></div></td>
                                </tr>
                                <tr>
                                    <td style="width: 300px;"><div style="margin-left: 10px;">Port (default 25)</div></td><td><input type="text" id="smtp_port" placeholder="Port" class="form-control" name="smtp_port" value="25" style="width: 56px;"><div style="margin-top: 5px; color: #999;"><i>The port number used by the e-mail server.</i></div></td>
                                </tr>
                                <tr>
                                    <td style="width: 300px;"><div style="margin-left: 10px;">Require Authentication</div></td><td><div class="radio pull-left"><label><input type="radio" name="smtp_auth" id="smtp_auth_no" checked> No</label></div><div style="margin-left: 50px;" class="radio pull-left"><label><input type="radio" name="smtp_auth" id="smtp_auth_yes"> Yes</label></div><div class="clear"></div><div style="margin-top: 5px; color: #999;"><i>Enable this option if authentication is required.</i></div></td>
                                </tr>
                                <tr>
                                    <td style="width: 300px;"><div style="margin-left: 10px;">Password</div></td><td><input type="password" id="smtp_pass" placeholder="Enter your password" class="form-control" name="smtp_pass" style="width: 500px;" disabled><div style="margin-top: 5px; color: #999;"><i>The password for the user account.<br> Note: Your "From Email" must be set to your SMTP username/email.</i></div></td>
                                </tr>
                                <tr>
                                    <td style="width: 300px;"><div style="margin-left: 10px;">Use Secure Connection</div></td><td><div class="radio pull-left"><label><input type="radio" name="smtp_secure" id="smtp_secure_no" checked> No</label></div><div style="margin-left: 50px;" class="radio pull-left"><label><input type="radio" name="smtp_secure" id="smtp_secure_tls"> TLS</label></div><div style="margin-left: 50px;" class="radio pull-left"><label><input type="radio" name="smtp_secure" id="smtp_secure_ssl"> SSL</label></div><div class="clear"></div><div style="margin-top: 5px; color: #999;"><i>Select whether the email requires a secure connection.</i></div></td>
                                </tr>
                            </table>
                        </form>
                        <div style="width: 100%; text-align: center; margin-bottom: 10px;"><div id="loading"><img height="20px" src="/img/loading.gif"></div><button id="save_config" class="btn btn-primary" onclick="smhPPV.saveConfig(); return false;">Save Changes</button><div id="pass-result"></div></div>
                        <div class="clear"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Modal -->
</div>
@stop

@section('footer')
<script src="/js/jquery.cookie.js?v=1" type="text/javascript"></script>
<script src="/js/ppv.email.configuration.js?v=1" type="text/javascript"></script>
@stop