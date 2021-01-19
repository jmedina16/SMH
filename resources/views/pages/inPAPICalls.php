@extends('app')

@section('content')
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1><i class="fa fa-question-circle"></i> InPlayer API Calls</h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
            <li class="active">InPlayer API Calls</li>
        </ol>
    </section>
    <!-- Main content -->
    <section class="content">
        @include('alerts')
        <div class="row">
            <div class="col-md-12">
                <div id="page-header-wrapper">
                    <div id="page-header-body">
                        <div id="text">This page allows tests of the InPlayer API Calls to be run.</div>
                        <div id="icon"><i class="fa fa-comments-o"></i></div>                      
                        <div class="clear"></div>                        
                    </div>                      
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="box">
                    <div class="box-header">
                        <div class="header">API Call Results
<?php
/*
// set post fields
$post = [
    'username' => 'servata@gmail.com',
    'password' => 'Inplayer123',
    'grant_type'   => 'password',
    'client_id' => '3b39b5ab-b5fc-4ba3-b770-73155d20e61f'
];

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, 'http://staging-v2.inplayer.com/accounts/authenticate');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post);

$headers = array();

$headers[] = 'Cookie: inplayer_session=ajkr34ga8nn7a9m0bq28fk5h54';
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$result = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
} else {

  //get the decoded json array
  $authAr= json_decode($result,true);

  //store the authentication token in the session
  $access_token = $authAr['access_token'];

  //dipslay the results
  echo "<br>GH11<pre>";
  print_r(json_decode($result,true));
  echo "</pre><br>";

  //store this value in the Session
  Session::put('access_token', $access_token);
*/

  get_inp_jwt();

  //get the value from the session and display it
  $new_access_token = Session::get('access_token');

  //dipslay the results
  echo "<br>GH12<pre>";
  print_r($new_access_token);
  echo "</pre><br>";
/*
  //create a new follower account

  // set post fields
  $post2 = [
      'full_name' => 'John Follower',
      'email' => 'john@servata.com',
      'password'   => 'foobar123',
      'master_id' => '3',
      'scopes[0]' => 'inheritance',
      'methods[12]' => 'true'
  ];

  $ch2 = curl_init();

  curl_setopt($ch2, CURLOPT_URL, 'https://staging-v2.inplayer.com/accounts/merchants');
  curl_setopt($ch2, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch2, CURLOPT_POST, 1);
  curl_setopt($ch2, CURLOPT_POSTFIELDS,$post2);

  $headers = array();
  $headers[] = 'Authorization: Bearer ' .$access_token;
  //$headers[] = 'Content-Type: application/x-www-form-urlencoded';
  curl_setopt($ch2, CURLOPT_HTTPHEADER, $headers);

  $result2 = curl_exec($ch2);
  if (curl_errno($ch2)) {
      echo 'Error:' . curl_error($ch2);
  } else {

    //get the decoded json array
    $followerAr= json_decode($result2,true);

    //dipslay the results
    echo "<br>GH13<pre>";
    print_r($followerAr);
    echo "</pre><br>";

    //create an item (asset)
    
    //create an access control profile

    //create a ticket

    //display the embed code






  }



  curl_close($ch2);


}
curl_close($ch);
*/

//create an item for this follower account
//start by impersonating the follower
 













// set post fields
/*
  $post2 = [
      'item_type' => 'inplayer_asset',
      'title'   => 'Foo bar',      
      'access_control_type_id' => 1,    
      'external_asset_id' => 'eaeEa521edAx'
  ];

  $ch2 = curl_init();

  curl_setopt($ch2, CURLOPT_URL, 'https://staging-v2.inplayer.com/v2/items');
  curl_setopt($ch2, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch2, CURLOPT_POST, 1);
  curl_setopt($ch2, CURLOPT_POSTFIELDS,$post2);

  $headers = array();
  $headers[] = 'Authorization: Bearer ' .$new_access_token;
  //$headers[] = 'Content-Type: application/x-www-form-urlencoded';
  curl_setopt($ch2, CURLOPT_HTTPHEADER, $headers);

  $result2 = curl_exec($ch2);
  if (curl_errno($ch2)) {
      echo 'Error:' . curl_error($ch2);
  } else {

    //get the decoded json array
    $itemAr= json_decode($result2,true);

    //dipslay the results
    echo "<br>GH16<pre>";
    print_r($itemAr);
    echo "</pre><br>";
 }

*/

