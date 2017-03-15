<template>
	<div class="fileupload">
		<div class="col-lg-6">
			<span class="btn btn-success btn-fileinput">
				<i class="glyphicon glyphicon-plus"></i>
				{{addText}}
				<input-file></input-file>
			</span>
			<button class="btn btn-primary" @click="uploadFiles">
				<i class="glyphicon glyphicon-upload"></i>
				{{startText}}
			</button>
			<button class="btn btn-warning" @click="cancelAll">
				<i class="glyphicon glyphicon-ban-circle"></i>
				{{cancelText}}
			</button>
		</div>
		<div class="col-lg-12 tasks">
			<ul>
				<li v-for="task in tasks">
					<div class="col-sm-2">
						{{task.name}}
					</div>
					<div class="col-sm-2">
						{{task.size | formatSize}}
					</div>
					<div class="col-sm-2 text-center">
						<div class="progress">
							<div class="progress-bar progress-bar-striped active" 
							:style="{width: task.progress + '%'}">
								<span class="sr-only">{{task.progress}}%</span>
							</div>
						</div>
					</div>
					<div class="col-sm-2">
						{{task.msg || task.res}}
					</div>
					<div class="col-sm-4">
						<button class="btn btn-primary" 
							:class="task.status == 0 ? '' : 'disabled'" 
							@click="uploadFile(task)" >
							<i class="glyphicon glyphicon-upload"></i>
							<span>{{startText}}</span>
						</button>
						<button class="btn btn-warning" 
							@click="cancel(task)">
							<i class="glyphicon glyphicon-ban-circle"></i>
							<span>{{cancelText}}</span>
						</button>
						<button v-if="task.status != 0" class="btn btn-danger" @click="del(task)">
							<i class="glyphicon glyphicon-trash"></i>
							<span>{{deleteText}}</span>
						</button>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import {extend} from '../utils/lang'

