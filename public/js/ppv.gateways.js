/*
 *
 *	SMH MediaPlatform Plugin
 *	
 *	PPV
 *
 *	7-3-2014
 */
//PPV constructor
function PPV() {}

//Global variables
var ApiUrl = "/apps/ppv/v1.0/dev.php?";
var validator;

//PPV prototype/class
PPV.prototype = {
    constructor: PPV,
    //Gets gateways
    getGateways:function(){
        var sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks
        }   
    
        var reqUrl = ApiUrl+'action=get_gateways';
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            success:function(data) {   
                var gateway_setup = false;
                if(data['gateways'] == ''){
                    smhPPV.setup();                
                } else {
                    $.each(data['gateways'], function(key, value) {
                        if(value['name'] == 'paypal'){
                            if(value['status'] == '1'){
                                gateway_setup = true;
                                $('#paypal-gate').attr('checked','');
                                $('#paypal-gate').bootstrapToggle('on');
                                $('.paypal-table').css('display','table-row'); 
                            }
                            if(value['options']){
                                $.each(value['options'], function(k, v) {                                
                                    if(k == 'api_user_id'){
                                        $('#paypal_user_id').val(v);
                                    }
                                    if(k == 'api_password'){
                                        $('#paypal_password').val(v);
                                    }    
                                    if(k == 'api_sig'){
                                        $('#paypal_sig').val(v);
                                    }   
                                    if(k == 'setup'){
                                        if(v == 1){
                                            $('#paypal_setup').attr('checked', '');
                                        } else {
                                            $('#paypal_setup').removeAttr('checked');
                                        }                        
                                    }
                                
                                    if(k == 'currency'){
                                        $.cookie('currency', v);
                                        $('#ticket-currency').val(v);
                                    }
                                });                               
                            }
                        }                           
                        if(value['name'] == 'authnet'){
                            if(value['status'] == '1'){
                                gateway_setup = true;
                                $('#authnet-gate').attr('checked','');
                                $('#authnet-gate').bootstrapToggle('on');
                                $('.authnet-table').css('display','table-row'); 
                            }
                            if(value['options']){
                                $.each(value['options'], function(k, v) {                                
                                    if(k == 'api_login_id'){
                                        $('#authnet_login_id').val(v);
                                    }
                                    if(k == 'transaction_key'){
                                        $('#authnet_transaction_key').val(v);
                                    }     
                                    if(k == 'setup'){
                                        if(v == 1){
                                            $('#authnet_setup').attr('checked', '');
                                        } else {
                                            $('#authnet_setup').removeAttr('checked');
                                        }                        
                                    }
                                
                                    if(k == 'currency'){
                                        $.cookie('currency', v);
                                        $('#ticket-currency').val(v);
                                    }
                                });
                            }
                        }
                    });
                    if(!gateway_setup){
                        smhPPV.setup();
                    }                    
                }
            }
        });
    },
    //Saves gateways
    saveGateway:function(){
        var reqUrl, sessData;
        if($('#paypal-gate').is(":checked")){
            if(!$('#paypal_setup').is(":checked")){
                alert('Please confirm you have completed the setup.');
            } else {  
                $('#gateway-form input[type="text"]').tooltipster({
                    trigger: 'custom',
                    onlyOne: false,
                    position: 'right'
                });
                var validator = $("#gateway-form").validate({
                    ignore: [],
                    highlight: function(element, errorClass) {
                        $(element).removeClass("valid").removeClass("error").addClass("validate-error");
                    },        
                    unhighlight: function(element, errorClass) {
                        $(element).removeClass("valid").removeClass("validate-error");
                    },
                    errorPlacement: function (error, element) {
                        $(element).tooltipster('update', $(error).text());
                        $(element).tooltipster('show');
                    },
                    success: function (label, element) {
                        $(element).tooltipster('hide');
                    },
                    rules:{  
                        paypal_user_id:{
                            required: true
                        },
                        paypal_password:{
                            required: true
                        },
                        paypal_sig:{
                            required: true
                        }
                    },
                    messages: {
                        paypal_user_id:{
                            required: "Please enter a username"
                        },
                        paypal_password:{
                            required: "Please enter a password"
                        },
                        paypal_sig:{
                            required: "Please enter a signature"
                        }               
                    }
                });   
        
                var valid = validator.form();
                if(valid){
                    sessData = {
                        pid: sessInfo.pid,
                        ks: sessInfo.ks,
                        gate_status: 1,
                        gate_name: 'paypal'
                    }  
                    reqUrl = ApiUrl+'action=add_gateway';

                    $.ajax({
                        cache:      false,
                        url:        reqUrl,
                        type:       'GET',
                        data:       sessData,
                        dataType:   'json',
                        beforeSend:function(){
                            $('#save_gateway').attr('disabled','');
                            $('.box #loading img').css('display','inline-block');
                        },
                        success:function(data) {
                            if(data['success']){
                                var paypal_user_id = $('#paypal_user_id').val();
                                var paypal_password = $('#paypal_password').val();
                                var paypal_sig = $('#paypal_sig').val();
                                var gateway_currency = $('#ticket-currency').val();
                                var sessData = {
                                    pid: sessInfo.pid,
                                    ks: sessInfo.ks,
                                    api_user_id: paypal_user_id,
                                    api_pswd: paypal_password,
                                    api_sig: paypal_sig,
                                    currency: gateway_currency,
                                    setup: 1
                                } 
                    
                                $.cookie('currency', gateway_currency);
                    
                                var reqUrl = ApiUrl+'action=add_paypal_config';
                    
                                $.ajax({
                                    cache:      false,
                                    url:        reqUrl,
                                    type:       'GET',
                                    data:       sessData,
                                    dataType:   'json',
                                    success:function(data) {
                                        if(data['success']){
                                            $('#save_gateway').removeAttr('disabled'); 
                                            $('.box #loading img').css('display','none'); 
                                            $('.box #pass-result').html('<span class="label label-success">Successfully saved!</span>');
                                            setTimeout(function(){
                                                $('.box #pass-result').empty();
                                            },5000);                                                                              
                                        }
                                    }
                                });                           
                            }                                        
                        }
                    });
                }
            }
        }             
            
        if($('#authnet-gate').is(":checked")){
            if(!$('#authnet_setup').is(":checked")){
                alert('Please confirm you have completed the setup.');
            } else {  
                $('#gateway-form input[type="text"]').tooltipster({
                    trigger: 'custom',
                    onlyOne: false,
                    position: 'right'
                });
                var validator = $("#gateway-form").validate({
                    ignore: [],
                    highlight: function(element, errorClass) {
                        $(element).removeClass("valid").removeClass("error").addClass("validate-error");
                    },        
                    unhighlight: function(element, errorClass) {
                        $(element).removeClass("valid").removeClass("validate-error");
                    },
                    errorPlacement: function (error, element) {
                        $(element).tooltipster('update', $(error).text());
                        $(element).tooltipster('show');
                    },
                    success: function (label, element) {
                        $(element).tooltipster('hide');
                    },
                    rules:{  
                        authnet_login_id:{
                            required: true
                        },
                        authnet_transaction_key:{
                            required: true
                        }
                    },
                    messages: {
                        authnet_login_id:{
                            required: "Please enter a login id"
                        },
                        authnet_transaction_key:{
                            required: "Please enter a transaction key"
                        }              
                    }
                });   
        
                var valid = validator.form();
                if(valid){
                    sessData = {
                        pid: sessInfo.pid,
                        ks: sessInfo.ks,
                        gate_status: 1,
                        gate_name: 'authnet'
                    }  
                    reqUrl = ApiUrl+'action=add_gateway';

                    $.ajax({
                        cache:      false,
                        url:        reqUrl,
                        type:       'GET',
                        data:       sessData,
                        dataType:   'json',
                        beforeSend:function(){
                            $('#save_gateway').attr('disabled','');
                            $('.box #loading img').css('display','inline-block');
                        },
                        success:function(data) {
                            if(data['success']){
                                var authnet_login_id = $('#authnet_login_id').val();
                                var authnet_transaction_key = $('#authnet_transaction_key').val();
                                var gateway_currency = $('#ticket-currency').val();
                                var sessData = {
                                    pid: sessInfo.pid,
                                    ks: sessInfo.ks,
                                    api_login_id: authnet_login_id,
                                    transaction_key: authnet_transaction_key,
                                    currency: gateway_currency,
                                    setup: 1
                                } 
                    
                                $.cookie('currency', gateway_currency);
                    
                                var reqUrl = ApiUrl+'action=add_authnet_config';
                    
                                $.ajax({
                                    cache:      false,
                                    url:        reqUrl,
                                    type:       'GET',
                                    data:       sessData,
                                    dataType:   'json',
                                    success:function(data) {
                                        if(data['success']){
                                            $('#save_gateway').removeAttr('disabled'); 
                                            $('.box #loading img').css('display','none'); 
                                            $('.box #pass-result').html('<span class="label label-success">Successfully saved!</span>');
                                            setTimeout(function(){
                                                $('.box #pass-result').empty();
                                            },5000);                                                                              
                                        }
                                    }
                                });                           
                            }                                        
                        }
                    });
                }
            }
        } 
        
        if(!$('#paypal-gate').is(":checked") && !$('#authnet-gate').is(":checked")){
            sessData = {
                pid: sessInfo.pid,
                ks: sessInfo.ks,
                setup: 0
            } 
            reqUrl = ApiUrl+'action=update_setup';
            $.ajax({
                cache:      false,
                url:        reqUrl,
                type:       'GET',
                data:       sessData,
                dataType:   'json',
                beforeSend:function(){
                    $('#save_gateway').attr('disabled','');
                    $('.box #loading img').css('display','inline-block');
                },
                success:function(data) {
                    $('#save_gateway').removeAttr('disabled'); 
                    $('.box #loading img').css('display','none'); 
                    $('.box #pass-result').html('<span class="label label-success">Successfully saved!</span>');
                    setTimeout(function(){
                        $('.box #pass-result').empty();
                    },5000);                                                                              
                }
            });
        }
    },
    //Loads setup modal
    setup:function(){        
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','540px');
        $('#smh-modal .modal-body').css('padding','0');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Pay-Per-View</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='margin-left: auto; margin-right: auto; text-align: center; height: 50px; margin-top: 20px;'>*Notice: You must setup at least one payment gateway to use this service</div>";        
        $('#smh-modal .modal-body').html(content);
        
        footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Register all user actions
    registerActions:function(){
        $('#paypal-gate').bootstrapToggle();
        $('#authnet-gate').bootstrapToggle();
        $('#paypal-gate').change(function() {
            if($(this).prop('checked')){
                $('#authnet-gate').bootstrapToggle('off');
                $('.paypal-table').css('display','table-row')
            } else {
                $('.paypal-table').css('display','none')
            }
        });
        $('#authnet-gate').change(function() {
            if($(this).prop('checked')){
                $('#paypal-gate').bootstrapToggle('off');
                $('.authnet-table').css('display','table-row')
            } else {
                $('.authnet-table').css('display','none')
            }
        });
    }
}

// PPV on ready
$(document).ready(function(){
    smhPPV = new PPV();
    smhPPV.registerActions();
    smhPPV.getGateways();
});
