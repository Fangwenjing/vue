<template>
    <div class="{{wrapperClass}}">
        <table class="vuetable {{tableClass}}">
            <thead>
                <tr>
                    <template v-for="field in fields">
                        <template v-if="field.visible">
                            <template v-if="isSpecialField(field.name)">
                                <th v-if="extractName(field.name) == '__checkbox'" class="{{field.titleClass || ''}}">
                                    <input type="checkbox" @change="toggleAllCheckboxes($event.target.checked, field.name)">
                                </th>
                                <th v-if="extractName(field.name) == '__component'"
                                    @click="orderBy(field, $event)"
                                    class="{{field.titleClass || ''}} {{isSortable(field) ? 'sortable' : ''}}">
                                    {{field.title || ''}}
                                    <i v-if="isCurrentSortField(field) && field.title"
                                       class="{{ sortIcon(field) }}"
                                       v-bind:style="{opacity: sortIconOpacity(field)}"></i>
                                </th>
                                <th v-if="notIn(extractName(field.name), ['__checkbox', '__component'])"
                                    id="{{field.name}}" class="{{field.titleClass || ''}}">
                                    {{field.title || ''}}
                                </th>
                            </template>
                            <template v-else>
                                <th @click="orderBy(field, $event)"
                                    id="_{{field.name}}"
                                    class="{{field.titleClass || ''}} {{isSortable(field) ? 'sortable' : ''}}">
                                    {{getTitle(field) | capitalize}}&nbsp;
                                    <i v-if="isCurrentSortField(field)" class="{{ sortIcon(field) }}" v-bind:style="{opacity: sortIconOpacity(field)}"></i>
                                </th>
                            </template>
                        </template>
                    </template>
                </tr>
            </thead>
            <tbody v-cloak>
                <template v-for="(itemNumber, item) in tableData">
                    <tr @click="onRowClicked(item, $event)" :render="onRowChanged(item)" :class="onRowClass(item, itemNumber)">
                        <template v-for="field in fields">
                            <template v-if="field.visible">
                                <template v-if="isSpecialField(field.name)">
                                    <td v-if="extractName(field.name) == '__sequence'" class="vuetable-sequence {{field.dataClass}}"
                                        v-html="tablePagination.from + itemNumber">
                                    </td>
                                    <td v-if="extractName(field.name) == '__checkbox'" class="vuetable-checkboxes {{field.dataClass}}">
                                        <input type="checkbox"
                                            @change="toggleCheckbox($event.target.checked, item, field.name)"
                                            :checked="isSelectedRow(item, field.name)">
                                    </td>
                                    <td v-if="field.name == '__actions'" class="vuetable-actions {{field.dataClass}}">
                                        <template v-for="action in itemActions">
                                            <button class="{{ action.class }}" @click="callAction(action.name, item)" v-attr="action.extra">
                                                <i class="{{ action.icon }}"></i> {{ action.label }}
                                            </button>
                                        </template>
                                    </td>
                                </template>
                                <template v-else>
                                    <td v-if="hasCallback(field)" class="{{field.dataClass}}" @click="onCellClicked(item, field, $event)" @dblclick="onCellDoubleClicked(item, field, $event)">
                                        {{{ callCallback(field, item) }}}
                                    </td>
                                    <td v-else class="{{field.dataClass}}" @click="onCellClicked(item, field, $event)" @dblclick="onCellDoubleClicked(item, field, $event)">
                                        {{{ getObjectValue(item, field.name, "") }}}
                                    </td>
                                </template>
                            </template>
                        </template>
                    </tr>
                    <template v-if="useDetailRow">
                      <template v-if="useDetailRowComponent">
                        <tr v-if="isVisibleDetailRow(item[detailRowId])"
                          @click="onDetailRowClick(item, $event)"
                          :class="[detailRowClass]"
                        >
                          <td :colspan="countVisibleFields">
                            <component :is="detailRowComponent" :row-data="item"></component>
                          </td>
                        </tr>
                      </template>
                    </template>
                </template>
            </tbody>
        </table>
        <div v-if="showPagination" class="vuetable-pagination {{paginationClass}}">
            <div class="vuetable-pagination-info {{paginationInfoClass}}"
                 v-html="paginationInfo">
            </div>
            <div v-show="tablePagination && tablePagination.last_page > 1"
                class="vuetable-pagination-component {{paginationComponentClass}}">
                <component v-ref:pagination :is="paginationComponent"></component>
            </div>
            <div class="clearfix"></div>
        </div>
    </div>
