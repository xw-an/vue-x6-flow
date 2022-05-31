<template>
  <a-tabs type="card" defaultActiveKey="1" size="small">
    <a-tab-pane key="1" tab="样式">
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" style="margin-left: 5px">
        <a-form-item label="标题">
          <a-input :value="this.curLabel" @change="handleLabel"/>
        </a-form-item>
        <a-form-item label="字号" >
          <a-input-number :value="this.curFontSize" @change="handleFontsize"/>
        </a-form-item>
        <a-form-item label="文字">
          <a-popover :visible="this.textColorVisible" placement="leftTop" trigger="click" title="修改边框色">
            <template slot="content">
              <a-row style="margin-bottom: 10px">
                <sketch-picker
                  :value="this.colors"
                  @input="updateTextFill"
                  :preset-colors="this.presetColors"
                />
              </a-row>
              <a-row>
                <a-col :span="17">
                  <a-button @click="()=>{this.textColorVisible=false}">取消</a-button>
                </a-col>
                <a-col :span="7">
                  <a-button type="primary" @click="handleTextFill">确定</a-button>
                </a-col>
              </a-row>
            </template>
            <div class="color-container">
              <div class="edit-color" :style="{backgroundColor: this.curNode.attrs?this.curNode.attrs.text.fill:''}" @click="()=>{this.textColorVisible=true}"></div>
            </div>
          </a-popover>
        </a-form-item>
        <a-form-item label="填充">
          <a-popover :visible="this.fillColorVisible" placement="leftTop" trigger="click" title="修改填充色">
            <template slot="content">
              <a-row style="margin-bottom: 10px">
                <sketch-picker
                  :value="this.colors"
                  @input="updateBodyFill"
                  :preset-colors="this.presetColors"
                />
              </a-row>
              <a-row>
                <a-col :span="17">
                  <a-button @click="()=>{this.fillColorVisible=false}">取消</a-button>
                </a-col>
                <a-col :span="7">
                  <a-button type="primary" @click="handleBodyFill">确定</a-button>
                </a-col>
              </a-row>
            </template>
            <div class="color-container">
              <div class="edit-color" :style="{backgroundColor: this.curNode.attrs?this.curNode.attrs.body.fill:''}" @click="()=>{this.fillColorVisible=true}"></div>
            </div>
          </a-popover>
        </a-form-item>
        <a-form-item label="边框">
          <a-popover :visible="this.strokeColorVisible" placement="leftTop" trigger="click" title="修改边框色">
            <template slot="content">
              <a-row style="margin-bottom: 10px">
                <sketch-picker
                  :value="this.colors"
                  @input="updateBodyStroke"
                  :preset-colors="this.presetColors"
                />
              </a-row>
              <a-row>
                <a-col :span="17">
                  <a-button @click="()=>{this.strokeColorVisible=false}">取消</a-button>
                </a-col>
                <a-col :span="7">
                  <a-button type="primary" @click="handleBodyStroke">确定</a-button>
                </a-col>
              </a-row>
            </template>
            <div class="color-container">
              <div class="edit-color" :style="{backgroundColor: this.curNode.attrs?this.curNode.attrs.body.stroke:''}" @click="()=>{this.strokeColorVisible=true}"></div>
            </div>
          </a-popover>
        </a-form-item>
      </a-form>
    </a-tab-pane>
<!--    <a-tab-pane key="2" tab="参数">-->
<!--      Content of Tab Pane 2-->
<!--    </a-tab-pane>-->
  </a-tabs>
</template>

<script>
import {Node} from '@antv/x6'
import { Sketch } from 'vue-color'
export default {
  name: 'NodeConfigContainer',
  props: {
    node: Node
  },
  components: {
    'sketch-picker': Sketch
  },
  data () {
    return {
      colors: { r: 255, g: 0, b: 0 },
      presetColors: ['#f00', '#00ff00', '#00ff0055', 'rgb(201, 76, 76)', 'rgba(0,0,255,1)', 'hsl(89, 43%, 51%)', 'hsla(89, 43%, 51%, 0.6)'],
      fillColorVisible: false,
      strokeColorVisible: false,
      textColorVisible: false,
      curBodyFill: '',
      curBodyStroke: '',
      curTextFill: '',
      curNode: Node,
      form: this.$form.createForm(this, {name: 'configPanel'}),
      curLabel: '',
      curFontSize: ''
    }
  },
  methods: {
    // 修改node的标题
    handleLabel (e) {
      if (this.curNode.attrs.label) {
        this.curNode.setAttrs({
          label: {
            text: e.target.value
          }
        })
      } else {
        this.curNode.setLabel(e.target.value)
      }
      this.curLabel = e.target.value
    },
    // 修改node的字体大小
    handleFontsize (e) {
      this.curNode.setAttrs({
        text: {
          fontSize: Number(e)
        }
      })
      this.curFontSize = e
    },
    // 更新选色器颜色
    updateBodyFill (v) {
      this.curBodyFill = v.hex
    },
    // 更新body的填充色
    handleBodyFill () {
      this.curNode.setAttrs({
        body: {
          fill: this.curBodyFill
        },
        top: {
          fill: this.curBodyFill
        }
      })
      this.fillColorVisible = false
    },
    // 更新选色器颜色
    updateBodyStroke (v) {
      this.curBodyStroke = v.hex
    },
    // 更新body的边框色
    handleBodyStroke  () {
      this.curNode.setAttrs({
        body: {
          stroke: this.curBodyStroke
        },
        top: {
          stroke: this.curBodyStroke
        }
      })
      this.strokeColorVisible = false
    },
    // 更新选色器颜色
    updateTextFill (v) {
      this.curTextFill = v.hex
    },
    // 更新body的边框色
    handleTextFill () {
      this.curNode.setAttrs({
        text: {
          fill: this.curTextFill
        }}
      )
      this.textColorVisible = false
    }
  },
  watch: {
    node (newValue) {
      this.curNode = newValue
      this.curLabel = this.curNode.label ? this.curNode.label : this.curNode.attrs.label.text
      this.curFontSize = this.curNode.attrs ? this.curNode.attrs.text.fontSize : ''
    },
    curNode (newValue) {
      this.$emit('updateData', newValue)
    }
  }
}
</script>

<style scoped>
.color-container {
  margin-top: 8px;
  width: 24px;
  height: 24px;
  padding: 4px;
  border: 1px solid #dfe3e8;
  border-radius: 2px;
}
.edit-color {
  cursor: pointer;
  height: 100%;
}
</style>
