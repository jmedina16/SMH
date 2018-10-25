/*
 *
 *	Streaming Media Hosting
 *	
 *	Help
 *
 *	9-15-2015
 */
//Main constructor
function Help() {}

//Global variables

//Login prototype/class
Help.prototype = {
    constructor: Help,
    //Build tickets table
    getUserTickets:function(){
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#help-table').empty();
        $('#help-table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="help-data"></table>');
        ticektsTable = $('#help-data').DataTable({
            "dom": 'R<"H"lfr>t<"F"ip>',
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
                "url": "/api/v1/getUserTickets",
                "type": "GET",
                "data": function ( d ) {                    
                    return $.extend( {}, d, {
                        "_token": $('meta[name="csrf-token"]').attr('content'),
                        "tz": tz
                    } );
                }
            },
            "language": {
                "zeroRecords": "No tickets Found"
            },
            "columns": [
            {
                "title": "<span style='float: left;'><div class='data-break'>Status</div></span>"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>Ticket ID</div></span>"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>Ticket Name</div></span>"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>Department</div></span>"
            },
            {
                "title": "<span style='float: left;'><div class='data-break'>Date Created</div></span>"
            },
            ],           
            "drawCallback": function( oSettings ) {
                smhMain.fcmcAddRows(this, 5, 10);     
            }                                
        });
    },
    //Register actions
    registerActions:function(){
    }
}

// Main on ready
$(document).ready(function(){
    smhHelp = new Help();
    smhHelp.getUserTickets();
    smhHelp.registerActions();
});
