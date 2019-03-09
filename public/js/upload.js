/*
 *
 *	Streaming Media Hosting
 *	
 *	Upload
 *
 *	9-01-2015
 */
//Main constructor
function Upload(pid, ks) {
    this.pid = pid;
    this.ks = ks;
}

//Global variables
var categories = {};
var cats = [];
var ac = {};
var trans_profiles = {};
var template = {};
var data = {};
var fileNumber = 0;

//Upload prototype/class
Upload.prototype = {
    constructor: Upload,
    formatFileSize: function (bytes) {
        if (typeof bytes !== 'number') {
            return '';
        }
        if (bytes >= 1000000000) {
            return (bytes / 1000000000).toFixed(2) + ' GB';
        }
        if (bytes >= 1000000) {
            return (bytes / 1000000).toFixed(2) + ' MB';
        }
        return (bytes / 1000).toFixed(2) + ' KB';
    },
    init_fileupload: function () {
        var maxFiles = 10;
        // Initialize the jQuery File Upload widget:
        $('#fileupload').fileupload({
            //maxChunkSize: 1024 * 256,
            //maxChunkSize: 1024 * 128,
            maxChunkSize: 3000000,
            dynamicChunkSizeInitialChunkSize: 1000000,
            dynamicChunkSizeThreshold: 250000000,
            dynamixChunkSizeMaxTime: 30,
            maxRetries: 5,
            retryTimeout: 500,
            multipart: false,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp|tiff|mp4|flv|f4v|m4v|asf|mov|avi|3gp|ogg|mkv|wmv|wma|webm|mpeg|mpg|m1v|m2v|wav|mp3|aac|flac|ac3)$/i,
            singleFileUploads: false,
            maxNumberOfFiles: 10,
            dropZone: $('#dropzone'),
            add: function (e, data) {
                if (fileNumber > 1) {
                    alert("Please drag one file at a time");
                    return false;
                } else {
                    var fileCount = data.files.length;
                    var numberOfFiles = $(this).fileupload('option').getNumberOfFiles();
                    var filetype = $(this).fileupload('option').acceptFileTypes;
                    if (fileCount > maxFiles || numberOfFiles >= 10) {
                        alert("The max number of files is " + maxFiles);
                        return false;
                    } else if (!filetype.test(data.files[0].name)) {
                        alert('File type not allowed');
                        return false;
                    } else {
                        $('.fileinput-button').css('display', 'inline-block');
                        $('.fileupload-buttonbar .start').css('display', 'inline-block');
                        $('.fileupload-buttonbar .cancel').css('display', 'inline-block');
                        var file, filename, sessionID, sessionName, session;
                        var that = this;
                        file = data.files[0];
                        filename = file.name;   

                        var fname = file.name.substring(0, file.name.indexOf('.')) + '-10-29-2019-03-06-161409.mp4';
                        console.log(fname);
                                        
                        sessionID = $.base64.encode(fname).replace(/\+|=|\//g, '');                                       
                        sessionName = $.base64.encode(sessInfo.pid).replace(/\+|=|\//g, '');
                        session = sessionName + sessionID;

                        $.getJSON('/server/php/', {
                            file: session,
                            pid: sessInfo.pid,
                            ks: sessInfo.ks
                        }, function (result) {
                            var file = result.file;
                            data.uploadedBytes = file && file.size;
                            $.blueimp.fileupload.prototype
                                    .options.add.call(that, e, data);
                        });
                    }
                }

            },
            drop: function (e, data) {
                fileNumber = 0;
                $.each(data.files, function (index, file) {
                    fileNumber++;
                });
            },
            fail: function (e, data) {
                if (data.errorThrown == 'abort') {
                    var numberOfFiles = $(this).fileupload('option').getNumberOfFiles();
                    if (numberOfFiles == 1) {
                        $('.fileupload-buttonbar .start').css('display', 'none');
                        $('.fileupload-buttonbar .cancel').css('display', 'none');
                        $('.fileinput-button').css('display', 'inline-block');
                    }
                }

                var file = data.files[0];
                var filename = file.name;
                var sessionName = $.base64.encode(sessInfo.pid).replace(/\+|=|\//g, '');
                var sessionID = $.base64.encode(filename).replace(/\+|=|\//g, '');
                var session = sessionName + sessionID;
                var fu = $(this).data('blueimp-fileupload') || $(this).data('fileupload'),
                        retries = data.context.data('retries') || 0,
                        retry = function () {
                            $.getJSON('/server/php/', {
                                file: session,
                                pid: sessInfo.pid,
                                ks: sessInfo.ks
                            })
                                    .done(function (result) {
                                        var file = result.file;
                                        data.uploadedBytes = file && file.size;
                                        // clear the previous data:
                                        data.data = null;
                                        data.submit();
                                    })
                                    .fail(function () {
                                        fu._trigger('fail', e, data);
                                    });
                        };
                if (data.errorThrown !== 'abort' &&
                        data.uploadedBytes < data.files[0].size &&
                        retries < fu.options.maxRetries) {
                    retries += 1;
                    data.context.data('retries', retries);
                    window.setTimeout(retry, retries * fu.options.retryTimeout);
                    return;
                } else if (data.uploadedBytes == data.files[0].size) {
                    $.each(data.files, function (index, file) {
                        data.context.html('<td colspan="4"><div class="upload-finish"><h4>' + file.name + '</h4> size: ' + smhUpload.formatFileSize(parseInt(file.size)) + '<br><br><i style="color: green;">Upload finished</i></div></td>');
                    });
                    return;
                }

                data.context.removeData('retries');
                $.blueimp.fileupload.prototype
                        .options.fail.call(this, e, data);
            },
            beforeSend: function (e, files, index, xhr, handler, callback) {
                var chrome, context, device, file, filename, filesize, ios, sessionID, sessionName, session;

                // Retrieve the file that is about to be sent to nginx
                file = files.files[0];

                // Collect some basic file information
                filename = file.name;
                
                var fname = file.name.substring(0, file.name.indexOf('.')) + '-10-29-2019-03-06-161409.mp4';
                console.log(fname);

                // Get the generated sessionID for this upload
                sessionID = $.base64.encode(fname).replace(/\+|=|\//g, '');
                sessionName = $.base64.encode(sessInfo.pid).replace(/\+|=|\//g, '');
                session = sessionName + sessionID;

                // Set the required headers for the nginx upload module
                e.setRequestHeader("Session-ID", session);
                e.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                e.setRequestHeader("Accept", "*/*");

                device = navigator.userAgent.toLowerCase();
                ios = device.match(/(iphone|ipod|ipad)/);
                chrome = device.match(/crios/);

                if (ios && !chrome) {
                    e.setRequestHeader("Cache-Control", "no-cache");
                }
            },
            done: function (e, data) {
                var sessData, file, filename, orig_filename, description, tags, refid, category, ac_profile, trans_profile, filesize, sessionID, sessionName, session;
                file = data.files[0];
                filename = file.name;
                description = '';
                tags = '';
                refid = '';
                category = '';
                ac_profile = 0;
                trans_profile = 0;
                vr_stereo_mode = null;
                filesize = data.files[0].size;    
                
                var fname = file.name.substring(0, file.name.indexOf('.')) + '-10-29-2019-03-06-161409.mp4';
                
                sessionID = $.base64.encode(fname).replace(/\+|=|\//g, '');                
                sessionName = $.base64.encode(sessInfo.pid).replace(/\+|=|\//g, '');                
                session = sessionName + sessionID;

                if (data.entry_details == undefined) {
                    sessData = {
                        file_sess: session,
                        file_name: $.trim(encodeURIComponent(fname)),
                        orig_file_name: $.trim(encodeURIComponent(filename)),
                        file_size: filesize,
                        desc: $.trim(description),
                        tags: $.trim(tags),
                        refid: $.trim(refid),
                        cat: category,
                        ac_pro: ac_profile,
                        trans_pro: trans_profile,
                        vr_stereo_mode: vr_stereo_mode,
                        pid: sessInfo.pid,
                        ks: sessInfo.ks
                    }
                } else {
                    if (data.entry_details.name !== '') {
                        orig_filename = filename;
                        filename = data.entry_details.name;
                    }
                    sessData = {
                        file_sess: session,
                        file_name: $.trim(encodeURIComponent(filename)),
                        orig_file_name: $.trim(encodeURIComponent(orig_filename)),
                        file_size: filesize,
                        desc: $.trim(encodeURIComponent(data.entry_details.description)),
                        tags: $.trim(encodeURIComponent(data.entry_details.tags)),
                        refid: $.trim(encodeURIComponent(data.entry_details.refid)),
                        cat: $.trim(encodeURIComponent(data.entry_details.category)),
                        ac_pro: data.entry_details.ac_profile,
                        trans_pro: data.entry_details.trans_profile,
                        vr_stereo_mode: data.entry_details.vr_stereo_mode,
                        pid: sessInfo.pid,
                        ks: sessInfo.ks
                    }
                }

                var reqUrl = "/server/php/processfile.php";
                $.ajax({
                    cache: false,
                    url: reqUrl,
                    async: false,
                    type: 'POST',
                    data: sessData,
                    beforeSend: function () {
                        data.context.html('<td colspan="4"><div style="text-align: left;"><h4 style="color: green;">Processing..</h4></div></td>');
                    },
                    error: function () {
                        data.context.html('<td colspan="4"><div style="text-align: left;"><h4 style="color: red;">Something went wrong..</h4></div></td>');
                    },
                    success: function (r) {
                        var response = JSON.parse(data.result);
                        $.each(response.files, function (index, file) {
                            data.context.html('<td colspan="4"><div class="upload-finish"><h4>' + decodeURIComponent(file.name) + '</h4> size: ' + smhUpload.formatFileSize(parseInt(file.size)) + '<br><br><i style="color: green;">Upload finished</i></div></td>');
                        });
                    }
                });
            }
        });
    },
    //Get Categories
    getCategory: function () {
        var cb = function (success, results) {
            if (!success)
                alert(results);
            if (results.code && results.message) {
                alert(results.message);
                return;
            } else {
                var categories_arr = [];
                $.each(results.objects, function (index, value) {
                    cats[value.id] = value.fullName;
                    var cat_arr = {};
                    cat_arr['id'] = value.id;
                    cat_arr['parentId'] = value.parentId;
                    cat_arr['name'] = value.name;
                    cat_arr['partnerSortValue'] = value.partnerSortValue;
                    categories_arr.push(cat_arr);
                });
                categories_arr.sort(function (a, b) {
                    return a.partnerSortValue - b.partnerSortValue;
                });
                categories = smhUpload.getNestedChildren(categories_arr, 0);
            }
        };

        var filter = new KalturaCategoryFilter();
        filter.orderBy = "+name";
        var pager = null;
        client.category.listAction(cb, filter, pager);
    },
    //Get Access Control
    getAccessControlProfiles: function () {
        var cb = function (success, results) {
            if (!success)
                alert(results);
            if (results.code && results.message) {
                alert(results.message);
                return;
            } else {
                $.each(results.objects, function (index, value) {
                    if (value.name == 'Default') {
                        ac[0] = value.name
                    } else {
                        ac[value.id] = value.name
                    }
                });
            }
        };

        var filter = null;
        var pager = null;
        client.accessControlProfile.listAction(cb, filter, pager);
    },
    //Get Conversion Profiles
    getConversionProfiles: function () {
        var cb = function (success, results) {
            if (!success)
                alert(results);
            if (results.code && results.message) {
                alert(results.message);
                return;
            } else {
                $.each(results.objects, function (index, value) {
                    if (value.name == 'Default') {
                        trans_profiles[0] = value.name
                    } else {
                        trans_profiles[value.id] = value.name
                    }
                });
            }
        };

        var pager = null;
        var filter = new KalturaConversionProfileFilter();
        filter.typeEqual = 1;
        client.conversionProfile.listAction(cb, filter, pager);
    },
    //Updates the data object
    saveEntry: function () {
        var entry_details = {
            "name": $('#customize-media #name').val(),
            "description": $('#customize-media #description').val(),
            "tags": $('#customize-media #tags').val(),
            "refid": $('#customize-media #refid').val(),
            "category": $('#customize-media #cats').val(),
            "ac_profile": $('#customize-media #ac-select').val(),
            "trans_profile": $('#customize-media #trans-select').val()
        }
        if ($('#smh-modal #threesixty-video').prop('checked')) {
            entry_details['vr_stereo_mode'] = $('#customize-media #vr-select').val();
        } else {
            entry_details['vr_stereo_mode'] = null;
        }
        data["entry_details"] = entry_details;
        template.data({
            "data": data
        });
        $('#smh-modal').modal('hide');

    },
    //Customize button
    customizeEntry: function (e, name) {
        var button = $(e);
        template = button.closest('.template-upload');
        data = template.data("data");

        var entry_name = '';
        var entry_desc = '';
        var entry_tags = '';
        var entry_refid = '';
        var cat_val = '';
        var tans_val = '';
        var ac_val = '';
        var disable = '';
        var vr_stereo_mode_val = '';
        if (!services.trans_vod || ($.inArray("CONTENT_MANAGE_RECONVERT", sessPerm) == -1)) {
            disable = 'disabled'
        }
        if (data.entry_details == undefined) {
            entry_name = name;
        } else {
            entry_name = data.entry_details.name;
            entry_desc = data.entry_details.description;
            entry_tags = data.entry_details.tags;
            entry_refid = data.entry_details.refid;
            cat_val = data.entry_details.category;
            tans_val = data.entry_details.trans_profile;
            ac_val = data.entry_details.ac_profile;
            vr_stereo_mode_val = data.entry_details.vr_stereo_mode
        }

        smhMain.resetModal();
        var header, content, footer;
        var cat_disable = ($.inArray("CONTENT_MANAGE_ASSIGN_CATEGORIES", sessPerm) != -1) ? '' : 'disabled';
        var conv_select = '';
        var ac_select = '';
        var ac_disable = ($.inArray("CONTENT_MANAGE_ACCESS_CONTROL", sessPerm) != -1) ? '' : 'disabled';
        var refid_disable = ($.inArray("CONTENT_INGEST_REFERENCE_MODIFY", sessPerm) != -1) ? '' : 'disabled';
        var metadata_disable = ($.inArray("CONTENT_MANAGE_METADATA", sessPerm) != -1) ? '' : 'disabled';
        $('.smh-dialog').css('width', '512px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });

        $.each(trans_profiles, function (index, value) {
            if (index == tans_val) {
                conv_select += '<option value="' + index + '" selected>' + value + '</option>';
            } else {
                conv_select += '<option value="' + index + '">' + value + '</option>';
            }
        });

        $.each(ac, function (index, value) {
            if (index == ac_val) {
                ac_select += '<option value="' + index + '" selected>' + value + '</option>';
            } else {
                ac_select += '<option value="' + index + '">' + value + '</option>';
            }
        });

        var vr_row = '';
        if (services.sn) {
            vr_row = '<tr>' +
                    '<td><b>360&deg; Video:</b></td><td><input data-toggle="toggle" id="threesixty-video" type="checkbox"></td>' +
                    '</tr>' +
                    '<tr id="threesixty-format">' +
                    '<td><b>VR Video Format:</b></td><td>' +
                    '<div class="dropdown vr-wrapper">' +
                    '<select id="vr-select" class="form-control"><option value="none">2D</option><option value="top-bottom">3D Top/Bottom</option><option value="left-right">3D Side By Side</option></select>' +
                    '</div>' +
                    '<div class="clear"></div>' +
                    '</td>' +
                    '</tr>';
        }

        header = '<button type="button" class="close smh-close pass-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Entry Details</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<div id="pass-wrapper">' +
                '<form id="customize-media">' +
                '<table id="media-table">' +
                '<tr>' +
                '<td style="width: 170px;"><b>Name:</b></td>' +
                '<td><input type="text" name="name" id="name" class="form-control" placeholder="Enter entry name" value="' + entry_name + '" ' + metadata_disable + '></td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Description:</b></td>' +
                '<td><textarea id="description" class="form-control" placeholder="Enter entry description" rows="3" ' + metadata_disable + '>' + entry_desc + '</textarea></td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Tags:</b></td>' +
                '<td><input type="text" name="tags" id="tags" class="form-control" placeholder="Enter tags separated by commas" value="' + entry_tags + '" ' + metadata_disable + '></td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Reference ID:</b></td>' +
                '<td><input type="text" name="refid" id="refid" class="form-control" placeholder="Enter a reference ID" value="' + entry_refid + '" ' + refid_disable + '></td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Category:</b> <i class="fa fa-external-link" onclick="smhUpload.selectCat();"></i></td>' +
                '<td><input type="text" name="cats" id="cats" class="form-control" placeholder="Enter categories separated by commas" value="' + cat_val + '" ' + cat_disable + '></td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Access Control Profile:</b></td>' +
                '<td><select id="ac-select" class="form-control" ' + ac_disable + '>' + ac_select + '</select></td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Transcoding Profile:</b></td>' +
                '<td><select id="trans-select" class="form-control" ' + disable + '>' + conv_select + '</select></td>' +
                '</tr>' +
                vr_row +
                '</table>' +
                '</form>' +
                '</div>';
        $('#smh-modal .modal-body').html(content);

        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default pass-close" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" onclick="smhUpload.saveEntry()">Save</button>';
        $('#smh-modal .modal-footer').html(footer);

        $('#threesixty-video').bootstrapToggle({
            on: 'Yes',
            off: 'No'
        });

        if (vr_stereo_mode_val) {
            $('#customize-media #threesixty-video').bootstrapToggle('on');
            $('#threesixty-format').css('display', 'table-row');
            $('#customize-media #vr-select').val(vr_stereo_mode_val);
        }

        $('#threesixty-video').change(function () {
            if ($(this).prop('checked')) {
                $('#threesixty-format').css('display', 'table-row');
            } else {
                $('#threesixty-format').css('display', 'none');
            }
        });
    },
    //Select categories modal
    selectCat: function () {
        smhUpload.resetModal();
        var header, content, footer;
        $('.smh-dialog2').css('width', '350px');
        $('#smh-modal2').modal({
            backdrop: 'static'
        });

        $('#smh-modal2').css('z-index', '2000');
        $('#smh-modal').css('z-index', '2');

        var tree = '<div style="margin-left: auto; margin-right: auto; width: 135px; font-weight: bold; margin-top: 50px;">No Categories found</div>';
        var apply_button = '';
        if (categories.length > 0) {
            tree = smhUpload.json_tree(categories, 'cat');
            apply_button = '<button type="button" class="btn btn-primary" onclick="smhUpload.applyCat();">Apply</button>'
        }
        header = '<button type="button" class="close smh-close2" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Select Categories</h4>';
        $('#smh-modal2 .modal-header').html(header);

        content = '<div id="catselect-wrapper">' +
                '<div id="tree3">' +
                '<div class="cat-options">' +
                tree +
                '</div>' +
                '</div>' +
                '</div>';

        $('#smh-modal2 .modal-body').html(content);

        footer = '<button type="button" class="btn btn-default smh-close2" data-dismiss="modal">Close</button>' + apply_button;
        $('#smh-modal2 .modal-footer').html(footer);

        if (categories.length > 0) {
            $('#catselect-wrapper #tree3').tree({
                collapseDuration: 100,
                expandDuration: 100,
                onCheck: {
                    ancestors: null
                }
            });
            $('#catselect-wrapper').mCustomScrollbar({
                theme: "inset-dark",
                scrollButtons: {
                    enable: true
                }
            });
        }
    },
    //Creates unordered tree
    json_tree: function (data, type) {
        var json = '<ul>';
        for (var i = 0; i < data.length; ++i) {
            if (data[i].children.length) {
                json = json + '<li class="collapsed"><div class="checkbox"><label><input type="checkbox" class="' + type + '_list" value="' + data[i].id + '" /> ' + data[i].name + '</label></div>';
                json = json + smhUpload.json_tree(data[i].children, type);
            } else {
                json = json + '<li><div class="checkbox"><label><input type="checkbox" class="' + type + '_list" value="' + data[i].id + '" /> ' + data[i].name + '</label></div>';
            }
            json = json + '</li>';
        }
        return json + '</ul>';
    },
    //Inserts Categories
    applyCat: function () {
        var catIDs = [];
        $('#smh-modal2 .cat-options input[type="checkbox"]').each(function () {
            if ($(this).is(":checked")) {
                var checkbox_value = $(this).val();
                catIDs.push(cats[checkbox_value]);
            }
        });
        $('#cats').val(catIDs.join(','));
        $('#smh-modal2 .smh-close2').click();
    },
    //Creates nested children
    getNestedChildren: function (arr, parentId) {
        var out = []
        for (var i in arr) {
            if (arr[i].parentId == parentId) {
                var children = smhUpload.getNestedChildren(arr, arr[i].id)

                if (children.length) {
                    arr[i].children = children
                } else {
                    arr[i].children = []
                }
                out.push(arr[i])
            }
        }
        return out
    },
    //Reset Modal
    resetModal: function () {
        $('#smh-modal2 .modal-header').empty();
        $('#smh-modal2 .modal-body').empty();
        $('#smh-modal2 .modal-footer').empty();
        $('#smh-modal2 .modal-content').css('min-height', '');
        $('#smh-modal2 .smh-dialog2').css('width', '');
        $('#smh-modal2 .modal-body').css('height', '');
        $('#smh-modal2 .modal-body').css('padding', '15px');
    },
    //Register actions
    registerActions: function () {
        $('button.cancel').click(function (e) {
            $('.fileupload-buttonbar .start').css('display', 'none');
            $('.fileupload-buttonbar .cancel').css('display', 'none');
            $('.fileinput-button').css('display', 'inline-block');
        });
        $('#smh-modal2').on('click', '.smh-close2', function () {
            $('#smh-modal').css('z-index', '');
            $('#smh-modal2').on('hidden.bs.modal', function (e) {
                $('body').addClass('modal-open');
            });
        });
    }
}

// Main on ready
$(document).ready(function () {
    smhUpload = new Upload(sessInfo.pid, sessInfo.ks);
    smhUpload.getCategory();
    smhUpload.getAccessControlProfiles();
    smhUpload.getConversionProfiles();
    smhUpload.init_fileupload();
    smhUpload.registerActions();
});