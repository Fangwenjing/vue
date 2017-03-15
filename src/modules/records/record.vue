<template>
	<modal :show.sync="show" title="record">
		<div class='modal-body' slot='modal-body'>
			<validator name="validator">
				<form novalidate>
					<div class="form-group">
						<div class="input-group">
							<div class="input-group-addon">域名&nbsp;/&nbsp;&nbsp;IP</div>
							<input type="text" name="ip" autocomplete="off" placeholder="请填写域名或ip..." class="form-control" v-model="record.ip" v-validate:ip="['required']">
						</div>
						<div v-if="$validator.ip.required">
							<span class="text-danger">域名(或ip)是必须的。</span>
						</div>
					</div>

					<div class="form-group">
						<div class="input-group">
							<div class="input-group-addon">到期时间</div>
							<datepicker :clear-button="true" style="width: 100%" :time-str.sync="record.endTime"></datepicker>
							<input type="hidden" name="endtime" v-model="record.endTime" v-validate:endtime="['required']">
						</div>
						<div v-if="$validator.endtime.required">
							<span class="text-danger">到期时间是必须的。</span>
						</div>
					</div>

					<div class="form-group">
						<div class="input-group">
							<div class="input-group-addon">服务类型</div>
							<select class="form-control" name="appid" 
								v-validate:appid="['required']" v-model="record.appId">
								<option v-for="app in apps" value="{{app.id}}">{{app.name}}</option>
							</select>
						</div>
						<div v-if="$validator.appid.required">
							<span class="text-danger">服务类型是必须的。</span>
						</div>
					</div>

					<div class="form-group">
						<div class="input-group">
							<div class="input-group-addon">版&nbsp;本&nbsp;&nbsp;号</div>
							<input type="text" name="version" autocomplete="off" placeholder="请填写版本号..." class="form-control" v-model="record.version" v-validate:version="['required']">
						</div>
						<div v-if="$validator.version.required">
							<span class="text-danger">版本号是必须的。</span>
						</div>
					</div>
				</form>
			</validator>
		</div>
		<div slot="modal-footer" class="modal-footer">
        	<button type="button" class="btn btn-default" @click="this.show = false">取消</button>
        	<button type="button" class="btn btn-success" disabled="{{$validator.invalid}}" 
        		@click="save($validator)">保存</button>
      	</div>
	</modal>
</template>

<script>
import Modal from '../../components/modal/base.vue'
import Datepicker from '../../components/datepicker.vue'
import {getApps} from '../../vuex/actions/app'
import {saveRecord} from '../../vuex/actions/record'
import {extend} from '../../utils/lang.js'

export default {
  data () {
    return {
      record: {
        id: 0,
        ip: '',
        appId: '',
        version: '',
        endTime: ''
      },
      show: false
    }
  },
  components: {
    Modal,
    Datepicker
  },
  vuex: {
    actions: {
      getApps,
      saveRecord
    },
    getters: {
      apps: ({app}) => app.list,
      temp: ({record}) => record.item
    }
  },
  methods: {
    save ($validator) {
      if ($validator.valid) {
        this.saveRecord(this.record, this)
      }
    },
    reset () {
      this.record.id = 0
      this.record.ip = ''
      this.record.appId = ''
      this.record.version = ''
      this.record.endTime = ''
    }
  },
  events: {
    'record:add' () {
      this.reset()
      this.show = true
    },
    'record:edit' () {
      extend(this.record, this.temp)
      this.$broadcast('datapicker:set', this.temp.endTime)
      this.show = true
    }
  },
  ready () {
    this.getApps()
  }
}
</script>