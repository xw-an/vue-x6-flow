<template>
  <a-tabs type="card" defaultActiveKey="1" size="small">
    <a-tab-pane key="1" tab="样式">
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" style="margin-left: 5px">
        <a-form-item label="线形" :wrapper-col="{ span: 10 }">
          <a-select :default-value="1" @change="handleLine">
            <a-select-option :value="1">实线</a-select-option>
            <a-select-option :value="2">虚线</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="箭头" :wrapper-col="{ span: 10 }">
          <a-select :default-value="1" @change="handleArrow">
            <a-select-option :value="1">正向</a-select-option>
            <a-select-option :value="2">逆向</a-select-option>
            <a-select-option :value="3">双向</a-select-option>
          </a-select>
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
              <div class="edit-color" :style="{backgroundColor: this.curEdge.attrs?this.curEdge.attrs.line.stroke:''}" @click="()=>{this.strokeColorVisible=true}"></div>
            </div>
          </a-popover>
        </a-form-item>
        <a-form-item label="文本">
          <a-input :value="this.curLabel" @change="handleLabel"></a-input>
        </a-form-item>
      </a-form>
    </a-tab-pane>
<!--    <a-tab-pane key="2" tab="参数">-->
<!--      Content of Tab Pane 2-->
<!--    </a-tab-pane>-->
  </a-tabs>
</template>

<script>
import {Edge} from '@antv/x6'
import { Sketch } from 'vue-color'
export default {
  name: 'EdgeConfigContainer',
  props: {
    edge: Edge
  },
  components: {
    'sketch-picker': Sketch
  },
  data () {
    return {
      colors: { r: 255, g: 0, b: 0 },
      presetColors: ['#f00', '#00ff00', '#00ff0055', 'rgb(201, 76, 76)', 'rgba(0,0,255,1)', 'hsl(89, 43%, 51%)', 'hsla(89, 43%, 51%, 0.6)'],
      strokeColorVisible: false,
      curBodyStroke: '',
      curEdge: {},
      form: this.$form.createForm(this, {name: 'configPanel'}),
      curLabel: ''
    }
  },
  methods: {
    // 更新选色器颜色
    updateBodyStroke (v) {
      this.curBodyStroke = v.hex
    },
    // 更新body的边框色
    handleBodyStroke  () {
      this.curEdge.setAttrs({
        line: {
          stroke: this.curBodyStroke
        }}
      )
      this.strokeColorVisible = false
    },
    // 更新线的虚实
    handleLine (e) {
      if (e === 2) {
        this.curEdge.setAttrs({
          line: {
            strokeDasharray: 5.5
          }}
        )
      } else {
        this.curEdge.removeAttrByPath('line/strokeDasharray')
      }
    },
    // 更新箭头
    handleArrow (e) {
      switch (e) {
        // 正向箭头
        case 1:
          this.curEdge.setAttrs({
            line: {
              targetMarker: {
                name: 'block',
                width: 12,
                height: 8
              }
            }
          })
          this.curEdge.removeAttrByPath('line/sourceMarker')
          break
        // 逆向箭头
        case 2:
          this.curEdge.setAttrs({
            line: {
              sourceMarker: {
                name: 'block',
                width: 12,
                height: 8
              }
            }
          })
          this.curEdge.removeAttrByPath('line/targetMarker')
          break
        // 双向箭头
        case 3:
          this.curEdge.setAttrs({
            line: {
              targetMarker: {
                name: 'block',
                width: 12,
                height: 8
              },
              sourceMarker: {
                name: 'block',
                width: 12,
                height: 8
              }
            }
          })
          break
      }
    },
    // 在箭头中插入文本
    handleLabel (e) {
      this.curEdge.removeLabelAt(0)
      this.curEdge.appendLabel({
        attrs: {
          text: {
            text: e.target.value
          }
        }
      })
      this.curLabel = e.target.value
    }
  },
  watch: {
    edge (newValue) {
      this.curEdge = newValue
      this.curLabel = this.curEdge.labels && this.curEdge.labels.length ? this.curEdge.labels[0].attrs.text.text : ''
    },
    curEdge (newValue) {
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
