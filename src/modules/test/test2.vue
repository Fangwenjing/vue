<template>
	<file-upload post-action="/goods/import"></file-upload>
</template>

<script>
import FileUpload from '../../components/fileupload.vue'

export default {
  components: {
    FileUpload
  },
  data () {
    return {}
  }
}
</script>