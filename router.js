var url = require('url');
var controller = require('./controller');
module.exports = {
    start:function(server){
        server.on('request',function(req,res){
            // res.end('23')
            var urls = url.parse(req.url,true);

            if(req.method == "DELETE"){
                // 处理ajax的删除
                controller.ajaxDel(req,res,urls.query.id)
                // 展示添加页面的处理
            }else if(urls.pathname == '/add'){
                controller.getAddHtml(req,res);
                // 处理添加用户的post请求的数据
            }else if(urls.pathname == '/ajaxAdd'){
                controller.ajaxAdd(req,res);
            }
            else if(urls.pathname == '/'){ // 首页只返回空页面
                controller.index(res);
                // 接收页面发送的ajax请求
            }else if(urls.pathname == '/getall'){
                controller.getAll(req,res);
            }else if(urls.pathname == '/getone'){
                // console.log(2);
                controller.getone(req,res,urls.query.id);
            }else if(urls.pathname == '/edituser'){
                controller.getedit(req,res,urls.query.id);
            }else if(urls.pathname == '/editpost'){
                controller.editpost(req,res,urls.query.id);
            }else if(urls.pathname == '/deluser'){
                controller.deluser(req,res,urls.query.id);
            }else{
                controller.other(req,res);
            }
        }) 
    }
}