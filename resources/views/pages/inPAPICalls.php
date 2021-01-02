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
  print_r($access_token);
  echo "</pre><br>";




}
curl_close($ch);



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
