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
var validator, total_orders, total_subs;
var email_data = new Array();

//PPV prototype/class
PPV.prototype = {
    constructor: PPV,
    //Get Orders table
    getOrders:function(){
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#orders-table').empty();
        $('#orders-table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="orders-data"></table>');
        $('#orders-data').dataTable({
            "dom": 'R<"H"lfr>t<"F"ip<"processing-loading">>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": true,
            "serverSide": true,
            "autoWidth": false,
            "pagingType": "bootstrap",
            "pageLength": 10,
            "searching": true,
            "info": true,
            "lengthChange": true,
            "ajax": {
                "url": ApiUrl,
                "type": "GET",
                "data": function ( d ) {                    
                    return $.extend( {}, d, {
                        "action": "list_orders",
                        "pid": sessInfo.pid,
                        "ks": sessInfo.ks,
                        "tz": tz
                    } );
                },
                "dataSrc": function ( json ) {
                    total_orders = json['recordsTotal'];
                    return json.data;
                }
            },
            "language": {
                "zeroRecords": "No Orders Found"
            },
            "columns": [
            {
                "title": "<span style='float: left;'>ID</span>"
            },
            {
                "title": "<span style='float: left;'>Entry Name</span>"
            },
            {
                "title": "<span style='float: left;'>Email</span>"
            },
            {
                "title": "<span style='float: left;'>Payment Status</span>"
            },
            {
                "title": "<span style='float: left;'>Order</span>"
            },
            {
                "title": "<span style='float: left;'>Order Status</span>"
            },
            {
                "title": "<span style='float: left;'>Created At</span>"
            },
            {
                "title": "<span style='float: left;'>Actions</span>",
                "width": "195px"
            }
            ],           
            "preDrawCallback": function() {
                smhMain.showProcessing();
            },           
            "drawCallback": function( oSettings ) {
                smhMain.hideProcessing();
                smhMain.fcmcAddRows(this, 8, 10);     
            }                              
        });
    },
    //Get Subscription orders table
    getSubs:function(){
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#subs-table').empty();
        $('#subs-table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="subs-data"></table>');
        $('#subs-data').dataTable({
            "dom": 'R<"H"lfr>t<"F"ip<"processing-loading">>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": true,
            "serverSide": true,
            "autoWidth": false,
            "pagingType": "bootstrap",
            "pageLength": 10,
            "searching": true,
            "info": true,
            "lengthChange": true,
            "ajax": {
                "url": ApiUrl,
                "type": "GET",
                "data": function ( d ) {                    
                    return $.extend( {}, d, {
                        "action": "list_subs",
                        "pid": sessInfo.pid,
                        "ks": sessInfo.ks,
                        "tz": tz
                    } );
                },
                "dataSrc": function ( json ) {
                    total_subs = json['recordsTotal'];
                    return json.data;
                }
            },
            "language": {
                "zeroRecords": "No Subscriptions Found"
            },
            "columns": [
            {
                "title": "<span style='float: left;'>ID</span>"
            },
            {
                "title": "<span style='float: left;'>Status</span>"
            },
            {
                "title": "<span style='float: left;'>Email</span>"
            },
            {
                "title": "<span style='float: left;'>Order</span>"
            },
            {
                "title": "<span style='float: left;'>Created At</span>"
            },
            {
                "title": "<span style='float: left;'>Updated At</span>"
            },
            {
                "title": "<span style='float: left;'>Actions</span>",
                "width": "195px"
            }
            ],           
            "preDrawCallback": function() {
                smhMain.showProcessing();
            },           
            "drawCallback": function( oSettings ) {
                smhMain.hideProcessing();
                smhMain.fcmcAddRows(this, 7, 10);     
            }                              
        });
    },
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
    //Delete order modal
    deleteOrder:function(pid,oid){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Delete Order</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to delete the selected order?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>( ID #"+oid+" )</div>";        
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button id="delete-order" class="btn btn-primary" onclick="smhPPV.removeOrder('+pid+','+oid+')">Delete</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Do delete order
    removeOrder:function(pid,oid){
        var sessData = {
            pid: pid,
            ks: sessInfo.ks,
            order_id: oid
        }

        var reqUrl = ApiUrl+'action=delete_order';
   
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            beforeSend: function() {
                $('#delete-order').attr('disabled','');
                $('#smh-modal #loading img').css('display','inline-block');
            },
            success:function(data) {
                if(data['error']){
                    $('#delete-order').removeAttr('disabled'); 
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Error! Order does not exist!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                    },3000);
                } else {
                    smhPPV.getOrders();
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Deleted!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    },3000);  
                }
            }
        });
    },
    //Refund order modal
    refundOrder:function(pid,oid,ticket_type,status,order_status){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Refund Order</h4>';
        $('#smh-modal .modal-header').html(header);
        
        if((status == 2 || status == 8) && order_status != 3){
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to refund the selected order?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>( ID #"+oid+" )</div>";
            footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button id="refund-order" class="btn btn-primary" onclick="smhPPV.doRefund('+pid+','+oid+',\''+ticket_type+'\')">Refund</button>';
        } else {
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>This order cannot be refunded.<div>"; 
            footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
        }        
        $('#smh-modal .modal-body').html(content);
        $('#smh-modal .modal-footer').html(footer);
    },
    //Do refund
    doRefund:function(pid,oid,ticket_type){
        var sessData = {
            pid: pid,
            ks: sessInfo.ks,
            order_id: oid,
            ticket_type: ticket_type
        }

        var reqUrl = ApiUrl+'action=refund_order';
   
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            beforeSend: function() {
                $('#refund-order').attr('disabled','');
                $('#smh-modal #loading img').css('display','inline-block');
            },
            success:function(data) {
                if(data['success']){
                    smhPPV.getOrders();
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Refunded!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    },5000); 
                } else {
                    $('#refund-order').removeAttr('disabled'); 
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Error! Order could not be refunded!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                    },5000);
                }
            }
        }); 
    },
    //View Order Details
    viewDetails:function(ticket_name,ticket_price,expires,max_views,views){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','370px');
        $('#smh-modal .modal-body').css('padding','0');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Order Details</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div id='rules-wrapper'>"+
        "<h4>Ticket Name</h4>"+
        "<div style='margin-bottom: 25px;'>"+ticket_name+"</div>"+
        "<h4>Ticket Price</h4>"+
        "<div style='margin-bottom: 25px;'>"+ticket_price+"</div>"+
        "<h4>Expiration Date</h4>"+
        "<div style='margin-bottom: 25px;'>"+expires+"</div>"+
        "<h4>Max Views</h4>"+
        "<div style='margin-bottom: 25px;'>"+max_views+"</div>"+
        "<h4>Current Views</h4>"+
        "<div style='margin-bottom: 25px;'>"+views+"</div>"+
        "</div>";
 
        $('#smh-modal .modal-body').html(content);
        
        footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
        $('#smh-modal #rules-wrapper').mCustomScrollbar({
            theme:"inset-dark",
            scrollButtons:{
                enable: true
            }
        });
    },
    //View Subscription details
    viewSubsDetails:function(ticket_name,ticket_price,payment_cycle){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','370px');
        $('#smh-modal .modal-body').css('padding','0');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Order Details</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div id='rules-wrapper'>"+
        "<h4>Ticket Name</h4>"+
        "<div style='margin-bottom: 25px;'>"+ticket_name+"</div>"+
        "<h4>Ticket Price</h4>"+
        "<div style='margin-bottom: 25px;'>"+ticket_price+"</div>"+
        "<h4>Payment Cycle</h4>"+
        "<div style='margin-bottom: 25px;'>"+payment_cycle+"</div>"+
        "</div>";
 
        $('#smh-modal .modal-body').html(content);
        
        footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
        $('#smh-modal #rules-wrapper').mCustomScrollbar({
            theme:"inset-dark",
            scrollButtons:{
                enable: true
            }
        });
    },
    //Suspend Modal
    suspendSub:function(pid,sid,status){
        smhMain.resetModal();
        var header, content, footer, status_update, button_text;
        $('.smh-dialog').css('width','500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });        
        
        if(status == 1){
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Suspension</h4>';
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to suspend the selected subscription?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>( ID #"+sid+" )</div>";
            status_update = 2;
            button_text = 'Suspend';
        } else if(status == 2){
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Reactivation</h4>';
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to reactivate the selected subscription?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>( ID #"+sid+" )</div>"; 
            status_update = 1;  
            button_text = 'Reactivate';
        }          
        $('#smh-modal .modal-header').html(header);       
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button id="status-sub" class="btn btn-primary" onclick="smhPPV.subStatus('+pid+','+sid+','+status_update+')">'+button_text+'</button>';  
        $('#smh-modal .modal-footer').html(footer);
    },
    //Do change subscription status
    subStatus:function(pid,sid,status){
        var timezone = jstz.determine();
        var tz = timezone.name();

        var sessData = {
            pid: pid,
            ks: sessInfo.ks,
            sub_id: sid,
            status: status,
            tz: tz
        }
    
        var reqUrl = ApiUrl+'action=update_sub_status';
  
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            beforeSend: function() {
                $('#status-sub').attr('disabled','');
                $('#smh-modal #loading img').css('display','inline-block');
            },
            success:function(data) {
                if(data['success']){
                    smhPPV.getSubs();
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-success">Status Successfully Updated!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    },5000); 
                }
            }
        });
    },
    //Delete subscription modal
    deleteSub:function(pid,sid){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Delete Subscription</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to delete the selected subscription?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>( ID #"+sid+" )</div>";        
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button id="delete-sub" class="btn btn-primary" onclick="smhPPV.removeSub('+pid+','+sid+')">Delete</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Do remove subscription
    removeSub:function(pid,sid){
        var sessData = {
            pid: pid,
            ks: sessInfo.ks,
            sub_id: sid
        }

        var reqUrl = ApiUrl+'action=delete_sub';
  
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            beforeSend: function() {
                $('#delete-sub').attr('disabled','');
                $('#smh-modal #loading img').css('display','inline-block');
            },
            success:function(data) {
                if(data['success']){
                    smhPPV.getSubs();
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Deleted!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    },3000); 
                } else {
                    $('#delete-sub').removeAttr('disabled'); 
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Error! Subscription already Deleted!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                    },3000);
                }
            }
        }); 
    },
    //Cancel susbscription modal
    cancelSub:function(pid,sid){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Cancel Subscription</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to cancel the selected subscription?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>( ID #"+sid+" )</div>";        
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button id="cancel-sub" class="btn btn-primary" onclick="smhPPV.cancel_sub('+pid+','+sid+')">Cancel</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Do subscription cancelation
    cancel_sub:function(pid,sid){
        var sessData = {
            pid: pid,
            ks: sessInfo.ks,
            sub_id: sid
        }

        var reqUrl = ApiUrl+'action=cancel_sub';
  
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            beforeSend: function() {
                $('#cancel-sub').attr('disabled','');
                $('#smh-modal #loading img').css('display','inline-block');
            },
            success:function(data) {
                if(data['success']){
                    smhPPV.getSubs();
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Cancelled!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    },5000); 
                } else {
                    $('#cancel-sub').removeAttr('disabled'); 
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Error! Subscription already Cancelled!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                    },5000);
                }
            }
        }); 
    },
    //Export Metadata
    exportMetaData:function(option){        
        if(option == 'orders'){
            if(total_orders){
                window.location = '/apps/platform/metadata/export.metadata.php?pid='+sessInfo.pid+'&ks='+sessInfo.ks+'&page_size='+total_orders+'&action=export_ppv_orders_metadata';  
            } 
        } else {
            if(total_subs){
                window.location = '/apps/platform/metadata/export.metadata.php?pid='+sessInfo.pid+'&ks='+sessInfo.ks+'&page_size='+total_subs+'&action=export_ppv_subs_metadata';  
            }             
        }       
    },
    //Register all user actions
    registerActions:function(){

    }
}

// PPV on ready
$(document).ready(function(){
    smhPPV = new PPV();
    smhPPV.registerActions();
    smhPPV.getGateways();
    smhPPV.getOrders();
    smhPPV.getSubs();
});
