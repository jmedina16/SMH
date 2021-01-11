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
    'client_id' => 51433,
    'uuid' => '4db745b9-14bd-49a3-bf17-5f419b1bc5f3',
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

  //dipslay the results
  echo "<br>GH19<pre>";
  print_r($impersAr);
  echo "</pre><br>"; 

}








































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
