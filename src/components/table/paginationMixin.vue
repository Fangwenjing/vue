<script>
export default {
  props: {
    'wrapperClass': {
      type: String,
      default () {
        return 'pagination'
      }
    },
    'activeClass': {
      type: String,
      default () {
        return 'active'
      }
    },
    'disabledClass': {
      type: String,
      default () {
        return 'disabled'
      }
    },
    'pageClass': {
      type: String,
      default () {
        return 'item'
      }
    },
    'linkClass': {
      type: String,
      default () {
        return 'item'
      }
    },
    'icons': {
      type: Object,
      default () {
        return {
          first: 'icon double-left',
          prev: 'icon left',
          next: 'icon right',
          last: 'icon double-right'
        }
      }
    },
    'onEachSide': {
      type: Number,
      coerce (value) {
        return parseInt(value)
      },
      default () {
        return 2
      }
    }
  },
  data () {
    return {
      tablePagination: null
    }
  },
  computed: {
    totalPage () {
      return this.tablePagination == null ? 0 : this.tablePagination.last_page
    },
    isOnFirstPage () {
      return this.tablePagination == null ? false : this.tablePagination.current_page === 1
    },
    isOnLastPage () {
      return this.tablePagination == null ? false : this.tablePagination.current_page === this.tablePagination.last_page
    },
    notEnoughPages () {
      return this.totalPage < (this.onEachSide * 2) + 4
    },
    windowSize () {
      return this.onEachSide * 2 + 1
    },
    windowStart () {
      if (!this.tablePagination || this.tablePagination.current_page <= this.onEachSide) {
        return 1
      } else if (this.tablePagination.current_page >= (this.totalPage - this.onEachSide)) {
        return this.totalPage - this.onEachSide * 2
      }
      return this.tablePagination.current_page - this.onEachSide
    }
  },
  methods: {
    loadPage (page) {
      this.$dispatch('vuetable-pagination:change-page', page)
    },
    isCurrentPage (page) {
      return page === this.tablePagination.current_page
    }
  },
  events: {
    'vuetable:load-success' (tablePagination) {
      this.tablePagination = tablePagination
    },
    'vuetable-pagination:set-options' (options) {
      for (var n in options) {
        this.$set(n, options[n])
      }
    }
  }
}
</script>