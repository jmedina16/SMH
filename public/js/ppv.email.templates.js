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
var email_data = new Array();

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
                                $.each(value['options'], function(k, v) {                                                                
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
                                $.each(value['options'], function(k, v) {                                                                
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
    //Gets emails
    getEmail:function(){
        var sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks
        }
    
        var reqUrl = ApiUrl+'action=get_email';
        
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            success:function(data) {
                email_data = data; 
                if(data['custom_reg_default'] == '1'){
                    $('#reg-email-template').val('custom'); 
                    $('#reg_subject').removeAttr('disabled');
                    $('#reg_subject').val(data['custom_reg_subject']);
                    $('#reg_body').val(data['custom_reg_body']);
                
                } else {
                    $('#reg-email-template').val('default'); 
                    $('#reg_subject').attr('disabled',''); 
                    $('#reg_subject').val(data['default_reg_subject']);
                    $('#reg_body').val(data['default_reg_body']);                
                }
                $('#reg_body').wysihtml5({
                    "font-styles": true, 
                    "emphasis": true,
                    "lists": true, 
                    "html": true,
                    "link": true,
                    "image": true,
                    "color": false,
                    "blockquote": true 
                });
                
                if(data['custom_thankyou_default'] == '1'){
                    $('#ty-email-template').val('custom'); 
                    $('#ty_subject').removeAttr('disabled');
                    $('#ty_subject').val(data['custom_thankyou_subject']);
                    $('#ty_body').val(data['custom_thankyou_body']);
                
                } else {
                    $('#ty-email-template').val('default'); 
                    $('#ty_subject').attr('disabled','');
                    $('#ty_subject').val(data['default_thankyou_subject']);
                    $('#ty_body').val(data['default_thankyou_body']);                
                }
                $('#ty_body').wysihtml5({
                    "font-styles": true, 
                    "emphasis": true,
                    "lists": true, 
                    "html": true,
                    "link": true,
                    "image": true,
                    "color": false,
                    "blockquote": true 
                });
                
                if(data['custom_pswd_default'] == '1'){
                    $('#pswd-email-template').val('custom'); 
                    $('#pswd_subject').removeAttr('disabled');
                    $('#pswd_subject').val(data['custom_pswd_subject']);
                    $('#pswd_body').val(data['custom_pswd_body']);
                
                }
                else {
                    $('#pswd-email-template').val('default'); 
                    $('#pswd_subject').attr('disabled',''); 
                    $('#pswd_subject').val(data['default_pswd_subject']);
                    $('#pswd_body').val(data['default_pswd_body']);                
                }
                
                $('#pswd_body').wysihtml5({
                    "font-styles": true, 
                    "emphasis": true,
                    "lists": true, 
                    "html": true,
                    "link": true,
                    "image": true,
                    "color": false,
                    "blockquote": true 
                });
            }
        });
    },
    //Saves regular email
    saveRegEmail:function(){
        var validator = $("#pur-email").validate({
            ignore: [],
            highlight: function(element, errorClass) {
                $(element).removeClass("valid").removeClass("error").addClass("validate-error");
            },        
            unhighlight: function(element, errorClass) {
                $(element).removeClass("valid").removeClass("validate-error");
            },
            rules:{               
                reg_subject:{
                    required: true
                }           
            },
            messages: {          
                reg_subject:{
                    required: "Please enter a subject"
                }
            }
        });
    
        var valid = validator.form();
        if(valid){
            var reg_select = $('#reg-email-template option:selected').val();  
            var reg_subject = $('#reg_subject').val();
            var container = $("#register-table iframe");
            var reg_body = container.contents().find("body").html();
            var sessData;

            if(!reg_body){
                alert('Please enter a message');
            } else if (reg_body.indexOf('<strong>%user_email%</strong>') == -1){
                alert('You must have at least the "User Email" variable in your message.');
            }else {
                if(reg_select == 'custom'){
                    sessData = {
                        pid: sessInfo.pid,
                        ks: sessInfo.ks,
                        reg_default: 1,
                        reg_subject: reg_subject,
                        reg_body: reg_body
                    }        
                } else {
                    sessData = {
                        pid: sessInfo.pid,
                        ks: sessInfo.ks,
                        reg_default: 0,
                        reg_subject: reg_subject,
                        reg_body: reg_body
                    }   
                }
    
                var reqUrl = ApiUrl+'action=add_email_reg';   
                $.ajax({
                    cache:      false,
                    url:        reqUrl,
                    type:       'GET',
                    data:       sessData,
                    dataType:   'json',
                    beforeSend:function(){
                        $('#save_pur').attr('disabled','');
                        $('#register-table #loading img').css('display','inline-block');
                    },
                    success:function(data) {
                        if(data['success']){
                            $('#save_pur').removeAttr('disabled'); 
                            $('#register-table #loading img').css('display','none'); 
                            $('#register-table #pass-result').html('<span class="label label-success">Successfully saved!</span>');
                            setTimeout(function(){
                                $('#register-table #pass-result').empty();
                            },5000); 
                        } 
                    }
                }); 
            } 
        } 
    },
    //Saves thank you email
    saveTyEmail:function(){
        var validator = $("#ty-email").validate({
            ignore: [],
            highlight: function(element, errorClass) {
                $(element).removeClass("valid").removeClass("error").addClass("validate-error");
            },        
            unhighlight: function(element, errorClass) {
                $(element).removeClass("valid").removeClass("validate-error");
            },
            rules:{             
                ty_subject:{
                    required: true
                }           
            },
            messages: {            
                ty_subject:{
                    required: "Please enter a subject"
                }
            }
        });
    
        var valid = validator.form();
        if(valid){
            var ty_select = $('#ty-email-template option:selected').val(); 
            var ty_subject = $('#ty_subject').val();
            var container = $("#ty-email iframe");
            var ty_body = container.contents().find("body").html();
            var sessData;

            if(!ty_body){
                alert('Please enter a message');
            } else if (ty_body.indexOf('<strong>%order_number%</strong>') == -1 || ty_body.indexOf('<strong>%order_date%</strong>') == -1 || ty_body.indexOf('<strong>%entry_name%</strong>') == -1 || ty_body.indexOf('<strong>%ticket_name%</strong>') == -1 || ty_body.indexOf('<strong>%ticket_description%</strong>') == -1 || ty_body.indexOf('<strong>%ticket_price%</strong>') == -1 || ty_body.indexOf('<strong>%ticket_expiry%</strong>') == -1 || ty_body.indexOf('<strong>%ticket_views%</strong>') == -1){
                alert('You are missing the required variables in your message.');
            }else {
                if(ty_select == 'custom'){
                    sessData = {
                        pid: sessInfo.pid,
                        ks: sessInfo.ks,
                        ty_default: 1,
                        ty_subject: ty_subject,
                        ty_body: ty_body
                    }        
                } else {
                    sessData = {
                        pid: sessInfo.pid,
                        ks: sessInfo.ks,
                        ty_default: 0,
                        ty_subject: ty_subject,
                        ty_body: ty_body
                    }   
                }
    
                var reqUrl = ApiUrl+'action=add_email_ty';
  
                $.ajax({
                    cache:      false,
                    url:        reqUrl,
                    type:       'GET',
                    data:       sessData,
                    dataType:   'json',
                    beforeSend:function(){
                        $('#save_ty').attr('disabled','');
                        $('#ty-email #loading img').css('display','inline-block');
                    },
                    success:function(data) {
                        if(data['success']){                            
                            $('#save_ty').removeAttr('disabled'); 
                            $('#ty-email #loading img').css('display','none'); 
                            $('#ty-email #pass-result').html('<span class="label label-success">Successfully saved!</span>');
                            setTimeout(function(){
                                $('#ty-email #pass-result').empty();
                            },5000); 
                        } 
                    }
                }); 
            } 
        }
    },
    //Saves password email
    savePswdEmail:function(){
        var validator = $("#pswd-email").validate({
            ignore: [],
            highlight: function(element, errorClass) {
                $(element).removeClass("valid").removeClass("error").addClass("validate-error");
            },        
            unhighlight: function(element, errorClass) {
                $(element).removeClass("valid").removeClass("validate-error");
            },
            rules:{               
                pswd_subject:{
                    required: true
                }           
            },
            messages: {          
                pswd_subject:{
                    required: "Please enter a subject"
                }
            }
        });
    
        var valid = validator.form();
        if(valid){
            var pswd_select = $('#pswd-email-template option:selected').val();   
            var pswd_subject = $('#pswd_subject').val();
            var container = $("#pswd-email iframe");
            var pswd_body = container.contents().find("body").html();
            var sessData;
    
            if(!pswd_body){
                alert('Please enter a message');
            }
            else {
                if(pswd_select == 'custom'){
                    sessData = {
                        pid: sessInfo.pid,
                        ks: sessInfo.ks,
                        pswd_default: 1,
                        pswd_subject: pswd_subject,
                        pswd_body: pswd_body
                    }        
                } else {
                    sessData = {
                        pid: sessInfo.pid,
                        ks: sessInfo.ks,
                        pswd_default: 0,
                        pswd_subject: pswd_subject,
                        pswd_body: pswd_body
                    }   
                }
    
                var reqUrl = ApiUrl+'action=add_email_pswd';
   
                $.ajax({
                    cache:      false,
                    url:        reqUrl,
                    type:       'GET',
                    data:       sessData,
                    dataType:   'json',
                    beforeSend:function(){
                        $('#save_pswd').attr('disabled','');
                        $('#pswd-email #loading img').css('display','inline-block');
                    },
                    success:function(data) {
                        if(data['success']){
                            $('#save_pswd').removeAttr('disabled'); 
                            $('#pswd-email #loading img').css('display','none'); 
                            $('#pswd-email #pass-result').html('<span class="label label-success">Successfully saved!</span>');
                            setTimeout(function(){
                                $('#pswd-email #pass-result').empty();
                            },5000); 
                        } 
                    }
                }); 
            } 
        } 
    },
    //Adds regular variables
    addRegVariable:function(){
        var vararr = new Array();
        vararr[0] = '<strong>%business_name%</strong>';
        vararr[1] = '<strong>%user_email%</strong>';
        vararr[2] = '<strong>%email%</strong>'; 
    
        var reg_select = $('#reg-email-template option:selected').val();
        if(reg_select == 'custom'){
            var sel = $('#reg-variables option:selected').val();
            var container = $("#register-table iframe");
            var body = container.contents().find("body");
            var ct = body.html();
            body.html(ct + ' ' + vararr[sel]);      
        }  
    },
    //Adds thank you email variables
    addTyVariable:function(){
        var vararr = new Array();
        vararr[0] = '<strong>%business_name%</strong>';
        vararr[1] = '<strong>%ticket_name%</strong>';
        vararr[2] = '<strong>%ticket_description%</strong>';
        vararr[3] = '<strong>%ticket_price%</strong>'; 
        vararr[4] = '<strong>%ticket_expiry%</strong>';  
        vararr[5] = '<strong>%ticket_views%</strong>';   
        vararr[6] = '<strong>%email%</strong>'; 
        vararr[7] = '<strong>%order_number%</strong>';  
        vararr[8] = '<strong>%order_date%</strong>';   
        vararr[9] = '<strong>%entry_name%</strong>';     
    
        var ty_select = $('#ty-email-template option:selected').val();
        if(ty_select == 'custom'){
            var sel = $('#ty-variables option:selected').val();
            var container = $("#ty-email iframe");
            var body = container.contents().find("body");
            var ct = body.html();
            body.html(ct + ' ' + vararr[sel]);      
        } 
    },
    //Adds password email variables
    addPswdVariable:function(){
        var vararr = new Array();
        vararr[0] = '<strong>%business_name%</strong>';
        vararr[1] = '<strong>%user_email%</strong>';
        vararr[2] = '<strong>%password%</strong>';
        vararr[3] = '<strong>%email%</strong>'; 
    
        var pswd_select = $('#pswd-email-template option:selected').val();
        if(pswd_select == 'custom'){
            var sel = $('#pswd-variables option:selected').val();
            var container = $("#pswd-email iframe");
            var body = container.contents().find("body");
            var ct = body.html();
            body.html(ct + ' ' + vararr[sel]);       
        } 
    },
    //Clears regular email data
    clearRegData:function(){
        var reg_select = $('#reg-email-template option:selected').val();
        if(reg_select == 'custom'){
            var container = $("#register-table iframe");
            var body = container.contents().find("body");
            body.html('');
            $('textarea#reg_body').text('');
            $('#reg_subject').val('');        
        }
    },
    //Clears thank you email data
    clearTyData:function(){
        var ty_select = $('#ty-email-template option:selected').val();
        if(ty_select == 'custom'){
            var container = $("#ty-email iframe");
            var body = container.contents().find("body");
            body.html('');
            $('textarea#ty_body').text('');
            $('#ty_subject').val('');        
        }
    },
    //Clears password email data
    clearPswdData:function(){
        var pswd_select = $('#pswd-email-template option:selected').val();
        if(pswd_select == 'custom'){
            var container = $("#pswd-email iframe");
            var body = container.contents().find("body");
            body.html('');
            $('textarea#pswd_body').text('');
            $('#pswd_subject').val('');        
        }
    },
    restoreRegData:function(){
        var reg_select = $('#reg-email-template option:selected').val();
        if(reg_select == 'custom'){
            $('#reg_subject').val(email_data['custom_reg_subject']);
            var container = $("#register-table iframe");
            var body = container.contents().find("body");
            body.html(email_data['custom_reg_body']);
        }
    },
    //Restores thank you email data
    restoreTyData:function(){
        var ty_select = $('#ty-email-template option:selected').val();
        if(ty_select == 'custom'){
            $('#ty_subject').val(email_data['custom_thankyou_subject']);
            var container = $("#ty-email iframe");
            var body = container.contents().find("body");
            body.html(email_data['custom_thankyou_body']);
        }
    },
    //Restores password email data
    restorePswdData:function(){
        var pswd_select = $('#pswd-email-template option:selected').val();
        if(pswd_select == 'custom'){
            $('#pswd_subject').val(email_data['custom_pswd_subject']);
            var container = $("#pswd-email iframe");
            var body = container.contents().find("body");
            body.html(email_data['custom_pswd_body']);
        }
    },
    //Register all user actions
    registerActions:function(){
        $('#reg-email-template').change(function(){
            if($('#reg-email-template').val() == 'default'){
                $('#reg_subject').attr('disabled','');
                $('#reg_subject').val(email_data['default_reg_subject']);                    
                var container = $("#register-table iframe");
                var body = container.contents().find("body");
                body.html(email_data['default_reg_body']);
            } else {
                $('#reg_subject').removeAttr('disabled');
                $('#reg_body').removeAttr('disabled');   
                if(email_data['custom_reg_subject'] == ''){
                    $('#reg_subject').val(email_data['default_reg_subject']);
                } else {
                    $('#reg_subject').val(email_data['custom_reg_subject']);
                }                    
                if(email_data['custom_reg_body'] == ''){                                            
                    var container = $("#register-table iframe");
                    var body = container.contents().find("body");
                    body.html(email_data['default_reg_body']);
                } else {
                    var container = $("#register-table iframe");
                    var body = container.contents().find("body");
                    body.html(email_data['custom_reg_body']);
                }
            }
        });
        $('#ty-email-template').change(function(){
            if($('#ty-email-template').val() == 'default'){
                $('#ty_subject').attr('disabled','');
                $('#ty_subject').val(email_data['default_thankyou_subject']);                    
                var container = $("#ty-email iframe");
                var body = container.contents().find("body");
                body.html(email_data['default_thankyou_body']);
            } else {
                $('#ty_subject').removeAttr('disabled');
                $('#ty_body').removeAttr('disabled'); 
                if(email_data['custom_thankyou_subject'] == ''){
                    $('#ty_subject').val(email_data['default_thankyou_subject']);
                } else {
                    $('#ty_subject').val(email_data['custom_thankyou_subject']);
                }                    
                if(email_data['custom_thankyou_body'] == ''){                                            
                    var container = $("#ty-email iframe");
                    var body = container.contents().find("body");
                    body.html(email_data['default_thankyou_body']);
                } else {
                    var container = $("#ty-email iframe");
                    var body = container.contents().find("body");
                    body.html(email_data['custom_thankyou_body']);
                }
            }
        }); 
        $('#pswd-email-template').change(function(){
            if($('#pswd-email-template').val() == 'default'){
                $('#pswd_subject').attr('disabled','');
                $('#pswd_subject').val(email_data['default_pswd_subject']);                    
                var container = $("#pswd-email iframe");
                var body = container.contents().find("body");
                body.html(email_data['default_pswd_body']);
            } else {
                $('#pswd_subject').removeAttr('disabled');
                $('#pswd_body').removeAttr('disabled'); 
                if(email_data['custom_pswd_subject'] == ''){
                    $('#pswd_subject').val(email_data['default_pswd_subject']);
                } else {
                    $('#pswd_subject').val(email_data['custom_pswd_subject']);
                }                    
                if(email_data['custom_pswd_body'] == ''){                                            
                    var container = $("#pswd-email iframe");
                    var body = container.contents().find("body");
                    body.html(email_data['default_pswd_body']);
                } else {
                    var container = $("#pswd-email iframe");
                    var body = container.contents().find("body");
                    body.html(email_data['custom_pswd_body']);
                }
            }
        });
    }
}

// PPV on ready
$(document).ready(function(){
    smhPPV = new PPV();
    smhPPV.registerActions();
    smhPPV.getGateways();
    smhPPV.getEmail();
});