/*
$post4 = [
    'customer_id' => 51804
];

$ch4 = curl_init();

curl_setopt($ch4, CURLOPT_URL, 'https://staging-v2.inplayer.com/v2/accounts/impersonate');
curl_setopt($ch4, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch4, CURLOPT_POST, 1);
curl_setopt($ch4, CURLOPT_POSTFIELDS,$post4);

$headers = array();
$headers[] = 'Authorization: Bearer ' .$new_access_token;
$headers[] = 'Content-Type: application/x-www-form-urlencoded';
curl_setopt($ch4, CURLOPT_HTTPHEADER, $headers);

$result4 = curl_exec($ch4);
if (curl_errno($ch4)) {
    echo 'Error:' . curl_error($ch4);
} else {

  //get the decoded json array
  $impersAr= json_decode($result4,true);

  //dipslay the results
  echo "<br>GH18<pre>";
  print_r($impersAr);
  echo "</pre><br>"; 
}

*/

$post5 = [
    'sign_in_as' => 51804,
    'email' => 'john@servata.com',
    'grant_type' => 'social',
    'client_id' => '3b39b5ab-b5fc-4ba3-b770-73155d20e61f',
    'uuid' => '3b39b5ab-b5fc-4ba3-b770-73155d20e61f',
    'password' => 'Inplayer123'
];


$ch5 = curl_init();

curl_setopt($ch5, CURLOPT_URL, 'https://staging-v2.inplayer.com/accounts/impersonate');
curl_setopt($ch5, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch5, CURLOPT_POST, 1);
curl_setopt($ch5, CURLOPT_POSTFIELDS,$post5);

$headers = array();
$headers[] = 'Authorization: Bearer ' .$new_access_token;
//$headers[] = 'Content-Type: application/x-www-form-urlencoded';
curl_setopt($ch5, CURLOPT_HTTPHEADER, $headers);

$result5 = curl_exec($ch5);
if (curl_errno($ch5)) {
    echo 'Error:' . curl_error($ch5);
} else {

  //get the decoded json array
  $impersAr= json_decode($result5,true);

  //get the follower access token
  $follower_access_token = $impersAr['token'];


  //dipslay the results
  echo "<br>GH19<pre>";
  print_r($impersAr);
  echo "</pre><br>"; 

}



