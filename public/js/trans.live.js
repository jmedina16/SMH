/*
 *
 *	SMH MediaPlatform Plugin
 *	
 *	Trans
 *
 *	7-3-2014
 */
//Trans constructor
function Trans(id,ks) {
    this.id = id;
    this.ks = ks;
}

//Global variables
var flavors = [];
var bulkdelete = new Array();
var total_entries;

//Trans prototype/class
Trans.prototype = {
    constructor: Trans,
    //Inserts name on page
    getTransProfiles:function(){          
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#trans-table').empty();
        $('#trans-table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="trans-data"></table>');
        transTable = $('#trans-data').DataTable({
            "dom": 'R<"H"lfr>t<"F"ip<"processing-loading">>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": true,
            "serverSide": true,
            "autoWidth": false,
            "pagingType": "bootstrap",
            "pageLength": 10,
            "searching": false,
            "info": true,
            "lengthChange": true,
            "ajax": {
                "url": "/api/v1/getTrans",
                "type": "GET",
                "data": function ( d ) {   
                    return $.extend( {}, d, {
                        "_token": $('meta[name="csrf-token"]').attr('content'),
                        "ks": sessInfo.ks,
                        "tz": tz,
                        "m": ($.inArray("TRANSCODING_UPDATE", sessPerm) != -1)? true : false,
                        "d": ($.inArray("TRANSCODING_DELETE", sessPerm) != -1)? true : false
                    } );
                },
                "dataSrc": function ( json ) {
                    var return_data = new Array();
                    total_entries = json['recordsTotal'];
                    return return_data 
                }
            },
            "language": {
                "zeroRecords": "No transcoding profiles found"
            },
            "columns": [
            {
                "title": "<span style='float: left;'><input type='checkbox' class='trans-delete' id='trans-deleteAll' name='trans_deleteAll' style='width:16px; margin-right: 7px;' /></span>",
                "width": "10px"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>ID</div></span>",
                "width": "50px"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>Name</div></span>",
                "width": "170px"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>Description</div></span>",
                "width": "270px"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>Flavors Included</div></span>"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>Default</div></span>",
                "width": "70px"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>Created On</div></span>",
                "width": "150px"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>Actions</div></span>",
                "width": "170px"
            },
            ],           
            "preDrawCallback": function() {
                smhMain.showProcessing();
            },           
            "drawCallback": function( oSettings ) {
                smhMain.hideProcessing();
                smhMain.fcmcAddRows(this, 8, 10);     
            }                                
        });
        
        $('#users-buttons .dd-delete-btn').removeClass('btn-default');
        $('#users-buttons .dd-delete-btn').addClass('btn-disabled');
        $('#users-buttons .dd-delete-btn').attr('disabled','');
        $('#trans-table').on('change',".trans-delete",function(){
            var anyBoxesChecked = false;
            $('#trans-table input[type="checkbox"]').each(function() {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                }
            });
            
            if (anyBoxesChecked == true && ($.inArray("TRANSCODING_DELETE", sessPerm) != -1)){
                $('#users-buttons .dd-delete-btn').removeClass('btn-disabled');
                $('#users-buttons .dd-delete-btn').addClass('btn-default');
                $('#users-buttons .dd-delete-btn').removeAttr('disabled');
            } else {
                $('#users-buttons .dd-delete-btn').removeClass('btn-default');
                $('#users-buttons .dd-delete-btn').addClass('btn-disabled');
                $('#users-buttons .dd-delete-btn').attr('disabled','');
            }
        });
        $('#trans-deleteAll').click(function(){
            if(this.checked){
                $('.trans-delete').each(function(){
                    this.checked = true; 
                });
            } else {
                $('.trans-delete').each(function(){
                    this.checked = false; 
                });
            }
        }); 
    },
    //Add Transcoding modal
    addTrans:function(){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','828px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close trans-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Add New Profile</h4>';
        $('#smh-modal .modal-header').html(header);
        
        content = '<form id="add-trans-form" action="">'+
        '<table width="100%" border="0" id="admin_edit">'+
        '<tr>'+
        '<td><span class="required" style="font-weight: normal;">Name:</span></td><td style="width: 89%;"><input type="text" name="trans_name" id="trans_name" class="form-control" placeholder="Enter profile name"></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span style="font-weight: normal;">Description:</span></td><td><input type="text" name="trans_desc" id="trans_desc" class="form-control" placeholder="Enter profile description"></td>'+
        '</tr>'+
        '</table>'+        
        '<div id="trans-wrapper">'+
        '<div id="trans-header">'+
        '<span class="required" style="font-weight: normal;">Flavors:</span>'+
        '</div>'+
        '<div id="trans-body">'+        
        '<div id="trans-flavor-table"></div>'+        
        '</div>'+
        '</div>'+
        '</form>';
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default trans-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="create-trans" onclick="smhTrans.createTrans()">Create</button>';
        $('#smh-modal .modal-footer').html(footer);
        
        $('#trans-flavor-table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="trans-flavor-data"></table>');
        flavorsTable = $('#trans-flavor-data').DataTable({
            "dom": '<"H"lfr>t<"F"ip>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": false,
            "serverSide": false,
            "autoWidth": false,
            "paging": false,
            "searching": false,
            "info": false,
            "scrollCollapse": true,
            "scrollY": "290px",
            "lengthChange": false,
            "data": flavors,
            "language": {
                "zeroRecords": "No flavors found"
            },
            "columns": [
            {
                "title": "",
                "width": "28px"
            },
            {
                "title": "<span style='float: left;'>ID</span>",
                "width": "55px"
            },
            {
                "title": "<span style='float: left;'>Conversion Flavor</span>",
                "width": "137px"
            },
            {
                "title": "<span style='float: left;'>Format</span>",
                "width": "92px"
            },
            {
                "title": "<span style='float: left;'>Codec</span>",
                "width": "92px"
            },
            {
                "title": "<span style='float: left;'>Bitrate (kbps)</span>",
                "width": "92px"
            },
            {
                "title": "<span style='float: left;'>Dimensions</span>",
                "width": "102px"
            },
            ]                               
        });
        
        $('#add-trans-form input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
        
        validator = $("#add-trans-form").validate({
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
                trans_name:{
                    required: true
                }
            },
            messages: {
                trans_name:{
                    required: 'Please enter a profile name'
                }
            }
        });
    
        $('#trans-body .dataTables_scrollBody').mCustomScrollbar({
            theme:"inset-dark",
            scrollButtons:{
                enable: true
            }
        });
    },
    //Create Transcoding profile
    createTrans:function(){
        var valid = validator.form();
        if(valid){
            var name = $('#add-trans-form #trans_name').val();
            var desc = $('#add-trans-form #trans_desc').val();
            
            var selected = new Array();
            var rowcollection =  flavorsTable.$(".trans-flavor:checked", {
                "page": "all"
            });
            
            rowcollection.each(function(index,elem){
                var checkbox_value = $(elem).val();
                selected.push(checkbox_value);          
            });
            
            if(selected.length > 0){
                var flavors = selected.join();
            
                var cb = function (success, results){
                    if(!success)
                        alert(results);

                    if(results.code && results.message){
                        alert(results.message);
                        return;
                    }                  
                    $('#smh-modal #loading').empty();
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Created!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    },3000); 
                    smhTrans.getTransProfiles();
                };
        
                $('#create-trans').attr('disabled','');
                $('#smh-modal #loading img').css('display','inline-block');
                var conversionProfile = new KalturaConversionProfile();
                conversionProfile.type = 1;
                conversionProfile.name = name;
                conversionProfile.description = desc;
                conversionProfile.flavorParamsIds = flavors;
                client.conversionProfile.add(cb, conversionProfile);        
            } else {
                smhTrans.noFlavorSelected();
            }        
        }
    },
    //Edit transcoding Profile modal
    editTrans:function(id,name,desc,flavorIds,isdefault){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','828px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        var disable = ($.inArray("TRANSCODING_UPDATE", sessPerm) != -1)? '' : 'disabled';
                
        header = '<button type="button" class="close trans-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Profile</h4>';
        $('#smh-modal .modal-header').html(header);
        
        content = '<form id="add-trans-form" action="">'+
        '<table width="100%" border="0" id="admin_edit">'+
        '<tr>'+
        '<td><span class="required" style="font-weight: normal;">Name:</span></td><td style="width: 89%;"><input type="text" name="trans_name" id="trans_name" class="form-control" placeholder="Enter profile name" value="'+name+'" '+disable+'></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span style="font-weight: normal;">Description:</span></td><td><input type="text" name="trans_desc" id="trans_desc" class="form-control" placeholder="Enter profile description" value="'+desc+'" '+disable+'></td>'+
        '</tr>'+
        '</table>'+        
        '<div id="trans-wrapper">'+
        '<div id="trans-header">'+
        '<span class="required" style="font-weight: normal;">Flavors:</span>'+
        '</div>'+
        '<div id="trans-body">'+        
        '<div id="trans-flavor-table"></div>'+        
        '</div>'+
        '</div>'+
        '</form>';
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default trans-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="update-trans" onclick="smhTrans.updateTrans('+id+','+isdefault+')" '+disable+'>Update</button>';
        $('#smh-modal .modal-footer').html(footer);
        
        $('#trans-flavor-table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="trans-flavor-data"></table>');
        flavorsTable = $('#trans-flavor-data').DataTable({
            "dom": '<"H"lfr>t<"F"ip>',
            "order": [],
            "ordering": false,
            "jQueryUI": false,
            "processing": false,
            "serverSide": false,
            "autoWidth": false,
            "paging": false,
            "searching": false,
            "info": false,
            "scrollCollapse": true,
            "scrollY": "290px",
            "lengthChange": false,
            "data": flavors,
            "language": {
                "zeroRecords": "No flavors found"
            },
            "columns": [
            {
                "title": "",
                "width": "28px"
            },
            {
                "title": "<span style='float: left;'>ID</span>",
                "width": "55px"
            },
            {
                "title": "<span style='float: left;'>Conversion Flavor</span>",
                "width": "137px"
            },
            {
                "title": "<span style='float: left;'>Format</span>",
                "width": "92px"
            },
            {
                "title": "<span style='float: left;'>Codec</span>",
                "width": "92px"
            },
            {
                "title": "<span style='float: left;'>Bitrate (kbps)</span>",
                "width": "92px"
            },
            {
                "title": "<span style='float: left;'>Dimensions</span>",
                "width": "102px"
            },
            ]                               
        });
        
        $('#add-trans-form input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
        
        var flavids = flavorIds.split(",");
        $.each(flavids,function(index,value){
            $('#'+value).prop('checked',true);
        });
        
        validator = $("#add-trans-form").validate({
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
                trans_name:{
                    required: true
                }
            },
            messages: {
                trans_name:{
                    required: 'Please enter a profile name'
                }
            }
        });
    
        $('#trans-body .dataTables_scrollBody').mCustomScrollbar({
            theme:"inset-dark",
            scrollButtons:{
                enable: true
            }
        });
    },
    //Update Transcoding Profile
    updateTrans:function(id,isdefault){
        var valid = validator.form();
        if(valid){
            var name = $('#add-trans-form #trans_name').val();
            var desc = $('#add-trans-form #trans_desc').val();
            
            var selected = new Array();
            var rowcollection =  flavorsTable.$(".trans-flavor:checked", {
                "page": "all"
            });
            
            rowcollection.each(function(index,elem){
                var checkbox_value = $(elem).val();
                selected.push(checkbox_value);          
            });
            
            if(selected.length > 0){
                var flavors = selected.join();
            
                var cb = function (success, results){
                    if(!success)
                        alert(results);

                    if(results.code && results.message){
                        alert(results.message);
                        return;
                    }                  
                    $('#smh-modal #loading').empty();
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Updated!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    },3000); 
                    smhTrans.getTransProfiles();
                };
        
                $('#update-trans').attr('disabled','');
                $('#smh-modal #loading img').css('display','inline-block');
                var conversionProfile = new KalturaConversionProfile();
                conversionProfile.name = name;
                conversionProfile.description = desc;
                conversionProfile.flavorParamsIds = flavors;
                conversionProfile.isDefault = (isdefault)? 1 : 0;
                client.conversionProfile.update(cb, id, conversionProfile);        
            } else {
                smhTrans.noFlavorSelected();
            } 
        }
    },
    //Reset Modal
    resetModal:function(){
        $('#smh-modal2 .modal-header').empty(); 
        $('#smh-modal2 .modal-body').empty();
        $('#smh-modal2 .modal-footer').empty();
        $('#smh-modal2 .modal-content').css('min-height','');
        $('#smh-modal2 .smh-dialog2').css('width','');
        $('#smh-modal2 .modal-body').css('height','');
        $('#smh-modal2 .modal-body').css('padding','15px');
    },
    //No Flavor selected modal
    noFlavorSelected:function(){
        smhTrans.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width','286px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">No Flavor Selected</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = '<div style="padding-top: 15px; padding-bottom: 15px; text-align: center;">You must select at least one flavor</div>';
 
        $('#smh-modal2 .modal-body').html(content);
        
        footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button>';
        $('#smh-modal2 .modal-footer').html(footer);
                
        $('#smh-modal2').css('z-index','2000');
        $('#smh-modal').css('z-index','2');
    },
    //Get Flavors
    getFlavors:function(){
        var cb = function(success, results){
            if(!success)
                alert(results);
            if(results.code && results.message){
                alert(results.message);
                return;
            }else{
                var disable = ($.inArray("TRANSCODING_UPDATE", sessPerm) != -1)? '' : 'disabled';
                $.each(results.objects, function(index, value){ 
                    var format = (value.format)? value.format : 'N/A';
                    var codec = (value.videoCodec)? value.videoCodec : 'N/A';
                    var bitrate = value.videoBitrate + value.audioBitrate;
                    var width = (value.width == 0)? '[auto]' : value.width;
                    var height = (value.height == 0)? '[auto]' : value.height;
                    var dimension = width + ' x ' + height;
                    flavors.push(new Array('<input type="checkbox" class="trans-flavor" id="'+value.id+'" value="'+value.id+'" style="width=33px" name="trans_flavor" '+disable+'>',value.id,'<div id="data-name">'+value.name+'</div>',format,codec,bitrate,dimension));
                });
            }
        };
        
        var filter;
        var pager;
        client.flavorParams.listAction(cb, filter, pager);
    },
    //Delete Transcoding modal
    deleteTrans:function(id,name){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','476px');
        $('#smh-modal .modal-body').css('padding','0');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Delete</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='text-align: center; margin: 30px auto; height: 60px; width: 445px;'>Are you sure you want to delete the following Transcoding Profile?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>("+name+")</div>";
 
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="delete-trans" onclick="smhTrans.removeTrans(\''+id+'\')">Delete</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Remove transcoding profile
    removeTrans:function(id){
        var cb = function (success, results){
            if(!success)
                alert(results);

            if(results == null){
                $('#smh-modal').modal('hide');
                smhTrans.getTransProfiles();
            } else if(results.code && results.message){
                alert(results.message);
                return;
            }                
        };
        
        $('#delete-trans').attr('disabled','');
        $('#smh-modal #loading img').css('display','inline-block');
        client.conversionProfile.deleteAction(cb, id);
    },
    //Bulk delete modal
    bulkDeleteModal:function(){
        bulkdelete = new Array();
        var rowcollection =  transTable.$(".trans-delete:checked", {
            "page": "all"
        });
        rowcollection.each(function(index,elem){
            var checkbox_value = $(elem).val();
            if(checkbox_value != -1){
                bulkdelete.push(checkbox_value);
            }            
        });
        
        if(bulkdelete.length == 0){
            smhTrans.noEntrySelected();
        } else {
            smhMain.resetModal();
            var header, content, footer;
            $('.smh-dialog').css('width','440px');
            $('#smh-modal .modal-body').css('padding','0');
            $('#smh-modal').modal({
                backdrop: 'static'
            }); 
        
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Bulk Delete</h4>';
            $('#smh-modal .modal-header').html(header);

            content = '<div style="padding-top: 25px; padding-bottom: 25px; text-align: center;">Are you sure you want to delete the selected profiles?</div>';
 
            $('#smh-modal .modal-body').html(content);
        
            footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="delete-trans" onclick="smhTrans.bulkDelete()">Delete</button>';
            $('#smh-modal .modal-footer').html(footer);          
        }
    },
    //Do bulk delete
    bulkDelete:function(){
        var cb = function (success, results){
            if(!success)
                alert(results);

            if(results.code && results.message){
                alert(results.message);
                return;
            }          
            $('#smh-modal').modal('hide');
            smhTrans.getTransProfiles();
        };
        
        $('#delete-trans').attr('disabled','');
        $('#smh-modal #loading img').css('display','inline-block');        
        client.startMultiRequest();
        $.each(bulkdelete, function(key, value) {
            client.conversionProfile.deleteAction(cb, value);
        });
        client.doMultiRequest(cb);
    },
    //No Profile selected
    noEntrySelected:function(){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','286px');
        $('#smh-modal .modal-body').css('padding','0');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">No Profile Selected</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div style="padding-top: 15px; padding-bottom: 15px; text-align: center;">You must select a profile</div>';
 
        $('#smh-modal .modal-body').html(content);
        
        footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Display setDefault modal
    setDefault:function(id,name){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','476px');
        $('#smh-modal .modal-body').css('padding','0');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Set As Default</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='text-align: center; margin: 30px auto; height: 60px; width: 445px;'>Are you sure you want to set the following profile as your default Transcoding Profile?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>("+name+")</div>";
 
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="default-trans" onclick="smhTrans.setAsDefault(\''+id+'\')">Set As Default</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Set profile as default
    setAsDefault:function(id){
        var cb = function (success, results){
            if(!success)
                alert(results);

            if(results.code && results.message){
                alert(results.message);
                return;
            }                
            $('#smh-modal').modal('hide');
            smhTrans.getTransProfiles();
        };
        
        $('#default-trans').attr('disabled','');
        $('#smh-modal #loading img').css('display','inline-block');
        client.conversionProfile.setAsDefault(cb, id);
    },
    //Export Metadata
    exportMetaData:function(){        
        if(total_entries){
            window.location = '/apps/platform/metadata/export.metadata.php?pid='+sessInfo.pid+'&ks='+sessInfo.ks+'&page_size='+total_entries+'&action=export_trans_metadata'; 
        }        
    },
    //Register all user actions
    registerActions:function(){
        $('#smh-modal').on('click', '.trans-close', function(){
            $('#add-trans-form input[type="text"]').tooltipster('destroy');
        });
        $('#smh-modal2').on('click', '.smh-close2', function(){
            $('#smh-modal').css('z-index','');    
        });
    }
}

// Trans on ready
$(document).ready(function(){
    smhTrans = new Trans();
    smhTrans.getTransProfiles();
    smhTrans.getFlavors();
    smhTrans.registerActions();
});
