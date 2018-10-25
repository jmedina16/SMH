<html>
    <head>
        <title>Media Platform</title>
        <meta charset="utf-8">
        <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>

        <!-- CSS -->
        <link href="/css/bootstrap.min.css?v=1" rel="stylesheet">
        <link href="/css/font-awesome.min.css?v=1" rel="stylesheet">
        <link href="/css/style.css?v=1" rel="stylesheet">
        <link href="/css/tooltipster.css?v=1" rel="stylesheet">  

    </head>
    <body style="background: #fff none repeat scroll 0 0;">

        <div class="container">
            <div class="row centered">
                <div class="col-md-4">
                    <div class="panel panel-default">
                        <div class="login-logo">
                            <b>Media Platform</b>
                        </div>
                        <div class="panel-heading"> <h3>Log In</h3></div>
                        <div class="panel-body">
                            <div id="login-result"></div>
                            <form id="login-form" novalidate="novalidate" class="form-horizontal" role="form">
                                <input type="hidden" id="_token" name="_token" value="{{ csrf_token() }}">
                                <div class="form-group has-feedback">
                                    <label for="inputEmail3" class="col-sm-3 control-label">Email</label>
                                    <div class="col-sm-9">
                                        <input class="form-control" id="email" name="email" placeholder="Enter Email" required="" type="email">
                                        <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
                                    </div>
                                </div>
                                <div class="form-group has-feedback">
                                    <label for="inputPassword3" class="col-sm-3 control-label">Password</label>
                                    <div class="col-sm-9">
                                        <input class="form-control" id="password" name="password" placeholder="Enter Password" required="" type="password">
                                        <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                                    </div>
                                </div>
                                <div class="form-group last">
                                    <div class="col-sm-offset-8 col-sm-9">
                                        <div id="loading"><img height="20px" src="/img/loading.gif"></div>
                                        <button type="button" id="login" class="btn btn-primary btn-sm">Sign in</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <!-- Scripts -->
    <script src="/js/jQuery-2.1.4.min.js?v=1" type="text/javascript"></script>
    <script src="/js/bootstrap.min.js?v=1" type="text/javascript"></script>
    <script src="/js/jquery.tooltipster.min.js?v=1" type="text/javascript"></script>
    <script src="/js/jquery.validate.min.js?v=1" type="text/javascript"></script>
    <script src="/js/login.js?v=1" type="text/javascript"></script>    
</body>
</html>
