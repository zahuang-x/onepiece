var fs = require('fs');
var template = require('art-template');

template.defaults.root = './'

module.exports = {

    other: function (req, res) {
        fs.readFile('.' + req.url, function (err, data) {
            if (!err) {
                res.end(data);
            } else {
                res.end('');
            }

        })
    },

    index: function (res) {
        fs.readFile('./db.json', 'utf8', function (err, json_str) {
            var json_arr = JSON.parse(json_str);
            var obj = { dt: json_arr };
            var htmls = template('./index.html', obj);
            res.end(htmls);
        })
    },

    getone: function (req, res, id) {
        fs.readFile('./db.json', 'utf8', function (err, json_str) {
            var json_arr = JSON.parse(json_str);
            var s = ''
            for (let i = 0; i < json_arr.length; i++) {
                if (id == json_arr[i].id) {
                    s = json_arr[i]
                }
            }
            var htmls = template('./user.html', { data: s });
            res.end(htmls);
        })
    },

    getedit: function (req, res, id) {
        fs.readFile('./db.json', 'utf8', function (err, json_str) {
            var json_arr = JSON.parse(json_str);
            var s = ''
            for (let i = 0; i < json_arr.length; i++) {
                if (id == json_arr[i].id) {
                    s = json_arr[i]
                }
            }
            var htmls = template('./edit.html', { data: s });
            res.end(htmls);
        })
    },


    editpost: function (req, res, id) {
        var fd = require('formidable');
        var form = new fd.IncomingForm();
        form.parse(req, function (err, filds, files) {
            // console.log(filds);
            // console.log(files);
            fs.rename(files.img.path, './img/' + files.img.name, function (err) {
                fs.readFile('./db.json', 'utf8', function (err, json_str) {
                    var json_arr = JSON.parse(json_str);
                    for (let i = 0; i < json_arr.length; i++) {
                        if (id == json_arr[i].id) {
                            json_arr[i].name = filds.name;
                            json_arr[i].nengli = filds.nengli;
                            json_arr[i].jituan = filds.jituan;
                            json_arr[i].img = '/img/' + files.img.name;
                        }
                    }
                    fs.writeFile('./db.json', JSON.stringify(json_arr), function (err) {
                        res.setHeader('Content-type', 'text/html;charset=utf-8');
                        if (!err) {
                            res.end('<script>alert("修改成功");location.href="/"</script>');
                        } else {
                            res.end('<script>alert("修改失败")</script>');
                        }
                    })
                })
            })
        })
    },

    getAddHtml: function (req, res) {
        fs.readFile('./add.html', function (err, html_data) {
            res.end(html_data);
        })
    },

    ajaxAdd: function (req, res) {
        // 利用fd接收处理post请求的数据
        var fd = require('formidable');
        var form = new fd.IncomingForm();
        // 如果文件移动跨盘符依然需要提前设置上传文件的路径
        // form.uploadDir = 'D:\\img'
        form.parse(req, function (err, filds, files) {
            // console.log(filds); // 表单数据
            // console.log(files); // 上传文件的数据 
            // 需要将上传后的文件移动到指定目录
            fs.rename(files.img.path, './img/' + files.img.name, function (err) {
                // 获取json数据进行解析
                fs.readFile('./db.json', 'utf8', function (err, json_str) {
                    var json_arr = JSON.parse(json_str);
                    // 组装新数据
                    // id 获取数组中最后一个元素的id+1,就是新数组的id值
                    filds.id = json_arr[json_arr.length - 1].id + 1;
                    // 将已经移动好的图片地址加到新数据里面
                    filds.img = '/img/' + files.img.name;
                    // 将新数据加入数组中
                    json_arr.push(filds);

                    // 将数组重新转为字符串写入josn文件
                    fs.writeFile('./db.json', JSON.stringify(json_arr), function (err) {
                        if (!err) {
                            // 返回提示信息
                            res.end('1');
                        } else {
                            res.end('0');
                        }
                    })
                })
            })
        })
    },


    deluser: function (req, res, id) {
        fs.readFile('./db.json', 'utf8', function (err, json_str) {
            var json_arr = JSON.parse(json_str);
            var arr = [];
            for (let i = 0; i < json_arr.length; i++) {
                if (json_arr[i].id != id) {
                    arr.push(json_arr[i])
                }
            }
            fs.writeFile('./db.json', JSON.stringify(arr), function (err) {
                res.setHeader('Content-type', 'text/html;charset=utf-8');
                if (!err) {
                    res.end('<script>alert("删除成功");location.href="/"</script>');
                } else {
                    res.end('<script>alert("删除失败");location.href="/"</script>');

                }
            })
        })
    }

}