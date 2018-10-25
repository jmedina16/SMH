<?php
header("Content-type: text/css; charset: UTF-8");
print_r(Session::get("user"));
?>

.skin-blue .main-header .navbar, .skin-blue .main-header li.user-header {
background-color: #{{Session::get("user.wl_config.top_nav_bgcolor")}};
}