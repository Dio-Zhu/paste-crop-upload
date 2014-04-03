/** 
 * js/paste_img.js 
 * upload image when onpaste via xhr from e.clipboarddata
 * gipsaliu@gmail.com
 * 2014-02-26
 *
 * todo:
 *  check POST variables
 *  error handle
 */

window.onload=function() {

    // 是否开启debug
    debug   = 0;

	function paste_img(e) {

		if ( e.clipboardData.items ) {

            // 创建图像节点，显示loading状态
            var server_img = document.createElement('img');
            server_img.setAttribute('src', './spinner.gif');
            server_img.setAttribute('id', 'image_to_crop');
            document.getElementById('editable').appendChild(server_img);

            // google-chrome 
            if (debug) {
                alert('support clipboardData.items(may be chrome ...)');
            }

            // clipboardData.items
			ele = e.clipboardData.items
            if (debug) {
                alert(ele.length);
            }
            
            // 遍历clipboardData.items
			for (var i = 0; i < ele.length; ++i) {
                if (debug) {
                    alert(ele[i].type);
                }

                // 找到file所在
				if ( ele[i].kind == 'file' && ele[i].type.indexOf('image/') !== -1 ) {

                    // 用 img_blob 存放文件内容
					 var img_blob = ele[i].getAsFile();

                    // debug_0403
					//var img_blob = ele[i].getAsString();
                    var elec = img_blob;
                    for (var key in elec) {
                        alert('key:'+key + '; value:'+elec[key]);
                    }

                    if (debug) {
                        alert(ele[i].type);
                    }

                    // 给img_blob创建一个URL
					window.URL = window.URL || window.webkitURL;
					var img_blobUrl = window.URL.createObjectURL(img_blob);
					console.log(img_blobUrl);

                    // upload the img_blob
                    if ( !window.FormData ) {
                        if (debug) {
                            alert('not support window.FormData may not upload file');
                        }
                    } else {
                        if (debug) {
                            alert('support window.FormData');
                        }
                        var formData = new FormData();
                        formData.append('file', img_blob);

                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', './receive_img.php', true);

                        xhr.onload = function() {
                            if (xhr.status === 200) {
                                if (debug) {
                                    alert(this.responseText);
                                }
                                console.log('upload success');
                                if ( this.responseText ) {
                                    server_img.setAttribute('src', this.responseText);
                                } else {
                                    server_img.setAttribute('src', '');
                                }
                                console.log(this.responseText);

                            } else {
                                console.log('upload failed');
                            }
                        }

                        xhr.send(formData);
                    }

				}

			}
		} else {
			alert('non-chrome');
		}
	}
	document.getElementById('editable').onpaste=function(){paste_img(event);return false;};
}
