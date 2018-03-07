<style>

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Source Sans Pro', sans-serif;
  }

  .main {
    width: 96%;
    margin: 0 2%;
  }

  .label {
    font-size: 16px;
    color: #0073ed;
    cursor: pointer;
    width: 200px;
    height: 35px;
    line-height: 35px;
    margin: 20px auto;
    display: block;
    outline: none;
    text-align: center;
    border: 1px solid #8cc4f0;
  }

  .tip {
    position: absolute;
    width: 100%;
    top: 0;
    height: 75px;
    line-height: 75px;
    text-align: center;
    background: #ffffff;
    color: #ed4835;
  }

  #invoice {
    width: 0;
    height: 0;
    outline: none;
  }

  table {
    display: block;
    overflow: auto;
    word-break: normal;
    border-collapse: collapse;
    border-spacing: 0;
  }

  table tr {
    background-color: #fff;
    border-top: 1px solid #ccc;
  }

  table th, table td {
    padding: 6px 13px;
    border: 1px solid #ddd;
  }

  table th {
    font-weight: bold;
    background: #f0f0f0;
    color: #333;
  }
</style>
<template>
  <div id="wrapper">
    <div class="main">
      <label class="label" for="invoice">
        <input id="invoice" type="file" name="invoice" accept="image/png,image/jpeg" @change="readInvoice">
        +上传发票
      </label>
      <div v-if="fileMsg" class="tip">{{fileMsg}}</div>
      <table border="0">
        <tr>
          <th>车牌号</th>
          <th>开票日期</th>
          <th>通行日期起</th>
          <th>通行日期止</th>
          <th>发票代码</th>
          <th>发票号码</th>
          <th>购方名称</th>
          <th>销方名称</th>
          <th>未税金额</th>
          <th>进项税额</th>
          <th>价税合计</th>
          <th>税率</th>
        </tr>
        <tr v-for="row in rows">
          <td>{{row.license}}</td>
          <td>{{row.billingDate}}</td>
          <td>{{row.travelDate1}}</td>
          <td>{{row.travelDate2}}</td>
          <td>{{row.invoiceCode}}</td>
          <td>{{row.invoiceNumber}}</td>
          <td>{{row.buyName}}</td>
          <td>{{row.saleName}}</td>
          <td>{{row.notTax}}</td>
          <td>{{row.income}}</td>
          <td>{{row.total}}</td>
          <td>{{row.taxRate}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import fs from 'fs'
  import baiduApi from 'baidu-aip-sdk'
  let AipOcrClient = baiduApi.ocr

  export default {
    data () {
      return {
        fileMsg: '',
        rows: []
      }
    },
    created () {
      // /Users/roy/Downloads/zzsfp.jpg
    },
    methods: {
      readInvoice () {
        let file = document.querySelector('#invoice').files[0]
        if (file) {
          this.fileMsg = '正在读取发票...'
          console.log(file.path)
          let image = fs.readFileSync(file.path).toString("base64")
          this.fileMsg = '正在解析发票...'
          let stream = fs.createReadStream(file.path);

          let client = new AipOcrClient(10873910, 'MEmamWlWBsfOI9qENpdczxTw', 'H3skvIYrTm9t1V8Rxhc767sy5a1Qw8BB')
          // 调用通用票据识别
          let options = {};
          options["recognize_granularity"] = "big"
          options["probability"] = "true"
          options["accuracy"] = "normal"
          options["detect_direction"] = "true"
          let templateId = 'c6f61fd309c8da2d6a41fa0ffb9cdc02'
          client.custom(image, templateId).then((result) => {
            this.fileMsg = ''
            let rs = result.data.ret

            console.log(rs)

            this.rows.push({
              license: this.findObj(rs, '车牌号'),
              billingDate: this.findObj(rs, '开票日期'),
              travelDate1: this.findObj(rs, '通行日期起'),
              travelDate2: this.findObj(rs, '通行日期止'),
              invoiceCode: this.findObj(rs, '发票代码'),
              invoiceNumber: this.findObj(rs, '发票号码'),
              buyName: this.findObj(rs, '购方名称'),
              saleName: this.findObj(rs, '销方名称'),
              notTax: this.findObj(rs, '未税金额'),
              income: this.findObj(rs, '进项税额'),
              total: this.findObj(rs, '价税合计'),
              taxRate: this.findObj(rs, '税率')
            })


          }).catch(function (err) {
            // 如果发生网络错误
            console.log(err)
          })


        }
      },
      findInclude (rs, q) {
        let key = q || '发票号码'
        for (let i = 0, l = rs.length; i < l; i++) {
          let words = rs[i].words
          if (words.indexOf(key) > -1 || key.indexOf(words) > -1) {
            console.log(words)
            return words.split(':')[1]
          }
        }
      },
      findNearby (rs, q) {
        let key = q || '发票号码'
        for (let i = 0, l = rs.length; i < l; i++) {
          let words = rs[i].words
          if (words.indexOf(key) > -1 || key.indexOf(words) > -1) {
            console.log(words)
            return words.split(':')[1]
          }
        }
      },
      findObj (rs, key) {
        for (let i = 0, l = rs.length; i < l; i++) {
          let obj = rs[i]
          if (obj['word_name'] === key) {
            return obj.word || '--'
          }
        }
      }

    }
  }
</script>

