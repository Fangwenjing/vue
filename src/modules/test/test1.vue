<template>
	<div class="test row">
		<div class="col-sm-12">
			<div class="col-sm-2">
				<label>input控件</label>
			</div>
			<div class="col-sm-10">
				<custom-input :icon="'user'"></custom-input>
			</div>
		</div>
		
		<div class="col-sm-12">
			<div class="col-sm-2">
				<label>checkbox控件</label>
			</div>
			<div class="col-sm-10">
				<checkbox :disabled="true">checkbox1</checkbox>
				<checkbox>checkbox2</checkbox>
			</div>
		</div>
		
		<div class="col-sm-12">
			<div class="col-sm-2">
				<label>radio控件</label>
			</div>
			<div class="col-sm-10">
				<radio :name="'radio'" :disabled="true">radio1</radio>
				<radio :name="'radio'">radio2</radio>
			</div>
		</div>

		<div class="col-sm-12">
			<div class="col-sm-2">
				<label>日期控件</label>
			</div>
			<div class="col-sm-5">
				<datepicker :clear-button="true" :disabled-past="true"></datepicker>	
			</div>
		</div>
	</div>
	<br>

	<div class="col-sm-12">
		<label>table控件</label>
		<custom-table 
			api-url="http://vuetable.ratiw.net/api/users" 
			:show-expand="true" 
			:sort-order="sortOrder" 
			detail-row-component="detail-row"
			:item-actions="itemActions"
			:fields="fields"
			search-for="a"
		></custom-table>
	</div>

  <div class="col-sm-12">
    <label>表单验证</label>
    <validator name="validator">
      <form novalidate class="form-horizontal">
        <div class="form-group">
          <label for="username" class="col-sm-2 control-label">username</label>
          <div class="col-sm-10">
            <div v-input-line>
              <input 
                class="form-control" 
                type="text" 
                id="username" 
                name="username" 
                autocomplete="off"
                placeholder="please input your name"
                v-validate:username="['required']">
            </div>
          </div>
          <div v-if="$validator.username.required" class="col-sm-offset-2 col-sm-10 text-danger">
            required your name
          </div>
        </div>
        <div class="form-group">
          <label for="password" class="col-sm-2 control-label">password</label>
          <div class="col-sm-10">
            <div v-input-line>
              <input 
                class="form-control" 
                type="password" 
                id="password" 
                name="password" 
                autocomplete="off"
                placeholder="please input your password"
                v-validate:password="{minlength: 6}">
            </div>
          </div>
          <div v-if="$validator.password.minlength" class="col-sm-offset-2 col-sm-10 text-danger">
            at least 6 
          </div>
        </div>
        <div class="form-group">
          <div class="col-sm-offset-2 col-sm-10">
            <button disabled="{{$validator.invalid}}" type="submit" class="btn btn-default">login</button>
          </div>
        </div>
      </form>
    </validator>
  </div>
</template>

<script>
import CustomInput from '../../components/input'
import Checkbox from '../../components/checkbox'
import Radio from '../../components/radio'
import Datepicker from '../../components/datepicker'
import CustomTable from '../../components/table/index'

import register from '../../utils/register'
import DetailRow from '../detailRow'
register('detail-row', DetailRow)

export default {
  data () {
    return {
      sortOrder: [{
        field: 'name',
        direction: 'asc'
      }],
      fields: [
        {name: 'name', sortField: 'name', title: '账号', highlight: true},
        {name: 'nickname', sortField: 'nickname', title: '昵称', callback: 'allCap'},
        {name: 'gender', sortField: 'gender', title: '性别', titleClass: 'text-center', dataClass: 'text-center', callback: 'gender'},
        {name: '__actions', dataClass: 'text-center'}
      ],
      itemActions: [
        {name: 'view-item', label: '', icon: 'glyphicon glyphicon-zoom-in', class: 'btn btn-info'},
        {name: 'edit-item', label: '', icon: 'glyphicon glyphicon-pencil', class: 'btn btn-warning'},
        {name: 'delete-item', label: '', icon: 'glyphicon glyphicon-remove', class: 'btn btn-danger'}
      ]
    }
  },
  components: {
    CustomInput,
    Checkbox,
    Radio,
    Datepicker,
    CustomTable
  },
  methods: {
    allCap (value) {
      return value.toUpperCase()
    },
    gender (value) {
      return value === 'M' ? '<span class="label label-info"><i class="glyphicon glyphicon-star"></i> Male</span>' : '<span class="label label-success"><i class="glyphicon glyphicon-heart"></i> Female</span>'
    }
  },
  events: {
    'vuetable:action' (action, data) {
      /*this.alert.show = true
      this.alert.title = 'action'
      if (action === 'view-item') {
        this.alert.type = 'success'
        this.alert.msg = 'view item'
      } else if (action === 'edit-item') {
        this.alert.type = 'success'
        this.alert.msg = 'edit item'
      } else if (action === 'delete-item') {
        this.alert.type = 'warning'
        this.alert.msg = 'delete item'
        let self = this
        this.alert.okCallback = () => {
          console.log('ok callback operate')
          console.log(data)
          self.alert.type = 'success'
          self.alert.msg = 'delete success'
        }
      }*/
    }
  }
}
</script>

<style lang="less">
.test {
	&.row {
		.col-sm-12 {
			height: 35px;
			line-height: 35px;
		}
	}
}
</style>