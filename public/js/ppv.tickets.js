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
var total_entries;

//PPV prototype/class
PPV.prototype = {
    constructor: PPV,
    //Load ppv user table
    getTickets:function(){
        $('#tickets-table').empty();
        $('#tickets-table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="tickets-data"></table>');
        $('#tickets-data').dataTable({
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
                        "action": "list_tickets",
                        "pid": sessInfo.pid,
                        "ks": sessInfo.ks,
                        "currency": $.cookie('currency')
                    } );
                },
                "dataSrc": function ( json ) {
                    total_entries = json['recordsTotal'];
                    return json.data;
                }
            },
            "language": {
                "zeroRecords": "No Tickets Found"
            },
            "columns": [
            {
                "title": "<span style='float: left;'>Status</span>"
            },
            {
                "title": "<span style='float: left;'>Name</span>"
            },
            {
                "title": "<span style='float: left;'>Price</span>"
            },
            {
                "title": "<span style='float: left;'>Type</span>"
            },
            {
                "title": "<span style='float: left;'>Expiry Period</span>"
            },
            {
                "title": "<span style='float: left;'>Max Views</span>"
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
                smhMain.fcmcAddRows(this, 9, 10);     
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
                    smhPPV.getTickets();
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
    //Ticekt add modal
    addTicket:function(){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','540px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close edit-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Create Ticket</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<center><form id="edit-ticket" style="margin-top: 20px;" action="">'+
        '<table width="460px" height="270px" border="0" id="admin_edit">'+
        '<tr>'+
        '<td><div style="width: 145px;">Ticket Payment Type:</div></td><td><select class="form-control" id="ticket_type" style="width: 180px; float: left;"><option value="1">One-off</option><option value="2">Weekly Subscription</option><option value="3">Monthly Subscription</option><option value="4">Yearly Subscription</option></select></td>'+
        '</tr>'+
        '<tr>'+
        '<td><div style="width: 130px;"><span style="font-weight: normal;" class="required">Ticket Name:</span></div></td><td><input type="text" name="tname" class="form-control" placeholder="Enter a Ticket Name" id="tname" size="49"></td>'+
        '</tr>'+
        '<tr>'+
        '<td>Ticket Description:</td><td><input type="text" name="tdesc" class="form-control" placeholder="Enter a Description" id="tdesc" size="49"></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span style="font-weight: normal;" class="required">Ticket Price:</span></td><td><input type="text" name="tprice" class="form-control" placeholder="Price" id="tprice" style="width: 70px !important; float: left;" ><div style="margin-left: 80px;">'+$.cookie('currency')+'</div></td>'+
        '</tr>'+
        '<tr>'+
        '<td>Status:</td><td><select id="status" class="form-control" style="width: 180px;"><option value="1">Active</option><option value="2">Blocked</option></select></td>'+
        '</tr>'+
        '<tr class="expires-period">'+
        '<td>Expiry Period:</td><td><select id="expires" class="form-control" style="width: 180px; float: left;"><option value="1">UNLIMITED</option><option value="2">LIMITED</option></select></td>'+
        '</tr>'+
        '<tr id="expires-data">'+
        '<td></td><td><div class="pull-left"><input id="ticket_hours" name="ticket_hours" class="form-control" type="text" style="width:50px !important;" value="0" size="2"></div><div class="clear" style="padding-top: 5px; padding-bottom: 5px;"></div><div class="pull-left"><input id="ticket_days" name="ticket_days" class="form-control" type="text" style="width:50px !important;" value="0" size="2"></div><div class="clear" style="padding-top: 5px; padding-bottom: 5px;"></div><div class="pull-left"><input id="ticket_months" name="ticket_months" class="form-control" type="text" style="width:50px !important;" value="0" size="2"></div><div class="clear" style="padding-top: 5px; padding-bottom: 5px;"></div><div class="pull-left"><input id="ticket_years" name="ticket_years" class="form-control" type="text" style="width:50px !important;" value="0" size="2"></div><div class="clear" style="padding-top: 5px; padding-bottom: 5px;"></div></td>'+
        '</tr>'+
        '<tr class="max-views">'+
        '<td>Max Views:</td><td><select id="views" class="form-control" style="width: 180px; float: left;"><option value="1">UNLIMITED</option><option value="2">LIMITED</option></select></td>'+
        '</tr>'+
        '<tr id="views-data">'+
        '<td></td><td><div class="pull-left"><input id="max-views" name="max_views" class="form-control" type="text" style="width:50px !important;" value="0"></div></td>'+
        '</tr>'+
        '</table>'+
        '</form></center>';         
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default edit-close" data-dismiss="modal">Close</button><button id="create-ticket" class="btn btn-primary" onclick="smhPPV.createTicket();">Create</button>';
        $('#smh-modal .modal-footer').html(footer);
        
        $("input[name='ticket_hours']").TouchSpin({
            initval: 0,
            postfix: 'Hour(s)',
            min: 0,
            max: 10000,
            step: 1,
            verticalbuttons: true
        }); 
        $("input[name='ticket_days']").TouchSpin({
            initval: 0,
            postfix: 'Day(s)',
            min: 0,
            max: 10000,
            step: 1,
            verticalbuttons: true
        }); 
        $("input[name='ticket_months']").TouchSpin({
            initval: 0,
            postfix: 'Month(s)',
            min: 0,
            max: 10000,
            step: 1,
            verticalbuttons: true
        }); 
        $("input[name='ticket_years']").TouchSpin({
            initval: 0,
            postfix: 'Year(s)',
            min: 0,
            max: 10000,
            step: 1,
            verticalbuttons: true
        }); 
        $("input[name='max_views']").TouchSpin({
            initval: 0,
            postfix: 'Views',
            min: 0,
            max: 10000,
            step: 1,
            verticalbuttons: true
        });
        
        $('#edit-ticket input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
    
        validator = $("#edit-ticket").validate({
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
                tname:{
                    required: true
                }, 
                tprice:{
                    required: true,
                    number: true,
                    min : 0.01
                },
                status:{
                    required: true
                },
                ticket_hours:{
                    number: true
                },
                ticket_days:{
                    number: true
                },
                ticket_months:{
                    number: true
                },
                ticket_years:{
                    number: true
                }
            },
            messages: {
                tname:{
                    required: "Please enter a ticket name"
                }, 
                tprice:{
                    required: "Please enter ticket price",
                    number: "Please enter a valid ticket price",
                    min: "Must be greater than zero"
                },
                status:{
                    required: "Please choose a status"
                },
                ticket_hours:{
                    number: "Please enter a number"
                },
                ticket_days:{
                    number: "Please enter a number"
                },
                ticket_months:{
                    number: "Please enter a number"
                },
                ticket_years:{
                    number: "Please enter a number"
                }
            }
        });
    },
    //Do create ticket
    createTicket:function(){
        var valid = validator.form();
        if(valid){
            var timezone = jstz.determine();
            var tz = timezone.name();
            var pid = sessInfo.pid;
            var name = $("input#tname").val();
            var desc = $("input#tdesc").val();
            var ticket_price = $("input#tprice").val();
            var expires = $('select#expires option:selected').val();
            var views = $('select#views option:selected').val();    
            var status = $('select#status option:selected').val();
            var ticket_type = $('select#ticket_type option:selected').val();
            var ticket_expirey = '';
            var expiry_config = '';
            var max_views = '';
            var currency = $.cookie('currency');
    
            if(expires == '1' || ticket_type == '2' || ticket_type == '3' || ticket_type == '4'){
                ticket_expirey = 86400 * 365 * 10;
                expiry_config = -1;
            } else {
                var ticket_hour = $("input#ticket_hours").val();
                var ticket_days = $("input#ticket_days").val();
                var ticket_months = $("input#ticket_months").val();
                var ticket_years = $("input#ticket_years").val();
        
                if(ticket_hour == null || ticket_hour == ''){
                    ticket_hour = 0;
                }
        
                if(ticket_days == null || ticket_days == ''){
                    ticket_days = 0;
                }       
                
                if(ticket_months == null || ticket_months == ''){
                    ticket_months = 0;
                }  
                        
                if(ticket_years == null || ticket_years == ''){
                    ticket_years = 0;
                } 
        
                ticket_expirey = (ticket_hour*3600)+(ticket_days*86400)+(ticket_months*2592000)+(ticket_years*31536000);
                expiry_config = '{"expiryConfig":[{"hours":"'+ticket_hour+'","days":"'+ticket_days+'","months":"'+ticket_months+'","years":"'+ticket_years+'"}]}';
            }    
            
            if(views == '1' || ticket_type == '2' || ticket_type == '3' || ticket_type == '4'){
                max_views = -1;
            } else {
                max_views = $('input#max-views').val();
        
                if(max_views == null || max_views == ''){
                    max_views = 0;
                }
            }
    
            var sessData = {
                pid: pid,
                ks: sessInfo.ks,
                tz: tz,
                ticket_name: name,
                ticket_desc: desc,
                ticket_price: ticket_price,
                ticket_type: ticket_type,
                expires: ticket_expirey,
                expiry_config: expiry_config,
                max_views: max_views,
                status: status,
                currency: currency
            }
    
            var reqUrl = ApiUrl+'action=add_ticket';
 
            $.ajax({
                cache:      false,
                url:        reqUrl,
                type:       'GET',
                data:       sessData,
                dataType:   'json',
                beforeSend: function() {
                    $('#create-ticket').attr('disabled','');
                    $('#smh-modal #loading img').css('display','inline-block');
                },
                success:function(data) {
                    if(data['success']){ 
                        smhPPV.getTickets();
                        $('#smh-modal #loading img').css('display','none'); 
                        $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Created!</span>');
                        setTimeout(function(){
                            $('#smh-modal #pass-result').empty();
                            $('#smh-modal').modal('hide');
                        },5000);
                    }
                }
            });
        }
    },
    //Ticket edit modal
    editTicket:function(tid,name,desc,price,expiry,hours,days,months,years,views,bill_period){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','540px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close edit-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Ticket</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<center><form id="edit-ticket" style="margin-top: 20px;" action="">'+
        '<table width="460px" height="270px" border="0" id="admin_edit">'+
        '<tr>'+
        '<td><div style="width: 145px;">Ticket Payment Type:</div></td><td><select class="form-control" id="ticket_type" style="width: 180px; float: left;"><option value="1">One-off</option><option value="2">Weekly Subscription</option><option value="3">Monthly Subscription</option><option value="4">Yearly Subscription</option></select></td>'+
        '</tr>'+
        '<tr>'+
        '<td><div style="width: 130px;"><span style="font-weight: normal;" class="required">Ticket Name:</span></div></td><td><input type="text" name="tname" class="form-control" placeholder="Enter a Ticket Name" id="tname" size="49" value="'+name+'"></td>'+
        '</tr>'+
        '<tr>'+
        '<td>Ticket Description:</td><td><input type="text" name="tdesc" class="form-control" placeholder="Enter a Description" id="tdesc" size="49" value="'+desc+'"></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span style="font-weight: normal;" class="required">Ticket Price:</span></td><td><input type="text" name="tprice" class="form-control" placeholder="Price" id="tprice" style="width: 70px !important; float: left;" value="'+price+'"><div style="margin-left: 80px;">'+$.cookie('currency')+'</div></td>'+
        '</tr>'+
        '<tr class="expires-period">'+
        '<td>Expiry Period:</td><td><select id="expires" class="form-control" style="width: 180px; float: left;"><option value="1">UNLIMITED</option><option value="2">LIMITED</option></select></td>'+
        '</tr>'+
        '<tr id="expires-data">'+
        '<td></td><td><div class="pull-left"><input id="ticket_hours" name="ticket_hours" class="form-control" type="text" style="width:50px !important;" value="0" size="2"></div><div class="clear" style="padding-top: 5px; padding-bottom: 5px;"></div><div class="pull-left"><input id="ticket_days" name="ticket_days" class="form-control" type="text" style="width:50px !important;" value="0" size="2"></div><div class="clear" style="padding-top: 5px; padding-bottom: 5px;"></div><div class="pull-left"><input id="ticket_months" name="ticket_months" class="form-control" type="text" style="width:50px !important;" value="0" size="2"></div><div class="clear" style="padding-top: 5px; padding-bottom: 5px;"></div><div class="pull-left"><input id="ticket_years" name="ticket_years" class="form-control" type="text" style="width:50px !important;" value="0" size="2"></div><div class="clear" style="padding-top: 5px; padding-bottom: 5px;"></div></td>'+
        '</tr>'+
        '<tr class="max-views">'+
        '<td>Max Views:</td><td><select id="views" class="form-control" style="width: 180px; float: left;"><option value="1">UNLIMITED</option><option value="2">LIMITED</option></select></td>'+
        '</tr>'+
        '<tr id="views-data">'+
        '<td></td><td><div class="pull-left"><input id="max-views" name="max_views" class="form-control" type="text" style="width:50px !important;" value="0"></div></td>'+
        '</tr>'+
        '</table>'+
        '</form></center>';         
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default edit-close" data-dismiss="modal">Close</button><button id="update-ticket" class="btn btn-primary" onclick="smhPPV.updateTicket('+tid+')">Update</button>';
        $('#smh-modal .modal-footer').html(footer);
        
        $("input[name='ticket_hours']").TouchSpin({
            initval: 0,
            postfix: 'Hour(s)',
            min: 0,
            max: 10000,
            step: 1,
            verticalbuttons: true
        }); 
        $("input[name='ticket_days']").TouchSpin({
            initval: 0,
            postfix: 'Day(s)',
            min: 0,
            max: 10000,
            step: 1,
            verticalbuttons: true
        }); 
        $("input[name='ticket_months']").TouchSpin({
            initval: 0,
            postfix: 'Month(s)',
            min: 0,
            max: 10000,
            step: 1,
            verticalbuttons: true
        }); 
        $("input[name='ticket_years']").TouchSpin({
            initval: 0,
            postfix: 'Year(s)',
            min: 0,
            max: 10000,
            step: 1,
            verticalbuttons: true
        }); 
        $("input[name='max_views']").TouchSpin({
            initval: 0,
            postfix: 'Views',
            min: 0,
            max: 10000,
            step: 1,
            verticalbuttons: true
        });
        
        if(expiry == -1){
            $("select#expires").val('1');
        } else {
            $("select#expires").val('2');
            $('#expires-data').css('display','table-row');
            $('#ticket_hours').val(hours);
            $('#ticket_days').val(days);
            $('#ticket_months').val(months);   
            $('#ticket_years').val(years);          
        }
    
        if(views == -1){
            $("select#views").val('1');
        } else {
            $("select#views").val('2');
            $('#views-data').css('display','table-row');
            $('#max-views').val(views);
        }
    
        if(bill_period == '-1'){
            $("select#ticket_type").val('1');
        } else if(bill_period == 'week') {
            $("select#ticket_type").val('2');
            $('.expires-period').css('display','none'); 
            $('.max-views').css('display','none');
            $('#expires-data').css('display','none');
            $('#views-data').css('display','none'); 
        } else if(bill_period == 'month') {
            $("select#ticket_type").val('3');
            $('.expires-period').css('display','none'); 
            $('.max-views').css('display','none');
            $('#expires-data').css('display','none');
            $('#views-data').css('display','none'); 
        } else if(bill_period == 'year') {
            $("select#ticket_type").val('4');
            $('.expires-period').css('display','none'); 
            $('.max-views').css('display','none');
            $('#expires-data').css('display','none');
            $('#views-data').css('display','none'); 
        }
        
        $('#edit-ticket input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
    
        validator = $("#edit-ticket").validate({
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
                tname:{
                    required: true
                }, 
                tprice:{
                    required: true,
                    number: true,
                    min : 0.01
                },
                ticket_hours:{
                    number: true
                },
                ticket_days:{
                    number: true
                },
                ticket_months:{
                    number: true
                },
                ticket_years:{
                    number: true
                }
            },
            messages: {
                tname:{
                    required: "Please enter a ticket name"
                }, 
                tprice:{
                    required: "Please enter ticket price",
                    number: "Please enter a valid ticket price",
                    min: "Must be greater than zero"
                },
                ticket_hours:{
                    number: "Please enter a number"
                },
                ticket_days:{
                    number: "Please enter a number"
                },
                ticket_months:{
                    number: "Please enter a number"
                },
                ticket_years:{
                    number: "Please enter a number"
                }
            }
        });
    },
    //Do ticket update
    updateTicket:function(tid){
        var valid = validator.form();
        if(valid){
            var timezone = jstz.determine();
            var tz = timezone.name();
            var pid = sessInfo.pid;
            var name = $("input#tname").val();
            var desc = $("input#tdesc").val();
            var ticket_price = $("input#tprice").val();
            var ticket_type = $('select#ticket_type option:selected').val();
            var expires = $('select#expires option:selected').val();
            var views = $('select#views option:selected').val();    
            var ticket_expirey = '';
            var expiry_config = '';
            var max_views = '';
    
            if(expires == '1' || ticket_type == '2' || ticket_type == '3' || ticket_type == '4'){
                ticket_expirey = 86400 * 365 * 10;
                expiry_config = -1;
            } else {
                var ticket_hour = $("input#ticket_hours").val();
                var ticket_days = $("input#ticket_days").val();
                var ticket_months = $("input#ticket_months").val();
                var ticket_years = $("input#ticket_years").val();
        
                if(ticket_hour == null || ticket_hour == ''){
                    ticket_hour = 0;
                }
        
                if(ticket_days == null || ticket_days == ''){
                    ticket_days = 0;
                }       
                
                if(ticket_months == null || ticket_months == ''){
                    ticket_months = 0;
                }  
                        
                if(ticket_years == null || ticket_years == ''){
                    ticket_years = 0;
                } 
        
                ticket_expirey = (ticket_hour*3600)+(ticket_days*86400)+(ticket_months*2592000)+(ticket_years*31536000);
                expiry_config = '{"expiryConfig":[{"hours":"'+ticket_hour+'","days":"'+ticket_days+'","months":"'+ticket_months+'","years":"'+ticket_years+'"}]}';
            }    
            
            if(views == '1' || ticket_type == '2' || ticket_type == '3' || ticket_type == '4'){
                max_views = -1;
            } else {
                max_views = $('input#max-views').val();
        
                if(max_views == null || max_views == ''){
                    max_views = 0;
                }
            }
    
            var sessData = {
                pid: pid,
                ks: sessInfo.ks,
                tz: tz,
                ticket_id: tid,
                ticket_name: name,
                ticket_desc: desc,
                ticket_price: ticket_price,
                ticket_type: ticket_type,
                expires: ticket_expirey,
                expiry_config: expiry_config,
                max_views: max_views
            }
    
            var reqUrl = ApiUrl+'action=update_ticket';
  
            $.ajax({
                cache:      false,
                url:        reqUrl,
                type:       'GET',
                data:       sessData,
                dataType:   'json',
                beforeSend: function() {
                    $('#update-ticket').attr('disabled','');
                    $('#smh-modal #loading img').css('display','inline-block');
                },
                success:function(data) {
                    if(data['success']){ 
                        smhPPV.getTickets();
                        $('#update-ticket').removeAttr('disabled'); 
                        $('#smh-modal #loading img').css('display','none'); 
                        $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Updated!</span>');
                        setTimeout(function(){
                            $('#smh-modal #pass-result').empty();
                        },5000);
                    }  
                }
            });          
        }
    },
    //Status modal
    statusTicket:function(pid,tid,name,status){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        var status_update, status_text;
        if(status == 1){
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Block</h4>';           
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to block the selected ticket?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>("+name+")</div>";     
            status_update = 2;
            status_text = 'Block';    
        } else {
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Unblock</h4>';
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to unblock the selected ticket?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>("+name+")</div>";    
            status_update = 1;    
            status_text = 'Unblock';    
        }
        $('#smh-modal .modal-header').html(header);       
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button id="status-ticket" class="btn btn-primary" onclick="smhPPV.updateStatus('+pid+','+tid+','+status_update+')">'+status_text+'</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Do status update
    updateStatus:function(pid,tid,status){
        var timezone = jstz.determine();
        var tz = timezone.name();

        var sessData = {
            pid: pid,
            ks: sessInfo.ks,
            ticket_id: tid,
            status: status,
            tz: tz
        }
    
        var reqUrl = ApiUrl+'action=update_ticket_status';
  
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            beforeSend: function() {
                $('#status-ticket').attr('disabled','');
                $('#smh-modal #loading img').css('display','inline-block');
            },
            success:function(data) {
                if(data['error']){
                    $('#status-ticket').removeAttr('disabled'); 
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Error! Ticket does not exist!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                    },5000);
                } else { 
                    smhPPV.getTickets();
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully updated!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    },5000);
                }
            }
        });
    },
    //Delete ticket modal
    deleteTicket:function(pid,tid,name){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Delete Ticket</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to delete the selected ticket?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>("+name+")</div>";        
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button id="delete-ticket" class="btn btn-primary" onclick="smhPPV.removeTicket('+pid+','+tid+')">Delete</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Do remove ticket
    removeTicket:function(pid,tid){
        var sessData = {
            pid: pid,
            ks: sessInfo.ks,
            ticket_id: tid
        }

        var reqUrl = ApiUrl+'action=delete_ticket';
   
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            beforeSend: function() {
                $('#delete-ticket').attr('disabled','');
                $('#smh-modal #loading img').css('display','inline-block');
            },
            success:function(data) {
                if(data['error']){
                    $('#delete-ticket').removeAttr('disabled'); 
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Error! Ticket does not exist!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                    },5000);
                } else {  
                    smhPPV.getTickets();
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Deleted!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    },5000);
                }
            }
        });
    },
    //Export Metadata
    exportMetaData:function(){        
        if(total_entries){
            window.location = '/apps/platform/metadata/export.metadata.php?pid='+sessInfo.pid+'&ks='+sessInfo.ks+'&page_size='+total_entries+'&action=export_ppv_tickets_metadata';  
        }        
    },
    //Register all user actions
    registerActions:function(){
        $('#smh-modal').on('change','#expires', function(){
            var ticket_expires = $('select#expires option:selected').val();
            if(ticket_expires == '2'){
                $('#expires-data').css('display','table-row');
            }
            else {
                $('#expires-data').css('display','none'); 
            }
        });
        $('#smh-modal').on('change','#views', function(){
            var ticket_views = $('select#views option:selected').val();
            if(ticket_views == '2'){
                $('#views-data').css('display','table-row');
            } else {
                $('#views-data').css('display','none'); 
            }
        });
        $('#smh-modal').on('change', '#ticket_type', function(){
            var ticket_type = $('select#ticket_type option:selected').val();
            if(ticket_type == '1'){
                $('.expires-period').css('display','table-row');
                $('.max-views').css('display','table-row');
                $('#views').val(1); 
                $('#expires').val(1);
            } else {
                $('.expires-period').css('display','none'); 
                $('.max-views').css('display','none');
                $('#expires-data').css('display','none');
                $('#views-data').css('display','none'); 
            }
        });
        $('#smh-modal').on('click', '.edit-close', function(){
            $('#edit-ticket input').tooltipster('destroy');
        });
    }
}

// PPV on ready
$(document).ready(function(){
    smhPPV = new PPV();
    smhPPV.registerActions();
    smhPPV.getGateways();
});
