@extends('app')

@section('css')
<style>
    /*    body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            color: #B0BEC5;
            display: table;
            font-weight: 100;
            font-family: 'Lato';
        }*/

    .title {
        font-size: 30px;
        margin: 180px auto 40px;
        text-align: center;
        width: auto;
        color: #B0BEC5;
    }
</style>
@stop

@section('content')

<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Main content -->
    <section class="content">
        <div class="row">
            <div class="col-md-12">
                <div class="title">You are not authorized to access this page.</div>
            </div>
        </div>
    </section>
</div>
@stop