export default {
  components: {
    inputFile: {
      template: '<input type="file" :name="$parent.name" :id="$parent.id||$parent.name" :accept="$parent.accept" @change="change" :multiple="$parent.multiple && $parent.isHtml5">',
      methods: {
        change (e) {
          this.$parent.change(e)
          this.$destroy()
        }
      }
    }
  },
  props: {
    addText: {
      type: String,
      default: 'Add files...'
    },
    startText: {
      type: String,
      default: 'Start'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    deleteText: {
      type: String,
      default: 'Delete'
    },
    name: {
      type: String,
      default: 'file_upload'
    },
    accept: {
      type: String
    },
    multiple: {
      type: Boolean,
      default: true
    },
    size: {
      type: Number
    },
    extensions: {
      coerce (val) {
        if (!val) {
          return null
        }
        let temp = val.split(',').map((v) => {
          return v.trim()
        }).filter((v) => {
          return v
        })
        return new RegExp('\\.(' + temp.join('|').replace(/\./g, '\\.') + ')$', 'i')
      }
    },
    putAction: {
      type: String
    },
    postAction: {
      type: String
    },
    headers: {
      type: Object,
      default () {
        return {}
      }
    },
    timeout: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      eventPrefix: 'fileupload:',
      tasks: [],
      defaultTask: {
        xhr: null,
        iframe: null,
        file: {},
        progress: '0',
        /*
         * 0: prepare upload
         * 1: pending
         * 2: success
         *-1: cancel
         *-2: error(for example: size, extension an so on)
         *-3: timeout
         *-4: network
         */
        status: 0,
        msg: '',
        res: null
      }
    }
  },
  init () {
    let input = document.createElement('input')
    input.type = 'file'
    if (window.FormData && input.files) {
      this.isHtml5 = true
    } else {
      this.isHtml5 = false
    }
  },
  computed: {
    action () {
      if (!this.postAction) {
        console.log('Error! Require post action.')
        return null
      }
      if (this.isHtml5) {
        return this.html5Upload
      } else {
        return this.upload
      }
    }
  },
  methods: {
    clear () {
      if (this.tasks.length) {
        this.tasks = []
      }
    },
    change (e) {
      let el = e.target
      let Component = this.$options.components.inputFile
      new Component({
        parent: this,
        el: el
      })
      if (el.files) {
        let length = el.files.length
        for (let i = 0; i < length; i++) {
          let file = el.files[i]
          this.addFile(el, file)
        }
      }
    },
    addFile (ele, file) {
      if (!this.multiple) {
        this.clear()
      }
      if (!file.id) {
        file.id = Math.random().toString(36).substr(2)
      }
      let fileSize = file.size
      let fileName = file.name
      let task = extend({ele: ele, file: file, size: fileSize, name: fileName}, this.defaultTask)
      // if set the size -1, it means no limit
      if (this.size && this.size > 0 && fileSize > this.size) {
        this.taskError(task, 'file size limit exceeded')
      } else if (this.extensions && fileName.search(this.extensions) === -1) {
        this.taskError(task, 'incorrect extension')
      }
      this.tasks.push(task)
      this.uploadEvents('addFile', file)
    },
    taskAbort (task) {
      task.status = -1
      task.msg = '取消'
    },
    taskError (task, msg) {
      task.status = -2
      task.msg = msg
    },
    taskNetworkError (task) {
      task.status = -4
      task.msg = '网络故障'
    },
    taskTimeout (task) {
      task.status = -3
      task.msg = '请求超时'
    },
    taskComplete (task) {
      task.status = 2
      task.progress = '100'
    },
    taskStatus (xhr, task) {
      if (!xhr.status) {
        this.taskNetworkError(task)
      } else if (xhr.status > 500) {
        this.taskError(task, '服务不可用')
      } else if (xhr.status > 400) {
        this.taskError(task, '拒绝请求')
      } else {
        this.taskComplete(task)
      }
    },
    uploadFiles () {
      let length = this.tasks.length
      for (let i = 0; i < length; i++) {
        let task = this.tasks[i]
        if (task.status !== 0) {
          continue
        }
        this.uploadFile(task)
      }
    },
    uploadFile (task) {
      task.status = 1
      let xhr = new window.XMLHttpRequest()
      this.action(xhr, task)
    },
    cancelAll () {
      let length = this.tasks.length
      for (let i = 0; i < length; i++) {
        let task = this.tasks[i]
        if (task.status !== 1) {
          continue
        }
        this.cancel(task)
      }
    },
    cancel (task) {
      // only pending allow cancel
      if (task.status === 1) {
        if (task.xhr) {
          task.xhr.abort()
        } else if (task.iframe) {
          task.iframe.onabort({type: 'abort'})
        }
      }
    },
    del (task) {
      this.tasks.$remove(task)
    },
    uploadEvents (name, file) {
      this.$dispatch(this.eventPrefix + name, file, this)
      this.events && this.events[name] && this.events[name](file, this)
    },
    html5Upload (xhr, task) {
      let form = new window.FormData()
      form.append(this.name, task.file)
      form.append('fileName', this.name)
      xhr.open('POST', this.postAction)
      this.uploadXhr(xhr, task, form)
    },
    upload (xhr, task) {
      let self = this
      let file = task.file
      let fileId = file.id
      let iframe = document.createElement('iframe')
      iframe.id = 'upload-iframe-' + fileId
      iframe.name = 'upload-iframe-' + fileId
      iframe.src = 'about:blank'
      iframe.style.width = '1px'
      iframe.style.height = '1px'
      iframe.style.top = '-9999px'
      iframe.style.left = '-9999px'
      iframe.style.position = 'absolute'
      iframe.style.marginTop = '-9999em'
      let form = document.createElement('form')
      form.action = this.postAction
      form.name = 'upload-form-' + fileId
      form.setAttribute('method', 'POST')
      form.setAttribute('target', 'upload-iframe-' + fileId)
      form.setAttribute('enctype', 'multipart/form-data')
      form.appendChild(task.ele)
      let parameters = extend(this.headers, {'fileName': this.name})
      for (let key in parameters) {
        let input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = this.headers[key]
        form.appendChild(input)
      }

      let getDocumentData = () => {
        let doc
        try {
          if (iframe.contentWindow) {
            doc = iframe.contentWindow.document
          }
        } catch (error) {
        }
        if (!doc) {
          try {
            doc = iframe.contentDocument ? iframe.contentDocument : iframe.document
          } catch (error) {
            doc = iframe.document
          }
        }
        if (doc && doc.body) {
          return doc.body.innerHTML
        }
        return null
      }

      let removeIframe = () => {
        iframe.parentNode && iframe.parentNode.removeChild(iframe)
      }

      setTimeout(() => {
        document.body.appendChild(iframe).appendChild(form).submit()

        iframe.onload = (e) => {
          let data = getDocumentData()
          if (data === null) {
            self.taskError(task, '服务错误')
          } else {
            self.taskComplete(task)
            if (data.substr(0, 1) === '{' && data.substr(data.length - 1, 1) === '}') {
              try {
                data = JSON.parse(data)
              } catch (error) {
              }
              task.res = data
            }
          }
          self.uploadEvents('afterUpload', file)
          removeIframe()
        }

        iframe.onabort = (e) => {
          self.taskAbort(task)
        }

        iframe.onerror = (e) => {
          let data = getDocumentData()
          if (data === null) {
            self.taskNetworkError(task)
          } else {
            self.taskError(task, '拒绝请求')
          }
          removeIframe()
        }

        task.iframe = iframe
        this.uploadEvents('beforeUpload', file)
      }, 10)
    },
    uploadXhr (xhr, task, data) {
      let self = this
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
      if (this.timeout !== 0) {
        xhr.timeout = this.timeout
      }
      for (let key in this.headers) {
        xhr.setRequestHeader(key, this.headers[key])
      }

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          task.progress = e.loaded / e.total * 100
        }
      }

      xhr.onabort = (e) => {
        self.taskAbort(task)
      }

      xhr.onerror = (e) => {
        self.taskStatus(xhr, task)
      }

      xhr.onload = (e) => {
        self.taskStatus(xhr, task)
        let resText = task.res = xhr.responseText
        let contentType = xhr.getResponseHeader('/Content-Type')
        if (resText && contentType && contentType.indexOf('/json') !== -1) {
          task.res = JSON.parse(resText)
        }
        self.uploadEvents('afterUpload', task.file)
      }

      xhr.ontimeout = (e) => {
        self.taskTimeout(task)
      }
      xhr.send(data)
      task.xhr = xhr
      this.uploadEvents('beforeUpload', task.file)
    }
  }
}
</script>

<style lang="less">
@import '../less/vendors/bootstrap/less/mixins'; 

.fileupload {
	.btn-fileinput {
		position: relative;
		overflow: hidden;
		display: inline-block;

		input {
		    position: absolute;
		    width: 100%;
		    height: 100%;
		    top: 0;
		    right: 0;
		    margin: 0;
		    .opacity(0);
		    font-size: 20em;
		    cursor: pointer;
		}
	}

	.tasks {
		margin-top: 10px;
	}

	ul, li {
		padding: 0;
		margin: 0;
	}

	ul {
		li {
			list-style-type: none;
			min-height: 60px;
			line-height: 60px;
			border-top: 1px solid #ddd;

			&:nth-of-type(odd) {
				background-color: #f9f9f9;
			}

			.progress {
				margin: 20px 0 20px 0;

				.sr-only {
					width: 34px;
					height: 20px;
					margin: 0 0 0 50%;
    				left: -17px;
    				clip: auto;
    				color: #BFBDBD;
				}
			}
		}
	}

	@media(max-width: 750px) {
		.btn span {
			display: none;
		}

		ul li {
			min-height: 50px;
			line-height: 50px;
		}
	}
}
</style>