<template>
  <div>
    <el-upload
      :file-list="fileList"
      action=""
      list-type="picture-card"
      :limit="1"
      :on-preview="preview"
      :on-remove="remove"
      :class="{ disabled: showIcon }"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-progress
      v-if="showPercent"
      :percentage="percentage"
      style="width: 170px"
    ></el-progress>
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img width="100%" :src="imgUrl" alt="" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import Cos from 'cos-js-sdk-v5'
var cos = new Cos({
  SecretId: 'AKIDlLiqjNlvrXy94lCNJzPaVBcnlVzEDxSh',
  SecretKey: '2oKaaLq55pLbcNuCF2ZrtgDUWIp8C0Yr'
})
export default {
  data () {
    return {
      showPercent: false,
      percentage: 0,
      currentFileUid: '',
      fileList: [], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: ''
    }
  },

  computed: {
    showIcon () {
      return this.fileList.length === 1
    }
  },

  methods: {
    upload (params) {
      console.log(params)
      if (params.file) {
        cos.putObject({
          Bucket: 'photo-1313051656', /* 填入您自己的存储桶，必须字段 */
          Region: 'ap-guangzhou', /* 存储桶所在地域，例如ap-beijing，必须字段 */
          Key: params.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
          StorageClass: 'STANDARD',
          Body: params.file, // 上传文件对象
          onProgress: params => {
            this.percentage = params.percent * 100
          }
        }, (err, data) => {
          if (!err && data.statusCode === 200) {
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentFileUid) {
                return { url: 'http://' + data.Location, upload: true }
              }

              return item
            })
            this.showPercent = false // 隐藏进度条
            this.percentage = 0 // 进度归0
          }
        })
      }
    },

    beforeUpload (file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024

      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.showPercent = true
      this.currentFileUid = file.uid
      return true
    },

    changeFile (file, fileList) {
      // console.log(file, fileList)
      this.fileList = fileList.map(item => item)
    },

    remove (file) {
      // console.log(file)
      // console.log(fileList)

      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },

    preview (file) {
      // console.log(file)
      this.imgUrl = file.url
      this.showDialog = true
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
