<template>
  <div class="create">
    <button class="btn btn-success" @click="create">创建</button>
  </div>
	<custom-table 
		api-url="/record/query" 
		:show-expand="false" 
		:sort-order="sortOrder" 
		:item-actions="itemActions"
		:fields="fields"
	></custom-table>
  <record></record>
</template>

<script>
import CustomTable from '../../components/table/index'
import {getRecord, clearRecord, setRecordStatus, delRecord} from '../../vuex/actions/record'
import Record from './record.vue'

export default {
  data () {
    return {
      sortOrder: [{
        field: 'id',
        direction: 'desc'
      }],
      fields: [
        {name: 'id', sortField: 'id', title: 'id'},
        {name: 'uuid', title: '序列号', dataClass: 'uuidClass'},
        {name: 'sign', title: '授权码', dataClass: 'signClass'},
        {name: 'ip', title: 'IP地址', titleClass: 'ipClass'},
        {name: 'startTime', sortField: 'startTime', title: '开始时间', titleClass: 'timeClass'},
        {name: 'endTime', sortField: 'endTime', title: '结束时间', titleClass: 'timeClass'},
        {name: 'version', title: '版本号'},
        {name: 'status', title: '状态', titleClass: 'text-center', dataClass: 'text-center', callback: 'status'},
        {name: '__actions', dataClass: 'text-center actionClass'}
      ],
      itemActions: [
        {name: 'enable-item', label: '启用/停用', icon: 'glyphicon glyphicon-wrench', class: 'btn btn-info'},
        {name: 'edit-item', label: '编辑', icon: 'glyphicon glyphicon-pencil', class: 'btn btn-warning'},
        {name: 'delete-item', label: '删除', icon: 'glyphicon glyphicon-remove', class: 'btn btn-danger'}
      ],
      show: false
    }
  },
  components: {
    CustomTable,
    Record
  },
  methods: {
    status (value) {
      return value === 1 ? '<span class="label label-success">启用</span>' : '<span class="label label-danger">停用</span>'
    },
    create () {
      this.clearRecord(this)
    }
  },
  vuex: {
    actions: {
      getRecord: getRecord,
      clearRecord: clearRecord,
      setRecordStatus: setRecordStatus,
      delRecord: delRecord
    }
  },
  events: {
    'vuetable:action' (action, data) {
      if (action === 'enable-item') {
        this.setRecordStatus(data, this)
      } else if (action === 'edit-item') {
        this.getRecord(data, this)
      } else if (action === 'delete-item') {
        this.delRecord(data, this)
      }
    }
  }
}
</script>

<style lang="less">
.create {
  margin: 10px 0;

  .btn {
    min-width: 80px;
  }
}

.table > tbody > tr > td {
  vertical-align: middle !important;
}

.uuidClass, .signClass, .ipClass {
  width: 10%;
  word-break: break-all; 
  word-wrap: break-word;
}

.timeClass {
  width: 10%;
}

.actionClass {
  min-width: 300px;
}

</style>