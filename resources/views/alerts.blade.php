@if ($status[0]['bandwidth_limit_80'] && !$status[0]['bandwidth_limit_80_ackd'] && !$status[0]['bandwidth_limit_90'] && !$status[0]['bandwidth_limit_100'] && $status[0]['bandwidth_limit'])
<div class="row">
    <div class="col-md-12">
        <div class="alert alert-warning">
            <button aria-hidden="true" data-dismiss="alert" class="close" type="button" onclick="smhMain.alertAckd('bandwidth_limit_80')"><i class="fa fa-remove"></i></button>
            <h4><i class="icon fa fa-warning"></i> Warning!</h4>
            The following service has reached <b>80%</b> it's limit: <b>Bandwidth</b>
        </div>
    </div>
</div>
@endif
@if ($status[0]['bandwidth_limit_90'] && !$status[0]['bandwidth_limit_90_ackd'] && !$status[0]['bandwidth_limit_100'] && $status[0]['bandwidth_limit'])
<div class="row">
    <div class="col-md-12">
        <div class="alert alert-warning">
            <button aria-hidden="true" data-dismiss="alert" class="close" type="button" onclick="smhMain.alertAckd('bandwidth_limit_90')"><i class="fa fa-remove"></i></button>
            <h4><i class="icon fa fa-warning"></i> Warning!</h4>
            The following service has reached <b>90%</b> it's limit: <b>Bandwidth</b>
        </div>
    </div>
</div>
@endif
@if ($status[0]['bandwidth_limit_100'] && $status[0]['bandwidth_limit'])
<div class="row">
    <div class="col-md-12">
        <div class="alert alert-danger">
            <h4><i class="icon fa fa-warning"></i> Alert!</h4>
            There has been a service disruption on your account: <b>Bandwidth Limit Reached!</b> Please contact your support department for assistance.
        </div>
    </div>
</div>
@endif
@if ($status[0]['storage_limit_80'] && !$status[0]['storage_limit_80_ackd'] && !$status[0]['storage_limit_90'] && !$status[0]['storage_limit_100'] && $status[0]['storage_limit'])
<div class="row">
    <div class="col-md-12">
        <div class="alert alert-warning">
            <button aria-hidden="true" data-dismiss="alert" class="close" type="button" onclick="smhMain.alertAckd('storage_limit_80')"><i class="fa fa-remove"></i></button>
            <h4><i class="icon fa fa-warning"></i> Warning!</h4>
            The following service has reached <b>80%</b> it's limit: <b>Storage</b>
        </div>
    </div>
</div>
@endif
@if ($status[0]['storage_limit_90'] && !$status[0]['storage_limit_90_ackd'] && !$status[0]['storage_limit_100'] && $status[0]['storage_limit'])
<div class="row">
    <div class="col-md-12">
        <div class="alert alert-warning">
            <button aria-hidden="true" data-dismiss="alert" class="close" type="button" onclick="smhMain.alertAckd('storage_limit_90')"><i class="fa fa-remove"></i></button>
            <h4><i class="icon fa fa-warning"></i> Warning!</h4>
            The following service has reached <b>90%</b> it's limit: <b>Storage</b>
        </div>
    </div>
</div>
@endif
@if ($status[0]['storage_limit_100'] && $status[0]['storage_limit'])
<div class="row">
    <div class="col-md-12">
        <div class="alert alert-danger">
            <h4><i class="icon fa fa-warning"></i> Alert!</h4>
            There has been a service disruption on your account: <b>Storage Limit Reached!</b> Please contact your support department for assistance.
        </div>
    </div>
</div>
@endif

@if ($status[0]['transcoding_limit_80'] && !$status[0]['transcoding_limit_80_ackd'] && !$status[0]['transcoding_limit_90'] && !$status[0]['transcoding_limit_100'] && $status[0]['transcoding_limit'] && (Session::get("user.trans_vod_raw") == 1))
<div class="row">
    <div class="col-md-12">
        <div class="alert alert-warning">
            <button aria-hidden="true" data-dismiss="alert" class="close" type="button" onclick="smhMain.alertAckd('transcoding_limit_80')"><i class="fa fa-remove"></i></button>
            <h4><i class="icon fa fa-warning"></i> Warning!</h4>
            The following service has reached <b>80%</b> it's limit: <b>Transcoding</b>
        </div>
    </div>
</div>
@endif
@if ($status[0]['transcoding_limit_90'] && !$status[0]['transcoding_limit_90_ackd'] && !$status[0]['transcoding_limit_100'] && $status[0]['transcoding_limit'] && (Session::get("user.trans_vod_raw") == 1))
<div class="row">
    <div class="col-md-12">
        <div class="alert alert-warning">
            <button aria-hidden="true" data-dismiss="alert" class="close" type="button" onclick="smhMain.alertAckd('transcoding_limit_90')"><i class="fa fa-remove"></i></button>
            <h4><i class="icon fa fa-warning"></i> Warning!</h4>
            The following service has reached <b>90%</b> it's limit: <b>Transcoding</b>
        </div>
    </div>
</div>
@endif
@if ($status[0]['transcoding_limit_100'] && $status[0]['transcoding_limit'] && (Session::get("user.trans_vod_raw") == 1))
<div class="row">
    <div class="col-md-12">
        <div class="alert alert-danger">
            <h4><i class="icon fa fa-warning"></i> Alert!</h4>
            There has been a service disruption on your account: <b>Transcoding Limit Reached!</b> Please contact your support department for assistance.
        </div>
    </div>
</div>
@endif