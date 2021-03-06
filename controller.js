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
                            res.end('<script>alert("????????????");location.href="/"</script>');
                        } else {
                            res.end('<script>alert("????????????")</script>');
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
        // ??????fd????????????post???????????????
        var fd = require('formidable');
        var form = new fd.IncomingForm();
        // ????????????????????????????????????????????????????????????????????????
        // form.uploadDir = 'D:\\img'
        form.parse(req, function (err, filds, files) {
            // console.log(filds); // ????????????
            // console.log(files); // ????????????????????? 
            // ????????????????????????????????????????????????
            fs.rename(files.img.path, './img/' + files.img.name, function (err) {
                // ??????json??????????????????
                fs.readFile('./db.json', 'utf8', function (err, json_str) {
                    var json_arr = JSON.parse(json_str);
                    // ???????????????
                    // id ????????????????????????????????????id+1,??????????????????id???
                    filds.id = json_arr[json_arr.length - 1].id + 1;
                    // ??????????????????????????????????????????????????????
                    filds.img = '/img/' + files.img.name;
                    // ???????????????????????????
                    json_arr.push(filds);

                    // ????????????????????????????????????josn??????
                    fs.writeFile('./db.json', JSON.stringify(json_arr), function (err) {
                        if (!err) {
                            // ??????????????????
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
                    res.end('<script>alert("????????????");location.href="/"</script>');
                } else {
                    res.end('<script>alert("????????????");location.href="/"</script>');
                }
            })
        })
    }

}