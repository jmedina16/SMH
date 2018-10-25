/*
 *
 *	SMH MediaPlatform Plugin
 *	
 *	Cat
 *
 *	7-3-2014
 */
//Cat constructor
function Cat(id,ks) {
    this.id = id;
    this.ks = ks;
}

//Global variables
var categories = [];
var bulkdelete = new Array();
var bulkmove = new Array();
var total_entries;

//Cat prototype/class
Cat.prototype = {
    constructor: Cat,
    //Inserts name on page
    getCategories:function(){          
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#cat-table').empty();
        $('#cat-table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="cat-data"></table>');
        catTable = $('#cat-data').DataTable({
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
                "url": "/api/v1/getCategories",
                "type": "GET",
                "data": function ( d ) {   
                    return $.extend( {}, d, {
                        "_token": $('meta[name="csrf-token"]').attr('content'),
                        "ks": sessInfo.ks,
                        "tz": tz,
                        "m": ($.inArray("CONTENT_MANAGE_EDIT_CATEGORIES", sessPerm) != -1)? true : false
                    } );
                },
                "dataSrc": function ( json ) {
                    total_entries = json['recordsTotal'];
                    return json.data 
                }
            },
            "language": {
                "zeroRecords": "No Categories Found"
            },
            "columns": [
            {
                "title": "<span style='float: left;'><input type='checkbox' class='cat-bulk' id='cat-bulkAll' style='width:16px; margin-right: 7px;' name='cat_bulkAll' /></span>",
                "width": "10px"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>ID</div></span>"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>Name</div></span>"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>Created On</div></span>"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>Sub-Categories</div></span>"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>Entries</div></span>"
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
                smhMain.fcmcAddRows(this, 7, 10);     
            }                                
        });
        
        $('#users-buttons .dd-delete-btn').removeClass('btn-default');
        $('#users-buttons .dd-delete-btn').addClass('btn-disabled');
        $('#users-buttons .dd-delete-btn').attr('disabled','');
        $('#cat-table').on('change',".cat-bulk",function(){
            var anyBoxesChecked = false;
            $('#cat-table input[type="checkbox"]').each(function() {
                if ($(this).is(":checked")) {
                    anyBoxesChecked = true;
                }
            });
            
            if (anyBoxesChecked == true && ($.inArray("CONTENT_MANAGE_EDIT_CATEGORIES", sessPerm) != -1)){
                $('#users-buttons .dd-delete-btn').removeClass('btn-disabled');
                $('#users-buttons .dd-delete-btn').addClass('btn-default');
                $('#users-buttons .dd-delete-btn').removeAttr('disabled');
            } else {
                $('#users-buttons .dd-delete-btn').removeClass('btn-default');
                $('#users-buttons .dd-delete-btn').addClass('btn-disabled');
                $('#users-buttons .dd-delete-btn').attr('disabled','');
            }
        });
        $('#cat-bulkAll').click(function(){
            if(this.checked){
                $('.cat-bulk').each(function(){
                    this.checked = true; 
                });
            } else {
                $('.cat-bulk').each(function(){
                    this.checked = false; 
                });
            }
        }); 
        smhCat.getCats();
    },
    //Load category modal
    addCategory:function(){    
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','615px');
        $('#smh-modal .modal-body').css('padding','0');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close cat-create-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Create Category</h4>';
        $('#smh-modal .modal-header').html(header);
        
        var tree = smhCat.json_tree(categories);
        
        var cat_list = '<div class="radio"><label><input type="radio" name="cat_list" id="no_parent" value="0" checked> No Parent</label></div>'+
        '<hr style="width: 100%; height: 1px; margin-bottom: 10px; margin-top: 10px;" />'+
        '<div class="cat-wrapper">'+
        '<div id="tree">'+
        tree+        
        '</div>'+
        '</div>';
    
        content = '<div class="card wizard-card ct-wizard-green" id="wizard">'+
        '<form id="add-cat-form">'+
        '<div id="crumbs">'+
        '<ul class="nav nav-pills">'+
        '<li style="width: 50%;" class="active"><a href="#cat-tab" data-toggle="tab">CATEGORIES</a></li>'+
        '<li style="width: 50%;"><a href="#metadata-tab" data-toggle="tab">METADATA</a></li>'+
        '</ul>'+
        '</div>'+
        '<div class="tab-content">'+                
        '<div class="tab-pane active" id="cat-tab">'+
        '<div class="row">'+
        '<div class="col-sm-9 center-block" style="margin-bottom: 20px; text-align: center;">'+
        'Select the parent category under which the new category will appear'+
        '</div>'+
        '<div class="col-sm-11 center-block">'+
        cat_list+
        '</div>'+                        
        '</div>'+
        '</div>'+
        '<div class="tab-pane" id="metadata-tab">'+
        '<div class="row">'+
        '<div style="margin-bottom: 80px; text-align: center;" class="col-sm-7 center-block">Enter Metadata Details</div>'+
        '<div class="col-sm-8 center-block">'+
        '<table width="100%" border="0" id="admin_edit">'+
        '<tr>'+
        '<td><span class="required" style="font-weight: normal;">Name:</span></td><td style="width: 72%;"><input type="text" name="cat_name" id="cat_name" class="form-control" placeholder="Enter a name"></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span style="font-weight: normal;">Description:</span></td><td><input type="text" name="cat_desc" id="cat_desc" class="form-control" placeholder="Enter a description"></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span style="font-weight: normal;">Tags:</span></td><td><input type="text" name="cat_tags" id="cat_tags" class="form-control" placeholder="Enter tags separated by commas"></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span style="font-weight: normal;">Reference ID:</span></td><td><input type="text" name="cat_ref" id="cat_ref" class="form-control" placeholder="Enter a reference ID"></td>'+
        '</tr>'+
        '</table>'+ 
        '</div>'+
        '</div>'+
        '</div>'+                
        '</div>'+
        '<div class="wizard-footer">'+
        '<div class="pull-right">'+
        '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div>'+
        '<input type="button" class="btn btn-next btn-fill btn-success btn-wd btn-sm" name="next" value="Next" />'+
        '<input type="button" class="btn btn-finish btn-fill btn-success btn-wd btn-sm" onclick="smhCat.saveCat()" name="finish" value="Finish" />'+
        '</div>'+
        '<div class="pull-left">'+
        '<input type="button" class="btn btn-previous btn-fill btn-default btn-wd btn-sm" name="previous" value="Previous" />'+
        '</div>'+
        '<div class="clearfix"></div>'+
        '</div>'+
        '</form>'+
        '</div>';
        $('#smh-modal .modal-body').html(content);
        
        $('#smh-modal .modal-footer').css('padding','5px');
        $('#smh-modal .modal-footer').css('border-top-color','#ffffff');
        
        $('.cat-wrapper').mCustomScrollbar({
            theme:"inset-dark",
            scrollButtons:{
                enable: true
            }
        });
        
        smhCat.activateWizard();
        
        $('#tree').tree({
            collapseDuration: 100,
            expandDuration: 100
        });
        
        $('#add-cat-form input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
        
        validator = $("#add-cat-form").validate({
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
                cat_name:{
                    required: true
                }
            },
            messages: {
                cat_name:{
                    required: 'Please enter a name'
                }
            }
        });
    },
    //Create Category
    saveCat:function(){
        var valid = validator.form();
        if(valid){
            var cb = function (success, results){
                if(!success){
                    $('#smh-modal #loading').empty();
                    $('#smh-modal #pass-result').empty();
                    $('#wizard .btn-previous').removeAttr('disabled');
                    $('#wizard .btn-finish').removeAttr('disabled');
                    alert(results);
                }

                if(results.code && results.message){
                    $('#smh-modal #loading').empty();
                    $('#smh-modal #pass-result').empty();
                    $('#wizard .btn-previous').removeAttr('disabled');
                    $('#wizard .btn-finish').removeAttr('disabled');                    
                    alert(results.message);
                    return;
                }                  
                $('#smh-modal #loading').empty();
                $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Created!</span>');
                setTimeout(function(){
                    $('#smh-modal #pass-result').empty();
                    $('#smh-modal').modal('hide');
                },3000); 
                smhCat.getCategories();
            };
        
            $('#wizard .btn-previous').attr('disabled','');
            $('#wizard .btn-finish').attr('disabled','');
            $('#smh-modal #loading img').css('display','inline-block');               
            var cat_selected = $('#smh-modal input[name=cat_list]:checked').val();
            var name = $('#add-cat-form #cat_name').val();
            var desc = $('#add-cat-form #cat_desc').val();
            var tags = $('#add-cat-form #cat_tags').val();
            var ref = $('#add-cat-form #cat_ref').val();
            
            var category = new KalturaCategory();
            category.parentId = cat_selected;
            category.name = name;
            if(desc){
                category.description = desc;  
            }
            if(tags){
                category.tags = tags;  
            }
            if(ref){
                category.referenceId = ref;  
            }
            client.category.add(cb, category);
            
        }
    },
    //Edit Category Modal
    editCat:function(id,name,desc,tags,ref){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','615px');
        $('#smh-modal .modal-body').css('padding','0');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        var cat_disabled = ($.inArray("CONTENT_MANAGE_EDIT_CATEGORIES", sessPerm) != -1)? '' : 'disabled';
        
        header = '<button type="button" class="close cat-edit-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Category</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<form id="edit-cat-form">'+
        '<div class="row">'+
        '<div class="col-sm-8 center-block" style="margin-bottom: 30px; margin-top: 30px;">'+
        '<table width="100%" border="0" id="admin_edit">'+
        '<tr>'+
        '<td>Category ID:</td><td style="width: 72%;">'+id+'</td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required" style="font-weight: normal;">Name:</span></td><td style="width: 72%;"><input type="text" name="cat_name" id="cat_name" class="form-control" placeholder="Enter a name" value="'+name+'" '+cat_disabled+'></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span style="font-weight: normal;">Description:</span></td><td><input type="text" name="cat_desc" id="cat_desc" class="form-control" placeholder="Enter a description" value="'+desc+'" '+cat_disabled+'></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span style="font-weight: normal;">Tags:</span></td><td><input type="text" name="cat_tags" id="cat_tags" class="form-control" placeholder="Enter tags separated by commas" value="'+tags+'" '+cat_disabled+'></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span style="font-weight: normal;">Reference ID:</span></td><td><input type="text" name="cat_ref" id="cat_ref" class="form-control" placeholder="Enter a reference ID" value="'+ref+'" '+cat_disabled+'></td>'+
        '</tr>'+
        '</table>'+ 
        '</div>'+
        '</div>'+               
        '</form>';
        $('#smh-modal .modal-body').html(content);
            
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default cat-edit-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="edit-cat" onclick="smhCat.doUpdate('+id+')" '+cat_disabled+'>Update</button>';
        $('#smh-modal .modal-footer').html(footer); 
        
        $('#edit-cat-form input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
        
        validator = $("#edit-cat-form").validate({
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
                cat_name:{
                    required: true
                }
            },
            messages: {
                cat_name:{
                    required: 'Please enter a name'
                }
            }
        });        
    },
    //Update Category with no sub-categories
    doUpdate:function(id){
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
                    $('#smh-modal').modal('hide');
                },3000); 
                smhCat.getCategories(); 
            };
        
            $('#smh-modal #edit-cat').attr('disabled','');
            $('#smh-modal #loading img').css('display','inline-block');                
            var name = $('#edit-cat-form #cat_name').val();
            var desc = $('#edit-cat-form #cat_desc').val();
            var tags = $('#edit-cat-form #cat_tags').val();
            var ref = $('#edit-cat-form #cat_ref').val();           
            var category = new KalturaCategory();
            category.parentId = 0;
            category.name = name;
            category.description = desc;
            category.tags = tags;
            category.referenceId = ref;
            category.partnerSortValue = 0;
            client.category.update(cb, id, category);  
        }
    },
    //Get Categories
    getCats:function(){
        var cb = function(success, results){
            if(!success)
                alert(results);
            if(results.code && results.message){
                alert(results.message);
                return;
            }else{
                var categories_arr = [];
                $.each(results.objects, function(index, value){
                    var cat_arr = {};
                    cat_arr['id'] = value.id;
                    cat_arr['parentId'] = value.parentId;
                    cat_arr['name'] = value.name;
                    cat_arr['partnerSortValue'] = value.partnerSortValue;
                    categories_arr.push(cat_arr);
                });
                categories_arr.sort(function(a,b) {
                    return a.partnerSortValue - b.partnerSortValue;
                });
                categories = smhCat.getNestedChildren(categories_arr,0);
            }
        };
        
        var filter = new KalturaCategoryFilter();
        filter.orderBy = "+name";
        var pager = null;
        client.category.listAction(cb, filter, pager); 
    },
    //Creates nested children
    getNestedChildren:function(arr, parentId){
        var out = []
        for(var i in arr) {
            if(arr[i].parentId == parentId) {
                var children = smhCat.getNestedChildren(arr, arr[i].id)

                if(children.length) {
                    arr[i].children = children
                } else {
                    arr[i].children = []
                }
                out.push(arr[i])
            }
        }
        return out 
    },
    //Creates unordered tree
    json_tree:function(data){
        var json = '<ul>';    
        for(var i = 0; i < data.length; ++i) {
            if(data[i].children.length) {
                json = json + '<li class="collapsed"><div class="radio"><label><input type="radio" name="cat_list" class="cat_list" value="'+data[i].id+'"> '+data[i].name+'</label></div>';
                json = json + smhCat.json_tree(data[i].children);
            } else {
                json = json + '<li><div class="radio"><label><input type="radio" name="cat_list" class="cat_list" value="'+data[i].id+'"> '+data[i].name+'</label></div>';
            }
            json = json + '</li>';
        }
        return json + '</ul>';
    },
    //Activate wizard
    activateWizard:function(){
        $('.wizard-card').bootstrapWizard({
            'tabClass': 'nav nav-pills',
            'nextSelector': '.btn-next',
            'previousSelector': '.btn-previous',
            onTabClick : function(tab, navigation, index){
                // Disable the posibility to click on tabs
                return false;
            }, 
            onTabShow: function(tab, navigation, index) {
                var $total = navigation.find('li').length;
                var $current = index+1;
            
                var wizard = navigation.closest('.wizard-card');
            
                // If it's the last tab then hide the last button and show the finish instead
                if($current >= $total) {
                    $(wizard).find('.btn-next').hide();
                    $(wizard).find('.btn-finish').show();
                } else {
                    $(wizard).find('.btn-next').show();
                    $(wizard).find('.btn-finish').hide();
                }
            }
        });  
    },
    //Delete Category modal
    deleteCat:function(id,name,subCat){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','435px');
        $('#smh-modal .modal-body').css('padding','0');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Delete</h4>';
        $('#smh-modal .modal-header').html(header);
        
        if(subCat > 0){
            content = "<div style='text-align: center; margin: 27px 27px 0; height: 95px; width: 378px;'>Are you sure you want to delete the following category and it's sub-categories?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>("+name+")</div>";  
        } else {
            content = "<div style='text-align: center; margin: 27px 27px 0; height: 75px; width: 378px;'>Are you sure you want to delete the following category?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>("+name+")</div>";  
        }        
 
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="delete-cat" onclick="smhCat.removeCat(\''+id+'\')">Delete</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Remove Category
    removeCat:function(id){
        var cb = function (success, results){
            if(!success)
                alert(results);

            if(results == null){
                $('#smh-modal').modal('hide');
                smhCat.getCategories();
            } else if(results.code && results.message){
                alert(results.message);
                return;
            }                
        };
        
        $('#delete-cat').attr('disabled','');
        $('#smh-modal #loading img').css('display','inline-block');
        var moveEntriesToParentCategory = 1;
        client.category.deleteAction(cb, id, moveEntriesToParentCategory);
    },
    //Bulk delete modal
    bulkDeleteModal:function(){
        bulkdelete = new Array();
        var rowcollection =  catTable.$(".cat-bulk:checked", {
            "page": "all"
        });
        rowcollection.each(function(index,elem){
            var checkbox_value = $(elem).val();
            bulkdelete.push(checkbox_value);            
        });
        
        if(bulkdelete.length == 0){
            smhCat.noEntrySelected();
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

            content = '<div style="padding-top: 25px; padding-bottom: 25px; text-align: center;">Are you sure you want to delete the selected categories and their sub-categories?</div>';
 
            $('#smh-modal .modal-body').html(content);
        
            footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="delete-cat" onclick="smhCat.bulkDelete()">Delete</button>';
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
            smhCat.getCategories();
        };
        
        $('#delete-ac').attr('disabled','');
        $('#smh-modal #loading img').css('display','inline-block');        
        client.startMultiRequest();
        var moveEntriesToParentCategory = 1;
        $.each(bulkdelete, function(key, value) {
            client.category.deleteAction(cb, value, moveEntriesToParentCategory);
        });
        client.doMultiRequest(cb);
    },
    //No Entry selected
    noEntrySelected:function(){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','286px');
        $('#smh-modal .modal-body').css('padding','0');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">No Category Selected</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div style="padding-top: 15px; padding-bottom: 15px; text-align: center;">You must select a category</div>';
 
        $('#smh-modal .modal-body').html(content);
        
        footer = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Move Category modal
    moveCat:function(id){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','615px');
        $('#smh-modal .modal-body').css('padding','0');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Move Category</h4>';
        $('#smh-modal .modal-header').html(header);
        
        var tree = smhCat.json_tree(categories);
        
        var cat_list = '<div class="radio"><label><input type="radio" name="cat_list" id="no_parent" value="0" checked> No Parent</label></div>'+
        '<hr style="width: 100%; height: 1px; margin-bottom: 10px; margin-top: 10px;" />'+
        '<div class="cat-wrapper">'+
        '<div id="tree">'+
        tree+        
        '</div>'+
        '</div>';
    
        content = '<div class="row">'+
        '<div class="col-sm-9 center-block" style="margin-bottom: 20px; margin-top: 20px; text-align: center;">'+
        'Select the parent category under which the selected category will appear'+
        '</div>'+
        '<div class="col-sm-11 center-block">'+
        cat_list+
        '</div>'+                        
        '</div>'+
        '</div>';
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="move-cat" onclick="smhCat.doMove('+id+')">Apply</button>';
        $('#smh-modal .modal-footer').html(footer);
        
        $('.cat-wrapper').mCustomScrollbar({
            theme:"inset-dark",
            scrollButtons:{
                enable: true
            }
        });
        
        $('#tree').tree({
            collapseDuration: 100,
            expandDuration: 100
        });
    },
    //Move Category
    doMove:function(id){
        var cb = function (success, results){
            if(!success)
                alert(results);            

            if (results == null){
                $('#smh-modal #loading').empty();
                $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Moved!</span>');
                setTimeout(function(){
                    $('#smh-modal #pass-result').empty();
                    $('#smh-modal').modal('hide');
                },3000); 
                smhCat.getCategories();            
            } else if(results.code && results.message){                  
                alert(results.message);
                return;
            }               
        };
        
        $('#smh-modal #move-cat').attr('disabled','');
        $('#smh-modal #loading img').css('display','inline-block');                
        var cat_selected = $('#smh-modal input[name=cat_list]:checked').val();            
        var categoryIds = id;
        var targetCategoryParentId = cat_selected;
        client.category.move(cb, categoryIds, targetCategoryParentId);
    },
    //Bulk move categories modal
    bulkMove:function(){
        bulkmove = new Array();
        var rowcollection =  catTable.$(".cat-bulk:checked", {
            "page": "all"
        });
        rowcollection.each(function(index,elem){
            var checkbox_value = $(elem).val();
            bulkmove.push(checkbox_value);            
        });
        
        if(bulkmove.length == 0){
            smhCat.noEntrySelected();
        } else {
            smhMain.resetModal();
            var header, content, footer;
            $('.smh-dialog').css('width','615px');
            $('#smh-modal .modal-body').css('padding','0');
            $('#smh-modal').modal({
                backdrop: 'static'
            }); 
        
            header = '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Move Category</h4>';
            $('#smh-modal .modal-header').html(header);
        
            var tree = smhCat.json_tree(categories);
        
            var cat_list = '<div class="radio"><label><input type="radio" name="cat_list" id="no_parent" value="0" checked> No Parent</label></div>'+
            '<hr style="width: 100%; height: 1px; margin-bottom: 10px; margin-top: 10px;" />'+
            '<div class="cat-wrapper">'+
            '<div id="tree">'+
            tree+        
            '</div>'+
            '</div>';
    
            content = '<div class="row">'+
            '<div class="col-sm-10 center-block" style="margin-bottom: 20px; margin-top: 20px; text-align: center;">'+
            'Select the parent category under which the selected categories will appear.'+
            '</div>'+
            '<div class="col-sm-11 center-block">'+
            cat_list+
            '</div>'+                        
            '</div>'+
            '</div>';
            $('#smh-modal .modal-body').html(content);
        
            footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="bulkmove-cat" onclick="smhCat.doBulkMove()">Apply</button>';
            $('#smh-modal .modal-footer').html(footer);
        
            $('.cat-wrapper').mCustomScrollbar({
                theme:"inset-dark",
                scrollButtons:{
                    enable: true
                }
            });
        
            $('#tree').tree({
                collapseDuration: 100,
                expandDuration: 100
            });
        }
    },
    //Bulk move categories
    doBulkMove:function(){
        var cb = function (success, results){
            if(!success)
                alert(results);            

            if (results == null){
                $('#smh-modal #loading').empty();
                $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Moved!</span>');
                setTimeout(function(){
                    $('#smh-modal #pass-result').empty();
                    $('#smh-modal').modal('hide');
                },3000); 
                smhCat.getCategories();            
            } else if(results.code && results.message){                  
                alert(results.message);
                return;
            }               
        };
        
        var ids = bulkmove.join(",");
        $('#smh-modal #bulkmove-cat').attr('disabled','');
        $('#smh-modal #loading img').css('display','inline-block');                
        var cat_selected = $('#smh-modal input[name=cat_list]:checked').val();            
        var categoryIds = ids;
        var targetCategoryParentId = cat_selected;
        client.category.move(cb, categoryIds, targetCategoryParentId);
    },
    //Export Metadata
    exportMetaData:function(){        
        if(total_entries){
            window.location = '/apps/platform/metadata/export.metadata.php?pid='+sessInfo.pid+'&ks='+sessInfo.ks+'&page_size='+total_entries+'&action=export_cat_metadata';  
        }        
    },
    //Register all user actions
    registerActions:function(){
        $('#smh-modal').on('click', '.cat-create-close', function(){
            $('#add-cat-form input[type="text"]').tooltipster('destroy');
        });
        $('#smh-modal').on('click', '.cat-edit-close', function(){
            $('#edit-cat-form input[type="text"]').tooltipster('destroy');
        });
    }
}

// Cat on ready
$(document).ready(function(){
    smhCat = new Cat();
    smhCat.getCategories();
    smhCat.registerActions();
});
