@extends('app')

@section('css') 
<link href="/css/bootstrap-toggle.min.css?v=1" rel="stylesheet">
@stop

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1><i class="fa fa-tag"></i> Payment Gateway</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li>Pay Per View</li>
            <li class="active">Payment Gateway</li>
        </ol>
    </section>
    <!-- Main content -->
    <section class="content">
        @include('alerts')
        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper">  
                    <div id="page-header-body">
                        <div id="text"><h4>Payment Gateway Settings</h4></div>
                        <div id="icon"><i class="fa fa-comments-o"></i></div>                      
                        <div class="clear"></div>   
                        <div id="gateway-steps">
                            <span class="bbox">1</span> Enable one payment processors from the list below. You need to have an account with them!<br />
                            <span class="bbox">2</span> Click on "See Setup Instructions" and complete them.<br />
                            <span class="bbox">3</span> Set your preferred currency.<br />
                        </div>
                    </div>                      
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="box">
                    <div class="box-body">
                        <form id="gateway-form" action="">
                            <table id="gateway-table">
                                <thead>
                                    <tr>
                                        <td width="300" class="al">Payment Processors</td>
                                        <td>Activate / Deactivate</td>
                                    </tr>
                                </thead>      
                                <tr class="even">
                                    <td><div style="margin-left: 10px;">Authorize.net</div></td><td><input type="checkbox" id="authnet-gate" /></td>
                                </tr>
                                <tr class="authnet-table even" style="display: none;">
                                    <td><div style="margin-left: 10px;">AUTHORIZE.NET SETUP</div></td><td><a href="/user_guide/smh_authnet_setup.pdf" target="_blank" style="color: #005580; margin-right: 30px;"><strong>See Setup Instructions &raquo;</strong></a><input type="checkbox" name="authnet_setup" id="authnet_setup" />&nbsp; I confirm I have completed the required setup.</td>
                                </tr>
                                <tr class="authnet-table even" style="display: none;">
                                    <td><div style="margin-left: 10px;">SILENT POST URL</div></td><td><input type="text" class="form-control" placeholder="SILENT POST URL" value="https://mediaplatform.streamingmediahosting.com/apps/ppv/v1.0/authnet-silent-post.php" /></td>
                                </tr>      
                                <tr class="authnet-table even" style="display: none;">
                                    <td><div style="margin-left: 10px;">RELAY RESPONSE URL</div></td><td><input type="text" class="form-control" placeholder="RELAY RESPONSE URL" value="https://mediaplatform.streamingmediahosting.com/apps/ppv/v1.0/authnet-relay.php" /></td>
                                </tr> 
                                <tr class="authnet-table even" style="display: none;">
                                    <td><div style="margin-left: 10px;">API LOGIN ID</div></td><td><input type="text" name="authnet_login_id" class="form-control" placeholder="Enter Your API Login ID" id="authnet_login_id"/></td>
                                </tr>
                                <tr class="authnet-table even" style="display: none;">
                                    <td><div style="margin-left: 10px;">TRANSACTION KEY</div></td><td><input type="text" name="authnet_transaction_key" class="form-control" placeholder="Enter Your Transaction Key" id="authnet_transaction_key"/></td>
                                </tr>  
                                <tr class="even">
                                    <td><div style="margin-left: 10px;">PayPal Express Checkout</div></td><td><input type="checkbox" id="paypal-gate" /></td>
                                </tr>
                                <tr class="paypal-table even" style="display: none;">
                                    <td><div style="margin-left: 10px;">PAYPAL SETUP</div></td><td><a href="/user_guide/smh_paypal_setup.pdf" target="_blank" style="color: #005580; margin-right: 30px;"><strong>See Setup Instructions &raquo;</strong></a><input type="checkbox" name="paypal_setup" id="paypal_setup" />&nbsp; I confirm I have completed the required setup.</td>
                                </tr>
                                <tr class="paypal-table even" style="display: none;">
                                    <td><div style="margin-left: 10px;">IPN NOTIFICATION URL</div></td><td><input type="text" class="form-control" placeholder="IPN URL" value="https://mediaplatform.streamingmediahosting.com/apps/ppv/v1.0/ipn.php" /></td>
                                </tr>                        
                                <tr class="paypal-table even" style="display: none;">
                                    <td><div style="margin-left: 10px;">PAYPAL API USERNAME</div></td><td><input type="text" name="paypal_user_id" class="form-control" placeholder="Enter Your API Username" id="paypal_user_id"/></td>
                                </tr>
                                <tr class="paypal-table even" style="display: none;">
                                    <td><div style="margin-left: 10px;">PAYPAL API PASSWORD</div></td><td><input type="text" name="paypal_password" class="form-control" placeholder="Enter Your API Password" id="paypal_password"/></td>
                                </tr>      
                                <tr class="paypal-table even" style="display: none;">
                                    <td><div style="margin-left: 10px;">PAYPAL API SIGNATURE</div></td><td><div style="padding-bottom: 10px;"><input type="text" name="paypal_sig" class="form-control" placeholder="Enter Your API Signature" id="paypal_sig"/></div></td>
                                </tr> 
                            </table> 
                        </form>
                        <table id="gateway-table" width="700px" style="margin-top: 10px; margin-bottom: 15px;">
                            <tr>
                                <td style="width: 300px;"><div style="margin-left: 10px;">Currency</div></td>
                                <td>
                                    <div class="pull-left">
                                        <select id="ticket-currency" class="form-control">
                                            <option value="AUD">Australian Dollars (AUD)</option>
                                            <option value="CAD">Canadian Dollars (CAD)</option>
                                            <option value="CZK">Czech Koruna (CZK)</option>
                                            <option value="DKK">Danish Krone (DKK)</option>    
                                            <option value="EUR">Euros (EUR)</option>  
                                            <option value="HKD">Hong Kong Dollar (HKD)</option>  
                                            <option value="HUF">Hungarian Forint (HUF)</option> 
                                            <option value="JPY">Yen (JPY)</option>     
                                            <option value="NZD">New Zealand Dollar (NZD)</option>  
                                            <option value="NOK">Norwegian Krone (NOK)</option> 
                                            <option value="PLN">Polish Zloty (PLN)</option> 
                                            <option value="SGD">Singapore Dollar (SGD)</option>    
                                            <option value="SEK">Swedish Krona (SEK)</option>  
                                            <option value="CHF">Swiss Franc (CHF)</option>                                
                                            <option value="GBP">Pounds Sterling (GBP)</option>
                                            <option value="USD">U.S. Dollars (USD)</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        </table>
                        <div style="width: 100%; text-align: center; margin-bottom: 10px;"><div id="loading"><img height="20px" src="/img/loading.gif"></div><button id="save_gateway" class="btn btn-primary" onclick="smhPPV.saveGateway(); return false;">Save Changes</button><div id="pass-result"></div></div>
                        <div class="clear"></div>
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
<script src="/js/jquery.cookie.js?v=1" type="text/javascript"></script>
<script src="/js/bootstrap-toggle.min.js?v=1" type="text/javascript"></script>
<script src="/js/ppv.gateways.js?v=1" type="text/javascript"></script>
@stop