/*

$post2 = [
      'item_type' => 'inplayer_asset',
      'title'   => 'Foo bar',      
      'access_control_type_id' => 1,    
      'external_asset_id' => 'eaeEa521edAx'
  ];

  $ch2 = curl_init();

  curl_setopt($ch2, CURLOPT_URL, 'https://staging-v2.inplayer.com/v2/items');
  curl_setopt($ch2, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch2, CURLOPT_POST, 1);
  curl_setopt($ch2, CURLOPT_POSTFIELDS,$post2);

  $headers = array();
  $headers[] = 'Authorization: Bearer ' .$follower_access_token;
  //$headers[] = 'Content-Type: application/x-www-form-urlencoded';
  curl_setopt($ch2, CURLOPT_HTTPHEADER, $headers);

  $result2 = curl_exec($ch2);
  if (curl_errno($ch2)) {
      echo 'Error:' . curl_error($ch2);
  } else {

    //get the decoded json array
    $itemAr= json_decode($result2,true);

    //dipslay the results
    echo "<br>GH16<pre>";
    print_r($itemAr);
    echo "</pre><br>";
 }

*/
/*
$post6 = ['access_control_type_id'=>1,'item_type'=>'html_asset','content'=>'<script src="http://mediaplatform.streamingmediahosting.com/p/13980/sp/1398000/embedIframeJs/uiconf_id/6710347/partner_id/13980"></script> <div id="smh_player" style="width: 400px; height: 333px;"></div> <script> kWidget.embed({ "targetId": "smh_player", "wid": "_13980", "uiconf_id": 6710347, "flashvars": { "LeadHLSOnAndroid": true }, "params": { "wmode": "transparent" }, "cache_st": 1610139167, "entry_id": "0_3hg81dln" }); </script>','title'=>'Marija API test','metadata[preview_title]=Marija test','metadata[preview_description]=Marija test','metadata[preview_button_label]=Buy'];

$ch6 = curl_init();

curl_setopt($ch6, CURLOPT_URL, 'https://staging-v2.inplayer.com/v2/items');
curl_setopt($ch6, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch6, CURLOPT_POST, 1);
curl_setopt($ch6, CURLOPT_POSTFIELDS,$post6);

$headers = array();
$headers[] = 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjRkYjc0NWI5LTE0YmQtNDlhMy1iZjE3LTVmNDE5YjFiYzVmMyJ9.eyJhdWQiOiIzYjM5YjVhYi1iNWZjLTRiYTMtYjc3MC03MzE1NWQyMGU2MWYiLCJqdGkiOiI0ZGI3NDViOS0xNGJkLTQ5YTMtYmYxNy01ZjQxOWIxYmM1ZjMiLCJpYXQiOjE2MTAzNDk2MzksIm5iZiI6MTYxMDM0OTYzOSwiZXhwIjoxNjEyOTQ1MjM5LCJzdWIiOiJqb2huQHNlcnZhdGEuY29tIiwic2NvcGVzIjpbIioiXSwibWlkIjoxLCJhaWQiOjUxODA0LCJtdWkiOiIzYjM5YjVhYi1iNWZjLTRiYTMtYjc3MC03MzE1NWQyMGU2MWYiLCJjdHgiOlsibWVyY2hhbnQiLCJmb2xsb3dlciJdLCJ0aWQiOjUxODA0LCJ0dXVpZCI6IjRkYjc0NWI5LTE0YmQtNDlhMy1iZjE3LTVmNDE5YjFiYzVmMyIsIm9pZCI6MH0.KWz7dSvY52rpg80wyBmGCQ5UBjIemCFqmcK2ySnih4c';
//$headers[] = 'Content-Type: application/x-www-form-urlencoded';
curl_setopt($ch6, CURLOPT_HTTPHEADER, $headers);

$result6 = curl_exec($ch6);
if (curl_errno($ch6)) {
  echo 'Error:' . curl_error($ch6);
} else {

  //get the decoded json array
  $itemAr= json_decode($result6,true);

  //dipslay the results
  echo "<br>GH22<pre>";
  print_r($itemAr);
  echo "</pre><br>";
}
*/
/*
$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://staging-v2.inplayer.com/v2/items',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS => 'item_type=html_asset&title=XXMarija%20API%20test%20&access_control_type_id=1&content=%3Cscript%20src%3D%22http%3A%2F%2Fmediaplatform.streamingmediahosting.com%2Fp%2F13980%2Fsp%2F1398000%2FembedIframeJs%2Fuiconf_id%2F6710347%2Fpartner_id%2F13980%22%3E%3C%2Fscript%3E%20%3Cdiv%20id%3D%22smh_player%22%20style%3D%22width%3A%20400px%3B%20height%3A%20333px%3B%22%3E%3C%2Fdiv%3E%20%3Cscript%3E%20kWidget.embed(%7B%20%22targetId%22%3A%20%22smh_player%22%2C%20%22wid%22%3A%20%22_13980%22%2C%20%22uiconf_id%22%3A%206710347%2C%20%22flashvars%22%3A%20%7B%20%22LeadHLSOnAndroid%22%3A%20true%20%7D%2C%20%22params%22%3A%20%7B%20%22wmode%22%3A%20%22transparent%22%20%7D%2C%20%22cache_st%22%3A%201610139167%2C%20%22entry_id%22%3A%20%220_3hg81dln%22%20%7D)%3B%20%3C%2Fscript%3E&metadata%5Bpreview_title%5D=Marija%20test%20&metadata%5Bpreview_description%5D=Marija%20test%20&metadata%5Bpreview_button_label%5D=Buy',
  CURLOPT_HTTPHEADER => array(
    'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjRkYjc0NWI5LTE0YmQtNDlhMy1iZjE3LTVmNDE5YjFiYzVmMyJ9.eyJhdWQiOiIzYjM5YjVhYi1iNWZjLTRiYTMtYjc3MC03MzE1NWQyMGU2MWYiLCJqdGkiOiI0ZGI3NDViOS0xNGJkLTQ5YTMtYmYxNy01ZjQxOWIxYmM1ZjMiLCJpYXQiOjE2MTAzNDk2MzksIm5iZiI6MTYxMDM0OTYzOSwiZXhwIjoxNjEyOTQ1MjM5LCJzdWIiOiJqb2huQHNlcnZhdGEuY29tIiwic2NvcGVzIjpbIioiXSwibWlkIjoxLCJhaWQiOjUxODA0LCJtdWkiOiIzYjM5YjVhYi1iNWZjLTRiYTMtYjc3MC03MzE1NWQyMGU2MWYiLCJjdHgiOlsibWVyY2hhbnQiLCJmb2xsb3dlciJdLCJ0aWQiOjUxODA0LCJ0dXVpZCI6IjRkYjc0NWI5LTE0YmQtNDlhMy1iZjE3LTVmNDE5YjFiYzVmMyIsIm9pZCI6MH0.KWz7dSvY52rpg80wyBmGCQ5UBjIemCFqmcK2ySnih4c',
    'Content-Type: application/x-www-form-urlencoded'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;

//get the decoded json array
$itemAr= json_decode($response,true);

//dipslay the results
echo "<br>GH26<pre>";
print_r($itemAr);
echo "</pre><br>";
*/

