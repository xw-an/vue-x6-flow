<template>
  <div :class="visible?'full-screen':''" >
    <graph-config-container :graph="this.graph" @full="handleFull"></graph-config-container>
    <div id="container">
      <div id="stencil"></div>
      <div id="graph-container" ref="graph"></div>
      <div v-show="configVisibe" id="config-container">
        <node-config-container v-show="isNode" :node="curNode" @updateData="handleNode"></node-config-container>
        <edge-config-container v-show="!isNode" :edge="curEdge" @updateData="handleEdge"></edge-config-container>
        <span class="iconfont collpase-icon" @click="handleCollpaseConfig">&#xe68a;</span>
      </div>
      <span v-show="!configVisibe" class="iconfont open-icon" @click="handleOpenConfig">&#xe689;</span>
    </div>
  </div>
</template>

<script>
import { Graph, Shape, Addon } from '@antv/x6'
import { Sketch } from 'vue-color'
import '@antv/x6-vue-shape'
import NodeConfigContainer from './components/NodeConfigContainer'
import EdgeConfigContainer from './components/EdgeConfigContainer'
import GraphConfigContainer from './components/GraphConfigContainer'
export default {
  name: 'CreateFlow',
  components: {
    GraphConfigContainer,
    NodeConfigContainer,
    EdgeConfigContainer,
    'sketch-picker': Sketch
  },
  data () {
    return {
      visible: true,
      graph: {},
      stencil: {},
      ports: {},
      curNode: {},
      curEdge: {},
      configVisibe: true,
      isNode: true
    }
  },
  methods: {
    // 是否全屏
    handleFull (value) {
      this.visible = value
    },
    // 初始化画布
    initGraph () {
      // 初始化画布
      this.graph = new Graph({
        container: document.getElementById('graph-container'),
        grid: true,
        mousewheel: {
          enabled: true,
          zoomAtMousePosition: true,
          modifiers: 'ctrl',
          minScale: 0.5,
          maxScale: 3
        },
        connecting: {
          router: {
            name: 'manhattan',
            args: {
              padding: 1
            }
          },
          connector: {
            name: 'rounded',
            args: {
              radius: 8
            }
          },
          anchor: 'center',
          connectionPoint: 'anchor',
          allowBlank: false,
          snap: {
            radius: 20
          },
          createEdge () {
            return new Shape.Edge({
              attrs: {
                line: {
                  stroke: '#A2B1C3',
                  strokeWidth: 2,
                  targetMarker: {
                    name: 'block',
                    width: 12,
                    height: 8
                  }
                }
              },
              zIndex: 0
            })
          },
          validateConnection ({ targetMagnet }) {
            return !!targetMagnet
          }
        },
        highlighting: {
          magnetAdsorbed: {
            name: 'stroke',
            args: {
              attrs: {
                fill: '#5F95FF',
                stroke: '#5F95FF'
              }
            }
          }
        },
        resizing: true,
        rotating: true,
        selecting: {
          enabled: true,
          rubberband: true,
          showNodeSelectionBox: true
        },
        snapline: true,
        keyboard: true,
        clipboard: true,
        history: true
      })
    },
    // 画布绑定监听事件
    graphOnEvent () {
      // 控制连接桩显示/隐藏
      const showPorts = (ports, show) => {
        for (let i = 0, len = ports.length; i < len; i = i + 1) {
          ports[i].style.visibility = show ? 'visible' : 'hidden'
        }
      }
      this.graph.on('node:mouseenter', () => {
        const container = document.getElementById('graph-container')
        const ports = container.querySelectorAll('.x6-port-body')
        showPorts(ports, true)
      })
      this.graph.on('node:mouseleave', () => {
        const container = document.getElementById('graph-container')
        const ports = container.querySelectorAll('.x6-port-body')
        showPorts(ports, false)
      })
      // 监听点击画布的节点
      this.graph.on('node:click', ({ e, x, y, node, view }) => {
        this.curNode = node
        this.isNode = true
      })
      // 监听画布添加节点动作
      this.graph.on('node:added', ({ node, index, options }) => {
        this.curNode = node
        this.isNode = true
        // todo 监听到画布添加了node之后，调后端接口创建一个接口
        // console.log('node:added')
        // console.log(node)
        // console.log(node.attrs.text.fontSize)
        // node.setLabel('xwtest') // 修改label的值
        // console.log('监听到拖入一个控件id：' + node.id)
        // console.log(this.graph.getNodes())
      })
      // 监听画布移除节点动作
      this.graph.on('node:removed', ({ node, index, options }) => {
        this.curNode = node
        // console.log('node:removed')
        // console.log(node)
      })
      // 监听节点之间连接动作
      this.graph.on('edge:added', ({ edge, index, options }) => {
        this.isNode = false
        this.curEdge = edge
        // todo 监听到连接线动作之后，调后端接口绑定关系
        // console.log('edge:added')
        // console.log(edge)
      })
      // 监听点击节点之间连接动作
      this.graph.on('edge:click', ({ e, x, y, edge, view }) => {
        this.isNode = false
        this.curEdge = edge
        // console.log('edge:click')
      })
      // 监听节点之间移除连接动作
      this.graph.on('edge:removed', ({ edge, index, options }) => {
        // todo 监听到连接线动作之后，调后端接口绑定关系
        // console.log('edge:removed')
        // console.log(edge)
      })
    },
    // 绑定画布快捷键
    graphBindKey () {
      this.graph.bindKey(['meta+c', 'ctrl+c'], () => {
        const cells = this.graph.getSelectedCells()
        if (cells.length) {
          this.graph.copy(cells)
        }
        return false
      })
      this.graph.bindKey(['meta+x', 'ctrl+x'], () => {
        const cells = this.graph.getSelectedCells()
        if (cells.length) {
          this.graph.cut(cells)
        }
        return false
      })
      this.graph.bindKey(['meta+v', 'ctrl+v'], () => {
        if (!this.graph.isClipboardEmpty()) {
          const cells = this.graph.paste({ offset: 32 })
          this.graph.cleanSelection()
          this.graph.select(cells)
        }
        return false
      })
      // undo redo
      this.graph.bindKey(['meta+z', 'ctrl+z'], () => {
        if (this.graph.history.canUndo()) {
          this.graph.history.undo()
        }
        return false
      })
      this.graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
        if (this.graph.history.canRedo()) {
          this.graph.history.redo()
        }
        return false
      })
      // select all
      this.graph.bindKey(['meta+a', 'ctrl+a'], () => {
        const nodes = this.graph.getNodes()
        if (nodes) {
          this.graph.select(nodes)
        }
      })
      // delete
      this.graph.bindKey('backspace', () => {
        const cells = this.graph.getSelectedCells()
        if (cells.length) {
          this.graph.removeCells(cells)
        }
      })
      // zoom
      this.graph.bindKey(['ctrl+1', 'meta+1'], () => {
        const zoom = this.graph.zoom()
        if (zoom < 1.5) {
          this.graph.zoom(0.1)
        }
      })
      this.graph.bindKey(['ctrl+2', 'meta+2'], () => {
        const zoom = this.graph.zoom()
        if (zoom > 0.5) {
          this.graph.zoom(-0.1)
        }
      })
    },
    // 初始化左侧流程控件面板
    initStencil () {
      this.stencil = new Addon.Stencil({
        title: '流程图',
        target: this.graph,
        stencilGraphWidth: 250,
        stencilGraphHeight: 320,
        collapsable: true,
        notFoundText: '暂未匹配到结果',
        search: (cell, keyword, groupName, stencil) => {
          if (keyword) {
            return cell.label.includes(keyword)
          }
          return true
        },
        groups: [
          {
            title: '基础节点',
            name: 'group1'
          },
          {
            title: '图片节点',
            name: 'group2',
            graphHeight: 250,
            layoutOptions: {
              rowHeight: 70
            }
          }
        ],
        layoutOptions: {
          columns: 2,
          columnWidth: 110,
          rowHeight: 60
        }
      })
      document.getElementById('stencil').appendChild(this.stencil.container)
    },
    // 初始化链接桩
    initPorts () {
      this.ports = {
        groups: {
          top: {
            position: 'top',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden'
                }
              }
            }
          },
          right: {
            position: 'right',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden'
                }
              }
            }
          },
          bottom: {
            position: 'bottom',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden'
                }
              }
            }
          },
          left: {
            position: 'left',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden'
                }
              }
            }
          }
        },
        items: [
          {
            group: 'top'
          },
          {
            group: 'right'
          },
          {
            group: 'bottom'
          },
          {
            group: 'left'
          }
        ]
      }
    },
    // 渲染所有左侧控件图形
    loadStencil () {
      Graph.registerNode(
        'custom-rect',
        {
          inherit: 'rect',
          width: 80,
          height: 36,
          attrs: {
            body: {
              strokeWidth: 1,
              stroke: '#5F95FF',
              fill: '#EFF4FF'
            },
            text: {
              fontSize: 12,
              fill: '#262626'
            }
          },
          ports: { ...this.ports }
        },
        true
      )

      Graph.registerNode(
        'custom-polygon',
        {
          inherit: 'polygon',
          width: 80,
          height: 38,
          attrs: {
            body: {
              strokeWidth: 1,
              stroke: '#5F95FF',
              fill: '#EFF4FF'
            },
            text: {
              fontSize: 12,
              fill: '#262626'
            }
          },
          ports: {...this.ports}
        },
        true
      )

      Graph.registerNode(
        'custom-circle',
        {
          inherit: 'circle',
          width: 48,
          height: 48,
          attrs: {
            body: {
              strokeWidth: 1,
              stroke: '#5F95FF',
              fill: '#EFF4FF'
            },
            text: {
              fontSize: 12,
              fill: '#262626'
            }
          },
          ports: { ...this.ports }
        },
        true
      )
      Graph.registerNode(
        'custom-cylinder',
        {
          inherit: 'cylinder',
          width: 62,
          height: 48,
          attrs: {
            body: {
              strokeWidth: 1,
              stroke: '#5F95FF',
              fill: '#EFF4FF'
            },
            text: {
              fontSize: 12,
              fill: '#262626',
              refY: 32
            },
            top: {
              strokeWidth: 1,
              stroke: '#5F95FF',
              fill: '#EFF4FF'
            }
          },
          ports: { ...this.ports }
        },
        true
      )

      Graph.registerNode(
        'custom-text',
        {
          inherit: 'text-block',
          width: 60,
          height: 36,
          attrs: {
            body: {
              // strokeWidth: 0,
              rx: 4,
              ry: 4,
              fill: '#fff',
              stroke: '#fff'
            },
            text: {
              fontSize: 12,
              fill: '#000'
            }
          },
          ports: { ...this.ports }
        },
        true
      )

      Graph.registerNode(
        'custom-path',
        {
          inherit: 'path',
          width: 60,
          height: 36,
          attrs: {
            body: {
              strokeWidth: 1,
              stroke: '#5F95FF',
              fill: '#EFF4FF'
            },
            text: {
              fontSize: 12,
              fill: '#262626'
            }
          },
          ports: { ...this.ports }
        },
        true
      )
      Graph.registerNode(
        'custom-image',
        {
          inherit: 'rect',
          width: 52,
          height: 52,
          markup: [
            {
              tagName: 'rect',
              selector: 'body'
            },
            {
              tagName: 'image'
            },
            {
              tagName: 'text',
              selector: 'label'
            }
          ],
          attrs: {
            body: {
              strokeWidth: 1,
              stroke: '#00A4FF',
              fill: '#00A4FF'
            },
            image: {
              width: 26,
              height: 26,
              refX: 13,
              refY: 16
            },
            label: {
              refX: 3,
              refY: 2,
              textAnchor: 'left',
              textVerticalAnchor: 'top',
              fontSize: 12,
              fill: '#fff'
            }
          },
          ports: { ...this.ports }
        },
        true
      )

      const r1 = this.graph.createNode({
        shape: 'custom-rect',
        label: '开始',
        attrs: {
          body: {
            rx: 18,
            ry: 26
          }
        }
      })
      const r2 = this.graph.createNode({
        shape: 'custom-rect',
        label: '过程'
      })
      const r3 = this.graph.createNode({
        shape: 'custom-rect',
        attrs: {
          body: {
            rx: 6,
            ry: 6
          }
        },
        label: '可选过程'
      })
      const r4 = this.graph.createNode({
        shape: 'custom-polygon',
        attrs: {
          body: {
            refPoints: '0,10 10,0 20,10 10,20'
          }
        },
        label: '决策'
      })
      const r5 = this.graph.createNode({
        shape: 'custom-polygon',
        attrs: {
          body: {
            refPoints: '10,0 40,0 30,20 0,20'
          }
        },
        label: '数据'
      })
      const r6 = this.graph.createNode({
        shape: 'custom-circle',
        label: '连接'
      })
      const r7 = this.graph.createNode({
        shape: 'custom-cylinder',
        label: '数据库'
      })
      const r8 = this.graph.createNode({
        shape: 'custom-path',
        label: '文档',
        attrs: {
          body: {
            refD: 'M 0 0 0 4 C 10 8 15 2 25 5 L 25 0 Z'
          }
        }
      })
      const r9 = this.graph.createNode({
        shape: 'custom-path',
        label: '手动输入',
        attrs: {
          body: {
            refD: 'M 0 7 0 15 15 15 15 5 Z'
          }
        }
      })
      const r10 = this.graph.createNode({
        shape: 'custom-text',
        text: '文本'
      })
      this.stencil.load([r1, r2, r3, r4, r5, r6, r7, r8, r9, r10], 'group1')
      const imageShapes = [
        {
          label: 'Client',
          image:
            'https://gw.alipayobjects.com/zos/bmw-prod/687b6cb9-4b97-42a6-96d0-34b3099133ac.svg'
        },
        {
          label: 'Http',
          image:
            'https://gw.alipayobjects.com/zos/bmw-prod/dc1ced06-417d-466f-927b-b4a4d3265791.svg'
        },
        {
          label: 'Api',
          image:
            'https://gw.alipayobjects.com/zos/bmw-prod/c55d7ae1-8d20-4585-bd8f-ca23653a4489.svg'
        },
        {
          label: 'Sql',
          image:
            'https://gw.alipayobjects.com/zos/bmw-prod/6eb71764-18ed-4149-b868-53ad1542c405.svg'
        },
        {
          label: 'Clound',
          image:
            'https://gw.alipayobjects.com/zos/bmw-prod/c36fe7cb-dc24-4854-aeb5-88d8dc36d52e.svg'
        },
        {
          label: 'Mq',
          image:
            'https://gw.alipayobjects.com/zos/bmw-prod/2010ac9f-40e7-49d4-8c4a-4fcf2f83033b.svg'
        }
      ]
      const imageNodes = imageShapes.map((item) =>
        this.graph.createNode({
          shape: 'custom-image',
          label: item.label,
          attrs: {
            image: {
              'xlink:href': item.image
            }
          }
        })
      )
      this.stencil.load(imageNodes, 'group2')
    },
    // 更新node的数据
    handleNode (data) {
      this.curNode = data
    },
    // 更新edge的数据
    handleEdge (data) {
      this.curEdge = data
    },
    // 收缩配置面板
    handleCollpaseConfig () {
      this.configVisibe = false
      this.$refs.graph.style.width = 'calc(100% - 250px)'
    },
    // 展开配置面板
    handleOpenConfig () {
      this.configVisibe = true
      this.$refs.graph.style.width = 'calc(100% - 500px)'
    }
  },
  mounted () {
    // 监听键盘按键事件
    let self = this
    this.$nextTick(function () {
      document.addEventListener('keyup', function (e) {
        // 此处填写你的业务逻辑即可
        if (e.keyCode === 27) {
          self.visible = false
        }
      })
    })
    // 初始化画布
    this.initGraph()
    // 绑定画布快捷键
    this.graphBindKey()
    // 画布绑定监听事件
    this.graphOnEvent()
    // 初始化流程控件面板
    this.initStencil()
    // 初始化连接桩
    this.initPorts()
    // 渲染所有左侧控件图形
    this.loadStencil()
  }
}
</script>

