/*
 *
 *	Streaming Media Hosting
 *	
 *	Roles
 *
 *	9-15-2015
 */
//Main constructor
function Roles() {}

//Global variables
var total_entries;

//Login prototype/class
Roles.prototype = {
    constructor: Roles,
    //Build tickets table
    getRoles:function(){
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#roles-table').empty();
        $('#roles-table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="roles-data"></table>');
        rolesTable = $('#roles-data').DataTable({
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
            "lengthChange": false,
            "ajax": {
                "url": "/api/v1/getRoles",
                "type": "GET",
                "data": function ( d ) {                    
                    return $.extend( {}, d, {
                        "_token": $('meta[name="csrf-token"]').attr('content'),
                        "ks": sessInfo.ks,
                        "tz": tz,
                        "m": ($.inArray("ADMIN_ROLE_UPDATE", sessPerm) != -1)? true : false,
                        "d": ($.inArray("ADMIN_ROLE_DELETE", sessPerm) != -1)? true : false
                    } );
                },
                "dataSrc": function ( json ) {
                    total_entries = json['recordsTotal'];
                    return json.data 
                }
            },
            "language": {
                "zeroRecords": "No Roles Found"
            },
            "columns": [
            {
                "title": "<span style='float: left;'><div class='data-break'>Role</div></span>"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>Description</div></span>"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>Created On</div></span>"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>Actions</div></span>"
            },
            ],           
            "preDrawCallback": function() {
                smhMain.showProcessing();
            },           
            "drawCallback": function( oSettings ) {
                smhMain.hideProcessing();
                smhMain.fcmcAddRows(this, 4, 10);     
            }                                
        });
    },
    //Load add role modal
    addRole:function(){    
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','615px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close role-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Create Role</h4>';
        $('#smh-modal .modal-header').html(header);
        
        var smh_ppv_item = '';
        var smh_mem_item = '';
        var smh_rs_item = '';
        var smh_wl_item = '';
        if(services.ppv){
            smh_ppv_item = '<div class="item">'+
        '<div class="box-header">'+
        '<h4 class="box-title">'+
        '<span class="title">Pay Per View</span><span class="link"><a data-toggle="collapse" data-parent="#accordion" href="#collapseEleven" class="collapsed toggle-accordion" aria-expanded="false">'+
        '</a></span>'+
        '</h4>'+
        '<div class="clear"></div>'+
        '</div>'+
        '<div id="collapseEleven" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">'+
        '<div class="box-body">'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="smh_ppv">Manage PPV Content</label></div>'+
        '</div>'+
        '</div>'+
        '</div>';
        }
        if(services.mem){
            smh_mem_item = '<div class="item">'+
        '<div class="box-header">'+
        '<h4 class="box-title">'+
        '<span class="title">Membership</span><span class="link"><a data-toggle="collapse" data-parent="#accordion" href="#collapseFourteen" class="collapsed toggle-accordion" aria-expanded="false">'+
        '</a></span>'+
        '</h4>'+
        '<div class="clear"></div>'+
        '</div>'+
        '<div id="collapseFourteen" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">'+
        '<div class="box-body">'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="smh_mem">Manage Membership</label></div>'+
        '</div>'+
        '</div>'+
        '</div>';
        }
        if(services.rs){
            smh_rs_item = '<div class="item">'+
        '<div class="box-header">'+
        '<h4 class="box-title">'+
        '<span class="title">Reseller</span><span class="link"><a data-toggle="collapse" data-parent="#accordion" href="#collapseTwelve" class="collapsed toggle-accordion" aria-expanded="false">'+
        '</a></span>'+
        '</h4>'+
        '<div class="clear"></div>'+
        '</div>'+
        '<div id="collapseTwelve" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">'+
        '<div class="box-body">'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="smh_rs">Manage Reseller Accounts</label></div>'+
        '</div>'+
        '</div>'+
        '</div>';
        }
        if(services.wl){
            smh_wl_item = '<div class="item">'+
        '<div class="box-header">'+
        '<h4 class="box-title">'+
        '<span class="title">White Label</span><span class="link"><a data-toggle="collapse" data-parent="#accordion" href="#collapseThirteen" class="collapsed toggle-accordion" aria-expanded="false">'+
        '</a></span>'+
        '</h4>'+
        '<div class="clear"></div>'+
        '</div>'+
        '<div id="collapseThirteen" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">'+
        '<div class="box-body">'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="smh_wl">Modify White Label Settings</label></div>'+
        '</div>'+
        '</div>'+
        '</div>';
        }
        
        content = '<form id="add-role-form" action="">'+
        '<table width="100%" border="0" id="admin_edit">'+
        '<tr>'+
        '<td><span class="required" style="font-weight: normal;">Role Name:</span></td><td style="width: 82%;"><input type="text" name="role_name" id="role_name" class="form-control" placeholder="Enter role name"></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required" style="font-weight: normal;">Description:</span></td><td><input type="text" name="role_desc" id="role_desc" class="form-control" placeholder="Enter description"></td>'+
        '</tr>'+
        '</table>'+
        '</form>'+
        '<div id="role-permissions-wrapper">'+
        '<div id="role-header">'+
        '<span id="head-left">Set Role\'s Permissions</span>'+
        '<span id="head-right">'+
        '<a onclick="smhRoles.collapseA();">Collapse All</a>'+
        '<a id="a-right" onclick="smhRoles.expandA();">Expand All</a>'+
        '</span>'+
        '</div>'+
        '<div id="role-body">'+
        '<div class="box-group" id="accordion">'+
        '<div class="item">'+
        '<div class="box-header">'+
        '<h4 class="box-title">'+
        '<span class="title">Content Ingestion</span><span class="link"><a data-toggle="collapse" data-parent="#accordion" href="#collapseX" class="collapsed toggle-accordion" aria-expanded="false">'+
        '</a>'+
        '</h4>'+
        '<div class="clear"></div>'+
        '</div>'+
        '<div style="height: 0px;" aria-expanded="false" class="panel-collapse collapse" id="collapseX">'+
        '<div class="box-body">'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="ingest_upload">Upload Content</label></div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="item">'+
        '<div class="box-header">'+
        '<h4 class="box-title">'+
        '<span class="title">Content Management</span><span class="link"><a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" class="collapsed toggle-accordion" aria-expanded="false">'+
        '</a></span>'+
        '</h4>'+
        '<div class="clear"></div>'+
        '</div>'+
        '<div id="collapseTwo" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">'+
        '<div class="box-body">'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="content_metadata">Modify Metadata</label></div>'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="content_modify_refid">Modify Reference ID</label></div>'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="content_entry_cat">Modify Entry\'s Category</label></div>'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="content_modify_thumb">Modify Thumbnail</label></div>'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="content_modify_ac">Modify Access Control</label></div>'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="content_delete">Delete Content</label></div>'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="content_grab_embed">Grab Embed Code</label></div>'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="content_manage_flavors">Manage Flavors</label></div>'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="content_edit_cat">Edit Categories</label></div>'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="content_download">Download Files</label></div>'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="content_edit_related">Edit Related Files</label></div>'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="ingest_live_stream">Create Live Stream</label></div>'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="content_update_live_stream">Update Live Stream</label></div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="item">'+
        '<div class="box-header">'+
        '<h4 class="box-title">'+
        '<span class="title">Playlist Management</span><span class="link"><a data-toggle="collapse" data-parent="#accordion" href="#collapseThree" class="collapsed toggle-accordion" aria-expanded="false">'+
        '</a></span>'+
        '</h4>'+
        '<div class="clear"></div>'+
        '</div>'+
        '<div id="collapseThree" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">'+
        '<div class="box-body">'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="plist_create">Create Playlists</label></div>'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="plist_modify">Modify Playlists</label></div>'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="plist_delete">Delete Playlists</label></div>'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="plist_grab_embed">Grab Playlist Embed Code</label></div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="item">'+
        '<div class="box-header">'+
        '<h4 class="box-title">'+
        '<span class="title">Analytics</span><span class="link"><a data-toggle="collapse" data-parent="#accordion" href="#collapseSix" class="collapsed toggle-accordion" aria-expanded="false">'+
        '</a></span>'+
        '</h4>'+
        '<div class="clear"></div>'+
        '</div>'+
        '<div id="collapseSix" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">'+
        '<div class="box-body">'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="view_analytics">View Analytics</label></div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="item">'+
        '<div class="box-header">'+
        '<h4 class="box-title">'+
        '<span class="title">Account Settings</span><span class="link"><a data-toggle="collapse" data-parent="#accordion" href="#collapseSeven" class="collapsed toggle-accordion" aria-expanded="false">'+
        '</a></span>'+
        '</h4>'+
        '<div class="clear"></div>'+
        '</div>'+
        '<div id="collapseSeven" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">'+
        '<div class="box-body">'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="modify_settings">Modify Account Settings</label></div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="item">'+
        '<div class="box-header">'+
        '<h4 class="box-title">'+
        '<span class="title">Access Control Settings</span><span class="link"><a data-toggle="collapse" data-parent="#accordion" href="#collapseEight" class="collapsed toggle-accordion" aria-expanded="false">'+
        '</a></span>'+
        '</h4>'+
        '<div class="clear"></div>'+
        '</div>'+
        '<div id="collapseEight" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">'+
        '<div class="box-body">'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="ac_create">Create Access Control Profile</label></div>'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="ac_modify">Modify Access Control Profile</label></div>'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="ac_delete">Delete Access Control Profile</label></div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="item">'+
        '<div class="box-header">'+
        '<h4 class="box-title">'+
        '<span class="title">Transcoding Settings</span><span class="link"><a data-toggle="collapse" data-parent="#accordion" href="#collapseNine" class="collapsed toggle-accordion" aria-expanded="false">'+
        '</a></span>'+
        '</h4>'+
        '<div class="clear"></div>'+
        '</div>'+
        '<div id="collapseNine" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">'+
        '<div class="box-body">'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="trans_create">Create Transcoding Profiles</label></div>'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="trans_modify">Modify Transcoding Profiles</label></div>'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="trans_delete">Delete Transcoding Profiles</label></div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="item">'+
        '<div class="box-header">'+
        '<h4 class="box-title">'+
        '<span class="title">Administration</span><span class="link"><a data-toggle="collapse" data-parent="#accordion" href="#collapseTen" class="collapsed toggle-accordion" aria-expanded="false">'+
        '</a></span>'+
        '</h4>'+
        '<div class="clear"></div>'+
        '</div>'+
        '<div id="collapseTen" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">'+
        '<div class="box-body">'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="user_create">Create Users</label></div>'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="user_modify">Modify Users</label></div>'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="user_delete">Delete Users</label></div>'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="role_create">Create Roles</label></div>'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="role_modify">Modify Roles</label></div>'+
        '<div class="checkbox"><label><input type="checkbox" style="width=33px" id="role_delete">Delete Roles</label></div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="item">'+
        smh_ppv_item +
        smh_mem_item+
        smh_rs_item +
        smh_wl_item +
        '</div>'+
        '<div class="clear"></div>'+
        '</div>';
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default role-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="create-role" onclick="smhRoles.createRole()">Create</button>';
        $('#smh-modal .modal-footer').html(footer);
        
        $('#add-role-form input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
        
        validator = $("#add-role-form").validate({
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
                role_name:{
                    required: true
                },
                role_desc:{
                    required: true
                }
            },
            messages: {
                role_name:{
                    required: 'Please enter a role name'
                },
                role_desc:{
                    required: 'Please enter a description'
                }
            }
        });
    
        $('#role-body').mCustomScrollbar({
            theme:"inset-dark",
            scrollButtons:{
                enable: true
            }
        });
    },
    //Creates Role
    createRole:function(){
        var valid = validator.form();
        if(valid){
            
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
                smhRoles.getRoles();
            };
            
            var permissions = 'KMC_ACCESS,KMC_READ_ONLY,BASE_USER_SESSION_PERMISSION,WIDGET_SESSION_PERMISSION';
            var ingest_perm = '';
            var content_perm = '';
            var plist_perm = '';
            var analytics_perm = '';
            var account_perm = '';
            var ac_perm = '';
            var trans_perm = '';
            var admin_perm = '';
            var smh_perm = '';
            var smh_mem_perm = '';
            var smh_wl_perm = '';
            var role_name = $('#add-role-form #role_name').val();
            var role_desc = $('#add-role-form #role_desc').val();
            var ingest_upload = ($('#ingest_upload').prop('checked')) ? 1 : 0;
            var ingest_live_stream = ($('#ingest_live_stream').prop('checked')) ? 1 : 0;
            var content_metadata = ($('#content_metadata').prop('checked')) ? 1 : 0;
            var content_modify_refid = ($('#content_modify_refid').prop('checked')) ? 1 : 0;
            var content_entry_cat = ($('#content_entry_cat').prop('checked')) ? 1 : 0;
            var content_modify_thumb = ($('#content_modify_thumb').prop('checked')) ? 1 : 0;
            var content_modify_ac = ($('#content_modify_ac').prop('checked')) ? 1 : 0;
            var content_delete = ($('#content_delete').prop('checked')) ? 1 : 0;
            var content_grab_embed = ($('#content_grab_embed').prop('checked')) ? 1 : 0;
            var content_manage_flavors = ($('#content_manage_flavors').prop('checked')) ? 1 : 0;
            var content_edit_cat = ($('#content_edit_cat').prop('checked')) ? 1 : 0;
            var content_update_live_stream = ($('#content_update_live_stream').prop('checked')) ? 1 : 0;
            var content_download = ($('#content_download').prop('checked')) ? 1 : 0;
            var content_edit_related = ($('#content_edit_related').prop('checked')) ? 1 : 0;
            var plist_create = ($('#plist_create').prop('checked')) ? 1 : 0;
            var plist_modify = ($('#plist_modify').prop('checked')) ? 1 : 0;
            var plist_delete = ($('#plist_delete').prop('checked')) ? 1 : 0;
            var plist_grab_embed = ($('#plist_grab_embed').prop('checked')) ? 1 : 0;
            var view_analytics = ($('#view_analytics').prop('checked')) ? 1 : 0;
            var modify_account_setting = ($('#modify_setting').prop('checked')) ? 1 : 0;
            var ac_create = ($('#ac_create').prop('checked')) ? 1 : 0;
            var ac_modify = ($('#ac_modify').prop('checked')) ? 1 : 0;
            var ac_delete = ($('#ac_delete').prop('checked')) ? 1 : 0;
            var trans_create = ($('#trans_create').prop('checked')) ? 1 : 0;
            var trans_modify = ($('#trans_modify').prop('checked')) ? 1 : 0;
            var trans_delete = ($('#trans_delete').prop('checked')) ? 1 : 0;
            var user_create = ($('#user_create').prop('checked')) ? 1 : 0;
            var user_modify = ($('#user_modify').prop('checked')) ? 1 : 0;
            var user_delete = ($('#user_delete').prop('checked')) ? 1 : 0;
            var role_create = ($('#role_create').prop('checked')) ? 1 : 0;
            var role_modify = ($('#role_modify').prop('checked')) ? 1 : 0;
            var role_delete = ($('#role_delete').prop('checked')) ? 1 : 0;
            if(services.ppv){
                var smh_ppv = ($('#smh_ppv').prop('checked')) ? 1 : 0;   
            }
            if(services.mem){
                var smh_mem = ($('#smh_mem').prop('checked')) ? 1 : 0;   
            }
            if(services.rs){
                var smh_rs = ($('#smh_rs').prop('checked')) ? 1 : 0;
            }   
            if(services.wl){
                var smh_wl = ($('#smh_wl').prop('checked')) ? 1 : 0;
            }   
                       
            if(ingest_upload || ingest_live_stream){
                ingest_perm += ',CONTENT_INGEST_BASE';
                if(ingest_upload){
                    ingest_perm += ',CONTENT_INGEST_UPLOAD';
                }
                if(ingest_live_stream){
                    ingest_perm += ',LIVE_STREAM_ADD';
                }
            }
            if(content_metadata || content_modify_refid || content_entry_cat || content_modify_thumb || content_modify_ac || content_delete || content_grab_embed || content_manage_flavors || content_edit_cat || content_update_live_stream || content_download || content_edit_related){
                content_perm += ',CONTENT_MANAGE_BASE,CONTENT_INGEST_REPLACE';
                if(content_metadata){
                    content_perm += ',CONTENT_MANAGE_METADATA';  
                }
                if(content_modify_refid){
                    content_perm += ',CONTENT_INGEST_REFERENCE_MODIFY';  
                }
                if(content_entry_cat){
                    content_perm += ',CONTENT_MANAGE_ASSIGN_CATEGORIES';  
                }
                if(content_modify_thumb){
                    content_perm += ',CONTENT_MANAGE_THUMBNAIL';  
                }
                if(content_modify_ac){
                    content_perm += ',CONTENT_MANAGE_ACCESS_CONTROL';  
                }
                if(content_delete){
                    content_perm += ',CONTENT_MANAGE_DELETE';  
                }
                if(content_grab_embed){
                    content_perm += ',CONTENT_MANAGE_EMBED_CODE';  
                }
                if(content_manage_flavors){
                    content_perm += ',CONTENT_MANAGE_RECONVERT';  
                }
                if(content_edit_cat){
                    content_perm += ',CONTENT_MANAGE_EDIT_CATEGORIES';  
                }
                if(content_update_live_stream){
                    content_perm += ',LIVE_STREAM_UPDATE';  
                }
                if(content_download){
                    content_perm += ',CONTENT_MANAGE_DOWNLOAD';  
                }
                if(content_edit_related){
                    content_perm += ',ATTACHMENT_MODIFY';  
                }                
            }
            if(plist_create || plist_modify || plist_delete || plist_grab_embed){
                plist_perm += ',PLAYLIST_BASE';
                if(plist_create){
                    plist_perm += ',PLAYLIST_ADD'; 
                }
                if(plist_modify){
                    plist_perm += ',PLAYLIST_UPDATE'; 
                }
                if(plist_delete){
                    plist_perm += ',PLAYLIST_DELETE'; 
                }
                if(plist_grab_embed){
                    plist_perm += ',PLAYLIST_EMBED_CODE'; 
                }
            }
            if(view_analytics){
                analytics_perm += ',ANALYTICS_BASE';
            }
            if(modify_account_setting){
                account_perm += ',ACCOUNT_BASE,ACCOUNT_UPDATE_SETTINGS';
            }
            if(ac_create || ac_modify || ac_delete){
                ac_perm += ',ACCESS_CONTROL_BASE';
                if(ac_create){
                    ac_perm += ',ACCESS_CONTROL_ADD';
                }
                if(ac_modify){
                    ac_perm += ',ACCESS_CONTROL_UPDATE';
                }
                if(ac_delete){
                    ac_perm += ',ACCESS_CONTROL_DELETE';
                }
            }
            if(trans_create || trans_modify || trans_delete){
                trans_perm += ',TRANSCODING_BASE';
                if(trans_create){
                    trans_perm += ',TRANSCODING_ADD';
                }
                if(trans_modify){
                    trans_perm += ',TRANSCODING_UPDATE';
                }
                if(trans_delete){
                    trans_perm += ',TRANSCODING_DELETE';
                }
            }
            if(user_create || user_modify || user_delete || role_create || role_modify || role_delete){
                admin_perm += ',ADMIN_BASE';
                if(user_create){
                    admin_perm += ',ADMIN_USER_ADD';
                }
                if(user_modify){
                    admin_perm += ',ADMIN_USER_UPDATE';
                }
                if(user_delete){
                    admin_perm += ',ADMIN_USER_DELETE';
                }
                if(role_create){
                    admin_perm += ',ADMIN_ROLE_ADD';
                }
                if(role_modify){
                    admin_perm += ',ADMIN_ROLE_UPDATE';
                }
                if(role_delete){
                    admin_perm += ',ADMIN_ROLE_DELETE';
                }
            }
            if(services.ppv || services.rs){
                if(smh_ppv || smh_rs){
                    smh_perm += ',BULK_LOG_BASE';
                    if(smh_ppv){
                        smh_perm += ',BULK_LOG_DOWNLOAD';  
                    }
                    if(smh_rs){
                        smh_perm += ',BULK_LOG_DELETE';
                    } 
                } 
            }    
            if(services.mem){
                if(smh_mem){
                    smh_mem_perm += ',SYNDICATION_BASE,SYNDICATION_ADD';
                } 
            }  
            if(services.wl){
                if(smh_wl){
                    smh_wl_perm += ',dropFolder.CONTENT_INGEST_DROP_FOLDER_BASE,dropFolder.CONTENT_INGEST_DROP_FOLDER_DELETE';
                } 
            }   
            
            
            permissions += ingest_perm + content_perm + plist_perm + analytics_perm + account_perm + ac_perm + trans_perm + admin_perm + smh_perm + smh_mem_perm + smh_wl_perm;
            
            $('#create-role').attr('disabled','');
            $('#smh-modal #loading img').css('display','inline-block');
            var userRole = new KalturaUserRole();
            userRole.name = role_name;
            userRole.description = role_desc;
            userRole.status = KalturaUserRoleStatus.ACTIVE;
            userRole.permissionNames = permissions;
            userRole.tags = 'kmc';
            client.userRole.add(cb, userRole);
        }
    },
    //Edit role modal
    editRole:function(role_id,role_name,role_desc,role_perms){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','615px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        var permissions = role_perms.split(",");
        var ingest_upload_check = ($.inArray("CONTENT_INGEST_UPLOAD", permissions) != -1)? 'checked' : '';
        var ingest_live_stream_check = ($.inArray("LIVE_STREAM_ADD", permissions) != -1)? 'checked' : '';
        var content_metadata_check = ($.inArray("CONTENT_MANAGE_METADATA", permissions) != -1)? 'checked' : '';
        var content_modify_refid_check = ($.inArray("CONTENT_INGEST_REFERENCE_MODIFY", permissions) != -1)? 'checked' : '';
        var content_entry_cat_check = ($.inArray("CONTENT_MANAGE_ASSIGN_CATEGORIES", permissions) != -1)? 'checked' : '';
        var content_modify_thumb_check = ($.inArray("CONTENT_MANAGE_THUMBNAIL", permissions) != -1)? 'checked' : '';
        var content_modify_ac_check = ($.inArray("CONTENT_MANAGE_ACCESS_CONTROL", permissions) != -1)? 'checked' : '';
        var content_delete_check = ($.inArray("CONTENT_MANAGE_DELETE", permissions) != -1)? 'checked' : '';
        var content_grab_embed_check = ($.inArray("CONTENT_MANAGE_EMBED_CODE", permissions) != -1)? 'checked' : '';
        var content_manage_flavors_check = ($.inArray("CONTENT_MANAGE_RECONVERT", permissions) != -1)? 'checked' : '';
        var content_edit_cat_check = ($.inArray("CONTENT_MANAGE_EDIT_CATEGORIES", permissions) != -1)? 'checked' : '';
        var content_update_live_stream_check = ($.inArray("LIVE_STREAM_UPDATE", permissions) != -1)? 'checked' : '';
        var content_download_check = ($.inArray("CONTENT_MANAGE_DOWNLOAD", permissions) != -1)? 'checked' : '';
        var content_edit_related_check = ($.inArray("ATTACHMENT_MODIFY", permissions) != -1)? 'checked' : '';
        var plist_create_check = ($.inArray("PLAYLIST_ADD", permissions) != -1)? 'checked' : '';
        var plist_modify_check = ($.inArray("PLAYLIST_UPDATE", permissions) != -1)? 'checked' : '';
        var plist_delete_check = ($.inArray("PLAYLIST_DELETE", permissions) != -1)? 'checked' : '';
        var plist_grab_embed_check = ($.inArray("PLAYLIST_EMBED_CODE", permissions) != -1)? 'checked' : '';
        var view_analytics_check = ($.inArray("ANALYTICS_BASE", permissions) != -1)? 'checked' : '';
        var modify_account_setting_check = ($.inArray("ACCOUNT_UPDATE_SETTINGS", permissions) != -1)? 'checked' : '';
        var ac_create_check = ($.inArray("ACCESS_CONTROL_ADD", permissions) != -1)? 'checked' : '';
        var ac_modify_check = ($.inArray("ACCESS_CONTROL_UPDATE", permissions) != -1)? 'checked' : '';
        var ac_delete_check = ($.inArray("ACCESS_CONTROL_DELETE", permissions) != -1)? 'checked' : '';
        var trans_create_check = ($.inArray("TRANSCODING_ADD", permissions) != -1)? 'checked' : '';
        var trans_modify_check = ($.inArray("TRANSCODING_UPDATE", permissions) != -1)? 'checked' : '';
        var trans_delete_check = ($.inArray("TRANSCODING_DELETE", permissions) != -1)? 'checked' : '';
        var user_create_check = ($.inArray("ADMIN_USER_ADD", permissions) != -1)? 'checked' : '';
        var user_modify_check = ($.inArray("ADMIN_USER_UPDATE", permissions) != -1)? 'checked' : '';
        var user_delete_check = ($.inArray("ADMIN_USER_DELETE", permissions) != -1)? 'checked' : '';
        var role_create_check = ($.inArray("ADMIN_ROLE_ADD", permissions) != -1)? 'checked' : '';
        var role_modify_check = ($.inArray("ADMIN_ROLE_UPDATE", permissions) != -1)? 'checked' : '';
        var role_delete_check = ($.inArray("ADMIN_ROLE_DELETE", permissions) != -1)? 'checked' : '';              
        
        var smh_ppv_item = '';
        var smh_mem_item = '';
        var smh_rs_item = '';
        var smh_wl_item = '';
        if(services.ppv){
            var smh_ppv_check = ($.inArray("BULK_LOG_DOWNLOAD", permissions) != -1)? 'checked' : '';
            smh_ppv_item = '<div class="item">'+
            '<div class="box-header">'+
            '<h4 class="box-title">'+
            '<span class="title">Pay Per View</span><span class="link"><a data-toggle="collapse" data-parent="#accordion" href="#collapseEleven" class="collapsed toggle-accordion" aria-expanded="false">'+
            '</a></span>'+
            '</h4>'+
            '<div class="clear"></div>'+
            '</div>'+
            '<div id="collapseEleven" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">'+
            '<div class="box-body">'+
            '<div class="checkbox"><label><input '+smh_ppv_check+' type="checkbox" style="width=33px" id="smh_ppv">Manage PPV Content</label></div>'+
            '</div>'+
            '</div>'+
            '</div>';
        }
        if(services.mem){
            var smh_mem_check = ($.inArray("SYNDICATION_ADD", permissions) != -1)? 'checked' : '';
            smh_mem_item = '<div class="item">'+
            '<div class="box-header">'+
            '<h4 class="box-title">'+
            '<span class="title">Membership</span><span class="link"><a data-toggle="collapse" data-parent="#accordion" href="#collapseFourteen" class="collapsed toggle-accordion" aria-expanded="false">'+
            '</a></span>'+
            '</h4>'+
            '<div class="clear"></div>'+
            '</div>'+
            '<div id="collapseFourteen" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">'+
            '<div class="box-body">'+
            '<div class="checkbox"><label><input '+smh_mem_check+' type="checkbox" style="width=33px" id="smh_mem">Manage Membership</label></div>'+
            '</div>'+
            '</div>'+
            '</div>';
        }
        if(services.rs){
            var smh_rs_check = ($.inArray("BULK_LOG_DELETE", permissions) != -1)? 'checked' : '';
            smh_rs_item = '<div class="item">'+
            '<div class="box-header">'+
            '<h4 class="box-title">'+
            '<span class="title">Reseller</span><span class="link"><a data-toggle="collapse" data-parent="#accordion" href="#collapseTwelve" class="collapsed toggle-accordion" aria-expanded="false">'+
            '</a></span>'+
            '</h4>'+
            '<div class="clear"></div>'+
            '</div>'+
            '<div id="collapseTwelve" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">'+
            '<div class="box-body">'+
            '<div class="checkbox"><label><input '+smh_rs_check+' type="checkbox" style="width=33px" id="smh_rs">Manage Reseller Accounts</label></div>'+
            '</div>'+
            '</div>'+
            '</div>';
        }
        if(services.wl){
            var smh_wl_check = ($.inArray("dropFolder.CONTENT_INGEST_DROP_FOLDER_DELETE", permissions) != -1)? 'checked' : '';
            smh_wl_item = '<div class="item">'+
            '<div class="box-header">'+
            '<h4 class="box-title">'+
            '<span class="title">White Label</span><span class="link"><a data-toggle="collapse" data-parent="#accordion" href="#collapseThirteen" class="collapsed toggle-accordion" aria-expanded="false">'+
            '</a></span>'+
            '</h4>'+
            '<div class="clear"></div>'+
            '</div>'+
            '<div id="collapseThirteen" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">'+
            '<div class="box-body">'+
            '<div class="checkbox"><label><input '+smh_wl_check+' type="checkbox" style="width=33px" id="smh_wl">Modify White Label Settings</label></div>'+
            '</div>'+
            '</div>'+
            '</div>';
        }
        
        header = '<button type="button" class="close role-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Role</h4>';
        $('#smh-modal .modal-header').html(header);
        
        content = '<form id="add-role-form" action="">'+
        '<table width="100%" border="0" id="admin_edit">'+
        '<tr>'+
        '<td><span class="required" style="font-weight: normal;">Role Name:</span></td><td style="width: 82%;"><input type="text" name="role_name" id="role_name" class="form-control" placeholder="Enter role name" value="'+role_name+'"></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required" style="font-weight: normal;">Description:</span></td><td><input type="text" name="role_desc" id="role_desc" class="form-control" placeholder="Enter description" value="'+role_desc+'"></td>'+
        '</tr>'+
        '</table>'+
        '</form>'+
        '<div id="role-permissions-wrapper">'+
        '<div id="role-header">'+
        '<span id="head-left">Set Role\'s Permissions</span>'+
        '<span id="head-right">'+
        '<a onclick="smhRoles.collapseA();">Collapse All</a>'+
        '<a id="a-right" onclick="smhRoles.expandA();">Expand All</a>'+
        '</span>'+
        '</div>'+
        '<div id="role-body">'+
        '<div class="box-group" id="accordion">'+
        '<div class="item">'+
        '<div class="box-header">'+
        '<h4 class="box-title">'+
        '<span class="title">Content Ingestion</span><span class="link"><a data-toggle="collapse" data-parent="#accordion" href="#collapseX" class="collapsed toggle-accordion" aria-expanded="false">'+
        '</a>'+
        '</h4>'+
        '<div class="clear"></div>'+
        '</div>'+
        '<div style="height: 0px;" aria-expanded="false" class="panel-collapse collapse" id="collapseX">'+
        '<div class="box-body">'+
        '<div class="checkbox"><label><input '+ingest_upload_check+' type="checkbox" style="width=33px" id="ingest_upload">Upload Content</label></div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="item">'+
        '<div class="box-header">'+
        '<h4 class="box-title">'+
        '<span class="title">Content Management</span><span class="link"><a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" class="collapsed toggle-accordion" aria-expanded="false">'+
        '</a></span>'+
        '</h4>'+
        '<div class="clear"></div>'+
        '</div>'+
        '<div id="collapseTwo" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">'+
        '<div class="box-body">'+
        '<div class="checkbox"><label><input '+content_metadata_check+' type="checkbox" style="width=33px" id="content_metadata">Modify Metadata</label></div>'+
        '<div class="checkbox"><label><input '+content_modify_refid_check+' type="checkbox" style="width=33px" id="content_modify_refid">Modify Reference ID</label></div>'+
        '<div class="checkbox"><label><input '+content_entry_cat_check+' type="checkbox" style="width=33px" id="content_entry_cat">Modify Entry\'s Category</label></div>'+
        '<div class="checkbox"><label><input '+content_modify_thumb_check+' type="checkbox" style="width=33px" id="content_modify_thumb">Modify Thumbnail</label></div>'+
        '<div class="checkbox"><label><input '+content_modify_ac_check+' type="checkbox" style="width=33px" id="content_modify_ac">Modify Access Control</label></div>'+
        '<div class="checkbox"><label><input '+content_delete_check+' type="checkbox" style="width=33px" id="content_delete">Delete Content</label></div>'+
        '<div class="checkbox"><label><input '+content_grab_embed_check+' type="checkbox" style="width=33px" id="content_grab_embed">Grab Embed Code</label></div>'+
        '<div class="checkbox"><label><input '+content_manage_flavors_check+' type="checkbox" style="width=33px" id="content_manage_flavors">Manage Flavors</label></div>'+
        '<div class="checkbox"><label><input '+content_edit_cat_check+' type="checkbox" style="width=33px" id="content_edit_cat">Edit Categories</label></div>'+
        '<div class="checkbox"><label><input '+content_download_check+' type="checkbox" style="width=33px" id="content_download">Download Files</label></div>'+
        '<div class="checkbox"><label><input '+content_edit_related_check+' type="checkbox" style="width=33px" id="content_edit_related">Edit Related Files</label></div>'+
        '<div class="checkbox"><label><input '+ingest_live_stream_check+' type="checkbox" style="width=33px" id="ingest_live_stream">Create Live Stream</label></div>'+
        '<div class="checkbox"><label><input '+content_update_live_stream_check+' type="checkbox" style="width=33px" id="content_update_live_stream">Update Live Stream</label></div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="item">'+
        '<div class="box-header">'+
        '<h4 class="box-title">'+
        '<span class="title">Playlist Management</span><span class="link"><a data-toggle="collapse" data-parent="#accordion" href="#collapseThree" class="collapsed toggle-accordion" aria-expanded="false">'+
        '</a></span>'+
        '</h4>'+
        '<div class="clear"></div>'+
        '</div>'+
        '<div id="collapseThree" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">'+
        '<div class="box-body">'+
        '<div class="checkbox"><label><input '+plist_create_check+' type="checkbox" style="width=33px" id="plist_create">Create Playlists</label></div>'+
        '<div class="checkbox"><label><input '+plist_modify_check+' type="checkbox" style="width=33px" id="plist_modify">Modify Playlists</label></div>'+
        '<div class="checkbox"><label><input '+plist_delete_check+' type="checkbox" style="width=33px" id="plist_delete">Delete Playlists</label></div>'+
        '<div class="checkbox"><label><input '+plist_grab_embed_check+' type="checkbox" style="width=33px" id="plist_grab_embed">Grab Playlist Embed Code</label></div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="item">'+
        '<div class="box-header">'+
        '<h4 class="box-title">'+
        '<span class="title">Analytics</span><span class="link"><a data-toggle="collapse" data-parent="#accordion" href="#collapseSix" class="collapsed toggle-accordion" aria-expanded="false">'+
        '</a></span>'+
        '</h4>'+
        '<div class="clear"></div>'+
        '</div>'+
        '<div id="collapseSix" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">'+
        '<div class="box-body">'+
        '<div class="checkbox"><label><input '+view_analytics_check+' type="checkbox" style="width=33px" id="view_analytics">View Analytics</label></div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="item">'+
        '<div class="box-header">'+
        '<h4 class="box-title">'+
        '<span class="title">Account Settings</span><span class="link"><a data-toggle="collapse" data-parent="#accordion" href="#collapseSeven" class="collapsed toggle-accordion" aria-expanded="false">'+
        '</a></span>'+
        '</h4>'+
        '<div class="clear"></div>'+
        '</div>'+
        '<div id="collapseSeven" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">'+
        '<div class="box-body">'+
        '<div class="checkbox"><label><input '+modify_account_setting_check+' type="checkbox" style="width=33px" id="modify_settings">Modify Account Settings</label></div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="item">'+
        '<div class="box-header">'+
        '<h4 class="box-title">'+
        '<span class="title">Access Control Settings</span><span class="link"><a data-toggle="collapse" data-parent="#accordion" href="#collapseEight" class="collapsed toggle-accordion" aria-expanded="false">'+
        '</a></span>'+
        '</h4>'+
        '<div class="clear"></div>'+
        '</div>'+
        '<div id="collapseEight" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">'+
        '<div class="box-body">'+
        '<div class="checkbox"><label><input '+ac_create_check+' type="checkbox" style="width=33px" id="ac_create">Create Access Control Profile</label></div>'+
        '<div class="checkbox"><label><input '+ac_modify_check+' type="checkbox" style="width=33px" id="ac_modify">Modify Access Control Profile</label></div>'+
        '<div class="checkbox"><label><input '+ac_delete_check+' type="checkbox" style="width=33px" id="ac_delete">Delete Access Control Profile</label></div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="item">'+
        '<div class="box-header">'+
        '<h4 class="box-title">'+
        '<span class="title">Transcoding Settings</span><span class="link"><a data-toggle="collapse" data-parent="#accordion" href="#collapseNine" class="collapsed toggle-accordion" aria-expanded="false">'+
        '</a></span>'+
        '</h4>'+
        '<div class="clear"></div>'+
        '</div>'+
        '<div id="collapseNine" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">'+
        '<div class="box-body">'+
        '<div class="checkbox"><label><input '+trans_create_check+' type="checkbox" style="width=33px" id="trans_create">Create Transcoding Profiles</label></div>'+
        '<div class="checkbox"><label><input '+trans_modify_check+' type="checkbox" style="width=33px" id="trans_modify">Modify Transcoding Profiles</label></div>'+
        '<div class="checkbox"><label><input '+trans_delete_check+' type="checkbox" style="width=33px" id="trans_delete">Delete Transcoding Profiles</label></div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="item">'+
        '<div class="box-header">'+
        '<h4 class="box-title">'+
        '<span class="title">Administration</span><span class="link"><a data-toggle="collapse" data-parent="#accordion" href="#collapseTen" class="collapsed toggle-accordion" aria-expanded="false">'+
        '</a></span>'+
        '</h4>'+
        '<div class="clear"></div>'+
        '</div>'+
        '<div id="collapseTen" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">'+
        '<div class="box-body">'+
        '<div class="checkbox"><label><input '+user_create_check+' type="checkbox" style="width=33px" id="user_create">Create Users</label></div>'+
        '<div class="checkbox"><label><input '+user_modify_check+' type="checkbox" style="width=33px" id="user_modify">Modify Users</label></div>'+
        '<div class="checkbox"><label><input '+user_delete_check+' type="checkbox" style="width=33px" id="user_delete">Delete Users</label></div>'+
        '<div class="checkbox"><label><input '+role_create_check+' type="checkbox" style="width=33px" id="role_create">Create Roles</label></div>'+
        '<div class="checkbox"><label><input '+role_modify_check+' type="checkbox" style="width=33px" id="role_modify">Modify Roles</label></div>'+
        '<div class="checkbox"><label><input '+role_delete_check+' type="checkbox" style="width=33px" id="role_delete">Delete Roles</label></div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        smh_ppv_item+
        smh_mem_item+
        smh_rs_item+
        smh_wl_item+
        '</div>'+
        '<div class="clear"></div>'+
        '</div>';
        $('#smh-modal .modal-body').html(content);
        
        var disable = ($.inArray("ADMIN_ROLE_UPDATE", sessPerm) != -1)? '' : 'disabled';
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default role-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="update-role" onclick="smhRoles.updateRole('+role_id+')" '+disable+'>Update</button>';
        $('#smh-modal .modal-footer').html(footer);
        
        $('#add-role-form input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
        
        validator = $("#add-role-form").validate({
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
                role_name:{
                    required: true
                },
                role_desc:{
                    required: true
                }
            },
            messages: {
                role_name:{
                    required: 'Please enter a role name'
                },
                role_desc:{
                    required: 'Please enter a description'
                }
            }
        });
    
        $('#role-body').mCustomScrollbar({
            theme:"inset-dark",
            scrollButtons:{
                enable: true
            }
        });
    },
    //Update role
    updateRole:function(id){
        var valid = validator.form();
        if(valid){
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
                    $('#smh-modal #update-role').removeAttr('disabled');
                },3000); 
                smhRoles.getRoles();
            };
            
            var permissions = 'KMC_ACCESS,KMC_READ_ONLY,BASE_USER_SESSION_PERMISSION,WIDGET_SESSION_PERMISSION';
            var ingest_perm = '';
            var content_perm = '';
            var plist_perm = '';
            var analytics_perm = '';
            var account_perm = '';
            var ac_perm = '';
            var trans_perm = '';
            var admin_perm = '';
            var smh_perm = '';
            var smh_mem_perm = '';
            var smh_wl_perm = '';
            var role_name = $('#add-role-form #role_name').val();
            var role_desc = $('#add-role-form #role_desc').val();
            var ingest_upload = ($('#ingest_upload').prop('checked')) ? 1 : 0;
            var ingest_live_stream = ($('#ingest_live_stream').prop('checked')) ? 1 : 0;
            var content_metadata = ($('#content_metadata').prop('checked')) ? 1 : 0;
            var content_modify_refid = ($('#content_modify_refid').prop('checked')) ? 1 : 0;
            var content_entry_cat = ($('#content_entry_cat').prop('checked')) ? 1 : 0;
            var content_modify_thumb = ($('#content_modify_thumb').prop('checked')) ? 1 : 0;
            var content_modify_ac = ($('#content_modify_ac').prop('checked')) ? 1 : 0;
            var content_delete = ($('#content_delete').prop('checked')) ? 1 : 0;
            var content_grab_embed = ($('#content_grab_embed').prop('checked')) ? 1 : 0;
            var content_manage_flavors = ($('#content_manage_flavors').prop('checked')) ? 1 : 0;
            var content_edit_cat = ($('#content_edit_cat').prop('checked')) ? 1 : 0;
            var content_update_live_stream = ($('#content_update_live_stream').prop('checked')) ? 1 : 0;
            var content_download = ($('#content_download').prop('checked')) ? 1 : 0;
            var content_edit_related = ($('#content_edit_related').prop('checked')) ? 1 : 0;
            var plist_create = ($('#plist_create').prop('checked')) ? 1 : 0;
            var plist_modify = ($('#plist_modify').prop('checked')) ? 1 : 0;
            var plist_delete = ($('#plist_delete').prop('checked')) ? 1 : 0;
            var plist_grab_embed = ($('#plist_grab_embed').prop('checked')) ? 1 : 0;
            var view_analytics = ($('#view_analytics').prop('checked')) ? 1 : 0;
            var modify_account_setting = ($('#modify_setting').prop('checked')) ? 1 : 0;
            var ac_create = ($('#ac_create').prop('checked')) ? 1 : 0;
            var ac_modify = ($('#ac_modify').prop('checked')) ? 1 : 0;
            var ac_delete = ($('#ac_delete').prop('checked')) ? 1 : 0;
            var trans_create = ($('#trans_create').prop('checked')) ? 1 : 0;
            var trans_modify = ($('#trans_modify').prop('checked')) ? 1 : 0;
            var trans_delete = ($('#trans_delete').prop('checked')) ? 1 : 0;
            var user_create = ($('#user_create').prop('checked')) ? 1 : 0;
            var user_modify = ($('#user_modify').prop('checked')) ? 1 : 0;
            var user_delete = ($('#user_delete').prop('checked')) ? 1 : 0;
            var role_create = ($('#role_create').prop('checked')) ? 1 : 0;
            var role_modify = ($('#role_modify').prop('checked')) ? 1 : 0;
            var role_delete = ($('#role_delete').prop('checked')) ? 1 : 0;
            if(services.ppv){
                var smh_ppv = ($('#smh_ppv').prop('checked')) ? 1 : 0;
            }
            if(services.mem){
                var smh_mem = ($('#smh_mem').prop('checked')) ? 1 : 0;
            }
            if(services.rs){
                var smh_rs = ($('#smh_rs').prop('checked')) ? 1 : 0;
            }
            if(services.wl){
                var smh_wl = ($('#smh_wl').prop('checked')) ? 1 : 0;
            }
            
            if(ingest_upload || ingest_live_stream){
                ingest_perm += ',CONTENT_INGEST_BASE';
                if(ingest_upload){
                    ingest_perm += ',CONTENT_INGEST_UPLOAD';
                }
                if(ingest_live_stream){
                    ingest_perm += ',LIVE_STREAM_ADD';
                }
            }
            if(content_metadata || content_modify_refid || content_entry_cat || content_modify_thumb || content_modify_ac || content_delete || content_grab_embed || content_manage_flavors || content_edit_cat || content_update_live_stream || content_download || content_edit_related){
                content_perm += ',CONTENT_MANAGE_BASE,CONTENT_INGEST_REPLACE';
                if(content_metadata){
                    content_perm += ',CONTENT_MANAGE_METADATA';  
                }
                if(content_modify_refid){
                    content_perm += ',CONTENT_INGEST_REFERENCE_MODIFY';  
                }
                if(content_entry_cat){
                    content_perm += ',CONTENT_MANAGE_ASSIGN_CATEGORIES';  
                }
                if(content_modify_thumb){
                    content_perm += ',CONTENT_MANAGE_THUMBNAIL';  
                }
                if(content_modify_ac){
                    content_perm += ',CONTENT_MANAGE_ACCESS_CONTROL';  
                }
                if(content_delete){
                    content_perm += ',CONTENT_MANAGE_DELETE';  
                }
                if(content_grab_embed){
                    content_perm += ',CONTENT_MANAGE_EMBED_CODE';  
                }
                if(content_manage_flavors){
                    content_perm += ',CONTENT_MANAGE_RECONVERT';  
                }
                if(content_edit_cat){
                    content_perm += ',CONTENT_MANAGE_EDIT_CATEGORIES';  
                }
                if(content_update_live_stream){
                    content_perm += ',LIVE_STREAM_UPDATE';  
                }
                if(content_download){
                    content_perm += ',CONTENT_MANAGE_DOWNLOAD';  
                }
                if(content_edit_related){
                    content_perm += ',ATTACHMENT_MODIFY';  
                }                
            }
            if(plist_create || plist_modify || plist_delete || plist_grab_embed){
                plist_perm += ',PLAYLIST_BASE';
                if(plist_create){
                    plist_perm += ',PLAYLIST_ADD'; 
                }
                if(plist_modify){
                    plist_perm += ',PLAYLIST_UPDATE'; 
                }
                if(plist_delete){
                    plist_perm += ',PLAYLIST_DELETE'; 
                }
                if(plist_grab_embed){
                    plist_perm += ',PLAYLIST_EMBED_CODE'; 
                }
            }
            if(view_analytics){
                analytics_perm += ',ANALYTICS_BASE';
            }
            if(modify_account_setting){
                account_perm += ',ACCOUNT_BASE,ACCOUNT_UPDATE_SETTINGS';
            }
            if(ac_create || ac_modify || ac_delete){
                ac_perm += ',ACCESS_CONTROL_BASE';
                if(ac_create){
                    ac_perm += ',ACCESS_CONTROL_ADD';
                }
                if(ac_modify){
                    ac_perm += ',ACCESS_CONTROL_UPDATE';
                }
                if(ac_delete){
                    ac_perm += ',ACCESS_CONTROL_DELETE';
                }
            }
            if(trans_create || trans_modify || trans_delete){
                trans_perm += ',TRANSCODING_BASE';
                if(trans_create){
                    trans_perm += ',TRANSCODING_ADD';
                }
                if(trans_modify){
                    trans_perm += ',TRANSCODING_UPDATE';
                }
                if(trans_delete){
                    trans_perm += ',TRANSCODING_DELETE';
                }
            }
            if(user_create || user_modify || user_delete || role_create || role_modify || role_delete){
                admin_perm += ',ADMIN_BASE';
                if(user_create){
                    admin_perm += ',ADMIN_USER_ADD';
                }
                if(user_modify){
                    admin_perm += ',ADMIN_USER_UPDATE';
                }
                if(user_delete){
                    admin_perm += ',ADMIN_USER_DELETE';
                }
                if(role_create){
                    admin_perm += ',ADMIN_ROLE_ADD';
                }
                if(role_modify){
                    admin_perm += ',ADMIN_ROLE_UPDATE';
                }
                if(role_delete){
                    admin_perm += ',ADMIN_ROLE_DELETE';
                }
            }
            if(services.ppv || services.rs){
                if(smh_ppv || smh_rs){
                    smh_perm += ',BULK_LOG_BASE';
                    if(smh_ppv){
                        smh_perm += ',BULK_LOG_DOWNLOAD';  
                    }
                    if(smh_rs){
                        smh_perm += ',BULK_LOG_DELETE';
                    } 
                } 
            }     
            if(services.mem){
                if(smh_mem){
                    smh_mem_perm += ',SYNDICATION_BASE,SYNDICATION_ADD';
                } 
            } 
            if(services.wl){
                if(smh_wl){
                    smh_wl_perm += ',dropFolder.CONTENT_INGEST_DROP_FOLDER_BASE,dropFolder.CONTENT_INGEST_DROP_FOLDER_DELETE';
                } 
            }  
            permissions += ingest_perm + content_perm + plist_perm + analytics_perm + account_perm + ac_perm + trans_perm + admin_perm + smh_perm + smh_mem_perm + smh_wl_perm;
            
            $('#smh-modal #update-role').attr('disabled','');
            $('#smh-modal #loading img').css('display','inline-block');
            var userRoleId = id;
            var userRole = new KalturaUserRole();
            userRole.name = role_name;
            userRole.description = role_desc;
            userRole.status = KalturaUserRoleStatus.ACTIVE;
            userRole.permissionNames = permissions;
            userRole.tags = "kmc";
            client.userRole.update(cb, userRoleId, userRole);
        }
    },
    //Duplicate Role
    duplicateRole:function(role){
        var cb = function (success, results){
            if(!success)
                alert(results);

            if(results.code && results.message){
                alert(results.message);
                return;
            }                  
            smhRoles.getRoles();
        };
            
        var userRoleId = role;
        client.userRole.cloneAction(cb, userRoleId);
    },
    //Deletes Role modal
    deleteRole:function(role,role_name){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','435px');
        $('#smh-modal .modal-body').css('padding','0');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Delete</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='margin-left: auto; margin-right: auto; text-align: center; margin-top: 50px; height: 95px;'>Are you sure you want to delete the selected role?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>("+role_name+")</div>";
 
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="delete-role" onclick="smhRoles.removeRole(\''+role+'\')">Delete</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Deletes role
    removeRole:function(role){
        var cb = function (success, results){
            if(!success)
                alert(results);

            if(results.code && results.message){
                if(results.message == 'Role is being used'){
                    $('#smh-modal #loading').empty();
                    alert(results.message);  
                } else {
                    $('#smh-modal #loading').empty();
                    alert(results.message);  
                }
                
                return;
            } 
            $('#smh-modal').modal('hide');
            smhRoles.getRoles();             
        };
        
        $('#delete-role').attr('disabled','');
        $('#smh-modal #loading img').css('display','inline-block');
        var userRoleId = role;
        client.userRole.deleteAction(cb, userRoleId);
    },
    //Collapse Accordion
    collapseA:function(){
        $('#accordion .panel-collapse.in')
        .collapse('hide');
    },
    //Expand Accordion
    expandA:function(){
        $('#accordion .panel-collapse:not(".in")')
        .collapse('show');
    },
    //Export Metadata
    exportMetaData:function(){        
        if(total_entries){
            window.location = '/apps/platform/metadata/export.metadata.php?pid='+sessInfo.pid+'&ks='+sessInfo.ks+'&page_size='+total_entries+'&action=export_roles_metadata'; 
        }        
    },
    //Register actions
    registerActions:function(){
        $('#smh-modal').on('click', '.role-close', function(){
            $('#add-role-form input').tooltipster('destroy');
        });
    }
}

// Main on ready
$(document).ready(function(){
    smhRoles = new Roles();
    smhRoles.getRoles();
    smhRoles.registerActions();
});