//get item ID
$item_id = 79232;

//get the rest of the params

$access_type_id = 1;
$amount = 5;
$currency = 'USD';
$description = '5.00$ for 1 hour access';
$starts_at = '2019-11-12T11:45:26.371Z';
$expires_at = '2019-11-12T11:45:26.371Z';
$trial_period_quantity = 2;
$trial_period_period = 'hour';
$trial_period_description = '2 hour access';
$setup_fee_amount = 2;
$setup_fee_description = '3.00$ setup fee';
$country_iso = 'US';
$restriction_type = 'blacklist';

//create a URLencoded string of the params
//do a raw urlencode
$post_params = 'access_type_id=' . rawurlencode($access_type_id ) . '&';
$post_params .= 'amount=' . rawurlencode($amount ) . '&';
$post_params .= 'currency=' . rawurlencode($currency ) . '&';
$post_params .= 'description=' . rawurlencode($description ) . '&';
$post_params .= 'starts_at=' . rawurlencode($starts_at ) . '&';
$post_params .= 'expires_at=' . rawurlencode($expires_at ) . '&';
$post_params .= 'trial_period_quantity=' . rawurlencode($trial_period_quantity ) . '&';
$post_params .= 'trial_period_period=' . rawurlencode($trial_period_period ) . '&';
$post_params .= 'trial_period_description=' . rawurlencode($trial_period_description ) . '&';
$post_params .= 'setup_fee_amount=' . rawurlencode($setup_fee_amount ) . '&';
$post_params .= 'setup_fee_description=' . rawurlencode($setup_fee_description );


$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://staging-v2.inplayer.com/v2/items/' . $item_id . '/access-fees',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS => $post_params,
  CURLOPT_HTTPHEADER => array(
    'Authorization: Bearer ' . $follower_access_token,
    'Content-Type: application/x-www-form-urlencoded'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;

//get the decoded json array
$priceAr= json_decode($response,true);

//dipslay the results
echo "<br>GH30<pre>";
print_r($priceAr);
echo "</pre><br>";


?>

</div>
                    </div>
                    <div class="box-body">
                        <div id="help-buttons">
                            <div style="display: inline-block; float: left;"><button class="btn btn-block bg-olive" onclick="runAPICalls()"><i class="fa fa-plus"></i> Run the Calls</button></div>@if (Session::get("user.partnerParentId") === 0)<div style="display: inline-block; float: left; margin-left: 10px;">All API Call Results Here</div>@endif  
                        </div>                                
                        <div class="clear"></div>
                        <div id="help-table"></div>                       
                    </div>               
                </div>


            </div>
        </div>
    </section>
</div>
@stop

@section('footer')
<script src="/js/jstz.min.js?v=1" type="text/javascript"></script>
<script src="/js/help.js?v=1" type="text/javascript"></script>
@stop