<style scoped>
.full-screen {
  position: fixed;
  overflow: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #fff;
  border: 0;
  border-radius: 0px;
  padding:0;
  margin:0;
  height: 100%;
}
#container {
  display: flex;
  border: 1px solid #dfe3e8;
  height: 100%;
  width: 100%;
}
#stencil {
  width: 250px;
  height: 100%;
  position: relative;
  border-right: 1px solid #dfe3e8;
}
#graph-container {
  width: calc(100% - 500px);
  /*width: 100%;*/
  height: 100%;
  /*background-color: #fffbe6*/
}
#config-container {
  position: relative;
  width: 250px;
  height: 100%;
  border-left: 1px solid #dfe3e8;
}
.collpase-icon {
  position: absolute;
  top: 25px;
  left: -8px;
  color: #aaa;
  background-color: #fff;
  cursor: pointer;
}
.open-icon{
  position: relative;
  top: 10px;
  right: 10px;
  color: #aaa;
  background-color: #fff;
  cursor: pointer;
}

.drawer-iconfont{
  position: absolute;
  top: 100px;
  left: 100px;
}
.color-container {
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

/deep/ .x6-widget-stencil  {
  background-color: #fff;
}
/deep/ .x6-widget-stencil-title {
  background-color: rgba(0,0,0,.03)
}
/deep/ .x6-widget-stencil-group-title {
  background-color: rgba(0,0,0,.03)
}
.x6-widget-transform {
  margin: -1px 0 0 -1px;
  padding: 0px;
  border: 1px solid #239edd;
}
.x6-widget-transform > div {
  border: 1px solid #239edd;
}
.x6-widget-transform > div:hover {
  background-color: #3dafe4;
}
.x6-widget-transform-active-handle {
  background-color: #3dafe4;
}
.x6-widget-transform-resize {
  border-radius: 0;
}
.x6-widget-selection-inner {
  border: 1px solid #239edd;
}
.x6-widget-selection-box {
  opacity: 0;
}
</style>
