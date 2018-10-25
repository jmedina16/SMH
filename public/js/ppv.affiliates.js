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
var validator, total_aff, total_camp, total_market, total_comm;
var email_data = new Array();

//PPV prototype/class
PPV.prototype = {
    constructor: PPV,
    //Get Orders table
    getAffiliates:function(){
        $('#affiliate-table').empty();
        $('#affiliate-table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="affiliate-data"></table>');
        $('#affiliate-data').dataTable({
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
                        "action": "list_affiliates",
                        "pid": sessInfo.pid,
                        "ks": sessInfo.ks
                    } );
                },
                "dataSrc": function ( json ) {
                    total_aff = json['recordsTotal'];
                    return json.data;
                }
            },
            "language": {
                "zeroRecords": "No Affiliates Found"
            },
            "columns": [
            {
                "title": "<span style='float: left;'>Status</span>"
            },
            {
                "title": "<span style='float: left;'>Referral ID</span>"
            },
            {
                "title": "<span style='float: left;'>First Name</span>"
            },
            {
                "title": "<span style='float: left;'>Last Name</span>"
            },
            {
                "title": "<span style='float: left;'>Email</span>"
            },
            {
                "title": "<span style='float: left;'>Total Commissions</span>"
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
    //Get Campaigns Table
    getCampaigns:function(){
        $('#campaign-table').empty();
        $('#campaign-table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="campaign-data"></table>');
        $('#campaign-data').dataTable({
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
                        "action": "list_campaigns",
                        "pid": sessInfo.pid,
                        "ks": sessInfo.ks,
                        "currency": $.cookie('currency')
                    } );
                },
                "dataSrc": function ( json ) {
                    total_camp = json['recordsTotal'];
                    return json.data;
                }
            },
            "language": {
                "zeroRecords": "No Campaigns Found"
            },
            "columns": [
            {
                "title": "<span style='float: left;'>Status</span>"
            },
            {
                "title": "<span style='float: left;'>ID</span>"
            },
            {
                "title": "<span style='float: left;'>Name</span>"
            },
            {
                "title": "<span style='float: left;'>Cookie Life</span>"
            },
            {
                "title": "<span style='float: left;'>Commission Rate</span>"
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
                smhMain.fcmcAddRows(this, 7, 10);     
            }                              
        });
    },
    //Get Markteting Table
    getMarketing:function(){
        $('#marketing-table').empty();
        $('#marketing-table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="marketing-data"></table>');
        $('#marketing-data').dataTable({
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
                        "action": "list_marketing",
                        "pid": sessInfo.pid,
                        "ks": sessInfo.ks,
                        "currency": $.cookie('currency')
                    } );
                },
                "dataSrc": function ( json ) {
                    total_market = json['recordsTotal'];
                    return json.data;
                }
            },
            "language": {
                "zeroRecords": "No Links Found"
            },
            "columns": [
            {
                "title": "<span style='float: left;'>Status</span>"
            },
            {
                "title": "<span style='float: left;'>ID</span>"
            },
            {
                "title": "<span style='float: left;'>Name</span>"
            },
            {
                "title": "<span style='float: left;'>Target URL</span>"
            },
            {
                "title": "<span style='float: left;'>Affiliate Name</span>"
            },            
            {
                "title": "<span style='float: left;'>Campaign Name</span>"
            },            
            {
                "title": "<span style='float: left;'>Unique Clicks <i data-placement='top' data-toggle='tooltip' data-delay=\'{\"show\":700, \"hide\":30}\' data-html='true' data-original-title='A unique click is when a customer clicks an affiliate link<br> for the very first time and is redirected to your site.' class='fa fa-question-circle'></i></span>"
            },
            {
                "title": "<span style='float: left;'>Raw Clicks <i data-placement='top' data-toggle='tooltip' data-delay=\'{\"show\":700, \"hide\":30}\' data-html='true' data-original-title='A raw click is all the other times when the same customer clicks<br> an affiliate link by which he/she gets to your site.' class='fa fa-question-circle'></i></span>"
            },
            {
                "title": "<span style='float: left;'>Sales</span>"
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
                smhMain.fcmcAddRows(this, 11, 10);     
            }                              
        });
    },
    //Get Commissions Table
    getCommissions:function(){
        $('#commissions-table').empty();
        $('#commissions-table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data" id="commissions-data"></table>');
        $('#commissions-data').dataTable({
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
                        "action": "list_commissions",
                        "pid": sessInfo.pid,
                        "ks": sessInfo.ks
                    } );
                },
                "dataSrc": function ( json ) {
                    total_comm = json['recordsTotal'];
                    return json.data;
                }
            },
            "language": {
                "zeroRecords": "No Commissions Found"
            },
            "columns": [
            {
                "title": "<span style='float: left;'>ID</span>"
            },
            {
                "title": "<span style='float: left;'>Status</span>"
            },
            {
                "title": "<span style='float: left;'>Customer</span>"
            },
            {
                "title": "<span style='float: left;'>Referred By</span>"
            },
            {
                "title": "<span style='float: left;'>Order ID</span>"
            },            
            {
                "title": "<span style='float: left;'>Order Date</span>"
            },            
            {
                "title": "<span style='float: left;'>Campaign</span>"
            },
            {
                "title": "<span style='float: left;'>Commission</span>"
            },
            {
                "title": "<span style='float: left;'>Total Sale</span>"
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
                smhMain.fcmcAddRows(this, 10, 10);     
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
    //Add Affiliate Modal
    addAff:function(){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','825px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close affiliate-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Create Affiliate</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<center><form id="affiliate-user" action="">'+
        '<table width="695px" border="0" id="affiliate_edit">'+
        '<tr>'+
        '<td><div style="width: 100px;"><span class="required">First Name</span>:</div></td><td><input type="text" name="fname" class="form-control" placeholder="Enter a First Name" id="fname" size="49"></td><td><div style="margin-left: 20px; width: 100px;">City:</div></td><td><input type="text" name="city" class="form-control" placeholder="Enter a City" id="city" size="49"></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required">Last Name</span>:</td><td><input type="text" name="lname" class="form-control" placeholder="Enter a Last Name" id="lname" size="49" ></td><td><div style="margin-left: 20px;">State:</div></td><td><input type="text" name="state" class="form-control" placeholder="Enter a State" id="state" size="49"></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required">Email</span>:</td><td><input type="text" name="email" class="form-control" placeholder="Enter an Email" id="email" size="49" ></td><td><div style="margin-left: 20px;">Postal Code:</div></td><td><input type="text" name="zip" class="form-control" placeholder="Enter a Zip Code" id="zip" size="49"></td>'+
        '</tr>'+
        '<tr>'+
        '<td>Phone:</td><td><input type="text" name="phone" class="form-control" placeholder="Enter a Phone Number" id="phone" size="49"></td><td><div style="margin-left: 20px;">Country:</div></td><td><select id="country" class="form-control" style="width: 175px;"><option value="1">Afghanistan</option><option value="2">Albania</option><option value="3">Algeria</option><option value="4">American Samoa</option><option value="5">Andorra</option><option value="6">Angola</option><option value="7">Anguilla</option><option value="8">Antarctica</option><option value="9">Antigua and Barbuda</option><option value="10">Argentina</option><option value="11">Armenia</option><option value="12">Aruba</option><option value="13">Australia</option><option value="14">Austria</option><option value="15">Azerbaijan</option><option value="16">Bahamas</option><option value="17">Bahrain</option><option value="18">Bangladesh</option><option value="19">Barbados</option><option value="20">Belarus</option><option value="21">Belgium</option><option value="22">Belize</option><option value="23">Benin</option><option value="24">Bermuda</option><option value="25">Bhutan</option><option value="26">Bolivia</option><option value="27">Bosnia and Herzegowina</option><option value="28">Botswana</option><option value="29">Bouvet Island</option><option value="30">Brazil</option><option value="31">British Indian Ocean Territory</option><option value="32">Brunei Darussalam</option><option value="33">Bulgaria</option><option value="34">Burkina Faso</option><option value="35">Burundi</option><option value="36">Cambodia</option><option value="37">Cameroon</option><option value="38">Canada</option><option value="39">Cape Verde</option><option value="40">Cayman Islands</option><option value="41">Central African Republic</option><option value="42">Chad</option><option value="43">Chile</option><option value="44">China</option><option value="45">Christmas Island</option><option value="46">Cocos (Keeling) Islands</option><option value="47">Colombia</option><option value="48">Comoros</option><option value="49">Congo</option><option value="50">Cook Islands</option><option value="51">Costa Rica</option><option value="52">Cote D'+'Ivoire</option><option value="53">Croatia</option><option value="54">Cuba</option><option value="55">Cyprus</option><option value="56">Czech Republic</option><option value="57">Denmark</option><option value="58">Djibouti</option><option value="59">Dominica</option><option value="60">Dominican Republic</option><option value="61">East Timor</option><option value="62">Ecuador</option><option value="63">Egypt</option><option value="64">El Salvador</option><option value="65">Equatorial Guinea</option><option value="66">Eritrea</option><option value="67">Estonia</option><option value="68">Ethiopia</option><option value="69">Falkland Islands (Malvinas)</option><option value="70">Faroe Islands</option><option value="71">Fiji</option><option value="72">Finland</option><option value="73">France</option><option value="74">France, Metropolitan</option><option value="75">French Guiana</option><option value="76">French Polynesia</option><option value="77">French Southern Territories</option><option value="78">Gabon</option><option value="79">Gambia</option><option value="80">Georgia</option><option value="81">Germany</option><option value="82">Ghana</option><option value="83">Gibraltar</option><option value="84">Greece</option><option value="85">Greenland</option><option value="86">Grenada</option><option value="87">Guadeloupe</option><option value="88">Guam</option><option value="89">Guatemala</option><option value="90">Guinea</option><option value="91">Guinea-bissau</option><option value="92">Guyana</option><option value="93">Haiti</option><option value="94">Heard and Mc Donald Islands</option><option value="95">Honduras</option><option value="96">Hong Kong</option><option value="97">Hungary</option><option value="98">Iceland</option><option value="99">India</option><option value="100">Indonesia</option><option value="101">Iran (Islamic Republic of)</option><option value="102">Iraq</option><option value="103">Ireland</option><option value="104">Israel</option><option value="105">Italy</option><option value="106">Jamaica</option><option value="107">Japan</option><option value="108">Jordan</option><option value="109">Kazakhstan</option><option value="110">Kenya</option><option value="111">Kiribati</option><option value="112">Korea, Democratic People'+'s Republic of</option><option value="113">Korea, Republic of</option><option value="114">Kuwait</option><option value="115">Kyrgyzstan</option><option value="116">Lao People'+'s Democratic Republic</option><option value="117">Latvia</option><option value="118">Lebanon</option><option value="119">Lesotho</option><option value="120">Liberia</option><option value="121">Libyan Arab Jamahiriya</option><option value="122">Liechtenstein</option><option value="123">Lithuania</option><option value="124">Luxembourg</option><option value="125">Macau</option><option value="126">Macedonia</option><option value="127">Madagascar</option><option value="128">Malawi</option><option value="129">Malaysia</option><option value="130">Maldives</option><option value="131">Mali</option><option value="132">Malta</option><option value="133">Marshall Islands</option><option value="134">Martinique</option><option value="135">Mauritania</option><option value="136">Mauritius</option><option value="137">Mayotte</option><option value="138">Mexico</option><option value="139">Micronesia, Federated States of</option><option value="140">Moldova, Republic of</option><option value="141">Monaco</option><option value="142">Mongolia</option><option value="143">Montserrat</option><option value="144">Morocco</option><option value="145">Mozambique</option><option value="146">Myanmar</option><option value="147">Namibia</option><option value="148">Nauru</option><option value="149">Nepal</option><option value="150">Netherlands</option><option value="151">Netherlands Antilles</option><option value="152">New Caledonia</option><option value="153">New Zealand</option><option value="154">Nicaragua</option><option value="155">Niger</option><option value="156">Nigeria</option><option value="157">Niue</option><option value="158">Norfolk Island</option><option value="159">Northern Mariana Islands</option><option value="160">Norway</option><option value="161">Oman</option><option value="162">Pakistan</option><option value="163">Palau</option><option value="164">Panama</option><option value="165">Papua New Guinea</option><option value="166">Paraguay</option><option value="167">Peru</option><option value="168">Philippines</option><option value="169">Pitcairn</option><option value="170">Poland</option><option value="171">Portugal</option><option value="172">Puerto Rico</option><option value="173">Qatar</option><option value="174">Reunion</option><option value="175">Romania</option><option value="176">Russian Federation</option><option value="177">Rwanda</option><option value="178">Saint Kitts and Nevis</option><option value="179">Saint Lucia</option><option value="180">Saint Vincent and the Grenadines</option><option value="181">Samoa</option><option value="182">San Marino</option><option value="183">Sao Tome and Principe</option><option value="184">Saudi Arabia</option><option value="185">Senegal</option><option value="186">Seychelles</option><option value="187">Sierra Leone</option><option value="188">Singapore</option><option value="189">Slovakia (Slovak Republic)</option><option value="190">Slovenia</option><option value="191">Solomon Islands</option><option value="192">Somalia</option><option value="193">South Africa</option><option value="194">South Georgia and the South Sandwich Islands</option><option value="195">Spain</option><option value="196">Sri Lanka</option><option value="197">St. Helena</option><option value="198">St. Pierre and Miquelon</option><option value="199">Sudan</option><option value="200">Suriname</option><option value="201">Svalbard and Jan Mayen Islands</option><option value="202">Swaziland</option><option value="203">Sweden</option><option value="204">Switzerland</option><option value="205">Syrian Arab Republic</option><option value="206">Taiwan</option><option value="207">Tajikistan</option><option value="208">Tanzania, United Republic of</option><option value="209">Thailand</option><option value="210">Togo</option><option value="211">Tokelau</option><option value="212">Tonga</option><option value="213">Trinidad and Tobago</option><option value="214">Tunisia</option><option value="215">Turkey</option><option value="216">Turkmenistan</option><option value="217">Turks and Caicos Islands</option><option value="218">Tuvalu</option><option value="219">Uganda</option><option value="220">Ukraine</option><option value="221">United Arab Emirates</option><option value="222">United Kingdom</option><option selected="selected" value="223">United States</option><option value="224">United States Minor Outlying Islands</option><option value="225">Uruguay</option><option value="226">Uzbekistan</option><option value="227">Vanuatu</option><option value="228">Vatican City State (Holy See)</option><option value="229">Venezuela</option><option value="230">Viet Nam</option><option value="231">Virgin Islands (British)</option><option value="232">Virgin Islands (U.S.)</option><option value="233">Wallis and Futuna Islands</option><option value="234">Western Sahara</option><option value="235">Yemen</option><option value="236">Yugoslavia</option><option value="237">Zaire</option><option value="238">Zambia</option><option value="239">Zimbabwe</option></select></td>'+
        '</tr>'+
        '<tr>'+
        '<td>Fax:</td><td><input type="text" name="fax" class="form-control" placeholder="Enter a Fax" id="fax" size="49" ></td><td><div style="margin-left: 20px;">Company:</div></td><td><input type="text" name="company" class="form-control" placeholder="Enter a Company" id="company" size="49" ></td>'+
        '</tr>'+
        '<tr>'+
        '<td>Address 1:</td><td><input type="text" name="address1" class="form-control" placeholder="Enter an Address" id="address1" size="49" ></td><td><div style="margin-left: 20px;">Website:</div></td><td><input type="text" name="website" class="form-control" placeholder="Enter a Website" id="website" size="49" ></td>'+
        '</tr>'+
        '<tr>'+
        '<td>Address 2:</td><td><input type="text" name="address2" class="form-control" placeholder="Enter an Address" id="address2" size="49" ></td><td><div style="margin-left: 20px;">PayPal Email:</div></td><td><input type="text" name="ppemail" class="form-control" placeholder="Enter an Email"id="ppemail" size="49" ></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required">Status</span>:</td><td><select class="form-control" id="status" style="width: 175px;"><option value="1">Active</option><option value="2">Blocked</option></select></td>'+
        '</tr>'+
        '<tr>'+
        '<td colspan="4">*Required Fields.</td>'+
        '</tr>'+
        '</table>'+
        '</form></center>';         
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default affiliate-close" data-dismiss="modal">Close</button><button id="create-affiliate" class="btn btn-primary" onclick="smhPPV.createAff();">Create</button>';
        $('#smh-modal .modal-footer').html(footer);
        
        $('#affiliate-user input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
    
        validator = $("#affiliate-user").validate({
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
                fname:{
                    required: true
                },   
                lname:{
                    required: true
                },
                email:{
                    required: true,
                    email: true
                },
                ppemail:{
                    email: true
                },
                zip:{
                    digits: true
                },
                website:{
                    url: true
                },
                status:{
                    required: true
                }
            },
            messages: {
                fname:{
                    required: "Please enter a first name"
                },
                lname:{
                    required: "Please enter a last name"
                },
                email:{
                    required: "Please enter a email",
                    email: "Please enter a valid email"
                },
                ppemail:{
                    email: "Please enter a valid email"
                },
                zip:{
                    digits: "Please enter digits only"
                },
                website:{
                    url: "Please enter a valid URL,<br>starting with http://"
                },
                status:{
                    required: "Please choose a status"
                } 
            }
        });
    },
    //Creates Affiliate
    createAff:function(){
        var valid = validator.form();
        if(valid){
            var timezone = jstz.determine();
            var tz = timezone.name();
            var pid = sessInfo.pid;
            var firstName = $("#smh-modal input#fname").val();
            var lastName = $("#smh-modal input#lname").val();
            var email = $("#smh-modal input#email").val();
            var phone = $("#smh-modal input#phone").val();
            var fax = $("#smh-modal input#fax").val();
            var address1 = $("#smh-modal input#address1").val();
            var address2 = $("#smh-modal input#address2").val();
            var city = $("#smh-modal input#city").val();
            var state = $("#smh-modal input#state").val();
            var zip = $("#smh-modal input#zip").val();
            var country = $("#smh-modal select#country option:selected").val();
            var company = $("#smh-modal input#company").val();
            var website = $("#smh-modal input#website").val();
            var ppemail = $("#smh-modal input#ppemail").val();
            var status = $('#smh-modal select#status option:selected').val();
    
            var sessData = {
                pid: pid,
                ks: sessInfo.ks,
                fname: firstName,
                lname: lastName,
                email: email,
                phone: phone,
                fax: fax,
                address1: address1,
                address2: address2,
                city: city,
                state: state,
                zip: zip,
                country: country,
                company: company,
                website: website,
                ppemail: ppemail,
                status: status,
                tz: tz
            }

            var reqUrl = ApiUrl+'action=create_affiliate';

            $.ajax({
                cache:      false,
                url:        reqUrl,
                type:       'GET',
                data:       sessData,
                dataType:   'json',
                beforeSend: function() {
                    $('#create-affiliate').attr('disabled','');
                    $('#smh-modal #loading img').css('display','inline-block');
                },
                success:function(data) {
                    if(data['error']){
                        $('#create-affiliate').removeAttr('disabled'); 
                        $('#smh-modal #loading img').css('display','none');
                        $('#smh-modal #pass-result').html('<span class="label label-danger">Error! Affiliate already exists!</span>');
                        setTimeout(function(){
                            $('#smh-modal #pass-result').empty();
                        },3000); 
                    } else { 
                        smhPPV.getAffiliates();
                        $('#smh-modal #loading img').css('display','none'); 
                        $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Created!</span>');
                        setTimeout(function(){
                            $('#smh-modal #pass-result').empty();
                            $('#smh-modal').modal('hide');
                        },3000);
                    }
                }
            }); 
        }
    },
    //Edit Affiliate Modal
    editAff:function(pid,aid,fname,lname,email,phone,fax,address1,address2,city,state,zip,country,company,website,ppemail){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','825px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close affiliate-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Affiliate</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<center><form id="affiliate-user" action="">'+
        '<table width="695px" border="0" id="affiliate_edit">'+
        '<tr>'+
        '<td><div style="width: 100px;"><span class="required">First Name</span>:</div></td><td><input type="text" name="fname" class="form-control" placeholder="Enter a First Name" id="fname" value="'+fname+'" size="49"></td><td><div style="margin-left: 20px; width: 100px;">City:</div></td><td><input type="text" name="city" class="form-control" placeholder="Enter a City" value="'+city+'" id="city" size="49"></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required">Last Name</span>:</td><td><input type="text" name="lname" class="form-control" placeholder="Enter a Last Name" id="lname" value="'+lname+'" size="49" ></td><td><div style="margin-left: 20px;">State:</div></td><td><input type="text" name="state" class="form-control" placeholder="Enter a State" id="state" value="'+state+'" size="49"></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required">Email</span>:</td><td><input type="text" name="email" class="form-control" placeholder="Enter an Email" id="email" value="'+email+'" size="49" ></td><td><div style="margin-left: 20px;">Postal Code:</div></td><td><input type="text" name="zip" class="form-control" placeholder="Enter a Zip Code" id="zip" value="'+zip+'" size="49"></td>'+
        '</tr>'+
        '<tr>'+
        '<td>Phone:</td><td><input type="text" name="phone" class="form-control" placeholder="Enter a Phone Number" id="phone" value="'+phone+'" size="49"></td><td><div style="margin-left: 20px;">Country:</div></td><td><select id="country" class="form-control" style="width: 175px;"><option value="1">Afghanistan</option><option value="2">Albania</option><option value="3">Algeria</option><option value="4">American Samoa</option><option value="5">Andorra</option><option value="6">Angola</option><option value="7">Anguilla</option><option value="8">Antarctica</option><option value="9">Antigua and Barbuda</option><option value="10">Argentina</option><option value="11">Armenia</option><option value="12">Aruba</option><option value="13">Australia</option><option value="14">Austria</option><option value="15">Azerbaijan</option><option value="16">Bahamas</option><option value="17">Bahrain</option><option value="18">Bangladesh</option><option value="19">Barbados</option><option value="20">Belarus</option><option value="21">Belgium</option><option value="22">Belize</option><option value="23">Benin</option><option value="24">Bermuda</option><option value="25">Bhutan</option><option value="26">Bolivia</option><option value="27">Bosnia and Herzegowina</option><option value="28">Botswana</option><option value="29">Bouvet Island</option><option value="30">Brazil</option><option value="31">British Indian Ocean Territory</option><option value="32">Brunei Darussalam</option><option value="33">Bulgaria</option><option value="34">Burkina Faso</option><option value="35">Burundi</option><option value="36">Cambodia</option><option value="37">Cameroon</option><option value="38">Canada</option><option value="39">Cape Verde</option><option value="40">Cayman Islands</option><option value="41">Central African Republic</option><option value="42">Chad</option><option value="43">Chile</option><option value="44">China</option><option value="45">Christmas Island</option><option value="46">Cocos (Keeling) Islands</option><option value="47">Colombia</option><option value="48">Comoros</option><option value="49">Congo</option><option value="50">Cook Islands</option><option value="51">Costa Rica</option><option value="52">Cote D'+'Ivoire</option><option value="53">Croatia</option><option value="54">Cuba</option><option value="55">Cyprus</option><option value="56">Czech Republic</option><option value="57">Denmark</option><option value="58">Djibouti</option><option value="59">Dominica</option><option value="60">Dominican Republic</option><option value="61">East Timor</option><option value="62">Ecuador</option><option value="63">Egypt</option><option value="64">El Salvador</option><option value="65">Equatorial Guinea</option><option value="66">Eritrea</option><option value="67">Estonia</option><option value="68">Ethiopia</option><option value="69">Falkland Islands (Malvinas)</option><option value="70">Faroe Islands</option><option value="71">Fiji</option><option value="72">Finland</option><option value="73">France</option><option value="74">France, Metropolitan</option><option value="75">French Guiana</option><option value="76">French Polynesia</option><option value="77">French Southern Territories</option><option value="78">Gabon</option><option value="79">Gambia</option><option value="80">Georgia</option><option value="81">Germany</option><option value="82">Ghana</option><option value="83">Gibraltar</option><option value="84">Greece</option><option value="85">Greenland</option><option value="86">Grenada</option><option value="87">Guadeloupe</option><option value="88">Guam</option><option value="89">Guatemala</option><option value="90">Guinea</option><option value="91">Guinea-bissau</option><option value="92">Guyana</option><option value="93">Haiti</option><option value="94">Heard and Mc Donald Islands</option><option value="95">Honduras</option><option value="96">Hong Kong</option><option value="97">Hungary</option><option value="98">Iceland</option><option value="99">India</option><option value="100">Indonesia</option><option value="101">Iran (Islamic Republic of)</option><option value="102">Iraq</option><option value="103">Ireland</option><option value="104">Israel</option><option value="105">Italy</option><option value="106">Jamaica</option><option value="107">Japan</option><option value="108">Jordan</option><option value="109">Kazakhstan</option><option value="110">Kenya</option><option value="111">Kiribati</option><option value="112">Korea, Democratic People'+'s Republic of</option><option value="113">Korea, Republic of</option><option value="114">Kuwait</option><option value="115">Kyrgyzstan</option><option value="116">Lao People'+'s Democratic Republic</option><option value="117">Latvia</option><option value="118">Lebanon</option><option value="119">Lesotho</option><option value="120">Liberia</option><option value="121">Libyan Arab Jamahiriya</option><option value="122">Liechtenstein</option><option value="123">Lithuania</option><option value="124">Luxembourg</option><option value="125">Macau</option><option value="126">Macedonia</option><option value="127">Madagascar</option><option value="128">Malawi</option><option value="129">Malaysia</option><option value="130">Maldives</option><option value="131">Mali</option><option value="132">Malta</option><option value="133">Marshall Islands</option><option value="134">Martinique</option><option value="135">Mauritania</option><option value="136">Mauritius</option><option value="137">Mayotte</option><option value="138">Mexico</option><option value="139">Micronesia, Federated States of</option><option value="140">Moldova, Republic of</option><option value="141">Monaco</option><option value="142">Mongolia</option><option value="143">Montserrat</option><option value="144">Morocco</option><option value="145">Mozambique</option><option value="146">Myanmar</option><option value="147">Namibia</option><option value="148">Nauru</option><option value="149">Nepal</option><option value="150">Netherlands</option><option value="151">Netherlands Antilles</option><option value="152">New Caledonia</option><option value="153">New Zealand</option><option value="154">Nicaragua</option><option value="155">Niger</option><option value="156">Nigeria</option><option value="157">Niue</option><option value="158">Norfolk Island</option><option value="159">Northern Mariana Islands</option><option value="160">Norway</option><option value="161">Oman</option><option value="162">Pakistan</option><option value="163">Palau</option><option value="164">Panama</option><option value="165">Papua New Guinea</option><option value="166">Paraguay</option><option value="167">Peru</option><option value="168">Philippines</option><option value="169">Pitcairn</option><option value="170">Poland</option><option value="171">Portugal</option><option value="172">Puerto Rico</option><option value="173">Qatar</option><option value="174">Reunion</option><option value="175">Romania</option><option value="176">Russian Federation</option><option value="177">Rwanda</option><option value="178">Saint Kitts and Nevis</option><option value="179">Saint Lucia</option><option value="180">Saint Vincent and the Grenadines</option><option value="181">Samoa</option><option value="182">San Marino</option><option value="183">Sao Tome and Principe</option><option value="184">Saudi Arabia</option><option value="185">Senegal</option><option value="186">Seychelles</option><option value="187">Sierra Leone</option><option value="188">Singapore</option><option value="189">Slovakia (Slovak Republic)</option><option value="190">Slovenia</option><option value="191">Solomon Islands</option><option value="192">Somalia</option><option value="193">South Africa</option><option value="194">South Georgia and the South Sandwich Islands</option><option value="195">Spain</option><option value="196">Sri Lanka</option><option value="197">St. Helena</option><option value="198">St. Pierre and Miquelon</option><option value="199">Sudan</option><option value="200">Suriname</option><option value="201">Svalbard and Jan Mayen Islands</option><option value="202">Swaziland</option><option value="203">Sweden</option><option value="204">Switzerland</option><option value="205">Syrian Arab Republic</option><option value="206">Taiwan</option><option value="207">Tajikistan</option><option value="208">Tanzania, United Republic of</option><option value="209">Thailand</option><option value="210">Togo</option><option value="211">Tokelau</option><option value="212">Tonga</option><option value="213">Trinidad and Tobago</option><option value="214">Tunisia</option><option value="215">Turkey</option><option value="216">Turkmenistan</option><option value="217">Turks and Caicos Islands</option><option value="218">Tuvalu</option><option value="219">Uganda</option><option value="220">Ukraine</option><option value="221">United Arab Emirates</option><option value="222">United Kingdom</option><option selected="selected" value="223">United States</option><option value="224">United States Minor Outlying Islands</option><option value="225">Uruguay</option><option value="226">Uzbekistan</option><option value="227">Vanuatu</option><option value="228">Vatican City State (Holy See)</option><option value="229">Venezuela</option><option value="230">Viet Nam</option><option value="231">Virgin Islands (British)</option><option value="232">Virgin Islands (U.S.)</option><option value="233">Wallis and Futuna Islands</option><option value="234">Western Sahara</option><option value="235">Yemen</option><option value="236">Yugoslavia</option><option value="237">Zaire</option><option value="238">Zambia</option><option value="239">Zimbabwe</option></select></td>'+
        '</tr>'+
        '<tr>'+
        '<td>Fax:</td><td><input type="text" name="fax" class="form-control" placeholder="Enter a Fax" id="fax" value="'+fax+'" size="49"></td><td><div style="margin-left: 20px;">Company:</div></td><td><input type="text" name="company" class="form-control" placeholder="Enter a Company" id="company" value="'+company+'" size="49"></td>'+
        '</tr>'+
        '<tr>'+
        '<td>Address 1:</td><td><input type="text" name="address1" class="form-control" placeholder="Enter an Address" id="address1" value="'+address1+'" size="49"></td><td><div style="margin-left: 20px;">Website:</div></td><td><input type="text" name="website" class="form-control" placeholder="Enter a Website" id="website" value="'+website+'" size="49"></td>'+
        '</tr>'+
        '<tr>'+
        '<td>Address 2:</td><td><input type="text" name="address2" class="form-control" placeholder="Enter an Address" id="address2" value="'+address2+'" size="49"></td><td><div style="margin-left: 20px;">PayPal Email:</div></td><td><input type="text" name="ppemail" class="form-control" placeholder="Enter an Email" id="ppemail" value="'+ppemail+'" size="49"></td>'+
        '</tr>'+
        '<tr>'+
        '<td colspan="4">*Required Fields.</td>'+
        '</tr>'+
        '</table>'+
        '</form></center>';         
        $('#smh-modal .modal-body').html(content);
        $("#country").val(country);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default affiliate-close" data-dismiss="modal">Close</button><button id="edit-affiliate" class="btn btn-primary" onclick="smhPPV.updateAff('+pid+','+aid+');">Update</button>';
        $('#smh-modal .modal-footer').html(footer);
        
        $('#affiliate-user input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
    
        validator = $("#affiliate-user").validate({
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
                fname:{
                    required: true
                },   
                lname:{
                    required: true
                },
                email:{
                    required: true,
                    email: true
                },
                ppemail:{
                    email: true
                },
                zip:{
                    digits: true
                },
                website:{
                    url: true
                }
            },
            messages: {
                fname:{
                    required: "Please enter a first name"
                },
                lname:{
                    required: "Please enter a last name"
                },
                email:{
                    required: "Please enter a email",
                    email: "Please enter a valid email"
                },
                ppemail:{
                    email: "Please enter a valid email"
                },
                zip:{
                    digits: "Please enter digits only"
                },
                website:{
                    url: "Please enter a valid URL,<br>starting with http://"
                } 
            }
        });
    },
    //Updates Affiliate
    updateAff:function(pid,aid){
        var valid = validator.form();
        if(valid){
            var timezone = jstz.determine();
            var tz = timezone.name();
            var firstName = $("#smh-modal input#fname").val();
            var lastName = $("#smh-modal input#lname").val();
            var email = $("#smh-modal input#email").val();
            var phone = $("#smh-modal input#phone").val();
            var fax = $("#smh-modal input#fax").val();
            var address1 = $("#smh-modal input#address1").val();
            var address2 = $("#smh-modal input#address2").val();
            var city = $("#smh-modal input#city").val();
            var state = $("#smh-modal input#state").val();
            var zip = $("#smh-modal input#zip").val();
            var country = $("#smh-modal select#country option:selected").val();
            var company = $("#smh-modal input#company").val();
            var website = $("#smh-modal input#website").val();
            var ppemail = $("#smh-modal input#ppemail").val();
    
            var sessData = {
                pid: pid,
                aid: aid,
                ks: sessInfo.ks,
                fname: firstName,
                lname: lastName,
                email: email,
                phone: phone,
                fax: fax,
                address1: address1,
                address2: address2,
                city: city,
                state: state,
                zip: zip,
                country: country,
                company: company,
                website: website,
                ppemail: ppemail,
                tz: tz
            }

            var reqUrl = ApiUrl+'action=update_affiliate';

            $.ajax({
                cache:      false,
                url:        reqUrl,
                type:       'GET',
                data:       sessData,
                dataType:   'json',
                beforeSend: function() {
                    $('#edit-affiliate').attr('disabled','');
                    $('#smh-modal #loading img').css('display','inline-block');
                },
                success:function(data) {
                    if(data['error']){
                        $('#edit-affiliate').removeAttr('disabled'); 
                        $('#smh-modal #loading img').css('display','none');
                        $('#smh-modal #pass-result').html('<span class="label label-danger">Error! Affiliate does not exist!</span>');
                        setTimeout(function(){
                            $('#smh-modal #pass-result').empty();
                        },3000); 
                    } else { 
                        smhPPV.getAffiliates();
                        $('#smh-modal #loading img').css('display','none'); 
                        $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Updated!</span>');
                        setTimeout(function(){
                            $('#smh-modal #pass-result').empty();
                            $('#smh-modal').modal('hide');
                        },3000);
                    }
                }
            });
        }
    },
    //View Commissions Modal
    affComm:function(pid,aid,name){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','980px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close edit-user-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Commissions for '+name+'</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div id='aff-comm-table'></div>";       
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default edit-user-close" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
        smhPPV.getAffComm(pid,aid); 
    },
    //Get User Commissions Table
    getAffComm:function(pid,aid){
        var timezone = jstz.determine();
        var tz = timezone.name();
        $('#aff-comm-table').empty();
        $('#aff-comm-table').html( '<table cellpadding="0" cellspacing="0" border="0" class="display content-data table-hover" id="aff-comm-data"></table>');
        $('#aff-comm-data').dataTable({
            "dom": 'R<"H"l<"refresh-wrapper">fr>t<"F"ip>',
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
            "sorting" : [[0, 'desc']],
            "paginationType": "bootstrap",
            "ajax": {
                "url": ApiUrl,
                "type": "GET",
                "data": function ( d ) {                    
                    return $.extend( {}, d, {
                        "action": "get_user_comms",
                        "pid": pid,
                        "aid": aid,
                        "ks": sessInfo.ks,
                        "tz": tz
                    } );
                }
            },
            "language": {
                "zeroRecords": "No Commissions Found"
            },
            "columns": [       
            {
                "title": "<span style='float: left;'>ID</span>"
            },
            {
                "title": "<span style='float: left;'>Status</span>"
            },
            {
                "title": "<span style='float: left;'>Customer</span>"        
            },
            {
                "title": "<span style='float: left;'>Order ID</span>"
            },
            {
                "title": "<span style='float: left;'>Order Date</span>"
            },
            {
                "title": "<span style='float: left;'>Campaign</span>"
            },
            {
                "title": "<span style='float: left;'>Commission</span>"
            },
            {
                "title": "<span style='float: left;'>Total Sale</span>"
            },
            {
                "title": "<span style='float: left;'>Actions</span>"
            }
            ],                
            "drawCallback": function () {
                smhMain.fcmcAddRows(this, 9, 10);
            }                              
        });
        $(".refresh-wrapper").html('<div style="float: right; margin-top: 3px; margin-left: 5px; margin-bottom: 5px;"><a href="#" id="refresh" onClick="smhPPV.getAffComm('+pid+','+aid+');"><i class="fa fa-refresh"></i>&nbsp;&nbsp;Refresh</a></div>');
    },
    //Updates User Commissions status
    updateUserCommsStatus:function(pid,aid,sale_id,status){
        var timezone = jstz.determine();
        var tz = timezone.name();
        var sessData = {
            pid: pid,
            ks: sessInfo.ks,
            sale_id: sale_id,
            status: status,
            tz: tz
        }

        var reqUrl = ApiUrl+'update_user_comms_status';

        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            beforeSend: function() {
                $('#smh-modal #loading img').css('display','inline-block');
            },
            success:function(data) {
                smhPPV.getAffComm(pid,aid);
                $('#smh-modal #loading img').css('display','none'); 
            }
        });
    },
    //Change Affiliate Status Modal
    statusAff:function(pid,email,name,status){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });    
        
        var status_update, status_text;
        if(status == 1){
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Block</h4>';
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to block the selected affiliate?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>("+name+")</div>";
            status_update = 2;
            status_text = 'Block';
        } else if(status == 2) {
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Unblock</h4>';
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to unblock the selected affiliate?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>("+name+")</div>";
            status_update = 1;    
            status_text = 'Unblock';
        } 
        $('.modal-header').html(header);
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button id="status-affiliate" class="btn btn-primary" onclick="smhPPV.updateAffStatus('+pid+',\''+email+'\','+status_update+')">'+status_text+'</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Update Affiliate Status
    updateAffStatus:function(pid,email,status){
        var timezone = jstz.determine();
        var tz = timezone.name();

        var sessData = {
            pid: pid,
            ks: sessInfo.ks,
            email: email,
            status: status,
            tz: tz
        }
    
        var reqUrl = ApiUrl+'action=update_affiliate_status';
   
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            beforeSend: function() {
                $('#status-affiliate').attr('disabled','');
                $('#smh-modal #loading img').css('display','inline-block');
            },
            success:function(data) {
                if(data['error']){
                    $('#status-affiliate').removeAttr('disabled'); 
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Error! Affiliate does not exist!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                    },3000); 
                } else { 
                    smhPPV.getAffiliates();
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Updated!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    },3000); 
                }
            }
        }); 
    },
    //Delete Affiliate Modal
    deleteAff:function(pid,email,name){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close edit-user-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Delete Affiliate</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to delete the selected affiliate?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>("+name+")</div>";       
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default edit-user-close" data-dismiss="modal">Close</button><button id="delete-affiliate" class="btn btn-primary" onclick="smhPPV.removeAff('+pid+',\''+email+'\')">Delete</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Removed Affiliate
    removeAff:function(pid,email){
        var timezone = jstz.determine();
        var tz = timezone.name();

        var sessData = {
            pid: pid,
            ks: sessInfo.ks,
            email: email,
            tz: tz
        }

        var reqUrl = ApiUrl+'action=delete_affiliate';
  
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            beforeSend: function() {
                $('#delete-affiliate').attr('disabled','');
                $('#smh-modal #loading img').css('display','inline-block');
            },
            success:function(data) {
                if(data['error']){
                    $('#delete-affiliate').removeAttr('disabled'); 
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Error! Affiliate does not exist!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                    },3000); 
                } else {
                    smhPPV.getAffiliates();
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
    //Add Campaign Modal
    addCampaign:function(){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','600px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close campaign-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Create Campaign</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<center><form id="affiliate-campaign" action="" style="margin-top: 10px; margin-bottom: 10px;">'+
        '<table width="510px" border="0" id="affiliate_edit">'+
        '<tr>'+
        '<td><div style="width: 130px;"><span class="required">Name</span>:</div></td><td><input type="text" name="name" class="form-control" placeholder="Enter a Name" id="name" size="49"></td>'+
        '</tr>'+
        '<tr>'+
        '<td>Description:</td><td><input type="text" name="desc" class="form-control" placeholder="Enter a Description" id="desc" size="49"></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required">Cookie Life</span>:</td><td><input type="text" style="width: 70px !important; float: left; margin-right: 5px;" name="cookie" class="form-control" placeholder="Days" id="cookie" size="49"><div style="margin-top: 7px;">Days <i data-placement="right" data-toggle="tooltip" data-delay=\'{\"show\":700, \"hide\":30}\' data-html="true" data-original-title="Lifetime of cookie in days. 0 means infinite.<br> It defines how many days<br> from the original referral your affiliate will get commission." class="fa fa-question-circle"></i></div></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required">Commission Rate</span>:</td><td><input type="text" style="width: 70px !important; float: left; margin-right: 5px;" name="comm" class="form-control" placeholder="Rate" id="comm" size="42"><select id="comm_type" class="form-control" style="width: 85px; margin-left: 5px; float: left;"><option value="1">%</option><option value="2">'+$.cookie('currency')+'</option></select> <i style="width: 100px; display: inline;" data-placement="right" data-toggle="tooltip" data-delay=\'{\"show\":700, \"hide\":30}\' data-html="true" data-original-title="The rate can be either relative (percent of a product cost)<br> or absolute (fixed amount)." class="fa fa-question-circle"></i></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required">Status</span>:</td><td><select id="status" class="form-control" style="width: 161px;"><option value="1">Active</option><option value="2">Blocked</option></select></td>'+
        '</tr>'+
        '<tr>'+
        '<td colspan="4">*Required Fields.</td>'+
        '</tr>'+
        '</table>'+
        '</form></center>';      
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default campaign-close" data-dismiss="modal">Close</button><button id="create-campaign" class="btn btn-primary" onclick="smhPPV.createCampaign();">Create</button>';
        $('#smh-modal .modal-footer').html(footer);
        
        $('#affiliate-campaign input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });

        validator = $("#affiliate-campaign").validate({
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
                name:{
                    required: true
                },   
                cookie:{
                    required: true,
                    digits: true,
                    min : 1
                },
                comm:{
                    required: true,
                    number: true,
                    min : 1
                },
                status:{
                    required: true
                }
            },
            messages: {
                name:{
                    required: "Please enter a name"
                },
                cookie:{
                    required: "Please enter a day",
                    digits: "Please enter a number",
                    min: "Must be greater than zero"
                },
                email:{
                    required: "Please enter a email"
                },
                comm:{
                    required: "Please enter a number",
                    number: "Please enter a number",
                    min: "Must be greater than zero"
                },
                status:{
                    required: "Please choose a status"
                } 
            }
        });
    },
    //Adds Campaign
    createCampaign:function(){
        var valid = validator.form();
        if(valid){
            var timezone = jstz.determine();
            var tz = timezone.name();
            var pid = sessInfo.pid;
            var name = $("#smh-modal input#name").val();
            var desc = $("#smh-modal input#desc").val();
            var cookie = $("#smh-modal input#cookie").val();
            var comm = $("#smh-modal input#comm").val();
            var comm_type = $('#smh-modal select#comm_type option:selected').val();
            var status = $('#smh-modal select#status option:selected').val();
    
            var sessData = {
                pid: pid,
                ks: sessInfo.ks,
                name: name,
                desc: desc,
                cookie: cookie,
                comm: comm,
                comm_type: comm_type,
                status: status,
                tz: tz
            }
            
            var reqUrl = ApiUrl+'action=create_campaign';
   
            $.ajax({
                cache:      false,
                url:        reqUrl,
                type:       'GET',
                data:       sessData,
                dataType:   'json',
                beforeSend: function() {
                    $('#create-campaign').attr('disabled','');
                    $('#smh-modal #loading img').css('display','inline-block');
                },
                success:function(data) {
                    if(data['error']){
                        $('#create-campaign').removeAttr('disabled'); 
                        $('#smh-modal #loading img').css('display','none'); 
                        $('#smh-modal #pass-result').html('<span class="label label-danger">Error! Campaign already exists!</span>');
                        setTimeout(function(){
                            $('#smh-modal #pass-result').empty();
                        },3000); 
                    } else { 
                        smhPPV.getCampaigns();
                        $('#smh-modal #loading img').css('display','none'); 
                        $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Created!</span>');
                        setTimeout(function(){
                            $('#smh-modal #pass-result').empty();
                            $('#smh-modal').modal('hide');
                        },3000); 
                    }
                }
            }); 
        }
    },
    //Edit Campaign Modal
    editCampaign:function(pid,cid,name,desc,cookie,flat_rate,percentage,commission){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','600px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close campaign-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Campaign</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<center><form id="affiliate-campaign" action="" style="margin-top: 10px; margin-bottom: 10px;">'+
        '<table width="510px" border="0" id="affiliate_edit">'+
        '<tr>'+
        '<td><div style="width: 130px;"><span class="required">Name</span>:</div></td><td><input type="text" name="name" class="form-control" placeholder="Enter a Name" id="name" value="'+name+'" size="49"></td>'+
        '</tr>'+
        '<tr>'+
        '<td>Description:</td><td><input type="text" name="desc" class="form-control" placeholder="Enter a Description" id="desc" value="'+desc+'" size="49"></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required">Cookie Life</span>:</td><td><input type="text" style="width: 70px !important; float: left; margin-right: 5px;" name="cookie" class="form-control" placeholder="Days" id="cookie" value="'+cookie+'" size="49"><div style="margin-top: 7px;">Days <i data-placement="right" data-toggle="tooltip" data-delay=\'{\"show\":700, \"hide\":30}\' data-html="true" data-original-title="Lifetime of cookie in days. 0 means infinite.<br> It defines how many days<br> from the original referral your affiliate will get commission." class="fa fa-question-circle"></i></div></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required">Commission Rate</span>:</td><td><input type="text" style="width: 70px !important; float: left; margin-right: 5px;" name="comm" class="form-control" placeholder="Rate" id="comm" value="'+commission+'" size="42"><select id="comm_type" class="form-control" style="width: 85px; margin-left: 5px; float: left;"><option value="1">%</option><option value="2">'+$.cookie('currency')+'</option></select> <i style="width: 100px; display: inline;" data-placement="right" data-toggle="tooltip" data-delay=\'{\"show\":700, \"hide\":30}\' data-html="true" data-original-title="The rate can be either relative (percent of a product cost)<br> or absolute (fixed amount)." class="fa fa-question-circle"></i></td>'+
        '</tr>'+
        '<tr>'+
        '<td colspan="4">*Required Fields.</td>'+
        '</tr>'+
        '</table>'+
        '</form></center>';      
        $('#smh-modal .modal-body').html(content);
        if(percentage == 1){
            $("#comm_type").val(1);
        } else if(flat_rate == 1) {
            $("#comm_type").val(2);
        }
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default campaign-close" data-dismiss="modal">Close</button><button id="edit-campaign" class="btn btn-primary" onclick="smhPPV.updateCampaign('+pid+','+cid+');">Update</button>';
        $('#smh-modal .modal-footer').html(footer);
        
        $('#affiliate-campaign input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });

        validator = $("#affiliate-campaign").validate({
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
                name:{
                    required: true
                },   
                cookie:{
                    required: true,
                    digits: true,
                    min : 1
                },
                comm:{
                    required: true,
                    number: true,
                    min : 1
                }
            },
            messages: {
                name:{
                    required: "Please enter a name"
                },
                cookie:{
                    required: "Please enter a day",
                    digits: "Please enter a number",
                    min: "Must be greater than zero"
                },
                email:{
                    required: "Please enter a email"
                },
                comm:{
                    required: "Please enter a number",
                    number: "Please enter a number",
                    min: "Must be greater than zero"
                }
            }
        });
    },
    //Update Campaign
    updateCampaign:function(pid,cid){
        var valid = validator.form();
        if(valid){
            var timezone = jstz.determine();
            var tz = timezone.name();
            var name = $("#smh-modal input#name").val();
            var desc = $("#smh-modal input#desc").val();
            var cookie = $("#smh-modal input#cookie").val();
            var comm = $("#smh-modal input#comm").val();
            var comm_type = $('#smh-modal select#comm_type option:selected').val();
    
            var sessData = {
                pid: pid,
                cid: cid,
                ks: sessInfo.ks,
                name: name,
                desc: desc,
                cookie: cookie,
                comm: comm,
                comm_type: comm_type,
                tz: tz
            }
            
            var reqUrl = ApiUrl+'action=update_campaign';
   
            $.ajax({
                cache:      false,
                url:        reqUrl,
                type:       'GET',
                data:       sessData,
                dataType:   'json',
                beforeSend: function() {
                    $('#edit-campaign').attr('disabled','');
                    $('#smh-modal #loading img').css('display','inline-block');
                },
                success:function(data) {
                    if(data['error']){
                        $('#edit-campaign').removeAttr('disabled'); 
                        $('#smh-modal #loading img').css('display','none'); 
                        $('#smh-modal #pass-result').html('<span class="label label-danger">Error! Campaign does not exists!</span>');
                        setTimeout(function(){
                            $('#smh-modal #pass-result').empty();
                        },3000); 
                    } else { 
                        smhPPV.getCampaigns();
                        $('#smh-modal #loading img').css('display','none'); 
                        $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Updated!</span>');
                        setTimeout(function(){
                            $('#smh-modal #pass-result').empty();
                            $('#smh-modal').modal('hide');
                        },3000); 
                    }
                }
            }); 
        }
    },
    //Update Campaign Status Modal
    statusCampaign:function(pid,cid,name,status){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });    
        
        var status_update, status_text;
        if(status == 1){
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Block</h4>';
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to block the selected campaign?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>("+name+")</div>";
            status_update = 2;
            status_text = 'Block';
        } else if(status == 2) {
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Unblock</h4>';
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to unblock the selected campaign?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>("+name+")</div>";
            status_update = 1;    
            status_text = 'Unblock';
        } 
        $('.modal-header').html(header);
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button id="status-campaign" class="btn btn-primary" onclick="smhPPV.updateCampaignStatus('+pid+',\''+cid+'\','+status_update+')">'+status_text+'</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Updats Campaign status
    updateCampaignStatus:function(pid,cid,status){
        var timezone = jstz.determine();
        var tz = timezone.name();

        var sessData = {
            pid: pid,
            ks: sessInfo.ks,
            cid: cid,
            status: status,
            tz: tz
        }
    
        var reqUrl = ApiUrl+'action=update_campaign_status';
   
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            beforeSend: function() {
                $('#status-campaign').attr('disabled','');
                $('#smh-modal #loading img').css('display','inline-block');
            },
            success:function(data) {
                if(data['error']){
                    $('#status-campaign').removeAttr('disabled'); 
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Error! Campaign does not exist!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                    },3000); 
                } else { 
                    smhPPV.getCampaigns();
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Updated!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    },3000); 
                }
            }
        }); 
    },
    //Delete Campaign Modal
    deleteCampaign:function(pid,cid,name){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close edit-user-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Delete Affiliate</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to delete the selected campaign?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>("+name+")</div>";       
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default edit-user-close" data-dismiss="modal">Close</button><button id="delete-campaign" class="btn btn-primary" onclick="smhPPV.removeCampaign('+pid+',\''+cid+'\')">Delete</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Remove Campaign
    removeCampaign:function(pid,cid){
        var timezone = jstz.determine();
        var tz = timezone.name();

        var sessData = {
            pid: pid,
            ks: sessInfo.ks,
            cid: cid,
            tz: tz
        }

        var reqUrl = ApiUrl+'action=delete_campaign';
  
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            beforeSend: function() {
                $('#delete-campaign').attr('disabled','');
                $('#smh-modal #loading img').css('display','inline-block');
            },
            success:function(data) {
                if(data['error']){
                    $('#delete-campaign').removeAttr('disabled'); 
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Error! Campaign does not exist!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                    },3000); 
                } else {
                    smhPPV.getCampaigns();
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
    //Add Link Modal
    addMarketing:function(){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close marketing-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Create Link</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<center><form id="affiliate-marketing" action="" style="margin-top: 10px; margin-bottom: 10px;">'+
        '<table width="410px" border="0" id="affiliate_edit">'+
        '<tr>'+
        '<td><div style="width: 100px;"><span class="required">Name</span>:</div></td><td><input type="text" name="name" class="form-control" placeholder="Enter a Name" id="name" size="49"></td>'+
        '</tr>'+
        '<tr>'+
        '<td>Description:</td><td><input type="text" name="desc" class="form-control" placeholder="Enter a Description" id="desc" size="49"></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required">Target URL</span>:</td><td><input type="text" name="url" class="form-control" placeholder="Enter a URL" id="url" size="49"></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required">Affiliate</span>:</td><td><div id="affiliates-select"></div></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required">Campaign</span>:</td><td><div id="campaigns-select"></div></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required">Status</span>:</td><td><select id="status" class="form-control" style="width: 161px;"><option value="1">Active</option><option value="2">Blocked</option></select></td>'+
        '</tr>'+
        '<tr>'+
        '<td colspan="4">*Required Fields.</td>'+
        '</tr>'+
        '</table>'+
        '</form></center>';     
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default marketing-close" data-dismiss="modal">Close</button><button id="create-link" class="btn btn-primary" onclick="smhPPV.createLink();">Create</button>';
        $('#smh-modal .modal-footer').html(footer);
        smhPPV.getMarketingData(false,null,null);
        
        $('#affiliate-marketing input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
    
        validator = $("#affiliate-marketing").validate({
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
                name:{
                    required: true
                },   
                url:{
                    required: true,
                    url: true
                },
                aid:{
                    required: true
                },
                cid:{
                    required: true
                },
                status:{
                    required: true
                }
            },
            messages: {
                name:{
                    required: "Please enter a name"
                },
                url:{
                    required: "Please enter a URL",
                    url: "Please enter a valid URL,<br>starting with http://"
                },
                aid:{
                    required: "Please choose an affiliate"
                },
                cid:{
                    required: "Please choose an campaign"
                },
                status:{
                    required: "Please choose a status"
                } 
            }
        });
    },
    //Creates Links
    createLink:function(){
        var valid = validator.form();
        if(valid){
            var timezone = jstz.determine();
            var tz = timezone.name();           
            var name = $("#smh-modal input#name").val();
            var desc = $("#smh-modal input#desc").val();
            var url = $("#smh-modal input#url").val();
            var aid = $('#smh-modal select#aid option:selected').val();
            var a_name = $('#smh-modal select#aid option:selected').text();
            var cid = $('#smh-modal select#cid option:selected').val();
            var c_name = $('#smh-modal select#cid option:selected').text();
            var status = $('#smh-modal select#status option:selected').val();
    
            var sessData = {
                pid: sessInfo.pid,
                ks: sessInfo.ks,
                name: name,
                desc: desc,
                url: url,
                aid: aid,
                a_name: a_name,
                cid: cid,
                c_name: c_name,
                status: status,
                tz: tz
            }
            
            var reqUrl = ApiUrl+'action=create_link';
   
            $.ajax({
                cache:      false,
                url:        reqUrl,
                type:       'GET',
                data:       sessData,
                dataType:   'json',
                beforeSend: function() {
                    $('#create-link').attr('disabled','');
                    $('#smh-modal #loading img').css('display','inline-block');
                },
                success:function(data) {
                    if(data['error']){
                        $('#create-link').removeAttr('disabled'); 
                        $('#smh-modal #loading img').css('display','none'); 
                        $('#smh-modal #pass-result').html('<span class="label label-danger">Error! Link already exists!</span>');
                        setTimeout(function(){
                            $('#smh-modal #pass-result').empty();
                        },3000); 
                    } else { 
                        smhPPV.getMarketing();
                        $('#smh-modal #loading img').css('display','none'); 
                        $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Created!</span>');
                        setTimeout(function(){
                            $('#smh-modal #pass-result').empty();
                            $('#smh-modal').modal('hide');
                        },3000); 
                    }
                }
            }); 
        }
    },
    //Edit Link Modal
    editLink:function(pid,mid,name,desc,url,aid,cid){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close marketing-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Edit Link</h4>';
        $('#smh-modal .modal-header').html(header);

        content = '<center><form id="affiliate-marketing" action="" style="margin-top: 10px; margin-bottom: 10px;">'+
        '<table width="410px" border="0" id="affiliate_edit">'+
        '<tr>'+
        '<td><div style="width: 100px;"><span class="required">Name</span>:</div></td><td><input type="text" name="name" class="form-control" placeholder="Enter a Name" id="name" value="'+name+'" size="49"></td>'+
        '</tr>'+
        '<tr>'+
        '<td>Description:</td><td><input type="text" name="desc" class="form-control" placeholder="Enter a Description" id="desc" value="'+desc+'" size="49"></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required">Target URL</span>:</td><td><input type="text" name="url" class="form-control" placeholder="Enter a URL" id="url" value="'+url+'" size="49"></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required">Affiliate</span>:</td><td><div id="affiliates-select"></div></td>'+
        '</tr>'+
        '<tr>'+
        '<td><span class="required">Campaign</span>:</td><td><div id="campaigns-select"></div></td>'+
        '</tr>'+
        '<tr>'+
        '<td colspan="4">*Required Fields.</td>'+
        '</tr>'+
        '</table>'+
        '</form></center>';     
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default marketing-close" data-dismiss="modal">Close</button><button id="update-link" class="btn btn-primary" onclick="smhPPV.updateLink('+pid+','+mid+');">Update</button>';
        $('#smh-modal .modal-footer').html(footer);
        smhPPV.getMarketingData(true,aid,cid);
        
        $('#affiliate-marketing input[type="text"]').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'right'
        });
    
        validator = $("#affiliate-marketing").validate({
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
                name:{
                    required: true
                },   
                url:{
                    required: true,
                    url: true
                },
                aid:{
                    required: true
                },
                cid:{
                    required: true
                }
            },
            messages: {
                name:{
                    required: "Please enter a name"
                },
                url:{
                    required: "Please enter a URL",
                    url: "Please enter a valid URL,<br>starting with http://"
                },
                aid:{
                    required: "Please choose an affiliate"
                },
                cid:{
                    required: "Please choose an campaign"
                }
            }
        });
    },
    //Update Link
    updateLink:function(pid,mid){
        var valid = validator.form();
        if(valid){
            var timezone = jstz.determine();
            var tz = timezone.name();           
            var name = $("#smh-modal input#name").val();
            var desc = $("#smh-modal input#desc").val();
            var url = $("#smh-modal input#url").val();
            var aid = $('#smh-modal select#aid option:selected').val();
            var a_name = $('#smh-modal select#aid option:selected').text();
            var cid = $('#smh-modal select#cid option:selected').val();
            var c_name = $('#smh-modal select#cid option:selected').text();
    
            var sessData = {
                pid: pid,
                mid: mid,
                ks: sessInfo.ks,
                name: name,
                desc: desc,
                url: url,
                aid: aid,
                a_name: a_name,
                cid: cid,
                c_name: c_name,
                tz: tz
            }
            
            var reqUrl = ApiUrl+'action=update_link';
   
            $.ajax({
                cache:      false,
                url:        reqUrl,
                type:       'GET',
                data:       sessData,
                dataType:   'json',
                beforeSend: function() {
                    $('#update-link').attr('disabled','');
                    $('#smh-modal #loading img').css('display','inline-block');
                },
                success:function(data) {
                    if(data['error']){
                        $('#update-link').removeAttr('disabled'); 
                        $('#smh-modal #loading img').css('display','none'); 
                        $('#smh-modal #pass-result').html('<span class="label label-danger">Error! Link does not exists!</span>');
                        setTimeout(function(){
                            $('#smh-modal #pass-result').empty();
                        },3000); 
                    } else { 
                        smhPPV.getMarketing();
                        $('#smh-modal #loading img').css('display','none'); 
                        $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Updated!</span>');
                        setTimeout(function(){
                            $('#smh-modal #pass-result').empty();
                            $('#smh-modal').modal('hide');
                        },3000); 
                    }
                }
            }); 
        }
    },
    //View Link
    viewLink:function(mid,name){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','800px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close edit-user-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Affiliate Link</h4>';
        $('#smh-modal .modal-header').html(header);

        var m_name = (name.replace(" ","_")).toLowerCase();
        content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'><div>This is the link you give to your affiliate:</div><br><textarea cols='51' rows='2' class='form-control' id='embed_code' style='width: 500px ! important; margin-left: auto; margin-right: auto;'>https://mediaplatform.streamingmediahosting.com/recommends/"+mid+"/"+m_name+".html</textarea><div id='prev-result'></div><button style='margin: 10px 0 10px 0;' class='btn btn-default' id='select-bttn'>Select Link</button></div>";       
        $('#smh-modal .modal-body').html(content);
        
        footer = '<button type="button" class="btn btn-default edit-user-close" data-dismiss="modal">Close</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Get Marketing Data
    getMarketingData:function(edit,aid,cid){
        var sessData = {
            pid: sessInfo.pid,
            ks: sessInfo.ks
        }

        var reqUrl = ApiUrl+'action=get_marketing_data';
    
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            beforeSend: function() {
                $('#affiliates-select').html('<div style="margin-left: 25px;"><img src="/img/loading.gif" height="20px" /></div>');
                $('#campaigns-select').html('<div style="margin-left: 25px;"><img src="/img/loading.gif" height="20px" /></div>');
            },
            success:function(data) {
                if(data['success']){
                    var affiliates = '';
                    var campaigns = '';

                    if(data['affiliates'] != 'no affiliates found'){
                        affiliates += '<select id="aid" class="form-control" style="width: 161px;">';
                        $.each(data['affiliates'], function(key, value) {                    
                            affiliates += '<option value="'+key+'">'+value+'</option>';
                        });
                        affiliates += '</select>';
                    } else {
                        affiliates = '<span style="color: #FF0000;">No affiliates found!</span>';
                        $('.create-link').attr('disabled','');
                    }
                
                    if(data['campaigns'] != 'no campaigns found'){
                        campaigns += '<select id="cid" class="form-control" style="width: 161px;">';
                        $.each(data['campaigns'], function(key, value) {
                            campaigns += '<option value="'+key+'">'+value+'</option>';
                        });
                        campaigns += '</select>';
                    } else {
                        campaigns = '<span style="color: #FF0000;">No campaigns found!</span>';
                        $('.create-link').attr('disabled','');
                    }
                
                    $('#affiliates-select').html(affiliates);
                    $('#campaigns-select').html(campaigns);
                    
                    if(edit){
                        $('#aid').val(aid);
                        $('#cid').val(cid);
                    }
                } 
            }
        });
    },
    //Status Marketing Modal
    statusLink:function(pid,mid,name,status){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });    
        
        var status_update, status_text;
        if(status == 1){
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Block</h4>';
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to block the selected link?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>("+name+")</div>";
            status_update = 2;
            status_text = 'Block';
        } else if(status == 2) {
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Confirm Unblock</h4>';
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to unblock the selected link?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>("+name+")</div>";
            status_update = 1;    
            status_text = 'Unblock';
        } 
        $('.modal-header').html(header);
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button id="status-link" class="btn btn-primary" onclick="smhPPV.updateLinkStatus('+pid+',\''+mid+'\','+status_update+')">'+status_text+'</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Update Link Status
    updateLinkStatus:function(pid,mid,status){
        var timezone = jstz.determine();
        var tz = timezone.name();

        var sessData = {
            pid: pid,
            ks: sessInfo.ks,
            mid: mid,
            status: status,
            tz: tz
        }
    
        var reqUrl = ApiUrl+'action=update_link_status';
   
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            beforeSend: function() {
                $('#status-link').attr('disabled','');
                $('#smh-modal #loading img').css('display','inline-block');
            },
            success:function(data) {
                if(data['error']){
                    $('#status-link').removeAttr('disabled'); 
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Error! Link does not exist!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                    },3000); 
                } else { 
                    smhPPV.getMarketing();
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Updated!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    },3000); 
                }
            }
        }); 
    },
    //Delete Link Modal
    deleteLink:function(pid,mid,name){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close edit-user-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Delete Link</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to delete the selected link?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>("+name+")</div>";       
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default edit-user-close" data-dismiss="modal">Close</button><button id="delete-link" class="btn btn-primary" onclick="smhPPV.removeLink('+pid+',\''+mid+'\')">Delete</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Remove link
    removeLink:function(pid,mid){
        var timezone = jstz.determine();
        var tz = timezone.name();

        var sessData = {
            pid: pid,
            ks: sessInfo.ks,
            mid: mid,
            tz: tz
        }

        var reqUrl = ApiUrl+'action=delete_link';
  
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            beforeSend: function() {
                $('#delete-link').attr('disabled','');
                $('#smh-modal #loading img').css('display','inline-block');
            },
            success:function(data) {
                if(data['error']){
                    $('#delete-link').removeAttr('disabled'); 
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Error! Link does not exist!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                    },3000); 
                } else {
                    smhPPV.getMarketing();
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
    //Change Commission Status Modal
    statusCommission:function(pid,sid,status){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        });    
        
        var status_update;
        if(status == 1){
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Change to Paid</h4>';
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to change this commission to paid?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>( ID #: "+sid+" )</div>";
            status_update = 2;
        } else if(status == 2) {
            header = '<button type="button" class="close smh-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Change to Unpaid</h4>';
            content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to change this commission to unpaid?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>( ID #: "+sid+" )</div>";
            status_update = 1;    
        } 
        $('.modal-header').html(header);
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button id="status-commissions" class="btn btn-primary" onclick="smhPPV.updateCommissionsStatus('+pid+',\''+sid+'\','+status_update+')">Change</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Update Commission Status
    updateCommissionsStatus:function(pid,sid,status){
        var timezone = jstz.determine();
        var tz = timezone.name();

        var sessData = {
            pid: pid,
            ks: sessInfo.ks,
            sale_id: sid,
            status: status,
            tz: tz
        }
    
        var reqUrl = ApiUrl+'action=update_user_comms_status';
   
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            beforeSend: function() {
                $('#status-commissions').attr('disabled','');
                $('#smh-modal #loading img').css('display','inline-block');
            },
            success:function(data) {
                if(data['error']){
                    $('#status-commissions').removeAttr('disabled'); 
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Error! Commission does not exist!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                    },3000); 
                } else { 
                    smhPPV.getCommissions();
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-success">Successfully Updated!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                        $('#smh-modal').modal('hide');
                    },3000); 
                }
            }
        }); 
    },
    //Delete Commissions
    deleteCommission:function(pid,sid){
        smhMain.resetModal();
        var header, content, footer;
        $('.smh-dialog').css('width','500px');
        $('#smh-modal').modal({
            backdrop: 'static'
        }); 
        
        header = '<button type="button" class="close smh-close edit-user-close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-remove"></i></span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Delete Commission</h4>';
        $('#smh-modal .modal-header').html(header);

        content = "<div style='margin-left: auto; margin-right: auto; text-align: center;'>Are you sure you want to delete the selected commission?<div><div style='margin-left: auto; margin-right: auto; text-align: center; padding: 10px;'>( ID #: "+sid+" )</div>";       
        $('#smh-modal .modal-body').html(content);
        
        footer = '<div id="pass-result"></div><div id="loading"><img height="20px" src="/img/loading.gif"></div><button type="button" class="btn btn-default edit-user-close" data-dismiss="modal">Close</button><button id="delete-commission" class="btn btn-primary" onclick="smhPPV.removeCommission('+pid+',\''+sid+'\')">Delete</button>';
        $('#smh-modal .modal-footer').html(footer);
    },
    //Remove Commissions
    removeCommission:function(pid,sid){
        var sessData = {
            pid: pid,
            ks: sessInfo.ks,
            sid: sid
        }

        var reqUrl = ApiUrl+'action=delete_commission';
  
        $.ajax({
            cache:      false,
            url:        reqUrl,
            type:       'GET',
            data:       sessData,
            dataType:   'json',
            beforeSend: function() {
                $('#delete-commission').attr('disabled','');
                $('#smh-modal #loading img').css('display','inline-block');
            },
            success:function(data) {
                if(data['error']){
                    $('#delete-commission').removeAttr('disabled'); 
                    $('#smh-modal #loading img').css('display','none'); 
                    $('#smh-modal #pass-result').html('<span class="label label-danger">Error! Commission does not exist!</span>');
                    setTimeout(function(){
                        $('#smh-modal #pass-result').empty();
                    },3000); 
                } else {
                    smhPPV.getCommissions();
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
    //Export Metadata
    exportMetaData:function(option){        
        if(option == 'affiiliates'){
            if(total_aff){
                window.location = '/apps/platform/metadata/export.metadata.php?pid='+sessInfo.pid+'&ks='+sessInfo.ks+'&page_size='+total_aff+'&action=export_ppv_affiliates_metadata';  
            } 
        } else if(option == 'campaign'){
            if(total_camp){
                window.location = '/apps/platform/metadata/export.metadata.php?pid='+sessInfo.pid+'&ks='+sessInfo.ks+'&page_size='+total_camp+'&action=export_ppv_campaigns_metadata';  
            }             
        } else if(option == 'marketing') {
            if(total_market){
                window.location = '/apps/platform/metadata/export.metadata.php?pid='+sessInfo.pid+'&ks='+sessInfo.ks+'&page_size='+total_market+'&action=export_ppv_marketing_metadata';
            }
        } else if(option == 'commissions') {
            if(total_comm){
                window.location = '/apps/platform/metadata/export.metadata.php?pid='+sessInfo.pid+'&ks='+sessInfo.ks+'&page_size='+total_comm+'&action=export_ppv_commissions_metadata';
            }
        }     
    },
    //Register all user actions
    registerActions:function(){
        $('#smh-modal').on('click', '.affiliate-close', function(){
            $('#affiliate-user input[type="text"]').tooltipster('destroy'); 
        });
        $('#smh-modal').on('click', '.campaign-close', function(){
            $('#affiliate-campaign input[type="text"]').tooltipster('destroy');
        }); 
        $('#smh-modal').on('click', '.marketing-close', function(){
            $('#affiliate-marketing input[type="text"]').tooltipster('destroy');
        });
        $('#smh-modal').on('click', '#select-bttn', function(event) {
            $('#embed_code').select();
            $('#prev-result').css({
                "display":"block",
                "margin-left":"30px",
                "margin-top":"10px",
                "margin-bottom":"10px"
            });
            $('#prev-result').html('<span class="label label-info">Press Ctrl+C to copy link (Command+C on Mac)</span>');       
        });
    }
}

// PPV on ready
$(document).ready(function(){
    smhPPV = new PPV();
    smhPPV.registerActions();
    smhPPV.getGateways();
    smhPPV.getAffiliates();
    smhPPV.getCampaigns();
    smhPPV.getMarketing();
    smhPPV.getCommissions();
});