</template>

<script>
import Pagination from './pagination'

export default {
  components: {
    Pagination
  },
  props: {
    showExpand: {
      type: Boolean,
      default: false
    },
    searchFor: {
      type: String,
      default: ''
    },
    wrapperClass: {
      type: String,
      default () {
        return 'vuetable-wrapper'
      }
    },
    tableWrapper: {
      type: String,
      default () {
        return '.vuetable-wrapper'
      }
    },
    tableClass: {
      type: String,
      default () {
        return 'table table-bordered table-striped table-hover'
      }
    },
    loadingClass: {
      type: String,
      default () {
        return ''
      }
    },
    dataPath: {
      type: String,
      default () {
        return 'rows'
      }
    },
    paginationPath: {
      type: String,
      default () {
        return ''
      }
    },
    fields: {
      type: Array,
      default () {
        return []
      }
    },
    apiUrl: {
      type: String,
      required: true
    },
    sortOrder: {
      type: Array,
      default () {
        return []
      }
    },
    multiSort: {
      type: Boolean,
      default () {
        return true
      }
    },
    /*
    * physical key that will trigger multi-sort option
    * possible values: 'alt', 'ctrl', 'meta', 'shift'
    * 'ctrl' might not work as expected on Mac
    */
    multiSortKey: {
      type: String,
      default: 'alt'
    },
    perPage: {
      type: Number,
      coerce (val) {
        return parseInt(val)
      },
      default () {
        return 10
      }
    },
    ascendingIcon: {
      type: String,
      default () {
        return 'glyphicon glyphicon-chevron-up'
      }
    },
    descendingIcon: {
      type: String,
      default () {
        return 'glyphicon glyphicon-chevron-down'
      }
    },
    appendParams: {
      type: Array,
      default () {
        return []
      }
    },
    showPagination: {
      type: Boolean,
      default () {
        return true
      }
    },
    paginationComponent: {
      type: String,
      default () {
        return 'Pagination'
      }
    },
    paginationInfoTemplate: {
      type: String,
      default () {
        return '当前 {from} 到 {to}，总共 {total} 条记录'
      }
    },
    paginationInfoNoDataTemplate: {
      type: String,
      default () {
        return '没有相关的数据'
      }
    },
    paginationClass: {
      type: String,
      default () {
        return ''
      }
    },
    paginationInfoClass: {
      type: String,
      default () {
        return ''
      }
    },
    paginationComponentClass: {
      type: String,
      default () {
        return ''
      }
    },
    paginationConfig: {
      type: String,
      default () {
        return 'paginationConfig'
      }
    },
    paginationConfigCallback: {
      type: String,
      default () {
        return 'paginationConfig'
      }
    },
    itemActions: {
      type: Array,
      default () {
        return []
      }
    },
    queryParams: {
      type: Object,
      default () {
        return {
          sort: 'sort',
          page: 'offset',
          perPage: 'limit'
        }
      }
    },
    loadOnStart: {
      type: Boolean,
      default () {
        return true
      }
    },
    selectedTo: {
      type: Array,
      default () {
        return []
      }
    },
    httpOptions: {
      type: Object,
      default () {
        return {}
      }
    },
    detailRowId: {
      type: String,
      default: 'id'
    },
    detailRowClass: {
      type: String,
      default: 'vuetable-detail-row'
    },
    detailRowComponent: {
      type: String,
      default: ''
    },
    rowClassCallback: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      eventPrefix: 'vuetable:',
      tableData: null,
      tablePagination: null,
      currentPage: 1,
      visibleDetailRows: [],
      highlightFields: []
    }
  },
  directives: {
    'attr': {
      update (value) {
        for (var i in value) {
          this.el.setAttribute(i, value[i])
        }
      }
    }
  },
  computed: {
    paginationInfo () {
      if (this.tablePagination == null || this.tablePagination.total === 0) {
        return this.paginationInfoNoDataTemplate
      }
      return this.paginationInfoTemplate
        .replace('{from}', this.tablePagination.from || 0)
        .replace('{to}', this.tablePagination.to || 0)
        .replace('{total}', this.tablePagination.total || 0)
    },
    useDetailRow () {
      if (this.tableData && typeof this.tableData[0][this.detailRowId] === 'undefined') {
        console.warn('You need to define "detail-row-id" in order for detail-row feature to work!')
        return false
      }
      return this.useDetailRowComponent
    },
    useDetailRowComponent () {
      return this.detailRowComponent !== ''
    },
    countVisibleFields () {
      return this.fields.filter((field) => {
        return field.visible
      }).length
    }
  },
  methods: {
    normalizeFields () {
      var self = this
      var obj
      if (this.showExpand) {
        this.fields.unshift({
          name: 'id',
          title: '',
          dataClass: 'text-center',
          callback: 'rowExpand'
        })
      }
      this.fields.forEach((field, i) => {
        if (typeof (field) === 'string') {
          obj = {
            name: field,
            title: self.setTitle(field),
            titleClass: '',
            dataClass: '',
            callback: null,
            visible: true
          }
        } else {
          if (field.highlight) self.highlightFields.push(field.name)
          obj = {
            name: field.name,
            title: (field.title === undefined) ? self.setTitle(field.name) : field.title,
            sortField: field.sortField,
            titleClass: (field.titleClass === undefined) ? '' : field.titleClass,
            dataClass: (field.dataClass === undefined) ? '' : field.dataClass,
            callback: (field.callback === undefined) ? '' : field.callback,
            visible: (field.visible === undefined) ? true : field.visible,
            isAction: (field.isAction === undefined) ? false : field.isAction
          }
        }
        self.fields.$set(i, obj)
      })
    },
    setTitle (str) {
      if (this.isSpecialField(str)) {
        return ''
      }
      return this.titleCase(str)
    },
    titleCase (str) {
      return str.replace(/\w+/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      })
    },
    notIn (str, arr) {
      return arr.indexOf(str) === -1
    },
    setPagination () {
      this.tablePagination['current_page'] = this.currentPage
      this.tablePagination['per_page'] = this.perPage
      this.tablePagination['from'] = (this.currentPage - 1) * this.perPage + 1
      let to = this.currentPage * this.perPage
      let total = this.tablePagination.total
      this.tablePagination['to'] = to > total ? total : to
      this.tablePagination['last_page'] = total / this.perPage
    },
    loadData () {
      var self = this
      var wrapper = document.querySelector(this.tableWrapper)
      this.showLoadingAnimation(wrapper)
      var url = this.apiUrl + '?' + this.getAllQueryParams()
      this.$http.get(url, this.httpOptions)
      .then((response) => {
        self.tableData = self.getObjectValue(response.body, self.dataPath, null)
        self.tablePagination = self.getObjectValue(response.body, self.paginationPath, null)
        if (self.tablePagination === null) {
          console.warn('vuetable: pagination-path "' + self.paginationPath + '" not found. ' + 'It looks like the data returned from the sever does not have pagination information ' + 'or you may have set it incorrectly.'
          )
        }
        this.setPagination()
        self.$nextTick(() => {
          let data = response.data
          if (self.searchFor !== '') {
            let list = data.data
            for (let n in list) {
              let temp = list[n]
              for (let i in self.highlightFields) {
                let f = self.highlightFields[i]
                temp[f] = self.highlight(self.searchFor, temp[f])
              }
            }
          }
          self.broadcastEvent('load-success', self.tablePagination)
          self.hideLoadingAnimation(wrapper)
        })
      }, (response) => {
        self.dispatchEvent('load-error', response)
        // self.broadcastEvent('load-error', response)
        self.hideLoadingAnimation(wrapper)
      })
    },
    preg_quote (str) {
      return (str + '').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}=!<>|:])/g, '\\$1')
    },
    highlight (needle, haystack) {
      return haystack.replace(
        new RegExp('(' + this.preg_quote(needle) + ')', 'ig'),
          '<span class="highlight">$1</span>'
      )
    },
    getAllQueryParams () {
      var params = [
        this.queryParams.sort + '=' + this.getSortParam(),
        this.queryParams.page + '=' + (this.currentPage - 1) * this.perPage,
        this.queryParams.perPage + '=' + this.perPage
      ].join('&')
      if (this.appendParams.length > 0) {
        params += '&' + this.appendParams.join('&')
      }
      return params
    },
    showLoadingAnimation (wrapper) {
      if (wrapper !== null) {
        this.addClass(wrapper, this.loadingClass)
      }
      this.dispatchEvent('loading')
    },
    hideLoadingAnimation (wrapper) {
      if (wrapper !== null) {
        this.removeClass(wrapper, this.loadingClass)
      }
      this.dispatchEvent('loaded')
    },
    getTitle (field) {
      if (typeof field.title === 'undefined') {
        return field.name.replace('.', ' ')
      }
      return field.title
    },
    getSortParam () {
      if (!this.sortOrder || this.sortOrder.field === '') {
        return ''
      }
      let sortParam = this.$parent['getSortParam']
      if (typeof sortParam === 'function') {
        return sortParam.call(this.$parent, this.sortOrder)
      }
      return this.getDefaultSortParam()
    },
    getDefaultSortParam () {
      var result = ''
      for (var i = 0; i < this.sortOrder.length; i++) {
        var fieldName = (typeof this.sortOrder[i].sortField === 'undefined')
        ? this.sortOrder[i].field
        : this.sortOrder[i].sortField
        result += fieldName + '|' + this.sortOrder[i].direction + ((i + 1) < this.sortOrder.length ? ',' : '')
      }
      return result
    },
    addClass (el, className) {
      if (!className) return false
      if (el.classList) {
        el.classList.add(className)
      } else {
        el.className += ' ' + className
      }
    },
    removeClass (el, className) {
      if (!className) return false
      if (el.classList) {
        el.classList.remove(className)
      } else {
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
      }
    },
    dispatchEvent (eventName, args) {
      this.$dispatch(this.eventPrefix + eventName, args)
    },
    broadcastEvent (eventName, args) {
      this.$broadcast(this.eventPrefix + eventName, args)
    },
    orderBy (field, event) {
      if (!this.isSortable(field)) {
        return
      }
      var key = this.multiSortKey.toLowerCase() + 'Key'
      if (this.multiSort && event[key]) {
        // adding column to multisort
        var i = this.currentSortOrder(field)
        if (i === false) { // this field is not in the sort array yet
          this.sortOrder.push({
            field: field.name,
            direction: 'asc'
          })
        } else { // this field is in the sort array, now we change its state
          if (this.sortOrder[i].direction === 'asc') {
            // switch direction
            this.sortOrder[i].direction = 'desc'
          } else {
            // remove sort condition
            this.sortOrder.splice(i, 1)
          }
        }
      } else { // no multisort, or resetting sort
        if (this.sortOrder.length === 0) {
          this.sortOrder.push({
            field: '',
            direction: 'asc'
          })
        }
        this.sortOrder.splice(1) // removes additional columns
        if (this.sortOrder[0].field === field.name) {
          // change sort direction
          this.sortOrder[0].direction = this.sortOrder[0].direction === 'asc' ? 'desc' : 'asc'
        } else {
          // reset sort direction
          this.sortOrder[0].direction = 'asc'
        }
        this.sortOrder[0].field = field.name
        this.sortOrder[0].sortField = field.sortField
      }
      this.currentPage = 1    // reset page index
      this.loadData()
    },
    isSortable (field) {
      return !(typeof field.sortField === 'undefined')
    },
    isCurrentSortField (field) {
      return this.currentSortOrder(field) !== false
    },
    currentSortOrder (field) {
      if (!this.isSortable(field)) {
        return false
      }
      for (var i = 0; i < this.sortOrder.length; i++) {
        if (this.sortOrder[i].field === field.name) {
          return i
        }
      }
      return false
    },
    sortIcon (field) {
      var i = this.currentSortOrder(field)
      if (i !== false) {
        return this.sortOrder[i].direction === 'asc' ? this.ascendingIcon : this.descendingIcon
      } else {
        return ''
      }
    },
    sortIconOpacity (field) {
      // fields with stronger precedence have darker color
      // if there are few fields, we go down by 0.3
      // ex. 2 fields are selected: 1.0, 0.7
      // if there are more we go down evenly on the given spectrum
      // ex. 6 fields are selected: 1.0, 0.86, 0.72, 0.58, 0.44, 0.3
      var max = 1.0
      var min = 0.3
      var step = 0.3
      var count = this.sortOrder.length
      var current = this.currentSortOrder(field)
      if (max - count * step < min) {
        step = (max - min) / (count - 1)
      }
      var opacity = max - current * step
      return opacity
    },
    gotoPreviousPage () {
      if (this.currentPage > 1) {
        this.currentPage--
        this.loadData()
      }
    },
    gotoNextPage () {
      if (this.currentPage < this.tablePagination.last_page) {
        this.currentPage++
        this.loadData()
      }
    },
    gotoPage (page) {
      if (page !== this.currentPage && (page > 0 && page <= this.tablePagination.last_page)) {
        this.currentPage = page
        this.loadData()
      }
    },
    isSpecialField (fieldName) {
      // return fieldName.startsWith('__')
      return fieldName.slice(0, 2) === '__'
    },
    hasCallback (item) {
      if (item.callback) {
        return true
      } else {
        return false
      }
    },
    callCallback (field, item) {
      if (!this.hasCallback(field)) return
      var args = field.callback.split('|')
      var func = args.shift()
      let parentFunc = this.$parent[func]
      if (typeof parentFunc === 'function') {
        return (args.length > 0)
        ? parentFunc.apply(this.$parent, [this.getObjectValue(item, field.name)].concat(args))
        : parentFunc.call(this.$parent, this.getObjectValue(item, field.name))
      }
      let selfFunc = this[func]
      return selfFunc ? selfFunc(this.getObjectValue(item, field.name)) : null
    },
    getObjectValue (object, path, defaultValue) {
      defaultValue = (typeof defaultValue === 'undefined') ? null : defaultValue
      var obj = object
      if (path.trim() !== '') {
        var keys = path.split('.')
        keys.forEach((key) => {
          if (obj !== null && typeof obj[key] !== 'undefined' && obj[key] !== null) {
            obj = obj[key]
          } else {
            obj = defaultValue
            return
          }
        })
      }
      return obj
    },
    callAction (action, data) {
      this.$dispatch(this.eventPrefix + 'action', action, data)
    },
    addParam (param) {
      this.appendParams.push(param)
    },
    toggleCheckbox (isChecked, dataItem, fieldName) {
      var idColumn = this.extractArgs(fieldName)
      if (idColumn === undefined) {
        console.warn('You did not provide reference id column with "__checkbox:<column_name>" field!')
        return
      }
      if (isChecked) {
        this.selectedTo.push(dataItem[idColumn])
      } else {
        this.selectedTo.$remove(dataItem[idColumn])
      }
    },
    toggleAllCheckboxes (isChecked, fieldName) {
      var self = this
      var idColumn = this.extractArgs(fieldName)
      if (isChecked) {
        this.tableData.forEach((dataItem) => {
          if (!self.isSelectedRow(dataItem, fieldName)) {
            self.selectedTo.push(dataItem[idColumn])
          }
        })
      } else {
        this.tableData.forEach((dataItem) => {
          self.selectedTo.$remove(dataItem[idColumn])
        })
      }
    },
    isSelectedRow (dataItem, fieldName) {
      return this.selectedTo.indexOf(dataItem[this.extractArgs(fieldName)]) >= 0
    },
    extractName (string) {
      return string.split(':')[0].trim()
    },
    extractArgs (string) {
      return string.split(':')[1]
    },
    rowExpand (value) {
      var icon = this.isVisibleDetailRow(value) ? 'glyphicon glyphicon-minus-sign' : 'glyphicon glyphicon-plus-sign'
      return [
        '<a class="show-detail-row">',
        '<i class="' + icon + '"></i>',
        '</a>'
      ].join('')
    },
    isVisibleDetailRow (rowId) {
      return this.visibleDetailRows.indexOf(rowId) >= 0
    },
    showDetailRow (rowId) {
      if (!this.isVisibleDetailRow(rowId)) {
        this.visibleDetailRows.push(rowId)
      }
    },
    hideDetailRow (rowId) {
      if (this.isVisibleDetailRow(rowId)) {
        this.visibleDetailRows.$remove(rowId)
      }
    },
    toggleDetailRow (rowId) {
      if (this.isVisibleDetailRow(rowId)) {
        this.hideDetailRow(rowId)
      } else {
        this.showDetailRow(rowId)
      }
    },
    onRowClass (dataItem, index) {
      var func = this.rowClassCallback.trim()
      let parentFunc = this.$parent[func]
      if (func !== '' && typeof parentFunc === 'function') {
        return parentFunc.call(this.$parent, dataItem, index)
      }
      return ''
    },
    onRowChanged (dataItem) {
      this.dispatchEvent('row-changed', dataItem)
      return true
    },
    onRowClicked (dataItem, event) {
      this.$dispatch(this.eventPrefix + 'row-clicked', dataItem, event)
      return true
    },
    onCellClicked (dataItem, field, event) {
      this.$dispatch(this.eventPrefix + 'cell-clicked', dataItem, field, event)
      if (!field.isAction) {
        this.$emit(this.eventPrefix + 'toggle-detail', dataItem.id)
      }
    },
    onCellDoubleClicked (dataItem, field, event) {
      this.$dispatch(this.eventPrefix + 'cell-dblclicked', dataItem, field, event)
    },
    onDetailRowClick (dataItem, event) {
      this.$dispatch(this.eventPrefix + 'detail-row-clicked', dataItem, event)
    },
    callPaginationConfig () {
      let callback = this.$parent[this.paginationConfigCallback]
      if (typeof callback === 'function') {
        callback.call(this.$parent, this.$refs.pagination.$options.name)
      }
    },
    logDeprecatedMessage (name, replacer) {
      var msg = '"{name}" prop is being deprecated and will be removed in the future. Please use "{replacer}" instead.'
      console.warn(msg.replace('{name}', name).replace('{replacer}', replacer))
    },
    checkForDeprecatedProps () {
      if (this.paginationConfig !== 'paginationConfig') {
        this.logDeprecatedMessage('paginationConfig', 'paginationConfigCallback')
      }
    }
  },
  watch: {
    'multiSort' (newVal, oldVal) {
      if (newVal === false && this.sortOrder.length > 1) {
        this.sortOrder.splice(1)
        this.loadData()
      }
    },
    'perPage' (newVal, oldVal) {
      this.$emit(this.eventPrefix + 'refresh')
    }
  },
  events: {
    'vuetable-pagination:change-page' (page) {
      if (page === 'prev') {
        this.gotoPreviousPage()
      } else if (page === 'next') {
        this.gotoNextPage()
      } else {
        this.gotoPage(page)
      }
    },
    'vuetable:reload' () {
      this.loadData()
    },
    'vuetable:refresh' () {
      this.currentPage = 1
      this.loadData()
    },
    'vuetable:goto-page' (page) {
      this.$emit('vuetable-pagination:change-page', page)
    },
    'vuetable:set-options' (options) {
      for (var n in options) {
        this.$set(n, options[n])
      }
    },
    'vuetable:toggle-detail' (dataItem) {
      this.toggleDetailRow(dataItem)
    },
    'vuetable:show-detail' (dataItem) {
      this.showDetailRow(dataItem)
    },
    'vuetable:hide-detail' (dataItem) {
      this.hideDetailRow(dataItem)
    }
  },
  created () {
    this.checkForDeprecatedProps()
    this.normalizeFields()
    if (this.loadOnStart) {
      this.loadData()
    }
    this.$nextTick(() => {
      this.callPaginationConfig()
    })
  }
}
</script>

<style lang="less">
@import '../../less/vendors/bootstrap/less/mixins';

.vuetable {
    th {
        .sortable {
            &:hover {
                color: #2185d0;
                cursor: pointer;
            }
        }
    }
}

.vuetable-actions {
    width: 15%;
    padding: 12px 0px;
    text-align: center;

    & > button {
        padding: 3px 6px;
        margin-right: 4px;
    }
}

.vuetable-pagination {
    margin: 0;

    .btn {
        margin: 2px;
    }

    .pagination {
        margin: 0px !important;
        border: 1px solid rgba(34,36,38,.15);
        box-shadow: 0 1px 2px 0 rgba(34,36,38,.15);
        border-radius: 0.5em;
    }

}

.vuetable-pagination-info {
    float: left;
    margin-top: auto;
    margin-bottom: auto;
    line-height: 38px;
}

.vuetable-pagination-component {
    float: right;

    li a {
        cursor: pointer;
    }
}

[v-cloak] {
    display: none;
}

.highlight {
    background-color: yellow;
}

.vuetable-detail-row {
    height: 200px;
}

.vuetable-wrapper {
    position: relative;
    .opacity(1);

    .table {
        margin-bottom: 10px !important;
    }
}
</style>
